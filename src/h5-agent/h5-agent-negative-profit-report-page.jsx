import { useMemo, useState } from 'react'
import { useTeamAgent } from '../team-agent/context'
import {
  buildNegativeReportRows,
  NEGATIVE_COMMISSION_REPORT_COLUMNS,
  NEGATIVE_REPORT_COUNT_KEYS,
  NEGATIVE_REPORT_MONEY_KEYS,
  NEGATIVE_REPORT_SIGNED_MONEY_KEYS,
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

const COUNT_KEYS = new Set(NEGATIVE_REPORT_COUNT_KEYS)
const MONEY_KEYS = new Set(NEGATIVE_REPORT_MONEY_KEYS)
const SIGNED_KEYS = new Set(NEGATIVE_REPORT_SIGNED_MONEY_KEYS)
const REPORT_FIELDS = NEGATIVE_COMMISSION_REPORT_COLUMNS

const unique = (rows, key) => [...new Set(rows.map((row) => row[key]).filter(Boolean))]
const rowSearchText = (row) => `${row.agentAccount}${row.agentId}${row.teamName}${row.parentAccount}${row.recommender}${row.memberRows.map((item) => `${item.agentAccount}${item.agentId}${item.teamName}${item.recommender}`).join('')}`.toLowerCase()
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

function operatingDetailItems(detail) {
  const historical = detail?.fieldKey === 'historicalOperatingExpense'
  const breakdown = historical ? detail?.row.historicalOperatingExpenseBreakdown : detail?.row.operatingExpenseBreakdown
  return [
    { label: '活动奖励', value: money(breakdown?.activityRewards) },
    { label: '会员推会员', value: money(breakdown?.memberReferralReward) },
    { label: '返水', value: money(breakdown?.memberRebate) },
    { label: '礼金', value: money(breakdown?.giftAmount) },
    { label: '人工发彩金', value: money(breakdown?.manualBonus) },
    { label: '余额宝利息', value: money(breakdown?.yuebaoInterest) },
    { label: historical ? '历史运营费用合计' : '运营费用合计', value: money(detail?.row[detail?.fieldKey]) },
  ]
}

function AuditTable({ rows, fields, totals, expanded, onToggle, onOperatingDetail }) {
  return <div className="h5-agent-audit-wrap"><table className="h5-agent-audit-table"><thead><tr>{fields.map((field) => <th key={field.key}>{field.label}</th>)}</tr></thead><tbody>
    {rows.map((row) => <tr key={row.id} className={row.isRecommended ? `is-recommended is-${row.rowType === 'recommended-team' ? 'team' : 'single'}` : row.rowType === 'member' ? 'is-member' : ''}>{fields.map((field) => <td key={field.key}>{field.key === 'agentAccount' && row.expandable ? <span className="h5-agent-audit-account"><span>{row.agentAccount}</span><button type="button" onClick={() => onToggle(row)}>（{expanded.includes(row.id) ? '收起' : '展开'}）</button></span> : ['operatingExpense', 'historicalOperatingExpense'].includes(field.key) ? <button type="button" className="h5-agent-cost-link" onClick={() => onOperatingDetail({ row, fieldKey: field.key })}>{displayValue(field, row)}</button> : displayValue(field, row)}</td>)}</tr>)}
    {!rows.length && <tr><td colSpan={fields.length}>暂无数据</td></tr>}
    {!!rows.length && <tr className="h5-agent-audit-total">{fields.map((field, index) => <td key={field.key}>{index === 0 ? '总计' : totals[field.key] ?? '—'}</td>)}</tr>}
  </tbody></table></div>
}

export function H5NegativeProfitReportPage({ role = 'main', onToast = () => {} }) {
  const { data } = useTeamAgent()
  const [filters, setFilters] = useState({ keyword: '', cycle: '', dateFrom: '', dateTo: '', identity: '' })
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [operatingDetail, setOperatingDetail] = useState(null)
  const [expanded, setExpanded] = useState([])
  const [audit, setAudit] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState(() => REPORT_FIELDS.map((field) => field.key))
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const allRows = useMemo(() => scopeNegativeReportRows(buildNegativeReportRows(data, { includeRecommendations: true }), role), [data, role])
  const rows = allRows.filter((row) => (!filters.keyword || rowSearchText(row).includes(filters.keyword.toLowerCase()))
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
  const toggleRow = (row) => setExpanded((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])
  const invertFields = () => setVisibleKeys((current) => {
    const next = REPORT_FIELDS.filter((field) => !current.includes(field.key)).map((field) => field.key)
    return next.length ? next : REPORT_FIELDS.map((field) => field.key)
  })

  return <section className="h5-agent-page h5-agent-negative-page">
    <H5AgentSearch value={filters.keyword} onChange={(value) => setFilter('keyword', value)} onFilter={() => setFilterOpen(true)} placeholder="代理账号、编号、团队或上级" />
    <div className="h5-agent-result-meta"><span>当前筛选 {rows.length} 条</span><div><button type="button" onClick={() => onToast(`负盈利代理佣金报表已导出 ${rows.length} 条`)}>导出</button><button type="button" onClick={() => onToast('负盈利代理佣金报表文件已下载')}>下载文件</button><button type="button" onClick={() => setAudit((value) => !value)}>{audit ? '卡片查看' : '横向核对'}</button></div></div>
    {audit ? <AuditTable rows={visibleRows} fields={visibleFields} totals={totals} expanded={expanded} onToggle={toggleRow} onOperatingDetail={setOperatingDetail} /> : <div className="h5-agent-card-list">{roots.flatMap((row) => {
      const cards = [<article className="h5-agent-record-card" key={row.id}>
        <header><div><div className="h5-agent-record-account-line"><i>#{row.index}</i><strong>{row.agentAccount}</strong>{row.expandable && <button type="button" onClick={() => toggleRow(row)}>（{expanded.includes(row.id) ? '收起' : '展开'}）</button>}</div><small>{row.cycle} · {row.teamName}</small></div><span className="h5-agent-status is-brand">{row.agentIdentity}</span></header>
        <div className="h5-agent-record-summary h5-agent-record-values">
          <div><span>统计时间</span><b>{row.statisticTime}</b></div>
          <div><span>代理类型</span><b>{row.agentType}</b></div>
          <div><span>推荐人</span><b>{row.recommender}</b></div>
          <div><span>代理层级</span><b>{row.agentLevel}</b></div>
          <div><span>总输赢</span><b className={tone(row.totalWinLoss) ? `is-${tone(row.totalWinLoss)}` : ''}>{money(row.totalWinLoss, true)}</b></div>
          <div><span>历史总输赢</span><b className={tone(row.historicalTotalWinLoss) ? `is-${tone(row.historicalTotalWinLoss)}` : ''}>{money(row.historicalTotalWinLoss, true)}</b></div>
          <div><span>运营费用</span><button type="button" className="h5-agent-cost-link" onClick={() => setOperatingDetail({ row, fieldKey: 'operatingExpense' })}>{money(row.operatingExpense)}</button></div>
          <div><span>历史运营费用</span><button type="button" className="h5-agent-cost-link" onClick={() => setOperatingDetail({ row, fieldKey: 'historicalOperatingExpense' })}>{money(row.historicalOperatingExpense)}</button></div>
          <div><span>三方场馆费用</span><b>{money(row.thirdPartyVenueFee)}</b></div>
          <div><span>充提手续费</span><b>{money(row.depositWithdrawalFee)}</b></div>
          <div><span>返佣等级</span><b>{row.rebateLevel}</b></div>
          <div><span>返佣比例</span><b>{Number(row.rate || 0) * 100}%</b></div>
          <div><span>历史结余佣金</span><b>{money(row.previousCommissionBalance, true)}</b></div>
          <div><span>佣金净收益</span><b className={tone(row.commissionNetIncome) ? `is-${tone(row.commissionNetIncome)}` : ''}>{money(row.commissionNetIncome, true)}</b></div>
          <div><span>欠站点总额</span><b>{money(row.totalDebt)}</b></div>
          <div><span>佣金</span><b>{money(row.commission)}</b></div>
          <div><span>下级会员</span><b>{row.subAgentCount}</b></div>
        </div>
        <footer><span /><button type="button" className="h5-agent-card-detail" onClick={() => setSelected(row)}>查看全部字段</button></footer>
      </article>]
      if (expanded.includes(row.id)) cards.push(...row.memberRows.map((member) => <article className={`h5-agent-record-card ${member.isRecommended ? `is-recommended is-${member.rowType === 'recommended-team' ? 'team' : 'single'}` : 'is-member'}`} key={member.id}>
        <header><div><div className="h5-agent-record-account-line"><i>#{member.index}</i><strong>{member.agentAccount}</strong></div><small>{member.isRecommended ? member.recommendationLabel : member.agentLevel} · {member.agentId}</small></div><span className="h5-agent-status is-brand">{member.isRecommended ? member.recommendationLabel : member.agentIdentity}</span></header>
        <div className="h5-agent-record-summary h5-agent-record-values"><div><span>代理类型</span><b>{member.agentType}</b></div><div><span>推荐人</span><b>{member.recommender}</b></div><div><span>代理层级</span><b>{member.agentLevel}</b></div><div><span>总输赢</span><b>{money(member.totalWinLoss, true)}</b></div><div><span>历史总输赢</span><b>{money(member.historicalTotalWinLoss, true)}</b></div><div><span>运营费用</span><button type="button" className="h5-agent-cost-link" onClick={() => setOperatingDetail({ row: member, fieldKey: 'operatingExpense' })}>{money(member.operatingExpense)}</button></div><div><span>历史运营费用</span><button type="button" className="h5-agent-cost-link" onClick={() => setOperatingDetail({ row: member, fieldKey: 'historicalOperatingExpense' })}>{money(member.historicalOperatingExpense)}</button></div><div><span>三方场馆费用</span><b>{money(member.thirdPartyVenueFee)}</b></div><div><span>充提手续费</span><b>{money(member.depositWithdrawalFee)}</b></div><div><span>返佣等级</span><b>{member.rebateLevel}</b></div><div><span>返佣比例</span><b>{Number(member.rate || 0) * 100}%</b></div><div><span>历史结余佣金</span><b>{money(member.previousCommissionBalance, true)}</b></div><div><span>佣金净收益</span><b>{money(member.commissionNetIncome, true)}</b></div><div><span>欠站点总额</span><b>{money(member.totalDebt)}</b></div><div><span>佣金</span><b>{money(member.commission)}</b></div><div><span>下级会员</span><b>{member.subAgentCount}</b></div></div>
        <footer><span /><button type="button" className="h5-agent-card-detail" onClick={() => setSelected(member)}>查看全部字段</button></footer>
      </article>))
      return cards
    })}{!roots.length && <H5AgentEmpty title="暂无负盈利佣金报表记录" />}</div>}
    <H5AgentPagination total={rows.length} page={safePage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1) }} />
    <section className="h5-agent-panel h5-agent-formula-panel"><h2>负盈利代理佣金报表口径</h2><H5AgentFields columns={1} items={[
      { label: '运营费用', value: '各活动奖励 + 会员推会员 + 返水 + 礼金 + 人工发彩金 + 余额宝利息' },
      { label: '历史运营费用', value: '历史各活动奖励 + 历史会员推会员 + 历史返水 + 历史礼金 + 历史人工发彩金 + 历史余额宝利息' },
      { label: '佣金净收益', value: '（总输赢 + 历史总输赢）× 返佣比例 − 运营费用 − 历史运营费用 − 三方场馆费用 − 充提手续费' },
      { label: '欠站点总额', value: 'MAX(0，-（净输赢 + 历史总输赢）)' },
      { label: '佣金', value: '佣金净收益 + 历史结余佣金' },
    ]} /><p className="h5-agent-dashboard-alert">统计日期按记录统计区间与查询日期区间存在重叠进行匹配；本页仅查询与导出，不提供结算操作。</p></section>
    <H5AgentFilterSheet open={filterOpen} title="负盈利佣金报表筛选" onClose={() => setFilterOpen(false)} onReset={reset} onApply={() => { setFilterOpen(false); onToast(`已查询 ${rows.length} 条负盈利代理佣金报表`) }}>
      <H5AgentFormField label="佣金周期"><select value={filters.cycle} onChange={(event) => setFilter('cycle', event.target.value)}><option value="">全部周期</option>{unique(allRows, 'cycle').map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
      <H5AgentFormField label="统计开始日期"><input type="date" value={filters.dateFrom} onChange={(event) => setFilter('dateFrom', event.target.value)} /></H5AgentFormField>
      <H5AgentFormField label="统计结束日期"><input type="date" value={filters.dateTo} onChange={(event) => setFilter('dateTo', event.target.value)} /></H5AgentFormField>
      <H5AgentFormField label="代理身份"><select value={filters.identity} onChange={(event) => setFilter('identity', event.target.value)}><option value="">全部身份</option>{unique(allRows, 'agentIdentity').map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
      <div className="h5-agent-field-filter"><header><span>字段筛选（{visibleKeys.length}/{REPORT_FIELDS.length}）</span><div><button type="button" onClick={() => setVisibleKeys(REPORT_FIELDS.map((field) => field.key))}>全选</button><button type="button" onClick={invertFields}>反选</button></div></header><div>{REPORT_FIELDS.map((field) => <label key={field.key}><input type="checkbox" checked={visibleKeys.includes(field.key)} onChange={() => toggleField(field.key)} /><span>{field.label}</span></label>)}</div></div>
    </H5AgentFilterSheet>
    <H5AgentDetailSheet open={Boolean(selected)} title="负盈利代理佣金报表详情" description={selected ? `${selected.agentAccount} · ${selected.statisticTime}` : ''} onClose={() => setSelected(null)}>{selected && <H5AgentFields items={detailItems(selected)} />}</H5AgentDetailSheet>
    <H5AgentDetailSheet open={Boolean(operatingDetail)} title={operatingDetail?.fieldKey === 'historicalOperatingExpense' ? '历史运营费用明细' : '运营费用明细'} description={operatingDetail ? `${operatingDetail.row.agentAccount} · ${operatingDetail.row.cycle}` : ''} onClose={() => setOperatingDetail(null)}>{operatingDetail && <H5AgentFields columns={1} items={operatingDetailItems(operatingDetail)} />}</H5AgentDetailSheet>
  </section>
}
