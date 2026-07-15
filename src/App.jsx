import { useRef, useState } from 'react'
import {
  ApartmentOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  BranchesOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  FullscreenOutlined,
  MenuOutlined,
  MobileOutlined,
  ProfileOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SettingOutlined,
  SolutionOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { AgentPage } from './team-agent/agent-pages'
import { TeamAgentProvider, useTeamAgent } from './team-agent/context'
import { PAGE_NOTES } from './team-agent/data'
import { H5Withdrawal } from './team-agent/H5Withdrawal'
import { MemberTurnoverPage } from './member-turnover-page'
import { MasterPage } from './team-agent/master-pages'
import { SitePage } from './team-agent/site-pages'
import { NotesDrawer, PageSummary } from './team-agent/ui'
import { VersionRequirementsPage } from './team-agent/version-page'
import './team-agent.css'

const PORTALS = [
  { id: 'master', label: '总控后台', icon: SafetyCertificateOutlined },
  { id: 'site', label: '站点后台', icon: BankOutlined },
  { id: 'agent', label: '代理后台', icon: TeamOutlined },
  { id: 'h5', label: 'H5 前端', icon: MobileOutlined },
]

const PORTAL_META = {
  master: { title: '游戏总控管理系统', suffix: '团队代理 2.0', user: '若依', icon: SafetyCertificateOutlined },
  site: { title: '站点运营管理后台', suffix: '旺财体育', user: '站点运营', icon: BankOutlined },
  agent: { title: '代理经营管理后台', suffix: '团队代理', user: 'gaodashang', icon: TeamOutlined },
}

const PAGE_META = {
  master: {
    version: '版本需求说明', memberTurnover: '会员打码流水统计表', agents: '代理管理', teams: '团队代理管理', singles: '独立单线管理', plans: '返佣方案', settlement: '代理佣金结算', records: '佣金记录', reversal: '冲正统计报表', returns: '冲正回款报表', revenue: '代理收益看板', cycle: '结算周期设置', relations: '修改代理关系记录',
  },
  site: { teams: '团队代理管理', singles: '独立单线管理', review: '模式变更审核', plans: '方案与推荐奖励', settlement: '账单提交与发放' },
  agent: { dashboard: '团队经营看板', bills: '我的佣金账单', internal: '副线内部结算', requests: '关系与模式申请' },
}

const MASTER_NAV = [
  { id: 'version', label: '版本需求说明', icon: FileTextOutlined, standalone: true },
  { id: 'member-group', label: '会员管理', icon: TeamOutlined, children: [
    { id: 'memberTurnover', label: '会员打码流水统计表', icon: BarChartOutlined },
  ] },
  { id: 'agent-group', label: '代理管理', icon: ApartmentOutlined, children: [
    { id: 'agents', label: '代理管理', icon: UserOutlined },
    { id: 'teams', label: '团队代理管理', icon: TeamOutlined },
    { id: 'singles', label: '独立单线管理', icon: BranchesOutlined },
    { id: 'plans', label: '返佣方案', icon: SolutionOutlined },
    { id: 'settlement', label: '代理佣金结算', icon: DollarCircleOutlined },
    { id: 'records', label: '佣金记录', icon: ProfileOutlined },
    { id: 'reversal', label: '冲正统计报表', icon: BarChartOutlined },
    { id: 'returns', label: '冲正回款报表', icon: FileDoneOutlined },
    { id: 'revenue', label: '代理收益看板', icon: WalletOutlined },
    { id: 'cycle', label: '结算周期设置', icon: SettingOutlined },
    { id: 'relations', label: '修改代理关系记录', icon: SwapOutlined },
  ] },
]

const SITE_NAV = [
  { id: 'site-group', label: '团队代理运营', icon: ApartmentOutlined, children: [
    { id: 'teams', label: '团队代理管理', icon: TeamOutlined },
    { id: 'singles', label: '独立单线管理', icon: BranchesOutlined },
    { id: 'review', label: '模式变更审核', icon: AuditOutlined },
    { id: 'plans', label: '方案与推荐奖励', icon: SolutionOutlined },
    { id: 'settlement', label: '账单提交与发放', icon: DollarCircleOutlined },
  ] },
]

const AGENT_NAV = [
  { id: 'agent-self-group', label: '我的团队代理', icon: ApartmentOutlined, children: [
    { id: 'dashboard', label: '团队经营看板', icon: BarChartOutlined },
    { id: 'bills', label: '我的佣金账单', icon: FileDoneOutlined },
    { id: 'internal', label: '副线内部结算', icon: WalletOutlined },
    { id: 'requests', label: '关系与模式申请', icon: SwapOutlined },
  ] },
]

function PortalSwitch({ active, onChange }) {
  return <div className="portal-switch" aria-label="后台切换">{PORTALS.map((item) => {
    const PortalIcon = item.icon
    return <button key={item.id} className={active === item.id ? 'active' : ''} onClick={() => onChange(item.id)}><PortalIcon /><span>{item.label}</span></button>
  })}</div>
}

function Sidebar({ portal, page, onNavigate }) {
  const portalMeta = PORTAL_META[portal]
  const BrandIcon = portalMeta.icon
  const nav = portal === 'master' ? MASTER_NAV : portal === 'site' ? SITE_NAV : AGENT_NAV
  return <aside className="sidebar ta-sidebar"><div className="brand"><span className="brand-mark"><BrandIcon /></span><span>{portalMeta.title}</span></div><div className="ta-brand-suffix">{portalMeta.suffix}</div><nav>
    {nav.map((item) => {
      const ItemIcon = item.icon
      if (item.children) return <div className="ta-nav-group" key={item.id}><div className="nav-item nav-parent active-parent"><span className="icon"><ItemIcon /></span><span>{item.label}</span><span className="chevron">⌃</span></div><div className="nav-children">{item.children.map((child) => {
        const ChildIcon = child.icon
        return <button key={child.id} className={`nav-item child ${page === child.id ? 'active' : ''}`} onClick={() => onNavigate(child.id)}><span className="icon"><ChildIcon /></span><span>{child.label}</span></button>
      })}</div></div>
      return <button key={item.id} className={`nav-item ta-version-nav ${page === item.id ? 'route-active' : ''}`} onClick={() => onNavigate(item.id)}><span className="icon"><ItemIcon /></span><span>{item.label}</span></button>
    })}
  </nav></aside>
}

function PrototypeApp() {
  const { resetDemo: resetState } = useTeamAgent()
  const [portal, setPortal] = useState('master')
  const [lastAdminPortal, setLastAdminPortal] = useState('master')
  const [pages, setPages] = useState({ master: 'teams', site: 'teams', agent: 'dashboard' })
  const [agentRole, setAgentRole] = useState('main')
  const [notesOpen, setNotesOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  function notify(message, tone = 'success') {
    window.clearTimeout(toastTimer.current)
    setToast({ message, tone })
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }

  function navigateTo(nextPortal, nextPage) {
    if (nextPortal === 'h5') {
      if (portal !== 'h5') setLastAdminPortal(portal)
      setPortal('h5')
      setNotesOpen(false)
      return
    }
    setPortal(nextPortal)
    setLastAdminPortal(nextPortal)
    if (nextPage) setPages((current) => ({ ...current, [nextPortal]: nextPage }))
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

  const page = pages[portal]
  const title = PAGE_META[portal][page]
  const note = PAGE_NOTES[`${portal}:${page}`]
  const portalMeta = PORTAL_META[portal]
  const renderPage = () => {
    if (portal === 'master' && page === 'version') return <VersionRequirementsPage navigateTo={navigateTo} />
    if (portal === 'master' && page === 'memberTurnover') return <MemberTurnoverPage onToast={notify} />
    if (portal === 'master') return <MasterPage page={page} navigate={(nextPage) => navigateTo('master', nextPage)} onToast={notify} />
    if (portal === 'site') return <SitePage page={page} onToast={notify} />
    return <AgentPage page={page} role={agentRole} setRole={setAgentRole} onToast={notify} />
  }

  return <div className="app-shell ta-app-shell">
    <Sidebar portal={portal} page={page} onNavigate={(nextPage) => navigateTo(portal, nextPage)} />
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
