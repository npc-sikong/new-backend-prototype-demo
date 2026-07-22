import { useEffect, useMemo, useState } from 'react'
import {
  CloseOutlined,
  EditOutlined,
  EyeOutlined,
  FilterOutlined,
  LockOutlined,
  PlusOutlined,
  RightOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { useTeamAgent } from '../team-agent/context'
import {
  AGENT_ROWS,
  BET_ROWS,
  MEMBER_ROWS,
  rowsForAgentRole,
} from '../team-agent/multi-level-agent-data'
import {
  buildTeamCommissionRows,
  formatGradeConditionValue,
  lineDirectMemberRows,
  teamGradeProgress,
  teamMemberRows,
  teamOverviewCounts,
} from '../team-agent/team-management-helpers'

const PAGE_SIZES = [20, 50, 100, 200]
const EMPTY_FN = () => {}
const ROLE_META = {
  main: { account: 'gaodashang', label: '团队负责人' },
  secondary: { account: 'WC002', label: '副线' },
  independent: { account: 'dailiwc001', label: '单线代理' },
  multiLevel: { account: 'gaodashang', label: '多层级代理' },
}
const ROLE_ACCOUNTS = {
  main: ['gaodashang', 'WC002', 'LGNB'],
  secondary: ['WC002'],
  independent: ['dailiwc001'],
}

const money = (value) => `¥${Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const plain = (value) => value === undefined || value === null || value === '' ? '—' : String(value)
const dateOnly = (value) => String(value || '').slice(0, 10)
const contains = (value, keyword) => !keyword || String(value || '').toLowerCase().includes(String(keyword).trim().toLowerCase())
const unique = (rows, key) => [...new Set(rows.map((row) => row[key]).filter(Boolean))]

const roleAccounts = (role) => ROLE_ACCOUNTS[role] || ROLE_ACCOUNTS.main

function usePaging(rows) {
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const pages = Math.max(1, Math.ceil(rows.length / pageSize))
  const safePage = Math.min(page, pages)
  useEffect(() => setPage(1), [rows.length, pageSize])
  return {
    page: safePage,
    pageSize,
    pages,
    setPage,
    setPageSize,
    visibleRows: rows.slice((safePage - 1) * pageSize, safePage * pageSize),
  }
}

function H5Pager({ total, paging }) {
  return <div className="h5-agent-pagination">
    <span>共 {total} 条</span>
    <select value={paging.pageSize} onChange={(event) => paging.setPageSize(Number(event.target.value))}>
      {PAGE_SIZES.map((size) => <option key={size} value={size}>{size}条/页</option>)}
    </select>
    <div>
      <button disabled={paging.page <= 1} onClick={() => paging.setPage(paging.page - 1)}>上一页</button>
      <b>{paging.page}/{paging.pages}</b>
      <button disabled={paging.page >= paging.pages} onClick={() => paging.setPage(paging.page + 1)}>下一页</button>
    </div>
  </div>
}

function H5Sheet({ open, title, subtitle, onClose, children, footer, className = '' }) {
  if (!open) return null
  return <div className="h5-agent-sheet-mask" role="presentation" onClick={onClose}>
    <section className={`h5-agent-sheet ${className}`} role="dialog" aria-modal="true" aria-label={title} onClick={(event) => event.stopPropagation()}>
      <div className="h5-agent-sheet-handle" />
      <header className="h5-agent-sheet-header">
        <div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
        <button className="h5-agent-icon-button" aria-label="关闭" onClick={onClose}><CloseOutlined /></button>
      </header>
      <div className="h5-agent-sheet-body">{children}</div>
      {footer && <footer className="h5-agent-sheet-footer">{footer}</footer>}
    </section>
  </div>
}

function FilterSheet({ open, title = '筛选条件', onClose, onReset, children, resultCount }) {
  return <H5Sheet
    open={open}
    title={title}
    subtitle={`当前匹配 ${resultCount} 条记录`}
    onClose={onClose}
    className="h5-agent-filter-sheet"
    footer={<><button className="h5-agent-button h5-agent-button-ghost" onClick={onReset}>重置</button><button className="h5-agent-button h5-agent-button-primary" onClick={onClose}>查看结果</button></>}
  >
    <div className="h5-agent-filter-fields">{children}</div>
  </H5Sheet>
}

function Field({ label, children }) {
  return <label className="h5-agent-field"><span>{label}</span>{children}</label>
}

function SearchBar({ value, onChange, placeholder, onFilter, filterCount = 0, actions }) {
  return <div className="h5-agent-list-toolbar">
    <label className="h5-agent-search"><SearchOutlined /><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} /></label>
    <button className={`h5-agent-filter-button ${filterCount ? 'is-active' : ''}`} onClick={onFilter}><FilterOutlined />{filterCount > 0 && <i>{filterCount}</i>}</button>
    {actions}
  </div>
}

function DetailGrid({ items }) {
  return <dl className="h5-agent-detail-grid">{items.map((item) => <div key={item.label} className={item.wide ? 'is-wide' : ''}><dt>{item.label}</dt><dd className={item.tone ? `is-${item.tone}` : ''}>{plain(item.value)}</dd></div>)}</dl>
}

function StatusPill({ children, tone = '' }) {
  const text = plain(children)
  const inferred = tone || (/(正常|启用|成功|生效|已结算|已入账)/.test(text) ? 'positive' : /(失败|停用|禁用|冻结|拒绝)/.test(text) ? 'negative' : 'neutral')
  return <span className={`h5-agent-status is-${inferred}`}>{text}</span>
}

function EmptyState({ text = '暂无数据' }) {
  return <div className="h5-agent-empty"><i><EyeOutlined /></i><b>{text}</b><span>请调整筛选条件后重试</span></div>
}

function RowsSheet({ config, onClose }) {
  const rows = config?.rows || []
  const paging = usePaging(rows)
  return <H5Sheet open={Boolean(config)} title={config?.title || '明细'} subtitle={config?.subtitle} onClose={onClose} className="h5-agent-rows-sheet">
    <div className="h5-agent-compact-list">
      {paging.visibleRows.map((row, index) => <article key={row.id || index} className="h5-agent-compact-card">
        {(config?.fields || []).map((field) => <div key={field.key}><span>{field.label}</span><b>{field.render ? field.render(row[field.key], row) : plain(row[field.key])}</b></div>)}
      </article>)}
      {!rows.length && <EmptyState />}
    </div>
    <H5Pager total={rows.length} paging={paging} />
  </H5Sheet>
}

function agentTypeDisplay(row) {
  if (['多层级代理', '星级代理', '团队代理', '单线代理'].includes(row.agentType)) return row.agentType
  if (row.settlementMode === '单线代理') return '单线代理'
  if (row.settlementMode === '团队模式') return '团队代理'
  if (row.agentType === '官方代理') return '星级代理'
  return '多层级代理'
}

function agentIdentityDisplay(row) {
  return ['官方代理', '普通代理'].includes(row.teamAgentType) ? row.teamAgentType : '普通代理'
}

function agentLevelDisplay(row) {
  const type = agentTypeDisplay(row)
  if (type === '团队代理') return row.identity || '副线'
  if (type === '单线代理') return '单线代理'
  if (type === '星级代理') return '-'
  return row.level || `${Math.max(1, Math.min(10, Number(row.subAgents || 0) + 1))}层代理`
}

const agentRateDisplay = (row) => agentTypeDisplay(row) === '星级代理' ? '30.00%' : '--'

export function H5AgentListPage({ role = 'main', onToast = EMPTY_FN }) {
  const { data } = useTeamAgent()
  const isMultiLevel = role === 'multiLevel'
  const [multiRows, setMultiRows] = useState(AGENT_ROWS)
  const [keyword, setKeyword] = useState('')
  const emptyFilters = isMultiLevel ? { id: '', status: '' } : { id: '', agentType: '', status: '', google: '', registeredFrom: '' }
  const [filters, setFilters] = useState(emptyFilters)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [editor, setEditor] = useState(null)
  const [form, setForm] = useState({ account: '', type: '多层级代理', level: '1层代理', status: '正常', plan: '层级代理方案A', password: '' })
  const sourceRows = useMemo(() => {
    if (isMultiLevel) return multiRows
    return data.agents.filter((row) => roleAccounts(role).includes(row.account))
  }, [data, role, isMultiLevel, multiRows])
  const rows = useMemo(() => sourceRows.filter((row) => contains(row.account, keyword)
    && (!filters.id || contains(row.id, filters.id))
    && (isMultiLevel || !filters.agentType || agentTypeDisplay(row) === filters.agentType)
    && (!filters.status || row.status === filters.status)
    && (isMultiLevel || !filters.google || filters.google === '未绑定')
    && (isMultiLevel || !filters.registeredFrom || dateOnly(row.registeredAt) >= filters.registeredFrom)), [sourceRows, keyword, filters, isMultiLevel])
  const paging = usePaging(rows)
  const activeFilters = Object.values(filters).filter(Boolean).length

  const openEditor = (kind, row) => {
    setEditor({ kind, row })
    setForm(kind === 'create' ? { account: '', type: '多层级代理', level: '1层代理', status: '正常', plan: '层级代理方案A', password: '' } : { ...row, password: '' })
  }
  const saveEditor = () => {
    if (!form.account?.trim()) return onToast('请输入代理账号', 'error')
    if (editor.kind === 'create') {
      const nextId = Math.max(0, ...multiRows.map((row) => Number(row.id) || 0)) + 1
      setMultiRows((current) => [{ ...form, id: nextId, siteCode: '2222', childAgents: 0, childMembers: 0, lastLogin: '—' }, ...current])
    } else if (editor.kind === 'edit') {
      setMultiRows((current) => current.map((row) => row.id === editor.row.id ? { ...row, ...form } : row))
    }
    onToast(editor.kind === 'create' ? '代理已新增' : editor.kind === 'edit' ? '代理资料已修改' : '代理密码已更新')
    setEditor(null)
  }

  return <section className="h5-agent-page h5-agent-agent-list-page">
    <SearchBar value={keyword} onChange={setKeyword} placeholder="请输入代理账号" onFilter={() => setFilterOpen(true)} filterCount={activeFilters} actions={isMultiLevel && <button className="h5-agent-add-button" aria-label="新增代理" onClick={() => openEditor('create')}><PlusOutlined /></button>} />
    <div className="h5-agent-result-meta"><span>{ROLE_META[role].label}可见范围 · {rows.length} 条</span>{!isMultiLevel && <span><button onClick={() => onToast('代理列表已导出')}>导出</button><button onClick={() => onToast('下载文件为演示状态')}>下载文件</button></span>}</div>
    <div className="h5-agent-card-list">
      {paging.visibleRows.map((row) => <article key={row.id} className="h5-agent-list-card" onClick={() => setSelected(row)}>
        <header><div className="h5-agent-card-avatar"><UserOutlined /></div><div><b>{row.account}</b><span>ID {row.id} · {isMultiLevel ? row.level : agentLevelDisplay(row)}</span></div><RightOutlined /></header>
        <div className="h5-agent-card-badges"><StatusPill tone="brand">{isMultiLevel ? row.type : agentTypeDisplay(row)}</StatusPill><StatusPill>{row.status === '启用' ? '正常' : row.status}</StatusPill>{!isMultiLevel && <StatusPill tone="neutral">{agentIdentityDisplay(row)}</StatusPill>}</div>
        <div className="h5-agent-card-metrics"><div><span>下属代理</span><b>{isMultiLevel ? row.childAgents || 0 : row.subAgents || 0}</b></div><div><span>下属会员</span><b>{isMultiLevel ? row.childMembers || 0 : row.members || 0}</b></div><div><span>{isMultiLevel ? '站点编码' : '代理钱包余额'}</span><b>{isMultiLevel ? row.siteCode : money(row.balance)}</b></div></div>
        {isMultiLevel && <footer><button onClick={(event) => { event.stopPropagation(); openEditor('edit', row) }}><EditOutlined />修改</button><button onClick={(event) => { event.stopPropagation(); openEditor('password', row) }}><LockOutlined />修改密码</button></footer>}
      </article>)}
      {!rows.length && <EmptyState />}
    </div>
    <H5Pager total={rows.length} paging={paging} />

    <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} onReset={() => setFilters(emptyFilters)} resultCount={rows.length}>
      <Field label="代理ID"><input value={filters.id} onChange={(event) => setFilters({ ...filters, id: event.target.value })} placeholder="请输入代理ID" /></Field>
      {!isMultiLevel && <Field label="代理类型"><select value={filters.agentType} onChange={(event) => setFilters({ ...filters, agentType: event.target.value })}><option value="">全部类型</option>{['多层级代理', '星级代理', '团队代理', '单线代理'].map((value) => <option key={value}>{value}</option>)}</select></Field>}
      <Field label="代理状态"><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">全部状态</option>{unique(sourceRows, 'status').map((value) => <option key={value} value={value}>{value === '启用' ? '正常' : value}</option>)}</select></Field>
      {!isMultiLevel && <Field label="谷歌验证"><select value={filters.google} onChange={(event) => setFilters({ ...filters, google: event.target.value })}><option value="">全部状态</option><option>未绑定</option></select></Field>}
      {!isMultiLevel && <Field label="代理注册时间"><input type="date" value={filters.registeredFrom} onChange={(event) => setFilters({ ...filters, registeredFrom: event.target.value })} /></Field>}
    </FilterSheet>

    <H5Sheet open={Boolean(selected)} title="代理资料" subtitle={selected ? `${selected.account} / ${selected.id}` : ''} onClose={() => setSelected(null)}>
      {selected && <DetailGrid items={isMultiLevel ? [
        { label: '代理ID', value: selected.id }, { label: '代理账号', value: selected.account },
        { label: '代理模型', value: selected.type }, { label: '星级级别', value: selected.starLevel },
        { label: '层级级别', value: selected.level }, { label: '站点编码', value: selected.siteCode },
        { label: '代理状态', value: selected.status }, { label: '下属代理', value: selected.childAgents || 0 },
        { label: '下属会员', value: selected.childMembers || 0 }, { label: '佣金方案', value: selected.plan, wide: true },
        { label: '最后登录', value: selected.lastLogin, wide: true },
      ] : [
        { label: '代理ID', value: selected.id }, { label: '代理账号', value: selected.account },
        { label: '代理身份', value: agentIdentityDisplay(selected) }, { label: '代理注册时间', value: selected.registeredAt },
        { label: '代理类型', value: agentTypeDisplay(selected) }, { label: '代理层级', value: agentLevelDisplay(selected) },
        { label: '上级代理', value: selected.parent === '无上级代理' ? '-' : selected.parent }, { label: '代理状态', value: selected.status === '启用' ? '正常' : selected.status },
        { label: '下属代理', value: selected.subAgents || 0 }, { label: '下属会员', value: selected.members || 0 },
        { label: '佣金方案', value: selected.plan, wide: true }, { label: '代理返佣比例', value: agentRateDisplay(selected) },
        { label: '代理钱包余额', value: Number(selected.balance || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), tone: 'positive' },
        { label: '最后登录', value: selected.lastLogin || '-', wide: true },
      ]} />}
    </H5Sheet>

    <H5Sheet open={Boolean(editor)} title={editor?.kind === 'create' ? '新增多层级代理' : editor?.kind === 'edit' ? '修改代理' : '修改代理密码'} onClose={() => setEditor(null)} footer={<><button className="h5-agent-button h5-agent-button-ghost" onClick={() => setEditor(null)}>取消</button><button className="h5-agent-button h5-agent-button-primary" onClick={saveEditor}>保存</button></>}>
      {editor?.kind === 'password' ? <div className="h5-agent-form"><Field label="代理账号"><input value={form.account || ''} disabled /></Field><Field label="新密码"><input type="password" value={form.password || ''} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="至少输入6位" /></Field></div> : <div className="h5-agent-form">
        <Field label="代理账号"><input value={form.account || ''} onChange={(event) => setForm({ ...form, account: event.target.value })} /></Field>
        <Field label="代理模型"><input value="多层级代理" disabled /></Field>
        <Field label="层级级别"><select value={form.level || '1层代理'} onChange={(event) => setForm({ ...form, level: event.target.value })}>{Array.from({ length: 8 }, (_, index) => <option key={index + 1}>{index + 1}层代理</option>)}</select></Field>
        <Field label="代理状态"><select value={form.status || '正常'} onChange={(event) => setForm({ ...form, status: event.target.value })}><option>正常</option><option>停用</option></select></Field>
        <Field label="佣金方案"><select value={form.plan || '层级代理方案A'} onChange={(event) => setForm({ ...form, plan: event.target.value })}><option>层级代理方案A</option><option>层级代理方案B</option><option>未设置</option></select></Field>
      </div>}
    </H5Sheet>
  </section>
}

function scopedTeams(data, role) {
  if (role === 'multiLevel') return []
  const accounts = roleAccounts(role)
  return data.teams
    .filter((team) => team.lines.some((line) => accounts.includes(line.agent)))
    .map((team) => role === 'main' ? team : { ...team, lines: team.lines.filter((line) => accounts.includes(line.agent)) })
}

function teamOperations(data, team, role) {
  const account = ROLE_META[role]?.account
  return (data.teamOperations || [])
    .filter((row) => row.teamId === team.id)
    .filter((row) => row.mainAccount === account || String(row.secondaryAccounts || '').includes(account))
    .sort((left, right) => String(right.createdAt || '').localeCompare(String(left.createdAt || '')))
    .map((row) => {
      const mainAgent = data.agents.find((agent) => agent.account === row.mainAccount)
      return {
        ...row,
        mainId: row.mainId || mainAgent?.id || '—',
        agentIdentity: mainAgent?.teamAgentType === '官方代理' ? '官方代理' : '普通代理',
        secondaryAccounts: row.secondaryAccounts || '—',
      }
    })
}

export function H5TeamPage({ role = 'main', onToast = EMPTY_FN }) {
  const { data } = useTeamAgent()
  const [keyword, setKeyword] = useState('')
  const [filters, setFilters] = useState({ type: '', agent: '', createdFrom: '' })
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [detailTab, setDetailTab] = useState('overview')
  const [drill, setDrill] = useState(null)
  const [performanceFilters, setPerformanceFilters] = useState({ agent: '', identity: '', lineId: '', statFrom: '', statTo: '' })
  const [performanceFilterOpen, setPerformanceFilterOpen] = useState(false)
  const [operationFilters, setOperationFilters] = useState({ teamName: '', agentIdentity: '', agentId: '', agentAccount: '', createdFrom: '', createdTo: '' })
  const [operationFilterOpen, setOperationFilterOpen] = useState(false)
  const sourceRows = useMemo(() => scopedTeams(data, role), [data, role])
  const rows = useMemo(() => sourceRows.filter((team) => contains(`${team.name}${team.code}`, keyword)
    && (!filters.type || team.teamType === filters.type)
    && (!filters.agent || contains(`${team.mainAgent}${team.lines.map((line) => line.agent).join('')}`, filters.agent))
    && (!filters.createdFrom || dateOnly(team.createdAt) >= filters.createdFrom)), [sourceRows, keyword, filters])
  const paging = usePaging(rows)
  const openDetail = (team, tab = 'overview') => { setSelected(team); setDetailTab(tab) }
  const selectedCounts = selected ? teamOverviewCounts(selected, data) : null
  const selectedGrade = selected ? teamGradeProgress(selected, data) : null
  const performanceBase = selected ? buildTeamCommissionRows(selected).map((row, index) => ({ ...row, statDate: row.statDate || ['2026-07-17', '2026-07-16', '2026-07-15'][index % 3] })) : []
  const selectedPerformance = performanceBase.filter((row) => (!performanceFilters.agent || contains(row.agent, performanceFilters.agent))
    && (!performanceFilters.identity || row.identity === performanceFilters.identity)
    && (!performanceFilters.lineId || contains(row.lineId, performanceFilters.lineId))
    && (!performanceFilters.statFrom || row.statDate >= performanceFilters.statFrom)
    && (!performanceFilters.statTo || row.statDate <= performanceFilters.statTo))
  const performanceTotal = selectedPerformance.reduce((sum, row) => ({
    newActive: sum.newActive + Number(row.newActive || 0),
    firstDepositCount: sum.firstDepositCount + Number(row.firstDepositCount || 0),
    firstDepositAmount: sum.firstDepositAmount + Number(row.firstDepositAmount || 0),
    activeMembers: sum.activeMembers + Number(row.activeMembers || 0),
    totalWinLoss: sum.totalWinLoss + Number(row.totalWinLoss || 0),
    operationFee: sum.operationFee + Number(row.operationFee || 0),
    netRevenue: sum.netRevenue + Number(row.netRevenue || 0),
  }), { newActive: 0, firstDepositCount: 0, firstDepositAmount: 0, activeMembers: 0, totalWinLoss: 0, operationFee: 0, netRevenue: 0 })
  const operationBase = selected ? teamOperations(data, selected, role) : []
  const selectedOperations = operationBase.filter((row) => (!operationFilters.teamName || row.teamName === operationFilters.teamName)
    && (!operationFilters.agentIdentity || row.agentIdentity === operationFilters.agentIdentity)
    && (!operationFilters.agentId || contains(row.mainId, operationFilters.agentId))
    && (!operationFilters.agentAccount || contains(`${row.mainAccount}${row.secondaryAccounts}`, operationFilters.agentAccount))
    && (!operationFilters.createdFrom || dateOnly(row.createdAt) >= operationFilters.createdFrom)
    && (!operationFilters.createdTo || dateOnly(row.createdAt) <= operationFilters.createdTo))
    .map((row, index) => ({ ...row, index: index + 1 }))

  const openLineMembers = (team, line, metric) => {
    const metricLabel = metric === 'newActive' ? '新增活跃' : '活跃会员'
    setDrill({
      title: `${line.agent} · ${metricLabel}直属会员`,
      subtitle: '仅展示该代理本人直属会员，不展示其他副线或团队汇总会员。',
      rows: lineDirectMemberRows(line, data, metric),
      fields: [{ key: 'memberName', label: '会员名称' }, { key: 'upperAgent', label: '直属代理' }, { key: 'memberType', label: '会员口径' }, { key: 'depositAmount', label: '充值金额' }, { key: 'validBet', label: '有效投注' }],
    })
  }

  const openAgents = (team) => setDrill({
    title: `${team.name} · 团队成员明细`,
    subtitle: `共 ${team.lines.length} 名团队成员`,
    rows: team.lines,
    fields: [
      { key: 'identity', label: '身份', render: (value) => value === '主线' ? '团队负责人' : value },
      { key: 'lineId', label: 'line_id' }, { key: 'agent', label: '代理名称' },
      { key: 'activeMembers', label: '活跃会员', render: (value, line) => <button disabled={!Number(value)} onClick={() => openLineMembers(team, line, 'activeMembers')}>{Number(value || 0)}</button> },
      { key: 'newActive', label: '新增活跃', render: (value, line) => <button disabled={!Number(value)} onClick={() => openLineMembers(team, line, 'newActive')}>{Number(value || 0)}</button> },
      { key: 'firstDepositCount', label: '新增首存', render: (value) => Number(value || 0) },
      { key: 'firstDepositAmount', label: '首存额度', render: money }, { key: 'netWinLoss', label: '总盈亏', render: money },
      { key: 'startCycle', label: '生效周期' }, { key: 'status', label: '状态' },
    ],
  })
  const openMembers = (team) => setDrill({
    title: `${team.name} · 会员人数明细`,
    subtitle: '会员仅按当前可见代理线路生成',
    rows: teamMemberRows(team, data),
    fields: [{ key: 'memberName', label: '会员名称' }, { key: 'upperAgent', label: '上级代理' }],
  })

  if (role === 'multiLevel') return <section className="h5-agent-page"><EmptyState text="多层级代理不使用团队代理管理" /></section>
  return <section className="h5-agent-page h5-agent-team-page">
    <SearchBar value={keyword} onChange={setKeyword} placeholder="团队名称或编号" onFilter={() => setFilterOpen(true)} filterCount={Object.values(filters).filter(Boolean).length} />
    <div className="h5-agent-result-meta"><span>共 {rows.length} 个授权团队</span><button onClick={() => onToast('团队列表已导出')}>导出</button></div>
    <div className="h5-agent-card-list">
      {paging.visibleRows.map((team) => {
        const counts = teamOverviewCounts(team, data)
        return <article key={team.id} className="h5-agent-list-card h5-agent-team-card">
          <header onClick={() => openDetail(team)}><div className="h5-agent-card-avatar"><TeamOutlined /></div><div><b>{team.name}</b><span>{team.code} · {team.mainAgent}</span></div><StatusPill>{team.status}</StatusPill></header>
          <div className="h5-agent-team-summary"><div><span>代理类型</span><b>{team.teamAgentType || team.teamType}</b></div><div><span>当月结余</span><b className={Number(team.metrics?.correctedNet) >= 0 ? 'is-positive' : 'is-negative'}>{money(team.metrics?.correctedNet)}</b></div></div>
          <div className="h5-agent-card-metrics h5-agent-card-metrics-clickable"><button onClick={() => openAgents(team)}><span>团队成员</span><b>{counts.agentTotal}</b></button><button onClick={() => openMembers(team)}><span>会员人数</span><b>{counts.memberTotal}</b></button><div><span>团队方案</span><b>{team.plan}</b></div></div>
          <footer><button onClick={() => openDetail(team)}><EyeOutlined />团队详情</button></footer>
        </article>
      })}
      {!rows.length && <EmptyState />}
    </div>
    <H5Pager total={rows.length} paging={paging} />

    <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} onReset={() => setFilters({ type: '', agent: '', createdFrom: '' })} resultCount={rows.length}>
      <Field label="代理类型"><select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}><option value="">全部类型</option><option value="官方代理">官方代理</option><option value="普通代理">普通代理</option></select></Field>
      <Field label="代理编号/账号"><input value={filters.agent} onChange={(event) => setFilters({ ...filters, agent: event.target.value })} placeholder="主线或副线" /></Field>
      <Field label="创建时间起"><input type="date" value={filters.createdFrom} onChange={(event) => setFilters({ ...filters, createdFrom: event.target.value })} /></Field>
    </FilterSheet>

    <RowsSheet config={drill} onClose={() => setDrill(null)} />
    <H5Sheet open={Boolean(selected)} title={selected?.name || '团队详情'} subtitle={selected ? `${selected.code} / ${selected.site} / ${selected.currency}` : ''} onClose={() => setSelected(null)} className="h5-agent-team-detail-sheet">
      {selected && <>
        <nav className="h5-agent-segment-tabs">{[['overview', '团队概况'], ['performance', '团队业绩查看'], ['operations', '代理操作记录']].map(([key, label]) => <button key={key} className={detailTab === key ? 'is-active' : ''} onClick={() => setDetailTab(key)}>{label}</button>)}</nav>
        {detailTab === 'overview' && <div className="h5-agent-team-overview">
          <div className="h5-agent-balance-pair"><article><span>团队当前余额</span><b>{money(selected.metrics?.correctedNet)}</b><small>当月结余 = 冲正后净输赢</small></article><article><span>未结算收益</span><b>{money(selected.metrics?.payable)}</b><small>{selected.metrics?.grade} / {(Number(selected.metrics?.rate || 0) * 100).toFixed(0)}% 团队返佣</small></article></div>
          <DetailGrid items={[
            { label: '代理部编号', value: `${selected.code} / ${selected.id}` }, { label: '所属站点 / 币种', value: `${selected.site} / ${selected.currency}` },
            { label: '团队负责人', value: selected.mainAgent }, { label: '代理类型', value: selected.teamAgentType || selected.teamType },
            { label: '团队方案', value: selected.plan },
            { label: '创建时间', value: selected.createdAt }, { label: '加入团队时间', value: selected.joinedAt },
            { label: '生效周期', value: `${selected.startCycle} 起` }, { label: '团队状态', value: selected.status },
            { label: '团队代理总人数', value: selectedCounts.agentTotal }, { label: '总会员数', value: selectedCounts.memberTotal },
            { label: '活跃会员数', value: selectedCounts.activeMembers }, { label: '副线', value: selectedCounts.secondaryTotal },
            { label: '单线代理', value: selectedCounts.singleTotal },
          ]} />
          <section className="h5-agent-grade-card"><span>当前返佣星级</span><b>{selectedGrade.currentGrade}</b><small>团队返佣比例 {(Number(selected.metrics?.rate || 0) * 100).toFixed(0)}% · 下一等级 {selectedGrade.completed ? '最高等级' : selectedGrade.nextGrade}</small></section>
          {!selectedGrade.completed && <DetailGrid items={selectedGrade.conditions.map((condition) => ({ label: condition.label, value: condition.missing <= 0 ? '已达标' : `差 ${formatGradeConditionValue(condition, condition.missing)}（当前 ${formatGradeConditionValue(condition, condition.current)} / 目标 ${formatGradeConditionValue(condition, condition.target)}）`, wide: true }))} />}
          <DetailGrid items={[
            { label: '净输赢', value: money(selected.metrics?.currentNet) }, { label: '冲正后净输赢', value: money(selected.metrics?.correctedNet) },
            { label: '团队当前余额', value: money(selected.metrics?.correctedNet) }, { label: '未结算收益', value: money(selected.metrics?.payable) },
            { label: '平台收款责任', value: '当期团队负责人' }, { label: '关系变更结余', value: '按关系变更时点归属' },
          ]} />
          <section className="h5-agent-grade-card"><span>资金及结算口径</span><DetailGrid items={[
            { label: '净输赢', value: '总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费', wide: true },
            { label: '冲正后净输赢', value: '净输赢 + 上周期结余 + 本月结余调整', wide: true },
            { label: '团队当前余额', value: '团队当前余额 = 冲正后净输赢', wide: true },
            { label: '未结算收益', value: 'MAX（0，团队当前余额 × 团队返佣比例 + 佣金调整）', wide: true },
            { label: '平台收款责任', value: '团队每周期只形成一张平台账单；副线收益通过团队内部分配体现', wide: true },
            { label: '关系变更结余', value: '加入团队时带入，移出团队时留原团队，解散后由指定代理承接', wide: true },
          ]} /></section>
        </div>}
        {detailTab === 'performance' && <div>
          <SearchBar value={performanceFilters.agent} onChange={(agent) => setPerformanceFilters({ ...performanceFilters, agent })} placeholder="代理名称" onFilter={() => setPerformanceFilterOpen(true)} filterCount={Object.values(performanceFilters).filter(Boolean).length} />
          <div className="h5-agent-result-meta"><span>团队业绩查看 · {selectedPerformance.length} 条</span><button onClick={() => onToast(`团队业绩已导出 ${selectedPerformance.length} 条`)}>导出</button></div>
          <div className="h5-agent-reconcile-scroll" aria-label="团队业绩横向核对模式"><div className="h5-agent-reconcile-track">{selectedPerformance.map((row) => <article key={row.lineId} className="h5-agent-performance-card"><header><StatusPill tone="brand">{row.identity}</StatusPill><b>{row.agent}</b><span>{row.lineId}</span></header><DetailGrid items={[
            { label: '统计日期', value: row.statDate }, { label: '显式业务范围', value: row.scope, wide: true },
            { label: '新增活跃', value: row.newActive || 0 }, { label: '新增首存', value: row.firstDepositCount || 0 },
            { label: '首存额度', value: money(row.firstDepositAmount) }, { label: '活跃会员', value: row.activeMembers || 0 },
            { label: '总盈亏', value: money(row.totalWinLoss) }, { label: '运营费用', value: money(row.operationFee) },
            { label: '净收益', value: money(row.netRevenue), tone: Number(row.netRevenue) >= 0 ? 'positive' : 'negative' }, { label: '团队贡献占比', value: `${(Number(row.contributionRate || 0) * 100).toFixed(2)}%` },
          ]} /></article>)}</div>{!selectedPerformance.length && <EmptyState />}</div>
          <section className="h5-agent-grade-card"><span>总计 · 记录 {selectedPerformance.length} 条</span><DetailGrid items={[
            { label: '新增活跃', value: performanceTotal.newActive }, { label: '新增首存', value: performanceTotal.firstDepositCount },
            { label: '首存额度', value: money(performanceTotal.firstDepositAmount) }, { label: '活跃会员', value: performanceTotal.activeMembers },
            { label: '总盈亏', value: money(performanceTotal.totalWinLoss) }, { label: '运营费用', value: money(performanceTotal.operationFee) },
            { label: '净收益', value: money(performanceTotal.netRevenue), tone: Number(performanceTotal.netRevenue) >= 0 ? 'positive' : 'negative' },
          ]} /></section>
          <section className="h5-agent-grade-card"><span>团队业绩查看口径</span><DetailGrid items={[
            { label: '总盈亏', value: `各线路总输赢合计 · ${money(performanceTotal.totalWinLoss)}`, wide: true },
            { label: '运营费用', value: `按线路运营成本合计 · ${money(performanceTotal.operationFee)}`, wide: true },
            { label: '净收益', value: `总盈亏 − 运营费用 · ${money(performanceTotal.netRevenue)}`, wide: true },
            { label: '团队贡献占比', value: '单线正向净收益 ÷ 全团队正向净收益', wide: true },
          ]} /></section>
          <FilterSheet open={performanceFilterOpen} title="团队业绩筛选" onClose={() => setPerformanceFilterOpen(false)} onReset={() => setPerformanceFilters({ agent: '', identity: '', lineId: '', statFrom: '', statTo: '' })} resultCount={selectedPerformance.length}>
            <Field label="身份"><select value={performanceFilters.identity} onChange={(event) => setPerformanceFilters({ ...performanceFilters, identity: event.target.value })}><option value="">全部身份</option><option>主线</option><option>副线</option></select></Field>
            <Field label="line_id"><input value={performanceFilters.lineId} onChange={(event) => setPerformanceFilters({ ...performanceFilters, lineId: event.target.value })} placeholder="LINE-A" /></Field>
            <Field label="统计日期起"><input type="date" value={performanceFilters.statFrom} onChange={(event) => setPerformanceFilters({ ...performanceFilters, statFrom: event.target.value })} /></Field>
            <Field label="统计日期止"><input type="date" value={performanceFilters.statTo} onChange={(event) => setPerformanceFilters({ ...performanceFilters, statTo: event.target.value })} /></Field>
          </FilterSheet>
        </div>}
        {detailTab === 'operations' && <div>
          <SearchBar value={operationFilters.agentAccount} onChange={(agentAccount) => setOperationFilters({ ...operationFilters, agentAccount })} placeholder="主线或副线账号" onFilter={() => setOperationFilterOpen(true)} filterCount={Object.values(operationFilters).filter(Boolean).length} />
          <div className="h5-agent-result-meta"><span>代理操作记录 · {selectedOperations.length} 条</span><span><button onClick={() => onToast(`代理操作记录已导出 ${selectedOperations.length} 条`)}>导出</button><button onClick={() => onToast('代理操作记录文件已下载')}>下载文件</button></span></div>
          <div className="h5-agent-timeline">{selectedOperations.map((row) => <article key={row.id}><i /><div><header><b>{row.action}</b><span>{row.createdAt}</span></header><p>{row.reason || '—'}</p><DetailGrid items={[
            { label: '序号', value: row.index }, { label: '团队名称', value: row.teamName }, { label: '代理身份', value: row.agentIdentity },
            { label: '主线编号', value: row.mainId }, { label: '主线账号', value: row.mainAccount }, { label: '副线账号', value: row.secondaryAccounts, wide: true },
          ]} /></div></article>)}{!selectedOperations.length && <EmptyState />}</div>
          <FilterSheet open={operationFilterOpen} title="代理操作记录筛选" onClose={() => setOperationFilterOpen(false)} onReset={() => setOperationFilters({ teamName: '', agentIdentity: '', agentId: '', agentAccount: '', createdFrom: '', createdTo: '' })} resultCount={selectedOperations.length}>
            <Field label="团队名称"><select value={operationFilters.teamName} onChange={(event) => setOperationFilters({ ...operationFilters, teamName: event.target.value })}><option value="">全部团队</option><option>{selected.name}</option></select></Field>
            <Field label="代理身份"><select value={operationFilters.agentIdentity} onChange={(event) => setOperationFilters({ ...operationFilters, agentIdentity: event.target.value })}><option value="">全部身份</option>{unique(operationBase, 'agentIdentity').map((value) => <option key={value}>{value}</option>)}</select></Field>
            <Field label="代理编号"><input value={operationFilters.agentId} onChange={(event) => setOperationFilters({ ...operationFilters, agentId: event.target.value })} placeholder="主线编号" /></Field>
            <Field label="创建时间起"><input type="date" value={operationFilters.createdFrom} onChange={(event) => setOperationFilters({ ...operationFilters, createdFrom: event.target.value })} /></Field>
            <Field label="创建时间止"><input type="date" value={operationFilters.createdTo} onChange={(event) => setOperationFilters({ ...operationFilters, createdTo: event.target.value })} /></Field>
          </FilterSheet>
        </div>}
      </>}
    </H5Sheet>
  </section>
}

export function H5MemberPage({ role = 'main', onToast = EMPTY_FN }) {
  const [keyword, setKeyword] = useState('')
  const [filters, setFilters] = useState({ id: '', parent: '', status: '', type: '' })
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const sourceRows = useMemo(() => rowsForAgentRole(MEMBER_ROWS, role), [role])
  const rows = useMemo(() => sourceRows.filter((row) => contains(row.account, keyword)
    && (!filters.id || contains(row.id, filters.id))
    && (!filters.parent || row.parent === filters.parent)
    && (!filters.status || row.status === filters.status)
    && (!filters.type || row.type === filters.type)), [sourceRows, keyword, filters])
  const paging = usePaging(rows)

  return <section className="h5-agent-page h5-agent-member-page">
    <SearchBar value={keyword} onChange={setKeyword} placeholder="请输入会员账号" onFilter={() => setFilterOpen(true)} filterCount={Object.values(filters).filter(Boolean).length} />
    <div className="h5-agent-result-meta"><span>会员管理 · 全部 {sourceRows.length}</span><span><button onClick={() => onToast('会员数据已导出')}>导出Excel</button><button onClick={() => onToast('下载文件入口已触发')}>下载文件</button></span></div>
    <div className="h5-agent-card-list">
      {paging.visibleRows.map((row) => <article key={row.id} className="h5-agent-list-card h5-agent-member-card" onClick={() => setSelected(row)}>
        <header><div className="h5-agent-card-avatar"><UserOutlined /></div><div><b>{row.account}</b><span>ID {row.id}</span></div><StatusPill>{row.status}</StatusPill></header>
        <div className="h5-agent-card-badges"><StatusPill tone="brand">VIP {row.vip}</StatusPill><StatusPill tone="neutral">{row.type}</StatusPill><span className="h5-agent-parent-chip">上级 {row.parent}</span></div>
        <div className="h5-agent-card-metrics"><div><span>钱包余额</span><b>{money(row.balance)}</b></div><div><span>有效投注</span><b>{money(row.validBet)}</b></div><div><span>总输赢</span><b className={Number(row.winLoss) >= 0 ? 'is-positive' : 'is-negative'}>{money(row.winLoss)}</b></div></div>
      </article>)}
      {!rows.length && <EmptyState />}
    </div>
    <H5Pager total={rows.length} paging={paging} />

    <FilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} onReset={() => setFilters({ id: '', parent: '', status: '', type: '' })} resultCount={rows.length}>
      <Field label="会员ID"><input value={filters.id} onChange={(event) => setFilters({ ...filters, id: event.target.value })} placeholder="请输入会员ID" /></Field>
      <Field label="上级代理"><select value={filters.parent} onChange={(event) => setFilters({ ...filters, parent: event.target.value })}><option value="">全部代理</option>{unique(sourceRows, 'parent').map((value) => <option key={value}>{value}</option>)}</select></Field>
      <Field label="状态"><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">全部</option>{unique(sourceRows, 'status').map((value) => <option key={value}>{value}</option>)}</select></Field>
      <Field label="会员/代理"><select value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}><option value="">全部类型</option>{unique(sourceRows, 'type').map((value) => <option key={value}>{value}</option>)}</select></Field>
    </FilterSheet>

    <H5Sheet open={Boolean(selected)} title="会员资料" subtitle={selected ? `${selected.account} / ${selected.id}` : ''} onClose={() => setSelected(null)}>
      {selected && <DetailGrid items={[
        { label: '会员ID', value: selected.id }, { label: 'VIP等级', value: selected.vip },
        { label: '会员账号', value: selected.account }, { label: '总有效投注额', value: money(selected.validBet) },
        { label: '总输赢', value: money(selected.winLoss), tone: Number(selected.winLoss) >= 0 ? 'positive' : 'negative' },
        { label: '钱包余额', value: money(selected.balance), tone: 'positive' }, { label: '会员/代理', value: selected.type },
        { label: '上级代理', value: selected.parent }, { label: '总充值', value: money(selected.deposit) },
        { label: '首充金额', value: money(selected.firstDeposit) }, { label: '实际到账', value: money(selected.received) },
        { label: '注册入金金额', value: money(selected.registeredDeposit) }, { label: '状态', value: selected.status },
      ]} />}
    </H5Sheet>
  </section>
}

export function H5BetPage({ role = 'main', onToast = EMPTY_FN }) {
  const [keyword, setKeyword] = useState('')
  const [filters, setFilters] = useState({ orderNo: '', venue: '', status: '', minAmount: '' })
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const sourceRows = useMemo(() => rowsForAgentRole(BET_ROWS, role), [role])
  const rows = useMemo(() => sourceRows.filter((row) => contains(row.member, keyword)
    && (!filters.orderNo || contains(row.orderNo, filters.orderNo))
    && (!filters.venue || row.venue === filters.venue)
    && (!filters.status || row.result === filters.status)
    && (!filters.minAmount || Number(row.amount) >= Number(filters.minAmount))), [sourceRows, keyword, filters])
  const paging = usePaging(rows)

  return <section className="h5-agent-page h5-agent-bet-page">
    <SearchBar value={keyword} onChange={setKeyword} placeholder="请输入会员账号" onFilter={() => setFilterOpen(true)} filterCount={Object.values(filters).filter(Boolean).length} />
    <div className="h5-agent-result-meta"><span>投注记录 · {rows.length} 条</span><span><button onClick={() => onToast('投注记录已导出')}>导出</button><button onClick={() => onToast('投注文件下载入口已触发')}>下载文件</button></span></div>
    <div className="h5-agent-card-list">
      {paging.visibleRows.map((row) => <article key={row.id} className="h5-agent-list-card h5-agent-bet-card" onClick={() => setSelected(row)}>
        <header><div><b>{row.game}</b><span>{row.venue} · {row.member}</span></div><StatusPill>{row.result}</StatusPill></header>
        <div className="h5-agent-order-no">{row.orderNo}</div>
        <div className="h5-agent-card-metrics"><div><span>下注金额</span><b>{money(row.amount)}</b></div><div><span>有效投注</span><b>{money(row.validBet)}</b></div><div><span>下注时间</span><b>{plain(row.time)}</b></div></div>
      </article>)}
      {!rows.length && <EmptyState />}
    </div>
    <H5Pager total={rows.length} paging={paging} />

    <FilterSheet open={filterOpen} title="投注记录筛选" onClose={() => setFilterOpen(false)} onReset={() => setFilters({ orderNo: '', venue: '', status: '', minAmount: '' })} resultCount={rows.length}>
      <Field label="注单流水号"><input value={filters.orderNo} onChange={(event) => setFilters({ ...filters, orderNo: event.target.value })} placeholder="请输入三方注单号" /></Field>
      <Field label="场馆名称"><select value={filters.venue} onChange={(event) => setFilters({ ...filters, venue: event.target.value })}><option value="">全部场馆</option>{unique(sourceRows, 'venue').map((value) => <option key={value}>{value}</option>)}</select></Field>
      <Field label="订单状态"><select value={filters.status} onChange={(event) => setFilters({ ...filters, status: event.target.value })}><option value="">全部状态</option>{unique(sourceRows, 'result').map((value) => <option key={value}>{value}</option>)}</select></Field>
      <Field label="下注金额"><input type="number" min="0" value={filters.minAmount} onChange={(event) => setFilters({ ...filters, minAmount: event.target.value })} placeholder="最小金额" /></Field>
      <Field label="下注时间"><input type="date" value="2026-07-21" readOnly /></Field>
    </FilterSheet>

    <H5Sheet open={Boolean(selected)} title="注单详情" subtitle={selected?.orderNo} onClose={() => setSelected(null)}>
      {selected && <DetailGrid items={[
        { label: 'ID', value: selected.id }, { label: '注单号', value: selected.orderNo, wide: true },
        { label: '站点编码', value: selected.siteCode }, { label: '会员账号', value: selected.member }, { label: '上级代理', value: selected.parent },
        { label: '场馆类型', value: selected.venueType }, { label: '场馆名称', value: selected.venue },
        { label: '游戏ID', value: selected.gameId }, { label: '游戏名称', value: selected.game },
        { label: '下注详情', value: selected.detail, wide: true }, { label: '下注金额', value: money(selected.amount) },
        { label: '有效投注', value: money(selected.validBet) }, { label: '赔率', value: selected.odds },
        { label: '订单状态', value: selected.result }, { label: '下注时间', value: selected.time },
      ]} />}
    </H5Sheet>
  </section>
}
