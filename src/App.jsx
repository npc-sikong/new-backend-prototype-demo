import { useEffect, useRef, useState } from 'react'
import {
  ApartmentOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
  FileTextOutlined,
  FullscreenOutlined,
  HistoryOutlined,
  MenuOutlined,
  MobileOutlined,
  ProfileOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SendOutlined,
  SettingOutlined,
  SolutionOutlined,
  SwapOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { AgentPage, AgentRoleBar } from './team-agent/agent-pages'
import { AgentBaselinePage } from './team-agent/agent-baseline-pages'
import { TeamAgentProvider, useTeamAgent } from './team-agent/context'
import { PAGE_NOTES } from './team-agent/data'
import { H5Withdrawal } from './team-agent/H5Withdrawal'
import { MemberTurnoverPage } from './member-turnover-page'
import { MasterPage } from './team-agent/master-pages'
import { SitePage } from './team-agent/site-pages'
import { SiteBaselinePage } from './team-agent/site-baseline-pages'
import { LegacyReportPage } from './team-agent/legacy-report-pages'
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
    version: '版本需求说明', memberTurnover: '会员打码流水统计表', agents: '代理列表', negativeProfit: '负盈利代理报表', agentOperations: '代理操作记录', teams: '团队代理管理', plans: '佣金方案', settlement: '代理佣金结算', records: '佣金记录', reversal: '冲正统计报表', returns: '冲正回款报表', revenue: '代理收益看板', cycle: '结算周期设置', relations: '修改代理关系记录',
  },
  site: {
    siteDashboard: '运营首页', siteAgents: '代理列表', teams: '团队代理管理', review: '模式变更审核', plans: '佣金方案', settlement: '代理佣金结算', commissionRecords: '佣金记录', reversal: '冲正统计报表', returns: '冲正回款报表', cycle: '结算周期设置', members: '代理会员', finance: '代理财务', deposits: '存款记录', games: '游戏记录', accountChanges: '账变明细', transfers: '转账明细', transferStats: '充提转账统计', venueFees: '场馆代理费用', siteProfit: '站点利润', prepaid: '预付金账户', agentPay: '代理代存处理',
  },
  agent: {
    dashboard: '代理运营看板', downline: '代理列表', members: '代理会员', requests: '关系与模式申请', readonlyPlans: '佣金方案', personalCommission: '个人佣金', bills: '代理佣金结算', commissionRecords: '佣金记录', internal: '副线内部结算', reversal: '冲正统计报表', returns: '冲正回款报表', agentPay: '额度／佣金代存', accountChanges: '账变明细', transfers: '转账明细', finance: '个人财务', deposits: '存款记录', games: '游戏记录', transferStats: '充提转账统计', venueFees: '场馆费用明细',
  },
}

const DEFAULT_PAGES = { master: 'teams', site: 'siteDashboard', agent: 'dashboard' }

const MASTER_NAV = [
  { id: 'version', label: '版本需求说明', mark: '新', icon: FileTextOutlined, standalone: true },
  { id: 'member-group', label: '会员管理', mark: '改', icon: TeamOutlined, children: [
    { id: 'memberTurnover', label: '会员打码流水统计表', mark: '新', icon: BarChartOutlined },
  ] },
  { id: 'agent-group', label: '代理管理', mark: '改', icon: ApartmentOutlined, children: [
    { id: 'agents', label: '代理列表', mark: '改', icon: UserOutlined },
    { id: 'negativeProfit', label: '负盈利代理报表', mark: '新', icon: BarChartOutlined },
    { id: 'agentOperations', label: '代理操作记录', mark: '新', icon: HistoryOutlined },
    { id: 'teams', label: '团队代理管理', mark: '新', icon: TeamOutlined },
    { id: 'plans', label: '佣金方案', mark: '改', icon: SolutionOutlined },
    { id: 'settlement', label: '代理佣金结算', mark: '改', icon: DollarCircleOutlined },
    { id: 'records', label: '佣金记录', mark: '改', icon: ProfileOutlined },
    { id: 'reversal', label: '冲正统计报表', mark: '改', icon: BarChartOutlined },
    { id: 'returns', label: '冲正回款报表', mark: '改', icon: FileDoneOutlined },
    { id: 'revenue', label: '代理收益看板', mark: '改', icon: WalletOutlined },
    { id: 'cycle', label: '结算周期设置', mark: '改', icon: SettingOutlined },
    { id: 'relations', label: '修改代理关系记录', mark: '改', icon: SwapOutlined },
  ] },
]

