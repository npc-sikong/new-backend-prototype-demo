const SITE_SCOPE = {
  site: '旺财体育',
  siteName: '旺财体育',
  siteCode: 'WC',
}

const AGENT_SCOPES = {
  gaodashang: {
    agentId: '345',
    agentAccount: 'gaodashang',
    account: 'gaodashang',
    directAgent: '无上级代理',
    teamId: 'TEAM-001',
    team: 'gaodashang01部',
    teamName: 'gaodashang01部',
    lineId: 'LINE-A',
    settlementMode: '团队模式',
    settlementIdentity: '团队负责人',
    identity: '团队负责人',
    settlementUnit: 'gaodashang01部',
    unit: 'gaodashang01部',
    effectiveCycle: '2026-07',
    cycle: '2026-07',
  },
  WC002: {
    agentId: '373',
    agentAccount: 'WC002',
    account: 'WC002',
    directAgent: 'gaodashang',
    teamId: 'TEAM-001',
    team: 'gaodashang01部',
    teamName: 'gaodashang01部',
    lineId: 'LINE-B',
    settlementMode: '团队模式',
    settlementIdentity: '副线',
    identity: '副线',
    settlementUnit: 'gaodashang01部',
    unit: 'gaodashang01部',
    effectiveCycle: '2026-07',
    cycle: '2026-07',
  },
  LGNB: {
    agentId: '374',
    agentAccount: 'LGNB',
    account: 'LGNB',
    directAgent: 'gaodashang',
    teamId: 'TEAM-001',
    team: 'gaodashang01部',
    teamName: 'gaodashang01部',
    lineId: 'LINE-C',
    settlementMode: '团队模式',
    settlementIdentity: '副线',
    identity: '副线',
    settlementUnit: 'gaodashang01部',
    unit: 'gaodashang01部',
    effectiveCycle: '2026-07',
    cycle: '2026-07',
  },
  dailiwc001: {
    agentId: '1749',
    agentAccount: 'dailiwc001',
    account: 'dailiwc001',
    directAgent: 'apppay',
    teamId: 'SINGLE-001',
    team: '独立单线01',
    teamName: '独立单线01',
    lineId: 'SINGLE-001',
    settlementMode: '独立单线',
    settlementIdentity: '独立线主',
    identity: '独立线主',
    settlementUnit: '独立单线01',
    unit: '独立单线01',
    effectiveCycle: '2026-07',
    cycle: '2026-07',
  },
}

function legacyRecord(agentAccount, row) {
  const record = { ...SITE_SCOPE, ...AGENT_SCOPES[agentAccount], ...row }
  return {
    ...record,
    agent: record.agent || record.agentAccount,
    line: record.line || record.lineId,
  }
}

