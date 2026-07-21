import { useMemo, useState } from 'react'
import { Alert, Button, DataTable, DescriptionGrid, Field, FilterBar, Input, Modal, Money, Panel, SectionHeader, Select, StatusTag } from './ui'

const MEMBER_FLOW_ROWS = [
  { id: 1, site: '旺财体育', agent: 'qiaodashang', member: 'member_10086', currency: 'CNY', deposit: 50000, unlockedBonus: 2000, total: 74528.5, withdrawable: 64152.5, locked: 10376, withdrawalFlow: 31320 },
  { id: 2, site: '旺财体育', agent: 'WC002', member: 'wc_member02', currency: 'CNY', deposit: 30000, unlockedBonus: 1200, total: 26400, withdrawable: 20400, locked: 6000, withdrawalFlow: 15000 },
  { id: 3, site: '旺财体育', agent: 'qiaodashang', member: 'vip_8821', currency: 'CNY', deposit: 18000, unlockedBonus: 900, total: 20000, withdrawable: 12800, locked: 7200, withdrawalFlow: 9000 },
  { id: 4, site: '旺财体育', agent: 'LGNB', member: 'lgnb_5908', currency: 'CNY', deposit: 12000, unlockedBonus: 500, total: 14850, withdrawable: 11650, locked: 3200, withdrawalFlow: 10000 },
  { id: 5, site: '旺财体育', agent: 'daliwei001', member: 'single_0201', currency: 'CNY', deposit: 26000, unlockedBonus: 0, total: 31560, withdrawable: 31560, locked: 0, withdrawalFlow: 0 },
  { id: 6, site: '财神客栈', agent: 'FEE0426_A8', member: 'fee_member8', currency: 'CNY', deposit: 80000, unlockedBonus: 3000, total: 92600, withdrawable: 80600, locked: 12000, withdrawalFlow: 28000 },
  { id: 7, site: '财神客栈', agent: 'NA7', member: 'na7_player', currency: 'CNY', deposit: 10000, unlockedBonus: 600, total: 7800, withdrawable: 5300, locked: 2500, withdrawalFlow: 6800 },
  { id: 8, site: '旺财体育', agent: 'WC002', member: 'wc_member19', currency: 'CNY', deposit: 45000, unlockedBonus: 1500, total: 51280, withdrawable: 44980, locked: 6300, withdrawalFlow: 17400 },
]

const WITHDRAWAL_DETAIL = [
  { id: 'flow-1', startAt: '2026-07-13 10:18', type: 'AG真人', locked: 3600, target: 26900, completed: 14400, pending: 0, remaining: 12500, unlockedAt: '-', status: '锁定中' },
  { id: 'flow-2', startAt: '2026-07-13 10:19', type: 'VIP周礼金', locked: 2850, target: 17400, completed: 8750, pending: 0, remaining: 8650, unlockedAt: '-', status: '锁定中' },
  { id: 'flow-3', startAt: '2026-07-14 18:32', type: '充值', locked: 3926, target: 20950, completed: 10780, pending: 0, remaining: 10170, unlockedAt: '-', status: '锁定中' },
  { id: 'flow-history-1', startAt: '2026-07-01 09:10', type: 'PG电子', locked: 1800, target: 12000, completed: 12000, pending: 0, remaining: 0, unlockedAt: '2026-07-06 22:40', status: '已解锁' },
  { id: 'flow-history-2', startAt: '2026-06-25 12:20', type: '首存礼金', locked: 600, target: 3600, completed: 3600, pending: 0, remaining: 0, unlockedAt: '2026-06-28 18:05', status: '已解锁' },
]

