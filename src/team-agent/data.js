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
    agent({ id: '373', account: 'WC002', model: '负盈利模式', agentType: '团队代理', teamAgentType: '普通代理', developer: 'gaodashang', parentId: '345', email: 'wc002@example.com', registeredAt: '2026-06-02 12:30', settlementMode: '团队模式', identity: '副线负责人', unit: 'gaodashang01部', lineId: 'LINE-B', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'gaodashang', subAgents: 2, members: 31, activeMembers: 37, newActiveMembers: 11, depositAmount: 168000, withdrawalAmount: 62000, totalWinLoss: 146000, validBetting: 780000, plan: '旺财团队月结方案', balance: 3100, lastLogin: '2026-07-14 18:36' }),
    agent({ id: '374', account: 'LGNB', model: '负盈利模式', agentType: '团队代理', teamAgentType: '普通代理', developer: 'gaodashang', parentId: '345', email: 'lgnb@example.com', registeredAt: '2026-06-06 17:40', settlementMode: '团队模式', identity: '副线负责人', unit: 'gaodashang01部', lineId: 'LINE-C', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'gaodashang', subAgents: 1, members: 22, activeMembers: 23, newActiveMembers: 7, depositAmount: 92000, withdrawalAmount: 38000, totalWinLoss: 50000, validBetting: 410000, plan: '旺财团队月结方案', balance: 2850, lastLogin: '2026-07-13 20:10' }),
    agent({ id: '1749', account: 'dailiwc001', model: '负盈利模式', agentType: '团队代理', teamAgentType: '官方代理', developer: 'apppay', parentId: '901', boundMemberAccount: 'M201749', email: 'dailiwc001@example.com', registeredAt: '2026-05-26 11:45', settlementMode: '独立单线', identity: '独立代理', unit: '独立单线01', lineId: 'SINGLE-001', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'apppay', subAgents: 1, members: 18, activeMembers: 46, newActiveMembers: 12, depositAmount: 214000, withdrawalAmount: 87000, totalWinLoss: 170000, validBetting: 920000, plan: '旺财团队月结方案', balance: 68903.14, lastLogin: '2026-07-12 11:08' }),
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
        { lineId: 'LINE-E', identity: '副线', agent: 'dailiwc001', scope: '独立单线01原业务范围', newActive: 0, firstDepositCount: 0, firstDepositAmount: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: '2026-08' },
      ],
    },
  ],
  singles: [
    { id: 'SINGLE-001', code: 'SL-001', name: '独立单线01', owner: 'dailiwc001', site: '旺财体育', currency: 'CNY', source: '站点直接创建', recommender: 'apppay', plan: '独立单线月结方案', rewardPlan: '推荐奖励10%方案', status: '生效中·待转入', startCycle: '2026-07', scope: '线主本人代理节点', metrics: { newActive: 12, activeMembers: 46, currentNet: 170000, previousNegative: 0, assessmentNet: 170000, grade: '四星', rate: 0.4, payable: 68000 } },
    { id: 'SINGLE-002', code: 'SL-002', name: 'WC002 独立单线', owner: 'WC002', site: '旺财体育', currency: 'CNY', source: '副线转独立', recommender: 'gaodashang', plan: '独立单线月结方案', rewardPlan: '推荐奖励10%方案', status: '待生效', startCycle: '2026-08', scope: '原 LINE-B 业务范围', metrics: { newActive: 0, activeMembers: 0, currentNet: 0, previousNegative: 0, assessmentNet: 0, grade: '待计算', rate: 0, payable: 0 } },
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
    { id: 'PLAN-S-001', type: '独立单线方案', name: '独立单线月结方案', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', levels: [
      { grade: '一星', newActive: 3, firstDepositMembers: 2, firstDepositAmount: 10000, activeMembers: 10, netWinLoss: 30000, rate: 0.25 },
      { grade: '二星', newActive: 5, firstDepositMembers: 3, firstDepositAmount: 18000, activeMembers: 20, netWinLoss: 60000, rate: 0.3 },
      { grade: '三星', newActive: 8, firstDepositMembers: 5, firstDepositAmount: 30000, activeMembers: 30, netWinLoss: 100000, rate: 0.35 },
      { grade: '四星', newActive: 12, firstDepositMembers: 8, firstDepositAmount: 50000, activeMembers: 45, netWinLoss: 160000, rate: 0.4 },
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
    ['旺财体育', 'gaodashang', '345', '团队代理', '团队负责人', 4, 170.45, 21687.56, 12000, 2500, 36358.01, 29237.56, 7120.45, 0, 0],
    ['财神客栈', 'FEE0427_B6', '916', '层级代理', '6层', 2, 0, 0, 0, 19651.35, 19651.35, 0, 19651.35, 0, 0],
    ['财神客栈', 'caishen12301', '344', '层级代理', '6层', 1, 15010, 0, 0, 0, 15010, 5000, 10010, 0, 0],
    ['财神客栈', 'NA8', '769', '星级代理', '4星', 1, 15000, 0, 0, 0, 15000, 0, 15000, 0, 0],
    ['财神客栈', 'FEE0428_A8', '1109', '星级代理', '5星', 1, 15000, 0, 0, 0, 15000, 15000, 0, 0, 0],
    ['财神客栈', 'FEE0428_B8', '1117', '团队代理', '团队成员', 1, 1000, 3069.3, 0, 10520, 14589.3, 0, 14589.3, 0, 0],
    ['旺财体育', 'WC002', '373', '团队代理', '副线负责人', 2, 3100, 1755.66, 8300, 0, 13155.66, 12005.66, 1150, 1, 3206.38],
    ['财神客栈', 'facai', '349', '层级代理', '4层', 1, 0, 0, 9000, 0, 9000, 2100, 6900, 3, 17822],
    ['财神客栈', 'NA7', '768', '层级代理', '7层', 1, 8000, 0, 0, 0, 8000, 0, 8000, 1, 15000],
    ['财神客栈', 'FEE0428_A7', '1108', '层级代理', '7层', 1, 8000, 0, 0, 0, 8000, 8000, 0, 0, 0],
    ['旺财体育', 'WC001', '371', '星级代理', '3星', 1, 100, 4650, 3000, 0, 7750, 7750, 0, 0, 0],
    ['财神客栈', 'caishen123', '340', '团队代理', '独立代理', 1, 5, 7120, 0, 0, 7125, 178, 6947, 0, 0],
  ],
  returns: [
    ['旺财体育', 'gaodashang', '345', '团队代理', '团队负责人', '余额', '垫付', 6.23, 6.23, 'CZ536', '2026-07-13 11:24:01'],
    ['旺财体育', 'gaodashang', '345', '团队代理', '团队负责人', '余额', '垫付', 0.62, 0.62, 'CZ537', '2026-07-13 11:24:01'],
    ['旺财体育', 'dailiwc001', '1749', '团队代理', '独立代理', '余额', '回款', 94.34, 0, 'CZ492', '2026-07-13 02:02:30'],
    ['旺财体育', 'gaodashang', '345', '团队代理', '团队负责人', '余额', '垫付', 43.61, 43.61, 'CZ524', '2026-07-13 02:02:28'],
    ['旺财体育', 'WC002', '373', '团队代理', '副线负责人', '级差佣金', '垫付', 1755.66, 1150, 'CZ526', '2026-07-11 02:06:00'],
    ['财神客栈', 'FEE0428_A8', '1109', '星级代理', '5星', '余额', '回款', 14692.5, 0, 'CZ475', '2026-04-28 23:08:38'],
    ['财神客栈', 'FEE0428_A6', '1107', '层级代理', '6层', '余额', '回款', 3000, 0, 'CZ473', '2026-04-28 23:08:37'],
    ['财神客栈', 'FEE0428_A7', '1108', '层级代理', '7层', '余额', '回款', 8000, 0, 'CZ474', '2026-04-28 23:08:37'],
    ['财神客栈', 'FEE0428_B8', '1117', '团队代理', '团队成员', '直属佣金', '垫付', 10520, 10520, 'CZ476', '2026-04-28 23:08:36'],
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
  '佣金方案': '计算公式：已设置的新增活跃、首充人数、首充额度、活跃会员、总输赢门槛同时满足后取最高等级；未设置的门槛不参与判断；活跃会员按全局条件判定，充值金额或有效投注任一达到门槛即计为活跃。',
  '代理佣金结算': '计算公式：净输赢 = 总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费；冲正后净输赢 = 净输赢 + 上月结余 + 本月结余调整；本月结余 = 冲正后净输赢；佣金 = MAX（0，冲正后净输赢 × 比例 + 佣金调整）；账单剩余 = 应付金额 − 累计成功发放。',
  '佣金与内部结算记录': '计算公式：主线团队可用余额 = 累计成功到账 − 成功内部转账 − 处理中占用 − 其他扣减。',
  '佣金记录': '计算公式：待发佣金 = 佣金金额 − 已发佣金；代理身份展示规则 = 团队代理显示团队负责人、副线负责人、独立代理或团队成员，星级代理显示几星，层级代理显示几层。',
  '冲正回款报表': '计算公式：额度缺口 = 同一冲正账目原欠款额度 − 累计成功回款金额；本次记录为“垫付”时增加待回款额度，为“回款”时减少额度缺口。',
  '代理收益看板': '计算公式：本期佣金预计净收益 = 总推广佣金 − 已结算佣金；未收回欠款 = 该代理欠款 − 已收回金额；活跃代理、活跃会员、付费会员与新增付费按查询日期范围统计。',
  '代理团队经营看板': '计算公式：团队三个指标 = 主线与全部有效副线在业务范围内去重汇总；本月结余 = 净输赢 + 上月结余 + 本月结余调整；平台应付佣金 = MAX（0，本月结余 × 最终比例 + 佣金调整）。',
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
  'master:version': note('版本需求归档', '按总控、站点、代理后台集中展示 1.0 与 2.0 版本需求及页面跳转。', '版本、完成时间、模块说明、修改说明、功能验收和页面入口。', '同一版本内仅保留每个业务项的最新说明，未完成的后续增强不计入已完成模块。', '关联三个后台的团队代理功能、会员流水统计、佣金管理、当月结余和代理自助页面。', '2026-07-17 05:50：覆盖更新 2.0 三后台代理模块说明，去除代理提款和独立单线管理独立入口，保留团队代理、佣金、报表和角色权限说明。', {
    updatedAt: UPDATED_AT,
    requirement: '按总控后台、站点后台和代理后台归档最新业务需求；同一版本同一模块只保留最新说明，并提供可用的页面跳转。',
    acceptance: '2.0 版本可按三后台看到会员流水、代理资料、佣金、团队关系和角色报表的最新说明与可用入口；代理提款和独立单线管理不再作为独立模块出现；1.0 归档保持可查询。',
  }),
  'master:memberTurnover': note('会员打码流水统计表', '集中统计会员充值、系统发放彩金、余额、提现资格、盈利解锁额度和未完成打码流水，支持分别查看场馆归集明细与按发生顺序的充值提现流水记录。', '站点、代理、会员、充值额度、总余额、可提现余额、锁定余额、场馆提现流水、充值提现流水、盈利解锁额度、记录顺序、记录类型、发生时间、计入额度、目标流水、已完成流水、还需解锁流水和状态。', '查询仅汇总已确认的有效流水；无可靠单独场馆归属时显示为“通用”。充值提现流水将成功充值与系统发放彩金均视为独立记录，无需关联充值订单，按发生时间 FIFO 解锁；前一笔未完成时不得跳过。有效投注确认后，已完成流水、剩余解锁量和对应锁定额度同步更新；盈利解锁额度仅在本轮盈利时展示，亏损无额度，且需本轮全部充值流水完成后才可领取。', '关联会员充值、会员钱包、H5 提现、场馆活动流水和运营查询。', '2026-07-15 14:20：列表去除打码状态和归因类型字段，仅保留站点、代理、会员等核心统计筛选与两类流水明细入口。', {
    updatedAt: '2026-07-15 14:20',
    requirement: '在会员管理下只维护会员打码流水统计表，帮助产品、运营和客服快速解释会员为什么可提、为什么仍有锁定余额，以及充值、系统发放彩金和盈利解锁额度的释放顺序。',
    acceptance: '可按站点、代理和会员查询；列表不展示打码状态和归因类型；点击场馆提现流水可看到每个场馆或“通用”的锁定额度、目标流水、已完成、待确认、剩余流水和状态；点击充值提现流水可看到充值与系统发放彩金的顺序、类型、发生时间、额度、目标/已完成/剩余流水和状态，并核对盈利解锁额度需本轮全部充值流水完成后领取的规则；H5 提现页金额标题下方可查看可提现、锁定和“解锁条件”，弹层第一列直接显示场馆名称、充值或彩金名称，不展示已解锁记录和盈利解锁额度行。',
    boundary: '本页为只读统计演示，使用固定模拟数据，不提供人工调整、任务创建或其他会员业务表；刷新页面后恢复初始内容。',
  }),
  'master:agents': note('代理管理', '按截图恢复代理管理列表与新增、修改、修改密码操作，在原代理类型基础上补充团队代理及团队类型。', '代理ID、代理账号、代理注册时间、代理类型、团队类型、代理身份、站点编码、上级代理、代理状态、谷歌验证、下属代理、下属会员、佣金方案、代理返佣比例、代理钱包余额和最后登录；新增与修改弹窗保留原代理账号、密码、站点、佣金方案、运营费、上级、状态和备注等基础字段，并在团队代理下展示团队类型和代理身份。', '代理类型保留多层级代理、星级代理，并新增团队代理；列表不再单独展示星级级别字段，原层级级别字段改为代理身份。新增代理选择团队代理时，代理身份固定为团队负责人；修改代理时可继续维护团队负责人、副线负责人、独立代理和团队代理成员。团队类型可选官方代理或普通代理，列表仅团队代理显示该字段，非团队代理显示横线；佣金方案同步切换为团队代理返佣方案选项。', '关联团队代理管理、佣金方案、代理佣金结算和佣金记录。', '2026-07-17 14:02：统一代理身份命名，将团队主负责人展示为团队负责人；新增代理选择团队代理时代理身份固定为团队负责人。', { updatedAt: '2026-07-17 14:02' }),
  'master:teams': note('团队代理管理', '集中管理代理部、团队负责人、副线结构、会员归属、合并业绩、团队当前余额和团队分佣结算。', '代理部、团队类型、主线、副线、line_id、业务范围、团队人数、会员人数、团队副线/单线、团队代理总人数、总会员数、活跃会员数、副线数、独立代理数、团队当前余额、未结算收益、当前返佣星级、团队返佣等级、距离下一等级条件、新增活跃、新增首存、首存额度、活跃会员、总盈亏、运营费用、净收益、历史欠款、代理结余、团队贡献占比、本期预估分红、历史结算记录和状态。', '团队人数、会员人数、团队副线和单线数量均可点击查看明细；团队人数展示代理名称、代理身份和代理ID，会员人数展示会员名称和上级代理，团队副线/单线展示相关代理名称、代理ID和下级会员数。团队详情的团队概况顶部展示团队当前余额与未结算收益，不再展示主线团队可用余额；当前返佣星级作为团队概况主体展示，用大号等级和返佣比例突出当前命中结果，下一等级所需条件作为副体展示新增活跃、新增首存、首存额度、活跃会员和团队当前余额差距。团队详情的主副线结构按每条 line_id 展示新增活跃、新增首存、首存额度、活跃会员和总盈亏；团队分佣结算在总盈亏右侧展示运营费用、净收益、历史欠款、代理结余、团队贡献占比、本期预估分红和操作，支持修改本月发放佣金并在二次确认后写入历史结算记录；团队详情不再展示内部结算页签。新增首存统计本周期首次成功存款会员数，首存额度为这些会员首笔成功存款金额合计。团队合并主线与有效副线范围后统一定级，每周期只生成一张团队账单并只付主线；加入团队当月结余随代理带入，移出时留原团队，解散时剩余结余由指定代理承接。', '关联代理资料、佣金管理、代理佣金结算、团队账单、团队操作记录和模式变更审核。', '2026-07-17 14:37：团队详情强化当前返佣星级主体展示，下一等级所需条件降为副体；业绩考核改名为团队分佣结算，净输赢值改为总盈亏；新增运营费用、净收益、历史欠款、代理结余、团队贡献占比、本期预估分红和操作，操作支持修改本月发放佣金及二次确认发放；新增历史结算记录并去除内部结算页签。', { updatedAt: '2026-07-17 14:37' }),
  'master:plans': note('佣金方案', '按原返佣方案页面维护方案列表，在原配置中支持新增层级、星级和团队代理方案，并维护全局活跃会员判定条件。', '序号、返佣方案名称、方案详情、创建时间、最后操作人、操作时间、操作；全局活跃会员判定条件包含充值金额门槛和有效投注门槛；新增和修改代理方案弹窗包含方案名称、方案类型、代理层级、新增活跃、首充人数、首充额度、活跃会员、总输赢、返佣比例和删除操作。', '团队佣金方案作为原返佣方案中的一条配置，不单独新增方案模块；新增代理方案时可选择层级代理、星级代理或团队代理。每个层级均可设置新增活跃、首充人数、首充额度、活跃会员、总输赢条件，留空代表该条件不生效；已设置的条件需同时满足后才命中该层级。活跃会员判定条件全局生效，充值金额或有效投注任一达到门槛即计为活跃会员。', '关联代理管理、团队代理管理、代理佣金结算和站点佣金方案。', '2026-07-17 05:14：佣金方案新增/修改弹窗将等级条件字段“新增会员”统一改为“新增活跃”，并同步方案详情、计算公式和说明文案。', { updatedAt: '2026-07-17 05:14' }),
  'master:settlement': note('代理佣金结算', '按原后台代理佣金结算未发放区域重构列表，用代理类型和代理身份替代原星级、层级两列，并保留原结算和确认操作。', '代理名称、所属站点、代理类型、代理身份、返佣比例、账单类型、直属上级代理、账期范围、代理直属会员盈亏、直属会员佣金和操作。', '代理类型统一为团队代理、星级代理和层级代理；团队代理身份显示团队负责人、副线负责人、独立代理或团队成员；星级代理显示几星，层级代理显示几层。操作列只保留原页面的结算或确认动作，不再展示团队代理“修改”入口，也不提供发放佣金调整弹窗。站点账单不属于代理身份，使用横线占位。', '关联佣金方案、代理管理、团队代理管理、佣金记录和站点账单发放。', '2026-07-17 14:56：代理佣金结算操作列去除团队代理“修改”选项，仅保留结算或确认动作，并移除发放佣金调整弹窗。', { updatedAt: '2026-07-17 14:56' }),
  'master:records': note('佣金记录', '按原后台佣金发放记录样式展示佣金周期、代理账号、站点名称、代理类型、代理身份、金额、方案、状态和发放信息。', '佣金周期、代理账号、站点名称、代理类型、代理身份、总输赢、月流水、首充金额、留存天数、佣金金额、返佣方案、佣金状态、发放时间、发放人员和详情。', '代理类型分为团队代理、星级代理和层级代理；团队代理身份展示团队负责人、副线负责人、独立代理或团队成员，星级代理展示几星，层级代理展示几层。记录详情沿用同一身份口径，不再在佣金记录列表中展示单独星级或层级字段。', '关联代理佣金结算、团队账单、独立单线账单、推荐奖励和主线可用余额。', '2026-07-17 03:06：按截图重构佣金记录列表与详情，站点名称右侧新增代理类型和代理身份，去除星级/层级列，并新增代理类型筛选。', { updatedAt: '2026-07-17 03:06' }),
  'master:reversal': note('冲正统计报表', '按截图重构冲正统计详情页，用原报表密度统计代理冲正业务数据，并补充代理类型与代理身份识别。', '所属站点、代理账号、ID、代理类型、代理身份、垫付冲正代理总人数、垫付余额、垫付级差佣金、垫付会员盈利、垫付直属佣金、垫付总计、回款总计、垫付剩余金额、欠款人数和欠款总计。', '代理类型分为团队代理、星级代理和层级代理；团队代理身份展示团队负责人、副线负责人、独立代理或团队成员，星级代理展示几星，层级代理展示几层。垫付总计 = 垫付余额 + 垫付级差佣金 + 垫付会员盈利 + 垫付直属佣金；垫付剩余金额 = 垫付总计 − 回款总计；欠款总计用于统计仍需追回的欠款额度。', '关联佣金记录、团队账单、代理管理和冲正回款报表。', '修改时间：2026-07-17 03:10；修改说明：按截图重构冲正统计详情页，帮助运营按代理类型和身份定位冲正责任；修改内容：ID 右侧新增代理类型和代理身份，去除代理等级，筛选项新增代理类型，指标卡扩展为垫付人数、欠款人数、垫付总计、回款总计、垫付剩余金额和欠款总计。', { updatedAt: '2026-07-17 03:10' }),
  'master:returns': note('冲正回款报表', '按原回款明细样式重构列表，并在 ID 右侧补充代理类型与代理身份。', '所属站点、名称、ID、代理类型、代理身份、类型、垫付或回款、额度、额度缺口、冲正账目ID和时间。', '代理类型分为团队代理、星级代理和层级代理；代理身份按类型展示，团队代理显示团队负责人、副线负责人、独立代理或团队成员，星级代理显示几星，层级代理显示几层；原代理等级字段不再单独展示。回款只冲减原冲正台账，不直接改变团队主副线关系。', '关联冲正统计、佣金账单和代理余额。', '2026-07-17 03:09：按截图重构冲正回款报表，ID 右侧新增代理类型和代理身份，去除代理等级字段，并新增代理类型筛选。', { updatedAt: '2026-07-17 03:09' }),
  'master:revenue': note('代理收益看板', '按截图重构为原后台收益明细宽表，用站点、代理账号和查询日期筛选代理经营与会员统计数据。', '所属站点、代理编号、代理账号、上级代理、账期范围、本期佣金预计净收益、当前余额、总推广佣金、已结算佣金、总充值、总提现、总投注、有效投注、总盈亏、该代理欠款、未收回欠款、会员VIP福利、活动福利、会员推广福利、充提手续费运营费、代理总人数、新增代理、活跃代理、会员总数、新增会员、活跃会员、付费会员、新增付费、代理推广会员、会员推广会员和30天未登录会员数。', '查询以所属站点、代理账号和日期范围为条件，默认展示当天凌晨查询范围；当前演示状态保留空表“暂无数据”。金额类指标用于对比代理收益、充值提现、投注输赢、福利成本、欠款和运营费，人数类指标用于观察代理与会员增长和活跃情况。', '关联代理管理、代理佣金结算、佣金记录、冲正统计报表和冲正回款报表。', '2026-07-17 03:12：按截图重构代理收益看板，改为原后台页签、说明头、筛选条、导出下载和收益宽表样式。', { updatedAt: '2026-07-17 03:12' }),
  'master:cycle': note('结算周期设置', '按原后台设置页样式配置站点、普通代理和团队代理的自动结算周期与执行时间。', '站点、代理类型、结算周期、结算频率、每周或每月结算日、执行具体时间、当前类型和下一次执行时间。', '普通代理与团队代理分别维护结算周期；团队代理与普通代理拥有相同的周结和月结选项，但可保存不同执行日和时间。保存后的周期在本次周期执行完成后开始生效，关系、方案和推荐变更仍只能从未来完整周期生效。', '关联代理佣金结算、佣金记录、团队代理管理、修改代理关系记录和账单生成。', '2026-07-17 03:20：按截图重构结算周期设置页，新增团队代理结算类型切换，普通代理和团队代理可分别配置周结/月结、结算日和执行时间。', { updatedAt: '2026-07-17 03:20' }),
  'master:relations': note('团队代理关系变更记录', '统一回放关系申请与团队生命周期操作，并明确每次变更的当月结余归属。', '变更类型、申请人、原结算单元、目标结算单元、生效周期、当月结余处理、冲突、状态、团队类型、主副线账号、操作人和时间。', '变更必须无周期重叠或空档；加入团队结余带入，移出留原团队，解散由指定代理承接，历史账单保持原结算单元。', '关联团队代理、独立单线、站点审核、团队操作记录和周期设置。', '2026-07-15 15:30：增加当月结余处理字段及团队操作记录页签，覆盖旧负值结余关系口径。'),
  'site:teams': note('团队代理管理', '按总控同名页面结构管理旺财体育本站代理部、主副线、成员明细和团队生命周期。', '代理部、团队类型、团队负责人、团队人数、会员人数、团队副线/单线、团队代理总人数、总会员数、活跃会员数、副线数、独立代理数、团队当前余额、未结算收益、当前返佣星级、团队返佣等级、距离下一等级条件、创建时间、加入时间、团队方案、生效周期、新增活跃、新增首存、首存额度、活跃会员、净输赢和状态。', '站点后台不展示跨站点选择，只处理旺财体育本站团队。团队人数、会员人数、团队副线和单线数量均可点击查看本站明细；团队详情顶部同步展示团队当前余额与未结算收益，并在团队概况中列出团队代理总人数、总会员数、活跃会员数、副线和独立代理，不展示主线团队可用余额。当前返佣星级为详情主体，使用大号星级和返佣比例突出当前命中等级；下一等级所需条件为副体，用于查看本站团队升档差距。团队详情按每条线路展示新增活跃、新增首存、首存额度、活跃会员和净输赢。加入团队结余带入、移出留原团队、解散由指定代理承接；冻结期间停止新增关系和资金操作。', '关联代理管理、模式变更审核、佣金方案、代理佣金结算、内部结算监控和团队操作记录。', '2026-07-17 14:37：同步总控团队详情视觉层级，将当前返佣星级强化为主体展示，下一等级所需条件降为副体展示。', { updatedAt: '2026-07-17 14:37' }),
  'site:review': note('模式变更审核', '集中审核副线转独立、单线加入团队和团队换主线，并核对当月结余归属。', '申请类型、申请人、原目标单元、生效周期、推荐人、当月结余处理、冲突和审核状态。', '审核前检查重复归属、未结账单、冻结资金和周期冲突；关系通过后结余按加入带入、移出留原团队、解散指定承接执行。', '关联团队代理、独立单线、账单和关系记录。', '2026-07-15 15:30：审核列表与详情补充当月结余归属说明并统一为 Excel 规则。'),
  'site:plans': note('佣金方案', '按总控同名页面结构查看和维护旺财体育本站生效的团队、独立单线和推荐奖励方案。', '方案版本、方案类型、生效周期、等级、新增活跃、首充人数、首充额度、活跃会员、总输赢、佣金比例、奖励基数、活跃定义、场馆费和存提款手续费。', '站点只能维护本站方案组合，不可修改其他站点配置；等级中已设置的新增活跃、首充人数、首充额度、活跃会员和总输赢门槛需同时满足，方案变更只影响未来完整周期，历史账单继续使用当期快照。', '关联总控佣金方案、团队代理管理、代理佣金结算和代理端只读方案。', '2026-07-17 05:33：页面名称同步为佣金方案，并补齐首充人数、首充额度等等级条件和本站权限说明。', { updatedAt: '2026-07-17 05:33' }),
  'site:settlement': note('代理佣金结算', '按总控同名页面结构处理旺财体育本站团队、独立单线和推荐奖励账单。', '代理账号、代理类型、代理身份、账单类型、结算单元、收款人、当月结余、应付、已发、剩余、站点日额度和状态。', '站点列表不展示所属站点列，数据固定为旺财体育；账单审核通过后锁定关系和计算结果，站点可提交审核并按账单剩余与当日剩余额度执行部分发放。', '关联总控代理佣金结算、佣金记录、站点额度和资金明细。', '2026-07-17 05:33：同步总控代理类型和代理身份字段，去除跨站点字段，并保留本站提交、审核和部分发放操作。', { updatedAt: '2026-07-17 05:33' }),
  'agent:dashboard': note('代理团队经营看板', '按主线、副线和独立线主身份展示各自可见的经营数据、当月结余和操作。', '团队身份、活跃指标、净输赢、上月结余、本月结余调整、冲正后净输赢、等级、账单、可用余额和关系状态。', '主线看团队合并口径，副线只看本人范围，独立线主独立考核；佣金按当月结余计算，三种身份资金边界互不混用。', '关联团队结构、佣金账单、内部结算和关系申请。', '2026-07-17 05:50：代理后台去除代理提款独立入口，经营看板继续保留经营、佣金和关系申请口径。'),
  'agent:bills': note('代理佣金结算', '按总控同名页面口径只读展示当前演示身份本人的平台账单或内部结算记录。', '代理类型、代理身份、账单类型、周期、结算单元、冲正后净输赢、比例、应付、已发、剩余、状态、活跃定义、代理成本和站点方案。', '代理后台不展示所属站点、其他团队或其他代理字段；团队负责人和独立代理只读查看本人平台账单，副线负责人不生成平台应付账单，只查看主线向本人的内部结算。', '关联佣金方案、佣金记录和副线内部结算。', '2026-07-17 05:33：统一页面名称与总控一致，补充代理类型和代理身份，并按当前身份裁剪为只读本人数据。', { updatedAt: '2026-07-17 05:33' }),
  'agent:internal': note('副线内部结算', '主线自主向副线结算，副线只查看本人收到的记录。', '副线、金额、结算依据、资金来源、状态、凭证和时间。', '使用平台已到账余额时，本次金额不得超过主线团队可用余额。', '关联团队账单、主线余额和副线收款。', '2026-07-14：新增可用余额校验、主线录入和副线只读视图。'),
  'agent:requests': note('关系与模式申请', '发起开副线、转独立单线、加入团队或终止单线申请，并查看团队操作记录。', '申请类型、原目标单元、生效周期、推荐人、当月结余处理、冲突、状态、操作人和时间。', '关系从下一完整周期生效；加入团队结余带入、移出留原团队、解散由指定代理承接，历史账单不回写。', '关联站点审核、团队结构、独立单线、佣金账单和团队操作记录。', '2026-07-15 15:30：补充当月结余处理和团队操作记录页签，统一关系变更规则。'),
  h5: note('H5 提现额度与解锁条件说明', '顶部展示中心钱包、锁定钱包和福利中心；页面保持 H5 手机端窄屏样式，选择提现方式后展开账户、金额、资金密码和解锁条件。', '中心钱包、锁定钱包、福利中心、一键回收、隐藏无余额场馆、提现方式、提现账户、提现金额、可提现、锁定、解锁条件、类型、手续费、实际到账、最低提现额度和资金密码。', '提现金额不得超过当前可提现金额；可提现与锁定金额展示在提现金额标题下方、输入框上方，文案简化为“可提现 / 锁定”且不展示单位。“解锁条件”弹窗以“类型 / 锁定额度 / 还需解锁流水”展示，合并核对场馆流水、充值流水和彩金流水，只展示仍需解锁的记录，不展示已解锁记录和盈利解锁额度行；第一列直接显示名称：场馆显示场馆名称，充值显示“充值”，彩金显示具体名称如 VIP周礼金、返水或活动奖励。弹窗底部提示投注流水同步可能存在延迟，如当前解锁额度与实际情况不符，请稍后刷新并重新查看。', '关联会员打码流水统计表、会员充值、会员钱包、场馆流水和会员取款方式。', '2026-07-16 17:27：解锁条件弹层第一列表头由“流水类型”调整为“类型”，其余锁定额度和还需解锁流水展示规则不变。', { updatedAt: '2026-07-16 17:27' }),
}

const BALANCE_LOGIC = '净输赢 = 总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费；当月结余 = 冲正后净输赢 = 净输赢 + 上月结余 + 本月结余调整；佣金 = MAX（0，当月结余 × 佣金比例 + 佣金调整）。'
const RELATION_LOGIC = '所有记录按所属团队、line_id、结算身份、结算单元和生效周期归集；关系变更只影响未来完整周期，当前周期与历史记录不回写。'
const REPORT_NOTE_SPECS = {
  members: ['代理会员', '查询代理范围内会员的当前归属和经营概况。', '会员账号、直属代理、所属团队、line_id、结算身份、结算单元、关系生效时间、首存、余额、有效投注、输赢和状态。', '关联代理管理、存款记录、游戏记录、账变明细和会员打码流水统计。'],
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
    ? '代理后台只展示当前演示身份本人及授权下级范围，不展示所属站点、其他团队或其他线路；团队负责人可查看本人团队及各线汇总，副线只查看本人线路，独立代理只查看独立单线。'
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

PAGE_NOTES['site:siteDashboard'] = note('站点运营首页', '恢复站点运营看板，集中查看收入、充值、提款、投注、会员、代理、佣金余额、趋势和排行。', '统计周期、站点收入、充值、提款、投注、有效投注、会员数、代理数、佣金余额、代理余额、趋势和代理排行。', '指标卡可点击查看组成明细；日期切换只改变周期类指标，会员、代理和余额类采用当前状态。站点收入按当前代理范围会员输赢汇总，佣金余额 = 应付佣金 − 已发佣金。', '关联代理管理、代理财务、佣金发放记录、站点利润和资金操作。', '2026-07-15 18:30：恢复站点运营首页，补齐周期切换、指标下钻、趋势和代理排行。')
PAGE_NOTES['site:siteAgents'] = note('代理管理', '按总控同名页面结构查看旺财体育本站代理主档，并补充团队结算信息。', '代理ID、账号、代理类型、代理模型、状态、推广人员、上级代理、结算模式、代理身份、代理部、line_id、负责人、生效周期、当月结余、会员、投注和余额。', `${RELATION_LOGIC} 页面固定为旺财体育本站，不展示跨站点字段；站点可查询本站代理资料，团队操作统一进入团队代理管理，代理资料修改仍由总控处理，不能操作其他站点代理。 ${BALANCE_LOGIC}`, '关联团队代理管理、模式变更审核、代理财务和代理端代理管理。', '2026-07-17 05:50：站点代理管理同步去除代理提款和独立单线管理入口，保留本站代理主档只读查询和团队字段。', { updatedAt: '2026-07-17 05:50' })
PAGE_NOTES['site:cycle'] = note('结算周期设置', '按总控同名页面结构维护旺财体育本站普通代理与团队代理的结算周期。', '当前站点、代理类型、周结或月结、结算日、执行时间、当前类型和下一次执行时间。', '当前站点固定为旺财体育且不可切换；站点可分别维护普通代理与团队代理的周期，保存后在本次周期执行完成后生效，历史账单不回写。', '关联代理佣金结算、佣金记录、团队代理管理和账单生成。', '2026-07-17 05:33：将总控结算周期设置下发到站点后台，去除跨站点选择，仅保留本站普通代理与团队代理配置。', { updatedAt: '2026-07-17 05:33' })
PAGE_NOTES['agent:downline'] = note('代理管理', '按总控同名页面口径查看当前演示身份本人及授权下级的代理树、经营归属和关系版本。', '关系层级、代理ID、账号、上级、代理模型、结算模式、代理身份、结算单元、line_id、生效周期、会员、活跃会员和状态。', `${RELATION_LOGIC} 代理后台不展示所属站点、跨团队管理或其他代理操作；团队负责人查看本人团队范围，副线负责人和独立代理只查看本人线路。`, '关联代理会员、关系与模式申请、个人财务和站点代理管理。', '2026-07-17 05:33：页面名称同步为代理管理，并按当前身份裁剪为本人及授权下级的只读范围。', { updatedAt: '2026-07-17 05:33' })
PAGE_NOTES['agent:readonlyPlans'] = note('佣金方案', '按总控同名页面口径只读查看当前身份适用的团队、独立单线和推荐奖励方案。', '方案编号、名称、类型、生效周期、等级、新增活跃、首充人数、首充额度、活跃会员、总输赢、佣金比例、奖励比例和状态。', `代理端不展示所属站点和修改操作，只能查看当前身份适用方案；方案变更只影响未来完整周期，历史账单使用生成时快照。 ${BALANCE_LOGIC}`, '关联站点佣金方案、个人佣金、代理佣金结算和代理财务。', '2026-07-17 05:33：页面名称同步为佣金方案，补齐首充人数和首充额度，并保持代理端只读。', { updatedAt: '2026-07-17 05:33' })
PAGE_NOTES['agent:personalCommission'] = note('代理端个人佣金', '按当前身份查看本人佣金、内部结算到账、待到账和可用余额。', '身份、账号、结算单元、line_id、周期、当月结余、比例、应付或结算金额、已到账、待到账、状态和代理余额。', `${BALANCE_LOGIC} 副线只显示主线向本人支付的内部结算，不形成平台对副线的佣金账单。`, '关联佣金方案、代理佣金结算、内部结算、账变明细和代理代存。', '2026-07-17 05:50：代理后台资金菜单去除代理提款入口，个人佣金仍保留本人佣金、到账和余额查询。')
PAGE_NOTES['agent:dashboard'] = note('代理运营看板', '将团队经营看板兼容为完整代理运营首页，按团队负责人、副线负责人和独立线主展示经营、资金与团队操作。', '身份、代理账号、充值、提款、投注、有效投注、活跃会员、净输赢、当月结余、等级、佣金、到账、余额、团队线路和状态。', `${BALANCE_LOGIC} 团队负责人查看团队汇总与各线，副线只查看本人线路且不显示平台账单和团队余额，独立线主只查看独立单线。`, '关联下级代理、代理会员、个人财务、佣金账单、内部结算和关系申请。', '2026-07-17 05:50：代理后台去除代理提款独立入口，运营首页继续保留经营、佣金和关系申请口径。')

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
  updatedAt: '2026-07-17 14:02',
  record: '修改时间：2026-07-17 14:02；修改说明：统一团队主负责人命名，并避免新增团队代理时误选副线或成员身份；修改内容：所有模块将团队主负责人展示为“团队负责人”，新增代理选择团队代理时代理身份仅可为团队负责人，修改代理仍保留团队负责人、副线负责人、独立代理和团队代理成员等身份维护。',
}

PAGE_NOTES['master:returns'] = {
  ...PAGE_NOTES['master:returns'],
  updatedAt: '2026-07-17 03:09',
  summary: '按原回款明细样式重构列表，并在 ID 右侧补充代理类型与代理身份。',
  fields: '所属站点、名称、ID、代理类型、代理身份、类型、垫付或回款、额度、额度缺口、冲正账目ID和时间。',
  logic: '代理类型分为团队代理、星级代理和层级代理；代理身份按类型展示，团队代理显示团队负责人、副线负责人、独立代理或团队成员，星级代理显示几星，层级代理显示几层；原代理等级字段不再单独展示。回款只冲减原冲正台账，不直接改变团队主副线关系；计算公式：额度缺口 = 同一冲正账目原欠款额度 − 累计成功回款金额；本次记录为“垫付”时增加待回款额度，为“回款”时减少额度缺口。',
  record: '修改时间：2026-07-17 03:09；修改说明：按截图重构冲正回款报表并补充代理类型识别；修改内容：列表在 ID 右侧新增代理类型、代理身份两列，去除代理等级字段，筛选项新增代理类型，查询和重置可按新字段演示。',
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
  related: '关联代理管理、会员管理、佣金记录、代理佣金结算和结算周期设置。',
  record: '修改时间：2026-07-17 03:32；修改说明：按用户截图将修改代理关系记录改为原后台明细页样式；修改内容：页面新增标题说明、刷新数据、全局筛选条件卡片、重置条件、查询、变更明细宽表、共计记录数、固定操作列和变更记录详情弹窗，去除原代理关系记录/团队操作记录双页签结构。',
}

export const P1_ROADMAP = ['副线批量开设与范围调整', '内部结算模板', '主线自有资金提前结算', '方案计算预演', '推荐奖励期限与阶梯', '历史余额受控移交']
