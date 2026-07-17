import { useMemo, useState } from 'react'
import { AuditOutlined, EyeOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons'
import { useTeamAgent } from './context'
import {
  Alert,
  Button,
  DataTable,
  DescriptionGrid,
  Field,
  FilterBar,
  FormGrid,
  Input,
  Modal,
  Money,
  SectionHeader,
  Select,
  StatusTag,
  Tabs,
  Toolbar,
} from './ui'

const ROLE_META = {
  main: { label: '团队负责人', account: 'gaodashang', boundary: '团队负责人仅可申请提取本人已到账且未被占用的可提现余额。团队副线款项仍由主线通过内部结算处理。' },
  secondary: { label: '副线负责人', account: 'WC002', boundary: '副线负责人仅可申请提取主线已成功结算至本人账户的余额，不能提取团队平台佣金。' },
  independent: { label: '独立线主', account: 'dailiwc001', boundary: '独立线主仅可申请提取平台已发放至本人账户的单线佣金，不与团队主线余额合并。' },
}

const WITHDRAWAL_TYPES = ['佣金余额提现', '钱包余额提现']
const PENDING_STATUSES = ['待审核', '待站点审核', '待总控审核']
const PROCESSING_STATUSES = [...PENDING_STATUSES, '审核中', '处理中', '待处理']

function pick(record, keys, fallback = '—') {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return fallback
}

function orderNo(record) {
  return pick(record, ['orderNo', 'orderId', 'id'])
}

function accountOf(record) {
  return pick(record, ['agentAccount', 'account', 'agent'])
}

function agentTypeOf(record) {
  return pick(record, ['agentType', 'roleLabel', 'role'])
}

function withdrawalTypeOf(record) {
  return pick(record, ['withdrawalType', 'type'])
}

function statusOf(record) {
  return pick(record, ['orderStatus', 'status', 'state'])
}

function appliedAtOf(record) {
  return pick(record, ['appliedAt', 'createdAt', 'applyTime'])
}

function usdtAmountOf(record) {
  return Number(pick(record, ['usdtAmount', 'amountUsdt', 'usdt'], 0)) || 0
}

function cnyAmountOf(record) {
  return Number(pick(record, ['actualAmountCny', 'actualCnyAmount', 'cnyAmount', 'amount'], 0)) || 0
}

function infoOf(record) {
  return pick(record, ['withdrawInfo', 'withdrawalInfo', 'info', 'address', 'walletAddress'])
}

function isPending(record) {
  return PENDING_STATUSES.includes(statusOf(record))
}

function unique(values, fallbacks = []) {
  return [...new Set([...fallbacks, ...values].filter((value) => value && value !== '—'))]
}

function formatUsdt(value) {
  return `${Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT`
}

function notify(result, onToast, onSuccess) {
  const normalized = result || { ok: false, message: '操作未完成，请稍后重试' }
  onToast?.(normalized.message, normalized.ok ? 'success' : 'error')
  if (normalized.ok) onSuccess?.()
}

function ActionLink({ children, onClick, disabled = false }) {
  return <button className="ta-table-link" disabled={disabled} onClick={onClick}>{children}</button>
}

function withdrawalDetails(record) {
  return [
    { label: '提款订单号', value: orderNo(record) },
    { label: '所属站点', value: pick(record, ['site', 'siteName']) },
    { label: '代理账号', value: accountOf(record) },
    { label: '上级账号', value: pick(record, ['parentAccount', 'parent']) },
    { label: '代理类型', value: agentTypeOf(record) },
    { label: '提款类型', value: withdrawalTypeOf(record) },
    { label: 'USDT金额', value: formatUsdt(usdtAmountOf(record)) },
    { label: '实际CNY金额', value: <Money value={cnyAmountOf(record)} /> },
    { label: '提款手续费', value: <Money value={pick(record, ['feeCny', 'fee'], 0)} /> },
    { label: '预计到账', value: <Money value={pick(record, ['estimatedArrival'], cnyAmountOf(record))} /> },
    { label: '订单状态', value: <StatusTag>{statusOf(record)}</StatusTag> },
    { label: '申请时间', value: appliedAtOf(record) },
    { label: '提款信息', value: infoOf(record) },
    { label: '审核人', value: pick(record, ['reviewer', 'reviewedBy']) },
    { label: '审核时间', value: pick(record, ['reviewedAt', 'reviewTime']) },
    { label: '审核备注', value: pick(record, ['reviewRemark', 'remark']) },
    { label: '完成时间', value: pick(record, ['completedAt', 'finishedAt']) },
  ]
}

function OperationsWithdrawalPage({ portal, onToast }) {
  const { data, reviewAgentWithdrawal, completeAgentWithdrawal } = useTeamAgent()
  const withdrawals = data.withdrawals || []
  const scopedWithdrawals = portal === 'site' ? withdrawals.filter((record) => pick(record, ['site', 'siteName']) === '旺财体育') : withdrawals
  const [tab, setTab] = useState('review')
  const [filters, setFilters] = useState({ site: '', account: '', agentType: '', withdrawalType: '', orderNo: '', status: '', startDate: '', endDate: '' })
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)
  const [remark, setRemark] = useState('')
  const reviewer = portal === 'master' ? '总控运营' : '站点运营'

  const options = useMemo(() => ({
    sites: unique(scopedWithdrawals.map((record) => pick(record, ['site', 'siteName'])), ['旺财体育', '财神客栈']),
    agentTypes: unique(scopedWithdrawals.map(agentTypeOf), ['官方代理', '普通代理']),
    withdrawalTypes: unique(scopedWithdrawals.map(withdrawalTypeOf), WITHDRAWAL_TYPES),
    statuses: unique(scopedWithdrawals.map(statusOf), ['待审核', '处理中', '已通过', '已拒绝', '已完成']),
  }), [scopedWithdrawals])

  const rows = useMemo(() => scopedWithdrawals.filter((record) => {
    if (tab === 'review' && !isPending(record)) return false
    if (filters.site && pick(record, ['site', 'siteName']) !== filters.site) return false
    if (filters.account && !String(accountOf(record)).toLowerCase().includes(filters.account.trim().toLowerCase())) return false
    if (filters.agentType && agentTypeOf(record) !== filters.agentType) return false
    if (filters.withdrawalType && withdrawalTypeOf(record) !== filters.withdrawalType) return false
    if (filters.orderNo && !String(orderNo(record)).toLowerCase().includes(filters.orderNo.trim().toLowerCase())) return false
    if (filters.status && statusOf(record) !== filters.status) return false
    const day = String(appliedAtOf(record)).slice(0, 10)
    if (filters.startDate && day < filters.startDate) return false
    if (filters.endDate && day > filters.endDate) return false
    return true
  }), [filters, scopedWithdrawals, tab])

  function resetFilters() {
    setFilters({ site: '', account: '', agentType: '', withdrawalType: '', orderNo: '', status: '', startDate: '', endDate: '' })
  }

  function openModal(record, type) {
    setSelected(record)
    setRemark('')
    setModal(type)
  }

  function closeModal() {
    setSelected(null)
    setRemark('')
    setModal(null)
  }

  function review(approved) {
    if (!selected) return
    notify(reviewAgentWithdrawal(selected.id ?? selected.orderNo, approved, remark.trim(), reviewer), onToast, closeModal)
  }

  const columns = [
    { key: 'orderNo', label: '订单号', render: (_, record) => <b className="ta-primary-text">{orderNo(record)}</b> },
    ...(portal === 'master' ? [{ key: 'site', label: '站点', render: (_, record) => pick(record, ['site', 'siteName']) }] : []),
    { key: 'agentAccount', label: '代理账号', render: (_, record) => accountOf(record) },
    { key: 'agentType', label: '代理类型', render: (_, record) => <StatusTag tone="blue">{agentTypeOf(record)}</StatusTag> },
    { key: 'withdrawalType', label: '提款类型', render: (_, record) => withdrawalTypeOf(record) },
    { key: 'usdtAmount', label: 'USDT金额', render: (_, record) => formatUsdt(usdtAmountOf(record)) },
    { key: 'actualCnyAmount', label: '实际CNY金额', render: (_, record) => <Money value={cnyAmountOf(record)} /> },
    { key: 'status', label: '订单状态', render: (_, record) => <StatusTag>{statusOf(record)}</StatusTag> },
    { key: 'appliedAt', label: '申请时间', render: (_, record) => appliedAtOf(record) },
    { key: 'action', label: '操作', render: (_, record) => <div className="ta-table-actions">{isPending(record) && <ActionLink onClick={() => openModal(record, 'review')}>审核</ActionLink>}{statusOf(record) === '处理中' && <ActionLink onClick={() => notify(completeAgentWithdrawal(record.id), onToast)}>完成出款</ActionLink>}<ActionLink onClick={() => openModal(record, 'detail')}>详情</ActionLink></div> },
  ]

  return <>
    <SectionHeader title="代理提款" description={`${reviewer}在此核对${portal === 'site' ? '本站' : '全站'}代理身份、提款金额和收款信息；审核结果会同步至代理本人提款记录。`} />
    <Tabs active={tab} onChange={setTab} items={[
      { value: 'review', label: '提款审核', count: scopedWithdrawals.filter(isPending).length },
      { value: 'records', label: '提款记录', count: scopedWithdrawals.length },
    ]} />
    <FilterBar onSearch={() => onToast?.(`已查询到 ${rows.length} 条提款订单`, 'success')} onReset={resetFilters}>
      {portal === 'master' && <Field label="站点"><Select value={filters.site} onChange={(value) => setFilters({ ...filters, site: value })} placeholder="全部站点" options={options.sites} /></Field>}
      <Field label="代理账号"><Input value={filters.account} onChange={(value) => setFilters({ ...filters, account: value })} placeholder="请输入代理账号" /></Field>
      <Field label="代理类型"><Select value={filters.agentType} onChange={(value) => setFilters({ ...filters, agentType: value })} placeholder="全部类型" options={options.agentTypes} /></Field>
      <Field label="提款类型"><Select value={filters.withdrawalType} onChange={(value) => setFilters({ ...filters, withdrawalType: value })} placeholder="全部类型" options={options.withdrawalTypes} /></Field>
      <Field label="订单号"><Input value={filters.orderNo} onChange={(value) => setFilters({ ...filters, orderNo: value })} placeholder="请输入订单号" /></Field>
      <Field label="订单状态"><Select value={filters.status} onChange={(value) => setFilters({ ...filters, status: value })} placeholder="全部状态" options={options.statuses} /></Field>
      <Field label="申请时间"><Input type="date" value={filters.startDate} onChange={(value) => setFilters({ ...filters, startDate: value })} /></Field>
      <Field label="结束时间"><Input type="date" value={filters.endDate} onChange={(value) => setFilters({ ...filters, endDate: value })} /></Field>
    </FilterBar>
    <DataTable paginated minWidth={portal === 'master' ? 1420 : 1280} columns={columns} rows={rows} emptyText={tab === 'review' ? '当前没有待审核提款订单' : '暂无符合条件的提款记录'} />

    <Modal open={modal === 'review'} title={`${orderNo(selected)} · 提款审核`} description="请核对代理身份、申请金额和提款信息后再提交审核结果。" width={780} onClose={closeModal} onConfirm={() => review(true)} confirmText="审核通过" confirmDisabled={!remark.trim()}>
      {selected && <><DescriptionGrid columns={3} items={withdrawalDetails(selected)} /><Field label="审核备注" required><Input value={remark} onChange={setRemark} placeholder="请填写通过说明或拒绝原因" /></Field><Toolbar><Button icon={<AuditOutlined />} variant="danger" disabled={!remark.trim()} onClick={() => review(false)}>审核拒绝</Button></Toolbar><Alert title="审核结果说明" tone="warning">通过后订单进入出款处理；拒绝后订单结束并释放对应处理中金额。审核备注会展示给代理本人。</Alert></>}
    </Modal>
    <Modal open={modal === 'detail'} title={`${orderNo(selected)} · 提款详情`} description="查看该笔提款从申请到审核、完成的全部业务字段。" width={780} onClose={closeModal} onConfirm={closeModal} confirmText="关闭" showCancel={false}>
      {selected && <DescriptionGrid columns={3} items={withdrawalDetails(selected)} />}
    </Modal>
  </>
}

