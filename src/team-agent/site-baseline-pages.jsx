import { useMemo, useState } from 'react'
import {
  BarChartOutlined,
  BankOutlined,
  DollarCircleOutlined,
  EyeOutlined,
  FundOutlined,
  LineChartOutlined,
  ReloadOutlined,
  TeamOutlined,
  TrophyOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { useTeamAgent } from './context'
import { recommenderColumn, recommenderOf } from './recommender'
import {
  Alert,
  Button,
  DataTable,
  DescriptionGrid,
  Field,
  FilterBar,
  Input,
  MetricCard,
  MetricGrid,
  Modal,
  Money,
  Panel,
  SectionHeader,
  Select,
  StatusTag,
  Tabs,
} from './ui'

const CURRENT_SITE = '旺财体育'
const CURRENT_CYCLE = '2026-07'

const RANGE_OPTIONS = [
  { value: 'today', label: '今日' },
  { value: 'yesterday', label: '昨日' },
  { value: '3d', label: '近3日' },
  { value: '7d', label: '近7日' },
  { value: '30d', label: '近1月' },
]

const RANGE_META = {
  today: { label: '今日', factor: 0.08, axes: ['02:00', '06:00', '10:00', '14:00', '18:00', '22:00'], weights: [0.08, 0.11, 0.17, 0.24, 0.23, 0.17] },
  yesterday: { label: '昨日', factor: 0.075, axes: ['02:00', '06:00', '10:00', '14:00', '18:00', '22:00'], weights: [0.07, 0.1, 0.18, 0.22, 0.26, 0.17] },
  '3d': { label: '近3日', factor: 0.22, axes: ['07/13', '07/14', '07/15'], weights: [0.29, 0.34, 0.37] },
  '7d': { label: '近7日', factor: 0.48, axes: ['07/09', '07/10', '07/11', '07/12', '07/13', '07/14', '07/15'], weights: [0.12, 0.13, 0.11, 0.14, 0.15, 0.17, 0.18] },
  '30d': { label: '近1月', factor: 1, axes: ['06/16', '06/19', '06/22', '06/25', '06/28', '07/01', '07/04', '07/07', '07/10', '07/15'], weights: [0.08, 0.09, 0.085, 0.095, 0.1, 0.105, 0.11, 0.105, 0.115, 0.115] },
}

const DASHBOARD_LAYOUT = {
  panels: { display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(280px, 0.9fr)', gap: 11, alignItems: 'stretch' },
  legend: { display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 14, marginBottom: 6, color: '#77899d', fontSize: 10 },
  legendItem: { display: 'inline-flex', alignItems: 'center', gap: 6 },
  chart: { display: 'block', width: '100%', minHeight: 245 },
  rankList: { display: 'grid', gap: 13 },
  rankButton: { width: '100%', display: 'grid', gap: 7, padding: 0, color: '#52677e', background: 'transparent', textAlign: 'left' },
  rankHead: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, fontSize: 10 },
  rankName: { display: 'inline-flex', alignItems: 'center', gap: 8, minWidth: 0 },
  rankNo: { width: 20, height: 20, display: 'inline-grid', placeItems: 'center', borderRadius: 4, color: '#4c7195', background: '#edf4fa', fontSize: 9 },
  rankTrack: { height: 5, overflow: 'hidden', borderRadius: 4, background: '#e8eef4' },
  rankFill: { height: '100%', display: 'block', borderRadius: 'inherit', background: '#4b9ddd' },
  rankFooter: { display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 15, paddingTop: 12, borderTop: '1px solid #edf1f4', color: '#8291a2', fontSize: 10 },
}

function notify(onToast, message, tone = 'success') {
  onToast?.(message, tone)
}

function formatCount(value) {
  return Number(value || 0).toLocaleString('zh-CN')
}

function formatCompact(value) {
  const amount = Number(value || 0)
  if (amount >= 1000000) return `${(amount / 1000000).toFixed(1)}m`
  if (amount >= 1000) return `${Math.round(amount / 1000)}k`
  return formatCount(amount)
}

function distribute(total, weights, variation = 0) {
  const sum = weights.reduce((result, item) => result + item, 0) || 1
  return weights.map((weight, index) => Math.round((total * weight * (1 + (index % 3 - 1) * variation)) / sum))
}

function getCurrentTeam(data, account) {
  return data.teams.find((team) => team.site === CURRENT_SITE && ['生效中', '正常'].includes(team.status) && team.lines.some((line) => (
    line.agent === account
    && line.startCycle <= CURRENT_CYCLE
    && (!line.endCycle || line.endCycle >= CURRENT_CYCLE)
    && line.status === '生效中'
  )))
}

function getCurrentSingle(data, account) {
  return data.singles.find((single) => (
    single.site === CURRENT_SITE
    && single.owner === account
    && single.startCycle <= CURRENT_CYCLE
    && single.status.includes('生效')
  ))
}

function getRelationHistory(agent, data) {
  const requestRows = data.requests.filter((item) => (
    item.applicant === agent.account
    || String(item.currentUnit).includes(agent.account)
    || String(item.targetUnit).includes(agent.account)
  )).map((item) => ({
    id: item.id,
    type: item.type,
    currentUnit: item.currentUnit,
    targetUnit: item.targetUnit,
    cycle: item.effectiveCycle,
    balanceHandling: item.balanceHandling,
    status: item.status,
    operator: item.applicant,
    createdAt: item.createdAt,
  }))

  const operationRows = data.teamOperations.filter((item) => (
    item.mainAccount === agent.account || String(item.secondaryAccounts).includes(agent.account)
  )).map((item) => ({
    id: item.id,
    type: item.action,
    currentUnit: item.teamName,
    targetUnit: item.teamName,
    cycle: String(item.createdAt).slice(0, 7),
    balanceHandling: item.reason,
    status: '已记录',
    operator: item.operator,
    createdAt: item.createdAt,
  }))

  const currentRow = {
    id: `CURRENT-${agent.id}`,
    type: '当前结算关系',
    currentUnit: agent.parent || '无上级代理',
    targetUnit: `${agent.settlementMode} / ${agent.unit || '未设置'}`,
    cycle: agent.effectiveCycle || '历史延续',
    balanceHandling: '本月结余按当前有效结算关系归集，历史账单不回写',
    status: '当前生效',
    operator: '站点运营',
    createdAt: agent.registeredAt,
  }

  return [currentRow, ...requestRows, ...operationRows].sort((left, right) => String(right.createdAt).localeCompare(String(left.createdAt)))
}

function buildSiteAgents(data) {
  return data.agents.filter((agent) => agent.site === CURRENT_SITE).map((agent) => {
    const team = getCurrentTeam(data, agent.account)
    const line = team?.lines.find((item) => item.agent === agent.account && item.status === '生效中')
    const single = getCurrentSingle(data, agent.account)
    const latestBill = data.bills.find((bill) => bill.site === CURRENT_SITE && bill.payee === agent.account && bill.cycle === CURRENT_CYCLE)
    const isMain = team?.mainAgent === agent.account
    const currentBalance = team
      ? (isMain ? team.metrics.correctedNet : line?.netWinLoss || 0)
      : single?.metrics.assessmentNet ?? latestBill?.correctedNet ?? agent.totalWinLoss ?? 0

    return {
      ...agent,
      agentIdentity: ['官方代理', '普通代理'].includes(agent.teamAgentType) ? agent.teamAgentType : '普通代理',
      unit: team?.name || single?.name || agent.unit || '—',
      lineId: line?.lineId || agent.lineId || single?.code || '—',
      leader: team?.mainAgent || single?.owner || (agent.parent === '无上级代理' ? agent.developer : agent.parent),
      effectiveCycle: line?.startCycle || single?.startCycle || agent.effectiveCycle || '历史延续',
      currentBalance,
      relationHistory: getRelationHistory(agent, data),
    }
  })
}

function createTrendRows(range, totals) {
  const meta = RANGE_META[range]
  const betting = distribute(totals.betting, meta.weights, 0.035)
  const deposit = distribute(totals.deposit, meta.weights, 0.055)
  const income = distribute(Math.max(0, totals.income), meta.weights, 0.07)
  return meta.axes.map((label, index) => ({ label, betting: betting[index], deposit: deposit[index], income: income[index] }))
}

function buildDashboard(data, range) {
  const siteAgents = buildSiteAgents(data)
  const activeAgents = siteAgents.filter((agent) => agent.status === '启用')
  const meta = RANGE_META[range]
  const factor = meta.factor
  const baseIncome = siteAgents.reduce((sum, agent) => sum + Number(agent.totalWinLoss || 0), 0)
  const baseDeposit = siteAgents.reduce((sum, agent) => sum + Number(agent.depositAmount || 0), 0)
  const baseWithdrawal = siteAgents.reduce((sum, agent) => sum + Number(agent.withdrawalAmount || 0), 0)
  const baseValidBetting = siteAgents.reduce((sum, agent) => sum + Number(agent.validBetting || 0), 0)
  const baseBetting = Math.round(baseValidBetting / 0.88)
  const commissionBalance = data.bills.filter((bill) => bill.site === CURRENT_SITE).reduce((sum, bill) => sum + Math.max(0, Number(bill.payable || 0) - Number(bill.issued || 0)), 0)
  const agentBalance = activeAgents.reduce((sum, agent) => sum + Number(agent.balance || 0), 0)
  const totals = {
    income: Math.round(baseIncome * factor),
    deposit: Math.round(baseDeposit * factor),
    withdrawal: Math.round(baseWithdrawal * factor),
    betting: Math.round(baseBetting * factor),
    validBetting: Math.round(baseValidBetting * factor),
  }
  const agentBreakdown = (field, divisor = 1) => siteAgents.map((agent) => ({
    id: agent.id,
    name: agent.account,
    value: Math.round((Number(agent[field] || 0) * factor) / divisor),
    remark: `${agent.settlementMode} / ${agent.identity}`,
  }))

  const metrics = [
    { key: 'income', label: '站点收入', value: totals.income, tone: 'green', icon: <FundOutlined />, helper: `${meta.label}站点净收入`, definition: '筛选周期内本站代理范围会员输赢汇总，正数表示站点收入。', formula: '各代理总输赢合计', signed: true, rows: agentBreakdown('totalWinLoss') },
    { key: 'deposit', label: '充值总额', value: totals.deposit, tone: 'blue', icon: <BankOutlined />, helper: `${meta.label}成功充值`, definition: '筛选周期内本站代理范围会员成功充值金额。', formula: '各代理下属会员充值金额合计', rows: agentBreakdown('depositAmount') },
    { key: 'withdrawal', label: '提款总额', value: totals.withdrawal, tone: 'red', icon: <WalletOutlined />, helper: `${meta.label}成功提款`, definition: '筛选周期内本站代理范围会员成功提款金额。', formula: '各代理下属会员提款金额合计', rows: agentBreakdown('withdrawalAmount') },
    { key: 'betting', label: '投注总额', value: totals.betting, tone: 'orange', icon: <BarChartOutlined />, helper: '全部投注口径', definition: '筛选周期内本站代理范围会员全部投注金额。', formula: '演示投注总额 = 有效投注 ÷ 88%', rows: agentBreakdown('validBetting', 0.88) },
    { key: 'validBetting', label: '有效投注', value: totals.validBetting, tone: 'blue', icon: <LineChartOutlined />, helper: '佣金统计口径', definition: '筛选周期内符合场馆与佣金统计规则的有效投注金额。', formula: '各代理下属会员有效投注合计', rows: agentBreakdown('validBetting') },
    { key: 'members', label: '会员总数', value: siteAgents.reduce((sum, agent) => sum + Number(agent.members || 0), 0), kind: 'count', icon: <UserOutlined />, helper: '本站代理下属会员', definition: '当前归属于本站代理体系的会员数量，不随日期筛选变化。', formula: '各代理下属会员数合计', rows: siteAgents.map((agent) => ({ id: agent.id, name: agent.account, value: agent.members, remark: `${agent.activeMembers} 名活跃会员` })) },
    { key: 'agents', label: '代理总数', value: activeAgents.length, kind: 'count', tone: 'blue', icon: <TeamOutlined />, helper: '当前启用代理', definition: '本站当前状态为启用的代理账号数量。', formula: '本站启用代理账号去重计数', rows: activeAgents.map((agent) => ({ id: agent.id, name: agent.account, value: 1, remark: `${agent.model} / ${agent.settlementMode}` })) },
    { key: 'commissionBalance', label: '佣金余额', value: commissionBalance, tone: 'orange', icon: <DollarCircleOutlined />, helper: '含未结算应付', definition: '本站代理账单应付金额扣除已发金额后的余额汇总。', formula: '佣金余额 = 应付佣金 − 已发佣金', rows: data.bills.filter((bill) => bill.site === CURRENT_SITE).map((bill) => ({ id: bill.id, name: `${bill.payee} / ${bill.type}`, value: Math.max(0, bill.payable - bill.issued), remark: `${bill.cycle} / ${bill.state}` })) },
    { key: 'agentBalance', label: '代理余额', value: agentBalance, tone: 'green', icon: <WalletOutlined />, helper: '当前可用余额汇总', definition: '本站启用代理账号当前代理余额汇总，不随日期筛选变化。', formula: '各启用代理当前余额合计', rows: activeAgents.map((agent) => ({ id: agent.id, name: agent.account, value: agent.balance, remark: `${agent.settlementMode} / ${agent.identity}` })) },
  ]

  return {
    siteAgents,
    metrics,
    trendRows: createTrendRows(range, totals),
    ranking: [...siteAgents].sort((left, right) => right.totalWinLoss - left.totalWinLoss).slice(0, 5),
  }
}

function MetricDetailModal({ metric, range, onClose }) {
  if (!metric) return null
  const columns = [
    { key: 'name', label: '明细对象', render: (value) => <b className="ta-primary-text">{value}</b> },
    { key: 'value', label: metric.kind === 'count' ? '数量' : '金额', render: (value) => metric.kind === 'count' ? formatCount(value) : <Money value={value} signed={metric.signed} /> },
    { key: 'remark', label: '口径说明' },
  ]
  return <Modal open title={`${metric.label} · 指标明细`} description="点击看板卡片查看当前筛选周期的组成与统计口径。" onClose={onClose} onConfirm={onClose} confirmText="关闭" showCancel={false} width={800}>
    <DescriptionGrid columns={2} items={[
      { label: '所属站点', value: CURRENT_SITE },
      { label: '统计周期', value: RANGE_META[range].label },
      { label: '当前结果', value: metric.kind === 'count' ? formatCount(metric.value) : <Money value={metric.value} signed={metric.signed} /> },
      { label: '计算口径', value: metric.formula },
      { label: '指标说明', value: metric.definition },
      { label: '数据边界', value: '纯前端演示数据，仅用于页面操作与业务口径确认' },
    ]} />
    <DataTable columns={columns} rows={metric.rows} rowKey="id" paginated />
  </Modal>
}

function TrendChart({ rows }) {
  const width = 820
  const height = 270
  const left = 55
  const right = 22
  const top = 16
  const bottom = 38
  const chartWidth = width - left - right
  const chartHeight = height - top - bottom
  const maxValue = Math.max(1, ...rows.flatMap((row) => [row.betting, row.deposit, row.income]))
  const x = (index) => rows.length === 1 ? left + chartWidth / 2 : left + (chartWidth * index) / (rows.length - 1)
  const y = (value) => top + chartHeight - (Number(value || 0) / maxValue) * chartHeight
  const linePoints = (key) => rows.map((row, index) => `${x(index)},${y(row[key])}`).join(' ')
  const barWidth = Math.min(22, chartWidth / Math.max(1, rows.length) / 3)

  return <>
    <div style={DASHBOARD_LAYOUT.legend}>
      <span style={DASHBOARD_LAYOUT.legendItem}><i style={{ width: 8, height: 8, borderRadius: '50%', background: '#2f8fd6' }} />投注总额</span>
      <span style={DASHBOARD_LAYOUT.legendItem}><i style={{ width: 8, height: 8, borderRadius: '50%', background: '#43b98c' }} />充值总额</span>
      <span style={DASHBOARD_LAYOUT.legendItem}><i style={{ width: 8, height: 8, borderRadius: 2, background: '#efad3f' }} />站点收入</span>
    </div>
    <svg style={DASHBOARD_LAYOUT.chart} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="本站投注、充值与收入趋势">
      {[0, 1, 2, 3, 4].map((step) => {
        const tickValue = maxValue * (4 - step) / 4
        const tickY = top + chartHeight * step / 4
        return <g key={step}>
          <line x1={left} x2={width - right} y1={tickY} y2={tickY} stroke="#e8eef4" strokeWidth="1" />
          <text x={left - 9} y={tickY + 3} textAnchor="end" fill="#91a0b0" fontSize="9">{formatCompact(tickValue)}</text>
        </g>
      })}
      {rows.map((row, index) => <g key={row.label}>
        <rect x={x(index) - barWidth / 2} y={y(row.income)} width={barWidth} height={Math.max(0, top + chartHeight - y(row.income))} rx="3" fill="#efad3f" opacity="0.78">
          <title>{`${row.label} 站点收入 ¥${formatCount(row.income)}`}</title>
        </rect>
        <text x={x(index)} y={height - 13} textAnchor="middle" fill="#8999aa" fontSize="9">{row.label}</text>
      </g>)}
      <polyline points={linePoints('betting')} fill="none" stroke="#2f8fd6" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={linePoints('deposit')} fill="none" stroke="#43b98c" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      {rows.map((row, index) => <g key={`point-${row.label}`}>
        <circle cx={x(index)} cy={y(row.betting)} r="3.2" fill="#fff" stroke="#2f8fd6" strokeWidth="2"><title>{`${row.label} 投注 ¥${formatCount(row.betting)}`}</title></circle>
        <circle cx={x(index)} cy={y(row.deposit)} r="3.2" fill="#fff" stroke="#43b98c" strokeWidth="2"><title>{`${row.label} 充值 ¥${formatCount(row.deposit)}`}</title></circle>
      </g>)}
    </svg>
  </>
}

function AgentDetailModal({ record, onClose }) {
  const [tab, setTab] = useState('base')
  if (!record) return null
  const relationColumns = [
    { key: 'type', label: '关系事件', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'currentUnit', label: '原关系 / 单元' },
    { key: 'targetUnit', label: '目标关系 / 单元' },
    { key: 'cycle', label: '生效周期' },
    { key: 'balanceHandling', label: '当月结余处理' },
    { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'operator', label: '操作人' },
    { key: 'createdAt', label: '记录时间' },
  ]
  return <Modal open title={`${record.account} · 代理详情`} description="站点代理主档只读详情，不在此页执行团队创建或关系调整。" onClose={onClose} onConfirm={onClose} confirmText="关闭" showCancel={false} width={980}>
    <Tabs items={[
      { value: 'base', label: '基础资料' },
      { value: 'business', label: '经营数据' },
      { value: 'relations', label: '关系历史', count: record.relationHistory.length },
    ]} active={tab} onChange={setTab} />
    {tab === 'base' && <DescriptionGrid columns={3} items={[
      { label: '代理ID / 账号', value: `${record.id} / ${record.account}` },
      { label: '所属站点', value: record.site },
      { label: '代理状态', value: <StatusTag>{record.status}</StatusTag> },
      { label: '代理类型', value: record.agentType },
      { label: '推荐人', value: recommenderOf(record) },
      { label: '代理身份', value: <StatusTag tone="blue">{record.agentIdentity}</StatusTag> },
      { label: '代理模型', value: record.model },
      { label: '佣金方案', value: record.plan },
      { label: '上级代理', value: `${record.parentId} / ${record.parent}` },
      { label: '可选绑定会员', value: record.boundMemberAccount },
      { label: '结算模式', value: <StatusTag>{record.settlementMode}</StatusTag> },
      { label: '代理层级', value: record.identity === '—' ? '—' : <StatusTag tone="blue">{record.identity}</StatusTag> },
      { label: '代理部', value: record.unit },
      { label: 'line_id', value: record.lineId },
      { label: '负责人', value: record.leader },
      { label: '生效周期', value: record.effectiveCycle },
      { label: '代理邮箱', value: record.email },
      { label: '成为代理时间', value: record.registeredAt },
      { label: '注册IP / 地点', value: `${record.registerIp} / ${record.registerLocation}` },
      { label: '最后登录IP / 地点', value: `${record.loginIp} / ${record.loginLocation}` },
      { label: '当月结余', value: <Money value={record.currentBalance} signed /> },
      { label: '代理余额', value: <Money value={record.balance} /> },
    ]} />}
    {tab === 'business' && <>
      <MetricGrid columns={4}>
        <MetricCard label="下属代理" value={formatCount(record.subAgents)} helper="当前代理树" />
        <MetricCard label="下属会员" value={formatCount(record.members)} helper="当前归属会员" />
        <MetricCard label="活跃会员" value={formatCount(record.activeMembers)} helper={`新增活跃 ${formatCount(record.newActiveMembers)}`} tone="blue" />
        <MetricCard label="当月结余" value={<Money value={record.currentBalance} signed />} helper="按当前结算单元" tone={record.currentBalance >= 0 ? 'green' : 'red'} />
        <MetricCard label="充值金额" value={<Money value={record.depositAmount} />} helper="当前演示周期" tone="green" />
        <MetricCard label="提款金额" value={<Money value={record.withdrawalAmount} />} helper="当前演示周期" tone="orange" />
        <MetricCard label="总输赢" value={<Money value={record.totalWinLoss} signed />} helper="会员输赢汇总" />
        <MetricCard label="有效投注" value={<Money value={record.validBetting} />} helper="佣金统计口径" tone="blue" />
      </MetricGrid>
      <Panel title="存提款渠道统计" description="按下属会员实际使用渠道汇总次数与金额。">
        <DataTable columns={[
          { key: 'channel', label: '渠道' },
          { key: 'depositCount', label: '充值次数' },
          { key: 'depositAmount', label: '充值金额', render: (value) => <Money value={value} /> },
          { key: 'withdrawalCount', label: '提款次数' },
          { key: 'withdrawalAmount', label: '提款金额', render: (value) => <Money value={value} /> },
        ]} rows={record.channelStats || []} />
      </Panel>
    </>}
    {tab === 'relations' && <>
      <Alert title="关系历史口径">当前关系、待生效申请与团队操作统一按时间回放；历史账单和已完成周期不因关系变化回写。</Alert>
      <DataTable minWidth={1450} columns={relationColumns} rows={record.relationHistory} paginated />
    </>}
  </Modal>
}

function SiteDashboardPage({ onToast }) {
  const { data } = useTeamAgent()
  const [range, setRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState(null)
  const [selectedAgent, setSelectedAgent] = useState(null)
  const dashboard = useMemo(() => buildDashboard(data, range), [data, range])
  const businessMetrics = dashboard.metrics.slice(0, 5)
  const accountMetrics = dashboard.metrics.slice(5)
  const rankMax = Math.max(1, ...dashboard.ranking.map((agent) => Math.max(0, agent.totalWinLoss)))

  function changeRange(value) {
    setRange(value)
    notify(onToast, `运营看板已切换为${RANGE_META[value].label}`)
  }

  return <>
    <SectionHeader title="运营数据看板" description="查看本站收入、资金、投注、会员与代理资产概况，卡片均可打开组成明细。" actions={<Button icon={<ReloadOutlined />} variant="ghost" onClick={() => notify(onToast, '运营看板数据已刷新')}>刷新数据</Button>} />
    <Tabs items={RANGE_OPTIONS} active={range} onChange={changeRange} />
    <Panel title="经营与资金" description={`${CURRENT_SITE} · ${RANGE_META[range].label}口径`}>
      <MetricGrid columns={5}>{businessMetrics.map((metric) => <MetricCard key={metric.key} label={metric.label} value={<Money value={metric.value} signed={metric.signed} />} helper={`${metric.helper}，点击查看明细`} tone={metric.tone} icon={metric.icon} onClick={() => setSelectedMetric(metric)} />)}</MetricGrid>
    </Panel>
    <Panel title="会员与代理资产" description="会员与代理数量采用当前状态，余额类指标不随日期筛选变化。">
      <MetricGrid columns={4}>{accountMetrics.map((metric) => <MetricCard key={metric.key} label={metric.label} value={metric.kind === 'count' ? formatCount(metric.value) : <Money value={metric.value} />} helper={`${metric.helper}，点击查看明细`} tone={metric.tone} icon={metric.icon} onClick={() => setSelectedMetric(metric)} />)}</MetricGrid>
    </Panel>
    <div style={DASHBOARD_LAYOUT.panels}>
      <Panel title="经营趋势" description={`${RANGE_META[range].label}投注、充值与站点收入对比`} actions={<StatusTag tone="blue">纯前端演示</StatusTag>}>
        <TrendChart rows={dashboard.trendRows} />
      </Panel>
      <Panel title="代理排行" description="按当前周期代理贡献收入排序" actions={<TrophyOutlined style={{ color: '#d39a2d' }} />}>
        <div style={DASHBOARD_LAYOUT.rankList}>{dashboard.ranking.map((agent, index) => <button key={agent.id} type="button" style={DASHBOARD_LAYOUT.rankButton} onClick={() => setSelectedAgent(agent)}>
          <span style={DASHBOARD_LAYOUT.rankHead}><span style={DASHBOARD_LAYOUT.rankName}><i style={DASHBOARD_LAYOUT.rankNo}>{index + 1}</i><b>{agent.account}</b></span><Money value={agent.totalWinLoss} signed /></span>
          <span style={DASHBOARD_LAYOUT.rankTrack}><i style={{ ...DASHBOARD_LAYOUT.rankFill, width: `${Math.max(4, Math.max(0, agent.totalWinLoss) / rankMax * 100)}%` }} /></span>
        </button>)}</div>
        <div style={DASHBOARD_LAYOUT.rankFooter}><span>本站代理收入合计</span><Money value={dashboard.siteAgents.reduce((sum, agent) => sum + Number(agent.totalWinLoss || 0), 0)} signed /></div>
      </Panel>
    </div>
    <MetricDetailModal metric={selectedMetric} range={range} onClose={() => setSelectedMetric(null)} />
    <AgentDetailModal key={selectedAgent?.id || 'dashboard-agent'} record={selectedAgent} onClose={() => setSelectedAgent(null)} />
  </>
}

function SiteAgentsPage({ onToast }) {
  const { data } = useTeamAgent()
  const emptyFilters = { account: '', status: '', model: '', settlementMode: '', identity: '', parent: '' }
  const [filters, setFilters] = useState(emptyFilters)
  const [selected, setSelected] = useState(null)
  const siteAgents = useMemo(() => buildSiteAgents(data), [data])
  const enabledAgentOptions = useMemo(() => siteAgents.filter((agent) => agent.status === '启用').map((agent) => ({ value: agent.account, label: `${agent.account}（${agent.id}）` })), [siteAgents])
  const rows = useMemo(() => siteAgents.filter((agent) => (
    (!filters.account || agent.account === filters.account)
    && (!filters.status || agent.status === filters.status)
    && (!filters.model || agent.model === filters.model)
    && (!filters.settlementMode || agent.settlementMode === filters.settlementMode)
    && (!filters.identity || agent.identity === filters.identity)
    && (!filters.parent || String(agent.parent).toLowerCase().includes(filters.parent.toLowerCase()) || String(agent.parentId).includes(filters.parent))
  )), [filters, siteAgents])
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const columns = [
    { key: 'id', label: '代理ID' },
    { key: 'account', label: '代理账号', render: (value) => <b className="ta-primary-text">{value}</b> },
    { key: 'agentIdentity', label: '代理身份', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'agentType', label: '代理类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
    recommenderColumn(),
    { key: 'model', label: '代理模型', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'status', label: '代理状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'parent', label: '上级代理' },
    { key: 'settlementMode', label: '结算模式', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'identity', label: '代理层级', render: (value) => value === '—' ? value : <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'unit', label: '代理部' },
    { key: 'lineId', label: 'line_id' },
    { key: 'leader', label: '负责人' },
    { key: 'effectiveCycle', label: '生效周期' },
    { key: 'currentBalance', label: '当月结余', render: (value) => <Money value={value} signed /> },
    { key: 'subAgents', label: '下属代理' },
    { key: 'members', label: '下属会员' },
    { key: 'activeMembers', label: '活跃会员' },
    { key: 'validBetting', label: '有效投注', render: (value) => <Money value={value} /> },
    { key: 'balance', label: '代理余额', render: (value) => <Money value={value} /> },
    { key: 'action', label: '操作', render: (_, row) => <button className="ta-table-link" onClick={() => setSelected(row)}><EyeOutlined /> 查看详情</button> },
  ]

  return <>
    <SectionHeader title="代理列表" description="延续站点代理主档，保留代理模型，并补充官方/普通代理身份、代理层级、代理部与当月结余。" actions={<Button icon={<ReloadOutlined />} variant="ghost" onClick={() => notify(onToast, '本站代理主档已刷新')}>刷新列表</Button>} />
    <Alert title="本站代理选择边界">代理选择框只列出 {CURRENT_SITE} 已存在且状态为启用的代理；本页仅查询主档、经营与关系历史，创建团队、开副线、换主线等操作仍在团队代理管理处理。</Alert>
    <FilterBar onSearch={() => notify(onToast, `已查询到 ${rows.length} 条本站代理记录`)} onReset={() => setFilters(emptyFilters)} onExport={() => notify(onToast, '本站代理主档已导出')}>
      <Field label="代理账号"><Select value={filters.account} onChange={(value) => setFilter('account', value)} options={enabledAgentOptions} placeholder="全部本站启用代理" /></Field>
      <Field label="代理状态"><Select value={filters.status} onChange={(value) => setFilter('status', value)} options={['启用', '停用']} placeholder="全部状态" /></Field>
      <Field label="代理模型"><Select value={filters.model} onChange={(value) => setFilter('model', value)} options={['负盈利模式', '普通代理']} placeholder="全部模型" /></Field>
      <Field label="结算模式"><Select value={filters.settlementMode} onChange={(value) => setFilter('settlementMode', value)} options={['团队模式', '单线代理', '原代理模式']} placeholder="全部结算模式" /></Field>
      <Field label="代理层级"><Select value={filters.identity} onChange={(value) => setFilter('identity', value)} options={['团队负责人', '副线', '单线代理', '—']} placeholder="全部层级" /></Field>
      <Field label="上级代理"><Input value={filters.parent} onChange={(value) => setFilter('parent', value)} placeholder="编号或账号" /></Field>
    </FilterBar>
    <DataTable className="ta-wide-table" minWidth={2450} columns={columns} rows={rows} paginated />
    <AgentDetailModal key={selected?.id || 'site-agent'} record={selected} onClose={() => setSelected(null)} />
  </>
}

export function SiteBaselinePage({ page, onToast }) {
  if (page === 'siteDashboard') return <SiteDashboardPage onToast={onToast} />
  if (page === 'siteAgents') return <SiteAgentsPage onToast={onToast} />
  return null
}
