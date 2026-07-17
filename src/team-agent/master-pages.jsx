import { useMemo, useState } from 'react'
import {
  ApartmentOutlined,
  AuditOutlined,
  BankOutlined,
  BarChartOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  DownloadOutlined,
  EditOutlined,
  EyeOutlined,
  FileDoneOutlined,
  FolderOpenOutlined,
  HistoryOutlined,
  LockOutlined,
  PlusOutlined,
  QuestionCircleOutlined,
  SendOutlined,
  SettingOutlined,
  StopOutlined,
  SwapOutlined,
  TeamOutlined,
  UserAddOutlined,
} from '@ant-design/icons'
import { LEGACY_REPORT_ROWS } from './data'
import { useTeamAgent } from './context'
import { MasterRelationsPage } from './relation-record-page'
import { TeamGradeSummary } from './team-grade-summary'
import { buildTeamCommissionRows, buildTeamSettlementHistoryRows, getTeamInspectConfig, teamAgentRows, teamGradeProgress, teamMemberCount, teamOverviewCounts, teamSecondaryRows, teamSingleRows } from './team-management-helpers'
import {
  Alert,
  Button,
  ColumnSettings,
  DataTable,
  DescriptionGrid,
  Field,
  FilterBar,
  FormulaPanel,
  FormGrid,
  Input,
  MetricCard,
  MetricGrid,
  Modal,
  Money,
  Panel,
  Percent,
  SectionHeader,
  Select,
  StatusTag,
  Tabs,
  Toolbar,
} from './ui'

function showResult(result, onToast, onSuccess) {
  onToast(result.message, result.ok ? 'success' : 'error')
  if (result.ok) onSuccess?.()
}

function ActionLink({ children, onClick, disabled = false }) {
  return <button className="ta-table-link" disabled={disabled} onClick={onClick}>{children}</button>
}

function AgentRadioGroup({ value, options, onChange }) {
  return <div className="agent-radio-group">{options.map((option) => {
    const item = typeof option === 'string' ? { value: option, label: option } : option
    return <label key={item.value}><input type="radio" checked={value === item.value} onChange={() => onChange(item.value)} /><span>{item.label}</span></label>
  })}</div>
}

function AgentFormDivider() {
  return <div className="agent-modal-divider" />
}

const AGENT_TYPE_OPTIONS = ['多层级代理', '星级代理', '团队代理']
const TEAM_AGENT_TYPE_OPTIONS = ['官方代理', '普通代理']
const TEAM_AGENT_ADD_IDENTITY_OPTIONS = ['团队负责人']
const TEAM_AGENT_IDENTITY_OPTIONS = ['团队负责人', '副线负责人', '独立代理', '团队代理成员']
const REVERSAL_AGENT_TYPE_OPTIONS = ['团队代理', '星级代理', '层级代理']
const REVERSAL_FILTER_DEFAULTS = { cycle: '', site: '', agentType: '', keyword: '' }
const RETURN_FILTER_DEFAULTS = { date: '', site: '', type: '', agentType: '', flow: '', keyword: '' }
const REVENUE_FILTER_DEFAULTS = { site: '', account: '', range: '2026-07-17 00: 至 2026-07-17 03:' }
const REVENUE_MODULE_TABS = ['全站运营数据看板', '代理管理', '代理佣金结算', '佣金记录', '冲正统计报表', '冲正回款报表', '代理收益看板']
const REVENUE_SUB_TABS = ['全站运营数据看板', '代理收益看板']
const REVENUE_TABLE_LABELS = ['所属站点', '代理编号', '代理账号', '上级代理', '账期范围', '本期佣金预计净收益', '当前余额', '总推广佣金', '已结算佣金', '总充值', '总提现', '总投注', '有效投注', '总盈亏', '该代理欠款', '未收回欠款', '会员VIP福利', '活动福利', '会员推广福利', '充提手续费运营费', '代理总人数', '新增代理', '活跃代理', '会员总数', '新增会员', '活跃会员', '付费会员', '新增付费', '代理推广会员', '会员推广会员', '30天未登录会员数']
const LEVEL_OPTIONS = Array.from({ length: 10 }, (_, index) => `${index + 1}层代理`)
const STAR_LEVEL_OPTIONS = Array.from({ length: 6 }, (_, index) => `${index + 1}星代理`)
const LEGACY_PLAN_OPTIONS = ['多层级返佣方案']
const STAR_PLAN_OPTIONS = ['星级返佣方案']
const SITE_OPTIONS = [
  { value: '旺财体育', label: '2222 团财体育' },
  { value: '财神客栈', label: '333333 财神客栈' },
]
const SITE_META = {
  旺财体育: { code: '2222', label: '团财体育' },
  财神客栈: { code: '333333', label: '财神客栈' },
}

function normalizeAgentType(agent) {
  if (AGENT_TYPE_OPTIONS.includes(agent.agentType)) return agent.agentType
  if (agent.settlementMode === '团队模式' || agent.settlementMode === '独立单线') return '团队代理'
  if (agent.agentType === '官方代理') return '星级代理'
  return '多层级代理'
}

function normalizeTeamIdentity(identity) {
  if (identity === '独立线主') return '独立代理'
  return identity || '团队代理成员'
}

function teamAgentPayload(type, identity = '团队负责人', plan = '旺财团队月结方案', teamAgentType = '官方代理') {
  if (type !== '团队代理') return { settlementMode: '原代理模式', identity: '—', teamAgentType: '—', plan: plan || (type === '星级代理' ? '星级返佣方案' : '多层级返佣方案') }
  return {
    settlementMode: identity === '独立代理' ? '独立单线' : '团队模式',
    identity,
    teamAgentType,
    plan,
  }
}

function planOptionsForAgentType(type, teamOptions = []) {
  if (type === '团队代理') return teamOptions.length ? teamOptions : ['旺财团队月结方案']
  if (type === '星级代理') return STAR_PLAN_OPTIONS
  return LEGACY_PLAN_OPTIONS
}

function defaultPlanForAgentType(type, teamOptions = []) {
  return planOptionsForAgentType(type, teamOptions)[0] || ''
}

function defaultRankForAgentType(type) {
  if (type === '星级代理') return '3星代理'
  if (type === '多层级代理') return '6层代理'
  return ''
}

function siteDisplay(site) {
  const meta = SITE_META[site] || { code: site || '—', label: site || '—' }
  return <span>{meta.code} <em className="agent-site-chip">{meta.label}</em></span>
}

function rateDisplay(agent) {
  const type = normalizeAgentType(agent)
  if (type === '星级代理') return '30.00%'
  if (type === '团队代理') return '--'
  return '--'
}

function gradeDisplay(agent) {
  const type = normalizeAgentType(agent)
  if (type === '星级代理' && agent.starLevel) return agent.starLevel
  if (type === '星级代理') return `${Math.max(1, Math.min(6, Number(agent.activeMembers || 0) % 6 || 3))}星代理`
  return '-'
}

function levelDisplay(agent) {
  const type = normalizeAgentType(agent)
  if (type === '多层级代理' && agent.level) return agent.level
  if (type === '多层级代理') return `${Math.max(1, Math.min(10, Number(agent.subAgents || 0) + 1))}层代理`
  if (type === '团队代理') return normalizeTeamIdentity(agent.identity)
  return '-'
}

function teamAgentTypeDisplay(agent) {
  if (normalizeAgentType(agent) !== '团队代理') return '-'
  if (TEAM_AGENT_TYPE_OPTIONS.includes(agent.teamAgentType)) return agent.teamAgentType
  return ['团队负责人', '独立代理'].includes(normalizeTeamIdentity(agent.identity)) ? '官方代理' : '普通代理'
}

function agentRank(agent) {
  const type = normalizeAgentType(agent)
  if (type === '星级代理') return gradeDisplay(agent)
  if (type === '多层级代理') return levelDisplay(agent)
  return ''
}

function commissionRateHint(agentType, rank) {
  if (agentType === '团队代理') return '按团队代理返佣方案计算'
  if (agentType === '星级代理') return '30.00%'
  const level = Number(String(rank || '').match(/\d+/)?.[0] || 6)
  return `${Math.min(80, 10 + level * 5).toFixed(2)}%`
}

function withCurrentOption(options, value) {
  if (!value || options.some((option) => option.value === value || option === value)) return options
  return [...options, { value, label: value }]
}

