import { useMemo, useState } from 'react'
import { DownloadOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useTeamAgent } from './context'
import { Alert, Button, DataTable, Field, FilterBar, FormulaPanel, Input, Money, SectionHeader, Select, StatusTag, Toolbar } from './ui'

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

const EMPTY_FILTERS = { cycle: '', account: '', agentIdentity: '' }

function cyclePeriodRange(cycle) {
  const [year, month] = String(cycle || '').split('-').map(Number)
  if (!year || !month) return '—'
  const lastDay = new Date(year, month, 0).getDate()
  return `${year}-${String(month).padStart(2, '0')}-01 至 ${year}-${String(month).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
}

function decorateRow(row, agents) {
  const agent = agents.find((item) => item.account === row.account) || {}
  const owedToSite = row.openingDebt + row.newDebt
  const remainingDebt = Math.max(0, owedToSite - row.paidToSite)
  return {
    ...row,
    periodRange: cyclePeriodRange(row.cycle),
    agentIdentity: agent.teamAgentType === '官方代理' ? '官方代理' : '普通代理',
    owedToSite,
    remainingDebt,
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
      account: leader.account || 'gaodashang',
      agentIdentity: leader.teamAgentType || '官方代理',
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
    const owedToSite = row.openingDebt + row.newDebt
    const remainingDebt = Math.max(0, owedToSite - row.paidToSite)
    return { ...row, periodRange: cyclePeriodRange(row.cycle), owedToSite, remainingDebt }
  })
}

const moneyColumn = (key, label) => ({ key, label, render: (value) => <Money value={value} /> })

export const AGENT_DEBT_REPORT_FIELDS = [
  { key: 'periodRange', label: '账期时间' },
  { key: 'account', label: '代理名称' },
  { key: 'agentIdentity', label: '代理身份' },
  { key: 'owedToSite', label: '欠站点', money: true },
  { key: 'paidToSite', label: '还站点', money: true },
  { key: 'remainingDebt', label: '剩余欠款', money: true },
]

export function AgentDebtReversalReportPage({ role = 'main', onToast }) {
  const { data } = useTeamAgent()
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const allRows = useMemo(() => buildAgentDebtRows(role, data.agents), [data.agents, role])
  const rows = allRows.filter((row) => (!filters.cycle || row.cycle === filters.cycle)
    && (!filters.account || row.account.toLowerCase().includes(filters.account.toLowerCase()))
    && (!filters.agentIdentity || row.agentIdentity === filters.agentIdentity))
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const unique = (key) => Array.from(new Set(allRows.map((row) => row[key]).filter(Boolean)))
  const columns = AGENT_DEBT_REPORT_FIELDS.map((field) => {
    if (field.money) return moneyColumn(field.key, field.label)
    if (field.key === 'account') return { ...field, render: (value) => <b className="ta-primary-text">{value}</b> }
    if (field.key === 'agentIdentity') return { ...field, render: (value) => <StatusTag tone="blue">{value}</StatusTag> }
    return field
  })

  return <section className="ta-stack reversal-report-screen agent-debt-reversal-report">
    <SectionHeader title="冲正统计报表" description="团队负责人查看所属团队欠款汇总，单线代理只查看本人欠款；副线不展示本报表。" actions={<Toolbar><Button icon={<DownloadOutlined />} variant="slate" onClick={() => onToast?.(`已导出 ${rows.length} 条冲正统计`)}>导出</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast?.('冲正统计文件已下载')}>下载文件</Button></Toolbar>} />
    <Alert title="欠款统计口径" tone="warning">欠站点为统计周期内累计应还站点金额，还站点为已归还金额，剩余欠款为两者相减且最低为 0。</Alert>
    <FilterBar onSearch={() => onToast?.(`已查询 ${rows.length} 条冲正统计`)} onReset={() => setFilters(EMPTY_FILTERS)}>
      <Field label="账期"><Select value={filters.cycle} onChange={(value) => setFilter('cycle', value)} placeholder="全部账期" options={unique('cycle')} /></Field>
      <Field label="代理名称"><Input value={filters.account} onChange={(value) => setFilter('account', value)} placeholder="请输入代理名称" /></Field>
      <Field label="代理身份"><Select value={filters.agentIdentity} onChange={(value) => setFilter('agentIdentity', value)} placeholder="全部身份" options={unique('agentIdentity')} /></Field>
    </FilterBar>
    <DataTable className="reversal-report-table" minWidth={900} columns={columns} rows={rows} paginated />
    <FormulaPanel title="欠站点口径" items={[
      { label: '剩余欠款', formula: 'MAX（0，欠站点 − 还站点）' },
    ]} warning="本页仅用于本人授权范围内的统计查询与导出，不提供站点审核、代垫或资金发放操作。" />
  </section>
}
