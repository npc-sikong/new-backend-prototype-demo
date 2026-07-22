import { useMemo, useState } from 'react'
import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useTeamAgent } from '../team-agent/context'
import {
  buildNegativeReportRows,
  NEGATIVE_REPORT_COLUMNS,
  NEGATIVE_REPORT_COMMISSION_EXCLUDED_KEYS,
  scopeNegativeReportRows,
} from '../team-agent/negative-profit-report-page'
import {
  H5AgentDetailSheet,
  H5AgentEmpty,
  H5AgentFields,
  H5AgentFilterSheet,
  H5AgentFormField,
  H5AgentPagination,
  H5AgentSearch,
} from './h5-agent-ui'

const COUNT_KEYS = new Set(['teamMembers', 'subAgentCount', 'registeredCount', 'firstDepositCount', 'activeCount', 'newActiveCount'])
const MONEY_KEYS = new Set(['depositAmount', 'withdrawalAmount', 'totalWinLoss', 'venueFee', 'memberBonus', 'memberRebate', 'accountAdjustment', 'depositFee', 'withdrawalFee', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet', 'commission'])
const SIGNED_KEYS = new Set(['totalWinLoss', 'accountAdjustment', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet'])
const STATISTIC_TIME_FIELD = { key: 'statisticTime', label: '统计时间' }
const REPORT_FIELDS = NEGATIVE_REPORT_COLUMNS
  .flatMap((field) => field.key === 'cycle' ? [field, STATISTIC_TIME_FIELD] : [field])
  .filter((field) => !NEGATIVE_REPORT_COMMISSION_EXCLUDED_KEYS.has(field.key))

const unique = (rows, key) => [...new Set(rows.map((row) => row[key]).filter(Boolean))]
const money = (value, signed = false) => {
  const amount = Number(value || 0)
  const sign = amount < 0 ? '-' : signed && amount > 0 ? '+' : ''
  return `${sign}¥${Math.abs(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
const tone = (value) => Number(value) > 0 ? 'positive' : Number(value) < 0 ? 'negative' : undefined

function displayValue(field, row) {
  const value = row[field.key]
  if (MONEY_KEYS.has(field.key)) return money(value, SIGNED_KEYS.has(field.key))
  if (field.key === 'rate') return `${Number(value || 0) * 100}%`
  return value ?? '—'
}

function detailItems(row) {
  return REPORT_FIELDS.map((field) => ({
    label: field.label,
    value: displayValue(field, row),
    tone: MONEY_KEYS.has(field.key) ? tone(row[field.key]) : undefined,
  }))
}

function AuditTable({ rows, fields, totals }) {
  return <div className="h5-agent-audit-wrap"><table className="h5-agent-audit-table"><thead><tr>{fields.map((field) => <th key={field.key}>{field.label}</th>)}</tr></thead><tbody>
    {rows.map((row) => <tr key={row.id} className={row.rowType === 'member' ? 'is-member' : ''}>{fields.map((field) => <td key={field.key}>{displayValue(field, row)}</td>)}</tr>)}
    {!rows.length && <tr><td colSpan={fields.length}>暂无数据</td></tr>}
    {!!rows.length && <tr className="h5-agent-audit-total">{fields.map((field, index) => <td key={field.key}>{index === 0 ? '总计' : totals[field.key] ?? '—'}</td>)}</tr>}
  </tbody></table></div>
}

export function H5NegativeProfitReportPage({ role = 'main', onToast = () => {} }) {
  const { data } = useTeamAgent()
  const [filters, setFilters] = useState({ keyword: '', cycle: '', dateFrom: '', dateTo: '', identity: '' })
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [expanded, setExpanded] = useState([])
  const [audit, setAudit] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState(() => REPORT_FIELDS.map((field) => field.key))
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const allRows = useMemo(() => scopeNegativeReportRows(buildNegativeReportRows(data), role), [data, role])
  const rows = allRows.filter((row) => (!filters.keyword || `${row.agentAccount}${row.agentId}${row.teamName}${row.parentAccount}`.toLowerCase().includes(filters.keyword.toLowerCase()))
    && (!filters.cycle || row.cycle === filters.cycle)
    && (!filters.dateFrom || row.periodEnd >= filters.dateFrom)
    && (!filters.dateTo || row.periodStart <= filters.dateTo)
    && (!filters.identity || row.agentIdentity === filters.identity))
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(page, pages)
  const roots = rows.slice((safePage - 1) * pageSize, safePage * pageSize)
  const visibleRows = roots.flatMap((row) => expanded.includes(row.id)
    ? [row, ...row.memberRows.map((member, index) => ({ ...member, index: `${row.index}.${index + 1}` }))]
    : [row])
  const visibleFields = REPORT_FIELDS.filter((field) => visibleKeys.includes(field.key))
  const totals = Object.fromEntries(REPORT_FIELDS.map((field) => {
    if (COUNT_KEYS.has(field.key)) return [field.key, rows.reduce((sum, row) => sum + Number(row[field.key] || 0), 0)]
    if (MONEY_KEYS.has(field.key)) return [field.key, money(rows.reduce((sum, row) => sum + Number(row[field.key] || 0), 0), SIGNED_KEYS.has(field.key))]
    return [field.key, '—']
  }))
  const setFilter = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); setPage(1) }
  const reset = () => {
    setFilters({ keyword: '', cycle: '', dateFrom: '', dateTo: '', identity: '' })
    setVisibleKeys(REPORT_FIELDS.map((field) => field.key))
    setExpanded([])
    setPage(1)
  }
  const toggleField = (key) => setVisibleKeys((current) => current.includes(key)
    ? current.length > 1 ? current.filter((item) => item !== key) : current
    : [...current, key])
  const invertFields = () => setVisibleKeys((current) => {
    const next = REPORT_FIELDS.filter((field) => !current.includes(field.key)).map((field) => field.key)
    return next.length ? next : REPORT_FIELDS.map((field) => field.key)
  })

  return <section className="h5-agent-page h5-agent-negative-page">
    <H5AgentSearch value={filters.keyword} onChange={(value) => setFilter('keyword', value)} onFilter={() => setFilterOpen(true)} placeholder="代理账号、编号、团队或上级" />
    <div className="h5-agent-result-meta"><span>当前筛选 {rows.length} 条</span><div><button type="button" onClick={() => onToast(`负盈利代理佣金报表已导出 ${rows.length} 条`)}>导出</button><button type="button" onClick={() => onToast('负盈利代理佣金报表文件已下载')}>下载文件</button><button type="button" onClick={() => setAudit((value) => !value)}>{audit ? '卡片查看' : '横向核对'}</button></div></div>
    {audit ? <AuditTable rows={visibleRows} fields={visibleFields} totals={totals} /> : <div className="h5-agent-card-list">{roots.flatMap((row) => {
      const cards = [<article className="h5-agent-record-card" key={row.id}>
        <header><div><strong>{row.agentAccount}</strong><small>{row.cycle} · {row.teamName}</small></div><span className="h5-agent-status is-brand">{row.agentIdentity}</span></header>
        <div className="h5-agent-record-summary h5-agent-record-values">
          <div><span>统计时间</span><b>{row.statisticTime}</b></div>
          <div><span>冲正后净输赢</span><b className={tone(row.correctedNet) ? `is-${tone(row.correctedNet)}` : ''}>{money(row.correctedNet, true)}</b></div>
          <div><span>佣金</span><b>{money(row.commission)}</b></div>
          <div><span>下级会员</span><b>{row.subAgentCount}</b></div>
        </div>
        {row.memberRows.length > 0 && <button type="button" className="h5-agent-inline-action h5-agent-expand-members" onClick={() => setExpanded((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])}>{expanded.includes(row.id) ? <MinusOutlined /> : <PlusOutlined />}{expanded.includes(row.id) ? '收起团队成员' : `展开 ${row.memberRows.length} 名团队成员`}</button>}
        <footer><span /><button type="button" className="h5-agent-card-detail" onClick={() => setSelected(row)}>查看全部字段</button></footer>
      </article>]
      if (expanded.includes(row.id)) cards.push(...row.memberRows.map((member) => <article className="h5-agent-record-card is-member" key={member.id}>
        <header><div><strong>{member.agentAccount}</strong><small>{member.agentAccount === row.agentAccount ? '团队负责人' : '副线'} · {member.agentId}</small></div><span className="h5-agent-status is-brand">{member.agentIdentity}</span></header>
        <div className="h5-agent-record-summary h5-agent-record-values"><div><span>冲正后净输赢</span><b>{money(member.correctedNet, true)}</b></div><div><span>佣金</span><b>{money(member.commission)}</b></div><div><span>下级会员</span><b>{member.subAgentCount}</b></div></div>
        <footer><span /><button type="button" className="h5-agent-card-detail" onClick={() => setSelected(member)}>查看全部字段</button></footer>
      </article>))
      return cards
    })}{!roots.length && <H5AgentEmpty title="暂无负盈利佣金报表记录" />}</div>}
    <H5AgentPagination total={rows.length} page={safePage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1) }} />
    <section className="h5-agent-panel h5-agent-formula-panel"><h2>负盈利代理佣金报表口径</h2><H5AgentFields columns={1} items={[
      { label: '净输赢', value: '总输赢 - 场馆费 - 红利 - 返水 + 账户调整 - 存款手续费 - 提款手续费 + 补单输赢' },
      { label: '冲正后净输赢', value: '净输赢 + 上周期结余' },
      { label: '佣金', value: 'MAX(0，冲正后净输赢 × 佣金比例)' },
    ]} /><p className="h5-agent-dashboard-alert">统计日期按记录统计区间与查询日期区间存在重叠进行匹配；本页仅查询与导出，不提供结算操作。</p></section>
    <H5AgentFilterSheet open={filterOpen} title="负盈利佣金报表筛选" onClose={() => setFilterOpen(false)} onReset={reset} onApply={() => { setFilterOpen(false); onToast(`已查询 ${rows.length} 条负盈利代理佣金报表`) }}>
      <H5AgentFormField label="佣金周期"><select value={filters.cycle} onChange={(event) => setFilter('cycle', event.target.value)}><option value="">全部周期</option>{unique(allRows, 'cycle').map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
      <H5AgentFormField label="统计开始日期"><input type="date" value={filters.dateFrom} onChange={(event) => setFilter('dateFrom', event.target.value)} /></H5AgentFormField>
      <H5AgentFormField label="统计结束日期"><input type="date" value={filters.dateTo} onChange={(event) => setFilter('dateTo', event.target.value)} /></H5AgentFormField>
      <H5AgentFormField label="代理身份"><select value={filters.identity} onChange={(event) => setFilter('identity', event.target.value)}><option value="">全部身份</option>{unique(allRows, 'agentIdentity').map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
      <div className="h5-agent-field-filter"><header><span>字段筛选（{visibleKeys.length}/{REPORT_FIELDS.length}）</span><div><button type="button" onClick={() => setVisibleKeys(REPORT_FIELDS.map((field) => field.key))}>全选</button><button type="button" onClick={invertFields}>反选</button></div></header><div>{REPORT_FIELDS.map((field) => <label key={field.key}><input type="checkbox" checked={visibleKeys.includes(field.key)} onChange={() => toggleField(field.key)} /><span>{field.label}</span></label>)}</div></div>
    </H5AgentFilterSheet>
    <H5AgentDetailSheet open={Boolean(selected)} title="负盈利代理佣金报表详情" description={selected ? `${selected.agentAccount} · ${selected.statisticTime}` : ''} onClose={() => setSelected(null)}>{selected && <H5AgentFields items={detailItems(selected)} />}</H5AgentDetailSheet>
  </section>
}
