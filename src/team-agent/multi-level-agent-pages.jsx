import { MultiLevelDashboardPage, MultiLevelFinancePage, MultiLevelProfilePage } from './multi-level-agent-core-pages'
import { MultiLevelAgentsPage, MultiLevelBetsPage, MultiLevelMembersPage } from './multi-level-agent-list-pages'
import {
  MultiLevelAccountChangesPage,
  MultiLevelActivitiesPage,
  MultiLevelMemberFundsPage,
  MultiLevelReversalRepaymentPage,
  MultiLevelReversalStatsPage,
  MultiLevelVenueFeesPage,
} from './multi-level-agent-report-pages'

const PAGE_COMPONENTS = {
  mlDashboard: MultiLevelDashboardPage,
  mlProfile: MultiLevelProfilePage,
  mlFinance: MultiLevelFinancePage,
  mlAgents: MultiLevelAgentsPage,
  mlMembers: MultiLevelMembersPage,
  mlBetRecords: MultiLevelBetsPage,
  mlAccountChanges: MultiLevelAccountChangesPage,
  mlMemberFunds: MultiLevelMemberFundsPage,
  mlReversalStats: MultiLevelReversalStatsPage,
  mlReversalRepayment: MultiLevelReversalRepaymentPage,
  mlVenueFees: MultiLevelVenueFeesPage,
  mlActivities: MultiLevelActivitiesPage,
}

export function MultiLevelAgentPage({ page, role = 'multiLevel', onToast }) {
  const Page = PAGE_COMPONENTS[page] || MultiLevelDashboardPage
  return <Page key={`${page}-${role}`} role={role} onToast={onToast} />
}
