import { useMemo, useState } from 'react'
import {
  ApartmentOutlined,
  AuditOutlined,
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FileDoneOutlined,
  HistoryOutlined,
  LockOutlined,
  PlusOutlined,
  SendOutlined,
  StopOutlined,
  SwapOutlined,
  TeamOutlined,
  UserAddOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { LEGACY_REPORT_ROWS, P1_ROADMAP } from './data'
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
  Toolbar,
} from './ui'

function showResult(result, onToast, onSuccess) {
  onToast(result.message, result.ok ? 'success' : 'error')
  if (result.ok) onSuccess?.()
}

function ActionLink({ children, onClick, disabled = false }) {
  return <button className="ta-table-link" disabled={disabled} onClick={onClick}>{children}</button>
}

function MasterAgentsPage({ navigate, onToast }) {
  const { data } = useTeamAgent()
  const [account, setAccount] = useState('')
  const [mode, setMode] = useState('')
  const [identity, setIdentity] = useState('')
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ account: '', model: '多层级代理', site: '旺财体育', mode: '原代理模式' })
  const rows = useMemo(() => data.agents.filter((agent) => (!account || agent.account.toLowerCase().includes(account.toLowerCase())) && (!mode || agent.settlementMode === mode) && (!identity || agent.identity === identity)), [data.agents, account, mode, identity])
  const columns = [
    { key: 'id', label: '代理ID' },
    { key: 'account', label: '代理账号', render: (value) => <b className="ta-primary-text">{value}</b> },
    { key: 'model', label: '代理模型' },
    { key: 'settlementMode', label: '结算模式', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'identity', label: '团队身份', render: (value) => value === '—' ? value : <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'unit', label: '结算单元' },
    { key: 'lineId', label: 'line_id' },
    { key: 'effectiveCycle', label: '生效周期' },
    { key: 'site', label: '所属站点' },
    { key: 'parent', label: '上级代理' },
    { key: 'subAgents', label: '下属代理' },
    { key: 'members', label: '下属会员' },
    { key: 'plan', label: '佣金方案' },
    { key: 'balance', label: '代理钱包余额', render: (value) => <Money value={value} /> },
    { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => row.settlementMode === '团队模式' ? navigate('teams') : row.settlementMode === '独立单线' ? navigate('singles') : onToast(`${row.account} 资料详情已打开`)}>查看</ActionLink><ActionLink onClick={() => onToast(`${row.account} 修改窗口已打开`)}>修改</ActionLink></div> },
  ]
  return <>
    <SectionHeader title="代理管理" description="代理模型与结算身份分开维护，快速识别代理在当前周期的团队归属。" actions={<Button icon={<PlusOutlined />} onClick={() => setShowAdd(true)}>新增代理</Button>} />
    <FilterBar onSearch={() => onToast(`已查询到 ${rows.length} 条代理记录`)} onReset={() => { setAccount(''); setMode(''); setIdentity('') }} onExport={() => onToast('代理列表已导出')}>
      <Field label="代理账号"><Input value={account} onChange={setAccount} placeholder="账号或ID" /></Field>
      <Field label="结算模式"><Select value={mode} onChange={setMode} placeholder="全部模式" options={['团队模式', '独立单线', '原代理模式']} /></Field>
      <Field label="团队身份"><Select value={identity} onChange={setIdentity} placeholder="全部身份" options={['主管主线', '副线负责人', '独立线主']} /></Field>
      <Field label="所属站点"><Select value="" options={['旺财体育', '财神客栈']} placeholder="全部站点" /></Field>
      <Field label="代理状态"><Select value="" options={['启用', '停用']} placeholder="全部状态" /></Field>
    </FilterBar>
    <Toolbar><Button icon={<PlusOutlined />} onClick={() => setShowAdd(true)}>新增代理</Button><Button variant="success" onClick={() => onToast('请选择一名代理后修改')}>修改</Button><Button variant="warning" onClick={() => onToast('请选择一名代理后修改密码')}>修改密码</Button></Toolbar>
    <DataTable className="ta-wide-table" minWidth={1700} columns={columns} rows={rows} />
    <Modal open={showAdd} title="新增代理" description="原代理模型与团队结算身份分别设置；团队归属可在团队管理中配置。" onClose={() => setShowAdd(false)} onConfirm={() => showResult({ ok: true, message: `${form.account || '新代理'} 演示资料已保存` }, onToast, () => setShowAdd(false))}>
      <FormGrid><Field label="代理账号" required><Input value={form.account} onChange={(value) => setForm({ ...form, account: value })} placeholder="请输入代理账号" /></Field><Field label="所属站点"><Select value={form.site} onChange={(value) => setForm({ ...form, site: value })} options={['旺财体育', '财神客栈']} /></Field><Field label="代理模型"><Select value={form.model} onChange={(value) => setForm({ ...form, model: value })} options={['多层级代理', '普通代理']} /></Field><Field label="结算模式"><Select value={form.mode} onChange={(value) => setForm({ ...form, mode: value })} options={['原代理模式', '团队模式', '独立单线']} /></Field></FormGrid>
      <Alert title="身份设置说明">选择团队模式或独立单线后，还需在对应管理页面明确代理部、line_id、业务范围和未来生效周期。</Alert>
    </Modal>
  </>
}

