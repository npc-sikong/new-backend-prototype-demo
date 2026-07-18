import { useEffect, useState } from 'react'
import {
  CloseOutlined,
  DownloadOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  ReloadOutlined,
  SearchOutlined,
} from '@ant-design/icons'

export function Button({ children, icon, variant = 'primary', size = 'default', onClick, disabled = false, type = 'button', className = '' }) {
  return <button type={type} className={`ta-btn ta-btn-${variant} ta-btn-${size} ${className}`} onClick={onClick} disabled={disabled}>{icon}{children}</button>
}

export function Input({ value, onChange, placeholder, type = 'text', min, max, step, disabled = false, className = '' }) {
  return <input className={`ta-input ${className}`} type={type} value={value ?? ''} placeholder={placeholder} min={min} max={max} step={step} disabled={disabled} onChange={(event) => onChange?.(event.target.value)} />
}

export function Select({ value, onChange, options, placeholder, disabled = false, className = '' }) {
  return <select className={`ta-select ${className}`} value={value ?? ''} disabled={disabled} onChange={(event) => onChange?.(event.target.value)}>
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((option) => {
      const normalized = typeof option === 'string' ? { value: option, label: option } : option
      return <option key={normalized.value} value={normalized.value}>{normalized.label}</option>
    })}
  </select>
}

export function Field({ label, children, help, required = false, className = '' }) {
  return <label className={`ta-field ${className}`}><span>{label}{required && <b>*</b>}</span>{children}{help && <small>{help}</small>}</label>
}

export function FilterBar({ children, onSearch, onReset, onExport }) {
  return <div className="ta-filter-bar"><div className="ta-filter-fields">{children}</div><div className="ta-filter-actions">
    <Button icon={<SearchOutlined />} onClick={onSearch}>查询</Button>
    <Button icon={<ReloadOutlined />} variant="ghost" onClick={onReset}>重置</Button>
    {onExport && <Button icon={<DownloadOutlined />} variant="slate" onClick={onExport}>导出</Button>}
  </div></div>
}

export function PageSummary({ note, onOpenNotes }) {
  if (!note) return null
  return <div className="ta-page-summary"><div><span><FileTextOutlined />业务及需求说明</span><strong>{note.title}</strong><small>修改时间：{note.updatedAt}</small></div><button onClick={onOpenNotes}>查看完整说明</button></div>
}

const COMPARISON_GROUPS = [
  ['fields', '新增字段'],
  ['types', '新增类型'],
  ['filters', '新增筛选项'],
  ['views', '新增页签或弹窗'],
  ['actions', '新增操作功能'],
  ['rules', '新增业务规则'],
]

function ComparisonSection({ comparison }) {
  if (!comparison) return null
  const groups = COMPARISON_GROUPS.filter(([key]) => comparison.additions?.[key]?.length)
  return <section className="feature-notes-comparison">
    <h3>相对原后台的新增 / 修改</h3>
    <div className="feature-notes-comparison-meta">
      <p><b>模块标识：</b>（{comparison.mark}）</p>
      <p><b>对照基线：</b>{comparison.baseline}</p>
    </div>
    <div className="feature-notes-legacy"><b>原后台已有：</b><p>{comparison.legacy}</p></div>
    <div className="feature-notes-additions"><b>本原型新增 / 修改：</b>{groups.map(([key, label]) => <div key={key}><strong>{label}</strong><ul>{comparison.additions[key].map((item) => <li key={item}>{item}</li>)}</ul></div>)}</div>
  </section>
}

export function NotesDrawer({ note, onClose }) {
  if (!note) return null
  const sections = [
    ['页面功能说明', note.summary],
    ['字段说明', note.fields],
    ['业务逻辑说明', note.logic],
    ['关联模块', note.related],
    ['业务及需求说明', note.requirement],
    ['功能验收说明', note.acceptance],
    ['演示边界', note.boundary],
    ['修改记录', note.record],
  ]
  return <div className="feature-notes-backdrop" onClick={onClose}><aside className="feature-notes" role="dialog" aria-modal="true" aria-label="业务及需求说明" onClick={(event) => event.stopPropagation()}>
    <div className="feature-notes-head"><div><span>{note.title}</span><small>更新于 {note.updatedAt}</small></div><button aria-label="关闭业务及需求说明" onClick={onClose}><CloseOutlined /></button></div>
    <div className="feature-notes-body"><ComparisonSection comparison={note.comparison} />{sections.map(([title, content]) => <section key={title}><h3>{title}</h3><p>{content}</p></section>)}</div>
  </aside></div>
}

