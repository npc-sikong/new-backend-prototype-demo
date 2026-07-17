import { useEffect, useState } from 'react'
import {
  ApartmentOutlined,
  AuditOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
  LockOutlined,
  PlusOutlined,
  SendOutlined,
  StopOutlined,
  SwapOutlined,
  TeamOutlined,
  UserAddOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { useTeamAgent } from './context'
import { TeamGradeSummary } from './team-grade-summary'
import { getTeamInspectConfig, teamGradeProgress, teamMemberCount, teamOverviewCounts, teamSecondaryRows, teamSingleRows } from './team-management-helpers'
import {
  Alert,
  Button,
  DataTable,
  DescriptionGrid,
  Field,
  FilterBar,
  FormulaPanel,
  FormGrid,
  Input,
  MetricCard,
  MetricGrid,
  Modal,
  Money,
  Panel,
  Percent,
  SectionHeader,
  Select,
  StatusTag,
  Tabs,
} from './ui'

function resultMessage(result, onToast, onSuccess) {
  onToast(result.message, result.ok ? 'success' : 'error')
  if (result.ok) onSuccess?.()
}

function Link({ children, onClick, disabled }) {
  return <button className="ta-table-link" disabled={disabled} onClick={onClick}>{children}</button>
}

const SITE_NAME = '旺财体育'

function getTeamType(team) {
  return team?.teamType || '推广团队'
}

function readSiteCommissionConfig(config = {}) {
  return {
    team: config.teamPlan || config.team || '旺财团队月结方案',
    single: config.singlePlan || config.single || '独立单线月结方案',
    reward: config.rewardPlan || config.reward || '推荐奖励10%方案',
    cycle: config.effectiveCycle || config.cycle || '2026-08',
  }
}

function SiteTeamsPage({ onToast }) {
  const { data, createTeam, addSecondary, setTeamStatus, changeMain, updateTeamPreferences } = useTeamAgent()
  const [tab, setTab] = useState('teams')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [teamForm, setTeamForm] = useState({ name: '', mainAgent: '', site: SITE_NAME, plan: '旺财团队月结方案', startCycle: '2026-08', teamType: '推广团队' })
  const [secondaryForm, setSecondaryForm] = useState({ agent: '', scope: '', startCycle: '2026-08' })
  const [mainForm, setMainForm] = useState({ nextMain: '', effectiveCycle: '2026-08' })
  const [preferenceForm, setPreferenceForm] = useState({ teamType: '推广团队' })
  const team = data.teams.find((item) => item.id === selected?.id) || selected
  const siteTeams = data.teams.filter((item) => !item.site || item.site === SITE_NAME)
  const siteTeamIds = new Set(siteTeams.map((item) => item.id))
  const teamOperations = (data.teamOperations || []).filter((item) => item.site ? item.site === SITE_NAME : !item.teamId || siteTeamIds.has(item.teamId))
  const lineInspect = typeof modal === 'string' && modal.startsWith('lineMembers:')
  const inspectType = lineInspect ? { type: 'lineMembers', lineId: modal.split(':')[1], metric: modal.split(':')[2] } : modal === 'secondaryInspect' ? 'secondary' : modal === 'singleInspect' ? 'single' : modal
  const inspectConfig = getTeamInspectConfig(inspectType, team, data)
  const overviewCounts = team ? teamOverviewCounts(team, data) : null
  const gradeProgress = team ? teamGradeProgress(team, data) : null
  const close = () => setModal(null)
  const openDetails = (row) => {
    setSelected(row)
    setPreferenceForm({ teamType: getTeamType(row) })
    setModal('detail')
  }
  const savePreferences = () => {
    if (!team) return
    const result = updateTeamPreferences
      ? updateTeamPreferences(team.id, preferenceForm)
      : { ok: false, message: '团队偏好共享方法尚未接入' }
    resultMessage(result, onToast, close)
  }
  const columns = [
    { key: 'code', label: '代理部编号' }, { key: 'name', label: '代理部名称', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'teamType', label: '团队类型', render: (_, row) => getTeamType(row) }, { key: 'mainAgent', label: '团队负责人' },
    { key: 'teamPeople', label: '团队人数', render: (_, row) => <Link onClick={() => { setSelected(row); setModal('teamAgents') }}>{row.lines.length}</Link> },
    { key: 'members', label: '会员人数', render: (_, row) => <Link onClick={() => { setSelected(row); setModal('members') }}>{teamMemberCount(row, data)}</Link> },
    { key: 'lineBreakdown', label: '团队副线/单线', render: (_, row) => <div className="team-line-breakdown"><Link onClick={() => { setSelected(row); setModal('secondaryInspect') }}>{`团队副线 ${teamSecondaryRows(row, data).length}`}</Link><Link onClick={() => { setSelected(row); setModal('singleInspect') }}>{`单线 ${teamSingleRows(row, data).length}`}</Link></div> },
    { key: 'plan', label: '团队方案' }, { key: 'metrics', label: '当前等级', render: (value) => <StatusTag tone="blue">{value.grade}</StatusTag> }, { key: 'startCycle', label: '生效周期' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'createdAt', label: '创建时间', render: (value) => value || '—' },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><Link onClick={() => openDetails(row)}>详情/编辑</Link><Link onClick={() => { setSelected(row); setModal('secondary') }}>开副线</Link><Link onClick={() => { setSelected(row); setModal('main') }}>换主线</Link><Link onClick={() => resultMessage(setTeamStatus(row.id, row.status === '冻结' ? '生效中' : '冻结'), onToast)}>{row.status === '冻结' ? '解冻' : '冻结'}</Link><Link onClick={() => resultMessage(setTeamStatus(row.id, '已解散'), onToast)}>解散</Link></div> },
  ]
  const internalColumns = [
    { key: 'id', label: '结算单号' }, { key: 'teamName', label: '代理部' }, { key: 'mainAgent', label: '付款主线' }, { key: 'secondaryAgent', label: '收款副线' }, { key: 'cycle', label: '周期' }, { key: 'amount', label: '金额', render: (value) => <Money value={value} /> },
    { key: 'source', label: '资金来源' }, { key: 'basis', label: '结算依据' }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'createdAt', label: '时间' }, { key: 'action', label: '操作', render: (_, row) => <Link onClick={() => onToast(row.state === '处理中' ? `${row.id} 已冻结，等待补充凭证` : `${row.id} 风险信息已查看`)}>{row.state === '处理中' ? '冻结' : '查看'}</Link> },
  ]
  const operationColumns = [
    { key: 'id', label: '记录编号', render: (value, row) => value || row.operationId || row.code || '—' },
    { key: 'teamName', label: '代理部', render: (value, row) => value || row.team || data.teams.find((item) => item.id === row.teamId)?.name || '—' },
    { key: 'teamType', label: '团队类型', render: (value) => value || '—' },
    { key: 'mainAccount', label: '团队负责人', render: (value, row) => [row.mainId, value].filter((item) => item && item !== '—').join(' / ') || '—' },
    { key: 'secondaryAccounts', label: '副线账号', render: (value) => value || '—' },
    { key: 'operation', label: '操作类型', render: (value, row) => value || row.type || row.action || '—' },
    { key: 'reason', label: '操作原因', render: (value, row) => value || row.detail || row.description || row.content || row.note || '—' },
    { key: 'operator', label: '操作人', render: (value, row) => value || row.createdBy || row.actor || '—' },
    { key: 'createdAt', label: '操作时间', render: (value, row) => value || row.operatedAt || row.updatedAt || '—' },
  ]
  return <>
    <SectionHeader title="团队代理管理" description="按本站范围创建代理部、指定团队负责人，并维护副线（团队内成员身份）与团队生命周期。" actions={<Button icon={<PlusOutlined />} onClick={() => setModal('create')}>创建代理部</Button>} />
    <MetricGrid columns={4}><MetricCard label="代理部" value={siteTeams.length} icon={<ApartmentOutlined />} /><MetricCard label="生效中" value={siteTeams.filter((item) => item.status === '生效中').length} tone="green" icon={<CheckCircleOutlined />} /><MetricCard label="有效副线" value={siteTeams.flatMap((item) => item.lines).filter((line) => line.identity === '副线' && line.status === '生效中').length} tone="blue" icon={<TeamOutlined />} /><MetricCard label="待处理关系" value={data.requests.filter((item) => ['待站点复核', '待补充资料'].includes(item.status)).length} tone="orange" icon={<ClockCircleOutlined />} /></MetricGrid>
    <Tabs items={[{ value: 'teams', label: '代理部列表', count: siteTeams.length }, { value: 'monitor', label: '内部结算监控', count: data.internalSettlements.length }, { value: 'operations', label: '操作记录', count: teamOperations.length }]} active={tab} onChange={setTab} />
    {tab === 'teams' && <><FilterBar onSearch={() => onToast('站点团队列表已查询')} onReset={() => onToast('筛选条件已重置')}><Field label="代理部"><Input placeholder="名称或编号" /></Field><Field label="团队负责人"><Input placeholder="代理账号" /></Field><Field label="状态"><Select value="" placeholder="全部状态" options={['待生效', '生效中', '冻结', '待解散']} /></Field></FilterBar><DataTable paginated minWidth={1880} columns={columns} rows={siteTeams} /></>}
    {tab === 'monitor' && <><Alert title="站点监控边界" tone="warning">站点可查看和冻结内部结算风险记录，但不替主线决定副线结算金额。</Alert><DataTable paginated minWidth={1250} columns={internalColumns} rows={data.internalSettlements} /></>}
    {tab === 'operations' && <DataTable paginated minWidth={1320} columns={operationColumns} rows={teamOperations} rowKey={(row, index) => row.id || row.operationId || `${row.teamId || 'team'}-${row.createdAt || index}`} emptyText="暂无本站团队生命周期记录" />}
    <Alert title="当月结余归属规则">加入团队时，当月结余随代理带入团队；移出团队时，当月结余留在原团队；团队解散时，由站点指定的代理承担当月结余。</Alert>

    <Modal open={modal === 'create'} title="创建代理部" description="站点指定主线、团队方案和未来完整生效周期。" onClose={close} onConfirm={() => resultMessage(createTeam(teamForm), onToast, close)}>
      <FormGrid><Field label="代理部名称" required help="建议使用“发展人拼音+序号部”，仅作命名提示，不强制校验。"><Input value={teamForm.name} onChange={(value) => setTeamForm({ ...teamForm, name: value })} placeholder="例如：zhangsan1部" /></Field><Field label="团队负责人" required><Input value={teamForm.mainAgent} onChange={(value) => setTeamForm({ ...teamForm, mainAgent: value })} placeholder="代理账号" /></Field><Field label="团队类型"><Input value={teamForm.teamType} onChange={(value) => setTeamForm({ ...teamForm, teamType: value })} placeholder="请输入团队类型" /></Field><Field label="团队方案"><Select value={teamForm.plan} onChange={(value) => setTeamForm({ ...teamForm, plan: value })} options={data.plans.filter((plan) => plan.type === '团队佣金方案').map((plan) => plan.name)} /></Field><Field label="生效周期"><Select value={teamForm.startCycle} onChange={(value) => setTeamForm({ ...teamForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
    </Modal>
    <Modal open={modal === 'secondary'} title={`为 ${team?.name || ''} 开设副线`} description="站点直接复核并创建明确 line_id 和业务范围。" onClose={close} onConfirm={() => resultMessage(addSecondary(team.id, { ...secondaryForm, requireReview: false }), onToast, close)}>
      <FormGrid><Field label="副线" required><Input value={secondaryForm.agent} onChange={(value) => setSecondaryForm({ ...secondaryForm, agent: value })} placeholder="代理账号" /></Field><Field label="生效周期"><Select value={secondaryForm.startCycle} onChange={(value) => setSecondaryForm({ ...secondaryForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field><Field label="业务范围" className="ta-field-full"><Input value={secondaryForm.scope} onChange={(value) => setSecondaryForm({ ...secondaryForm, scope: value })} placeholder="代理节点及直属会员" /></Field></FormGrid>
      <Alert title="唯一性检查">同一代理同一站点、币种和周期只能进入一个团队或独立单线。</Alert>
    </Modal>
    <Modal open={modal === 'main'} title={`更换 ${team?.name || ''} 团队负责人`} description="新主线从未来周期接管，历史账单仍归原主线。" onClose={close} onConfirm={() => resultMessage(changeMain(team.id, mainForm.nextMain, mainForm.effectiveCycle), onToast, close)}>
      <FormGrid><Field label="当前主线"><Input value={team?.mainAgent || ''} disabled /></Field><Field label="新团队负责人" required><Input value={mainForm.nextMain} onChange={(value) => setMainForm({ ...mainForm, nextMain: value })} /></Field><Field label="生效周期"><Select value={mainForm.effectiveCycle} onChange={(value) => setMainForm({ ...mainForm, effectiveCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
      {team?.processingOccupied > 0 && <Alert tone="error" title="存在处理中资金">处理完成前申请不能批准，但可先保存待补充资料。</Alert>}
    </Modal>
    <Modal open={modal === 'detail'} title={`${team?.name || ''} · 详情与设置`} description="查看本站团队组织、线路业绩和团队类型。" onClose={close} onConfirm={savePreferences} confirmText="保存团队设置" width={1040}>
      {team && <div className="ta-stack"><MetricGrid columns={2}><MetricCard label="团队当前余额" value={<Money value={team.metrics.correctedNet} signed />} helper="当月结余 = 冲正后净输赢" tone="orange" /><MetricCard label="未结算收益" value={<Money value={team.metrics.payable} />} helper={`${team.metrics.grade} / ${(team.metrics.rate * 100).toFixed(0)}% 团队返佣`} tone="green" /></MetricGrid><DescriptionGrid columns={4} items={[{ label: '团队负责人', value: team.mainAgent }, { label: '团队类型', value: getTeamType(team) }, { label: '创建时间', value: team.createdAt || '—' }, { label: '团队方案', value: team.plan }, { label: '生效周期', value: team.startCycle }, { label: '团队状态', value: <StatusTag>{team.status}</StatusTag> }, { label: '团队代理总人数', value: overviewCounts.agentTotal }, { label: '总会员数', value: overviewCounts.memberTotal }, { label: '活跃会员数', value: overviewCounts.activeMembers }, { label: '副线', value: overviewCounts.secondaryTotal }, { label: '独立代理', value: overviewCounts.singleTotal }, { label: '团队返佣等级', value: `${team.metrics.grade} / ${(team.metrics.rate * 100).toFixed(0)}%` }]} /><TeamGradeSummary metrics={team.metrics} progress={gradeProgress} /><FormGrid><Field label="团队类型"><Input value={preferenceForm.teamType} onChange={(value) => setPreferenceForm({ ...preferenceForm, teamType: value })} /></Field></FormGrid><Alert title="当月结余归属规则">加入团队当月结余带入，移出团队留在原团队；解散团队时由站点指定代理承担。</Alert><DataTable minWidth={1180} columns={[{ key: 'identity', label: '身份', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'lineId', label: 'line_id' }, { key: 'agent', label: '代理名称' }, { key: 'activeMembers', label: '活跃会员', render: (value, row) => <Link disabled={!Number(value)} onClick={() => setModal(`lineMembers:${row.lineId}:activeMembers`)}>{value}</Link> }, { key: 'newActive', label: '新增活跃', render: (value, row) => <Link disabled={!Number(value)} onClick={() => setModal(`lineMembers:${row.lineId}:newActive`)}>{value}</Link> }, { key: 'firstDepositCount', label: '新增首存', render: (value) => Number(value || 0) }, { key: 'firstDepositAmount', label: '首存额度', render: (value) => <Money value={value} /> }, { key: 'netWinLoss', label: '净输赢值', render: (value) => <Money value={value} signed /> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }]} rows={team.lines} rowKey="lineId" /></div>}
    </Modal>
    <Modal open={lineInspect || ['teamAgents', 'members', 'secondaryInspect', 'singleInspect'].includes(modal)} title={inspectConfig.title} description={inspectConfig.description} onClose={close} onConfirm={close} confirmText="关闭" showCancel={false} width={820}>
      <DataTable columns={inspectConfig.columns} rows={inspectConfig.rows} rowKey="id" paginated emptyText="暂无相关明细" />
    </Modal>
  </>
}

function SiteSinglesPage({ onToast }) {
  const { data, createSingle, requestChange } = useTeamAgent()
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', owner: '', recommender: '', plan: '独立单线月结方案', startCycle: '2026-08', source: '站点直接创建' })
  const columns = [
    { key: 'code', label: '单线编号' }, { key: 'name', label: '独立单线', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'owner', label: '独立线主' }, { key: 'source', label: '创建来源' }, { key: 'recommender', label: '推荐人' }, { key: 'plan', label: '佣金方案' },
    { key: 'startCycle', label: '生效周期' }, { key: 'metrics', label: '当前等级', render: (value) => <StatusTag tone="blue">{value.grade}</StatusTag> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><Link onClick={() => onToast(`${row.name} 详情已打开`)}>详情</Link><Link onClick={() => resultMessage(requestChange({ type: '独立单线加入团队', applicant: row.owner, currentUnit: row.name, targetUnit: 'apppay01部 / 待分配 line_id' }), onToast)}>加入团队</Link><Link onClick={() => resultMessage(requestChange({ type: '终止独立单线', applicant: row.owner, currentUnit: row.name, targetUnit: '终止', recommender: row.recommender }), onToast)}>终止</Link></div> },
  ]
  return <>
    <SectionHeader title="独立单线管理" description="按本站范围直接创建单人单线，或查看由团队副线切换形成的独立单线。" actions={<Button icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>创建单人单线</Button>} />
    <MetricGrid columns={4}><MetricCard label="单线总数" value={data.singles.length} /><MetricCard label="站点直建" value={data.singles.filter((item) => item.source === '站点直接创建').length} tone="green" /><MetricCard label="副线转入" value={data.singles.filter((item) => item.source === '副线转独立').length} tone="blue" /><MetricCard label="绑定推荐人" value={data.singles.filter((item) => item.recommender !== '—').length} tone="orange" /></MetricGrid>
    <FilterBar onSearch={() => onToast('独立单线列表已查询')} onReset={() => onToast('筛选条件已重置')}><Field label="独立线主"><Input placeholder="代理账号" /></Field><Field label="来源"><Select value="" placeholder="全部来源" options={['站点直接创建', '副线转独立']} /></Field><Field label="状态"><Select value="" placeholder="全部状态" options={['待生效', '生效中', '冻结', '已终止']} /></Field></FilterBar>
    <DataTable paginated minWidth={1250} columns={columns} rows={data.singles} />
    <Modal open={showCreate} title="创建单人单线" description="初始业务范围只包含线主一个代理节点。" onClose={() => setShowCreate(false)} onConfirm={() => resultMessage(createSingle(form), onToast, () => setShowCreate(false))}>
      <FormGrid><Field label="单线名称"><Input value={form.name} onChange={(value) => setForm({ ...form, name: value })} /></Field><Field label="独立线主" required><Input value={form.owner} onChange={(value) => setForm({ ...form, owner: value })} /></Field><Field label="佣金方案"><Select value={form.plan} onChange={(value) => setForm({ ...form, plan: value })} options={data.plans.filter((plan) => plan.type === '独立单线方案').map((plan) => plan.name)} /></Field><Field label="推荐主线"><Input value={form.recommender} onChange={(value) => setForm({ ...form, recommender: value })} placeholder="可不填写" /></Field><Field label="生效周期"><Select value={form.startCycle} onChange={(value) => setForm({ ...form, startCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
    </Modal>
  </>
}

function SiteReviewPage({ onToast }) {
  const { data, reviewRequest } = useTeamAgent()
  const [status, setStatus] = useState('待处理')
  const [selected, setSelected] = useState(null)
  const rows = data.requests.filter((request) => {
    if (status === '全部') return true
    if (status === '待处理') return ['待站点复核', '待补充资料'].includes(request.status)
    return request.status === status
  })
  const columns = [
    { key: 'id', label: '申请编号' }, { key: 'type', label: '申请类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'applicant', label: '申请人' }, { key: 'currentUnit', label: '原结算单元' }, { key: 'targetUnit', label: '目标结算单元' }, { key: 'effectiveCycle', label: '生效周期' },
    { key: 'recommender', label: '推荐人' }, { key: 'conflict', label: '冲突检查', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><Link onClick={() => setSelected(row)}>详情</Link>{['待站点复核', '待补充资料'].includes(row.status) && <><Link onClick={() => resultMessage(reviewRequest(row.id, true), onToast)}>通过</Link><Link onClick={() => resultMessage(reviewRequest(row.id, false), onToast)}>退回</Link></>}</div> },
  ]
  return <>
    <SectionHeader title="模式变更审核" description="审核副线转独立、单线加入团队、换主线和其他未来周期关系变更。" />
    <MetricGrid columns={4}><MetricCard label="待处理申请" value={data.requests.filter((item) => ['待站点复核', '待补充资料'].includes(item.status)).length} tone="orange" icon={<AuditOutlined />} /><MetricCard label="副线转独立" value={data.requests.filter((item) => item.type === '副线转独立单线').length} tone="blue" /><MetricCard label="加入团队" value={data.requests.filter((item) => item.type === '独立单线加入团队').length} /><MetricCard label="存在阻止项" value={data.requests.filter((item) => !item.conflict.startsWith('无')).length} tone="red" /></MetricGrid>
    <FilterBar onSearch={() => onToast('审核列表已查询')} onReset={() => setStatus('待处理')}><Field label="处理状态"><Select value={status} onChange={setStatus} options={['待处理', '全部', '已批准·待生效', '审核退回']} /></Field><Field label="申请类型"><Select value="" placeholder="全部类型" options={['副线转独立单线', '独立单线加入团队', '团队换主线', '终止独立单线']} /></Field><Field label="生效周期"><Select value="" placeholder="全部周期" options={['2026-08', '2026-09']} /></Field></FilterBar>
    <DataTable paginated minWidth={1450} columns={columns} rows={rows} />
    <Alert title="审核检查顺序">先检查同周期唯一归属，再检查未结账单、冻结资金、未处理当月结余和业务范围冲突；加入团队当月结余带入，移出团队留在原团队，解散团队由站点指定代理承担；存在阻止项时不能直接批准。</Alert>
    <Modal open={!!selected} title={`${selected?.id || ''} · 审核详情`} description={selected?.type} onClose={() => setSelected(null)} onConfirm={() => { const result = reviewRequest(selected.id, true); resultMessage(result, onToast, () => setSelected(null)) }} confirmText="审核通过">
      {selected && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '申请人', value: selected.applicant }, { label: '目标周期', value: selected.effectiveCycle }, { label: '原结算单元', value: selected.currentUnit }, { label: '目标结算单元', value: selected.targetUnit }, { label: '推荐人', value: selected.recommender }, { label: '当月结余处理', value: selected.balanceHandling }, { label: '冲突检查', value: <StatusTag>{selected.conflict}</StatusTag> }]} /><Alert tone={selected.conflict === '无冲突' ? 'info' : 'error'} title={selected.conflict === '无冲突' ? '检查通过' : '存在阻止项'}>{selected.note}</Alert></div>}
    </Modal>
  </>
}

function SitePlansPage({ onToast }) {
  const { data, saveSiteCommissionConfig } = useTeamAgent()
  const [tab, setTab] = useState('config')
  const [active, setActive] = useState(() => readSiteCommissionConfig(data.siteCommissionConfig))
  useEffect(() => setActive(readSiteCommissionConfig(data.siteCommissionConfig)), [data.siteCommissionConfig])
  const configs = [
    { key: 'team', title: '团队佣金方案', value: active.team, options: data.plans.filter((plan) => plan.type === '团队佣金方案').map((plan) => plan.name), desc: '主线与全部副线统一使用，团队只命中一个等级。' },
    { key: 'single', title: '独立单线方案', value: active.single, options: data.plans.filter((plan) => plan.type === '独立单线方案').map((plan) => plan.name), desc: '每条独立单线独立考核、独立定级。' },
    { key: 'reward', title: '推荐奖励方案', value: active.reward, options: data.plans.filter((plan) => plan.type === '推荐奖励方案').map((plan) => plan.name), desc: '默认按被推荐单线已审核应付佣金计提，平台另行支付。' },
  ]
  const planLevelRows = configs.flatMap((config) => {
    const plan = data.plans.find((item) => item.name === config.value)
    return (plan?.levels || []).map((level, index) => ({ ...level, _rowKey: `${plan.id}-${index}`, planName: plan.name, planType: plan.type }))
  })
  const planLevelColumns = [
    { key: 'planName', label: '方案名称' }, { key: 'planType', label: '方案类型' }, { key: 'grade', label: '等级' }, { key: 'newActive', label: '新增活跃' }, { key: 'firstDepositMembers', label: '首充人数' }, { key: 'firstDepositAmount', label: '首充额度', render: (value) => <Money value={value} /> }, { key: 'activeMembers', label: '活跃会员' }, { key: 'netWinLoss', label: '当月结余门槛', render: (value) => <Money value={value} /> }, { key: 'rate', label: '佣金比例', render: (value) => <Percent value={value} /> },
  ]
  const activityRows = (data.activityDefinitions || []).map((row, index) => ({
    ...row,
    _rowKey: row.id || `activity-${index}`,
    _name: row.name || row.definitionName || row.activityName || row.metric || '—',
    _depositThreshold: row.depositThreshold ?? row.minDeposit ?? '—',
    _validBetThreshold: row.validBetThreshold ?? row.minValidBet ?? '—',
    _period: row.period || row.window || row.statCycle || row.cycle || '—',
    _operator: row.operator || row.updatedBy || '—',
  }))
  const costRows = (data.agentCosts || []).map((row, index) => ({
    ...row,
    _rowKey: row.id || `cost-${index}`,
    _name: row.name || row.costName || row.costType || row.type || '—',
    _basis: row.method || row.calculationBasis || row.basis || row.rule || row.description || '—',
    _standard: row.standard ?? row.value ?? row.rate ?? row.amount ?? '—',
    _site: row.site || row.scope || row.appliesTo || '—',
    _effectiveCycle: row.effectiveCycle || row.startCycle || '—',
    _operator: row.operator || row.updatedBy || '—',
  }))
  const activityColumns = [
    { key: 'id', label: '定义编号' }, { key: '_name', label: '活跃类型' }, { key: '_depositThreshold', label: '最低存款', render: (value) => typeof value === 'number' ? <Money value={value} /> : value }, { key: '_validBetThreshold', label: '最低有效投注', render: (value) => typeof value === 'number' ? <Money value={value} /> : value }, { key: '_period', label: '统计周期' }, { key: '_operator', label: '操作人' }, { key: 'updatedAt', label: '更新时间', render: (value, row) => value || row.createdAt || '—' },
  ]
  const costColumns = [
    { key: 'id', label: '成本编号' }, { key: '_name', label: '成本项目' }, { key: '_basis', label: '计算口径' }, { key: '_standard', label: '成本标准' }, { key: '_site', label: '所属站点' }, { key: '_effectiveCycle', label: '生效周期' }, { key: 'status', label: '状态', render: (value) => value ? <StatusTag>{value}</StatusTag> : '—' }, { key: '_operator', label: '操作人' }, { key: 'updatedAt', label: '更新时间', render: (value, row) => value || row.createdAt || '—' },
  ]
  const saveConfig = () => {
    const payload = {
      ...(data.siteCommissionConfig || {}),
      site: SITE_NAME,
      teamPlan: active.team,
      singlePlan: active.single,
      rewardPlan: active.reward,
      effectiveCycle: active.cycle,
    }
    const result = saveSiteCommissionConfig
      ? saveSiteCommissionConfig(payload)
      : { ok: false, message: '站点方案共享方法尚未接入' }
    resultMessage(result, onToast)
  }
  return <>
    <SectionHeader title="佣金方案" description="站点只配置本站适用的团队、独立单线和推荐奖励方案，并查看活跃定义与代理成本口径。" actions={tab === 'config' ? <Button onClick={saveConfig}>保存设置</Button> : null} />
    <Tabs items={[{ value: 'config', label: '站点方案' }, { value: 'activity', label: '活跃定义', count: activityRows.length }, { value: 'costs', label: '代理成本', count: costRows.length }]} active={tab} onChange={setTab} />
    {tab === 'config' && <><Panel title={`${SITE_NAME} · 当前方案版本`} description="方案变更只影响未来周期，保存后通过共享配置同步到总控、站点和代理端；历史账单继续使用当期快照。"><div className="ta-config-cards">{configs.map((config) => <article key={config.key}><div><StatusTag tone="blue">{config.title}</StatusTag><h3>{config.value}</h3><p>{config.desc}</p></div><Field label="选择方案"><Select value={config.value} onChange={(value) => setActive({ ...active, [config.key]: value })} options={config.options} /></Field></article>)}</div><Field label="统一生效周期"><Select value={active.cycle} onChange={(value) => setActive({ ...active, cycle: value })} options={['2026-08', '2026-09']} /></Field></Panel><Panel title="本站生效方案等级条件" description="站点可查看总控方案中的等级条件，但不能在本站修改全局门槛。"><DataTable minWidth={1320} columns={planLevelColumns} rows={planLevelRows} rowKey="_rowKey" /></Panel><FormulaPanel items={[{ label: '净输赢', formula: '总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费' }, { label: '冲正后净输赢 / 本月结余', formula: '净输赢 + 上月结余 + 本月结余调整' }, { label: '佣金', formula: 'MAX（0，冲正后净输赢 × 命中等级比例 + 佣金调整）' }, { label: '推荐奖励', formula: '独立单线已审核应付佣金 × 10%', value: '当前站点比例 10%' }]} /></>}
    {tab === 'activity' && <DataTable paginated minWidth={1100} columns={activityColumns} rows={activityRows} rowKey="_rowKey" emptyText="暂无活跃定义" />}
    {tab === 'costs' && <DataTable paginated minWidth={1100} columns={costColumns} rows={costRows} rowKey="_rowKey" emptyText="暂无代理成本" />}
  </>
}

function SiteSettlementPage({ onToast }) {
  const { data, dailyRemaining, submitBill, payoutBill } = useTeamAgent()
  const [payout, setPayout] = useState(null)
  const [amount, setAmount] = useState('')
  const emptyFilters = { billType: '', agentType: '', state: '', payee: '' }
  const [filters, setFilters] = useState(emptyFilters)
  const scopedBills = data.bills.filter((bill) => bill.site === SITE_NAME).map((bill) => ({
    ...bill,
    displayAgentType: ['团队佣金', '独立单线佣金'].includes(bill.type) ? '团队代理' : (bill.agentType || '普通代理'),
    displayIdentity: bill.type === '团队佣金' ? '团队负责人' : bill.type === '独立单线佣金' ? '独立代理' : '推荐代理',
  }))
  const rows = scopedBills.filter((bill) => (!filters.billType || bill.type === filters.billType) && (!filters.agentType || bill.displayAgentType === filters.agentType) && (!filters.state || bill.state === filters.state) && (!filters.payee || bill.payee.toLowerCase().includes(filters.payee.toLowerCase())))
  const columns = [
    { key: 'id', label: '账单编号' }, { key: 'type', label: '账单类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'unitName', label: '结算单元' }, { key: 'payee', label: '收款方' }, { key: 'displayAgentType', label: '代理类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'displayIdentity', label: '代理身份' }, { key: 'cycle', label: '周期' }, { key: 'payable', label: '应付', render: (value) => <Money value={value} /> }, { key: 'issued', label: '已发', render: (value) => <Money value={value} /> },
    { key: 'remaining', label: '剩余', render: (_, row) => <Money value={row.payable - row.issued} /> }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions">{row.state === '待提交' && <Link onClick={() => resultMessage(submitBill(row.id), onToast)}>提交审核</Link>}{['待发放', '部分发放'].includes(row.state) && <Link onClick={() => { setPayout(row); setAmount(String(Math.min(row.payable - row.issued, dailyRemaining))) }}>发起发放</Link>}<Link onClick={() => onToast(`${row.id} 账单详情已打开`)}>详情</Link></div> },
  ]
  return <>
    <SectionHeader title="代理佣金结算" description="站点只处理本站团队、独立单线和推荐奖励账单，并在审核通过后发起发放。" />
    <MetricGrid columns={4}><MetricCard label="每日额度" value={<Money value={data.siteQuota.dailyQuota} />} icon={<WalletOutlined />} /><MetricCard label="今日成功发放" value={<Money value={data.siteQuota.successfulToday} />} tone="green" icon={<SendOutlined />} /><MetricCard label="处理中占用" value={<Money value={data.siteQuota.pendingOccupied} />} tone="orange" icon={<ClockCircleOutlined />} /><MetricCard label="当日剩余额度" value={<Money value={dailyRemaining} />} tone="blue" icon={<FileDoneOutlined />} /></MetricGrid>
    <FilterBar onSearch={() => onToast(`已查询 ${rows.length} 条本站代理账单`)} onReset={() => setFilters(emptyFilters)}><Field label="账单类型"><Select value={filters.billType} onChange={(billType) => setFilters({ ...filters, billType })} placeholder="全部类型" options={['团队佣金', '独立单线佣金', '推荐奖励']} /></Field><Field label="代理类型"><Select value={filters.agentType} onChange={(agentType) => setFilters({ ...filters, agentType })} placeholder="全部类型" options={['团队代理', '普通代理']} /></Field><Field label="状态"><Select value={filters.state} onChange={(state) => setFilters({ ...filters, state })} placeholder="全部状态" options={['待提交', '待审核', '待发放', '部分发放', '已发放']} /></Field><Field label="收款方"><Input value={filters.payee} onChange={(payee) => setFilters({ ...filters, payee })} placeholder="代理账号" /></Field></FilterBar>
    <DataTable paginated minWidth={1580} columns={columns} rows={rows} />
    <Alert title="权限边界" tone="warning">站点负责提交账单和发起发放；总控财务负责审核平台应付账单。副线内部结算不进入本页平台应付。</Alert>
    <Modal open={!!payout} title="发起平台发放" description={`${payout?.id || ''} · ${payout?.payee || ''}`} onClose={() => setPayout(null)} onConfirm={() => resultMessage(payoutBill(payout.id, amount), onToast, () => setPayout(null))} confirmText="确认发放">
      {payout && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '账单剩余', value: <Money value={payout.payable - payout.issued} /> }, { label: '当日剩余额度', value: <Money value={dailyRemaining} /> }, { label: '本次可发上限', value: <Money value={Math.min(payout.payable - payout.issued, dailyRemaining)} /> }, { label: '账单状态', value: <StatusTag>{payout.state}</StatusTag> }]} /><Field label="本次发放金额" required><Input type="number" min="0" value={amount} onChange={setAmount} /></Field></div>}
    </Modal>
  </>
}

export function SitePage({ page, onToast }) {
  if (page === 'teams') return <SiteTeamsPage onToast={onToast} />
  if (page === 'review') return <SiteReviewPage onToast={onToast} />
  if (page === 'plans') return <SitePlansPage onToast={onToast} />
  if (page === 'settlement') return <SiteSettlementPage onToast={onToast} />
  return <SiteTeamsPage onToast={onToast} />
}