function TeamOverview({ team }) {
  const available = Math.max(0, team.cumulativeReceived - team.successfulTransfers - team.processingOccupied - team.otherDeductions)
  return <div className="ta-stack">
    <DescriptionGrid items={[
      { label: '代理部编号', value: `${team.code} / ${team.id}` }, { label: '所属站点 / 币种', value: `${team.site} / ${team.currency}` }, { label: '主管主线', value: team.mainAgent },
      { label: '团队方案', value: team.plan }, { label: '生效周期', value: `${team.startCycle} 起` }, { label: '团队状态', value: <StatusTag>{team.status}</StatusTag> },
    ]} />
    <MetricGrid columns={4}><MetricCard label="团队等级" value={team.metrics.grade} helper="三个条件同时达标" tone="blue" /><MetricCard label="平台应付佣金" value={<Money value={team.metrics.payable} />} helper="平台只向主线结算" tone="green" /><MetricCard label="上期负值结余" value={<Money value={team.previousNegative} />} helper="先抵扣再考核" tone="orange" /><MetricCard label="主线团队可用余额" value={<Money value={available} />} helper="仅实际到账可在线转账" /></MetricGrid>
    <Alert title="平台责任边界" tone="warning">团队每个周期只形成一张平台应付账单，唯一收款方是当期主线。副线不形成平台应付佣金，由主线自主决定内部结算金额和时间。</Alert>
    <FormulaPanel items={[
      { label: '当期净输赢值', formula: '会员盈亏合计 − 运营费用合计 + 账户调整', value: `¥${team.metrics.currentNet.toLocaleString()}` },
      { label: '考核净输赢值', formula: '当期净输赢值 − 上期负值结余', value: `¥${team.metrics.assessmentNet.toLocaleString()}` },
      { label: '可计佣净输赢值', formula: 'MAX（0，考核净输赢值）', value: `¥${team.metrics.commissionableNet.toLocaleString()}` },
      { label: '平台应付佣金', formula: 'MAX（0，可计佣净输赢值 × 最终比例 + 金额调整）', value: `¥${team.metrics.payable.toLocaleString()}` },
    ]} />
  </div>
}

