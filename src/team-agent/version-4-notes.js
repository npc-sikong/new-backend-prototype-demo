export const VERSION_4_UPDATED_AT = '2026-08-19 16:26'

const baseComparison = (mark, baseline, legacy, additions) => ({ mark, baseline, legacy, additions })

export const LOTTERY_HANDICAP_NOTE = {
  title: '彩票ABCD盘口设置', updatedAt: VERSION_4_UPDATED_AT,
  summary: '按站点和彩票维护彩票赔率盘口配置，可使用A、B、C、D，也可新增E、F或其它自定义盘口，并从彩票名称下钻查看玩法对应赔率。',
  fields: '列表包含所属站点、可点击的彩票名称、返水比例、彩票赔率盘口、状态、生效日期、操作人和修改时间；新增或修改只维护站点、返水比例、盘口名称和彩票名称；玩法详情只包含玩法分类、彩票玩法和对应赔率。',
  logic: '同一站点、同一彩票和同一盘口只能存在一条配置；盘口名称允许自定义。彩票名称点击后按当前彩票展示玩法级赔率，不展示回水字段；新增或修改不再维护状态和生效日期，全部为前端演示数据。',
  related: '关联代理列表、返水代理、彩票会员返水和彩票会员返水报表。',
  requirement: '保留盘口配置查询、新增、修改和删除；新增或修改支持自定义盘口且去除状态和生效日期；玩法详情去除回水整列、换算口径说明和启用状态。',
  acceptance: '可输入E盘、F盘或其它盘口并保存；新增或修改弹窗不出现状态和生效日期；点击彩票名称后只核对玩法分类、彩票玩法和对应赔率。',
  boundary: '纯前端演示配置，不连接真实彩票、赔率、返水、代理或结算服务；页面操作只更新当前原型状态。',
  comparison: baseComparison('新', '原总控后台 / 代理管理', '原后台无对应独立页面。', { fields: ['所属站点', '彩票名称（全选/多选/单选）', '返水比例', '彩票赔率盘口（支持自定义）', '玩法级对应赔率'], filters: ['所属站点', '彩票名称', '彩票赔率盘口', '状态'], views: ['新增/修改盘口设置弹窗', '彩票玩法及赔率详情弹窗', '删除二次确认弹窗'], actions: ['查询', '重置', '新增', '修改', '查看彩票玩法详情', '删除'], rules: ['站点+彩票+盘口不可重复', '盘口支持A/B/C/D/E/F及其它名称', '玩法详情不展示回水字段'] }),
  record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：精简玩法详情核对字段；修改内容：玩法详情删除回水整列，只保留玩法分类、彩票玩法和对应赔率。`,
}

const FALLBACK_AGENT_PAGE = {
  title: '返水代理授权模块', summary: '按返水代理身份查看本人及授权下级的经营和资金信息。', fields: '当前模块沿用原代理后台同名页面完整字段，并按返水代理本人及授权下级范围收窄。', logic: '返水代理只访问授权的八个模块；切换身份只改变菜单和模拟数据范围，不改写其他代理身份数据。', related: '关联彩票ABCD盘口设置、代理列表和返水代理身份切换。', requirement: '代理后台新增返水代理身份，并限制为指定八个模块。', acceptance: '切换返水代理后只显示指定菜单，页面可正常查询、筛选和查看模拟数据。', boundary: '纯前端身份和数据范围演示，不连接真实登录、权限或业务服务。',
}

const REBATE_AGENT_PAGES = new Set(['mlDashboard', 'mlProfile', 'mlFinance', 'mlAgents', 'mlMembers', 'mlBetRecords', 'mlAccountChanges', 'mlMemberFunds'])

export function version4NoteFor(key, baseNote, agentRole) {
  if (key === 'master:lotteryHandicap') return LOTTERY_HANDICAP_NOTE
  if (key === 'master:version') return { ...baseNote, title: '版本需求说明', updatedAt: VERSION_4_UPDATED_AT, summary: '按明确指令维护版本号；当前4.0归档自定义彩票盘口、返水代理上下级联动及代理看板精简。', fields: '4.0、3.0、2.0、1.0版本；总控后台、站点后台、代理后台分组；完成时间、模块说明、修改说明、功能验收和页面跳转。', logic: '版本号仅在收到明确指令时升级。4.0中有上级返水代理必须同步上级盘口；无上级时比例固定为当前盘口上限且不可修改；盘口配置支持自定义名称；代理数据看板不再展示会员推广会员和代理推广会员。', related: '关联彩票ABCD盘口设置、三后台代理列表、代理数据看板及返水代理八个授权模块。', requirement: '当前版本保持4.0；归档返水代理盘口继承、无上级固定比例、自定义盘口、玩法详情精简及代理看板指标调整。', acceptance: '默认打开4.0；可跳转代理列表核对无上级比例只读，并进入彩票ABCD盘口设置和返水代理数据看板核对最新交互与字段。', boundary: '版本说明和全部新增能力均为纯前端演示，不连接真实服务。', record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：锁定无上级返水代理的盘口上限比例；修改内容：无上级时比例自动取A盘6%、B盘4%、C盘2%或D盘1%并禁用输入，有上级继续按现有规则调整。` }
  if (key === 'master:agents' || key === 'site:agents') { const isSite = key.startsWith('site:'); return { ...baseNote, updatedAt: VERSION_4_UPDATED_AT, fields: `${baseNote?.fields || '代理基础资料'}；返水代理弹窗按上级代理、彩票赔率盘口、彩票投注返水比例顺序展示；盘口选项内直接展示A/B/C/D上限及赔率参考。`, logic: `${baseNote?.logic || ''} 有上级时盘口同步上级代理且不可选择；无上级时可选择盘口，但返水比例固定为A盘6%、B盘4%、C盘2%或D盘1%且不可修改；返水代理不设置承担全部运营费。`, related: '关联彩票ABCD盘口设置、返水代理后台、代理数据看板和版本需求说明。', requirement: `${isSite ? '站点后台同步总控规则；' : ''}无上级返水代理的彩票投注返水比例必须自动取当前盘口上限并保持只读；切换盘口时同步刷新固定比例。`, acceptance: '选择无上级代理后，比例输入框禁用；切换A/B/C/D盘口分别自动显示6.00%、4.00%、2.00%、1.00%；选择上级代理后继续按上级盘口规则处理。', boundary: `纯前端代理资料演示，不创建真实账号，不连接权限、彩票或返水服务；${isSite ? '数据固定旺财体育本站范围。' : ''}`, record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：防止无上级返水代理偏离盘口默认值；修改内容：无上级比例改为只读并随盘口自动带出固定上限，有上级保持原可调范围。` } }
  if (agentRole === 'rebate' && key.startsWith('agent:') && REBATE_AGENT_PAGES.has(key.split(':')[1])) {
    const source = baseNote || FALLBACK_AGENT_PAGE
    const isAgentList = key.endsWith(':mlAgents'), isDashboard = key.endsWith(':mlDashboard')
    return { ...source, title: key.endsWith(':mlAccountChanges') ? '账变流水记录' : source.title || FALLBACK_AGENT_PAGE.title, updatedAt: VERSION_4_UPDATED_AT, summary: `${source.summary || FALLBACK_AGENT_PAGE.summary} 当前以返水代理身份展示，仅开放授权模块。`, fields: isAgentList ? '代理ID、代理账号、新增代理密码、代理模型、站点编码、上级代理、彩票投注返水比例、彩票投注赔率、状态、下属代理、下属会员、佣金方案和最后登录；修改资料时不展示代理密码。' : isDashboard ? '返水代理数据看板的资金流水仅展示总充值、总提现、总投注和有效投注；会员数据不展示代理推广会员和会员推广会员。' : source.fields, logic: `${source.logic || FALLBACK_AGENT_PAGE.logic} 返水代理菜单固定为八个授权模块，代理后台所有身份均不展示彩票赔率盘口。${isAgentList ? ' 新增代理必须设置至少6位密码；修改代理资料不展示或修改密码，独立修改密码操作保持不变；无上级时彩票投注返水比例固定为6.00%。' : ''}${isDashboard ? ' 返水代理继续去除资金流水中的总盈亏、会员VIP福利、活动福利、会员推广福利和充提手续运营费；全部代理身份同步去除代理推广会员和会员推广会员。' : ''}`, related: '关联总控代理列表及返水代理其他授权模块；彩票赔率盘口仅由总控后台配置和维护。', requirement: isAgentList ? '代理后台返水代理新增弹窗增加必填代理密码；修改代理资料弹窗不得展示或修改密码，独立修改密码操作继续保留。' : isDashboard ? '代理数据看板去除代理推广会员和会员推广会员；返水代理专属资金流水精简继续生效。' : '返水代理身份只保留八个指定模块，并按返水代理本人及授权下级收窄演示数据；代理后台去除彩票赔率盘口字段。', acceptance: isAgentList ? '新增返水代理可输入至少6位密码并保存；修改返水代理不出现密码字段；独立修改密码入口仍可使用。' : isDashboard ? '四种身份的代理数据看板均无代理推广会员和会员推广会员；返水代理资金流水仍只保留四项。' : '切换返水代理后左侧恰好显示八个模块；进入各页可查看模拟数据且所有代理后台列表和弹窗均无彩票赔率盘口。', boundary: '纯前端角色、菜单和数据范围演示，不连接真实登录、权限、资金、会员或投注服务。', record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：分离代理创建密码与资料修改；修改内容：${isAgentList ? '新增代理增加至少6位密码，修改资料不展示密码，' : ''}${isDashboard ? '移除代理推广会员和会员推广会员，' : ''}独立修改密码操作保持不变。` }
  }
  return baseNote
}
