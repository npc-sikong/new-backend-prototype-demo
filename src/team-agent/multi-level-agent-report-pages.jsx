import { useMemo, useState } from 'react'
import { BarChartOutlined, DownloadOutlined, FileDoneOutlined, FolderOpenOutlined, SearchOutlined, UndoOutlined } from '@ant-design/icons'
import { ACCOUNT_CHANGE_ROWS, ACTIVITY_ROWS, MEMBER_FUND_ROWS, REVERSAL_REPAYMENT_ROWS, VENUE_FEE_ROWS, rowsForAgentRole } from './multi-level-agent-data'
import { Button, DataTable, DescriptionGrid, Field, FormGrid, Input, Modal, Money, Select, StatusTag } from './ui'

function ReportFilters({ children, onSearch, onReset, onExport }) {
  return <div className="ml-filter-surface ml-report-filters"><div className="ml-filter-grid">{children}</div><div className="ml-filter-actions"><Button icon={<SearchOutlined />} onClick={onSearch}>查询</Button><Button variant="ghost" onClick={onReset}>重置</Button>{onExport && <Button icon={<DownloadOutlined />} variant="ghost" onClick={onExport}>导出报表</Button>}</div></div>
}

function amountCell(value) {
  return <b className={Number(value) > 0 ? 'ml-positive' : Number(value) < 0 ? 'ml-negative' : ''}>{Number(value) > 0 ? '+' : ''}{Number(value).toFixed(2)}</b>
}

export function MultiLevelAccountChangesPage({ role = 'multiLevel', onToast }) {
  const defaults = { member: '', type: '' }
  const [filters, setFilters] = useState(defaults)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const scopedRows = rowsForAgentRole(ACCOUNT_CHANGE_ROWS, role)
  const rows = useMemo(() => scopedRows.filter((row) => (!filters.member || row.member.includes(filters.member)) && (!filters.type || row.type === filters.type)), [filters, scopedRows])
  const total = rows.reduce((sum, row) => sum + row.amount, 0)
  const columns = [{ key: 'memberId', label: '会员账号' }, { key: 'member', label: '会员名' }, { key: 'type', label: '账变类型' }, { key: 'amount', label: '账变金额(元)', render: amountCell }, { key: 'time', label: '时间' }, { key: 'id', label: '记录编号' }]
  return <section className="ml-screen"><div className="ml-section-title"><h1>账变明细</h1></div><ReportFilters onSearch={() => onToast(`已查询 ${rows.length} 条账变`)} onReset={() => setFilters(defaults)}><Field label="会员名"><Input value={filters.member} onChange={(value) => setFilter('member', value)} placeholder="请输入会员名" /></Field><Field label="账变类型"><Select value={filters.type} onChange={(value) => setFilter('type', value)} placeholder="全部" options={[...new Set(ACCOUNT_CHANGE_ROWS.map((row) => row.type))]} /></Field><Field label="账变时间"><Input type="date" value="2026-07-21" /></Field></ReportFilters><div className="ml-card"><DataTable paginated columns={columns} rows={rows} footer={<tr><td>总计</td><td>—</td><td>—</td><td>{amountCell(total)}</td><td>—</td><td>—</td></tr>} /></div></section>
}

export function MultiLevelMemberFundsPage({ role = 'multiLevel', onToast }) {
  const defaults = { orderNo: '', account: '', type: '', status: '', remark: '' }
  const [filters, setFilters] = useState(defaults)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const scopedRows = rowsForAgentRole(MEMBER_FUND_ROWS, role)
  const rows = useMemo(() => scopedRows.filter((row) => (!filters.orderNo || row.orderNo.includes(filters.orderNo)) && (!filters.account || row.account.includes(filters.account)) && (!filters.type || row.type === filters.type) && (!filters.status || row.status === filters.status) && (!filters.remark || row.remark.includes(filters.remark))), [filters, scopedRows])
  const columns = [{ key: 'orderNo', label: '单号' }, { key: 'account', label: '会员账号' }, { key: 'type', label: '交易类型' }, { key: 'currency', label: '币种' }, { key: 'amount', label: '金额', render: amountCell }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'createdAt', label: '创建时间' }, { key: 'remark', label: '备注' }]
  return <section className="ml-screen"><ReportFilters onSearch={() => onToast(`已查询 ${rows.length} 条会员资金记录`)} onReset={() => setFilters(defaults)}><Field label="单号"><Input value={filters.orderNo} onChange={(value) => setFilter('orderNo', value)} placeholder="请输入单号" /></Field><Field label="会员账号"><Input value={filters.account} onChange={(value) => setFilter('account', value)} placeholder="请输入会员账号名称" /></Field><Field label="备注"><Input value={filters.remark} onChange={(value) => setFilter('remark', value)} placeholder="请输入备注" /></Field><Field label="交易类型"><Select value={filters.type} onChange={(value) => setFilter('type', value)} placeholder="全部" options={[...new Set(MEMBER_FUND_ROWS.map((row) => row.type))]} /></Field><Field label="状态"><Select value={filters.status} onChange={(value) => setFilter('status', value)} placeholder="全部" options={[...new Set(MEMBER_FUND_ROWS.map((row) => row.status))]} /></Field><Field label="创建时间"><Input type="date" value="2026-07-21" /></Field></ReportFilters><div className="ml-card"><DataTable paginated minWidth={1350} columns={columns} rows={rows} /></div></section>
}