function MasterTeamsPage({ onToast }) {
  const { data, createTeam, addSecondary, setTeamStatus, changeMain, addInternalSettlement, teamAvailableBalance } = useTeamAgent()
  const [selectedId, setSelectedId] = useState(null)
  const [tab, setTab] = useState('overview')
  const [modal, setModal] = useState(null)
  const [teamForm, setTeamForm] = useState({ name: '', mainAgent: '', plan: '旺财团队月结方案', startCycle: '2026-08', site: '旺财体育' })
  const [secondaryForm, setSecondaryForm] = useState({ agent: '', scope: '', startCycle: '2026-08' })
  const [mainForm, setMainForm] = useState({ nextMain: '', effectiveCycle: '2026-08' })
  const [settleForm, setSettleForm] = useState({ secondaryAgent: 'WC002', amount: '', basis: '固定金额', source: '平台已到账余额', voucher: '' })
  const team = data.teams.find((item) => item.id === selectedId)

  const teamColumns = [
    { key: 'code', label: '代理部编号' }, { key: 'name', label: '代理部名称', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'site', label: '站点' }, { key: 'currency', label: '币种' },
    { key: 'mainAgent', label: '主管主线' }, { key: 'lines', label: '副线数量', render: (value) => Math.max(0, value.filter((line) => line.identity === '副线').length) }, { key: 'plan', label: '团队方案' },
    { key: 'metrics', label: '当前等级', render: (value) => <StatusTag tone="blue">{value.grade}</StatusTag> }, { key: 'startCycle', label: '生效周期' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => { setSelectedId(row.id); setTab('overview') }}>详情</ActionLink><ActionLink onClick={() => { setSelectedId(row.id); setModal('secondary') }}>开副线</ActionLink></div> },
  ]

  function closeModal() {
    setModal(null)
  }

  if (!team) return <>
    <SectionHeader title="团队代理管理" description="以代理部为团队结算单元，统一管理主线、副线、合并考核和平台账单。" actions={<Button icon={<PlusOutlined />} onClick={() => setModal('create')}>创建代理部</Button>} />
    <MetricGrid columns={4}><MetricCard label="代理部数量" value={data.teams.length} helper="含待生效代理部" icon={<ApartmentOutlined />} /><MetricCard label="生效中团队" value={data.teams.filter((item) => item.status === '生效中').length} tone="green" icon={<CheckCircleOutlined />} /><MetricCard label="主副线总数" value={data.teams.reduce((sum, item) => sum + item.lines.length, 0)} tone="blue" icon={<TeamOutlined />} /><MetricCard label="待处理变更" value={data.requests.filter((item) => ['待站点复核', '待补充资料'].includes(item.status)).length} tone="orange" icon={<ClockCircleOutlined />} /></MetricGrid>
    <FilterBar onSearch={() => onToast('团队列表已刷新')} onReset={() => onToast('筛选条件已重置')} onExport={() => onToast('团队列表已导出')}><Field label="代理部"><Input placeholder="名称或编号" /></Field><Field label="主管主线"><Input placeholder="代理账号" /></Field><Field label="团队状态"><Select value="" placeholder="全部状态" options={['草稿', '待生效', '生效中', '冻结', '待解散', '已解散']} /></Field><Field label="生效周期"><Select value="" placeholder="全部周期" options={['2026-07', '2026-08']} /></Field></FilterBar>
    <DataTable minWidth={1180} columns={teamColumns} rows={data.teams} />
    <Modal open={modal === 'create'} title="创建代理部" description="指定主管主线、团队方案和未来完整生效周期。" onClose={closeModal} onConfirm={() => showResult(createTeam(teamForm), onToast, closeModal)}>
      <FormGrid><Field label="代理部名称" required><Input value={teamForm.name} onChange={(value) => setTeamForm({ ...teamForm, name: value })} placeholder="例如：代理3部" /></Field><Field label="所属站点"><Select value={teamForm.site} onChange={(value) => setTeamForm({ ...teamForm, site: value })} options={['旺财体育', '财神客栈']} /></Field><Field label="主管主线" required><Input value={teamForm.mainAgent} onChange={(value) => setTeamForm({ ...teamForm, mainAgent: value })} placeholder="请输入代理账号" /></Field><Field label="团队方案"><Select value={teamForm.plan} onChange={(value) => setTeamForm({ ...teamForm, plan: value })} options={data.plans.filter((plan) => plan.type === '团队佣金方案').map((plan) => plan.name)} /></Field><Field label="生效周期"><Select value={teamForm.startCycle} onChange={(value) => setTeamForm({ ...teamForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
      <Alert title="周期约束">代理部从目标完整周期开始参与考核，不追溯当前周期和历史账单。</Alert>
    </Modal>
  </>

  const tabs = [
    { value: 'overview', label: '团队概况' }, { value: 'structure', label: '主副线结构', count: team.lines.length }, { value: 'performance', label: '业绩考核' },
    { value: 'bills', label: '团队账单', count: data.bills.filter((bill) => bill.unitId === team.id).length }, { value: 'internal', label: '内部结算', count: data.internalSettlements.filter((item) => item.teamId === team.id).length },
    { value: 'changes', label: '变更记录', count: data.requests.filter((item) => item.currentUnit.includes(team.name) || item.targetUnit.includes(team.name)).length },
  ]
  const lineColumns = [
    { key: 'identity', label: '身份', render: (value) => <StatusTag tone={value === '主线' ? 'blue' : 'gray'}>{value}</StatusTag> }, { key: 'lineId', label: 'line_id' }, { key: 'agent', label: '负责人', render: (value) => <b>{value}</b> }, { key: 'scope', label: '显式业务范围' },
    { key: 'newActive', label: '新增活跃' }, { key: 'activeMembers', label: '活跃会员' }, { key: 'netWinLoss', label: '净输赢值', render: (value) => <Money value={value} signed /> }, { key: 'startCycle', label: '生效周期' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
  ]
  const billRows = data.bills.filter((bill) => bill.unitId === team.id)
  const internalRows = data.internalSettlements.filter((item) => item.teamId === team.id)
  const changeRows = data.requests.filter((item) => item.currentUnit.includes(team.name) || item.targetUnit.includes(team.name))

  return <>
    <SectionHeader title={`${team.name} · 团队详情`} description={`${team.code}　${team.site} / ${team.currency}　主线：${team.mainAgent}`} actions={<><Button variant="ghost" onClick={() => setSelectedId(null)}>返回列表</Button><Button icon={<UserAddOutlined />} onClick={() => setModal('secondary')}>开设副线</Button><Button icon={<SwapOutlined />} variant="ghost" onClick={() => setModal('main')}>更换主线</Button><Button icon={<LockOutlined />} variant="warning" onClick={() => showResult(setTeamStatus(team.id, team.status === '冻结' ? '生效中' : '冻结'), onToast)}> {team.status === '冻结' ? '解冻' : '冻结'}</Button><Button icon={<StopOutlined />} variant="danger" onClick={() => showResult(setTeamStatus(team.id, '已解散'), onToast)}>解散</Button></>} />
    <Tabs items={tabs} active={tab} onChange={setTab} />
    {tab === 'overview' && <TeamOverview team={team} />}
    {tab === 'structure' && <Panel title="主副线结构" description="每条线使用唯一 line_id 划分业务范围，父级汇总不重复计入。" actions={<Button icon={<UserAddOutlined />} size="small" onClick={() => setModal('secondary')}>开副线</Button>}><DataTable columns={lineColumns} rows={team.lines} rowKey="lineId" minWidth={1050} /></Panel>}
    {tab === 'performance' && <div className="ta-stack"><MetricGrid columns={4}><MetricCard label="新增活跃会员" value={team.metrics.newActive} helper="团队会员去重后统计" tone="blue" /><MetricCard label="活跃会员数量" value={team.metrics.activeMembers} helper="每名会员每周期最多计1次" /><MetricCard label="当期净输赢值" value={<Money value={team.metrics.currentNet} />} helper="含账户调整" tone="green" /><MetricCard label="命中等级 / 比例" value={`${team.metrics.grade} / ${(team.metrics.rate * 100).toFixed(0)}%`} helper="三个条件 AND" tone="orange" /></MetricGrid><Panel title="各线业绩贡献" description="副线负业绩同样进入团队合计，不单独定级或生成个人佣金。"><DataTable columns={lineColumns.slice(0, 7)} rows={team.lines} rowKey="lineId" /></Panel><FormulaPanel title="统一考核口径" items={[{ label: '团队新增活跃', formula: '主线与全部有效副线唯一会员去重汇总', value: String(team.metrics.newActive) }, { label: '团队活跃会员', formula: '达到存款门槛且达到有效投注门槛', value: String(team.metrics.activeMembers) }, { label: '团队净输赢值', formula: '各 line_id 唯一事实净输赢值之和', value: `¥${team.metrics.currentNet.toLocaleString()}` }, { label: '等级匹配', formula: '新增活跃、活跃会员、净输赢值同时达标，取最高等级', value: team.metrics.grade }]} /></div>}
    {tab === 'bills' && <Panel title="团队平台账单" description="每个佣金周期最多一张团队账单，唯一收款方为当期主线。"><DataTable columns={billColumns(onToast)} rows={billRows} minWidth={1180} /></Panel>}
    {tab === 'internal' && <div className="ta-stack"><MetricGrid columns={4}><MetricCard label="累计平台到账" value={<Money value={team.cumulativeReceived} />} tone="green" /><MetricCard label="成功内部转账" value={<Money value={team.successfulTransfers} />} /><MetricCard label="处理中占用" value={<Money value={team.processingOccupied} />} tone="orange" /><MetricCard label="团队可用余额" value={<Money value={teamAvailableBalance(team.id)} />} tone="blue" /></MetricGrid><Panel title="副线内部结算记录" description="金额由主线自主决定，不要求合计等于团队佣金。" actions={<Button icon={<WalletOutlined />} size="small" onClick={() => setModal('settle')}>新增内部结算</Button>}><DataTable columns={internalColumns} rows={internalRows} minWidth={1120} /></Panel><FormulaPanel title="主线团队可用余额" items={[{ label: '团队可用余额', formula: '累计成功到账 − 成功内部转账 − 处理中占用 − 其他扣减', value: `¥${teamAvailableBalance(team.id).toLocaleString()}` }, { label: '本次可转金额', formula: 'MIN（主线录入金额，团队可用余额）' }]} /></div>}
    {tab === 'changes' && <Panel title="关系与模式变更" description="所有变更从未来完整周期生效，历史结果保持不变。"><DataTable columns={requestColumns} rows={changeRows} minWidth={1350} /></Panel>}

    <Modal open={modal === 'secondary'} title={`为 ${team.name} 开设副线`} description="副线范围必须明确且不能与其他结算单元重叠。" onClose={closeModal} onConfirm={() => showResult(addSecondary(team.id, { ...secondaryForm, requireReview: true }), onToast, closeModal)}>
      <FormGrid><Field label="副线负责人" required><Input value={secondaryForm.agent} onChange={(value) => setSecondaryForm({ ...secondaryForm, agent: value })} placeholder="请输入代理账号" /></Field><Field label="生效周期"><Select value={secondaryForm.startCycle} onChange={(value) => setSecondaryForm({ ...secondaryForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field><Field label="业务范围" className="ta-field-full"><Input value={secondaryForm.scope} onChange={(value) => setSecondaryForm({ ...secondaryForm, scope: value })} placeholder="例如：该代理节点及直属会员" /></Field></FormGrid>
      <Alert title="唯一归属检查">保存前会检查目标代理是否已属于其他团队或独立单线；当前周期不追溯切分。</Alert>
    </Modal>
    <Modal open={modal === 'main'} title={`更换 ${team.name} 主管主线`} description="换主线只影响未来周期，历史账单和内部结算仍归原主线。" onClose={closeModal} onConfirm={() => showResult(changeMain(team.id, mainForm.nextMain, mainForm.effectiveCycle), onToast, closeModal)}>
      <FormGrid><Field label="当前主线"><Input value={team.mainAgent} disabled /></Field><Field label="新主管主线" required><Input value={mainForm.nextMain} onChange={(value) => setMainForm({ ...mainForm, nextMain: value })} placeholder="请输入代理账号" /></Field><Field label="生效周期"><Select value={mainForm.effectiveCycle} onChange={(value) => setMainForm({ ...mainForm, effectiveCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
      {team.processingOccupied > 0 && <Alert tone="error" title="当前存在阻止项">处理中内部结算金额为 ¥{team.processingOccupied.toLocaleString()}，申请可保存但完成前不能批准。</Alert>}
    </Modal>
    <Modal open={modal === 'settle'} title="新增副线内部结算" description={`当前团队可用余额：¥${teamAvailableBalance(team.id).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`} onClose={closeModal} onConfirm={() => showResult(addInternalSettlement({ teamId: team.id, ...settleForm }), onToast, closeModal)}>
      <FormGrid><Field label="收款副线" required><Select value={settleForm.secondaryAgent} onChange={(value) => setSettleForm({ ...settleForm, secondaryAgent: value })} options={team.lines.filter((line) => line.identity === '副线').map((line) => line.agent)} /></Field><Field label="结算金额" required><Input type="number" min="0" value={settleForm.amount} onChange={(value) => setSettleForm({ ...settleForm, amount: value })} placeholder="请输入金额" /></Field><Field label="结算依据"><Select value={settleForm.basis} onChange={(value) => setSettleForm({ ...settleForm, basis: value })} options={['固定金额', '内部比例', '参考副线业绩', '其他约定']} /></Field><Field label="资金来源"><Select value={settleForm.source} onChange={(value) => setSettleForm({ ...settleForm, source: value })} options={['平台已到账余额', '主线自有资金', '线下资金']} /></Field><Field label="备注 / 凭证" className="ta-field-full"><Input value={settleForm.voucher} onChange={(value) => setSettleForm({ ...settleForm, voucher: value })} placeholder="请输入约定或凭证说明" /></Field></FormGrid>
      <Alert tone="warning" title="资金控制">平台已到账余额不能透支；主线自有资金仅作为演示选项，不改变团队平台账单。</Alert>
    </Modal>
  </>
}

const internalColumns = [
  { key: 'id', label: '内部结算单号' }, { key: 'cycle', label: '周期' }, { key: 'mainAgent', label: '付款主线' }, { key: 'secondaryAgent', label: '收款副线' }, { key: 'amount', label: '结算金额', render: (value) => <Money value={value} /> },
  { key: 'basis', label: '结算依据' }, { key: 'source', label: '资金来源' }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'voucher', label: '备注 / 凭证' }, { key: 'createdAt', label: '操作时间' },
]

const requestColumns = [
  { key: 'id', label: '申请编号' }, { key: 'type', label: '变更类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'applicant', label: '申请人' }, { key: 'currentUnit', label: '原结算单元' }, { key: 'targetUnit', label: '目标结算单元' },
  { key: 'effectiveCycle', label: '生效周期' }, { key: 'recommender', label: '推荐人' }, { key: 'conflict', label: '冲突检查', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'createdAt', label: '申请时间' }, { key: 'note', label: '业务说明' },
]

function billColumns(onToast) {
  return [
    { key: 'id', label: '账单编号' }, { key: 'type', label: '账单类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'unitName', label: '结算单元' }, { key: 'payee', label: '收款方' }, { key: 'cycle', label: '佣金周期' },
    { key: 'grade', label: '等级' }, { key: 'rate', label: '比例', render: (value) => <Percent value={value} /> }, { key: 'netWinLoss', label: '考核净输赢值', render: (value) => <Money value={value} signed /> }, { key: 'payable', label: '应付金额', render: (value) => <Money value={value} /> },
    { key: 'issued', label: '已发金额', render: (value) => <Money value={value} /> }, { key: 'remaining', label: '账单剩余', render: (_, row) => <Money value={Math.max(0, row.payable - row.issued)} /> }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'action', label: '操作', render: (_, row) => <ActionLink onClick={() => onToast(`${row.id} 账单详情已打开`)}>详情</ActionLink> },
  ]
}

function MasterSinglesPage({ onToast }) {
  const { data, createSingle, requestChange } = useTeamAgent()
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ name: '', owner: '', recommender: '', startCycle: '2026-08', plan: '独立单线月结方案', source: '站点直接创建' })
  const columns = [
    { key: 'code', label: '单线编号' }, { key: 'name', label: '独立单线', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'owner', label: '独立线主' }, { key: 'source', label: '创建来源' }, { key: 'recommender', label: '推荐人' },
    { key: 'plan', label: '佣金方案' }, { key: 'rewardPlan', label: '推荐奖励方案' }, { key: 'startCycle', label: '生效周期' }, { key: 'metrics', label: '当前等级', render: (value) => <StatusTag tone="blue">{value.grade}</StatusTag> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => setSelected(row)}>详情</ActionLink><ActionLink onClick={() => showResult(requestChange({ type: '独立单线加入团队', applicant: row.owner, currentUnit: row.name, targetUnit: '代理2部 / 待分配 line_id', recommender: '—' }), onToast)}>加入团队</ActionLink><ActionLink onClick={() => showResult(requestChange({ type: '终止独立单线', applicant: row.owner, currentUnit: row.name, targetUnit: '终止', recommender: row.recommender }), onToast)}>终止</ActionLink></div> },
  ]
  return <>
    <SectionHeader title="独立单线管理" description="独立计算指标、独立定级并由平台直接向线主结算。" actions={<Button icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>创建单人单线</Button>} />
    <MetricGrid columns={4}><MetricCard label="独立单线数量" value={data.singles.length} icon={<BankOutlined />} /><MetricCard label="生效中" value={data.singles.filter((item) => item.status === '生效中').length} tone="green" /><MetricCard label="副线转入" value={data.singles.filter((item) => item.source === '副线转独立').length} tone="blue" /><MetricCard label="已绑定推荐人" value={data.singles.filter((item) => item.recommender !== '—').length} tone="orange" /></MetricGrid>
    <FilterBar onSearch={() => onToast('独立单线列表已查询')} onReset={() => onToast('筛选条件已重置')}><Field label="独立线主"><Input placeholder="代理账号" /></Field><Field label="创建来源"><Select value="" placeholder="全部来源" options={['站点直接创建', '副线转独立']} /></Field><Field label="状态"><Select value="" placeholder="全部状态" options={['待生效', '生效中', '冻结', '已终止']} /></Field></FilterBar>
    <DataTable minWidth={1320} columns={columns} rows={data.singles} />
    <FormulaPanel title="独立单线与推荐奖励" items={[{ label: '独立单线佣金', formula: 'MAX（0，可计佣净输赢值 × 最终比例 + 金额调整）' }, { label: '推荐奖励', formula: '独立单线已审核应付佣金 × 奖励比例 x%' }, { label: '停止奖励', formula: '独立单线加入团队的生效周期起停止计提' }]} warning="推荐奖励由平台另行计提，不从独立线主佣金中扣减。" />
    <Modal open={showCreate} title="创建单人单线" description="初始业务范围仅包含线主本人代理节点。" onClose={() => setShowCreate(false)} onConfirm={() => showResult(createSingle(form), onToast, () => setShowCreate(false))}>
      <FormGrid><Field label="单线名称"><Input value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="留空则使用线主命名" /></Field><Field label="独立线主" required><Input value={form.owner} onChange={(value) => setForm({ ...form, owner: value })} placeholder="请输入代理账号" /></Field><Field label="佣金方案"><Select value={form.plan} onChange={(value) => setForm({ ...form, plan: value })} options={data.plans.filter((plan) => plan.type === '独立单线方案').map((plan) => plan.name)} /></Field><Field label="推荐主线"><Input value={form.recommender} onChange={(value) => setForm({ ...form, recommender: value })} placeholder="可不填写" /></Field><Field label="生效周期"><Select value={form.startCycle} onChange={(value) => setForm({ ...form, startCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
    </Modal>
    <Modal open={!!selected} title={`${selected?.name || ''} · 详情`} description="独立单线业务、考核和推荐关系快照。" onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭">
      {selected && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '独立线主', value: selected.owner }, { label: '创建来源', value: selected.source }, { label: '业务范围', value: selected.scope }, { label: '推荐人', value: selected.recommender }, { label: '佣金方案', value: selected.plan }, { label: '生效周期', value: selected.startCycle }]} /><MetricGrid columns={3}><MetricCard label="新增活跃" value={selected.metrics.newActive} /><MetricCard label="活跃会员" value={selected.metrics.activeMembers} /><MetricCard label="考核净输赢值" value={<Money value={selected.metrics.assessmentNet} />} tone="green" /><MetricCard label="等级" value={selected.metrics.grade} tone="blue" /><MetricCard label="比例" value={<Percent value={selected.metrics.rate} />} /><MetricCard label="应付佣金" value={<Money value={selected.metrics.payable} />} tone="orange" /></MetricGrid></div>}
    </Modal>
  </>
}

function MasterPlansPage({ onToast }) {
  const { data, addPlan } = useTeamAgent()
  const [type, setType] = useState('团队佣金方案')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', type: '团队佣金方案', effectiveCycle: '2026-08', rewardRate: '0.10' })
  const types = ['团队佣金方案', '独立单线方案', '推荐奖励方案', '历史代理方案']
  const rows = data.plans.filter((plan) => plan.type === type)
  const columns = [
    { key: 'id', label: '方案编号' }, { key: 'name', label: '方案名称', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'type', label: '方案类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'site', label: '适用站点' },
    { key: 'levels', label: '等级 / 奖励摘要', render: (value, row) => row.type === '推荐奖励方案' ? `${(row.rewardRate * 100).toFixed(0)}% · ${row.rewardBase}` : value?.length ? `${value.length} 个等级，最高 ${value.at(-1).grade} / ${(value.at(-1).rate * 100).toFixed(0)}%` : '历史兼容查询' },
    { key: 'effectiveCycle', label: '生效周期' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => setSelected(row)}>查看配置</ActionLink><ActionLink onClick={() => onToast(`${row.name} 已复制为未来版本`)}>复制版本</ActionLink></div> },
  ]
  return <>
    <SectionHeader title="返佣方案" description="团队、独立单线、推荐奖励分别配置，历史多层级方案仅用于兼容查询。" actions={<Button icon={<PlusOutlined />} onClick={() => setShowAdd(true)}>新增方案</Button>} />
    <Tabs items={types.map((item) => ({ value: item, label: item, count: data.plans.filter((plan) => plan.type === item).length }))} active={type} onChange={setType} />
    <DataTable minWidth={1120} columns={columns} rows={rows} />
    <FormulaPanel title="方案匹配规则" items={[{ label: '等级条件', formula: '新增活跃会员 ≥ 门槛 AND 活跃会员 ≥ 门槛 AND 净输赢值 ≥ 门槛' }, { label: '命中等级', formula: '从高到低取全部条件同时满足的最高等级' }, { label: '推荐奖励', formula: '独立单线已审核应付佣金 × 推荐奖励比例' }]} />
    <Panel title="后续增强能力" description="下列 P1 能力仅作为路线图，不计入本次已完成验收。"><div className="ta-roadmap-list">{P1_ROADMAP.map((item) => <span key={item}><ClockCircleOutlined />{item}</span>)}</div></Panel>
    <Modal open={showAdd} title="新增团队代理方案" description="新方案从未来完整佣金周期开始生效。" onClose={() => setShowAdd(false)} onConfirm={() => showResult(addPlan(form), onToast, () => setShowAdd(false))}>
      <FormGrid><Field label="方案名称" required><Input value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="请输入方案名称" /></Field><Field label="方案类型"><Select value={form.type} onChange={(value) => setForm({ ...form, type: value })} options={types.slice(0, 3)} /></Field><Field label="生效周期"><Select value={form.effectiveCycle} onChange={(value) => setForm({ ...form, effectiveCycle: value })} options={['2026-08', '2026-09']} /></Field>{form.type === '推荐奖励方案' && <Field label="奖励比例"><Input type="number" min="0" max="1" step="0.01" value={form.rewardRate} onChange={(value) => setForm({ ...form, rewardRate: value })} /></Field>}</FormGrid>
      {form.type !== '推荐奖励方案' && <Alert title="默认等级">保存后将生成一个一星等级：新增活跃5人、活跃会员20人、净输赢值50,000、佣金比例30%，可在配置详情中继续演示调整。</Alert>}
    </Modal>
    <Modal open={!!selected} title={selected?.name || ''} description={`${selected?.type || ''} · ${selected?.effectiveCycle || ''} 生效`} onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭" width={760}>
      {selected?.type === '推荐奖励方案' ? <DescriptionGrid columns={2} items={[{ label: '奖励比例', value: <Percent value={selected.rewardRate} /> }, { label: '奖励基数', value: selected.rewardBase }, { label: '是否从单线佣金扣减', value: selected.deductedFromSingle ? '是' : '否，平台另行计提' }, { label: '有效期', value: '随推荐关系有效' }]} /> : <DataTable columns={[{ key: 'grade', label: '等级' }, { key: 'newActive', label: '新增活跃下限' }, { key: 'activeMembers', label: '活跃会员下限' }, { key: 'netWinLoss', label: '净输赢值下限', render: (value) => <Money value={value} /> }, { key: 'rate', label: '佣金比例', render: (value) => <Percent value={value} /> }]} rows={selected?.levels || []} rowKey="grade" />}
    </Modal>
  </>
}

function MasterSettlementPage({ onToast }) {
  const { data, dailyRemaining, submitBill, approveBill, payoutBill } = useTeamAgent()
  const [type, setType] = useState('')
  const [state, setState] = useState('')
  const [detail, setDetail] = useState(null)
  const [payout, setPayout] = useState(null)
  const [amount, setAmount] = useState('')
  const rows = data.bills.filter((bill) => (!type || bill.type === type) && (!state || bill.state === state))
  const totals = data.bills.reduce((acc, bill) => ({ payable: acc.payable + bill.payable, issued: acc.issued + bill.issued }), { payable: 0, issued: 0 })
  const columns = billColumns(onToast).slice(0, -1).concat({ key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => setDetail(row)}>详情</ActionLink>{row.state === '待提交' && <ActionLink onClick={() => showResult(submitBill(row.id), onToast)}>提交</ActionLink>}{row.state === '待审核' && <><ActionLink onClick={() => showResult(approveBill(row.id, true), onToast)}>通过</ActionLink><ActionLink onClick={() => showResult(approveBill(row.id, false), onToast)}>退回</ActionLink></>}{['待发放', '部分发放'].includes(row.state) && <ActionLink onClick={() => { setPayout(row); setAmount(String(Math.min(row.payable - row.issued, dailyRemaining))) }}>发放</ActionLink>}</div> })
  return <>
    <SectionHeader title="代理佣金结算" description="团队佣金、独立单线佣金和推荐奖励分别生成、审核和发放。" />
    <MetricGrid columns={4}><MetricCard label="账单应付合计" value={<Money value={totals.payable} />} icon={<FileDoneOutlined />} /><MetricCard label="今日成功发放" value={<Money value={data.siteQuota.successfulToday} />} tone="green" icon={<SendOutlined />} /><MetricCard label="待处理占用" value={<Money value={data.siteQuota.pendingOccupied} />} tone="orange" icon={<ClockCircleOutlined />} /><MetricCard label="站点当日剩余额度" value={<Money value={dailyRemaining} />} tone="blue" icon={<WalletOutlined />} /></MetricGrid>
    <FilterBar onSearch={() => onToast(`已查询 ${rows.length} 张账单`)} onReset={() => { setType(''); setState('') }} onExport={() => onToast('佣金结算明细已导出')}><Field label="账单类型"><Select value={type} onChange={setType} placeholder="全部类型" options={['团队佣金', '独立单线佣金', '推荐奖励']} /></Field><Field label="账单状态"><Select value={state} onChange={setState} placeholder="全部状态" options={['待提交', '待审核', '审核退回', '待发放', '部分发放', '已发放', '无佣金结转']} /></Field><Field label="结算单元"><Input placeholder="名称或编号" /></Field><Field label="佣金周期"><Select value="" placeholder="全部周期" options={['2026-07', '2026-06']} /></Field></FilterBar>
    <DataTable minWidth={1550} columns={columns} rows={rows} />
    <FormulaPanel title="平台发放上限" items={[{ label: '账单剩余', formula: '账单应付 − 累计成功发放' }, { label: '站点当日剩余额度', formula: '每日额度 − 当日成功发放 − 已占用待处理金额', value: `¥${dailyRemaining.toLocaleString()}` }, { label: '本次可发金额', formula: 'MIN（账单剩余，站点当日剩余额度）' }]} />
    <Modal open={!!detail} title={`${detail?.id || ''} · 账单详情`} description="账单审核通过后锁定关系、指标、方案和金额快照。" onClose={() => setDetail(null)} onConfirm={() => setDetail(null)} confirmText="关闭">
      {detail && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '账单类型', value: detail.type }, { label: '结算单元', value: detail.unitName }, { label: '收款方', value: detail.payee }, { label: '佣金周期', value: detail.cycle }, { label: '等级 / 比例', value: `${detail.grade} / ${(detail.rate * 100).toFixed(2)}%` }, { label: '账单状态', value: <StatusTag>{detail.state}</StatusTag> }, { label: '考核净输赢值', value: <Money value={detail.netWinLoss} signed /> }, { label: '平台应付', value: <Money value={detail.payable} /> }, { label: '累计已发', value: <Money value={detail.issued} /> }, { label: '账单剩余', value: <Money value={detail.payable - detail.issued} /> }]} />{detail.type === '推荐奖励' && <Alert title="推荐奖励计算">奖励基数为独立单线已审核应付佣金 ¥{detail.netWinLoss.toLocaleString()}，乘以 {(detail.rate * 100).toFixed(0)}%，不从独立线主佣金中扣减。</Alert>}</div>}
    </Modal>
    <Modal open={!!payout} title="发放账单" description={`${payout?.id || ''} · 收款方 ${payout?.payee || ''}`} onClose={() => setPayout(null)} onConfirm={() => showResult(payoutBill(payout.id, amount), onToast, () => setPayout(null))} confirmText="确认发放">
      {payout && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '账单剩余', value: <Money value={payout.payable - payout.issued} /> }, { label: '站点当日剩余额度', value: <Money value={dailyRemaining} /> }, { label: '本次最多可发', value: <Money value={Math.min(payout.payable - payout.issued, dailyRemaining)} /> }, { label: '当前状态', value: <StatusTag>{payout.state}</StatusTag> }]} /><Field label="本次发放金额" required><Input type="number" min="0" value={amount} onChange={setAmount} /></Field></div>}
    </Modal>
  </>
}

