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
const MONEY_KEYS = ['depositAmount', 'withdrawalAmount', 'totalWinLoss', 'venueFee', 'memberBonus', 'activityRewards', 'memberReferralReward', 'memberRebate', 'accountAdjustment', 'depositFee', 'withdrawalFee', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet', 'commissionAdjustment', 'commission']

const COLUMN_DEFS = [
  { key: 'agentAccount', label: '代理名称', className: 'negative-agent-name-column', cellClassName: 'negative-agent-name-cell' },
  { key: 'index', label: '序号' },
  { key: 'cycle', label: '佣金周期' },
  { key: 'teamName', label: '团队名称' },
  { key: 'agentId', label: '代理编号' },
  { key: 'agentIdentity', label: '代理身份' },
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

const ALL_KEYS = COLUMN_DEFS.map((column) => column.key)
const AGENT_HIDDEN_KEYS = new Set(['reviewer', 'reviewedAt', 'maintainer', 'adjustmentReason'])
const COMMISSION_REPORT_EXCLUDED_KEYS = new Set(['commissionAdjustment', 'commissionState', 'issuedBy', 'issuedAt', 'reviewer', 'reviewedAt', 'auditState', 'maintainer', 'adjustmentReason'])
const STATISTIC_TIME_COLUMN = { key: 'statisticTime', label: '统计时间' }
const ROLE_ACCOUNTS = { main: ['gaodashang'], secondary: ['WC002'], independent: ['dailiwc001'] }
const COUNT_KEYS = ['teamMembers', 'subAgentCount', 'registeredCount', 'firstDepositCount', 'activeCount', 'newActiveCount']
const COUNT_KEY_SET = new Set(COUNT_KEYS)
const SIGNED_MONEY_KEYS = new Set(['totalWinLoss', 'accountAdjustment', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet', 'commissionAdjustment'])

const unique = (rows, key) => Array.from(new Set(rows.map((row) => row[key]).filter(Boolean)))
const formatDate = (value) => String(value || '—').slice(0, 16)
const sumRows = (rows, key) => rows.reduce((sum, row) => sum + Number(row[key] || 0), 0)
const rebateLevelOf = (bill, agent) => bill.rebateLevel || (bill.type === '团队佣金' ? `团队返佣${bill.teamLevel || agent.level || 1}级` : bill.type === '单线代理佣金' ? '单线返佣1级' : `${agent.level || 1}级`)
const statisticRangeOf = (bill) => { const [year, month] = String(bill.cycle || '2026-07').split('-').map(Number); const start = bill.periodStart || `${year}-${String(month).padStart(2, '0')}-01`; const end = bill.periodEnd || `${year}-${String(month).padStart(2, '0')}-${String(new Date(year, month, 0).getDate()).padStart(2, '0')}`; return { periodStart: start, periodEnd: end, statisticTime: `${start} 至 ${end}` } }

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
    accountAdjustment: distributeTotal(bill.accountAdjustment ?? 0, performanceWeights),
    depositFee: distributeTotal(bill.depositFee ?? 0, performanceWeights),
    withdrawalFee: distributeTotal(bill.withdrawalFee ?? 0, performanceWeights),
    manualOrderWinLoss: distributeTotal(bill.manualOrderWinLoss ?? 0, performanceWeights),
    netWinLossRaw: distributeTotal(bill.netWinLossRaw ?? 0, performanceWeights),
    lastBalance: distributeTotal(bill.lastBalance ?? 0, performanceWeights),
    correctedNet: distributeTotal(bill.correctedNet ?? 0, performanceWeights),
    commissionAdjustment: distributeTotal(bill.commissionAdjustment ?? 0, performanceWeights),
    commission: distributeTotal(bill.payable ?? 0, performanceWeights),
  }
  return members.map(({ line, agent, isTeamLeader }, memberIndex) => {
    const valueOf = (key) => allocations[key][memberIndex]
    return {
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
        agentIdentity: teamAgentIdentity,
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
  })
}

function buildRows(data) {
  return data.bills
    .filter((bill) => ['团队佣金', '单线代理佣金'].includes(bill.type))
    .map((bill) => {
      const agent = data.agents.find((item) => item.account === bill.payee) || {}
      const team = data.teams.find((item) => item.id === bill.unitId || item.name === bill.unitName)
      const isNegativeMode = agent.model === '负盈利模式' || Number(bill.correctedNet || 0) < 0
      if (!isNegativeMode) return null
      const memberRows = buildTeamMemberRows(data, bill, team)
      const statisticRange = statisticRangeOf(bill)
      return {
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
        agentIdentity: agent.teamAgentType === '官方代理' || bill.agentType === '官方代理' ? '官方代理' : '普通代理',
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
    })
    .filter(Boolean)
    .map((row, index) => ({ ...row, index: index + 1 }))
}

export const NEGATIVE_REPORT_COLUMNS = COLUMN_DEFS
export const NEGATIVE_REPORT_COMMISSION_EXCLUDED_KEYS = COMMISSION_REPORT_EXCLUDED_KEYS
export const buildNegativeReportRows = buildRows

export function scopeNegativeReportRows(rows, role) {
  const accounts = ROLE_ACCOUNTS[role] || []
  if (role === 'secondary') {
    return rows.flatMap((row) => {
      const memberRows = row.memberRows.filter((member) => accounts.includes(member.agentAccount))
      return memberRows.length ? [{ ...row, memberRows, expandable: true }] : []
    })
  }
  return rows.filter((row) => accounts.includes(row.agentAccount))
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
  const allRows = useMemo(() => {
    const sourceRows = buildRows(data)
    if (portal === 'agent' && isCommissionReport) {
      return scopeNegativeReportRows(sourceRows, role).map((row) => ({ ...row, ...(rowUpdates[row.id] || {}) }))
    }
    const scopedRows = sourceRows.flatMap((row) => {
      if (portal === 'site') return row.site === '旺财体育' ? [row] : []
      if (portal !== 'agent') return [row]
      const accounts = ROLE_ACCOUNTS[role] || []
      return accounts.includes(row.agentAccount) ? [row] : []
    })
    return scopedRows.map((row) => ({ ...row, ...(rowUpdates[row.id] || {}) }))
  }, [data, portal, role, rowUpdates, isCommissionReport])
  const reportColumns = COLUMN_DEFS.flatMap((column) => column.key === 'cycle' ? [column, STATISTIC_TIME_COLUMN] : [column]).filter((column) => !COMMISSION_REPORT_EXCLUDED_KEYS.has(column.key))
  const sourceColumns = isCommissionReport ? reportColumns : COLUMN_DEFS
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
    && (!filters.keyword || `${row.teamName}${row.agentId}${row.agentAccount}${row.parentAccount}`.toLowerCase().includes(filters.keyword.toLowerCase())))
  const rows = rootRows.flatMap((row) => {
    if (!row.expandable || !expandedTeamIds.includes(row.id)) return [row]
    return [row, ...row.memberRows.map((member, memberIndex) => ({ ...member, index: `${row.index}.${memberIndex + 1}` }))]
  })
  const toggleTeam = (row) => setExpandedTeamIds((current) => current.includes(row.id) ? current.filter((id) => id !== row.id) : [...current, row.id])
  const patchRow = (row, patch) => setRowUpdates((current) => ({ ...current, [row.id]: { ...(current[row.id] || {}), ...patch } }))
  const isFinal = (row) => ['已确认', '已转结余'].includes(row.commissionState)
  const confirmRow = (row) => { patchRow(row, { commissionState: '已确认', auditState: '已审核', adjustmentReason: row.adjustmentReason === '—' ? '已确认发放' : row.adjustmentReason }); onToast?.(`${row.agentAccount} 已确认发放`) }
  const noPayRow = (row) => {
    const amount = Number(row.commission || 0)
    patchRow(row, { commission: 0, commissionState: '已转结余', auditState: '已审核', carryBalance: Number(row.carryBalance || 0) + amount, adjustmentReason: '本月不发放，佣金转入下期结余' })
    onToast?.(`${row.agentAccount} 本月佣金已转入下期结余`)
  }
  const openAdjust = (row) => { setAdjusting(row); setAdjustForm({ reduction: 0, remark: row.adjustmentReason === '—' ? '' : row.adjustmentReason }) }
  const saveAdjust = () => {
    const reduction = Number(adjustForm.reduction || 0)
    const currentAmount = Number(adjusting.commission || 0)
    if (reduction < 0 || reduction > currentAmount) return onToast?.('减少余额只能在 0 到当前可发放金额之间')
    const remaining = currentAmount - reduction
    patchRow(adjusting, { commission: remaining, commissionAdjustment: Number(adjusting.commissionAdjustment || 0) - reduction, carryBalance: Number(adjusting.carryBalance || 0) + reduction, adjustmentReason: adjustForm.remark || '减少本次发放佣金' })
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
      aria-label={`${expandedTeamIds.includes(row.id) ? '收起' : '展开'} ${row.teamName} 团队成员`}
      title={`${expandedTeamIds.includes(row.id) ? '收起' : '展开'}团队成员`}
      onClick={() => toggleTeam(row)}
    >{expandedTeamIds.includes(row.id) ? <MinusOutlined /> : <PlusOutlined />}</button> : null,
  }
  const actionColumn = {
    key: 'action',
    label: '操作',
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
      render: (value, row) => {
        if (MONEY_KEYS.includes(column.key)) return <Money value={value} signed={['totalWinLoss', 'accountAdjustment', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet', 'commissionAdjustment'].includes(column.key)} />
        if (column.key === 'rate') return <Percent value={value} />
        if (column.key === 'commissionState') return <StatusTag>{value}</StatusTag>
        if (column.key === 'auditState') return <StatusTag>{value}</StatusTag>
        if (column.key === 'agentAccount') return <b className={`ta-primary-text ${row.rowType === 'member' ? 'negative-member-account' : ''}`}>{value}</b>
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
      ? '展示授权团队汇总；点击“+”可查看团队负责人和全部副线明细。'
      : role === 'secondary'
        ? '展示所属团队汇总；点击“+”仅查看当前副线本人明细，不展示其他副线。'
        : '仅展示当前单线代理本人记录。'
  return <section className="ta-stack negative-profit-report-screen">
    <SectionHeader title={pageTitle} description={isCommissionReport ? '按跨日期统计区间查看负盈利代理人数、收支、成本、结余和佣金结果，不包含发放、审核、维护及操作字段。' : portal === 'master' ? '按佣金周期汇总负盈利模式代理及负向结余账单，集中核对人数、收支、成本、结余、佣金和发放处理。' : portal === 'site' ? '同步总控负盈利代理佣金结算口径，仅查看旺财体育本站的代理及负向结余账单。' : '同步总控负盈利代理佣金结算口径，仅查看当前演示身份本人可见的负向结余账单。'} actions={<Toolbar><Button icon={<DownloadOutlined />} variant="slate" onClick={() => onToast(`${pageTitle}已导出 ${rows.length} 条`)}>导出</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast(`${pageTitle}文件已下载`)}>下载文件</Button></Toolbar>} />
    {portal !== 'master' && <Alert title="角色查看范围" tone="warning">{portal === 'site' ? '数据固定为旺财体育本站，不展示其他站点记录。' : '团队负责人查看授权团队汇总及全部成员明细；副线查看所属团队汇总并且只能展开本人线路；单线代理只查看本人记录。代理端不展示发放、审核、维护及结算操作。'}</Alert>}
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
      <DataTable className="negative-profit-report-table" minWidth={tableMinWidth} columns={columns} rows={rows} rowClassName={(row) => row.rowType === 'member' ? 'negative-profit-member-row' : ''} paginated footer={<NegativeReportTotalRow columns={columns} rows={rootRows} />} />
    </Panel>
    <FormulaPanel title={`${pageTitle}口径`} items={[
      { label: '净输赢', formula: '总输赢 - 场馆费 - 红利 - 返水 + 账户调整 - 存款手续费 - 提款手续费 + 补单输赢' },
      { label: '冲正后净输赢', formula: '净输赢 + 上周期结余' },
      { label: '佣金', formula: isCommissionReport ? 'MAX(0，冲正后净输赢 × 佣金比例)' : 'MAX(0，冲正后净输赢 × 佣金比例 + 佣金调整)' },
    ]} warning={isCommissionReport ? '统计日期筛选按区间重叠口径匹配记录；本页仅用于查询与导出，不提供结算操作。' : '报表展示负盈利模式代理及冲正后净输赢为负的账单记录；刷新演示数据后恢复初始模拟数据。'} />
    {!isCommissionReport && <Modal open={!!adjusting} title="修改发放佣金" description="只能减少本次发放金额，并补充调整备注。" onClose={() => setAdjusting(null)} onConfirm={saveAdjust} confirmText="保存修改">
      {adjusting && <FormGrid><Field label="代理名称"><Input value={adjusting.agentAccount} disabled /></Field><Field label="当前可发放"><Input value={Number(adjusting.commission || 0).toFixed(2)} disabled /></Field><Field label="减少余额"><Input type="number" min="0" max={adjusting.commission} value={adjustForm.reduction} onChange={(value) => setAdjustForm({ ...adjustForm, reduction: value })} /></Field><Field label="减少后剩余"><Input value={Math.max(0, Number(adjusting.commission || 0) - Number(adjustForm.reduction || 0)).toFixed(2)} disabled /></Field><Field label="备注说明" className="ta-field-full"><textarea className="ta-input agent-remark" value={adjustForm.remark} onChange={(event) => setAdjustForm({ ...adjustForm, remark: event.target.value })} placeholder="请输入调整原因" /></Field></FormGrid>}
    </Modal>}
  </section>
}
