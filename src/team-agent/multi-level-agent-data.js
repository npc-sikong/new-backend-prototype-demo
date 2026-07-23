export const MULTI_LEVEL_ACCOUNT = {
  account: 'gaodashang',
  site: '旺财体育',
  siteCode: '2222',
  agentId: '345',
  level: '9级代理',
  availableBalance: 79790.25,
  withdrawalAccount: 'TRqjPqyo4PmXbLcK4B8LuwQELRvRLdbTnN',
}

export const AGENT_ROLE_PROFILES = {
  multiLevel: { ...MULTI_LEVEL_ACCOUNT, roleLabel: '多层级代理', promotionCode: 'GAODA345', createdAt: '2026-06-08', phone: '138****8821', email: 'gaodashang@example.com', transferTarget: 'WC002' },
  main: { ...MULTI_LEVEL_ACCOUNT, roleLabel: '团队负责人', promotionCode: 'GAODA345', createdAt: '2026-06-08', phone: '138****8821', email: 'gaodashang@example.com', transferTarget: 'WC002' },
  secondary: { account: 'WC002', site: '旺财体育', siteCode: '2222', agentId: '373', level: '副线', roleLabel: '副线', availableBalance: 28460.5, withdrawalAccount: 'TRc20WC002DemoAccount8K2', promotionCode: 'WC002373', createdAt: '2026-06-18', phone: '139****0202', email: 'wc002@example.com', transferTarget: 'gaodashang' },
  independent: { account: 'dailiwc001', site: '旺财体育', siteCode: '2222', agentId: '1749', level: '单线代理', roleLabel: '单线代理', availableBalance: 15480, withdrawalAccount: 'TRc20Dailiwc001Demo9P4', promotionCode: 'DALI1749', createdAt: '2026-07-01', phone: '136****1749', email: 'dailiwc001@example.com', transferTarget: 'gaodashang' },
}

export function rowsForAgentRole(rows, role = 'multiLevel') {
  if (role === 'multiLevel' || role === 'main') return rows
  if (role === 'secondary') return rows.filter((_, index) => index % 2 === 0)
  return rows.filter((_, index) => index % 3 === 0)
}

export const DASHBOARD_GROUPS = [
  {
    title: '本期佣金预估/净收益',
    columns: 1,
    items: [{ label: '本期佣金预估/净收益', value: '¥0', tone: 'green', helper: '较上周期', note: '结算时间 2026-07-27' }],
  },
  {
    title: '佣金余额',
    columns: 3,
    items: [
      { label: '当前余额', value: '¥79,790.25', tone: 'orange' },
      { label: '未结算佣金', value: '¥7,094.29', tone: 'red' },
      { label: '已结算佣金', value: '¥0', tone: 'green' },
    ],
  },
  {
    title: '资金流水',
    columns: 4,
    items: [
      { label: '总充值', value: '¥0', tone: 'green' },
      { label: '总提现', value: '¥0', tone: 'red' },
      { label: '总投注', value: '¥0', tone: 'default' },
      { label: '有效投注', value: '¥0', tone: 'default', note: '占比 0%' },
      { label: '总盈亏', value: '¥0', tone: 'green' },
      { label: '会员VIP福利', value: '¥0', tone: 'blue', link: '点击查看明细' },
      { label: '活动福利', value: '¥0', tone: 'orange', link: '点击查看明细' },
      { label: '会员推广福利', value: '¥0', tone: 'blue', link: '点击查看明细' },
      { label: '充提手续运营费', value: '¥0', tone: 'red', link: '点击查看明细' },
    ],
  },
  {
    title: '代理数据',
    columns: 3,
    items: [
      { label: '代理总人数', value: '207', tone: 'blue' },
      { label: '新增代理', value: '0', tone: 'blue' },
      { label: '活跃代理', value: '0', tone: 'blue', note: '活跃率 0.0%' },
    ],
  },
  {
    title: '会员数据',
    columns: 4,
    items: [
      { label: '会员总数', value: '31', tone: 'blue' },
      { label: '新增会员', value: '0', tone: 'green' },
      { label: '活跃会员', value: '0', tone: 'orange', note: '活跃率 0.0%' },
      { label: '付费会员', value: '0', tone: 'blue', note: '付费率 0.0%' },
      { label: '新增付费', value: '0', tone: 'orange' },
      { label: '代理推广会员', value: '0', tone: 'green', note: '占比 0.0%' },
      { label: '会员推广会员', value: '0', tone: 'red', note: '裂变率 0.0%' },
      { label: '30天未登录会员', value: '27', tone: 'default', note: '流失率 87.1%' },
    ],
  },
]

