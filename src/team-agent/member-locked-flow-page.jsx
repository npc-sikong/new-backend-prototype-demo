import { useMemo, useState } from 'react'
import { Alert, DataTable, DescriptionGrid, Field, FilterBar, Input, Modal, Money, Panel, SectionHeader, Select, StatusTag } from './ui'

const MEMBER_FLOW_ROWS = [
  { id: 1, site: '旺财体育', agent: 'qiaodashang', member: 'member_10086', currency: 'CNY', deposit: 50000, total: 74528.5, withdrawable: 64152.5, locked: 10376, venueFlow: 31320, depositFlow: 31320 },
  { id: 2, site: '旺财体育', agent: 'WC002', member: 'wc_member02', currency: 'CNY', deposit: 30000, total: 26400, withdrawable: 20400, locked: 6000, venueFlow: 15000, depositFlow: 15000 },
  { id: 3, site: '旺财体育', agent: 'qiaodashang', member: 'vip_8821', currency: 'CNY', deposit: 18000, total: 20000, withdrawable: 12800, locked: 7200, venueFlow: 9600, depositFlow: 9000 },
  { id: 4, site: '旺财体育', agent: 'LGNB', member: 'lgnb_5908', currency: 'CNY', deposit: 12000, total: 14850, withdrawable: 11650, locked: 3200, venueFlow: 10000, depositFlow: 10000 },
  { id: 5, site: '旺财体育', agent: 'daliwei001', member: 'single_0201', currency: 'CNY', deposit: 26000, total: 31560, withdrawable: 31560, locked: 0, venueFlow: 0, depositFlow: 0 },
  { id: 6, site: '财神客栈', agent: 'FEE0426_A8', member: 'fee_member8', currency: 'CNY', deposit: 80000, total: 92600, withdrawable: 80600, locked: 12000, venueFlow: 28000, depositFlow: 28000 },
  { id: 7, site: '财神客栈', agent: 'NA7', member: 'na7_player', currency: 'CNY', deposit: 10000, total: 7800, withdrawable: 5300, locked: 2500, venueFlow: 6800, depositFlow: 6800 },
  { id: 8, site: '旺财体育', agent: 'WC002', member: 'wc_member19', currency: 'CNY', deposit: 45000, total: 51280, withdrawable: 44980, locked: 6300, venueFlow: 17400, depositFlow: 17400 },
]

const VENUE_DETAIL = [
  { id: 'venue-1', venue: 'AG真人', locked: 3600, target: 26900, completed: 14400, pending: 0, remaining: 12500, status: '进行中' },
  { id: 'venue-2', venue: 'PG电子', locked: 2850, target: 17400, completed: 8750, pending: 0, remaining: 8650, status: '进行中' },
  { id: 'venue-3', venue: '体育投注', locked: 3926, target: 20950, completed: 10780, pending: 0, remaining: 10170, status: '进行中' },
]

const DEPOSIT_DETAIL = [
  { id: 'deposit-1', order: 1, type: '充值', occurredAt: '2026-07-13 10:18', amount: 30000, target: 30000, completed: 30000, remaining: 0, status: '已完成' },
  { id: 'deposit-2', order: 2, type: '系统发放彩金', occurredAt: '2026-07-13 10:19', amount: 1000, target: 1000, completed: 1000, remaining: 0, status: '已完成' },
  { id: 'deposit-3', order: 3, type: '充值', occurredAt: '2026-07-14 18:32', amount: 20000, target: 30000, completed: 0, remaining: 30000, status: '进行中' },
  { id: 'deposit-4', order: 4, type: '系统发放彩金', occurredAt: '2026-07-14 18:34', amount: 1000, target: 1320, completed: 0, remaining: 1320, status: '待解锁' },
]