const SITE_NAV = [
  { id: 'siteDashboard', label: '运营首页', mark: '改', icon: BarChartOutlined, standalone: true },
  { id: 'site-agent-group', label: '代理列表', mark: '改', icon: ApartmentOutlined, children: [
    { id: 'siteAgents', label: '代理列表', mark: '改', icon: UserOutlined },
    { id: 'teams', label: '团队代理管理', mark: '新', icon: TeamOutlined },
    { id: 'review', label: '模式变更审核', mark: '新', icon: AuditOutlined },
  ] },
  { id: 'site-commission-group', label: '佣金管理', mark: '改', icon: DollarCircleOutlined, children: [
    { id: 'plans', label: '佣金方案', mark: '改', icon: SolutionOutlined },
    { id: 'settlement', label: '代理佣金结算', mark: '改', icon: DollarCircleOutlined },
    { id: 'commissionRecords', label: '佣金记录', mark: '改', icon: ProfileOutlined },
    { id: 'reversal', label: '冲正统计报表', mark: '改', icon: BarChartOutlined },
    { id: 'returns', label: '冲正回款报表', mark: '改', icon: FileDoneOutlined },
    { id: 'cycle', label: '结算周期设置', mark: '改', icon: SettingOutlined },
  ] },
  { id: 'site-report-group', label: '代理报表', mark: '改', icon: BarChartOutlined, children: [
    { id: 'members', label: '代理会员', mark: '改', icon: TeamOutlined },
    { id: 'finance', label: '代理财务', mark: '改', icon: DollarCircleOutlined },
    { id: 'deposits', label: '存款记录', mark: '改', icon: FileDoneOutlined },
    { id: 'games', label: '游戏记录', mark: '改', icon: ProfileOutlined },
    { id: 'accountChanges', label: '账变明细', mark: '改', icon: FileTextOutlined },
    { id: 'transfers', label: '转账明细', mark: '改', icon: SwapOutlined },
    { id: 'transferStats', label: '充提转账统计', mark: '改', icon: BarChartOutlined },
    { id: 'venueFees', label: '场馆代理费用', mark: '改', icon: DollarCircleOutlined },
    { id: 'siteProfit', label: '站点利润', mark: '改', icon: WalletOutlined },
  ] },
  { id: 'site-fund-group', label: '资金操作', mark: '改', icon: WalletOutlined, children: [
    { id: 'prepaid', label: '预付金账户', mark: '改', icon: WalletOutlined },
    { id: 'agentPay', label: '代理代存处理', mark: '改', icon: SendOutlined },
  ] },
]

const AGENT_NAV = [
  { id: 'dashboard', label: '运营首页', mark: '改', icon: BarChartOutlined, standalone: true },
  { id: 'agent-self-group', label: '我的代理', mark: '改', icon: ApartmentOutlined, children: [
    { id: 'downline', label: '代理列表', mark: '改', icon: TeamOutlined },
    { id: 'members', label: '代理会员', mark: '改', icon: UserOutlined },
    { id: 'requests', label: '关系与模式申请', mark: '新', icon: SwapOutlined },
  ] },
  { id: 'agent-commission-group', label: '我的佣金', mark: '改', icon: DollarCircleOutlined, children: [
    { id: 'readonlyPlans', label: '佣金方案', mark: '改', icon: SolutionOutlined },
    { id: 'personalCommission', label: '个人佣金', mark: '改', icon: WalletOutlined },
    { id: 'bills', label: '代理佣金结算', mark: '改', icon: FileDoneOutlined },
    { id: 'commissionRecords', label: '佣金记录', mark: '改', icon: ProfileOutlined },
    { id: 'internal', label: '副线内部结算', mark: '新', icon: WalletOutlined },
    { id: 'reversal', label: '冲正统计报表', mark: '改', icon: BarChartOutlined },
    { id: 'returns', label: '冲正回款报表', mark: '改', icon: FileDoneOutlined },
  ] },
  { id: 'agent-fund-group', label: '资金操作', mark: '改', icon: WalletOutlined, children: [
    { id: 'agentPay', label: '额度／佣金代存', mark: '改', icon: SendOutlined },
    { id: 'accountChanges', label: '账变明细', mark: '改', icon: FileTextOutlined },
    { id: 'transfers', label: '转账明细', mark: '改', icon: SwapOutlined },
  ] },
  { id: 'agent-report-group', label: '经营报表', mark: '改', icon: BarChartOutlined, children: [
    { id: 'finance', label: '个人财务', mark: '改', icon: DollarCircleOutlined },
    { id: 'deposits', label: '存款记录', mark: '改', icon: FileDoneOutlined },
    { id: 'games', label: '游戏记录', mark: '改', icon: ProfileOutlined },
    { id: 'transferStats', label: '充提转账统计', mark: '改', icon: BarChartOutlined },
    { id: 'venueFees', label: '场馆费用明细', mark: '改', icon: DollarCircleOutlined },
  ] },
]

