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
  H5AgentStatus,
} from './h5-agent-ui'

const FIELDS = [
  { key: 'date', label: '统计日期' },
  { key: 'cycle', label: '佣金周期' },
  { key: 'account', label: '代理名称' },
  { key: 'agentIdentity', label: '代理身份' },
  { key: 'agentLevel', label: '代理层级' },
  { key: 'unit', label: '结算单元' },
  { key: 'lineId', label: 'line_id' },
  { key: 'openingDebt', label: '上月欠站点', money: true },
  { key: 'newDebt', label: '本期新增欠款', money: true },
  { key: 'paidToSite', label: '本期已还站点', money: true },
  { key: 'currentDebt', label: '当前欠站点', money: true },
  { key: 'status', label: '状态', status: true },
  { key: 'note', label: '备注' },
]

const unique = (rows, key) => [...new Set(rows.map((row) => row[key]).filter(Boolean))]
const money = (value) => `¥${Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function detailItems(row) {
  return FIELDS.map((field) => ({
    label: field.label,
    value: field.status ? <H5AgentStatus tone={row[field.key] === '已结清' ? 'success' : 'warning'}>{row[field.key]}</H5AgentStatus> : field.money ? money(row[field.key]) : row[field.key],
  }))
}

export function H5AgentDebtReversalReportPage({ role = 'main', onToast = () => {} }) {
  const { data } = useTeamAgent()
  const [filters, setFilters] = useState({ startDate: '', endDate: '', cycle: '', status: '', keyword: '' })
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const allRows = useMemo(() => buildAgentDebtRows(role, data.agents), [data.agents, role])
  const rows = allRows.filter((row) => (!filters.startDate || row.date >= filters.startDate)
    && (!filters.endDate || row.date <= filters.endDate)
    && (!filters.cycle || row.cycle === filters.cycle)
    && (!filters.status || row.status === filters.status)
    && (!filters.keyword || `${row.account}${row.unit}${row.lineId}`.toLowerCase().includes(filters.keyword.toLowerCase())))
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(page, pages)
  const visibleRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize)
  const setFilter = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); setPage(1) }
  const reset = () => { setFilters({ startDate: '', endDate: '', cycle: '', status: '', keyword: '' }); setPage(1) }

  return <section className="h5-agent-page h5-agent-debt-report-page">
    <p className="h5-agent-dashboard-alert">团队负责人和副线查看所属团队的周期欠款汇总；单线代理只查看本人周期欠款。本页不提供级差、垫付、回款或冲正增减字段。</p>
    <H5AgentSearch value={filters.keyword} onChange={(value) => setFilter('keyword', value)} onFilter={() => setFilterOpen(true)} placeholder="代理名称、结算单元或line_id" />
    <div className="h5-agent-result-meta"><span>当前筛选 {rows.length} 条</span><div><button type="button" onClick={() => onToast(`已导出 ${rows.length} 条冲正统计`)}>导出</button><button type="button" onClick={() => onToast('冲正统计文件已下载')}>下载文件</button></div></div>
    <div className="h5-agent-card-list">{visibleRows.map((row) => <article className="h5-agent-record-card" key={row.id}>
      <header><div><strong>{row.account}</strong><small>{row.date} · {row.cycle}</small></div><H5AgentStatus tone={row.status === '已结清' ? 'success' : 'warning'}>{row.status}</H5AgentStatus></header>
      <div className="h5-agent-record-summary h5-agent-record-values">
        <div><span>上月欠站点</span><b>{money(row.openingDebt)}</b></div>
        <div><span>本期新增欠款</span><b>{money(row.newDebt)}</b></div>
        <div><span>本期已还站点</span><b className="is-positive">{money(row.paidToSite)}</b></div>
        <div><span>当前欠站点</span><b className="is-negative">{money(row.currentDebt)}</b></div>
      </div>
      <footer><span>{row.unit} · {row.lineId}</span><button type="button" className="h5-agent-card-detail" onClick={() => setSelected(row)}>查看全部字段</button></footer>
    </article>)}{!visibleRows.length && <H5AgentEmpty title="暂无冲正统计记录" />}</div>
    <H5AgentPagination total={rows.length} page={safePage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1) }} />
    <section className="h5-agent-panel h5-agent-formula-panel"><h2>欠站点口径</h2><H5AgentFields columns={1} items={[{ label: '当前欠站点', value: 'MAX（0，上月欠站点 + 本期新增欠款 − 本期已还站点）' }]} /><p className="h5-agent-dashboard-alert">本页仅用于本人授权范围内的统计查询与导出，不提供站点审核、代垫或资金发放操作。</p></section>
    <H5AgentFilterSheet open={filterOpen} title="冲正统计筛选" onClose={() => setFilterOpen(false)} onReset={reset} onApply={() => { setFilterOpen(false); onToast(`已查询 ${rows.length} 条冲正统计`) }}>
      <H5AgentFormField label="统计开始日期"><input type="date" value={filters.startDate} onChange={(event) => setFilter('startDate', event.target.value)} /></H5AgentFormField>
      <H5AgentFormField label="统计结束日期"><input type="date" value={filters.endDate} onChange={(event) => setFilter('endDate', event.target.value)} /></H5AgentFormField>
      <H5AgentFormField label="佣金周期"><select value={filters.cycle} onChange={(event) => setFilter('cycle', event.target.value)}><option value="">全部周期</option>{unique(allRows, 'cycle').map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
      <H5AgentFormField label="状态"><select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">全部状态</option>{unique(allRows, 'status').map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
    </H5AgentFilterSheet>
    <H5AgentDetailSheet open={Boolean(selected)} title="冲正统计详情" description={selected ? `${selected.account} · ${selected.cycle}` : ''} onClose={() => setSelected(null)}>{selected && <H5AgentFields items={detailItems(selected)} />}</H5AgentDetailSheet>
  </section>
}
