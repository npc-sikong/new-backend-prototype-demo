export const UPDATED_AT = '2026-07-14 16:10'
export const MEMBER_TURNOVER_UPDATED_AT = '2026-07-14 23:40'

export const INITIAL_STATE = {
  agents: [
    { id: '345', account: 'gaodashang', model: '多层级代理', settlementMode: '团队模式', identity: '主管主线', unit: '代理1部', lineId: 'LINE-A', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: '无上级代理', subAgents: 8, members: 207, plan: '旺财团队月结方案', balance: 79806.45 },
    { id: '373', account: 'WC002', model: '多层级代理', settlementMode: '团队模式', identity: '副线负责人', unit: '代理1部', lineId: 'LINE-B', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'gaodashang', subAgents: 2, members: 31, plan: '随团队统一方案', balance: 3100 },
    { id: '374', account: 'LGNB', model: '多层级代理', settlementMode: '团队模式', identity: '副线负责人', unit: '代理1部', lineId: 'LINE-C', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'gaodashang', subAgents: 1, members: 22, plan: '随团队统一方案', balance: 2850 },
    { id: '1749', account: 'dailiwc001', model: '多层级代理', settlementMode: '独立单线', identity: '独立线主', unit: '独立单线01', lineId: 'SINGLE-001', effectiveCycle: '2026-07', site: '旺财体育', status: '启用', parent: 'apppay', subAgents: 1, members: 18, plan: '独立单线月结方案', balance: 68903.14 },
    { id: '1750', account: 'dailiwc001a', model: '多层级代理', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '旺财体育', status: '启用', parent: 'hddaili', subAgents: 0, members: 4, plan: '多层级返佣方案', balance: 1920 },
    { id: '1774', account: 'charles', model: '普通代理', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '旺财体育', status: '启用', parent: '无上级代理', subAgents: 0, members: 3, plan: '多层级返佣方案', balance: 1960 },
    { id: '1109', account: 'FEE0428_A8', model: '多层级代理', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '财神客栈', status: '启用', parent: '无上级代理', subAgents: 4, members: 7, plan: '财神Excel0419返佣方案', balance: 15000 },
    { id: '768', account: 'NA7', model: '多层级代理', settlementMode: '原代理模式', identity: '—', unit: '—', lineId: '—', effectiveCycle: '—', site: '财神客栈', status: '停用', parent: '无上级代理', subAgents: 0, members: 1, plan: '多层级返佣方案', balance: 8000 },
  ],
  teams: [
    {
      id: 'TEAM-001', code: 'DPT-001', name: '代理1部', site: '旺财体育', currency: 'CNY', mainAgent: 'gaodashang', plan: '旺财团队月结方案', status: '生效中', startCycle: '2026-07', endCycle: '长期', previousNegative: 12000,
      cumulativeReceived: 220000, successfulTransfers: 28000, processingOccupied: 15000, otherDeductions: 3200,
      metrics: { newActive: 36, activeMembers: 128, memberWinLoss: 520000, expenses: 104000, adjustment: 8000, currentNet: 424000, assessmentNet: 412000, commissionableNet: 412000, grade: '五星', rate: 0.5, payable: 206000 },
      lines: [
        { lineId: 'LINE-A', identity: '主线', agent: 'gaodashang', scope: '主线直属代理及会员', newActive: 18, activeMembers: 68, netWinLoss: 218000, status: '生效中', startCycle: '2026-07' },
        { lineId: 'LINE-B', identity: '副线', agent: 'WC002', scope: 'WC002 节点及直属会员', newActive: 11, activeMembers: 37, netWinLoss: 146000, status: '生效中', startCycle: '2026-07' },
        { lineId: 'LINE-C', identity: '副线', agent: 'LGNB', scope: 'LGNB 节点及直属会员', newActive: 7, activeMembers: 23, netWinLoss: 50000, status: '生效中', startCycle: '2026-07' },
      ],
    },
    {
      id: 'TEAM-002', code: 'DPT-002', name: '代理2部', site: '旺财体育', currency: 'CNY', mainAgent: 'apppay', plan: '旺财团队月结方案', status: '待生效', startCycle: '2026-08', endCycle: '长期', previousNegative: 0,
      cumulativeReceived: 0, successfulTransfers: 0, processingOccupied: 0, otherDeductions: 0,
      metrics: { newActive: 0, activeMembers: 0, memberWinLoss: 0, expenses: 0, adjustment: 0, currentNet: 0, assessmentNet: 0, commissionableNet: 0, grade: '零级', rate: 0, payable: 0 },
      lines: [
        { lineId: 'LINE-D', identity: '主线', agent: 'apppay', scope: '主线直属代理及会员', newActive: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: '2026-08' },
        { lineId: 'LINE-E', identity: '副线', agent: 'dailiwc001', scope: '独立单线01原业务范围', newActive: 0, activeMembers: 0, netWinLoss: 0, status: '待生效', startCycle: '2026-08' },
      ],
    },
  ],
  singles: [
    { id: 'SINGLE-001', code: 'SL-001', name: '独立单线01', owner: 'dailiwc001', site: '旺财体育', currency: 'CNY', source: '站点直接创建', recommender: 'apppay', plan: '独立单线月结方案', rewardPlan: '推荐奖励10%方案', status: '生效中·待转入', startCycle: '2026-07', scope: '线主本人代理节点', metrics: { newActive: 12, activeMembers: 46, currentNet: 170000, previousNegative: 0, assessmentNet: 170000, grade: '四星', rate: 0.4, payable: 68000 } },
    { id: 'SINGLE-002', code: 'SL-002', name: 'WC002 独立单线', owner: 'WC002', site: '旺财体育', currency: 'CNY', source: '副线转独立', recommender: 'gaodashang', plan: '独立单线月结方案', rewardPlan: '推荐奖励10%方案', status: '待生效', startCycle: '2026-08', scope: '原 LINE-B 业务范围', metrics: { newActive: 0, activeMembers: 0, currentNet: 0, previousNegative: 0, assessmentNet: 0, grade: '待计算', rate: 0, payable: 0 } },
  ],
  plans: [
    { id: 'PLAN-T-001', type: '团队佣金方案', name: '旺财团队月结方案', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', levels: [
      { grade: '一星', newActive: 5, activeMembers: 20, netWinLoss: 50000, rate: 0.3 },
      { grade: '二星', newActive: 10, activeMembers: 40, netWinLoss: 100000, rate: 0.35 },
      { grade: '三星', newActive: 15, activeMembers: 60, netWinLoss: 180000, rate: 0.4 },
      { grade: '四星', newActive: 25, activeMembers: 90, netWinLoss: 280000, rate: 0.45 },
      { grade: '五星', newActive: 35, activeMembers: 120, netWinLoss: 400000, rate: 0.5 },
      { grade: '六星', newActive: 50, activeMembers: 180, netWinLoss: 650000, rate: 0.55 },
    ] },
    { id: 'PLAN-S-001', type: '独立单线方案', name: '独立单线月结方案', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', levels: [
      { grade: '一星', newActive: 3, activeMembers: 10, netWinLoss: 30000, rate: 0.25 },
      { grade: '二星', newActive: 5, activeMembers: 20, netWinLoss: 60000, rate: 0.3 },
      { grade: '三星', newActive: 8, activeMembers: 30, netWinLoss: 100000, rate: 0.35 },
      { grade: '四星', newActive: 12, activeMembers: 45, netWinLoss: 160000, rate: 0.4 },
    ] },
    { id: 'PLAN-R-001', type: '推荐奖励方案', name: '推荐奖励10%方案', site: '旺财体育', effectiveCycle: '2026-07', status: '生效中', rewardRate: 0.1, rewardBase: '独立单线已审核应付佣金', deductedFromSingle: false },
    { id: 'PLAN-H-001', type: '历史代理方案', name: '多层级返佣方案', site: '全部站点', effectiveCycle: '历史兼容', status: '历史查询', levels: [] },
  ],
  bills: [
    { id: 'BILL-T-202607-001', type: '团队佣金', unitId: 'TEAM-001', unitName: '代理1部', payee: 'gaodashang', site: '旺财体育', cycle: '2026-07', grade: '五星', rate: 0.5, netWinLoss: 412000, payable: 206000, issued: 120000, state: '部分发放', recommender: '—', createdAt: '2026-07-14 02:05' },
    { id: 'BILL-S-202607-001', type: '独立单线佣金', unitId: 'SINGLE-001', unitName: '独立单线01', payee: 'dailiwc001', site: '旺财体育', cycle: '2026-07', grade: '四星', rate: 0.4, netWinLoss: 170000, payable: 68000, issued: 0, state: '待发放', recommender: 'apppay', createdAt: '2026-07-14 02:06' },
    { id: 'BILL-R-202607-001', type: '推荐奖励', unitId: 'SINGLE-001', unitName: '独立单线01', payee: 'apppay', site: '旺财体育', cycle: '2026-07', grade: '—', rate: 0.1, netWinLoss: 68000, payable: 6800, issued: 0, state: '待审核', recommender: 'apppay', createdAt: '2026-07-14 02:07' },
    { id: 'BILL-T-202608-002', type: '团队佣金', unitId: 'TEAM-002', unitName: '代理2部', payee: 'apppay', site: '旺财体育', cycle: '2026-08', grade: '一星', rate: 0.3, netWinLoss: 50000, payable: 15000, issued: 0, state: '待提交', recommender: '—', createdAt: '2026-07-14 14:20' },
    { id: 'BILL-S-202606-002', type: '独立单线佣金', unitId: 'SINGLE-003', unitName: '独立单线03', payee: 'charles', site: '旺财体育', cycle: '2026-06', grade: '零级', rate: 0, netWinLoss: -18000, payable: 0, issued: 0, state: '无佣金结转', recommender: '—', createdAt: '2026-07-01 02:03' },
  ],
  internalSettlements: [
    { id: 'IS-202607-001', teamId: 'TEAM-001', teamName: '代理1部', mainAgent: 'gaodashang', secondaryAgent: 'WC002', cycle: '2026-07', amount: 28000, basis: '固定金额', source: '平台已到账余额', state: '成功', voucher: '结算凭证-A01', createdAt: '2026-07-14 10:20' },
    { id: 'IS-202607-002', teamId: 'TEAM-001', teamName: '代理1部', mainAgent: 'gaodashang', secondaryAgent: 'LGNB', cycle: '2026-07', amount: 15000, basis: '参考副线业绩', source: '平台已到账余额', state: '处理中', voucher: '待补充', createdAt: '2026-07-14 11:05' },
  ],
  requests: [
    { id: 'REQ-202607-001', type: '副线转独立单线', applicant: 'WC002', currentUnit: '代理1部 / LINE-B', targetUnit: 'WC002 独立单线', effectiveCycle: '2026-08', recommender: 'gaodashang', status: '待站点复核', conflict: '无冲突', createdAt: '2026-07-14 09:30', note: '当前周期继续并入代理1部，下一完整周期切换。' },
    { id: 'REQ-202607-002', type: '独立单线加入团队', applicant: 'dailiwc001', currentUnit: '独立单线01', targetUnit: '代理2部 / 待分配 line_id', effectiveCycle: '2026-08', recommender: '—', status: '已批准·待生效', conflict: '无未结账单', createdAt: '2026-07-13 16:40', note: '生效后停止推荐奖励，历史奖励不变。' },
    { id: 'REQ-202607-003', type: '团队换主线', applicant: '站点运营', currentUnit: '代理1部 / gaodashang', targetUnit: '代理1部 / WC001', effectiveCycle: '2026-08', recommender: '—', status: '待补充资料', conflict: '存在处理中内部结算', createdAt: '2026-07-14 12:10', note: '处理中资金完成后方可批准。' },
  ],
  siteQuota: { dailyQuota: 300000, successfulToday: 82000, pendingOccupied: 15000 },
}

