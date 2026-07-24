import { cloneElement, useMemo, useState } from 'react'
import {
  AppstoreOutlined,
  ArrowLeftOutlined,
  CreditCardOutlined,
  DashboardOutlined,
  ExportOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  GiftOutlined,
  HomeOutlined,
  LineChartOutlined,
  PlusCircleOutlined,
  ReloadOutlined,
  RightOutlined,
  ShopOutlined,
  SwapOutlined,
  SyncOutlined,
  TeamOutlined,
  TransactionOutlined,
  UserOutlined,
  UsergroupAddOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { H5AgentListPage, H5BetPage, H5MemberPage } from './h5-agent-business-pages'
import {
  H5AccountChangesPage,
  H5FinancePage,
  H5MemberFundsPage,
  H5ReversalRepaymentPage,
  H5ReversalStatsPage,
  H5VenueFeesPage,
} from './h5-agent-finance-pages'
import { H5ActivitiesPage, H5ProfilePage } from './h5-agent-account-pages'
import { H5AgentDashboardPage } from './h5-agent-dashboard-page'
import { H5AgentDebtReversalReportPage } from './h5-agent-debt-reversal-report-page'
import { H5AgentLogin } from './h5-agent-login'
import { H5NegativeProfitReportPage } from './h5-agent-negative-profit-report-page'
import {
  createFinanceState,
  H5_AGENT_NOTES,
  H5_AGENT_PAGE_META,
  H5_AGENT_ROLES,
  money,
  pageAllowed,
  pagesForRole,
  roleMeta,
  roleProfile,
} from './h5-agent-data'
import { H5AgentNotesSheet, H5AgentPageIntro, H5AgentSheet } from './h5-agent-ui'
import './h5-agent.css'

const PAGE_ICONS = {
  dashboard: DashboardOutlined,
  agents: TeamOutlined,
  members: UsergroupAddOutlined,
  bets: FileSearchOutlined,
  finance: WalletOutlined,
  accountChanges: TransactionOutlined,
  memberFunds: CreditCardOutlined,
  negativeProfitReport: LineChartOutlined,
  reversalStats: SyncOutlined,
  reversalRepayment: ReloadOutlined,
  venueFees: ShopOutlined,
  profile: UserOutlined,
  activities: GiftOutlined,
}

const HOME_FINANCE_ACTIONS = [
  { key: 'recharge', label: '快速充值', icon: PlusCircleOutlined, tone: 'blue' },
  { key: 'withdraw', label: '余额提现', icon: ExportOutlined, tone: 'green' },
  { key: 'transfer', label: '内部转账', icon: SwapOutlined, tone: 'purple' },
  { key: 'packet', label: '发放红包', icon: GiftOutlined, tone: 'red' },
]

function bottomTabsForRole() {
  return [
    { id: 'home', page: 'home', label: '首页', icon: HomeOutlined },
    { id: 'dashboard', page: 'dashboard', label: '看板', icon: DashboardOutlined },
    { id: 'finance', page: 'finance', label: '财务', icon: WalletOutlined },
    { id: 'profile', page: 'profile', label: '个人中心', icon: UserOutlined },
    { id: 'more', page: 'all', label: '更多', icon: AppstoreOutlined },
  ]
}

function H5AgentHome({ role, finance, excludedPages, onFinanceAction, onNavigate, onRoleOpen, onNotes }) {
  const profile = roleProfile(role)
  const meta = roleMeta(role)
  return <div className="h5-agent-home">
    <header className="h5-agent-home-head"><div><h1>代理中心</h1></div><div><button type="button" aria-label="业务说明" onClick={onNotes}><FileTextOutlined /><span>说明</span></button></div></header>
    <section className="h5-agent-identity-row">
      <span className="h5-agent-account-avatar">{profile.account.slice(0, 1)}</span>
      <div><strong>{profile.account}</strong><p>{meta.scope}</p></div>
      <button type="button" onClick={onRoleOpen}>{meta.label}<RightOutlined /></button>
    </section>
    <section className="h5-agent-balance-card">
      <div className="h5-agent-balance-label"><span>当前可用额度（CNY）</span></div>
      <strong>{money(finance.balance)}</strong>
      <small>站点：{profile.siteCode} · {profile.roleLabel}</small>
    </section>
    <section className="h5-agent-home-finance-actions" aria-label="资金快捷操作">{HOME_FINANCE_ACTIONS.map((item) => {
      const Icon = item.icon
      return <button type="button" key={item.key} className={`is-${item.tone}`} onClick={() => onFinanceAction(item.key)}>
        <span className="h5-agent-home-action-icon" aria-hidden="true"><Icon /></span>
        <span className="h5-agent-home-action-label">{item.label}</span>
      </button>
    })}</section>
    <section className="h5-agent-home-modules">
      <header><h2>其它模块</h2></header>
      <H5AgentAllFunctions role={role} excludedPages={excludedPages} onNavigate={onNavigate} />
    </section>
  </div>
}

function H5AgentAllFunctions({ role, onNavigate, excludedPages = [] }) {
  const pages = pagesForRole(role).filter((page) => page !== 'home' && !excludedPages.includes(page))
  return <div className="h5-agent-function-grid">{pages.map((page) => {
    const Icon = PAGE_ICONS[page] || AppstoreOutlined
    return <button type="button" key={page} onClick={() => onNavigate(page)}><span><Icon /></span><b>{H5_AGENT_PAGE_META[page].shortLabel}</b><small>{H5_AGENT_PAGE_META[page].group === 'finance' ? '资金与报表' : H5_AGENT_PAGE_META[page].group === 'agent' ? '代理经营' : '业务功能'}</small></button>
  })}</div>
}

export function H5AgentBackend({ onBack, onToast = () => {} }) {
  const [authenticated, setAuthenticated] = useState(false)
  const [role, setRole] = useState('main')
  const [pageByRole, setPageByRole] = useState({ main: 'home', secondary: 'home', independent: 'home', multiLevel: 'home' })
  const [financeByRole, setFinanceByRole] = useState(createFinanceState)
  const [financeAction, setFinanceAction] = useState(null)
  const [roleOpen, setRoleOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [functionsOpen, setFunctionsOpen] = useState(false)
  const page = pageByRole[role]
  const note = H5_AGENT_NOTES[page]
  const bottomTabs = useMemo(() => bottomTabsForRole(), [])
  const directPages = bottomTabs.map((item) => item.page).filter((item) => item !== 'all')
  const activeBottom = bottomTabs.find((item) => item.page === page)?.id || (page === 'home' ? 'home' : 'more')

  const navigate = (nextPage) => {
    if (nextPage === 'all') return setFunctionsOpen(true)
    if (!pageAllowed(role, nextPage)) return onToast('当前身份无该页面权限', 'warning')
    setPageByRole((current) => ({ ...current, [role]: nextPage }))
  }

  const login = ({ account, role: loginRole }) => {
    setRole(loginRole)
    setPageByRole((current) => ({ ...current, [loginRole]: 'home' }))
    setAuthenticated(true)
    setNotesOpen(false)
    onToast(`${account} 登录成功`)
  }

  const changeRole = (nextRole) => {
    const currentPage = pageByRole[role]
    setPageByRole((current) => ({ ...current, [nextRole]: pageAllowed(nextRole, currentPage) ? currentPage : current[nextRole] || 'home' }))
    setRole(nextRole)
    setRoleOpen(false)
    onToast(`已切换为${roleMeta(nextRole).label}`)
  }

  const updateFinance = (next) => setFinanceByRole((current) => ({ ...current, [role]: typeof next === 'function' ? next(current[role]) : next }))
  const openFinanceAction = (actionKey) => {
    setFinanceAction(actionKey)
    navigate('finance')
  }

  if (!authenticated) return <H5AgentLogin onBack={onBack} onLogin={login} note={H5_AGENT_NOTES.login} notesOpen={notesOpen} onOpenNotes={() => setNotesOpen(true)} onCloseNotes={() => setNotesOpen(false)} onToast={onToast} />

  const renderPage = () => {
    if (page === 'home') return <H5AgentHome role={role} finance={financeByRole[role]} excludedPages={directPages} onFinanceAction={openFinanceAction} onNavigate={navigate} onRoleOpen={() => setRoleOpen(true)} onNotes={() => setNotesOpen(true)} />
    if (page === 'dashboard') return <H5AgentDashboardPage role={role} onToast={onToast} />
    if (page === 'agents') return <H5AgentListPage role={role} onToast={onToast} />
    if (page === 'members') return <H5MemberPage role={role} onToast={onToast} />
    if (page === 'bets') return <H5BetPage role={role} onToast={onToast} />
    if (page === 'finance') return <H5FinancePage role={role} financeState={financeByRole[role]} onFinanceChange={updateFinance} initialActionKey={financeAction} onInitialActionConsumed={() => setFinanceAction(null)} onToast={onToast} />
    if (page === 'accountChanges') return <H5AccountChangesPage role={role} onToast={onToast} />
    if (page === 'memberFunds') return <H5MemberFundsPage role={role} onToast={onToast} />
    if (page === 'negativeProfitReport') return <H5NegativeProfitReportPage role={role} onToast={onToast} />
    if (page === 'reversalStats') return role === 'multiLevel' ? <H5ReversalStatsPage role={role} onToast={onToast} /> : <H5AgentDebtReversalReportPage role={role} onToast={onToast} />
    if (page === 'reversalRepayment') return <H5ReversalRepaymentPage role={role} onToast={onToast} />
    if (page === 'venueFees') return <H5VenueFeesPage role={role} onToast={onToast} />
    if (page === 'profile') return <H5ProfilePage role={role} onToast={onToast} />
    if (page === 'activities') return <H5ActivitiesPage role={role} onToast={onToast} />
    return null
  }

  return <main className="h5-agent-preview-stage"><section className="h5-agent-phone" aria-label="H5代理后台">
    {page !== 'home' && <header className="h5-agent-topbar"><button type="button" aria-label="返回首页" onClick={() => navigate('home')}><ArrowLeftOutlined /></button><strong>{H5_AGENT_PAGE_META[page].label}</strong><button type="button" className="role" onClick={() => setRoleOpen(true)}>{roleMeta(role).label}</button></header>}
    <div className={`h5-agent-scroll ${page === 'home' ? 'home' : ''}`}>
      {page !== 'home' && <>
        <H5AgentPageIntro title={note.title} onOpenNotes={() => setNotesOpen(true)} />
      </>}
      {cloneElement(renderPage(), { key: `${role}-${page}` })}
    </div>
    <nav className="h5-agent-bottom-nav" aria-label="H5代理后台导航">{bottomTabs.map(({ id, page: target, label, icon: Icon }) => <button type="button" key={id} className={activeBottom === id ? 'active' : ''} onClick={() => navigate(target)}><Icon /><span>{label}</span></button>)}</nav>
    <button type="button" className={`h5-agent-exit ${page === 'home' ? 'is-home' : ''}`} onClick={onBack} aria-label="返回后台"><ArrowLeftOutlined /></button>
    <H5AgentSheet open={roleOpen} title="切换代理身份" description="身份切换后仅展示该角色授权范围。" onClose={() => setRoleOpen(false)} className="h5-agent-role-sheet">
      <div className="h5-agent-role-options">{H5_AGENT_ROLES.map((item) => <button type="button" key={item.id} className={role === item.id ? 'active' : ''} onClick={() => changeRole(item.id)}><span>{item.account.slice(0, 1)}</span><div><strong>{item.label}</strong><p>{item.account} · {item.scope}</p></div>{role === item.id && <i>当前</i>}</button>)}</div>
    </H5AgentSheet>
    <H5AgentSheet open={functionsOpen} title="更多功能" description={`${roleMeta(role).label}可使用的其他业务模块`} onClose={() => setFunctionsOpen(false)} className="h5-agent-functions-sheet"><H5AgentAllFunctions role={role} excludedPages={directPages} onNavigate={(target) => { setFunctionsOpen(false); navigate(target) }} /></H5AgentSheet>
    <H5AgentNotesSheet note={note} open={notesOpen} onClose={() => setNotesOpen(false)} />
  </section></main>
}