const money = (value) => `¥${Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function FlowAmount({ value, onClick, disabled = false }) {
  return <div className="member-flow-link"><Money value={value} tone="positive" /><button className="ta-table-link" disabled={disabled} onClick={onClick}>查看明细</button></div>
}

function VenueFlowModal({ row, onClose }) {
  const rows = row?.member === 'member_10086' ? VENUE_DETAIL : VENUE_DETAIL.map((item, index) => ({
    ...item,
    id: `${row?.id}-${item.id}`,
    locked: index === 0 ? row?.locked || 0 : 0,
    target: index === 0 ? row?.venueFlow || 0 : 0,
    completed: 0,
    remaining: index === 0 ? row?.venueFlow || 0 : 0,
    status: row?.venueFlow ? '进行中' : '已完成',
  })).slice(0, 1)
  const columns = [
    { key: 'venue', label: '场馆', render: (value) => <b>{value}</b> },
    { key: 'locked', label: '锁定额度', render: (value) => money(value) },
    { key: 'target', label: '目标流水', render: (value) => money(value) },
    { key: 'completed', label: '已完成有效流水', render: (value) => money(value) },
    { key: 'pending', label: '待确认流水', render: (value) => money(value) },
    { key: 'remaining', label: '还需解锁流水', render: (value) => <Money value={value} tone="positive" /> },
    { key: 'status', label: '状态', render: (value) => <StatusTag tone="green">{value}</StatusTag> },
  ]
  return <Modal open={!!row} title="场馆提现流水明细" description={`${row?.member} · ${row?.site} · 统计截至 2026-07-14 21:20`} onClose={onClose} onConfirm={onClose} confirmText="关闭" showCancel={false} width={1320}>
    <div className="member-flow-modal-content">
      <DescriptionGrid columns={4} items={[
        { label: '会员账号', value: row?.member },
        { label: '锁定余额', value: <Money value={row?.locked} /> },
        { label: '场馆提现流水', value: <Money value={row?.venueFlow} tone="positive" /> },
        { label: '当前状态', value: <StatusTag>{row?.venueFlow ? '进行中' : '已完成'}</StatusTag> },
      ]} />
      <DataTable className="member-flow-detail-table" columns={columns} rows={rows} />
      <Alert title="统计口径">单项还需解锁流水 = MAX（0，目标流水 − 已完成有效流水）；总场馆提现流水 = 各场馆及通用任务还需解锁流水之和。待确认流水仅展示进度，不提前计入已完成流水或释放锁定余额。</Alert>
    </div>
  </Modal>
}

function DepositFlowModal({ row, onClose }) {
  const rows = row?.member === 'member_10086' ? DEPOSIT_DETAIL : DEPOSIT_DETAIL.map((item, index) => ({
    ...item,
    id: `${row?.id}-${item.id}`,
    order: index + 1,
    amount: index === 0 ? row?.deposit || 0 : 0,
    target: index === 0 ? row?.depositFlow || 0 : 0,
    completed: 0,
    remaining: index === 0 ? row?.depositFlow || 0 : 0,
    status: row?.depositFlow ? '进行中' : '已完成',
  })).slice(0, 1)
  const columns = [
    { key: 'order', label: '顺序' },
    { key: 'type', label: '类型', render: (value) => <span className={`member-flow-type is-${value === '充值' ? 'deposit' : 'bonus'}`}>{value}</span> },
    { key: 'occurredAt', label: '发生时间' },
    { key: 'amount', label: '计入额度', render: (value) => money(value) },
    { key: 'target', label: '目标流水', render: (value) => money(value) },
    { key: 'completed', label: '已完成流水', render: (value) => money(value) },
    { key: 'remaining', label: '还需解锁流水', render: (value) => <Money value={value} tone={value ? 'positive' : 'neutral'} /> },
    { key: 'status', label: '状态', render: (value) => <StatusTag tone={value === '待解锁' ? 'orange' : 'green'}>{value}</StatusTag> },
  ]
  return <Modal open={!!row} title="充值提现流水明细" description={`${row?.member} · ${row?.site} · 充值与系统发放彩金按发生顺序 FIFO 解锁`} onClose={onClose} onConfirm={onClose} confirmText="关闭" showCancel={false} width={1320}>
    <div className="member-flow-modal-content">
      <DescriptionGrid columns={5} items={[
        { label: '会员账号', value: row?.member },
        { label: '流水记录', value: row?.member === 'member_10086' ? '4 笔（充值 / 系统发放彩金）' : '1 笔（充值）' },
        { label: '计入额度', value: `${money(row?.deposit)} / ${money(row?.deposit === 50000 ? 2000 : 0)}` },
        { label: '还需解锁流水', value: <Money value={row?.depositFlow} tone="positive" /> },
        { label: '盈利解锁额度', value: <><Money value={row?.member === 'member_10086' ? 22528.5 : Math.max(0, (row?.total || 0) - (row?.deposit || 0))} /><small>待本轮全部完成</small></> },
      ]} />
      <DataTable className="member-flow-detail-table" columns={columns} rows={rows} />
      <Alert title="统计口径">成功充值与系统发放彩金均视为充值行为，独立建立流水记录，无需关联充值订单；按发生时间 FIFO 解锁，前一笔未完成时不得跳过。还需解锁流水为当前周期内各笔记录还需解锁流水之和；盈利解锁额度仅在用户盈利时展示，需本轮全部充值流水完成后才可领取。</Alert>
    </div>
  </Modal>
}

export function MemberLockedFlowPage({ onToast }) {
  const emptyFilters = { site: '', agent: '', member: '' }
  const [draft, setDraft] = useState(emptyFilters)
  const [filters, setFilters] = useState(emptyFilters)
  const [venueRow, setVenueRow] = useState(null)
  const [depositRow, setDepositRow] = useState(null)
  const rows = useMemo(() => MEMBER_FLOW_ROWS.filter((row) => (
    (!filters.site || row.site === filters.site)
    && (!filters.agent || row.agent.toLowerCase().includes(filters.agent.toLowerCase()))
    && (!filters.member || row.member.toLowerCase().includes(filters.member.toLowerCase()))
  )), [filters])
  const columns = [
    { key: 'site', label: '站点' },
    { key: 'agent', label: '代理' },
    { key: 'member', label: '会员账号 / ID', render: (value) => <b>{value}</b> },
    { key: 'currency', label: '币种' },
    { key: 'deposit', label: '充值额度', render: (value) => <b>{money(value)}</b> },
    { key: 'total', label: '总余额', render: (value) => <b>{money(value)}</b> },
    { key: 'withdrawable', label: '可提现余额', render: (value) => <Money value={value} tone="positive" /> },
    { key: 'locked', label: '锁定余额', render: (value) => <b>{money(value)}</b> },
    { key: 'venueFlow', label: '场馆提现流水', render: (value, row) => <FlowAmount value={value} onClick={() => setVenueRow(row)} /> },
    { key: 'depositFlow', label: '充值提现流水', render: (value, row) => <FlowAmount value={value} onClick={() => setDepositRow(row)} /> },
  ]
  function reset() {
    setDraft(emptyFilters)
    setFilters(emptyFilters)
    onToast('筛选条件已重置')
  }
  return <section className="member-locked-flow-screen">
    <SectionHeader title="会员锁定流水查询" description="查询会员可提现、锁定余额及场馆与充值提现流水，并下钻核对每笔解锁进度。" />
    <FilterBar onSearch={() => { setFilters(draft); onToast(`已查询到 ${MEMBER_FLOW_ROWS.filter((row) => (!draft.site || row.site === draft.site) && (!draft.agent || row.agent.toLowerCase().includes(draft.agent.toLowerCase())) && (!draft.member || row.member.toLowerCase().includes(draft.member.toLowerCase()))).length} 条会员流水`) }} onReset={reset} onExport={() => onToast(`已导出当前 ${rows.length} 条会员锁定流水`)}>
        <Field label="站点"><Select value={draft.site} onChange={(value) => setDraft((current) => ({ ...current, site: value }))} placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field>
        <Field label="代理账号"><Input value={draft.agent} onChange={(value) => setDraft((current) => ({ ...current, agent: value }))} placeholder="请输入代理账号" /></Field>
        <Field label="会员账号 / ID"><Input value={draft.member} onChange={(value) => setDraft((current) => ({ ...current, member: value }))} placeholder="请输入会员账号或ID" /></Field>
    </FilterBar>
    <Alert title="金额与流水口径">总余额 = 可提现余额 + 锁定余额；场馆提现流水为各场馆及通用任务仍需解锁流水之和；充值提现流水按充值与系统发放彩金生成独立记录并按发生时间 FIFO 解锁。</Alert>
    <Panel title="会员锁定流水统计" description={`共 ${rows.length} 条`} className="member-flow-panel"><DataTable minWidth={1280} columns={columns} rows={rows} paginated /></Panel>
    <VenueFlowModal row={venueRow} onClose={() => setVenueRow(null)} />
    <DepositFlowModal row={depositRow} onClose={() => setDepositRow(null)} />
  </section>
}