export function MultiLevelReversalStatsPage({ onToast }) {
  const metrics = [{ label: '垫付冲正代理总人数', value: '0' }, { label: '总欠款人数', value: '0' }, { label: '垫付总计', value: '¥0.00', tone: 'blue' }, { label: '回款总计', value: '¥0.00', tone: 'green' }, { label: '垫付剩余金额', value: '¥0.00', tone: 'red' }, { label: '欠款总计', value: '¥0.00', tone: 'orange' }]
  const columns = ['代理账号', 'ID', '代理等级', '垫付冲正代理总人数', '垫付余额(¥)', '垫付级差佣金(¥)', '垫付会员盈利(¥)', '垫付直属佣金(¥)', '垫付总计(¥)', '回款总计(¥)', '垫付剩余金额(¥)', '欠款人数', '欠款总计(¥)'].map((label, index) => ({ key: `col-${index}`, label }))
  return <section className="ml-screen"><div className="ml-report-hero blue"><div><i><BarChartOutlined /></i><span><h1>冲正统计报表</h1><p>统计代理冲正业务数据，包括代冲人数、额度及追回欠款汇总。</p></span></div></div><div className="ml-report-metrics">{metrics.map((item) => <article key={item.label} className={item.tone || ''}><span>{item.label}</span><strong>{item.value}</strong></article>)}</div><ReportFilters onSearch={() => onToast('冲正统计已查询')} onReset={() => onToast('筛选条件已重置')}><Field label="统计周期"><Input type="date" value="2026-07-21" /></Field><Field label="搜索代理"><Input placeholder="搜索代理账号/ID..." /></Field></ReportFilters><div className="ml-card"><DataTable minWidth={1800} columns={columns} rows={[]} /></div></section>
}

export function MultiLevelReversalRepaymentPage({ onToast }) {
  const defaults = { type: '', direction: '', keyword: '' }
  const [filters, setFilters] = useState(defaults)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const rows = useMemo(() => REVERSAL_REPAYMENT_ROWS.filter((row) => (!filters.type || row.type === filters.type) && (!filters.direction || row.direction === filters.direction) && (!filters.keyword || `${row.name}${row.id}`.includes(filters.keyword))), [filters])
  const columns = [{ key: 'site', label: '所属站点' }, { key: 'name', label: '名称', render: (value) => <b>{value}</b> }, { key: 'id', label: 'ID' }, { key: 'level', label: '代理等级' }, { key: 'type', label: '类型' }, { key: 'direction', label: '垫付/回款', render: (value) => <StatusTag tone={value === '回款' ? 'green' : 'orange'}>{value}</StatusTag> }, { key: 'amount', label: '额度', render: (value) => <Money value={value} /> }, { key: 'gap', label: '额度缺口', render: (value) => <b className={value ? 'ml-negative' : ''}>¥{Number(value).toFixed(2)}</b> }, { key: 'ledger', label: '充正账目ID' }, { key: 'time', label: '时间' }]
  return <section className="ml-screen"><div className="ml-report-hero green"><div><i><UndoOutlined /></i><span><h1>冲正/回款报表</h1><p>记录每一笔代理代冲操作及后续回款的明细流水。</p></span></div><div><Button icon={<DownloadOutlined />} variant="ghost" onClick={() => onToast('冲正回款明细已导出')}>导出明细数据</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast('下载文件入口已触发')}>下载文件</Button></div></div><ReportFilters onSearch={() => onToast(`已查询 ${rows.length} 条冲正回款`)} onReset={() => setFilters(defaults)}><Field label="查询时间"><Input type="date" value="2026-07-20" /></Field><Field label="所属站点"><Input value="2222" disabled /></Field><Field label="类型"><Select value={filters.type} onChange={(value) => setFilter('type', value)} placeholder="全部类型" options={[...new Set(REVERSAL_REPAYMENT_ROWS.map((row) => row.type))]} /></Field><Field label="垫付/回款"><Select value={filters.direction} onChange={(value) => setFilter('direction', value)} placeholder="全部" options={['垫付', '回款']} /></Field><Field label="搜索代理"><Input value={filters.keyword} onChange={(value) => setFilter('keyword', value)} placeholder="搜索代理名称/ID..." /></Field></ReportFilters><div className="ml-card"><DataTable paginated minWidth={1450} columns={columns} rows={rows} /></div></section>
}

