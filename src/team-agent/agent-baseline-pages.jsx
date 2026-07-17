import { useMemo, useState } from 'react'
import { EyeOutlined, FileDoneOutlined, SwapOutlined, TeamOutlined, WalletOutlined } from '@ant-design/icons'
import { useTeamAgent } from './context'
import {
  Alert,
  Button,
  DataTable,
  DescriptionGrid,
  Field,
  FilterBar,
  FormulaPanel,
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

const ROLE_META = {
  main: { account: 'gaodashang', label: '团队负责人', identity: '团队负责人', unit: 'gaodashang01部', lineId: 'LINE-A' },
  secondary: { account: 'WC002', label: '副线', identity: '副线', unit: 'gaodashang01部', lineId: 'LINE-B' },
  independent: { account: 'dailiwc001', label: '独立线主', identity: '独立线主', unit: '独立单线01', lineId: 'SINGLE-001' },
}

function Link({ children, onClick }) {
  return <button className="ta-table-link" onClick={onClick}>{children}</button>
}

function agentIdentityDisplay(agent) {
  return ['官方代理', '普通代理'].includes(agent.teamAgentType) ? agent.teamAgentType : '普通代理'
}

function roleAgents(data, role) {
  const meta = ROLE_META[role] || ROLE_META.main
  const current = data.agents.find((item) => item.account === meta.account)
  if (!current) return []
  if (role === 'main') {
    const team = data.teams.find((item) => item.mainAgent === meta.account)
    const accounts = new Set([meta.account, ...(team?.lines || []).map((line) => line.agent), ...(current.subAgentDetails || []).map((item) => item.account)])
    return data.agents.filter((item) => accounts.has(item.account)).map((item) => ({ ...item, treeLevel: item.account === meta.account ? '当前账号' : item.identity === '副线' ? '团队副线' : '直属下级' }))
  }
  const children = (current.subAgentDetails || []).map((item) => data.agents.find((agent) => agent.account === item.account) || {
    ...item, site: current.site, parent: current.account, model: current.model, settlementMode: '随上级代理', identity: '下级代理', unit: current.unit, lineId: current.lineId,
    effectiveCycle: current.effectiveCycle, members: 0, activeMembers: 0, status: '启用', balance: 0,
  })
  return [{ ...current, treeLevel: '当前账号' }, ...children.map((item) => ({ ...item, treeLevel: '直属下级' }))]
}

function relationshipRows(data, account) {
  const requests = data.requests.filter((item) => item.applicant === account || item.recommender === account || String(item.currentUnit).includes(account) || String(item.targetUnit).includes(account)).map((item) => ({
    id: item.id, type: item.type, currentUnit: item.currentUnit, targetUnit: item.targetUnit, effectiveCycle: item.effectiveCycle, balanceHandling: item.balanceHandling, status: item.status, operator: item.applicant, createdAt: item.createdAt,
  }))
  const operations = data.teamOperations.filter((item) => item.mainAccount === account || String(item.secondaryAccounts).includes(account)).map((item) => ({
    id: item.id, type: item.action, currentUnit: item.teamName, targetUnit: item.teamName, effectiveCycle: item.effectiveCycle || '历史已生效', balanceHandling: '按操作发生时的结算单元保留', status: '已记录', operator: item.operator, createdAt: item.createdAt,
  }))
  return [...requests, ...operations].sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
}

function DownlinePage({ role, onToast, onNavigate }) {
  const { data } = useTeamAgent()
  const meta = ROLE_META[role] || ROLE_META.main
  const source = useMemo(() => roleAgents(data, role), [data, role])
  const [filters, setFilters] = useState({ keyword: '', status: '', model: '' })
  const [selected, setSelected] = useState(null)
  const [tab, setTab] = useState('base')
  const rows = source.filter((item) => (!filters.keyword || `${item.account} ${item.id} ${item.parent}`.toLowerCase().includes(filters.keyword.toLowerCase())) && (!filters.status || item.status === filters.status) && (!filters.model || item.model === filters.model))
  const columns = [
    { key: 'treeLevel', label: '关系层级', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'id', label: '代理ID' }, { key: 'account', label: '代理账号', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'agentIdentity', label: '代理身份', render: (_, row) => <StatusTag tone="blue">{agentIdentityDisplay(row)}</StatusTag> }, { key: 'parent', label: '上级代理' },
    { key: 'model', label: '代理模型' }, { key: 'settlementMode', label: '结算模式' }, { key: 'identity', label: '代理层级', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'unit', label: '结算单元' }, { key: 'lineId', label: 'line_id' }, { key: 'effectiveCycle', label: '生效周期' }, { key: 'members', label: '会员数' }, { key: 'activeMembers', label: '活跃会员' },
    { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'action', label: '操作', render: (_, row) => <Link onClick={() => { setSelected(row); setTab('base') }}><EyeOutlined /> 详情</Link> },
  ]
  const histories = selected ? relationshipRows(data, selected.account) : []
  return <>
    <SectionHeader title="代理列表" description={`${meta.label} ${meta.account} 仅查看本人及授权下级的代理树、经营归属和关系版本。`} actions={<Button icon={<SwapOutlined />} variant="ghost" onClick={() => onNavigate?.('requests')}>关系与模式申请</Button>} />
    {role !== 'main' && <Alert title="查看范围">当前身份仅显示本人节点及直属下级，不展示其他副线或其他独立单线数据。</Alert>}
    <FilterBar onSearch={() => onToast?.(`已查询到 ${rows.length} 条代理记录`)} onReset={() => setFilters({ keyword: '', status: '', model: '' })} onExport={() => onToast?.(`已生成 ${rows.length} 条下级代理导出演示`)}>
      <Field label="代理账号"><Input value={filters.keyword} onChange={(keyword) => setFilters({ ...filters, keyword })} placeholder="代理ID、账号或上级" /></Field>
      <Field label="代理状态"><Select value={filters.status} onChange={(status) => setFilters({ ...filters, status })} placeholder="全部状态" options={['启用', '停用']} /></Field>
      <Field label="代理模型"><Select value={filters.model} onChange={(model) => setFilters({ ...filters, model })} placeholder="全部模型" options={['负盈利模式', '普通代理']} /></Field>
      <Field label="代理层级"><Input value={meta.identity} disabled /></Field>
      <Field label="结算单元"><Input value={meta.unit} disabled /></Field>
      <Field label="生效周期"><Input value="2026-07" disabled /></Field>
    </FilterBar>
    <DataTable minWidth={1900} columns={columns} rows={rows} paginated />
    <Modal open={!!selected} title={`${selected?.account || ''} · 代理详情`} description="关系变更历史保留在代理详情页签，不另建重复菜单。" onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭" showCancel={false} width={980}>
      <Tabs active={tab} onChange={setTab} items={[{ value: 'base', label: '代理资料' }, { value: 'relations', label: '关系变更历史', count: histories.length }]} />
      {selected && tab === 'base' && <DescriptionGrid columns={3} items={[
        { label: '代理ID / 账号', value: `${selected.id} / ${selected.account}` }, { label: '代理模型', value: selected.model }, { label: '代理状态', value: <StatusTag>{selected.status}</StatusTag> },
        { label: '上级代理', value: selected.parent }, { label: '结算模式', value: selected.settlementMode }, { label: '代理身份', value: <StatusTag tone="blue">{agentIdentityDisplay(selected)}</StatusTag> },
        { label: '代理层级', value: selected.identity }, { label: '结算单元', value: selected.unit }, { label: 'line_id', value: selected.lineId },
        { label: '生效周期', value: selected.effectiveCycle },
        { label: '下属代理', value: selected.subAgents || 0 }, { label: '下属会员', value: selected.members || 0 }, { label: '活跃会员', value: selected.activeMembers || 0 },
        { label: '代理余额', value: <Money value={selected.balance} /> }, { label: '有效投注', value: <Money value={selected.validBetting} /> }, { label: '总输赢', value: <Money value={selected.totalWinLoss} signed /> },
      ]} />}
      {selected && tab === 'relations' && <><Alert title="历史保护">未来周期关系变化不回写当前周期和历史账单；列表按变更时间倒序展示。</Alert><DataTable minWidth={1300} columns={[
        { key: 'id', label: '记录编号' }, { key: 'type', label: '关系事件' }, { key: 'currentUnit', label: '原结算单元' }, { key: 'targetUnit', label: '目标结算单元' }, { key: 'effectiveCycle', label: '生效周期' }, { key: 'balanceHandling', label: '当月结余处理' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'operator', label: '操作人' }, { key: 'createdAt', label: '时间' },
      ]} rows={histories} paginated /></>}
    </Modal>
  </>
}

function ReadonlyPlansPage({ role }) {
  const { data } = useTeamAgent()
  const meta = ROLE_META[role] || ROLE_META.main
  const type = role === 'independent' ? '独立单线方案' : '团队佣金方案'
  const rows = data.plans.filter((item) => item.type === type || (role === 'independent' && item.type === '推荐奖励方案'))
  const [selected, setSelected] = useState(null)
  const columns = [
    { key: 'id', label: '方案编号' }, { key: 'name', label: '方案名称', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'type', label: '方案类型' },
    { key: 'effectiveCycle', label: '生效周期' }, { key: 'rewardRate', label: '奖励比例', render: (value, row) => row.type === '推荐奖励方案' ? <Percent value={value} /> : '—' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <Link onClick={() => setSelected(row)}>查看方案</Link> },
  ]
  return <>
    <SectionHeader title="佣金方案" description={`${meta.account} 当前结算身份可查看的生效方案；代理端为只读展示。`} />
    <Alert title="只读边界" tone="warning">方案门槛由总控维护，站点只选择本站生效方案，代理端不能新增、修改或删除；变更仅影响未来完整周期。</Alert>
    <DescriptionGrid columns={3} items={[{ label: '当前身份', value: meta.label }, { label: '当前结算单元', value: meta.unit }, { label: '当前方案', value: role === 'independent' ? data.siteCommissionConfig.singlePlan : data.siteCommissionConfig.teamPlan }]} />
    <DataTable minWidth={1100} columns={columns} rows={rows} paginated />
    <Panel title="当前活跃定义与代理成本" description="佣金账单统一引用站点当期配置。">
      <DataTable columns={[
        { key: 'name', label: '项目' }, { key: 'method', label: '计算/认定方式', render: (value, row) => value || `充值 ≥ ¥${row.depositThreshold} 且有效投注 ≥ ¥${row.validBetThreshold}` }, { key: 'value', label: '当前值', render: (value, row) => value || row.period }, { key: 'effectiveCycle', label: '生效周期', render: (value) => value || '2026-07' },
      ]} rows={[...data.activityDefinitions, ...data.agentCosts]} rowKey="id" />
    </Panel>
    <Modal open={!!selected} title={`${selected?.name || ''} · 方案详情`} description="查看当前方案等级门槛或推荐奖励口径。" onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭" showCancel={false} width={900}>
      {selected?.type === '推荐奖励方案' ? <DescriptionGrid columns={2} items={[{ label: '奖励基数', value: selected.rewardBase }, { label: '奖励比例', value: <Percent value={selected.rewardRate} /> }, { label: '是否扣减线主佣金', value: selected.deductedFromSingle ? '是' : '否' }, { label: '生效周期', value: selected.effectiveCycle }]} /> : <DataTable columns={[
        { key: 'grade', label: '等级' }, { key: 'newActive', label: '新增活跃会员' }, { key: 'firstDepositMembers', label: '首充人数' }, { key: 'firstDepositAmount', label: '首充额度', render: (value) => <Money value={value} /> }, { key: 'activeMembers', label: '活跃会员' }, { key: 'netWinLoss', label: '当月结余门槛', render: (value) => <Money value={value} /> }, { key: 'rate', label: '佣金比例', render: (value) => <Percent value={value} /> },
      ]} rows={selected?.levels || []} />}
    </Modal>
  </>
}

function PersonalCommissionPage({ role, onToast }) {
  const { data } = useTeamAgent()
  const meta = ROLE_META[role] || ROLE_META.main
  const agent = data.agents.find((item) => item.account === meta.account)
  const bills = role === 'secondary'
    ? data.internalSettlements.filter((item) => item.secondaryAgent === meta.account).map((item) => ({ ...item, type: '主线内部结算', payee: item.secondaryAgent, payable: item.amount, issued: item.state === '成功' ? item.amount : 0, state: item.state, unitName: `${item.teamName} / ${meta.lineId}`, id: item.id }))
    : data.bills.filter((item) => item.payee === meta.account)
  const [filters, setFilters] = useState({ cycle: '', status: '' })
  const [selected, setSelected] = useState(null)
  const rows = bills.filter((item) => (!filters.cycle || item.cycle === filters.cycle) && (!filters.status || item.state === filters.status))
  const issued = bills.reduce((sum, item) => sum + Number(item.issued || 0), 0)
  const pending = bills.reduce((sum, item) => sum + Math.max(0, Number(item.payable || 0) - Number(item.issued || 0)), 0)
  const columns = [
    { key: 'id', label: '记录编号' }, { key: 'type', label: '佣金类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'unitName', label: '结算单元' }, { key: 'cycle', label: '佣金周期' },
    { key: 'correctedNet', label: '当月结余', render: (value) => role === 'secondary' ? '—' : <Money value={value} signed /> }, { key: 'rate', label: '佣金比例', render: (value) => role === 'secondary' ? '主线自主录入' : <Percent value={value} /> },
    { key: 'payable', label: '应付/结算金额', render: (value) => <Money value={value} /> }, { key: 'issued', label: '已到账', render: (value) => <Money value={value} /> }, { key: 'remaining', label: '待到账', render: (_, row) => <Money value={Math.max(0, row.payable - row.issued)} /> },
    { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'action', label: '操作', render: (_, row) => <Link onClick={() => setSelected(row)}>详情</Link> },
  ]
  return <>
    <SectionHeader title="个人佣金" description={`${meta.label} ${meta.account} 的佣金、内部结算到账和可用余额。`} />
    {role === 'secondary' && <Alert title="副线资金边界" tone="warning">当前身份只显示主线向本人支付的内部结算，不展示团队平台应付账单、其他副线数据或团队可用余额。</Alert>}
    <MetricGrid columns={4}>
      <MetricCard label="本人代理余额" value={<Money value={agent?.balance || 0} />} helper="可用于代存或提款" tone="blue" icon={<WalletOutlined />} />
      <MetricCard label="累计成功到账" value={<Money value={issued} />} helper={role === 'secondary' ? '内部结算到账' : '平台账单到账'} tone="green" icon={<FileDoneOutlined />} />
      <MetricCard label="待到账金额" value={<Money value={pending} />} helper="未发或处理中记录" tone="orange" />
      <MetricCard label="当前结算身份" value={meta.label} helper={`${meta.unit} / ${meta.lineId}`} icon={<TeamOutlined />} />
    </MetricGrid>
    <FilterBar onSearch={() => onToast?.(`已查询到 ${rows.length} 条个人佣金记录`)} onReset={() => setFilters({ cycle: '', status: '' })} onExport={() => onToast?.(`已生成 ${rows.length} 条个人佣金导出演示`)}>
      <Field label="佣金周期"><Select value={filters.cycle} onChange={(cycle) => setFilters({ ...filters, cycle })} placeholder="全部周期" options={[...new Set(bills.map((item) => item.cycle))]} /></Field>
      <Field label="记录状态"><Select value={filters.status} onChange={(status) => setFilters({ ...filters, status })} placeholder="全部状态" options={[...new Set(bills.map((item) => item.state))]} /></Field>
      <Field label="结算身份"><Input value={meta.label} disabled /></Field><Field label="结算单元"><Input value={meta.unit} disabled /></Field><Field label="生效周期"><Input value="2026-07" disabled /></Field>
    </FilterBar>
    <DataTable minWidth={1550} columns={columns} rows={rows} paginated />
    {role !== 'secondary' && <FormulaPanel title="个人佣金计算口径" items={[
      { label: '净输赢', formula: '总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费' },
      { label: '当月结余', formula: '净输赢 + 上月结余 + 本月结余调整' },
      { label: '佣金', formula: 'MAX（0，当月结余 × 佣金比例 + 佣金调整）' },
    ]} />}
    <Modal open={!!selected} title={`${selected?.id || ''} · 佣金详情`} description="查看账单或内部结算的金额、状态和结算单元快照。" onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭" showCancel={false} width={850}>
      {selected && <DescriptionGrid columns={3} items={columns.filter((item) => !['action', 'remaining'].includes(item.key)).map((column) => ({ label: column.label, value: column.render ? column.render(selected[column.key], selected) : selected[column.key] }))} />}
    </Modal>
  </>
}

export function AgentBaselinePage({ page, role = 'main', onToast, onNavigate }) {
  if (page === 'downline') return <DownlinePage role={role} onToast={onToast} onNavigate={onNavigate} />
  if (page === 'readonlyPlans') return <ReadonlyPlansPage role={role} />
  if (page === 'personalCommission') return <PersonalCommissionPage role={role} onToast={onToast} />
  return null
}
