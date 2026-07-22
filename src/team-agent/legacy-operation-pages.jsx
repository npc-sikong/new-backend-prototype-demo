import { useEffect, useMemo, useState } from 'react'
import { AuditOutlined, PlusOutlined, WalletOutlined } from '@ant-design/icons'
import { useTeamAgent } from './context'
import {
  Alert,
  Button,
  DataTable,
  DescriptionGrid,
  Field,
  FilterBar,
  FormulaPanel,
  FormGrid,
  Input,
  MetricCard,
  MetricGrid,
  Modal,
  Money,
  SectionHeader,
  Select,
  StatusTag,
} from './ui'

const EMPTY_FILTERS = { keyword: '', identity: '', cycle: '', status: '' }

const ROLE_META = {
  main: { account: 'gaodashang', identity: '团队负责人', team: 'gaodashang01部', line: 'LINE-A', unit: 'gaodashang01部 / 团队负责人' },
  secondary: { account: 'WC002', identity: '副线', team: 'gaodashang01部', line: 'LINE-B', unit: 'gaodashang01部 / WC002线路' },
  independent: { account: 'dailiwc001', identity: '单线代理', team: '—', line: 'SINGLE-001', unit: '单线代理01' },
}

const PREPAID_FALLBACK = [
  { id: 'PP-202607-001', site: '旺财体育', agent: 'gaodashang', team: 'gaodashang01部', line: 'LINE-A', identity: '团队负责人', unit: 'gaodashang01部 / 团队负责人', cycle: '2026-07', opening: 60000, added: 20000, deducted: 8500, balance: 71500, debt: 0, status: '生效中', updatedAt: '2026-07-15 12:20', scopeRoles: ['main'] },
  { id: 'PP-202607-002', site: '旺财体育', agent: 'WC002', team: 'gaodashang01部', line: 'LINE-B', identity: '副线', unit: 'gaodashang01部 / WC002线路', cycle: '2026-07', opening: 12000, added: 5000, deducted: 3100, balance: 13900, debt: 1150, status: '生效中', updatedAt: '2026-07-15 11:45', scopeRoles: ['main', 'secondary'] },
  { id: 'PP-202607-003', site: '旺财体育', agent: 'LGNB', team: 'gaodashang01部', line: 'LINE-C', identity: '副线', unit: 'gaodashang01部 / LGNB线路', cycle: '2026-07', opening: 8000, added: 0, deducted: 1750, balance: 6250, debt: 0, status: '生效中', updatedAt: '2026-07-14 18:10', scopeRoles: ['main'] },
  { id: 'PP-202607-004', site: '旺财体育', agent: 'dailiwc001', team: '—', line: 'SINGLE-001', identity: '单线代理', unit: '单线代理01', cycle: '2026-07', opening: 25000, added: 10000, deducted: 4200, balance: 30800, debt: 0, status: '生效中', updatedAt: '2026-07-15 10:05', scopeRoles: ['independent'] },
  { id: 'PP-202607-005', site: '财神客栈', agent: 'FEE0428_A8', team: '—', line: 'LEGACY-FEE', identity: '原代理模式', unit: '原代理独立结算', cycle: '2026-07', opening: 15000, added: 3000, deducted: 1200, balance: 16800, debt: 19651.35, status: '冻结', updatedAt: '2026-07-13 09:30', scopeRoles: [] },
]

