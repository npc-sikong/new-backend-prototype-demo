import {
  CheckCircleFilled,
  CloseOutlined,
  FileTextOutlined,
  FilterOutlined,
  LeftOutlined,
  RightOutlined,
  SearchOutlined,
} from '@ant-design/icons'

export function H5AgentPageIntro({ title, summary, updatedAt, onOpenNotes }) {
  return <section className="h5-agent-page-intro">
    <div><h1>{title}</h1><p>{summary}</p><small>修改时间：{updatedAt}</small></div>
    <button type="button" onClick={onOpenNotes}><FileTextOutlined /><span>业务说明</span></button>
  </section>
}

export function H5AgentSegments({ items, active, onChange, ariaLabel = '页面切换' }) {
  if (items.length < 2) return null
  return <div className="h5-agent-segments" aria-label={ariaLabel}>
    {items.map((item) => <button type="button" key={item.value} className={active === item.value ? 'active' : ''} onClick={() => onChange(item.value)}>{item.label}</button>)}
  </div>
}

export function H5AgentSearch({ value, onChange, onFilter, placeholder = '搜索账号、名称或编号' }) {
  return <div className="h5-agent-search-row">
    <label className="h5-agent-search"><SearchOutlined /><input value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>
    <button type="button" className="h5-agent-filter-button" onClick={onFilter}><FilterOutlined /><span>筛选</span></button>
  </div>
}

export function H5AgentStatus({ children, tone }) {
  const value = String(children ?? '—')
  const autoTone = tone || (/正常|成功|启用|完成|生效|已审核/.test(value) ? 'success' : /失败|禁用|停用|退回|异常/.test(value) ? 'danger' : /待|处理|审核|复核/.test(value) ? 'warning' : 'blue')
  return <span className={`h5-agent-status ${autoTone}`}>{value}</span>
}

export function H5AgentMoney({ value, currency = '¥', signed = false }) {
  const amount = Number(value || 0)
  const prefix = amount < 0 ? '-' : signed && amount > 0 ? '+' : ''
  const tone = amount > 0 ? 'positive' : amount < 0 ? 'negative' : 'neutral'
  return <strong className={`h5-agent-money ${tone}`}>{prefix}{currency}{Math.abs(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
}

export function H5AgentFields({ items, columns = 1 }) {
  return <dl className={`h5-agent-fields columns-${columns}`}>
    {items.map((item) => <div key={item.label}><dt>{item.label}</dt><dd className={item.tone ? `tone-${item.tone}` : ''}>{item.value ?? '—'}</dd></div>)}
  </dl>
}

export function H5AgentEmpty({ title = '暂无数据', description = '当前身份或筛选条件下没有匹配记录。', action }) {
  return <div className="h5-agent-empty"><CheckCircleFilled /><strong>{title}</strong><p>{description}</p>{action}</div>
}

export function H5AgentPagination({ total, page, pageSize, onPageChange, onPageSizeChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  return <div className="h5-agent-pagination">
    <span>共 {total} 条</span>
    <select aria-label="每页条数" value={pageSize} onChange={(event) => onPageSizeChange(Number(event.target.value))}>
      {[20, 50, 100, 200].map((size) => <option value={size} key={size}>{size}条/页</option>)}
    </select>
    <button type="button" aria-label="上一页" disabled={page <= 1} onClick={() => onPageChange(page - 1)}><LeftOutlined /></button>
    <b>{page}/{pages}</b>
    <button type="button" aria-label="下一页" disabled={page >= pages} onClick={() => onPageChange(page + 1)}><RightOutlined /></button>
  </div>
}

export function H5AgentSheet({ open, title, description, onClose, children, footer, className = '' }) {
  if (!open) return null
  return <div className="h5-agent-sheet-backdrop" onClick={onClose}>
    <section className={`h5-agent-sheet ${className}`} role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
      <header><div><h2>{title}</h2>{description && <p>{description}</p>}</div><button type="button" aria-label="关闭" onClick={onClose}><CloseOutlined /></button></header>
      <div className="h5-agent-sheet-content">{children}</div>
      {footer && <footer>{footer}</footer>}
    </section>
  </div>
}

export function H5AgentFilterSheet({ open, title = '筛选条件', onClose, onReset, onApply, children }) {
  return <H5AgentSheet open={open} title={title} description="设置条件后仅筛选当前身份可见数据。" onClose={onClose} className="h5-agent-filter-sheet" footer={<><button type="button" className="secondary" onClick={onReset}>重置</button><button type="button" className="primary" onClick={onApply}>查询</button></>}>
    <div className="h5-agent-filter-fields">{children}</div>
  </H5AgentSheet>
}

export function H5AgentDetailSheet({ open, title = '详情', description, onClose, children }) {
  return <H5AgentSheet open={open} title={title} description={description} onClose={onClose} className="h5-agent-detail-sheet">{children}</H5AgentSheet>
}

export function H5AgentNotesSheet({ note, open, onClose }) {
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
  return <H5AgentSheet open={open} title="业务及需求说明" description={`${note.title} · 更新于 ${note.updatedAt}`} onClose={onClose} className="h5-agent-notes-sheet">
    <div className="h5-agent-note-list">{sections.map(([label, value]) => <section key={label}><h3>{label}</h3><p>{value}</p></section>)}</div>
  </H5AgentSheet>
}

export function H5AgentFormField({ label, children, required, hint }) {
  return <label className="h5-agent-form-field"><span>{required && <i>*</i>}{label}</span>{children}{hint && <small>{hint}</small>}</label>
}