export function StatusTag({ children, tone }) {
  const value = String(children ?? '')
  const autoTone = tone || (/生效|启用|成功|通过|已发放|无冲突/.test(value) ? 'green' : /待|处理|部分|冻结/.test(value) ? 'orange' : /退回|阻止|失败|解散|停用|冲突/.test(value) ? 'red' : /团队|主线|独立/.test(value) ? 'blue' : 'gray')
  return <span className={`ta-tag ta-tag-${autoTone}`}>{value}</span>
}

export function Money({ value, signed = false, tone }) {
  const amount = Number(value || 0)
  const text = amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const autoTone = tone || (signed ? amount > 0 ? 'positive' : amount < 0 ? 'negative' : 'neutral' : 'neutral')
  return <span className={`ta-money ta-money-${autoTone}`}>¥{text}</span>
}

export function Percent({ value }) {
  return <span>{(Number(value || 0) * 100).toFixed(2)}%</span>
}

const DEFAULT_PAGE_SIZE = 20
const PAGE_SIZE_OPTIONS = [20, 50, 100, 200]
const MAX_PAGE_SIZE = Math.max(...PAGE_SIZE_OPTIONS)

function normalizePageSize(value) {
  const numeric = Number(value || DEFAULT_PAGE_SIZE)
  if (!Number.isFinite(numeric)) return DEFAULT_PAGE_SIZE
  return Math.min(Math.max(1, numeric), MAX_PAGE_SIZE)
}

export function DataTable({ columns, rows, rowKey = 'id', rowClassName, minWidth, emptyText = '暂无数据', className = '', paginated = false, footer }) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(page, pageCount)
  const visibleRows = paginated ? rows.slice((safePage - 1) * pageSize, safePage * pageSize) : rows

  useEffect(() => setPage(1), [rows.length, pageSize])

  return <>
    <div className={`ta-table-wrap ${className}`}><table className="ta-table" style={{ minWidth }}><thead><tr>{columns.map((column) => <th key={column.key} className={column.className}>{column.label}</th>)}</tr></thead><tbody>
      {visibleRows.length ? visibleRows.map((row, index) => <tr className={rowClassName?.(row, index)} key={typeof rowKey === 'function' ? rowKey(row, index) : row[rowKey] ?? index}>{columns.map((column) => <td key={column.key} className={column.cellClassName}>{column.render ? column.render(row[column.key], row, index) : row[column.key] ?? '—'}</td>)}</tr>) : <tr><td className="ta-empty-cell" colSpan={columns.length}>{emptyText}</td></tr>}
    </tbody>{footer && <tfoot>{footer}</tfoot>}</table></div>
    {paginated && <Pagination total={rows.length} page={safePage} pageSize={pageSize} onChange={setPage} onPageSizeChange={(value) => setPageSize(normalizePageSize(value))} />}
  </>
}

