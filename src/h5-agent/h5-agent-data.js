import { AGENT_ROLE_PROFILES } from '../team-agent/multi-level-agent-data'

export const H5_AGENT_UPDATED_AT = '2026-07-22 06:13'

export const H5_AGENT_ROLES = [
  { id: 'main', label: '团队负责人', account: 'gaodashang', scope: '本人团队及授权下级' },
  { id: 'secondary', label: '副线', account: 'WC002', scope: '本人线路及直属会员' },
  { id: 'independent', label: '单线代理', account: 'dailiwc001', scope: '本人及直属会员' },
  { id: 'multiLevel', label: '多层级代理', account: 'gaodashang', scope: '授权层级代理及会员' },
]

export const H5_AGENT_PAGE_META = {
  home: { label: '代理中心', shortLabel: '首页', group: 'home' },
  dashboard: { label: '代理数据看板', shortLabel: '数据看板', group: 'agent' },
  agents: { label: '代理列表', shortLabel: '代理列表', group: 'agent' },
  members: { label: '会员列表', shortLabel: '会员列表', group: 'member' },
  bets: { label: '投注记录', shortLabel: '投注记录', group: 'member' },
  finance: { label: '财务中心', shortLabel: '财务中心', group: 'finance' },
  accountChanges: { label: '账变流水报表', shortLabel: '账变流水', group: 'finance' },
  memberFunds: { label: '会员资金记录', shortLabel: '会员资金', group: 'finance' },
  negativeProfitReport: { label: '负盈利代理佣金报表', shortLabel: '负盈利佣金', group: 'finance' },
  reversalStats: { label: '冲正统计报表', shortLabel: '冲正统计', group: 'finance' },
  reversalRepayment: { label: '冲正回款报表', shortLabel: '冲正回款', group: 'finance' },
  venueFees: { label: '三方场馆代理费用明细', shortLabel: '场馆费用', group: 'more' },
  profile: { label: '个人中心', shortLabel: '个人中心', group: 'more' },
  activities: { label: '活动列表', shortLabel: '活动列表', group: 'more' },
}

export const H5_AGENT_ROLE_PAGES = {
  main: ['home', 'dashboard', 'agents', 'negativeProfitReport', 'reversalStats', 'profile', 'finance', 'members', 'bets', 'accountChanges', 'memberFunds', 'venueFees'],
  secondary: ['home', 'dashboard', 'agents', 'negativeProfitReport', 'reversalStats', 'profile', 'finance', 'members', 'bets', 'accountChanges', 'memberFunds', 'venueFees'],
  independent: ['home', 'dashboard', 'agents', 'negativeProfitReport', 'reversalStats', 'profile', 'finance', 'members', 'bets', 'accountChanges', 'memberFunds', 'venueFees'],
  multiLevel: ['home', 'dashboard', 'profile', 'finance', 'agents', 'members', 'bets', 'accountChanges', 'memberFunds', 'reversalStats', 'reversalRepayment', 'venueFees', 'activities'],
}

export const H5_AGENT_WORKSPACES = {
  home: ['home'],
  agent: ['dashboard', 'agents'],
  member: ['members', 'bets'],
  finance: ['finance', 'negativeProfitReport', 'reversalStats', 'reversalRepayment', 'accountChanges', 'memberFunds'],
  more: ['profile', 'venueFees', 'activities'],
}

export function roleProfile(role) {
  return AGENT_ROLE_PROFILES[role] || AGENT_ROLE_PROFILES.main
}

export function roleMeta(role) {
  return H5_AGENT_ROLES.find((item) => item.id === role) || H5_AGENT_ROLES[0]
}

export function pageAllowed(role, page) {
  return (H5_AGENT_ROLE_PAGES[role] || H5_AGENT_ROLE_PAGES.main).includes(page)
}

export function pagesForRole(role) {
  return H5_AGENT_ROLE_PAGES[role] || H5_AGENT_ROLE_PAGES.main
}

export function pagesForWorkspace(role, workspace) {
  return (H5_AGENT_WORKSPACES[workspace] || []).filter((page) => pageAllowed(role, page))
}

export function workspaceForPage(page) {
  return H5_AGENT_PAGE_META[page]?.group || 'home'
}

