import { useState } from 'react'
import { DeleteOutlined, DownloadOutlined, EditOutlined, FileDoneOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Button, DataTable, Field, FormGrid, Input, Modal, Percent, SectionHeader, Select, StatusTag, Tabs, Toolbar } from './ui'
import { useTeamAgent } from './context'

function ActionLink({ children, onClick, disabled = false }) {
  return <button className="ta-table-link" disabled={disabled} onClick={onClick}>{children}</button>
}

const REBATE_UPDATED_AT = '2026-07-17 20:23'
const REBATE_TYPE_OPTIONS = [
  { value: 'level', label: '层级代理' },
  { value: 'star', label: '星级代理' },
  { value: 'team', label: '团队代理' },
]
const TEAM_REBATE_CONDITION_KEYS = ['newMembers', 'activeMembers', 'totalWinLoss']
const DEFAULT_REBATE_RULES = { activeRule: { depositThreshold: 100, validBetThreshold: 1000 }, newActiveRule: { depositThreshold: 100, validBetThreshold: 1000 } }
const BASE_REBATE_ROWS = [
  { id: 'REBATE-A', sequence: 1, name: '财神Excel0419活动礼金A链方案', createdAt: '2026-04-19 16:06:26', operator: 'admin', operatedAt: '2026-06-04 15:47:32', mode: 'level', details: [{ level: 0, rate: 0.01 }, { level: 1, rate: 0.16 }, { level: 2, rate: 0.2 }, { level: 3, rate: 0.25 }, { level: 4, rate: 0.3 }, { level: 5, rate: 0.35 }, { level: 6, rate: 0.4 }, { level: 7, rate: 0.45 }, { level: 9, rate: 0.5 }] },
  { id: 'REBATE-B', sequence: 2, name: '财神Excel0419活动礼金B链方案', createdAt: '2026-04-19 16:06:26', operator: 'admin', operatedAt: '2026-04-19 16:06:26', mode: 'level', details: [{ level: 1, rate: 0.25 }, { level: 2, rate: 0.3 }, { level: 3, rate: 0.35 }, { level: 4, rate: 0.4 }, { level: 5, rate: 0.45 }, { level: 6, rate: 0.5 }, { level: 7, rate: 0.55 }, { level: 8, rate: 0.6 }] },
  { id: 'REBATE-STAR', sequence: 3, name: '财神Excel0419活动礼金C链星级返佣方案', createdAt: '2026-04-19 16:06:26', operator: 'admin', operatedAt: '2026-04-19 16:06:26', mode: 'star', details: [{ level: 3, rate: 0.15 }, { level: 6, rate: 0.3 }] },
  { id: 'REBATE-CS', sequence: 4, name: '财神Excel佣金测试方案20260406', createdAt: '2026-04-16 19:08:29', operator: 'commission_excel_cs_20260406_test', operatedAt: '2026-04-16 19:08:29', mode: 'level', details: [{ level: 5, rate: 0.35 }, { level: 6, rate: 0.4 }, { level: 7, rate: 0.45 }, { level: 8, rate: 0.5 }] },
  { id: 'REBATE-WC', sequence: 5, name: '旺财测试多层级返佣方案', createdAt: '2026-04-11 17:03:40', operator: 'codex', operatedAt: '2026-04-11 17:03:40', mode: 'level', details: [{ level: 1, rate: 0.05 }, { level: 2, rate: 0.08 }, { level: 3, rate: 0.1 }] },
]

function buildLegacyRebateRows(plans) {
  const teamPlan = plans.find((plan) => plan.type === '团队佣金方案')
  const teamDetails = (teamPlan?.levels?.length ? teamPlan.levels : [
    { rate: 0.3 }, { rate: 0.35 }, { rate: 0.4 }, { rate: 0.45 }, { rate: 0.5 }, { rate: 0.55 },
  ]).map((level, index) => ({ level: index + 1, newMembers: level.newActive ?? '', activeMembers: level.activeMembers ?? '', totalWinLoss: level.netWinLoss ?? '', rate: level.rate || 0 }))
  return [...BASE_REBATE_ROWS, { id: 'REBATE-TEAM', sequence: BASE_REBATE_ROWS.length + 1, name: teamPlan?.name || '旺财团队月结方案', createdAt: '2026-07-16 18:18:00', operator: 'codex', operatedAt: '2026-07-16 18:18:00', mode: 'team', details: teamDetails, ...DEFAULT_REBATE_RULES }]
}

