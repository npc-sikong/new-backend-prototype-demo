import { useEffect, useRef, useState } from 'react'
import {
  ApartmentOutlined,
  BankOutlined,
  BarChartOutlined,
  FileTextOutlined,
  FileSearchOutlined,
  FullscreenOutlined,
  MenuOutlined,
  MobileOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SendOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { AgentRoleBar } from './team-agent/agent-pages'
import { TeamAgentProvider, useTeamAgent } from './team-agent/context'
import { PAGE_NOTES } from './team-agent/data'
import { H5Withdrawal } from './team-agent/H5Withdrawal'
import { MasterPage } from './team-agent/master-pages'
import { MultiLevelAgentPage } from './team-agent/multi-level-agent-pages'
import { NegativeProfitModeGuidePage } from './team-agent/negative-profit-mode-guide-page'
import { NotesDrawer, PageSummary } from './team-agent/ui'
import { VersionRequirementsPage } from './team-agent/version-page'
import { H5AgentBackend } from './h5-agent/H5AgentBackend'
import './team-agent.css'
import './multi-level-agent.css'

const PORTALS = [
  { id: 'master', label: '总控后台', icon: SafetyCertificateOutlined },
  { id: 'site', label: '站点后台', icon: BankOutlined },
  { id: 'agent', label: '代理后台', icon: TeamOutlined },
  { id: 'h5', label: 'H5 前端', icon: MobileOutlined },
  { id: 'h5Agent', label: 'H5代理后台', icon: UserOutlined },
]

const PORTAL_META = {
  master: { title: '游戏总控管理系统', suffix: '团队代理 2.0', user: '若依', icon: SafetyCertificateOutlined },
  site: { title: '站点运营管理后台', suffix: '旺财体育', user: '站点运营', icon: BankOutlined },
  agent: { title: '代理经营管理后台', suffix: '团队代理', user: 'gaodashang', icon: TeamOutlined },
}

const PAGE_META = {
  master: {
    version: '版本需求说明', negativeProfitModeGuide: '负盈利模式说明', memberLockedFlow: '会员提现流水查询', agents: '代理列表', negativeProfit: '负盈利代理佣金结算', teams: '团队代理管理', revenue: '代理收益看板',
  },
  site: {
    agents: '代理列表', negativeProfit: '负盈利代理佣金结算', teams: '团队代理管理',
  },
  agent: {
    agents: '代理列表', negativeProfit: '负盈利代理佣金结算', teams: '团队代理管理',
    mlDashboard: '代理数据看板', mlProfile: '个人中心', mlFinance: '财务中心', mlAgents: '代理列表', mlMembers: '会员列表', mlBetRecords: '投注记录', mlAccountChanges: '账变流水报表', mlMemberFunds: '会员资金记录', mlReversalStats: '冲正统计报表', mlReversalRepayment: '冲正回款报表', mlVenueFees: '三方场馆代理费用明细', mlActivities: '活动列表',
  },
}

const DEFAULT_PAGES = { master: 'teams', site: 'agents', agent: 'agents' }

const MASTER_NAV = [
  { id: 'version', label: '版本需求说明', mark: '新', icon: FileTextOutlined, standalone: true },
  { id: 'negativeProfitModeGuide', label: '负盈利模式说明', mark: '新', icon: FileTextOutlined },
  { id: 'member-group', label: '会员管理', mark: '新', icon: TeamOutlined, children: [
    { id: 'memberLockedFlow', label: '会员提现流水查询', mark: '新', icon: FileSearchOutlined },
  ] },
  { id: 'agent-group', label: '代理管理', mark: '改', icon: ApartmentOutlined, children: [
    { id: 'agents', label: '代理列表', mark: '改', icon: UserOutlined },
    { id: 'negativeProfit', label: '负盈利代理佣金结算', mark: '新', icon: BarChartOutlined },
    { id: 'teams', label: '团队代理管理', mark: '新', icon: TeamOutlined },
    { id: 'revenue', label: '代理收益看板', mark: '改', icon: WalletOutlined },
  ] },
]

const SITE_NAV = [
  { id: 'site-agent-group', label: '代理管理', mark: '改', icon: ApartmentOutlined, children: [
    { id: 'agents', label: '代理列表', mark: '改', icon: UserOutlined },
    { id: 'negativeProfit', label: '负盈利代理佣金结算', mark: '新', icon: BarChartOutlined },
    { id: 'teams', label: '团队代理管理', mark: '新', icon: TeamOutlined },
  ] },
]

const AGENT_NAV = [
  { id: 'agent-self-group', label: '代理管理', mark: '改', icon: ApartmentOutlined, children: [
    { id: 'agents', label: '代理列表', mark: '改', icon: UserOutlined },
    { id: 'negativeProfit', label: '负盈利代理佣金结算', mark: '新', icon: BarChartOutlined },
    { id: 'teams', label: '团队代理管理', mark: '新', icon: TeamOutlined },
  ] },
  { id: 'mlProfile', label: '个人中心', icon: UserOutlined },
  { id: 'mlFinance', label: '财务中心', icon: WalletOutlined },
  { id: 'mlMembers', label: '会员列表', icon: TeamOutlined },
  { id: 'mlBetRecords', label: '投注记录', icon: FileSearchOutlined },
  { id: 'mlAccountChanges', label: '账变流水报表', icon: FileTextOutlined },
  { id: 'mlMemberFunds', label: '会员资金记录', icon: WalletOutlined },
  { id: 'mlVenueFees', label: '三方场馆代理费用明细', icon: BankOutlined },
]

const SHARED_AGENT_PAGES = new Set(['mlProfile', 'mlFinance', 'mlMembers', 'mlBetRecords', 'mlAccountChanges', 'mlMemberFunds', 'mlVenueFees'])

const MULTI_LEVEL_AGENT_NAV = [
  { id: 'mlDashboard', label: '代理数据看板', mark: '改', icon: BarChartOutlined },
  { id: 'mlProfile', label: '个人中心', mark: '改', icon: UserOutlined },
  { id: 'mlFinance', label: '财务中心', mark: '改', icon: WalletOutlined },
  { id: 'mlAgents', label: '代理列表', mark: '改', icon: ApartmentOutlined },
  { id: 'mlMembers', label: '会员列表', mark: '改', icon: TeamOutlined },
  { id: 'mlBetRecords', label: '投注记录', mark: '改', icon: FileSearchOutlined },
  { id: 'mlAccountChanges', label: '账变流水报表', mark: '改', icon: FileTextOutlined },
  { id: 'mlMemberFunds', label: '会员资金记录', mark: '改', icon: WalletOutlined },
  { id: 'mlReversalStats', label: '冲正统计报表', mark: '改', icon: BarChartOutlined },
  { id: 'mlReversalRepayment', label: '冲正回款报表', mark: '改', icon: ReloadOutlined },
  { id: 'mlVenueFees', label: '三方场馆代理费用明细', mark: '改', icon: BankOutlined },
  { id: 'ml-activity-group', label: '活动管理', mark: '改', icon: SendOutlined, children: [
    { id: 'mlActivities', label: '活动列表', mark: '改', icon: FileTextOutlined },
  ] },
]

function PortalSwitch({ active, onChange }) {
  return <div className="portal-switch" aria-label="后台切换">{PORTALS.map((item) => {
    const PortalIcon = item.icon
    return <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => onChange(item.id)}><PortalIcon /><span>{item.label}</span></button>
  })}</div>
}

