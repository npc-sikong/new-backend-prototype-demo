import { useMemo, useState } from 'react'
import {
  aggregateLotteryRebateReportRows,
  buildLotteryRebateReportRows,
  scopeLotteryRebateReportRows,
  useLotteryRebate,
} from '../team-agent/lottery-rebate-pages'
import { H5AgentDetailSheet, H5AgentEmpty, H5AgentFields, H5AgentFilterSheet, H5AgentFormField, H5AgentPagination, H5AgentSearch } from './h5-agent-ui'
import { money } from './h5-agent-data'

const DEFAULT_FILTERS = {
  startDate: '2026-08-01',
  endDate: '2026-08-08',
  member: '',
  agent: '',
  lottery: '',
  play: '',
  minValidBet: '',
  maxValidBet: '',
  minRebate: '',
  maxRebate: '',
}

const unique = (rows, key) => [...new Set(rows.map((row) => row[key]).filter(Boolean))]

export function H5LotteryMemberRebateReportPage({ onToast = () => {} }) {
  const { configs } = useLotteryRebate()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const dailyRows = useMemo(() => scopeLotteryRebateReportRows(buildLotteryRebateReportRows(configs), 'rebate'), [configs])
  const lotteryRows = useMemo(() => dailyRows.filter((row) => (!filters.startDate || row.date >= filters.startDate)
    && (!filters.endDate || row.date <= filters.endDate)
    && (!filters.member || row.member.toLowerCase().includes(filters.member.toLowerCase()))
    && (!filters.agent || row.agent === filters.agent)
    && (!filters.lottery || row.lottery === filters.lottery)
    && (!filters.play || row.play === filters.play)), [dailyRows, filters])
  const rows = useMemo(() => aggregateLotteryRebateReportRows(lotteryRows, filters.startDate, filters.endDate).filter((row) => (
    (!filters.minValidBet || row.validBet >= Number(filters.minValidBet))
    && (!filters.maxValidBet || row.validBet <= Number(filters.maxValidBet))
    && (!filters.minRebate || row.totalRebate >= Number(filters.minRebate))
    && (!filters.maxRebate || row.totalRebate <= Number(filters.maxRebate)))), [lotteryRows, filters])
  const totals = rows.reduce((result, row) => ({ validBet: result.validBet + row.validBet, totalRebate: result.totalRebate + row.totalRebate }), { validBet: 0, totalRebate: 0 })
  const safePage = Math.min(page, Math.max(1, Math.ceil(rows.length / pageSize)))
  const visibleRows = rows.slice((safePage - 1) * pageSize, safePage * pageSize)
  const lotteries = unique(dailyRows, 'lottery')
  const plays = unique(dailyRows.filter((row) => !filters.lottery || row.lottery === filters.lottery), 'play')

  const setFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }))
    setPage(1)
  }

  const reset = () => {
    setFilters(DEFAULT_FILTERS)
    setPage(1)
  }

  const exportRows = () => {
    const headers = ['日期区间', '会员账号', '上级代理', '彩票名称', '彩票玩法', '返水比例', '有效投注额', '总返水额度']
    const values = rows.map((row) => [row.dateRange, row.member, row.agent, row.lottery, row.play, `${(row.rate * 100).toFixed(2)}%`, row.validBet, row.totalRebate])
    const csv = [headers, ...values].map((cells) => cells.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = '返水代理彩票会员返水报表.csv'
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    onToast(`已导出 ${rows.length} 条彩票会员返水报表`)
  }

  return <section className="h5-agent-page h5-agent-lottery-rebate-page">
    <H5AgentSearch value={filters.member} onChange={(value) => setFilter('member', value)} onFilter={() => setFilterOpen(true)} placeholder="搜索授权会员账号" />
    <div className="h5-agent-result-meta"><span>返水代理授权范围 · {rows.length} 条</span><button type="button" onClick={exportRows}>导出</button></div>
    <section className="h5-agent-panel h5-agent-rebate-summary">
      <div><span>有效投注额合计</span><strong>{money(totals.validBet)}</strong></div>
      <div><span>总返水额度合计</span><strong>{money(totals.totalRebate)}</strong></div>
      <small>{filters.startDate || '最早记录'} 至 {filters.endDate || '最新记录'} · 不同天数合并统计</small>
    </section>
    <div className="h5-agent-card-list">
      {visibleRows.map((row) => <article key={row.id} className="h5-agent-list-card h5-agent-rebate-record" onClick={() => setSelected(row)}>
        <header><div><b>{row.member}</b><span>{row.lottery} · {row.play}</span></div><em>{(row.rate * 100).toFixed(2)}%</em></header>
        <p>{row.dateRange}</p>
        <div className="h5-agent-card-metrics"><div><span>上级代理</span><b>{row.agent}</b></div><div><span>有效投注额</span><b>{money(row.validBet)}</b></div><div><span>总返水额度</span><b className="is-positive">{money(row.totalRebate)}</b></div></div>
      </article>)}
      {!visibleRows.length && <H5AgentEmpty title="暂无彩票会员返水记录" />}
    </div>
    <H5AgentPagination total={rows.length} page={safePage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1) }} />
    <section className="h5-agent-panel h5-agent-formula-panel"><h2>返水计算口径</h2><H5AgentFields columns={1} items={[
      { label: '数据范围', value: '当前返水代理本人及授权下级会员' },
      { label: '区间有效投注额', value: '相同会员与玩法各日有效投注额之和' },
      { label: '区间总返水额度', value: '区间有效投注额 × 返水比例' },
    ]} /></section>
    <H5AgentFilterSheet open={filterOpen} title="彩票会员返水报表筛选" onClose={() => setFilterOpen(false)} onReset={reset} onApply={() => { setFilterOpen(false); onToast(`已查询 ${rows.length} 条彩票会员返水报表`) }}>
      <H5AgentFormField label="开始日期"><input type="date" value={filters.startDate} onChange={(event) => setFilter('startDate', event.target.value)} /></H5AgentFormField>
      <H5AgentFormField label="结束日期"><input type="date" value={filters.endDate} onChange={(event) => setFilter('endDate', event.target.value)} /></H5AgentFormField>
      <H5AgentFormField label="上级代理"><select value={filters.agent} onChange={(event) => setFilter('agent', event.target.value)}><option value="">全部授权代理</option>{unique(dailyRows, 'agent').map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
      <H5AgentFormField label="彩票名称"><select value={filters.lottery} onChange={(event) => { setFilter('lottery', event.target.value); setFilter('play', '') }}><option value="">全部彩票</option>{lotteries.map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
      <H5AgentFormField label="彩票玩法"><select value={filters.play} onChange={(event) => setFilter('play', event.target.value)}><option value="">全部玩法</option>{plays.map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
      <H5AgentFormField label="有效投注额区间"><div className="h5-agent-range-fields"><input type="number" min="0" value={filters.minValidBet} onChange={(event) => setFilter('minValidBet', event.target.value)} placeholder="最低" /><span>至</span><input type="number" min="0" value={filters.maxValidBet} onChange={(event) => setFilter('maxValidBet', event.target.value)} placeholder="最高" /></div></H5AgentFormField>
      <H5AgentFormField label="总返水额度区间"><div className="h5-agent-range-fields"><input type="number" min="0" value={filters.minRebate} onChange={(event) => setFilter('minRebate', event.target.value)} placeholder="最低" /><span>至</span><input type="number" min="0" value={filters.maxRebate} onChange={(event) => setFilter('maxRebate', event.target.value)} placeholder="最高" /></div></H5AgentFormField>
    </H5AgentFilterSheet>
    <H5AgentDetailSheet open={Boolean(selected)} title="彩票会员返水详情" description={selected ? `${selected.member} · ${selected.dateRange}` : ''} onClose={() => setSelected(null)}>{selected && <H5AgentFields items={[
      { label: '会员账号', value: selected.member }, { label: '上级代理', value: selected.agent },
      { label: '日期区间', value: selected.dateRange }, { label: '彩票名称', value: selected.lottery },
      { label: '彩票玩法', value: selected.play }, { label: '返水比例', value: `${(selected.rate * 100).toFixed(2)}%` },
      { label: '有效投注额', value: money(selected.validBet) }, { label: '总返水额度', value: money(selected.totalRebate) },
    ]} />}</H5AgentDetailSheet>
  </section>
}
