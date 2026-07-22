import { useEffect, useMemo, useState } from 'react'
import { EyeOutlined, FileSearchOutlined } from '@ant-design/icons'
import { useTeamAgent } from './context'
import { AgentPayReportPage, PrepaidReportPage } from './legacy-operation-pages'
import {
  Alert,
  DataTable,
  DescriptionGrid,
  EmptyState,
  Field,
  FilterBar,
  FormulaPanel,
  Input,
  MetricCard,
  MetricGrid,
  Modal,
  Money,
  Percent,
  SectionHeader,
  Select,
  StatusTag,
} from './ui'

const EMPTY_FILTERS = { keyword: '', agentType: '', identity: '', line: '', cycle: '', status: '' }
const SYNCED_AGENT_REPORTS = new Set(['commissionRecords', 'reversal', 'returns'])

function settlementMeta(agent, overrides = {}) {
  const known = {
    gaodashang: { site: '旺财体育', agentType: '团队代理', team: 'gaodashang01部', line: 'LINE-A', identity: '团队负责人', unit: 'gaodashang01部 / 团队负责人', scopeRoles: ['main'] },
    WC002: { site: '旺财体育', agentType: '团队代理', team: 'gaodashang01部', line: 'LINE-B', identity: '副线', unit: 'gaodashang01部 / WC002线路', scopeRoles: ['main', 'secondary'] },
    LGNB: { site: '旺财体育', agentType: '团队代理', team: 'gaodashang01部', line: 'LINE-C', identity: '副线', unit: 'gaodashang01部 / LGNB线路', scopeRoles: ['main'] },
    dailiwc001: { site: '旺财体育', agentType: '团队代理', team: '—', line: 'SINGLE-001', identity: '单线代理', unit: '单线代理01', scopeRoles: ['independent'] },
    apppay: { site: '旺财体育', agentType: '团队代理', team: 'apppay01部', line: 'LINE-D', identity: '团队负责人', unit: 'apppay01部 / 团队负责人', scopeRoles: [] },
    charles: { site: '旺财体育', agentType: '层级代理', team: '—', line: 'LEGACY-CHARLES', identity: '3层', unit: '原代理独立结算', scopeRoles: [] },
    FEE0428_A8: { site: '财神客栈', agentType: '星级代理', team: '—', line: 'LEGACY-FEE', identity: '4星', unit: '原代理独立结算', scopeRoles: [] },
  }
  return { site: '旺财体育', agentType: '层级代理', team: '—', line: '原代理线路', identity: '1层', unit: '原代理独立结算', cycle: '2026-07', scopeRoles: [], ...(known[agent] || {}), ...overrides }
}

function row(id, agent, values = {}) {
  return { id, agent, ...settlementMeta(agent, values), ...values }
}

