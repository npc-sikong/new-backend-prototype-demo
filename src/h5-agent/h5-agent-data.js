import { AGENT_ROLE_PROFILES } from '../team-agent/multi-level-agent-data'

export const H5_AGENT_UPDATED_AT = '2026-07-24 22:14'
export const H5_AGENT_ROLE_ACCESS_UPDATED_AT = '2026-07-24 17:53'
const H5_AGENT_NAV_UPDATED_AT = '2026-07-24 22:14'

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
    fields: '代理账号、代理身份、当前可用额度、站点、四项资金操作、其它模块入口以及首页、看板、财务、个人中心底部导航。',
    logic: '额度卡和四项资金操作区按紧凑手机比例展示，四项资金操作进入财务中心并直接打开对应操作；底部导航只保留首页、看板、财务和个人中心，代理列表、会员列表及其他授权模块按身份从首页“其它模块”进入。一级业务页面顶部仍不展示跨模块切页。',
    related: '关联代理登录、代理数据看板、财务中心、个人中心、代理列表、会员列表和首页其它模块入口。',
  },
  dashboard: {
    summary: '按当前代理身份查看桌面代理数据看板的佣金、资金、代理与会员经营指标，不提供代理列表切页。',
    fields: '多层级代理展示本期佣金预估或净收益、当前余额、未结算佣金、已结算佣金、资金流水、代理数据和会员数据；团队负责人不展示两个不适用佣金指标；副线和单线代理继续移除代理数据整组；四种身份统一去除代理推广会员和会员推广会员。会员VIP福利、活动福利、会员推广福利、充提手续运营费分别提供明细弹窗。',
    logic: '四种身份复用桌面端看板结构并按身份收窄：团队负责人按授权团队、副线按本人线路、单线代理按本人、多层级代理按授权下级统计；桌面与H5同步移除代理推广会员和会员推广会员，其余身份专属字段保持原口径。四个费用明细弹窗继续沿用当前身份及看板账期。',
    related: '关联代理列表、会员列表、财务中心、会员VIP福利、活动奖励、会员推广奖励和充提手续运营费。',
  },
  agents: {
    summary: '团队负责人查看本人及授权下级代理资料，多层级代理可演示维护操作，不提供数据看板切页。',
    fields: '代理ID、账号、新增代理密码、代理身份、代理层级、代理类型、状态、下级代理、下级会员、方案及最后登录。',
    logic: '团队负责人只读；多层级代理新增时必须设置至少6位密码，修改资料时不展示密码，密码仅通过独立修改密码操作维护。副线和单线代理不展示代理列表模块。',
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
    fields: '快速充值包含充值渠道、协议、充值金额、单笔限额和快捷金额；余额提现包含USDT或支付宝提现、收款账户、支付宝真实姓名、提现金额、可用余额和单笔限额；内部转账包含会员或代理、目标账号或ID、转账金额和流水倍数；发放红包包含当前额度、会员账号、单会员金额、流水倍数、发放时间、有效期和备注；流水展示单号、业务类型、金额、关联方、状态和时间。',
    logic: '四项操作统一使用暗色H5底部抽屉，表单内容可纵向滚动，标题与底部主按钮固定。支付宝提现按收款信息卡、支付宝账号、真实姓名、提现金额、余额、1至10000元限额和提现时段依次展示；账号、姓名、金额或余额校验失败时阻止提交，成功后扣减余额并生成当前身份模拟流水。',
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
    fields: '序号、代理账号及展开入口、周期、统计时间、团队、代理类型、推荐人、代理身份、代理层级、人数、存提款、总输赢、历史总输赢、运营费用、历史运营费用、三方场馆费用、充提手续费、返佣等级、返佣比例、历史结余佣金、场馆费、净输赢、佣金净收益、欠站点总额、佣金和代理时间。',
    logic: '字段顺序、人数/金额类型、正负值口径和模拟数据直接复用桌面端负盈利代理佣金报表定义，只按当前代理身份收窄数据。历史运营费用和本期运营费用均可点击查看活动奖励、会员推会员、返水、礼金、人工发彩金和余额宝利息明细；佣金净收益 =（总输赢 + 历史总输赢）× 返佣比例 − 运营费用 − 历史运营费用 − 三方场馆费用 − 充提手续费。报表不展示本期欠款、账户调整、存款手续费和提款手续费，总欠款统一显示为欠站点总额。序号排在最前，团队记录不展示独立加减号，代理账号右侧使用“（展开）/（收起）”。代理类型统一显示团队代理，代理身份显示官方代理或普通代理，代理层级显示团队负责人、副线或单线代理。团队负责人查看团队汇总并可展开团队负责人及全部副线；副线仅显示本人线路记录，不展示团队汇总、团队负责人或其他副线；单线代理仅显示本人。页面不展示操作、佣金状态、发放、审核、维护、调整原因或佣金调整字段。',
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
    related: '关联投注记录、代理列表和财务中心；页面只展示场馆费用内容，通过首页其它模块入口进入。',
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
  const updatedAt = page === 'negativeProfitReport' ? '2026-07-25 21:25' : page === 'dashboard' ? '2026-08-19 15:35' : page === 'agents' ? '2026-08-19 16:26' : H5_AGENT_NAV_UPDATED_AT
  return [page, {
    title: meta.label,
    summary: spec.summary,
    fields: spec.fields,
    logic: spec.logic,
    related: spec.related,
    requirement: '将现有代理后台对应模块完整 H5 化；每个一级页面只展示自身模块内容，页面顶部不提供其他模块入口；底部导航固定为首页、看板、财务、个人中心，左上返回按钮固定返回首页。',
    acceptance: '登录后进入对应身份首页；首页余额卡和四项资金操作高度较前版缩小约25%，图标语义正确且其它模块入口完整；四种身份底部导航顺序均为首页、看板、财务、个人中心，不展示更多；财务和个人中心可直接进入，其他授权模块从首页其它模块进入；一级页面左上返回首页，完整字段和身份权限与桌面端一致。',
    boundary: '纯前端演示，不连接真实接口；资金、密码、导出、下载和保存均不产生真实业务结果；桌面代理后台与原 H5 前端保持不变。',
    record: page === 'login'
      ? `修改时间：${updatedAt}；修改说明：新增代理登录流程；修改内容：新增代理账号、登录密码、记住账号、忘记密码和登录操作，登录后按账号进入对应代理身份首页。`
      : page === 'home'
      ? `修改时间：${updatedAt}；修改说明：精简H5底部导航；修改内容：移除“更多”，底部只保留首页、看板、财务、个人中心；代理列表、会员列表及其他授权模块统一从首页其它模块进入。`
      : page === 'finance'
        ? `修改时间：2026-07-25 14:35；修改说明：按参考图重构支付宝提现切页；修改内容：支付宝提现增加未设置账户提示卡、支付宝账号、真实姓名、提现金额、当前余额、1至10000元单笔限额和提现时段，并补充账号、姓名、金额与余额校验。`
      : page === 'agents'
        ? `修改时间：${updatedAt}；修改说明：分离代理创建密码与资料修改；修改内容：新增代理增加至少6位密码字段，修改代理不展示密码，独立修改密码操作保持不变。`
      : page === 'dashboard'
        ? `修改时间：${updatedAt}；修改说明：精简代理数据看板推广指标；修改内容：四种身份同步去除代理推广会员和会员推广会员，保留其余身份专属指标和费用明细。`
        : page === 'negativeProfitReport'
          ? `修改时间：${updatedAt}；修改说明：同步负盈利佣金报表历史盈亏与费用口径；修改内容：增加历史总输赢、历史运营费用及可点击明细，充提手续费右侧展示返佣等级，返佣比例移至历史结余佣金左侧；移除本期欠款、账户调整及存提款手续费，总欠款改为欠站点总额，卡片、详情与横向核对同步。`
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

const H5_AGENT_DASHBOARD_STYLE_UPDATED_AT = '2026-07-25 13:43'
H5_AGENT_NOTES.dashboard.logic = `${H5_AGENT_NOTES.dashboard.logic} 看板按桌面端数据口径使用两种暗色卡片：累计或当前状态指标使用蓝色强调底，随日期范围变化的指标使用普通深色底。`
H5_AGENT_NOTES.dashboard.requirement = '在现有暗夜看板中补齐会员VIP福利、活动福利、会员推广福利和充提手续运营费四个查看明细弹窗，完整保留参考图的字段、账期、金额合计和提示。'
H5_AGENT_NOTES.dashboard.acceptance = '点击四张费用卡的查看明细可分别打开对应H5暗色弹窗；每个弹窗标题、五列表头、账期、空状态、金额合计、提示和关闭操作正确，宽表仅在弹窗内部横向滚动，页面无横向溢出。'
H5_AGENT_NOTES.dashboard.record = `修改时间：${H5_AGENT_DASHBOARD_STYLE_UPDATED_AT}；修改说明：补齐看板四类费用下钻；修改内容：新增会员VIP福利、活动福利、会员推广福利和充提手续运营费四个独立明细弹窗，并同步账期、字段、合计、提示及H5暗夜排版。`
H5_AGENT_NOTES.dashboard.updatedAt = H5_AGENT_DASHBOARD_STYLE_UPDATED_AT

const H5_AGENT_PROFILE_SECURITY_UPDATED_AT = '2026-07-25 14:27'
H5_AGENT_NOTES.profile.fields = '账号、身份、推广码、创建时间、昵称、手机号、邮箱、性别、密码、谷歌验证器状态、绑定二维码、密钥、6位动态验证码和安全建议。'
H5_AGENT_NOTES.profile.logic = '个人中心保留基本资料、修改密码和安全设置三个切页。安全设置使用谷歌身份验证器作为登录及敏感操作的二次校验；点击立即绑定后展示下载入口、二维码、可复制密钥和6位动态验证码，验证码格式正确后仅更新当前H5前端演示状态。'
H5_AGENT_NOTES.profile.requirement = '按参考图重构H5个人中心安全设置，保留暗夜金融风并完整展示谷歌验证器状态卡、安全建议和绑定流程。'
H5_AGENT_NOTES.profile.acceptance = '安全设置切页可查看谷歌身份验证器用途、开启状态和两条安全建议；点击立即绑定可打开H5绑定抽屉，二维码、密钥复制、6位验证码校验、确认绑定、取消及关闭操作可用，页面无横向溢出。'
H5_AGENT_NOTES.profile.record = `修改时间：${H5_AGENT_PROFILE_SECURITY_UPDATED_AT}；修改说明：补齐H5个人中心二次验证流程；修改内容：重构安全设置状态卡与安全建议，新增谷歌验证器绑定抽屉、二维码、下载入口、密钥复制、动态验证码校验及绑定成功状态。`
H5_AGENT_NOTES.profile.updatedAt = H5_AGENT_PROFILE_SECURITY_UPDATED_AT