const LEGACY_REPORT_PAGES = new Set(['members', 'finance', 'deposits', 'games', 'accountChanges', 'transfers', 'transferStats', 'venueFees', 'commissionRecords', 'reversal', 'returns', 'siteProfit', 'prepaid', 'agentPay'])
const AGENT_BASELINE_PAGES = new Set(['downline', 'readonlyPlans', 'personalCommission'])

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
      if (item.children) return <div className="ta-nav-group" key={item.id}><div className="nav-item nav-parent active-parent"><span className="icon"><ItemIcon /></span><span>{item.label}({item.mark})</span><span className="chevron">⌃</span></div><div className="nav-children">{item.children.map((child) => {
        const ChildIcon = child.icon
        return <button key={child.id} className={`nav-item child ${page === child.id ? 'active' : ''}`} onClick={() => onNavigate(child.id)}><span className="icon"><ChildIcon /></span><span>{child.label}({child.mark})</span></button>
      })}</div></div>
      return <button key={item.id} className={`nav-item ${item.standalone ? 'ta-version-nav' : ''} ${page === item.id ? 'route-active' : ''}`} onClick={() => onNavigate(item.id)}><span className="icon"><ItemIcon /></span><span>{item.label}({item.mark})</span></button>
    })}
  </nav></aside>
}

function PrototypeApp() {
  const { resetDemo: resetState } = useTeamAgent()
  const [portal, setPortal] = useState('master')
  const [lastAdminPortal, setLastAdminPortal] = useState('master')
  const [pages, setPages] = useState({ master: 'teams', site: 'siteDashboard', agent: 'dashboard' })
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

  const currentPage = pages[portal]
  const page = PAGE_META[portal][currentPage] ? currentPage : DEFAULT_PAGES[portal]
  const title = PAGE_META[portal][page]
  const note = PAGE_NOTES[`${portal}:${page}`]
  const portalMeta = PORTAL_META[portal]
  const renderPage = () => {
    if (portal === 'master' && page === 'version') return <VersionRequirementsPage navigateTo={navigateTo} />
    if (portal === 'master' && page === 'memberTurnover') return <MemberTurnoverPage onToast={notify} />
    if (portal === 'master') return <MasterPage page={page} navigate={(nextPage) => navigateTo('master', nextPage)} onToast={notify} />
    if (portal === 'site') {
      if (page === 'cycle') return <MasterPage page="cycle" portal="site" onToast={notify} />
      if (page === 'siteDashboard' || page === 'siteAgents') return <SiteBaselinePage page={page} onToast={notify} />
      if (LEGACY_REPORT_PAGES.has(page)) return <LegacyReportPage page={page} portal="site" onToast={notify} />
      return <SitePage page={page} onToast={notify} />
    }
    if (AGENT_BASELINE_PAGES.has(page)) return <><AgentRoleBar role={agentRole} setRole={setAgentRole} /><AgentBaselinePage page={page} role={agentRole} onToast={notify} onNavigate={(nextPage) => navigateTo('agent', nextPage)} /></>
    if (LEGACY_REPORT_PAGES.has(page)) return <><AgentRoleBar role={agentRole} setRole={setAgentRole} /><LegacyReportPage page={page} portal="agent" role={agentRole} onToast={notify} /></>
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