export function MultiLevelVenueFeesPage({ role = 'multiLevel', onToast }) {
  const [keyword, setKeyword] = useState('')
  const scopedRows = rowsForAgentRole(VENUE_FEE_ROWS, role)
  const rows = useMemo(() => scopedRows.filter((row) => !keyword || row.agent.toLowerCase().includes(keyword.toLowerCase())), [keyword, scopedRows])
  const totals = rows.reduce((result, row) => ({ venues: result.venues + row.venues, directFee: result.directFee + row.directFee, levelFee: result.levelFee + row.levelFee, total: result.total + row.total }), { venues: 0, directFee: 0, levelFee: 0, total: 0 })
  const columns = [{ key: 'period', label: '时间' }, { key: 'site', label: '站点' }, { key: 'parent', label: '上级代理' }, { key: 'agent', label: '代理名称', render: (value) => <b>{value}</b> }, { key: 'level', label: '代理级别', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'rebate', label: '代理返佣', render: (value) => <b className="ml-positive">{value}</b> }, { key: 'venues', label: '场馆数量', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'directFee', label: '直属承担三方场馆费用', render: (value) => <b className="ml-negative">{Number(value).toFixed(2)}</b> }, { key: 'levelFee', label: '级差三方场馆费用', render: (value) => <b className="ml-orange">{Number(value).toFixed(2)}</b> }, { key: 'total', label: '总承担费用', render: (value) => <b className="ml-positive">{Number(value).toFixed(2)}</b> }]
  return <section className="ml-screen"><div className="ml-section-title"><h1>三方场馆代理费用明细</h1><div><Button icon={<DownloadOutlined />} variant="success" onClick={() => onToast('三方场馆代理费用已导出')}>导出报表</Button><Button variant="ghost" onClick={() => onToast('下载文件入口已触发')}>下载文件</Button></div></div><ReportFilters onSearch={() => onToast(`已查询 ${rows.length} 条场馆费用`)} onReset={() => setKeyword('')}><Field label="代理名称"><Input value={keyword} onChange={setKeyword} placeholder="搜索代理名称..." /></Field><Field label="站点"><Input value="2222" disabled /></Field><Field label="时间筛选"><Input type="date" value="2026-07-19" /></Field></ReportFilters><div className="ml-card"><DataTable paginated minWidth={1450} columns={columns} rows={rows} footer={<tr><td>总计</td><td>—</td><td>—</td><td>—</td><td>—</td><td>—</td><td>{totals.venues}</td><td>{totals.directFee.toFixed(2)}</td><td>{totals.levelFee.toFixed(2)}</td><td>{totals.total.toFixed(2)}</td></tr>} /></div></section>
}

export function MultiLevelActivitiesPage({ onToast }) {
  const defaults = { name: '', type: '' }
  const [filters, setFilters] = useState(defaults)
  const [selected, setSelected] = useState(null)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const rows = useMemo(() => ACTIVITY_ROWS.filter((row) => (!filters.name || row.name.includes(filters.name)) && (!filters.type || row.type === filters.type)), [filters])
  const columns = [{ key: 'createdAt', label: '时间' }, { key: 'site', label: '站点' }, { key: 'id', label: '活动编码' }, { key: 'name', label: '活动名称' }, { key: 'type', label: '活动类型' }, { key: 'target', label: '活动对象' }, { key: 'start', label: '开始时间' }, { key: 'end', label: '结束时间' }, { key: 'order', label: '活动排序' }, { key: 'hot', label: '热门排序' }, { key: 'status', label: '当前状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'action', label: '操作', render: (_, row) => <button className="ta-table-link" onClick={() => setSelected(row)}>详情</button> }]
  return <section className="ml-screen"><ReportFilters onSearch={() => onToast(`已查询 ${rows.length} 条活动`)} onReset={() => setFilters(defaults)}><Field label="活动名称"><Input value={filters.name} onChange={(value) => setFilter('name', value)} placeholder="请输入活动名称" /></Field><Field label="活动类型"><Select value={filters.type} onChange={(value) => setFilter('type', value)} placeholder="全部" options={[...new Set(ACTIVITY_ROWS.map((row) => row.type))]} /></Field><Field label="站点"><Input value="旺财体育" disabled /></Field><Field label="查询日期"><Input type="date" value="2026-07-21" /></Field></ReportFilters><div className="ml-card"><DataTable paginated minWidth={1500} columns={columns} rows={rows} /></div><Modal open={Boolean(selected)} title="活动详情" description="查看当前多层级代理可见的活动资料。" onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭" showCancel={false} width={760}>{selected && <><DescriptionGrid columns={2} items={[{ label: '活动编码', value: selected.id }, { label: '活动名称', value: selected.name }, { label: '活动类型', value: selected.type }, { label: '活动对象', value: selected.target }, { label: '开始时间', value: selected.start }, { label: '结束时间', value: selected.end }, { label: '当前状态', value: <StatusTag>{selected.status}</StatusTag> }, { label: '站点', value: selected.site }]} /><FormGrid columns={1}><Field label="活动说明"><Input value="活动按页面展示时间和对象生效，具体领取条件以站点活动规则为准。" disabled /></Field></FormGrid></>}</Modal></section>
}