const AGENT_PAY_FALLBACK = [
  { id: 'AP-202607-001', orderNo: 'AP202607150001', site: '旺财体育', agent: 'gaodashang', payee: 'gaodashang', team: 'gaodashang01部', line: 'LINE-A', identity: '团队负责人', unit: 'gaodashang01部 / 团队负责人', cycle: '2026-07', type: '团队佣金发放', amount: 86000, method: 'USDT-TRC20', status: '待审核', appliedAt: '2026-07-15 09:18', reviewer: '—', remark: '本月团队佣金剩余申请', scopeRoles: ['main'] },
  { id: 'AP-202607-002', orderNo: 'AP202607140008', site: '旺财体育', agent: 'WC002', payee: 'WC002', team: 'gaodashang01部', line: 'LINE-B', identity: '副线', unit: 'gaodashang01部 / WC002线路', cycle: '2026-07', type: '主线内部结算', amount: 28000, method: '代理余额', status: '已通过', appliedAt: '2026-07-14 10:20', reviewer: '站点运营', remark: '主线到账余额内结算', scopeRoles: ['main', 'secondary'] },
  { id: 'AP-202607-003', orderNo: 'AP202607140011', site: '旺财体育', agent: 'LGNB', payee: 'LGNB', team: 'gaodashang01部', line: 'LINE-C', identity: '副线', unit: 'gaodashang01部 / LGNB线路', cycle: '2026-07', type: '主线内部结算', amount: 15000, method: '代理余额', status: '处理中', appliedAt: '2026-07-14 11:05', reviewer: '—', remark: '待补充结算凭证', scopeRoles: ['main'] },
  { id: 'AP-202607-004', orderNo: 'AP202607140016', site: '旺财体育', agent: 'dailiwc001', payee: 'dailiwc001', team: '—', line: 'SINGLE-001', identity: '单线代理', unit: '单线代理01', cycle: '2026-07', type: '单线代理佣金', amount: 68000, method: 'USDT-TRC20', status: '待发放', appliedAt: '2026-07-14 16:15', reviewer: '若依', remark: '账单审核通过', scopeRoles: ['independent'] },
  { id: 'AP-202607-005', orderNo: 'AP202607130003', site: '财神客栈', agent: 'FEE0428_A8', payee: 'FEE0428_A8', team: '—', line: 'LEGACY-FEE', identity: '原代理模式', unit: '原代理独立结算', cycle: '2026-07', type: '历史代理佣金', amount: 15000, method: '银行卡', status: '已拒绝', appliedAt: '2026-07-13 08:40', reviewer: '若依', remark: '收款资料不完整', scopeRoles: [] },
]

function pick(record, keys, fallback = '—') {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return fallback
}

function number(record, keys, fallback = 0) {
  const value = Number(pick(record, keys, fallback))
  return Number.isFinite(value) ? value : fallback
}

function rolesFor(agent, unit = '') {
  if (agent === 'WC002') return ['main', 'secondary']
  if (['gaodashang', 'LGNB'].includes(agent) || String(unit).includes('gaodashang')) return ['main']
  if (agent === 'dailiwc001' || String(unit).includes('单线代理01')) return ['independent']
  return []
}

function normalizePrepaid(record, index) {
  const agent = pick(record, ['agent', 'account', 'agentAccount'])
  const unit = pick(record, ['unit', 'settlementUnit', 'unitName'])
  return {
    id: pick(record, ['id', 'recordId'], `PP-${index + 1}`),
    site: pick(record, ['site', 'siteName'], '旺财体育'), agent,
    team: pick(record, ['team', 'teamName'], agent === 'dailiwc001' ? '—' : 'gaodashang01部'),
    line: pick(record, ['line', 'lineId'], agent === 'WC002' ? 'LINE-B' : agent === 'dailiwc001' ? 'SINGLE-001' : 'LINE-A'),
    identity: pick(record, ['identity', 'settlementIdentity'], agent === 'WC002' ? '副线' : agent === 'dailiwc001' ? '单线代理' : '团队负责人'),
    unit, cycle: pick(record, ['cycle', 'effectiveCycle', 'month'], '2026-07'),
    opening: number(record, ['opening', 'openingBalance', 'lastBalance', 'creditLimit']), added: number(record, ['added', 'increaseAmount', 'credit'], Math.max(0, Number(record.lastChange || 0))),
    deducted: number(record, ['deducted', 'usedAmount', 'debit'], Math.abs(Math.min(0, Number(record.lastChange || 0)))), balance: number(record, ['balance', 'prepaidBalance', 'currentBalance', 'available']),
    debt: number(record, ['debt', 'debtAmount']), status: pick(record, ['status', 'state'], '生效中'), updatedAt: pick(record, ['updatedAt', 'createdAt']),
    scopeRoles: record.scopeRoles || rolesFor(agent, unit),
  }
}