export const LEGACY_STATE = {
  members: [
    legacyRecord('gaodashang', {
      id: 'MEM-WC-345-001', account: 'wc_vip_888', memberId: '10034501', memberAccount: 'wc_vip_888', memberName: '高先生', name: '高先生', vipLevel: 'VIP5', userType: '会员', status: '正常',
      parentAgentName: 'gaodashang', totalDeposit: 128000, amountUsdInSum: 128000, firstDepositAmount: 10000, actualDeposit: 126500, amountCnyInSum: 126500, registerDepositAmount: 10000,
      depositAmount: 128000, totalWithdrawal: 46200, withdrawalAmount: 46200, amountCnyOutSum: 46200, walletBalance: 38680.5, balance: 38680.5, balanceCnySum: 38680.5, totalWinLoss: -18600, winLoseCnySum: -18600, validBetAmount: 428000, validBetting: 428000, amountValidCnySum: 428000,
      registeredAt: '2026-05-10 11:08', regTime: '2026-05-10 11:08', lastLoginAt: '2026-07-15 10:36', lastLoginTime: '2026-07-15 10:36', registerIp: '103.22.15.31', lastLoginIp: '103.22.15.52',
    }),
    legacyRecord('gaodashang', {
      id: 'MEM-WC-345-002', account: 'wc_risk_021', memberId: '10034502', memberAccount: 'wc_risk_021', memberName: '林女士', name: '林女士', vipLevel: 'VIP3', userType: '会员', status: '风控冻结',
      parentAgentName: 'gaodashang', totalDeposit: 56800, amountUsdInSum: 56800, firstDepositAmount: 3000, actualDeposit: 56000, amountCnyInSum: 56000, registerDepositAmount: 3000,
      depositAmount: 56800, totalWithdrawal: 41000, withdrawalAmount: 41000, amountCnyOutSum: 41000, walletBalance: 5280, balance: 5280, balanceCnySum: 5280, totalWinLoss: 9720, winLoseCnySum: 9720, validBetAmount: 216000, validBetting: 216000, amountValidCnySum: 216000,
      registeredAt: '2026-06-03 15:22', regTime: '2026-06-03 15:22', lastLoginAt: '2026-07-14 22:09', lastLoginTime: '2026-07-14 22:09', registerIp: '113.88.66.17', lastLoginIp: '113.88.66.31',
    }),
    legacyRecord('WC002', {
      id: 'MEM-WC-373-001', account: 'wc_apple_02', memberId: '10037301', memberAccount: 'wc_apple_02', memberName: '王先生', name: '王先生', vipLevel: 'VIP4', userType: '会员', status: '正常',
      parentAgentName: 'WC002', totalDeposit: 78200, amountUsdInSum: 78200, firstDepositAmount: 5000, actualDeposit: 77150, amountCnyInSum: 77150, registerDepositAmount: 5000,
      depositAmount: 78200, totalWithdrawal: 23800, withdrawalAmount: 23800, amountCnyOutSum: 23800, walletBalance: 19320, balance: 19320, balanceCnySum: 19320, totalWinLoss: -35100, winLoseCnySum: -35100, validBetAmount: 311000, validBetting: 311000, amountValidCnySum: 311000,
      registeredAt: '2026-06-05 09:16', regTime: '2026-06-05 09:16', lastLoginAt: '2026-07-15 09:12', lastLoginTime: '2026-07-15 09:12', registerIp: '183.3.221.18', lastLoginIp: '183.3.221.20',
    }),
    legacyRecord('LGNB', {
      id: 'MEM-WC-374-001', account: 'wc_lucky_77', memberId: '10037401', memberAccount: 'wc_lucky_77', memberName: '赵先生', name: '赵先生', vipLevel: 'VIP2', userType: '会员', status: '禁用',
      parentAgentName: 'LGNB', totalDeposit: 32600, amountUsdInSum: 32600, firstDepositAmount: 2000, actualDeposit: 32000, amountCnyInSum: 32000, registerDepositAmount: 2000,
      depositAmount: 32600, totalWithdrawal: 17400, withdrawalAmount: 17400, amountCnyOutSum: 17400, walletBalance: 2460, balance: 2460, balanceCnySum: 2460, totalWinLoss: 10600, winLoseCnySum: 10600, validBetAmount: 126000, validBetting: 126000, amountValidCnySum: 126000,
      registeredAt: '2026-06-12 17:42', regTime: '2026-06-12 17:42', lastLoginAt: '2026-07-11 20:18', lastLoginTime: '2026-07-11 20:18', registerIp: '14.18.175.61', lastLoginIp: '14.18.175.72',
    }),
    legacyRecord('dailiwc001', {
      id: 'MEM-WC-1749-001', account: 'wc_dream_01', memberId: '20174901', memberAccount: 'wc_dream_01', memberName: '周女士', name: '周女士', vipLevel: 'VIP4', userType: '会员', status: '正常',
      parentAgentName: 'dailiwc001', totalDeposit: 91200, amountUsdInSum: 91200, firstDepositAmount: 8000, actualDeposit: 90000, amountCnyInSum: 90000, registerDepositAmount: 8000,
      depositAmount: 91200, totalWithdrawal: 35200, withdrawalAmount: 35200, amountCnyOutSum: 35200, walletBalance: 21860, balance: 21860, balanceCnySum: 21860, totalWinLoss: -12140, winLoseCnySum: -12140, validBetAmount: 358000, validBetting: 358000, amountValidCnySum: 358000,
      registeredAt: '2026-05-30 13:26', regTime: '2026-05-30 13:26', lastLoginAt: '2026-07-15 11:04', lastLoginTime: '2026-07-15 11:04', registerIp: '120.230.58.10', lastLoginIp: '120.230.58.39',
    }),
  ],

  deposits: [
    legacyRecord('gaodashang', {
      id: 'DEP-WC-20260712-001', depositOrderNo: 'DP202607120001', orderNo: 'DP202607120001', code: 'DP202607120001', agentPayOrderNo: 'AP202607120001',
      member: 'wc_vip_888', memberId: '10034501', memberAccount: 'wc_vip_888', memberName: '高先生', type: '代理代存', payType: '代理额度代存', channel: '代理额度钱包', source: '代理代存', amount: 20000, giftAmount: 500, actualAmount: 20500, fee: 0,
      turnoverMultiple: 1, requiredTurnover: 20500, submittedAt: '2026-07-12 10:16', completeTime: '2026-07-12 10:18', completedAt: '2026-07-12 10:18', createdAt: '2026-07-12 10:16', from: '代理额度钱包', status: '成功', statusCode: 1,
    }),
    legacyRecord('WC002', {
      id: 'DEP-WC-20260712-002', depositOrderNo: 'DP202607120002', orderNo: 'DP202607120002', code: 'DP202607120002', agentPayOrderNo: 'AP202607120002',
      member: 'wc_apple_02', memberId: '10037301', memberAccount: 'wc_apple_02', memberName: '王先生', type: '代理代存', payType: '代理佣金代存', channel: '代理佣金钱包', source: '代理代存', amount: 8000, giftAmount: 0, actualAmount: 8000, fee: 0,
      turnoverMultiple: 1, requiredTurnover: 8000, submittedAt: '2026-07-12 14:29', completeTime: '2026-07-12 14:32', completedAt: '2026-07-12 14:32', createdAt: '2026-07-12 14:29', from: '代理佣金钱包', status: '成功', statusCode: 1,
    }),
    legacyRecord('LGNB', {
      id: 'DEP-WC-20260713-003', depositOrderNo: 'DP202607130003', orderNo: 'DP202607130003', code: 'DP202607130003', agentPayOrderNo: 'AP202607130003',
      member: 'wc_lucky_77', memberId: '10037401', memberAccount: 'wc_lucky_77', memberName: '赵先生', type: '代理代存', payType: '代理额度代存', channel: '代理额度钱包', source: '代理代存', amount: 5000, giftAmount: 100, actualAmount: 5100, fee: 0,
      turnoverMultiple: 1, requiredTurnover: 5100, submittedAt: '2026-07-13 18:06', completeTime: '—', completedAt: '—', createdAt: '2026-07-13 18:06', from: '代理额度钱包', status: '处理中', statusCode: 2,
    }),
    legacyRecord('dailiwc001', {
      id: 'DEP-WC-20260714-004', depositOrderNo: 'DP202607140004', orderNo: 'DP202607140004', code: 'DP202607140004', agentPayOrderNo: 'AP202607140004',
      member: 'wc_dream_01', memberId: '20174901', memberAccount: 'wc_dream_01', memberName: '周女士', type: '代理代存', payType: '代理佣金代存', channel: '代理佣金钱包', source: '代理代存', amount: 12000, giftAmount: 0, actualAmount: 0, fee: 0,
      turnoverMultiple: 1, requiredTurnover: 12000, submittedAt: '2026-07-14 09:38', completeTime: '2026-07-14 09:42', completedAt: '2026-07-14 09:42', createdAt: '2026-07-14 09:38', from: '代理佣金钱包', status: '失败', statusCode: 3, failureReason: '代理佣金可用余额不足',
    }),
    legacyRecord('dailiwc001', {
      id: 'DEP-WC-20260715-005', depositOrderNo: 'DP202607150005', orderNo: 'DP202607150005', code: 'DP202607150005', agentPayOrderNo: 'AP202607150005',
      member: 'wc_dream_01', memberId: '20174901', memberAccount: 'wc_dream_01', memberName: '周女士', type: '代理代存', payType: '代理额度代存', channel: '代理额度钱包', source: '代理代存', amount: 6000, giftAmount: 200, actualAmount: 6200, fee: 0,
      turnoverMultiple: 1, requiredTurnover: 6200, submittedAt: '2026-07-15 08:49', completeTime: '2026-07-15 08:51', completedAt: '2026-07-15 08:51', createdAt: '2026-07-15 08:49', from: '代理额度钱包', status: '成功', statusCode: 1,
    }),
  ],

  gameRecords: [
    legacyRecord('gaodashang', {
      id: 'GAME-WC-20260714-001', betOrderNo: 'BET202607140001', memberId: '10034501', memberAccount: 'wc_vip_888', memberName: '高先生',
      venueCode: 'AG', venueName: 'AG真人', gameCode: 'BAC', gameTypeName: '百家乐', tableNo: 'AG-BAC-18', roundNo: 'R202607141822', betAmount: 12000, validBetAmount: 12000,
      payoutAmount: 21840, netAmount: 9840, obBetStatus: '已结算', status: '已结算', betAt: '2026-07-14 18:22', settledAt: '2026-07-14 18:24',
    }),
    legacyRecord('WC002', {
      id: 'GAME-WC-20260714-002', betOrderNo: 'BET202607140002', memberId: '10037301', memberAccount: 'wc_apple_02', memberName: '王先生',
      venueCode: 'PG', venueName: 'PG电子', gameCode: 'FORTUNE-TIGER', gameTypeName: '财富虎', tableNo: 'PG-FT-01', roundNo: 'R202607142015', betAmount: 8600, validBetAmount: 8420,
      payoutAmount: 3100, netAmount: -5500, obBetStatus: '已结算', status: '已结算', betAt: '2026-07-14 20:15', settledAt: '2026-07-14 20:16',
    }),
    legacyRecord('LGNB', {
      id: 'GAME-WC-20260715-003', betOrderNo: 'BET202607150003', memberId: '10037401', memberAccount: 'wc_lucky_77', memberName: '赵先生',
      venueCode: 'EVO', venueName: 'Evolution真人', gameCode: 'ROULETTE', gameTypeName: '轮盘', tableNo: 'EVO-ROU-07', roundNo: 'R202607150946', betAmount: 3000, validBetAmount: 3000,
      payoutAmount: 0, netAmount: 0, obBetStatus: '待结算', status: '待结算', betAt: '2026-07-15 09:46', settledAt: '—',
    }),
    legacyRecord('dailiwc001', {
      id: 'GAME-WC-20260714-004', betOrderNo: 'BET202607140004', memberId: '20174901', memberAccount: 'wc_dream_01', memberName: '周女士',
      venueCode: 'OB', venueName: 'OB体育', gameCode: 'FB', gameTypeName: '足球滚球', tableNo: 'OB-FB-2207', roundNo: 'R202607142207', betAmount: 15000, validBetAmount: 15000,
      payoutAmount: 27750, netAmount: 12750, obBetStatus: '已结算', status: '已结算', betAt: '2026-07-14 22:07', settledAt: '2026-07-14 23:58',
    }),
    legacyRecord('dailiwc001', {
      id: 'GAME-WC-20260715-005', betOrderNo: 'BET202607150005', memberId: '20174901', memberAccount: 'wc_dream_01', memberName: '周女士',
      venueCode: 'PG', venueName: 'PG电子', gameCode: 'MAHJONG', gameTypeName: '麻将胡了', tableNo: 'PG-MJ-03', roundNo: 'R202607151103', betAmount: 1200, validBetAmount: 0,
      payoutAmount: 1200, netAmount: 0, obBetStatus: '已取消', status: '已取消', betAt: '2026-07-15 11:03', settledAt: '2026-07-15 11:04',
    }),
  ],

  accountChanges: [
    legacyRecord('gaodashang', {
      id: 'ACHG-WC-20260712-001', accountChangeNo: 'AC202607120001', orderNo: 'AC202607120001', relatedOrderNo: 'AP202607120001', agentPayOrderNo: 'AP202607120001', depositId: 'DEP-WC-20260712-001', depositOrderNo: 'DP202607120001',
      owner: 'wc_vip_888', ownerType: '会员', memberId: '10034501', memberAccount: 'wc_vip_888', memberName: '高先生', wallet: '中心钱包', walletType: '会员主钱包', changeType: '代理额度代存', transactionType: '代理额度代存', direction: '收入', amount: 20000,
      before: 18180.5, balanceBefore: 18180.5, after: 38180.5, balanceAfter: 38180.5, amountAfter: 38180.5, time: '2026-07-12 10:18', createdAt: '2026-07-12 10:18', status: '已入账', remark: '代存本金到账',
    }),
    legacyRecord('WC002', {
      id: 'ACHG-WC-20260712-002', accountChangeNo: 'AC202607120002', orderNo: 'AC202607120002', relatedOrderNo: 'AP202607120002', agentPayOrderNo: 'AP202607120002', depositId: 'DEP-WC-20260712-002', depositOrderNo: 'DP202607120002',
      owner: 'wc_apple_02', ownerType: '会员', memberId: '10037301', memberAccount: 'wc_apple_02', memberName: '王先生', wallet: '中心钱包', walletType: '会员主钱包', changeType: '代理佣金代存', transactionType: '代理佣金代存', direction: '收入', amount: 8000,
      before: 11320, balanceBefore: 11320, after: 19320, balanceAfter: 19320, amountAfter: 19320, time: '2026-07-12 14:32', createdAt: '2026-07-12 14:32', status: '已入账', remark: '代存本金到账',
    }),
    legacyRecord('LGNB', {
      id: 'ACHG-WC-20260713-003', accountChangeNo: 'AC202607130003', orderNo: 'AC202607130003', relatedOrderNo: 'AP202607130003', agentPayOrderNo: 'AP202607130003', depositId: 'DEP-WC-20260713-003', depositOrderNo: 'DP202607130003',
      owner: 'wc_lucky_77', ownerType: '会员', memberId: '10037401', memberAccount: 'wc_lucky_77', memberName: '赵先生', wallet: '中心钱包', walletType: '会员主钱包', changeType: '代理额度代存', transactionType: '代理额度代存', direction: '收入', amount: 5000,
      before: 2460, balanceBefore: 2460, after: 2460, balanceAfter: 2460, amountAfter: 2460, time: '2026-07-13 18:06', createdAt: '2026-07-13 18:06', status: '待确认', remark: '代存审核中，暂未入账',
    }),
    legacyRecord('dailiwc001', {
      id: 'ACHG-WC-20260714-004', accountChangeNo: 'AC202607140004', orderNo: 'AC202607140004', relatedOrderNo: 'AP202607140004', agentPayOrderNo: 'AP202607140004', depositId: 'DEP-WC-20260714-004', depositOrderNo: 'DP202607140004',
      owner: 'wc_dream_01', ownerType: '会员', memberId: '20174901', memberAccount: 'wc_dream_01', memberName: '周女士', wallet: '中心钱包', walletType: '会员主钱包', changeType: '代理佣金代存', transactionType: '代理佣金代存', direction: '收入', amount: 12000,
      before: 15660, balanceBefore: 15660, after: 15660, balanceAfter: 15660, amountAfter: 15660, time: '2026-07-14 09:42', createdAt: '2026-07-14 09:42', status: '未入账', remark: '审核失败，不产生余额变化',
    }),
    legacyRecord('dailiwc001', {
      id: 'ACHG-WC-20260715-005', accountChangeNo: 'AC202607150005', orderNo: 'AC202607150005', relatedOrderNo: 'AP202607150005', agentPayOrderNo: 'AP202607150005', depositId: 'DEP-WC-20260715-005', depositOrderNo: 'DP202607150005',
      owner: 'wc_dream_01', ownerType: '会员', memberId: '20174901', memberAccount: 'wc_dream_01', memberName: '周女士', wallet: '中心钱包', walletType: '会员主钱包', changeType: '代理额度代存', transactionType: '代理额度代存', direction: '收入', amount: 6000,
      before: 15660, balanceBefore: 15660, after: 21660, balanceAfter: 21660, amountAfter: 21660, time: '2026-07-15 08:51', createdAt: '2026-07-15 08:51', status: '已入账', remark: '代存本金到账',
    }),
    legacyRecord('gaodashang', {
      id: 'ACHG-WC-20260714-006', accountChangeNo: 'AC202607140006', orderNo: 'AC202607140006', relatedOrderNo: 'BET202607140001', gameRecordId: 'GAME-WC-20260714-001',
      owner: 'wc_vip_888', ownerType: '会员', memberId: '10034501', memberAccount: 'wc_vip_888', memberName: '高先生', wallet: '中心钱包', walletType: '会员主钱包', changeType: '游戏派彩', transactionType: '游戏派彩', direction: '收入', amount: 21840,
      before: 16840.5, balanceBefore: 16840.5, after: 38680.5, balanceAfter: 38680.5, amountAfter: 38680.5, time: '2026-07-14 18:24', createdAt: '2026-07-14 18:24', status: '已入账', remark: 'AG真人百家乐派彩',
    }),
  ],

  transfers: [
    legacyRecord('gaodashang', {
      id: 'TRF-WC-20260714-001', transferNo: 'TR202607140001', orderNo: 'TR202607140001', internalSettlementId: 'IS-202607-001', transferType: '团队内部结算',
      from: 'gaodashang', fromAccount: 'gaodashang', fromId: '345', fromBeforeAmount: 173800, fromChangeAmount: -28000, fromAfterAmount: 145800,
      to: 'WC002', toAccount: 'WC002', toId: '373', toBeforeAmount: 3100, toChangeAmount: 28000, toAfterAmount: 31100, type: '团队内部结算', amount: 28000, fee: 0,
      operatorName: 'gaodashang', operatorIdentity: '团队负责人', transferTime: '2026-07-14 10:20', createdAt: '2026-07-14 10:20', status: '成功', voucher: '结算凭证-A01',
    }),
    legacyRecord('gaodashang', {
      id: 'TRF-WC-20260714-002', transferNo: 'TR202607140002', orderNo: 'TR202607140002', internalSettlementId: 'IS-202607-002', transferType: '团队内部结算',
      from: 'gaodashang', fromAccount: 'gaodashang', fromId: '345', fromBeforeAmount: 145800, fromChangeAmount: -15000, fromAfterAmount: 145800,
      to: 'LGNB', toAccount: 'LGNB', toId: '374', toBeforeAmount: 2850, toChangeAmount: 15000, toAfterAmount: 2850, type: '团队内部结算', amount: 15000, fee: 0,
      operatorName: 'gaodashang', operatorIdentity: '团队负责人', transferTime: '2026-07-14 11:05', createdAt: '2026-07-14 11:05', status: '处理中', voucher: '待补充',
    }),
    legacyRecord('WC002', {
      id: 'TRF-WC-20260715-003', transferNo: 'TR202607150003', orderNo: 'TR202607150003', transferType: '代理额度转会员',
      from: 'WC002', fromAccount: 'WC002', fromId: '373', fromBeforeAmount: 31100, fromChangeAmount: -3000, fromAfterAmount: 28100,
      to: 'wc_apple_02', toAccount: 'wc_apple_02', toId: '10037301', toBeforeAmount: 19320, toChangeAmount: 3000, toAfterAmount: 22320, type: '代理额度转会员', amount: 3000, fee: 0,
      operatorName: 'WC002', operatorIdentity: '副线', transferTime: '2026-07-15 09:18', createdAt: '2026-07-15 09:18', status: '成功', voucher: '会员额度转账',
    }),
    legacyRecord('LGNB', {
      id: 'TRF-WC-20260715-004', transferNo: 'TR202607150004', orderNo: 'TR202607150004', transferType: '代理额度转会员',
      from: 'LGNB', fromAccount: 'LGNB', fromId: '374', fromBeforeAmount: 2850, fromChangeAmount: -5000, fromAfterAmount: 2850,
      to: 'wc_lucky_77', toAccount: 'wc_lucky_77', toId: '10037401', toBeforeAmount: 2460, toChangeAmount: 5000, toAfterAmount: 2460, type: '代理额度转会员', amount: 5000, fee: 0,
      operatorName: 'LGNB', operatorIdentity: '副线', transferTime: '2026-07-15 09:32', createdAt: '2026-07-15 09:32', status: '失败', failureReason: '可用额度不足', voucher: '—',
    }),
    legacyRecord('dailiwc001', {
      id: 'TRF-WC-20260715-005', transferNo: 'TR202607150005', orderNo: 'TR202607150005', transferType: '代理额度转会员',
      from: 'dailiwc001', fromAccount: 'dailiwc001', fromId: '1749', fromBeforeAmount: 68903.14, fromChangeAmount: -10000, fromAfterAmount: 68903.14,
      to: 'wc_dream_01', toAccount: 'wc_dream_01', toId: '20174901', toBeforeAmount: 21860, toChangeAmount: 10000, toAfterAmount: 21860, type: '代理额度转会员', amount: 10000, fee: 0,
      operatorName: 'dailiwc001', operatorIdentity: '独立线主', transferTime: '2026-07-15 10:02', createdAt: '2026-07-15 10:02', status: '已取消', failureReason: '代理主动取消', voucher: '—',
    }),
  ],

  agentPayRecords: [
    legacyRecord('gaodashang', {
      id: 'APAY-WC-20260712-001', agentPayOrderNo: 'AP202607120001', orderNo: 'AP202607120001', code: 'AP202607120001', apiTransferNo: 'DP202607120001',
      depositId: 'DEP-WC-20260712-001', depositOrderNo: 'DP202607120001', accountChangeId: 'ACHG-WC-20260712-001', accountChangeNo: 'AC202607120001',
      member: 'wc_vip_888', payee: 'wc_vip_888', memberId: '10034501', memberAccount: 'wc_vip_888', memberName: '高先生', type: '额度代存', payType: '额度代存', transactionType: '额度代存', agentPayType: 'AGENT_BALANCE', method: '代理预付金', amount: 20000, agentPayAmount: 20000,
      turnoverMultiple: 1, requiredTurnover: 20000, status: '审核成功', agentPayStatus: 22, applicant: 'gaodashang', remark: '主线额度代存', userRemark: '主线额度代存', submittedAt: '2026-07-12 10:16', appliedAt: '2026-07-12 10:16', createTime: '2026-07-12 10:16', createdAt: '2026-07-12 10:16', reviewedAt: '2026-07-12 10:18', reviewer: '站点财务',
    }),
    legacyRecord('WC002', {
      id: 'APAY-WC-20260712-002', agentPayOrderNo: 'AP202607120002', orderNo: 'AP202607120002', code: 'AP202607120002', apiTransferNo: 'DP202607120002',
      depositId: 'DEP-WC-20260712-002', depositOrderNo: 'DP202607120002', accountChangeId: 'ACHG-WC-20260712-002', accountChangeNo: 'AC202607120002',
      member: 'wc_apple_02', payee: 'wc_apple_02', memberId: '10037301', memberAccount: 'wc_apple_02', memberName: '王先生', type: '佣金代存', payType: '佣金代存', transactionType: '佣金代存', agentPayType: 'AGENT_COMMISSION', method: '代理佣金余额', amount: 8000, agentPayAmount: 8000,
      turnoverMultiple: 1, requiredTurnover: 8000, status: '审核成功', agentPayStatus: 22, applicant: 'WC002', remark: '副线佣金代存', userRemark: '副线佣金代存', submittedAt: '2026-07-12 14:29', appliedAt: '2026-07-12 14:29', createTime: '2026-07-12 14:29', createdAt: '2026-07-12 14:29', reviewedAt: '2026-07-12 14:32', reviewer: '站点财务',
    }),
    legacyRecord('LGNB', {
      id: 'APAY-WC-20260713-003', agentPayOrderNo: 'AP202607130003', orderNo: 'AP202607130003', code: 'AP202607130003', apiTransferNo: 'DP202607130003',
      depositId: 'DEP-WC-20260713-003', depositOrderNo: 'DP202607130003', accountChangeId: 'ACHG-WC-20260713-003', accountChangeNo: 'AC202607130003',
      member: 'wc_lucky_77', payee: 'wc_lucky_77', memberId: '10037401', memberAccount: 'wc_lucky_77', memberName: '赵先生', type: '额度代存', payType: '额度代存', transactionType: '额度代存', agentPayType: 'AGENT_BALANCE', method: '代理预付金', amount: 5000, agentPayAmount: 5000,
      turnoverMultiple: 1, requiredTurnover: 5000, status: '审核中', agentPayStatus: 31, applicant: 'LGNB', remark: '等待站点审核', userRemark: '等待站点审核', submittedAt: '2026-07-13 18:06', appliedAt: '2026-07-13 18:06', createTime: '2026-07-13 18:06', createdAt: '2026-07-13 18:06', reviewedAt: '—', reviewer: '—',
    }),
    legacyRecord('dailiwc001', {
      id: 'APAY-WC-20260714-004', agentPayOrderNo: 'AP202607140004', orderNo: 'AP202607140004', code: 'AP202607140004', apiTransferNo: 'DP202607140004',
      depositId: 'DEP-WC-20260714-004', depositOrderNo: 'DP202607140004', accountChangeId: 'ACHG-WC-20260714-004', accountChangeNo: 'AC202607140004',
      member: 'wc_dream_01', payee: 'wc_dream_01', memberId: '20174901', memberAccount: 'wc_dream_01', memberName: '周女士', type: '佣金代存', payType: '佣金代存', transactionType: '佣金代存', agentPayType: 'AGENT_COMMISSION', method: '代理佣金余额', amount: 12000, agentPayAmount: 12000,
      turnoverMultiple: 1, requiredTurnover: 12000, status: '审核失败', agentPayStatus: 32, applicant: 'dailiwc001', remark: '佣金余额不足', userRemark: '佣金余额不足', submittedAt: '2026-07-14 09:38', appliedAt: '2026-07-14 09:38', createTime: '2026-07-14 09:38', createdAt: '2026-07-14 09:38', reviewedAt: '2026-07-14 09:42', reviewer: '系统',
    }),
    legacyRecord('dailiwc001', {
      id: 'APAY-WC-20260715-005', agentPayOrderNo: 'AP202607150005', orderNo: 'AP202607150005', code: 'AP202607150005', apiTransferNo: 'DP202607150005',
      depositId: 'DEP-WC-20260715-005', depositOrderNo: 'DP202607150005', accountChangeId: 'ACHG-WC-20260715-005', accountChangeNo: 'AC202607150005',
      member: 'wc_dream_01', payee: 'wc_dream_01', memberId: '20174901', memberAccount: 'wc_dream_01', memberName: '周女士', type: '额度代存', payType: '额度代存', transactionType: '额度代存', agentPayType: 'AGENT_BALANCE', method: '代理预付金', amount: 6000, agentPayAmount: 6000,
      turnoverMultiple: 1, requiredTurnover: 6000, status: '审核成功', agentPayStatus: 22, applicant: 'dailiwc001', remark: '独立线主额度代存', userRemark: '独立线主额度代存', submittedAt: '2026-07-15 08:49', appliedAt: '2026-07-15 08:49', createTime: '2026-07-15 08:49', createdAt: '2026-07-15 08:49', reviewedAt: '2026-07-15 08:51', reviewer: '站点财务',
    }),
  ],

  venueFeeDetails: [
    legacyRecord('gaodashang', {
      id: 'VFEE-WC-202607-001', feeOrderNo: 'VF202607001', periodStart: '2026-07-01', periodEnd: '2026-07-15', periodRange: '2026-07-01 ~ 2026-07-15',
      parentAgentName: '无上级代理', agentName: 'gaodashang', agentLevelLabel: '团队主线', profitShareRate: 0.5, profitShareRateText: '50%', venueCode: 'AG', venueName: 'AG真人', venueCount: 1,
      turnover: 486000, grossWinLoss: 92000, venueFeeRate: 0.05, directShareFee: 4600, levelShareFee: 0, totalShareFee: 4600, status: '已确认', confirmedAt: '2026-07-15 02:10',
    }),
    legacyRecord('gaodashang', {
      id: 'VFEE-WC-202607-002', feeOrderNo: 'VF202607002', periodStart: '2026-07-01', periodEnd: '2026-07-15', periodRange: '2026-07-01 ~ 2026-07-15',
      parentAgentName: '无上级代理', agentName: 'gaodashang', agentLevelLabel: '团队主线', profitShareRate: 0.5, profitShareRateText: '50%', venueCode: 'PG', venueName: 'PG电子', venueCount: 1,
      turnover: 322000, grossWinLoss: 54000, venueFeeRate: 0.05, directShareFee: 2700, levelShareFee: 2200, totalShareFee: 4900, status: '已确认', confirmedAt: '2026-07-15 02:10',
    }),
    legacyRecord('WC002', {
      id: 'VFEE-WC-202607-003', feeOrderNo: 'VF202607003', periodStart: '2026-07-01', periodEnd: '2026-07-15', periodRange: '2026-07-01 ~ 2026-07-15',
      parentAgentName: 'gaodashang', agentName: 'WC002', agentLevelLabel: '团队副线', profitShareRate: 0.35, profitShareRateText: '35%', venueCode: 'PG', venueName: 'PG电子', venueCount: 1,
      turnover: 268000, grossWinLoss: 61000, venueFeeRate: 0.05, directShareFee: 3050, levelShareFee: 0, totalShareFee: 3050, status: '待复核', confirmedAt: '—',
    }),
    legacyRecord('LGNB', {
      id: 'VFEE-WC-202607-004', feeOrderNo: 'VF202607004', periodStart: '2026-07-01', periodEnd: '2026-07-15', periodRange: '2026-07-01 ~ 2026-07-15',
      parentAgentName: 'gaodashang', agentName: 'LGNB', agentLevelLabel: '团队副线', profitShareRate: 0.3, profitShareRateText: '30%', venueCode: 'EVO', venueName: 'Evolution真人', venueCount: 1,
      turnover: 164000, grossWinLoss: 27000, venueFeeRate: 0.05, directShareFee: 1350, levelShareFee: 0, totalShareFee: 1350, status: '已结算', confirmedAt: '2026-07-15 02:12',
    }),
    legacyRecord('dailiwc001', {
      id: 'VFEE-WC-202607-005', feeOrderNo: 'VF202607005', periodStart: '2026-07-01', periodEnd: '2026-07-15', periodRange: '2026-07-01 ~ 2026-07-15',
      parentAgentName: 'apppay', agentName: 'dailiwc001', agentLevelLabel: '独立线主', profitShareRate: 0.4, profitShareRateText: '40%', venueCode: 'OB', venueName: 'OB体育', venueCount: 1,
      turnover: 375000, grossWinLoss: 82000, venueFeeRate: 0.05, directShareFee: 4100, levelShareFee: 0, totalShareFee: 4100, status: '已确认', confirmedAt: '2026-07-15 02:15',
    }),
  ],

  siteProfitRows: [
    legacyRecord('gaodashang', {
      id: 'SPROFIT-WC-202607-001', reportNo: 'SPR202607001', statDateStart: '2026-07-01', statDateEnd: '2026-07-15', statDateRange: '2026-07-01 ~ 2026-07-15',
      totalTurnover: 808000, totalProfit: 146000, rechargeAmount: 246000, rechargeFee: 2460, withdrawAmount: 92000, withdrawFee: 920, badDebt: 1500, activityBonus: 6200,
      siteIncome: 134920, monthlyRentAmount: 5000, venueFee: 9500, profitableAgentTotal: 146000, headOfficeShareAmount: 43800, siteShareAmount: 29200,
      agentCommission: 73000, siteActualShareIncome: 23800, lossAgentTotal: 0, correctionAmount: 0, siteNetIncomeTotal: 23800, settleStatus: '已结算', status: '已结算', settledAt: '2026-07-15 03:20',
    }),
    legacyRecord('WC002', {
      id: 'SPROFIT-WC-202607-002', reportNo: 'SPR202607002', statDateStart: '2026-07-01', statDateEnd: '2026-07-15', statDateRange: '2026-07-01 ~ 2026-07-15',
      totalTurnover: 268000, totalProfit: 61000, rechargeAmount: 86000, rechargeFee: 860, withdrawAmount: 31000, withdrawFee: 310, badDebt: 0, activityBonus: 2400,
      siteIncome: 57430, monthlyRentAmount: 0, venueFee: 3050, profitableAgentTotal: 61000, headOfficeShareAmount: 18300, siteShareAmount: 12200,
      agentCommission: 30500, siteActualShareIncome: 9150, lossAgentTotal: 0, correctionAmount: 0, siteNetIncomeTotal: 9150, settleStatus: '待结算', status: '待结算', settledAt: '—',
    }),
    legacyRecord('LGNB', {
      id: 'SPROFIT-WC-202607-003', reportNo: 'SPR202607003', statDateStart: '2026-07-01', statDateEnd: '2026-07-15', statDateRange: '2026-07-01 ~ 2026-07-15',
      totalTurnover: 164000, totalProfit: -18500, rechargeAmount: 42000, rechargeFee: 420, withdrawAmount: 23800, withdrawFee: 238, badDebt: 850, activityBonus: 1600,
      siteIncome: -21608, monthlyRentAmount: 0, venueFee: 1350, profitableAgentTotal: 0, headOfficeShareAmount: 0, siteShareAmount: 0,
      agentCommission: 0, siteActualShareIncome: 0, lossAgentTotal: 18500, correctionAmount: 7200, siteNetIncomeTotal: -11300, settleStatus: '复核中', status: '复核中', settledAt: '—',
    }),
    legacyRecord('dailiwc001', {
      id: 'SPROFIT-WC-202607-004', reportNo: 'SPR202607004', statDateStart: '2026-07-01', statDateEnd: '2026-07-15', statDateRange: '2026-07-01 ~ 2026-07-15',
      totalTurnover: 375000, totalProfit: 82000, rechargeAmount: 104000, rechargeFee: 1040, withdrawAmount: 42000, withdrawFee: 420, badDebt: 0, activityBonus: 3200,
      siteIncome: 77340, monthlyRentAmount: 0, venueFee: 4100, profitableAgentTotal: 82000, headOfficeShareAmount: 24600, siteShareAmount: 16400,
      agentCommission: 32800, siteActualShareIncome: 12300, lossAgentTotal: 0, correctionAmount: 0, siteNetIncomeTotal: 12300, settleStatus: '已结算', status: '已结算', settledAt: '2026-07-15 03:25',
    }),
  ],

  prepaidAccounts: [
    legacyRecord('gaodashang', {
      id: 'PPA-WC-345', openingBalance: 60000, increaseAmount: 20000, usedAmount: 8500, available: 71500, prepaidBalance: 71500, frozen: 15000, totalBalance: 86500,
      lastChange: 20000, debtAmount: 0, status: '生效中', updatedAt: '2026-07-15 12:20', remark: '团队负责人预付金账户',
    }),
    legacyRecord('WC002', {
      id: 'PPA-WC-373', openingBalance: 12000, increaseAmount: 5000, usedAmount: 3100, available: 13900, prepaidBalance: 13900, frozen: 0, totalBalance: 13900,
      lastChange: -3100, debtAmount: 1150, status: '生效中', updatedAt: '2026-07-15 11:45', remark: '副线预付金账户',
    }),
    legacyRecord('LGNB', {
      id: 'PPA-WC-374', openingBalance: 8000, increaseAmount: 0, usedAmount: 1750, available: 6250, prepaidBalance: 6250, frozen: 0, totalBalance: 6250,
      lastChange: -1750, debtAmount: 0, status: '生效中', updatedAt: '2026-07-14 18:10', remark: '副线预付金账户',
    }),
    legacyRecord('dailiwc001', {
      id: 'PPA-WC-1749', openingBalance: 25000, increaseAmount: 10000, usedAmount: 4200, available: 30800, prepaidBalance: 30800, frozen: 6000, totalBalance: 36800,
      lastChange: 10000, debtAmount: 0, status: '生效中', updatedAt: '2026-07-15 10:05', remark: '独立线主预付金账户',
    }),
  ],

  prepaidRecords: [
    legacyRecord('gaodashang', {
      id: 'PREPAID-WC-20260711-001', recordNo: 'PP202607110001', recordType: 'TRANSFER_IN', recordTypeName: '转入预付金', direction: '收入', amount: 100000,
      opening: 180000, added: 100000, deducted: 0, balance: 280000, debt: 0, balanceBefore: 180000, balanceAfter: 280000, frozenBefore: 20000, frozenAfter: 20000, relatedOrderNo: 'PPT202607110001', operatorName: '站点财务', createTime: '2026-07-11 10:12', createdAt: '2026-07-11 10:12', updatedAt: '2026-07-11 10:12', status: '成功', remark: '从站点可用余额转入',
    }),
    legacyRecord('WC002', {
      id: 'PREPAID-WC-20260712-002', recordNo: 'PP202607120002', recordType: 'NEXUS_RECHARGE_FREEZE', recordTypeName: 'Nexus充值预付金冻结', direction: '支出', amount: -20000,
      opening: 88000, added: 0, deducted: 20000, balance: 68000, debt: 1150, balanceBefore: 88000, balanceAfter: 68000, frozenBefore: 12000, frozenAfter: 32000, relatedOrderNo: 'NXR202607120032', operatorName: '系统', createTime: '2026-07-12 12:26', createdAt: '2026-07-12 12:26', updatedAt: '2026-07-12 12:26', status: '已冻结', remark: 'Nexus充值下单冻结',
    }),
    legacyRecord('LGNB', {
      id: 'PREPAID-WC-20260713-003', recordNo: 'PP202607130003', recordType: 'NEXUS_RECHARGE_SETTLE', recordTypeName: 'Nexus充值预付金结算', direction: '支出', amount: -12000,
      opening: 54000, added: 0, deducted: 12000, balance: 54000, debt: 0, balanceBefore: 54000, balanceAfter: 54000, frozenBefore: 18000, frozenAfter: 6000, relatedOrderNo: 'NXR202607130018', operatorName: '系统', createTime: '2026-07-13 16:40', createdAt: '2026-07-13 16:40', updatedAt: '2026-07-13 16:40', status: '已结算', remark: '成功到账后核销冻结预付金',
    }),
    legacyRecord('dailiwc001', {
      id: 'PREPAID-WC-20260714-004', recordNo: 'PP202607140004', recordType: 'NEXUS_RECHARGE_REFUND', recordTypeName: 'Nexus充值预付金退回', direction: '收入', amount: 8000,
      opening: 76000, added: 8000, deducted: 0, balance: 84000, debt: 0, balanceBefore: 76000, balanceAfter: 84000, frozenBefore: 14000, frozenAfter: 6000, relatedOrderNo: 'NXR202607140009', operatorName: '系统', createTime: '2026-07-14 17:08', createdAt: '2026-07-14 17:08', updatedAt: '2026-07-14 17:08', status: '已退回', remark: '订单超时，冻结金额退回可用预付金',
    }),
    legacyRecord('dailiwc001', {
      id: 'PREPAID-WC-20260715-005', recordNo: 'PP202607150005', recordType: 'TRANSFER_OUT', recordTypeName: '转出到可用余额', direction: '支出', amount: -30000,
      opening: 84000, added: 0, deducted: 30000, balance: 54000, debt: 0, balanceBefore: 84000, balanceAfter: 54000, frozenBefore: 6000, frozenAfter: 6000, relatedOrderNo: 'PPT202607150005', operatorName: '站点财务', createTime: '2026-07-15 09:55', createdAt: '2026-07-15 09:55', updatedAt: '2026-07-15 09:55', status: '处理中', remark: '预付金转回站点可用余额',
    }),
  ],

  reversalStats: [
    legacyRecord('gaodashang', {
      id: 'REVSTAT-WC-202607-001', statStart: '2026-07-01', statEnd: '2026-07-15', agentName: 'gaodashang', agentLevelLabel: '团队主线', paidBorrowerCount: 4,
      advanceBalanceAmount: 149.9, advanceLevelCommissionAmount: 21687.56, advanceDirectGrossAmount: 12000, advanceDirectCommissionAmount: 2500,
      debtorCount: 3, outstandingAmount: 7099.9, reversalRecordNos: ['CZ519', 'CZ521', 'CZ524'], status: '有欠款', updatedAt: '2026-07-15 02:30',
    }),
    legacyRecord('WC002', {
      id: 'REVSTAT-WC-202607-002', statStart: '2026-07-01', statEnd: '2026-07-15', agentName: 'WC002', agentLevelLabel: '团队副线', paidBorrowerCount: 2,
      advanceBalanceAmount: 3100, advanceLevelCommissionAmount: 1755.66, advanceDirectGrossAmount: 8300, advanceDirectCommissionAmount: 0,
      debtorCount: 1, outstandingAmount: 1150, reversalRecordNos: ['CZ526'], status: '部分回款', updatedAt: '2026-07-15 02:30',
    }),
    legacyRecord('LGNB', {
      id: 'REVSTAT-WC-202607-003', statStart: '2026-07-01', statEnd: '2026-07-15', agentName: 'LGNB', agentLevelLabel: '团队副线', paidBorrowerCount: 1,
      advanceBalanceAmount: 0, advanceLevelCommissionAmount: 980, advanceDirectGrossAmount: 0, advanceDirectCommissionAmount: 620,
      debtorCount: 0, outstandingAmount: 0, reversalRecordNos: ['CZ531'], status: '已结清', updatedAt: '2026-07-15 02:30',
    }),
    legacyRecord('dailiwc001', {
      id: 'REVSTAT-WC-202607-004', statStart: '2026-07-01', statEnd: '2026-07-15', agentName: 'dailiwc001', agentLevelLabel: '独立线主', paidBorrowerCount: 2,
      advanceBalanceAmount: 94.34, advanceLevelCommissionAmount: 0, advanceDirectGrossAmount: 6600, advanceDirectCommissionAmount: 1200,
      debtorCount: 1, outstandingAmount: 1840, reversalRecordNos: ['CZ492', 'CZ533'], status: '部分回款', updatedAt: '2026-07-15 02:30',
    }),
  ],

  reversalReturns: [
    legacyRecord('gaodashang', {
      id: 'REVRETURN-WC-20260710-001', reversalStatId: 'REVSTAT-WC-202607-001', reversalRecordNo: 'CZ519', debtType: 'BALANCE', debtTypeLabel: '余额',
      direction: 'ADVANCE', directionLabel: '垫付', amount: 31.15, gapAmount: 31.15, occurredAt: '2026-07-10 23:07', status: '待回款', remark: '主线为下级代理垫付余额冲正',
    }),
    legacyRecord('gaodashang', {
      id: 'REVRETURN-WC-20260713-002', reversalStatId: 'REVSTAT-WC-202607-001', reversalRecordNo: 'CZ519', debtType: 'BALANCE', debtTypeLabel: '余额',
      direction: 'REPAYMENT', directionLabel: '回款', amount: 20, gapAmount: 11.15, occurredAt: '2026-07-13 16:22', status: '部分回款', remark: '同一冲正账目部分归还',
    }),
    legacyRecord('WC002', {
      id: 'REVRETURN-WC-20260711-003', reversalStatId: 'REVSTAT-WC-202607-002', reversalRecordNo: 'CZ526', debtType: 'LEVEL_COMMISSION', debtTypeLabel: '级差佣金',
      direction: 'ADVANCE', directionLabel: '垫付', amount: 1755.66, gapAmount: 1150, occurredAt: '2026-07-11 02:06', status: '部分回款', remark: '副线级差佣金冲正垫付',
    }),
    legacyRecord('LGNB', {
      id: 'REVRETURN-WC-20260712-004', reversalStatId: 'REVSTAT-WC-202607-003', reversalRecordNo: 'CZ531', debtType: 'DIRECT_COMMISSION', debtTypeLabel: '直属佣金',
      direction: 'REPAYMENT', directionLabel: '回款', amount: 620, gapAmount: 0, occurredAt: '2026-07-12 19:40', status: '已结清', remark: '直属佣金欠款已全部归还',
    }),
    legacyRecord('dailiwc001', {
      id: 'REVRETURN-WC-20260710-005', reversalStatId: 'REVSTAT-WC-202607-004', reversalRecordNo: 'CZ492', debtType: 'BALANCE', debtTypeLabel: '余额',
      direction: 'REPAYMENT', directionLabel: '回款', amount: 94.34, gapAmount: 0, occurredAt: '2026-07-10 23:07', status: '已结清', remark: '独立线主余额冲正回款',
    }),
    legacyRecord('dailiwc001', {
      id: 'REVRETURN-WC-20260714-006', reversalStatId: 'REVSTAT-WC-202607-004', reversalRecordNo: 'CZ533', debtType: 'DIRECT_GROSS', debtTypeLabel: '直属会员盈利',
      direction: 'ADVANCE', directionLabel: '垫付', amount: 1840, gapAmount: 1840, occurredAt: '2026-07-14 22:18', status: '待回款', remark: '直属会员盈利冲正形成欠款',
    }),
  ],
}
