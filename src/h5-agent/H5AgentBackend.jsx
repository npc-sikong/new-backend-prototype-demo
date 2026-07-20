import { cloneElement, useMemo, useState } from 'react'
import {
  ApartmentOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined,
  BankOutlined,
  BarChartOutlined,
  FileSearchOutlined,
  FileTextOutlined,
  GiftOutlined,
  HomeOutlined,
  ReloadOutlined,
  RightOutlined,
  SafetyCertificateOutlined,
  SendOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { useTeamAgent } from '../team-agent/context'
import { DASHBOARD_GROUPS } from '../team-agent/multi-level-agent-data'
import { H5AgentListPage, H5BetPage, H5MemberPage, H5TeamPage } from './h5-agent-business-pages'
import {
  H5AccountChangesPage,
  H5FinancePage,
  H5MemberFundsPage,
  H5NegativeProfitPage,
  H5ReversalRepaymentPage,
  H5ReversalStatsPage,
  H5VenueFeesPage,
} from './h5-agent-finance-pages'
import { H5ActivitiesPage, H5ProfilePage } from './h5-agent-account-pages'
import {
  createFinanceState,
  H5_AGENT_NOTES,
  H5_AGENT_PAGE_META,
  H5_AGENT_ROLES,
  H5_AGENT_UPDATED_AT,
  money,
  pageAllowed,
  pagesForWorkspace,
  roleMeta,
  roleProfile,
  workspaceForPage,
} from './h5-agent-data'
import { H5AgentNotesSheet, H5AgentPageIntro, H5AgentSegments, H5AgentSheet } from './h5-agent-ui'
import './h5-agent.css'

const PAGE_ICONS = {
  agents: ApartmentOutlined,
  teams: TeamOutlined,
  members: TeamOutlined,
  bets: FileSearchOutlined,
  finance: WalletOutlined,
  accountChanges: FileTextOutlined,
  memberFunds: BankOutlined,
  negativeProfit: BarChartOutlined,
  reversalStats: SafetyCertificateOutlined,
  reversalRepayment: ReloadOutlined,
  venueFees: BankOutlined,
  profile: UserOutlined,
  activities: GiftOutlined,
}

const BOTTOM_TABS = [
  { id: 'home', label: '首页', icon: HomeOutlined },
  { id: 'agent', label: '代理', icon: ApartmentOutlined },
  { id: 'member', label: '会员', icon: TeamOutlined },
  { id: 'finance', label: '资金', icon: WalletOutlined },
  { id: 'more', label: '更多', icon: AppstoreOutlined },
]

function H5AgentHome({ role, finance, onNavigate, onRoleOpen, onNotes, onToast }) {
  const { data } = useTeamAgent()
  const [dashboardPeriod, setDashboardPeriod] = useState('2026-07-21')
  const profile = roleProfile(role)
  const meta = roleMeta(role)
  const team = data.teams.find((item) => item.id === 'TEAM-001')
  const line = team?.lines.find((item) => item.agent === 'WC002')
  const single = data.singles.find((item) => item.owner === 'dailiwc001')
  const singleBill = data.bills.find((item) => item.unitId === single?.id && item.type === '单线代理佣金')
  const secondaryReceived = data.internalSettlements.filter((item) => item.secondaryAgent === 'WC002' && item.state === '成功').reduce((sum, item) => sum + Number(item.amount || 0), 0)
  const metrics = role === 'multiLevel'
    ? [{ label: '代理总人数', value: '207' }, { label: '会员总数', value: '31' }, { label: '活跃代理', value: '0' }]
    : role === 'main'
      ? [{ label: '本期团队等级', value: team?.metrics?.grade || '—' }, { label: '平台应付团队佣金', value: money(team?.metrics?.payable) }, { label: '团队有效副线', value: team?.lines.filter((item) => item.identity === '副线').length || 0 }]
      : role === 'secondary'
        ? [{ label: '我的新增活跃', value: line?.newActive || 0 }, { label: '我的活跃会员', value: line?.activeMembers || 0 }, { label: '收到内部结算', value: money(secondaryReceived) }]
        : [{ label: '当前等级', value: single?.metrics?.grade || '—' }, { label: '冲正后净输赢', value: money(singleBill?.correctedNet || single?.metrics?.assessmentNet) }, { label: '平台应付佣金', value: money(singleBill?.payable || 0) }]
  const quickActions = [
    { label: '财务', page: 'finance', icon: WalletOutlined, tone: 'blue' },
    { label: '会员', page: 'members', icon: TeamOutlined, tone: 'green' },
    { label: '报表', page: role === 'multiLevel' ? 'reversalStats' : 'negativeProfit', icon: BarChartOutlined, tone: 'purple' },
    { label: '全部功能', page: 'all', icon: AppstoreOutlined, tone: 'dark' },
  ]
  return <div className="h5-agent-home">
    <header className="h5-agent-home-head"><div><h1>代理中心</h1><small>修改时间：{H5_AGENT_UPDATED_AT}</small></div><div><button type="button" aria-label="业务说明" onClick={onNotes}><FileTextOutlined /><span>说明</span></button></div></header>
    <section className="h5-agent-identity-row">
      <span className="h5-agent-account-avatar">{profile.account.slice(0, 1)}</span>
      <div><strong>{profile.account}</strong><p>{meta.scope}</p></div>
      <button type="button" onClick={onRoleOpen}>{meta.label}<RightOutlined /></button>
    </section>
    <section className="h5-agent-balance-card">
      <div className="h5-agent-balance-label"><span>当前可用余额（CNY）</span><WalletOutlined /></div>
      <strong>{money(finance.balance)}</strong>
      <small>站点：{profile.siteCode} · {profile.roleLabel}</small>
      <div className="h5-agent-home-metrics">{metrics.map((item) => <div key={item.label}><span>{item.label}</span><b>{item.value}</b></div>)}</div>
    </section>
    <section className="h5-agent-quick-grid">{quickActions.map(({ label, page, icon: Icon, tone }) => <button type="button" key={label} onClick={() => onNavigate(page)}><span className={tone}><Icon /></span><b>{label}</b></button>)}</section>
    {role === 'multiLevel' && <section className="h5-agent-dashboard-mobile">
      <header><div><h2>代理数据看板</h2><button type="button" onClick={() => onToast('数据筛选项已打开')}>数据筛选⌄</button></div><input type="date" value={dashboardPeriod} onChange={(event) => setDashboardPeriod(event.target.value)} /></header>
      <p className="h5-agent-dashboard-alert">这里展示整个站点的代理、一般为累计数据，只有在代理新增数据时会每天更新；不建议通过日期筛选来更新，白底卡片数据会根据日期筛选范围同步变化。</p>
      {DASHBOARD_GROUPS.map((group) => <section key={group.title}><h3>{group.title}</h3><div className="h5-agent-dashboard-cards">{group.items.map((item) => <article className={`tone-${item.tone || 'default'}`} key={item.label}>
        <span>{item.label}</span><strong>{item.value}</strong><footer><small>{item.helper || '较上周期'}</small>{item.note && <em>{item.note}</em>}{item.link && <button type="button" onClick={() => onToast(`${item.label}明细已打开`)}>{item.link}</button>}</footer>
      </article>)}</div></section>)}
    </section>}
    <section className="h5-agent-home-activity">
      <header><h2>最新动态</h2><button type="button" onClick={() => onNavigate('accountChanges')}>全部<RightOutlined /></button></header>
      <div className={`h5-agent-timeline ${finance.flows.length ? '' : 'is-empty'}`}>{finance.flows.slice(0, 4).map((flow, index) => { const flowTone = Number(flow.amount) >= 0 ? 'positive' : ''; return <button type="button" key={flow.id} onClick={() => onNavigate('finance')}>
        <i className={flowTone} /><span className={`icon ${flowTone}`}>{index === 0 ? <SafetyCertificateOutlined /> : index === 1 ? <BankOutlined /> : index === 2 ? <SwapOutlined /> : <SendOutlined />}</span>
        <div><strong>{flow.type}{flow.status && <em>（{flow.status}）</em>}</strong><small>{flow.relation}</small></div>
        <p className={flow.amount >= 0 ? 'positive' : ''}><b>{flow.amount >= 0 ? '+' : ''}{money(flow.amount)}</b><span>{flow.time}</span></p>
      </button> })}{!finance.flows.length && <div className="h5-agent-home-empty"><WalletOutlined /><span>暂无收支流水</span><small>资金操作后将在这里同步展示</small></div>}</div>
    </section>
  </div>
}

function H5AgentAllFunctions({ role, onNavigate }) {
  const pages = Object.keys(H5_AGENT_PAGE_META).filter((page) => page !== 'home' && pageAllowed(role, page))
  return <div className="h5-agent-function-grid">{pages.map((page) => {
    const Icon = PAGE_ICONS[page] || AppstoreOutlined
    return <button type="button" key={page} onClick={() => onNavigate(page)}><span><Icon /></span><b>{H5_AGENT_PAGE_META[page].shortLabel}</b><small>{H5_AGENT_PAGE_META[page].group === 'finance' ? '资金与报表' : H5_AGENT_PAGE_META[page].group === 'agent' ? '代理经营' : '业务功能'}</small></button>
  })}</div>
}

export function H5AgentBackend({ onBack, onToast = () => {} }) {
  const [role, setRole] = useState('main')
  const [pageByRole, setPageByRole] = useState({ main: 'home', secondary: 'home', independent: 'home', multiLevel: 'home' })
  const [financeByRole, setFinanceByRole] = useState(createFinanceState)
  const [roleOpen, setRoleOpen] = useState(false)
  const [notesOpen, setNotesOpen] = useState(false)
  const [functionsOpen, setFunctionsOpen] = useState(false)
  const page = pageByRole[role]
  const workspace = workspaceForPage(page)
  const note = H5_AGENT_NOTES[page]
  const workspacePages = useMemo(() => pagesForWorkspace(role, workspace), [role, workspace])

  const navigate = (nextPage) => {
    if (nextPage === 'all') return setFunctionsOpen(true)
    if (!pageAllowed(role, nextPage)) return onToast('当前身份无该页面权限', 'warning')
    setPageByRole((current) => ({ ...current, [role]: nextPage }))
  }

  const changeRole = (nextRole) => {
    const currentPage = pageByRole[role]
    setPageByRole((current) => ({ ...current, [nextRole]: pageAllowed(nextRole, currentPage) ? currentPage : current[nextRole] || 'home' }))
    setRole(nextRole)
    setRoleOpen(false)
    onToast(`已切换为${roleMeta(nextRole).label}`)
  }

  const changeWorkspace = (nextWorkspace) => {
    const target = nextWorkspace === 'home' ? 'home' : pagesForWorkspace(role, nextWorkspace)[0]
    if (target) navigate(target)
  }

  const updateFinance = (next) => setFinanceByRole((current) => ({ ...current, [role]: typeof next === 'function' ? next(current[role]) : next }))

  const renderPage = () => {
    if (page === 'home') return <H5AgentHome role={role} finance={financeByRole[role]} onNavigate={navigate} onRoleOpen={() => setRoleOpen(true)} onNotes={() => setNotesOpen(true)} onToast={onToast} />
    if (page === 'agents') return <H5AgentListPage role={role} onToast={onToast} />
    if (page === 'teams') return <H5TeamPage role={role} onToast={onToast} />
    if (page === 'members') return <H5MemberPage role={role} onToast={onToast} />
    if (page === 'bets') return <H5BetPage role={role} onToast={onToast} />
    if (page === 'finance') return <H5FinancePage role={role} financeState={financeByRole[role]} onFinanceChange={updateFinance} onToast={onToast} />
    if (page === 'accountChanges') return <H5AccountChangesPage role={role} onToast={onToast} />
    if (page === 'memberFunds') return <H5MemberFundsPage role={role} onToast={onToast} />
    if (page === 'negativeProfit') return <H5NegativeProfitPage role={role} onToast={onToast} />
    if (page === 'reversalStats') return <H5ReversalStatsPage role={role} onToast={onToast} />
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
        <H5AgentPageIntro title={note.title} summary={note.summary} updatedAt={note.updatedAt} onOpenNotes={() => setNotesOpen(true)} />
        <H5AgentSegments active={page} onChange={navigate} ariaLabel="同类模块切换" items={workspacePages.map((item) => ({ value: item, label: H5_AGENT_PAGE_META[item].shortLabel }))} />
      </>}
      {cloneElement(renderPage(), { key: `${role}-${page}` })}
    </div>
    <nav className="h5-agent-bottom-nav" aria-label="H5代理后台导航">{BOTTOM_TABS.map(({ id, label, icon: Icon }) => <button type="button" key={id} className={workspace === id ? 'active' : ''} onClick={() => changeWorkspace(id)}><Icon /><span>{label}</span></button>)}</nav>
    <button type="button" className="h5-agent-exit" onClick={onBack} aria-label="返回后台"><ArrowLeftOutlined /></button>
    <H5AgentSheet open={roleOpen} title="切换代理身份" description="身份切换后仅展示该角色授权范围。" onClose={() => setRoleOpen(false)} className="h5-agent-role-sheet">
      <div className="h5-agent-role-options">{H5_AGENT_ROLES.map((item) => <button type="button" key={item.id} className={role === item.id ? 'active' : ''} onClick={() => changeRole(item.id)}><span>{item.account.slice(0, 1)}</span><div><strong>{item.label}</strong><p>{item.account} · {item.scope}</p></div>{role === item.id && <i>当前</i>}</button>)}</div>
    </H5AgentSheet>
    <H5AgentSheet open={functionsOpen} title="全部功能" description={`${roleMeta(role).label}可使用的业务模块`} onClose={() => setFunctionsOpen(false)} className="h5-agent-functions-sheet"><H5AgentAllFunctions role={role} onNavigate={(target) => { setFunctionsOpen(false); navigate(target) }} /></H5AgentSheet>
    <H5AgentNotesSheet note={note} open={notesOpen} onClose={() => setNotesOpen(false)} />
  </section></main>
}
