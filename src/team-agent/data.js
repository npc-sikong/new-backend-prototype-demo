import { LEGACY_STATE } from './legacy-data'
import { NOTE_COMPARISONS, NOTE_COMPARISON_UPDATED_AT } from './note-comparisons'

export const UPDATED_AT = '2026-07-15 18:30'
export const MEMBER_TURNOVER_UPDATED_AT = '2026-07-14 23:40'

const DEFAULT_CHANNEL_STATS = [
  { channel: 'USDT-TRC20', depositCount: 18, depositAmount: 126000, withdrawalCount: 6, withdrawalAmount: 42800 },
  { channel: '支付宝', depositCount: 11, depositAmount: 63500, withdrawalCount: 3, withdrawalAmount: 18600 },
  { channel: '银行卡', depositCount: 7, depositAmount: 47000, withdrawalCount: 2, withdrawalAmount: 12800 },
]

function agent(row) {
  return {
    agentType: '多层级代理', developer: '—', parentId: '—', boundMemberAccount: '—', email: '—', registeredAt: '2026-06-01 10:00',
    registerIp: '103.22.15.8', loginIp: '103.22.15.18', registerLocation: '中国 / 广东省 / 广州市', loginLocation: '中国 / 广东省 / 深圳市',
    activeMembers: 0, newActiveMembers: 0, depositAmount: 0, withdrawalAmount: 0, totalWinLoss: 0, validBetting: 0, lastLogin: '—',
    channelStats: DEFAULT_CHANNEL_STATS, subAgentDetails: [], ...row,
  }
}

function bill(row) {
  return {
    agentType: '普通代理', becameAgentAt: '2026-05-01', teamType: '—', teamMembers: 1, subAgentCount: 0, registeredCount: 0, firstDepositCount: 0,
    activeCount: 0, newActiveCount: 0, depositAmount: 0, withdrawalAmount: 0, totalWinLoss: 0, venueFee: 0, memberBonus: 0, memberRebate: 0,
    accountAdjustment: 0, manualOrderWinLoss: 0, depositFee: 0, withdrawalFee: 0, netWinLossRaw: 0, lastBalance: 0, balanceAdjustment: 0,
    correctedNet: 0, commissionAdjustment: 0, maintainer: '站点运营', reviewer: '—', reviewedAt: '—', issuedBy: '—', issuedAt: '—', adjustmentReason: '—', ...row,
  }
}