function MasterRecordsPage({ onToast }) {
  const { data } = useTeamAgent()
  const [tab, setTab] = useState('platform')
  return <>
    <SectionHeader title="佣金记录" description="平台应付账单与主线副线内部结算分别回放、分别对账。" />
    <Tabs items={[{ value: 'platform', label: '平台账单记录', count: data.bills.length }, { value: 'internal', label: '副线内部结算', count: data.internalSettlements.length }]} active={tab} onChange={setTab} />
    <FilterBar onSearch={() => onToast('记录已查询')} onReset={() => onToast('筛选条件已重置')} onExport={() => onToast('记录已导出')}><Field label="对象账号"><Input placeholder="收款方或副线" /></Field><Field label="所属站点"><Select value="" placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field><Field label="记录状态"><Select value="" placeholder="全部状态" options={['待审核', '待发放', '部分发放', '已发放', '成功', '处理中']} /></Field></FilterBar>
    {tab === 'platform' ? <DataTable minWidth={1450} columns={billColumns(onToast)} rows={data.bills} /> : <DataTable minWidth={1120} columns={internalColumns} rows={data.internalSettlements} />}
    <Alert title="对账边界" tone="warning">平台只对团队主线、独立线主和推荐奖励收款方承担付款责任；主线未向副线结算不形成平台欠款。</Alert>
  </>
}

