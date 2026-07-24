import { AGENT_ROLE_PROFILES } from '../team-agent/multi-level-agent-data'

export const H5_AGENT_UPDATED_AT = '2026-07-24 17:53'
export const H5_AGENT_ROLE_ACCESS_UPDATED_AT = '2026-07-24 17:53'
const H5_AGENT_NAV_UPDATED_AT = '2026-07-24 17:53'

export const H5_AGENT_ROLES = [
  { id: 'main', label: '团队负责人', account: 'gaodashang', scope: '本人团队及授权下级' },
  { id: 'secondary', label: '副线', account: 'WC002', scope: '本人线路及直属会员' },
  { id: 'independent', label: '单线代理', account: 'dailiwc001', scope: '本人及直属会员' },
  { id: 'multiLevel', label: '多层级代理', account: 'gaodashang', scope: '授权层级代理及会员' },
]

export const H5_AGENT_PAGE_META = {
  login: { label: '代理登录', shortLabel: '登录', group: 'home' },
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
  secondary: ['home', 'dashboard', 'negativeProfitReport', 'profile', 'finance', 'members', 'bets', 'accountChanges', 'memberFunds', 'venueFees'],
  independent: ['home', 'dashboard', 'negativeProfitReport', 'reversalStats', 'profile', 'finance', 'members', 'bets', 'accountChanges', 'memberFunds', 'venueFees'],
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
  login: {
    summary: '通过代理账号和登录密码进入H5代理后台，并按账号识别当前代理身份。',
    fields: '代理账号、登录密码、记住账号、忘记密码和登录。',
    logic: '登录成功后按代理账号进入对应身份首页；本原型提供团队负责人、副线、单线代理和多层级代理演示账号，登录只建立当前H5会话，不影响桌面代理后台身份。',
    related: '关联H5代理首页、个人中心和四种代理身份权限。',
  },
  home: {
    summary: '集中查看当前代理身份、可用额度，直接发起四项资金操作，并进入当前身份的其它业务模块。',
    fields: '代理账号、代理身份、当前可用额度、站点、四项资金操作、其它模块入口以及首页、看板、财务、个人中心、更多底部导航。',
    logic: '额度卡和四项资金操作区按紧凑手机比例展示，四项资金操作进入财务中心并直接打开对应操作；底部导航第三项固定为财务，第四项固定为个人中心，代理列表和会员列表按身份从首页“其它模块”或底部“更多”进入。一级业务页面顶部仍不展示跨模块切页。',
    related: '关联代理登录、代理数据看板、财务中心、个人中心、代理列表、会员列表和底部更多菜单。',
  },
  dashboard: {
    summary: '按当前代理身份查看桌面代理数据看板的佣金、资金、代理与会员经营指标，不提供代理列表切页。',
    fields: '多层级代理展示本期佣金预估或净收益、当前余额、未结算佣金、已结算佣金、资金流水、代理数据和会员数据；团队负责人不展示两个不适用佣金指标；副线和单线代理继续移除代理数据整组；手续费指标统一为充提手续运营费。',
    logic: '四种身份复用桌面端看板结构并按身份收窄：团队负责人按授权团队、副线按本人线路、单线代理按本人、多层级代理按授权下级统计；身份不适用的佣金指标不显示，副线和单线代理不汇总代理人数指标。',
    related: '关联代理列表、会员列表、财务中心和场馆费用明细；各模块仅通过底部菜单切换。',
  },
  agents: {
    summary: '团队负责人查看本人及授权下级代理资料，多层级代理可演示维护操作，不提供数据看板切页。',
    fields: '代理ID、账号、代理身份、代理层级、代理类型、状态、下级代理、下级会员、方案及最后登录。',
    logic: '团队负责人只读；多层级代理保留新增、修改和修改密码。副线和单线代理不展示代理列表模块；所有可用操作仅改变前端演示状态。',
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
    summary: '展示当前身份可用额度、提现账户及近期收支，并通过四个独立H5抽屉完成资金操作演示。',
    fields: '快速充值包含充值渠道、协议、充值金额、单笔限额和快捷金额；余额提现包含USDT或支付宝提现、收款账户、提现金额、可用余额和单笔限额；内部转账包含会员或代理、目标账号或ID、转账金额和流水倍数；发放红包包含当前额度、会员账号、单会员金额、流水倍数、发放时间、有效期和备注；流水展示单号、业务类型、金额、关联方、状态和时间。',
    logic: '四项操作统一使用暗色H5底部抽屉，表单内容可纵向滚动，标题与底部主按钮固定。充值增加余额，提现、内部转账和红包扣减余额；余额不足、金额无效或缺少目标账号时阻止提交，成功后生成当前身份模拟流水。',
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
    fields: '代理、周期、统计时间、团队、代理类型、代理身份、代理层级、人数、存提款、盈亏成本、红利、各活动奖励、会员推会员、净输赢、上周期结余、返佣等级、佣金比例、佣金净收益、本期欠款、总欠款、佣金和代理时间。',
    logic: '字段顺序、人数/金额类型、正负值口径和模拟数据直接复用桌面端负盈利代理佣金报表定义，只按当前代理身份收窄数据。代理类型统一显示团队代理，代理身份显示官方代理或普通代理，代理层级显示团队负责人、副线或单线代理。团队负责人查看团队汇总并可展开团队负责人及全部副线；副线仅显示本人线路记录，不展示团队汇总、团队负责人或其他副线；单线代理仅显示本人。佣金净收益右侧依次展示本期欠款和总欠款；本期欠款 = MAX(0，-净输赢)，总欠款 = MAX(0，-冲正后净输赢)。页面不展示操作、佣金状态、发放、审核、维护、调整原因或佣金调整字段。',
    related: '关联代理列表、代理数据看板和账变流水报表。',
  },
  reversalStats: {
    summary: '按当前身份同步桌面端对应的冲正统计口径。',
    fields: '团队负责人和单线代理展示账期时间、代理名称、代理身份、欠站点、还站点和剩余欠款；筛选项为账期、代理名称和代理身份。多层级代理保留原垫付与欠款统计字段。',
    logic: '字段顺序和欠款数据直接复用桌面代理后台定义。团队负责人查看所属团队账期汇总，单线代理只看本人，副线不展示本模块；账期时间展示完整起止日期，剩余欠款 = MAX（0，欠站点 − 还站点）。多层级代理继续沿用原冲正统计，不受本次调整影响。',
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
    related: '关联投注记录、代理列表和财务中心；页面只展示场馆费用内容，通过底部更多菜单进入。',
  },
  profile: {
    summary: '维护当前代理身份的基本资料、登录密码和安全设置。',
    fields: '账号、身份、推广码、创建时间、昵称、手机号、邮箱、性别、密码和安全状态。',
    logic: '个人中心只展示资料、密码和安全设置等本模块内容，不提供场馆费用或其他模块切页；页面内可编辑和保存，离开页面后恢复当前身份的原始演示资料。',
    related: '关联登录身份、财务安全校验和推广链接；通过底部个人中心入口直接进入。',
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
  const updatedAt = H5_AGENT_NAV_UPDATED_AT
  return [page, {
    title: meta.label,
    summary: spec.summary,
    fields: spec.fields,
    logic: spec.logic,
    related: spec.related,
    requirement: '将现有代理后台对应模块完整 H5 化；每个一级页面只展示自身模块内容，页面顶部不提供其他模块入口；底部导航固定为首页、看板、财务、个人中心、更多，左上返回按钮固定返回首页。',
    acceptance: '登录后进入对应身份首页；首页余额卡和四项资金操作高度较前版缩小约25%，图标语义正确且其它模块入口完整；四种身份底部导航顺序均为首页、看板、财务、个人中心、更多，财务和个人中心可直接进入；一级页面左上返回首页，完整字段和身份权限与桌面端一致。',
    boundary: '纯前端演示，不连接真实接口；资金、密码、导出、下载和保存均不产生真实业务结果；桌面代理后台与原 H5 前端保持不变。',
    record: page === 'login'
      ? `修改时间：${updatedAt}；修改说明：新增代理登录流程；修改内容：新增代理账号、登录密码、记住账号、忘记密码和登录操作，登录后按账号进入对应代理身份首页。`
      : page === 'home'
      ? `修改时间：${updatedAt}；修改说明：优化H5首页导航与模块入口；修改内容：底部导航调整为首页、看板、财务、个人中心、更多，财务移至第三项，原代理入口改为个人中心并移至第四项；代理列表和会员列表继续从其它模块或更多进入。`
      : page === 'finance'
        ? `修改时间：${updatedAt}；修改说明：将四项资金操作统一适配为H5表单；修改内容：快速充值、余额提现、内部转账和发放红包分别使用暗色底部抽屉，完整保留渠道、账户、金额、流水、时间、有效期及备注等字段，表单可滚动且主操作按钮固定。`
      : page === 'agents'
        ? `修改时间：${updatedAt}；修改说明：代理列表改为独立一级页面；修改内容：移除数据看板切页，页面只展示代理列表内容并通过底部导航进入。`
      : page === 'dashboard'
        ? `修改时间：${updatedAt}；修改说明：代理数据看板改为独立一级页面；修改内容：移除代理列表切页和顶部模块入口，只保留日期、筛选及当前身份看板指标。`
        : page === 'negativeProfitReport'
          ? `修改时间：${updatedAt}；修改说明：同步桌面代理负盈利佣金报表；修改内容：字段顺序、金额/人数格式、正负值、身份范围及推荐数据直接复用桌面定义，H5卡片展示摘要，详情抽屉和横向核对保留完整字段。`
        : page === 'reversalStats'
          ? `修改时间：${updatedAt}；修改说明：同步桌面代理冲正欠款报表；修改内容：团队负责人和单线代理共用账期时间、代理名称、代理身份、欠站点、还站点和剩余欠款字段，筛选为账期、代理名称和代理身份；副线无入口，多层级代理原报表不变。`
        : `修改时间：${updatedAt}；修改说明：将${meta.label}收拢为独立一级页面；修改内容：移除顶部跨模块入口，页面只展示本模块内容并通过底部导航切换，左上返回按钮固定返回首页。`,
    updatedAt,
  }]
}))

