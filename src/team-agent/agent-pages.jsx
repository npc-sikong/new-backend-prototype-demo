import { useState } from 'react'
import {
  ApartmentOutlined,
  BankOutlined,
  FileDoneOutlined,
  PlusOutlined,
  SendOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { useTeamAgent } from './context'
import {
  Alert,
  Button,
  DataTable,
  DescriptionGrid,
  EmptyState,
  Field,
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

const ROLES = {
  main: { label: '主管主线', account: 'gaodashang', subtitle: '代理1部唯一平台收款方', icon: <ApartmentOutlined /> },
  secondary: { label: '副线负责人', account: 'WC002', subtitle: '代理1部 / LINE-B', icon: <TeamOutlined /> },
  independent: { label: '独立线主', account: 'dailiwc001', subtitle: '独立单线01', icon: <BankOutlined /> },
}

function show(result, onToast, onSuccess) {
  onToast(result.message, result.ok ? 'success' : 'error')
  if (result.ok) onSuccess?.()
}

function Link({ children, onClick }) {
  return <button className="ta-table-link" onClick={onClick}>{children}</button>
}

export function AgentRoleBar({ role, setRole }) {
  return <div className="ta-role-bar"><div><span>演示身份</span><strong>{ROLES[role].account}</strong><small>{ROLES[role].subtitle}</small></div><div className="ta-role-options">{Object.entries(ROLES).map(([key, item]) => <button key={key} className={role === key ? 'active' : ''} onClick={() => setRole(key)}><i>{item.icon}</i><span><b>{item.label}</b><small>{item.account}</small></span></button>)}</div></div>
}

function MainDashboard({ onToast }) {
  const { data, addSecondary, addInternalSettlement, requestChange, teamAvailableBalance } = useTeamAgent()
  const team = data.teams.find((item) => item.id === 'TEAM-001')
  const [modal, setModal] = useState(null)
  const [secondary, setSecondary] = useState({ agent: '', scope: '', startCycle: '2026-08' })
  const [settle, setSettle] = useState({ secondaryAgent: 'WC002', amount: '', basis: '固定金额', source: '平台已到账余额' })
  const [transfer, setTransfer] = useState({ agent: 'LGNB', effectiveCycle: '2026-08' })
  const close = () => setModal(null)
  return <>
    <SectionHeader title="团队经营看板" description={`${team.name} · 当前主线 ${team.mainAgent} · 团队合并考核`} actions={<><Button icon={<PlusOutlined />} onClick={() => setModal('secondary')}>开设副线</Button><Button icon={<WalletOutlined />} variant="success" onClick={() => setModal('settle')}>副线结算</Button><Button icon={<SwapOutlined />} variant="ghost" onClick={() => setModal('transfer')}>转独立单线</Button></>} />
    <MetricGrid columns={4}><MetricCard label="本期团队等级" value={team.metrics.grade} helper={`${(team.metrics.rate * 100).toFixed(0)}% 佣金比例`} tone="blue" /><MetricCard label="平台应付团队佣金" value={<Money value={team.metrics.payable} />} helper="平台只向当前主线支付" tone="green" /><MetricCard label="主线团队可用余额" value={<Money value={teamAvailableBalance(team.id)} />} helper="实际到账扣减占用后" icon={<WalletOutlined />} /><MetricCard label="团队有效副线" value={team.lines.filter((line) => line.identity === '副线').length} helper="合并参与统一考核" tone="orange" /></MetricGrid>
    <Panel title="团队考核进度" description="三个条件必须同时达到，命中当前可满足的最高等级。"><div className="ta-progress-grid"><Progress label="新增活跃会员" value={team.metrics.newActive} target={35} /><Progress label="活跃会员数量" value={team.metrics.activeMembers} target={120} /><Progress label="考核净输赢值" value={team.metrics.assessmentNet} target={400000} money /></div></Panel>
    <Panel title="主副线经营数据" description="可查看各副线业绩，但副线结算金额由主线自主决定。"><DataTable columns={[{ key: 'identity', label: '身份', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'lineId', label: 'line_id' }, { key: 'agent', label: '负责人' }, { key: 'newActive', label: '新增活跃' }, { key: 'activeMembers', label: '活跃会员' }, { key: 'netWinLoss', label: '净输赢值', render: (value) => <Money value={value} signed /> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }]} rows={team.lines} rowKey="lineId" /></Panel>
    <Alert title="主线权限与责任" tone="warning">您可开设副线、查看团队合并与各线数据、收取团队佣金并自主结算副线；不得改写历史关系快照或透支未到账团队佣金。</Alert>
    <Modal open={modal === 'secondary'} title="开设团队副线" description="主线提交后由站点按当前开关复核。" onClose={close} onConfirm={() => show(addSecondary(team.id, { ...secondary, requireReview: true }), onToast, close)}>
      <FormGrid><Field label="副线负责人" required><Input value={secondary.agent} onChange={(value) => setSecondary({ ...secondary, agent: value })} placeholder="代理账号" /></Field><Field label="生效周期"><Select value={secondary.startCycle} onChange={(value) => setSecondary({ ...secondary, startCycle: value })} options={['2026-08', '2026-09']} /></Field><Field label="业务范围" className="ta-field-full"><Input value={secondary.scope} onChange={(value) => setSecondary({ ...secondary, scope: value })} placeholder="代理节点及直属会员" /></Field></FormGrid>
    </Modal>
    <Modal open={modal === 'settle'} title="向副线内部结算" description={`团队可用余额 ¥${teamAvailableBalance(team.id).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`} onClose={close} onConfirm={() => show(addInternalSettlement({ teamId: team.id, ...settle }), onToast, close)}>
      <FormGrid><Field label="收款副线"><Select value={settle.secondaryAgent} onChange={(value) => setSettle({ ...settle, secondaryAgent: value })} options={team.lines.filter((line) => line.identity === '副线').map((line) => line.agent)} /></Field><Field label="结算金额" required><Input type="number" value={settle.amount} onChange={(value) => setSettle({ ...settle, amount: value })} /></Field><Field label="结算依据"><Select value={settle.basis} onChange={(value) => setSettle({ ...settle, basis: value })} options={['固定金额', '内部比例', '参考副线业绩', '其他约定']} /></Field><Field label="资金来源"><Select value={settle.source} onChange={(value) => setSettle({ ...settle, source: value })} options={['平台已到账余额', '主线自有资金', '线下资金']} /></Field></FormGrid>
      <Alert title="结算边界">系统不按贡献比例计算副线应分金额，主线录入金额不改变团队平台账单。</Alert>
    </Modal>
    <Modal open={modal === 'transfer'} title="副线转独立单线" description="当前周期继续并入团队，下一完整周期开始独立考核。" onClose={close} onConfirm={() => show(requestChange({ type: '副线转独立单线', applicant: transfer.agent, currentUnit: `${team.name} / ${team.lines.find((line) => line.agent === transfer.agent)?.lineId || '待确认'}`, targetUnit: `${transfer.agent} 独立单线`, effectiveCycle: transfer.effectiveCycle, recommender: team.mainAgent }), onToast, close)}>
      <FormGrid><Field label="目标副线"><Select value={transfer.agent} onChange={(value) => setTransfer({ ...transfer, agent: value })} options={team.lines.filter((line) => line.identity === '副线').map((line) => line.agent)} /></Field><Field label="生效周期"><Select value={transfer.effectiveCycle} onChange={(value) => setTransfer({ ...transfer, effectiveCycle: value })} options={['2026-08', '2026-09']} /></Field><Field label="默认推荐人"><Input value={team.mainAgent} disabled /></Field></FormGrid>
    </Modal>
  </>
}

function Progress({ label, value, target, money = false }) {
  const percent = Math.min(100, Math.round((value / target) * 100))
  return <div className="ta-progress"><div><span>{label}</span><b>{money ? `¥${value.toLocaleString()}` : value} / {money ? `¥${target.toLocaleString()}` : target}</b></div><div><i style={{ width: `${percent}%` }} /></div><small>{percent >= 100 ? '已满足当前等级门槛' : `完成 ${percent}%`}</small></div>
}

function SecondaryDashboard({ onToast }) {
  const { data, requestChange } = useTeamAgent()
  const team = data.teams.find((item) => item.id === 'TEAM-001')
  const line = team.lines.find((item) => item.agent === 'WC002')
  const records = data.internalSettlements.filter((item) => item.secondaryAgent === 'WC002')
  const request = data.requests.find((item) => item.applicant === 'WC002' && item.type === '副线转独立单线')
  return <>
    <SectionHeader title="我的副线经营" description={`${team.name} / ${line.lineId} · 当前周期并入团队统一考核`} actions={<Button icon={<SwapOutlined />} onClick={() => show(requestChange({ type: '副线转独立单线', applicant: 'WC002', currentUnit: `${team.name} / ${line.lineId}`, targetUnit: 'WC002 独立单线', recommender: team.mainAgent }), onToast)}>申请转独立单线</Button>} />
    <MetricGrid columns={4}><MetricCard label="我的新增活跃" value={line.newActive} helper="仅本人 line_id 范围" tone="blue" /><MetricCard label="我的活跃会员" value={line.activeMembers} helper="仅供经营参考" /><MetricCard label="我的净输赢值" value={<Money value={line.netWinLoss} />} helper="并入团队合并结果" tone="green" /><MetricCard label="收到内部结算" value={<Money value={records.filter((item) => item.state === '成功').reduce((sum, item) => sum + item.amount, 0)} />} helper="由主线自主决定" tone="orange" /></MetricGrid>
    <Alert title="团队副线结算边界" tone="warning">当前身份不会生成平台应付佣金账单，也不能查看其他副线内部结算或主线团队可用余额。您只能查看本人经营数据和主线向本人的结算记录。</Alert>
    <Panel title="我的内部结算记录" description="平台不对副线直接付款。"><DataTable columns={[{ key: 'id', label: '结算单号' }, { key: 'cycle', label: '周期' }, { key: 'amount', label: '结算金额', render: (value) => <Money value={value} /> }, { key: 'basis', label: '结算依据' }, { key: 'source', label: '资金来源' }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'createdAt', label: '时间' }]} rows={records} /></Panel>
    <Panel title="独立申请进度"><DescriptionGrid columns={3} items={[{ label: '申请类型', value: request?.type || '未申请' }, { label: '目标生效周期', value: request?.effectiveCycle || '—' }, { label: '当前状态', value: request ? <StatusTag>{request.status}</StatusTag> : '—' }, { label: '默认推荐人', value: request?.recommender || '—' }, { label: '冲突检查', value: request ? <StatusTag>{request.conflict}</StatusTag> : '—' }, { label: '当前周期处理', value: '继续并入代理1部' }]} /></Panel>
  </>
}

function IndependentDashboard({ onToast }) {
  const { data, requestChange } = useTeamAgent()
  const single = data.singles.find((item) => item.owner === 'dailiwc001')
  const bill = data.bills.find((item) => item.unitId === single.id && item.type === '独立单线佣金')
  const reward = data.bills.find((item) => item.unitId === single.id && item.type === '推荐奖励')
  return <>
    <SectionHeader title="独立单线经营看板" description={`${single.name} · 独立考核、独立定级、平台直接结算`} actions={<><Button icon={<TeamOutlined />} onClick={() => show(requestChange({ type: '独立单线加入团队', applicant: single.owner, currentUnit: single.name, targetUnit: '代理2部 / 待分配 line_id' }), onToast)}>申请加入团队</Button><Button variant="ghost" onClick={() => show(requestChange({ type: '终止独立单线', applicant: single.owner, currentUnit: single.name, targetUnit: '终止', recommender: single.recommender }), onToast)}>申请终止</Button></>} />
    <MetricGrid columns={4}><MetricCard label="当前等级" value={single.metrics.grade} helper={`${(single.metrics.rate * 100).toFixed(0)}% 佣金比例`} tone="blue" /><MetricCard label="考核净输赢值" value={<Money value={single.metrics.assessmentNet} />} helper="本单线独立范围" tone="green" /><MetricCard label="平台应付佣金" value={<Money value={bill?.payable || 0} />} helper="直接发给独立线主" icon={<WalletOutlined />} /><MetricCard label="账单状态" value={bill?.state || '待生成'} helper={`已发 ¥${(bill?.issued || 0).toLocaleString()}`} tone="orange" /></MetricGrid>
    <Panel title="独立考核指标"><div className="ta-progress-grid"><Progress label="新增活跃会员" value={single.metrics.newActive} target={12} /><Progress label="活跃会员数量" value={single.metrics.activeMembers} target={45} /><Progress label="考核净输赢值" value={single.metrics.assessmentNet} target={160000} money /></div></Panel>
    <DescriptionGrid items={[{ label: '创建来源', value: single.source }, { label: '佣金方案', value: single.plan }, { label: '推荐主线', value: single.recommender }, { label: '推荐奖励方案', value: single.rewardPlan }, { label: '推荐奖励金额', value: <Money value={reward?.payable || 0} /> }, { label: '单线佣金是否被扣减', value: '否，平台另行计提奖励' }]} />
    <FormulaPanel title="独立单线与推荐奖励" items={[{ label: '独立单线应付佣金', formula: '可计佣净输赢值 × 40%', value: `¥${single.metrics.payable.toLocaleString()}` }, { label: '推荐奖励', formula: '已审核应付佣金 × 10%', value: `¥${(reward?.payable || 0).toLocaleString()}` }]} warning="独立单线加入团队后，从加入生效周期停止推荐奖励；历史账单保持不变。" />
  </>
}

function AgentDashboard({ role, onToast }) {
  if (role === 'main') return <MainDashboard onToast={onToast} />
  if (role === 'secondary') return <SecondaryDashboard onToast={onToast} />
  return <IndependentDashboard onToast={onToast} />
}

function AgentBills({ role }) {
  const { data } = useTeamAgent()
  if (role === 'secondary') {
    const rows = data.internalSettlements.filter((item) => item.secondaryAgent === 'WC002')
    return <><SectionHeader title="我的结算记录" description="团队副线不产生平台应付账单，仅查看主线向本人的内部结算。" /><Alert title="平台账单权限" tone="warning">当前身份没有平台应付佣金账单；团队账单唯一收款方为主管主线。</Alert><DataTable columns={[{ key: 'id', label: '内部结算单号' }, { key: 'cycle', label: '周期' }, { key: 'mainAgent', label: '付款主线' }, { key: 'amount', label: '金额', render: (value) => <Money value={value} /> }, { key: 'basis', label: '结算依据' }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'createdAt', label: '时间' }]} rows={rows} /></>
  }
  const account = role === 'main' ? 'gaodashang' : 'dailiwc001'
  const rows = data.bills.filter((bill) => bill.payee === account)
  return <><SectionHeader title="我的佣金账单" description={role === 'main' ? '查看平台向当前主线支付的团队佣金账单。' : '查看平台直接向独立线主支付的单线佣金账单。'} /><DataTable minWidth={1080} columns={[{ key: 'id', label: '账单编号' }, { key: 'type', label: '账单类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'unitName', label: '结算单元' }, { key: 'cycle', label: '周期' }, { key: 'grade', label: '等级' }, { key: 'rate', label: '比例', render: (value) => <Percent value={value} /> }, { key: 'payable', label: '应付', render: (value) => <Money value={value} /> }, { key: 'issued', label: '已发', render: (value) => <Money value={value} /> }, { key: 'remaining', label: '剩余', render: (_, row) => <Money value={row.payable - row.issued} /> }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }]} rows={rows} /></>
}

function AgentInternal({ role, onToast }) {
  const { data, addInternalSettlement, teamAvailableBalance } = useTeamAgent()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ secondaryAgent: 'WC002', amount: '', basis: '固定金额', source: '平台已到账余额' })
  if (role === 'independent') return <><SectionHeader title="副线内部结算" description="独立线主由平台直接结算，不参与团队副线内部结算。" /><EmptyState title="当前身份不适用" description="如未来加入团队并成为副线，将在此查看主线向本人的结算记录。" /></>
  const rows = role === 'main' ? data.internalSettlements : data.internalSettlements.filter((item) => item.secondaryAgent === 'WC002')
  return <>
    <SectionHeader title="副线内部结算" description={role === 'main' ? '主线自主决定副线结算金额，并受实际到账可用余额控制。' : '仅查看主线向本人副线的结算记录。'} actions={role === 'main' && <Button icon={<WalletOutlined />} onClick={() => setShowModal(true)}>新增内部结算</Button>} />
    {role === 'main' && <MetricGrid columns={4}><MetricCard label="团队可用余额" value={<Money value={teamAvailableBalance('TEAM-001')} />} tone="blue" /><MetricCard label="成功内部转账" value={<Money value={data.teams[0].successfulTransfers} />} tone="green" /><MetricCard label="处理中占用" value={<Money value={data.teams[0].processingOccupied} />} tone="orange" /><MetricCard label="其他扣减" value={<Money value={data.teams[0].otherDeductions} />} /></MetricGrid>}
    <DataTable minWidth={1100} columns={[{ key: 'id', label: '结算单号' }, { key: 'secondaryAgent', label: '收款副线' }, { key: 'cycle', label: '周期' }, { key: 'amount', label: '金额', render: (value) => <Money value={value} /> }, { key: 'basis', label: '结算依据' }, { key: 'source', label: '资金来源' }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'voucher', label: '备注 / 凭证' }, { key: 'createdAt', label: '时间' }]} rows={rows} />
    <Modal open={showModal} title="新增副线内部结算" description={`当前可用余额 ¥${teamAvailableBalance('TEAM-001').toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`} onClose={() => setShowModal(false)} onConfirm={() => show(addInternalSettlement({ teamId: 'TEAM-001', ...form }), onToast, () => setShowModal(false))}>
      <FormGrid><Field label="收款副线"><Select value={form.secondaryAgent} onChange={(value) => setForm({ ...form, secondaryAgent: value })} options={['WC002', 'LGNB']} /></Field><Field label="结算金额" required><Input type="number" value={form.amount} onChange={(value) => setForm({ ...form, amount: value })} /></Field><Field label="结算依据"><Select value={form.basis} onChange={(value) => setForm({ ...form, basis: value })} options={['固定金额', '内部比例', '参考副线业绩', '其他约定']} /></Field><Field label="资金来源"><Select value={form.source} onChange={(value) => setForm({ ...form, source: value })} options={['平台已到账余额', '主线自有资金', '线下资金']} /></Field></FormGrid>
    </Modal>
  </>
}