function normalizeAgentPay(record, index) {
  const agent = pick(record, ['agent', 'account', 'agentAccount', 'payee'])
  const unit = pick(record, ['unit', 'settlementUnit', 'unitName'])
  const payType = pick(record, ['type', 'payType'], '代理代存')
  return {
    id: pick(record, ['id', 'recordId'], `AP-${index + 1}`), orderNo: pick(record, ['orderNo', 'orderId', 'id'], `AP-${index + 1}`),
    site: pick(record, ['site', 'siteName'], '旺财体育'), agent, payee: pick(record, ['payee', 'member', 'memberAccount', 'account', 'agent'], agent),
    team: pick(record, ['team', 'teamName'], agent === 'dailiwc001' ? '—' : 'gaodashang01部'),
    line: pick(record, ['line', 'lineId'], agent === 'WC002' ? 'LINE-B' : agent === 'dailiwc001' ? 'SINGLE-001' : 'LINE-A'),
    identity: pick(record, ['identity', 'settlementIdentity'], agent === 'WC002' ? '副线' : agent === 'dailiwc001' ? '单线代理' : '团队负责人'),
    unit, cycle: pick(record, ['cycle', 'effectiveCycle', 'month'], '2026-07'), type: payType,
    amount: number(record, ['amount', 'payAmount', 'actualAmountCny']), method: pick(record, ['method', 'payMethod', 'currency'], payType === '佣金代存' ? '代理佣金余额' : '代理预付金'),
    status: pick(record, ['status', 'state'], '待审核'), appliedAt: pick(record, ['appliedAt', 'submittedAt', 'createdAt']), reviewer: pick(record, ['reviewer', 'reviewedBy']),
    remark: pick(record, ['remark', 'reviewRemark', 'note']), scopeRoles: record.scopeRoles || rolesFor(agent, unit),
  }
}

function firstArray(data, keys, fallback) {
  for (const key of keys) if (Array.isArray(data?.[key])) return data[key]
  return fallback
}

function scoped(rows, portal, role) {
  if (portal === 'site') return rows.filter((row) => row.site === '旺财体育')
  if (portal === 'agent') return rows.filter((row) => row.scopeRoles?.includes(role || 'main'))
  return rows
}

function matches(row, filters) {
  const keyword = filters.keyword.trim().toLowerCase()
  const haystack = Object.entries(row).filter(([key]) => key !== 'scopeRoles').map(([, value]) => String(value)).join(' ').toLowerCase()
  return (!keyword || haystack.includes(keyword))
    && (!filters.identity || row.identity === filters.identity)
    && (!filters.cycle || row.cycle === filters.cycle)
    && (!filters.status || row.status === filters.status)
}

function unique(rows, key) {
  return [...new Set(rows.map((row) => row[key]).filter((value) => value && value !== '—'))]
}

function useFilters(rows, resetKey) {
  const [draft, setDraft] = useState(EMPTY_FILTERS)
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  useEffect(() => { setDraft(EMPTY_FILTERS); setApplied(EMPTY_FILTERS) }, [resetKey])
  const filtered = useMemo(() => rows.filter((row) => matches(row, applied)), [rows, applied])
  return { draft, setDraft, applied, setApplied, filtered }
}

function ActionLink({ children, onClick, disabled = false }) {
  return <button className="ta-table-link" disabled={disabled} onClick={onClick}>{children}</button>
}

function toastResult(result, onToast, fallback, onSuccess) {
  const normalized = result && typeof result === 'object' ? result : { ok: true, message: fallback }
  onToast?.(normalized.message || fallback, normalized.ok === false ? 'error' : 'success')
  if (normalized.ok !== false) onSuccess?.()
}

function Filters({ rows, state, onSearch, onReset, onExport }) {
  const { draft, setDraft } = state
  return <FilterBar onSearch={onSearch} onReset={onReset} onExport={onExport}>
    <Field label="代理 / 单号"><Input value={draft.keyword} onChange={(keyword) => setDraft((current) => ({ ...current, keyword }))} placeholder="代理、线路或记录号" /></Field>
    <Field label="结算身份"><Select value={draft.identity} onChange={(identity) => setDraft((current) => ({ ...current, identity }))} placeholder="全部身份" options={unique(rows, 'identity')} /></Field>
    <Field label="生效周期"><Select value={draft.cycle} onChange={(cycle) => setDraft((current) => ({ ...current, cycle }))} placeholder="全部周期" options={unique(rows, 'cycle')} /></Field>
    <Field label="状态"><Select value={draft.status} onChange={(status) => setDraft((current) => ({ ...current, status }))} placeholder="全部状态" options={unique(rows, 'status')} /></Field>
  </FilterBar>
}