export const AGENT_ROWS = Array.from({ length: 12 }, (_, index) => ({
  id: 1697 - index,
  account: `perf_vaf_stg_agent_${String(200 - index).padStart(4, '0')}`,
  type: '多层级代理',
  starLevel: '—',
  level: `${index % 8 + 1}层代理`,
  siteCode: '2222',
  status: index < 9 ? '停用' : '正常',
  childAgents: index === 11 ? 2 : 0,
  childMembers: index === 11 ? 1 : 0,
  plan: index === 11 ? '层级代理方案A' : '未设置',
  lastLogin: index === 11 ? '2026-07-20 18:16:31' : '—',
}))

export const MEMBER_ROWS = [
  { id: 1761, vip: 0, account: 'evan666', validBet: 300, winLoss: 100, balance: 800, type: '会员', parent: 'MGNB', deposit: 800, firstDeposit: 800, received: 800, registeredDeposit: 800, status: '正常', registeredAt: '2026-07-20' },
  { id: 1697, vip: 0, account: 'perf_vaf_stg_agent_0200', validBet: 0, winLoss: 0, balance: 0, type: '代理', parent: 'gaodashang', deposit: 0, firstDeposit: 0, received: 0, registeredDeposit: 0, status: '正常', registeredAt: '2026-07-20' },
  { id: 1696, vip: 0, account: 'perf_vaf_stg_agent_0199', validBet: 0, winLoss: 0, balance: 0, type: '代理', parent: 'gaodashang', deposit: 0, firstDeposit: 0, received: 0, registeredDeposit: 0, status: '正常', registeredAt: '2026-07-20' },
  { id: 1695, vip: 0, account: 'perf_vaf_stg_agent_0198', validBet: 0, winLoss: 0, balance: 0, type: '代理', parent: 'gaodashang', deposit: 0, firstDeposit: 0, received: 0, registeredDeposit: 0, status: '禁用', registeredAt: '2026-07-19' },
  { id: 1694, vip: 0, account: 'perf_vaf_stg_agent_0197', validBet: 0, winLoss: 0, balance: 0, type: '代理', parent: 'gaodashang', deposit: 0, firstDeposit: 0, received: 0, registeredDeposit: 0, status: '正常', registeredAt: '2026-07-19' },
  { id: 1693, vip: 0, account: 'perf_vaf_stg_agent_0196', validBet: 0, winLoss: 0, balance: 0, type: '代理', parent: 'gaodashang', deposit: 0, firstDeposit: 0, received: 0, registeredDeposit: 0, status: '正常', registeredAt: '2026-07-18' },
]

export const BET_ROWS = [
  { id: 1429973, orderNo: '1285927693838740608', siteCode: '2222', member: 'az111111', parent: '374', venueType: 'person', venue: 'DB真人', gameId: '2001', game: '经典百家乐', detail: 'GB0826717343 经典百家乐 庄免佣', amount: 2000, validBet: 2000, odds: '1.00', result: '已结算', time: '2026-07-21 02:55:14' },
  { id: 1429972, orderNo: '1285927689514413184', siteCode: '2222', member: 'az111111', parent: '374', venueType: 'person', venue: 'DB真人', gameId: '2001', game: '经典百家乐', detail: 'GB0826717343 经典百家乐 庄免佣', amount: 1000, validBet: 1000, odds: '1.00', result: '已结算', time: '2026-07-21 02:54:31' },
  { id: 1429971, orderNo: '1285927684774849664', siteCode: '2222', member: 'az111111', parent: '374', venueType: 'person', venue: 'DB真人', gameId: '2001', game: '经典百家乐', detail: 'GB0826717343 经典百家乐 庄免佣', amount: 1000, validBet: 1000, odds: '1.00', result: '已结算', time: '2026-07-21 02:53:48' },
  { id: 1429970, orderNo: '1285927498333842560', siteCode: '2222', member: 'az111111', parent: '374', venueType: 'person', venue: 'DB真人', gameId: '2001', game: '经典百家乐', detail: 'GB0826717342 经典百家乐 闲', amount: 1000, validBet: 1000, odds: '1.00', result: '已结算', time: '2026-07-21 02:52:27' },
  { id: 1429969, orderNo: '1285927495435578496', siteCode: '2222', member: 'az111111', parent: '374', venueType: 'person', venue: 'DB真人', gameId: '2001', game: '经典百家乐', detail: 'GB0826717342 经典百家乐 闲', amount: 1000, validBet: 1000, odds: '1.00', result: '已结算', time: '2026-07-21 02:51:46' },
  { id: 1429968, orderNo: '1285927292343184512', siteCode: '2222', member: 'az111111', parent: '374', venueType: 'person', venue: 'DB真人', gameId: '2001', game: '经典百家乐', detail: 'GB0826717341 经典百家乐 闲', amount: 1000, validBet: 1000, odds: '1.00', result: '已结算', time: '2026-07-21 02:50:22' },
]

