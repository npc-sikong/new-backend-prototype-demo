import { useEffect, useMemo, useState } from 'react'
import {
  AlipayCircleOutlined,
  AppstoreOutlined,
  ArrowDownOutlined,
  ArrowUpOutlined,
  CalendarOutlined,
  CloseOutlined,
  CreditCardOutlined,
  DollarCircleOutlined,
  ExportOutlined,
  FilterOutlined,
  GiftOutlined,
  LeftOutlined,
  MinusOutlined,
  PlusCircleOutlined,
  PlusOutlined,
  QrcodeOutlined,
  ReloadOutlined,
  RightOutlined,
  SearchOutlined,
  ShopOutlined,
  ShoppingOutlined,
  SwapOutlined,
  TeamOutlined,
  UnorderedListOutlined,
  WalletOutlined,
  WechatOutlined,
} from '@ant-design/icons'
import { useTeamAgent } from '../team-agent/context'
import {
  ACCOUNT_CHANGE_ROWS,
  AGENT_ROLE_PROFILES,
  MEMBER_FUND_ROWS,
  REVERSAL_REPAYMENT_ROWS,
  VENUE_FEE_ROWS,
  rowsForAgentRole,
} from '../team-agent/multi-level-agent-data'

const PAGE_SIZE_OPTIONS = [20, 50, 100, 200]
const ROLE_ACCOUNTS = { main: ['gaodashang'], secondary: ['WC002'], independent: ['dailiwc001'] }

