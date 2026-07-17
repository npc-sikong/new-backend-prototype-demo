const MEMBER_PREFIXES = ['星河', '云舟', '青橙', '锦程', '明月', '北辰', '海棠', '松风']

function findAgent(data, account) {
  return data.agents.find((agent) => agent.account === account)
}

function identityLabel(identity) {
  if (identity === '主线') return '团队负责人'
  if (identity === '副线') return '副线'
  return identity || '副线'
}

function memberCountForLine(line, data) {
  const agent = findAgent(data, line.agent)
  return Number(agent?.members ?? line.activeMembers ?? 0)
}

function agentRowFromLine(line, data) {
  const agent = findAgent(data, line.agent)
  return {
    id: `${line.lineId}-${line.agent}`,
    agentName: line.agent,
    agentIdentity: identityLabel(line.identity),
    agentId: agent?.id || line.lineId,
    downlineMembers: memberCountForLine(line, data),
  }
}

function sumLineMetric(team, key) {
  return team.lines.reduce((sum, line) => sum + Number(line[key] || 0), 0)
}

function findTeamPlan(team, data) {
  return data.plans.find((plan) => plan.type === '团队佣金方案' && plan.name === team.plan) || data.plans.find((plan) => plan.type === '团队佣金方案')
}

export function teamAgentRows(team, data) {
  return team.lines.map((line) => agentRowFromLine(line, data))
}

export function teamMemberCount(team, data) {
  return team.lines.reduce((sum, line) => sum + memberCountForLine(line, data), 0)
}

export function teamOverviewCounts(team, data) {
  return {
    agentTotal: teamAgentRows(team, data).length,
    memberTotal: teamMemberCount(team, data),
    activeMembers: Number(team.metrics?.activeMembers || 0),
    secondaryTotal: teamSecondaryRows(team, data).length,
    singleTotal: teamSingleRows(team, data).length,
  }
}

export function teamGradeProgress(team, data) {
  const metrics = team.metrics || {}
  const plan = findTeamPlan(team, data)
  const levels = plan?.levels || []
  const currentIndex = levels.findIndex((level) => level.grade === metrics.grade)
  const next = levels.find((_, index) => index > currentIndex) || (currentIndex < 0 ? levels[0] : null)
  const current = {
    newActive: Number(metrics.newActive || 0),
    firstDepositMembers: sumLineMetric(team, 'firstDepositCount'),
    firstDepositAmount: sumLineMetric(team, 'firstDepositAmount'),
    activeMembers: Number(metrics.activeMembers || 0),
    netWinLoss: Number(metrics.correctedNet ?? metrics.assessmentNet ?? metrics.currentNet ?? 0),
  }
  if (!next) return { planName: plan?.name || team.plan, currentGrade: metrics.grade, nextGrade: null, completed: true, conditions: [] }
  const specs = [
    ['新增活跃', 'newActive', '人', 'number'],
    ['新增首存', 'firstDepositMembers', '人', 'number'],
    ['首存额度', 'firstDepositAmount', '元', 'money'],
    ['活跃会员', 'activeMembers', '人', 'number'],
    ['团队当前余额', 'netWinLoss', '元', 'money'],
  ]
  return {
    planName: plan?.name || team.plan,
    currentGrade: metrics.grade,
    nextGrade: next.grade,
    completed: false,
    conditions: specs.map(([label, key, unit, type]) => ({
      label,
      unit,
      type,
      current: current[key],
      target: Number(next[key] || 0),
      missing: Math.max(0, Number(next[key] || 0) - current[key]),
    })),
  }
}

