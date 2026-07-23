import { useMemo, useState } from 'react'
import { useTeamAgent } from '../team-agent/context'
import { buildAgentDebtRows } from '../team-agent/agent-debt-reversal-report-page'
import {
  H5AgentDetailSheet,
  H5AgentEmpty,
  H5AgentFields,
  H5AgentFilterSheet,
  H5AgentFormField,
  H5AgentPagination,
  H5AgentSearch,
} from './h5-agent-ui'

const FIELDS = [
  { key: 'periodRange', label: '账期时间' },
  { key: 'account', label: '代理名称' },
  { key: 'agentIdentity', label: '代理身份' },
  { key: 'owedToSite', label: '欠站点', money: true },
  { key: 'paidToSite', label: '还站点', money: true },
  { key: 'remainingDebt', label: '剩余欠款', money: true },
]

const unique = (rows, key) => [...new Set(rows.map((row) => row[key]).filter(Boolean))]
const money = (value) => `¥${Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function detailItems(row) {
  return FIELDS.map((field) => ({
    label: field.label,
    value: field.money ? money(row[field.key]) : row[field.key],
  }))
}

export function H5AgentDebtReversalReportPage({ role = 'main', onToast = () => {} }) {
  const { data } = useTeamAgent()
  const [filters, setFilters] = useState({ cycle: '', account: '', agentIdentity: '' })
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const allRows = useMemo(() => buildAgentDebtRows(role, data.agents), [data.agents, role])
  const rows = allRows.filter((row) => (!filters.cycle || row.cycle === filters.cycle)
    && (!filters.account || row.account.toLowerCase().includes(filters.account.toLowerCase()))
    && (!filters.agentIdentity || row.agentIdentity === filters.agentIdentity))
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(page, pages)
  const visibleRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize)
  const setFilter = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); setPage(1) }
  const reset = () => { setFilters({ cycle: '', account: '', agentIdentity: '' }); setPage(1) }

  return <section className="h5-agent-page h5-agent-debt-report-page">
    <p className="h5-agent-dashboard-alert">团队负责人查看所属团队欠款汇总，单线代理只查看本人欠款；副线不展示本报表。</p>
    <H5AgentSearch value={filters.account} onChange={(value) => setFilter('account', value)} onFilter={() => setFilterOpen(true)} placeholder="请输入代理名称" />
    <div className="h5-agent-result-meta"><span>当前筛选 {rows.length} 条</span><div><button type="button" onClick={() => onToast(`已导出 ${rows.length} 条冲正统计`)}>导出</button><button type="button" onClick={() => onToast('冲正统计文件已下载')}>下载文件</button></div></div>
    <div className="h5-agent-card-list">{visibleRows.map((row) => <article className="h5-agent-record-card" key={row.id}>
      <header><div><strong>{row.account}</strong><small>{row.periodRange} · {row.agentIdentity}</small></div></header>
      <div className="h5-agent-record-summary h5-agent-record-values">
        <div><span>欠站点</span><b>{money(row.owedToSite)}</b></div>
        <div><span>还站点</span><b className="is-positive">{money(row.paidToSite)}</b></div>
        <div><span>剩余欠款</span><b className="is-negative">{money(row.remainingDebt)}</b></div>
      </div>
      <footer><span>{row.agentIdentity}</span><button type="button" className="h5-agent-card-detail" onClick={() => setSelected(row)}>查看全部字段</button></footer>
    </article>)}{!visibleRows.length && <H5AgentEmpty title="暂无冲正统计记录" />}</div>
    <H5AgentPagination total={rows.length} page={safePage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1) }} />
    <section className="h5-agent-panel h5-agent-formula-panel"><h2>欠站点口径</h2><H5AgentFields columns={1} items={[{ label: '剩余欠款', value: 'MAX（0，欠站点 − 还站点）' }]} /><p className="h5-agent-dashboard-alert">本页仅用于本人授权范围内的统计查询与导出，不提供站点审核、代垫或资金发放操作。</p></section>
    <H5AgentFilterSheet open={filterOpen} title="冲正统计筛选" onClose={() => setFilterOpen(false)} onReset={reset} onApply={() => { setFilterOpen(false); onToast(`已查询 ${rows.length} 条冲正统计`) }}>
      <H5AgentFormField label="账期"><select value={filters.cycle} onChange={(event) => setFilter('cycle', event.target.value)}><option value="">全部账期</option>{unique(allRows, 'cycle').map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
      <H5AgentFormField label="代理名称"><input value={filters.account} onChange={(event) => setFilter('account', event.target.value)} placeholder="请输入代理名称" /></H5AgentFormField>
      <H5AgentFormField label="代理身份"><select value={filters.agentIdentity} onChange={(event) => setFilter('agentIdentity', event.target.value)}><option value="">全部身份</option>{unique(allRows, 'agentIdentity').map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
    </H5AgentFilterSheet>
    <H5AgentDetailSheet open={Boolean(selected)} title="冲正统计详情" description={selected ? `${selected.account} · ${selected.periodRange}` : ''} onClose={() => setSelected(null)}>{selected && <H5AgentFields items={detailItems(selected)} />}</H5AgentDetailSheet>
  </section>
}