const CONTEXT_COLUMNS = [
  { key: 'site', label: '所属站点' }, { key: 'team', label: '所属团队' }, { key: 'line', label: '业务线路' },
  { key: 'identity', label: '结算身份', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
  { key: 'unit', label: '结算单元' }, { key: 'cycle', label: '生效周期' },
]

function BalanceFormula() {
  return <FormulaPanel title="当月结余口径" items={[
    { label: '净输赢', formula: '总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费' },
    { label: '当月结余', formula: '净输赢 + 上周期结余 + 本月结余调整' },
    { label: '佣金', formula: 'MAX（0，当月结余 × 佣金比例 + 佣金调整）' },
  ]} warning="预付金和代理付款是资金动作，不反向改写已完成周期；当期金额统一在所属结算单元的当月结余中核对。" />
}

export function PrepaidReportPage({ portal = 'master', role = 'main', onToast }) {
  const context = useTeamAgent()
  const source = firstArray(context.data, ['prepaidAccounts', 'prepaidRecords', 'prepaid', 'agentPrepaid'], PREPAID_FALLBACK)
  const rows = useMemo(() => scoped(source.map(normalizePrepaid), portal, role), [source, portal, role])
  const state = useFilters(rows, `${portal}:${role}:prepaid`)
  const [detail, setDetail] = useState(null)
  const [adjusting, setAdjusting] = useState(null)
  const [form, setForm] = useState({ amount: '', reason: '' })
  const totals = state.filtered.reduce((sum, row) => ({ opening: sum.opening + row.opening, added: sum.added + row.added, balance: sum.balance + row.balance, debt: sum.debt + row.debt }), { opening: 0, added: 0, balance: 0, debt: 0 })
  const columns = [
    { key: 'agent', label: '代理账号' }, ...CONTEXT_COLUMNS,
    { key: 'opening', label: '期初预付金', render: (value) => <Money value={value} signed /> },
    { key: 'added', label: '本期增加', render: (value) => <Money value={value} signed /> },
    { key: 'deducted', label: '本期扣减', render: (value) => <Money value={value} signed /> },
    { key: 'balance', label: '预付金余额', render: (value) => <Money value={value} /> },
    { key: 'debt', label: '欠款额度', render: (value) => <Money value={value} /> },
    { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => setDetail(row)}>详情</ActionLink>{portal !== 'agent' && <ActionLink onClick={() => { setAdjusting(row); setForm({ amount: '', reason: '' }) }}>调整</ActionLink>}</div> },
  ]
  function search() {
    state.setApplied(state.draft)
    onToast?.(`已查询 ${rows.filter((row) => matches(row, state.draft)).length} 条预付金记录`)
  }
  function reset() {
    state.setDraft(EMPTY_FILTERS); state.setApplied(EMPTY_FILTERS); onToast?.('预付金筛选条件已重置')
  }
  function confirmAdjust() {
    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount === 0 || !form.reason.trim()) {
      onToast?.('请填写非零调整金额和调整原因', 'error')
      return
    }
    toastResult(context.adjustPrepaidAccount(adjusting.id, amount, form.reason), onToast, '预付金调整已提交', () => setAdjusting(null))
  }
  return <>
    <SectionHeader title="代理预付金" description="按团队、线路与结算单元查看预付金增加、扣减、余额和欠款，不回写历史账单。" />
    <MetricGrid columns={4}><MetricCard label="期初预付金" value={<Money value={totals.opening} />} /><MetricCard label="本期增加" value={<Money value={totals.added} />} tone="green" /><MetricCard label="当前预付金余额" value={<Money value={totals.balance} />} tone="blue" /><MetricCard label="欠款额度" value={<Money value={totals.debt} />} tone="orange" /></MetricGrid>
    <Filters rows={rows} state={state} onSearch={search} onReset={reset} onExport={() => onToast?.(`已生成 ${state.filtered.length} 条预付金导出演示`)} />
    <DataTable minWidth={1850} columns={columns} rows={state.filtered} paginated />
    <BalanceFormula />
    <Modal open={!!detail} title={`${detail?.id || ''} · 预付金明细`} description="查看所属团队、线路、结算身份和当前资金余额。" onClose={() => setDetail(null)} onConfirm={() => setDetail(null)} confirmText="关闭" showCancel={false} width={820}>
      {detail && <DescriptionGrid columns={3} items={columns.filter((column) => column.key !== 'action').map((column) => ({ label: column.label, value: column.render ? column.render(detail[column.key], detail) : detail[column.key] }))} />}
    </Modal>
    <Modal open={!!adjusting} title={`${adjusting?.agent || ''} · 调整预付金`} description="仅调整当前演示周期余额；历史账单与已完成周期不回写。" onClose={() => setAdjusting(null)} onConfirm={confirmAdjust} confirmText="确认调整">
      {adjusting && <><DescriptionGrid columns={2} items={[{ label: '结算单元', value: adjusting.unit }, { label: '当前余额', value: <Money value={adjusting.balance} /> }]} /><FormGrid><Field label="调整金额" required><Input type="number" value={form.amount} onChange={(amount) => setForm((current) => ({ ...current, amount }))} placeholder="增加为正，扣减为负" /></Field><Field label="调整原因" required><Input value={form.reason} onChange={(reason) => setForm((current) => ({ ...current, reason }))} placeholder="面向运营的业务原因" /></Field></FormGrid></>}
    </Modal>
  </>
}