Object.values(H5_AGENT_NOTES).forEach((note) => {
  note.requirement = `${note.requirement} 一级页面仅保留模块标题和“业务说明”入口，页面功能摘要、修改时间与修改记录集中放入业务说明抽屉。`
  note.acceptance = `${note.acceptance} 一级页面不显示功能摘要或修改时间；打开业务说明后可查看页面功能说明、更新时间和修改记录。`
  note.record = `${note.record}；修改时间：${H5_AGENT_NAV_UPDATED_AT}；修改说明：精简H5一级页面信息；修改内容：移除页面功能摘要和修改时间，相关内容统一保留在业务说明中。`
})

const H5_AGENT_DASHBOARD_STYLE_UPDATED_AT = '2026-07-24 18:01'
H5_AGENT_NOTES.dashboard.logic = `${H5_AGENT_NOTES.dashboard.logic} 看板按桌面端数据口径使用两种暗色卡片：累计或当前状态指标使用蓝色强调底，随日期范围变化的指标使用普通深色底。`
H5_AGENT_NOTES.dashboard.requirement = '按参考看板区分累计数据与日期范围数据的卡片底色，继续沿用H5代理后台现有暗夜样式，不使用白底。'
H5_AGENT_NOTES.dashboard.acceptance = '本期佣金预估、佣金余额、代理总人数、会员总数和30天未登录会员使用蓝色强调底；资金流水、新增及活跃等日期范围指标使用普通深色底，字段和交互保持不变。'
H5_AGENT_NOTES.dashboard.record = `修改时间：${H5_AGENT_DASHBOARD_STYLE_UPDATED_AT}；修改说明：区分看板指标的数据属性；修改内容：为累计或当前状态指标增加蓝色强调底，其余日期范围指标保留普通深色底，不改变字段、数据和操作。`
H5_AGENT_NOTES.dashboard.updatedAt = H5_AGENT_DASHBOARD_STYLE_UPDATED_AT