export const ACCOUNT_CHANGE_ROWS = [
  { id: '534cd1d712b44d839794763b35c45f2b', memberId: 451, member: 'testchirs66', type: '主钱包转出', amount: -5000, time: '2026-07-20 10:42:17' },
  { id: '0c7d374193c64ae9821dc99492e2dcfd', memberId: 418, member: 'az111111', type: '充值', amount: 900, time: '2026-07-18 21:26:31' },
  { id: '4e3ad9ad61fe4ea1958282208da3de1d', memberId: 418, member: 'az111111', type: '充值', amount: 331.24, time: '2026-07-18 21:25:27' },
  { id: 'f3f03f6844a8428c84898b2dac565f84', memberId: 451, member: 'testchirs66', type: '主钱包转出', amount: -2506.84, time: '2026-07-18 21:11:46' },
  { id: 'COMM_REV_BAL_ROLLBACK_PS-2222-2026-07-13-2026-07-19_345_17921', memberId: 345, member: 'gaodashang', type: '佣金冲正扣减/归还历史债务', amount: 8.1, time: '2026-07-17 14:17:21' },
  { id: '15013064ce3f454cb58c18a0fc26976a', memberId: 418, member: 'az111111', type: '主钱包转入', amount: 637.14, time: '2026-07-17 10:38:23' },
  { id: '47e6ea064dc84e6d8a84f7a4bf4fdbbc', memberId: 418, member: 'az111111', type: '主钱包转出', amount: -5637.14, time: '2026-07-17 10:35:27' },
  { id: 'f92794bff0464821a1b7d069919505e4', memberId: 418, member: 'az111111', type: '主钱包转出', amount: -5637.14, time: '2026-07-17 10:35:22' },
]

export const MEMBER_FUND_ROWS = ACCOUNT_CHANGE_ROWS.map((item, index) => ({
  orderNo: item.id,
  account: item.member,
  type: item.type,
  currency: index === 2 ? 'USDT' : 'CNY',
  amount: index === 2 ? 50 : item.amount,
  status: index === 0 || index === 6 ? '上分失败' : item.type === '主钱包转入' ? '下分成功' : item.type === '充值' ? '充值确认成功' : '上分成功',
  createdAt: item.time,
  remark: item.type.includes('转出') ? '进入游戏上分' : item.type.includes('转入') ? '退出游戏下分' : '',
}))

export const REVERSAL_REPAYMENT_ROWS = [
  { site: '旺财体育', name: 'gaodashang', id: 345, level: '9级代理', type: '余额', direction: '回款', amount: 100, gap: 0, ledger: 'CZ391', time: '2026-07-20 02:02:27' },
  { site: '旺财体育', name: 'gaodashang', id: 345, level: '9级代理', type: '余额', direction: '回款', amount: 1.42, gap: 0, ledger: 'CZ500', time: '2026-07-20 02:02:27' },
  { site: '旺财体育', name: 'gaodashang', id: 345, level: '9级代理', type: '余额', direction: '回款', amount: 4.34, gap: 0, ledger: 'CZ525', time: '2026-07-20 02:02:27' },
  { site: '旺财体育', name: 'gaodashang', id: 345, level: '9级代理', type: '级差佣金', direction: '回款', amount: 59.24, gap: 2798.92, ledger: 'CZ390', time: '2026-07-20 02:02:27' },
  { site: '旺财体育', name: 'gaodashang', id: 345, level: '9级代理', type: '级差佣金', direction: '回款', amount: 241.84, gap: 2798.92, ledger: 'CZ390', time: '2026-07-20 02:02:27' },
  { site: '旺财体育', name: 'gaodashang', id: 345, level: '9级代理', type: '直属佣金', direction: '回款', amount: 1160.3, gap: 1339.7, ledger: 'CZ389', time: '2026-07-20 02:02:27' },
  { site: '旺财体育', name: 'WC002', id: 373, level: '6级代理', type: '直属会员盈利', direction: '回款', amount: 300, gap: 0, ledger: 'CZ85', time: '2026-07-20 02:02:27' },
  { site: '旺财体育', name: 'gaodashang', id: 345, level: '9级代理', type: '余额', direction: '垫付', amount: 43.61, gap: 0, ledger: 'CZ524', time: '2026-07-13 02:02:28' },
]