function Sidebar({ portal, page, agentRole, onNavigate }) {
  const portalMeta = portal === 'agent' && agentRole === 'multiLevel' ? { ...PORTAL_META.agent, suffix: '多层级代理' } : PORTAL_META[portal]
  const BrandIcon = portalMeta.icon
  const nav = portal === 'master' ? MASTER_NAV : portal === 'site' ? SITE_NAV : agentRole === 'multiLevel' ? MULTI_LEVEL_AGENT_NAV : AGENT_NAV
  return <aside className="sidebar ta-sidebar"><div className="brand"><span className="brand-mark"><BrandIcon /></span><span>{portalMeta.title}</span></div><div className="ta-brand-suffix">{portalMeta.suffix}</div><nav>
    {nav.map((item) => {
      const ItemIcon = item.icon
      if (item.children) return <div className="ta-nav-group" key={item.id}><div className="nav-item nav-parent active-parent"><span className="icon"><ItemIcon /></span><span>{item.label}{item.mark ? `(${item.mark})` : ''}</span><span className="chevron">⌃</span></div><div className="nav-children">{item.children.map((child) => {
        const ChildIcon = child.icon
        return <button key={child.id} className={`nav-item child ${page === child.id ? 'active' : ''}`} onClick={() => onNavigate(child.id)}><span className="icon"><ChildIcon /></span><span>{child.label}{child.mark ? `(${child.mark})` : ''}</span></button>
      })}</div></div>
      return <button key={item.id} className={`nav-item ${item.standalone ? 'ta-version-nav' : ''} ${page === item.id ? 'route-active' : ''}`} onClick={() => onNavigate(item.id)}><span className="icon"><ItemIcon /></span><span>{item.label}{item.mark ? `(${item.mark})` : ''}</span></button>
    })}
  </nav></aside>
}