export function AgentPayReportPage({ portal = 'master', role = 'main', onToast }) {
  const context = useTeamAgent()
  const source = firstArray(context.data, ['agentPayRecords', 'agentPays', 'agentPayments'], AGENT_PAY_FALLBACK)
  const rows = useMemo(() => scoped(source.map(normalizeAgentPay), portal, role), [source, portal, role])
  const state = useFilters(rows, `${portal}:${role}:agentPay`)
  const [detail, setDetail] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [reviewing, setReviewing] = useState(null)
  const [form, setForm] = useState({ member: '', payType: '佣金代存', amount: '', turnoverMultiple: '1', remark: '' })
  const [reviewForm, setReviewForm] = useState({ approved: '通过', remark: '' })
  const roleMeta = ROLE_META[role] || ROLE_META.main
  const memberOptions = (context.data.members || []).filter((member) => rolesFor(member.agent || member.agentAccount, member.unit || member.settlementUnit).includes(role)).map((member) => ({ value: member.memberAccount || member.account, label: `${member.memberAccount || member.account} · ${member.memberName || member.name || '会员'}` }))
  const total = state.filtered.reduce((sum, row) => sum + row.amount, 0)
  const columns = [
    { key: 'orderNo', label: '代存单号' }, { key: 'agent', label: '代理账号' }, { key: 'payee', label: '会员账号' }, ...CONTEXT_COLUMNS,
    { key: 'type', label: '代存类型' }, { key: 'amount', label: '代存金额', render: (value) => <Money value={value} /> }, { key: 'method', label: '扣款账户' },
    { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'appliedAt', label: '申请时间' },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => setDetail(row)}>详情</ActionLink>{portal !== 'agent' && row.status === '待处理' && <ActionLink onClick={() => { setReviewing(row); setReviewForm({ approved: '通过', remark: '' }) }}>审核</ActionLink>}</div> },
  ]
  function search() {
    state.setApplied(state.draft)
    onToast?.(`已查询 ${rows.filter((row) => matches(row, state.draft)).length} 条代理代存记录`)
  }
  function submit() {
    const amount = Number(form.amount)
    if (!Number.isFinite(amount) || amount <= 0) {
      onToast?.('请输入有效付款金额', 'error')
      return
    }
    if (!form.member) {
      onToast?.('请选择当前代理范围内的会员', 'error')
      return
    }
    const payload = { account: roleMeta.account, member: form.member, payType: form.payType, amount, turnoverMultiple: Number(form.turnoverMultiple || 1), remark: form.remark }
    toastResult(context.submitAgentPay(payload), onToast, '代理代存申请已提交', () => setSubmitting(false))
  }
  function review() {
    toastResult(context.reviewAgentPay(reviewing.id, reviewForm.approved === '通过', reviewForm.remark), onToast, '代理代存审核已完成', () => setReviewing(null))
  }
  return <>
    <SectionHeader title="代理代存记录" description="统一查询代理使用佣金余额或预付金额度向会员代存的申请、审核和资金结果。" actions={portal === 'agent' && <Button icon={<PlusOutlined />} onClick={() => { setSubmitting(true); setForm({ member: memberOptions[0]?.value || '', payType: '佣金代存', amount: '', turnoverMultiple: '1', remark: '' }) }}>申请代存</Button>} />
    <MetricGrid columns={3}><MetricCard label="当前记录" value={`${state.filtered.length} 笔`} icon={<WalletOutlined />} /><MetricCard label="代存金额合计" value={<Money value={total} />} tone="blue" /><MetricCard label="待处理" value={`${state.filtered.filter((row) => /待|处理|审核中/.test(row.status)).length} 笔`} tone="orange" icon={<AuditOutlined />} /></MetricGrid>
    <Filters rows={rows} state={state} onSearch={search} onReset={() => { state.setDraft(EMPTY_FILTERS); state.setApplied(EMPTY_FILTERS); onToast?.('代理代存筛选条件已重置') }} onExport={() => onToast?.(`已生成 ${state.filtered.length} 条代理代存导出演示`)} />
    <DataTable minWidth={2050} columns={columns} rows={state.filtered} paginated />
    <BalanceFormula />
    <Alert title="代存边界" tone="warning">佣金代存只扣当前代理本人可用佣金，额度代存只扣本人预付金额度；审核通过后同步会员存款、代理转账和双方账变，历史已完成周期不回写。</Alert>
    <Modal open={!!detail} title={`${detail?.orderNo || ''} · 代存详情`} description="查看扣款代理、会员、结算范围、审核状态和业务备注。" onClose={() => setDetail(null)} onConfirm={() => setDetail(null)} confirmText="关闭" showCancel={false} width={860}>
      {detail && <><DescriptionGrid columns={3} items={columns.filter((column) => column.key !== 'action').map((column) => ({ label: column.label, value: column.render ? column.render(detail[column.key], detail) : detail[column.key] }))} /><Alert title="业务备注">{detail.remark}</Alert></>}
    </Modal>
    <Modal open={submitting} title={`${roleMeta.account} · 申请代理代存`} description="提交后进入站点审核；审核通过后再同步扣款、会员入账和资金记录。" onClose={() => setSubmitting(false)} onConfirm={submit} confirmText="提交申请">
      <DescriptionGrid columns={2} items={[{ label: '结算身份', value: roleMeta.identity }, { label: '结算单元', value: roleMeta.unit }, { label: '业务线路', value: roleMeta.line }, { label: '生效周期', value: '2026-07' }]} />
      <FormGrid><Field label="代存会员" required><Select value={form.member} onChange={(member) => setForm((current) => ({ ...current, member }))} placeholder="选择当前范围会员" options={memberOptions} /></Field><Field label="代存类型"><Select value={form.payType} onChange={(payType) => setForm((current) => ({ ...current, payType }))} options={['佣金代存', '额度代存']} /></Field><Field label="代存金额" required><Input type="number" min="0" value={form.amount} onChange={(amount) => setForm((current) => ({ ...current, amount }))} /></Field><Field label="流水倍数"><Input type="number" min="1" step="1" value={form.turnoverMultiple} onChange={(turnoverMultiple) => setForm((current) => ({ ...current, turnoverMultiple }))} /></Field><Field label="申请备注" className="ta-field-full"><Input value={form.remark} onChange={(remark) => setForm((current) => ({ ...current, remark }))} /></Field></FormGrid>
    </Modal>
    <Modal open={!!reviewing} title={`${reviewing?.orderNo || ''} · 审核代理代存`} description="审核结果仅通过可选业务动作提交。" onClose={() => setReviewing(null)} onConfirm={review} confirmText="确认审核">
      {reviewing && <><DescriptionGrid columns={2} items={[{ label: '代理 / 身份', value: `${reviewing.agent} / ${reviewing.identity}` }, { label: '代存金额', value: <Money value={reviewing.amount} /> }, { label: '结算单元', value: reviewing.unit }, { label: '生效周期', value: reviewing.cycle }]} /><FormGrid><Field label="审核结果"><Select value={reviewForm.approved} onChange={(approved) => setReviewForm((current) => ({ ...current, approved }))} options={['通过', '拒绝']} /></Field><Field label="审核备注"><Input value={reviewForm.remark} onChange={(remark) => setReviewForm((current) => ({ ...current, remark }))} /></Field></FormGrid></>}
    </Modal>
  </>
}