function MasterRelationsPage({ onToast }) {
  const { data } = useTeamAgent()
  const [selected, setSelected] = useState(null)
  const columns = requestColumns.concat({ key: 'action', label: '操作', render: (_, row) => <ActionLink onClick={() => setSelected(row)}>查看</ActionLink> })
  return <>
    <SectionHeader title="修改代理关系记录" description="回放团队与独立单线的未来周期关系变更及冲突检查结果。" />
    <FilterBar onSearch={() => onToast('关系记录已查询')} onReset={() => onToast('筛选条件已重置')} onExport={() => onToast('关系记录已导出')}><Field label="变更类型"><Select value="" placeholder="全部类型" options={['开设副线', '副线转独立单线', '独立单线加入团队', '团队换主线', '终止独立单线']} /></Field><Field label="目标账号"><Input placeholder="申请人或结算单元" /></Field><Field label="生效周期"><Select value="" placeholder="全部周期" options={['2026-08', '2026-09']} /></Field><Field label="状态"><Select value="" placeholder="全部状态" options={['待站点复核', '已批准·待生效', '待补充资料', '审核退回']} /></Field></FilterBar>
    <DataTable minWidth={1600} columns={columns} rows={data.requests} />
    <Modal open={!!selected} title={`${selected?.id || ''} · 变更详情`} description={selected?.type} onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭">
      {selected && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '申请人', value: selected.applicant }, { label: '生效周期', value: selected.effectiveCycle }, { label: '原结算单元', value: selected.currentUnit }, { label: '目标结算单元', value: selected.targetUnit }, { label: '推荐人', value: selected.recommender }, { label: '状态', value: <StatusTag>{selected.status}</StatusTag> }, { label: '冲突检查', value: <StatusTag>{selected.conflict}</StatusTag> }, { label: '申请时间', value: selected.createdAt }]} /><Alert title="业务处理说明">{selected.note}</Alert></div>}
    </Modal>
  </>
}