function money(value, signed = false) {
  const amount = Number(value || 0)
  const sign = amount < 0 ? '-' : signed && amount > 0 ? '+' : ''
  return `${sign}¥${Math.abs(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function valueTone(value) {
  return Number(value) > 0 ? 'is-positive' : Number(value) < 0 ? 'is-negative' : ''
}

function dateOnly(value) {
  return String(value || '').slice(0, 10)
}

function unique(rows, key) {
  return [...new Set(rows.map((row) => row[key]).filter(Boolean))]
}

function notify(onToast, message, tone) {
  onToast?.(message, tone)
}

function StatusPill({ children, tone = '' }) {
  const text = String(children ?? '—')
  const inferred = tone || (/(成功|完成|已确认|回款|正常|启用)/.test(text) ? 'positive' : /(失败|拒绝|负|禁用)/.test(text) ? 'negative' : /(待|处理|垫付|部分)/.test(text) ? 'warning' : 'neutral')
  return <span className={`h5-agent-status is-${inferred}`}>{text}</span>
}

function ReadOnlySettlementActions({ member = false }) {
  if (member) return <StatusPill>随团队结算</StatusPill>
  return <span className="h5-agent-form-actions">
    <button type="button" className="h5-agent-inline-action" disabled>确认</button>
    <button type="button" className="h5-agent-inline-action" disabled>不发放</button>
    <button type="button" className="h5-agent-inline-action" disabled>修改发放</button>
  </span>
}

function EmptyState({ text = '暂无数据' }) {
  return <div className="h5-agent-empty"><span><UnorderedListOutlined /></span><strong>{text}</strong><small>调整筛选条件后重新查询</small></div>
}

function Pager({ total, page, pageSize, onPageChange, onPageSizeChange }) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(page, pageCount)
  return <footer className="h5-agent-pagination h5-agent-pager">
    <span>共 {total} 条</span>
    <label><select value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>{PAGE_SIZE_OPTIONS.map((size) => <option key={size} value={size}>{size}条/页</option>)}</select></label>
    <div><button disabled={safePage <= 1} onClick={() => onPageChange(safePage - 1)}><LeftOutlined /></button><b>{safePage}/{pageCount}</b><button disabled={safePage >= pageCount} onClick={() => onPageChange(safePage + 1)}><RightOutlined /></button></div>
  </footer>
}

function Sheet({ open, title, description, titleIcon: TitleIcon, titleTone = 'blue', children, onClose, footer, className = '' }) {
  if (!open) return null
  return <div className="h5-agent-sheet-backdrop" onClick={onClose}>
    <section className={`h5-agent-sheet ${className}`} role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
      <header>
        <div className={TitleIcon ? 'h5-agent-sheet-title' : ''}>
          {TitleIcon && <span className={`h5-agent-sheet-title-icon is-${titleTone}`}><TitleIcon /></span>}
          <div><h2>{title}</h2>{description && <p>{description}</p>}</div>
        </div>
        <button aria-label="关闭" onClick={onClose}><CloseOutlined /></button>
      </header>
      <div className="h5-agent-sheet-content h5-agent-sheet-body">{children}</div>
      {footer && <footer className="h5-agent-sheet-actions">{footer}</footer>}
    </section>
  </div>
}

function DetailSheet({ row, title = '记录详情', fields, onClose }) {
  return <Sheet open={Boolean(row)} title={title} description="完整字段仅用于移动端核对" onClose={onClose}>
    {row && <dl className="h5-agent-detail-grid h5-agent-detail-list">{fields.map((field) => {
      const rawValue = typeof field.value === 'function' ? field.value(row) : row[field.key]
      const rendered = field.render ? field.render(rawValue, row) : rawValue ?? '—'
      return <div key={field.key || field.label}><dt>{field.label}</dt><dd>{rendered}</dd></div>
    })}</dl>}
  </Sheet>
}

function FilterSheet({ open, title = '筛选条件', filters, fields, onChange, onReset, onApply, onClose }) {
  return <Sheet open={open} title={title} description="筛选仅影响当前身份授权数据" onClose={onClose} footer={<><button className="secondary" onClick={onReset}><ReloadOutlined />重置</button><button className="primary" onClick={onApply}><SearchOutlined />查询</button></>}>
    <div className="h5-agent-filter-fields">{fields.map((field) => <label key={field.key}><span>{field.label}</span>{field.type === 'select' ? <select value={filters[field.key] || ''} onChange={(event) => onChange(field.key, event.target.value)}><option value="">{field.placeholder || '全部'}</option>{field.options.map((option) => <option key={option} value={option}>{option}</option>)}</select> : <input type={field.type || 'text'} value={field.value ?? filters[field.key] ?? ''} disabled={field.disabled} placeholder={field.placeholder} onChange={(event) => onChange(field.key, event.target.value)} />}</label>)}</div>
  </Sheet>
}

function SearchBar({ value, placeholder, onChange, onFilter, onRefresh, extra }) {
  return <div className="h5-agent-list-toolbar h5-agent-searchbar">
    <label className="h5-agent-search"><SearchOutlined /><input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>
    <button className="h5-agent-filter-button" aria-label="筛选" onClick={onFilter}><FilterOutlined /></button>
    {onRefresh && <button className="h5-agent-icon-button" aria-label="刷新" onClick={onRefresh}><ReloadOutlined /></button>}
    {extra}
  </div>
}

function AuditTable({ rows, columns, totals }) {
  return <div className="h5-agent-audit-wrap"><table className="h5-agent-audit-table"><thead><tr>{columns.map((column) => <th key={column.key}>{column.label}</th>)}</tr></thead><tbody>
    {rows.map((row) => <tr key={row.id} className={row.rowType === 'member' ? 'is-member' : ''}>{columns.map((column) => <td key={column.key}>{column.render ? column.render(row[column.key], row) : row[column.key] ?? '—'}</td>)}</tr>)}
    {!rows.length && <tr><td colSpan={columns.length}>暂无数据</td></tr>}
    {totals && <tr className="h5-agent-audit-total">{columns.map((column, index) => <td key={column.key}>{index === 0 ? '总计' : totals[column.key] ?? '—'}</td>)}</tr>}
  </tbody></table></div>
}

function RecordPage({ title, rows, filters, setFilters, filterFields, predicate, card, detailFields, onToast, emptyText, auditColumns, metrics, searchKey = 'keyword', searchPlaceholder = '搜索记录', exportAction = false, exportLabel = '导出', downloadAction = false, downloadLabel = '下载文件', refreshAction = false, totals }) {
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [audit, setAudit] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const setFilter = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); setPage(1) }
  const filtered = useMemo(() => rows.filter((row) => predicate(row, filters)), [rows, filters, predicate])
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize)
  const reset = () => { setFilters(Object.fromEntries(Object.keys(filters).map((key) => [key, '']))); setPage(1) }
  return <section className="h5-agent-page">
    {metrics}
    <SearchBar value={filters[searchKey] || ''} placeholder={searchPlaceholder} onChange={(value) => setFilter(searchKey, value)} onFilter={() => setFilterOpen(true)} onRefresh={refreshAction ? () => notify(onToast, `已刷新，当前 ${filtered.length} 条`) : null} extra={auditColumns && <button className={`h5-agent-icon-button h5-agent-icon-action ${audit ? 'active' : ''}`} aria-label="切换核对模式" onClick={() => setAudit((value) => !value)}>{audit ? <AppstoreOutlined /> : <UnorderedListOutlined />}</button>} />
    <div className="h5-agent-result-meta"><span>当前筛选 {filtered.length} 条</span>{(exportAction || downloadAction) && <div>{exportAction && <button onClick={() => notify(onToast, `${title}已导出 ${filtered.length} 条`)}>{exportLabel}</button>}{downloadAction && <button onClick={() => notify(onToast, '下载文件入口已触发')}>{downloadLabel}</button>}</div>}</div>
    {audit && auditColumns ? <AuditTable rows={visible} columns={auditColumns} totals={totals?.(filtered)} /> : <div className="h5-agent-card-list">{visible.length ? visible.map((row) => card(row, () => setSelected(row))) : <EmptyState text={emptyText} />}</div>}
    <Pager total={filtered.length} page={safePage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} />
    <FilterSheet open={filterOpen} filters={filters} fields={filterFields} onChange={setFilter} onReset={reset} onApply={() => { setFilterOpen(false); notify(onToast, `已查询 ${filtered.length} 条记录`) }} onClose={() => setFilterOpen(false)} />
    <DetailSheet row={selected} fields={detailFields} onClose={() => setSelected(null)} onToast={onToast} />
  </section>
}

function ReportCard({ title, subtitle, status, values, onDetail, children, className = '', actionLabel = '查看完整详情' }) {
  return <article className={`h5-agent-record-card ${className}`}>
    <header><div><strong>{title}</strong><small>{subtitle}</small></div>{status && <StatusPill>{status}</StatusPill>}</header>
    <div className="h5-agent-record-summary h5-agent-record-values">{values.map((item) => <div key={item.label}><span>{item.label}</span><b className={item.tone || ''}>{item.value}</b></div>)}</div>
    {children}
    <footer><span /><button className="h5-agent-card-detail" onClick={onDetail}>{actionLabel}<RightOutlined /></button></footer>
  </article>
}

const FINANCE_ACTIONS = [
  { key: 'recharge', label: '快速充值', subtitle: 'QUICK RECHARGE', icon: PlusCircleOutlined, tone: 'blue', submitLabel: '下一步' },
  { key: 'withdraw', label: '余额提现', subtitle: 'WITHDRAW FUNDS', icon: ExportOutlined, tone: 'green', submitLabel: '确认提现' },
  { key: 'transfer', label: '内部转账', subtitle: 'INTERNAL TRANSFER', icon: SwapOutlined, tone: 'purple', submitLabel: '下一步' },
  { key: 'packet', label: '发放会员红包', subtitle: 'DIRECT MEMBER RED PACKET', icon: GiftOutlined, tone: 'red', submitLabel: '确认派发红包' },
]

const RECHARGE_CHANNELS = [
  { key: 'usdt', label: 'USDT', icon: DollarCircleOutlined, tone: 'blue' },
  { key: 'alipay', label: '支付宝', icon: AlipayCircleOutlined, tone: 'alipay' },
  { key: 'hipay', label: '支付宝新hipay', icon: WalletOutlined, tone: 'blue' },
  { key: 'alipayUid', label: '支付宝小额UID', icon: AlipayCircleOutlined, tone: 'alipay' },
  { key: 'alipayMixed', label: '支付宝自营混合码', icon: QrcodeOutlined, tone: 'alipay' },
  { key: 'alipayGold', label: '支付宝小金条', icon: AlipayCircleOutlined, tone: 'alipay' },
  { key: 'alipayCarrier', label: '支付宝联通网厅双端', icon: AlipayCircleOutlined, tone: 'alipay' },
  { key: 'alipayPure', label: '支付宝纯金条', icon: AlipayCircleOutlined, tone: 'alipay' },
  { key: 'alipayH5', label: '支付宝个码直充H5', icon: QrcodeOutlined, tone: 'alipay' },
  { key: 'alipayCard', label: '支付宝转卡', icon: CreditCardOutlined, tone: 'alipay' },
  { key: 'wechatUid', label: '微信UID', icon: WechatOutlined, tone: 'wechat' },
  { key: 'wechatBill', label: '微信财付通话费', icon: WechatOutlined, tone: 'wechat' },
  { key: 'wechatQQ', label: '微信转QQ双端', icon: WechatOutlined, tone: 'wechat' },
  { key: 'wechatGame', label: '微信京东游戏', icon: WechatOutlined, tone: 'wechat' },
  { key: 'wechatPacket', label: '微信群红包', icon: WechatOutlined, tone: 'wechat' },
  { key: 'wechatFixed', label: '微信固额小原生', icon: WechatOutlined, tone: 'wechat' },
  { key: 'wechatCarrier', label: '微信联通商城原生', icon: WechatOutlined, tone: 'wechat' },
  { key: 'unionQr', label: '银联扫码', icon: QrcodeOutlined, tone: 'union' },
  { key: 'combined', label: '综合支付', icon: WalletOutlined, tone: 'blue' },
  { key: 'douyin', label: '抖音红包转账', icon: GiftOutlined, tone: 'red' },
  { key: 'tmall', label: '天猫原生', icon: ShoppingOutlined, tone: 'red' },
  { key: 'walmart', label: '沃尔玛', icon: ShopOutlined, tone: 'blue' },
  { key: 'qq', label: 'QQ好友', icon: TeamOutlined, tone: 'blue' },
  { key: 'longCard', label: '龙兴卡', icon: CreditCardOutlined, tone: 'red' },
]

const QUICK_RECHARGE_AMOUNTS = [10, 20, 30, 50, 100, 200, 300, 500, 1000, 5000, 10000, 20000]
const DEFAULT_FINANCE_FORM = {
  rechargeChannel: 'usdt',
  protocol: 'TRC20',
  withdrawType: 'usdt',
  transferMode: 'member',
  target: '',
  turnoverMultiple: '1',
  sendTime: 'now',
  scheduledAt: '2026-07-25T10:00',
  validity: '24h',
  remark: '',
}

function H5MoneySegments({ label, value, options, onChange }) {
  return <div className="h5-agent-money-segment-wrap">
    {label && <span>{label}</span>}
    <div className="h5-agent-money-segments">{options.map((option) => <button type="button" key={option.value} className={value === option.value ? 'active' : ''} aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.label}</button>)}</div>
  </div>
}

function H5MoneyInput({ label, currency, unit, value, min = 0, placeholder = '0.00', onChange }) {
  return <label className="h5-agent-money-field">
    <span>{label}{currency && <em>（{currency}）</em>}</span>
    <div className="h5-agent-money-input"><input aria-label={label} type="number" min={min} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /><b>{unit}</b></div>
  </label>
}

function H5RechargeAction({ form, setForm, amount, setAmount }) {
  const channel = RECHARGE_CHANNELS.find((item) => item.key === form.rechargeChannel) || RECHARGE_CHANNELS[0]
  const isUsdt = channel.key === 'usdt'
  return <div className="h5-agent-money-form">
    <section className="h5-agent-recharge-channel-section">
      <span className="h5-agent-money-label">选择充值渠道</span>
      <div className="h5-agent-recharge-channels">{RECHARGE_CHANNELS.map((item) => {
        const Icon = item.icon
        return <button type="button" key={item.key} className={`${form.rechargeChannel === item.key ? 'active' : ''} is-${item.tone}`} aria-pressed={form.rechargeChannel === item.key} onClick={() => setForm('rechargeChannel', item.key)}>
          <Icon />
          <span>{item.label}</span>
        </button>
      })}</div>
    </section>
    {isUsdt && <label className="h5-agent-money-select"><span>选择协议</span><select value={form.protocol} onChange={(event) => setForm('protocol', event.target.value)}><option value="TRC20">TRC20</option><option value="ERC20">ERC20</option></select></label>}
    <H5MoneyInput label="充值金额" currency={isUsdt ? 'USDT' : 'CNY'} unit={isUsdt ? 'U' : '元'} value={amount} min={10} onChange={setAmount} />
    <p className="h5-agent-money-limit">单笔限额：<b>{isUsdt ? '10.00 - 100,000.00 U' : '¥10.00 - ¥100,000.00'}</b></p>
    <div className="h5-agent-money-quick-amounts">{QUICK_RECHARGE_AMOUNTS.map((value) => <button type="button" key={value} className={Number(amount) === value ? 'active' : ''} onClick={() => setAmount(String(value))}>{value}</button>)}</div>
    <p className="h5-agent-money-note">交易所或钱包转账需额外收取矿工手续费，请留意。</p>
  </div>
}

function H5WithdrawAction({ profile, balance, form, setForm, amount, setAmount }) {
  const isUsdt = form.withdrawType === 'usdt'
  const account = isUsdt ? profile.withdrawalAccount : `支付宝 · ${profile.account}`
  return <div className="h5-agent-money-form">
    <H5MoneySegments value={form.withdrawType} options={[{ value: 'usdt', label: 'USDT提现' }, { value: 'alipay', label: '支付宝提现' }]} onChange={(value) => setForm('withdrawType', value)} />
    <section className="h5-agent-withdraw-destination">
      <header><span>提现至</span><b>{isUsdt ? 'USDT' : '支付宝'}</b></header>
      <strong>{account || '未设置提现地址'}</strong>
      <small>{isUsdt ? '链路协议：TRC20' : '实名收款账户'}</small>
    </section>
    <H5MoneyInput label="提现金额" currency="CNY" unit="元" value={amount} min={1} onChange={setAmount} />
    {isUsdt && <p className="h5-agent-money-note">USDT通道按人民币输入，系统将按汇率自动换算。</p>}
    <p className="h5-agent-money-limit">当前可用余额：<b>{money(balance)}</b></p>
    <p className="h5-agent-money-limit">单笔限额：<b>{isUsdt ? '1.00 - 201.00 U（约 ¥6.80 - ¥1,366.80）' : '¥100.00 - ¥50,000.00'}</b></p>
    <p className="h5-agent-money-note">可提现时间段为 00:01-23:59，请您留意。</p>
  </div>
}

function H5TransferAction({ balance, form, setForm, amount, setAmount }) {
  return <div className="h5-agent-money-form">
    <H5MoneySegments value={form.transferMode} options={[{ value: 'member', label: '转账给会员' }, { value: 'agent', label: '转账给代理' }]} onChange={(value) => setForm('transferMode', value)} />
    <label className="h5-agent-money-field"><span>目标账号 / ID</span><div className="h5-agent-money-input has-icon"><input aria-label="目标账号或ID" value={form.target} placeholder="请输入目标账号或ID" onChange={(event) => setForm('target', event.target.value)} /><SearchOutlined /></div></label>
    <H5MoneyInput label="转账金额" currency="CNY" unit="元" value={amount} min={1} onChange={setAmount} />
    <p className="h5-agent-money-limit">当前可用余额：<b>{money(balance)}</b></p>
    <H5MoneyInput label="流水倍数" unit="倍" value={form.turnoverMultiple} min={0} placeholder="1" onChange={(value) => setForm('turnoverMultiple', value)} />
  </div>
}

function H5PacketAction({ balance, form, setForm, amount, setAmount }) {
  return <div className="h5-agent-money-form h5-agent-packet-form">
    <section className="h5-agent-packet-balance"><span>当前可用额度</span><b>{money(balance)}</b></section>
    <label className="h5-agent-money-field"><span>指定会员 ID / 账号</span><div className="h5-agent-money-input"><input aria-label="指定会员ID或账号" value={form.target} placeholder="输入会员账号或ID" onChange={(event) => setForm('target', event.target.value)} /></div></label>
    <H5MoneyInput label="单会员红包金额" currency="CNY" unit="元" value={amount} min={0.01} onChange={setAmount} />
    <H5MoneyInput label="提现所需流水倍数" currency="倍" unit="倍" value={form.turnoverMultiple} min={0} placeholder="1" onChange={(value) => setForm('turnoverMultiple', value)} />
    <p className="h5-agent-money-note">输入 0 表示无流水限制，默认为 1 倍。</p>
    <H5MoneySegments label="发放时间" value={form.sendTime} options={[{ value: 'now', label: '立即发放' }, { value: 'scheduled', label: '指定时间发放' }]} onChange={(value) => setForm('sendTime', value)} />
    {form.sendTime === 'scheduled' && <label className="h5-agent-money-field"><span>指定发放时间</span><div className="h5-agent-money-input has-icon"><input aria-label="指定发放时间" type="datetime-local" value={form.scheduledAt} onChange={(event) => setForm('scheduledAt', event.target.value)} /><CalendarOutlined /></div></label>}
    <H5MoneySegments label="红包有效期" value={form.validity} options={[{ value: '24h', label: '24小时' }, { value: '7d', label: '7天' }]} onChange={(value) => setForm('validity', value)} />
    <label className="h5-agent-money-field"><span>备注</span><div className="h5-agent-money-textarea"><textarea aria-label="备注" maxLength={500} value={form.remark} placeholder="请输入备注（选填）" onChange={(event) => setForm('remark', event.target.value)} /><small>{form.remark.length}/500</small></div></label>
  </div>
}

export function H5FinancePage({ role = 'main', financeState, onFinanceChange, initialActionKey, onInitialActionConsumed, onToast }) {
  const profile = AGENT_ROLE_PROFILES[role] || AGENT_ROLE_PROFILES.main
  const balance = Number(financeState?.balance ?? profile.availableBalance ?? 0)
  const flows = Array.isArray(financeState?.flows) ? financeState.flows : []
  const [action, setAction] = useState(null)
  const [amountInput, setAmountInput] = useState('')
  const [actionForm, setActionForm] = useState(() => ({ ...DEFAULT_FINANCE_FORM }))
  const [selected, setSelected] = useState(null)
  const [keyword, setKeyword] = useState('')
  const [period, setPeriod] = useState('2026-07-21')
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  useEffect(() => {
    setAction(null)
    setSelected(null)
    setAmountInput('')
    setActionForm({ ...DEFAULT_FINANCE_FORM })
    setKeyword('')
    setPeriod('2026-07-21')
    setFilterOpen(false)
    setPage(1)
  }, [role])
  useEffect(() => {
    if (!initialActionKey) return
    const nextAction = FINANCE_ACTIONS.find((item) => item.key === initialActionKey)
    if (nextAction) {
      setAmountInput('')
      setActionForm({ ...DEFAULT_FINANCE_FORM })
      setAction(nextAction)
    }
    onInitialActionConsumed?.()
  }, [initialActionKey, onInitialActionConsumed])
  const amount = Number(amountInput || 0)
  const filteredFlows = flows.filter((row) => (!keyword || `${profile.account}${profile.site}${profile.siteCode}${row.member}`.toLowerCase().includes(keyword.toLowerCase())) && (!period || dateOnly(row.time) === period))
  const pageCount = Math.max(1, Math.ceil(filteredFlows.length / pageSize)); const safePage = Math.min(page, pageCount); const visibleFlows = filteredFlows.slice((safePage - 1) * pageSize, safePage * pageSize)
  const setFormField = (key, value) => setActionForm((current) => ({ ...current, [key]: value }))
  const openAction = (nextAction) => {
    setAmountInput('')
    setActionForm({ ...DEFAULT_FINANCE_FORM })
    setAction(nextAction)
  }
  const closeAction = () => {
    setAction(null)
    setAmountInput('')
    setActionForm({ ...DEFAULT_FINANCE_FORM })
  }
  const submit = () => {
    if (!Number.isFinite(amount) || amount <= 0) return notify(onToast, '请输入正确金额', 'error')
    if (action.key === 'recharge' && amount < 10) return notify(onToast, '充值金额不能低于 10', 'error')
    if (['transfer', 'packet'].includes(action.key) && !actionForm.target.trim()) return notify(onToast, action.key === 'packet' ? '请输入会员账号或ID' : '请输入目标账号或ID', 'error')
    if (['transfer', 'packet'].includes(action.key) && Number(actionForm.turnoverMultiple) < 0) return notify(onToast, '流水倍数不能小于 0', 'error')
    const incoming = action.key === 'recharge'
    const rechargeChannel = RECHARGE_CHANNELS.find((item) => item.key === actionForm.rechargeChannel) || RECHARGE_CHANNELS[0]
    const balanceAmount = incoming && rechargeChannel.key === 'usdt' ? amount * 7.2 : amount
    if (!incoming && balanceAmount > balance) return notify(onToast, '可用额度不足', 'error')
    const nextBalance = incoming ? balance + balanceAmount : balance - balanceAmount
    const relation = action.key === 'recharge'
      ? `${rechargeChannel.label}${rechargeChannel.key === 'usdt' ? ` · ${actionForm.protocol}` : ''}`
      : action.key === 'withdraw'
        ? actionForm.withdrawType === 'usdt' ? 'USDT · TRC20' : '支付宝'
        : action.key === 'transfer'
          ? `${actionForm.transferMode === 'member' ? '会员' : '代理'} · ${actionForm.target}`
          : `会员红包 · ${actionForm.target}`
    const entry = {
      id: `MLF-${String(flows.length + 1).padStart(4, '0')}`,
      member: ['transfer', 'packet'].includes(action.key) ? actionForm.target : profile.account,
      type: action.label,
      amount: incoming ? balanceAmount : -balanceAmount,
      relation,
      time: '2026-07-21 12:30:00',
      status: '处理成功',
    }
    onFinanceChange?.({ ...(financeState || {}), balance: nextBalance, flows: [entry, ...flows] })
    closeAction()
    notify(onToast, `${action.label}演示已完成`)
  }
  const flowFields = [{ key: 'id', label: '流水单号' }, { key: 'member', label: '会员名' }, { key: 'type', label: '业务类型' }, { key: 'amount', label: '主体变动额度', render: (value) => <b className={valueTone(value)}>{money(value, true)}</b> }, { key: 'relation', label: '关联方名称' }, { key: 'time', label: '时间' }, { key: 'status', label: '操作', render: (value) => <StatusPill>{value}</StatusPill> }]
  return <section className="h5-agent-page h5-agent-finance-page">
    <section className="h5-agent-balance-hero"><span>当前可用额度（CNY）</span><strong>{money(balance)}</strong><small>站点：{profile.siteCode} · {profile.roleLabel}</small></section>
    <div className="h5-agent-finance-actions">{FINANCE_ACTIONS.map((item) => { const Icon = item.icon; return <button key={item.key} className={`is-${item.tone}`} onClick={() => openAction(item)}><i><Icon /></i><span>{item.key === 'packet' ? '发放红包' : item.label}</span></button> })}</div>
    <ReportCard title="提现账号" subtitle="USDT（TRC20）" values={[{ label: '账号', value: profile.withdrawalAccount }, { label: '链路协议', value: 'TRC20' }]} actionLabel="更换" onDetail={() => notify(onToast, '提现账号更换入口已打开')}><p>提现申请将在 2 小时内处理完成，请留意到账情况</p></ReportCard>
    <div className="h5-agent-section-heading"><div><h2>近期收支明细</h2></div><button onClick={() => notify(onToast, '财务数据已刷新')}><ReloadOutlined /></button></div>
    <SearchBar value={keyword} placeholder="搜索用户或站点..." onChange={(value) => { setKeyword(value); setPage(1) }} onFilter={() => setFilterOpen(true)} />
    <div className="h5-agent-result-meta"><span>当前筛选 {filteredFlows.length} 条</span><div><button onClick={() => notify(onToast, '收支明细已导出')}>导出报表</button></div></div>
    <div className="h5-agent-card-list">{visibleFlows.length ? visibleFlows.map((row) => <article className="h5-agent-flow-row" key={row.id} onClick={() => setSelected(row)}><i className={valueTone(row.amount)}>{row.amount > 0 ? <ArrowDownOutlined /> : <ArrowUpOutlined />}</i><div><strong>{row.type}</strong><small>{row.time} · {row.status}</small></div><b className={valueTone(row.amount)}>{money(row.amount, true)}</b><RightOutlined /></article>) : <EmptyState text="暂无数据" />}</div>
    <Pager total={filteredFlows.length} page={safePage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} />
    <Sheet open={filterOpen} title="近期收支筛选" onClose={() => setFilterOpen(false)} footer={<><button className="secondary" onClick={() => { setPeriod('2026-07-21'); setKeyword(''); setPage(1) }}>重置</button><button className="primary" onClick={() => { setFilterOpen(false); notify(onToast, '近期明细已筛选') }}>筛选</button></>}><div className="h5-agent-filter-fields"><label><span>创建时间</span><input type="date" value={period} onChange={(event) => { setPeriod(event.target.value); setPage(1) }} /></label></div></Sheet>
    <Sheet
      open={Boolean(action)}
      title={action?.label || ''}
      description={action?.subtitle || ''}
      titleIcon={action?.icon}
      titleTone={action?.tone}
      onClose={closeAction}
      className={`h5-agent-money-sheet ${action ? `is-${action.key}` : ''}`}
      footer={<button className={`wide h5-agent-money-submit ${action?.key === 'packet' ? 'is-red' : ''}`} onClick={submit}>{action?.submitLabel || '确认提交'}</button>}
    >
      {action?.key === 'recharge' && <H5RechargeAction form={actionForm} setForm={setFormField} amount={amountInput} setAmount={setAmountInput} />}
      {action?.key === 'withdraw' && <H5WithdrawAction profile={profile} balance={balance} form={actionForm} setForm={setFormField} amount={amountInput} setAmount={setAmountInput} />}
      {action?.key === 'transfer' && <H5TransferAction balance={balance} form={actionForm} setForm={setFormField} amount={amountInput} setAmount={setAmountInput} />}
      {action?.key === 'packet' && <H5PacketAction balance={balance} form={actionForm} setForm={setFormField} amount={amountInput} setAmount={setAmountInput} />}
    </Sheet>
    <DetailSheet row={selected} title="资金流水详情" fields={flowFields} onClose={() => setSelected(null)} onToast={onToast} />
  </section>
}

const ACCOUNT_FIELDS = [{ key: 'memberId', label: '会员账号' }, { key: 'member', label: '会员名' }, { key: 'type', label: '账变类型' }, { key: 'amount', label: '账变金额(元)', render: (value) => <b className={valueTone(value)}>{money(value, true)}</b> }, { key: 'time', label: '时间' }, { key: 'id', label: '记录编号' }]

export function H5AccountChangesPage({ role = 'main', onToast }) {
  const rows = rowsForAgentRole(ACCOUNT_CHANGE_ROWS, role)
  const [filters, setFilters] = useState({ member: '', type: '' })
  const predicate = (row, value) => (!value.member || row.member.toLowerCase().includes(value.member.toLowerCase())) && (!value.type || row.type === value.type)
  const accountTotals = (filtered) => ({ member: '—', type: '—', amount: money(filtered.reduce((sum, row) => sum + Number(row.amount || 0), 0), true), time: '—', id: '—' })
  const filteredTotal = accountTotals(rows.filter((row) => predicate(row, filters))).amount
  const metrics = <div className="h5-agent-metric-strip"><div><span>当前筛选账变总计</span><b className={valueTone(Number(String(filteredTotal).replace(/[^0-9.-]/g, '')))}>{filteredTotal}</b></div></div>
  return <RecordPage title="账变流水报表" rows={rows} filters={filters} setFilters={setFilters} predicate={predicate} onToast={onToast} searchKey="member" searchPlaceholder="请输入会员名" metrics={metrics} filterFields={[{ key: 'type', label: '账变类型', type: 'select', options: unique(rows, 'type') }, { key: 'date', label: '账变时间', type: 'date', value: '2026-07-21' }]} detailFields={ACCOUNT_FIELDS} card={(row, open) => <ReportCard key={row.id} title={row.member} subtitle={`账号 ${row.memberId} · ${row.time}`} status={row.type} values={[{ label: '账变金额(元)', value: money(row.amount, true), tone: valueTone(row.amount) }, { label: '记录编号', value: `${row.id.slice(0, 8)}…${row.id.slice(-5)}` }]} onDetail={open} />} />
}

const FUND_FIELDS = [{ key: 'orderNo', label: '单号' }, { key: 'account', label: '会员账号' }, { key: 'type', label: '交易类型' }, { key: 'currency', label: '币种' }, { key: 'amount', label: '金额', render: (value) => <b className={valueTone(value)}>{money(value, true)}</b> }, { key: 'status', label: '状态', render: (value) => <StatusPill>{value}</StatusPill> }, { key: 'createdAt', label: '创建时间' }, { key: 'remark', label: '备注' }]

export function H5MemberFundsPage({ role = 'main', onToast }) {
  const rows = rowsForAgentRole(MEMBER_FUND_ROWS, role)
  const [filters, setFilters] = useState({ account: '', orderNo: '', type: '', status: '', remark: '' })
  const predicate = (row, value) => (!value.account || row.account.toLowerCase().includes(value.account.toLowerCase())) && (!value.orderNo || row.orderNo.includes(value.orderNo)) && (!value.type || row.type === value.type) && (!value.status || row.status === value.status) && (!value.remark || row.remark.includes(value.remark))
  return <RecordPage title="会员资金记录" rows={rows} filters={filters} setFilters={setFilters} predicate={predicate} onToast={onToast} searchKey="account" searchPlaceholder="请输入会员账号名称" filterFields={[{ key: 'orderNo', label: '单号', placeholder: '请输入单号' }, { key: 'remark', label: '备注', placeholder: '请输入备注' }, { key: 'type', label: '交易类型', type: 'select', options: unique(rows, 'type') }, { key: 'status', label: '状态', type: 'select', options: unique(rows, 'status') }, { key: 'date', label: '创建时间', type: 'date', value: '2026-07-21' }]} detailFields={FUND_FIELDS} card={(row, open) => <ReportCard key={row.orderNo} title={row.account} subtitle={`${row.type} · ${row.createdAt}`} status={row.status} values={[{ label: `${row.currency} 金额`, value: money(row.amount, true), tone: valueTone(row.amount) }, { label: '单号', value: `${row.orderNo.slice(0, 8)}…${row.orderNo.slice(-5)}` }]} onDetail={open} />} />
}

function distributeTotal(total, weights, precision = 2) {
  const scale = 10 ** precision
  const totalUnits = Math.round(Number(total || 0) * scale)
  const normalized = weights.map((weight) => Math.abs(Number(weight || 0)))
  const normalizedTotal = normalized.reduce((sum, value) => sum + value, 0)
  const effective = normalizedTotal ? normalized : normalized.map(() => 1)
  const effectiveTotal = effective.reduce((sum, value) => sum + value, 0) || 1
  let allocated = 0
  return effective.map((weight, index) => {
    const units = index === effective.length - 1 ? totalUnits - allocated : Math.round(totalUnits * weight / effectiveTotal)
    allocated += units
    return units / scale
  })
}

const NEGATIVE_COUNT_KEYS = ['teamMembers', 'subAgentCount', 'registeredCount', 'firstDepositCount', 'activeCount', 'newActiveCount']
const NEGATIVE_MONEY_KEYS = ['depositAmount', 'withdrawalAmount', 'totalWinLoss', 'venueFee', 'memberBonus', 'activityRewards', 'memberReferralReward', 'memberRebate', 'accountAdjustment', 'depositFee', 'withdrawalFee', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet', 'commissionAdjustment', 'commission']
const formatDate = (value) => String(value || '—').slice(0, 16)
const rebateLevelOf = (bill, agent) => bill.rebateLevel || (bill.type === '团队佣金' ? `团队返佣${bill.teamLevel || agent.level || 1}级` : '单线返佣1级')
const auditStateOf = (bill) => bill.state === '审核退回' ? '审核退回' : ['待审核', '待提交'].includes(bill.state) ? '待审核' : bill.reviewer && bill.reviewer !== '—' ? '已审核' : '待审核'

function negativeMemberRows(data, bill, team) {
  if (bill.type !== '团队佣金' || !team?.lines?.length) return []
  const orderedLines = [...team.lines].sort((left, right) => Number(right.agent === team.mainAgent || right.identity === '主线') - Number(left.agent === team.mainAgent || left.identity === '主线'))
  const members = orderedLines.map((line) => ({ line, agent: data.agents.find((agent) => agent.account === line.agent) || {}, leader: line.agent === team.mainAgent || line.identity === '主线' }))
  const leader = members.find((member) => member.leader)?.agent || {}
  const teamIdentity = leader.teamAgentType === '官方代理' || bill.agentType === '官方代理' ? '官方代理' : '普通代理'
  const weights = (reader) => members.map(reader)
  const performance = weights(({ line, agent }) => agent.totalWinLoss ?? line.netWinLoss ?? 0)
  const specs = {
    teamMembers: [bill.teamMembers ?? members.length, weights(() => 1), 0], subAgentCount: [bill.subAgentCount ?? leader.subAgents ?? 0, weights(({ agent }) => agent.subAgents), 0], registeredCount: [bill.registeredCount ?? leader.members ?? 0, weights(({ agent }) => agent.members), 0], firstDepositCount: [bill.firstDepositCount ?? 0, weights(({ line }) => line.firstDepositCount), 0], activeCount: [bill.activeCount ?? leader.activeMembers ?? 0, weights(({ line, agent }) => line.activeMembers ?? agent.activeMembers), 0], newActiveCount: [bill.newActiveCount ?? leader.newActiveMembers ?? 0, weights(({ line, agent }) => line.newActive ?? agent.newActiveMembers), 0],
    depositAmount: [bill.depositAmount ?? leader.depositAmount ?? 0, weights(({ agent }) => agent.depositAmount)], withdrawalAmount: [bill.withdrawalAmount ?? leader.withdrawalAmount ?? 0, weights(({ agent }) => agent.withdrawalAmount)], totalWinLoss: [bill.totalWinLoss ?? leader.totalWinLoss ?? 0, performance], venueFee: [bill.venueFee, performance], memberBonus: [bill.memberBonus, performance], activityRewards: [bill.activityRewards, performance], memberReferralReward: [bill.memberReferralReward, performance], memberRebate: [bill.memberRebate, performance], accountAdjustment: [bill.accountAdjustment, performance], depositFee: [bill.depositFee, performance], withdrawalFee: [bill.withdrawalFee, performance], manualOrderWinLoss: [bill.manualOrderWinLoss, performance], netWinLossRaw: [bill.netWinLossRaw, performance], lastBalance: [bill.lastBalance, performance], correctedNet: [bill.correctedNet, performance], commissionAdjustment: [bill.commissionAdjustment, performance], commission: [bill.payable, performance],
  }
  const allocations = Object.fromEntries(Object.entries(specs).map(([key, [total, weight, precision = 2]]) => [key, distributeTotal(total, weight, precision)]))
  return members.map(({ line, agent, leader: isLeader }, index) => ({
    id: `${bill.id}-${line.lineId}`,
    rowType: 'member',
    index: `${index + 1}`,
    cycle: bill.cycle,
    teamName: team.name,
    agentId: agent.id || '—',
    agentAccount: line.agent,
    agentIdentity: teamIdentity,
    parentAccount: isLeader ? agent.parent || bill.recommender || '—' : team.mainAgent,
    rebateLevel: rebateLevelOf(bill, agent),
    rate: bill.rate || 0,
    commissionState: '随团队结算',
    becameAgentAt: formatDate(agent.registeredAt),
    joinedAt: formatDate(team.joinedAt || agent.effectiveCycle),
    issuedBy: '—',
    issuedAt: '—',
    auditState: '随团队审核',
    ...Object.fromEntries([...NEGATIVE_COUNT_KEYS, ...NEGATIVE_MONEY_KEYS].map((key) => [key, allocations[key][index]])),
  }))
}

function buildNegativeRows(data, role) {
  return data.bills.filter((bill) => ['团队佣金', '单线代理佣金'].includes(bill.type)).map((bill) => {
    const agent = data.agents.find((item) => item.account === bill.payee) || {}
    const team = data.teams.find((item) => item.id === bill.unitId || item.name === bill.unitName)
    if (agent.model !== '负盈利模式' && Number(bill.correctedNet || 0) >= 0) return null
    const memberRows = negativeMemberRows(data, bill, team)
    return {
      id: bill.id,
      rowType: bill.type === '团队佣金' ? 'team' : 'single',
      memberRows,
      cycle: bill.cycle,
      teamName: bill.unitName || team?.name || agent.unit || '—',
      agentId: agent.id || bill.agentId || '—',
      agentAccount: bill.payee,
      agentIdentity: agent.teamAgentType === '官方代理' || bill.agentType === '官方代理' ? '官方代理' : '普通代理',
      parentAccount: agent.parent || bill.recommender || '—',
      teamMembers: bill.teamMembers ?? team?.lines?.length ?? (bill.type === '单线代理佣金' ? 1 : 0),
      subAgentCount: bill.subAgentCount ?? agent.subAgents ?? 0,
      registeredCount: bill.registeredCount ?? agent.members ?? 0,
      firstDepositCount: bill.firstDepositCount ?? 0,
      activeCount: bill.activeCount ?? agent.activeMembers ?? 0,
      newActiveCount: bill.newActiveCount ?? agent.newActiveMembers ?? 0,
      depositAmount: bill.depositAmount ?? agent.depositAmount ?? 0,
      withdrawalAmount: bill.withdrawalAmount ?? agent.withdrawalAmount ?? 0,
      totalWinLoss: bill.totalWinLoss ?? agent.totalWinLoss ?? 0,
      venueFee: bill.venueFee ?? 0,
      memberBonus: bill.memberBonus ?? 0,
      activityRewards: bill.activityRewards ?? 0,
      memberReferralReward: bill.memberReferralReward ?? 0,
      memberRebate: bill.memberRebate ?? 0,
      accountAdjustment: bill.accountAdjustment ?? 0,
      depositFee: bill.depositFee ?? 0,
      withdrawalFee: bill.withdrawalFee ?? 0,
      manualOrderWinLoss: bill.manualOrderWinLoss ?? 0,
      netWinLossRaw: bill.netWinLossRaw ?? 0,
      lastBalance: bill.lastBalance ?? 0,
      correctedNet: bill.correctedNet ?? 0,
      rebateLevel: rebateLevelOf(bill, agent),
      rate: bill.rate ?? 0,
      commissionAdjustment: bill.commissionAdjustment ?? 0,
      commission: bill.payable ?? 0,
      commissionState: bill.state || '待审核',
      becameAgentAt: formatDate(bill.becameAgentAt || agent.registeredAt),
      joinedAt: formatDate(team?.joinedAt || agent.effectiveCycle || bill.createdAt),
      issuedBy: bill.issuedBy || '—',
      issuedAt: formatDate(bill.issuedAt),
      auditState: auditStateOf(bill),
    }
  }).filter(Boolean).map((row, index) => ({ ...row, index: index + 1 })).filter((row) => (ROLE_ACCOUNTS[role] || []).includes(row.agentAccount))
}

const NEGATIVE_FIELDS = [
  { key: 'agentAccount', label: '代理名称' }, { key: 'index', label: '序号' }, { key: 'cycle', label: '佣金周期' }, { key: 'teamName', label: '团队名称' }, { key: 'agentId', label: '代理编号' }, { key: 'agentIdentity', label: '代理身份' }, { key: 'parentAccount', label: '上级账号' },
  ...NEGATIVE_COUNT_KEYS.map((key) => ({ key, label: { teamMembers: '团队人数', subAgentCount: '下级会员', registeredCount: '注册人数', firstDepositCount: '首存人数', activeCount: '活跃人数', newActiveCount: '新增活跃人数' }[key] })),
  ...NEGATIVE_MONEY_KEYS.map((key) => ({ key, label: { depositAmount: '存款金额', withdrawalAmount: '提款金额', totalWinLoss: '总输赢', venueFee: '场馆费', memberBonus: '红利', activityRewards: '各活动奖励', memberReferralReward: '会员推会员', memberRebate: '返水', accountAdjustment: '账户调整', depositFee: '存款手续费', withdrawalFee: '提款手续费', manualOrderWinLoss: '补单输赢', netWinLossRaw: '净输赢', lastBalance: '上周期结余', correctedNet: '冲正后净输赢', commissionAdjustment: '佣金调整', commission: '佣金' }[key], render: (value) => <b className={valueTone(value)}>{money(value, true)}</b> })),
  { key: 'rebateLevel', label: '返佣等级' }, { key: 'rate', label: '佣金比例', render: (value) => `${Number(value || 0) * 100}%` }, { key: 'commissionState', label: '佣金状态', render: (value) => <StatusPill>{value}</StatusPill> }, { key: 'becameAgentAt', label: '成为代理时间' }, { key: 'joinedAt', label: '加入团队时间' }, { key: 'issuedBy', label: '发放人' }, { key: 'issuedAt', label: '发放时间' }, { key: 'auditState', label: '审核状态', render: (value) => <StatusPill>{value}</StatusPill> },
]

export function H5NegativeProfitPage({ role = 'main', onToast }) {
  const { data } = useTeamAgent()
  const [filters, setFilters] = useState({ keyword: '', cycle: '', identity: '', status: '' })
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [expanded, setExpanded] = useState([])
  const [audit, setAudit] = useState(false)
  const [visibleKeys, setVisibleKeys] = useState(() => NEGATIVE_FIELDS.map((field) => field.key))
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const allRows = useMemo(() => buildNegativeRows(data, role), [data, role])
  if (role === 'multiLevel') return <section className="h5-agent-page"><EmptyState text="当前身份无该模块" /></section>
  const rows = allRows.filter((row) => (!filters.keyword || `${row.agentAccount}${row.agentId}${row.teamName}${row.parentAccount}`.toLowerCase().includes(filters.keyword.toLowerCase())) && (!filters.cycle || row.cycle === filters.cycle) && (!filters.identity || row.agentIdentity === filters.identity) && (!filters.status || row.commissionState === filters.status))
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize)); const safePage = Math.min(page, pageCount); const visibleRoots = rows.slice((safePage - 1) * pageSize, safePage * pageSize)
  const visibleRows = visibleRoots.flatMap((row) => expanded.includes(row.id) ? [row, ...row.memberRows.map((member, memberIndex) => ({ ...member, index: `${row.index}.${memberIndex + 1}` }))] : [row])
  const totals = Object.fromEntries([...NEGATIVE_COUNT_KEYS, ...NEGATIVE_MONEY_KEYS].map((key) => [key, NEGATIVE_MONEY_KEYS.includes(key) ? money(rows.reduce((sum, row) => sum + Number(row[key] || 0), 0), true) : rows.reduce((sum, row) => sum + Number(row[key] || 0), 0)]))
  const readOnlyAction = { key: 'action', label: '操作', render: (_, row) => <ReadOnlySettlementActions member={row.rowType === 'member'} /> }
  const auditFields = [...NEGATIVE_FIELDS.filter((field) => visibleKeys.includes(field.key)), readOnlyAction]
  const setFilter = (key, value) => { setFilters((current) => ({ ...current, [key]: value })); setPage(1) }
  const reset = () => { setFilters({ keyword: '', cycle: '', identity: '', status: '' }); setVisibleKeys(NEGATIVE_FIELDS.map((field) => field.key)); setExpanded([]); setPage(1) }
  const toggleField = (key) => setVisibleKeys((current) => current.includes(key) ? current.length > 1 ? current.filter((item) => item !== key) : current : [...current, key])
  return <section className="h5-agent-page h5-agent-negative-page">
    <SearchBar value={filters.keyword} placeholder="代理账号、编号、团队或上级" onChange={(value) => setFilter('keyword', value)} onFilter={() => setFilterOpen(true)} extra={<button className={`h5-agent-icon-button h5-agent-icon-action ${audit ? 'active' : ''}`} aria-label="切换核对模式" onClick={() => setAudit((value) => !value)}>{audit ? <AppstoreOutlined /> : <UnorderedListOutlined />}</button>} />
    <div className="h5-agent-result-meta"><span>当前筛选 {rows.length} 条</span><div><button onClick={() => notify(onToast, `负盈利结算已导出 ${rows.length} 条`)}>导出</button><button onClick={() => notify(onToast, '下载文件入口已触发')}>下载</button></div></div>
    {audit ? <AuditTable rows={visibleRows} columns={auditFields} totals={totals} /> : <div className="h5-agent-card-list">{visibleRoots.length ? visibleRoots.flatMap((row) => {
      const cards = [<ReportCard key={row.id} title={row.agentAccount} subtitle={`${row.cycle} · ${row.teamName}`} status={row.commissionState} values={[{ label: '冲正后净输赢', value: money(row.correctedNet, true), tone: valueTone(row.correctedNet) }, { label: '本期佣金', value: money(row.commission), tone: 'is-accent' }, { label: '下级会员', value: row.subAgentCount }]} onDetail={() => setSelected(row)}><ReadOnlySettlementActions />{row.memberRows.length > 0 && <button className="h5-agent-inline-action h5-agent-expand-members" onClick={() => setExpanded((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])}>{expanded.includes(row.id) ? <MinusOutlined /> : <PlusOutlined />}{expanded.includes(row.id) ? '收起团队成员' : `展开 ${row.memberRows.length} 名团队成员`}</button>}</ReportCard>]
      if (expanded.includes(row.id)) cards.push(...row.memberRows.map((member) => <ReportCard key={member.id} className="is-member" title={member.agentAccount} subtitle={`${member.agentAccount === row.agentAccount ? '团队负责人' : '副线'} · ${member.agentId}`} status={member.commissionState} values={[{ label: '冲正后净输赢', value: money(member.correctedNet, true), tone: valueTone(member.correctedNet) }, { label: '佣金', value: money(member.commission) }, { label: '下级会员', value: member.subAgentCount }, { label: '代理身份', value: member.agentIdentity }]} onDetail={() => setSelected(member)} />))
      return cards
    }) : <EmptyState text={role === 'secondary' ? '副线不独立承接平台账单' : '暂无负盈利结算记录'} />}</div>}
    <Pager total={rows.length} page={safePage} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(size) => { setPageSize(size); setPage(1) }} />
    <section className="h5-agent-panel">
      <div className="h5-agent-section-heading"><div><h2>负盈利代理佣金结算口径</h2></div></div>
      <dl className="h5-agent-detail-grid h5-agent-detail-list">
        <div className="is-wide"><dt>净输赢</dt><dd>总输赢 - 场馆费 - 红利 - 返水 + 账户调整 - 存款手续费 - 提款手续费 + 补单输赢</dd></div>
        <div className="is-wide"><dt>冲正后净输赢</dt><dd>净输赢 + 上周期结余</dd></div>
        <div className="is-wide"><dt>佣金</dt><dd>MAX(0，冲正后净输赢 × 佣金比例 + 佣金调整)</dd></div>
      </dl>
      <p className="h5-agent-dashboard-alert">报表展示负盈利模式代理及冲正后净输赢为负的账单记录；刷新演示数据后恢复初始模拟数据。</p>
    </section>
    <Sheet open={filterOpen} title="筛选条件" description="筛选仅影响当前身份授权数据" onClose={() => setFilterOpen(false)} footer={<><button className="secondary" onClick={reset}><ReloadOutlined />重置</button><button className="primary" onClick={() => { setFilterOpen(false); notify(onToast, `已查询 ${rows.length} 条负盈利代理记录`) }}><SearchOutlined />查询</button></>}>
      <div className="h5-agent-filter-fields">
        <label><span>佣金周期</span><select value={filters.cycle} onChange={(event) => setFilter('cycle', event.target.value)}><option value="">全部周期</option>{unique(allRows, 'cycle').map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>代理身份</span><select value={filters.identity} onChange={(event) => setFilter('identity', event.target.value)}><option value="">全部身份</option>{unique(allRows, 'agentIdentity').map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>佣金状态</span><select value={filters.status} onChange={(event) => setFilter('status', event.target.value)}><option value="">全部状态</option>{unique(allRows, 'commissionState').map((item) => <option key={item}>{item}</option>)}</select></label>
        <label><span>字段筛选（已选 {visibleKeys.length}/{NEGATIVE_FIELDS.length}）</span><div>{NEGATIVE_FIELDS.map((field) => <label key={field.key}><input type="checkbox" checked={visibleKeys.includes(field.key)} onChange={() => toggleField(field.key)} />{field.label}</label>)}</div></label>
      </div>
    </Sheet>
    <DetailSheet row={selected} title="负盈利结算详情" fields={[...NEGATIVE_FIELDS, readOnlyAction]} onClose={() => setSelected(null)} onToast={onToast} />
  </section>
}

const REVERSAL_STAT_FIELDS = ['代理账号', 'ID', '代理等级', '垫付冲正代理总人数', '垫付余额(¥)', '垫付级差佣金(¥)', '垫付会员盈利(¥)', '垫付直属佣金(¥)', '垫付总计(¥)', '回款总计(¥)', '垫付剩余金额(¥)', '欠款人数', '欠款总计(¥)'].map((label, index) => ({ key: `col-${index}`, label }))

export function H5ReversalStatsPage({ role = 'multiLevel', onToast }) {
  const [keyword, setKeyword] = useState('')
  const [period, setPeriod] = useState('2026-07-21')
  const [filterOpen, setFilterOpen] = useState(false)
  if (role !== 'multiLevel') return <section className="h5-agent-page"><EmptyState text="当前身份无冲正统计权限" /></section>
  const metrics = [{ label: '垫付冲正代理总人数', value: '0' }, { label: '总欠款人数', value: '0' }, { label: '垫付总计', value: '¥0.00' }, { label: '回款总计', value: '¥0.00', tone: 'is-positive' }, { label: '垫付剩余金额', value: '¥0.00', tone: 'is-negative' }, { label: '欠款总计', value: '¥0.00' }]
  return <section className="h5-agent-page">
    <div className="h5-agent-metric-strip">{metrics.map((item) => <div key={item.label}><span>{item.label}</span><b className={item.tone || ''}>{item.value}</b></div>)}</div>
    <SearchBar value={keyword} placeholder="搜索代理账号/ID..." onChange={setKeyword} onFilter={() => setFilterOpen(true)} />
    <div className="h5-agent-result-meta"><span>当前筛选 0 条</span><div><button onClick={() => { setKeyword(''); setPeriod('2026-07-21'); notify(onToast, '筛选条件已重置') }}>重置</button></div></div>
    <AuditTable rows={[]} columns={REVERSAL_STAT_FIELDS} />
    <Pager total={0} page={1} pageSize={20} onPageChange={() => {}} onPageSizeChange={() => {}} />
    <Sheet open={filterOpen} title="筛选条件" onClose={() => setFilterOpen(false)} footer={<><button className="secondary" onClick={() => { setKeyword(''); setPeriod('2026-07-21'); notify(onToast, '筛选条件已重置') }}>重置</button><button className="primary" onClick={() => { setFilterOpen(false); notify(onToast, '冲正统计已查询') }}>查询</button></>}><div className="h5-agent-filter-fields"><label><span>统计周期</span><input type="date" value={period} onChange={(event) => setPeriod(event.target.value)} /></label><label><span>搜索代理</span><input value={keyword} placeholder="搜索代理账号/ID..." onChange={(event) => setKeyword(event.target.value)} /></label></div></Sheet>
  </section>
}

const REPAYMENT_FIELDS = [{ key: 'site', label: '所属站点' }, { key: 'name', label: '名称' }, { key: 'id', label: 'ID' }, { key: 'level', label: '代理等级' }, { key: 'type', label: '类型' }, { key: 'direction', label: '垫付/回款', render: (value) => <StatusPill>{value}</StatusPill> }, { key: 'amount', label: '额度', render: (value) => money(value) }, { key: 'gap', label: '额度缺口', render: (value) => <b className={valueTone(-value)}>{money(value)}</b> }, { key: 'ledger', label: '充正账目ID' }, { key: 'time', label: '时间' }]

export function H5ReversalRepaymentPage({ role = 'multiLevel', onToast }) {
  const rows = REVERSAL_REPAYMENT_ROWS
  const [filters, setFilters] = useState({ keyword: '', type: '', direction: '' })
  if (role !== 'multiLevel') return <section className="h5-agent-page"><EmptyState text="当前身份无冲正回款权限" /></section>
  const predicate = (row, value) => (!value.keyword || `${row.name}${row.id}${row.ledger}`.toLowerCase().includes(value.keyword.toLowerCase())) && (!value.type || row.type === value.type) && (!value.direction || row.direction === value.direction)
  return <RecordPage title="冲正回款报表" rows={rows} filters={filters} setFilters={setFilters} predicate={predicate} onToast={onToast} searchKey="keyword" searchPlaceholder="搜索代理名称/ID..." exportAction exportLabel="导出明细数据" downloadAction filterFields={[{ key: 'date', label: '查询时间', type: 'date', value: '2026-07-20' }, { key: 'site', label: '所属站点', value: '2222', disabled: true }, { key: 'type', label: '类型', type: 'select', options: unique(rows, 'type') }, { key: 'direction', label: '垫付/回款', type: 'select', options: ['垫付', '回款'] }]} detailFields={REPAYMENT_FIELDS} card={(row, open) => <ReportCard key={`${row.ledger}-${row.amount}-${row.direction}`} title={row.name} subtitle={`${row.type} · ${row.time}`} status={row.direction} values={[{ label: '额度', value: money(row.amount), tone: row.direction === '回款' ? 'is-positive' : 'is-negative' }, { label: '额度缺口', value: money(row.gap) }, { label: '代理等级', value: row.level }, { label: '充正账目ID', value: row.ledger }]} onDetail={open} />} />
}

const VENUE_FIELDS = [{ key: 'period', label: '时间' }, { key: 'site', label: '站点' }, { key: 'parent', label: '上级代理' }, { key: 'agent', label: '代理名称' }, { key: 'level', label: '代理级别' }, { key: 'rebate', label: '代理返佣' }, { key: 'venues', label: '场馆数量' }, { key: 'directFee', label: '直属承担三方场馆费用', render: (value) => money(value) }, { key: 'levelFee', label: '级差三方场馆费用', render: (value) => money(value) }, { key: 'total', label: '总承担费用', render: (value) => <b>{money(value)}</b> }]

export function H5VenueFeesPage({ role = 'main', onToast }) {
  const rows = rowsForAgentRole(VENUE_FEE_ROWS, role)
  const [filters, setFilters] = useState({ keyword: '' })
  const predicate = (row, value) => !value.keyword || row.agent.toLowerCase().includes(value.keyword.toLowerCase())
  const totalValues = (filtered) => {
    const sum = (key) => filtered.reduce((result, row) => result + Number(row[key] || 0), 0)
    return { site: '—', parent: '—', agent: '—', level: '—', rebate: '—', venues: sum('venues'), directFee: money(sum('directFee')), levelFee: money(sum('levelFee')), total: money(sum('total')) }
  }
  const currentTotals = totalValues(rows.filter((row) => predicate(row, filters)))
  const metrics = <div className="h5-agent-metric-strip"><div><span>场馆数量总计</span><b>{currentTotals.venues}</b></div><div><span>直属费用总计</span><b>{currentTotals.directFee}</b></div><div><span>级差费用总计</span><b>{currentTotals.levelFee}</b></div><div><span>总承担费用</span><b className="is-positive">{currentTotals.total}</b></div></div>
  return <RecordPage title="三方场馆代理费用明细" rows={rows} filters={filters} setFilters={setFilters} predicate={predicate} onToast={onToast} searchPlaceholder="搜索代理名称..." exportAction exportLabel="导出报表" downloadAction metrics={metrics} filterFields={[{ key: 'site', label: '站点', value: '2222', disabled: true }, { key: 'date', label: '时间筛选', type: 'date', value: '2026-07-19' }]} detailFields={VENUE_FIELDS} card={(row, open) => <ReportCard key={row.id} title={row.agent} subtitle={`${row.period} · ${row.site}`} status={row.level} values={[{ label: '总承担费用', value: money(row.total), tone: 'is-accent' }, { label: '直属费用', value: money(row.directFee) }, { label: '级差费用', value: money(row.levelFee) }, { label: '代理返佣', value: row.rebate }]} onDetail={open} />} />
}
