export const VERSION_4_UPDATED_AT = '2026-08-18 13:31'

const baseComparison = (mark, baseline, legacy, additions) => ({ mark, baseline, legacy, additions })

export const LOTTERY_HANDICAP_NOTE = {
  title: '彩票ABCD盘口设置', updatedAt: VERSION_4_UPDATED_AT,
  summary: '按站点和彩票维护A、B、C、D四类彩票赔率盘口的返水比例，并可从彩票名称下钻查看玩法返水及对应赔率。',
  fields: '所属站点、可点击的彩票名称、返水比例、彩票赔率盘口、状态、生效日期、操作人和修改时间；玩法详情包含玩法分类、彩票玩法、返水比例、对应赔率和状态。',
  logic: '同一站点、同一彩票和同一盘口只能存在一条配置；彩票名称点击后按当前彩票展示玩法级回水与赔率。返水金额 = 有效投注额 × 返水比例；赔率 = 2.00 − 返水比例 × 0.02，例如4%对应1.92、6%对应1.88；全部为前端演示数据。',
  related: '关联代理列表、返水代理、彩票会员返水和彩票会员返水报表。',
  requirement: '保留盘口配置查询、新增、修改和删除；列表中的每个彩票名称可点击打开玩法返水及赔率详情弹窗。',
  acceptance: '点击任一彩票名称可打开现有蓝色后台风格弹窗，核对玩法分类、返水百分比和公式换算后的赔率；原筛选、增改删与重复校验保持可用。',
  boundary: '纯前端演示配置，不连接真实彩票、赔率、返水、代理或结算服务；页面操作只更新当前原型状态。',
  comparison: baseComparison('新', '原总控后台 / 代理管理', '原后台无对应独立页面。', { fields: ['所属站点', '彩票名称（全选/多选/单选）', '返水比例', '彩票赔率盘口（A/B/C/D）', '玩法级返水与对应赔率', '状态与生效日期'], filters: ['所属站点', '彩票名称', '彩票赔率盘口', '状态'], views: ['新增/修改盘口设置弹窗', '彩票玩法返水及赔率详情弹窗', '删除二次确认弹窗'], actions: ['查询', '重置', '新增', '修改', '查看彩票玩法详情', '删除'], rules: ['站点+彩票+盘口不可重复', '返水金额=有效投注额×返水比例', '赔率=2.00−返水比例×0.02', '盘口固定四选一'] }),
  record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：补充彩票玩法级返水和赔率核对；修改内容：彩票名称改为可点击入口，新增玩法分类、玩法名称、返水百分比、对应赔率、状态及赔率换算说明弹窗。`,
}

const FALLBACK_AGENT_PAGE = {
  title: '返水代理授权模块', summary: '按返水代理身份查看本人及授权下级的经营和资金信息。', fields: '当前模块沿用原代理后台同名页面完整字段，并按返水代理本人及授权下级范围收窄。', logic: '返水代理只访问授权的八个模块；切换身份只改变菜单和模拟数据范围，不改写其他代理身份数据。', related: '关联彩票ABCD盘口设置、代理列表和返水代理身份切换。', requirement: '代理后台新增返水代理身份，并限制为指定八个模块。', acceptance: '切换返水代理后只显示指定菜单，页面可正常查询、筛选和查看模拟数据。', boundary: '纯前端身份和数据范围演示，不连接真实登录、权限或业务服务。',
}

const REBATE_AGENT_PAGES = new Set(['mlDashboard', 'mlProfile', 'mlFinance', 'mlAgents', 'mlMembers', 'mlBetRecords', 'mlAccountChanges', 'mlMemberFunds'])

export function version4NoteFor(key, baseNote, agentRole) {
  if (key === 'master:lotteryHandicap') return LOTTERY_HANDICAP_NOTE
  if (key === 'master:version') return { ...baseNote, title: '版本需求说明', updatedAt: VERSION_4_UPDATED_AT, summary: '按明确指令维护版本号；当前4.0归档彩票盘口、返水代理比例与赔率联动及专属看板范围。', fields: '4.0、3.0、2.0、1.0版本；总控后台、站点后台、代理后台分组；完成时间、模块说明、修改说明、功能验收和页面跳转。', logic: '版本号仅在收到明确指令时升级。4.0中返水比例按盘口上限维护并实时换算赔率；无上级代理也可调比例，彩票名称可下钻玩法详情，返水代理看板资金流水只保留充值、提现、投注和有效投注。', related: '关联彩票ABCD盘口设置、三后台代理列表、代理数据看板及返水代理八个授权模块。', requirement: '当前版本保持4.0；归档返水比例、对应赔率、彩票玩法详情及返水代理看板专属字段范围。', acceptance: '默认打开4.0；可跳转代理列表、彩票ABCD盘口设置和返水代理数据看板核对最新交互与字段。', boundary: '版本说明和全部新增能力均为纯前端演示，不连接真实服务。', record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：归档返水比例与赔率联动及专属看板精简；修改内容：补充无上级可调、A/B/C/D赔率参考、玩法详情弹窗和返水代理资金流水五项移除。` }
  if (key === 'master:agents' || key === 'site:agents') { const isSite = key.startsWith('site:'); return { ...baseNote, updatedAt: VERSION_4_UPDATED_AT, fields: `${baseNote?.fields || '代理基础资料'}；返水代理包含彩票赔率盘口、上级代理、彩票投注返水比例和彩票投注赔率；新增/修改弹窗展示A/B/C/D四盘口上限及对应赔率。`, logic: `${baseNote?.logic || ''} 无上级时比例默认6%/4%/2%/1%但允许在0至对应上限内调整；有上级时最大为5.99%/3.99%/1.99%/0.99%。赔率=2.00−返水比例×0.02，4%对应1.92、6%对应1.88。`, related: '关联彩票ABCD盘口设置、返水代理后台、代理数据看板和版本需求说明。', requirement: `${isSite ? '站点后台同步总控规则；' : ''}新增或修改返水代理时实时展示四盘口赔率参考和当前比例对应赔率，无上级也允许调整但不得超过盘口上限。`, acceptance: '无上级代理可从默认值向下调整至0并保存；有上级继续使用严格上限；弹窗可核对A/B/C/D返水百分比、对应赔率和当前设置，列表展示当前彩票投注赔率。', boundary: `纯前端代理资料演示，不创建真实账号，不连接权限、彩票或返水服务；${isSite ? '数据固定旺财体育本站范围。' : ''}`, record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：让运营直接核对返水与赔率并开放无上级向下调整；修改内容：增加四盘口赔率参考、实时赔率、列表赔率字段，取消无上级比例只读并保留盘口上限校验。` } }
  if (agentRole === 'rebate' && key.startsWith('agent:') && REBATE_AGENT_PAGES.has(key.split(':')[1])) {
    const source = baseNote || FALLBACK_AGENT_PAGE
    const isAgentList = key.endsWith(':mlAgents'), isDashboard = key.endsWith(':mlDashboard')
    return { ...source, title: key.endsWith(':mlAccountChanges') ? '账变流水记录' : source.title || FALLBACK_AGENT_PAGE.title, updatedAt: VERSION_4_UPDATED_AT, summary: `${source.summary || FALLBACK_AGENT_PAGE.summary} 当前以返水代理身份展示，仅开放授权模块。`, fields: isAgentList ? '代理ID、代理账号、代理模型、站点编码、上级代理、彩票投注返水比例、彩票投注赔率、状态、下属代理、下属会员、佣金方案和最后登录；不展示彩票赔率盘口。' : isDashboard ? '返水代理数据看板的资金流水仅展示总充值、总提现、总投注和有效投注；其他分组保持原授权字段。' : source.fields, logic: `${source.logic || FALLBACK_AGENT_PAGE.logic} 返水代理菜单固定为八个授权模块，代理后台所有身份均不展示彩票赔率盘口。${isAgentList ? ' 无上级时比例可在0.00%至6.00%调整，有上级时可在0.00%至5.99%调整，并实时换算彩票投注赔率。' : ''}${isDashboard ? ' 仅返水代理身份去除资金流水中的总盈亏、会员VIP福利、活动福利、会员推广福利和充提手续运营费，其他身份不变。' : ''}`, related: '关联总控代理列表及返水代理其他授权模块；彩票赔率盘口仅由总控后台配置和维护。', requirement: isAgentList ? '代理后台返水代理列表同步可调比例及对应赔率，但继续完全隐藏彩票赔率盘口。' : isDashboard ? '只精简返水代理身份的资金流水五项小模块，不修改其他代理身份。' : '返水代理身份只保留八个指定模块，并按返水代理本人及授权下级收窄演示数据；代理后台去除彩票赔率盘口字段。', acceptance: isAgentList ? '新增或修改返水代理时无上级也可调整0.00%至6.00%；列表和弹窗展示实时赔率但均无彩票赔率盘口。' : isDashboard ? '返水代理看板资金流水恰好保留总充值、总提现、总投注和有效投注；切换其他身份仍显示原完整资金流水。' : '切换返水代理后左侧恰好显示八个模块；进入各页可查看模拟数据且所有代理后台列表和弹窗均无彩票赔率盘口。', boundary: '纯前端角色、菜单和数据范围演示，不连接真实登录、权限、资金、会员或投注服务。', record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：同步返水代理比例赔率并精简专属看板；修改内容：${isAgentList ? '代理列表开放无上级比例调整并增加实时赔率，' : ''}${isDashboard ? '资金流水移除总盈亏及四项福利费用卡片，' : ''}代理后台继续不展示彩票赔率盘口。` }
  }
  return baseNote
}
