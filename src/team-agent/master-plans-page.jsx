import { useState } from 'react'
import { DeleteOutlined, DownloadOutlined, EditOutlined, FileDoneOutlined, PlusOutlined, SettingOutlined } from '@ant-design/icons'
import { Button, DataTable, Field, Input, Modal, SectionHeader, Tabs, Toolbar } from './ui'
import { useTeamAgent } from './context'

function ActionLink({ children, onClick, disabled = false }) {
  return <button className="ta-table-link" disabled={disabled} onClick={onClick}>{children}</button>
}

const REBATE_UPDATED_AT = '2026-07-24 17:11'
const CREATE_REBATE_TABS = [
  { value: 'level', label: '层级返佣方案' },
  { value: 'negative', label: '负盈利返佣方案' },
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
const REFERENCE_LEVEL_DETAILS = BASE_REBATE_ROWS[0].details.map((detail) => ({ ...detail }))

function buildLegacyRebateRows(plans) {
  const teamPlan = plans.find((plan) => plan.type === '团队佣金方案')
  const teamDetails = (teamPlan?.levels?.length ? teamPlan.levels : [
    { rate: 0.3 }, { rate: 0.35 }, { rate: 0.4 }, { rate: 0.45 }, { rate: 0.5 }, { rate: 0.55 },
  ]).map((level, index) => ({ level: index + 1, newMembers: level.newActive ?? '', activeMembers: level.activeMembers ?? '', totalWinLoss: level.netWinLoss ?? '', rate: level.rate || 0 }))
  return [...BASE_REBATE_ROWS, { id: 'REBATE-TEAM', sequence: BASE_REBATE_ROWS.length + 1, name: teamPlan?.name || 'DW负盈利佣金方案', createdAt: '2026-07-16 18:18:00', operator: 'codex', operatedAt: '2026-07-16 18:18:00', mode: 'team', supportMonths: 3, supportDetails: teamDetails.map((detail) => ({ ...detail })), supportActiveRule: { ...DEFAULT_REBATE_RULES.activeRule }, supportNewActiveRule: { ...DEFAULT_REBATE_RULES.newActiveRule }, details: teamDetails, ...DEFAULT_REBATE_RULES }]
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
  return `充值金额≥${rebateAmount(rule?.depositThreshold ?? 0)} 且 有效投注≥${rebateAmount(rule?.validBetThreshold ?? 0)}，全部满足才计入`
}

function rebateConditionText(detail, totalWinLossLabel = '总输赢') {
  const items = [
    hasRebateCondition(detail.newMembers) ? `新增活跃≥${rebateAmount(detail.newMembers)}` : null,
    hasRebateCondition(detail.activeMembers) ? `活跃会员≥${rebateAmount(detail.activeMembers)}` : null,
    hasRebateCondition(detail.totalWinLoss) ? `${totalWinLossLabel}≥${rebateAmount(detail.totalWinLoss)}` : null,
  ].filter(Boolean)
  return items.length ? items.join(' / ') : '未设置条件'
}

function rebateDetailLabel(row, detail, totalWinLossLabel) {
  if (row.mode === 'star') return `${detail.level} 星级代理 / 返佣 ${rebatePercent(detail.rate)}`
  if (row.mode === 'team') return `${detail.level} 级团队 / ${rebateConditionText(detail, totalWinLossLabel)} / 返佣 ${rebatePercent(detail.rate)}`
  return `${detail.level} 级代理 / 返佣 ${rebatePercent(detail.rate)}`
}

function defaultRebateDetails(mode) {
  if (mode === 'star') return [{ level: 1, rate: 0.1 }, { level: 2, rate: 0.15 }, { level: 3, rate: 0.2 }]
  if (mode === 'team') return [{ level: 1, rate: 0.3, newMembers: '', activeMembers: '', totalWinLoss: '' }, { level: 2, rate: 0.35, newMembers: '', activeMembers: '', totalWinLoss: '' }, { level: 3, rate: 0.4, newMembers: '', activeMembers: '', totalWinLoss: '' }]
  return [{ level: 1, rate: 0.05 }, { level: 2, rate: 0.08 }, { level: 3, rate: 0.1 }]
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

export function MasterPlansPage({ onToast, portal = 'master', negativeOnly = false }) {
  const { data } = useTeamAgent()
  const [rows, setRows] = useState(() => {
    const initialRows = buildLegacyRebateRows(data.plans)
    return negativeOnly ? initialRows.filter((row) => row.name === 'DW负盈利佣金方案') : initialRows
  })
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDetails, setEditDetails] = useState([])
  const [editRules, setEditRules] = useState(DEFAULT_REBATE_RULES)
  const [editStage, setEditStage] = useState('support')
  const [editSupportMonths, setEditSupportMonths] = useState(3)
  const [editSupportDetails, setEditSupportDetails] = useState([])
  const [editSupportRules, setEditSupportRules] = useState(DEFAULT_REBATE_RULES)
  const [creating, setCreating] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createType, setCreateType] = useState('level')
  const [createDetails, setCreateDetails] = useState(() => REFERENCE_LEVEL_DETAILS.map((detail) => ({ ...detail })))
  const [createRules, setCreateRules] = useState(DEFAULT_REBATE_RULES)
  const [createStage, setCreateStage] = useState('support')
  const [createSupportMonths, setCreateSupportMonths] = useState(3)
  const [createSupportDetails, setCreateSupportDetails] = useState(() => defaultRebateDetails('team'))
  const [createSupportRules, setCreateSupportRules] = useState(DEFAULT_REBATE_RULES)
  const editingNegativePlan = negativeOnly && editing?.mode === 'team'

  const openEditor = (row) => {
    const regularRules = row.mode === 'team' ? { activeRule: { ...(row.activeRule || DEFAULT_REBATE_RULES.activeRule) }, newActiveRule: { ...(row.newActiveRule || DEFAULT_REBATE_RULES.newActiveRule) } } : DEFAULT_REBATE_RULES
    setEditing(row); setEditName(row.name); setEditDetails(row.details.map((detail) => ({ ...detail }))); setEditRules(regularRules)
    setEditStage('support'); setEditSupportMonths(Number(row.supportMonths || 3)); setEditSupportDetails((row.supportDetails || row.details).map((detail) => ({ ...detail })))
    setEditSupportRules({ activeRule: { ...(row.supportActiveRule || regularRules.activeRule) }, newActiveRule: { ...(row.supportNewActiveRule || regularRules.newActiveRule) } })
  }
  const openCreator = () => {
    setCreateName(''); setCreateType('level'); setCreateDetails(REFERENCE_LEVEL_DETAILS.map((detail) => ({ ...detail }))); setCreateRules(DEFAULT_REBATE_RULES)
    setCreateStage('support'); setCreateSupportMonths(3); setCreateSupportDetails(defaultRebateDetails('team')); setCreateSupportRules(DEFAULT_REBATE_RULES); setCreating(true)
  }
  const changeCreateType = (value) => {
    setCreateType(value)
    setCreateDetails(value === 'level' ? REFERENCE_LEVEL_DETAILS.map((detail) => ({ ...detail })) : defaultRebateDetails('team'))
    setCreateRules(DEFAULT_REBATE_RULES); setCreateStage('support'); setCreateSupportMonths(3); setCreateSupportDetails(defaultRebateDetails('team')); setCreateSupportRules(DEFAULT_REBATE_RULES)
  }
  const updateEditDetail = (index, key, value) => setEditDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: normalizeRebateDetailValue(key, value) } : item))
  const updateSupportDetail = (index, key, value) => setEditSupportDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: normalizeRebateDetailValue(key, value) } : item))
  const updateCreateDetail = (index, key, value) => setCreateDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: normalizeRebateDetailValue(key, value) } : item))
  const updateCreateSupportDetail = (index, key, value) => setCreateSupportDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: normalizeRebateDetailValue(key, value) } : item))
  const addEditLevel = () => setEditDetails((current) => [...current, { ...defaultRebateDetails(editing?.mode || 'level')[0], level: Math.max(0, ...current.map((item) => Number(item.level || 0))) + 1, rate: 0 }])
  const addSupportLevel = () => setEditSupportDetails((current) => [...current, { ...defaultRebateDetails(editing?.mode || 'level')[0], level: Math.max(0, ...current.map((item) => Number(item.level || 0))) + 1, rate: 0 }])
  const addCreateLevel = () => setCreateDetails((current) => [...current, { ...defaultRebateDetails(createType === 'negative' ? 'team' : 'level')[0], level: Math.max(0, ...current.map((item) => Number(item.level || 0))) + 1, rate: 0 }])
  const addCreateSupportLevel = () => setCreateSupportDetails((current) => [...current, { ...defaultRebateDetails('team')[0], level: Math.max(0, ...current.map((item) => Number(item.level || 0))) + 1, rate: 0 }])
  const removeEditLevel = (index) => setEditDetails((current) => current.filter((_, itemIndex) => itemIndex !== index))
  const removeSupportLevel = (index) => setEditSupportDetails((current) => current.filter((_, itemIndex) => itemIndex !== index))
  const removeCreateLevel = (index) => setCreateDetails((current) => current.filter((_, itemIndex) => itemIndex !== index))
  const removeCreateSupportLevel = (index) => setCreateSupportDetails((current) => current.filter((_, itemIndex) => itemIndex !== index))
  const saveEditor = () => {
    const error = validateRebateDetails(editing.mode, editDetails)
    if (error) return onToast?.(error, 'error')
    if (editingNegativePlan && (!Number.isInteger(Number(editSupportMonths)) || Number(editSupportMonths) < 1)) return onToast?.('扶持时长必须为大于 0 的整数月', 'error')
    const supportError = editingNegativePlan ? validateRebateDetails(editing.mode, editSupportDetails) : ''
    if (supportError) return onToast?.(`扶持期配置：${supportError}`, 'error')
    setRows((current) => current.map((row) => row.id === editing.id ? { ...row, name: editingNegativePlan ? row.name : editName || row.name, details: editDetails, ...(editing.mode === 'team' ? editRules : {}), ...(editingNegativePlan ? { supportMonths: Number(editSupportMonths), supportDetails: editSupportDetails, supportActiveRule: editSupportRules.activeRule, supportNewActiveRule: editSupportRules.newActiveRule } : {}), operator: 'codex', operatedAt: `${REBATE_UPDATED_AT}:00` } : row))
    setEditing(null); onToast?.(editingNegativePlan ? '负盈利返佣方案两套配置已保存' : '层级返佣方案已保存', 'success')
  }
  const saveCreator = () => {
    const name = createName.trim()
    if (!name) return onToast?.('请输入方案名称', 'error')
    if (rows.some((row) => row.name === name)) return onToast?.('方案名称已存在', 'error')
    const mode = createType === 'negative' ? 'team' : 'level'
    if (createType === 'level' && createDetails.some((detail) => Number(detail.rate) < 0 || Number(detail.rate) > 1)) return onToast?.('返佣比例必须在 0～1 之间', 'error')
    if (createType === 'negative' && (!Number.isInteger(Number(createSupportMonths)) || Number(createSupportMonths) < 1)) return onToast?.('扶持时长必须为大于 0 的整数月', 'error')
    const supportError = createType === 'negative' ? validateRebateDetails(mode, createSupportDetails) : ''
    if (supportError) return onToast?.(`扶持期配置：${supportError}`, 'error')
    const error = validateRebateDetails(mode, createDetails)
    if (error) return onToast?.(error, 'error')
    setRows((current) => [...current, { id: `REBATE-CUSTOM-${Date.now()}`, sequence: current.length + 1, name, createdAt: `${REBATE_UPDATED_AT}:00`, operator: 'codex', operatedAt: `${REBATE_UPDATED_AT}:00`, mode, details: createDetails, ...(mode === 'team' ? { ...createRules, supportMonths: Number(createSupportMonths), supportDetails: createSupportDetails, supportActiveRule: createSupportRules.activeRule, supportNewActiveRule: createSupportRules.newActiveRule } : {}) }])
    setCreating(false); onToast?.(`${createType === 'negative' ? '负盈利' : '层级'}返佣方案已新增`, 'success')
  }
  const rebateColumns = [
    { key: 'sequence', label: '序号', cellClassName: 'legacy-rebate-index' },
    { key: 'name', label: '返佣方案名称', render: (value, row) => <span className={row.mode === 'team' ? 'legacy-rebate-team-name' : ''}>{value}</span> },
    { key: 'details', label: '方案详情', render: (value, row) => <div className="legacy-rebate-detail-lines">{negativeOnly && row.mode === 'team' && <><strong>扶持期配置 · 新注册代理前 {row.supportMonths || 3} 个月</strong><span>活跃会员：{rebateRuleText(row.supportActiveRule || row.activeRule)}；新增活跃：{rebateRuleText(row.supportNewActiveRule || row.newActiveRule)}</span>{(row.supportDetails || value).map((detail) => <span key={`${row.id}-support-${detail.level}`}>{rebateDetailLabel(row, detail, '总输赢')}</span>)}<strong>常规配置 · 扶持期结束后生效</strong></>}{row.mode === 'team' && <span>活跃会员：{rebateRuleText(row.activeRule)}；新增活跃：{rebateRuleText(row.newActiveRule)}</span>}{value.map((detail) => <span key={`${row.id}-regular-${detail.level}`}>{rebateDetailLabel(row, detail, '总输赢')}</span>)}</div> },
    { key: 'createdAt', label: '创建时间' }, { key: 'operator', label: '最后操作人' }, { key: 'operatedAt', label: '操作时间' },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => openEditor(row)}><EditOutlined /> 修改</ActionLink><ActionLink onClick={() => openEditor(row)}><SettingOutlined /> 配置</ActionLink></div> },
  ].filter((column) => portal !== 'agent' || !['operator', 'operatedAt', 'action'].includes(column.key))
  const renderLevelRows = (mode, details, updateDetail, removeLevel, prefix) => details.map((detail, index) => <tr key={`${prefix}-${index}`}>
    <td><Input className="legacy-level-input" type="number" value={detail.level} min="0" step="1" onChange={(value) => updateDetail(index, 'level', value)} /></td>
    {mode === 'team' && <><td><Input className="legacy-level-input" type="number" value={detail.newMembers} min="0" placeholder="不设置" onChange={(value) => updateDetail(index, 'newMembers', value)} /></td><td><Input className="legacy-level-input" type="number" value={detail.activeMembers} min="0" placeholder="不设置" onChange={(value) => updateDetail(index, 'activeMembers', value)} /></td><td><Input className="legacy-level-input" type="number" value={detail.totalWinLoss} min="0" placeholder="不设置" onChange={(value) => updateDetail(index, 'totalWinLoss', value)} /></td></>}
    <td><Input className="legacy-level-input" type="number" value={rebateRateInputValue(detail.rate)} min="0" max="100" step="0.01" onChange={(value) => updateDetail(index, 'rate', normalizeRebateRate(value))} /></td>
    <td><ActionLink onClick={() => removeLevel(index)}><DeleteOutlined /> 删除</ActionLink></td>
  </tr>)
  const renderRuleFields = (rules, setRules) => <div className="legacy-active-rule"><div><strong>团队方案判定条件</strong><p>活跃会员和新增活跃均需同时达到充值金额与有效投注门槛，全部满足才计入，并跟随当前方案保存。</p></div><div className="legacy-active-rule-fields"><Field label="活跃充值 ≥"><Input type="number" min="0" value={rules.activeRule.depositThreshold} onChange={(value) => setRules({ ...rules, activeRule: { ...rules.activeRule, depositThreshold: value === '' ? '' : Number(value) } })} /></Field><Field label="活跃投注 ≥"><Input type="number" min="0" value={rules.activeRule.validBetThreshold} onChange={(value) => setRules({ ...rules, activeRule: { ...rules.activeRule, validBetThreshold: value === '' ? '' : Number(value) } })} /></Field><Field label="新增充值 ≥"><Input type="number" min="0" value={rules.newActiveRule.depositThreshold} onChange={(value) => setRules({ ...rules, newActiveRule: { ...rules.newActiveRule, depositThreshold: value === '' ? '' : Number(value) } })} /></Field><Field label="新增投注 ≥"><Input type="number" min="0" value={rules.newActiveRule.validBetThreshold} onChange={(value) => setRules({ ...rules, newActiveRule: { ...rules.newActiveRule, validBetThreshold: value === '' ? '' : Number(value) } })} /></Field></div></div>
  const renderLevelTable = (mode, details, updateDetail, removeLevel, prefix) => <div className="legacy-rebate-modal-grid"><table className="legacy-level-table"><thead><tr><th>{mode === 'star' ? '代理星级' : mode === 'team' ? '团队级别' : '代理层级'}</th>{mode === 'team' && <><th>新增活跃</th><th>活跃会员</th><th>总输赢</th></>}<th>返佣比例(%)</th><th>操作</th></tr></thead><tbody>{renderLevelRows(mode, details, updateDetail, removeLevel, prefix)}</tbody></table><div className="legacy-rebate-blank" /></div>
  const renderReferenceLevelTable = () => <div className="legacy-reference-level-wrap"><table className="legacy-level-table legacy-reference-level-table"><thead><tr><th>代理层级</th><th>返佣比例(0~1)</th><th>操作</th></tr></thead><tbody>{createDetails.map((detail, index) => <tr key={`reference-${index}`}><td><Input className="legacy-level-input" type="number" value={detail.level} min="0" step="1" onChange={(value) => updateCreateDetail(index, 'level', value)} /></td><td><Input className="legacy-level-input" type="number" value={Number(detail.rate).toFixed(4)} min="0" max="1" step="0.0001" onChange={(value) => updateCreateDetail(index, 'rate', value === '' ? '' : Number(value))} /></td><td><ActionLink onClick={() => removeCreateLevel(index)}><DeleteOutlined /> 删除</ActionLink></td></tr>)}</tbody></table></div>

  return <>
    <section className="legacy-rebate-screen">
      <SectionHeader title={negativeOnly ? '返佣方案' : '佣金方案'} description={negativeOnly ? '集中维护层级返佣方案，以及负盈利代理的扶持期与常规返佣配置。' : '按原返佣方案列表维护代理返佣配置，当前详情页仅保留代理返佣方案列表。'} />
      <Toolbar>{portal !== 'agent' && <Button icon={<PlusOutlined />} onClick={openCreator}>{negativeOnly ? '新增' : '新增代理方案'}</Button>}<Button icon={<DownloadOutlined />} variant="warning" onClick={() => onToast?.('返佣方案已导出', 'success')}>导出</Button><Button icon={<FileDoneOutlined />} variant="ghost" disabled>下载文件</Button></Toolbar>
      <DataTable minWidth={1320} columns={rebateColumns} rows={rows} className="legacy-rebate-table" rowKey="id" />
    </section>
    <Modal open={creating} title={negativeOnly ? '新增返佣方案' : '新增代理方案'} onClose={() => setCreating(false)} onConfirm={saveCreator} confirmDisabled={!createName.trim() || !createDetails.length || (createType === 'negative' && !createSupportDetails.length)} width={createType === 'level' ? 980 : 1380}>
      <div className="legacy-rebate-modal-body"><Tabs className="legacy-create-rebate-tabs" items={CREATE_REBATE_TABS} active={createType} onChange={changeCreateType} /><div className="legacy-rebate-name-row"><span><b>*</b> 方案名称</span><Input value={createName} onChange={setCreateName} placeholder={`请输入${createType === 'negative' ? '负盈利' : '层级'}返佣方案名称`} /></div>{createType === 'level' ? <><Button icon={<PlusOutlined />} className="legacy-rebate-add-level" onClick={addCreateLevel}>添加级别</Button>{renderReferenceLevelTable()}<div className="legacy-rebate-help"><strong>说明：</strong><p>1、代理自身星级/层级不在此处改变，这里只配置对应级别的返佣比例。</p><p>2、比例按 0～1 保存，例如 0.45 表示 45%。</p></div></> : <><Tabs className="legacy-create-stage-tabs" items={[{ value: 'support', label: '扶持期配置' }, { value: 'regular', label: '常规配置' }]} active={createStage} onChange={setCreateStage} />{createStage === 'support' ? <><div className="legacy-rebate-name-row"><span><b>*</b> 扶持时长（月）</span><Input type="number" min="1" step="1" value={createSupportMonths} onChange={(value) => setCreateSupportMonths(value === '' ? '' : Number(value))} /></div>{renderRuleFields(createSupportRules, setCreateSupportRules)}<Button icon={<PlusOutlined />} className="legacy-rebate-add-level" onClick={addCreateSupportLevel}>添加扶持级别</Button>{renderLevelTable('team', createSupportDetails, updateCreateSupportDetail, removeCreateSupportLevel, 'create-support')}</> : <>{renderRuleFields(createRules, setCreateRules)}<Button icon={<PlusOutlined />} className="legacy-rebate-add-level" onClick={addCreateLevel}>添加级别</Button>{renderLevelTable('team', createDetails, updateCreateDetail, removeCreateLevel, 'create-regular')}</>}<div className="legacy-rebate-help"><strong>说明：</strong><p>1、新注册代理在设置的扶持月数内使用扶持期配置，结束后自动切换为常规配置。</p><p>2、两套配置分别维护新增活跃、活跃会员、总输赢、返佣比例和活跃判定条件。</p><p>3、活跃会员与新增活跃均须同时达到充值金额和有效投注门槛。</p></div></>}</div>
    </Modal>
    <Modal open={!!editing} title={editingNegativePlan ? '修改负盈利返佣方案' : negativeOnly ? '修改层级返佣方案' : '修改佣金方案'} onClose={() => setEditing(null)} onConfirm={saveEditor} width={1380}>
      <div className="legacy-rebate-modal-body"><div className="legacy-rebate-name-row"><span><b>*</b> 方案名称</span><Input value={editName} onChange={setEditName} disabled={editingNegativePlan} /></div>{editingNegativePlan && <Tabs items={[{ value: 'support', label: '扶持期配置' }, { value: 'regular', label: '常规配置' }]} active={editStage} onChange={setEditStage} />}{editingNegativePlan && editStage === 'support' ? <><div className="legacy-rebate-name-row"><span><b>*</b> 扶持时长（月）</span><Input type="number" min="1" step="1" value={editSupportMonths} onChange={(value) => setEditSupportMonths(value === '' ? '' : Number(value))} /></div>{renderRuleFields(editSupportRules, setEditSupportRules)}<Button icon={<PlusOutlined />} className="legacy-rebate-add-level" onClick={addSupportLevel}>添加扶持级别</Button>{renderLevelTable('team', editSupportDetails, updateSupportDetail, removeSupportLevel, 'support')}</> : <>{editing?.mode === 'team' && renderRuleFields(editRules, setEditRules)}<Button icon={<PlusOutlined />} className="legacy-rebate-add-level" onClick={addEditLevel}>添加级别</Button>{renderLevelTable(editing?.mode || 'level', editDetails, updateEditDetail, removeEditLevel, 'edit')}</>}<div className="legacy-rebate-help"><strong>说明：</strong>{editingNegativePlan ? <><p>1、新注册代理自注册日起，在设置的扶持月数内使用扶持期配置。</p><p>2、扶持期结束后自动使用常规配置，现有配置作为常规配置保留。</p><p>3、两套配置独立维护新增活跃、活跃会员、总输赢与返佣比例。</p></> : <><p>1、代理自身星级/层级不在此处改变，这里只配置对应级别的返佣比例。</p><p>2、返佣比例按百分比填写，高层级已设置值不能低于低层级。</p></>}</div></div>
    </Modal>
  </>
}
