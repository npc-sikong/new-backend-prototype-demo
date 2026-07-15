import { createContext, useContext, useMemo, useState } from 'react'
import { INITIAL_STATE } from './data'

const TeamAgentContext = createContext(null)

function cloneInitialState() {
  return structuredClone(INITIAL_STATE)
}

function timestamp() {
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date()).replaceAll('/', '-').replace(' ', ' ')
}

function sequence(prefix, rows) {
  return `${prefix}-${String(rows.length + 1).padStart(3, '0')}`
}

export function TeamAgentProvider({ children }) {
  const [data, setData] = useState(cloneInitialState)

  const dailyRemaining = Math.max(0, data.siteQuota.dailyQuota - data.siteQuota.successfulToday - data.siteQuota.pendingOccupied)

  function teamAvailableBalance(teamId = 'TEAM-001') {
    const team = data.teams.find((item) => item.id === teamId)
    if (!team) return 0
    return Math.max(0, team.cumulativeReceived - team.successfulTransfers - team.processingOccupied - team.otherDeductions)
  }

  function createTeam(payload) {
    const name = String(payload.name || '').trim()
    const mainAgent = String(payload.mainAgent || '').trim()
    if (!name || !mainAgent) return { ok: false, message: '请填写代理部名称和主管主线' }
    if (data.teams.some((team) => team.name === name)) return { ok: false, message: '代理部名称已存在' }
    if (data.teams.some((team) => team.mainAgent === mainAgent && team.status !== '已解散')) return { ok: false, message: '该代理已担任其他代理部主线' }
    const id = `TEAM-${String(data.teams.length + 1).padStart(3, '0')}`
    const lineId = `LINE-${String.fromCharCode(65 + data.teams.reduce((sum, team) => sum + team.lines.length, 0))}`
    const team = {
      id, code: `DPT-${String(data.teams.length + 1).padStart(3, '0')}`, name, site: payload.site || '旺财体育', currency: 'CNY', mainAgent,
      plan: payload.plan || '旺财团队月结方案', status: '待生效', startCycle: payload.startCycle || '2026-08', endCycle: '长期', previousNegative: 0,
      cumulativeReceived: 0, successfulTransfers: 0, processingOccupied: 0, otherDeductions: 0,
      metrics: { newActive: 0, activeMembers: 0, memberWinLoss: 0, expenses: 0, adjustment: 0, currentNet: 0, assessmentNet: 0, commissionableNet: 0, grade: '待计算', rate: 0, payable: 0 },
      lines: [{ lineId, identity: '主线', agent: mainAgent, scope: '主线直属代理及会员', newActive: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: payload.startCycle || '2026-08' }],
    }
    setData((current) => ({ ...current, teams: [...current.teams, team] }))
    return { ok: true, message: `${name} 已创建，将于 ${team.startCycle} 生效`, id }
  }

  function addSecondary(teamId, payload) {
    const team = data.teams.find((item) => item.id === teamId)
    const agent = String(payload.agent || '').trim()
    if (!team || !agent) return { ok: false, message: '请选择代理部并填写副线负责人' }
    if (team.status === '冻结' || team.status === '待解散') return { ok: false, message: `代理部当前为${team.status}状态，不能新增副线` }
    const occupied = data.teams.some((item) => item.lines.some((line) => line.agent === agent && !['已退出', '已关闭'].includes(line.status))) || data.singles.some((single) => single.owner === agent && single.status !== '已终止')
    if (occupied) return { ok: false, message: '该代理在目标周期已归属其他结算单元' }
    const lineCount = data.teams.reduce((sum, item) => sum + item.lines.length, 0)
    const line = {
      lineId: `LINE-${String.fromCharCode(65 + lineCount)}`, identity: '副线', agent, scope: payload.scope || `${agent} 节点及直属会员`,
      newActive: 0, activeMembers: 0, netWinLoss: 0, status: payload.requireReview === false ? '待生效' : '待复核', startCycle: payload.startCycle || '2026-08',
    }
    const request = {
      id: sequence('REQ-202607', data.requests), type: '开设副线', applicant: team.mainAgent, currentUnit: `${team.name} / ${team.mainAgent}`, targetUnit: `${team.name} / ${line.lineId} / ${agent}`,
      effectiveCycle: line.startCycle, recommender: '—', status: payload.requireReview === false ? '已批准·待生效' : '待站点复核', conflict: '无冲突', createdAt: timestamp(), note: '副线从目标完整周期进入团队统一考核。',
    }
    setData((current) => ({
      ...current,
      teams: current.teams.map((item) => item.id === teamId ? { ...item, lines: [...item.lines, line] } : item),
      requests: [request, ...current.requests],
    }))
    return { ok: true, message: `${agent} 副线已建立，状态：${line.status}` }
  }

  function createSingle(payload) {
    const owner = String(payload.owner || '').trim()
    if (!owner) return { ok: false, message: '请填写独立线主' }
    const occupied = data.singles.some((single) => single.owner === owner && single.status !== '已终止') || data.teams.some((team) => team.lines.some((line) => line.agent === owner && !['已退出', '已关闭'].includes(line.status)))
    if (occupied) return { ok: false, message: '该代理当前已归属团队或独立单线' }
    const index = data.singles.length + 1
    const single = {
      id: `SINGLE-${String(index).padStart(3, '0')}`, code: `SL-${String(index).padStart(3, '0')}`, name: payload.name || `${owner} 独立单线`, owner,
      site: '旺财体育', currency: 'CNY', source: payload.source || '站点直接创建', recommender: payload.recommender || '—', plan: payload.plan || '独立单线月结方案',
      rewardPlan: payload.recommender ? '推荐奖励10%方案' : '未绑定', status: '待生效', startCycle: payload.startCycle || '2026-08', scope: '线主本人代理节点',
      metrics: { newActive: 0, activeMembers: 0, currentNet: 0, previousNegative: 0, assessmentNet: 0, grade: '待计算', rate: 0, payable: 0 },
    }
    setData((current) => ({ ...current, singles: [...current.singles, single] }))
    return { ok: true, message: `${single.name} 已创建，将于 ${single.startCycle} 生效` }
  }

  function requestChange(payload) {
    const applicant = String(payload.applicant || '').trim()
    if (!applicant) return { ok: false, message: '缺少申请人' }
    const duplicate = data.requests.some((request) => request.type === payload.type && request.applicant === applicant && ['待站点复核', '待补充资料'].includes(request.status))
    if (duplicate) return { ok: false, message: '已存在相同类型的待处理申请' }
    const request = {
      id: sequence('REQ-202607', data.requests), type: payload.type, applicant, currentUnit: payload.currentUnit || '—', targetUnit: payload.targetUnit || '—',
      effectiveCycle: payload.effectiveCycle || '2026-08', recommender: payload.recommender || '—', status: '待站点复核', conflict: payload.conflict || '无冲突', createdAt: timestamp(),
      note: payload.note || '当前周期维持原关系，目标周期开始后按新结算单元处理。',
    }
    setData((current) => ({ ...current, requests: [request, ...current.requests] }))
    return { ok: true, message: `${payload.type}申请已提交站点复核` }
  }

  function reviewRequest(requestId, approved) {
    const request = data.requests.find((item) => item.id === requestId)
    if (!request) return { ok: false, message: '未找到申请记录' }
    if (approved && !request.conflict.startsWith('无')) return { ok: false, message: `存在阻止项：${request.conflict}` }
    setData((current) => {
      let teams = current.teams
      let singles = current.singles
      if (approved && request.type === '开设副线') {
        teams = teams.map((team) => ({ ...team, lines: team.lines.map((line) => request.targetUnit.includes(line.lineId) ? { ...line, status: '待生效' } : line) }))
      }
      if (approved && request.type === '副线转独立单线') {
        teams = teams.map((team) => ({ ...team, lines: team.lines.map((line) => line.agent === request.applicant ? { ...line, status: '待退出', endCycle: request.effectiveCycle } : line) }))
        singles = singles.map((single) => single.owner === request.applicant ? { ...single, status: '待生效', startCycle: request.effectiveCycle } : single)
      }
      if (approved && request.type === '独立单线加入团队') {
        const targetName = request.targetUnit.split('/')[0].trim()
        const lineCount = teams.reduce((sum, team) => sum + team.lines.length, 0)
        teams = teams.map((team) => team.name === targetName && !team.lines.some((line) => line.agent === request.applicant) ? { ...team, lines: [...team.lines, { lineId: `LINE-${String.fromCharCode(65 + lineCount)}`, identity: '副线', agent: request.applicant, scope: `${request.applicant} 原独立单线范围`, newActive: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: request.effectiveCycle }] } : team)
        singles = singles.map((single) => single.owner === request.applicant ? { ...single, status: '生效中·待转入' } : single)
      }
      if (approved && request.type === '终止独立单线') singles = singles.map((single) => single.owner === request.applicant ? { ...single, status: '待终止' } : single)
      if (approved && request.type === '团队换主线') {
        const targetName = request.currentUnit.split('/')[0].trim()
        const pendingMain = request.targetUnit.split('/').at(-1).trim()
        teams = teams.map((team) => team.name === targetName ? { ...team, pendingMain, pendingMainCycle: request.effectiveCycle } : team)
      }
      return { ...current, teams, singles, requests: current.requests.map((item) => item.id === requestId ? { ...item, status: approved ? '已批准·待生效' : '审核退回' } : item) }
    })
    return { ok: true, message: approved ? `申请已批准，将于 ${request.effectiveCycle} 生效` : '申请已退回' }
  }

  function setTeamStatus(teamId, status) {
    const team = data.teams.find((item) => item.id === teamId)
    if (!team) return { ok: false, message: '未找到代理部' }
    if (status === '已解散' && (team.previousNegative > 0 || data.bills.some((bill) => bill.unitId === teamId && bill.issued < bill.payable))) {
      setData((current) => ({ ...current, teams: current.teams.map((item) => item.id === teamId ? { ...item, status: '待解散' } : item) }))
      return { ok: false, message: '存在负值结余或未发完账单，已转为待解散' }
    }
    setData((current) => ({ ...current, teams: current.teams.map((item) => item.id === teamId ? { ...item, status } : item) }))
    return { ok: true, message: `${team.name} 已更新为${status}` }
  }

  function changeMain(teamId, nextMain, effectiveCycle = '2026-08') {
    const team = data.teams.find((item) => item.id === teamId)
    if (!team || !nextMain) return { ok: false, message: '请选择新主管主线' }
    return requestChange({ type: '团队换主线', applicant: '站点运营', currentUnit: `${team.name} / ${team.mainAgent}`, targetUnit: `${team.name} / ${nextMain}`, effectiveCycle, conflict: team.processingOccupied > 0 ? '存在处理中内部结算' : '无冲突', note: '历史账单仍归原主线，目标周期起由新主线负责。' })
  }

  function addInternalSettlement(payload) {
    const team = data.teams.find((item) => item.id === (payload.teamId || 'TEAM-001'))
    const amount = Number(payload.amount)
    if (!team || !payload.secondaryAgent || !Number.isFinite(amount) || amount <= 0) return { ok: false, message: '请填写副线和有效结算金额' }
    const available = teamAvailableBalance(team.id)
    if ((payload.source || '平台已到账余额') === '平台已到账余额' && amount > available) {
      return { ok: false, message: `超过主线团队可用余额 ¥${available.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` }
    }
    const record = {
      id: sequence('IS-202607', data.internalSettlements), teamId: team.id, teamName: team.name, mainAgent: team.mainAgent, secondaryAgent: payload.secondaryAgent,
      cycle: '2026-07', amount, basis: payload.basis || '固定金额', source: payload.source || '平台已到账余额', state: '成功', voucher: payload.voucher || '演示凭证', createdAt: timestamp(),
    }
    setData((current) => ({
      ...current,
      internalSettlements: [record, ...current.internalSettlements],
      teams: current.teams.map((item) => item.id === team.id ? { ...item, successfulTransfers: item.successfulTransfers + amount } : item),
    }))
    return { ok: true, message: `已向 ${payload.secondaryAgent} 结算 ¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` }
  }

  function submitBill(billId) {
    const bill = data.bills.find((item) => item.id === billId)
    if (!bill || bill.state !== '待提交') return { ok: false, message: '该账单当前不可提交' }
    setData((current) => ({ ...current, bills: current.bills.map((item) => item.id === billId ? { ...item, state: '待审核' } : item) }))
    return { ok: true, message: '账单已提交总控审核' }
  }

  function approveBill(billId, approved = true) {
    const bill = data.bills.find((item) => item.id === billId)
    if (!bill || !['待审核', '审核退回'].includes(bill.state)) return { ok: false, message: '该账单当前不可审核' }
    setData((current) => ({ ...current, bills: current.bills.map((item) => item.id === billId ? { ...item, state: approved ? '待发放' : '审核退回' } : item) }))
    return { ok: true, message: approved ? '账单审核通过，已锁定计算结果' : '账单已退回' }
  }

  function payoutBill(billId, requestedAmount) {
    const bill = data.bills.find((item) => item.id === billId)
    const amount = Number(requestedAmount)
    if (!bill || !['待发放', '部分发放'].includes(bill.state)) return { ok: false, message: '该账单当前不可发放' }
    const remaining = Math.max(0, bill.payable - bill.issued)
    const currentCap = Math.min(remaining, dailyRemaining)
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, message: '请输入有效发放金额' }
    if (amount > currentCap) return { ok: false, message: `本次最多可发 ¥${currentCap.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` }
    setData((current) => ({
      ...current,
      bills: current.bills.map((item) => item.id === billId ? { ...item, issued: item.issued + amount, state: item.issued + amount >= item.payable ? '已发放' : '部分发放' } : item),
      siteQuota: { ...current.siteQuota, successfulToday: current.siteQuota.successfulToday + amount },
      teams: current.teams.map((team) => team.id === bill.unitId ? { ...team, cumulativeReceived: team.cumulativeReceived + amount } : team),
    }))
    return { ok: true, message: `已发放 ¥${amount.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` }
  }

  function addPlan(payload) {
    const name = String(payload.name || '').trim()
    if (!name) return { ok: false, message: '请填写方案名称' }
    if (data.plans.some((plan) => plan.name === name)) return { ok: false, message: '方案名称已存在' }
    const plan = {
      id: sequence('PLAN', data.plans), type: payload.type || '团队佣金方案', name, site: '旺财体育', effectiveCycle: payload.effectiveCycle || '2026-08', status: '待生效',
      levels: payload.type === '推荐奖励方案' ? undefined : [{ grade: '一星', newActive: 5, activeMembers: 20, netWinLoss: 50000, rate: 0.3 }],
      ...(payload.type === '推荐奖励方案' ? { rewardRate: Number(payload.rewardRate || 0.1), rewardBase: '独立单线已审核应付佣金', deductedFromSingle: false } : {}),
    }
    setData((current) => ({ ...current, plans: [...current.plans, plan] }))
    return { ok: true, message: `${name} 已保存为待生效版本` }
  }

  const value = useMemo(() => ({
    data, dailyRemaining, teamAvailableBalance, createTeam, addSecondary, createSingle, requestChange, reviewRequest, setTeamStatus, changeMain,
    addInternalSettlement, submitBill, approveBill, payoutBill, addPlan, resetDemo: () => setData(cloneInitialState()),
  }), [data, dailyRemaining])

  return <TeamAgentContext.Provider value={value}>{children}</TeamAgentContext.Provider>
}

export function useTeamAgent() {
  const context = useContext(TeamAgentContext)
  if (!context) throw new Error('useTeamAgent must be used inside TeamAgentProvider')
  return context
}