export const LEGACY_REPORT_ROWS = {
  reversal: [
    ['旺财体育', 'gaodashang', '团队主线', '代理1部', 4, 149.9, 21687.56, 12000, 2500, 7099.9],
    ['旺财体育', 'WC002', '团队副线', '代理1部', 2, 3100, 1755.66, 8300, 0, 1150],
    ['财神客栈', 'FEE0427_B6', '原代理模式', '—', 2, 0, 0, 0, 19651.35, 19651.35],
  ],
  returns: [
    ['旺财体育', 'gaodashang', '团队主线', '余额', '垫付', 31.15, 31.15, 'CZ519', '2026-07-10 23:07'],
    ['旺财体育', 'dailiwc001', '独立线主', '余额', '回款', 94.34, 0, 'CZ492', '2026-07-10 23:07'],
    ['财神客栈', 'FEE0428_A8', '原代理模式', '余额', '回款', 14692.5, 0, 'CZ475', '2026-04-28 23:08'],
  ],
}

const BASE_NOTE = {
  updatedAt: UPDATED_AT,
  requirement: '在不改变原代理模型的前提下，增加团队模式与独立单线模式的演示能力，并确保角色、周期、账单和资金边界容易理解。',
  acceptance: '页面入口、筛选、字段、详情、弹窗和主要状态操作均可正常演示；金额、周期和角色口径与团队代理规则一致。',
  boundary: '本页用于业务演示，所有操作只影响当前演示过程，刷新页面后恢复初始内容。',
}

