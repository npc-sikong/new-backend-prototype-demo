import { useMemo, useState } from 'react'
import { DownloadOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useTeamAgent } from './context'
import {
  Alert,
  Button,
  DataTable,
  Field,
  FilterBar,
  FormulaPanel,
  Input,
  Money,
  SectionHeader,
  Select,
  StatusTag,
  Toolbar,
} from './ui'

const TEAM_ACCOUNTS = ['gaodashang', 'WC002', 'LGNB']
const SINGLE_ACCOUNT = 'dailiwc001'

export const AGENT_DEBT_ROWS = [
  { id: 'REV-202607-345', date: '2026-07-21', cycle: '2026-07', account: 'gaodashang', openingDebt: 26800, newDebt: 8400, paidToSite: 6000, note: '团队周期欠款' },
  { id: 'REV-202607-373', date: '2026-07-21', cycle: '2026-07', account: 'WC002', openingDebt: 6800, newDebt: 2100, paidToSite: 1800, note: '团队周期欠款' },
  { id: 'REV-202607-374', date: '2026-07-21', cycle: '2026-07', account: 'LGNB', openingDebt: 5100, newDebt: 1350, paidToSite: 1200, note: '团队周期欠款' },
  { id: 'REV-202607-1749', date: '2026-07-21', cycle: '2026-07', account: 'dailiwc001', openingDebt: 4200, newDebt: 950, paidToSite: 1200, note: '单线代理周期欠款' },
  { id: 'REV-202606-345', date: '2026-06-30', cycle: '2026-06', account: 'gaodashang', openingDebt: 18400, newDebt: 10400, paidToSite: 2000, note: '历史周期结转' },
  { id: 'REV-202606-373', date: '2026-06-30', cycle: '2026-06', account: 'WC002', openingDebt: 4200, newDebt: 3200, paidToSite: 400, note: '历史周期结转' },
  { id: 'REV-202606-1749', date: '2026-06-30', cycle: '2026-06', account: 'dailiwc001', openingDebt: 3100, newDebt: 1700, paidToSite: 500, note: '历史周期结转' },
]

const EMPTY_FILTERS = { startDate: '', endDate: '', cycle: '', status: '', keyword: '' }

function decorateRow(row, agents) {
  const agent = agents.find((item) => item.account === row.account) || {}
  const currentDebt = Math.max(0, row.openingDebt + row.newDebt - row.paidToSite)
  return {
    ...row,
    agentIdentity: agent.teamAgentType === '官方代理' ? '官方代理' : '普通代理',
    agentLevel: agent.identity || '单线代理',
    unit: agent.unit || '—',
    lineId: agent.lineId || '—',
    currentDebt,
    status: currentDebt > 0 ? '欠站点' : '已结清',
  }
}

export function buildAgentDebtRows(role, agents) {
  if (role === 'independent') {
    return AGENT_DEBT_ROWS.filter((row) => row.account === SINGLE_ACCOUNT).map((row) => decorateRow(row, agents))
  }

  const leader = agents.find((item) => item.account === TEAM_ACCOUNTS[0]) || {}
  const grouped = AGENT_DEBT_ROWS.filter((row) => TEAM_ACCOUNTS.includes(row.account)).reduce((result, row) => {
    const current = result.get(row.cycle) || {
      id: `TEAM-${row.cycle}`,
      date: row.date,
      cycle: row.cycle,
      account: leader.unit || 'gaodashang01部',
      agentIdentity: leader.teamAgentType || '官方代理',
      agentLevel: '团队代理',
      unit: leader.unit || 'gaodashang01部',
      lineId: '全部线路',
      openingDebt: 0,
      newDebt: 0,
      paidToSite: 0,
      note: '团队周期欠款汇总',
    }
    current.date = current.date > row.date ? current.date : row.date
    current.openingDebt += row.openingDebt
    current.newDebt += row.newDebt
    current.paidToSite += row.paidToSite
    result.set(row.cycle, current)
    return result
  }, new Map())

  return Array.from(grouped.values()).map((row) => {
    const currentDebt = Math.max(0, row.openingDebt + row.newDebt - row.paidToSite)
    return { ...row, currentDebt, status: currentDebt > 0 ? '欠站点' : '已结清' }
  })
}