function hasRebateCondition(value) {
  return value !== '' && value !== null && value !== undefined
}

function rebatePercent(rate) {
  return `${(Number(rate || 0) * 100).toFixed(2)}%`
}

function rebateAmount(value) {
  return hasRebateCondition(value) ? Number(value).toLocaleString('zh-CN') : ''
}

function rebateRuleText(rule) {
  return `充值金额≥${rebateAmount(rule?.depositThreshold ?? 0)} 或 有效投注≥${rebateAmount(rule?.validBetThreshold ?? 0)}，满足一项即计入`
}

function rebateConditionText(detail) {
  const items = [
    hasRebateCondition(detail.newMembers) ? `新增活跃≥${rebateAmount(detail.newMembers)}` : null,
    hasRebateCondition(detail.activeMembers) ? `活跃会员≥${rebateAmount(detail.activeMembers)}` : null,
    hasRebateCondition(detail.totalWinLoss) ? `总输赢≥${rebateAmount(detail.totalWinLoss)}` : null,
  ].filter(Boolean)
  return items.length ? items.join(' / ') : '未设置条件'
}

function rebateDetailLabel(row, detail) {
  if (row.mode === 'star') return `${detail.level} 星级代理 / 返佣 ${rebatePercent(detail.rate)}`
  if (row.mode === 'team') return `${detail.level} 级团队 / ${rebateConditionText(detail)} / 返佣 ${rebatePercent(detail.rate)}`
  return `${detail.level} 级代理 / 返佣 ${rebatePercent(detail.rate)}`
}

function defaultRebateDetails(mode) {
  if (mode === 'star') return [{ level: 1, rate: 0.1 }, { level: 2, rate: 0.15 }, { level: 3, rate: 0.2 }]
  if (mode === 'team') return [{ level: 1, rate: 0.3, newMembers: '', activeMembers: '', totalWinLoss: '' }, { level: 2, rate: 0.35, newMembers: '', activeMembers: '', totalWinLoss: '' }, { level: 3, rate: 0.4, newMembers: '', activeMembers: '', totalWinLoss: '' }]
  return [{ level: 1, rate: 0.05 }, { level: 2, rate: 0.08 }, { level: 3, rate: 0.1 }]
}

function rebateTypeName(mode) {
  return REBATE_TYPE_OPTIONS.find((item) => item.value === mode)?.label || '层级代理'
}

function normalizeRebateDetailValue(key, value) {
  if (TEAM_REBATE_CONDITION_KEYS.includes(key) && value === '') return ''
  return Number(value)
}

function rebateRateInputValue(rate) {
  return hasRebateCondition(rate) ? Number((Number(rate || 0) * 100).toFixed(2)) : ''
}

function normalizeRebateRate(value) {
  return value === '' ? 0 : Number(value) / 100
}

function validateRebateDetails(mode, details) {
  const keys = mode === 'team' ? ['rate', ...TEAM_REBATE_CONDITION_KEYS] : ['rate']
  const sorted = [...details].sort((a, b) => Number(a.level) - Number(b.level))
  for (let index = 1; index < sorted.length; index += 1) for (const key of keys) {
    if (hasRebateCondition(sorted[index][key]) && hasRebateCondition(sorted[index - 1][key]) && Number(sorted[index][key]) < Number(sorted[index - 1][key])) return `高层级的${key === 'rate' ? '返佣比例' : '条件值'}不能低于低层级`
  }
  return ''
}

const REWARD_SITE_OPTIONS = ['旺财体育', '财神客栈']
const REWARD_STATUS_OPTIONS = ['生效中', '待生效', '停用']
const EMPTY_REWARD_FORM = { name: '', effectiveCycle: '2026-08', status: '待生效', levels: [] }

function defaultRewardLevels() {
  return [{ level: 1, netProfit: 0, rewardRate: 0.06 }, { level: 2, netProfit: 50000, rewardRate: 0.08 }, { level: 3, netProfit: 100000, rewardRate: 0.1 }]
}