const money = (value) => `¥${Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function FlowAmount({ value, onClick, disabled = false }) {
  return <div className="member-flow-link"><Money value={value} tone="positive" /><button className="ta-table-link" disabled={disabled} onClick={onClick}>查看明细</button></div>
}

function WithdrawalFlowModal({ row, onClose, onToast }) {
  const sourceRows = row?.member === 'member_10086' ? WITHDRAWAL_DETAIL : [WITHDRAWAL_DETAIL[0], WITHDRAWAL_DETAIL[3]]
  const rows = row?.member === 'member_10086' ? sourceRows : sourceRows.map((item, index) => ({
    ...item,
    id: `${row?.id}-${item.id}`,
    locked: index === 0 ? row?.locked || 0 : item.locked,
    target: index === 0 ? row?.withdrawalFlow || 0 : item.target,
    completed: index === 0 ? 0 : item.completed,
    pending: index === 0 ? 0 : item.pending,
    remaining: index === 0 ? row?.withdrawalFlow || 0 : 0,
    unlockedAt: index === 0 ? '-' : item.unlockedAt,
    status: index === 0 && row?.withdrawalFlow ? '锁定中' : '已解锁',
  }))
  const columns = [
    { key: 'startAt', label: '开始时间' },
    { key: 'type', label: '类型', render: (value) => <b>{value}</b> },
    { key: 'locked', label: '锁定额度', render: (value) => money(value) },
    { key: 'target', label: '目标流水', render: (value) => money(value) },
    { key: 'completed', label: '已完成有效流水', render: (value) => money(value) },
    { key: 'pending', label: '待确认流水', render: (value) => money(value) },
    { key: 'remaining', label: '还需解锁流水', render: (value) => <Money value={value} tone="positive" /> },
    { key: 'unlockedAt', label: '解锁时间' },
    { key: 'status', label: '状态', render: (value) => <StatusTag tone={value === '已解锁' ? 'green' : 'orange'}>{value}</StatusTag> },
  ]
  function exportRows() {
    const headers = ['开始时间', '类型', '锁定额度', '目标流水', '已完成有效流水', '待确认流水', '还需解锁流水', '解锁时间', '状态']
    const values = rows.map((item) => [item.startAt, item.type, item.locked, item.target, item.completed, item.pending, item.remaining, item.unlockedAt, item.status])
    const csv = [headers, ...values].map((cells) => cells.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${row?.member || '会员'}-提现流水.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    onToast?.(`已导出 ${rows.length} 条提现流水`)
  }
  return <Modal open={!!row} title="充值/彩金提现流水明细" description={`${row?.member} · ${row?.site} · 统计截至 2026-07-14 21:20`} onClose={onClose} onConfirm={onClose} confirmText="关闭" showCancel={false} width={1320}>
    <div className="member-flow-modal-content">
      <DescriptionGrid columns={4} items={[
        { label: '会员账号', value: row?.member },
        { label: '锁定余额', value: <Money value={row?.locked} /> },
        { label: '充值/彩金提现流水', value: <Money value={row?.withdrawalFlow} tone="positive" /> },
        { label: '当前状态', value: <StatusTag tone={row?.withdrawalFlow ? 'orange' : 'green'}>{row?.withdrawalFlow ? '锁定中' : '已解锁'}</StatusTag> },
      ]} />
      <div className="member-flow-detail-toolbar"><div><strong>提现流水列表</strong><span>展示当前锁定与历史解锁记录</span></div><Button size="small" onClick={exportRows}>导出</Button></div>
      <DataTable className="member-flow-detail-table" columns={columns} rows={rows} />
      <Alert title="统计口径">同一时间最多存在一条场馆活动锁定流水，其余记录按具体活动彩金名称或“充值”展示；历史记录保留开始时间、解锁时间和最终状态。单项还需解锁流水 = MAX（0，目标流水 − 已完成有效流水），已解锁记录的还需解锁流水为0。</Alert>
    </div>
  </Modal>
}

export function MemberLockedFlowPage({ onToast }) {
  const emptyFilters = { site: '', agent: '', member: '' }
  const [draft, setDraft] = useState(emptyFilters)
  const [filters, setFilters] = useState(emptyFilters)
  const [withdrawalRow, setWithdrawalRow] = useState(null)
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
    { key: 'unlockedBonus', label: '未解锁彩金', render: (value) => <b>{money(value)}</b> },
    { key: 'total', label: '总余额', render: (value) => <b>{money(value)}</b> },
    { key: 'withdrawable', label: '可提现余额', render: (value) => <Money value={value} tone="positive" /> },
    { key: 'locked', label: '锁定余额', render: (value) => <b>{money(value)}</b> },
    { key: 'withdrawalFlow', label: '充值/彩金提现流水', render: (value, row) => <FlowAmount value={value} onClick={() => setWithdrawalRow(row)} /> },
  ]
  function reset() {
    setDraft(emptyFilters)
    setFilters(emptyFilters)
    onToast('筛选条件已重置')
  }
  return <section className="member-locked-flow-screen">
    <SectionHeader title="会员提现流水查询" description="查询会员充值额度、未解锁彩金、可提现及锁定余额，并下钻核对当前与历史提现流水。" />
    <FilterBar onSearch={() => { setFilters(draft); onToast(`已查询到 ${MEMBER_FLOW_ROWS.filter((row) => (!draft.site || row.site === draft.site) && (!draft.agent || row.agent.toLowerCase().includes(draft.agent.toLowerCase())) && (!draft.member || row.member.toLowerCase().includes(draft.member.toLowerCase()))).length} 条会员流水`) }} onReset={reset} onExport={() => onToast(`已导出当前 ${rows.length} 条会员提现流水`)}>
        <Field label="站点"><Select value={draft.site} onChange={(value) => setDraft((current) => ({ ...current, site: value }))} placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field>
        <Field label="代理账号"><Input value={draft.agent} onChange={(value) => setDraft((current) => ({ ...current, agent: value }))} placeholder="请输入代理账号" /></Field>
        <Field label="会员账号 / ID"><Input value={draft.member} onChange={(value) => setDraft((current) => ({ ...current, member: value }))} placeholder="请输入会员账号或ID" /></Field>
    </FilterBar>
    <Alert title="金额与流水口径">总余额 = 可提现余额 + 锁定余额；未解锁彩金为当前仍受提现流水约束的彩金金额；充值/彩金提现流水为各类型及通用任务仍需解锁流水之和。</Alert>
    <Panel title="会员提现流水统计" description={`共 ${rows.length} 条`} className="member-flow-panel"><DataTable minWidth={1280} columns={columns} rows={rows} paginated /></Panel>
    <WithdrawalFlowModal row={withdrawalRow} onClose={() => setWithdrawalRow(null)} onToast={onToast} />
  </section>
}