const NOTE_FORMULAS = {
  '团队代理管理': '计算公式：当期净输赢值 = 会员盈亏合计 − 运营费用合计 + 账户调整；考核净输赢值 = 当期净输赢值 − 上期负值结余；可计佣净输赢值 = MAX（0，考核净输赢值）；平台应付佣金 = MAX（0，可计佣净输赢值 × 最终比例 + 金额调整）。',
  '独立单线管理': '计算公式：独立单线考核净输赢值 = 本线当期净输赢值 − 本线上期负值结余；独立单线应付佣金 = MAX（0，可计佣净输赢值 × 最终比例 + 金额调整）。',
  '团队代理佣金方案': '计算公式：新增活跃、活跃会员和净输赢值三个门槛同时满足后取最高等级；推荐奖励 = 独立单线已审核应付佣金 × 奖励比例。',
  '团队代理佣金结算': '计算公式：账单剩余 = 应付金额 − 累计成功发放；本次可发金额 = MIN（账单剩余，站点当日剩余额度）。',
  '佣金与内部结算记录': '计算公式：主线团队可用余额 = 累计成功到账 − 成功内部转账 − 处理中占用 − 其他扣减。',
  '代理收益看板': '计算公式：当期净输赢值 = 会员盈亏合计 − 运营费用合计 + 账户调整；团队三个指标均按有效业务范围去重汇总。',
  '站点团队代理管理': '计算公式：团队有效副线数 = 当前周期状态有效的副线数量；团队平台账单数 = 每个团队每周期最多 1 张。',
  '站点独立单线管理': '计算公式：独立单线应付佣金 = MAX（0，可计佣净输赢值 × 最终比例 + 金额调整）。',
  '站点方案与推荐奖励': '计算公式：推荐奖励 = 独立单线已审核应付佣金 × 奖励比例，奖励由平台另行支付。',
  '站点账单提交与发放': '计算公式：站点当日剩余额度 = 每日额度 − 当日成功发放 − 处理中占用；本次可发金额 = MIN（账单剩余，站点当日剩余额度）。',
  '代理团队经营看板': '计算公式：团队三个指标 = 主线与全部有效副线在业务范围内去重汇总；平台应付佣金 = MAX（0，可计佣净输赢值 × 最终比例 + 金额调整）。',
  '我的佣金账单': '计算公式：账单剩余 = 平台应付金额 − 累计成功发放；副线平台应付账单数量固定为 0。',
  '副线内部结算': '计算公式：主线团队可用余额 = 累计成功到账 − 成功内部转账 − 处理中占用 − 其他扣减；本次金额不得超过可用余额。',
  '会员打码流水统计表': '计算公式：总余额 = 可提现余额 + 锁定余额；单项还需解锁流水 = MAX（0，目标流水 − 已完成有效流水）；场馆提现流水 = 各场馆及通用任务还需解锁流水之和；充值提现流水 = 当前周期内各笔充值与系统发放彩金的剩余流水之和；盈利解锁额度 = MAX（0，当前总余额 − 本轮充值与系统发放彩金计入额度）；亏损时不展示盈利额度，盈利需本轮全部充值流水完成后可领取；锁定余额/锁定额度会随用户有效投注确认结果重新计算。',
}