function buildRewardTemplates(plans) {
  const rewardPlans = plans.filter((plan) => plan.type === '推荐奖励方案')
  const templates = rewardPlans.map((plan, index) => ({
    id: plan.id,
    sequence: index + 1,
    name: plan.name.replace(/\d+%方案$/, '阶梯模板'),
    sites: plan.site ? [plan.site] : [],
    levels: defaultRewardLevels(),
    effectiveCycle: plan.effectiveCycle || '2026-08',
    status: plan.status || '待生效',
    operator: 'codex',
    operatedAt: REBATE_UPDATED_AT,
  }))
  const demoRows = [
    { id: 'PLAN-R-TPL-002', name: '高净收益推荐奖励模板', sites: ['财神客栈'], levels: [{ level: 1, netProfit: 0, rewardRate: 0.05 }, { level: 2, netProfit: 80000, rewardRate: 0.08 }, { level: 3, netProfit: 180000, rewardRate: 0.12 }], effectiveCycle: '2026-08', status: '待生效', operator: 'codex', operatedAt: REBATE_UPDATED_AT },
    { id: 'PLAN-R-TPL-003', name: '备用推荐奖励基础模板', sites: [], levels: [{ level: 1, netProfit: 0, rewardRate: 0.04 }, { level: 2, netProfit: 50000, rewardRate: 0.06 }], effectiveCycle: '2026-09', status: '待生效', operator: 'codex', operatedAt: REBATE_UPDATED_AT },
  ]
  return [...templates, ...demoRows].map((row, index) => ({ ...row, sequence: index + 1 }))
}

function rewardFormFromTemplate(row) {
  return { name: row.name, effectiveCycle: row.effectiveCycle, status: row.status, levels: row.levels.map((level) => ({ ...level })) }
}