function pick(record, keys, fallback = '—') {
  for (const key of keys) {
    const value = record?.[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return fallback
}

function normalizeBase(record, index, prefix, explicitAgent) {
  const agent = explicitAgent || pick(record, ['agent', 'agentAccount', 'parentAgentName', 'account'])
  const defaults = settlementMeta(agent)
  return row(pick(record, ['id', 'recordId'], `${prefix}-${index + 1}`), agent, {
    site: pick(record, ['site', 'siteName'], defaults.site), agentType: pick(record, ['agentType', 'typeName'], defaults.agentType), team: pick(record, ['team', 'teamName'], defaults.team),
    line: pick(record, ['line', 'lineId'], defaults.line), identity: pick(record, ['identity', 'settlementIdentity'], defaults.identity),
    unit: pick(record, ['unit', 'settlementUnit'], defaults.unit), cycle: pick(record, ['cycle', 'effectiveCycle', 'month'], defaults.cycle),
    scopeRoles: record.scopeRoles || defaults.scopeRoles,
  })
}

const MEMBER_SEEDS = [
  ['M100345', 'gaodashang', '启用'], ['wc_vip_018', 'gaodashang', '启用'], ['wc_new_027', 'gaodashang', '启用'],
  ['wc002_001', 'WC002', '启用'], ['wc002_016', 'WC002', '启用'], ['wc002_031', 'WC002', '冻结'],
  ['lgnb_006', 'LGNB', '启用'], ['lgnb_019', 'LGNB', '启用'],
  ['M201749', 'dailiwc001', '启用'], ['dly_011', 'dailiwc001', '启用'], ['dly_018', 'dailiwc001', '冻结'],
  ['charles_003', 'charles', '启用'], ['fee0428_007', 'FEE0428_A8', '启用'],
]

const MEMBER_ROWS = MEMBER_SEEDS.map(([member, agent, status], index) => row(`MEM-${String(index + 1).padStart(3, '0')}`, agent, {
  member, status, registeredAt: `2026-0${5 + (index % 2)}-${String(3 + index).padStart(2, '0')} ${String(9 + (index % 8)).padStart(2, '0')}:20`,
  firstDeposit: 800 + index * 260, balance: 3600 + index * 875, validBet: 18500 + index * 12600,
  winLoss: index % 4 === 0 ? -(3200 + index * 210) : 5200 + index * 1380,
}))

const DEPOSIT_ROWS = MEMBER_ROWS.map((member, index) => ({
  ...member, id: `DEP-${String(index + 1).padStart(3, '0')}`, orderNo: `DW202607${String(index + 1).padStart(4, '0')}`,
  type: index % 3 === 2 ? '提款' : '存款', channel: ['USDT-TRC20', '支付宝', '银行卡'][index % 3],
  amount: 1200 + index * 650, fee: 6 + index * 1.8, status: index % 5 === 4 ? '处理中' : '成功',
  occurredAt: `2026-07-${String(3 + index).padStart(2, '0')} ${String(8 + (index % 10)).padStart(2, '0')}:35`,
}))

const GAME_ROWS = MEMBER_ROWS.map((member, index) => {
  const betAmount = 1800 + index * 720
  const winLoss = index % 3 === 0 ? -(450 + index * 75) : 620 + index * 95
  return {
    ...member, id: `GAME-${String(index + 1).padStart(3, '0')}`, betNo: `BET20260715${String(index + 1).padStart(4, '0')}`,
    venue: ['AG真人', 'PG电子', '沙巴体育', '开元棋牌'][index % 4], game: ['百家乐', '麻将胡了', '滚球让球', '经典炸金花'][index % 4],
    betAmount, validBet: Math.round(betAmount * 0.96), payout: Math.max(0, betAmount + winLoss), winLoss, status: index % 5 === 4 ? '已冲正' : '已结算',
    betAt: `2026-07-15 ${String(9 + (index % 9)).padStart(2, '0')}:${String(10 + index * 3).slice(-2)}`,
  }
})

const ACCOUNT_CHANGE_ROWS = MEMBER_ROWS.map((member, index) => {
  const amount = index % 4 === 0 ? -(300 + index * 25) : 500 + index * 90
  const before = 3000 + index * 760
  return {
    ...member, id: `AC-${String(index + 1).padStart(3, '0')}`, changeNo: `AC202607${String(index + 1).padStart(4, '0')}`,
    type: ['存款入账', '游戏结算', '会员红利', '人工调整'][index % 4], before, amount, after: before + amount,
    operator: index % 4 === 3 ? '站点运营' : '系统', status: '成功', occurredAt: `2026-07-${String(2 + index).padStart(2, '0')} 14:${String(8 + index * 4).slice(-2)}`,
  }
})

const TRANSFER_STATS = [
  row('TS-001', 'gaodashang', { count: 18, incoming: 220000, outgoing: 43000, net: 177000, lastAt: '2026-07-15 10:20', status: '生效中' }),
  row('TS-002', 'WC002', { count: 7, incoming: 28000, outgoing: 1800, net: 26200, lastAt: '2026-07-14 18:40', status: '生效中' }),
  row('TS-003', 'LGNB', { count: 4, incoming: 15000, outgoing: 0, net: 15000, lastAt: '2026-07-14 11:05', status: '处理中' }),
  row('TS-004', 'dailiwc001', { count: 9, incoming: 68000, outgoing: 5760, net: 62240, lastAt: '2026-07-14 16:40', status: '生效中' }),
  row('TS-005', 'FEE0428_A8', { count: 3, incoming: 15000, outgoing: 14692.5, net: 307.5, lastAt: '2026-07-13 08:20', status: '历史查询' }),
]

const REVERSAL_ROWS = [
  row('CZ-519', 'gaodashang', { people: 4, balance: 149.9, levelCommission: 21687.56, memberProfit: 12000, directCommission: 2500, debt: 7099.9, status: '待回款' }),
  row('CZ-520', 'WC002', { people: 2, balance: 3100, levelCommission: 1755.66, memberProfit: 8300, directCommission: 0, debt: 1150, status: '部分回款' }),
  row('CZ-521', 'LGNB', { people: 1, balance: 2850, levelCommission: 960, memberProfit: 3200, directCommission: 0, debt: 620, status: '待回款' }),
  row('CZ-522', 'dailiwc001', { people: 3, balance: 68903.14, levelCommission: 5800, memberProfit: 9400, directCommission: 1200, debt: 0, status: '已回款' }),
  row('CZ-475', 'FEE0428_A8', { people: 2, balance: 0, levelCommission: 0, memberProfit: 0, directCommission: 19651.35, debt: 19651.35, status: '待回款' }),
]

const RETURN_ROWS = [
  row('RET-001', 'gaodashang', { type: '余额', direction: '垫付', amount: 31.15, gap: 31.15, ledger: 'CZ-519', status: '待回款', occurredAt: '2026-07-10 23:07' }),
  row('RET-002', 'WC002', { type: '佣金', direction: '回款', amount: 1150, gap: 0, ledger: 'CZ-520', status: '已入账', occurredAt: '2026-07-12 10:18' }),
  row('RET-003', 'LGNB', { type: '余额', direction: '垫付', amount: 620, gap: 620, ledger: 'CZ-521', status: '待回款', occurredAt: '2026-07-12 12:40' }),
  row('RET-004', 'dailiwc001', { type: '余额', direction: '回款', amount: 94.34, gap: 0, ledger: 'CZ-522', status: '已入账', occurredAt: '2026-07-10 23:07' }),
  row('RET-005', 'FEE0428_A8', { type: '余额', direction: '回款', amount: 14692.5, gap: 0, ledger: 'CZ-475', status: '已入账', occurredAt: '2026-04-28 23:08' }),
]

const SITE_PROFIT_ROWS = [
  row('SP-001', 'gaodashang', { revenue: 520000, venueFee: 26000, bonus: 18000, rebate: 12000, handlingFee: 5000, commission: 206000, profit: 253000, margin: 0.4865, status: '已出账' }),
  row('SP-002', 'WC002', { revenue: 146000, venueFee: 7300, bonus: 5400, rebate: 3800, handlingFee: 2100, commission: 28000, profit: 99400, margin: 0.6808, status: '已结算' }),
  row('SP-003', 'LGNB', { revenue: 50000, venueFee: 2500, bonus: 1900, rebate: 1200, handlingFee: 900, commission: 15000, profit: 28500, margin: 0.57, status: '处理中' }),
  row('SP-004', 'dailiwc001', { revenue: 205000, venueFee: 10250, bonus: 8000, rebate: 6750, handlingFee: 7000, commission: 68000, profit: 105000, margin: 0.5122, status: '待发放' }),
  row('SP-005', 'FEE0428_A8', { revenue: 42000, venueFee: 2100, bonus: 1600, rebate: 1100, handlingFee: 1200, commission: 15000, profit: 21000, margin: 0.5, status: '历史查询' }),
]

function safeNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function buildMembers(data) {
  const source = Array.isArray(data?.members) ? data.members : MEMBER_ROWS
  return source.map((record, index) => ({
    ...normalizeBase(record, index, 'MEM'), member: pick(record, ['member', 'memberAccount', 'account', 'memberId']),
    status: pick(record, ['status', 'state'], '正常'), registeredAt: pick(record, ['registeredAt', 'regTime', 'createdAt']),
    firstDeposit: safeNumber(pick(record, ['firstDeposit', 'firstDepositAmount', 'registerDepositAmount'], 0)),
    balance: safeNumber(pick(record, ['balance', 'walletBalance', 'balanceCnySum'], 0)),
    validBet: safeNumber(pick(record, ['validBet', 'validBetAmount', 'validBetting', 'amountValidCnySum'], 0)),
    winLoss: safeNumber(pick(record, ['winLoss', 'totalWinLoss', 'winLoseCnySum'], 0)),
  }))
}

function buildDeposits(data) {
  const source = Array.isArray(data?.deposits) ? data.deposits : DEPOSIT_ROWS
  return source.map((record, index) => ({
    ...normalizeBase(record, index, 'DEP'), orderNo: pick(record, ['orderNo', 'depositOrderNo', 'code', 'id']),
    member: pick(record, ['member', 'memberAccount', 'account']), type: pick(record, ['payType', 'type'], '会员存款'),
    channel: pick(record, ['channel', 'source'], '—'), amount: safeNumber(pick(record, ['amount', 'actualAmount'], 0)), fee: safeNumber(record.fee),
    status: pick(record, ['status', 'state'], '成功'), occurredAt: pick(record, ['occurredAt', 'submittedAt', 'createdAt', 'completedAt']),
  }))
}

function buildGames(data) {
  const source = Array.isArray(data?.gameRecords) ? data.gameRecords : GAME_ROWS
  return source.map((record, index) => ({
    ...normalizeBase(record, index, 'GAME'), betNo: pick(record, ['betNo', 'betOrderNo', 'id']),
    member: pick(record, ['member', 'memberAccount', 'account']), venue: pick(record, ['venue', 'venueName', 'venueCode']), game: pick(record, ['game', 'gameTypeName', 'gameCode']),
    betAmount: safeNumber(record.betAmount), validBet: safeNumber(pick(record, ['validBet', 'validBetAmount'], 0)),
    payout: safeNumber(pick(record, ['payout', 'payoutAmount'], 0)), winLoss: safeNumber(pick(record, ['winLoss', 'netAmount'], 0)),
    status: pick(record, ['status', 'obBetStatus'], '已结算'), betAt: pick(record, ['betAt', 'createdAt']),
  }))
}

function buildAccountChanges(data) {
  const source = Array.isArray(data?.accountChanges) ? data.accountChanges : ACCOUNT_CHANGE_ROWS
  return source.map((record, index) => ({
    ...normalizeBase(record, index, 'AC'), changeNo: pick(record, ['changeNo', 'accountChangeNo', 'orderNo', 'id']),
    member: pick(record, ['member', 'memberAccount', 'owner', 'account']), type: pick(record, ['type', 'changeType', 'transactionType']),
    before: safeNumber(pick(record, ['before', 'balanceBefore'], 0)), amount: safeNumber(record.amount), after: safeNumber(pick(record, ['after', 'balanceAfter', 'amountAfter'], 0)),
    operator: pick(record, ['operator', 'operatorName'], '系统'), occurredAt: pick(record, ['occurredAt', 'time', 'createdAt']), status: pick(record, ['status', 'state'], '已入账'),
  }))
}

function normalizeTransfers(data) {
  if (!Array.isArray(data?.transfers)) return []
  return data.transfers.map((record, index) => {
    const base = normalizeBase(record, index, 'TR')
    const from = pick(record, ['from', 'fromAccount'], base.agent)
    const to = pick(record, ['to', 'toAccount'], '—')
    const scopeRoles = new Set(base.scopeRoles || [])
    if ([from, to].includes('WC002')) { scopeRoles.add('main'); scopeRoles.add('secondary') }
    if ([from, to].some((account) => ['gaodashang', 'LGNB'].includes(account))) scopeRoles.add('main')
    if ([from, to].includes('dailiwc001')) scopeRoles.add('independent')
    return {
      ...base, transferNo: pick(record, ['transferNo', 'orderNo', 'id']), counterparty: `${from} → ${to}`, from, to,
      type: pick(record, ['type', 'transferType'], '代理转账'), amount: safeNumber(record.amount), source: pick(record, ['source', 'voucher', 'relatedOrderNo'], '代理余额'),
      status: pick(record, ['status', 'state'], '成功'), createdAt: pick(record, ['createdAt', 'transferTime']), scopeRoles: [...scopeRoles],
    }
  })
}

function buildTransferStats(data) {
  const transfers = normalizeTransfers(data)
  if (!transfers.length) return TRANSFER_STATS
  const groups = new Map()
  transfers.forEach((record) => {
    const current = groups.get(record.agent) || { ...record, id: `TS-${record.agent}`, count: 0, incoming: 0, outgoing: 0, net: 0, lastAt: record.createdAt }
    current.count += 1
    if (record.to === record.agent || /到账|回款/.test(record.type)) current.incoming += record.amount
    if (record.from === record.agent || !/到账|回款/.test(record.type)) current.outgoing += record.amount
    current.net = current.incoming - current.outgoing
    if (String(record.createdAt) > String(current.lastAt)) current.lastAt = record.createdAt
    current.status = record.status
    groups.set(record.agent, current)
  })
  return [...groups.values()]
}

function buildVenueFees(data) {
  if (!Array.isArray(data?.venueFeeDetails)) return buildFinance(data).map((item, index) => ({ ...item, id: `VF-${String(index + 1).padStart(3, '0')}`, recordNo: `VF-${item.recordNo}`, venue: '全部场馆', feeRate: item.totalWinLoss ? item.venueFee / Math.abs(item.totalWinLoss) : 0, fee: item.venueFee, netAfterFee: item.totalWinLoss - item.venueFee }))
  return data.venueFeeDetails.map((record, index) => ({
    ...normalizeBase(record, index, 'VF'), recordNo: pick(record, ['feeOrderNo', 'recordNo', 'id']), venue: pick(record, ['venue', 'venueName', 'venueCode']),
    totalWinLoss: safeNumber(pick(record, ['grossWinLoss', 'totalWinLoss'], 0)), feeRate: safeNumber(pick(record, ['venueFeeRate', 'feeRate'], 0)),
    fee: safeNumber(pick(record, ['totalShareFee', 'feeAmount', 'fee'], 0)), netAfterFee: safeNumber(pick(record, ['grossWinLoss', 'totalWinLoss'], 0)) - safeNumber(pick(record, ['totalShareFee', 'feeAmount', 'fee'], 0)),
    status: pick(record, ['status', 'state'], '已确认'),
  }))
}

function buildReversal(data) {
  if (!Array.isArray(data?.reversalStats)) return REVERSAL_ROWS
  return data.reversalStats.map((record, index) => ({
    ...normalizeBase(record, index, 'REV'), people: safeNumber(pick(record, ['paidBorrowerCount', 'advanceMembers', 'people'], 0)),
    balance: safeNumber(pick(record, ['advanceBalanceAmount', 'advanceAmount', 'balance'], 0)), levelCommission: safeNumber(pick(record, ['advanceLevelCommissionAmount', 'recoveredAmount', 'levelCommission'], 0)),
    memberProfit: safeNumber(pick(record, ['advanceDirectGrossAmount', 'memberProfit'], 0)), directCommission: safeNumber(pick(record, ['advanceDirectCommissionAmount', 'directCommission'], 0)),
    debt: safeNumber(pick(record, ['outstandingAmount', 'debtAmount', 'debt'], 0)), status: pick(record, ['status', 'state'], '待回款'),
  }))
}

function buildReturns(data) {
  if (!Array.isArray(data?.reversalReturns)) return RETURN_ROWS
  return data.reversalReturns.map((record, index) => ({
    ...normalizeBase(record, index, 'RET'), type: pick(record, ['debtTypeLabel', 'type']), direction: pick(record, ['directionLabel', 'direction']),
    amount: safeNumber(pick(record, ['amount', 'returnAmount', 'advanceAmount'], 0)), gap: safeNumber(pick(record, ['gapAmount', 'remaining', 'gap'], 0)), ledger: pick(record, ['reversalRecordNo', 'ledger'], record.id),
    status: pick(record, ['status', 'state'], '待回款'), occurredAt: pick(record, ['occurredAt', 'createdAt']),
  }))
}

function buildSiteProfit(data) {
  if (!Array.isArray(data?.siteProfitRows)) return SITE_PROFIT_ROWS
  return data.siteProfitRows.map((record, index) => {
    const revenue = safeNumber(pick(record, ['totalProfit', 'totalWinLoss', 'revenue'], 0))
    const profit = safeNumber(pick(record, ['siteNetIncomeTotal', 'profit'], 0))
    return {
      ...normalizeBase(record, index, 'SP'), recordNo: pick(record, ['reportNo', 'id']), revenue,
      venueFee: safeNumber(record.venueFee), bonus: safeNumber(pick(record, ['activityBonus', 'bonus'], 0)), rebate: safeNumber(record.rebate),
      handlingFee: safeNumber(record.rechargeFee) + safeNumber(record.withdrawFee) + safeNumber(record.paymentFee), commission: safeNumber(pick(record, ['agentCommission', 'commission'], 0)),
      profit, margin: revenue ? profit / Math.abs(revenue) : 0, status: pick(record, ['settleStatus', 'status'], '待结算'),
    }
  })
}

function buildFinance(data) {
  const bills = Array.isArray(data?.bills) ? data.bills : []
  const billRows = bills.map((bill, index) => {
    const agent = bill.payee || '—'
    const teamMode = bill.type === '团队佣金'
    const overrides = {
      site: bill.site || '旺财体育', team: teamMode ? bill.unitName : agent === 'dailiwc001' ? '—' : settlementMeta(agent).team,
      unit: bill.unitName || settlementMeta(agent).unit, cycle: bill.cycle || '2026-07',
    }
    return row(bill.id || `FIN-${index + 1}`, agent, {
      ...overrides, recordNo: bill.id || `FIN-${index + 1}`, account: agent, deposit: safeNumber(bill.depositAmount), withdrawal: safeNumber(bill.withdrawalAmount),
      totalWinLoss: safeNumber(bill.totalWinLoss), expenses: safeNumber(bill.venueFee) + safeNumber(bill.memberBonus) + safeNumber(bill.memberRebate) + safeNumber(bill.depositFee) + safeNumber(bill.withdrawalFee),
      netWinLoss: safeNumber(bill.netWinLossRaw), lastBalance: safeNumber(bill.lastBalance), balanceAdjustment: safeNumber(bill.balanceAdjustment),
      currentBalance: safeNumber(bill.correctedNet ?? bill.netWinLoss), commission: safeNumber(bill.payable), venueFee: safeNumber(bill.venueFee), rate: safeNumber(bill.rate),
      issued: safeNumber(bill.issued), status: bill.state || '待计算', createdAt: bill.createdAt || '—',
    })
  })
  const lineRows = [
    row('FIN-LINE-B', 'WC002', { recordNo: 'FIN-LINE-B', account: 'WC002', deposit: 168000, withdrawal: 62000, totalWinLoss: 164000, expenses: 18000, netWinLoss: 146000, lastBalance: 0, balanceAdjustment: 0, currentBalance: 146000, commission: 28000, venueFee: 7300, rate: 0, issued: 28000, status: '内部结算', createdAt: '2026-07-14 10:20' }),
    row('FIN-LINE-C', 'LGNB', { recordNo: 'FIN-LINE-C', account: 'LGNB', deposit: 92000, withdrawal: 38000, totalWinLoss: 57000, expenses: 7000, netWinLoss: 50000, lastBalance: 0, balanceAdjustment: 0, currentBalance: 50000, commission: 15000, venueFee: 2500, rate: 0, issued: 0, status: '处理中', createdAt: '2026-07-14 11:05' }),
  ]
  return [...billRows, ...lineRows]
}

function buildTransfers(data) {
  const normalized = normalizeTransfers(data)
  if (normalized.length) return normalized
  const internal = Array.isArray(data?.internalSettlements) ? data.internalSettlements : []
  const rows = internal.map((record, index) => row(record.id || `TR-${index + 1}`, record.secondaryAgent || record.mainAgent, {
    transferNo: record.id || `TR-${index + 1}`, agent: record.secondaryAgent || record.mainAgent, counterparty: record.mainAgent || '平台',
    team: record.teamName || 'gaodashang01部', unit: `${record.teamName || 'gaodashang01部'} / ${record.secondaryAgent || record.mainAgent}`,
    cycle: record.cycle || '2026-07', type: '主线内部结算', amount: safeNumber(record.amount), source: record.source || '平台已到账余额', status: record.state || '成功', createdAt: record.createdAt || '—',
  }))
  return [
    ...rows,
    row('TR-PLATFORM-001', 'gaodashang', { transferNo: 'TR-PLATFORM-001', counterparty: '旺财体育平台', type: '平台佣金到账', amount: 120000, source: '团队佣金账单', status: '成功', createdAt: '2026-07-14 10:10' }),
    row('TR-SINGLE-001', 'dailiwc001', { transferNo: 'TR-SINGLE-001', counterparty: '旺财体育平台', type: '单线代理佣金', amount: 68000, source: '单线代理账单', status: '待发放', createdAt: '2026-07-14 09:30' }),
    row('TR-LEGACY-001', 'FEE0428_A8', { transferNo: 'TR-LEGACY-001', counterparty: '财神客栈平台', type: '历史代理佣金', amount: 15000, source: '历史代理账单', status: '成功', createdAt: '2026-07-13 08:20' }),
  ]
}

function buildCommissionRecords(data) {
  return buildFinance(data).map((item, index) => ({
    ...item, id: `COM-${String(index + 1).padStart(3, '0')}`, billNo: item.recordNo, type: item.identity === '副线' ? '主线内部结算' : item.identity === '单线代理' ? '单线代理佣金' : item.identity === '团队负责人' ? '团队佣金' : '历史代理佣金',
    base: item.currentBalance, adjustment: item.balanceAdjustment, remaining: Math.max(0, item.commission - item.issued),
  }))
}

function buildRows(page, data) {
  if (page === 'members') return buildMembers(data)
  if (page === 'finance') return buildFinance(data)
  if (page === 'deposits') return buildDeposits(data)
  if (page === 'games') return buildGames(data)
  if (page === 'accountChanges') return buildAccountChanges(data)
  if (page === 'transfers') return buildTransfers(data)
  if (page === 'transferStats') return buildTransferStats(data)
  if (page === 'venueFees') return buildVenueFees(data)
  if (page === 'commissionRecords') return buildCommissionRecords(data)
  if (page === 'reversal') return buildReversal(data)
  if (page === 'returns') return buildReturns(data)
  if (page === 'siteProfit') return buildSiteProfit(data)
  return []
}

function moneyColumn(key, label, signed = false) {
  return { key, label, render: (value) => <Money value={value} signed={signed} /> }
}

function statusColumn() {
  return { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }
}

const PAGE_CONFIG = {
  members: {
    title: '代理会员', description: '按当前查看范围查询会员归属、首存、余额、有效投注与会员输赢。', detail: '会员详情', moneyPage: true,
    columns: [{ key: 'member', label: '会员账号' }, { key: 'agent', label: '直属代理' }, statusColumn(), { key: 'registeredAt', label: '注册时间' }, moneyColumn('firstDeposit', '首存金额'), moneyColumn('balance', '当前余额'), moneyColumn('validBet', '有效投注'), moneyColumn('winLoss', '会员输赢', true)],
  },
  finance: {
    title: '代理财务', description: '汇总代理或结算单元的存提款、成本、净输赢、当月结余与佣金；顶部卡片可下钻明细。', detail: '财务明细', moneyPage: true, metrics: true,
    columns: [{ key: 'recordNo', label: '财务记录号' }, { key: 'account', label: '代理账号' }, moneyColumn('deposit', '存款总额'), moneyColumn('withdrawal', '提款总额'), moneyColumn('totalWinLoss', '总输赢', true), moneyColumn('expenses', '费用合计'), moneyColumn('netWinLoss', '净输赢', true), moneyColumn('lastBalance', '上周期结余', true), moneyColumn('balanceAdjustment', '本月结余调整', true), moneyColumn('currentBalance', '当月结余', true), moneyColumn('commission', '应付佣金'), statusColumn()],
  },
  deposits: {
    title: '存款记录', description: '逐笔查询会员存款和代理代存的渠道、手续费与处理状态。', detail: '存款详情', moneyPage: true,
    columns: [{ key: 'orderNo', label: '交易单号' }, { key: 'member', label: '会员账号' }, { key: 'agent', label: '直属代理' }, { key: 'type', label: '交易类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'channel', label: '渠道' }, moneyColumn('amount', '交易金额'), moneyColumn('fee', '手续费'), statusColumn(), { key: 'occurredAt', label: '交易时间' }],
  },
  games: {
    title: '游戏记录', description: '查询会员投注、有效投注、派彩和输赢，并可打开单笔游戏详情。', detail: '游戏记录详情', moneyPage: true,
    columns: [{ key: 'betNo', label: '注单号' }, { key: 'member', label: '会员账号' }, { key: 'agent', label: '直属代理' }, { key: 'venue', label: '场馆' }, { key: 'game', label: '游戏' }, moneyColumn('betAmount', '投注金额'), moneyColumn('validBet', '有效投注'), moneyColumn('payout', '派彩金额'), moneyColumn('winLoss', '会员输赢', true), statusColumn(), { key: 'betAt', label: '投注时间' }],
  },
  accountChanges: {
    title: '账变明细', description: '回放会员与代理余额变化前后值、账变类型、操作来源和处理结果。', detail: '账变详情', moneyPage: true,
    columns: [{ key: 'changeNo', label: '账变单号' }, { key: 'member', label: '会员账号' }, { key: 'agent', label: '直属代理' }, { key: 'type', label: '账变类型' }, moneyColumn('before', '账变前余额'), moneyColumn('amount', '账变金额', true), moneyColumn('after', '账变后余额'), { key: 'operator', label: '操作来源' }, statusColumn(), { key: 'occurredAt', label: '账变时间' }],
  },
  transfers: {
    title: '转账明细', description: '查询平台佣金到账、主线内部结算、代理代存和代理提现资金流水。', detail: '转账详情', moneyPage: true,
    columns: [{ key: 'transferNo', label: '转账单号' }, { key: 'agent', label: '代理账号' }, { key: 'counterparty', label: '交易对方' }, { key: 'type', label: '转账类型' }, moneyColumn('amount', '转账金额'), { key: 'source', label: '资金来源' }, statusColumn(), { key: 'createdAt', label: '创建时间' }],
  },
  transferStats: {
    title: '充提转账统计', description: '按团队、线路和结算单元统计充值、提款、转入、转出及净流入。', detail: '转账统计详情', moneyPage: true,
    columns: [{ key: 'agent', label: '代理账号' }, { key: 'count', label: '交易笔数' }, moneyColumn('incoming', '转入金额'), moneyColumn('outgoing', '转出金额'), moneyColumn('net', '净流入', true), { key: 'lastAt', label: '最近交易时间' }, statusColumn()],
  },
  venueFees: {
    title: '场馆代理费用', description: '按结算单元查看总输赢、场馆费率、场馆费与扣费后金额。', detail: '场馆费详情', moneyPage: true,
    columns: [{ key: 'recordNo', label: '场馆费记录号' }, { key: 'agent', label: '代理账号' }, { key: 'venue', label: '场馆' }, moneyColumn('totalWinLoss', '总输赢', true), { key: 'feeRate', label: '场馆费率', render: (value) => <Percent value={value} /> }, moneyColumn('fee', '场馆费'), moneyColumn('netAfterFee', '扣费后金额', true), statusColumn()],
  },
  commissionRecords: {
    title: '佣金记录', description: '按角色范围查询团队佣金、单线代理佣金与主线内部结算，并查看锁定口径。', detail: '佣金记录详情', moneyPage: true,
    columns: [{ key: 'billNo', label: '佣金单号' }, { key: 'agent', label: '收款代理' }, { key: 'type', label: '佣金类型' }, moneyColumn('base', '当月结余 / 计算基数', true), { key: 'rate', label: '佣金比例', render: (value) => <Percent value={value} /> }, moneyColumn('adjustment', '佣金/结余调整', true), moneyColumn('commission', '应付佣金'), moneyColumn('issued', '已发金额'), moneyColumn('remaining', '待发金额'), statusColumn(), { key: 'createdAt', label: '生成时间' }],
  },
  reversal: {
    title: '冲正统计报表', description: '保留原冲正垫付、级差佣金、会员盈利与欠款口径，并补充结算身份。', detail: '冲正统计详情', moneyPage: true,
    columns: [{ key: 'id', label: '冲正账目ID' }, { key: 'agent', label: '代理账号' }, { key: 'people', label: '垫付人数' }, moneyColumn('balance', '垫付余额'), moneyColumn('levelCommission', '垫付级差佣金'), moneyColumn('memberProfit', '垫付会员盈利'), moneyColumn('directCommission', '垫付直属佣金'), moneyColumn('debt', '欠款额度'), statusColumn()],
  },
  returns: {
    title: '冲正回款报表', description: '逐笔查看冲正垫付和回款方向、额度缺口及对应冲正账目。', detail: '冲正回款详情', moneyPage: true,
    columns: [{ key: 'id', label: '回款记录号' }, { key: 'agent', label: '代理账号' }, { key: 'type', label: '账目类型' }, { key: 'direction', label: '垫付 / 回款', render: (value) => <StatusTag>{value}</StatusTag> }, moneyColumn('amount', '额度'), moneyColumn('gap', '额度缺口'), { key: 'ledger', label: '冲正账目ID' }, statusColumn(), { key: 'occurredAt', label: '时间' }],
  },
  siteProfit: {
    title: '站点利润', description: '按结算单元汇总站点收入、经营成本、佣金和站点留存盈利。', detail: '站点盈利详情', moneyPage: true,
    columns: [{ key: 'recordNo', label: '统计记录号' }, { key: 'agent', label: '负责人' }, moneyColumn('revenue', '收入 / 总输赢', true), moneyColumn('venueFee', '场馆费'), moneyColumn('bonus', '会员红利'), moneyColumn('rebate', '会员返水'), moneyColumn('handlingFee', '存提款手续费'), moneyColumn('commission', '应付佣金'), moneyColumn('profit', '站点盈利', true), { key: 'margin', label: '盈利率', render: (value) => <Percent value={value} /> }, statusColumn()],
  },
}

const CONTEXT_COLUMNS = [
  { key: 'site', label: '所属站点' }, { key: 'team', label: '所属团队' }, { key: 'line', label: '业务线路' },
  { key: 'identity', label: '结算身份', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
  { key: 'unit', label: '结算单元' }, { key: 'cycle', label: '生效周期' },
]

const AGENT_TYPE_COLUMN = { key: 'agentType', label: '代理类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }
const AGENT_IDENTITY_COLUMN = { key: 'identity', label: '代理身份', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }
const CONTEXT_BY_PORTAL = {
  site: [AGENT_TYPE_COLUMN, AGENT_IDENTITY_COLUMN, CONTEXT_COLUMNS[1], CONTEXT_COLUMNS[2], CONTEXT_COLUMNS[4], CONTEXT_COLUMNS[5]],
  agent: [AGENT_TYPE_COLUMN, AGENT_IDENTITY_COLUMN, CONTEXT_COLUMNS[2], CONTEXT_COLUMNS[4], CONTEXT_COLUMNS[5]],
}

function inScope(row, portal, role) {
  if (portal === 'site') return row.site === '旺财体育'
  if (portal === 'agent') return row.scopeRoles?.includes(role || 'main')
  return true
}

function matches(row, filters) {
  const keyword = filters.keyword.trim().toLowerCase()
  const text = Object.entries(row).filter(([key]) => key !== 'scopeRoles').map(([, value]) => String(value)).join(' ').toLowerCase()
  return (!keyword || text.includes(keyword))
    && (!filters.agentType || row.agentType === filters.agentType)
    && (!filters.identity || row.identity === filters.identity)
    && (!filters.line || row.line === filters.line)
    && (!filters.cycle || row.cycle === filters.cycle)
    && (!filters.status || row.status === filters.status)
}

function unique(rows, key) {
  return [...new Set(rows.map((item) => item[key]).filter((value) => value && value !== '—'))]
}

function sum(rows, key) {
  return rows.reduce((total, item) => total + safeNumber(item[key]), 0)
}

function ActionLink({ children, onClick }) {
  return <button className="ta-table-link" onClick={onClick}>{children}</button>
}

function BalanceFormula({ page }) {
  return <FormulaPanel title="当月结余口径" items={[
    { label: '净输赢', formula: '总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费' },
    { label: '冲正后净输赢 / 当月结余', formula: '净输赢 + 上周期结余 + 本月结余调整' },
    { label: '佣金', formula: 'MAX（0，当月结余 × 佣金比例 + 佣金调整）' },
  ]} warning={`${PAGE_CONFIG[page].title}中的交易金额先按业务类型归集；只有进入佣金账单的收入、成本和调整才参与当月结余计算，历史已完成周期不回写。`} />
}

function FinanceMetrics({ rows, onOpen }) {
  const items = [
    { key: 'deposit', label: '存款总额', value: sum(rows, 'deposit'), tone: 'green' },
    { key: 'withdrawal', label: '提款总额', value: sum(rows, 'withdrawal'), tone: 'orange' },
    { key: 'currentBalance', label: '当月结余', value: sum(rows, 'currentBalance'), tone: 'blue', signed: true },
    { key: 'commission', label: '应付佣金', value: sum(rows, 'commission'), tone: 'default' },
  ]
  return <MetricGrid columns={4}>{items.map((item) => <MetricCard key={item.key} label={item.label} value={<Money value={item.value} signed={item.signed} />} helper="点击查看当前筛选范围明细" tone={item.tone} icon={<EyeOutlined />} onClick={() => onOpen(item)} />)}</MetricGrid>
}

function detailAlert(page, detail) {
  if (page === 'members') return <Alert title="会员归属说明">会员按当前生效线路归集；团队负责人可查看 gaodashang 团队代理树，副线仅查看 WC002 本人线路，单线代理仅查看 dailiwc001 本人线路。</Alert>
  if (page === 'games') return <Alert title="游戏结算说明">有效投注与派彩以当前演示注单结算结果为准；冲正记录保留原注单号并进入对应结算单元复核。</Alert>
  if (page === 'commissionRecords') return <Alert title="佣金锁定口径">{detail.identity === '副线' ? '副线金额属于主线内部结算，不形成平台对副线的佣金欠款。' : '佣金按账单生成时锁定的当月结余、比例和调整计算，历史已完成周期不回写。'}</Alert>
  return <Alert title="范围说明">该记录按所属团队、业务线路、结算身份、结算单元和生效周期归集。</Alert>
}

function GenericReportPage({ page, portal, role, onToast }) {
  const { data } = useTeamAgent()
  const config = PAGE_CONFIG[page]
  const rows = useMemo(() => buildRows(page, data).filter((item) => inScope(item, portal, role)), [page, data, portal, role])
  const [draft, setDraft] = useState(EMPTY_FILTERS)
  const [applied, setApplied] = useState(EMPTY_FILTERS)
  const [detail, setDetail] = useState(null)
  const [metric, setMetric] = useState(null)
  useEffect(() => {
    setDraft(EMPTY_FILTERS); setApplied(EMPTY_FILTERS); setDetail(null); setMetric(null)
  }, [page, portal, role])
  const filtered = useMemo(() => rows.filter((item) => matches(item, applied)), [rows, applied])
  const synced = SYNCED_AGENT_REPORTS.has(page)
  const contextColumns = synced ? CONTEXT_BY_PORTAL[portal] : CONTEXT_COLUMNS
  const columns = useMemo(() => [...config.columns, ...contextColumns, { key: 'action', label: '操作', render: (_, item) => <ActionLink onClick={() => setDetail(item)}>详情</ActionLink> }], [config, contextColumns])
  const metricRows = metric ? filtered.filter((item) => safeNumber(item[metric.key]) !== 0) : []
  function search() {
    setApplied(draft)
    onToast?.(`已查询 ${rows.filter((item) => matches(item, draft)).length} 条${config.title}记录`)
  }
  function reset() {
    setDraft(EMPTY_FILTERS); setApplied(EMPTY_FILTERS); onToast?.(`${config.title}筛选条件已重置`)
  }
  return <>
    <SectionHeader title={config.title} description={config.description} />
    {synced && <Alert title="角色查看范围">{portal === 'site' ? '当前页面只展示旺财体育本站记录，不提供跨站点筛选和全局审核操作。' : '当前页面按团队负责人、副线或单线代理身份收窄数据，不展示其他团队、其他线路或跨站点记录。'}</Alert>}
    {config.metrics && <FinanceMetrics rows={filtered} onOpen={setMetric} />}
    <FilterBar onSearch={search} onReset={reset} onExport={() => onToast?.(`已生成 ${filtered.length} 条${config.title}导出演示`)}>
      <Field label="关键词"><Input value={draft.keyword} onChange={(keyword) => setDraft((current) => ({ ...current, keyword }))} placeholder="账号、单号、会员或结算单元" /></Field>
      {synced && <Field label="代理类型"><Select value={draft.agentType} onChange={(agentType) => setDraft((current) => ({ ...current, agentType }))} placeholder="全部类型" options={unique(rows, 'agentType')} /></Field>}
      <Field label="结算身份"><Select value={draft.identity} onChange={(identity) => setDraft((current) => ({ ...current, identity }))} placeholder="全部身份" options={unique(rows, 'identity')} /></Field>
      <Field label="业务线路"><Select value={draft.line} onChange={(line) => setDraft((current) => ({ ...current, line }))} placeholder="全部线路" options={unique(rows, 'line')} /></Field>
      <Field label="生效周期"><Select value={draft.cycle} onChange={(cycle) => setDraft((current) => ({ ...current, cycle }))} placeholder="全部周期" options={unique(rows, 'cycle')} /></Field>
      <Field label="状态"><Select value={draft.status} onChange={(status) => setDraft((current) => ({ ...current, status }))} placeholder="全部状态" options={unique(rows, 'status')} /></Field>
    </FilterBar>
    <DataTable minWidth={Math.max(1500, columns.length * 128)} columns={columns} rows={filtered} paginated />
    {config.moneyPage && <BalanceFormula page={page} />}
    <Modal open={!!detail} title={`${detail?.[config.columns[0].key] || ''} · ${config.detail}`} description="查看本条记录的业务字段与结算归属。" onClose={() => setDetail(null)} onConfirm={() => setDetail(null)} confirmText="关闭" showCancel={false} width={940}>
      {detail && <><DescriptionGrid columns={3} items={columns.filter((column) => column.key !== 'action').map((column) => ({ label: column.label, value: column.render ? column.render(detail[column.key], detail) : detail[column.key] }))} />{detailAlert(page, detail)}</>}
    </Modal>
    <Modal open={!!metric} title={`${metric?.label || ''} · 卡片明细`} description={`当前筛选范围共 ${metricRows.length} 个非零结算单元。`} onClose={() => setMetric(null)} onConfirm={() => setMetric(null)} confirmText="关闭" showCancel={false} width={900}>
      {metric && <><DescriptionGrid columns={3} items={[{ label: '指标名称', value: metric.label }, { label: '指标合计', value: <Money value={sum(filtered, metric.key)} signed={metric.signed} /> }, { label: '当前记录数', value: `${metricRows.length} 条` }]} /><DataTable minWidth={980} columns={[{ key: 'recordNo', label: '财务记录号' }, { key: 'account', label: '代理账号' }, { key: 'identity', label: '结算身份' }, { key: 'unit', label: '结算单元' }, { key: 'cycle', label: '生效周期' }, { key: metric.key, label: metric.label, render: (value) => <Money value={value} signed={metric.signed} /> }]} rows={metricRows} /></>}
    </Modal>
  </>
}

function UnsupportedReport({ page }) {
  return <><SectionHeader title="旧代理报表" description="当前页面标识尚未配置。" /><EmptyState title="未找到报表" description={`页面标识：${page || '—'}`} action={<FileSearchOutlined />} /></>
}

export function LegacyReportPage({ page, portal = 'master', role = 'main', onToast }) {
  if (page === 'prepaid') return <PrepaidReportPage portal={portal} role={role} onToast={onToast} />
  if (page === 'agentPay') return <AgentPayReportPage portal={portal} role={role} onToast={onToast} />
  if (!PAGE_CONFIG[page]) return <UnsupportedReport page={page} />
  return <GenericReportPage page={page} portal={portal} role={role} onToast={onToast} />
}