function note(title, summary, fields, logic, related, record, overrides = {}) {
  const splitAt = record.indexOf('：')
  const recordDate = splitAt >= 0 ? record.slice(0, splitAt) : UPDATED_AT
  const recordContent = splitAt >= 0 ? record.slice(splitAt + 1) : record
  const formula = NOTE_FORMULAS[title]
  const trimEnding = (value) => String(value).replace(/[。；;]\s*$/, '')
  return { ...BASE_NOTE, ...overrides, title, summary, fields, logic: formula ? `${trimEnding(logic)}；${formula}` : logic, related, record: `修改时间：${recordDate}；修改说明：${trimEnding(summary)}；修改内容：${recordContent}` }
}

export const PAGE_NOTES = {
  'master:version': note('版本需求归档', '按总控、站点、代理后台集中展示 1.0 与 2.0 版本需求及页面跳转。', '版本、完成时间、模块说明、修改说明、功能验收和页面入口。', '同一版本内仅保留每个业务项的最新说明，未完成的后续增强不计入已完成模块。', '关联三个后台的团队代理功能、会员流水统计、结算审核和代理自助页面。', '2026-07-14 23:40：更新 2.0 会员打码流水统计与团队代理功能的最新模块说明和直达入口，并保留 1.0 需求归档。', {
    updatedAt: MEMBER_TURNOVER_UPDATED_AT,
    requirement: '按总控后台、站点后台和代理后台归档最新业务需求；同一版本同一模块只保留最新说明，并提供可用的页面跳转。',
    acceptance: '2.0 版本可看到会员打码流水统计及团队代理模块的完成时间、模块说明、修改说明、验收说明和页面入口；1.0 归档保持可查询。',
  }),
  'master:memberTurnover': note('会员打码流水统计表', '集中统计会员充值、系统发放彩金、余额、提现资格、盈利解锁额度和未完成打码流水，支持分别查看场馆归集明细与按发生顺序的充值提现流水记录。', '站点、代理、会员、充值额度、总余额、可提现余额、锁定余额、场馆提现流水、充值提现流水、盈利解锁额度、记录顺序、记录类型、发生时间、计入额度、目标流水、已完成流水、还需解锁流水和状态。', '查询仅汇总已确认的有效流水；无可靠单独场馆归属时显示为“通用”。充值提现流水将成功充值与系统发放彩金均视为独立记录，无需关联充值订单，按发生时间 FIFO 解锁；前一笔未完成时不得跳过。有效投注确认后，已完成流水、剩余解锁量和对应锁定额度同步更新；盈利解锁额度仅在本轮盈利时展示，亏损无额度，且需本轮全部充值流水完成后才可领取。', '关联会员充值、会员钱包、H5 提现、场馆活动流水和运营查询。', '2026-07-15 14:20：列表去除打码状态和归因类型字段，仅保留站点、代理、会员等核心统计筛选与两类流水明细入口。', {
    updatedAt: '2026-07-15 14:20',
    requirement: '在会员管理下只维护会员打码流水统计表，帮助产品、运营和客服快速解释会员为什么可提、为什么仍有锁定余额，以及充值、系统发放彩金和盈利解锁额度的释放顺序。',
    acceptance: '可按站点、代理和会员查询；列表不展示打码状态和归因类型；点击场馆提现流水可看到每个场馆或“通用”的锁定额度、目标流水、已完成、待确认、剩余流水和状态；点击充值提现流水可看到充值与系统发放彩金的顺序、类型、发生时间、额度、目标/已完成/剩余流水和状态，并核对盈利解锁额度需本轮全部充值流水完成后领取的规则；H5 充值流水切页展示同一口径。',
    boundary: '本页为只读统计演示，使用固定模拟数据，不提供人工调整、任务创建或其他会员业务表；刷新页面后恢复初始内容。',
  }),
  'master:agents': note('代理资料与结算身份', '在现有代理资料上补充结算模式和团队身份，便于快速确认代理当前归属。', '代理模型、结算模式、团队身份、代理部、line_id、生效周期和佣金方案。', '代理模型与结算身份相互独立；同一代理同一周期只能归属一个结算单元。', '关联团队代理管理、独立单线管理、佣金方案和关系变更记录。', '2026-07-14：新增结算模式、团队身份、结算单元和生效周期字段。'),
  'master:teams': note('团队代理管理', '集中管理代理部、主管主线、副线结构、合并业绩和团队结算。', '代理部、主线、副线、line_id、业务范围、三个考核指标、等级、佣金比例和状态。', '团队合并主线与全部有效副线的唯一业绩事实，统一定级，每周期只生成一张团队账单并只付主线。', '关联代理资料、团队方案、团队账单、内部结算和模式变更审核。', '2026-07-14：新增团队列表、六个详情标签、开副线、换主线、冻结和待解散演示。'),
  'master:singles': note('独立单线管理', '查看站点直建或副线转入的独立单线及其推荐关系。', '线主、创建来源、业务范围、方案、推荐人、奖励方案、生效周期和状态。', '独立单线独立计算三个指标、独立定级并由平台直接向线主结算。', '关联团队模式切换、推荐奖励、独立单线账单和关系记录。', '2026-07-14：新增独立单线列表、详情、加入团队和终止申请。'),
  'master:plans': note('团队代理佣金方案', '统一展示团队方案、独立单线方案、推荐奖励方案和历史兼容方案。', '方案类型、等级、新增活跃、活跃会员、净输赢值、佣金比例、奖励基数和生效周期。', '等级条件采用同时满足并取最高等级；推荐奖励默认按独立单线已审核应付佣金乘以比例计算。', '关联团队考核、独立单线考核、账单生成和推荐奖励。', '2026-07-14：增加三类新方案和等级条件明细。'),
  'master:settlement': note('团队代理佣金结算', '按团队佣金、独立单线佣金和推荐奖励分别审核与发放。', '账单类型、结算单元、收款方、周期、等级、比例、应付、已发、剩余和状态。', '本次可发金额取账单剩余与站点当日剩余额度中的较小值，支持部分发放。', '关联佣金方案、团队代理、独立单线、推荐关系和佣金记录。', '2026-07-14：新增三类账单、额度控制、部分发放和账单详情。'),
  'master:records': note('佣金与内部结算记录', '分别回放平台账单和主线向副线的内部结算记录。', '账单类型、结算单元、收付款对象、金额、资金来源、状态、凭证和时间。', '团队平台账单与内部结算分别对账，副线内部结算不构成平台对副线的应付。', '关联团队账单、独立单线账单、推荐奖励和主线可用余额。', '2026-07-14：增加平台账单和内部结算双视图及详情。'),
  'master:reversal': note('冲正统计报表', '保留原冲正汇总口径并补充团队身份和结算单元识别。', '所属站点、代理、团队身份、结算单元、垫付人数、垫付与欠款金额。', '冲正仍按原台账统计，不改变团队佣金和内部结算的责任边界。', '关联佣金记录、团队账单和冲正回款报表。', '2026-07-14：补充团队身份和结算单元字段。'),
  'master:returns': note('冲正回款报表', '保留原回款明细并区分团队主线、独立线主与原代理模式。', '站点、代理、结算身份、类型、垫付或回款、额度、缺口和时间。', '回款只冲减原冲正台账，不直接改变团队主副线关系。', '关联冲正统计、佣金账单和代理余额。', '2026-07-14：补充结算身份字段。'),
  'master:revenue': note('代理收益看板', '按结算模式查看团队、独立单线和原代理模式的经营结果。', '结算模式、结算单元、新增活跃、活跃会员、净输赢值、佣金和余额。', '团队数据展示团队合并口径，独立单线只展示本线范围，避免父子数据重复。', '关联团队考核、独立单线考核和佣金结算。', '2026-07-14：增加结算模式、结算单元和团队考核指标。'),
  'master:cycle': note('结算周期设置', '保留现有周期设置并说明团队关系只能从未来完整周期生效。', '结算频率、执行日期、执行时间和下一次执行时间。', '关系、方案和推荐变更不能追溯当前或已锁定周期。', '关联团队关系版本、模式变更审核和账单生成。', '2026-07-14：补充团队代理未来周期生效规则。'),
  'master:relations': note('团队代理关系变更记录', '记录开副线、转独立、加入团队、换主线和解散等变更。', '变更类型、申请人、原结算单元、目标结算单元、生效周期、冲突和状态。', '变更必须无周期重叠或空档，存在账单、负值或冻结资金时阻止直接生效。', '关联团队代理、独立单线、站点审核和周期设置。', '2026-07-14：新增团队代理变更类型、冲突检查和未来周期字段。'),
  'site:teams': note('站点团队代理管理', '站点运营创建代理部、指定主线并管理副线和团队状态。', '代理部、主线、副线数量、团队方案、当前等级、生效周期和状态。', '同一团队必须同站点同币种；冻结期间停止新增关系和资金操作。', '关联站点审核、方案配置、账单发放和内部结算监控。', '2026-07-14：新增站点创建、开副线、冻结、换主线和待解散操作。'),
  'site:singles': note('站点独立单线管理', '站点直接创建单人单线并维护推荐关系和生命周期。', '线主、来源、推荐人、方案、起始周期、范围和状态。', '单人单线初始范围只包含线主节点，后续关系变化从未来完整周期生效。', '关联模式变更审核、推荐奖励和独立单线账单。', '2026-07-14：新增直建单人单线、加入团队和终止申请。'),
  'site:review': note('模式变更审核', '集中审核副线转独立、单线加入团队和团队换主线。', '申请类型、申请人、原目标单元、生效周期、推荐人、冲突和审核状态。', '审核前检查重复归属、未结账单、负值结余、冻结资金和周期冲突。', '关联团队代理、独立单线、账单和关系记录。', '2026-07-14：新增审核通过、退回和冲突阻止演示。'),
  'site:plans': note('站点方案与推荐奖励', '配置站点当前使用的团队、独立单线和推荐奖励方案。', '方案版本、等级门槛、比例、奖励基数、有效期和未来生效周期。', '方案变更只影响未来周期，历史账单继续使用当期快照。', '关联总控方案、团队考核、单线考核和奖励账单。', '2026-07-14：新增三类方案选择与未来生效设置。'),
  'site:settlement': note('站点账单提交与发放', '站点提交三类平台账单并在审核后发起发放。', '账单类型、收款人、应付、已发、剩余、日额度和状态。', '账单审核通过后锁定关系和计算结果；发放受账单剩余和站点日额度共同限制。', '关联总控审核、佣金记录和站点额度。', '2026-07-14：新增提交审核、部分发放和额度占用提示。'),
  'agent:dashboard': note('代理团队经营看板', '按主线、副线和独立线主身份展示各自可见的经营数据和操作。', '团队身份、三个考核指标、等级进度、账单、可用余额和关系状态。', '主线看团队合并数据，副线只看本人范围，独立线主独立考核并直接收款。', '关联团队结构、佣金账单、内部结算和关系申请。', '2026-07-14：新增三身份一键切换、权限差异和业务动作入口。'),
  'agent:bills': note('我的佣金账单', '根据当前身份展示平台账单或主线内部结算记录。', '账单类型、周期、结算单元、应付、已发、剩余和状态。', '团队副线不生成平台应付账单，只查看主线向本人的内部结算。', '关联团队账单、独立单线账单、推荐奖励和内部结算。', '2026-07-14：按三种身份限制账单可见范围。'),
  'agent:internal': note('副线内部结算', '主线自主向副线结算，副线只查看本人收到的记录。', '副线、金额、结算依据、资金来源、状态、凭证和时间。', '使用平台已到账余额时，本次金额不得超过主线团队可用余额。', '关联团队账单、主线余额和副线收款。', '2026-07-14：新增可用余额校验、主线录入和副线只读视图。'),
  'agent:requests': note('关系与模式申请', '发起开副线、转独立单线、加入团队或终止单线申请。', '申请类型、原目标单元、生效周期、推荐人、冲突和状态。', '所有申请从下一完整周期生效，当前周期继续按原结算单元处理。', '关联站点审核、团队结构、独立单线和关系记录。', '2026-07-14：新增身份对应的申请入口和状态回放。'),
  h5: note('H5 提现额度与流水说明', '展示会员可提现余额、锁定额度，并在展开后按场馆流水或充值行为流水解释提现条件。', '总额度、可提现余额、锁定余额、场馆、锁定额度、已完成有效流水、还需解锁流水、记录类型、发生时间、计入额度、盈利解锁额度和状态。', '可提现余额 = 总额度 − 锁定余额；场馆流水切页展示各场馆剩余解锁流水，充值流水切页将成功充值与系统发放彩金分别展示为独立记录，按发生时间 FIFO 解锁且无需关联充值订单；有效投注确认后，剩余解锁量和锁定额度同步更新；若本轮盈利，盈利解锁额度需本轮全部充值流水完成后可领取，亏损则不展示额度。', '关联会员打码流水统计表、会员充值、会员钱包、场馆活动流水和会员取款方式。', '2026-07-15 12:47：充值流水切页补充盈利解锁额度及领取条件，明确亏损不展示额度。', { updatedAt: '2026-07-15 12:47' }),
}

export const P1_ROADMAP = ['副线批量开设与范围调整', '内部结算模板', '主线自有资金提前结算', '方案计算预演', '推荐奖励期限与阶梯', '历史余额受控移交']