function MasterAgentsPage({ navigate, onToast }) {
  const { data, addAgent, updateAgent } = useTeamAgent()
  const emptyFilters = { id: '', account: '', site: '', status: '', google: '', registeredFrom: '' }
  const defaultAgentForm = { account: '', password: '', site: '旺财体育', agentType: '多层级代理', teamAgentType: '官方代理', identity: '团队负责人', plan: '多层级返佣方案', carryAllFees: '否', status: '启用', remark: '' }
  const [filters, setFilters] = useState(emptyFilters)
  const [showAdd, setShowAdd] = useState(false)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [form, setForm] = useState(defaultAgentForm)
  const [editForm, setEditForm] = useState({})
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' })
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const teamPlanOptions = data.plans.filter((plan) => plan.type === '团队佣金方案').map((plan) => plan.name)
  const addPlanOptions = planOptionsForAgentType(form.agentType, teamPlanOptions)
  const editPlanOptions = planOptionsForAgentType(editForm.agentType, teamPlanOptions)
  const parentOptions = useMemo(() => [{ value: '无上级代理', label: '无上级代理' }, ...data.agents.map((agent) => ({ value: agent.account, label: `${agent.id} / ${agent.account}` }))], [data.agents])
  const editParentOptions = withCurrentOption(parentOptions.filter((option) => option.value !== selected?.account), editForm.parent)
  const rows = useMemo(() => data.agents.filter((agent) => {
    const registeredDate = String(agent.registeredAt || '').slice(0, 10)
    return (!filters.id || String(agent.id).includes(filters.id))
      && (!filters.account || agent.account.toLowerCase().includes(filters.account.toLowerCase()))
      && (!filters.site || agent.site === filters.site)
      && (!filters.status || agent.status === filters.status)
      && (!filters.registeredFrom || registeredDate >= filters.registeredFrom)
  }), [data.agents, filters])
  const selectedRow = data.agents.find((agent) => agent.id === selectedIds[0])

  function openAddModal() {
    setForm(defaultAgentForm)
    setShowAdd(true)
  }

  function openModal(type, row) {
    const target = row || selectedRow
    if (!target) {
      onToast(type === 'password' ? '请先选择要修改密码的代理' : '请先选择要修改的代理', 'error')
      return
    }
    setSelected(target)
    setModal(type)
    if (type === 'edit') {
      const typeValue = normalizeAgentType(target)
      const identity = normalizeTeamIdentity(target.identity)
      setEditForm({
        account: target.account,
        site: target.site || '旺财体育',
        agentType: typeValue,
        teamAgentType: teamAgentTypeDisplay(target) === '-' ? '官方代理' : teamAgentTypeDisplay(target),
        identity,
        rank: agentRank(target) || defaultRankForAgentType(typeValue),
        plan: target.plan || defaultPlanForAgentType(typeValue, teamPlanOptions),
        carryAllFees: target.carryAllFees || '否',
        parent: target.parent || '无上级代理',
        migratePendingCost: target.migratePendingCost || '否',
        status: target.status || '启用',
        remark: target.remark || '',
      })
    }
    if (type === 'password') setPasswordForm({ password: '', confirm: '' })
  }

  function closeModal() {
    setModal(null)
    setSelected(null)
  }

  function toggleSelected(agentId, checked) {
    setSelectedIds((current) => checked ? [agentId] : current.filter((id) => id !== agentId))
  }

  function saveNewAgent() {
    if (!String(form.password || '').trim()) {
      onToast('请填写密码', 'error')
      return
    }
    const identity = form.agentType === '团队代理' ? '团队负责人' : form.identity
    const payload = { ...form, identity, ...teamAgentPayload(form.agentType, identity, form.plan, form.teamAgentType) }
    showResult(addAgent(payload), onToast, () => setShowAdd(false))
  }

  function saveEditAgent() {
    const payload = {
      agentType: editForm.agentType,
      parent: editForm.parent || '无上级代理',
      status: editForm.status || '启用',
      remark: editForm.remark || '',
      carryAllFees: editForm.carryAllFees || '否',
      migratePendingCost: editForm.migratePendingCost || '否',
      ...teamAgentPayload(editForm.agentType, editForm.identity, editForm.plan, editForm.teamAgentType),
    }
    if (editForm.agentType === '星级代理') payload.starLevel = editForm.rank || defaultRankForAgentType('星级代理')
    if (editForm.agentType === '多层级代理') payload.level = editForm.rank || defaultRankForAgentType('多层级代理')
    showResult(updateAgent(selected.id, payload), onToast, closeModal)
  }

  function changeAddAgentType(value) {
    setForm((current) => ({ ...current, agentType: value, plan: defaultPlanForAgentType(value, teamPlanOptions), teamAgentType: value === '团队代理' ? current.teamAgentType || '官方代理' : current.teamAgentType, identity: value === '团队代理' ? '团队负责人' : current.identity }))
  }

  function changeEditAgentType(value) {
    setEditForm((current) => ({ ...current, agentType: value, plan: defaultPlanForAgentType(value, teamPlanOptions), teamAgentType: value === '团队代理' ? current.teamAgentType || '官方代理' : current.teamAgentType, identity: value === '团队代理' ? current.identity || '团队负责人' : current.identity, rank: defaultRankForAgentType(value) }))
  }

  const columns = [
    { key: 'select', label: <input type="checkbox" aria-label="选择全部代理" checked={rows.length > 0 && selectedIds.length === rows.length} onChange={(event) => setSelectedIds(event.target.checked ? rows.map((row) => row.id) : [])} />, render: (_, row) => <input type="checkbox" aria-label={`选择${row.account}`} checked={selectedIds.includes(row.id)} onChange={(event) => toggleSelected(row.id, event.target.checked)} /> },
    { key: 'id', label: '代理ID' },
    { key: 'account', label: '代理账号', render: (value) => <b className="ta-primary-text">{value}</b> },
    { key: 'registeredAt', label: '代理注册时间' },
    { key: 'agentType', label: '代理类型', render: (_, row) => <StatusTag tone={normalizeAgentType(row) === '团队代理' ? 'green' : 'orange'}>{normalizeAgentType(row)}</StatusTag> },
    { key: 'teamAgentType', label: '团队类型', render: (_, row) => teamAgentTypeDisplay(row) === '-' ? '-' : <StatusTag tone="blue">{teamAgentTypeDisplay(row)}</StatusTag> },
    { key: 'level', label: '代理身份', render: (_, row) => levelDisplay(row) },
    { key: 'site', label: '站点编码', render: (value) => siteDisplay(value) },
    { key: 'parent', label: '上级代理', render: (value) => value === '无上级代理' ? '-' : value },
    { key: 'status', label: '代理状态', render: (value) => <StatusTag tone={value === '启用' ? 'green' : 'red'}>{value === '启用' ? '正常' : '停用'}</StatusTag> },
    { key: 'google', label: '谷歌验证', render: () => <StatusTag>未绑定</StatusTag> },
    { key: 'subAgents', label: '下属代理', render: (value, row) => <ActionLink disabled={!value} onClick={() => openModal('subAgents', row)}>{value}</ActionLink> },
    { key: 'members', label: '下属会员', render: (value) => value ? <ActionLink onClick={() => onToast('下属会员列表为演示状态')}>{value}</ActionLink> : 0 },
    { key: 'plan', label: '佣金方案', cellClassName: 'agent-plan-cell' },
    { key: 'rate', label: '代理返佣比例', render: (_, row) => rateDisplay(row) },
    { key: 'balance', label: '代理钱包余额', render: (value) => Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) },
    { key: 'lastLogin', label: '最后登录', render: (value) => value || '-' },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => openModal('edit', row)}><EditOutlined /> 修改</ActionLink><ActionLink onClick={() => openModal('password', row)}><LockOutlined /> 修改密码</ActionLink></div> },
  ]
  return <>
    <div className="agent-manage-screen">
      <SectionHeader title="代理管理" />
      <div className="agent-count-pill"><span>数量</span><b>{rows.length}</b></div>
      <FilterBar onSearch={() => onToast(`已查询到 ${rows.length} 条代理记录`)} onReset={() => { setFilters(emptyFilters); setSelectedIds([]) }}>
        <Field label="代理ID"><Input value={filters.id} onChange={(value) => setFilter('id', value)} placeholder="请输入代理ID" /></Field>
        <Field label="代理账号"><Input value={filters.account} onChange={(value) => setFilter('account', value)} placeholder="请输入代理账号" /></Field>
        <Field label="站点编码"><Select value={filters.site} onChange={(value) => setFilter('site', value)} placeholder="请选择站点" options={SITE_OPTIONS} /></Field>
        <Field label="代理状态"><Select value={filters.status} onChange={(value) => setFilter('status', value)} placeholder="代理状态" options={[{ value: '启用', label: '正常' }, { value: '停用', label: '停用' }]} /></Field>
        <Field label="谷歌验证"><Select value={filters.google} onChange={(value) => setFilter('google', value)} placeholder="全部状态" options={['未绑定']} /></Field>
        <Field label="代理注册时间"><Input type="date" value={filters.registeredFrom} onChange={(value) => setFilter('registeredFrom', value)} /></Field>
      </FilterBar>
      <Toolbar>
        <Button icon={<PlusOutlined />} onClick={openAddModal}>新增代理</Button>
        <Button icon={<EditOutlined />} variant="success" disabled={!selectedRow} onClick={() => openModal('edit')}>修改</Button>
        <Button icon={<LockOutlined />} variant="warning" disabled={!selectedRow} onClick={() => openModal('password')}>修改密码</Button>
        <Button icon={<DownloadOutlined />} variant="slate" onClick={() => onToast('代理列表已导出')}>导出</Button>
        <Button icon={<FileDoneOutlined />} variant="ghost" onClick={() => onToast('下载文件为演示状态')}>下载文件</Button>
      </Toolbar>
      <DataTable className="agent-management-table" minWidth={2100} columns={columns} rows={rows} paginated />
    </div>
    <Modal open={showAdd} title="新增代理" onClose={() => setShowAdd(false)} onConfirm={saveNewAgent} confirmText="确定" width={760}>
      <div className="agent-modal-form">
        <FormGrid columns={1}>
          <Field label="代理账号" required><Input value={form.account} onChange={(value) => setForm({ ...form, account: value })} placeholder="请输入代理账号" /></Field>
          <Field label="密码" required><Input type="password" value={form.password} onChange={(value) => setForm({ ...form, password: value })} placeholder="请输入密码" /></Field>
          <Field label="站点编码" required><Select value={form.site} onChange={(value) => setForm({ ...form, site: value })} placeholder="请选择站点" options={SITE_OPTIONS} /></Field>
          <Field label="佣金方案" required><Select value={form.plan} onChange={(value) => setForm({ ...form, plan: value })} placeholder="请选择佣金方案" options={addPlanOptions} /></Field>
          <Field label="代理类型" required><Select value={form.agentType} onChange={changeAddAgentType} options={AGENT_TYPE_OPTIONS} /></Field>
          {form.agentType === '团队代理' && <Field label="团队类型" required><Select value={form.teamAgentType} onChange={(value) => setForm({ ...form, teamAgentType: value })} options={TEAM_AGENT_TYPE_OPTIONS} /></Field>}
          {form.agentType === '团队代理' && <Field label="代理身份" required><Select value="团队负责人" onChange={() => setForm({ ...form, identity: '团队负责人' })} options={TEAM_AGENT_ADD_IDENTITY_OPTIONS} /></Field>}
        </FormGrid>
        <AgentFormDivider />
        <FormGrid columns={1}>
          <Field label="承担全部运营费" help="仅对直属层会员有效"><AgentRadioGroup value={form.carryAllFees} onChange={(value) => setForm({ ...form, carryAllFees: value })} options={['是', '否']} /></Field>
        </FormGrid>
        <AgentFormDivider />
        <FormGrid columns={1}>
          <Field label="代理状态" required><AgentRadioGroup value={form.status} onChange={(value) => setForm({ ...form, status: value })} options={[{ value: '启用', label: '正常' }, { value: '停用', label: '停用' }]} /></Field>
          <Field label="代理备注"><textarea className="ta-input agent-remark" value={form.remark} onChange={(event) => setForm({ ...form, remark: event.target.value })} placeholder="请输入代理备注" /></Field>
        </FormGrid>
      </div>
    </Modal>
    <Modal open={modal === 'edit'} title="修改代理" onClose={closeModal} onConfirm={saveEditAgent} confirmText="确定" width={760}>
      <div className="agent-modal-form">
        <FormGrid columns={1}>
          <Field label="代理账号"><Input value={editForm.account || selected?.account || ''} disabled /></Field>
          <Field label="站点编码"><Select value={editForm.site || selected?.site || ''} options={SITE_OPTIONS} disabled /></Field>
          <Field label="佣金方案"><Select value={editForm.plan} onChange={(value) => setEditForm({ ...editForm, plan: value })} options={editPlanOptions} /></Field>
          <Field label="代理类型" required><Select value={editForm.agentType} onChange={changeEditAgentType} options={AGENT_TYPE_OPTIONS} /></Field>
          {editForm.agentType === '团队代理'
            ? <><Field label="团队类型" required><Select value={editForm.teamAgentType} onChange={(value) => setEditForm({ ...editForm, teamAgentType: value })} options={TEAM_AGENT_TYPE_OPTIONS} /></Field><Field label="代理身份" required><Select value={editForm.identity} onChange={(value) => setEditForm({ ...editForm, identity: value })} options={TEAM_AGENT_IDENTITY_OPTIONS} /></Field></>
            : <Field label={editForm.agentType === '星级代理' ? '星级级别' : '层级级别'} required><Select value={editForm.rank} onChange={(value) => setEditForm({ ...editForm, rank: value })} options={editForm.agentType === '星级代理' ? STAR_LEVEL_OPTIONS : LEVEL_OPTIONS} /></Field>}
          <Field label="返佣比例"><div className="agent-static-value">{commissionRateHint(editForm.agentType, editForm.rank)} <small>站点上限：80.00%，代理返佣必须低于站点返佣</small></div></Field>
        </FormGrid>
        <AgentFormDivider />
        <FormGrid columns={1}>
          <Field label="承担全部运营费" help="仅对直属层会员有效"><AgentRadioGroup value={editForm.carryAllFees} onChange={(value) => setEditForm({ ...editForm, carryAllFees: value })} options={['是', '否']} /></Field>
        </FormGrid>
        <AgentFormDivider />
        <FormGrid columns={1}>
          <Field label="上级代理"><Select value={editForm.parent} onChange={(value) => setEditForm({ ...editForm, parent: value })} options={editParentOptions} /></Field>
          <Field label="是否迁移本期未结算费用"><AgentRadioGroup value={editForm.migratePendingCost} onChange={(value) => setEditForm({ ...editForm, migratePendingCost: value })} options={['是', '否']} /></Field>
          <Field label="代理状态" required><AgentRadioGroup value={editForm.status} onChange={(value) => setEditForm({ ...editForm, status: value })} options={[{ value: '启用', label: '正常' }, { value: '停用', label: '停用' }]} /></Field>
          <Field label="代理备注"><textarea className="ta-input agent-remark" value={editForm.remark || ''} onChange={(event) => setEditForm({ ...editForm, remark: event.target.value })} placeholder="请输入代理备注" /></Field>
        </FormGrid>
      </div>
    </Modal>
    <Modal open={modal === 'password'} title={`${selected?.account || ''} · 修改密码`} description="仅演示密码校验和操作反馈，不展示原密码。" onClose={closeModal} onConfirm={() => showResult({ ok: passwordForm.password.length >= 6 && passwordForm.password === passwordForm.confirm, message: passwordForm.password.length < 6 ? '新密码至少 6 位' : passwordForm.password !== passwordForm.confirm ? '两次密码输入不一致' : '代理密码已修改' }, onToast, closeModal)}>
      <FormGrid><Field label="新密码" required><Input type="password" value={passwordForm.password} onChange={(value) => setPasswordForm({ ...passwordForm, password: value })} /></Field><Field label="确认密码" required><Input type="password" value={passwordForm.confirm} onChange={(value) => setPasswordForm({ ...passwordForm, confirm: value })} /></Field></FormGrid>
    </Modal>
    <Modal open={modal === 'subAgents'} title={`${selected?.account || ''} · 下级代理详情`} description="展示下级代理编号、账号和注册时间。" onClose={closeModal} onConfirm={closeModal} confirmText="关闭" showCancel={false} width={720}>
      <DataTable columns={[{ key: 'id', label: '代理编号' }, { key: 'account', label: '代理账号' }, { key: 'registeredAt', label: '注册时间' }]} rows={selected?.subAgentDetails || []} />
    </Modal>
  </>
}

function TeamOverview({ team, data }) {
  const metrics = team.metrics
  const counts = teamOverviewCounts(team, data)
  const gradeProgress = teamGradeProgress(team, data)
  return <div className="ta-stack">
    <MetricGrid columns={2}><MetricCard label="团队当前余额" value={<Money value={metrics.correctedNet} signed />} helper="当月结余 = 冲正后净输赢" tone="orange" /><MetricCard label="未结算收益" value={<Money value={metrics.payable} />} helper={`${metrics.grade} / ${(metrics.rate * 100).toFixed(0)}% 团队返佣`} tone="green" /></MetricGrid>
    <DescriptionGrid columns={4} items={[
      { label: '代理部编号', value: `${team.code} / ${team.id}` }, { label: '所属站点 / 币种', value: `${team.site} / ${team.currency}` }, { label: '团队负责人', value: team.mainAgent },
      { label: '团队类型', value: team.teamType }, { label: '推广人员', value: team.developer }, { label: '团队方案', value: team.plan }, { label: '创建时间', value: team.createdAt }, { label: '加入团队时间', value: team.joinedAt }, { label: '生效周期', value: `${team.startCycle} 起` }, { label: '团队状态', value: <StatusTag>{team.status}</StatusTag> },
      { label: '团队代理总人数', value: counts.agentTotal }, { label: '总会员数', value: counts.memberTotal }, { label: '活跃会员数', value: counts.activeMembers }, { label: '副线', value: counts.secondaryTotal }, { label: '独立代理', value: counts.singleTotal }, { label: '团队返佣等级', value: `${metrics.grade} / ${(metrics.rate * 100).toFixed(0)}%` },
    ]} />
    <TeamGradeSummary metrics={metrics} progress={gradeProgress} />
    <Alert title="平台责任边界" tone="warning">团队每个周期只形成一张未结算收益账单，唯一收款方是当期团队负责人。副线不形成平台应付账单，团队内部分配以团队分佣结算记录为准。</Alert>
    <FormulaPanel title="团队当前余额与未结算收益口径" items={[
      { label: '净输赢', formula: '总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费', value: `¥${metrics.currentNet.toLocaleString()}` },
      { label: '冲正后净输赢', formula: '净输赢 + 上月结余 + 本月结余调整', value: `¥${metrics.correctedNet.toLocaleString()}` },
      { label: '团队当前余额', formula: '团队当前余额 = 冲正后净输赢', value: `¥${metrics.correctedNet.toLocaleString()}` },
      { label: '未结算收益', formula: 'MAX（0，团队当前余额 × 团队返佣比例 + 佣金调整）', value: `¥${metrics.payable.toLocaleString()}` },
    ]} warning="加入团队时代理当月结余带入新团队；移出团队时当月结余留在原团队；团队解散后由指定承接代理承担剩余结余。" />
  </div>
}