function AgentRequests({ role, onToast }) {
  const { data, requestChange } = useTeamAgent()
  const account = ROLES[role].account
  const rows = role === 'main' ? data.requests.filter((request) => request.currentUnit.includes('代理1部') || request.targetUnit.includes('代理1部')) : data.requests.filter((request) => request.applicant === account)
  function createDefaultRequest() {
    if (role === 'main') return requestChange({ type: '开设副线', applicant: account, currentUnit: '代理1部 / gaodashang', targetUnit: '代理1部 / 待分配 line_id' })
    if (role === 'secondary') return requestChange({ type: '副线转独立单线', applicant: account, currentUnit: '代理1部 / LINE-B', targetUnit: 'WC002 独立单线', recommender: 'gaodashang' })
    return requestChange({ type: '独立单线加入团队', applicant: account, currentUnit: '独立单线01', targetUnit: '代理2部 / 待分配 line_id' })
  }
  return <>
    <SectionHeader title="关系与模式申请" description="所有关系申请从下一完整周期生效，当前周期继续按原结算单元处理。" actions={<Button icon={<SendOutlined />} onClick={() => show(createDefaultRequest(), onToast)}>发起当前身份申请</Button>} />
    <DataTable minWidth={1300} columns={[{ key: 'id', label: '申请编号' }, { key: 'type', label: '申请类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'currentUnit', label: '原结算单元' }, { key: 'targetUnit', label: '目标结算单元' }, { key: 'effectiveCycle', label: '生效周期' }, { key: 'recommender', label: '推荐人' }, { key: 'conflict', label: '冲突检查', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'createdAt', label: '申请时间' }, { key: 'note', label: '说明' }]} rows={rows} />
    <Alert title="历史保护">申请批准后会同时保存原关系失效版本和新结算单元生效版本，历史团队、账单和推荐奖励不回写。</Alert>
  </>
}

export function AgentPage({ page, role, setRole, onToast }) {
  return <><AgentRoleBar role={role} setRole={setRole} />{page === 'dashboard' ? <AgentDashboard role={role} onToast={onToast} /> : page === 'bills' ? <AgentBills role={role} /> : page === 'internal' ? <AgentInternal role={role} onToast={onToast} /> : <AgentRequests role={role} onToast={onToast} />}</>
}
