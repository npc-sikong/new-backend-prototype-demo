import { useEffect, useMemo, useState } from 'react'
import { DownOutlined, DownloadOutlined, FolderOpenOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { useTeamAgent } from './context'
import {
  Alert,
  Button,
  DataTable,
  Field,
  FilterBar,
  FormulaPanel,
  FormGrid,
  Input,
  Money,
  Modal,
  Panel,
  Percent,
  SectionHeader,
  Select,
  StatusTag,
  Toolbar,
} from './ui'

const FILTER_DEFAULTS = { cycle: '', dateFrom: '', dateTo: '', agentIdentity: '', commissionState: '', auditState: '', keyword: '' }
const MONEY_KEYS = ['depositAmount', 'withdrawalAmount', 'totalWinLoss', 'venueFee', 'memberBonus', 'activityRewards', 'memberReferralReward', 'memberRebate', 'accountAdjustment', 'depositFee', 'withdrawalFee', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet', 'previousWinLossBalance', 'operatingExpense', 'previousOperatingExpense', 'thirdPartyVenueFee', 'depositWithdrawalFee', 'previousCommissionBalance', 'commissionNetIncome', 'currentDebt', 'totalDebt', 'commissionAdjustment', 'settlementCommission', 'commission']

const COLUMN_DEFS = [
  { key: 'agentAccount', label: '代理名称', className: 'negative-agent-name-column', cellClassName: 'negative-agent-name-cell' },
  { key: 'index', label: '序号' },
  { key: 'cycle', label: '佣金周期' },
  { key: 'teamName', label: '团队名称' },
  { key: 'agentId', label: '代理编号' },
  { key: 'agentType', label: '代理类型' },
  { key: 'recommender', label: '推荐人' },
  { key: 'agentIdentity', label: '代理身份' },
  { key: 'agentLevel', label: '代理层级' },
  { key: 'parentAccount', label: '上级账号' },
  { key: 'teamMembers', label: '团队人数' },
  { key: 'subAgentCount', label: '下级会员' },
  { key: 'registeredCount', label: '注册人数' },
  { key: 'firstDepositCount', label: '首存人数' },
  { key: 'activeCount', label: '活跃人数' },
  { key: 'newActiveCount', label: '新增活跃人数' },
  { key: 'depositAmount', label: '存款金额' },
  { key: 'withdrawalAmount', label: '提款金额' },
  { key: 'totalWinLoss', label: '总输赢' },
  { key: 'venueFee', label: '场馆费' },
  { key: 'memberBonus', label: '红利' },
  { key: 'activityRewards', label: '各活动奖励' },
  { key: 'memberReferralReward', label: '会员推会员' },
  { key: 'memberRebate', label: '返水' },
  { key: 'accountAdjustment', label: '账户调整' },
  { key: 'depositFee', label: '存款手续费' },
  { key: 'withdrawalFee', label: '提款手续费' },
  { key: 'manualOrderWinLoss', label: '补单输赢' },
  { key: 'netWinLossRaw', label: '净输赢' },
  { key: 'lastBalance', label: '上周期结余' },
  { key: 'correctedNet', label: '冲正后净输赢' },
  { key: 'rebateLevel', label: '返佣等级' },
  { key: 'rate', label: '佣金比例' },
  { key: 'commissionAdjustment', label: '佣金调整' },
  { key: 'commission', label: '佣金' },
  { key: 'commissionState', label: '佣金状态' },
  { key: 'becameAgentAt', label: '成为代理时间' },
  { key: 'joinedAt', label: '加入团队时间' },
  { key: 'issuedBy', label: '发放人' },
  { key: 'issuedAt', label: '发放时间' },
  { key: 'reviewer', label: '审核人员' },
  { key: 'reviewedAt', label: '审核时间' },
  { key: 'auditState', label: '审核状态' },
  { key: 'maintainer', label: '维护人' },
  { key: 'adjustmentReason', label: '调整原因' },
]

const columnOf = (key, label) => ({ ...COLUMN_DEFS.find((column) => column.key === key), key, label: label || COLUMN_DEFS.find((column) => column.key === key)?.label || key })
const SETTLEMENT_COLUMN_DEFS = [
  columnOf('agentAccount'),
  columnOf('index'),
  columnOf('cycle'),
  columnOf('teamName'),
  columnOf('agentId'),
  columnOf('agentIdentity'),
  columnOf('parentAccount'),
  columnOf('totalWinLoss'),
  { key: 'previousWinLossBalance', label: '上周期结余总输赢' },
  columnOf('rate', '返佣比例'),
  { key: 'operatingExpense', label: '运营费用' },
  { key: 'previousOperatingExpense', label: '上周期结余运营费用' },
  { key: 'thirdPartyVenueFee', label: '三方场馆费用' },
  { key: 'depositWithdrawalFee', label: '充值手续费' },
  { key: 'operatingShareRate', label: '运营分摊比例' },
  { key: 'previousCommissionBalance', label: '上周期结余佣金' },
  { key: 'commissionNetIncome', label: '佣金净收益' },
  columnOf('commissionAdjustment'),
  { key: 'settlementCommission', label: '佣金' },
  columnOf('commissionState'),
  columnOf('becameAgentAt'),
  columnOf('joinedAt'),
  columnOf('issuedBy'),
  columnOf('issuedAt'),
  columnOf('reviewer'),
  columnOf('reviewedAt'),
  columnOf('auditState'),
  columnOf('maintainer'),
  columnOf('adjustmentReason'),
]

const FIELD_TIPS = {
  agentAccount: '本条账单对应的团队负责人或单线代理账号。',
  index: '当前筛选结果中的展示序号。',
  cycle: '本条佣金账单归属的结算周期。',
  teamName: '团队代理所属团队；单线代理显示其独立结算单元。',
  agentId: '代理在当前站点内的唯一编号。',
  agentType: '当前记录的代理业务类型；负盈利业务统一展示为团队代理，单线代理仅在代理层级中识别。',
  recommender: '建立当前代理推荐关系的代理账号；未设置时显示横线。',
  agentIdentity: '代理身份仅展示官方代理或普通代理。',
  agentLevel: '当前代理在负盈利业务中的层级，仅展示团队负责人、副线或单线代理。',
  parentAccount: '当前代理关系中的直接上级账号；无上级时显示横线。',
  totalWinLoss: '本周期全部直属及授权下级会员产生的总输赢。',
  previousWinLossBalance: '上一结算周期未完成计佣、需要带入本周期的总输赢。',
  rate: '当前代理命中方案对应的返佣比例。',
  operatingExpense: '活动奖励、会员推会员、返水、礼金、人工发彩金和余额宝利息的合计；点击金额可查看明细。',
  previousOperatingExpense: '上一结算周期未完成分摊、需要带入本周期的运营费用。',
  thirdPartyVenueFee: '本周期三方场馆按约定费率收取的费用合计。',
  depositWithdrawalFee: '本原型汇总展示本周期充值及提现处理手续费，佣金公式中按充提手续费参与计算。',
  operatingShareRate: '代理需要承担运营费用、三方场馆费用及充提手续费的分摊比例。',
  previousCommissionBalance: '上一结算周期未发放、需要带入本周期的佣金额度。',
  commissionNetIncome: '总输赢计佣结果扣除按比例分摊的运营与场馆等费用后的佣金净额。',
  currentDebt: '本期净输赢为负时形成的欠款额度；本期净输赢为正或零时显示0。',
  totalDebt: '本期冲正后净输赢为负时仍未抵扣完成的累计欠款额度。',
  commissionAdjustment: '运营人员对本期最终佣金进行的增加或减少调整，减少时显示负数。',
  settlementCommission: '按本页公式计算的本期最终佣金，确认、不发放和修改发放均以此金额为准。',
  commissionState: '当前账单在提交、审核、发放或结转流程中的状态。',
  becameAgentAt: '该账号正式成为代理的日期。',
  joinedAt: '该代理加入当前团队或独立结算单元的日期。',
  issuedBy: '执行本次佣金发放的操作人员。',
  issuedAt: '本次佣金实际发放时间。',
  reviewer: '审核本条佣金账单的人员。',
  reviewedAt: '本条佣金账单完成审核的时间。',
  auditState: '本条佣金账单当前审核状态。',
  maintainer: '最后维护本条佣金账单的人员。',
  adjustmentReason: '佣金调整、不发放或其他人工处理的业务原因。',
  action: '对当前待结算记录执行确认、不发放或修改发放。',
}

const ALL_KEYS = COLUMN_DEFS.map((column) => column.key)
const AGENT_HIDDEN_KEYS = new Set(['reviewer', 'reviewedAt', 'maintainer', 'adjustmentReason'])
const COMMISSION_REPORT_EXCLUDED_KEYS = new Set(['commissionAdjustment', 'commissionState', 'issuedBy', 'issuedAt', 'reviewer', 'reviewedAt', 'auditState', 'maintainer', 'adjustmentReason'])
const STATISTIC_TIME_COLUMN = { key: 'statisticTime', label: '统计时间' }
const COMMISSION_REPORT_COLUMNS = COLUMN_DEFS
  .flatMap((column) => {
    if (column.key === 'cycle') return [column, STATISTIC_TIME_COLUMN]
    if (column.key === 'commission') return [
      { key: 'commissionNetIncome', label: '佣金净收益' },
      { key: 'currentDebt', label: '本期欠款' },
      { key: 'totalDebt', label: '总欠款' },
      column,
    ]
    return [column]
  })
  .filter((column) => !COMMISSION_REPORT_EXCLUDED_KEYS.has(column.key))
const ROLE_ACCOUNTS = { main: ['gaodashang'], secondary: ['WC002'], independent: ['dailiwc001'] }
const COUNT_KEYS = ['teamMembers', 'subAgentCount', 'registeredCount', 'firstDepositCount', 'activeCount', 'newActiveCount']
const COUNT_KEY_SET = new Set(COUNT_KEYS)
const SIGNED_MONEY_KEYS = new Set(['totalWinLoss', 'accountAdjustment', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet', 'previousWinLossBalance', 'previousOperatingExpense', 'previousCommissionBalance', 'commissionNetIncome', 'commissionAdjustment', 'settlementCommission'])

const unique = (rows, key) => Array.from(new Set(rows.map((row) => row[key]).filter(Boolean)))
const formatDate = (value) => String(value || '—').slice(0, 16)
const sumRows = (rows, key) => rows.reduce((sum, row) => sum + Number(row[key] || 0), 0)
const firstPresent = (...values) => values.find((value) => value && value !== '—') || '—'
const rowSearchText = (row) => `${row.teamName}${row.agentId}${row.agentAccount}${row.parentAccount}${row.recommender}${row.memberRows.map((item) => `${item.teamName}${item.agentId}${item.agentAccount}${item.recommender}`).join('')}`.toLowerCase()
const rebateLevelOf = (bill, agent) => bill.rebateLevel || (bill.type === '团队佣金' ? `团队返佣${bill.teamLevel || agent.level || 1}级` : bill.type === '单线代理佣金' ? '单线返佣1级' : `${agent.level || 1}级`)
const statisticRangeOf = (bill) => { const [year, month] = String(bill.cycle || '2026-07').split('-').map(Number); const start = bill.periodStart || `${year}-${String(month).padStart(2, '0')}-01`; const end = bill.periodEnd || `${year}-${String(month).padStart(2, '0')}-${String(new Date(year, month, 0).getDate()).padStart(2, '0')}`; return { periodStart: start, periodEnd: end, statisticTime: `${start} 至 ${end}` } }
const sumBreakdown = (breakdown) => Object.values(breakdown).reduce((sum, value) => sum + Number(value || 0), 0)

function operatingBreakdownOf(source) {
  return {
    activityRewards: Number(source.activityRewards || 0),
    memberReferralReward: Number(source.memberReferralReward || 0),
    memberRebate: Number(source.memberRebate || 0),
    giftAmount: Number(source.giftAmount ?? source.memberBonus ?? 0),
    manualBonus: Number(source.manualBonus || 0),
    yuebaoInterest: Number(source.yuebaoInterest || 0),
  }
}

function settlementMetricsOf(source) {
  const operatingExpenseBreakdown = operatingBreakdownOf(source)
  const operatingExpense = Number(source.operatingExpense ?? sumBreakdown(operatingExpenseBreakdown))
  const previousWinLossBalance = Number(source.previousWinLossBalance ?? source.lastBalance ?? 0)
  const previousOperatingExpense = Number(source.previousOperatingExpense || 0)
  const thirdPartyVenueFee = Number(source.thirdPartyVenueFee ?? source.venueFee ?? 0)
  const depositWithdrawalFee = Number(source.depositWithdrawalFee ?? (Number(source.depositFee || 0) + Number(source.withdrawalFee || 0)))
  const operatingShareRate = Number(source.operatingShareRate ?? source.rate ?? 0)
  const previousCommissionBalance = Number(source.previousCommissionBalance || 0)
  const commissionNetIncome = (Number(source.totalWinLoss || 0) + previousWinLossBalance) * Number(source.rate || 0)
    - (operatingExpense + thirdPartyVenueFee + depositWithdrawalFee + previousOperatingExpense) * operatingShareRate
  const currentDebt = Number(source.currentDebt ?? Math.max(0, -Number(source.netWinLossRaw || 0)))
  const totalDebt = Number(source.totalDebt ?? Math.max(0, -Number(source.correctedNet || 0)))
  const settlementCommission = commissionNetIncome + previousCommissionBalance + Number(source.commissionAdjustment || 0)
  return {
    previousWinLossBalance,
    operatingExpense,
    operatingExpenseBreakdown,
    previousOperatingExpense,
    thirdPartyVenueFee,
    depositWithdrawalFee,
    operatingShareRate,
    previousCommissionBalance,
    commissionNetIncome,
    currentDebt,
    totalDebt,
    settlementCommission,
  }
}

function HeaderTipLabel({ column, onOpen }) {
  return <span className="negative-column-label"><span>{column.label}</span><button type="button" aria-label={`查看${column.label}说明`} title={`${column.label} TIPS`} onClick={() => onOpen({ label: column.label, text: FIELD_TIPS[column.key] || `${column.label}用于当前负盈利代理佣金结算核对。` })}>?</button></span>
}

function distributeTotal(total, weights, precision = 2) {
  const scale = 10 ** precision
  const totalUnits = Math.round(Number(total || 0) * scale)
  const normalizedWeights = weights.map((value) => Math.abs(Number(value || 0)))
  const weightTotal = normalizedWeights.reduce((sum, value) => sum + value, 0)
  const effectiveWeights = weightTotal ? normalizedWeights : normalizedWeights.map(() => 1)
  const effectiveTotal = effectiveWeights.reduce((sum, value) => sum + value, 0) || 1
  let allocatedUnits = 0
  return effectiveWeights.map((weight, index) => {
    const units = index === effectiveWeights.length - 1 ? totalUnits - allocatedUnits : Math.round(totalUnits * weight / effectiveTotal)
    allocatedUnits += units
    return units / scale
  })
}

function auditStateOf(bill) {
  if (bill.state === '审核退回') return '审核退回'
  if (['待审核', '待提交'].includes(bill.state)) return '待审核'
  if (bill.reviewer && bill.reviewer !== '—') return '已审核'
  return '待审核'
}

function buildTeamMemberRows(data, bill, team) {
  if (bill.type !== '团队佣金' || !team?.lines?.length) return []
  const teamLeader = data.agents.find((item) => item.account === team.mainAgent || item.account === bill.payee) || {}
  const teamAgentIdentity = teamLeader.teamAgentType === '官方代理' || bill.agentType === '官方代理' ? '官方代理' : '普通代理'
  const statisticRange = statisticRangeOf(bill)
  const members = team.lines.map((line) => ({
    line,
    agent: data.agents.find((item) => item.account === line.agent) || {},
    isTeamLeader: line.agent === team.mainAgent || line.identity === '主线',
  }))
  const weights = (reader) => members.map((member) => reader(member))
  const performanceWeights = weights(({ line, agent }) => agent.totalWinLoss ?? line.netWinLoss ?? 0)
  const allocations = {
    teamMembers: distributeTotal(bill.teamMembers ?? members.length, weights(() => 1), 0),
    subAgentCount: distributeTotal(bill.subAgentCount ?? teamLeader.subAgents ?? 0, weights(({ agent }) => agent.subAgents), 0),
    registeredCount: distributeTotal(bill.registeredCount ?? teamLeader.members ?? 0, weights(({ agent }) => agent.members), 0),
    firstDepositCount: distributeTotal(bill.firstDepositCount ?? 0, weights(({ line }) => line.firstDepositCount), 0),
    activeCount: distributeTotal(bill.activeCount ?? teamLeader.activeMembers ?? 0, weights(({ line, agent }) => line.activeMembers ?? agent.activeMembers), 0),
    newActiveCount: distributeTotal(bill.newActiveCount ?? teamLeader.newActiveMembers ?? 0, weights(({ line, agent }) => line.newActive ?? agent.newActiveMembers), 0),
    depositAmount: distributeTotal(bill.depositAmount ?? teamLeader.depositAmount ?? 0, weights(({ agent }) => agent.depositAmount)),
    withdrawalAmount: distributeTotal(bill.withdrawalAmount ?? teamLeader.withdrawalAmount ?? 0, weights(({ agent }) => agent.withdrawalAmount)),
    totalWinLoss: distributeTotal(bill.totalWinLoss ?? teamLeader.totalWinLoss ?? 0, performanceWeights),
    venueFee: distributeTotal(bill.venueFee ?? 0, performanceWeights),
    memberBonus: distributeTotal(bill.memberBonus ?? 0, performanceWeights),
    activityRewards: distributeTotal(bill.activityRewards ?? 0, performanceWeights),
    memberReferralReward: distributeTotal(bill.memberReferralReward ?? 0, performanceWeights),
    memberRebate: distributeTotal(bill.memberRebate ?? 0, performanceWeights),
    giftAmount: distributeTotal(bill.giftAmount ?? bill.memberBonus ?? 0, performanceWeights),
    manualBonus: distributeTotal(bill.manualBonus ?? 0, performanceWeights),
    yuebaoInterest: distributeTotal(bill.yuebaoInterest ?? 0, performanceWeights),
    accountAdjustment: distributeTotal(bill.accountAdjustment ?? 0, performanceWeights),
    depositFee: distributeTotal(bill.depositFee ?? 0, performanceWeights),
    withdrawalFee: distributeTotal(bill.withdrawalFee ?? 0, performanceWeights),
    manualOrderWinLoss: distributeTotal(bill.manualOrderWinLoss ?? 0, performanceWeights),
    netWinLossRaw: distributeTotal(bill.netWinLossRaw ?? 0, performanceWeights),
    lastBalance: distributeTotal(bill.lastBalance ?? 0, performanceWeights),
    previousOperatingExpense: distributeTotal(bill.previousOperatingExpense ?? 0, performanceWeights),
    previousCommissionBalance: distributeTotal(bill.previousCommissionBalance ?? 0, performanceWeights),
    correctedNet: distributeTotal(bill.correctedNet ?? 0, performanceWeights),
    commissionAdjustment: distributeTotal(bill.commissionAdjustment ?? 0, performanceWeights),
    commission: distributeTotal(bill.payable ?? 0, performanceWeights),
  }
  return members.map(({ line, agent, isTeamLeader }, memberIndex) => {
    const valueOf = (key) => allocations[key][memberIndex]
    const memberRow = {
        id: `${bill.id}-${line.lineId}`,
        parentId: bill.id,
        rowType: 'member',
        expandable: false,
        site: bill.site || agent.site || team.site || '—',
        index: `${memberIndex + 1}`,
        cycle: bill.cycle,
        ...statisticRange,
        teamName: team.name,
        agentId: agent.id || '—',
        agentAccount: line.agent,
        agentType: '团队代理',
        recommender: firstPresent(agent.recommender, team.recommender, bill.recommender),
        agentIdentity: teamAgentIdentity,
        agentLevel: isTeamLeader ? '团队负责人' : '副线',
        parentAccount: isTeamLeader ? agent.parent || bill.recommender || '—' : team.mainAgent || agent.parent || '—',
        teamMembers: valueOf('teamMembers'),
        subAgentCount: valueOf('subAgentCount'),
        registeredCount: valueOf('registeredCount'),
        firstDepositCount: valueOf('firstDepositCount'),
        activeCount: valueOf('activeCount'),
        newActiveCount: valueOf('newActiveCount'),
        depositAmount: valueOf('depositAmount'),
        withdrawalAmount: valueOf('withdrawalAmount'),
        totalWinLoss: valueOf('totalWinLoss'),
        venueFee: valueOf('venueFee'),
        memberBonus: valueOf('memberBonus'),
        activityRewards: valueOf('activityRewards'),
        memberReferralReward: valueOf('memberReferralReward'),
        memberRebate: valueOf('memberRebate'),
        accountAdjustment: valueOf('accountAdjustment'),
        depositFee: valueOf('depositFee'),
        withdrawalFee: valueOf('withdrawalFee'),
        manualOrderWinLoss: valueOf('manualOrderWinLoss'),
        netWinLossRaw: valueOf('netWinLossRaw'),
        lastBalance: valueOf('lastBalance'),
        correctedNet: valueOf('correctedNet'),
        rebateLevel: rebateLevelOf(bill, agent),
        rate: bill.rate ?? 0,
        commissionAdjustment: valueOf('commissionAdjustment'),
        commission: valueOf('commission'),
        commissionState: '随团队结算',
        becameAgentAt: formatDate(agent.registeredAt),
        joinedAt: formatDate(team.joinedAt || agent.effectiveCycle),
        issuedBy: '—',
        issuedAt: '—',
        reviewer: '—',
        reviewedAt: '—',
        auditState: '随团队审核',
        maintainer: agent.developer || team.developer || '—',
        adjustmentReason: `${isTeamLeader ? '团队负责人' : '副线'}明细（不独立发放）`,
    }
    return {
      ...memberRow,
      ...settlementMetricsOf({
        ...memberRow,
        activityRewards: valueOf('activityRewards'),
        memberReferralReward: valueOf('memberReferralReward'),
        memberRebate: valueOf('memberRebate'),
        giftAmount: valueOf('giftAmount'),
        manualBonus: valueOf('manualBonus'),
        yuebaoInterest: valueOf('yuebaoInterest'),
        previousOperatingExpense: valueOf('previousOperatingExpense'),
        previousCommissionBalance: valueOf('previousCommissionBalance'),
        operatingShareRate: bill.operatingShareRate ?? bill.rate ?? 0,
      }),
    }
  })
}

function buildRecommendedRows(data) {
  return (data.recommendedCommissionRows || []).map((source) => {
    const statisticRange = statisticRangeOf(source)
    const baseRow = {
      id: source.id,
      rowType: source.agentLevel === '团队负责人' ? 'team' : 'single',
      recommendationOnly: true,
      expandable: false,
      memberRows: [],
      site: source.site || '旺财体育',
      index: 0,
      cycle: source.cycle,
      ...statisticRange,
      teamName: source.teamName || '—',
      agentId: source.agentId || '—',
      agentAccount: source.agentAccount,
      agentType: '团队代理',
      recommender: source.recommender || '—',
      agentIdentity: source.agentIdentity || '普通代理',
      agentLevel: source.agentLevel || '单线代理',
      parentAccount: source.parentAccount || '—',
      teamMembers: source.teamMembers ?? 1,
      subAgentCount: source.subAgentCount ?? 0,
      registeredCount: source.registeredCount ?? 0,
      firstDepositCount: source.firstDepositCount ?? 0,
      activeCount: source.activeCount ?? 0,
      newActiveCount: source.newActiveCount ?? 0,
      depositAmount: source.depositAmount ?? 0,
      withdrawalAmount: source.withdrawalAmount ?? 0,
      totalWinLoss: source.totalWinLoss ?? 0,
      venueFee: source.venueFee ?? 0,
      memberBonus: source.memberBonus ?? 0,
      activityRewards: source.activityRewards ?? 0,
      memberReferralReward: source.memberReferralReward ?? 0,
      memberRebate: source.memberRebate ?? 0,
      accountAdjustment: source.accountAdjustment ?? 0,
      depositFee: source.depositFee ?? 0,
      withdrawalFee: source.withdrawalFee ?? 0,
      manualOrderWinLoss: source.manualOrderWinLoss ?? 0,
      netWinLossRaw: source.netWinLossRaw ?? 0,
      lastBalance: source.lastBalance ?? 0,
      correctedNet: source.correctedNet ?? 0,
      rebateLevel: source.rebateLevel || source.grade || '—',
      rate: source.rate ?? 0,
      commissionAdjustment: 0,
      commission: source.payable ?? 0,
      commissionState: '推荐数据',
      becameAgentAt: formatDate(source.becameAgentAt),
      joinedAt: formatDate(source.joinedAt),
      issuedBy: '—',
      issuedAt: '—',
      reviewer: '—',
      reviewedAt: '—',
      auditState: '只读',
      maintainer: '—',
      adjustmentReason: '推荐代理经营汇总',
    }
    return { ...baseRow, ...settlementMetricsOf({ ...source, ...baseRow }) }
  })
}

function buildRows(data, { includeRecommendations = false } = {}) {
  const billRows = data.bills
    .filter((bill) => ['团队佣金', '单线代理佣金'].includes(bill.type))
    .map((bill) => {
      const agent = data.agents.find((item) => item.account === bill.payee) || {}
      const team = data.teams.find((item) => item.id === bill.unitId || item.name === bill.unitName)
      const isNegativeMode = agent.model === '负盈利模式' || Number(bill.correctedNet || 0) < 0
      if (!isNegativeMode) return null
      const memberRows = buildTeamMemberRows(data, bill, team)
      const statisticRange = statisticRangeOf(bill)
      const baseRow = {
        id: bill.id,
        rowType: bill.type === '团队佣金' ? 'team' : 'single',
        expandable: memberRows.length > 0,
        memberRows,
        site: bill.site || agent.site || '—',
        index: 0,
        cycle: bill.cycle,
        ...statisticRange,
        teamName: bill.unitName || team?.name || agent.unit || '—',
        agentId: agent.id || bill.agentId || '—',
        agentAccount: bill.payee,
        agentType: '团队代理',
        recommender: firstPresent(bill.recommender, team?.recommender, agent.recommender),
        agentIdentity: agent.teamAgentType === '官方代理' || bill.agentType === '官方代理' ? '官方代理' : '普通代理',
        agentLevel: bill.type === '团队佣金' ? '团队负责人' : '单线代理',
        parentAccount: agent.parent || bill.recommender || '—',
        teamMembers: bill.teamMembers ?? team?.lines?.length ?? (bill.type === '单线代理佣金' ? 1 : 0),
        subAgentCount: bill.subAgentCount ?? agent.subAgents ?? 0,
        registeredCount: bill.registeredCount ?? agent.members ?? 0,
        firstDepositCount: bill.firstDepositCount ?? 0,
        activeCount: bill.activeCount ?? agent.activeMembers ?? 0,
        newActiveCount: bill.newActiveCount ?? agent.newActiveMembers ?? 0,
        depositAmount: bill.depositAmount ?? agent.depositAmount ?? 0,
        withdrawalAmount: bill.withdrawalAmount ?? agent.withdrawalAmount ?? 0,
        totalWinLoss: bill.totalWinLoss ?? agent.totalWinLoss ?? 0,
        venueFee: bill.venueFee ?? 0,
        memberBonus: bill.memberBonus ?? 0,
        activityRewards: bill.activityRewards ?? 0,
        memberReferralReward: bill.memberReferralReward ?? 0,
        memberRebate: bill.memberRebate ?? 0,
        accountAdjustment: bill.accountAdjustment ?? 0,
        depositFee: bill.depositFee ?? 0,
        withdrawalFee: bill.withdrawalFee ?? 0,
        manualOrderWinLoss: bill.manualOrderWinLoss ?? 0,
        netWinLossRaw: bill.netWinLossRaw ?? 0,
        lastBalance: bill.lastBalance ?? 0,
        correctedNet: bill.correctedNet ?? 0,
        rebateLevel: rebateLevelOf(bill, agent),
        rate: bill.rate ?? 0,
        commissionAdjustment: bill.commissionAdjustment ?? 0,
        commission: bill.payable ?? 0,
        commissionState: bill.state || '待审核',
        becameAgentAt: formatDate(bill.becameAgentAt || agent.registeredAt),
        joinedAt: formatDate(team?.joinedAt || agent.effectiveCycle || bill.createdAt),
        issuedBy: bill.issuedBy || '—',
        issuedAt: formatDate(bill.issuedAt),
        reviewer: bill.reviewer || '—',
        reviewedAt: formatDate(bill.reviewedAt),
        auditState: auditStateOf(bill),
        maintainer: bill.maintainer || agent.developer || team?.developer || '—',
        adjustmentReason: bill.adjustmentReason || (Number(bill.commissionAdjustment || 0) ? '佣金调整' : '—'),
      }
      return { ...baseRow, ...settlementMetricsOf({ ...bill, ...baseRow }) }
    })
    .filter(Boolean)
  const recommendationRows = includeRecommendations ? buildRecommendedRows(data) : []
  return [...billRows, ...recommendationRows].map((row, index) => ({ ...row, index: index + 1 }))
}

export const NEGATIVE_REPORT_COLUMNS = COLUMN_DEFS
export const NEGATIVE_REPORT_COMMISSION_EXCLUDED_KEYS = COMMISSION_REPORT_EXCLUDED_KEYS
export const NEGATIVE_COMMISSION_REPORT_COLUMNS = COMMISSION_REPORT_COLUMNS
export const buildNegativeReportRows = buildRows

export function scopeSiteNegativeReportRows(rows) {
  return rows.flatMap((row) => {
    if (row.site !== '旺财体育' || row.recommendationOnly) return []
    const memberRows = row.memberRows.filter((member) => member.site === '旺财体育')
    return [{ ...row, memberRows, expandable: memberRows.length > 0 }]
  })
}

function recommendedRowsFor(rows, account, rootRow) {
  return rows
    .filter((row) => row.agentAccount !== account && row.recommender === account && row.cycle === rootRow.cycle)
    .map((row) => {
      const isTeam = row.agentLevel === '团队负责人'
      return {
        ...row,
        id: `${rootRow.id}-recommended-${row.id}`,
        sourceRowId: row.id,
        parentId: rootRow.id,
        rowType: isTeam ? 'recommended-team' : 'recommended-single',
        isRecommended: true,
        recommendationLabel: isTeam ? '推荐团队' : '推荐单线',
        expandable: false,
        memberRows: [],
      }
    })
}

export function scopeNegativeReportRows(rows, role) {
  const accounts = ROLE_ACCOUNTS[role] || []
  const account = accounts[0]
  if (!account) return []
  if (role === 'secondary') {
    return rows
      .flatMap((row) => row.memberRows.filter((member) => accounts.includes(member.agentAccount)))
      .map((member, index) => {
        const recommendationRows = recommendedRowsFor(rows, account, member)
        return {
          ...member,
          parentId: undefined,
          rowType: 'secondary',
          index: index + 1,
          expandable: recommendationRows.length > 0,
          memberRows: recommendationRows,
          ownMemberCount: 0,
          recommendedCount: recommendationRows.length,
          expansionLabel: '推荐团队与推荐单线',
        }
      })
  }
  return rows
    .filter((row) => !row.recommendationOnly && accounts.includes(row.agentAccount))
    .map((row, index) => {
      const recommendationRows = recommendedRowsFor(rows, account, row)
      const ownMemberRows = role === 'main' ? row.memberRows : []
      return {
        ...row,
        index: index + 1,
        memberRows: [...ownMemberRows, ...recommendationRows],
        expandable: ownMemberRows.length + recommendationRows.length > 0,
        ownMemberCount: ownMemberRows.length,
        recommendedCount: recommendationRows.length,
        expansionLabel: role === 'main' ? '团队成员与推荐数据' : '推荐团队与推荐单线',
      }
    })
}

function FieldColumnFilter({ columns, visibleKeys, onChange }) {
  const [open, setOpen] = useState(false)
  const toggleKey = (key) => {
    const next = visibleKeys.includes(key) ? visibleKeys.filter((item) => item !== key) : [...visibleKeys, key]
    if (next.length) onChange(next)
  }
  const selectedText = visibleKeys.length === columns.length ? '全部字段' : `已选 ${visibleKeys.length}/${columns.length}`

  return <div className="negative-field-filter">
    <button type="button" className="negative-field-filter-trigger" onClick={() => setOpen((value) => !value)}>
      <span>{selectedText}</span><DownOutlined />
    </button>
    {open && <div className="negative-field-filter-menu">
      <header><span>选择明细字段</span><div><button type="button" onClick={() => onChange(columns.map((column) => column.key))}>全选</button><button type="button" onClick={() => onChange(columns.filter((column) => !visibleKeys.includes(column.key)).map((column) => column.key))}>反选</button></div></header>
      <div className="negative-field-filter-options">
        {columns.map((column) => <label key={column.key}>
          <input type="checkbox" checked={visibleKeys.includes(column.key)} onChange={() => toggleKey(column.key)} />
          <span>{column.label}</span>
        </label>)}
      </div>
    </div>}
  </div>
}

function renderTotalCell(column, rows) {
  if (column.key === 'expand') return null
  if (column.key === 'index') return <b>总计</b>
  if (column.key === 'cycle') return <span>当前筛选 {rows.length} 条</span>
  if (COUNT_KEY_SET.has(column.key)) return <b>{sumRows(rows, column.key)}</b>
  if (MONEY_KEYS.includes(column.key)) return <Money value={sumRows(rows, column.key)} signed={SIGNED_MONEY_KEYS.has(column.key)} />
  return <span className="negative-total-muted">—</span>
}

function NegativeReportTotalRow({ columns, rows }) {
  return <tr className="negative-profit-total-row">
    {columns.map((column) => <td key={column.key}>{renderTotalCell(column, rows)}</td>)}
  </tr>
}

export function NegativeProfitReportPage({ onToast, portal = 'master', role = 'main', variant = 'settlement' }) {
  const { data } = useTeamAgent()
  const isCommissionReport = variant === 'commissionReport'
  const [rowUpdates, setRowUpdates] = useState({})
  const [adjusting, setAdjusting] = useState(null)
  const [adjustForm, setAdjustForm] = useState({ reduction: 0, remark: '' })
  const [operatingDetail, setOperatingDetail] = useState(null)
  const [fieldTip, setFieldTip] = useState(null)
  const allRows = useMemo(() => {
    const sourceRows = buildRows(data, { includeRecommendations: portal === 'agent' && isCommissionReport })
    if (portal === 'agent' && isCommissionReport) {
      return scopeNegativeReportRows(sourceRows, role).map((row) => ({ ...row, ...(rowUpdates[row.id] || {}) }))
    }
    const scopedRows = sourceRows.flatMap((row) => {
      if (portal === 'site') return scopeSiteNegativeReportRows([row])
      if (portal !== 'agent') return [row]
      const accounts = ROLE_ACCOUNTS[role] || []
      return accounts.includes(row.agentAccount) ? [row] : []
    })
    return scopedRows.map((row) => ({ ...row, ...(rowUpdates[row.id] || {}) }))
  }, [data, portal, role, rowUpdates, isCommissionReport])
  const sourceColumns = isCommissionReport ? COMMISSION_REPORT_COLUMNS : SETTLEMENT_COLUMN_DEFS
  const availableColumns = portal === 'agent' ? sourceColumns.filter((column) => !AGENT_HIDDEN_KEYS.has(column.key)) : sourceColumns
  const availableKeys = availableColumns.map((column) => column.key)
  const [filters, setFilters] = useState(FILTER_DEFAULTS)
  const [visibleKeys, setVisibleKeys] = useState(() => availableKeys)
  const [expandedTeamIds, setExpandedTeamIds] = useState([])
  useEffect(() => setVisibleKeys((current) => {
    const allowed = current.filter((key) => availableKeys.includes(key))
    return allowed.length ? allowed : availableKeys
  }), [portal, variant])
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const rootRows = allRows.filter((row) => (!filters.cycle || row.cycle === filters.cycle)
    && (!isCommissionReport || !filters.dateFrom || row.periodEnd >= filters.dateFrom)
    && (!isCommissionReport || !filters.dateTo || row.periodStart <= filters.dateTo)
    && (!filters.agentIdentity || row.agentIdentity === filters.agentIdentity)
    && (isCommissionReport || !filters.commissionState || row.commissionState === filters.commissionState)
    && (isCommissionReport || !filters.auditState || row.auditState === filters.auditState)
    && (!filters.keyword || rowSearchText(row).includes(filters.keyword.toLowerCase())))
  const rows = rootRows.flatMap((row) => {
    if (!row.expandable || !expandedTeamIds.includes(row.id)) return [row]
    return [row, ...row.memberRows.map((member, memberIndex) => ({ ...member, index: `${row.index}.${memberIndex + 1}` }))]
  })
  const toggleTeam = (row) => setExpandedTeamIds((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])
  const patchRow = (row, patch) => setRowUpdates((current) => ({ ...current, [row.id]: { ...(current[row.id] || {}), ...patch } }))
  const isFinal = (row) => ['已确认', '已转结余'].includes(row.commissionState)
  const confirmRow = (row) => { patchRow(row, { commissionState: '已确认', auditState: '已审核', adjustmentReason: row.adjustmentReason === '—' ? '已确认发放' : row.adjustmentReason }); onToast?.(`${row.agentAccount} 已确认发放`) }
  const noPayRow = (row) => {
    const amount = Number(row.settlementCommission || 0)
    patchRow(row, { settlementCommission: 0, commissionAdjustment: Number(row.commissionAdjustment || 0) - amount, commissionState: '已转结余', auditState: '已审核', carryBalance: Number(row.carryBalance || 0) + amount, adjustmentReason: '本月不发放，佣金转入下期结余' })
    onToast?.(`${row.agentAccount} 本月佣金已转入下期结余`)
  }
  const openAdjust = (row) => { setAdjusting(row); setAdjustForm({ reduction: 0, remark: row.adjustmentReason === '—' ? '' : row.adjustmentReason }) }
  const saveAdjust = () => {
    const reduction = Number(adjustForm.reduction || 0)
    const currentAmount = Number(adjusting.settlementCommission || 0)
    if (reduction < 0 || reduction > currentAmount) return onToast?.('减少余额只能在 0 到当前可发放金额之间')
    const remaining = currentAmount - reduction
    patchRow(adjusting, { settlementCommission: remaining, commissionAdjustment: Number(adjusting.commissionAdjustment || 0) - reduction, carryBalance: Number(adjusting.carryBalance || 0) + reduction, adjustmentReason: adjustForm.remark || '减少本次发放佣金' })
    setAdjusting(null)
    onToast?.(`本次发放减少 ${reduction.toFixed(2)}，剩余 ${remaining.toFixed(2)}`)
  }
  const expandColumn = {
    key: 'expand',
    label: '',
    className: 'negative-expand-column',
    cellClassName: 'negative-expand-cell',
    render: (_, row) => row.expandable ? <button
      type="button"
      className="negative-expand-button"
      aria-label={`${expandedTeamIds.includes(row.id) ? '收起' : '展开'} ${row.agentAccount} ${row.expansionLabel || '团队成员'}`}
      title={`${expandedTeamIds.includes(row.id) ? '收起' : '展开'}${row.expansionLabel || '团队成员'}`}
      onClick={() => toggleTeam(row)}
    >{expandedTeamIds.includes(row.id) ? <MinusOutlined /> : <PlusOutlined />}</button> : null,
  }
  const actionColumn = {
    key: 'action',
    label: isCommissionReport ? '操作' : <HeaderTipLabel column={{ key: 'action', label: '操作' }} onOpen={setFieldTip} />,
    className: 'negative-operation-column',
    cellClassName: 'negative-operation-cell',
    render: (_, row) => {
      if (row.rowType === 'member') return <span className="negative-total-muted">随团队结算</span>
      const disabled = portal === 'agent' || isFinal(row)
      return <div className="settlement-row-actions"><button className="settlement-action-btn" disabled={disabled} onClick={() => confirmRow(row)}>确认</button><button className="settlement-link-btn settlement-link-danger" disabled={disabled} onClick={() => noPayRow(row)}>不发放</button><button className="settlement-link-btn" disabled={disabled} onClick={() => openAdjust(row)}>修改发放</button></div>
    },
  }
  const columns = [expandColumn, ...availableColumns
    .filter((column) => visibleKeys.includes(column.key))
    .map((column) => ({
      ...column,
      label: isCommissionReport ? column.label : <HeaderTipLabel column={column} onOpen={setFieldTip} />,
      render: (value, row) => {
        if (column.key === 'operatingExpense') return <button type="button" className="negative-cost-detail-button" onClick={() => setOperatingDetail(row)}><Money value={value} /></button>
        if (MONEY_KEYS.includes(column.key)) return <Money value={value} signed={SIGNED_MONEY_KEYS.has(column.key)} />
        if (['rate', 'operatingShareRate'].includes(column.key)) return <Percent value={value} />
        if (column.key === 'commissionState') return <StatusTag>{value}</StatusTag>
        if (column.key === 'auditState') return <StatusTag>{value}</StatusTag>
        if (column.key === 'agentAccount') return <span className="negative-agent-account-wrap"><b className={`ta-primary-text ${row.rowType === 'member' ? 'negative-member-account' : ''}`}>{value}</b>{row.isRecommended && <span className={`negative-recommendation-tag is-${row.rowType === 'recommended-team' ? 'team' : 'single'}`}>{row.recommendationLabel}</span>}</span>
        return value
      },
    })), ...(isCommissionReport ? [] : [actionColumn])]
  const tableMinWidth = Math.max(1480, columns.length * 118)
  const resetFilters = () => {
    setFilters(FILTER_DEFAULTS)
    setVisibleKeys(availableKeys)
    setExpandedTeamIds([])
  }

  const pageTitle = isCommissionReport ? '负盈利代理佣金报表' : '负盈利代理佣金结算'
  const scopeDescription = portal !== 'agent'
    ? '默认展示团队主记录和单线代理；点击团队行前的“+”可逐行查看团队负责人及其副线。'
    : role === 'main'
      ? '展示本人团队汇总；点击“+”同步查看团队负责人、全部副线及本人推荐的团队和单线数据。'
      : role === 'secondary'
        ? '仅展示当前副线本人线路；点击“+”同步查看本人推荐的团队和单线数据。'
        : '仅展示当前单线代理本人记录；点击“+”同步查看本人推荐的团队和单线数据。'
  return <section className="ta-stack negative-profit-report-screen">
    <SectionHeader title={pageTitle} description={isCommissionReport ? '按跨日期统计区间查看负盈利代理人数、收支、成本、结余和佣金结果，不包含发放、审核、维护及操作字段。' : portal === 'master' ? '按佣金周期汇总负盈利模式代理账单，集中核对总输赢、上周期结余、运营成本、佣金净收益和发放处理。' : portal === 'site' ? '同步总控最新负盈利结算口径，仅核对旺财体育本站的盈亏、运营成本、佣金净收益和发放结果。' : '同步总控最新负盈利结算口径，仅查看当前演示身份本人可见的盈亏、运营成本和佣金结果。'} actions={<Toolbar><Button icon={<DownloadOutlined />} variant="slate" onClick={() => onToast(`${pageTitle}已导出 ${rows.length} 条`)}>导出</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast(`${pageTitle}文件已下载`)}>下载文件</Button></Toolbar>} />
    {portal !== 'master' && <Alert title="角色查看范围" tone="warning">{portal === 'site' ? '数据固定为旺财体育本站，不展示其他站点记录。' : '团队负责人查看本人团队及全部副线，副线和单线代理只看本人；三种身份展开本人记录后均可查看本人推荐的团队与单线数据。推荐团队仅展示汇总且不能再次展开，推荐数据使用专属颜色并不重复计入本人主记录总计。代理端不提供结算操作。'}</Alert>}
    <FilterBar onSearch={() => onToast(`已查询 ${rows.length} 条负盈利代理记录`)} onReset={resetFilters}>
      <Field label="佣金周期"><Select value={filters.cycle} onChange={(value) => setFilter('cycle', value)} placeholder="全部周期" options={unique(allRows, 'cycle')} /></Field>
      {isCommissionReport && <Field label="统计开始日期"><Input type="date" value={filters.dateFrom} onChange={(value) => setFilter('dateFrom', value)} /></Field>}
      {isCommissionReport && <Field label="统计结束日期"><Input type="date" value={filters.dateTo} onChange={(value) => setFilter('dateTo', value)} /></Field>}
      <Field label="代理身份"><Select value={filters.agentIdentity} onChange={(value) => setFilter('agentIdentity', value)} placeholder="全部身份" options={unique(allRows, 'agentIdentity')} /></Field>
      {!isCommissionReport && <Field label="佣金状态"><Select value={filters.commissionState} onChange={(value) => setFilter('commissionState', value)} placeholder="全部状态" options={unique(allRows, 'commissionState')} /></Field>}
      {!isCommissionReport && portal !== 'agent' && <Field label="审核状态"><Select value={filters.auditState} onChange={(value) => setFilter('auditState', value)} placeholder="全部状态" options={unique(allRows, 'auditState')} /></Field>}
      <Field label="字段筛选"><FieldColumnFilter columns={availableColumns} visibleKeys={visibleKeys} onChange={setVisibleKeys} /></Field>
      <Field label="代理/团队"><Input value={filters.keyword} onChange={(value) => setFilter('keyword', value)} placeholder="代理账号、编号、团队或上级" /></Field>
    </FilterBar>
    <Panel title={isCommissionReport ? '负盈利代理佣金报表明细' : '负盈利待结算区域'} description={scopeDescription}>
      <DataTable className="negative-profit-report-table" minWidth={tableMinWidth} columns={columns} rows={rows} rowClassName={(row) => row.rowType === 'member' ? 'negative-profit-member-row' : row.rowType === 'recommended-team' ? 'negative-profit-recommended-row negative-profit-recommended-team-row' : row.rowType === 'recommended-single' ? 'negative-profit-recommended-row negative-profit-recommended-single-row' : ''} paginated footer={<NegativeReportTotalRow columns={columns} rows={rootRows} />} />
    </Panel>
    <FormulaPanel title={`${pageTitle}口径`} items={[
      ...(isCommissionReport ? [
        { label: '净输赢', formula: '总输赢 - 场馆费 - 红利 - 返水 + 账户调整 - 存款手续费 - 提款手续费 + 补单输赢' },
        { label: '冲正后净输赢', formula: '净输赢 + 上周期结余' },
        { label: '本期欠款', formula: 'MAX(0，-净输赢)' },
        { label: '总欠款', formula: 'MAX(0，-冲正后净输赢)' },
        { label: '佣金', formula: 'MAX(0，冲正后净输赢 × 佣金比例)' },
      ] : [
        { label: '运营费用', formula: '活动奖励 + 会员推会员 + 返水 + 礼金 + 人工发彩金 + 余额宝利息' },
        { label: '佣金净收益', formula: '（总输赢 + 上周期结余总输赢）× 返佣比例 −（运营费用 + 三方场馆费用 + 充提手续费 + 上周期结余运营费用）× 运营分摊比例' },
        { label: '佣金', formula: '佣金净收益 + 上周期结余佣金 + 佣金调整' },
      ]),
    ]} warning={isCommissionReport ? '统计日期筛选按区间重叠口径匹配记录；本页仅用于查询与导出，不提供结算操作。' : '结算页展示负盈利模式代理账单，并按最新盈亏、成本分摊和佣金公式核对；刷新演示数据后恢复初始模拟数据。'} />
    {!isCommissionReport && <Modal open={!!operatingDetail} title="运营费用明细" description={operatingDetail ? `${operatingDetail.agentAccount} · ${operatingDetail.cycle} · 点击字段金额查看` : ''} onClose={() => setOperatingDetail(null)} onConfirm={() => setOperatingDetail(null)} confirmText="知道了" showCancel={false} width={640}>
      {operatingDetail && <DataTable minWidth={520} columns={[{ key: 'name', label: '费用项目' }, { key: 'amount', label: '费用额度', render: (value) => <Money value={value} /> }]} rows={[
        { id: 'activityRewards', name: '活动奖励', amount: operatingDetail.operatingExpenseBreakdown.activityRewards },
        { id: 'memberReferralReward', name: '会员推会员', amount: operatingDetail.operatingExpenseBreakdown.memberReferralReward },
        { id: 'memberRebate', name: '返水', amount: operatingDetail.operatingExpenseBreakdown.memberRebate },
        { id: 'giftAmount', name: '礼金', amount: operatingDetail.operatingExpenseBreakdown.giftAmount },
        { id: 'manualBonus', name: '人工发彩金', amount: operatingDetail.operatingExpenseBreakdown.manualBonus },
        { id: 'yuebaoInterest', name: '余额宝利息', amount: operatingDetail.operatingExpenseBreakdown.yuebaoInterest },
        { id: 'total', name: '运营费用合计', amount: operatingDetail.operatingExpense },
      ]} />}
    </Modal>}
    {!isCommissionReport && <Modal open={!!fieldTip} title={fieldTip ? `${fieldTip.label} TIPS` : '字段 TIPS'} description="字段口径说明" onClose={() => setFieldTip(null)} onConfirm={() => setFieldTip(null)} confirmText="知道了" showCancel={false} width={520}>
      <Alert title={fieldTip?.label || '字段说明'}>{fieldTip?.text}</Alert>
    </Modal>}
    {!isCommissionReport && <Modal open={!!adjusting} title="修改发放佣金" description="只能减少本次发放金额，并补充调整备注。" onClose={() => setAdjusting(null)} onConfirm={saveAdjust} confirmText="保存修改">
      {adjusting && <FormGrid><Field label="代理名称"><Input value={adjusting.agentAccount} disabled /></Field><Field label="当前可发放"><Input value={Number(adjusting.settlementCommission || 0).toFixed(2)} disabled /></Field><Field label="减少余额"><Input type="number" min="0" max={adjusting.settlementCommission} value={adjustForm.reduction} onChange={(value) => setAdjustForm({ ...adjustForm, reduction: value })} /></Field><Field label="减少后剩余"><Input value={Math.max(0, Number(adjusting.settlementCommission || 0) - Number(adjustForm.reduction || 0)).toFixed(2)} disabled /></Field><Field label="备注说明" className="ta-field-full"><textarea className="ta-input agent-remark" value={adjustForm.remark} onChange={(event) => setAdjustForm({ ...adjustForm, remark: event.target.value })} placeholder="请输入调整原因" /></Field></FormGrid>}
    </Modal>}
  </section>
}
