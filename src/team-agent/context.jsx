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
    if (!name || !mainAgent) return { ok: false, message: '请填写代理部名称和团队负责人' }
    if (data.teams.some((team) => team.name === name)) return { ok: false, message: '代理部名称已存在' }
    if (data.teams.some((team) => team.mainAgent === mainAgent && team.status !== '已解散')) return { ok: false, message: '该代理已担任其他代理部主线' }
    const id = `TEAM-${String(data.teams.length + 1).padStart(3, '0')}`
    const lineId = `LINE-${String.fromCharCode(65 + data.teams.reduce((sum, team) => sum + team.lines.length, 0))}`
    const main = data.agents.find((item) => item.account === mainAgent)
    const team = {
      id, code: `DPT-${String(data.teams.length + 1).padStart(3, '0')}`, name, teamType: payload.teamType || main?.teamAgentType || '普通代理', teamAgentType: payload.teamType || main?.teamAgentType || '普通代理', developer: payload.developer || mainAgent, site: payload.site || '旺财体育', currency: 'CNY', mainAgent, canOpenSecondary: payload.canOpenSecondary !== false,
      memberDetailPermission: Boolean(payload.memberDetailPermission), createdAt: timestamp(), joinedAt: payload.startCycle || '2026-08',
      plan: payload.plan || 'DW负盈利佣金方案', status: '待生效', startCycle: payload.startCycle || '2026-08', endCycle: '长期', previousNegative: 0,
      cumulativeReceived: 0, successfulTransfers: 0, processingOccupied: 0, otherDeductions: 0,
      metrics: { newActive: 0, activeMembers: 0, memberWinLoss: 0, totalWinLoss: 0, venueFee: 0, memberBonus: 0, memberRebate: 0, accountAdjustment: 0, manualOrderWinLoss: 0, depositFee: 0, withdrawalFee: 0, expenses: 0, adjustment: 0, currentNet: 0, lastBalance: 0, balanceAdjustment: 0, assessmentNet: 0, correctedNet: 0, commissionableNet: 0, commissionAdjustment: 0, grade: '待计算', rate: 0, payable: 0 },
      lines: [{ lineId, identity: '主线', agent: mainAgent, scope: '主线直属代理及会员', newActive: 0, firstDepositCount: 0, firstDepositAmount: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: payload.startCycle || '2026-08' }],
    }
    const operation = { id: sequence('TOP', data.teamOperations), teamId: id, teamName: name, teamType: team.teamType, mainId: payload.mainId || main?.id || '—', mainAccount: mainAgent, secondaryAccounts: '—', action: '创建团队', reason: payload.reason || '代理业务线归集', operator: '站点运营', createdAt: timestamp() }
    setData((current) => ({ ...current, teams: [...current.teams, team], teamOperations: [operation, ...current.teamOperations] }))
    return { ok: true, message: `${name} 已创建，将于 ${team.startCycle} 生效`, id }
  }

  function addSecondary(teamId, payload) {
    const team = data.teams.find((item) => item.id === teamId)
    const agent = String(payload.agent || '').trim()
    if (!team || !agent) return { ok: false, message: '请选择代理部并填写副线' }
    if (team.status === '冻结' || team.status === '待解散') return { ok: false, message: `代理部当前为${team.status}状态，不能新增副线` }
    if (team.canOpenSecondary === false) return { ok: false, message: '该团队负责人设置为不能开副线，当前按单线经营' }
    const occupied = data.teams.some((item) => item.lines.some((line) => line.agent === agent && !['已退出', '已关闭'].includes(line.status))) || data.singles.some((single) => single.owner === agent && single.status !== '已终止')
    if (occupied) return { ok: false, message: '该代理在目标周期已归属其他结算单元' }
    const lineCount = data.teams.reduce((sum, item) => sum + item.lines.length, 0)
    const line = {
      lineId: `LINE-${String.fromCharCode(65 + lineCount)}`, identity: '副线', agent, scope: payload.scope || `${agent} 节点及直属会员`,
      newActive: 0, firstDepositCount: 0, firstDepositAmount: 0, activeMembers: 0, netWinLoss: 0, status: payload.requireReview === false ? '待生效' : '待复核', startCycle: payload.startCycle || '2026-08',
    }
    const request = {
      id: sequence('REQ-202607', data.requests), type: '开设副线', applicant: team.mainAgent, currentUnit: `${team.name} / ${team.mainAgent}`, targetUnit: `${team.name} / ${line.lineId} / ${agent}`,
      effectiveCycle: line.startCycle, recommender: '—', status: payload.requireReview === false ? '已批准·待生效' : '待站点复核', conflict: '无冲突', balanceHandling: '加入团队当月结余随代理带入团队', createdAt: timestamp(), note: '副线进入团队后，余额归属按当月结余规则处理。',
    }
    const secondaryAccounts = [...team.lines.filter((item) => item.identity === '副线').map((item) => item.agent), agent].join('、')
    const operation = { id: sequence('TOP', data.teamOperations), teamId: team.id, teamName: team.name, teamType: team.teamAgentType || team.teamType || '普通代理', mainId: data.agents.find((item) => item.account === team.mainAgent)?.id || '—', mainAccount: team.mainAgent, secondaryAccounts, action: '新增副线', reason: payload.reason || '扩展团队业务范围', operator: payload.requireReview === false ? '站点运营' : team.mainAgent, createdAt: timestamp() }
    setData((current) => ({
      ...current,
      teams: current.teams.map((item) => item.id === teamId ? { ...item, lines: [...item.lines, line] } : item),
      requests: [request, ...current.requests],
      teamOperations: [operation, ...current.teamOperations],
    }))
    return { ok: true, message: `${agent} 副线已建立，状态：${line.status}` }
  }

  function createSingle(payload) {
    const owner = String(payload.owner || '').trim()
    if (!owner) return { ok: false, message: '请填写单线代理' }
    const occupied = data.singles.some((single) => single.owner === owner && single.status !== '已终止') || data.teams.some((team) => team.lines.some((line) => line.agent === owner && !['已退出', '已关闭'].includes(line.status)))
    if (occupied) return { ok: false, message: '该代理当前已归属团队或单线代理' }
    const index = data.singles.length + 1
    const single = {
      id: `SINGLE-${String(index).padStart(3, '0')}`, code: `SL-${String(index).padStart(3, '0')}`, name: payload.name || `${owner} 单线代理`, owner,
      site: '旺财体育', currency: 'CNY', source: payload.source || '站点直接创建', recommender: payload.recommender || '—', plan: payload.plan || 'DW负盈利佣金方案',
      rewardPlan: payload.recommender ? '推荐奖励10%方案' : '未绑定', status: '待生效', startCycle: payload.startCycle || '2026-08', scope: '单线代理本人节点',
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
    const balanceHandling = payload.balanceHandling || (payload.type === '单线代理加入团队' || payload.type === '开设副线'
      ? '加入团队当月结余随代理带入新团队'
      : payload.type === '副线转单线代理' || payload.type === '终止单线代理'
        ? '移出团队当月结余留在原团队'
        : '团队当月结余继续归属原团队')
    const request = {
      id: sequence('REQ-202607', data.requests), type: payload.type, applicant, currentUnit: payload.currentUnit || '—', targetUnit: payload.targetUnit || '—',
      effectiveCycle: payload.effectiveCycle || '2026-08', recommender: payload.recommender || '—', status: '待站点复核', conflict: payload.conflict || '无冲突', createdAt: timestamp(),
      balanceHandling, note: payload.note || '关系按目标周期切换，余额归属按当月结余规则处理。',
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
      if (approved && request.type === '副线转单线代理') {
        teams = teams.map((team) => ({ ...team, lines: team.lines.map((line) => line.agent === request.applicant ? { ...line, status: '待退出', endCycle: request.effectiveCycle } : line) }))
        singles = singles.map((single) => single.owner === request.applicant ? { ...single, status: '待生效', startCycle: request.effectiveCycle } : single)
      }
      if (approved && request.type === '单线代理加入团队') {
        const targetName = request.targetUnit.split('/')[0].trim()
        const lineCount = teams.reduce((sum, team) => sum + team.lines.length, 0)
        teams = teams.map((team) => team.name === targetName && !team.lines.some((line) => line.agent === request.applicant) ? { ...team, lines: [...team.lines, { lineId: `LINE-${String.fromCharCode(65 + lineCount)}`, identity: '副线', agent: request.applicant, scope: `${request.applicant} 原单线代理范围`, newActive: 0, firstDepositCount: 0, firstDepositAmount: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: request.effectiveCycle }] } : team)
        singles = singles.map((single) => single.owner === request.applicant ? { ...single, status: '生效中·待转入' } : single)
      }
      if (approved && request.type === '终止单线代理') singles = singles.map((single) => single.owner === request.applicant ? { ...single, status: '待终止' } : single)
      if (approved && request.type === '团队换主线') {
        const targetName = request.currentUnit.split('/')[0].trim()
        const pendingMain = request.targetUnit.split('/').at(-1).trim()
        teams = teams.map((team) => team.name === targetName ? { ...team, pendingMain, pendingMainCycle: request.effectiveCycle } : team)
      }
      const relatedTeam = teams.find((team) => request.currentUnit.includes(team.name) || request.targetUnit.includes(team.name))
      const operation = approved && relatedTeam ? { id: sequence('TOP', current.teamOperations), teamId: relatedTeam.id, teamName: relatedTeam.name, teamType: relatedTeam.teamAgentType || relatedTeam.teamType || '普通代理', mainId: current.agents.find((item) => item.account === relatedTeam.mainAgent)?.id || '—', mainAccount: relatedTeam.mainAgent, secondaryAccounts: relatedTeam.lines.filter((line) => line.identity === '副线').map((line) => line.agent).join('、') || '—', action: request.type, reason: request.balanceHandling || request.note, operator: '站点运营', createdAt: timestamp() } : null
      return { ...current, teams, singles, requests: current.requests.map((item) => item.id === requestId ? { ...item, status: approved ? '已批准·待生效' : '审核退回' } : item), teamOperations: operation ? [operation, ...current.teamOperations] : current.teamOperations }
    })
    return { ok: true, message: approved ? `申请已批准，将于 ${request.effectiveCycle} 生效` : '申请已退回' }
  }

  function setTeamStatus(teamId, status, options = {}) {
    const team = data.teams.find((item) => item.id === teamId)
    if (!team) return { ok: false, message: '未找到代理部' }
    const balanceAssignee = options.balanceAssignee || team.mainAgent
    const operationReason = status === '已解散'
      ? `团队业务终止；剩余团队结余由指定代理 ${balanceAssignee} 承接`
      : status === '冻结'
        ? '冻结团队；团队负责人及全部副线代理禁止登录'
        : status === '正常'
          ? '解除冻结；团队负责人及全部副线代理恢复正常登录'
          : `团队状态调整为${status}`
    const operation = { id: sequence('TOP', data.teamOperations), teamId: team.id, teamName: team.name, teamType: team.teamAgentType || team.teamType || '普通代理', mainId: data.agents.find((item) => item.account === team.mainAgent)?.id || '—', mainAccount: team.mainAgent, secondaryAccounts: team.lines.filter((line) => line.identity === '副线').map((line) => line.agent).join('、') || '—', action: status, reason: operationReason, operator: '站点运营', createdAt: timestamp() }
    if (status === '已解散' && (team.previousNegative > 0 || data.bills.some((bill) => bill.unitId === teamId && bill.issued < bill.payable))) {
      setData((current) => ({ ...current, teams: current.teams.map((item) => item.id === teamId ? { ...item, status: '待解散', balanceAssignee } : item), teamOperations: [{ ...operation, action: '转为待解散', reason: `存在未发完账单或未处理结余；处理后由 ${balanceAssignee} 承接剩余结余` }, ...current.teamOperations] }))
      return { ok: false, message: '存在未处理当月结余或未发完账单，已转为待解散' }
    }
    const teamAccounts = new Set(team.lines.map((line) => line.agent))
    setData((current) => ({
      ...current,
      teams: current.teams.map((item) => item.id === teamId ? { ...item, status, ...(status === '已解散' ? { balanceAssignee } : {}) } : item),
      agents: ['冻结', '正常'].includes(status)
        ? current.agents.map((item) => teamAccounts.has(item.account) ? { ...item, status: status === '冻结' ? '冻结' : '启用' } : item)
        : current.agents,
      teamOperations: [operation, ...current.teamOperations],
    }))
    return {
      ok: true,
      message: status === '冻结'
        ? `${team.name} 已冻结，团队负责人及全部副线代理禁止登录`
        : status === '正常'
          ? `${team.name} 已解除冻结并恢复正常`
          : `${team.name} 已更新为${status}`,
    }
  }

  function changeMain(teamId, nextMain, effectiveCycle = '2026-08') {
    const team = data.teams.find((item) => item.id === teamId)
    if (!team || !nextMain) return { ok: false, message: '请选择新团队负责人' }
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
      agents: current.agents.map((item) => item.account === payload.secondaryAgent ? { ...item, balance: item.balance + amount } : item),
      transfers: [{ id: sequence('TR', current.transfers), orderNo: record.id, site: team.site, agent: team.mainAgent, directAgent: team.mainAgent, team: team.name, lineId: team.lines.find((line) => line.agent === payload.secondaryAgent)?.lineId || '—', identity: '副线', unit: team.name, effectiveCycle: team.startCycle, from: team.mainAgent, to: payload.secondaryAgent, type: '内部结算', amount, fee: 0, status: '成功', createdAt: record.createdAt }, ...current.transfers],
      accountChanges: [{ id: sequence('AC', current.accountChanges), orderNo: record.id, site: team.site, agent: payload.secondaryAgent, directAgent: team.mainAgent, team: team.name, lineId: team.lines.find((line) => line.agent === payload.secondaryAgent)?.lineId || '—', identity: '副线', unit: team.name, effectiveCycle: team.startCycle, owner: payload.secondaryAgent, ownerType: '代理', wallet: '佣金余额', changeType: '内部结算收款', before: current.agents.find((item) => item.account === payload.secondaryAgent)?.balance || 0, amount, after: (current.agents.find((item) => item.account === payload.secondaryAgent)?.balance || 0) + amount, status: '成功', createdAt: record.createdAt }, ...current.accountChanges],
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
      agents: current.agents.map((item) => item.account === bill.payee ? { ...item, balance: item.balance + amount } : item),
      accountChanges: [{ id: sequence('AC', current.accountChanges), orderNo: bill.id, site: bill.site, agent: bill.payee, directAgent: current.agents.find((item) => item.account === bill.payee)?.parent || '—', team: bill.type === '团队佣金' ? bill.unitName : '—', lineId: current.agents.find((item) => item.account === bill.payee)?.lineId || '—', identity: current.agents.find((item) => item.account === bill.payee)?.identity || '原代理模式', unit: bill.unitName, effectiveCycle: bill.cycle, owner: bill.payee, ownerType: '代理', wallet: '佣金余额', changeType: '佣金发放', before: current.agents.find((item) => item.account === bill.payee)?.balance || 0, amount, after: (current.agents.find((item) => item.account === bill.payee)?.balance || 0) + amount, status: '成功', createdAt: timestamp() }, ...current.accountChanges],
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
      ...(payload.type === '推荐奖励方案' ? { rewardRate: Number(payload.rewardRate || 0.1), rewardBase: '单线代理已审核应付佣金', deductedFromSingle: false } : {}),
    }
    setData((current) => ({ ...current, plans: [...current.plans, plan] }))
    return { ok: true, message: `${name} 已保存为待生效版本` }
  }

  function copyPlan(planId) {
    const source = data.plans.find((item) => item.id === planId)
    if (!source) return { ok: false, message: '未找到方案' }
    const copy = { ...structuredClone(source), id: sequence('PLAN', data.plans), name: `${source.name} · 未来版本`, effectiveCycle: '2026-08', status: '待生效' }
    setData((current) => ({ ...current, plans: [...current.plans, copy] }))
    return { ok: true, message: `${copy.name} 已创建` }
  }

  function updatePlanLevel(planId, grade, payload) {
    const plan = data.plans.find((item) => item.id === planId)
    if (!plan?.levels?.some((item) => item.grade === grade)) return { ok: false, message: '未找到等级配置' }
    setData((current) => ({ ...current, plans: current.plans.map((item) => item.id === planId ? { ...item, levels: item.levels.map((level) => level.grade === grade ? { ...level, ...payload } : level) } : item) }))
    return { ok: true, message: `${grade}等级配置已更新` }
  }

  function updateAgent(agentId, payload) {
    const target = data.agents.find((item) => item.id === agentId)
    if (!target) return { ok: false, message: '未找到代理资料' }
    const ownedTeam = data.teams.find((team) => team.mainAgent === target.account && team.status !== '已解散')
    if (payload.identity === '团队负责人' && !ownedTeam) {
      const teamResult = createTeam({ name: payload.teamName, mainAgent: target.account, mainId: target.id, teamType: payload.teamAgentType, site: payload.site || target.site, plan: payload.plan, canOpenSecondary: payload.canOpenSecondary })
      if (!teamResult.ok) return teamResult
    }
    setData((current) => ({
      ...current,
      agents: current.agents.map((item) => item.id === agentId ? { ...item, ...payload } : item),
      teams: current.teams.map((team) => team.mainAgent === target.account && payload.identity === '团队负责人'
        ? { ...team, name: String(payload.teamName || team.name).trim(), canOpenSecondary: payload.canOpenSecondary !== false }
        : team),
    }))
    return { ok: true, message: `${target.account} 资料已更新` }
  }

  function addAgent(payload) {
    const account = String(payload.account || '').trim()
    if (!account) return { ok: false, message: '请填写代理账号' }
    if (data.agents.some((item) => item.account.toLowerCase() === account.toLowerCase())) return { ok: false, message: '代理账号已存在' }
    if (payload.identity === '团队负责人' && (!String(payload.teamName || '').trim() || data.teams.some((team) => team.name === String(payload.teamName).trim()))) return { ok: false, message: !String(payload.teamName || '').trim() ? '请填写团队名称' : '团队名称已存在' }
    const targetTeam = payload.identity === '副线' ? data.teams.find((team) => team.id === payload.targetTeamId) : null
    if (payload.identity === '副线' && !targetTeam) return { ok: false, message: '请选择副线要加入的团队' }
    if (targetTeam?.canOpenSecondary === false) return { ok: false, message: '所选团队负责人不能开副线，当前按单线经营' }
    const targetLeader = targetTeam ? data.agents.find((agent) => agent.account === targetTeam.mainAgent) : null
    if (targetTeam && (targetTeam.teamAgentType || targetLeader?.teamAgentType) !== payload.teamAgentType) return { ok: false, message: '副线代理身份必须与所选团队一致' }
    const numericIds = data.agents.map((item) => Number(item.id)).filter(Number.isFinite)
    const id = String((numericIds.length ? Math.max(...numericIds) : 1700) + 1)
    const lineCount = data.teams.reduce((sum, team) => sum + team.lines.length, 0)
    const lineId = targetTeam ? `LINE-${String.fromCharCode(65 + lineCount)}` : payload.lineId || '—'
    const record = {
      id,
      account,
      agentName: String(payload.agentName || account).trim(),
      agentType: payload.agentType === '单线代理' ? '团队代理' : payload.agentType || '多层级代理',
      registeredAt: timestamp(),
      site: payload.site || '旺财体育',
      status: payload.status || '启用',
      parent: payload.parent || '无上级代理',
      parentId: payload.parentId || '—',
      recommender: payload.recommender || '—',
      subAgents: 0,
      members: 0,
      balance: 0,
      model: '负盈利模式',
      settlementMode: payload.settlementMode || '原代理模式',
      identity: payload.identity || '—',
      teamAgentType: payload.teamAgentType || (payload.agentType === '团队代理' ? '官方代理' : '—'),
      unit: targetTeam?.name || payload.unit || '—',
      lineId,
      effectiveCycle: targetTeam?.startCycle || payload.effectiveCycle || '—',
      plan: payload.plan || (payload.agentType === '星级代理' ? '星级返佣方案' : '多层级返佣方案'),
      carryAllFees: payload.carryAllFees || '否',
      remark: payload.remark || '',
      lastLogin: '—',
    }
    setData((current) => {
      const teams = targetTeam ? current.teams.map((team) => team.id === targetTeam.id ? { ...team, lines: [...team.lines, { lineId, identity: '副线', agent: account, scope: `${account} 节点及直属会员`, newActive: 0, firstDepositCount: 0, firstDepositAmount: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: team.startCycle || '2026-08' }] } : team) : current.teams
      const teamOperations = targetTeam ? [{ id: sequence('TOP', current.teamOperations), teamId: targetTeam.id, teamName: targetTeam.name, teamType: targetTeam.teamAgentType || targetTeam.teamType || '普通代理', mainId: current.agents.find((item) => item.account === targetTeam.mainAgent)?.id || '—', mainAccount: targetTeam.mainAgent, secondaryAccounts: [...targetTeam.lines.filter((line) => line.identity === '副线').map((line) => line.agent), account].join('、'), action: '新增副线', reason: '新增代理时加入团队', operator: '总控运营', createdAt: timestamp() }, ...current.teamOperations] : current.teamOperations
      return { ...current, agents: [record, ...current.agents], teams, teamOperations }
    })
    return { ok: true, message: targetTeam ? `${account} 已新增并加入 ${targetTeam.name}` : `${account} 已新增`, id }
  }

  function adjustAgentBalance(agentId, payload) {
    const target = data.agents.find((item) => item.id === agentId)
    const amount = Number(payload.amount)
    if (!target || !Number.isFinite(amount) || amount === 0) return { ok: false, message: '请输入有效调整金额' }
    if (!payload.month || payload.month === '2026-07') return { ok: false, message: '佣金余额仅允许调整历史已发放月份' }
    const record = { id: sequence('ABA', data.agentBalanceAdjustments), agentId, account: target.account, month: payload.month, amount, reason: payload.reason || '历史佣金差异修正', operator: '若依', createdAt: timestamp() }
    setData((current) => ({ ...current, agents: current.agents.map((item) => item.id === agentId ? { ...item, balance: item.balance + amount } : item), agentBalanceAdjustments: [record, ...current.agentBalanceAdjustments] }))
    return { ok: true, message: `${target.account} 历史佣金余额已调整` }
  }

  function adjustBillBalance(billId, payload) {
    const target = data.bills.find((item) => item.id === billId)
    const amount = Number(payload.amount)
    if (!target || target.cycle !== '2026-07') return { ok: false, message: '仅允许调整当前佣金月份的本月结余' }
    if (!Number.isFinite(amount)) return { ok: false, message: '请输入有效本月结余调整金额' }
    const correctedNet = target.netWinLossRaw + target.lastBalance + amount
    const calculatedCommission = correctedNet * target.rate + Number(target.commissionAdjustment || 0)
    const payable = Math.max(0, calculatedCommission)
    setData((current) => ({
      ...current,
      bills: current.bills.map((item) => item.id === billId ? { ...item, balanceAdjustment: amount, correctedNet, netWinLoss: correctedNet, payable, adjustmentReason: payload.reason || '本月结余调整', maintainer: '若依' } : item),
      teams: current.teams.map((team) => team.id === target.unitId ? { ...team, metrics: { ...team.metrics, balanceAdjustment: amount, correctedNet, assessmentNet: correctedNet, commissionableNet: correctedNet, payable } } : team),
    }))
    return { ok: true, message: `本月结余已调整，冲正后净输赢为 ¥${correctedNet.toLocaleString()}` }
  }

  function updateActivityDefinition(id, payload) {
    if (!data.activityDefinitions.some((item) => item.id === id)) return { ok: false, message: '未找到活跃定义' }
    setData((current) => ({ ...current, activityDefinitions: current.activityDefinitions.map((item) => item.id === id ? { ...item, ...payload, operator: '若依', updatedAt: timestamp() } : item) }))
    return { ok: true, message: '活跃会员定义已更新' }
  }

  function updateAgentCost(id, payload) {
    if (!data.agentCosts.some((item) => item.id === id)) return { ok: false, message: '未找到代理成本项' }
    setData((current) => ({ ...current, agentCosts: current.agentCosts.map((item) => item.id === id ? { ...item, ...payload, operator: '站点运营', updatedAt: timestamp() } : item) }))
    return { ok: true, message: '代理成本配置已更新' }
  }

  function saveSiteCommissionConfig(payload) {
    setData((current) => ({ ...current, siteCommissionConfig: { ...current.siteCommissionConfig, ...payload, updatedBy: '站点运营', updatedAt: timestamp() } }))
    return { ok: true, message: `站点佣金配置已保存，将于 ${payload.effectiveCycle || data.siteCommissionConfig.effectiveCycle} 生效` }
  }

  function updateTeamPreferences(teamId, payload) {
    const team = data.teams.find((item) => item.id === teamId)
    if (!team) return { ok: false, message: '未找到代理部' }
    const nextName = String(payload.name || team.name).trim()
    const operation = { id: sequence('TOP', data.teamOperations), teamId, teamName: nextName, teamType: payload.teamType || team.teamType, mainId: data.agents.find((item) => item.account === team.mainAgent)?.id || '—', mainAccount: team.mainAgent, secondaryAccounts: team.lines.filter((line) => line.identity === '副线').map((line) => line.agent).join('、') || '—', action: '编辑团队', reason: `更新团队名称、类型或偏好设置`, operator: '站点运营', createdAt: timestamp() }
    setData((current) => ({ ...current, teams: current.teams.map((item) => item.id === teamId ? { ...item, ...payload, name: nextName } : item), teamOperations: [operation, ...current.teamOperations] }))
    return { ok: true, message: `${nextName} 设置已更新` }
  }

  function submitAgentPay(payload) {
    const account = String(payload.account || '').trim()
    const memberAccount = String(payload.member || '').trim()
    const amount = Number(payload.amount)
    const agentRow = data.agents.find((item) => item.account === account)
    const member = data.members.find((item) => item.account === memberAccount)
    const payType = payload.payType || '佣金代存'
    const prepaid = data.prepaidAccounts.find((item) => item.agent === account)
    if (!agentRow || !member) return { ok: false, message: '请选择当前代理范围内的会员' }
    if (!Number.isFinite(amount) || amount <= 0) return { ok: false, message: '请输入有效代存金额' }
    if (payType === '佣金代存' && amount > agentRow.balance) return { ok: false, message: '佣金余额不足，不能提交代存' }
    if (payType === '额度代存' && (!prepaid || amount > prepaid.available)) return { ok: false, message: '预付金额度不足，不能提交代存' }
    const index = data.agentPayRecords.length + 1
    const submittedAt = timestamp()
    const orderNo = `AP20260715${String(index).padStart(4, '0')}`
    const record = { id: `AP-${String(index).padStart(3, '0')}`, orderNo, site: agentRow.site, agent: account, agentId: agentRow.id, directAgent: agentRow.parent, team: agentRow.unit === '—' ? '—' : agentRow.unit, lineId: agentRow.lineId, identity: agentRow.identity, unit: agentRow.unit, effectiveCycle: agentRow.effectiveCycle, member: memberAccount, payType, amount, turnoverMultiple: Number(payload.turnoverMultiple || 1), requiredTurnover: amount * Number(payload.turnoverMultiple || 1), status: '待处理', applicant: account, reviewer: '—', submittedAt, reviewedAt: '—', remark: payload.remark || '代理发起代存' }
    const deposit = { id: `DEP-${orderNo}`, orderNo, site: agentRow.site, agent: account, agentId: agentRow.id, directAgent: agentRow.parent, team: agentRow.unit === '—' ? '—' : agentRow.unit, lineId: agentRow.lineId, identity: agentRow.identity, unit: agentRow.unit, effectiveCycle: agentRow.effectiveCycle, member: memberAccount, type: '代理代存', channel: payType === '佣金代存' ? '佣金余额' : '代理预付金', amount, fee: 0, status: '待处理', submittedAt, completedAt: '—' }
    setData((current) => ({ ...current, agentPayRecords: [record, ...current.agentPayRecords], deposits: [deposit, ...current.deposits] }))
    return { ok: true, message: `代存申请 ${orderNo} 已提交站点处理` }
  }

  function reviewAgentPay(id, approved, remark = '') {
    const target = data.agentPayRecords.find((item) => item.id === id)
    if (!target || target.status !== '待处理') return { ok: false, message: '该代存申请当前不可处理' }
    const agentRow = data.agents.find((item) => item.account === target.agent)
    const member = data.members.find((item) => item.account === target.member)
    const prepaid = data.prepaidAccounts.find((item) => item.agent === target.agent)
    if (approved && (!agentRow || !member)) return { ok: false, message: '代理或会员资料不存在' }
    if (approved && target.payType === '佣金代存' && target.amount > agentRow.balance) return { ok: false, message: '代理佣金余额不足，处理被阻止' }
    if (approved && target.payType === '额度代存' && (!prepaid || target.amount > prepaid.available)) return { ok: false, message: '代理预付金额度不足，处理被阻止' }
    const reviewedAt = timestamp()
    setData((current) => {
      const beforeAgent = current.agents.find((item) => item.account === target.agent)?.balance || 0
      const beforeMember = current.members.find((item) => item.account === target.member)?.balance || 0
      const relation = { site: target.site, agent: target.agent, directAgent: target.directAgent, team: target.team, lineId: target.lineId, identity: target.identity, unit: target.unit, effectiveCycle: target.effectiveCycle }
      return {
        ...current,
        agentPayRecords: current.agentPayRecords.map((item) => item.id === id ? { ...item, status: approved ? '已通过' : '已拒绝', reviewer: '站点运营', reviewedAt, remark: remark || (approved ? '资料核对通过' : '申请已拒绝') } : item),
        deposits: current.deposits.map((item) => item.orderNo === target.orderNo ? { ...item, status: approved ? '成功' : '已拒绝', completedAt: reviewedAt } : item),
        agents: approved && target.payType === '佣金代存' ? current.agents.map((item) => item.account === target.agent ? { ...item, balance: item.balance - target.amount } : item) : current.agents,
        prepaidAccounts: approved && target.payType === '额度代存' ? current.prepaidAccounts.map((item) => item.agent === target.agent ? { ...item, available: item.available - target.amount, lastChange: -target.amount, updatedAt: reviewedAt } : item) : current.prepaidAccounts,
        members: approved ? current.members.map((item) => item.account === target.member ? { ...item, balance: item.balance + target.amount, depositAmount: item.depositAmount + target.amount } : item) : current.members,
        transfers: approved ? [{ id: sequence('TR', current.transfers), orderNo: target.orderNo, ...relation, from: target.agent, to: target.member, type: target.payType, amount: target.amount, fee: 0, status: '成功', createdAt: reviewedAt }, ...current.transfers] : current.transfers,
        accountChanges: approved ? [
          { id: `${sequence('AC', current.accountChanges)}-A`, orderNo: target.orderNo, ...relation, owner: target.agent, ownerType: '代理', wallet: target.payType === '佣金代存' ? '佣金余额' : '预付金额度', changeType: '代理代存扣款', before: target.payType === '佣金代存' ? beforeAgent : prepaid?.available || 0, amount: -target.amount, after: (target.payType === '佣金代存' ? beforeAgent : prepaid?.available || 0) - target.amount, status: '成功', createdAt: reviewedAt },
          { id: `${sequence('AC', current.accountChanges)}-M`, orderNo: target.orderNo, ...relation, owner: target.member, ownerType: '会员', wallet: '中心钱包', changeType: '代理代存入账', before: beforeMember, amount: target.amount, after: beforeMember + target.amount, status: '成功', createdAt: reviewedAt },
          ...current.accountChanges,
        ] : current.accountChanges,
      }
    })
    return { ok: true, message: approved ? '代理代存已通过并同步资金记录' : '代理代存已拒绝' }
  }

  function adjustPrepaidAccount(id, amountValue, reason = '') {
    const amount = Number(amountValue)
    const target = data.prepaidAccounts.find((item) => item.id === id)
    if (!target || !Number.isFinite(amount) || amount === 0) return { ok: false, message: '请输入有效调整金额' }
    if (target.available + amount < 0) return { ok: false, message: '调整后预付金额度不能小于零' }
    setData((current) => ({
      ...current,
      prepaidAccounts: current.prepaidAccounts.map((item) => item.id === id ? { ...item, available: item.available + amount, lastChange: amount, updatedAt: timestamp(), remark: reason || '站点运营调整' } : item),
    }))
    return { ok: true, message: `${target.agent} 预付金额度已调整` }
  }

  function agentWithdrawableBalance(account) {
    const agentRow = data.agents.find((item) => item.account === account)
    if (!agentRow) return 0
    const pending = data.withdrawals.filter((item) => item.account === account && item.status === '待审核').reduce((sum, item) => sum + Number(item.actualAmountCny || 0), 0)
    return Math.max(0, agentRow.balance - pending)
  }

  function createAgentWithdrawal(payload) {
    const account = String(payload.account || '').trim()
    const agentRow = data.agents.find((item) => item.account === account)
    const usdtAmount = Number(payload.usdtAmount || 0)
    const actualAmountCny = Number(payload.actualAmountCny || payload.amountCny || (usdtAmount > 0 ? usdtAmount * 7.2 : 0))
    if (!agentRow) return { ok: false, message: '未找到当前代理账号' }
    if (!Number.isFinite(actualAmountCny) || actualAmountCny <= 0) return { ok: false, message: '请输入有效提款金额' }
    const available = agentWithdrawableBalance(account)
    if (actualAmountCny > available) return { ok: false, message: `超过当前可提现余额 ¥${available.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}` }
    if (!String(payload.withdrawInfo || '').trim()) return { ok: false, message: '请填写提款信息' }
    const index = data.withdrawals.length + 1
    const feeCny = Math.max(7.2, actualAmountCny * 0.001)
    const record = { id: `AWD-202607-${String(index).padStart(3, '0')}`, orderNo: `AWD20260715${String(index).padStart(4, '0')}`, site: agentRow.site, withdrawalType: payload.withdrawalType || '佣金余额提现', agentId: agentRow.id, account, agentType: agentRow.agentType, parentAccount: agentRow.parent, currency: payload.currency || (usdtAmount > 0 ? 'USDT' : 'CNY'), usdtAmount, actualAmountCny, feeCny, estimatedArrival: Math.max(0, actualAmountCny - feeCny), withdrawInfo: payload.withdrawInfo, appliedAt: timestamp(), status: '待审核', reviewer: '—', reviewedAt: '—', reviewRemark: '—', completedAt: '—' }
    setData((current) => ({ ...current, withdrawals: [record, ...current.withdrawals] }))
    return { ok: true, message: `提款申请 ${record.orderNo} 已提交审核` }
  }

  function reviewAgentWithdrawal(id, approved, remark = '', reviewer = '站点运营') {
    const target = data.withdrawals.find((item) => item.id === id)
    if (!target || target.status !== '待审核') return { ok: false, message: '该提款订单当前不可审核' }
    const agentRow = data.agents.find((item) => item.account === target.account)
    if (approved && (!agentRow || target.actualAmountCny > agentRow.balance)) return { ok: false, message: '代理余额不足，不能审核通过' }
    setData((current) => ({
      ...current,
      withdrawals: current.withdrawals.map((item) => item.id === id ? { ...item, status: approved ? '处理中' : '已拒绝', reviewer, reviewedAt: timestamp(), reviewRemark: remark || (approved ? '资料核对通过，进入出款处理' : '审核拒绝') } : item),
      agents: approved ? current.agents.map((item) => item.account === target.account ? { ...item, balance: item.balance - target.actualAmountCny } : item) : current.agents,
      accountChanges: approved ? [{ id: sequence('AC', current.accountChanges), orderNo: target.orderNo, site: target.site, agent: target.account, directAgent: target.parentAccount, team: agentRow?.unit === '—' ? '—' : agentRow?.unit, lineId: agentRow?.lineId || '—', identity: agentRow?.identity || '原代理模式', unit: agentRow?.unit || '原代理模式', effectiveCycle: agentRow?.effectiveCycle || '历史兼容', owner: target.account, ownerType: '代理', wallet: '佣金余额', changeType: '代理提款冻结扣款', before: agentRow.balance, amount: -target.actualAmountCny, after: agentRow.balance - target.actualAmountCny, status: '处理中', createdAt: timestamp() }, ...current.accountChanges] : current.accountChanges,
    }))
    return { ok: true, message: approved ? '代理提款审核通过，已进入出款处理' : '代理提款已拒绝' }
  }

  function completeAgentWithdrawal(id) {
    const target = data.withdrawals.find((item) => item.id === id)
    if (!target || target.status !== '处理中') return { ok: false, message: '该提款订单当前不可完成' }
    const agentRow = data.agents.find((item) => item.account === target.account)
    const completedAt = timestamp()
    setData((current) => ({
      ...current,
      withdrawals: current.withdrawals.map((item) => item.id === id ? { ...item, status: '已完成', completedAt } : item),
      transfers: [{ id: sequence('TR', current.transfers), orderNo: target.orderNo, site: target.site, agent: target.account, directAgent: target.parentAccount, team: agentRow?.unit === '—' ? '—' : agentRow?.unit, lineId: agentRow?.lineId || '—', identity: agentRow?.identity || '原代理模式', unit: agentRow?.unit || '原代理模式', effectiveCycle: agentRow?.effectiveCycle || '历史兼容', from: target.account, to: target.withdrawInfo, type: '代理提款', amount: target.estimatedArrival || target.actualAmountCny, fee: target.feeCny || 0, status: '成功', createdAt: completedAt }, ...current.transfers],
      accountChanges: current.accountChanges.map((item) => item.orderNo === target.orderNo ? { ...item, status: '成功' } : item),
    }))
    return { ok: true, message: '代理提款已完成，转账明细已同步' }
  }

  const value = useMemo(() => ({
    data, dailyRemaining, teamAvailableBalance, createTeam, addSecondary, createSingle, requestChange, reviewRequest, setTeamStatus, changeMain,
    addInternalSettlement, submitBill, approveBill, payoutBill, addPlan, copyPlan, updatePlanLevel, addAgent, updateAgent, adjustAgentBalance, adjustBillBalance,
    updateActivityDefinition, updateAgentCost, saveSiteCommissionConfig, updateTeamPreferences, submitAgentPay, reviewAgentPay, adjustPrepaidAccount,
    agentWithdrawableBalance, createAgentWithdrawal, reviewAgentWithdrawal, completeAgentWithdrawal,
    resetDemo: () => setData(cloneInitialState()),
  }), [data, dailyRemaining])

  return <TeamAgentContext.Provider value={value}>{children}</TeamAgentContext.Provider>
}

export function useTeamAgent() {
  const context = useContext(TeamAgentContext)
  if (!context) throw new Error('useTeamAgent must be used inside TeamAgentProvider')
  return context
}