const moneyColumn = (key, label, signed = false) => ({ key, label, render: (value) => <Money value={value} signed={signed} /> })

export function AgentDebtReversalReportPage({ role = 'main', onToast }) {
  const { data } = useTeamAgent()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const allRows = useMemo(() => buildAgentDebtRows(role, data.agents), [data.agents, role])
  const rows = allRows.filter((row) => (!filters.startDate || row.date >= filters.startDate)
    && (!filters.endDate || row.date <= filters.endDate)
    && (!filters.cycle || row.cycle === filters.cycle)
    && (!filters.status || row.status === filters.status)
    && (!filters.keyword || `${row.account}${row.unit}${row.lineId}`.toLowerCase().includes(filters.keyword.toLowerCase())))
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const unique = (key) => Array.from(new Set(allRows.map((row) => row[key]).filter(Boolean)))
  const columns = [
    { key: 'date', label: '统计日期' },
    { key: 'cycle', label: '佣金周期' },
    { key: 'account', label: '代理名称', render: (value) => <b className="ta-primary-text">{value}</b> },
    { key: 'agentIdentity', label: '代理身份', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'agentLevel', label: '代理层级' },
    { key: 'unit', label: '结算单元' },
    { key: 'lineId', label: 'line_id' },
    moneyColumn('openingDebt', '上月欠站点'),
    moneyColumn('newDebt', '本期新增欠款'),
    moneyColumn('paidToSite', '本期已还站点'),
    moneyColumn('currentDebt', '当前欠站点'),
    { key: 'status', label: '状态', render: (value) => <StatusTag tone={value === '已结清' ? 'green' : 'orange'}>{value}</StatusTag> },
    { key: 'note', label: '备注' },
  ]

  return <section className="ta-stack reversal-report-screen agent-debt-reversal-report">
    <SectionHeader title="冲正统计报表" description="按当前代理身份查看各周期欠站点金额；团队负责人和副线使用同一团队口径，单线代理只查看本人。" actions={<Toolbar><Button icon={<DownloadOutlined />} variant="slate" onClick={() => onToast?.(`已导出 ${rows.length} 条冲正统计`)}>导出</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast?.('冲正统计文件已下载')}>下载文件</Button></Toolbar>} />
    <Alert title="周期欠款口径" tone="warning">团队负责人和副线查看所属团队的周期欠款汇总；单线代理只查看本人周期欠款。本页不提供级差、垫付、回款或冲正增减字段。</Alert>
    <FilterBar onSearch={() => onToast?.(`已查询 ${rows.length} 条冲正统计`)} onReset={() => setFilters(EMPTY_FILTERS)}>
      <Field label="统计开始日期"><Input type="date" value={filters.startDate} onChange={(value) => setFilter('startDate', value)} /></Field>
      <Field label="统计结束日期"><Input type="date" value={filters.endDate} onChange={(value) => setFilter('endDate', value)} /></Field>
      <Field label="佣金周期"><Select value={filters.cycle} onChange={(value) => setFilter('cycle', value)} placeholder="全部周期" options={unique('cycle')} /></Field>
      <Field label="状态"><Select value={filters.status} onChange={(value) => setFilter('status', value)} placeholder="全部状态" options={unique('status')} /></Field>
      <Field label="代理搜索"><Input value={filters.keyword} onChange={(value) => setFilter('keyword', value)} placeholder="代理名称、结算单元或line_id" /></Field>
    </FilterBar>
    <DataTable className="reversal-report-table" minWidth={1500} columns={columns} rows={rows} paginated />
    <FormulaPanel title="欠站点口径" items={[
      { label: '当前欠站点', formula: 'MAX（0，上月欠站点 + 本期新增欠款 − 本期已还站点）' },
    ]} warning="本页仅用于本人授权范围内的统计查询与导出，不提供站点审核、代垫或资金发放操作。" />
  </section>
}
