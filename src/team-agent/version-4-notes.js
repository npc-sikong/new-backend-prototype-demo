export const VERSION_4_UPDATED_AT = '2026-08-17 18:15'

const baseComparison = (mark, baseline, legacy, additions) => ({ mark, baseline, legacy, additions })

export const LOTTERY_HANDICAP_NOTE = {
  title: '彩票ABCD盘口设置', updatedAt: VERSION_4_UPDATED_AT,
  summary: '按站点和彩票维护A、B、C、D四类彩票赔率盘口的返水比例，并提供配置列表维护。',
  fields: '所属站点、彩票名称、返水比例、彩票赔率盘口、状态、生效日期、操作人和修改时间；彩票名称支持全选、多选或单选，盘口在A、B、C、D中四选一。',
  logic: '同一站点、同一彩票和同一盘口只能存在一条配置。一次选择多个彩票时按同一返水比例和盘口形成一组配置；返水金额 = 有效投注额 × 返水比例。停用配置保留历史展示，但不作为新增返水代理的当前推荐设置。',
  related: '关联代理列表、返水代理、彩票会员返水和彩票会员返水报表。',
  requirement: '在总控后台代理管理下新增独立“彩票ABCD盘口设置(新)”入口，支持配置查询、新增、修改和删除。',
  acceptance: '可按站点、彩票、盘口和状态筛选；新增或修改时可全选、多选或单选彩票并四选一盘口；重复配置和无效比例不可保存；删除需二次确认。',
  boundary: '纯前端演示配置，不连接真实彩票、赔率、返水、代理或结算服务；页面操作只更新当前原型状态。',
  comparison: baseComparison('新', '原总控后台 / 代理管理', '原后台无对应独立页面。', { fields: ['所属站点', '彩票名称（全选/多选/单选）', '返水比例', '彩票赔率盘口（A/B/C/D）', '状态与生效日期'], filters: ['所属站点', '彩票名称', '彩票赔率盘口', '状态'], views: ['新增/修改盘口设置弹窗', '删除二次确认弹窗'], actions: ['查询', '重置', '新增', '修改', '删除'], rules: ['站点+彩票+盘口不可重复', '返水金额=有效投注额×返水比例', '盘口固定四选一'] }),
  record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：为彩票返水代理建立站点、彩票与赔率盘口的比例配置；修改内容：新增独立菜单、筛选列表、彩票多选、A/B/C/D盘口四选一、返水比例、状态、生效日期及增改删弹窗。`,
}

const FALLBACK_AGENT_PAGE = {
  title: '返水代理授权模块', summary: '按返水代理身份查看本人及授权下级的经营和资金信息。', fields: '当前模块沿用原代理后台同名页面完整字段，并按返水代理本人及授权下级范围收窄。', logic: '返水代理只访问授权的八个模块；切换身份只改变菜单和模拟数据范围，不改写其他代理身份数据。', related: '关联彩票ABCD盘口设置、代理列表和返水代理身份切换。', requirement: '代理后台新增返水代理身份，并限制为指定八个模块。', acceptance: '切换返水代理后只显示指定菜单，页面可正常查询、筛选和查看模拟数据。', boundary: '纯前端身份和数据范围演示，不连接真实登录、权限或业务服务。',
}

const REBATE_AGENT_PAGES = new Set(['mlDashboard', 'mlProfile', 'mlFinance', 'mlAgents', 'mlMembers', 'mlBetRecords', 'mlAccountChanges', 'mlMemberFunds'])

export function version4NoteFor(key, baseNote, agentRole) {
  if (key === 'master:lotteryHandicap') return LOTTERY_HANDICAP_NOTE
  if (key === 'master:version') return { ...baseNote, title: '版本需求说明', updatedAt: VERSION_4_UPDATED_AT, summary: '按明确指令维护版本号；当前4.0归档彩票盘口配置、返水代理类型、上下级关系及彩票投注返水比例。', fields: '4.0、3.0、2.0、1.0版本；总控后台、站点后台、代理后台分组；完成时间、模块说明、修改说明、功能验收和页面跳转。', logic: '版本号仅在收到明确指令时升级。本次4.0新增彩票ABCD盘口设置和返水代理类型；总控、站点和代理后台同步返水代理的上级代理及彩票投注返水比例，代理后台仍隐藏彩票赔率盘口。', related: '关联彩票ABCD盘口设置、三后台代理列表、代理数据看板及返水代理八个授权模块。', requirement: '当前版本保持4.0；归档返水代理的上级代理、盘口默认比例和有上级时的严格上限规则。', acceptance: '默认打开4.0；可核对三后台代理列表的返水代理上下级及比例规则，并跳转对应页面。', boundary: '版本说明和全部新增能力均为纯前端演示，不连接真实服务。', record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：归档返水代理上下级与彩票投注返水比例；修改内容：补充三后台代理列表、盘口默认比例、有上级严格小于默认值及代理后台隐藏盘口规则。` }
  if (key === 'master:agents' || key === 'site:agents') { const isSite = key.startsWith('site:'); return { ...baseNote, updatedAt: VERSION_4_UPDATED_AT, fields: `${baseNote?.fields || '代理基础资料'}；返水代理包含彩票赔率盘口、上级代理和彩票投注返水比例。`, logic: `${baseNote?.logic || ''} 新增或修改返水代理时选择A/B/C/D盘口和可选上级代理；无上级时比例固定为6%/4%/2%/1%，有上级时可输入0%，并必须严格低于对应盘口默认值，最大为5.99%/3.99%/1.99%/0.99%。`, related: '关联彩票ABCD盘口设置、返水代理后台、代理数据看板和版本需求说明。', requirement: `${isSite ? '站点后台同步总控规则；' : ''}返水代理支持设置上级代理和彩票投注返水比例，并按盘口联动默认值与上限。`, acceptance: '新增和修改返水代理时可选择上级代理；无上级比例自动锁定默认值，有上级可设置0至对应上限，超限不可保存；列表展示上级代理和比例。', boundary: `纯前端代理资料演示，不创建真实账号，不连接权限、彩票或返水服务；${isSite ? '数据固定旺财体育本站范围。' : ''}`, record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：建立返水代理上下级及彩票投注返水比例规则；修改内容：新增上级代理、比例字段、盘口默认值联动、有上级严格上限校验和列表展示。` } }
  if (agentRole === 'rebate' && key.startsWith('agent:') && REBATE_AGENT_PAGES.has(key.split(':')[1])) {
    const source = baseNote || FALLBACK_AGENT_PAGE
    const isAgentList = key.endsWith(':mlAgents')
    return { ...source, title: key.endsWith(':mlAccountChanges') ? '账变流水记录' : source.title || FALLBACK_AGENT_PAGE.title, updatedAt: VERSION_4_UPDATED_AT, summary: `${source.summary || FALLBACK_AGENT_PAGE.summary} 当前以返水代理身份展示，仅开放授权模块。`, fields: isAgentList ? '代理ID、代理账号、代理模型、站点编码、上级代理、彩票投注返水比例、状态、下属代理、下属会员、佣金方案和最后登录；不展示彩票赔率盘口。' : source.fields, logic: `${source.logic || FALLBACK_AGENT_PAGE.logic} 返水代理菜单固定为八个授权模块，代理后台所有身份均不展示彩票赔率盘口。${isAgentList ? ' 返水代理可设置上级代理；无上级时按隐藏的A盘默认值固定6.00%，有上级时比例可为0.00%至5.99%。' : ''}`, related: '关联总控代理列表及返水代理其他授权模块；彩票赔率盘口仅由总控后台配置和维护。', requirement: isAgentList ? '代理后台返水代理列表同步上级代理和彩票投注返水比例，但继续完全隐藏彩票赔率盘口。' : '返水代理身份只保留八个指定模块，并按返水代理本人及授权下级收窄演示数据；代理后台去除彩票赔率盘口字段。', acceptance: isAgentList ? '新增或修改返水代理时可选上级；无上级固定6.00%，有上级可输入0.00%至5.99%，超限不可保存；列表和弹窗均无彩票赔率盘口。' : '切换返水代理后左侧恰好显示八个模块；进入各页可查看模拟数据且所有代理后台列表和弹窗均无彩票赔率盘口。', boundary: '纯前端角色、菜单和数据范围演示，不连接真实登录、权限、资金、会员或投注服务。', record: `修改时间：${VERSION_4_UPDATED_AT}；修改说明：同步返水代理上下级和比例并继续隐藏盘口；修改内容：${isAgentList ? '代理列表新增上级代理、彩票投注返水比例及0.00%至5.99%校验，' : ''}代理后台所有列表及弹窗不展示彩票赔率盘口。` }
  }
  return baseNote
}