export const VENUE_FEE_ROWS = [
  { id: 1, period: '2026-07-13 ~ 2026-07-19', site: '旺财体育', parent: '—', agent: 'gaodashang', level: '9级代理', rebate: '65%', venues: 1, directFee: 0, levelFee: 97.5, total: 97.5 },
  { id: 2, period: '2026-07-13 ~ 2026-07-19', site: '旺财体育', parent: 'gaodashang', agent: 'WC002', level: '6级代理', rebate: '55%', venues: 1, directFee: 0, levelFee: 48.75, total: 48.75 },
  { id: 3, period: '2026-07-13 ~ 2026-07-19', site: '旺财体育', parent: 'WC002', agent: 'LGNB', level: '5级代理', rebate: '50%', venues: 1, directFee: 487.5, levelFee: 0, total: 487.5 },
]

export const ACTIVITY_ROWS = [
  { id: 'ACT202607200954289475', createdAt: '2026-07-20 09:54:28', site: '旺财体育', name: '720新人礼活动', type: '新人礼', target: '全体会员', start: '2026-07-20', end: '长期有效', order: 1, hot: 1, status: '启用' },
  { id: 'ACT202607180036255998', createdAt: '2026-07-18 00:36:26', site: '旺财体育', name: '电竞首存送彩金', type: '首充', target: '全体会员', start: '2026-07-18', end: '长期有效', order: 1, hot: 1, status: '启用' },
  { id: 'ACT202607180029503528', createdAt: '2026-07-18 00:29:50', site: '旺财体育', name: '彩票首存送彩金', type: '首充', target: '全体会员', start: '2026-07-18', end: '2026-07-31', order: 1, hot: 1, status: '启用' },
  { id: 'ACT202607180012018373', createdAt: '2026-07-18 00:12:02', site: '旺财体育', name: '棋牌首存送彩金', type: '首充', target: '全体会员', start: '2026-07-18', end: '长期有效', order: 1, hot: 1, status: '启用' },
  { id: 'ACT202607180000403121', createdAt: '2026-07-18 00:00:40', site: '旺财体育', name: '电子首存送彩金', type: '首充', target: '全体会员', start: '2026-07-19', end: '长期有效', order: 1, hot: 1, status: '启用' },
  { id: 'ACT202607172304544921', createdAt: '2026-07-17 23:04:55', site: '旺财体育', name: '真人首存送彩金', type: '首充', target: '全体会员', start: '2026-07-19', end: '2026-07-25', order: 1, hot: 1, status: '启用' },
  { id: 'ACT202607172135257556', createdAt: '2026-07-17 21:35:26', site: '旺财体育', name: '体育首存送彩金', type: '首充', target: '全体会员', start: '2026-07-17', end: '长期有效', order: 3, hot: 3, status: '启用' },
  { id: 'ACT202606082026116860', createdAt: '2026-06-08 20:26:12', site: '旺财体育', name: '世界杯3', type: '通用活动', target: '全体会员', start: '2026-06-08', end: '长期有效', order: 1, hot: 1, status: '启用' },
  { id: 'ACT202606082015595966', createdAt: '2026-06-08 20:16:00', site: '旺财体育', name: '世界杯2', type: '通用活动', target: '全体会员', start: '2026-06-08', end: '长期有效', order: 1, hot: 1, status: '启用' },
  { id: 'ACT202605291714003452', createdAt: '2026-05-29 17:14:00', site: '旺财体育', name: '通用活动3', type: '通用活动', target: '代理', start: '2026-05-29', end: '2026-05-29', order: 1, hot: 1, status: '启用' },
]
