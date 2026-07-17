const MEMBER_PREFIXES = ['星河', '云舟', '青橙', '锦程', '明月', '北辰', '海棠', '松风']

function findAgent(data, account) {
  return data.agents.find((agent) => agent.account === account)
}

function identityLabel(identity) {
  if (identity === '主线') return '主管主线'
  if (identity === '副线') return '副线负责人'
  return identity || '团队代理成员'
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

export function teamAgentRows(team, data) {
  return team.lines.map((line) => agentRowFromLine(line, data))
}

export function teamMemberCount(team, data) {
  return team.lines.reduce((sum, line) => sum + memberCountForLine(line, data), 0)
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

export function getTeamInspectConfig(type, team, data) {
  if (!team) return { title: '明细', description: '', columns: [], rows: [] }
  const configs = {
    teamAgents: {
      title: `${team.name} · 团队人数明细`,
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