function PrototypeApp() {
  const { resetDemo: resetState } = useTeamAgent()
  const [portal, setPortal] = useState('master')
  const [lastAdminPortal, setLastAdminPortal] = useState('master')
  const [pages, setPages] = useState({ master: 'teams', site: 'agents', agent: 'agents' })
  const [multiLevelPage, setMultiLevelPage] = useState('mlDashboard')
  const [teamDetailTargets, setTeamDetailTargets] = useState({ master: null, site: null, agent: null })
  const [agentRole, setAgentRole] = useState('main')
  const [notesOpen, setNotesOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  useEffect(() => () => window.clearTimeout(toastTimer.current), [])

  function notify(message, tone = 'success') {
    window.clearTimeout(toastTimer.current)
    setToast({ message, tone })
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }

  function navigateTo(nextPortal, nextPage) {
    if (nextPortal === 'h5' || nextPortal === 'h5Agent') {
      if (portal !== 'h5' && portal !== 'h5Agent') setLastAdminPortal(portal)
      setPortal(nextPortal)
      setNotesOpen(false)
      return
    }
    setPortal(nextPortal)
    setLastAdminPortal(nextPortal)
    if (nextPortal === 'agent' && nextPage?.startsWith('ml') && !SHARED_AGENT_PAGES.has(nextPage)) {
      setAgentRole('multiLevel')
      setMultiLevelPage(nextPage)
    } else if (nextPage) setPages((current) => ({ ...current, [nextPortal]: nextPage }))
    setNotesOpen(false)
  }

  function resetDemo() {
    resetState()
    notify('演示数据已恢复为初始状态')
  }

  if (portal === 'h5') return <>
    <H5Withdrawal onBack={() => navigateTo(lastAdminPortal)} onOpenNotes={() => setNotesOpen(true)} onToast={notify} />
    {notesOpen && <NotesDrawer note={PAGE_NOTES.h5} onClose={() => setNotesOpen(false)} />}
    {toast && <div className={`toast ta-toast-${toast.tone}`}>{toast.message}</div>}
  </>

  if (portal === 'h5Agent') return <>
    <H5AgentBackend onBack={() => navigateTo(lastAdminPortal)} onToast={notify} />
    {toast && <div className={`toast ta-toast-${toast.tone}`}>{toast.message}</div>}
  </>

  const currentPage = portal === 'agent' && agentRole === 'multiLevel' ? multiLevelPage : pages[portal]
  const page = PAGE_META[portal][currentPage] ? currentPage : DEFAULT_PAGES[portal]
  const title = PAGE_META[portal][page]
  const note = PAGE_NOTES[`${portal}:${page}`]
  const portalMeta = portal === 'agent' && agentRole === 'multiLevel' ? { ...PORTAL_META.agent, suffix: '多层级代理' } : PORTAL_META[portal]
  const navigateFromPage = (nextPage, target) => {
    if (nextPage === 'teamDetails' && target) setTeamDetailTargets((current) => ({ ...current, [portal]: target }))
    navigateTo(portal, nextPage === 'teamDetails' ? 'teams' : nextPage)
  }
  const renderPage = () => {
    if (portal === 'master' && page === 'version') return <VersionRequirementsPage navigateTo={navigateTo} />
    if (portal === 'master' && page === 'negativeProfitModeGuide') return <NegativeProfitModeGuidePage />
    if (portal === 'master') return <MasterPage page={page} navigate={navigateFromPage} detailTarget={teamDetailTargets.master} onToast={notify} />
    if (portal === 'site') return <MasterPage page={page} navigate={navigateFromPage} detailTarget={teamDetailTargets.site} portal="site" onToast={notify} />
    return <><AgentRoleBar role={agentRole} setRole={setAgentRole} />{agentRole === 'multiLevel' || SHARED_AGENT_PAGES.has(page) ? <MultiLevelAgentPage page={page} role={agentRole} onToast={notify} /> : <MasterPage page={page} navigate={navigateFromPage} detailTarget={teamDetailTargets.agent} portal="agent" role={agentRole} onToast={notify} />}</>
  }

  return <div className="app-shell ta-app-shell">
    <Sidebar portal={portal} page={page} agentRole={agentRole} onNavigate={(nextPage) => portal === 'agent' && agentRole === 'multiLevel' ? (setMultiLevelPage(nextPage), setNotesOpen(false)) : navigateTo(portal, nextPage)} />
    <main className="main-shell ta-main-shell">
      <header className="topbar ta-topbar"><button className="menu-button" aria-label="菜单"><MenuOutlined /></button><div className="breadcrumb">{portalMeta.title}<span>/</span>{title}</div><PortalSwitch active={portal} onChange={navigateTo} /><div className="top-actions">
        <button className="requirements-trigger" onClick={() => setNotesOpen(true)}><FileTextOutlined /><span>业务及需求说明</span></button>
        <button aria-label="恢复演示数据" title="恢复演示数据" onClick={resetDemo}><ReloadOutlined /></button>
        <button aria-label="搜索" title="搜索" onClick={() => notify('已打开全局搜索演示')}><SearchOutlined /></button>
        <button aria-label="全屏" title="全屏" onClick={() => notify('全屏演示入口已触发')}><FullscreenOutlined /></button>
        <span className="avatar">{portalMeta.user.slice(0, 1)}</span><strong>{portalMeta.user}</strong>
      </div></header>
      <div className="tabbar"><button className="tab current"><i />{title}<span>×</span></button></div>
      <section className="content-area ta-content-area"><PageSummary note={note} onOpenNotes={() => setNotesOpen(true)} /><div className="ta-page-body">{renderPage()}</div></section>
    </main>
    {notesOpen && <NotesDrawer note={note} onClose={() => setNotesOpen(false)} />}
    {toast && <div className={`toast ta-toast-${toast.tone}`}>{toast.message}</div>}
  </div>
}

export function App() {
  return <TeamAgentProvider><PrototypeApp /></TeamAgentProvider>
}