function MasterTeamsPage({ onToast }) {
  const { data, createTeam, addSecondary, setTeamStatus, changeMain, updateTeamPreferences } = useTeamAgent()
  const [selectedId, setSelectedId] = useState(null)
  const [tab, setTab] = useState('overview')
  const [modal, setModal] = useState(null)
  const [teamInspect, setTeamInspect] = useState(null)
  const [teamFilters, setTeamFilters] = useState({ name: '', type: '', agent: '', createdFrom: '' })
  const [teamForm, setTeamForm] = useState({ name: '', mainAgent: '', teamType: '推广团队', developer: '', plan: '旺财团队月结方案', startCycle: '2026-08', site: '旺财体育' })
  const [editTeamForm, setEditTeamForm] = useState({ name: '', teamType: '推广团队' })
  const [secondaryForm, setSecondaryForm] = useState({ agent: '', scope: '', startCycle: '2026-08' })
  const [mainForm, setMainForm] = useState({ nextMain: '', effectiveCycle: '2026-08' })
  const [commissionOverrides, setCommissionOverrides] = useState({}); const [issuedCommissions, setIssuedCommissions] = useState([])
  const [commissionForm, setCommissionForm] = useState({ lineId: '', amount: '', reason: '本月团队分佣手工调整' })
  const team = data.teams.find((item) => item.id === selectedId)
  const teamRows = data.teams.filter((item) => (!teamFilters.name || item.name.includes(teamFilters.name) || item.code.includes(teamFilters.name)) && (!teamFilters.type || item.teamType === teamFilters.type) && (!teamFilters.agent || item.mainAgent.toLowerCase().includes(teamFilters.agent.toLowerCase()) || item.lines.some((line) => line.agent.toLowerCase().includes(teamFilters.agent.toLowerCase()))) && (!teamFilters.createdFrom || String(item.createdAt).slice(0, 10) >= teamFilters.createdFrom))
  const inspectConfig = teamInspect ? getTeamInspectConfig(teamInspect.type, data.teams.find((item) => item.id === teamInspect.teamId), data) : null

  const teamColumns = [
    { key: 'code', label: '团队编号' }, { key: 'name', label: '团队名称', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'teamType', label: '团队类型' }, { key: 'site', label: '站点' }, { key: 'mainAgent', label: '主线账号' },
    { key: 'lines', label: '团队人数', render: (_, row) => <ActionLink onClick={() => setTeamInspect({ type: 'teamAgents', teamId: row.id })}>{teamAgentRows(row, data).length}</ActionLink> }, { key: 'memberCount', label: '会员人数', render: (_, row) => <ActionLink onClick={() => setTeamInspect({ type: 'members', teamId: row.id })}>{teamMemberCount(row, data)}</ActionLink> },
    { key: 'lineBreakdown', label: '团队副线/单线', render: (_, row) => <div className="team-line-breakdown"><ActionLink onClick={() => setTeamInspect({ type: 'secondary', teamId: row.id })}>团队副线 {teamSecondaryRows(row, data).length}</ActionLink><ActionLink onClick={() => setTeamInspect({ type: 'single', teamId: row.id })}>单线 {teamSingleRows(row, data).length}</ActionLink></div> },
    { key: 'createdAt', label: '创建时间' }, { key: 'joinedAt', label: '加入团队时间' },
    { key: 'plan', label: '团队方案' }, { key: 'metrics', label: '本月结余', render: (value) => <Money value={value.correctedNet} signed /> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => { setSelectedId(row.id); setTab('overview') }}>详情</ActionLink><ActionLink onClick={() => { setSelectedId(row.id); setEditTeamForm({ name: row.name, teamType: row.teamType }); setModal('edit') }}>编辑</ActionLink><ActionLink onClick={() => { setSelectedId(row.id); setModal('secondary') }}>开副线</ActionLink></div> },
  ]

  function closeModal() {
    setModal(null)
  }

  function openCommissionEditor(row) {
    setCommissionForm({ lineId: row.lineId, amount: String(row.estimatedDividend), reason: '本月团队分佣手工调整' })
    setModal('commissionEdit')
  }

  function openCommissionPayout(row) {
    setCommissionForm({ lineId: row.lineId, amount: String(row.estimatedDividend), reason: '确认发放本期团队分佣' })
    setModal('commissionPayout')
  }

  function saveCommissionEdit() {
    const amount = Number(commissionForm.amount)
    if (!Number.isFinite(amount) || amount < 0) return onToast('本月发放佣金不能小于 0', 'error')
    setCommissionOverrides((current) => ({ ...current, [commissionForm.lineId]: amount }))
    onToast('本月发放佣金已更新', 'success')
    closeModal()
  }

  function confirmCommissionPayout() {
    const row = commissionRows.find((item) => item.lineId === commissionForm.lineId)
    const amount = Number(commissionForm.amount)
    if (!row || !Number.isFinite(amount) || amount < 0) return onToast('请选择有效的发放记录', 'error')
    const operatedAt = new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-')
    const record = { ...row, id: `PAY-${team.id}-${row.lineId}`, teamId: team.id, cycle: '2026-07', estimatedDividend: amount, state: '已发放', operatedAt }
    setIssuedCommissions((rows) => [record, ...rows.filter((item) => !(item.teamId === team.id && item.lineId === row.lineId && item.cycle === '2026-07'))])
    onToast('团队分佣已二次确认并标记发放', 'success')
    closeModal()
  }

  if (!team) return <>
    <SectionHeader title="团队代理管理" description="以代理部为团队结算单元，统一管理主线、副线、合并考核和平台账单。" actions={<Button icon={<PlusOutlined />} onClick={() => setModal('create')}>创建代理部</Button>} />
    <MetricGrid columns={4}><MetricCard label="代理部数量" value={data.teams.length} helper="含待生效代理部" icon={<ApartmentOutlined />} /><MetricCard label="生效中团队" value={data.teams.filter((item) => item.status === '生效中').length} tone="green" icon={<CheckCircleOutlined />} /><MetricCard label="主副线总数" value={data.teams.reduce((sum, item) => sum + item.lines.length, 0)} tone="blue" icon={<TeamOutlined />} /><MetricCard label="待处理变更" value={data.requests.filter((item) => ['待站点复核', '待补充资料'].includes(item.status)).length} tone="orange" icon={<ClockCircleOutlined />} /></MetricGrid>
    <FilterBar onSearch={() => onToast(`已查询 ${teamRows.length} 个团队`)} onReset={() => setTeamFilters({ name: '', type: '', agent: '', createdFrom: '' })} onExport={() => onToast('团队列表已导出')}><Field label="团队名称"><Input value={teamFilters.name} onChange={(value) => setTeamFilters({ ...teamFilters, name: value })} placeholder="名称或编号" /></Field><Field label="团队类型"><Select value={teamFilters.type} onChange={(value) => setTeamFilters({ ...teamFilters, type: value })} placeholder="全部类型" options={['推广团队', '运营团队']} /></Field><Field label="代理编号/账号"><Input value={teamFilters.agent} onChange={(value) => setTeamFilters({ ...teamFilters, agent: value })} placeholder="主线或副线" /></Field><Field label="创建时间起"><Input type="date" value={teamFilters.createdFrom} onChange={(value) => setTeamFilters({ ...teamFilters, createdFrom: value })} /></Field></FilterBar>
    <DataTable minWidth={2100} columns={teamColumns} rows={teamRows} paginated />
    <Modal open={!!teamInspect} title={inspectConfig?.title || '明细'} description={inspectConfig?.description} onClose={() => setTeamInspect(null)} onConfirm={() => setTeamInspect(null)} confirmText="关闭" showCancel={false} width={760}>
      {inspectConfig && <DataTable columns={inspectConfig.columns} rows={inspectConfig.rows} rowKey="id" paginated />}
    </Modal>
    <Modal open={modal === 'create'} title="创建代理部" description="指定团队类型、团队负责人和未来完整生效周期。" onClose={closeModal} onConfirm={() => showResult(createTeam(teamForm), onToast, closeModal)}>
      <FormGrid><Field label="代理部名称" required><Input value={teamForm.name} onChange={(value) => setTeamForm({ ...teamForm, name: value })} placeholder="例如：gaodashang02部" /></Field><Field label="团队类型"><Select value={teamForm.teamType} onChange={(value) => setTeamForm({ ...teamForm, teamType: value })} options={['推广团队', '运营团队']} /></Field><Field label="推广人员"><Input value={teamForm.developer} onChange={(value) => setTeamForm({ ...teamForm, developer: value })} placeholder="默认使用团队负责人" /></Field><Field label="所属站点"><Select value={teamForm.site} onChange={(value) => setTeamForm({ ...teamForm, site: value })} options={['旺财体育', '财神客栈']} /></Field><Field label="团队负责人" required><Input value={teamForm.mainAgent} onChange={(value) => setTeamForm({ ...teamForm, mainAgent: value })} placeholder="请输入代理账号" /></Field><Field label="团队方案"><Select value={teamForm.plan} onChange={(value) => setTeamForm({ ...teamForm, plan: value })} options={data.plans.filter((plan) => plan.type === '团队佣金方案').map((plan) => plan.name)} /></Field><Field label="生效周期"><Select value={teamForm.startCycle} onChange={(value) => setTeamForm({ ...teamForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
      <Alert title="周期约束">代理部从目标完整周期开始参与考核，不追溯当前周期和历史账单。</Alert>
    </Modal>
  </>

  const tabs = [
    { value: 'overview', label: '团队概况' }, { value: 'structure', label: '主副线结构', count: team.lines.length }, { value: 'performance', label: '团队分佣结算' },
    { value: 'bills', label: '团队账单', count: data.bills.filter((bill) => bill.unitId === team.id).length },
    { value: 'changes', label: '关系记录', count: data.requests.filter((item) => item.currentUnit.includes(team.name) || item.targetUnit.includes(team.name)).length }, { value: 'operations', label: '操作记录', count: data.teamOperations.filter((item) => item.teamId === team.id).length },
  ]
  const lineColumns = [
    { key: 'identity', label: '身份', render: (value) => <StatusTag tone={value === '主线' ? 'blue' : 'gray'}>{value}</StatusTag> }, { key: 'lineId', label: 'line_id' }, { key: 'agent', label: '负责人', render: (value) => <b>{value}</b> }, { key: 'scope', label: '显式业务范围' },
    { key: 'newActive', label: '新增活跃' }, { key: 'firstDepositCount', label: '新增首存', render: (value) => Number(value || 0) }, { key: 'firstDepositAmount', label: '首存额度', render: (value) => <Money value={value} /> }, { key: 'activeMembers', label: '活跃会员' }, { key: 'netWinLoss', label: '总盈亏', render: (value) => <Money value={value} signed /> }, { key: 'startCycle', label: '生效周期' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
  ]
  const issuedMap = issuedCommissions.filter((item) => item.teamId === team.id && item.cycle === '2026-07').reduce((map, item) => ({ ...map, [item.lineId]: item }), {})
  const commissionRows = buildTeamCommissionRows(team, commissionOverrides, issuedMap)
  const selectedCommissionRow = commissionRows.find((item) => item.lineId === commissionForm.lineId)
  const historyRows = buildTeamSettlementHistoryRows(team, commissionRows, issuedCommissions.filter((item) => item.teamId === team.id))
  const commissionColumns = [
    { key: 'identity', label: '身份', render: (value) => <StatusTag tone={value === '主线' ? 'blue' : 'gray'}>{value}</StatusTag> }, { key: 'lineId', label: 'line_id' }, { key: 'agent', label: '负责人', render: (value) => <b>{value}</b> }, { key: 'scope', label: '显式业务范围' },
    { key: 'newActive', label: '新增活跃' }, { key: 'firstDepositCount', label: '新增首存' }, { key: 'firstDepositAmount', label: '首存额度', render: (value) => <Money value={value} /> }, { key: 'activeMembers', label: '活跃会员' }, { key: 'totalWinLoss', label: '总盈亏', render: (value) => <Money value={value} signed /> },
    { key: 'operationFee', label: '运营费用', render: (value) => <Money value={value} /> }, { key: 'netRevenue', label: '净收益', render: (value) => <Money value={value} signed /> }, { key: 'historicalDebt', label: '历史欠款', render: (value) => <Money value={value} /> }, { key: 'agentBalance', label: '代理结余', render: (value) => <Money value={value} signed /> }, { key: 'contributionRate', label: '团队贡献占比', render: (value) => <Percent value={value} /> }, { key: 'estimatedDividend', label: '本期预估分红', render: (value) => <Money value={value} /> }, { key: 'payoutState', label: '发放状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => openCommissionEditor(row)}>修改</ActionLink><ActionLink onClick={() => openCommissionPayout(row)}>发放</ActionLink></div> },
  ]
  const historyColumns = [{ key: 'cycle', label: '结算周期' }, ...commissionColumns.filter((column) => column.key !== 'action' && column.key !== 'scope' && column.key !== 'newActive' && column.key !== 'firstDepositCount' && column.key !== 'firstDepositAmount' && column.key !== 'activeMembers').map((column) => column.key === 'payoutState' ? { key: 'state', label: '发放状态', render: (value) => <StatusTag>{value}</StatusTag> } : column), { key: 'operatedAt', label: '操作时间' }]
  const billRows = enrichBills(data).filter((bill) => bill.unitId === team.id)
  const changeRows = data.requests.filter((item) => item.currentUnit.includes(team.name) || item.targetUnit.includes(team.name))
  const operationRows = data.teamOperations.filter((item) => item.teamId === team.id).map((item) => ({ ...item, balanceHandling: item.balanceHandling || item.reason }))

  return <>
    <SectionHeader title={`${team.name} · 团队详情`} description={`${team.code}　${team.site} / ${team.currency}　主线：${team.mainAgent}`} actions={<><Button variant="ghost" onClick={() => setSelectedId(null)}>返回列表</Button><Button icon={<UserAddOutlined />} onClick={() => setModal('secondary')}>开设副线</Button><Button icon={<SwapOutlined />} variant="ghost" onClick={() => setModal('main')}>更换主线</Button><Button icon={<LockOutlined />} variant="warning" onClick={() => showResult(setTeamStatus(team.id, team.status === '冻结' ? '生效中' : '冻结'), onToast)}> {team.status === '冻结' ? '解冻' : '冻结'}</Button><Button icon={<StopOutlined />} variant="danger" onClick={() => showResult(setTeamStatus(team.id, '已解散'), onToast)}>解散</Button></>} />
    <Tabs items={tabs} active={tab} onChange={setTab} />
    {tab === 'overview' && <TeamOverview team={team} data={data} />}
    {tab === 'structure' && <Panel title="主副线结构" description="每条线使用唯一 line_id 划分业务范围，父级汇总不重复计入。" actions={<Button icon={<UserAddOutlined />} size="small" onClick={() => setModal('secondary')}>开副线</Button>}><DataTable columns={lineColumns} rows={team.lines} rowKey="lineId" minWidth={1250} /></Panel>}
    {tab === 'performance' && <div className="ta-stack"><MetricGrid columns={4}><MetricCard label="新增活跃会员" value={team.metrics.newActive} helper="团队会员去重后统计" tone="blue" /><MetricCard label="活跃会员数量" value={team.metrics.activeMembers} helper="每名会员每周期最多计1次" /><MetricCard label="总盈亏" value={<Money value={team.metrics.totalWinLoss} signed />} helper="团队各线总输赢合计" tone="green" /><MetricCard label="本期预估分红" value={<Money value={commissionRows.reduce((sum, row) => sum + Number(row.estimatedDividend || 0), 0)} />} helper="可在操作列手工调整" tone="orange" /></MetricGrid><Panel title="团队分佣结算" description="按线路展示总盈亏、成本扣减、结余和贡献占比；本期预估分红可修改，发放需二次确认。"><DataTable columns={commissionColumns} rows={commissionRows} rowKey="lineId" minWidth={1900} /></Panel><Panel title="历史结算记录" description="展示历史周期及本期已确认发放记录，便于演示团队分佣追溯。"><DataTable columns={historyColumns} rows={historyRows} rowKey="id" minWidth={1500} paginated /></Panel><FormulaPanel title="团队分佣结算口径" items={[{ label: '总盈亏', formula: '团队各线总输赢合计', value: `¥${team.metrics.totalWinLoss.toLocaleString()}` }, { label: '净收益', formula: '总盈亏 − 运营费用', value: `¥${team.metrics.currentNet.toLocaleString()}` }, { label: '代理结余', formula: '净收益 − 历史欠款' }, { label: '本期预估分红', formula: '团队应付佣金 × 团队贡献占比，可手工修改至 0 后发放', value: `¥${team.metrics.payable.toLocaleString()}` }]} /></div>}
    {tab === 'bills' && <Panel title="团队平台账单" description="每个佣金周期最多一张团队账单，唯一收款方为当期主线。"><DataTable columns={billColumns((row) => <ActionLink onClick={() => onToast(`${row.id} 账单详情已打开`)}>详情</ActionLink>)} rows={billRows} minWidth={4200} paginated /></Panel>}
    {tab === 'changes' && <Panel title="关系与模式变更" description="所有变更从未来完整周期生效，并明确当月结余归属。"><DataTable columns={requestColumns} rows={changeRows} minWidth={1600} paginated /></Panel>}
    {tab === 'operations' && <Panel title="团队操作记录" description="记录创建、编辑、开副线和关系操作，并保留结余处理说明。"><DataTable columns={operationColumns} rows={operationRows} minWidth={1500} paginated /></Panel>}

    <Modal open={modal === 'secondary'} title={`为 ${team.name} 开设副线`} description="副线范围必须明确且不能与其他结算单元重叠。" onClose={closeModal} onConfirm={() => showResult(addSecondary(team.id, { ...secondaryForm, requireReview: true }), onToast, closeModal)}>
      <FormGrid><Field label="副线负责人" required><Input value={secondaryForm.agent} onChange={(value) => setSecondaryForm({ ...secondaryForm, agent: value })} placeholder="请输入代理账号" /></Field><Field label="生效周期"><Select value={secondaryForm.startCycle} onChange={(value) => setSecondaryForm({ ...secondaryForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field><Field label="业务范围" className="ta-field-full"><Input value={secondaryForm.scope} onChange={(value) => setSecondaryForm({ ...secondaryForm, scope: value })} placeholder="例如：该代理节点及直属会员" /></Field></FormGrid>
      <Alert title="唯一归属检查">保存前会检查目标代理是否已属于其他团队或独立单线；当前周期不追溯切分。</Alert>
    </Modal>
    <Modal open={modal === 'main'} title={`更换 ${team.name} 团队负责人`} description="换主线只影响未来周期，历史账单和历史结算记录仍归原主线。" onClose={closeModal} onConfirm={() => showResult(changeMain(team.id, mainForm.nextMain, mainForm.effectiveCycle), onToast, closeModal)}>
      <FormGrid><Field label="当前主线"><Input value={team.mainAgent} disabled /></Field><Field label="新团队负责人" required><Input value={mainForm.nextMain} onChange={(value) => setMainForm({ ...mainForm, nextMain: value })} placeholder="请输入代理账号" /></Field><Field label="生效周期"><Select value={mainForm.effectiveCycle} onChange={(value) => setMainForm({ ...mainForm, effectiveCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
      {team.processingOccupied > 0 && <Alert tone="error" title="当前存在阻止项">处理中发放占用金额为 ¥{team.processingOccupied.toLocaleString()}，申请可保存但完成前不能批准。</Alert>}
    </Modal>
    <Modal open={modal === 'commissionEdit'} title="修改本月发放佣金" description="仅修改本期团队分佣结算页展示金额，最低可调整为 0。" onClose={closeModal} onConfirm={saveCommissionEdit} confirmText="保存修改">
      <FormGrid><Field label="代理账号"><Input value={selectedCommissionRow?.agent || ''} disabled /></Field><Field label="可参考预估分红"><Input value={selectedCommissionRow ? `¥${Number(selectedCommissionRow.estimatedDividend || 0).toLocaleString()}` : ''} disabled /></Field><Field label="本月发放佣金" required><Input type="number" min="0" value={commissionForm.amount} onChange={(value) => setCommissionForm({ ...commissionForm, amount: value })} /></Field><Field label="调整原因" className="ta-field-full"><Input value={commissionForm.reason} onChange={(value) => setCommissionForm({ ...commissionForm, reason: value })} /></Field></FormGrid>
      <Alert title="调整规则">本月发放佣金可以改为 0；保存后只影响本期预估分红展示和后续二次确认发放，不回写历史结算。</Alert>
    </Modal>
    <Modal open={modal === 'commissionPayout'} title="二次确认发放" description="确认后会生成本期历史结算记录，并把该线路标记为已发放。" onClose={closeModal} onConfirm={confirmCommissionPayout} confirmText="确认发放">
      <DescriptionGrid columns={2} items={[{ label: '代理账号', value: selectedCommissionRow?.agent || '—' }, { label: '代理身份', value: selectedCommissionRow?.identity || '—' }, { label: '本月发放佣金', value: <Money value={Number(commissionForm.amount || 0)} /> }, { label: '结算周期', value: '2026-07' }]} />
      <Alert tone="warning" title="二次确认">发放为演示状态流转；确认后可在“历史结算记录”中看到本期发放记录。</Alert>
    </Modal>
    <Modal open={modal === 'edit'} title={`${team.name} · 编辑团队`} description="维护团队名称和团队类型。" onClose={closeModal} onConfirm={() => showResult(updateTeamPreferences(team.id, { name: editTeamForm.name, teamType: editTeamForm.teamType }), onToast, closeModal)}>
      <FormGrid><Field label="团队名称"><Input value={editTeamForm.name} onChange={(value) => setEditTeamForm({ ...editTeamForm, name: value })} /></Field><Field label="团队类型"><Select value={editTeamForm.teamType} onChange={(value) => setEditTeamForm({ ...editTeamForm, teamType: value })} options={['推广团队', '运营团队']} /></Field></FormGrid>
    </Modal>
  </>
}

const requestColumns = [
  { key: 'id', label: '申请编号' }, { key: 'type', label: '变更类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'applicant', label: '申请人' }, { key: 'currentUnit', label: '原结算单元' }, { key: 'targetUnit', label: '目标结算单元' },
  { key: 'effectiveCycle', label: '生效周期' }, { key: 'balanceHandling', label: '当月结余处理' }, { key: 'recommender', label: '推荐人' }, { key: 'conflict', label: '冲突检查', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'createdAt', label: '申请时间' }, { key: 'note', label: '业务说明' },
]

const operationColumns = [
  { key: 'id', label: '序号' }, { key: 'teamName', label: '团队名称' }, { key: 'teamType', label: '团队类型' }, { key: 'mainId', label: '主线编号' }, { key: 'mainAccount', label: '主线账号' }, { key: 'secondaryAccounts', label: '副线账号' }, { key: 'action', label: '操作内容' }, { key: 'reason', label: '操作理由' }, { key: 'balanceHandling', label: '当月结余处理' }, { key: 'createdAt', label: '操作时间' }, { key: 'operator', label: '操作人' },
]

function enrichBills(data) {
  return data.bills.map((bill, index) => {
    const agent = data.agents.find((item) => item.account === bill.payee)
    const recordAgentType = resolveRecordAgentType(bill, agent)
    return {
      ...bill,
      sequence: index + 1,
      agentId: agent?.id || '—',
      parentAccount: agent?.parent || '—',
      developer: agent?.developer || '—',
      inTeam: bill.type === '团队佣金' ? '是' : '否',
      isMainLine: bill.type === '团队佣金' ? '是' : '否',
      remaining: Math.max(0, bill.payable - bill.issued),
      recordAgentType,
      recordAgentIdentity: resolveRecordAgentIdentity(recordAgentType, bill, agent),
      monthlyFlow: bill.monthlyFlow ?? agent?.validBetting ?? Number(bill.depositAmount || 0) + Number(bill.withdrawalAmount || 0),
      firstDepositAmount: bill.firstDepositAmount ?? Math.round(Number(bill.depositAmount || 0) * 0.18),
      retentionDays: bill.retentionDays ?? `${Math.max(0, Math.min(30, Math.round(Number(bill.activeCount || 0) / 4)))}天`,
      rebatePlan: bill.rebatePlan ?? bill.plan ?? (recordAgentType === '团队代理' ? '团队代理返佣方案' : recordAgentType === '星级代理' ? '星级返佣方案' : '多层级返佣方案'),
    }
  })
}

function resolveRecordAgentType(bill, agent) {
  if (agent?.agentType === '团队代理') return '团队代理'
  if (agent?.agentType === '星级代理') return '星级代理'
  if (agent?.agentType === '多层级代理') return '层级代理'
  if (['团队佣金', '独立单线佣金'].includes(bill.type)) return '团队代理'
  if (bill.agentType === '官方代理') return '星级代理'
  return '层级代理'
}

function resolveRecordAgentIdentity(recordAgentType, bill, agent) {
  if (recordAgentType === '团队代理') {
    if (bill.type === '团队佣金') return agent?.identity === '副线负责人' ? '副线负责人' : '团队负责人'
    if (bill.type === '独立单线佣金') return '独立代理'
    return normalizeTeamIdentity(agent?.identity || '团队代理成员')
  }
  if (recordAgentType === '星级代理') return /星/.test(bill.grade) ? bill.grade : '1星'
  return /层/.test(bill.grade) ? bill.grade : '1层'
}

function billColumns(renderActions) {
  const money = (value) => <Money value={value} />
  const signed = (value) => <Money value={value} signed />
  return [
    { key: 'sequence', label: '序号' }, { key: 'cycle', label: '佣金月份' }, { key: 'type', label: '账单类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'site', label: '所属站点' }, { key: 'unitName', label: '团队名称 / 单线' }, { key: 'agentId', label: '代理ID' }, { key: 'payee', label: '代理账号' }, { key: 'agentType', label: '代理类型' }, { key: 'becameAgentAt', label: '成为代理时间' }, { key: 'teamType', label: '团队类型' }, { key: 'parentAccount', label: '上级代理' },
    { key: 'teamMembers', label: '团队人数' }, { key: 'subAgentCount', label: '下级人数' }, { key: 'registeredCount', label: '注册人数' }, { key: 'firstDepositCount', label: '首存人数' }, { key: 'activeCount', label: '活跃会员' }, { key: 'newActiveCount', label: '新增活跃' }, { key: 'depositAmount', label: '存款金额', render: money }, { key: 'withdrawalAmount', label: '提款金额', render: money },
    { key: 'totalWinLoss', label: '总输赢', render: signed }, { key: 'venueFee', label: '场馆费', render: money }, { key: 'memberBonus', label: '会员红利', render: money }, { key: 'memberRebate', label: '会员返水', render: money }, { key: 'accountAdjustment', label: '账户调整', render: signed }, { key: 'manualOrderWinLoss', label: '补单输赢', render: signed }, { key: 'depositFee', label: '存款手续费', render: money }, { key: 'withdrawalFee', label: '提款手续费', render: money },
    { key: 'netWinLossRaw', label: '净输赢', render: signed }, { key: 'lastBalance', label: '上月结余', render: signed }, { key: 'balanceAdjustment', label: '本月结余调整', render: signed }, { key: 'correctedNet', label: '冲正后净输赢 / 本月结余', render: signed }, { key: 'grade', label: '佣金等级' }, { key: 'rate', label: '佣金比例', render: (value) => <Percent value={value} /> }, { key: 'commissionAdjustment', label: '佣金调整', render: signed }, { key: 'payable', label: '佣金', render: money }, { key: 'issued', label: '已发佣金', render: money }, { key: 'remaining', label: '待发佣金', render: money },
    { key: 'state', label: '账单状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'inTeam', label: '是否在团队' }, { key: 'isMainLine', label: '是否主线' }, { key: 'developer', label: '推广人员' }, { key: 'maintainer', label: '维护人' }, { key: 'reviewer', label: '审核人' }, { key: 'reviewedAt', label: '审核时间' }, { key: 'issuedBy', label: '发放人' }, { key: 'issuedAt', label: '发放时间' }, { key: 'adjustmentReason', label: '调整原因' }, { key: 'id', label: '账单编号' }, { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions">{renderActions?.(row)}</div> },
  ]
}

function commissionRecordColumns(renderActions) {
  const money = (value) => <Money value={value} />
  const signed = (value) => <Money value={value} signed />
  return [
    { key: 'check', label: '', render: () => <input type="checkbox" aria-label="选择佣金记录" /> },
    { key: 'cycle', label: '佣金周期' },
    { key: 'payee', label: '代理账号' },
    { key: 'site', label: '站点名称' },
    { key: 'recordAgentType', label: '代理类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'recordAgentIdentity', label: '代理身份' },
    { key: 'totalWinLoss', label: '总输赢', render: signed },
    { key: 'monthlyFlow', label: '月流水', render: money },
    { key: 'firstDepositAmount', label: '首充金额', render: money },
    { key: 'retentionDays', label: '留存天数' },
    { key: 'payable', label: '佣金金额', render: money },
    { key: 'rebatePlan', label: '返佣方案' },
    { key: 'state', label: '佣金状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'issuedAt', label: '发放时间' },
    { key: 'issuedBy', label: '发放人员' },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions">{renderActions?.(row)}</div> },
  ]
}

function MasterSinglesPage({ onToast }) {
  const { data, createSingle, requestChange } = useTeamAgent()
  const [showCreate, setShowCreate] = useState(false)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ name: '', owner: '', recommender: '', startCycle: '2026-08', plan: '独立单线月结方案', source: '站点直接创建' })
  const columns = [
    { key: 'code', label: '单线编号' }, { key: 'name', label: '独立单线', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'owner', label: '独立线主' }, { key: 'source', label: '创建来源' }, { key: 'recommender', label: '推荐人' },
    { key: 'plan', label: '佣金方案' }, { key: 'rewardPlan', label: '推荐奖励方案' }, { key: 'startCycle', label: '生效周期' }, { key: 'metrics', label: '当前等级', render: (value) => <StatusTag tone="blue">{value.grade}</StatusTag> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => setSelected(row)}>详情</ActionLink><ActionLink onClick={() => showResult(requestChange({ type: '独立单线加入团队', applicant: row.owner, currentUnit: row.name, targetUnit: 'apppay01部 / 待分配 line_id', recommender: '—' }), onToast)}>加入团队</ActionLink><ActionLink onClick={() => showResult(requestChange({ type: '终止独立单线', applicant: row.owner, currentUnit: row.name, targetUnit: '终止', recommender: row.recommender }), onToast)}>终止</ActionLink></div> },
  ]
  return <>
    <SectionHeader title="独立单线管理" description="独立计算指标、独立定级并由平台直接向线主结算。" actions={<Button icon={<PlusOutlined />} onClick={() => setShowCreate(true)}>创建单人单线</Button>} />
    <MetricGrid columns={4}><MetricCard label="独立单线数量" value={data.singles.length} icon={<BankOutlined />} /><MetricCard label="生效中" value={data.singles.filter((item) => item.status === '生效中').length} tone="green" /><MetricCard label="副线转入" value={data.singles.filter((item) => item.source === '副线转独立').length} tone="blue" /><MetricCard label="已绑定推荐人" value={data.singles.filter((item) => item.recommender !== '—').length} tone="orange" /></MetricGrid>
    <FilterBar onSearch={() => onToast('独立单线列表已查询')} onReset={() => onToast('筛选条件已重置')}><Field label="独立线主"><Input placeholder="代理账号" /></Field><Field label="创建来源"><Select value="" placeholder="全部来源" options={['站点直接创建', '副线转独立']} /></Field><Field label="状态"><Select value="" placeholder="全部状态" options={['待生效', '生效中', '冻结', '已终止']} /></Field></FilterBar>
    <DataTable paginated minWidth={1320} columns={columns} rows={data.singles} />
    <FormulaPanel title="独立单线与推荐奖励" items={[{ label: '本月结余', formula: '净输赢 + 上月结余 + 本月结余调整' }, { label: '独立单线佣金', formula: 'MAX（0，冲正后净输赢 × 比例 + 佣金调整）' }, { label: '推荐奖励', formula: '独立单线已审核应付佣金 × 奖励比例 x%' }, { label: '停止奖励', formula: '独立单线加入团队的生效周期起停止计提' }]} warning="推荐奖励由平台另行计提，不从独立线主佣金中扣减。" />
    <Modal open={showCreate} title="创建单人单线" description="初始业务范围仅包含线主本人代理节点。" onClose={() => setShowCreate(false)} onConfirm={() => showResult(createSingle(form), onToast, () => setShowCreate(false))}>
      <FormGrid><Field label="单线名称"><Input value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="留空则使用线主命名" /></Field><Field label="独立线主" required><Input value={form.owner} onChange={(value) => setForm({ ...form, owner: value })} placeholder="请输入代理账号" /></Field><Field label="佣金方案"><Select value={form.plan} onChange={(value) => setForm({ ...form, plan: value })} options={data.plans.filter((plan) => plan.type === '独立单线方案').map((plan) => plan.name)} /></Field><Field label="推荐主线"><Input value={form.recommender} onChange={(value) => setForm({ ...form, recommender: value })} placeholder="可不填写" /></Field><Field label="生效周期"><Select value={form.startCycle} onChange={(value) => setForm({ ...form, startCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
    </Modal>
    <Modal open={!!selected} title={`${selected?.name || ''} · 详情`} description="独立单线业务、考核和推荐关系快照。" onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭">
      {selected && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '独立线主', value: selected.owner }, { label: '创建来源', value: selected.source }, { label: '业务范围', value: selected.scope }, { label: '推荐人', value: selected.recommender }, { label: '佣金方案', value: selected.plan }, { label: '生效周期', value: selected.startCycle }]} /><MetricGrid columns={3}><MetricCard label="新增活跃" value={selected.metrics.newActive} /><MetricCard label="活跃会员" value={selected.metrics.activeMembers} /><MetricCard label="冲正后净输赢 / 本月结余" value={<Money value={selected.metrics.assessmentNet} />} tone="green" /><MetricCard label="等级" value={selected.metrics.grade} tone="blue" /><MetricCard label="比例" value={<Percent value={selected.metrics.rate} />} /><MetricCard label="应付佣金" value={<Money value={selected.metrics.payable} />} tone="orange" /></MetricGrid><FormulaPanel title="独立单线当月结余口径" items={[{ label: '本月结余', formula: '净输赢 + 上月结余 + 本月结余调整', value: `¥${selected.metrics.assessmentNet.toLocaleString()}` }, { label: '应付佣金', formula: 'MAX（0，本月结余 × 佣金比例 + 佣金调整）', value: `¥${selected.metrics.payable.toLocaleString()}` }]} /></div>}
    </Modal>
  </>
}

const REBATE_UPDATED_AT = '2026-07-17 05:14'
const REBATE_TYPE_OPTIONS = [
  { value: 'level', label: '层级代理' },
  { value: 'star', label: '星级代理' },
  { value: 'team', label: '团队代理' },
]
const REBATE_CONDITION_KEYS = ['newMembers', 'firstDepositMembers', 'firstDepositAmount', 'activeMembers', 'totalWinLoss']
const BASE_REBATE_ROWS = [
  {
    id: 'REBATE-A',
    sequence: 1,
    name: '财神Excel0419活动礼金A链方案',
    createdAt: '2026-04-19 16:06:26',
    operator: 'admin',
    operatedAt: '2026-06-04 15:47:32',
    mode: 'level',
    details: [
      { level: 0, rate: 0.01 },
      { level: 1, rate: 0.16 },
      { level: 2, rate: 0.2 },
      { level: 3, rate: 0.25 },
      { level: 4, rate: 0.3 },
      { level: 5, rate: 0.35 },
      { level: 6, rate: 0.4 },
      { level: 7, rate: 0.45 },
      { level: 9, rate: 0.5 },
    ],
  },
  {
    id: 'REBATE-B',
    sequence: 2,
    name: '财神Excel0419活动礼金B链方案',
    createdAt: '2026-04-19 16:06:26',
    operator: 'admin',
    operatedAt: '2026-04-19 16:06:26',
    mode: 'level',
    details: [
      { level: 1, rate: 0.25 },
      { level: 2, rate: 0.3 },
      { level: 3, rate: 0.35 },
      { level: 4, rate: 0.4 },
      { level: 5, rate: 0.45 },
      { level: 6, rate: 0.5 },
      { level: 7, rate: 0.55 },
      { level: 8, rate: 0.6 },
    ],
  },
  {
    id: 'REBATE-STAR',
    sequence: 3,
    name: '财神Excel0419活动礼金C链星级返佣方案',
    createdAt: '2026-04-19 16:06:26',
    operator: 'admin',
    operatedAt: '2026-04-19 16:06:26',
    mode: 'star',
    details: [
      { level: 3, rate: 0.15 },
      { level: 6, rate: 0.3 },
    ],
  },
  {
    id: 'REBATE-CS',
    sequence: 4,
    name: '财神Excel佣金测试方案20260406',
    createdAt: '2026-04-16 19:08:29',
    operator: 'commission_excel_cs_20260406_test',
    operatedAt: '2026-04-16 19:08:29',
    mode: 'level',
    details: [
      { level: 5, rate: 0.35 },
      { level: 6, rate: 0.4 },
      { level: 7, rate: 0.45 },
      { level: 8, rate: 0.5 },
    ],
  },
  {
    id: 'REBATE-WC',
    sequence: 5,
    name: '旺财测试多层级返佣方案',
    createdAt: '2026-04-11 17:03:40',
    operator: 'codex',
    operatedAt: '2026-04-11 17:03:40',
    mode: 'level',
    details: [
      { level: 1, rate: 0.05 },
      { level: 2, rate: 0.08 },
      { level: 3, rate: 0.1 },
    ],
  },
]

function buildLegacyRebateRows(plans) {
  const teamPlan = plans.find((plan) => plan.type === '团队佣金方案')
  const teamDetails = (teamPlan?.levels?.length ? teamPlan.levels : [
    { rate: 0.3 }, { rate: 0.35 }, { rate: 0.4 }, { rate: 0.45 }, { rate: 0.5 }, { rate: 0.55 },
  ]).map((level, index) => ({ level: index + 1, newMembers: level.newActive ?? '', firstDepositMembers: level.firstDepositMembers ?? '', firstDepositAmount: level.firstDepositAmount ?? '', activeMembers: level.activeMembers ?? '', totalWinLoss: level.netWinLoss ?? '', rate: level.rate || 0 }))
  return [
    ...BASE_REBATE_ROWS,
    {
      id: 'REBATE-TEAM',
      sequence: BASE_REBATE_ROWS.length + 1,
      name: teamPlan?.name || '旺财团队月结方案',
      createdAt: '2026-07-16 18:18:00',
      operator: 'codex',
      operatedAt: '2026-07-16 18:18:00',
      mode: 'team',
      details: teamDetails,
    },
  ]
}

function rebatePercent(rate) {
  return `${(Number(rate || 0) * 100).toFixed(2)}%`
}

function hasRebateCondition(value) {
  return value !== '' && value !== null && value !== undefined
}

function rebateAmount(value) {
  if (!hasRebateCondition(value)) return ''
  return Number(value).toLocaleString('zh-CN')
}

function rebateConditionText(detail) {
  const items = [
    hasRebateCondition(detail.newMembers) ? `新增活跃≥${rebateAmount(detail.newMembers)}` : null,
    hasRebateCondition(detail.firstDepositMembers) ? `首充人数≥${rebateAmount(detail.firstDepositMembers)}` : null,
    hasRebateCondition(detail.firstDepositAmount) ? `首充额度≥${rebateAmount(detail.firstDepositAmount)}` : null,
    hasRebateCondition(detail.activeMembers) ? `活跃会员≥${rebateAmount(detail.activeMembers)}` : null,
    hasRebateCondition(detail.totalWinLoss) ? `总输赢≥${rebateAmount(detail.totalWinLoss)}` : null,
  ].filter(Boolean)
  return items.length ? items.join(' / ') : '未设置条件'
}

function rebateDetailLabel(row, detail) {
  const condition = rebateConditionText(detail)
  if (row.mode === 'star') return `${detail.level} 星级代理 / ${condition} / 返比 ${rebatePercent(detail.rate)}`
  if (row.mode === 'team') return `${detail.level} 级团队 / ${condition} / 返佣 ${rebatePercent(detail.rate)}`
  return `${detail.level} 级代理 / ${condition} / 返比 ${rebatePercent(detail.rate)}`
}

function defaultRebateDetails(mode) {
  if (mode === 'star') return [{ level: 1, rate: 0.1, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }, { level: 2, rate: 0.15, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }, { level: 3, rate: 0.2, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }]
  if (mode === 'team') return [{ level: 1, rate: 0.3, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }, { level: 2, rate: 0.35, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }, { level: 3, rate: 0.4, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }]
  return [{ level: 1, rate: 0.05, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }, { level: 2, rate: 0.08, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }, { level: 3, rate: 0.1, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }]
}

function rebateTypeName(mode) {
  return REBATE_TYPE_OPTIONS.find((item) => item.value === mode)?.label || '层级代理'
}

function normalizeRebateDetailValue(key, value) {
  if (REBATE_CONDITION_KEYS.includes(key) && value === '') return ''
  return Number(value)
}

function MasterPlansPage({ onToast }) {
  const { data } = useTeamAgent()
  const activeDefinition = data.activityDefinitions.find((item) => item.id === 'ACTIVE') || data.activityDefinitions[0] || {}
  const [rows, setRows] = useState(() => buildLegacyRebateRows(data.plans))
  const [editing, setEditing] = useState(null)
  const [editName, setEditName] = useState('')
  const [editDetails, setEditDetails] = useState([])
  const [creating, setCreating] = useState(false)
  const [createName, setCreateName] = useState('')
  const [createType, setCreateType] = useState('level')
  const [createDetails, setCreateDetails] = useState(() => defaultRebateDetails('level'))
  const [activeRule, setActiveRule] = useState({ depositThreshold: activeDefinition.depositThreshold ?? 100, validBetThreshold: activeDefinition.validBetThreshold ?? 1000 })
  function openEditor(row) {
    setEditing(row)
    setEditName(row.name)
    setEditDetails(row.details.map((detail) => ({ ...detail })))
  }
  function openCreator() {
    setCreateName('')
    setCreateType('level')
    setCreateDetails(defaultRebateDetails('level'))
    setCreating(true)
  }
  function changeCreateType(value) {
    setCreateType(value)
    setCreateDetails(defaultRebateDetails(value))
  }
  function updateEditDetail(index, key, value) {
    setEditDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: normalizeRebateDetailValue(key, value) } : item))
  }
  function updateCreateDetail(index, key, value) {
    setCreateDetails((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: normalizeRebateDetailValue(key, value) } : item))
  }
  function addEditLevel() {
    const maxLevel = editDetails.reduce((max, item) => Math.max(max, Number(item.level || 0)), 0)
    setEditDetails((current) => [...current, { level: maxLevel + 1, rate: 0, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }])
  }
  function addCreateLevel() {
    const maxLevel = createDetails.reduce((max, item) => Math.max(max, Number(item.level || 0)), 0)
    setCreateDetails((current) => [...current, { level: maxLevel + 1, rate: 0, newMembers: '', firstDepositMembers: '', firstDepositAmount: '', activeMembers: '', totalWinLoss: '' }])
  }
  function removeEditLevel(index) {
    setEditDetails((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }
  function removeCreateLevel(index) {
    setCreateDetails((current) => current.filter((_, itemIndex) => itemIndex !== index))
  }
  function saveEditor() {
    setRows((current) => current.map((row) => row.id === editing.id ? { ...row, name: editName || row.name, details: editDetails, operator: 'codex', operatedAt: `${REBATE_UPDATED_AT}:00` } : row))
    setEditing(null)
    onToast?.('佣金方案配置已保存', 'success')
  }
  function saveCreator() {
    const fallbackName = `${rebateTypeName(createType)}返佣方案`
    setRows((current) => [...current, {
      id: `REBATE-CUSTOM-${Date.now()}`,
      sequence: current.length + 1,
      name: createName || fallbackName,
      createdAt: `${REBATE_UPDATED_AT}:00`,
      operator: 'codex',
      operatedAt: `${REBATE_UPDATED_AT}:00`,
      mode: createType,
      details: createDetails,
    }])
    setCreating(false)
    onToast?.('新增代理方案已保存', 'success')
  }
  function saveActiveRule() {
    onToast?.('活跃会员判定条件已保存', 'success')
  }
  const columns = [
    { key: 'sequence', label: '序号', cellClassName: 'legacy-rebate-index' },
    { key: 'name', label: '返佣方案名称', render: (value, row) => <span className={row.mode === 'team' ? 'legacy-rebate-team-name' : ''}>{value}</span> },
    { key: 'details', label: '方案详情', render: (value, row) => <div className="legacy-rebate-detail-lines">{value.map((detail) => <span key={`${row.id}-${detail.level}`}>{rebateDetailLabel(row, detail)}</span>)}</div> },
    { key: 'createdAt', label: '创建时间' },
    { key: 'operator', label: '最后操作人' },
    { key: 'operatedAt', label: '操作时间' },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => openEditor(row)}><EditOutlined /> 修改</ActionLink><ActionLink onClick={() => openEditor(row)}><SettingOutlined /> 配置</ActionLink></div> },
  ]
  return <>
    <section className="legacy-rebate-screen">
      <SectionHeader title="佣金方案" description="按原返佣方案列表维护代理返佣配置，可新增层级、星级或团队代理方案。" />
      <Toolbar><Button icon={<PlusOutlined />} onClick={openCreator}>新增代理方案</Button><Button icon={<DownloadOutlined />} variant="warning" onClick={() => onToast?.('返佣方案已导出', 'success')}>导出</Button><Button icon={<FileDoneOutlined />} variant="ghost" disabled>下载文件</Button></Toolbar>
      <div className="legacy-active-rule">
        <div><strong>活跃会员判定条件</strong><p>全局生效：会员充值达到指定金额，或有效投注达到指定额度，即计为活跃会员。</p></div>
        <div className="legacy-active-rule-fields">
          <Field label="充值金额 ≥"><Input type="number" min="0" value={activeRule.depositThreshold} onChange={(value) => setActiveRule({ ...activeRule, depositThreshold: value === '' ? '' : Number(value) })} /></Field>
          <Field label="有效投注 ≥"><Input type="number" min="0" value={activeRule.validBetThreshold} onChange={(value) => setActiveRule({ ...activeRule, validBetThreshold: value === '' ? '' : Number(value) })} /></Field>
          <Button variant="ghost" onClick={saveActiveRule}>保存全局条件</Button>
        </div>
      </div>
      <DataTable minWidth={1320} columns={columns} rows={rows} className="legacy-rebate-table" rowKey="id" />
    </section>
    <Modal open={creating} title="新增代理方案" onClose={() => setCreating(false)} onConfirm={saveCreator} confirmDisabled={!createDetails.length} width={1380}>
      <div className="legacy-rebate-modal-body">
        <div className="legacy-rebate-name-row"><span><b>*</b> 方案名称</span><Input value={createName} onChange={setCreateName} placeholder="请输入方案名称" /></div>
        <div className="legacy-rebate-name-row"><span><b>*</b> 方案类型</span><Select value={createType} onChange={changeCreateType} options={REBATE_TYPE_OPTIONS} /></div>
        <Button icon={<PlusOutlined />} className="legacy-rebate-add-level" onClick={addCreateLevel}>添加级别</Button>
        <div className="legacy-rebate-modal-grid">
          <table className="legacy-level-table">
            <thead><tr><th>代理层级</th><th>新增活跃</th><th>首充人数</th><th>首充额度</th><th>活跃会员</th><th>总输赢</th><th>返佣比例(0~1)</th><th>操作</th></tr></thead>
            <tbody>{createDetails.map((detail, index) => <tr key={`create-${index}`}>
              <td><Input className="legacy-level-input" type="number" value={detail.level} min="0" step="1" onChange={(value) => updateCreateDetail(index, 'level', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.newMembers} min="0" placeholder="不设置" onChange={(value) => updateCreateDetail(index, 'newMembers', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.firstDepositMembers} min="0" placeholder="不设置" onChange={(value) => updateCreateDetail(index, 'firstDepositMembers', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.firstDepositAmount} min="0" placeholder="不设置" onChange={(value) => updateCreateDetail(index, 'firstDepositAmount', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.activeMembers} min="0" placeholder="不设置" onChange={(value) => updateCreateDetail(index, 'activeMembers', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.totalWinLoss} min="0" placeholder="不设置" onChange={(value) => updateCreateDetail(index, 'totalWinLoss', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.rate} min="0" max="1" step="0.01" onChange={(value) => updateCreateDetail(index, 'rate', value)} /></td>
              <td><ActionLink onClick={() => removeCreateLevel(index)}><DeleteOutlined /> 删除</ActionLink></td>
            </tr>)}</tbody>
          </table>
          <div className="legacy-rebate-blank" />
        </div>
        <div className="legacy-rebate-help"><strong>说明：</strong><p>1、新增代理方案在原返佣方案列表中生成一条记录，不新增独立模块。</p><p>2、每个层级可设置新增活跃、首充人数、首充额度、活跃会员、总输赢条件；留空则该条件不参与等级判定。</p><p>3、方案类型可选层级代理、星级代理、团队代理；比例按 0~1 保存，例如 0.45 表示 45%。</p></div>
      </div>
    </Modal>
    <Modal open={!!editing} title="修改佣金方案" onClose={() => setEditing(null)} onConfirm={saveEditor} width={1380}>
      <div className="legacy-rebate-modal-body">
        <div className="legacy-rebate-name-row"><span><b>*</b> 方案名称</span><Input value={editName} onChange={setEditName} /></div>
        <Button icon={<PlusOutlined />} className="legacy-rebate-add-level" onClick={addEditLevel}>添加级别</Button>
        <div className="legacy-rebate-modal-grid">
          <table className="legacy-level-table">
            <thead><tr><th>代理层级</th><th>新增活跃</th><th>首充人数</th><th>首充额度</th><th>活跃会员</th><th>总输赢</th><th>返佣比例(0~1)</th><th>操作</th></tr></thead>
            <tbody>{editDetails.map((detail, index) => <tr key={`${editing?.id || 'edit'}-${index}`}>
              <td><Input className="legacy-level-input" type="number" value={detail.level} min="0" step="1" onChange={(value) => updateEditDetail(index, 'level', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.newMembers} min="0" placeholder="不设置" onChange={(value) => updateEditDetail(index, 'newMembers', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.firstDepositMembers} min="0" placeholder="不设置" onChange={(value) => updateEditDetail(index, 'firstDepositMembers', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.firstDepositAmount} min="0" placeholder="不设置" onChange={(value) => updateEditDetail(index, 'firstDepositAmount', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.activeMembers} min="0" placeholder="不设置" onChange={(value) => updateEditDetail(index, 'activeMembers', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.totalWinLoss} min="0" placeholder="不设置" onChange={(value) => updateEditDetail(index, 'totalWinLoss', value)} /></td>
              <td><Input className="legacy-level-input" type="number" value={detail.rate} min="0" max="1" step="0.01" onChange={(value) => updateEditDetail(index, 'rate', value)} /></td>
              <td><ActionLink onClick={() => removeEditLevel(index)}><DeleteOutlined /> 删除</ActionLink></td>
            </tr>)}</tbody>
          </table>
          <div className="legacy-rebate-blank" />
        </div>
        <div className="legacy-rebate-help"><strong>说明：</strong><p>1、代理自身星级/层级不在此处改变，这里只配置对应级别的返佣比例和等级条件。</p><p>2、新增活跃、首充人数、首充额度、活跃会员、总输赢条件留空则不生效；已设置的条件需同时满足才命中该层级。</p><p>3、团队佣金方案作为原返佣方案中的一条配置，供团队代理在佣金方案字段中选择。</p></div>
      </div>
    </Modal>
  </>
}

function MasterSettlementPage({ onToast }) {
  const emptyFilters = { agent: '', site: '', billNo: '', billType: '', billDate: '', state: '' }
  const [filters, setFilters] = useState(emptyFilters)
  const [editingCommission, setEditingCommission] = useState(null)
  const [commissionForm, setCommissionForm] = useState({ amount: '', reason: '' })
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const formatAmount = (value) => Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  const initialSettlementRows = [
    { id: 'SET-20260713-SITE', agentName: '站点分润', site: '旺财体育', agentType: '—', agentIdentity: '—', rebateRate: '—', billType: '站点账单', parentAgent: '—', period: '2026-07-13 ~ 2026-07-19', memberProfit: 0, memberCommission: 0, state: '待结算', action: '结算' },
    { id: 'SET-20260713-001', agentName: 'gaodashang', site: '旺财体育', agentType: '团队代理', agentIdentity: '团队负责人', rebateRate: '65.00%', billType: '代理账单', parentAgent: '—', period: '2026-07-13 ~ 2026-07-19', memberProfit: 0, memberCommission: 126000, distributableAmount: 206000, state: '待确认', action: '确认' },
    { id: 'SET-20260713-002', agentName: 'WC002', site: '旺财体育', agentType: '团队代理', agentIdentity: '副线负责人', rebateRate: '55.00%', billType: '代理账单', parentAgent: 'gaodashang', period: '2026-07-13 ~ 2026-07-19', memberProfit: 0, memberCommission: 28000, distributableAmount: 42000, state: '待确认', action: '确认' },
    { id: 'SET-20260713-003', agentName: 'LGNB', site: '旺财体育', agentType: '团队代理', agentIdentity: '团队成员', rebateRate: '50.00%', billType: '代理账单', parentAgent: 'WC002', period: '2026-07-13 ~ 2026-07-19', memberProfit: 0, memberCommission: 15000, distributableAmount: 18000, state: '待确认', action: '确认' },
    { id: 'SET-20260713-004', agentName: 'apppay', site: '旺财体育', agentType: '星级代理', agentIdentity: '5星', rebateRate: '75.00%', billType: '代理账单', parentAgent: '—', period: '2026-07-13 ~ 2026-07-19', memberProfit: 0, memberCommission: 0, state: '待确认', action: '确认' },
    { id: 'SET-20260713-005', agentName: 'hddaili', site: '旺财体育', agentType: '层级代理', agentIdentity: '5层', rebateRate: '50.00%', billType: '代理账单', parentAgent: '—', period: '2026-07-13 ~ 2026-07-19', memberProfit: 0, memberCommission: 0, state: '待确认', action: '确认' },
    { id: 'SET-20260713-006', agentName: 'dailiwc001', site: '旺财体育', agentType: '团队代理', agentIdentity: '独立代理', rebateRate: '70.00%', billType: '代理账单', parentAgent: 'apppay', period: '2026-07-13 ~ 2026-07-19', memberProfit: 0, memberCommission: 68000, distributableAmount: 68000, state: '待确认', action: '确认' },
    { id: 'SET-20260713-007', agentName: 'dailiwc001a', site: '旺财体育', agentType: '层级代理', agentIdentity: '4层', rebateRate: '45.00%', billType: '代理账单', parentAgent: 'hddaili', period: '2026-07-13 ~ 2026-07-19', memberProfit: 0, memberCommission: 0, state: '待确认', action: '确认' },
    { id: 'SET-20260706-SITE', agentName: '站点分润', site: '旺财体育', agentType: '—', agentIdentity: '—', rebateRate: '—', billType: '站点账单', parentAgent: '—', period: '2026-07-06 ~ 2026-07-12', memberProfit: 1944, memberCommission: 1555.2, state: '待结算', action: '结算' },
    { id: 'SET-20260706-001', agentName: 'gaodashang', site: '旺财体育', agentType: '团队代理', agentIdentity: '团队负责人', rebateRate: '65.00%', billType: '代理账单', parentAgent: '—', period: '2026-07-06 ~ 2026-07-12', memberProfit: 0, memberCommission: 120000, distributableAmount: 120000, state: '待确认', action: '确认' },
  ]
  const [settlementRows, setSettlementRows] = useState(initialSettlementRows)
  function openCommissionEditor(row) {
    setEditingCommission(row)
    setCommissionForm({ amount: String(row.memberCommission ?? row.distributableAmount ?? 0), reason: row.adjustmentReason || '团队代理佣金发放金额调整' })
  }
  function saveCommissionEdit() {
    const amount = Number(commissionForm.amount)
    const maxAmount = Number(editingCommission?.distributableAmount || 0)
    if (!editingCommission || Number.isNaN(amount)) return onToast('请输入有效的发放佣金金额', 'error')
    if (amount < 0) return onToast('发放佣金最低可调整为 0，不能小于 0', 'error')
    if (amount > maxAmount) return onToast('发放佣金不能超过团队代理可发放金额', 'error')
    setSettlementRows((current) => current.map((row) => row.id === editingCommission.id ? { ...row, memberCommission: amount, adjustmentReason: commissionForm.reason || '团队代理佣金发放金额调整' } : row))
    onToast(`${editingCommission.agentName} 发放佣金已调整为 ¥${formatAmount(amount)}`)
    setEditingCommission(null)
  }
  const rows = settlementRows.filter((row) => (!filters.agent || row.agentName.toLowerCase().includes(filters.agent.toLowerCase())) && (!filters.site || row.site === filters.site) && (!filters.billNo || row.id.toLowerCase().includes(filters.billNo.toLowerCase())) && (!filters.billType || row.billType === filters.billType) && (!filters.billDate || row.period.includes(filters.billDate)) && (!filters.state || row.state === filters.state))
  const columns = [
    { key: 'agentName', label: '代理名称' },
    { key: 'site', label: '所属站点' },
    { key: 'agentType', label: '代理类型', render: (value) => value === '—' ? value : <span className="settlement-agent-type">{value}</span> },
    { key: 'agentIdentity', label: '代理身份' },
    { key: 'rebateRate', label: '返佣比例' },
    { key: 'billType', label: '账单类型' },
    { key: 'parentAgent', label: '直属上级代理' },
    { key: 'period', label: '账期范围' },
    { key: 'memberProfit', label: '代理直属会员盈亏', render: formatAmount },
    { key: 'memberCommission', label: '直属会员佣金', render: formatAmount },
    { key: 'action', label: '操作', render: (value, row) => <div className="ta-table-actions"><button className="settlement-action-btn" onClick={() => onToast(`${row.agentName} ${value}操作已触发`)}>{value}</button>{row.agentType === '团队代理' && <ActionLink onClick={() => openCommissionEditor(row)}><EditOutlined /> 修改</ActionLink>}</div> },
  ]
  return <>
  <section className="settlement-legacy-screen">
    <SectionHeader title="代理佣金结算" description="按原后台未发放区域核对代理账单，并在所属站点右侧统一展示代理类型与代理身份。" />
    <div className="settlement-legacy-filter">
      <Field label="代理名称"><Input value={filters.agent} onChange={(value) => setFilter('agent', value)} placeholder="请输入代理名称" /></Field>
      <Field label="站点"><Select value={filters.site} onChange={(value) => setFilter('site', value)} placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field>
      <Field label="编号"><Input value={filters.billNo} onChange={(value) => setFilter('billNo', value)} placeholder="请输入账单周期编号" /></Field>
      <Field label="账单类型"><Select value={filters.billType} onChange={(value) => setFilter('billType', value)} placeholder="全部" options={['站点账单', '代理账单']} /></Field>
      <Field label="账单日期"><Input value={filters.billDate} onChange={(value) => setFilter('billDate', value)} placeholder="YYYY-MM-DD" /></Field>
      <Field label="状态"><Select value={filters.state} onChange={(value) => setFilter('state', value)} placeholder="全部" options={['待结算', '待确认']} /></Field>
      <div className="settlement-filter-actions"><Button onClick={() => onToast(`已查询 ${rows.length} 条未发放账单`)}>搜索</Button><Button variant="ghost" onClick={() => { setFilters(emptyFilters); onToast('筛选条件已重置') }}>重置</Button></div>
    </div>
    <section className="settlement-unpaid-block">
      <header><strong>未发放区域</strong><Toolbar><Button icon={<DownloadOutlined />} variant="warning" onClick={() => onToast('未发放账单已导出')}>导出</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast('账单文件已下载')}>下载文件</Button></Toolbar></header>
      <DataTable className="settlement-legacy-table" minWidth={1240} columns={columns} rows={rows} />
    </section>
  </section>
  <Modal open={!!editingCommission} title="修改团队代理发放佣金" description="仅团队代理可调整本次发放佣金，金额可调至 0，但不能超过团队代理可发放金额。" onClose={() => setEditingCommission(null)} onConfirm={saveCommissionEdit} confirmText="保存修改" width={760}>
    {editingCommission && <div className="ta-stack">
      <DescriptionGrid columns={2} items={[
        { label: '代理账号 / 身份', value: `${editingCommission.agentName} / ${editingCommission.agentIdentity}` },
        { label: '账期范围', value: editingCommission.period },
        { label: '团队代理可发放金额', value: <Money value={editingCommission.distributableAmount} /> },
        { label: '当前发放佣金', value: <Money value={editingCommission.memberCommission} /> },
      ]} />
      <FormGrid><Field label="本次发放佣金" required help={`可填写 0 ~ ${formatAmount(editingCommission.distributableAmount)}，超出上限会阻止保存。`}><Input type="number" min="0" max={editingCommission.distributableAmount} step="0.01" value={commissionForm.amount} onChange={(amount) => setCommissionForm({ ...commissionForm, amount })} /></Field><Field label="调整说明"><Input value={commissionForm.reason} onChange={(reason) => setCommissionForm({ ...commissionForm, reason })} placeholder="请输入调整原因" /></Field></FormGrid>
      <Alert title="调整规则" tone="warning">本原型只演示发放金额调整逻辑：团队代理可发放金额是上限，运营可将本次发放佣金下调到 0；非团队代理不展示修改入口。</Alert>
    </div>}
  </Modal>
  </>
}

function MasterRecordsPage({ onToast }) {
  const { data } = useTeamAgent()
  const [tab, setTab] = useState('platform')
  const emptyFilters = { account: '', site: '', agentType: '', issuedAt: '' }
  const [filters, setFilters] = useState(emptyFilters)
  const [detail, setDetail] = useState(null)
  const allRows = enrichBills(data)
  const rows = allRows.filter((row) => (!filters.account || `${row.agentId}${row.payee}${row.unitName}`.toLowerCase().includes(filters.account.toLowerCase())) && (!filters.site || String(row.site).includes(filters.site)) && (!filters.agentType || row.recordAgentType === filters.agentType) && (!filters.issuedAt || String(row.issuedAt).includes(filters.issuedAt)))
  const columns = commissionRecordColumns((row) => <ActionLink onClick={() => setDetail(row)}>详情</ActionLink>)
  return <>
    <SectionHeader title="佣金记录" description="按原后台佣金发放记录样式展示代理佣金周期、身份、金额、方案、状态和发放信息。" />
    <Tabs items={[{ value: 'platform', label: '平台账单记录', count: data.bills.length }, { value: 'internal', label: '副线内部结算', count: data.internalSettlements.length }]} active={tab} onChange={setTab} />
    <FilterBar onSearch={() => onToast(`已查询 ${tab === 'platform' ? rows.length : data.internalSettlements.length} 条记录`)} onReset={() => setFilters(emptyFilters)} onExport={() => onToast('记录已导出')}>
      <Field label="代理账号"><Input value={filters.account} onChange={(value) => setFilters({ ...filters, account: value })} placeholder="请输入代理账号" /></Field>
      <Field label="站点名称"><Input value={filters.site} onChange={(value) => setFilters({ ...filters, site: value })} placeholder="请输入站点名称" /></Field>
      <Field label="代理类型"><Select value={filters.agentType} onChange={(value) => setFilters({ ...filters, agentType: value })} placeholder="全部类型" options={['团队代理', '星级代理', '层级代理']} /></Field>
      <Field label="发放时间"><Input value={filters.issuedAt} onChange={(value) => setFilters({ ...filters, issuedAt: value })} placeholder="YYYY-MM-DD" /></Field>
    </FilterBar>
    {tab === 'platform' ? <DataTable minWidth={1850} className="commission-record-table" columns={columns} rows={rows} paginated /> : <DataTable minWidth={1120} columns={internalColumns} rows={data.internalSettlements} paginated />}
    <Alert title="对账边界" tone="warning">平台只对团队主线、独立线主和推荐奖励收款方承担付款责任；主线未向副线结算不形成平台欠款。</Alert>
    <Modal open={!!detail} title={`${detail?.id || ''} · 佣金记录详情`} description="查看该笔佣金发放记录的代理类型、代理身份、金额、方案和发放信息。" onClose={() => setDetail(null)} onConfirm={() => setDetail(null)} confirmText="关闭" showCancel={false} width={900}>{detail && <DescriptionGrid columns={3} items={[{ label: '账单类型 / 月份', value: `${detail.type} / ${detail.cycle}` }, { label: '站点名称', value: detail.site }, { label: '代理类型', value: detail.recordAgentType }, { label: '代理身份', value: detail.recordAgentIdentity }, { label: '团队 / 单线', value: detail.unitName }, { label: '代理ID / 账号', value: `${detail.agentId} / ${detail.payee}` }, { label: '总输赢', value: <Money value={detail.totalWinLoss} signed /> }, { label: '月流水', value: <Money value={detail.monthlyFlow} /> }, { label: '首充金额', value: <Money value={detail.firstDepositAmount} /> }, { label: '留存天数', value: detail.retentionDays }, { label: '佣金金额', value: <Money value={detail.payable} /> }, { label: '返佣方案', value: detail.rebatePlan }, { label: '佣金状态', value: <StatusTag>{detail.state}</StatusTag> }, { label: '发放人 / 时间', value: `${detail.issuedBy} / ${detail.issuedAt}` }, { label: '佣金 / 已发 / 待发', value: <><Money value={detail.payable} /> / <Money value={detail.issued} /> / <Money value={detail.remaining} /></> }]} />}</Modal>
  </>
}

function MasterReportPage({ kind, onToast }) {
  const { data } = useTeamAgent()
  const [reversalFilters, setReversalFilters] = useState(REVERSAL_FILTER_DEFAULTS)
  const [returnFilters, setReturnFilters] = useState(RETURN_FILTER_DEFAULTS)
  const [revenueFilters, setRevenueFilters] = useState(REVENUE_FILTER_DEFAULTS)
  const setReversalFilter = (key, value) => setReversalFilters((current) => ({ ...current, [key]: value }))
  const setReturnFilter = (key, value) => setReturnFilters((current) => ({ ...current, [key]: value }))
  const setRevenueFilter = (key, value) => setRevenueFilters((current) => ({ ...current, [key]: value }))

  if (kind === 'reversal') {
    const keys = ['site', 'agent', 'agentId', 'agentType', 'agentIdentity', 'people', 'balance', 'levelCommission', 'memberProfit', 'directCommission', 'totalAdvance', 'returned', 'remaining', 'debtPeople', 'debtTotal']
    const labels = ['所属站点', '代理账号', 'ID', '代理类型', '代理身份', '垫付冲正代理总人数', '垫付余额(¥)', '垫付级差佣金(¥)', '垫付会员盈利(¥)', '垫付直属佣金(¥)', '垫付总计(¥)', '回款总计(¥)', '垫付剩余金额(¥)', '欠款人数', '欠款总计(¥)']
    const moneyKeys = ['balance', 'levelCommission', 'memberProfit', 'directCommission', 'totalAdvance', 'returned', 'remaining', 'debtTotal']
    const moneyClass = { totalAdvance: 'reversal-blue-cell', returned: 'reversal-green-cell', remaining: 'reversal-red-cell', debtTotal: 'reversal-orange-cell' }
    const columns = keys.map((key, index) => ({
      key,
      label: labels[index],
      cellClassName: moneyClass[key],
      render: (value, row) => {
        if (key === 'agentType') return <StatusTag tone={value === '团队代理' ? 'blue' : value === '星级代理' ? 'orange' : 'gray'}>{value}</StatusTag>
        if (key === 'agentIdentity') return <StatusTag tone={row.agentType === '团队代理' ? 'blue' : 'gray'}>{value}</StatusTag>
        if (key === 'people') return <strong className="reversal-link-number">{value}</strong>
        if (key === 'debtPeople') return <strong className={Number(value) ? 'reversal-debt-count' : 'reversal-muted-count'}>{value}</strong>
        if (moneyKeys.includes(key)) return <Money value={value} />
        return value
      },
    }))
    const allRows = LEGACY_REPORT_ROWS.reversal.map((row, index) => Object.fromEntries(keys.map((key, cell) => [key, row[cell]]).concat([['id', `${row[2]}-${index}`], ['cycle', '2026-07']])))
    const rows = allRows.filter((row) => (!reversalFilters.cycle || row.cycle === reversalFilters.cycle) && (!reversalFilters.site || row.site === reversalFilters.site) && (!reversalFilters.agentType || row.agentType === reversalFilters.agentType) && (!reversalFilters.keyword || `${row.agent}${row.agentId}`.toLowerCase().includes(reversalFilters.keyword.toLowerCase())))
    return <section className="reversal-report-screen">
      <div className="reversal-report-hero">
        <div className="reversal-report-title"><i><BarChartOutlined /></i><div><h1>冲正统计报表</h1><p>统计代理冲正业务数据，包括代冲人数、额度及追回欠款汇总。</p></div></div>
        <div className="reversal-report-actions"><Button icon={<DownloadOutlined />} variant="ghost" onClick={() => onToast('冲正统计数据已导出')}>导出统计数据</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast('冲正统计文件已下载')}>下载文件</Button></div>
      </div>
      <MetricGrid columns={6} className="reversal-metric-grid"><MetricCard label="垫付冲正代理总人数" value="18" icon={<QuestionCircleOutlined />} /><MetricCard label="总欠款人数" value="36" icon={<QuestionCircleOutlined />} /><MetricCard label="垫付总计" value={<Money value={181230.96} />} tone="blue" icon={<QuestionCircleOutlined />} /><MetricCard label="回款总计" value={<Money value={84865.56} />} tone="green" icon={<QuestionCircleOutlined />} /><MetricCard label="垫付剩余金额" value={<Money value={96365.4} />} tone="red" icon={<QuestionCircleOutlined />} /><MetricCard label="欠款总计" value={<Money value={411610.27} />} tone="orange" icon={<QuestionCircleOutlined />} /></MetricGrid>
      <FilterBar onSearch={() => onToast(`已查询 ${rows.length} 条冲正统计`)} onReset={() => { setReversalFilters(REVERSAL_FILTER_DEFAULTS); onToast('筛选条件已重置') }}>
        <Field label="统计周期"><Select value={reversalFilters.cycle} onChange={(value) => setReversalFilter('cycle', value)} placeholder="全部周期" options={['2026-07', '2026-06', '2026-05']} /></Field>
        <Field label="所属站点"><Select value={reversalFilters.site} onChange={(value) => setReversalFilter('site', value)} placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field>
        <Field label="代理类型"><Select value={reversalFilters.agentType} onChange={(value) => setReversalFilter('agentType', value)} placeholder="全部类型" options={REVERSAL_AGENT_TYPE_OPTIONS} /></Field>
        <Field label="搜索代理"><Input value={reversalFilters.keyword} onChange={(value) => setReversalFilter('keyword', value)} placeholder="搜索代理账号/ID..." /></Field>
      </FilterBar>
      <DataTable className="reversal-report-table" minWidth={1850} columns={columns} rows={rows} />
    </section>
  }
  if (kind === 'returns') {
    const keys = ['site', 'agent', 'agentId', 'agentType', 'agentIdentity', 'type', 'flow', 'amount', 'gap', 'ledger', 'time']
    const labels = ['所属站点', '名称', 'ID', '代理类型', '代理身份', '类型', '垫付/回款', '额度', '额度缺口', '冲正账目ID', '时间']
    const columns = keys.map((key, index) => ({
      key,
      label: labels[index],
      cellClassName: key === 'gap' ? 'return-gap-cell' : undefined,
      render: (value, row) => {
        if (key === 'agentType') return <StatusTag tone={value === '团队代理' ? 'blue' : value === '星级代理' ? 'orange' : 'gray'}>{value}</StatusTag>
        if (key === 'agentIdentity') return <StatusTag tone={row.agentType === '团队代理' ? 'blue' : 'gray'}>{value}</StatusTag>
        if (key === 'flow') return <StatusTag tone={value === '回款' ? 'green' : 'orange'}>{value}</StatusTag>
        if (['amount', 'gap'].includes(key)) return <Money value={value} tone={key === 'gap' ? 'negative' : 'neutral'} />
        return value
      },
    }))
    const allRows = LEGACY_REPORT_ROWS.returns.map((row, index) => Object.fromEntries(keys.map((key, cell) => [key, row[cell]]).concat([['id', `${row[9]}-${index}`]])))
    const rows = allRows.filter((row) => (!returnFilters.date || String(row.time).startsWith(returnFilters.date))
      && (!returnFilters.site || row.site === returnFilters.site)
      && (!returnFilters.type || row.type === returnFilters.type)
      && (!returnFilters.agentType || row.agentType === returnFilters.agentType)
      && (!returnFilters.flow || row.flow === returnFilters.flow)
      && (!returnFilters.keyword || `${row.agent}${row.agentId}`.toLowerCase().includes(returnFilters.keyword.toLowerCase())))
    return <section className="reversal-report-screen returns-report-screen">
      <div className="reversal-report-hero">
        <div className="reversal-report-title"><i><FileDoneOutlined /></i><div><h1>冲正回款报表</h1><p>记录每一笔代理代冲操作及后续回款的明细流水。</p></div></div>
        <div className="reversal-report-actions"><Button icon={<DownloadOutlined />} variant="ghost" onClick={() => onToast('冲正回款明细已导出')}>导出明细数据</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast('冲正回款文件已下载')}>下载文件</Button></div>
      </div>
      <FilterBar onSearch={() => onToast(`已查询 ${rows.length} 条冲正回款`)} onReset={() => { setReturnFilters(RETURN_FILTER_DEFAULTS); onToast('筛选条件已重置') }}>
        <Field label="查询时间"><Input type="date" value={returnFilters.date} onChange={(value) => setReturnFilter('date', value)} /></Field>
        <Field label="所属站点"><Select value={returnFilters.site} onChange={(value) => setReturnFilter('site', value)} placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field>
        <Field label="类型"><Select value={returnFilters.type} onChange={(value) => setReturnFilter('type', value)} placeholder="全部类型" options={['余额', '级差佣金', '直属佣金']} /></Field>
        <Field label="代理类型"><Select value={returnFilters.agentType} onChange={(value) => setReturnFilter('agentType', value)} placeholder="全部类型" options={REVERSAL_AGENT_TYPE_OPTIONS} /></Field>
        <Field label="垫付/回款"><Select value={returnFilters.flow} onChange={(value) => setReturnFilter('flow', value)} placeholder="全部" options={['垫付', '回款']} /></Field>
        <Field label="搜索代理"><Input value={returnFilters.keyword} onChange={(value) => setReturnFilter('keyword', value)} placeholder="搜索代理名称/ID..." /></Field>
      </FilterBar>
      <DataTable className="reversal-report-table returns-report-table" minWidth={1420} columns={columns} rows={rows} />
    </section>
  }
  if (kind === 'revenue') {
    const columns = REVENUE_TABLE_LABELS.map((label, index) => ({ key: `revenue-${index}`, label }))
    const rows = []
    return <section className="revenue-report-screen">
      <div className="revenue-tab-stack">
        <div className="revenue-tabs">{REVENUE_MODULE_TABS.map((label) => <button key={label} className={label === '代理收益看板' ? 'active' : ''} onClick={() => label === '代理收益看板' ? undefined : onToast(`${label}为演示跳转入口`)}>{label}{label !== '代理收益看板' && <span>×</span>}</button>)}</div>
        <div className="revenue-tabs revenue-tabs-sub">{REVENUE_SUB_TABS.map((label) => <button key={label} className={label === '代理收益看板' ? 'active' : ''} onClick={() => label === '代理收益看板' ? undefined : onToast('全站运营数据看板为演示入口')}>{label}</button>)}</div>
      </div>
      <div className="revenue-report-hero">
        <div><h1>代理收益看板</h1><p>按代理维度汇总代理后台首页看板核心经营指标，帮助总控对比不同站点和上级代理下的收益表现。</p></div>
        <div className="revenue-report-actions"><Button icon={<DownloadOutlined />} variant="warning" onClick={() => onToast('代理收益数据已导出')}>导出数据</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast('代理收益文件已下载')}>下载文件</Button></div>
      </div>
      <FilterBar onSearch={() => onToast(`已查询 ${rows.length} 条代理收益数据`)} onReset={() => { setRevenueFilters(REVENUE_FILTER_DEFAULTS); onToast('筛选条件已重置') }}>
        <Field label="所属站点"><Select value={revenueFilters.site} onChange={(value) => setRevenueFilter('site', value)} placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field>
        <Field label="代理账号"><Input value={revenueFilters.account} onChange={(value) => setRevenueFilter('account', value)} placeholder="账号/名称" /></Field>
        <Field label="查询日期" className="revenue-date-field"><Input value={revenueFilters.range} onChange={(value) => setRevenueFilter('range', value)} /></Field>
      </FilterBar>
      <div className="revenue-table-shell">
        <DataTable className="revenue-report-table" minWidth={2680} columns={columns} rows={rows} emptyText="" />
        {!rows.length && <div className="revenue-empty-overlay">暂无数据</div>}
      </div>
    </section>
  }
  return null
}

function MasterCyclePage({ onToast, portal = 'master' }) {
  const initial = { normal: { cycle: '月结算', day: '1日', time: '02:00' }, team: { cycle: '周结算', day: '每周一', time: '02:00' } }
  const [type, setType] = useState('normal')
  const [site, setSite] = useState(portal === 'site' ? '旺财体育' : 'DW测试')
  const [settings, setSettings] = useState(initial)
  const current = settings[type]
  const setCurrent = (patch) => setSettings((value) => ({ ...value, [type]: { ...value[type], ...patch } }))
  const monthDay = String(current.day || '1日').replace('日', '').padStart(2, '0')
  const nextRun = current.cycle === '月结算' ? `2026-08-${monthDay} ${current.time || '02:00'}` : `2026-07-20 ${current.time || '02:00'}`
  return <section className="cycle-settings-screen">
    <div className="cycle-site-card"><div><span><ApartmentOutlined /></span><div><h2>{portal === 'site' ? '当前站点' : '站点选择'}</h2><p>当前查看：{site}</p></div></div>{portal === 'site' ? <Input value={site} disabled /> : <Select value={site} onChange={setSite} options={['DW测试', '旺财体育', '财神客栈']} />}</div>
    <div className="cycle-title-card"><div><span><SettingOutlined /></span><div><h1>结算周期设置</h1><p>配置代理分润的自动结算周期与执行时间</p></div></div><div><Button variant="ghost" onClick={() => { setSettings(initial); onToast('结算周期已恢复默认') }}>恢复默认</Button><Button onClick={() => onToast(`${type === 'team' ? '团队代理' : '普通代理'}结算周期设置已保存`)}>保存设置</Button></div></div>
    <div className="cycle-settings-layout">
      <div className="cycle-main-card">
        <div className="cycle-card-heading"><CalendarOutlined /><strong>结算周期设置</strong></div>
        <div className="cycle-agent-type-tabs"><button className={type === 'normal' ? 'active' : ''} onClick={() => setType('normal')}>普通代理</button><button className={type === 'team' ? 'active' : ''} onClick={() => setType('team')}>团队代理</button></div>
        <div className="cycle-options-grid">{['周结算', '月结算'].map((item) => <button key={item} className={current.cycle === item ? 'active' : ''} onClick={() => setCurrent({ cycle: item, day: item === '月结算' ? '1日' : '每周一' })}><CalendarOutlined /><strong>{item.replace('算', '')}</strong><span>{item === '月结算' ? '每月固定日期结算上月佣金' : '每周固定日期结算上周期佣金'}</span></button>)}</div>
        <div className="cycle-execution-card"><h3>结算执行配置</h3><div><Field label="结算代理类型"><Input value={type === 'team' ? '团队代理' : '普通代理'} disabled /></Field><Field label="结算频率"><Input value={current.cycle === '月结算' ? '每月一次' : '每周一次'} disabled /></Field><Field label={current.cycle === '月结算' ? '每月结算日' : '每周结算日'}><Select value={current.day} onChange={(day) => setCurrent({ day })} options={current.cycle === '月结算' ? ['1日', '5日', '10日', '15日'] : ['每周一', '每周三', '每周五']} /></Field><Field label="执行具体时间"><Input value={current.time} onChange={(time) => setCurrent({ time })} /></Field></div></div>
      </div>
      <aside className="cycle-notice-card"><div><QuestionCircleOutlined /><h3>分润结算须知</h3></div><p>返佣结算采用实时计算。</p><p>结算周期定义了系统自动生成佣金账单的时间点。</p><p>普通代理与团队代理可分别配置结算周期，保存后在本次周期执行完后开始生效。</p><hr /><b>当前类型：</b><strong>{type === 'team' ? '团队代理' : '普通代理'}</strong><small>{current.cycle === '月结算' ? '每月一次' : '每周一次'}</small><b>下一次执行：</b><em>{nextRun}</em></aside>
    </div>
  </section>
}

export function MasterPage({ page, navigate, onToast, portal = 'master' }) {
  if (page === 'agents') return <MasterAgentsPage navigate={navigate} onToast={onToast} />
  if (page === 'teams') return <MasterTeamsPage onToast={onToast} />
  if (page === 'plans') return <MasterPlansPage onToast={onToast} />
  if (page === 'settlement') return <MasterSettlementPage onToast={onToast} />
  if (page === 'records') return <MasterRecordsPage onToast={onToast} />
  if (page === 'relations') return <MasterRelationsPage onToast={onToast} />
  if (page === 'cycle') return <MasterCyclePage portal={portal} onToast={onToast} />
  if (['reversal', 'returns', 'revenue'].includes(page)) return <MasterReportPage kind={page} onToast={onToast} />
  return <MasterAgentsPage navigate={navigate} onToast={onToast} />
}