function rewardAmount(value) {
  return `¥${Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

function rewardLevelText(level) {
  return `${level.level}级：推荐人员净收益≥${rewardAmount(level.netProfit)} / 提成 ${rebatePercent(level.rewardRate)}`
}

function validateRewardLevels(levels) {
  if (!levels.length) return '请至少配置一个推荐奖励层级'
  const sorted = [...levels].sort((a, b) => Number(a.level) - Number(b.level))
  for (let index = 1; index < sorted.length; index += 1) {
    if (Number(sorted[index].netProfit || 0) < Number(sorted[index - 1].netProfit || 0)) return '高层级推荐人员净收益不能低于低层级'
    if (Number(sorted[index].rewardRate || 0) < Number(sorted[index - 1].rewardRate || 0)) return '高层级推荐人提成百分比不能低于低层级'
  }
  return ''
}

export function MasterPlansPage({ onToast }) {
  const { data } = useTeamAgent()
  const [tab, setTab] = useState('rebate')
  const [rows, setRows] = useState(() => buildLegacyRebateRows(data.plans))
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDetails, setEditDetails] = useState([])
  const [editRules, setEditRules] = useState(DEFAULT_REBATE_RULES)
  const [creating, setCreating] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createType, setCreateType] = useState('level')
  const [createDetails, setCreateDetails] = useState(() => defaultRebateDetails('level'))
  const [createRules, setCreateRules] = useState(DEFAULT_REBATE_RULES)
  const [rewardRows, setRewardRows] = useState(() => buildRewardTemplates(data.plans))
  const [rewardMode, setRewardMode] = useState('')
  const [rewardTargetId, setRewardTargetId] = useState('')
  const [rewardForm, setRewardForm] = useState(EMPTY_REWARD_FORM)
  const [siteSelection, setSiteSelection] = useState([])

  const openEditor = (row) => { setEditing(row); setEditName(row.name); setEditDetails(row.details.map((detail) => ({ ...detail }))); setEditRules(row.mode === 'team' ? { activeRule: row.activeRule || DEFAULT_REBATE_RULES.activeRule, newActiveRule: row.newActiveRule || DEFAULT_REBATE_RULES.newActiveRule } : DEFAULT_REBATE_RULES) }
  const openCreator = () => { setCreateName(''); setCreateType('level'); setCreateDetails(defaultRebateDetails('level')); setCreateRules(DEFAULT_REBATE_RULES); setCreating(true) }
  const changeCreateType = (value) => { setCreateType(value); setCreateDetails(defaultRebateDetails(value)); setCreateRules(DEFAULT_REBATE_RULES) }
  const updateEditDetail = (index, key, value) => setEditDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: normalizeRebateDetailValue(key, value) } : item))
  const updateCreateDetail = (index, key, value) => setCreateDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: normalizeRebateDetailValue(key, value) } : item))
  const addEditLevel = () => setEditDetails((current) => [...current, { ...defaultRebateDetails(editing?.mode || 'level')[0], level: Math.max(0, ...current.map((item) => Number(item.level || 0))) + 1, rate: 0 }])
  const addCreateLevel = () => setCreateDetails((current) => [...current, { ...defaultRebateDetails(createType)[0], level: Math.max(0, ...current.map((item) => Number(item.level || 0))) + 1, rate: 0 }])
  const removeEditLevel = (index) => setEditDetails((current) => current.filter((_, itemIndex) => itemIndex !== index))
  const removeCreateLevel = (index) => setCreateDetails((current) => current.filter((_, itemIndex) => itemIndex !== index))
  const saveEditor = () => {
    const error = validateRebateDetails(editing.mode, editDetails)
    if (error) return onToast?.(error, 'error')
    setRows((current) => current.map((row) => row.id === editing.id ? { ...row, name: editName || row.name, details: editDetails, ...(editing.mode === 'team' ? editRules : {}), operator: 'codex', operatedAt: `${REBATE_UPDATED_AT}:00` } : row))
    setEditing(null); onToast?.('佣金方案配置已保存', 'success')
  }
  const saveCreator = () => {
    const error = validateRebateDetails(createType, createDetails)
    if (error) return onToast?.(error, 'error')
    setRows((current) => [...current, { id: `REBATE-CUSTOM-${Date.now()}`, sequence: current.length + 1, name: createName || `${rebateTypeName(createType)}返佣方案`, createdAt: `${REBATE_UPDATED_AT}:00`, operator: 'codex', operatedAt: `${REBATE_UPDATED_AT}:00`, mode: createType, details: createDetails, ...(createType === 'team' ? createRules : {}) }])
    setCreating(false); onToast?.('新增代理方案已保存', 'success')
  }
  const openRewardCreate = () => { setRewardMode('create'); setRewardTargetId(''); setRewardForm({ ...EMPTY_REWARD_FORM, levels: defaultRewardLevels() }) }
  const openRewardEdit = (row) => { setRewardMode('edit'); setRewardTargetId(row.id); setRewardForm(rewardFormFromTemplate(row)) }
  const openSiteConfig = (row) => { setRewardMode('sites'); setRewardTargetId(row.id); setSiteSelection(row.sites || []) }
  const updateRewardLevel = (index, key, value) => setRewardForm((current) => ({ ...current, levels: current.levels.map((level, itemIndex) => itemIndex === index ? { ...level, [key]: key === 'rewardRate' ? normalizeRebateRate(value) : Number(value || 0) } : level) }))
  const addRewardLevel = () => setRewardForm((current) => ({ ...current, levels: [...current.levels, { level: Math.max(0, ...current.levels.map((level) => Number(level.level || 0))) + 1, netProfit: 0, rewardRate: 0 }] }))
  const removeRewardLevel = (index) => setRewardForm((current) => ({ ...current, levels: current.levels.filter((_, itemIndex) => itemIndex !== index) }))
  const saveReward = () => {
    if (!rewardForm.name.trim()) return onToast?.('请输入推荐奖励模板名称', 'error')
    const error = validateRewardLevels(rewardForm.levels)
    if (error) return onToast?.(error, 'error')
    const row = { id: rewardTargetId || `PLAN-R-TPL-${Date.now()}`, name: rewardForm.name, levels: rewardForm.levels, effectiveCycle: rewardForm.effectiveCycle, status: rewardForm.status, operator: 'codex', operatedAt: REBATE_UPDATED_AT }
    setRewardRows((current) => (rewardMode === 'edit' ? current.map((item) => item.id === rewardTargetId ? { ...item, ...row } : item) : [...current, row]).map((item, index) => ({ ...item, sequence: index + 1 })))
    setRewardMode(''); onToast?.(rewardMode === 'edit' ? '推荐奖励模板已修改' : '推荐奖励模板已新增', 'success')
  }
  const saveSiteConfig = () => {
    const selectedSites = [...new Set(siteSelection)]
    setRewardRows((current) => current.map((item) => item.id === rewardTargetId ? { ...item, sites: selectedSites, operator: 'codex', operatedAt: REBATE_UPDATED_AT } : { ...item, sites: (item.sites || []).filter((site) => !selectedSites.includes(site)) }).map((item, index) => ({ ...item, sequence: index + 1 })))
    setRewardMode(''); onToast?.('推荐奖励模板配置站点已保存，重复站点已从其它模板解绑', 'success')
  }
  const toggleRewardSite = (site) => setSiteSelection((current) => current.includes(site) ? current.filter((item) => item !== site) : [...current, site])
  const removeReward = (row) => { setRewardRows((current) => current.filter((item) => item.id !== row.id).map((item, index) => ({ ...item, sequence: index + 1 }))); onToast?.('推荐奖励模板已删除', 'success') }

  const rebateColumns = [
    { key: 'sequence', label: '序号', cellClassName: 'legacy-rebate-index' },
    { key: 'name', label: '返佣方案名称', render: (value, row) => <span className={row.mode === 'team' ? 'legacy-rebate-team-name' : ''}>{value}</span> },
    { key: 'details', label: '方案详情', render: (value, row) => <div className="legacy-rebate-detail-lines">{row.mode === 'team' && <span>活跃会员：{rebateRuleText(row.activeRule)}；新增活跃：{rebateRuleText(row.newActiveRule)}</span>}{value.map((detail) => <span key={`${row.id}-${detail.level}`}>{rebateDetailLabel(row, detail)}</span>)}</div> },
    { key: 'createdAt', label: '创建时间' }, { key: 'operator', label: '最后操作人' }, { key: 'operatedAt', label: '操作时间' },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => openEditor(row)}><EditOutlined /> 修改</ActionLink><ActionLink onClick={() => openEditor(row)}><SettingOutlined /> 配置</ActionLink></div> },
  ]
  const rewardColumns = [
    { key: 'sequence', label: '序号', cellClassName: 'legacy-rebate-index' },
    { key: 'name', label: '推荐奖励模板名称' },
    { key: 'levels', label: '奖励层级', render: (value) => <div className="legacy-rebate-detail-lines">{value.map((level) => <span key={`${level.level}-${level.netProfit}`}>{rewardLevelText(level)}</span>)}</div> },
    { key: 'sites', label: '已配置站点', render: (value) => value?.length ? <div className="legacy-rebate-detail-lines">{value.map((site) => <span key={site}>{site}</span>)}</div> : <StatusTag tone="gray">未配置</StatusTag> },
    { key: 'effectiveCycle', label: '生效周期' },
    { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'operator', label: '最后操作人' },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => openRewardEdit(row)}><EditOutlined /> 修改</ActionLink><ActionLink onClick={() => openSiteConfig(row)}><SettingOutlined /> 配置站点</ActionLink><ActionLink onClick={() => removeReward(row)}><DeleteOutlined /> 删除</ActionLink></div> },
  ]
  const renderLevelRows = (mode, details, updateDetail, removeLevel, prefix) => details.map((detail, index) => <tr key={`${prefix}-${index}`}>
    <td><Input className="legacy-level-input" type="number" value={detail.level} min="0" step="1" onChange={(value) => updateDetail(index, 'level', value)} /></td>
    {mode === 'team' && <><td><Input className="legacy-level-input" type="number" value={detail.newMembers} min="0" placeholder="不设置" onChange={(value) => updateDetail(index, 'newMembers', value)} /></td><td><Input className="legacy-level-input" type="number" value={detail.activeMembers} min="0" placeholder="不设置" onChange={(value) => updateDetail(index, 'activeMembers', value)} /></td><td><Input className="legacy-level-input" type="number" value={detail.totalWinLoss} min="0" placeholder="不设置" onChange={(value) => updateDetail(index, 'totalWinLoss', value)} /></td></>}
    <td><Input className="legacy-level-input" type="number" value={rebateRateInputValue(detail.rate)} min="0" max="100" step="0.01" onChange={(value) => updateDetail(index, 'rate', normalizeRebateRate(value))} /></td>
    <td><ActionLink onClick={() => removeLevel(index)}><DeleteOutlined /> 删除</ActionLink></td>
  </tr>)
  const renderRuleFields = (rules, setRules) => <div className="legacy-active-rule"><div><strong>团队方案判定条件</strong><p>活跃会员和新增活跃均按“充值金额或有效投注满足一项”计入，并跟随当前方案保存。</p></div><div className="legacy-active-rule-fields"><Field label="活跃充值 ≥"><Input type="number" min="0" value={rules.activeRule.depositThreshold} onChange={(value) => setRules({ ...rules, activeRule: { ...rules.activeRule, depositThreshold: value === '' ? '' : Number(value) } })} /></Field><Field label="活跃投注 ≥"><Input type="number" min="0" value={rules.activeRule.validBetThreshold} onChange={(value) => setRules({ ...rules, activeRule: { ...rules.activeRule, validBetThreshold: value === '' ? '' : Number(value) } })} /></Field><Field label="新增充值 ≥"><Input type="number" min="0" value={rules.newActiveRule.depositThreshold} onChange={(value) => setRules({ ...rules, newActiveRule: { ...rules.newActiveRule, depositThreshold: value === '' ? '' : Number(value) } })} /></Field><Field label="新增投注 ≥"><Input type="number" min="0" value={rules.newActiveRule.validBetThreshold} onChange={(value) => setRules({ ...rules, newActiveRule: { ...rules.newActiveRule, validBetThreshold: value === '' ? '' : Number(value) } })} /></Field></div></div>
  const renderLevelTable = (mode, details, updateDetail, removeLevel, prefix) => <div className="legacy-rebate-modal-grid"><table className="legacy-level-table"><thead><tr><th>{mode === 'star' ? '代理星级' : mode === 'team' ? '团队级别' : '代理层级'}</th>{mode === 'team' && <><th>新增活跃</th><th>活跃会员</th><th>总输赢</th></>}<th>返佣比例(%)</th><th>操作</th></tr></thead><tbody>{renderLevelRows(mode, details, updateDetail, removeLevel, prefix)}</tbody></table><div className="legacy-rebate-blank" /></div>

  return <>
    <section className="legacy-rebate-screen">
      <SectionHeader title="佣金方案" description="按原返佣方案列表维护代理返佣配置；推荐奖励先维护多层级模板，再将模板配置到一个或多个站点。" />
      <Tabs items={[{ value: 'rebate', label: '代理返佣方案' }, { value: 'reward', label: '推荐奖励' }]} active={tab} onChange={setTab} />
      {tab === 'rebate' && <><Toolbar><Button icon={<PlusOutlined />} onClick={openCreator}>新增代理方案</Button><Button icon={<DownloadOutlined />} variant="warning" onClick={() => onToast?.('返佣方案已导出', 'success')}>导出</Button><Button icon={<FileDoneOutlined />} variant="ghost" disabled>下载文件</Button></Toolbar><DataTable minWidth={1320} columns={rebateColumns} rows={rows} className="legacy-rebate-table" rowKey="id" /></>}
      {tab === 'reward' && <><Toolbar><Button icon={<PlusOutlined />} onClick={openRewardCreate}>新增推荐奖励模板</Button><Button icon={<DownloadOutlined />} variant="warning" onClick={() => onToast?.('推荐奖励模板已导出', 'success')}>导出</Button></Toolbar><DataTable minWidth={1280} columns={rewardColumns} rows={rewardRows} className="legacy-rebate-table" rowKey="id" paginated /></>}
    </section>
    <Modal open={creating} title="新增代理方案" onClose={() => setCreating(false)} onConfirm={saveCreator} confirmDisabled={!createDetails.length} width={1380}>
      <div className="legacy-rebate-modal-body"><div className="legacy-rebate-name-row"><span><b>*</b> 方案名称</span><Input value={createName} onChange={setCreateName} placeholder="请输入方案名称" /></div><div className="legacy-rebate-name-row"><span><b>*</b> 方案类型</span><Select value={createType} onChange={changeCreateType} options={REBATE_TYPE_OPTIONS} /></div>{createType === 'team' && renderRuleFields(createRules, setCreateRules)}<Button icon={<PlusOutlined />} className="legacy-rebate-add-level" onClick={addCreateLevel}>添加级别</Button>{renderLevelTable(createType, createDetails, updateCreateDetail, removeCreateLevel, 'create')}<div className="legacy-rebate-help"><strong>说明：</strong><p>1、层级代理和星级代理只配置对应级别的返佣比例。</p><p>2、团队代理可配置新增活跃、活跃会员、总输赢条件，并绑定活跃会员与新增活跃判定条件。</p><p>3、返佣比例以百分比填写，高层级已设置值不能低于低层级。</p></div></div>
    </Modal>
    <Modal open={!!editing} title="修改佣金方案" onClose={() => setEditing(null)} onConfirm={saveEditor} width={1380}>
      <div className="legacy-rebate-modal-body"><div className="legacy-rebate-name-row"><span><b>*</b> 方案名称</span><Input value={editName} onChange={setEditName} /></div>{editing?.mode === 'team' && renderRuleFields(editRules, setEditRules)}<Button icon={<PlusOutlined />} className="legacy-rebate-add-level" onClick={addEditLevel}>添加级别</Button>{renderLevelTable(editing?.mode || 'level', editDetails, updateEditDetail, removeEditLevel, 'edit')}<div className="legacy-rebate-help"><strong>说明：</strong><p>1、层级代理和星级代理只配置对应级别的返佣比例。</p><p>2、团队代理可配置新增活跃、活跃会员、总输赢条件，并绑定活跃会员与新增活跃判定条件。</p><p>3、返佣比例以百分比填写，高层级已设置值不能低于低层级。</p></div></div>
    </Modal>
    <Modal open={rewardMode === 'create' || rewardMode === 'edit'} title={rewardMode === 'edit' ? '修改推荐奖励模板' : '新增推荐奖励模板'} description="先维护一套或多套多层级模板，再通过“配置站点”将模板应用到站点。" onClose={() => setRewardMode('')} onConfirm={saveReward} width={1050}>
      <div className="legacy-rebate-modal-body">
        <FormGrid><Field label="模板名称" required><Input value={rewardForm.name} onChange={(name) => setRewardForm({ ...rewardForm, name })} placeholder="请输入推荐奖励模板名称" /></Field><Field label="生效周期"><Select value={rewardForm.effectiveCycle} onChange={(effectiveCycle) => setRewardForm({ ...rewardForm, effectiveCycle })} options={['2026-07', '2026-08', '2026-09']} /></Field><Field label="状态"><Select value={rewardForm.status} onChange={(status) => setRewardForm({ ...rewardForm, status })} options={REWARD_STATUS_OPTIONS} /></Field></FormGrid>
        <Button icon={<PlusOutlined />} className="legacy-rebate-add-level" onClick={addRewardLevel}>添加层级</Button>
        <div className="legacy-rebate-modal-grid"><table className="legacy-level-table"><thead><tr><th>奖励层级</th><th>推荐人员净收益 ≥</th><th>推荐人提成百分比(%)</th><th>操作</th></tr></thead><tbody>{rewardForm.levels.map((level, index) => <tr key={`reward-${index}`}><td><Input className="legacy-level-input" type="number" min="1" step="1" value={level.level} onChange={(value) => updateRewardLevel(index, 'level', value)} /></td><td><Input className="legacy-level-input" type="number" min="0" value={level.netProfit} onChange={(value) => updateRewardLevel(index, 'netProfit', value)} /></td><td><Input className="legacy-level-input" type="number" min="0" max="100" step="0.01" value={rebateRateInputValue(level.rewardRate)} onChange={(value) => updateRewardLevel(index, 'rewardRate', value)} /></td><td><ActionLink onClick={() => removeRewardLevel(index)}><DeleteOutlined /> 删除</ActionLink></td></tr>)}</tbody></table><div className="legacy-rebate-blank" /></div>
        <div className="legacy-rebate-help"><strong>说明：</strong><p>1、推荐奖励模板可配置多个层级，按推荐人员净收益命中对应提成百分比。</p><p>2、高层级推荐人员净收益和提成百分比不能低于低层级。</p><p>3、模板保存后再通过“配置站点”应用到一个或多个站点。</p></div>
      </div>
    </Modal>
    <Modal open={rewardMode === 'sites'} title="配置站点" description="一个站点同一时间只能绑定一个推荐奖励模板；保存后，新选择的站点会自动从其它模板解绑。" onClose={() => setRewardMode('')} onConfirm={saveSiteConfig} confirmText="保存配置" width={720}>
      <div className="reward-site-checks">{REWARD_SITE_OPTIONS.map((site) => {
        const owner = rewardRows.find((row) => row.id !== rewardTargetId && row.sites?.includes(site))
        return <label key={site}><input type="checkbox" checked={siteSelection.includes(site)} onChange={() => toggleRewardSite(site)} /><span>{site}</span>{owner && <small>当前：{owner.name}</small>}</label>
      })}</div>
      <div className="legacy-rebate-help"><strong>说明：</strong><p>同一站点只能同时配置一个推荐奖励模板。若勾选已被其它模板使用的站点，保存后该站点会切换到当前模板。</p></div>
    </Modal>
  </>
}
