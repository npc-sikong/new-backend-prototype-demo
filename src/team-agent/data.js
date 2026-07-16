import { LEGACY_STATE } from './legacy-data'

export const UPDATED_AT = '2026-07-15 18:30'
export const MEMBER_TURNOVER_UPDATED_AT = '2026-07-14 23:40'

const DEFAULT_CHANNEL_STATS = [
  { channel: 'USDT-TRC20', depositCount: 18, depositAmount: 126000, withdrawalCount: 6, withdrawalAmount: 42800 },
  { channel: '支付宝', depositCount: 11, depositAmount: 63500, withdrawalCount: 3, withdrawalAmount: 18600 },
  { channel: '银行卡', depositCount: 7, depositAmount: 47000, withdrawalCount: 2, withdrawalAmount: 12800 },
]

function agent(row) {
  return {
    agentType: '普通代理', developer: '—', parentId: '—', boundMemberAccount: '—', email: '—', registeredAt: '2026-06-01 10:00',
    registerIp: '103.22.15.8', loginIp: '103.22.15.18', registerLocation: '中国 / 广东省 / 广州市', loginLocation: '中国 / 广东省 / 深圳市',
    activeMembers: 0, newActiveMembers: 0, depositAmount: 0, withdrawalAmount: 0, totalWinLoss: 0, validBetting: 0,
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
    agent({ id: '345', account: 'gaodashang', model: '负盈利模式', agentType: '官方代理', developer: 'gaodashang', boundMemberAccount: 'M100345', email: 'gao@example.com', registeredAt: '2026-05-08 13:20', settlementMode: '团队模式', identity: '主管主线', unit: 'gaodashang01部', lineId: 'LINE-A', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: '无上级代理', subAgents: 8, members: 207, activeMembers: 68, newActiveMembers: 18, depositAmount: 486000, withdrawalAmount: 182000, totalWinLoss: 218000, validBetting: 1640000, plan: '旺财团队月结方案', balance: 79806.45, subAgentDetails: [{ id: '373', account: 'WC002', registeredAt: '2026-06-02 12:30' }, { id: '374', account: 'LGNB', registeredAt: '2026-06-06 17:40' }, { id: '1750', account: 'dailiwc001a', registeredAt: '2026-06-18 09:15' }] }),
    agent({ id: '373', account: 'WC002', model: '负盈利模式', developer: 'gaodashang', parentId: '345', email: 'wc002@example.com', registeredAt: '2026-06-02 12:30', settlementMode: '团队模式', identity: '副线负责人', unit: 'gaodashang01部', lineId: 'LINE-B', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'gaodashang', subAgents: 2, members: 31, activeMembers: 37, newActiveMembers: 11, depositAmount: 168000, withdrawalAmount: 62000, totalWinLoss: 146000, validBetting: 780000, plan: '随团队统一方案', balance: 3100 }),
    agent({ id: '374', account: 'LGNB', model: '负盈利模式', developer: 'gaodashang', parentId: '345', email: 'lgnb@example.com', registeredAt: '2026-06-06 17:40', settlementMode: '团队模式', identity: '副线负责人', unit: 'gaodashang01部', lineId: 'LINE-C', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'gaodashang', subAgents: 1, members: 22, activeMembers: 23, newActiveMembers: 7, depositAmount: 92000, withdrawalAmount: 38000, totalWinLoss: 50000, validBetting: 410000, plan: '随团队统一方案', balance: 2850 }),
    agent({ id: '1749', account: 'dailiwc001', model: '负盈利模式', developer: 'apppay', parentId: '901', boundMemberAccount: 'M201749', email: 'dailiwc001@example.com', registeredAt: '2026-05-26 11:45', settlementMode: '独立单线', identity: '独立线主', unit: '独立单线01', lineId: 'SINGLE-001', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'apppay', subAgents: 1, members: 18, activeMembers: 46, newActiveMembers: 12, depositAmount: 214000, withdrawalAmount: 87000, totalWinLoss: 170000, validBetting: 920000, plan: '独立单线月结方案', balance: 68903.14 }),
    agent({ id: '1750', account: 'dailiwc001a', model: '负盈利模式', developer: 'market02', parentId: '1050', registeredAt: '2026-06-18 09:15', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '旺财体育', status: '启用', parent: 'hddaili', subAgents: 0, members: 4, activeMembers: 3, newActiveMembers: 1, depositAmount: 18800, withdrawalAmount: 7200, totalWinLoss: 9500, validBetting: 64000, plan: '负盈利模式方案', balance: 1920 }),
    agent({ id: '1774', account: 'charles', model: '普通代理', developer: 'market03', registeredAt: '2026-06-22 15:20', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '旺财体育', status: '启用', parent: '无上级代理', subAgents: 0, members: 3, activeMembers: 2, newActiveMembers: 1, depositAmount: 12000, withdrawalAmount: 4800, totalWinLoss: -18000, validBetting: 38000, plan: '负盈利模式方案', balance: 1960 }),
    agent({ id: '1109', account: 'FEE0428_A8', model: '负盈利模式', agentType: '官方代理', developer: 'fee0428', email: 'fee0428@example.com', registeredAt: '2026-04-28 18:12', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '财神客栈', status: '启用', parent: '无上级代理', subAgents: 4, members: 7, activeMembers: 6, newActiveMembers: 2, depositAmount: 74000, withdrawalAmount: 21000, totalWinLoss: 42000, validBetting: 260000, plan: '财神Excel0419返佣方案', balance: 15000 }),
    agent({ id: '768', account: 'NA7', model: '负盈利模式', developer: 'market04', registeredAt: '2026-03-10 08:20', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '财神客栈', status: '停用', parent: '无上级代理', subAgents: 0, members: 1, activeMembers: 0, newActiveMembers: 0, depositAmount: 3000, withdrawalAmount: 1200, totalWinLoss: -500, validBetting: 6500, plan: '负盈利模式方案', balance: 8000 }),
  ],
  teams: [
    {
      id: 'TEAM-001', code: 'DPT-001', name: 'gaodashang01部', teamType: '推广团队', developer: 'gaodashang', site: '旺财体育', currency: 'CNY', mainAgent: 'gaodashang', memberDetailPermission: false, createdAt: '2026-06-28 10:20', joinedAt: '2026-07-01 00:00', plan: '旺财团队月结方案', status: '生效中', startCycle: '2026-07', endCycle: '长期', previousNegative: 60000,
      cumulativeReceived: 220000, successfulTransfers: 28000, processingOccupied: 15000, otherDeductions: 3200,
      metrics: { newActive: 36, activeMembers: 128, memberWinLoss: 520000, totalWinLoss: 520000, venueFee: 26000, memberBonus: 18000, memberRebate: 12000, accountAdjustment: 8000, manualOrderWinLoss: 5000, depositFee: 2500, withdrawalFee: 2500, expenses: 60000, adjustment: 8000, currentNet: 472000, lastBalance: -60000, balanceAdjustment: 0, assessmentNet: 412000, correctedNet: 412000, commissionableNet: 412000, commissionAdjustment: 0, grade: '五星', rate: 0.5, payable: 206000 },
      lines: [
        { lineId: 'LINE-A', identity: '主线', agent: 'gaodashang', scope: '主线直属代理及会员', newActive: 18, activeMembers: 68, netWinLoss: 218000, status: '生效中', startCycle: '2026-07' },
        { lineId: 'LINE-B', identity: '副线', agent: 'WC002', scope: 'WC002 节点及直属会员', newActive: 11, activeMembers: 37, netWinLoss: 146000, status: '生效中', startCycle: '2026-07' },
        { lineId: 'LINE-C', identity: '副线', agent: 'LGNB', scope: 'LGNB 节点及直属会员', newActive: 7, activeMembers: 23, netWinLoss: 50000, status: '生效中', startCycle: '2026-07' },
      ],
    },
    {
      id: 'TEAM-002', code: 'DPT-002', name: 'apppay01部', teamType: '推广团队', developer: 'apppay', site: '旺财体育', currency: 'CNY', mainAgent: 'apppay', memberDetailPermission: true, createdAt: '2026-07-13 15:20', joinedAt: '2026-08-01 00:00', plan: '旺财团队月结方案', status: '待生效', startCycle: '2026-08', endCycle: '长期', previousNegative: 0,
      cumulativeReceived: 0, successfulTransfers: 0, processingOccupied: 0, otherDeductions: 0,
      metrics: { newActive: 0, activeMembers: 0, memberWinLoss: 0, totalWinLoss: 0, venueFee: 0, memberBonus: 0, memberRebate: 0, accountAdjustment: 0, manualOrderWinLoss: 0, depositFee: 0, withdrawalFee: 0, expenses: 0, adjustment: 0, currentNet: 0, lastBalance: 0, balanceAdjustment: 0, assessmentNet: 0, correctedNet: 0, commissionableNet: 0, commissionAdjustment: 0, grade: '零级', rate: 0, payable: 0 },
      lines: [
        { lineId: 'LINE-D', identity: '主线', agent: 'apppay', scope: '主线直属代理及会员', newActive: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: '2026-08' },
        { lineId: 'LINE-E', identity: '副线', agent: 'dailiwc001', scope: '独立单线01原业务范围', newActive: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: '2026-08' },
      ],
    },
  ],
  singles: [
    { id: 'SINGLE-001', code: 'SL-001', name: '独立单线01', owner: 'dailiwc001', site: '旺财体育', currency: 'CNY', source: '站点直接创建', recommender: 'apppay', plan: '独立单线月结方案', rewardPlan: '推荐奖励10%方案', status: '生效中·待转入', startCycle: '2026-07', scope: '线主本人代理节点', metrics: { newActive: 12, activeMembers: 46, currentNet: 170000, previousNegative: 0, assessmentNet: 170000, grade: '四星', rate: 0.4, payable: 68000 } },
    { id: 'SINGLE-002', code: 'SL-002', name: 'WC002 独立单线', owner: 'WC002', site: '旺财体育', currency: 'CNY', source: '副线转独立', recommender: 'gaodashang', plan: '独立单线月结方案', rewardPlan: '推荐奖励10%方案', status: '待生效', startCycle: '2026-08', scope: '原 LINE-B 业务范围', metrics: { newActive: 0, activeMembers: 0, currentNet: 0, previousNegative: 0, assessmentNet: 0, grade: '待计算', rate: 0, payable: 0 } },
  ],
  plans: [
    { id: 'PLAN-T-001', type: '团队佣金方案', name: '旺财团队月结方案', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', levels: [
      { grade: '一星', newActive: 5, activeMembers: 20, netWinLoss: 50000, rate: 0.3 },
      { grade: '二星', newActive: 10, activeMembers: 40, netWinLoss: 100000, rate: 0.35 },
      { grade: '三星', newActive: 15, activeMembers: 60, netWinLoss: 180000, rate: 0.4 },
      { grade: '四星', newActive: 25, activeMembers: 90, netWinLoss: 280000, rate: 0.45 },
      { grade: '五星', newActive: 35, activeMembers: 120, netWinLoss: 400000, rate: 0.5 },
      { grade: '六星', newActive: 50, activeMembers: 180, netWinLoss: 650000, rate: 0.55 },
    ] },
    { id: 'PLAN-S-001', type: '独立单线方案', name: '独立单线月结方案', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', levels: [
      { grade: '一星', newActive: 3, activeMembers: 10, netWinLoss: 30000, rate: 0.25 },
      { grade: '二星', newActive: 5, activeMembers: 20, netWinLoss: 60000, rate: 0.3 },
      { grade: '三星', newActive: 8, activeMembers: 30, netWinLoss: 100000, rate: 0.35 },
      { grade: '四星', newActive: 12, activeMembers: 45, netWinLoss: 160000, rate: 0.4 },
    ] },
    { id: 'PLAN-R-001', type: '推荐奖励方案', name: '推荐奖励10%方案', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', rewardRate: 0.1, rewardBase: '独立单线已审核应付佣金', deductedFromSingle: false },
    { id: 'PLAN-H-001', type: '历史代理方案', name: '多层级返佣方案', site: '全部站点', effectiveCycle: '历史兼容', status: '历史查询', levels: [] },
  ],
  bills: [
    bill({ id: 'BILL-T-202607-001', type: '团队佣金', unitId: 'TEAM-001', unitName: 'gaodashang01部', payee: 'gaodashang', agentType: '官方代理', becameAgentAt: '2026-05-08', teamType: '推广团队', teamMembers: 3, subAgentCount: 11, registeredCount: 276, firstDepositCount: 42, activeCount: 128, newActiveCount: 36, depositAmount: 746000, withdrawalAmount: 282000, totalWinLoss: 520000, venueFee: 26000, memberBonus: 18000, memberRebate: 12000, accountAdjustment: 8000, manualOrderWinLoss: 5000, depositFee: 2500, withdrawalFee: 2500, netWinLossRaw: 472000, lastBalance: -60000, correctedNet: 412000, site: '旺财体育', cycle: '2026-07', grade: '五星', rate: 0.5, netWinLoss: 412000, payable: 206000, issued: 120000, state: '部分发放', recommender: '—', reviewer: '若依', reviewedAt: '2026-07-14 09:20', issuedBy: '站点财务', issuedAt: '2026-07-14 10:10', createdAt: '2026-07-14 02:05' }),
    bill({ id: 'BILL-S-202607-001', type: '独立单线佣金', unitId: 'SINGLE-001', unitName: '独立单线01', payee: 'dailiwc001', becameAgentAt: '2026-05-26', activeCount: 46, newActiveCount: 12, depositAmount: 214000, withdrawalAmount: 87000, totalWinLoss: 205000, venueFee: 10250, memberBonus: 8000, memberRebate: 6750, accountAdjustment: -3000, manualOrderWinLoss: 0, depositFee: 3500, withdrawalFee: 3500, netWinLossRaw: 170000, lastBalance: 0, correctedNet: 170000, site: '旺财体育', cycle: '2026-07', grade: '四星', rate: 0.4, netWinLoss: 170000, payable: 68000, issued: 0, state: '待发放', recommender: 'apppay', reviewer: '若依', reviewedAt: '2026-07-14 09:30', createdAt: '2026-07-14 02:06' }),
    bill({ id: 'BILL-R-202607-001', type: '推荐奖励', unitId: 'SINGLE-001', unitName: '独立单线01', payee: 'apppay', agentType: '官方代理', becameAgentAt: '2026-04-20', totalWinLoss: 68000, netWinLossRaw: 68000, correctedNet: 68000, site: '旺财体育', cycle: '2026-07', grade: '—', rate: 0.1, netWinLoss: 68000, payable: 6800, issued: 0, state: '待审核', recommender: 'apppay', createdAt: '2026-07-14 02:07' }),
    bill({ id: 'BILL-T-202608-002', type: '团队佣金', unitId: 'TEAM-002', unitName: 'apppay01部', payee: 'apppay', agentType: '官方代理', teamType: '推广团队', teamMembers: 2, activeCount: 20, newActiveCount: 5, totalWinLoss: 65000, venueFee: 3250, memberBonus: 4000, memberRebate: 2750, accountAdjustment: 0, manualOrderWinLoss: 0, depositFee: 2500, withdrawalFee: 2500, netWinLossRaw: 50000, lastBalance: 0, correctedNet: 50000, site: '旺财体育', cycle: '2026-08', grade: '一星', rate: 0.3, netWinLoss: 50000, payable: 15000, issued: 0, state: '待提交', recommender: '—', createdAt: '2026-07-14 14:20' }),
    bill({ id: 'BILL-S-202606-002', type: '独立单线佣金', unitId: 'SINGLE-003', unitName: '独立单线03', payee: 'charles', becameAgentAt: '2026-06-22', totalWinLoss: -18000, netWinLossRaw: -18000, lastBalance: 0, correctedNet: -18000, site: '旺财体育', cycle: '2026-06', grade: '零级', rate: 0, netWinLoss: -18000, payable: 0, issued: 0, state: '无佣金结转', recommender: '—', createdAt: '2026-07-01 02:03' }),
  ],
  internalSettlements: [
    { id: 'IS-202607-001', teamId: 'TEAM-001', teamName: 'gaodashang01部', mainAgent: 'gaodashang', secondaryAgent: 'WC002', cycle: '2026-07', amount: 28000, basis: '固定金额', source: '平台已到账余额', state: '成功', voucher: '结算凭证-A01', createdAt: '2026-07-14 10:20' },
    { id: 'IS-202607-002', teamId: 'TEAM-001', teamName: 'gaodashang01部', mainAgent: 'gaodashang', secondaryAgent: 'LGNB', cycle: '2026-07', amount: 15000, basis: '参考副线业绩', source: '平台已到账余额', state: '处理中', voucher: '待补充', createdAt: '2026-07-14 11:05' },
  ],
  requests: [
    { id: 'REQ-202607-001', type: '副线转独立单线', applicant: 'WC002', currentUnit: 'gaodashang01部 / LINE-B', targetUnit: 'WC002 独立单线', effectiveCycle: '2026-08', recommender: 'gaodashang', status: '待站点复核', conflict: '无冲突', balanceHandling: '移出团队当月结余留在原团队', createdAt: '2026-07-14 09:30', note: '关系按目标周期切换，结余归属按当月规则处理。' },
    { id: 'REQ-202607-002', type: '独立单线加入团队', applicant: 'dailiwc001', currentUnit: '独立单线01', targetUnit: 'apppay01部 / 待分配 line_id', effectiveCycle: '2026-08', recommender: '—', status: '已批准·待生效', conflict: '无未结账单', balanceHandling: '加入团队当月结余随代理带入新团队', createdAt: '2026-07-13 16:40', note: '生效后停止推荐奖励，历史奖励不变。' },
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
  siteCommissionConfig: { teamPlan: '旺财团队月结方案', singlePlan: '独立单线月结方案', rewardPlan: '推荐奖励10%方案', effectiveCycle: '2026-08', updatedBy: '站点运营', updatedAt: '2026-07-15 15:30' },
  teamOperations: [
    { id: 'TOP-001', teamId: 'TEAM-001', teamName: 'gaodashang01部', teamType: '推广团队', mainId: '345', mainAccount: 'gaodashang', secondaryAccounts: 'WC002、LGNB', action: '创建团队', reason: '市场推广代理线归集', operator: '站点运营', createdAt: '2026-06-28 10:20' },
    { id: 'TOP-002', teamId: 'TEAM-001', teamName: 'gaodashang01部', teamType: '推广团队', mainId: '345', mainAccount: 'gaodashang', secondaryAccounts: 'WC002', action: '新增副线', reason: '扩大团队业务范围', operator: '站点运营', createdAt: '2026-07-01 09:10' },
    { id: 'TOP-003', teamId: 'TEAM-002', teamName: 'apppay01部', teamType: '推广团队', mainId: '901', mainAccount: 'apppay', secondaryAccounts: 'dailiwc001', action: '加入团队待生效', reason: '独立单线申请加入', operator: '站点运营', createdAt: '2026-07-13 16:45' },
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
    ['旺财体育', 'gaodashang', '团队主线', '代理1部', 4, 149.9, 21687.56, 12000, 2500, 7099.9],
    ['旺财体育', 'WC002', '团队副线', '代理1部', 2, 3100, 1755.66, 8300, 0, 1150],
    ['财神客栈', 'FEE0427_B6', '原代理模式', '—', 2, 0, 0, 0, 19651.35, 19651.35],
  ],
  returns: [
    ['旺财体育', 'gaodashang', '团队主线', '余额', '垫付', 31.15, 31.15, 'CZ519', '2026-07-10 23:07'],
    ['旺财体育', 'dailiwc001', '独立线主', '余额', '回款', 94.34, 0, 'CZ492', '2026-07-10 23:07'],
    ['财神客栈', 'FEE0428_A8', '原代理模式', '余额', '回款', 14692.5, 0, 'CZ475', '2026-04-28 23:08'],
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
  '独立单线管理': '计算公式：本线净输赢 = 本线总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费；本月结余 = 本线净输赢 + 上月结余 + 本月结余调整；应付佣金 = MAX（0，本月结余 × 佣金比例 + 佣金调整）。',
  '佣金管理': '计算公式：新增活跃、活跃会员和冲正后净输赢三个门槛同时满足后取最高等级；佣金 = MAX（0，冲正后净输赢 × 命中比例 + 佣金调整）；推荐奖励 = 独立单线已审核应付佣金 × 奖励比例。',
  '代理佣金结算': '计算公式：净输赢 = 总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费；冲正后净输赢 = 净输赢 + 上月结余 + 本月结余调整；本月结余 = 冲正后净输赢；佣金 = MAX（0，冲正后净输赢 × 比例 + 佣金调整）；账单剩余 = 应付金额 − 累计成功发放。',
  '佣金与内部结算记录': '计算公式：主线团队可用余额 = 累计成功到账 − 成功内部转账 − 处理中占用 − 其他扣减。',
  '代理收益看板': '计算公式：冲正后净输赢 = 净输赢 + 上月结余 + 本月结余调整；团队三个指标均按有效业务范围去重汇总。',
  '站点团队代理管理': '计算公式：团队有效副线数 = 当前周期状态有效的副线数量；团队平台账单数 = 每个团队每周期最多 1 张。',
  '站点独立单线管理': '计算公式：本月结余 = 净输赢 + 上月结余 + 本月结余调整；独立单线应付佣金 = MAX（0，本月结余 × 最终比例 + 佣金调整）。',
  '站点方案与推荐奖励': '计算公式：推荐奖励 = 独立单线已审核应付佣金 × 奖励比例，奖励由平台另行支付。',
  '站点账单提交与发放': '计算公式：站点当日剩余额度 = 每日额度 − 当日成功发放 − 处理中占用；本次可发金额 = MIN（账单剩余，站点当日剩余额度）。',
  '代理团队经营看板': '计算公式：团队三个指标 = 主线与全部有效副线在业务范围内去重汇总；本月结余 = 净输赢 + 上月结余 + 本月结余调整；平台应付佣金 = MAX（0，本月结余 × 最终比例 + 佣金调整）。',
  '我的佣金账单': '计算公式：账单剩余 = 平台应付金额 − 累计成功发放；副线平台应付账单数量固定为 0。',
  '副线内部结算': '计算公式：主线团队可用余额 = 累计成功到账 − 成功内部转账 − 处理中占用 − 其他扣减；本次金额不得超过可用余额。',
  '会员打码流水统计表': '计算公式：总余额 = 可提现余额 + 锁定余额；单项还需解锁流水 = MAX（0，目标流水 − 已完成有效流水）；场馆提现流水 = 各场馆及通用任务还需解锁流水之和；充值提现流水 = 当前周期内各笔充值与系统发放彩金的剩余流水之和；盈利解锁额度 = MAX（0，当前总余额 − 本轮充值与系统发放彩金计入额度）；亏损时不展示盈利额度，盈利需本轮全部充值流水完成后可领取；锁定余额/锁定额度会随用户有效投注确认结果重新计算。',
}

function note(title, summary, fields, logic, related, record, overrides = {}) {
  const splitAt = record.indexOf('：')
  const recordDate = splitAt >= 0 ? record.slice(0, splitAt) : UPDATED_AT
  const recordContent = splitAt >= 0 ? record.slice(splitAt + 1) : record
  const formula = NOTE_FORMULAS[title]
  const trimEnding = (value) => String(value).replace(/[。；;]\s*$/, '')
  return { ...BASE_NOTE, ...overrides, title, summary, fields, logic: formula ? `${trimEnding(logic)}；${formula}` : logic, related, record: `修改时间：${recordDate}；修改说明：${trimEnding(summary)}；修改内容：${recordContent}` }
}

export const PAGE_NOTES = {
  'master:version': note('版本需求归档', '按总控、站点、代理后台集中展示 1.0 与 2.0 版本需求及页面跳转。', '版本、完成时间、模块说明、修改说明、功能验收和页面入口。', '同一版本内仅保留每个业务项的最新说明，未完成的后续增强不计入已完成模块。', '关联三个后台的团队代理功能、会员流水统计、佣金管理、当月结余、代理提款和代理自助页面。', '2026-07-15 15:30：覆盖更新 2.0 三后台代理模块说明，补充 Excel 字段、当月结余规则、团队操作和代理提款直达入口。', {
    updatedAt: UPDATED_AT,
    requirement: '按总控后台、站点后台和代理后台归档最新业务需求；同一版本同一模块只保留最新说明，并提供可用的页面跳转。',
    acceptance: '2.0 版本可按三后台看到会员流水、代理资料、佣金、团队关系和提款模块的最新说明与可用入口；1.0 归档保持可查询。',
  }),
  'master:memberTurnover': note('会员打码流水统计表', '集中统计会员充值、系统发放彩金、余额、提现资格、盈利解锁额度和未完成打码流水，支持分别查看场馆归集明细与按发生顺序的充值提现流水记录。', '站点、代理、会员、充值额度、总余额、可提现余额、锁定余额、场馆提现流水、充值提现流水、盈利解锁额度、记录顺序、记录类型、发生时间、计入额度、目标流水、已完成流水、还需解锁流水和状态。', '查询仅汇总已确认的有效流水；无可靠单独场馆归属时显示为“通用”。充值提现流水将成功充值与系统发放彩金均视为独立记录，无需关联充值订单，按发生时间 FIFO 解锁；前一笔未完成时不得跳过。有效投注确认后，已完成流水、剩余解锁量和对应锁定额度同步更新；盈利解锁额度仅在本轮盈利时展示，亏损无额度，且需本轮全部充值流水完成后才可领取。', '关联会员充值、会员钱包、H5 提现、场馆活动流水和运营查询。', '2026-07-15 14:20：列表去除打码状态和归因类型字段，仅保留站点、代理、会员等核心统计筛选与两类流水明细入口。', {
    updatedAt: '2026-07-15 14:20',
    requirement: '在会员管理下只维护会员打码流水统计表，帮助产品、运营和客服快速解释会员为什么可提、为什么仍有锁定余额，以及充值、系统发放彩金和盈利解锁额度的释放顺序。',
    acceptance: '可按站点、代理和会员查询；列表不展示打码状态和归因类型；点击场馆提现流水可看到每个场馆或“通用”的锁定额度、目标流水、已完成、待确认、剩余流水和状态；点击充值提现流水可看到充值与系统发放彩金的顺序、类型、发生时间、额度、目标/已完成/剩余流水和状态，并核对盈利解锁额度需本轮全部充值流水完成后领取的规则；H5 充值流水切页展示同一口径。',
    boundary: '本页为只读统计演示，使用固定模拟数据，不提供人工调整、任务创建或其他会员业务表；刷新页面后恢复初始内容。',
  }),
  'master:agents': note('代理资料与结算身份', '在原代理管理中补齐 Excel 代理资料、经营统计和团队结算身份，所有扩展仍集中在同一列表与弹窗。', '代理ID、站点、代理账号、代理类型、推广人员、代理模式、上级、注册与登录信息、结算模式、团队身份、代理部、line_id、活跃会员、存提款、输赢、有效投注、佣金方案、佣金余额及可选绑定会员。', '代理模式与结算身份相互独立；代理账号独立存在，绑定会员仅作可选关联；历史已发月份可调整代理佣金余额，当月结余调整必须进入佣金结算页。', '关联团队代理管理、独立单线管理、佣金管理、代理佣金结算和代理提款。', '2026-07-15 15:30：在原代理列表增加 Excel 字段与组合筛选，并增加详情、资料修改、密码、历史余额调整、下级代理及存提款渠道统计弹窗。'),
  'master:teams': note('团队代理管理', '集中管理代理部、主管主线、副线结构、合并业绩、当月结余和团队结算。', '代理部、团队类型、主线、副线、line_id、业务范围、创建与加入时间、副线会员详情权限、考核指标、净输赢、上月结余、本月结余调整、冲正后净输赢、佣金比例和状态。', '团队合并主线与有效副线范围后统一定级，每周期只生成一张团队账单并只付主线；加入团队当月结余随代理带入，移出时留原团队，解散时剩余结余由指定代理承接。', '关联代理资料、佣金管理、代理佣金结算、内部结算、团队操作记录和模式变更审核。', '2026-07-15 15:30：补充团队类型、时间、权限和操作记录，并将净输赢、佣金及关系结余处理切换为当月结余规则。'),
  'master:singles': note('独立单线管理', '查看站点直建或副线转入的独立单线及其推荐关系。', '线主、创建来源、业务范围、方案、推荐人、奖励方案、生效周期和状态。', '独立单线独立计算三个指标、独立定级并由平台直接向线主结算。', '关联团队模式切换、推荐奖励、独立单线账单和关系记录。', '2026-07-14：新增独立单线列表、详情、加入团队和终止申请。'),
  'master:plans': note('佣金管理', '在原返佣方案中整合佣金方案、活跃会员定义和代理成本，不额外堆叠菜单。', '方案类型、等级、新增活跃、活跃会员、冲正后净输赢、佣金比例、奖励基数、生效周期、活跃门槛、场馆费、存款手续费和提款手续费。', '等级条件同时满足后取最高等级；佣金统一按当月结余规则计算，推荐奖励按独立单线已审核应付佣金乘以比例计算。', '关联代理资料、团队考核、独立单线考核、代理佣金结算和站点佣金配置。', '2026-07-15 15:30：原返佣方案更名佣金管理，新增活跃会员定义、代理成本页签及方案复制、等级调整演示。'),
  'master:settlement': note('代理佣金结算', '按团队佣金、独立单线佣金和推荐奖励查看完整计算明细、调整本月结余并审核发放。', '佣金月份、账单类型、代理类型、成为代理时间、团队、收款人、注册/首存/活跃、存提款、总输赢、场馆费、红利、返水、账户调整、补单输赢、存提款手续费、净输赢、上月结余、本月结余调整、冲正后净输赢、比例、佣金调整、应付、已发和状态。', '本月结余调整只允许当前佣金月份；历史已发佣金余额在代理管理调整；应付不小于零，发放金额不超过账单剩余与站点当日剩余额度。', '关联佣金管理、团队代理、独立单线、推荐关系、站点账单发放和佣金记录。', '2026-07-15 15:30：补齐 Excel 佣金计算字段、列信息选择和本月结余调整弹窗，并以当月结余规则覆盖旧计算口径。'),
  'master:records': note('佣金与内部结算记录', '按账单类型查询平台佣金和主线内部结算，支持列信息选择与完整详情回放。', '账单类型、结算单元、代理类型、收付款对象、净输赢、上月结余、本月结余调整、冲正后净输赢、佣金调整、应付、已发、资金来源、状态、凭证、维护人和时间。', '团队平台账单与内部结算分别对账；关系变化不回写历史记录，当月结余归属以账单生成时的结算单元为准。', '关联代理佣金结算、团队账单、独立单线账单、推荐奖励和主线可用余额。', '2026-07-15 15:30：增加账单类型筛选、详细计算字段、列信息和详情弹窗，保留平台账单与内部结算双视图。'),
  'master:withdrawals': note('代理提款审核与提款记录', '在代理管理大模块内新增代理提款，集中查询并审核代理提款订单。', '站点、代理账号、上级账号、代理类型、提款类型、订单号、订单状态、申请时间、USDT金额、实际CNY金额、提款信息、审核人、审核时间和备注。', '提款审核页只显示待审核订单，提款记录显示全部订单；审核通过扣减本人可提现余额，拒绝释放处理中占用，不混用团队主线、副线和独立线主资金。', '关联代理资料、佣金账单、团队内部结算、代理钱包和站点/代理端提款页面。', '2026-07-15 15:30：新增组合筛选、提款审核、拒绝、全部记录及完整订单详情。'),
  'master:reversal': note('冲正统计报表', '保留原冲正汇总口径并补充团队身份和结算单元识别。', '所属站点、代理、团队身份、结算单元、垫付人数、垫付与欠款金额。', '冲正仍按原台账统计，不改变团队佣金和内部结算的责任边界。', '关联佣金记录、团队账单和冲正回款报表。', '2026-07-14：补充团队身份和结算单元字段。'),
  'master:returns': note('冲正回款报表', '保留原回款明细并区分团队主线、独立线主与原代理模式。', '站点、代理、结算身份、类型、垫付或回款、额度、缺口和时间。', '回款只冲减原冲正台账，不直接改变团队主副线关系。', '关联冲正统计、佣金账单和代理余额。', '2026-07-14：补充结算身份字段。'),
  'master:revenue': note('代理收益看板', '按结算模式查看团队、独立单线和原代理模式的经营结果。', '结算模式、结算单元、新增活跃、活跃会员、净输赢值、佣金和余额。', '团队数据展示团队合并口径，独立单线只展示本线范围，避免父子数据重复。', '关联团队考核、独立单线考核和佣金结算。', '2026-07-14：增加结算模式、结算单元和团队考核指标。'),
  'master:cycle': note('结算周期设置', '保留现有周期设置并说明团队关系只能从未来完整周期生效。', '结算频率、执行日期、执行时间和下一次执行时间。', '关系、方案和推荐变更不能追溯当前或已锁定周期。', '关联团队关系版本、模式变更审核和账单生成。', '2026-07-14：补充团队代理未来周期生效规则。'),
  'master:relations': note('团队代理关系变更记录', '统一回放关系申请与团队生命周期操作，并明确每次变更的当月结余归属。', '变更类型、申请人、原结算单元、目标结算单元、生效周期、当月结余处理、冲突、状态、团队类型、主副线账号、操作人和时间。', '变更必须无周期重叠或空档；加入团队结余带入，移出留原团队，解散由指定代理承接，历史账单保持原结算单元。', '关联团队代理、独立单线、站点审核、团队操作记录和周期设置。', '2026-07-15 15:30：增加当月结余处理字段及团队操作记录页签，覆盖旧负值结余关系口径。'),
  'site:teams': note('站点团队代理管理', '站点运营创建代理部、指定主线并管理副线、团队偏好和完整生命周期。', '代理部、团队类型、主线、副线数量、团队方案、创建时间、生效周期、副线会员详情权限、状态和操作原因。', '同一团队必须同站点同币种；加入团队结余带入、移出留原团队、解散由指定代理承接；冻结期间停止新增关系和资金操作。', '关联站点审核、佣金配置、账单发放、内部结算监控和团队操作记录。', '2026-07-15 15:30：补充团队类型、创建时间、详情权限、偏好编辑、分页和团队操作记录。'),
  'site:singles': note('站点独立单线管理', '站点直接创建单人单线并维护推荐关系和生命周期。', '线主、来源、推荐人、方案、起始周期、范围和状态。', '单人单线初始范围只包含线主节点，后续关系变化从未来完整周期生效。', '关联模式变更审核、推荐奖励和独立单线账单。', '2026-07-14：新增直建单人单线、加入团队和终止申请。'),
  'site:review': note('模式变更审核', '集中审核副线转独立、单线加入团队和团队换主线，并核对当月结余归属。', '申请类型、申请人、原目标单元、生效周期、推荐人、当月结余处理、冲突和审核状态。', '审核前检查重复归属、未结账单、冻结资金和周期冲突；关系通过后结余按加入带入、移出留原团队、解散指定承接执行。', '关联团队代理、独立单线、账单和关系记录。', '2026-07-15 15:30：审核列表与详情补充当月结余归属说明并统一为 Excel 规则。'),
  'site:plans': note('站点佣金配置', '在原方案页配置站点团队、独立单线和推荐奖励方案，并查看活跃定义及代理成本。', '方案版本、等级门槛、佣金比例、奖励基数、活跃定义、场馆费、存款手续费、提款手续费和未来生效周期。', '方案变更只影响未来周期；佣金统一按冲正后净输赢与当月结余计算，历史账单继续使用当期快照。', '关联总控佣金管理、团队考核、单线考核、代理端佣金口径和奖励账单。', '2026-07-15 15:30：原方案页增加活跃定义和代理成本页签、共享配置保存及当月结余公式。'),
  'site:settlement': note('站点账单提交与发放', '站点提交三类平台账单并在审核后发起发放。', '账单类型、收款人、应付、已发、剩余、日额度和状态。', '账单审核通过后锁定关系和计算结果；发放受账单剩余和站点日额度共同限制。', '关联总控审核、佣金记录和站点额度。', '2026-07-14：新增提交审核、部分发放和额度占用提示。'),
  'site:withdrawals': note('站点代理提款审核', '站点运营在同一页面处理待审核代理提款并查询全部提款记录。', '站点、代理账号、上级账号、代理类型、提款类型、订单号、状态、申请时间、USDT金额、实际CNY金额、提款信息和审核信息。', '审核通过扣减代理本人可提现余额，拒绝释放处理中金额；审核结果实时反映到总控和代理端演示页面。', '关联代理资料、佣金账单、内部结算、代理钱包和总控代理提款。', '2026-07-15 15:30：新增代理提款审核、拒绝、组合筛选、全部记录及详情。'),
  'agent:dashboard': note('代理团队经营看板', '按主线、副线和独立线主身份展示各自可见的经营数据、当月结余和操作。', '团队身份、活跃指标、净输赢、上月结余、本月结余调整、冲正后净输赢、等级、账单、可用余额和关系状态。', '主线看团队合并口径，副线只看本人范围，独立线主独立考核；佣金按当月结余计算，三种身份资金边界互不混用。', '关联团队结构、佣金账单、内部结算、代理提款和关系申请。', '2026-07-15 15:30：补充活跃定义、代理成本、站点方案和当月结余口径，保留三身份权限差异。'),
  'agent:bills': note('我的佣金账单', '根据当前身份展示平台账单或主线内部结算记录，并说明当前佣金计算依据。', '账单类型、周期、结算单元、冲正后净输赢、比例、应付、已发、剩余、状态、活跃定义、代理成本和站点方案。', '团队副线不生成平台应付账单，只查看主线向本人的内部结算；主线和独立线主账单采用当月结余规则。', '关联团队账单、独立单线账单、推荐奖励、内部结算和代理提款。', '2026-07-15 15:30：三身份账单增加共享佣金口径展示、分页及当月结余说明。'),
  'agent:internal': note('副线内部结算', '主线自主向副线结算，副线只查看本人收到的记录。', '副线、金额、结算依据、资金来源、状态、凭证和时间。', '使用平台已到账余额时，本次金额不得超过主线团队可用余额。', '关联团队账单、主线余额和副线收款。', '2026-07-14：新增可用余额校验、主线录入和副线只读视图。'),
  'agent:requests': note('关系与模式申请', '发起开副线、转独立单线、加入团队或终止单线申请，并查看团队操作记录。', '申请类型、原目标单元、生效周期、推荐人、当月结余处理、冲突、状态、操作人和时间。', '关系从下一完整周期生效；加入团队结余带入、移出留原团队、解散由指定代理承接，历史账单不回写。', '关联站点审核、团队结构、独立单线、佣金账单和团队操作记录。', '2026-07-15 15:30：补充当月结余处理和团队操作记录页签，统一关系变更规则。'),
  'agent:withdrawals': note('我的代理提款', '代理按当前演示身份查看本人可提现余额、处理中金额并提交提款申请。', '代理身份、账号、可提现余额、处理中金额、提款类型、收款网络、USDT金额、实际CNY金额、提款信息、订单状态、申请时间和审核信息。', '申请金额只能来自本人可提现余额；待审核和处理中订单占用余额；主管主线、副线负责人和独立线主只查看本人订单。', '关联我的佣金账单、团队内部结算、代理钱包及站点/总控提款审核。', '2026-07-15 15:30：新增本人提款申请、余额校验、订单列表和完整详情，支持三身份隔离演示。'),
  h5: note('H5 提现额度与流水说明', '展示会员可提现余额、锁定额度，并在展开后按场馆流水或充值行为流水解释提现条件。', '总额度、可提现余额、锁定余额、场馆、锁定额度、已完成有效流水、还需解锁流水、记录类型、发生时间、计入额度、盈利解锁额度和状态。', '可提现余额 = 总额度 − 锁定余额；场馆流水切页展示各场馆剩余解锁流水，充值流水切页将成功充值与系统发放彩金分别展示为独立记录，按发生时间 FIFO 解锁且无需关联充值订单；有效投注确认后，剩余解锁量和锁定额度同步更新；若本轮盈利，盈利解锁额度需本轮全部充值流水完成后可领取，亏损则不展示额度。', '关联会员打码流水统计表、会员充值、会员钱包、场馆活动流水和会员取款方式。', '2026-07-15 12:47：充值流水切页补充盈利解锁额度及领取条件，明确亏损不展示额度。', { updatedAt: '2026-07-15 12:47' }),
}

const BALANCE_LOGIC = '净输赢 = 总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费；当月结余 = 冲正后净输赢 = 净输赢 + 上月结余 + 本月结余调整；佣金 = MAX（0，当月结余 × 佣金比例 + 佣金调整）。'
const RELATION_LOGIC = '所有记录按所属团队、line_id、结算身份、结算单元和生效周期归集；关系变更只影响未来完整周期，当前周期与历史记录不回写。'
const REPORT_NOTE_SPECS = {
  members: ['代理会员', '查询代理范围内会员的当前归属和经营概况。', '会员账号、直属代理、所属团队、line_id、结算身份、结算单元、关系生效时间、首存、余额、有效投注、输赢和状态。', '关联代理管理、存款记录、游戏记录、账变明细和会员打码流水统计。'],
  finance: ['代理财务', '汇总代理或结算单元的资金、成本、当月结余与佣金结果，指标卡可下钻。', '代理、团队、线路、结算身份、存提款、总输赢、费用、净输赢、上月结余、本月结余调整、当月结余、佣金和状态。', '关联返佣方案、账单提交与发放、个人佣金、佣金记录和站点利润。'],
  deposits: ['存款记录', '逐笔查询会员存款与代理代存结果。', '存款单号、会员、直属代理、团队、线路、结算身份、渠道、金额、手续费、状态和时间。', '关联代理代存、预付金账户、会员余额、账变明细和充提转账统计。'],
  games: ['游戏记录', '逐笔查询会员投注、有效投注、派彩和输赢结果。', '注单号、会员、直属代理、团队、线路、场馆、游戏、投注、有效投注、派彩、输赢、状态和时间。', '关联代理会员、代理财务、场馆代理费用和佣金结算。'],
  accountChanges: ['账变明细', '回放会员与代理资金变化前后值及业务来源。', '账变单号、账户、账户类型、直属代理、团队、线路、钱包、账变类型、变更前、变更金额、变更后、状态和时间。', '关联佣金发放、内部结算、代理代存、代理提款和存款记录。'],
  transfers: ['转账明细', '查询平台佣金、内部结算、代理代存和代理提款的资金去向。', '转账单号、付款方、收款方、代理、团队、线路、结算身份、类型、金额、手续费、状态和时间。', '关联账单发放、内部结算、代理代存、代理提款和账变明细。'],
  transferStats: ['充提转账统计', '按代理、团队、线路和结算单元汇总充提与转账结果。', '统计周期、代理、团队、线路、结算身份、充值笔数与金额、提款笔数与金额、转入、转出和净流入。', '关联存款记录、代理提款、转账明细和代理财务。'],
  venueFees: ['场馆代理费用', '按场馆和结算单元查看总输赢、费率和场馆费用。', '周期、代理、团队、线路、结算身份、场馆、总输赢、场馆费率、场馆费、扣费后金额和状态。', '关联游戏记录、代理财务、佣金结算和站点利润。'],
  commissionRecords: ['佣金发放记录', '查询平台佣金与主线内部结算的计算基数、发放和剩余金额。', '佣金单号、类型、收款代理、结算单元、周期、当月结余、比例、调整、应付、已发、剩余和状态。', '关联返佣方案、账单提交与发放、个人佣金、内部结算和账变明细。'],
  reversal: ['冲正统计', '保留原冲正汇总口径并补充团队与线路识别。', '代理、团队、线路、结算身份、结算单元、垫付人数、垫付金额、已回款、欠款和状态。', '关联佣金发放记录、冲正回款和代理财务。'],
  returns: ['冲正回款', '逐笔查询冲正垫付、回款方向和剩余缺口。', '回款记录号、代理、团队、线路、结算身份、类型、垫付金额、回款金额、剩余缺口、状态和时间。', '关联冲正统计、账变明细和个人佣金。'],
  siteProfit: ['站点利润', '按结算单元查看站点收入、经营成本、佣金和留存利润。', '站点、周期、结算单元、结算模式、总输赢、场馆费、红利、返水、佣金、手续费、站点利润和状态。', '关联代理财务、场馆代理费用、佣金发放记录和运营首页。'],
  prepaid: ['预付金账户', '查询并调整代理预付金额度、冻结金额和当前可用余额。', '代理、团队、线路、结算身份、结算单元、信用额度、可用预付金、冻结金额、本次变动、状态和时间。', '关联代理代存处理、账变明细和代理财务。'],
  agentPay: ['代理代存处理', '代理使用本人佣金余额或预付金额度向范围内会员代存，站点完成审核。', '代存单号、代理、会员、团队、线路、结算身份、扣款账户、金额、流水倍数、所需流水、状态、审核人和时间。', '关联预付金账户、存款记录、会员余额、账变明细和转账明细。'],
}

function reportNote(portal, page, spec) {
  const [title, summary, fields, related] = spec
  const isAgent = portal === 'agent'
  const moneyPage = ['finance', 'deposits', 'games', 'accountChanges', 'transfers', 'transferStats', 'venueFees', 'commissionRecords', 'reversal', 'returns', 'siteProfit', 'prepaid', 'agentPay'].includes(page)
  const logic = `${RELATION_LOGIC}${moneyPage ? ` ${BALANCE_LOGIC}` : ''}${isAgent ? ' 主管主线可查看团队及各线汇总，副线只查看本人线路且不显示平台应付账单、其他副线数据或团队可用余额，独立线主只查看独立单线。' : ' 站点后台只查看并处理本站代理业务范围。'}`
  return note(`${isAgent ? '代理端' : '站点端'}${title}`, summary, fields, logic, related, `2026-07-15 18:30：恢复原有${title}页面，增加团队、线路、结算身份、结算单元和生效周期筛选，并补齐分页、详情、导出与角色范围演示。`, {
    updatedAt: UPDATED_AT,
    requirement: `在不改变原${title}结构的前提下补充团队代理识别字段和可操作的原型交互，保持页面简单、可查询、可解释。`,
    acceptance: `可按团队代理兼容字段筛选并打开详情；分页与导出入口可用；${isAgent ? '切换三种演示身份后数据范围正确，副线权限受限。' : '只展示旺财体育本站数据，并可与代理端对应记录相互核对。'}`,
    boundary: '本页为演示原型，使用共享模拟数据；刷新后恢复初始状态，不处理真实业务资金。',
  })
}

Object.entries(REPORT_NOTE_SPECS).forEach(([page, spec]) => {
  PAGE_NOTES[`site:${page}`] = reportNote('site', page, spec)
  if (page !== 'siteProfit' && page !== 'prepaid') PAGE_NOTES[`agent:${page}`] = reportNote('agent', page, spec)
})

PAGE_NOTES['site:siteDashboard'] = note('站点运营首页', '恢复站点运营看板，集中查看收入、充值、提款、投注、会员、代理、佣金余额、趋势和排行。', '统计周期、站点收入、充值、提款、投注、有效投注、会员数、代理数、佣金余额、代理余额、趋势和代理排行。', '指标卡可点击查看组成明细；日期切换只改变周期类指标，会员、代理和余额类采用当前状态。站点收入按当前代理范围会员输赢汇总，佣金余额 = 应付佣金 − 已发佣金。', '关联代理管理、代理财务、佣金发放记录、站点利润和资金操作。', '2026-07-15 18:30：恢复站点运营首页，补齐周期切换、指标下钻、趋势和代理排行。')
PAGE_NOTES['site:siteAgents'] = note('站点代理管理', '恢复站点代理主档，在原资料与经营字段上补充团队结算信息。', '代理ID、账号、类型、代理模型、状态、推广人员、上级代理、结算模式、结算身份、代理部、line_id、负责人、生效周期、当月结余、会员、投注和余额。', `${RELATION_LOGIC} 创建团队、开副线和换主线只能选择本站已存在且启用的代理；代理模型和结算身份分开维护。 ${BALANCE_LOGIC}`, '关联团队代理管理、模式变更审核、代理财务、佣金管理和代理端下级代理。', '2026-07-15 18:30：恢复站点代理主档、组合筛选、经营详情和关系历史页签，并补充团队代理字段。')
PAGE_NOTES['agent:downline'] = note('代理端下级代理', '按当前演示身份查看本人代理树、经营归属和关系版本。', '关系层级、代理ID、账号、上级、代理模型、结算模式、结算身份、结算单元、line_id、生效周期、会员、活跃会员和状态。', `${RELATION_LOGIC} 关系变更历史放在代理详情页签；副线和独立线主不查看其他线路。`, '关联代理会员、关系与模式申请、个人财务和站点代理管理。', '2026-07-15 18:30：恢复下级代理列表，将关系历史整合到详情页签并补充团队代理字段。')
PAGE_NOTES['agent:readonlyPlans'] = note('代理端返佣方案', '按当前身份只读查看站点生效的团队方案、独立单线方案和推荐奖励口径。', '方案编号、名称、类型、站点、生效周期、等级门槛、活跃门槛、当月结余门槛、佣金比例、奖励比例和状态。', `代理端不能修改方案；方案变更只影响未来完整周期，历史账单使用生成时快照。 ${BALANCE_LOGIC}`, '关联站点返佣方案与分润配置、个人佣金、佣金账单和代理财务。', '2026-07-15 18:30：恢复代理端只读返佣方案，补充等级、活跃定义和代理成本详情。')
PAGE_NOTES['agent:personalCommission'] = note('代理端个人佣金', '按当前身份查看本人佣金、内部结算到账、待到账和可用余额。', '身份、账号、结算单元、line_id、周期、当月结余、比例、应付或结算金额、已到账、待到账、状态和代理余额。', `${BALANCE_LOGIC} 副线只显示主线向本人支付的内部结算，不形成平台对副线的佣金账单。`, '关联返佣方案、我的佣金账单、内部结算、账变明细、代理代存和代理提款。', '2026-07-15 18:30：恢复个人佣金汇总，补充三身份资金边界、筛选、详情和导出。')
PAGE_NOTES['agent:dashboard'] = note('代理运营看板', '将团队经营看板兼容为完整代理运营首页，按主管主线、副线负责人和独立线主展示经营、资金与团队操作。', '身份、代理账号、充值、提款、投注、有效投注、活跃会员、净输赢、当月结余、等级、佣金、到账、余额、团队线路和状态。', `${BALANCE_LOGIC} 主管主线查看团队汇总与各线，副线只查看本人线路且不显示平台账单和团队余额，独立线主只查看独立单线。`, '关联下级代理、代理会员、个人财务、佣金账单、内部结算、关系申请和代理提款。', '2026-07-15 18:30：在原团队经营看板补充代理运营指标和原有代理模块跳转，保留三身份权限边界。')

export const P1_ROADMAP = ['副线批量开设与范围调整', '内部结算模板', '主线自有资金提前结算', '方案计算预演', '推荐奖励期限与阶梯', '历史余额受控移交']
