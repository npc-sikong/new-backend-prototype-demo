import { useState } from 'react'
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

function SiteTeamsPage({ onToast }) {
  const { data, createTeam, addSecondary, setTeamStatus, changeMain } = useTeamAgent()
  const [tab, setTab] = useState('teams')
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [teamForm, setTeamForm] = useState({ name: '', mainAgent: '', site: '旺财体育', plan: '旺财团队月结方案', startCycle: '2026-08' })
  const [secondaryForm, setSecondaryForm] = useState({ agent: '', scope: '', startCycle: '2026-08' })
  const [mainForm, setMainForm] = useState({ nextMain: '', effectiveCycle: '2026-08' })
  const team = data.teams.find((item) => item.id === selected?.id) || selected
  const close = () => setModal(null)
  const columns = [
    { key: 'code', label: '代理部编号' }, { key: 'name', label: '代理部名称', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'mainAgent', label: '主管主线' }, { key: 'lines', label: '副线数', render: (value) => value.filter((line) => line.identity === '副线').length },
    { key: 'plan', label: '团队方案' }, { key: 'metrics', label: '当前等级', render: (value) => <StatusTag tone="blue">{value.grade}</StatusTag> }, { key: 'startCycle', label: '生效周期' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><Link onClick={() => { setSelected(row); setModal('detail') }}>详情</Link><Link onClick={() => { setSelected(row); setModal('secondary') }}>开副线</Link><Link onClick={() => { setSelected(row); setModal('main') }}>换主线</Link><Link onClick={() => resultMessage(setTeamStatus(row.id, row.status === '冻结' ? '生效中' : '冻结'), onToast)}>{row.status === '冻结' ? '解冻' : '冻结'}</Link><Link onClick={() => resultMessage(setTeamStatus(row.id, '已解散'), onToast)}>解散</Link></div> },
  ]
  const internalColumns = [
    { key: 'id', label: '结算单号' }, { key: 'teamName', label: '代理部' }, { key: 'mainAgent', label: '付款主线' }, { key: 'secondaryAgent', label: '收款副线' }, { key: 'cycle', label: '周期' }, { key: 'amount', label: '金额', render: (value) => <Money value={value} /> },
    { key: 'source', label: '资金来源' }, { key: 'basis', label: '结算依据' }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'createdAt', label: '时间' }, { key: 'action', label: '操作', render: (_, row) => <Link onClick={() => onToast(row.state === '处理中' ? `${row.id} 已冻结，等待补充凭证` : `${row.id} 风险信息已查看`)}>{row.state === '处理中' ? '冻结' : '查看'}</Link> },
  ]
  return <>
    <SectionHeader title="站点团队代理管理" description="创建代理部、指定主管主线，并维护副线和团队生命周期。" actions={<Button icon={<PlusOutlined />} onClick={() => setModal('create')}>创建代理部</Button>} />
    <MetricGrid columns={4}><MetricCard label="代理部" value={data.teams.length} icon={<ApartmentOutlined />} /><MetricCard label="生效中" value={data.teams.filter((item) => item.status === '生效中').length} tone="green" icon={<CheckCircleOutlined />} /><MetricCard label="有效副线" value={data.teams.flatMap((item) => item.lines).filter((line) => line.identity === '副线' && line.status === '生效中').length} tone="blue" icon={<TeamOutlined />} /><MetricCard label="待处理关系" value={data.requests.filter((item) => ['待站点复核', '待补充资料'].includes(item.status)).length} tone="orange" icon={<ClockCircleOutlined />} /></MetricGrid>
    <Tabs items={[{ value: 'teams', label: '代理部列表', count: data.teams.length }, { value: 'monitor', label: '内部结算监控', count: data.internalSettlements.length }]} active={tab} onChange={setTab} />
    {tab === 'teams' ? <><FilterBar onSearch={() => onToast('站点团队列表已查询')} onReset={() => onToast('筛选条件已重置')}><Field label="代理部"><Input placeholder="名称或编号" /></Field><Field label="主管主线"><Input placeholder="代理账号" /></Field><Field label="状态"><Select value="" placeholder="全部状态" options={['待生效', '生效中', '冻结', '待解散']} /></Field></FilterBar><DataTable minWidth={1300} columns={columns} rows={data.teams} /></> : <><Alert title="站点监控边界" tone="warning">站点可查看和冻结内部结算风险记录，但不替主线决定副线结算金额。</Alert><DataTable minWidth={1250} columns={internalColumns} rows={data.internalSettlements} /></>}

    <Modal open={modal === 'create'} title="创建代理部" description="站点指定主线、团队方案和未来完整生效周期。" onClose={close} onConfirm={() => resultMessage(createTeam(teamForm), onToast, close)}>
      <FormGrid><Field label="代理部名称" required><Input value={teamForm.name} onChange={(value) => setTeamForm({ ...teamForm, name: value })} placeholder="请输入名称" /></Field><Field label="主管主线" required><Input value={teamForm.mainAgent} onChange={(value) => setTeamForm({ ...teamForm, mainAgent: value })} placeholder="代理账号" /></Field><Field label="团队方案"><Select value={teamForm.plan} onChange={(value) => setTeamForm({ ...teamForm, plan: value })} options={data.plans.filter((plan) => plan.type === '团队佣金方案').map((plan) => plan.name)} /></Field><Field label="生效周期"><Select value={teamForm.startCycle} onChange={(value) => setTeamForm({ ...teamForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
    </Modal>
    <Modal open={modal === 'secondary'} title={`为 ${team?.name || ''} 开设副线`} description="站点直接复核并创建明确 line_id 和业务范围。" onClose={close} onConfirm={() => resultMessage(addSecondary(team.id, { ...secondaryForm, requireReview: false }), onToast, close)}>
      <FormGrid><Field label="副线负责人" required><Input value={secondaryForm.agent} onChange={(value) => setSecondaryForm({ ...secondaryForm, agent: value })} placeholder="代理账号" /></Field><Field label="生效周期"><Select value={secondaryForm.startCycle} onChange={(value) => setSecondaryForm({ ...secondaryForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field><Field label="业务范围" className="ta-field-full"><Input value={secondaryForm.scope} onChange={(value) => setSecondaryForm({ ...secondaryForm, scope: value })} placeholder="代理节点及直属会员" /></Field></FormGrid>
      <Alert title="唯一性检查">同一代理同一站点、币种和周期只能进入一个团队或独立单线。</Alert>
    </Modal>
    <Modal open={modal === 'main'} title={`更换 ${team?.name || ''} 主管主线`} description="新主线从未来周期接管，历史账单仍归原主线。" onClose={close} onConfirm={() => resultMessage(changeMain(team.id, mainForm.nextMain, mainForm.effectiveCycle), onToast, close)}>
      <FormGrid><Field label="当前主线"><Input value={team?.mainAgent || ''} disabled /></Field><Field label="新主管主线" required><Input value={mainForm.nextMain} onChange={(value) => setMainForm({ ...mainForm, nextMain: value })} /></Field><Field label="生效周期"><Select value={mainForm.effectiveCycle} onChange={(value) => setMainForm({ ...mainForm, effectiveCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
      {team?.processingOccupied > 0 && <Alert tone="error" title="存在处理中资金">处理完成前申请不能批准，但可先保存待补充资料。</Alert>}
    </Modal>
    <Modal open={modal === 'detail'} title={`${team?.name || ''} · 站点管理详情`} description="团队组织、考核、账单和内部结算概览。" onClose={close} onConfirm={close} confirmText="关闭" width={760}>
      {team && <div className="ta-stack"><DescriptionGrid items={[{ label: '主管主线', value: team.mainAgent }, { label: '团队方案', value: team.plan }, { label: '生效周期', value: team.startCycle }, { label: '团队状态', value: <StatusTag>{team.status}</StatusTag> }, { label: '副线数量', value: team.lines.filter((line) => line.identity === '副线').length }, { label: '团队等级', value: team.metrics.grade }]} /><DataTable columns={[{ key: 'identity', label: '身份', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'lineId', label: 'line_id' }, { key: 'agent', label: '负责人' }, { key: 'scope', label: '业务范围' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }]} rows={team.lines} rowKey="lineId" /></div>}
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
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><Link onClick={() => onToast(`${row.name} 详情已打开`)}>详情</Link><Link onClick={() => resultMessage(requestChange({ type: '独立单线加入团队', applicant: row.owner, currentUnit: row.name, targetUnit: '代理2部 / 待分配 line_id' }), onToast)}>加入团队</Link><Link onClick={() => resultMessage(requestChange({ type: '终止独立单线', applicant: row.owner, currentUnit: row.name, targetUnit: '终止', recommender: row.recommender }), onToast)}>终止</Link></div> },
  ]
  return <>
    <SectionHeader title="站点独立单线管理" description="直接创建单人单线，或查看由团队副线切换形成的独立单线。" actions={<Button icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>创建单人单线</Button>} />
    <MetricGrid columns={4}><MetricCard label="单线总数" value={data.singles.length} /><MetricCard label="站点直建" value={data.singles.filter((item) => item.source === '站点直接创建').length} tone="green" /><MetricCard label="副线转入" value={data.singles.filter((item) => item.source === '副线转独立').length} tone="blue" /><MetricCard label="绑定推荐人" value={data.singles.filter((item) => item.recommender !== '—').length} tone="orange" /></MetricGrid>
    <FilterBar onSearch={() => onToast('独立单线列表已查询')} onReset={() => onToast('筛选条件已重置')}><Field label="独立线主"><Input placeholder="代理账号" /></Field><Field label="来源"><Select value="" placeholder="全部来源" options={['站点直接创建', '副线转独立']} /></Field><Field label="状态"><Select value="" placeholder="全部状态" options={['待生效', '生效中', '冻结', '已终止']} /></Field></FilterBar>
    <DataTable minWidth={1250} columns={columns} rows={data.singles} />
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
    <DataTable minWidth={1450} columns={columns} rows={rows} />
    <Alert title="审核检查顺序">先检查同周期唯一归属，再检查未结账单、冻结资金、负值结余和业务范围冲突；存在阻止项时不能直接批准。</Alert>
    <Modal open={!!selected} title={`${selected?.id || ''} · 审核详情`} description={selected?.type} onClose={() => setSelected(null)} onConfirm={() => { const result = reviewRequest(selected.id, true); resultMessage(result, onToast, () => setSelected(null)) }} confirmText="审核通过">
      {selected && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '申请人', value: selected.applicant }, { label: '目标周期', value: selected.effectiveCycle }, { label: '原结算单元', value: selected.currentUnit }, { label: '目标结算单元', value: selected.targetUnit }, { label: '推荐人', value: selected.recommender }, { label: '冲突检查', value: <StatusTag>{selected.conflict}</StatusTag> }]} /><Alert tone={selected.conflict === '无冲突' ? 'info' : 'error'} title={selected.conflict === '无冲突' ? '检查通过' : '存在阻止项'}>{selected.note}</Alert></div>}
    </Modal>
  </>
}

function SitePlansPage({ onToast }) {
  const { data } = useTeamAgent()
  const [active, setActive] = useState({ team: '旺财团队月结方案', single: '独立单线月结方案', reward: '推荐奖励10%方案', cycle: '2026-08' })
  const configs = [
    { key: 'team', title: '团队佣金方案', value: active.team, options: data.plans.filter((plan) => plan.type === '团队佣金方案').map((plan) => plan.name), desc: '主线与全部副线统一使用，团队只命中一个等级。' },
    { key: 'single', title: '独立单线方案', value: active.single, options: data.plans.filter((plan) => plan.type === '独立单线方案').map((plan) => plan.name), desc: '每条独立单线独立考核、独立定级。' },
    { key: 'reward', title: '推荐奖励方案', value: active.reward, options: data.plans.filter((plan) => plan.type === '推荐奖励方案').map((plan) => plan.name), desc: '默认按被推荐单线已审核应付佣金计提，平台另行支付。' },
  ]
  return <>
    <SectionHeader title="站点方案与推荐奖励" description="为当前站点选择三类方案版本，并统一设置未来生效周期。" actions={<Button onClick={() => onToast(`方案设置已保存，将于 ${active.cycle} 生效`)}>保存设置</Button>} />
    <Panel title="旺财体育 · 当前方案版本" description="方案变更只影响未来周期，历史账单继续使用当期快照。"><div className="ta-config-cards">{configs.map((config) => <article key={config.key}><div><StatusTag tone="blue">{config.title}</StatusTag><h3>{config.value}</h3><p>{config.desc}</p></div><Field label="选择方案"><Select value={config.value} onChange={(value) => setActive({ ...active, [config.key]: value })} options={config.options} /></Field></article>)}</div><Field label="统一生效周期"><Select value={active.cycle} onChange={(value) => setActive({ ...active, cycle: value })} options={['2026-08', '2026-09']} /></Field></Panel>
    <FormulaPanel items={[{ label: '等级匹配', formula: '三个指标同时达到门槛，取最高满足等级' }, { label: '基础佣金', formula: '可计佣净输赢值 × 命中等级佣金比例' }, { label: '推荐奖励', formula: '独立单线已审核应付佣金 × 10%', value: '当前站点比例 10%' }]} />
  </>
}

function SiteSettlementPage({ onToast }) {
  const { data, dailyRemaining, submitBill, payoutBill } = useTeamAgent()
  const [payout, setPayout] = useState(null)
  const [amount, setAmount] = useState('')
  const columns = [
    { key: 'id', label: '账单编号' }, { key: 'type', label: '账单类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'unitName', label: '结算单元' }, { key: 'payee', label: '收款方' }, { key: 'cycle', label: '周期' }, { key: 'payable', label: '应付', render: (value) => <Money value={value} /> }, { key: 'issued', label: '已发', render: (value) => <Money value={value} /> },
    { key: 'remaining', label: '剩余', render: (_, row) => <Money value={row.payable - row.issued} /> }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions">{row.state === '待提交' && <Link onClick={() => resultMessage(submitBill(row.id), onToast)}>提交审核</Link>}{['待发放', '部分发放'].includes(row.state) && <Link onClick={() => { setPayout(row); setAmount(String(Math.min(row.payable - row.issued, dailyRemaining))) }}>发起发放</Link>}<Link onClick={() => onToast(`${row.id} 账单详情已打开`)}>详情</Link></div> },
  ]
  return <>
    <SectionHeader title="站点账单提交与发放" description="提交团队、独立单线和推荐奖励账单，并在审核通过后发起发放。" />
    <MetricGrid columns={4}><MetricCard label="每日额度" value={<Money value={data.siteQuota.dailyQuota} />} icon={<WalletOutlined />} /><MetricCard label="今日成功发放" value={<Money value={data.siteQuota.successfulToday} />} tone="green" icon={<SendOutlined />} /><MetricCard label="处理中占用" value={<Money value={data.siteQuota.pendingOccupied} />} tone="orange" icon={<ClockCircleOutlined />} /><MetricCard label="当日剩余额度" value={<Money value={dailyRemaining} />} tone="blue" icon={<FileDoneOutlined />} /></MetricGrid>
    <FilterBar onSearch={() => onToast('站点账单已查询')} onReset={() => onToast('筛选条件已重置')}><Field label="账单类型"><Select value="" placeholder="全部类型" options={['团队佣金', '独立单线佣金', '推荐奖励']} /></Field><Field label="状态"><Select value="" placeholder="全部状态" options={['待提交', '待审核', '待发放', '部分发放', '已发放']} /></Field><Field label="收款方"><Input placeholder="代理账号" /></Field></FilterBar>
    <DataTable minWidth={1320} columns={columns} rows={data.bills.filter((bill) => bill.site === '旺财体育')} />
    <Alert title="权限边界" tone="warning">站点负责提交账单和发起发放；总控财务负责审核平台应付账单。副线内部结算不进入本页平台应付。</Alert>
    <Modal open={!!payout} title="发起平台发放" description={`${payout?.id || ''} · ${payout?.payee || ''}`} onClose={() => setPayout(null)} onConfirm={() => resultMessage(payoutBill(payout.id, amount), onToast, () => setPayout(null))} confirmText="确认发放">
      {payout && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '账单剩余', value: <Money value={payout.payable - payout.issued} /> }, { label: '当日剩余额度', value: <Money value={dailyRemaining} /> }, { label: '本次可发上限', value: <Money value={Math.min(payout.payable - payout.issued, dailyRemaining)} /> }, { label: '账单状态', value: <StatusTag>{payout.state}</StatusTag> }]} /><Field label="本次发放金额" required><Input type="number" min="0" value={amount} onChange={setAmount} /></Field></div>}
    </Modal>
  </>
}

export function SitePage({ page, onToast }) {
  if (page === 'teams') return <SiteTeamsPage onToast={onToast} />
  if (page === 'singles') return <SiteSinglesPage onToast={onToast} />
  if (page === 'review') return <SiteReviewPage onToast={onToast} />
  if (page === 'plans') return <SitePlansPage onToast={onToast} />
  if (page === 'settlement') return <SiteSettlementPage onToast={onToast} />
  return <SiteTeamsPage onToast={onToast} />
}