function AgentOwnWithdrawalPage({ role, onToast }) {
  const { data, agentWithdrawableBalance, createAgentWithdrawal } = useTeamAgent()
  const meta = ROLE_META[role] || ROLE_META.main
  const withdrawals = data.withdrawals || []
  const [showApply, setShowApply] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ withdrawalType: WITHDRAWAL_TYPES[0], network: 'USDT（TRC20）', usdtAmount: '', actualCnyAmount: '', withdrawalInfo: '' })
  const rows = useMemo(() => withdrawals.filter((record) => String(accountOf(record)).toLowerCase() === meta.account.toLowerCase()), [meta.account, withdrawals])
  const available = typeof agentWithdrawableBalance === 'function' ? Number(agentWithdrawableBalance(meta.account) || 0) : 0
  const processing = rows.filter((record) => PROCESSING_STATUSES.includes(statusOf(record))).reduce((total, record) => total + cnyAmountOf(record), 0)
  const validForm = form.withdrawalType && Number(form.usdtAmount) > 0 && Number(form.actualCnyAmount) > 0 && form.withdrawalInfo.trim()

  function closeApply() {
    setShowApply(false)
    setForm({ withdrawalType: WITHDRAWAL_TYPES[0], network: 'USDT（TRC20）', usdtAmount: '', actualCnyAmount: '', withdrawalInfo: '' })
  }

  function createWithdrawal() {
    const payload = {
      account: meta.account,
      agentAccount: meta.account,
      role,
      agentType: meta.label,
      site: '旺财体育',
      withdrawalType: form.withdrawalType,
      type: form.withdrawalType,
      usdtAmount: Number(form.usdtAmount),
      actualAmountCny: Number(form.actualCnyAmount),
      actualCnyAmount: Number(form.actualCnyAmount),
      cnyAmount: Number(form.actualCnyAmount),
      withdrawInfo: `${form.network} · ${form.withdrawalInfo.trim()}`,
      withdrawalInfo: `${form.network} · ${form.withdrawalInfo.trim()}`,
      info: `${form.network} · ${form.withdrawalInfo.trim()}`,
    }
    notify(createAgentWithdrawal(payload), onToast, closeApply)
  }

  const columns = [
    { key: 'orderNo', label: '订单号', render: (_, record) => <b className="ta-primary-text">{orderNo(record)}</b> },
    { key: 'withdrawalType', label: '提款类型', render: (_, record) => withdrawalTypeOf(record) },
    { key: 'usdtAmount', label: 'USDT金额', render: (_, record) => formatUsdt(usdtAmountOf(record)) },
    { key: 'actualCnyAmount', label: '实际CNY金额', render: (_, record) => <Money value={cnyAmountOf(record)} /> },
    { key: 'status', label: '订单状态', render: (_, record) => <StatusTag>{statusOf(record)}</StatusTag> },
    { key: 'appliedAt', label: '申请时间', render: (_, record) => appliedAtOf(record) },
    { key: 'reviewedAt', label: '审核时间', render: (_, record) => pick(record, ['reviewedAt', 'reviewTime']) },
    { key: 'action', label: '操作', render: (_, record) => <ActionLink onClick={() => setSelected(record)}>详情</ActionLink> },
  ]

  return <>
    <SectionHeader title="代理提款" description={`${meta.label} ${meta.account}，仅展示和处理当前演示身份本人的提款资金与订单。`} actions={<Button icon={<PlusOutlined />} onClick={() => setShowApply(true)}>申请提款</Button>} />
    <DescriptionGrid columns={4} items={[
      { label: '当前代理账号', value: meta.account },
      { label: '当前代理类型', value: <StatusTag tone="blue">{meta.label}</StatusTag> },
      { label: '本人可提现余额', value: <Money value={available} tone="positive" /> },
      { label: '处理中金额', value: <Money value={processing} /> },
    ]} />
    <Alert title="当前角色提款边界" tone="warning">{meta.boundary}</Alert>
    <DataTable paginated minWidth={1120} columns={columns} rows={rows} emptyText="当前身份暂无提款记录" />

    <Modal open={showApply} title="申请代理提款" description={`${meta.account} · 当前可提现余额 ¥${available.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} width={620} onClose={closeApply} onConfirm={createWithdrawal} confirmText="提交提款申请" confirmDisabled={!validForm}>
      <FormGrid>
        <Field label="提款类型" required><Select value={form.withdrawalType} onChange={(value) => setForm({ ...form, withdrawalType: value })} options={WITHDRAWAL_TYPES} /></Field>
        <Field label="收款网络" required><Select value={form.network} onChange={(value) => setForm({ ...form, network: value })} options={['USDT（TRC20）', 'USDT（ERC20）']} /></Field>
        <Field label="USDT金额" required><Input type="number" min="0" step="0.01" value={form.usdtAmount} onChange={(value) => setForm({ ...form, usdtAmount: value })} placeholder="请输入USDT金额" /></Field>
        <Field label="实际CNY金额" required><Input type="number" min="0" step="0.01" value={form.actualCnyAmount} onChange={(value) => setForm({ ...form, actualCnyAmount: value })} placeholder="请输入实际CNY金额" /></Field>
        <Field label="提款信息" required className="ta-field-full"><Input value={form.withdrawalInfo} onChange={(value) => setForm({ ...form, withdrawalInfo: value })} placeholder="请输入USDT收款地址或提款备注" /></Field>
      </FormGrid>
      <Alert title="提交前核对">请确认网络类型、USDT金额、实际CNY金额和收款信息。提交后订单进入审核，处理中金额将占用对应余额。</Alert>
    </Modal>
    <Modal open={!!selected} title={`${orderNo(selected)} · 我的提款详情`} description="查看申请金额、收款信息和审核结果。" width={780} onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭" showCancel={false}>
      {selected && <DescriptionGrid columns={3} items={withdrawalDetails(selected)} />}
    </Modal>
  </>
}

export function AgentWithdrawalPage({ portal, role, onToast }) {
  return portal === 'agent'
    ? <AgentOwnWithdrawalPage role={role} onToast={onToast} />
    : <OperationsWithdrawalPage portal={portal} onToast={onToast} />
}