function MasterReportPage({ kind, onToast }) {
  const { data } = useTeamAgent()
  if (kind === 'reversal') {
    const columns = ['site', 'agent', 'identity', 'unit', 'people', 'balance', 'level', 'member', 'direct', 'debt'].map((key, index) => ({ key, label: ['所属站点', '代理账号', '结算身份', '结算单元', '垫付人数', '垫付余额', '垫付级差佣金', '垫付会员盈利', '垫付直属佣金', '欠款额度'][index], render: index >= 5 ? (value) => <Money value={value} /> : index === 2 ? (value) => <StatusTag tone="blue">{value}</StatusTag> : undefined }))
    const rows = LEGACY_REPORT_ROWS.reversal.map((row, index) => Object.fromEntries(['site', 'agent', 'identity', 'unit', 'people', 'balance', 'level', 'member', 'direct', 'debt'].map((key, cell) => [key, row[cell]]).concat([['id', index]])))
    return <><SectionHeader title="冲正统计报表" description="保留原冲正口径，并补充团队身份与结算单元识别。" /><MetricGrid columns={4}><MetricCard label="总垫付代理数" value="18" /><MetricCard label="总欠款人数" value="34" /><MetricCard label="总垫付额度" value={<Money value={181210.41} />} tone="green" /><MetricCard label="总欠款额度" value={<Money value={96344.85} />} tone="orange" /></MetricGrid><FilterBar onSearch={() => onToast('冲正统计已查询')} onReset={() => onToast('筛选条件已重置')} onExport={() => onToast('冲正统计已导出')}><Field label="所属站点"><Select value="" placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field><Field label="结算模式"><Select value="" placeholder="全部模式" options={['团队模式', '独立单线', '原代理模式']} /></Field><Field label="搜索代理"><Input placeholder="名称或ID" /></Field></FilterBar><DataTable columns={columns} rows={rows} /></>
  }
  if (kind === 'returns') {
    const keys = ['site', 'agent', 'identity', 'type', 'flow', 'amount', 'gap', 'ledger', 'time']
    const columns = keys.map((key, index) => ({ key, label: ['所属站点', '代理账号', '结算身份', '类型', '垫付/回款', '额度', '额度缺口', '冲正账目ID', '时间'][index], render: index === 2 ? (value) => <StatusTag tone="blue">{value}</StatusTag> : index === 4 ? (value) => <StatusTag>{value}</StatusTag> : [5, 6].includes(index) ? (value) => <Money value={value} /> : undefined }))
    const rows = LEGACY_REPORT_ROWS.returns.map((row, index) => Object.fromEntries(keys.map((key, cell) => [key, row[cell]]).concat([['id', index]])))
    return <><SectionHeader title="冲正回款报表" description="查看代理冲正和后续回款明细，团队关系不改变原台账责任。" /><FilterBar onSearch={() => onToast('冲正回款已查询')} onReset={() => onToast('筛选条件已重置')} onExport={() => onToast('冲正回款已导出')}><Field label="结算身份"><Select value="" placeholder="全部身份" options={['团队主线', '团队副线', '独立线主', '原代理模式']} /></Field><Field label="垫付/回款"><Select value="" placeholder="全部" options={['垫付', '回款']} /></Field><Field label="搜索代理"><Input placeholder="名称或ID" /></Field></FilterBar><DataTable columns={columns} rows={rows} /></>
  }
  if (kind === 'revenue') {
    const rows = [
      ...data.teams.map((team) => ({ id: team.id, mode: '团队模式', unit: team.name, owner: team.mainAgent, newActive: team.metrics.newActive, active: team.metrics.activeMembers, net: team.metrics.assessmentNet, grade: team.metrics.grade, commission: team.metrics.payable, balance: team.cumulativeReceived })),
      ...data.singles.map((single) => ({ id: single.id, mode: '独立单线', unit: single.name, owner: single.owner, newActive: single.metrics.newActive, active: single.metrics.activeMembers, net: single.metrics.assessmentNet, grade: single.metrics.grade, commission: single.metrics.payable, balance: data.agents.find((agent) => agent.account === single.owner)?.balance || 0 })),
    ]
    const columns = [{ key: 'mode', label: '结算模式', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'unit', label: '结算单元' }, { key: 'owner', label: '收款负责人' }, { key: 'newActive', label: '新增活跃' }, { key: 'active', label: '活跃会员' }, { key: 'net', label: '考核净输赢值', render: (value) => <Money value={value} signed /> }, { key: 'grade', label: '等级' }, { key: 'commission', label: '本期应付佣金', render: (value) => <Money value={value} /> }, { key: 'balance', label: '当前余额', render: (value) => <Money value={value} /> }]
    return <><SectionHeader title="代理收益看板" description="按结算单元展示团队合并和独立单线的经营结果。" /><FilterBar onSearch={() => onToast('收益数据已刷新')} onReset={() => onToast('筛选条件已重置')} onExport={() => onToast('收益数据已导出')}><Field label="结算模式"><Select value="" placeholder="全部模式" options={['团队模式', '独立单线']} /></Field><Field label="结算单元"><Input placeholder="名称或编号" /></Field></FilterBar><DataTable columns={columns} rows={rows} /></>
  }
  return null
}