export function money(value, currency = '¥') {
  const amount = Number(value || 0)
  const prefix = amount < 0 ? '-' : ''
  return `${prefix}${currency}${Math.abs(amount).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function compactNumber(value) {
  return Number(value || 0).toLocaleString('zh-CN')
}

export function middleEllipsis(value, head = 8, tail = 6) {
  const text = String(value ?? '—')
  if (text.length <= head + tail + 3) return text
  return `${text.slice(0, head)}...${text.slice(-tail)}`
}

export function createFinanceState() {
  return Object.fromEntries(H5_AGENT_ROLES.map(({ id }) => [id, {
    balance: roleProfile(id).availableBalance,
    flows: [],
  }]))
}

const NOTE_SPECS = {
  home: {
    summary: '集中查看当前代理身份已有余额、经营摘要、全部桌面端同身份模块入口和本次会话资金流水。',
    fields: '代理账号、代理身份、可用余额、站点、桌面数据看板既有指标与当前身份全部模块入口。',
    logic: '首页模块入口严格来自桌面代理后台当前身份菜单；团队负责人、副线和单线代理各显示11个业务模块，多层级代理显示12个业务模块。',
    related: '关联代理数据看板、代理列表、财务中心、会员列表、负盈利代理佣金报表及冲正统计报表。',
  },
  dashboard: {
    summary: '按当前代理身份查看桌面代理数据看板的原有五组经营指标。',
    fields: '本期佣金预估或净收益、佣金余额、资金流水、代理数据和会员数据共24项原有指标。',
    logic: '四种身份复用桌面端同一指标分组；团队负责人按授权团队、副线按本人线路、单线代理按本人、多层级代理按授权下级统计。',
    related: '关联代理列表、会员列表、财务中心和场馆费用明细。',
  },
  agents: {
    summary: '按当前身份查看本人及授权下级代理资料，多层级代理可演示维护操作。',
    fields: '代理ID、账号、代理身份、代理层级、代理类型、状态、下级代理、下级会员、方案及最后登录。',
    logic: '前三种身份只读；多层级代理保留新增、修改和修改密码，所有操作仅改变前端演示状态。',
    related: '关联会员列表、财务中心、代理数据看板和负盈利代理佣金报表。',
  },
  members: {
    summary: '按当前代理身份查询授权会员的账户、投注、输赢和资金概况。',
    fields: '会员ID、账号、VIP、上级代理、有效投注、输赢、余额、充值、首存、到账和状态。',
    logic: '列表与详情均按身份范围过滤；筛选、状态和分页只作用于当前可见会员。',
    related: '关联投注记录、会员资金记录、账变流水和代理列表。',
  },
  bets: {
    summary: '查询当前身份授权会员的注单、场馆、游戏和结算结果。',
    fields: '注单号、会员、上级代理、场馆、游戏、下注详情、投注金额、有效投注、赔率、状态和时间。',
    logic: '会员账号、注单号、场馆、状态和下注金额共同过滤；下注时间与桌面端一致固定展示当前查询日期，导出和下载为前端反馈。',
    related: '关联会员列表、账变流水和场馆费用明细。',
  },
  finance: {
    summary: '展示当前身份可用额度、提现账户及近期收支，并演示四种资金操作。',
    fields: '可用余额、提现账户、流水单号、业务类型、金额、关联方、状态和时间。',
    logic: '充值增加余额，提现、内部转账和红包扣减余额；余额不足时阻止提交，成功后生成当前身份模拟流水。',
    related: '关联账变流水、会员资金记录、代理列表和个人安全设置。',
  },
  accountChanges: {
    summary: '查询会员钱包充值、上下分、转入转出及佣金冲正等账变。',
    fields: '会员ID、会员账号、账变类型、金额、时间和记录编号。',
    logic: '正数表示入账，负数表示扣减；筛选结果金额在页面中实时合计。',
    related: '关联财务中心、会员资金记录、投注记录和冲正回款。',
  },
  memberFunds: {
    summary: '查看会员充值、上分、下分等资金处理记录与结果。',
    fields: '单号、会员账号、交易类型、币种、金额、状态、创建时间和备注。',
    logic: '记录按当前身份范围过滤，正负金额与状态共同说明资金方向及处理结果。',
    related: '关联会员列表、财务中心和账变流水报表。',
  },
  negativeProfitReport: {
    summary: '只读查询当前身份授权范围内的负盈利代理佣金结果。',
    fields: '代理、周期、统计时间、团队、人数、存提款、盈亏成本、净输赢、上周期结余、返佣等级、佣金比例、佣金和代理时间。',
    logic: '团队负责人查看团队汇总并可展开团队负责人及全部副线；副线查看所属团队汇总并且只能展开本人副线；单线代理仅显示本人。页面不展示操作、佣金状态、发放、审核、维护、调整原因或佣金调整字段。',
    related: '关联代理列表、代理数据看板和账变流水报表。',
  },
  reversalStats: {
    summary: '按当前身份同步桌面端对应的冲正统计口径。',
    fields: '团队负责人、副线和单线代理展示统计日期、周期、代理、身份、层级、结算单元、line_id、上月欠站点、本期新增欠款、本期已还站点和当前欠站点；多层级代理保留原垫付与欠款统计字段。',
    logic: '团队负责人和副线查看同一团队周期汇总，单线代理只看本人；当前欠站点 = MAX（0，上月欠站点 + 本期新增欠款 − 本期已还站点）。多层级代理继续沿用原冲正统计。',
    related: '关联代理列表、负盈利代理佣金报表、账变流水；多层级代理另关联冲正回款报表。',
  },
  reversalRepayment: {
    summary: '逐笔查看多层级代理冲正垫付和后续回款明细。',
    fields: '站点、代理、ID、等级、类型、方向、额度、缺口、冲正账目ID和时间。',
    logic: '回款减少对应冲正账目的额度缺口，垫付增加待回款责任。',
    related: '关联冲正统计、账变流水和佣金结算。',
  },
  venueFees: {
    summary: '按当前身份和周期查看直属及级差三方场馆费用承担。',
    fields: '周期、站点、上级代理、代理名称、级别、返佣、场馆数、直属费用、级差费用和总费用。',
    logic: '总费用 = 直属承担三方场馆费用 + 级差三方场馆费用；总计随筛选结果变化。',
    related: '关联投注记录、代理列表和财务中心。',
  },
  profile: {
    summary: '维护当前代理身份的基本资料、登录密码和安全设置。',
    fields: '账号、身份、推广码、创建时间、昵称、手机号、邮箱、性别、密码和安全状态。',
    logic: '资料、密码和安全设置分切页演示；页面内可编辑和保存，离开页面后恢复当前身份的原始演示资料。',
    related: '关联登录身份、财务安全校验和推广链接。',
  },
  activities: {
    summary: '查看当前站点向多层级代理开放的新人礼、首充和通用活动。',
    fields: '活动编码、名称、类型、对象、开始时间、结束时间、排序、状态和详情。',
    logic: '活动支持名称、类型和日期筛选；详情仅展示生效范围，不提供审批操作。',
    related: '关联会员列表、财务红包和代理数据看板。',
  },
}

export const H5_AGENT_NOTES = Object.fromEntries(Object.entries(H5_AGENT_PAGE_META).map(([page, meta]) => {
  const spec = NOTE_SPECS[page]
  return [page, {
    title: meta.label,
    summary: spec.summary,
    fields: spec.fields,
    logic: spec.logic,
    related: spec.related,
    requirement: '将现有代理后台对应模块完整 H5 化；模块、功能、筛选、字段、状态、计算口径和操作权限与桌面端逐项一致，只采用暗夜金融风重新组织移动端信息层级。',
    acceptance: '当前身份范围与桌面端一致；桌面端已有筛选、重置、分页、详情和操作均可演示且无新增功能；完整字段可从卡片详情或横向核对模式查看；手机页面无横向溢出。',
    boundary: '纯前端演示，不连接真实接口；资金、密码、导出、下载和保存均不产生真实业务结果；桌面代理后台与原 H5 前端保持不变。',
    record: page === 'home'
      ? `修改时间：${H5_AGENT_UPDATED_AT}；修改说明：首页直接使用完整模块入口，避免重复导航；修改内容：移除财务、会员、报表和全部功能快捷区及分隔线，保留当前身份全部模块完整展开，不改变模块、字段、数据或权限。`
      : `修改时间：${H5_AGENT_UPDATED_AT}；修改说明：按桌面代理后台最新身份范围同步 H5 ${meta.label}；修改内容：仅重排桌面端现有模块、筛选、字段、数据和操作权限，不新增业务字段或功能。`,
    updatedAt: H5_AGENT_UPDATED_AT,
  }]
}))