export function formatGradeConditionValue(condition, value) {
  const amount = Number(value || 0)
  if (condition.type === 'money') return `¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  return `${amount.toLocaleString('zh-CN')}${condition.unit || ''}`
}

export function teamMemberRows(team, data) {
  return team.lines.flatMap((line) => {
    const agent = findAgent(data, line.agent)
    const total = memberCountForLine(line, data)
    return Array.from({ length: total }, (_, index) => {
      const prefix = MEMBER_PREFIXES[index % MEMBER_PREFIXES.length]
      return {
        id: `MEM-${agent?.id || line.lineId}-${index + 1}`,
        memberName: `${prefix}${line.agent}${String(index + 1).padStart(3, '0')}`,
        upperAgent: `${line.agent}（${agent?.id || line.lineId}）`,
      }
    })
  })
}

export function lineDirectMemberRows(line, data, metric = 'activeMembers') {
  const agent = findAgent(data, line?.agent)
  const total = Math.max(0, Number(line?.[metric] ?? line?.activeMembers ?? 0))
  return Array.from({ length: total }, (_, index) => {
    const prefix = MEMBER_PREFIXES[index % MEMBER_PREFIXES.length]
    return { id: `${metric}-${agent?.id || line.lineId}-${index + 1}`, memberName: `${prefix}${line.agent}${String(index + 1).padStart(3, '0')}`, upperAgent: `${line.agent}（${agent?.id || line.lineId}）`, memberType: metric === 'newActive' ? '新增活跃直属会员' : '活跃直属会员', validBet: Math.round((index + 1) * 1800 + total * 120), depositAmount: Math.round((index % 4 + 1) * 500) }
  })
}

export function teamSecondaryRows(team, data) {
  return team.lines.filter((line) => line.identity === '副线').map((line) => agentRowFromLine(line, data))
}

export function teamSingleRows(team, data) {
  const teamAgents = new Set(team.lines.map((line) => line.agent))
  return data.singles
    .filter((single) => teamAgents.has(single.owner) || data.requests.some((request) => request.applicant === single.owner && request.targetUnit.includes(team.name)))
    .map((single) => {
      const agent = findAgent(data, single.owner)
      return {
        id: single.id,
        agentName: single.owner,
        agentId: agent?.id || single.code,
        downlineMembers: Number(agent?.members ?? single.metrics?.activeMembers ?? 0),
      }
    })
}

export function getTeamInspectConfig(typeOrInspect, team, data) {
  if (!team) return { title: '明细', description: '', columns: [], rows: [] }
  const inspect = typeof typeOrInspect === 'string' ? { type: typeOrInspect } : typeOrInspect || {}
  const type = inspect.type
  if (type === 'lineMembers') {
    const line = team.lines.find((item) => item.lineId === inspect.lineId) || team.lines[0]
    const metric = inspect.metric || 'activeMembers'
    const metricLabel = metric === 'newActive' ? '新增活跃' : '活跃会员'
    return { title: `${line?.agent || team.name} · ${metricLabel}直属会员`, description: '仅展示该代理本人直属会员，不展示其他副线或团队汇总会员。', columns: [{ key: 'memberName', label: '会员名称' }, { key: 'upperAgent', label: '直属代理' }, { key: 'memberType', label: '会员口径' }, { key: 'depositAmount', label: '充值金额' }, { key: 'validBet', label: '有效投注' }], rows: line ? lineDirectMemberRows(line, data, metric) : [] }
  }
  const configs = {
    teamAgents: {
      title: `${team.name} · 团队成员明细`,
      description: '查看团队内代理名称、代理身份和代理ID。',
      columns: [{ key: 'agentName', label: '代理名称' }, { key: 'agentIdentity', label: '代理身份' }, { key: 'agentId', label: '代理ID' }],
      rows: teamAgentRows(team, data),
    },
    members: {
      title: `${team.name} · 会员人数明细`,
      description: '查看会员名称以及该会员的上级代理。',
      columns: [{ key: 'memberName', label: '会员名称' }, { key: 'upperAgent', label: '上级代理' }],
      rows: teamMemberRows(team, data),
    },
    secondary: {
      title: `${team.name} · 团队副线明细`,
      description: '查看团队副线代理名称、代理ID和下级会员数。',
      columns: [{ key: 'agentName', label: '代理名称' }, { key: 'agentId', label: '代理ID' }, { key: 'downlineMembers', label: '下级会员数' }],
      rows: teamSecondaryRows(team, data),
    },
    single: {
      title: `${team.name} · 单线明细`,
      description: '查看团队相关单线代理名称、代理ID和下级会员数。',
      columns: [{ key: 'agentName', label: '代理名称' }, { key: 'agentId', label: '代理ID' }, { key: 'downlineMembers', label: '下级会员数' }],
      rows: teamSingleRows(team, data),
    },
  }
  return configs[type] || configs.teamAgents
}

function safeNumber(value) {
  return Number.isFinite(Number(value)) ? Number(value) : 0
}

function lineOperationFee(line, totalWinLoss) {
  if (line.operationFee !== undefined) return safeNumber(line.operationFee)
  return Math.round(Math.abs(totalWinLoss) * 0.08)
}

export function buildTeamCommissionRows(team, overrides = {}, issuedMap = {}) {
  if (!team) return []
  const baseRows = team.lines.map((line) => {
    const totalWinLoss = safeNumber(line.totalWinLoss ?? line.netWinLoss)
    const operationFee = lineOperationFee(line, totalWinLoss)
    const netRevenue = safeNumber(line.netRevenue ?? totalWinLoss - operationFee)
    const historicalDebt = safeNumber(line.historicalDebt ?? (line.identity === '主线' ? Math.max(0, -safeNumber(team.metrics?.lastBalance)) : 0))
    const agentBalance = safeNumber(line.agentBalance ?? netRevenue - historicalDebt)
    return { ...line, totalWinLoss, operationFee, netRevenue, historicalDebt, agentBalance }
  })
  const positiveRevenue = baseRows.reduce((sum, row) => sum + Math.max(0, row.netRevenue), 0) || 1
  return baseRows.map((row) => {
    const contributionRate = Math.max(0, row.netRevenue) / positiveRevenue
    const defaultDividend = Math.max(0, Math.round(safeNumber(team.metrics?.payable) * contributionRate))
    return {
      ...row,
      contributionRate,
      estimatedDividend: safeNumber(overrides[row.lineId] ?? row.estimatedDividend ?? defaultDividend),
      payoutState: issuedMap[row.lineId] ? '已发放' : '待发放',
      payoutAt: issuedMap[row.lineId]?.operatedAt || '—',
    }
  })
}

export function buildTeamSettlementHistoryRows(team, currentRows, issuedRows = []) {
  const historicalRows = currentRows.map((row, index) => {
    const totalWinLoss = Math.round(row.totalWinLoss * (0.62 + index * 0.08))
    const operationFee = Math.round(row.operationFee * (0.7 + index * 0.05))
    const netRevenue = totalWinLoss - operationFee
    const historicalDebt = index === 0 ? Math.max(0, Math.round(row.historicalDebt * 0.6)) : 0
    const agentBalance = netRevenue - historicalDebt
    return {
      id: `HIS-${team.id}-${row.lineId}`,
      cycle: '2026-06',
      lineId: row.lineId,
      agent: row.agent,
      identity: row.identity,
      totalWinLoss,
      operationFee,
      netRevenue,
      historicalDebt,
      agentBalance,
      contributionRate: row.contributionRate,
      estimatedDividend: Math.max(0, Math.round(row.estimatedDividend * 0.72)),
      state: '已发放',
      operatedAt: `2026-07-0${index + 2} 10:00`,
    }
  })
  return [...issuedRows, ...historicalRows]
}
