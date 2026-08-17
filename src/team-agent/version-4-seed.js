export const REBATE_AGENT_ACCOUNT = 'rebate_agent88'

export function withVersion4Data(state) {
  if (state.agents.some((item) => item.account === REBATE_AGENT_ACCOUNT)) return state
  state.agents.splice(4, 0, {
    id: '1888', account: REBATE_AGENT_ACCOUNT, agentName: '彩票返水代理88', model: '彩票返水模式', agentType: '返水代理', teamAgentType: '—', developer: 'lottery_ops', recommender: '—', parentId: '—', email: 'rebate88@example.com', registeredAt: '2026-08-17 16:40', settlementMode: '返水代理', identity: '—', unit: '—', lineId: '—', effectiveCycle: '2026-08', site: '旺财体育', status: '启用', parent: '无上级代理', subAgents: 3, members: 28, activeMembers: 16, newActiveMembers: 5, depositAmount: 128000, withdrawalAmount: 46000, totalWinLoss: 32000, validBetting: 586000, plan: '彩票返水方案', oddsHandicap: 'B盘', lotteryBetRebateRate: 4, balance: 26880.5, lastLogin: '2026-08-17 16:58', channelStats: [], subAgentDetails: [], carryAllFees: '否', remark: '4.0返水代理演示账号',
  })
  return state
}