export const INITIAL_STATE = {
  ...LEGACY_STATE,
  agents: [
    agent({ id: '345', account: 'gaodashang', model: '负盈利模式', agentType: '团队代理', teamAgentType: '官方代理', developer: 'gaodashang', boundMemberAccount: 'M100345', email: 'gao@example.com', registeredAt: '2026-05-08 13:20', settlementMode: '团队模式', identity: '团队负责人', unit: 'gaodashang01部', lineId: 'LINE-A', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: '无上级代理', subAgents: 8, members: 207, activeMembers: 68, newActiveMembers: 18, depositAmount: 486000, withdrawalAmount: 182000, totalWinLoss: 218000, validBetting: 1640000, plan: '旺财团队月结方案', balance: 79806.45, lastLogin: '2026-07-15 09:22', subAgentDetails: [{ id: '373', account: 'WC002', registeredAt: '2026-06-02 12:30' }, { id: '374', account: 'LGNB', registeredAt: '2026-06-06 17:40' }, { id: '1750', account: 'dailiwc001a', registeredAt: '2026-06-18 09:15' }] }),
    agent({ id: '373', account: 'WC002', model: '负盈利模式', agentType: '团队代理', teamAgentType: '普通代理', developer: 'gaodashang', parentId: '345', email: 'wc002@example.com', registeredAt: '2026-06-02 12:30', settlementMode: '团队模式', identity: '副线', unit: 'gaodashang01部', lineId: 'LINE-B', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'gaodashang', subAgents: 2, members: 31, activeMembers: 37, newActiveMembers: 11, depositAmount: 168000, withdrawalAmount: 62000, totalWinLoss: 146000, validBetting: 780000, plan: '旺财团队月结方案', balance: 3100, lastLogin: '2026-07-14 18:36' }),
    agent({ id: '374', account: 'LGNB', model: '负盈利模式', agentType: '团队代理', teamAgentType: '普通代理', developer: 'gaodashang', parentId: '345', email: 'lgnb@example.com', registeredAt: '2026-06-06 17:40', settlementMode: '团队模式', identity: '副线', unit: 'gaodashang01部', lineId: 'LINE-C', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'gaodashang', subAgents: 1, members: 22, activeMembers: 23, newActiveMembers: 7, depositAmount: 92000, withdrawalAmount: 38000, totalWinLoss: 50000, validBetting: 410000, plan: '旺财团队月结方案', balance: 2850, lastLogin: '2026-07-13 20:10' }),
    agent({ id: '1749', account: 'dailiwc001', model: '负盈利模式', agentType: '单线代理', teamAgentType: '—', developer: 'apppay', parentId: '901', boundMemberAccount: 'M201749', email: 'dailiwc001@example.com', registeredAt: '2026-05-26 11:45', settlementMode: '单线代理', identity: '单线代理', unit: '单线代理01', lineId: 'SINGLE-001', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'apppay', subAgents: 1, members: 18, activeMembers: 46, newActiveMembers: 12, depositAmount: 214000, withdrawalAmount: 87000, totalWinLoss: 170000, validBetting: 920000, plan: '单线代理月结方案', balance: 68903.14, lastLogin: '2026-07-12 11:08' }),
    agent({ id: '1750', account: 'dailiwc001a', model: '负盈利模式', agentType: '多层级代理', developer: 'market02', parentId: '1050', registeredAt: '2026-06-18 09:15', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '旺财体育', status: '启用', parent: 'hddaili', subAgents: 0, members: 4, activeMembers: 3, newActiveMembers: 1, depositAmount: 18800, withdrawalAmount: 7200, totalWinLoss: 9500, validBetting: 64000, plan: '多层级返佣方案', balance: 1920, lastLogin: '2026-07-10 16:16' }),
    agent({ id: '1774', account: 'charles', model: '普通代理', agentType: '多层级代理', developer: 'market03', registeredAt: '2026-06-22 15:20', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '旺财体育', status: '启用', parent: '无上级代理', subAgents: 0, members: 3, activeMembers: 2, newActiveMembers: 1, depositAmount: 12000, withdrawalAmount: 4800, totalWinLoss: -18000, validBetting: 38000, plan: '多层级返佣方案', balance: 1960, lastLogin: '2026-07-06 16:41' }),
    agent({ id: '1109', account: 'FEE0428_A8', model: '负盈利模式', agentType: '星级代理', developer: 'fee0428', email: 'fee0428@example.com', registeredAt: '2026-04-28 18:12', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '财神客栈', status: '启用', parent: '无上级代理', subAgents: 4, members: 7, activeMembers: 6, newActiveMembers: 2, depositAmount: 74000, withdrawalAmount: 21000, totalWinLoss: 42000, validBetting: 260000, plan: '星级返佣方案', balance: 15000, lastLogin: '2026-07-01 19:20' }),
    agent({ id: '768', account: 'NA7', model: '负盈利模式', agentType: '多层级代理', developer: 'market04', registeredAt: '2026-03-10 08:20', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '财神客栈', status: '停用', parent: '无上级代理', subAgents: 0, members: 1, activeMembers: 0, newActiveMembers: 0, depositAmount: 3000, withdrawalAmount: 1200, totalWinLoss: -500, validBetting: 6500, plan: '多层级返佣方案', balance: 8000 }),
  ],
  teams: [
    {
      id: 'TEAM-001', code: 'DPT-001', name: 'gaodashang01部', teamType: '推广团队', developer: 'gaodashang', site: '旺财体育', currency: 'CNY', mainAgent: 'gaodashang', memberDetailPermission: false, createdAt: '2026-06-28 10:20', joinedAt: '2026-07-01 00:00', plan: '旺财团队月结方案', status: '生效中', startCycle: '2026-07', endCycle: '长期', previousNegative: 60000,
      cumulativeReceived: 220000, successfulTransfers: 28000, processingOccupied: 15000, otherDeductions: 3200,
      metrics: { newActive: 36, activeMembers: 128, memberWinLoss: 520000, totalWinLoss: 520000, venueFee: 26000, memberBonus: 18000, memberRebate: 12000, accountAdjustment: 8000, manualOrderWinLoss: 5000, depositFee: 2500, withdrawalFee: 2500, expenses: 60000, adjustment: 8000, currentNet: 472000, lastBalance: -60000, balanceAdjustment: 0, assessmentNet: 412000, correctedNet: 412000, commissionableNet: 412000, commissionAdjustment: 0, grade: '五星', rate: 0.5, payable: 206000 },
      lines: [
        { lineId: 'LINE-A', identity: '主线', agent: 'gaodashang', scope: '主线直属代理及会员', newActive: 18, firstDepositCount: 14, firstDepositAmount: 98000, activeMembers: 68, netWinLoss: 218000, status: '生效中', startCycle: '2026-07' },
        { lineId: 'LINE-B', identity: '副线', agent: 'WC002', scope: 'WC002 节点及直属会员', newActive: 11, firstDepositCount: 9, firstDepositAmount: 52000, activeMembers: 37, netWinLoss: 146000, status: '生效中', startCycle: '2026-07' },
        { lineId: 'LINE-C', identity: '副线', agent: 'LGNB', scope: 'LGNB 节点及直属会员', newActive: 7, firstDepositCount: 5, firstDepositAmount: 28000, activeMembers: 23, netWinLoss: 50000, status: '生效中', startCycle: '2026-07' },
      ],
    },
    {
      id: 'TEAM-002', code: 'DPT-002', name: 'apppay01部', teamType: '推广团队', developer: 'apppay', site: '旺财体育', currency: 'CNY', mainAgent: 'apppay', memberDetailPermission: true, createdAt: '2026-07-13 15:20', joinedAt: '2026-08-01 00:00', plan: '旺财团队月结方案', status: '待生效', startCycle: '2026-08', endCycle: '长期', previousNegative: 0,
      cumulativeReceived: 0, successfulTransfers: 0, processingOccupied: 0, otherDeductions: 0,
      metrics: { newActive: 0, activeMembers: 0, memberWinLoss: 0, totalWinLoss: 0, venueFee: 0, memberBonus: 0, memberRebate: 0, accountAdjustment: 0, manualOrderWinLoss: 0, depositFee: 0, withdrawalFee: 0, expenses: 0, adjustment: 0, currentNet: 0, lastBalance: 0, balanceAdjustment: 0, assessmentNet: 0, correctedNet: 0, commissionableNet: 0, commissionAdjustment: 0, grade: '零级', rate: 0, payable: 0 },
      lines: [
        { lineId: 'LINE-D', identity: '主线', agent: 'apppay', scope: '主线直属代理及会员', newActive: 0, firstDepositCount: 0, firstDepositAmount: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: '2026-08' },
        { lineId: 'LINE-E', identity: '副线', agent: 'dailiwc001', scope: '单线代理01原业务范围', newActive: 0, firstDepositCount: 0, firstDepositAmount: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: '2026-08' },
      ],
    },
  ],
  singles: [
    { id: 'SINGLE-001', code: 'SL-001', name: '单线代理01', owner: 'dailiwc001', site: '旺财体育', currency: 'CNY', source: '站点直接创建', recommender: 'apppay', plan: '单线代理月结方案', rewardPlan: '推荐奖励10%方案', status: '生效中·待转入', startCycle: '2026-07', scope: '单线代理本人节点', metrics: { newActive: 12, activeMembers: 46, currentNet: 170000, previousNegative: 0, assessmentNet: 170000, grade: '四星', rate: 0.4, payable: 68000 } },
    { id: 'SINGLE-002', code: 'SL-002', name: 'WC002 单线代理', owner: 'WC002', site: '旺财体育', currency: 'CNY', source: '副线转单线代理', recommender: 'gaodashang', plan: '单线代理月结方案', rewardPlan: '推荐奖励10%方案', status: '待生效', startCycle: '2026-08', scope: '原 LINE-B 业务范围', metrics: { newActive: 0, activeMembers: 0, currentNet: 0, previousNegative: 0, assessmentNet: 0, grade: '待计算', rate: 0, payable: 0 } },
  ],
  plans: [
    { id: 'PLAN-T-001', type: '团队佣金方案', name: '旺财团队月结方案', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', levels: [
      { grade: '一星', newActive: 5, firstDepositMembers: 3, firstDepositAmount: 15000, activeMembers: 20, netWinLoss: 50000, rate: 0.3 },
      { grade: '二星', newActive: 10, firstDepositMembers: 6, firstDepositAmount: 30000, activeMembers: 40, netWinLoss: 100000, rate: 0.35 },
      { grade: '三星', newActive: 15, firstDepositMembers: 9, firstDepositAmount: 50000, activeMembers: 60, netWinLoss: 180000, rate: 0.4 },
      { grade: '四星', newActive: 25, firstDepositMembers: 14, firstDepositAmount: 80000, activeMembers: 90, netWinLoss: 280000, rate: 0.45 },
      { grade: '五星', newActive: 35, firstDepositMembers: 20, firstDepositAmount: 120000, activeMembers: 120, netWinLoss: 400000, rate: 0.5 },
      { grade: '六星', newActive: 50, firstDepositMembers: 28, firstDepositAmount: 180000, activeMembers: 180, netWinLoss: 650000, rate: 0.55 },
    ] },
    { id: 'PLAN-S-001', type: '单线代理方案', name: '单线代理月结方案', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', levels: [
      { grade: '一星', newActive: 3, firstDepositMembers: 2, firstDepositAmount: 10000, activeMembers: 10, netWinLoss: 30000, rate: 0.25 },
      { grade: '二星', newActive: 5, firstDepositMembers: 3, firstDepositAmount: 18000, activeMembers: 20, netWinLoss: 60000, rate: 0.3 },
      { grade: '三星', newActive: 8, firstDepositMembers: 5, firstDepositAmount: 30000, activeMembers: 30, netWinLoss: 100000, rate: 0.35 },
      { grade: '四星', newActive: 12, firstDepositMembers: 8, firstDepositAmount: 50000, activeMembers: 45, netWinLoss: 160000, rate: 0.4 },
    ] },
    { id: 'PLAN-R-001', type: '推荐奖励方案', name: '推荐奖励10%方案', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', rewardRate: 0.1, rewardBase: '单线代理已审核应付佣金', deductedFromSingle: false },
    { id: 'PLAN-H-001', type: '历史代理方案', name: '多层级返佣方案', site: '全部站点', effectiveCycle: '历史兼容', status: '历史查询', levels: [] },
  ],
  bills: [
    bill({ id: 'BILL-T-202607-001', type: '团队佣金', unitId: 'TEAM-001', unitName: 'gaodashang01部', payee: 'gaodashang', agentType: '官方代理', becameAgentAt: '2026-05-08', teamType: '推广团队', teamMembers: 3, subAgentCount: 11, registeredCount: 276, firstDepositCount: 42, activeCount: 128, newActiveCount: 36, depositAmount: 746000, withdrawalAmount: 282000, totalWinLoss: 520000, venueFee: 26000, memberBonus: 18000, memberRebate: 12000, accountAdjustment: 8000, manualOrderWinLoss: 5000, depositFee: 2500, withdrawalFee: 2500, netWinLossRaw: 472000, lastBalance: -60000, correctedNet: 412000, site: '旺财体育', cycle: '2026-07', grade: '五星', rate: 0.5, netWinLoss: 412000, payable: 206000, issued: 120000, state: '部分发放', recommender: '—', reviewer: '若依', reviewedAt: '2026-07-14 09:20', issuedBy: '站点财务', issuedAt: '2026-07-14 10:10', createdAt: '2026-07-14 02:05' }),
    bill({ id: 'BILL-S-202607-001', type: '单线代理佣金', unitId: 'SINGLE-001', unitName: '单线代理01', payee: 'dailiwc001', becameAgentAt: '2026-05-26', activeCount: 46, newActiveCount: 12, depositAmount: 214000, withdrawalAmount: 87000, totalWinLoss: 205000, venueFee: 10250, memberBonus: 8000, memberRebate: 6750, accountAdjustment: -3000, manualOrderWinLoss: 0, depositFee: 3500, withdrawalFee: 3500, netWinLossRaw: 170000, lastBalance: 0, correctedNet: 170000, site: '旺财体育', cycle: '2026-07', grade: '四星', rate: 0.4, netWinLoss: 170000, payable: 68000, issued: 0, state: '待发放', recommender: 'apppay', reviewer: '若依', reviewedAt: '2026-07-14 09:30', createdAt: '2026-07-14 02:06' }),
    bill({ id: 'BILL-R-202607-001', type: '推荐奖励', unitId: 'SINGLE-001', unitName: '单线代理01', payee: 'apppay', agentType: '官方代理', becameAgentAt: '2026-04-20', totalWinLoss: 68000, netWinLossRaw: 68000, correctedNet: 68000, site: '旺财体育', cycle: '2026-07', grade: '—', rate: 0.1, netWinLoss: 68000, payable: 6800, issued: 0, state: '待审核', recommender: 'apppay', createdAt: '2026-07-14 02:07' }),
    bill({ id: 'BILL-T-202608-002', type: '团队佣金', unitId: 'TEAM-002', unitName: 'apppay01部', payee: 'apppay', agentType: '官方代理', teamType: '推广团队', teamMembers: 2, activeCount: 20, newActiveCount: 5, totalWinLoss: 65000, venueFee: 3250, memberBonus: 4000, memberRebate: 2750, accountAdjustment: 0, manualOrderWinLoss: 0, depositFee: 2500, withdrawalFee: 2500, netWinLossRaw: 50000, lastBalance: 0, correctedNet: 50000, site: '旺财体育', cycle: '2026-08', grade: '一星', rate: 0.3, netWinLoss: 50000, payable: 15000, issued: 0, state: '待提交', recommender: '—', createdAt: '2026-07-14 14:20' }),
    bill({ id: 'BILL-S-202606-002', type: '单线代理佣金', unitId: 'SINGLE-003', unitName: '单线代理03', payee: 'charles', becameAgentAt: '2026-06-22', totalWinLoss: -18000, netWinLossRaw: -18000, lastBalance: 0, correctedNet: -18000, site: '旺财体育', cycle: '2026-06', grade: '零级', rate: 0, netWinLoss: -18000, payable: 0, issued: 0, state: '无佣金结转', recommender: '—', createdAt: '2026-07-01 02:03' }),
  ],
  internalSettlements: [
    { id: 'IS-202607-001', teamId: 'TEAM-001', teamName: 'gaodashang01部', mainAgent: 'gaodashang', secondaryAgent: 'WC002', cycle: '2026-07', amount: 28000, basis: '固定金额', source: '平台已到账余额', state: '成功', voucher: '结算凭证-A01', createdAt: '2026-07-14 10:20' },
    { id: 'IS-202607-002', teamId: 'TEAM-001', teamName: 'gaodashang01部', mainAgent: 'gaodashang', secondaryAgent: 'LGNB', cycle: '2026-07', amount: 15000, basis: '参考副线业绩', source: '平台已到账余额', state: '处理中', voucher: '待补充', createdAt: '2026-07-14 11:05' },
  ],
  requests: [
    { id: 'REQ-202607-001', type: '副线转单线代理', applicant: 'WC002', currentUnit: 'gaodashang01部 / LINE-B', targetUnit: 'WC002 单线代理', effectiveCycle: '2026-08', recommender: 'gaodashang', status: '待站点复核', conflict: '无冲突', balanceHandling: '移出团队当月结余留在原团队', createdAt: '2026-07-14 09:30', note: '关系按目标周期切换，结余归属按当月规则处理。' },
    { id: 'REQ-202607-002', type: '单线代理加入团队', applicant: 'dailiwc001', currentUnit: '单线代理01', targetUnit: 'apppay01部 / 待分配 line_id', effectiveCycle: '2026-08', recommender: '—', status: '已批准·待生效', conflict: '无未结账单', balanceHandling: '加入团队当月结余随代理带入新团队', createdAt: '2026-07-13 16:40', note: '生效后停止推荐奖励，历史奖励不变。' },
    { id: 'REQ-202607-003', type: '团队换主线', applicant: '站点运营', currentUnit: 'gaodashang01部 / gaodashang', targetUnit: 'gaodashang01部 / WC001', effectiveCycle: '2026-08', recommender: '—', status: '待补充资料', conflict: '存在处理中内部结算', balanceHandling: '团队当月结余继续归属原团队', createdAt: '2026-07-14 12:10', note: '处理中资金完成后方可批准。' },
  ],
  activityDefinitions: [
    { id: 'ACTIVE', name: '活跃会员', depositThreshold: 100, validBetThreshold: 1000, period: '佣金当月', operator: '若依', updatedAt: '2026-07-15 15:30' },
    { id: 'NEW_ACTIVE', name: '新增活跃会员', depositThreshold: 100, validBetThreshold: 1000, period: '首存当月', operator: '若依', updatedAt: '2026-07-15 15:30' },
  ],
  agentCosts: [
    { id: 'COST-001', name: '场馆费', method: '总输赢 × 场馆费率', value: '5.00%', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', operator: '站点运营', updatedAt: '2026-07-15 15:30' },
    { id: 'COST-002', name: '存款手续费', method: '按实际渠道手续费汇总', value: '实际发生', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', operator: '站点运营', updatedAt: '2026-07-15 15:30' },
    { id: 'COST-003', name: '提款手续费', method: '按实际出款手续费汇总', value: '实际发生', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', operator: '站点运营', updatedAt: '2026-07-15 15:30' },
  ],
  siteCommissionConfig: { teamPlan: '旺财团队月结方案', singlePlan: '单线代理月结方案', rewardPlan: '推荐奖励10%方案', effectiveCycle: '2026-08', updatedBy: '站点运营', updatedAt: '2026-07-15 15:30' },
  teamOperations: [
    { id: 'TOP-001', teamId: 'TEAM-001', teamName: 'gaodashang01部', teamType: '推广团队', mainId: '345', mainAccount: 'gaodashang', secondaryAccounts: 'WC002、LGNB', action: '创建团队', reason: '市场推广代理线归集', operator: '站点运营', createdAt: '2026-06-28 10:20' },
    { id: 'TOP-002', teamId: 'TEAM-001', teamName: 'gaodashang01部', teamType: '推广团队', mainId: '345', mainAccount: 'gaodashang', secondaryAccounts: 'WC002', action: '新增副线', reason: '扩大团队业务范围', operator: '站点运营', createdAt: '2026-07-01 09:10' },
    { id: 'TOP-003', teamId: 'TEAM-002', teamName: 'apppay01部', teamType: '推广团队', mainId: '901', mainAccount: 'apppay', secondaryAccounts: 'dailiwc001', action: '加入团队待生效', reason: '单线代理申请加入', operator: '站点运营', createdAt: '2026-07-13 16:45' },
  ],
  agentBalanceAdjustments: [
    { id: 'ABA-001', agentId: '345', account: 'gaodashang', month: '2026-06', amount: 1200, reason: '历史已发佣金差异修正', operator: '若依', createdAt: '2026-07-12 14:20' },
  ],
  withdrawals: [
    { id: 'AWD-202607-001', orderNo: 'AWD202607150001', site: '旺财体育', withdrawalType: '佣金余额提现', agentId: '345', account: 'gaodashang', agentType: '官方代理', parentAccount: '无上级代理', currency: 'USDT', usdtAmount: 500, actualAmountCny: 3600, feeCny: 7.2, estimatedArrival: 3592.8, withdrawInfo: 'TRC20 · TNx8...8F2', appliedAt: '2026-07-15 09:20', status: '待审核', reviewer: '—', reviewedAt: '—', reviewRemark: '—', completedAt: '—' },
    { id: 'AWD-202607-002', orderNo: 'AWD202607140008', site: '旺财体育', withdrawalType: '佣金余额提现', agentId: '1749', account: 'dailiwc001', agentType: '普通代理', parentAccount: 'apppay', currency: 'USDT', usdtAmount: 800, actualAmountCny: 5760, feeCny: 7.2, estimatedArrival: 5752.8, withdrawInfo: 'TRC20 · TQm2...P6A', appliedAt: '2026-07-14 16:15', status: '处理中', reviewer: '站点运营', reviewedAt: '2026-07-14 16:40', reviewRemark: '资料核对通过，进入出款处理', completedAt: '—' },
    { id: 'AWD-202607-003', orderNo: 'AWD202607130006', site: '旺财体育', withdrawalType: '钱包余额提现', agentId: '373', account: 'WC002', agentType: '普通代理', parentAccount: 'gaodashang', currency: 'CNY', usdtAmount: 0, actualAmountCny: 1800, feeCny: 7.2, estimatedArrival: 1792.8, withdrawInfo: '支付宝 · 尾号 8821', appliedAt: '2026-07-13 11:32', status: '已拒绝', reviewer: '站点运营', reviewedAt: '2026-07-13 12:10', reviewRemark: '提款信息待补充', completedAt: '—' },
  ],
  siteQuota: { dailyQuota: 300000, successfulToday: 82000, pendingOccupied: 15000 },
}

export const LEGACY_REPORT_ROWS = {
  reversal: [
    ['旺财体育', 'gaodashang', '345', '团队代理', '团队负责人', 4, 170.45, 21687.56, 12000, 2500, 36358.01, 29237.56, 7120.45, 0, 0],
    ['财神客栈', 'FEE0427_B6', '916', '层级代理', '6层', 2, 0, 0, 0, 19651.35, 19651.35, 0, 19651.35, 0, 0],
    ['财神客栈', 'caishen12301', '344', '层级代理', '6层', 1, 15010, 0, 0, 0, 15010, 5000, 10010, 0, 0],
    ['财神客栈', 'NA8', '769', '星级代理', '4星', 1, 15000, 0, 0, 0, 15000, 0, 15000, 0, 0],
    ['财神客栈', 'FEE0428_A8', '1109', '星级代理', '5星', 1, 15000, 0, 0, 0, 15000, 15000, 0, 0, 0],
    ['财神客栈', 'FEE0428_B8', '1117', '团队代理', '副线', 1, 1000, 3069.3, 0, 10520, 14589.3, 0, 14589.3, 0, 0],
    ['旺财体育', 'WC002', '373', '团队代理', '副线', 2, 3100, 1755.66, 8300, 0, 13155.66, 12005.66, 1150, 1, 3206.38],
    ['财神客栈', 'facai', '349', '层级代理', '4层', 1, 0, 0, 9000, 0, 9000, 2100, 6900, 3, 17822],
    ['财神客栈', 'NA7', '768', '层级代理', '7层', 1, 8000, 0, 0, 0, 8000, 0, 8000, 1, 15000],
    ['财神客栈', 'FEE0428_A7', '1108', '层级代理', '7层', 1, 8000, 0, 0, 0, 8000, 8000, 0, 0, 0],
    ['旺财体育', 'WC001', '371', '星级代理', '3星', 1, 100, 4650, 3000, 0, 7750, 7750, 0, 0, 0],
    ['财神客栈', 'caishen123', '340', '团队代理', '单线代理', 1, 5, 7120, 0, 0, 7125, 178, 6947, 0, 0],
  ],
  returns: [
    ['旺财体育', 'gaodashang', '345', '团队代理', '团队负责人', '余额', '垫付', 6.23, 6.23, 'CZ536', '2026-07-13 11:24:01'],
    ['旺财体育', 'gaodashang', '345', '团队代理', '团队负责人', '余额', '垫付', 0.62, 0.62, 'CZ537', '2026-07-13 11:24:01'],
    ['旺财体育', 'dailiwc001', '1749', '团队代理', '单线代理', '余额', '回款', 94.34, 0, 'CZ492', '2026-07-13 02:02:30'],
    ['旺财体育', 'gaodashang', '345', '团队代理', '团队负责人', '余额', '垫付', 43.61, 43.61, 'CZ524', '2026-07-13 02:02:28'],
    ['旺财体育', 'WC002', '373', '团队代理', '副线', '级差佣金', '垫付', 1755.66, 1150, 'CZ526', '2026-07-11 02:06:00'],
    ['财神客栈', 'FEE0428_A8', '1109', '星级代理', '5星', '余额', '回款', 14692.5, 0, 'CZ475', '2026-04-28 23:08:38'],
    ['财神客栈', 'FEE0428_A6', '1107', '层级代理', '6层', '余额', '回款', 3000, 0, 'CZ473', '2026-04-28 23:08:37'],
    ['财神客栈', 'FEE0428_A7', '1108', '层级代理', '7层', '余额', '回款', 8000, 0, 'CZ474', '2026-04-28 23:08:37'],
    ['财神客栈', 'FEE0428_B8', '1117', '团队代理', '副线', '直属佣金', '垫付', 10520, 10520, 'CZ476', '2026-04-28 23:08:36'],
    ['财神客栈', 'NA7', '768', '层级代理', '7层', '余额', '垫付', 8000, 8000, 'CZ477', '2026-04-28 23:08:35'],
  ],
}

const BASE_NOTE = {
  updatedAt: UPDATED_AT,
  requirement: '在不改变原代理模式的前提下，以现有模块补字段和小页签，补齐团队代理三后台演示；佣金及关系结余冲突统一采用当月结余规则。',
  acceptance: '页面入口、筛选、字段、详情、弹窗和主要状态操作均可正常演示；金额、周期和角色口径与团队代理规则一致。',
  boundary: '本页用于业务演示，所有操作只影响当前演示过程，刷新页面后恢复初始内容。',
}

const NOTE_FORMULAS = {
  '团队代理管理': '计算公式：净输赢 = 总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费；冲正后净输赢 = 净输赢 + 上月结余 + 本月结余调整；本月结余 = 冲正后净输赢；佣金 = MAX（0，冲正后净输赢 × 佣金比例 + 佣金调整）。',
  '佣金方案': '计算公式：层级代理和星级代理只按层级或星级返佣比例计算；团队方案中已设置的新增活跃、活跃会员、总输赢门槛同时满足后取最高等级；未设置的门槛不参与判断；活跃会员和新增活跃均按本方案绑定的充值金额或有效投注门槛判定，满足任一项即计入；返佣比例以百分比展示，所有已设置值高层级不得低于低层级。',
  '代理佣金结算': '计算公式：净输赢 = 总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费；冲正后净输赢 = 净输赢 + 上月结余 + 本月结余调整；本月结余 = 冲正后净输赢；佣金 = MAX（0，冲正后净输赢 × 比例 + 佣金调整）；账单剩余 = 应付金额 − 累计成功发放；团队负责人不发放或减少发放的金额计入本月结余并随下个周期统计。',
  '佣金与内部结算记录': '计算公式：主线团队可用余额 = 累计成功到账 − 成功内部转账 − 处理中占用 − 其他扣减。',
  '佣金记录': '计算公式：待发佣金 = 佣金金额 − 已发佣金；代理身份展示规则 = 团队代理显示团队负责人、副线或单线代理，星级代理显示几星，层级代理显示几层。',
  '冲正回款报表': '计算公式：额度缺口 = 同一冲正账目原欠款额度 − 累计成功回款金额；本次记录为“垫付”时增加待回款额度，为“回款”时减少额度缺口。',
  '代理收益看板': '计算公式：本期佣金预计净收益 = 总推广佣金 − 已结算佣金；未收回欠款 = 该代理欠款 − 已收回金额；活跃代理、活跃会员、付费会员与新增付费按查询日期范围统计。',
  '负盈利代理报表': '计算公式：净输赢 = 总输赢 − 场馆费 − 红利 − 返水 + 账户调整 − 存款手续费 − 提款手续费 + 补单输赢；冲正后净输赢 = 净输赢 + 上月结余；佣金 = MAX（0，冲正后净输赢 × 佣金比例 + 佣金调整）。',
  '代理团队经营看板': '计算公式：团队三个指标 = 主线与全部有效副线在业务范围内去重汇总；本月结余 = 净输赢 + 上月结余 + 本月结余调整；平台应付佣金 = MAX（0，本月结余 × 最终比例 + 佣金调整）。',
  '副线内部结算': '计算公式：主线团队可用余额 = 累计成功到账 − 成功内部转账 − 处理中占用 − 其他扣减；本次金额不得超过可用余额。',
  '会员打码流水统计表': '计算公式：总余额 = 可提现余额 + 锁定余额；单项还需解锁流水 = MAX（0，目标流水 − 已完成有效流水）；场馆提现流水 = 各场馆及通用任务还需解锁流水之和；充值提现流水 = 当前周期内各笔充值与系统发放彩金的剩余流水之和；盈利解锁额度 = MAX（0，当前总余额 − 本轮充值与系统发放彩金计入额度）；亏损时不展示盈利额度，盈利需本轮全部充值流水完成后可领取；锁定余额/锁定额度会随用户有效投注确认结果重新计算。',
}

const SECONDARY_ROLE_NOTE = '副线为团队内成员身份，只代表本人 line_id 范围内代理和会员经营，平台团队账单仍由团队负责人统一承接，副线收益通过主线内部结算体现，不再出现旧称呼。'

function note(title, summary, fields, logic, related, record, overrides = {}) {
  const splitAt = record.indexOf('：')
  const recordDate = splitAt >= 0 ? record.slice(0, splitAt) : UPDATED_AT
  const recordContent = splitAt >= 0 ? record.slice(splitAt + 1) : record
  const formula = NOTE_FORMULAS[title]
  const trimEnding = (value) => String(value).replace(/[。；;]\s*$/, '')
  const withFormula = formula ? `${trimEnding(logic)}；${formula}` : logic
  const needsSecondaryNote = /副线|团队代理|line_id|结算身份/.test(`${summary}${fields}${logic}`)
  const finalLogic = needsSecondaryNote && !withFormula.includes('副线为团队内成员身份') ? `${trimEnding(withFormula)}；${SECONDARY_ROLE_NOTE}` : withFormula
  return { ...BASE_NOTE, ...overrides, title, summary, fields, logic: finalLogic, related, record: `修改时间：${recordDate}；修改说明：${trimEnding(summary)}；修改内容：${recordContent}` }
}

export const PAGE_NOTES = {
  'master:version': note('版本需求归档', '按总控、站点、代理后台集中展示 1.0 与 2.0 版本需求及页面跳转。', '版本、完成时间、模块说明、修改说明、功能验收和页面入口。', '同一版本内仅保留每个业务项的最新说明，未完成的后续增强不计入已完成模块。', '关联三个后台的团队代理功能、会员流水统计、佣金管理、当月结余和代理自助页面。', '2026-07-17 05:50：覆盖更新 2.0 三后台代理模块说明，去除代理提款和单线代理管理独立入口，保留团队代理、佣金、报表和角色权限说明。', {
    updatedAt: UPDATED_AT,
    requirement: '按总控后台、站点后台和代理后台归档最新业务需求；同一版本同一模块只保留最新说明，并提供可用的页面跳转。',
    acceptance: '2.0 版本可按三后台看到会员流水、代理资料、佣金、团队关系和角色报表的最新说明与可用入口；代理提款和单线代理管理不再作为独立模块出现；1.0 归档保持可查询。',
  }),
  'master:memberTurnover': note('会员打码流水统计表', '集中统计会员充值、系统发放彩金、余额、提现资格、盈利解锁额度和未完成打码流水，支持分别查看场馆归集明细与按发生顺序的充值提现流水记录。', '站点、代理、会员、充值额度、总余额、可提现余额、锁定余额、场馆提现流水、充值提现流水、盈利解锁额度、记录顺序、记录类型、发生时间、计入额度、目标流水、已完成流水、还需解锁流水和状态。', '查询仅汇总已确认的有效流水；无可靠单独场馆归属时显示为“通用”。充值提现流水将成功充值与系统发放彩金均视为独立记录，无需关联充值订单，按发生时间 FIFO 解锁；前一笔未完成时不得跳过。有效投注确认后，已完成流水、剩余解锁量和对应锁定额度同步更新；盈利解锁额度仅在本轮盈利时展示，亏损无额度，且需本轮全部充值流水完成后才可领取。', '关联会员充值、会员钱包、H5 提现、场馆活动流水和运营查询。', '2026-07-15 14:20：列表去除打码状态和归因类型字段，仅保留站点、代理、会员等核心统计筛选与两类流水明细入口。', {
    updatedAt: '2026-07-15 14:20',
    requirement: '在会员管理下只维护会员打码流水统计表，帮助产品、运营和客服快速解释会员为什么可提、为什么仍有锁定余额，以及充值、系统发放彩金和盈利解锁额度的释放顺序。',
    acceptance: '可按站点、代理和会员查询；列表不展示打码状态和归因类型；点击场馆提现流水可看到每个场馆或“通用”的锁定额度、目标流水、已完成、待确认、剩余流水和状态；点击充值提现流水可看到充值与系统发放彩金的顺序、类型、发生时间、额度、目标/已完成/剩余流水和状态，并核对盈利解锁额度需本轮全部充值流水完成后领取的规则；H5 提现页金额标题下方可查看可提现、锁定和“解锁条件”，弹层第一列直接显示场馆名称、充值或彩金名称，不展示已解锁记录和盈利解锁额度行。',
    boundary: '本页为只读统计演示，使用固定模拟数据，不提供人工调整、任务创建或其他会员业务表；刷新页面后恢复初始内容。',
  }),
  'master:agents': note('代理列表', '在“代理管理”大模块下展示代理列表与新增、修改、修改密码操作，并将代理身份与代理层级分开呈现。', '代理ID、代理账号、代理身份、代理注册时间、代理类型、代理层级、站点编码、上级代理、代理状态、谷歌验证、下属代理、下属会员、佣金方案、代理返佣比例、代理钱包余额和最后登录；新增与修改弹窗保留原代理账号、密码、站点、佣金方案、运营费、上级、状态和备注等基础字段，团队代理下的原团队类型改为代理身份，原代理身份改为代理层级。', '代理身份固定使用官方代理或普通代理，在所有代理列表中紧跟代理账号展示；代理层级用于展示团队负责人、副线、单线代理或星级/层级归属。代理类型保留多层级代理、星级代理，并新增团队代理和单线代理。新增代理选择团队代理时，代理层级固定为团队负责人；选择单线代理时代理层级固定为单线代理并使用单线代理月结方案。修改弹窗中，单线代理改为团队代理并选择副线时，必须选择加入站点和目标团队；单线代理改为团队负责人时，必须填写新的团队名称。', '关联团队代理管理、佣金方案、代理佣金结算和佣金记录。', '2026-07-18 10:20：统一代理列表身份字段口径；修改内容：三后台代理列表在代理账号右侧新增官方代理/普通代理身份列，原团队类型改名为代理身份，原代理身份改名为代理层级，并同步详情和新增/修改弹窗。', { updatedAt: '2026-07-18 10:20' }),
  'master:negativeProfit': note('负盈利代理报表', '在代理管理下新增负盈利代理报表，按佣金周期集中查看负盈利模式代理及负向结余账单的经营、成本、结余、佣金和审核发放结果。', '序号、佣金周期、团队名称、代理编号、代理账号、团队类型、上级账号、团队人数、下级人数、注册人数、首存人数、活跃人数、新增活跃人数、存款金额、提款金额、总输赢、场馆费、红利、返水、账户调整、存款手续费、提款手续费、补单输赢、净输赢、上月结余、冲正后净输赢、佣金比例、佣金调整、佣金、佣金状态、成为代理时间、加入团队时间、发放人、发放时间、审核人员、审核时间、审核状态、维护人和调整原因；列表底部总计按负盈利代理明细字段逐列展示当前筛选结果的字段总计。', '报表按佣金周期、团队类型、佣金状态、审核状态、代理或团队关键字查询；字段筛选支持多选负盈利代理明细中的全部字段，运营可按当前核对重点勾选任意列组合，宽表的左右拉动条固定在负盈利代理明细列表下方，不再撑到页面底部。报表展示负盈利模式代理及冲正后净输赢为负的账单记录；总计是负盈利代理明细的字段总计，随字段筛选逐列展示当前字段，数值字段按当前筛选结果求和，非数值字段用于定位或显示横线，不随分页切换变化；净输赢按总输赢扣除场馆费、红利、返水和手续费后计入账户调整与补单输赢；冲正后净输赢叠加上月结余；佣金按冲正后净输赢乘佣金比例再加佣金调整且不小于零。', '关联代理列表、团队代理管理、代理佣金结算、佣金记录和代理收益看板。', '2026-07-18 05:29：总计改为负盈利代理明细字段总计；修改内容：明细宽表底部新增逐列总计行，按当前字段筛选展示对应字段，数值字段按当前筛选结果求和，非数值字段显示总计、当前筛选条数或横线。', { updatedAt: '2026-07-18 05:29' }),
  'master:agentOperations': note('代理操作记录', '在代理管理下新增代理操作记录，用于集中回放代理团队创建、副线调整、关系变更和团队状态调整等操作流水。', '筛选字段包含团队名称、团队类型、代理编号、代理账号和创建时间；列表字段包含序号、团队名称、团队类型、主线编号、主线账号、副线账号、操作内容、操作理由、操作时间和操作人。', '团队名称和团队类型使用下拉筛选；代理编号匹配主线编号，代理账号同时匹配主线账号和副线账号；创建时间按起止日期筛选。副线账号可包含多个账号，列表中按标签排列展示，便于运营快速识别本次操作影响的副线范围。', '关联代理列表、团队代理管理、模式变更审核、关系与模式申请和修改代理关系记录。', '2026-07-18 05:28：新增代理操作记录；修改内容：在代理管理大模块下新增代理操作记录页面，增加团队名称、团队类型、代理编号、代理账号和创建时间筛选，并新增操作记录列表。', { updatedAt: '2026-07-18 05:28' }),
  'master:teams': note('团队代理管理', '集中管理代理部、团队负责人、团队成员列表、会员归属、合并业绩、团队当前余额和团队业绩查看。', '代理部、团队类型、主线、副线、line_id、团队成员、会员人数、团队代理总人数、总会员数、活跃会员数、副线数、单线代理数、团队当前余额、未结算收益、当前返佣星级、团队返佣等级、距离下一等级条件、代理名称、统计日期、活跃会员、新增活跃、新增首存、首存额度、总盈亏、运营费用、净收益、团队贡献占比、总计和状态。', '团队列表去除顶部四个汇总标签和团队副线/单线列，保留团队成员与会员人数下钻；团队成员展示代理名称、代理身份和代理ID，会员人数展示会员名称和上级代理。列表操作中的开副线只打开新增副线弹窗，不切换到团队详情。团队详情仅保留团队概况、团队成员列表和团队业绩查看，不再展示团队账单、关系记录和操作记录。团队概况顶部展示团队当前余额与未结算收益，不再展示主线团队可用余额；当前返佣星级作为团队概况主体展示，用大号等级和返佣比例突出当前命中结果，下一等级所需条件作为副体展示新增活跃、新增首存、首存额度、活跃会员和团队当前余额差距。团队详情的“主副线结构”改为“团队成员列表”，按每条 line_id 展示代理名称、活跃会员、新增活跃、新增首存、首存额度、总盈亏和状态，不再展示显式业务范围和操作字段；活跃会员和新增活跃人数可点击查看该代理本人直属会员明细，不展示其他副线或团队汇总会员。团队详情的“团队分佣结算”改为“团队业绩查看”，去除上方四个大标签和历史结算记录，仅保留业绩列表；可按代理名称、身份、line_id 和统计日期查询，并可导出当前筛选结果；列表去除本期预估分红、发放状态、操作、历史欠款和代理结余字段，列表下方展示当前筛选结果总计；分页和每页条数可切换。新增首存统计本周期首次成功存款会员数，首存额度为这些会员首笔成功存款金额合计；总盈亏 = 各线路总输赢合计，净收益 = 总盈亏 − 运营费用。团队合并主线与有效副线范围后统一定级，每周期只生成一张团队账单并只付主线；加入团队当月结余随代理带入，移出时留原团队，解散时剩余结余由指定代理承接。', '关联代理资料、佣金管理、代理佣金结算和模式变更审核。', '2026-07-18 21:05：精简团队详情导航；修改内容：移除团队账单、关系记录和操作记录三个页签及对应列表，团队详情仅保留团队概况、团队成员列表和团队业绩查看。', { updatedAt: '2026-07-18 21:05' }),
  'master:plans': note('佣金方案', '按原返佣方案页面维护方案列表，在原配置中支持新增层级、星级和团队代理方案；当前详情页去除“推荐奖励”切页，仅保留代理返佣方案。', '序号、返佣方案名称、方案详情、创建时间、最后操作人、操作时间和操作；新增和修改代理方案弹窗包含方案名称、方案类型、代理层级或星级、团队级别、新增活跃、活跃会员、总输赢、返佣比例、活跃会员判定条件、新增活跃判定条件和删除操作。', '团队佣金方案作为原返佣方案中的一条配置，不单独新增方案模块；新增代理方案时可选择层级代理、星级代理或团队代理。层级代理和星级代理只维护对应层级或星级的返佣比例；团队代理可维护新增活跃、活跃会员和总输赢门槛，留空代表该条件不生效；活跃会员和新增活跃均按当前方案绑定的充值金额或有效投注门槛判定，满足任一项即计入，不再使用全局活跃条件。本页不再展示推荐奖励独立切页。', '关联代理列表、团队代理管理、代理佣金结算和站点佣金方案。', '2026-07-17 20:54：佣金方案详情页去除推荐奖励切页；修改内容：移除推荐奖励模板列表、新增推荐奖励模板、配置站点和相关弹窗，仅保留代理返佣方案列表与新增/修改代理方案能力。', { updatedAt: '2026-07-17 20:54' }),
  'master:settlement': note('代理佣金结算', '按原后台代理佣金结算未发放区域重构列表，用代理类型和代理身份替代原星级、层级两列，并补充团队负责人发放控制。', '代理名称、所属站点、代理类型、代理身份、返佣比例、账单类型、直属上级代理、账期范围、代理直属会员盈亏、本月收益、本月结余和操作。', '代理类型统一为团队代理、星级代理和层级代理；本页团队代理身份不再展示副线，改为团队负责人、团队成员或单线代理；星级代理显示几星，层级代理显示几层。团队负责人可选择不发放或修改发放金额，不发放或减少发放的金额记入本月结余并随下个周期一起统计；0收益代理可一键全部确认，不影响有收益账单。站点账单不属于代理身份，使用横线占位。', '关联佣金方案、代理列表、团队代理管理、佣金记录和站点账单发放。', '2026-07-17 17:17：代理佣金结算页去除代理身份中的副线展示，团队负责人增加不发放和修改发放，新增一键结算0收益代理，并展示本月结余记账金额。', { updatedAt: '2026-07-17 17:17' }),
  'master:records': note('佣金记录', '按原后台佣金发放记录样式展示佣金周期、代理账号、站点名称、代理类型、代理身份、金额、方案、状态和发放信息。', '佣金周期、代理账号、站点名称、代理类型、代理身份、总输赢、月流水、首充金额、留存天数、佣金金额、返佣方案、佣金状态、发放时间、发放人员和详情。', '代理类型分为团队代理、星级代理和层级代理；团队代理身份展示团队负责人、副线或单线代理，星级代理展示几星，层级代理展示几层。记录详情沿用同一身份口径，不再在佣金记录列表中展示单独星级或层级字段。', '关联代理佣金结算、团队账单、单线代理账单、推荐奖励和主线可用余额。', '2026-07-17 16:44：佣金记录中的团队代理身份统一为团队负责人、副线和单线代理。', { updatedAt: '2026-07-17 16:44' }),
  'master:reversal': note('冲正统计报表', '按截图重构冲正统计详情页，用原报表密度统计代理冲正业务数据，并补充代理类型与代理身份识别。', '所属站点、代理账号、ID、代理类型、代理身份、垫付冲正代理总人数、垫付余额、垫付级差佣金、垫付会员盈利、垫付直属佣金、垫付总计、回款总计、垫付剩余金额、欠款人数和欠款总计。', '代理类型分为团队代理、星级代理和层级代理；团队代理身份展示团队负责人、副线或单线代理，星级代理展示几星，层级代理展示几层。垫付总计 = 垫付余额 + 垫付级差佣金 + 垫付会员盈利 + 垫付直属佣金；垫付剩余金额 = 垫付总计 − 回款总计；欠款总计用于统计仍需追回的欠款额度。', '关联佣金记录、团队账单、代理列表和冲正回款报表。', '2026-07-17 16:44：冲正统计中的团队代理身份统一为团队负责人、副线和单线代理。', { updatedAt: '2026-07-17 16:44' }),
  'master:returns': note('冲正回款报表', '按原回款明细样式重构列表，并在 ID 右侧补充代理类型与代理身份。', '所属站点、名称、ID、代理类型、代理身份、类型、垫付或回款、额度、额度缺口、冲正账目ID和时间。', '代理类型分为团队代理、星级代理和层级代理；代理身份按类型展示，团队代理显示团队负责人、副线或单线代理，星级代理显示几星，层级代理显示几层；原代理等级字段不再单独展示。回款只冲减原冲正台账，不直接改变团队主副线关系。', '关联冲正统计、佣金账单和代理余额。', '2026-07-17 16:44：冲正回款中的团队代理身份统一为团队负责人、副线和单线代理。', { updatedAt: '2026-07-17 16:44' }),
  'master:revenue': note('代理收益看板', '按截图重构为原后台收益明细宽表，用站点、代理账号和查询日期筛选代理经营与会员统计数据。', '所属站点、代理编号、代理账号、上级代理、账期范围、本期佣金预计净收益、当前余额、总推广佣金、已结算佣金、总充值、总提现、总投注、有效投注、总盈亏、该代理欠款、未收回欠款、会员VIP福利、活动福利、会员推广福利、充提手续费运营费、代理总人数、新增代理、活跃代理、会员总数、新增会员、活跃会员、付费会员、新增付费、代理推广会员、会员推广会员和30天未登录会员数。', '查询以所属站点、代理账号和日期范围为条件，默认展示当天凌晨查询范围；当前演示状态保留空表“暂无数据”。金额类指标用于对比代理收益、充值提现、投注输赢、福利成本、欠款和运营费，人数类指标用于观察代理与会员增长和活跃情况。', '关联代理列表、代理佣金结算、佣金记录、冲正统计报表和冲正回款报表。', '2026-07-17 03:12：按截图重构代理收益看板，改为原后台页签、说明头、筛选条、导出下载和收益宽表样式。', { updatedAt: '2026-07-17 03:12' }),
  'master:cycle': note('结算周期设置', '按原后台设置页样式配置站点、普通代理和团队代理的自动结算周期与执行时间。', '站点、代理类型、结算周期、结算频率、每周或每月结算日、执行具体时间、当前类型和下一次执行时间。', '普通代理与团队代理分别维护结算周期；团队代理与普通代理拥有相同的周结和月结选项，但可保存不同执行日和时间。保存后的周期在本次周期执行完成后开始生效，关系、方案和推荐变更仍只能从未来完整周期生效。', '关联代理佣金结算、佣金记录、团队代理管理、修改代理关系记录和账单生成。', '2026-07-17 03:20：按截图重构结算周期设置页，新增团队代理结算类型切换，普通代理和团队代理可分别配置周结/月结、结算日和执行时间。', { updatedAt: '2026-07-17 03:20' }),
  'master:relations': note('团队代理关系变更记录', '统一回放关系申请与团队生命周期操作，并明确每次变更的当月结余归属。', '变更类型、申请人、原结算单元、目标结算单元、生效周期、当月结余处理、冲突、状态、团队类型、主副线账号、操作人和时间。', '变更必须无周期重叠或空档；加入团队结余带入，移出留原团队，解散由指定代理承接，历史账单保持原结算单元。', '关联团队代理、单线代理、站点审核、团队操作记录和周期设置。', '2026-07-15 15:30：增加当月结余处理字段及团队操作记录页签，覆盖旧负值结余关系口径。'),
  'site:teams': note('团队代理管理', '按总控同名页面结构管理旺财体育本站代理部、团队成员列表、直属会员下钻和团队生命周期。', '代理部、团队类型、团队负责人、团队人数、会员人数、团队副线/单线、团队代理总人数、总会员数、活跃会员数、副线数、单线代理数、团队当前余额、未结算收益、当前返佣星级、团队返佣等级、距离下一等级条件、创建时间、加入时间、团队方案、生效周期、代理名称、活跃会员、新增活跃、新增首存、首存额度、净输赢和状态。', '站点后台不展示跨站点选择，只处理旺财体育本站团队。团队人数、会员人数、团队副线和单线数量均可点击查看本站明细；团队详情顶部同步展示团队当前余额与未结算收益，并在团队概况中列出团队代理总人数、总会员数、活跃会员数、副线和单线代理，不展示主线团队可用余额。当前返佣星级为详情主体，使用大号星级和返佣比例突出当前命中等级；下一等级所需条件为副体，用于查看本站团队升档差距。团队详情按每条线路展示代理名称、活跃会员、新增活跃、新增首存、首存额度和净输赢，不再展示业务范围；活跃会员和新增活跃可点击查看该代理本人直属会员。加入团队结余带入、移出留原团队、解散由指定代理承接；冻结期间停止新增关系和资金操作。', '关联代理列表、模式变更审核、佣金方案、代理佣金结算、内部结算监控和团队操作记录。', '2026-07-17 18:03：站点团队详情同步团队成员列表口径；修改内容：负责人改为代理名称，活跃会员移到代理名称右侧，去除业务范围字段，并为新增活跃和活跃会员增加直属会员明细弹窗。', { updatedAt: '2026-07-17 18:03' }),
  'site:review': note('模式变更审核', '集中审核副线转单线代理、单线代理加入团队和团队换主线，并核对当月结余归属。', '申请类型、申请人、原目标单元、生效周期、推荐人、当月结余处理、冲突和审核状态。', '审核前检查重复归属、未结账单、冻结资金和周期冲突；关系通过后结余按加入带入、移出留原团队、解散指定承接执行。', '关联团队代理、单线代理、账单和关系记录。', '2026-07-15 15:30：审核列表与详情补充当月结余归属说明并统一为 Excel 规则。'),
  'site:plans': note('佣金方案', '按总控同名页面结构查看和维护旺财体育本站生效的团队、单线代理和推荐奖励方案。', '方案版本、方案类型、生效周期、等级、新增活跃、活跃会员、总输赢、佣金比例、奖励基数、活跃会员判定条件、新增活跃判定条件、场馆费和存提款手续费。', '站点只能维护本站方案组合，不可修改其他站点配置；层级代理和星级代理只维护返佣比例；团队等级中已设置的新增活跃、活跃会员和总输赢门槛需同时满足，活跃会员与新增活跃判定条件跟随方案生效，方案变更只影响未来完整周期，历史账单继续使用当期快照。', '关联总控佣金方案、团队代理管理、代理佣金结算和代理端只读方案。', '2026-07-17 16:56：同步总控佣金方案新口径，去除首充人数和首充额度，团队方案的活跃会员和新增活跃判定条件改为随方案维护。', { updatedAt: '2026-07-17 16:56' }),
  'site:settlement': note('代理佣金结算', '按总控同名页面结构处理旺财体育本站团队、单线代理和推荐奖励账单。', '代理账号、代理类型、代理身份、账单类型、结算单元、收款人、当月结余、应付、已发、剩余、站点日额度和状态。', '站点列表不展示所属站点列，数据固定为旺财体育；账单审核通过后锁定关系和计算结果，站点可提交审核并按账单剩余与当日剩余额度执行部分发放。', '关联总控代理佣金结算、佣金记录、站点额度和资金明细。', '2026-07-17 05:33：同步总控代理类型和代理身份字段，去除跨站点字段，并保留本站提交、审核和部分发放操作。', { updatedAt: '2026-07-17 05:33' }),
  'agent:dashboard': note('代理团队经营看板', '按主线、副线和单线代理身份展示各自可见的经营数据、当月结余和操作。', '团队身份、活跃指标、净输赢、上月结余、本月结余调整、冲正后净输赢、等级、账单、可用余额和关系状态。', '主线看团队合并口径，副线只看本人范围，单线代理独立考核；佣金按当月结余计算，三种身份资金边界互不混用。', '关联团队结构、佣金账单、内部结算和关系申请。', '2026-07-17 05:50：代理后台去除代理提款独立入口，经营看板继续保留经营、佣金和关系申请口径。'),
  'agent:bills': note('代理佣金结算', '按总控同名页面口径只读展示当前演示身份本人的平台账单或内部结算记录。', '代理类型、代理身份、账单类型、周期、结算单元、冲正后净输赢、比例、应付、已发、剩余、状态、活跃定义、代理成本和站点方案。', '代理后台不展示所属站点、其他团队或其他代理字段；团队负责人和单线代理只读查看本人平台账单，副线不生成平台应付账单，只查看主线向本人的内部结算。', '关联佣金方案、佣金记录和副线内部结算。', '2026-07-17 05:33：统一页面名称与总控一致，补充代理类型和代理身份，并按当前身份裁剪为只读本人数据。', { updatedAt: '2026-07-17 05:33' }),
  'agent:internal': note('副线内部结算', '主线自主向副线结算，副线只查看本人收到的记录。', '副线、金额、结算依据、资金来源、状态、凭证和时间。', '使用平台已到账余额时，本次金额不得超过主线团队可用余额。', '关联团队账单、主线余额和副线收款。', '2026-07-14：新增可用余额校验、主线录入和副线只读视图。'),
  'agent:requests': note('关系与模式申请', '发起开副线、转单线代理、加入团队或终止单线申请，并查看团队操作记录。', '申请类型、原目标单元、生效周期、推荐人、当月结余处理、冲突、状态、操作人和时间。', '关系从下一完整周期生效；加入团队结余带入、移出留原团队、解散由指定代理承接，历史账单不回写。', '关联站点审核、团队结构、单线代理、佣金账单和团队操作记录。', '2026-07-15 15:30：补充当月结余处理和团队操作记录页签，统一关系变更规则。'),
  h5: note('H5 提现额度与解锁条件说明', '顶部展示中心钱包、锁定钱包和福利中心；页面保持 H5 手机端窄屏样式，选择提现方式后展开账户、金额、资金密码和解锁条件。', '中心钱包、锁定钱包、福利中心、一键回收、隐藏无余额场馆、提现方式、提现账户、提现金额、可提现、锁定、解锁条件、类型、手续费、实际到账、最低提现额度和资金密码。', '提现金额不得超过当前可提现金额；可提现与锁定金额展示在提现金额标题下方、输入框上方，文案简化为“可提现 / 锁定”且不展示单位。“解锁条件”弹窗以“类型 / 锁定额度 / 还需解锁流水”展示，合并核对场馆流水、充值流水和彩金流水，只展示仍需解锁的记录，不展示已解锁记录和盈利解锁额度行；第一列直接显示名称：场馆显示场馆名称，充值显示“充值”，彩金显示具体名称如 VIP周礼金、返水或活动奖励。弹窗底部提示投注流水同步可能存在延迟，如当前解锁额度与实际情况不符，请稍后刷新并重新查看。', '关联会员打码流水统计表、会员充值、会员钱包、场馆流水和会员取款方式。', '2026-07-16 17:27：解锁条件弹层第一列表头由“流水类型”调整为“类型”，其余锁定额度和还需解锁流水展示规则不变。', { updatedAt: '2026-07-16 17:27' }),
}

const BALANCE_LOGIC = '净输赢 = 总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费；当月结余 = 冲正后净输赢 = 净输赢 + 上月结余 + 本月结余调整；佣金 = MAX（0，当月结余 × 佣金比例 + 佣金调整）。'
const RELATION_LOGIC = `所有记录按所属团队、line_id、结算身份、结算单元和生效周期归集；关系变更只影响未来完整周期，当前周期与历史记录不回写；${SECONDARY_ROLE_NOTE}`
const REPORT_NOTE_SPECS = {
  members: ['代理会员', '查询代理范围内会员的当前归属和经营概况。', '会员账号、直属代理、所属团队、line_id、结算身份、结算单元、关系生效时间、首存、余额、有效投注、输赢和状态。', '关联代理列表、存款记录、游戏记录、账变明细和会员打码流水统计。'],
  finance: ['代理财务', '汇总代理或结算单元的资金、成本、当月结余与佣金结果，指标卡可下钻。', '代理、团队、线路、结算身份、存提款、总输赢、费用、净输赢、上月结余、本月结余调整、当月结余、佣金和状态。', '关联佣金方案、代理佣金结算、个人佣金、佣金记录和站点利润。'],
  deposits: ['存款记录', '逐笔查询会员存款与代理代存结果。', '存款单号、会员、直属代理、团队、线路、结算身份、渠道、金额、手续费、状态和时间。', '关联代理代存、预付金账户、会员余额、账变明细和充提转账统计。'],
  games: ['游戏记录', '逐笔查询会员投注、有效投注、派彩和输赢结果。', '注单号、会员、直属代理、团队、线路、场馆、游戏、投注、有效投注、派彩、输赢、状态和时间。', '关联代理会员、代理财务、场馆代理费用和佣金结算。'],
  accountChanges: ['账变明细', '回放会员与代理资金变化前后值及业务来源。', '账变单号、账户、账户类型、直属代理、团队、线路、钱包、账变类型、变更前、变更金额、变更后、状态和时间。', '关联佣金发放、内部结算、代理代存、代理提现资金流水和存款记录。'],
  transfers: ['转账明细', '查询平台佣金、内部结算、代理代存和代理提现资金流水的去向。', '转账单号、付款方、收款方、代理、团队、线路、结算身份、类型、金额、手续费、状态和时间。', '关联账单发放、内部结算、代理代存、代理提现资金流水和账变明细。'],
  transferStats: ['充提转账统计', '按代理、团队、线路和结算单元汇总充提与转账结果。', '统计周期、代理、团队、线路、结算身份、充值笔数与金额、提款笔数与金额、转入、转出和净流入。', '关联存款记录、代理提现资金流水、转账明细和代理财务。'],
  venueFees: ['场馆代理费用', '按场馆和结算单元查看总输赢、费率和场馆费用。', '周期、代理、团队、线路、结算身份、场馆、总输赢、场馆费率、场馆费、扣费后金额和状态。', '关联游戏记录、代理财务、佣金结算和站点利润。'],
  commissionRecords: ['佣金记录', '按当前后台角色查询平台佣金与主线内部结算的计算基数、发放和剩余金额。', '佣金单号、代理类型、代理身份、类型、收款代理、业务线路、结算单元、周期、当月结余、比例、调整、应付、已发、剩余和状态。', '关联佣金方案、代理佣金结算、个人佣金、内部结算和账变明细。'],
  reversal: ['冲正统计报表', '保留总控同名报表的冲正汇总口径，并按后台角色裁剪站点、团队和代理范围。', '代理、代理类型、代理身份、业务线路、结算单元、垫付人数、垫付金额、已回款、欠款和状态。', '关联佣金记录、冲正回款报表和代理财务。'],
  returns: ['冲正回款报表', '逐笔查询当前角色范围内的冲正垫付、回款方向和剩余缺口。', '回款记录号、代理、代理类型、代理身份、业务线路、结算单元、类型、垫付金额、回款金额、剩余缺口、状态和时间。', '关联冲正统计报表、账变明细和个人佣金。'],
  siteProfit: ['站点利润', '按结算单元查看站点收入、经营成本、佣金和留存利润。', '站点、周期、结算单元、结算模式、总输赢、场馆费、红利、返水、佣金、手续费、站点利润和状态。', '关联代理财务、场馆代理费用、佣金记录和运营首页。'],
  prepaid: ['预付金账户', '查询并调整代理预付金额度、冻结金额和当前可用余额。', '代理、团队、线路、结算身份、结算单元、信用额度、可用预付金、冻结金额、本次变动、状态和时间。', '关联代理代存处理、账变明细和代理财务。'],
  agentPay: ['代理代存处理', '代理使用本人佣金余额或预付金额度向范围内会员代存，站点完成审核。', '代存单号、代理、会员、团队、线路、结算身份、扣款账户、金额、流水倍数、所需流水、状态、审核人和时间。', '关联预付金账户、存款记录、会员余额、账变明细和转账明细。'],
}

function reportNote(portal, page, spec) {
  const [title, summary, fields, related] = spec
  const isAgent = portal === 'agent'
  const isSyncedReport = ['commissionRecords', 'reversal', 'returns'].includes(page)
  const moneyPage = ['finance', 'deposits', 'games', 'accountChanges', 'transfers', 'transferStats', 'venueFees', 'commissionRecords', 'reversal', 'returns', 'siteProfit', 'prepaid', 'agentPay'].includes(page)
  const roleLogic = isAgent
    ? '代理后台只展示当前演示身份本人及授权下级范围，不展示所属站点、其他团队或其他线路；团队负责人可查看本人团队及各线汇总，副线和单线代理只查看本人线路。'
    : '站点后台只查看并处理旺财体育本站代理业务范围，不展示所属站点筛选和列表字段。'
  const logic = `${RELATION_LOGIC}${moneyPage ? ` ${BALANCE_LOGIC}` : ''} ${roleLogic}`
  const recordAt = isSyncedReport ? '2026-07-17 05:33' : '2026-07-15 18:30'
  const recordContent = isSyncedReport
    ? `同步总控同名报表名称和代理类型、代理身份字段，并按${isAgent ? '当前代理身份' : '本站'}权限移除跨范围字段与操作。`
    : `恢复原有${title}页面，增加团队、线路、结算身份、结算单元和生效周期筛选，并补齐分页、详情、导出与角色范围演示。`
  return note(title, summary, fields, logic, related, `${recordAt}：${recordContent}`, {
    updatedAt: isSyncedReport ? recordAt : UPDATED_AT,
    requirement: `在不改变原${title}结构的前提下补充团队代理识别字段和可操作的原型交互，保持页面简单、可查询、可解释。`,
    acceptance: `可按团队代理兼容字段筛选并打开详情；分页与导出入口可用；${isAgent ? '切换三种演示身份后数据范围正确，副线权限受限。' : '只展示旺财体育本站数据，并可与代理端对应记录相互核对。'}`,
    boundary: '本页为演示原型，使用共享模拟数据；刷新后恢复初始状态，不处理真实业务资金。',
  })
}

Object.entries(REPORT_NOTE_SPECS).forEach(([page, spec]) => {
  PAGE_NOTES[`site:${page}`] = reportNote('site', page, spec)
  if (page !== 'siteProfit' && page !== 'prepaid') PAGE_NOTES[`agent:${page}`] = reportNote('agent', page, spec)
})

PAGE_NOTES['site:siteDashboard'] = note('站点运营首页', '恢复站点运营看板，集中查看收入、充值、提款、投注、会员、代理、佣金余额、趋势和排行。', '统计周期、站点收入、充值、提款、投注、有效投注、会员数、代理数、佣金余额、代理余额、趋势和代理排行。', '指标卡可点击查看组成明细；日期切换只改变周期类指标，会员、代理和余额类采用当前状态。站点收入按当前代理范围会员输赢汇总，佣金余额 = 应付佣金 − 已发佣金。', '关联代理列表、代理财务、佣金发放记录、站点利润和资金操作。', '2026-07-15 18:30：恢复站点运营首页，补齐周期切换、指标下钻、趋势和代理排行。')
PAGE_NOTES['site:siteAgents'] = note('代理列表', '按总控同名页面结构查看旺财体育本站代理主档，并补充官方/普通代理身份和代理层级。', '代理ID、账号、代理身份、代理类型、代理模型、状态、推广人员、上级代理、结算模式、代理层级、代理部、line_id、负责人、生效周期、当月结余、会员、投注和余额。', `${RELATION_LOGIC} 代理身份固定使用官方代理或普通代理，原代理身份改名为代理层级并展示当前团队或单线归属。页面固定为旺财体育本站，不展示跨站点字段；站点可查询本站代理资料，团队操作统一进入团队代理管理，代理资料修改仍由总控处理，不能操作其他站点代理。 ${BALANCE_LOGIC}`, '关联团队代理管理、模式变更审核、代理财务和代理端代理列表。', '2026-07-18 10:20：统一代理列表身份字段口径；修改内容：代理账号右侧新增代理身份，原代理身份改名为代理层级，详情同步展示官方/普通代理身份与代理层级。', { updatedAt: '2026-07-18 10:20' })
PAGE_NOTES['site:cycle'] = note('结算周期设置', '按总控同名页面结构维护旺财体育本站普通代理与团队代理的结算周期。', '当前站点、代理类型、周结或月结、结算日、执行时间、当前类型和下一次执行时间。', '当前站点固定为旺财体育且不可切换；站点可分别维护普通代理与团队代理的周期，保存后在本次周期执行完成后生效，历史账单不回写。', '关联代理佣金结算、佣金记录、团队代理管理和账单生成。', '2026-07-17 05:33：将总控结算周期设置下发到站点后台，去除跨站点选择，仅保留本站普通代理与团队代理配置。', { updatedAt: '2026-07-17 05:33' })
PAGE_NOTES['agent:downline'] = note('代理列表', '按总控同名页面口径查看当前演示身份本人及授权下级的代理树、官方/普通代理身份和关系版本。', '关系层级、代理ID、账号、代理身份、上级、代理模型、结算模式、代理层级、结算单元、line_id、生效周期、会员、活跃会员和状态。', `${RELATION_LOGIC} 代理身份固定使用官方代理或普通代理，原代理身份改名为代理层级并展示当前团队或单线归属。代理后台不展示所属站点、跨团队管理或其他代理操作；团队负责人查看本人团队范围，副线和单线代理只查看本人线路。`, '关联代理会员、关系与模式申请、个人财务和站点代理列表。', '2026-07-18 10:20：统一代理列表身份字段口径；修改内容：代理账号右侧新增代理身份，原代理身份改名为代理层级，详情同步展示官方/普通代理身份与代理层级。', { updatedAt: '2026-07-18 10:20' })
PAGE_NOTES['agent:readonlyPlans'] = note('佣金方案', '按总控同名页面口径只读查看当前身份适用的团队、单线代理和推荐奖励方案。', '方案编号、名称、类型、生效周期、等级、新增活跃、活跃会员、总输赢、佣金比例、奖励比例、活跃会员判定条件、新增活跃判定条件和状态。', `代理端不展示所属站点和修改操作，只能查看当前身份适用方案；层级代理和星级代理只展示返佣比例，团队方案展示新增活跃、活跃会员、总输赢以及随方案绑定的活跃判定条件；方案变更只影响未来完整周期，历史账单使用生成时快照。 ${BALANCE_LOGIC}`, '关联站点佣金方案、个人佣金、代理佣金结算和代理财务。', '2026-07-17 16:56：代理端只读方案同步总控新口径，去除首充人数和首充额度，返佣比例按百分比展示。', { updatedAt: '2026-07-17 16:56' })
PAGE_NOTES['agent:personalCommission'] = note('代理端个人佣金', '按当前身份查看本人佣金、内部结算到账、待到账和可用余额。', '身份、账号、结算单元、line_id、周期、当月结余、比例、应付或结算金额、已到账、待到账、状态和代理余额。', `${BALANCE_LOGIC} 副线只显示主线向本人支付的内部结算，不形成平台对副线的佣金账单。`, '关联佣金方案、代理佣金结算、内部结算、账变明细和代理代存。', '2026-07-17 05:50：代理后台资金菜单去除代理提款入口，个人佣金仍保留本人佣金、到账和余额查询。')
PAGE_NOTES['agent:dashboard'] = note('代理运营看板', '将团队经营看板兼容为完整代理运营首页，按团队负责人、副线和单线代理展示经营、资金与团队操作。', '身份、代理账号、充值、提款、投注、有效投注、活跃会员、净输赢、当月结余、等级、佣金、到账、余额、团队线路和状态。', `${BALANCE_LOGIC} 团队负责人查看团队汇总与各线，副线只查看本人线路且不显示平台账单和团队余额，单线代理只查看本人线路。`, '关联下级代理、代理会员、个人财务、佣金账单、内部结算和关系申请。', '2026-07-17 16:44：代理后台演示身份统一为团队负责人、副线和单线代理，并补充副线权限边界。', { updatedAt: '2026-07-17 16:44' })

const ROLE_MODULE_SYNC_AT = '2026-07-18 05:43'
const SITE_SYNC_SCOPE = '本页从总控后台代理管理同名页面按站点角色同步，数据固定为旺财体育本站；保留本站查询和允许的运营操作，不展示跨站点筛选、字段或全局权限。'
const AGENT_SYNC_SCOPE = '本页从总控后台代理管理同名页面按代理角色同步，仅展示当前演示身份本人及授权下级范围；团队负责人查看本人团队，副线只查看本人 line_id，单线代理只查看本人单线，不展示所属站点、其他团队、审核维护字段或管理操作。'

function syncedRoleModule(baseKey, portal, title, extra = {}) {
  const base = PAGE_NOTES[baseKey]
  const scope = portal === 'site' ? SITE_SYNC_SCOPE : AGENT_SYNC_SCOPE
  return {
    ...base,
    ...extra,
    title,
    updatedAt: ROLE_MODULE_SYNC_AT,
    summary: extra.summary || `${base.summary} ${scope}`,
    logic: `${base.logic} ${scope}`,
    related: `${base.related} 代理收益看板和修改代理关系记录不下发；结算周期设置只下发站点后台。`,
    requirement: `按${portal === 'site' ? '站点运营' : '当前代理身份'}权限同步总控后台代理管理中的可下发页面，统一页面名称和核心业务口径，并隐藏超出角色范围的字段与操作。`,
    acceptance: portal === 'site'
      ? '站点后台只保留一个代理管理模块；页面固定展示旺财体育本站数据，不出现代理收益看板和修改代理关系记录，可使用结算周期设置。'
      : '代理后台只保留一个代理管理模块；切换团队负责人、副线、单线代理后数据范围随身份变化，不出现代理收益看板、修改代理关系记录和结算周期设置。',
    boundary: '本页为共享模拟数据演示；总控后台原页面、字段和操作保持不变，本次仅处理角色同步、范围限制和字段隐藏。',
    record: `修改时间：${ROLE_MODULE_SYNC_AT}；修改说明：清理原有代理模块后，按角色权限同步总控后台代理管理页面；修改内容：统一菜单与页面名称，${portal === 'site' ? '固定旺财体育本站范围并保留本站运营权限' : '按当前演示身份收窄数据并隐藏跨站点、审核维护及管理操作'}。`,
  }
}

const SITE_SYNCED_NOTES = {
  agents: 'site:siteAgents', negativeProfit: 'master:negativeProfit', agentOperations: 'master:agentOperations', teams: 'site:teams', plans: 'site:plans', settlement: 'site:settlement', records: 'site:commissionRecords', reversal: 'site:reversal', returns: 'site:returns', cycle: 'site:cycle',
}
const AGENT_SYNCED_NOTES = {
  agents: 'agent:downline', negativeProfit: 'master:negativeProfit', agentOperations: 'master:agentOperations', teams: 'agent:dashboard', plans: 'agent:readonlyPlans', settlement: 'agent:bills', records: 'agent:commissionRecords', reversal: 'agent:reversal', returns: 'agent:returns',
}

Object.entries(SITE_SYNCED_NOTES).forEach(([page, baseKey]) => {
  PAGE_NOTES[`site:${page}`] = syncedRoleModule(baseKey, 'site', page === 'records' ? '佣金记录' : PAGE_NOTES[baseKey].title)
})
Object.entries(AGENT_SYNCED_NOTES).forEach(([page, baseKey]) => {
  const title = page === 'teams' ? '团队代理管理' : page === 'records' ? '佣金记录' : PAGE_NOTES[baseKey].title
  PAGE_NOTES[`agent:${page}`] = syncedRoleModule(baseKey, 'agent', title)
})

PAGE_NOTES['master:version'] = {
  ...PAGE_NOTES['master:version'],
  updatedAt: ROLE_MODULE_SYNC_AT,
  summary: '按总控、站点、代理后台展示最新版本需求，并记录代理管理页面的角色同步与不下发边界。',
  logic: '站点后台和代理后台原代理菜单统一清理后，只保留从总控代理管理按角色允许下发的页面；站点固定旺财体育本站，代理端按当前演示身份收窄范围。代理收益看板、修改代理关系记录不下发，结算周期设置只下发站点后台；总控后台原页面保持不变。',
  record: `修改时间：${ROLE_MODULE_SYNC_AT}；修改说明：更新三后台代理管理同步范围；修改内容：版本说明改为按角色列出站点后台 10 个同步页面、代理后台 9 个同步页面，并明确不下发页面及字段隐藏边界。`,
}

Object.entries(NOTE_COMPARISONS).forEach(([key, comparison]) => {
  const current = PAGE_NOTES[key]
  if (!current) return
  const comparisonUpdatedAt = comparison.updatedAt || NOTE_COMPARISON_UPDATED_AT
  PAGE_NOTES[key] = {
    ...current,
    comparison,
    updatedAt: comparisonUpdatedAt,
    record: comparison.record || `修改时间：${comparisonUpdatedAt}；修改说明：补全本页相对原后台的业务差异说明；修改内容：保留原后台已有能力说明，并按字段、类型、筛选、页签或弹窗、操作功能和业务规则逐项标明本原型新增或修改内容。`,
  }
})

PAGE_NOTES['master:agents'] = {
  ...PAGE_NOTES['master:agents'],
  updatedAt: '2026-07-17 16:44',
  record: '修改时间：2026-07-17 16:44；修改说明：统一副线身份口径，避免把副线误解为单独负责人；修改内容：所有模块的代理身份统一为团队负责人、副线和单线代理，并补充副线为团队内成员身份的业务说明。',
}

PAGE_NOTES['master:returns'] = {
  ...PAGE_NOTES['master:returns'],
  updatedAt: '2026-07-17 16:44',
  summary: '按原回款明细样式重构列表，并在 ID 右侧补充代理类型与代理身份。',
  fields: '所属站点、名称、ID、代理类型、代理身份、类型、垫付或回款、额度、额度缺口、冲正账目ID和时间。',
  logic: `代理类型分为团队代理、星级代理和层级代理；代理身份按类型展示，团队代理显示团队负责人、副线或单线代理，星级代理显示几星，层级代理显示几层；原代理等级字段不再单独展示。回款只冲减原冲正台账，不直接改变团队主副线关系；计算公式：额度缺口 = 同一冲正账目原欠款额度 − 累计成功回款金额；本次记录为“垫付”时增加待回款额度，为“回款”时减少额度缺口；${SECONDARY_ROLE_NOTE}`,
  record: '修改时间：2026-07-17 16:44；修改说明：冲正回款报表同步统一副线身份口径；修改内容：团队代理身份只展示团队负责人、副线和单线代理，并补充副线为团队内成员身份的说明。',
}

PAGE_NOTES['master:revenue'] = {
  ...PAGE_NOTES['master:revenue'],
  updatedAt: '2026-07-17 03:12',
  summary: '按截图重构为原后台收益明细宽表，用站点、代理账号和查询日期筛选代理经营与会员统计数据。',
  fields: '所属站点、代理编号、代理账号、上级代理、账期范围、本期佣金预计净收益、当前余额、总推广佣金、已结算佣金、总充值、总提现、总投注、有效投注、总盈亏、该代理欠款、未收回欠款、会员VIP福利、活动福利、会员推广福利、充提手续费运营费、代理总人数、新增代理、活跃代理、会员总数、新增会员、活跃会员、付费会员、新增付费、代理推广会员、会员推广会员和30天未登录会员数。',
  logic: '查询以所属站点、代理账号和日期范围为条件，默认展示当天凌晨查询范围；当前演示状态保留空表“暂无数据”。金额类指标用于对比代理收益、充值提现、投注输赢、福利成本、欠款和运营费，人数类指标用于观察代理与会员增长和活跃情况；计算公式：本期佣金预计净收益 = 总推广佣金 − 已结算佣金；未收回欠款 = 该代理欠款 − 已收回金额；活跃代理、活跃会员、付费会员与新增付费按查询日期范围统计。',
  record: '修改时间：2026-07-17 03:12；修改说明：按截图重构代理收益看板为原后台收益明细宽表；修改内容：新增模块页签和二级页签、说明头、导出数据、下载文件、所属站点、代理账号、查询日期筛选，以及佣金、余额、充值提现、投注、福利、欠款、运营费、代理人数和会员人数等宽表字段。',
}

PAGE_NOTES['master:relations'] = {
  ...PAGE_NOTES['master:relations'],
  updatedAt: '2026-07-17 03:32',
  title: '修改代理关系记录',
  summary: '按截图重构为原后台关系维护明细页，用全局筛选条件查询会员和代理的上级代理关系人工维护历史。',
  fields: '所属站点、目标账号或记录编号、账号类型、操作人、迁移本期未结算费用、变更状态、迁移状态、操作日期、新代理生效日、账号、原上级、新上级、是否迁移本期未结算费用、重试次数、完成时间、错误原因和操作。',
  logic: '页面按所属站点、账号类型、目标账号、操作人、变更状态、迁移状态和日期条件筛查关系维护记录。会员和代理的新上级按新代理生效日生效；选择迁移本期未结算费用的记录需要展示迁移状态、重试次数、完成时间和错误原因，便于运营判断是否需要重试或人工处理。已完成和无需迁移记录不再重复处理。',
  related: '关联代理列表、会员管理、佣金记录、代理佣金结算和结算周期设置。',
  record: '修改时间：2026-07-17 03:32；修改说明：按用户截图将修改代理关系记录改为原后台明细页样式；修改内容：页面新增标题说明、刷新数据、全局筛选条件卡片、重置条件、查询、变更明细宽表、共计记录数、固定操作列和变更记录详情弹窗，去除原代理关系记录/团队操作记录双页签结构。',
}

const SINGLE_AGENT_TERMINOLOGY_UPDATED_AT = '2026-07-18 14:22'
Object.entries(PAGE_NOTES).forEach(([key, pageNote]) => {
  if (!JSON.stringify(pageNote).includes('单线代理')) return
  PAGE_NOTES[key] = {
    ...pageNote,
    updatedAt: SINGLE_AGENT_TERMINOLOGY_UPDATED_AT,
    record: `修改时间：${SINGLE_AGENT_TERMINOLOGY_UPDATED_AT}；修改说明：统一单线代理业务称呼，避免同一代理类型在不同页面出现多套名称；修改内容：页面、筛选、弹窗、演示数据、方案、账单、关系操作和业务说明统一使用“单线代理”。`,
  }
})

export const P1_ROADMAP = ['副线批量开设与范围调整', '内部结算模板', '主线自有资金提前结算', '方案计算预演', '推荐奖励期限与阶梯', '历史余额受控移交']