function MasterCyclePage({ onToast }) {
  const [cycle, setCycle] = useState('月结算')
  return <><SectionHeader title="结算周期设置" description="配置佣金账单生成时间，团队关系与方案只从未来完整周期生效。" actions={<Button onClick={() => onToast('结算周期设置已保存')}>保存设置</Button>} /><Panel title="站点结算周期" description="当前查看：旺财体育"><div className="ta-choice-grid"><button className={cycle === '周结算' ? 'active' : ''} onClick={() => setCycle('周结算')}><CalendarOutlined /><strong>周结算</strong><span>每周固定日期结算上周佣金</span></button><button className={cycle === '月结算' ? 'active' : ''} onClick={() => setCycle('月结算')}><CalendarOutlined /><strong>月结算</strong><span>每月固定日期结算上月佣金</span></button></div><DescriptionGrid items={[{ label: '当前周期', value: cycle }, { label: '执行频率', value: cycle === '月结算' ? '每月一次' : '每周一次' }, { label: '执行时间', value: '02:00' }, { label: '下一次执行', value: cycle === '月结算' ? '2026-08-01 02:00' : '2026-07-20 02:00' }]} /></Panel><Alert title="团队代理生效规则">开副线、转独立单线、加入团队、换主线以及方案和推荐关系变更，只能选择尚未开始的完整周期。</Alert></>
}

export function MasterPage({ page, navigate, onToast }) {
  if (page === 'agents') return <MasterAgentsPage navigate={navigate} onToast={onToast} />
  if (page === 'teams') return <MasterTeamsPage onToast={onToast} />
  if (page === 'singles') return <MasterSinglesPage onToast={onToast} />
  if (page === 'plans') return <MasterPlansPage onToast={onToast} />
  if (page === 'settlement') return <MasterSettlementPage onToast={onToast} />
  if (page === 'records') return <MasterRecordsPage onToast={onToast} />
  if (page === 'relations') return <MasterRelationsPage onToast={onToast} />
  if (page === 'cycle') return <MasterCyclePage onToast={onToast} />
  if (['reversal', 'returns', 'revenue'].includes(page)) return <MasterReportPage kind={page} onToast={onToast} />
  return <MasterAgentsPage navigate={navigate} onToast={onToast} />
}