export function Pagination({ total, page = 1, pageSize = DEFAULT_PAGE_SIZE, onChange, onPageSizeChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  const sizeOptions = PAGE_SIZE_OPTIONS.map((value) => ({ value: String(value), label: `${value}条/页` }))
  return <div className="ta-pagination"><span>共 {total} 条</span><Select value={String(pageSize)} onChange={onPageSizeChange} options={sizeOptions} /><button disabled={page <= 1} onClick={() => onChange?.(page - 1)}>上一页</button><b>{page}</b><span>/ {pages}</span><button disabled={page >= pages} onClick={() => onChange?.(page + 1)}>下一页</button></div>
}

export function ColumnSettings({ columns, visibleKeys, onChange, fixedKeys = [], title = '列信息' }) {
  const [open, setOpen] = useState(false)
  function toggle(key) {
    if (fixedKeys.includes(key)) return
    const next = visibleKeys.includes(key) ? visibleKeys.filter((item) => item !== key) : [...visibleKeys, key]
    if (next.length >= fixedKeys.length + 2) onChange(next)
  }
  return <>
    <Button variant="ghost" onClick={() => setOpen(true)}>{title}</Button>
    <Modal open={open} title="选择列表字段" description="只调整当前页面展示列，不改变账单或记录数据。" onClose={() => setOpen(false)} onConfirm={() => setOpen(false)} confirmText="完成" showCancel={false} width={680}>
      <div className="ta-column-options">{columns.map((column) => <label key={column.key} className={fixedKeys.includes(column.key) ? 'is-fixed' : ''}><input type="checkbox" checked={visibleKeys.includes(column.key)} disabled={fixedKeys.includes(column.key)} onChange={() => toggle(column.key)} /><span>{column.label}</span></label>)}</div>
    </Modal>
  </>
}

export function SectionHeader({ title, description, actions }) {
  return <div className="ta-section-header"><div><h1>{title}</h1>{description && <p>{description}</p>}</div>{actions && <div className="ta-section-actions">{actions}</div>}</div>
}

export function MetricGrid({ children, columns = 4, className = '' }) {
  return <div className={`ta-metric-grid ${className}`} style={{ '--metric-columns': columns }}>{children}</div>
}

export function MetricCard({ label, value, helper, tone = 'default', icon, onClick }) {
  const Tag = onClick ? 'button' : 'article'
  return <Tag className={`ta-metric-card ta-metric-${tone} ${onClick ? 'is-clickable' : ''}`} onClick={onClick}><div className="ta-metric-label"><span>{label}</span>{icon && <i>{icon}</i>}</div><strong>{value}</strong>{helper && <small>{helper}</small>}</Tag>
}

export function Panel({ title, description, actions, children, className = '' }) {
  return <section className={`ta-panel ${className}`}><header><div><h2>{title}</h2>{description && <p>{description}</p>}</div>{actions && <div className="ta-panel-actions">{actions}</div>}</header><div className="ta-panel-body">{children}</div></section>
}

export function FormulaPanel({ title = '业务计算公式', items, warning }) {
  return <div className="ta-formula-panel"><div className="ta-formula-title"><InfoCircleOutlined /><strong>{title}</strong></div>{items.map((item) => <div key={item.label} className="ta-formula-row"><span>{item.label}</span><code>{item.formula}</code>{item.value && <b>{item.value}</b>}</div>)}{warning && <p>{warning}</p>}</div>
}

export function Tabs({ items, active, onChange, className = '' }) {
  return <div className={`ta-tabs ${className}`} role="tablist">{items.map((item) => <button key={item.value} className={active === item.value ? 'active' : ''} onClick={() => onChange(item.value)}>{item.label}{item.count !== undefined && <span>{item.count}</span>}</button>)}</div>
}

export function DescriptionGrid({ items, columns = 3 }) {
  return <dl className="ta-description-grid" style={{ '--description-columns': columns }}>{items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value ?? '—'}</dd></div>)}</dl>
}

export function Alert({ title, children, tone = 'info', actions }) {
  return <div className={`ta-alert ta-alert-${tone}`}><InfoCircleOutlined /><div><strong>{title}</strong>{children && <p>{children}</p>}</div>{actions && <div>{actions}</div>}</div>
}

export function Modal({ open, title, description, children, onClose, onConfirm, confirmText = '保存', confirmDisabled = false, width = 560, showCancel = true }) {
  if (!open) return null
  return <div className="modal-backdrop" onClick={onClose}><div className="ta-modal" style={{ width }} role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
    <header><div><h2>{title}</h2>{description && <p>{description}</p>}</div><button aria-label="关闭" onClick={onClose}><CloseOutlined /></button></header>
    <div className="ta-modal-body">{children}</div>
    <footer>{showCancel && <Button variant="ghost" onClick={onClose}>取消</Button>}<Button onClick={onConfirm} disabled={confirmDisabled}>{confirmText}</Button></footer>
  </div></div>
}

export function FormGrid({ children, columns = 2 }) {
  return <div className="ta-form-grid" style={{ '--form-columns': columns }}>{children}</div>
}

export function EmptyState({ title, description, action }) {
  return <div className="ta-empty-state"><FileTextOutlined /><strong>{title}</strong><p>{description}</p>{action}</div>
}

export function Toolbar({ children }) {
  return <div className="ta-toolbar">{children}</div>
}
