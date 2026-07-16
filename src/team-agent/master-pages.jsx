import { useMemo, useState } from 'react'
import {
  ApartmentOutlined,
  AuditOutlined,
  BankOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EyeOutlined,
  FileDoneOutlined,
  HistoryOutlined,
  LockOutlined,
  PlusOutlined,
  SendOutlined,
  StopOutlined,
  SwapOutlined,
  TeamOutlined,
  UserAddOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { LEGACY_REPORT_ROWS } from './data'
import { useTeamAgent } from './context'
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

function MasterAgentsPage({ navigate, onToast }) {
  const { data, updateAgent, adjustAgentBalance } = useTeamAgent()
  const emptyFilters = { id: '', account: '', developer: '', parent: '', agentType: '', model: '', settlementMode: '', identity: '', site: '', status: '', registeredFrom: '', registeredTo: '' }
  const [filters, setFilters] = useState(emptyFilters)
  const [showAdd, setShowAdd] = useState(false)
  const [modal, setModal] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState({ account: '', model: '负盈利模式', site: '旺财体育', mode: '原代理模式' })
  const [editForm, setEditForm] = useState({})
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm: '' })
  const [balanceForm, setBalanceForm] = useState({ month: '2026-06', amount: '', reason: '' })
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const rows = useMemo(() => data.agents.filter((agent) => {
    const registeredDate = String(agent.registeredAt || '').slice(0, 10)
    return (!filters.id || String(agent.id).includes(filters.id))
      && (!filters.account || agent.account.toLowerCase().includes(filters.account.toLowerCase()))
      && (!filters.developer || String(agent.developer).toLowerCase().includes(filters.developer.toLowerCase()))
      && (!filters.parent || String(agent.parent).toLowerCase().includes(filters.parent.toLowerCase()) || String(agent.parentId).includes(filters.parent))
      && (!filters.agentType || agent.agentType === filters.agentType)
      && (!filters.model || agent.model === filters.model)
      && (!filters.settlementMode || agent.settlementMode === filters.settlementMode)
      && (!filters.identity || agent.identity === filters.identity)
      && (!filters.site || agent.site === filters.site)
      && (!filters.status || agent.status === filters.status)
      && (!filters.registeredFrom || registeredDate >= filters.registeredFrom)
      && (!filters.registeredTo || registeredDate <= filters.registeredTo)
  }), [data.agents, filters])

  function openModal(type, row) {
    setSelected(row)
    setModal(type)
    if (type === 'edit') setEditForm({ agentType: row.agentType, developer: row.developer, email: row.email, boundMemberAccount: row.boundMemberAccount, model: row.model })
    if (type === 'password') setPasswordForm({ password: '', confirm: '' })
    if (type === 'balance') setBalanceForm({ month: '2026-06', amount: '', reason: '' })
  }

  function closeModal() {
    setModal(null)
    setSelected(null)
  }

  const columns = [
    { key: 'sequence', label: '序号', render: (_, __, index) => index + 1 },
    { key: 'site', label: '所属站点' },
    { key: 'id', label: '代理ID' },
    { key: 'account', label: '代理账号', render: (value) => <b className="ta-primary-text">{value}</b> },
    { key: 'agentType', label: '代理类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'developer', label: '推广人员' },
    { key: 'parentId', label: '上级编号' },
    { key: 'parent', label: '上级账号' },
    { key: 'model', label: '代理模式' },
    { key: 'settlementMode', label: '结算模式', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'identity', label: '团队身份', render: (value) => value === '—' ? value : <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'unit', label: '结算单元' },
    { key: 'subAgents', label: '下属代理', render: (value, row) => <ActionLink disabled={!value} onClick={() => openModal('subAgents', row)}>{value}</ActionLink> },
    { key: 'members', label: '下属会员' },
    { key: 'activeMembers', label: '活跃人数' },
    { key: 'newActiveMembers', label: '新增活跃' },
    { key: 'depositAmount', label: '存款金额', render: (value) => <Money value={value} /> },
    { key: 'withdrawalAmount', label: '提款金额', render: (value) => <Money value={value} /> },
    { key: 'totalWinLoss', label: '总输赢', render: (value) => <Money value={value} signed /> },
    { key: 'validBetting', label: '有效投注', render: (value) => <Money value={value} /> },
    { key: 'plan', label: '佣金方案' },
    { key: 'email', label: '代理邮箱' },
    { key: 'registeredAt', label: '成为代理时间' },
    { key: 'registerIp', label: '注册IP' },
    { key: 'loginIp', label: '登录IP' },
    { key: 'registerLocation', label: '注册地点' },
    { key: 'loginLocation', label: '登录地点' },
    { key: 'channelStats', label: '存提款统计', render: (_, row) => <ActionLink onClick={() => openModal('channels', row)}>查看</ActionLink> },
    { key: 'balance', label: '代理佣金余额', render: (value) => <Money value={value} /> },
    { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => openModal('detail', row)}>详情</ActionLink><ActionLink onClick={() => openModal('edit', row)}>修改</ActionLink><ActionLink onClick={() => openModal('password', row)}>修改密码</ActionLink><ActionLink onClick={() => openModal('balance', row)}>余额调整</ActionLink><ActionLink onClick={() => row.settlementMode === '团队模式' ? navigate('teams') : row.settlementMode === '独立单线' ? navigate('singles') : onToast(`${row.account} 当前为原代理模式`)}>归属</ActionLink></div> },
  ]
  return <>
    <SectionHeader title="代理管理" description="按代理资料、推广归属、代理模式和团队身份查询，并演示资料维护与历史佣金余额调整。" actions={<Button icon={<PlusOutlined />} onClick={() => setShowAdd(true)}>新增代理</Button>} />
    <FilterBar onSearch={() => onToast(`已查询到 ${rows.length} 条代理记录`)} onReset={() => setFilters(emptyFilters)} onExport={() => onToast('代理列表已导出')}>
      <Field label="代理ID"><Input value={filters.id} onChange={(value) => setFilter('id', value)} placeholder="代理编号" /></Field>
      <Field label="代理账号"><Input value={filters.account} onChange={(value) => setFilter('account', value)} placeholder="代理账号" /></Field>
      <Field label="推广人员"><Input value={filters.developer} onChange={(value) => setFilter('developer', value)} placeholder="推广人员" /></Field>
      <Field label="上级代理"><Input value={filters.parent} onChange={(value) => setFilter('parent', value)} placeholder="编号或账号" /></Field>
      <Field label="代理类型"><Select value={filters.agentType} onChange={(value) => setFilter('agentType', value)} placeholder="全部类型" options={['官方代理', '普通代理']} /></Field>
      <Field label="代理模式"><Select value={filters.model} onChange={(value) => setFilter('model', value)} placeholder="全部模式" options={['负盈利模式', '普通代理']} /></Field>
      <Field label="结算模式"><Select value={filters.settlementMode} onChange={(value) => setFilter('settlementMode', value)} placeholder="全部结算" options={['团队模式', '独立单线', '原代理模式']} /></Field>
      <Field label="团队身份"><Select value={filters.identity} onChange={(value) => setFilter('identity', value)} placeholder="全部身份" options={['主管主线', '副线负责人', '独立线主', '—']} /></Field>
      <Field label="所属站点"><Select value={filters.site} onChange={(value) => setFilter('site', value)} options={['旺财体育', '财神客栈']} placeholder="全部站点" /></Field>
      <Field label="代理状态"><Select value={filters.status} onChange={(value) => setFilter('status', value)} options={['启用', '停用']} placeholder="全部状态" /></Field>
      <Field label="成为代理起"><Input type="date" value={filters.registeredFrom} onChange={(value) => setFilter('registeredFrom', value)} /></Field>
      <Field label="成为代理止"><Input type="date" value={filters.registeredTo} onChange={(value) => setFilter('registeredTo', value)} /></Field>
    </FilterBar>
    <DataTable className="ta-wide-table" minWidth={3600} columns={columns} rows={rows} paginated />
    <Modal open={showAdd} title="新增代理" description="代理模式与团队结算身份分别设置；团队归属在团队管理中维护。" onClose={() => setShowAdd(false)} onConfirm={() => showResult({ ok: Boolean(form.account), message: form.account ? `${form.account} 演示资料已保存` : '请填写代理账号' }, onToast, () => setShowAdd(false))}>
      <FormGrid><Field label="代理账号" required><Input value={form.account} onChange={(value) => setForm({ ...form, account: value })} placeholder="请输入代理账号" /></Field><Field label="所属站点"><Select value={form.site} onChange={(value) => setForm({ ...form, site: value })} options={['旺财体育', '财神客栈']} /></Field><Field label="代理模式"><Select value={form.model} onChange={(value) => setForm({ ...form, model: value })} options={['负盈利模式', '普通代理']} /></Field><Field label="结算模式"><Select value={form.mode} onChange={(value) => setForm({ ...form, mode: value })} options={['原代理模式', '团队模式', '独立单线']} /></Field></FormGrid>
      <Alert title="身份设置说明">选择团队模式或独立单线后，还需在对应管理页面明确代理部、line_id、业务范围和未来生效周期。</Alert>
    </Modal>
    <Modal open={modal === 'detail'} title={`${selected?.account || ''} · 代理详情`} description="代理资料、推广归属、登录信息和经营统计。" onClose={closeModal} onConfirm={closeModal} confirmText="关闭" showCancel={false} width={840}>
      {selected && <DescriptionGrid columns={3} items={[{ label: '代理ID / 账号', value: `${selected.id} / ${selected.account}` }, { label: '代理类型', value: selected.agentType }, { label: '推广人员', value: selected.developer }, { label: '上级代理', value: `${selected.parentId} / ${selected.parent}` }, { label: '代理模式', value: selected.model }, { label: '结算模式 / 身份', value: `${selected.settlementMode} / ${selected.identity}` }, { label: '代理邮箱', value: selected.email }, { label: '绑定会员', value: selected.boundMemberAccount }, { label: '成为代理时间', value: selected.registeredAt }, { label: '注册IP / 地点', value: `${selected.registerIp} / ${selected.registerLocation}` }, { label: '登录IP / 地点', value: `${selected.loginIp} / ${selected.loginLocation}` }, { label: '佣金余额', value: <Money value={selected.balance} /> }, { label: '活跃 / 新增活跃', value: `${selected.activeMembers} / ${selected.newActiveMembers}` }, { label: '存款 / 提款', value: <><Money value={selected.depositAmount} /> / <Money value={selected.withdrawalAmount} /></> }, { label: '总输赢 / 有效投注', value: <><Money value={selected.totalWinLoss} signed /> / <Money value={selected.validBetting} /></> }]} />}
    </Modal>
    <Modal open={modal === 'edit'} title={`${selected?.account || ''} · 修改资料`} description="维护代理类型、推广人员、邮箱、代理模式与可选绑定会员。" onClose={closeModal} onConfirm={() => showResult(updateAgent(selected.id, editForm), onToast, closeModal)}>
      <FormGrid><Field label="代理类型"><Select value={editForm.agentType} onChange={(value) => setEditForm({ ...editForm, agentType: value })} options={['官方代理', '普通代理']} /></Field><Field label="推广人员"><Input value={editForm.developer} onChange={(value) => setEditForm({ ...editForm, developer: value })} /></Field><Field label="代理邮箱"><Input type="email" value={editForm.email} onChange={(value) => setEditForm({ ...editForm, email: value })} /></Field><Field label="绑定会员（可选）"><Input value={editForm.boundMemberAccount} onChange={(value) => setEditForm({ ...editForm, boundMemberAccount: value })} placeholder="会员账号或留空" /></Field><Field label="代理模式"><Select value={editForm.model} onChange={(value) => setEditForm({ ...editForm, model: value })} options={['负盈利模式', '普通代理']} /></Field></FormGrid>
    </Modal>
    <Modal open={modal === 'password'} title={`${selected?.account || ''} · 修改密码`} description="仅演示密码校验和操作反馈，不展示原密码。" onClose={closeModal} onConfirm={() => showResult({ ok: passwordForm.password.length >= 6 && passwordForm.password === passwordForm.confirm, message: passwordForm.password.length < 6 ? '新密码至少 6 位' : passwordForm.password !== passwordForm.confirm ? '两次密码输入不一致' : '代理密码已修改' }, onToast, closeModal)}>
      <FormGrid><Field label="新密码" required><Input type="password" value={passwordForm.password} onChange={(value) => setPasswordForm({ ...passwordForm, password: value })} /></Field><Field label="确认密码" required><Input type="password" value={passwordForm.confirm} onChange={(value) => setPasswordForm({ ...passwordForm, confirm: value })} /></Field></FormGrid>
    </Modal>
    <Modal open={modal === 'balance'} title={`${selected?.account || ''} · 历史佣金余额调整`} description="只能调整历史已发放佣金月份，本月不可调整。" onClose={closeModal} onConfirm={() => showResult(adjustAgentBalance(selected.id, balanceForm), onToast, closeModal)}>
      <FormGrid><Field label="佣金月份" required><Input type="month" value={balanceForm.month} onChange={(value) => setBalanceForm({ ...balanceForm, month: value })} max="2026-06" /></Field><Field label="调整金额" required><Input type="number" value={balanceForm.amount} onChange={(value) => setBalanceForm({ ...balanceForm, amount: value })} placeholder="正数增加，负数扣减" /></Field><Field label="调整原因" className="ta-field-full"><Input value={balanceForm.reason} onChange={(value) => setBalanceForm({ ...balanceForm, reason: value })} /></Field></FormGrid>
      <DataTable columns={[{ key: 'month', label: '历史月份' }, { key: 'amount', label: '调整金额', render: (value) => <Money value={value} signed /> }, { key: 'reason', label: '调整原因' }, { key: 'operator', label: '操作人' }, { key: 'createdAt', label: '操作时间' }]} rows={data.agentBalanceAdjustments.filter((item) => item.agentId === selected?.id)} />
    </Modal>
    <Modal open={modal === 'subAgents'} title={`${selected?.account || ''} · 下级代理详情`} description="展示下级代理编号、账号和注册时间。" onClose={closeModal} onConfirm={closeModal} confirmText="关闭" showCancel={false} width={720}>
      <DataTable columns={[{ key: 'id', label: '代理编号' }, { key: 'account', label: '代理账号' }, { key: 'registeredAt', label: '注册时间' }]} rows={selected?.subAgentDetails || []} />
    </Modal>
    <Modal open={modal === 'channels'} title={`${selected?.account || ''} · 存提款渠道统计`} description="按下属会员实际使用渠道汇总次数与金额。" onClose={closeModal} onConfirm={closeModal} confirmText="关闭" showCancel={false} width={760}>
      <DataTable columns={[{ key: 'channel', label: '渠道' }, { key: 'depositCount', label: '存款次数' }, { key: 'depositAmount', label: '存款金额', render: (value) => <Money value={value} /> }, { key: 'withdrawalCount', label: '提款次数' }, { key: 'withdrawalAmount', label: '提款金额', render: (value) => <Money value={value} /> }]} rows={selected?.channelStats || []} />
    </Modal>
  </>
}

function TeamOverview({ team }) {
  const available = Math.max(0, team.cumulativeReceived - team.successfulTransfers - team.processingOccupied - team.otherDeductions)
  const metrics = team.metrics
  return <div className="ta-stack">
    <DescriptionGrid items={[
      { label: '代理部编号', value: `${team.code} / ${team.id}` }, { label: '所属站点 / 币种', value: `${team.site} / ${team.currency}` }, { label: '主管主线', value: team.mainAgent },
      { label: '团队类型', value: team.teamType }, { label: '推广人员', value: team.developer }, { label: '团队方案', value: team.plan }, { label: '创建时间', value: team.createdAt }, { label: '加入团队时间', value: team.joinedAt }, { label: '副线会员详情权限', value: team.memberDetailPermission ? '允许副线查看本人范围' : '不允许副线查看' }, { label: '生效周期', value: `${team.startCycle} 起` }, { label: '团队状态', value: <StatusTag>{team.status}</StatusTag> },
    ]} />
    <MetricGrid columns={4}><MetricCard label="团队等级" value={metrics.grade} helper="等级条件同时达标" tone="blue" /><MetricCard label="本月结余" value={<Money value={metrics.correctedNet} signed />} helper="等于冲正后净输赢" tone="orange" /><MetricCard label="平台应付佣金" value={<Money value={metrics.payable} />} helper="平台只向主线结算" tone="green" /><MetricCard label="主线团队可用余额" value={<Money value={available} />} helper="仅实际到账可在线转账" /></MetricGrid>
    <Alert title="平台责任边界" tone="warning">团队每个周期只形成一张平台应付账单，唯一收款方是当期主线。副线不形成平台应付佣金，由主线自主决定内部结算金额和时间。</Alert>
    <FormulaPanel title="Excel 当月结余与佣金口径" items={[
      { label: '净输赢', formula: '总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费', value: `¥${metrics.currentNet.toLocaleString()}` },
      { label: '冲正后净输赢', formula: '净输赢 + 上月结余 + 本月结余调整', value: `¥${metrics.correctedNet.toLocaleString()}` },
      { label: '本月结余', formula: '本月结余 = 冲正后净输赢', value: `¥${metrics.correctedNet.toLocaleString()}` },
      { label: '佣金', formula: 'MAX（0，冲正后净输赢 × 比例 + 佣金调整）', value: `¥${metrics.payable.toLocaleString()}` },
    ]} warning="加入团队时代理当月结余带入新团队；移出团队时当月结余留在原团队；团队解散后由指定承接代理承担剩余结余。" />
  </div>
}

function MasterTeamsPage({ onToast }) {
  const { data, createTeam, addSecondary, setTeamStatus, changeMain, addInternalSettlement, teamAvailableBalance, updateTeamPreferences } = useTeamAgent()
  const [selectedId, setSelectedId] = useState(null)
  const [tab, setTab] = useState('overview')
  const [modal, setModal] = useState(null)
  const [teamFilters, setTeamFilters] = useState({ name: '', type: '', agent: '', createdFrom: '' })
  const [teamForm, setTeamForm] = useState({ name: '', mainAgent: '', teamType: '推广团队', developer: '', memberDetailPermission: '不允许', plan: '旺财团队月结方案', startCycle: '2026-08', site: '旺财体育' })
  const [editTeamForm, setEditTeamForm] = useState({ name: '', teamType: '推广团队', memberDetailPermission: '不允许' })
  const [secondaryForm, setSecondaryForm] = useState({ agent: '', scope: '', startCycle: '2026-08' })
  const [mainForm, setMainForm] = useState({ nextMain: '', effectiveCycle: '2026-08' })
  const [settleForm, setSettleForm] = useState({ secondaryAgent: 'WC002', amount: '', basis: '固定金额', source: '平台已到账余额', voucher: '' })
  const team = data.teams.find((item) => item.id === selectedId)
  const teamRows = data.teams.filter((item) => (!teamFilters.name || item.name.includes(teamFilters.name) || item.code.includes(teamFilters.name)) && (!teamFilters.type || item.teamType === teamFilters.type) && (!teamFilters.agent || item.mainAgent.toLowerCase().includes(teamFilters.agent.toLowerCase()) || item.lines.some((line) => line.agent.toLowerCase().includes(teamFilters.agent.toLowerCase()))) && (!teamFilters.createdFrom || String(item.createdAt).slice(0, 10) >= teamFilters.createdFrom))

  const teamColumns = [
    { key: 'code', label: '团队编号' }, { key: 'name', label: '团队名称', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'teamType', label: '团队类型' }, { key: 'site', label: '站点' }, { key: 'mainAgent', label: '主线账号' },
    { key: 'lines', label: '团队人数', render: (value) => value.length }, { key: 'subAgents', label: '下级人数', render: (_, row) => row.lines.filter((line) => line.identity === '副线').length }, { key: 'createdAt', label: '创建时间' }, { key: 'joinedAt', label: '加入团队时间' },
    { key: 'memberDetailPermission', label: '副线会员详情', render: (value) => value ? '允许查看本人范围' : '不允许查看' }, { key: 'plan', label: '团队方案' }, { key: 'metrics', label: '本月结余', render: (value) => <Money value={value.correctedNet} signed /> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => { setSelectedId(row.id); setTab('overview') }}>详情</ActionLink><ActionLink onClick={() => { setSelectedId(row.id); setEditTeamForm({ name: row.name, teamType: row.teamType, memberDetailPermission: row.memberDetailPermission ? '允许' : '不允许' }); setModal('edit') }}>编辑</ActionLink><ActionLink onClick={() => { setSelectedId(row.id); setModal('secondary') }}>开副线</ActionLink></div> },
  ]

  function closeModal() {
    setModal(null)
  }

  if (!team) return <>
    <SectionHeader title="团队代理管理" description="以代理部为团队结算单元，统一管理主线、副线、合并考核和平台账单。" actions={<Button icon={<PlusOutlined />} onClick={() => setModal('create')}>创建代理部</Button>} />
    <MetricGrid columns={4}><MetricCard label="代理部数量" value={data.teams.length} helper="含待生效代理部" icon={<ApartmentOutlined />} /><MetricCard label="生效中团队" value={data.teams.filter((item) => item.status === '生效中').length} tone="green" icon={<CheckCircleOutlined />} /><MetricCard label="主副线总数" value={data.teams.reduce((sum, item) => sum + item.lines.length, 0)} tone="blue" icon={<TeamOutlined />} /><MetricCard label="待处理变更" value={data.requests.filter((item) => ['待站点复核', '待补充资料'].includes(item.status)).length} tone="orange" icon={<ClockCircleOutlined />} /></MetricGrid>
    <FilterBar onSearch={() => onToast(`已查询 ${teamRows.length} 个团队`)} onReset={() => setTeamFilters({ name: '', type: '', agent: '', createdFrom: '' })} onExport={() => onToast('团队列表已导出')}><Field label="团队名称"><Input value={teamFilters.name} onChange={(value) => setTeamFilters({ ...teamFilters, name: value })} placeholder="名称或编号" /></Field><Field label="团队类型"><Select value={teamFilters.type} onChange={(value) => setTeamFilters({ ...teamFilters, type: value })} placeholder="全部类型" options={['推广团队', '运营团队']} /></Field><Field label="代理编号/账号"><Input value={teamFilters.agent} onChange={(value) => setTeamFilters({ ...teamFilters, agent: value })} placeholder="主线或副线" /></Field><Field label="创建时间起"><Input type="date" value={teamFilters.createdFrom} onChange={(value) => setTeamFilters({ ...teamFilters, createdFrom: value })} /></Field></FilterBar>
    <DataTable minWidth={2200} columns={teamColumns} rows={teamRows} paginated />
    <Modal open={modal === 'create'} title="创建代理部" description="指定团队类型、主管主线、会员详情权限和未来完整生效周期。" onClose={closeModal} onConfirm={() => showResult(createTeam({ ...teamForm, memberDetailPermission: teamForm.memberDetailPermission === '允许' }), onToast, closeModal)}>
      <FormGrid><Field label="代理部名称" required><Input value={teamForm.name} onChange={(value) => setTeamForm({ ...teamForm, name: value })} placeholder="例如：gaodashang02部" /></Field><Field label="团队类型"><Select value={teamForm.teamType} onChange={(value) => setTeamForm({ ...teamForm, teamType: value })} options={['推广团队', '运营团队']} /></Field><Field label="推广人员"><Input value={teamForm.developer} onChange={(value) => setTeamForm({ ...teamForm, developer: value })} placeholder="默认使用主管主线" /></Field><Field label="副线会员详情"><Select value={teamForm.memberDetailPermission} onChange={(value) => setTeamForm({ ...teamForm, memberDetailPermission: value })} options={['不允许', '允许']} /></Field><Field label="所属站点"><Select value={teamForm.site} onChange={(value) => setTeamForm({ ...teamForm, site: value })} options={['旺财体育', '财神客栈']} /></Field><Field label="主管主线" required><Input value={teamForm.mainAgent} onChange={(value) => setTeamForm({ ...teamForm, mainAgent: value })} placeholder="请输入代理账号" /></Field><Field label="团队方案"><Select value={teamForm.plan} onChange={(value) => setTeamForm({ ...teamForm, plan: value })} options={data.plans.filter((plan) => plan.type === '团队佣金方案').map((plan) => plan.name)} /></Field><Field label="生效周期"><Select value={teamForm.startCycle} onChange={(value) => setTeamForm({ ...teamForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
      <Alert title="周期约束">代理部从目标完整周期开始参与考核，不追溯当前周期和历史账单。</Alert>
    </Modal>
  </>

  const tabs = [
    { value: 'overview', label: '团队概况' }, { value: 'structure', label: '主副线结构', count: team.lines.length }, { value: 'performance', label: '业绩考核' },
    { value: 'bills', label: '团队账单', count: data.bills.filter((bill) => bill.unitId === team.id).length }, { value: 'internal', label: '内部结算', count: data.internalSettlements.filter((item) => item.teamId === team.id).length },
    { value: 'changes', label: '关系记录', count: data.requests.filter((item) => item.currentUnit.includes(team.name) || item.targetUnit.includes(team.name)).length }, { value: 'operations', label: '操作记录', count: data.teamOperations.filter((item) => item.teamId === team.id).length },
  ]
  const lineColumns = [
    { key: 'identity', label: '身份', render: (value) => <StatusTag tone={value === '主线' ? 'blue' : 'gray'}>{value}</StatusTag> }, { key: 'lineId', label: 'line_id' }, { key: 'agent', label: '负责人', render: (value) => <b>{value}</b> }, { key: 'scope', label: '显式业务范围' },
    { key: 'newActive', label: '新增活跃' }, { key: 'activeMembers', label: '活跃会员' }, { key: 'netWinLoss', label: '净输赢值', render: (value) => <Money value={value} signed /> }, { key: 'startCycle', label: '生效周期' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
  ]
  const billRows = enrichBills(data).filter((bill) => bill.unitId === team.id)
  const internalRows = data.internalSettlements.filter((item) => item.teamId === team.id)
  const changeRows = data.requests.filter((item) => item.currentUnit.includes(team.name) || item.targetUnit.includes(team.name))
  const operationRows = data.teamOperations.filter((item) => item.teamId === team.id).map((item) => ({ ...item, balanceHandling: item.balanceHandling || item.reason }))

  return <>
    <SectionHeader title={`${team.name} · 团队详情`} description={`${team.code}　${team.site} / ${team.currency}　主线：${team.mainAgent}`} actions={<><Button variant="ghost" onClick={() => setSelectedId(null)}>返回列表</Button><Button icon={<UserAddOutlined />} onClick={() => setModal('secondary')}>开设副线</Button><Button icon={<SwapOutlined />} variant="ghost" onClick={() => setModal('main')}>更换主线</Button><Button icon={<LockOutlined />} variant="warning" onClick={() => showResult(setTeamStatus(team.id, team.status === '冻结' ? '生效中' : '冻结'), onToast)}> {team.status === '冻结' ? '解冻' : '冻结'}</Button><Button icon={<StopOutlined />} variant="danger" onClick={() => showResult(setTeamStatus(team.id, '已解散'), onToast)}>解散</Button></>} />
    <Tabs items={tabs} active={tab} onChange={setTab} />
    {tab === 'overview' && <TeamOverview team={team} />}
    {tab === 'structure' && <Panel title="主副线结构" description="每条线使用唯一 line_id 划分业务范围，父级汇总不重复计入。" actions={<Button icon={<UserAddOutlined />} size="small" onClick={() => setModal('secondary')}>开副线</Button>}><DataTable columns={lineColumns} rows={team.lines} rowKey="lineId" minWidth={1050} /></Panel>}
    {tab === 'performance' && <div className="ta-stack"><MetricGrid columns={4}><MetricCard label="新增活跃会员" value={team.metrics.newActive} helper="团队会员去重后统计" tone="blue" /><MetricCard label="活跃会员数量" value={team.metrics.activeMembers} helper="每名会员每周期最多计1次" /><MetricCard label="净输赢" value={<Money value={team.metrics.currentNet} signed />} helper="按 Excel 成本项扣减" tone="green" /><MetricCard label="本月结余 / 比例" value={`${team.metrics.correctedNet.toLocaleString()} / ${(team.metrics.rate * 100).toFixed(0)}%`} helper="结余参与佣金计算" tone="orange" /></MetricGrid><Panel title="各线业绩贡献" description="副线负业绩同样进入团队合计，不单独定级或生成个人佣金。"><DataTable columns={lineColumns.slice(0, 7)} rows={team.lines} rowKey="lineId" /></Panel><FormulaPanel title="当月结余口径" items={[{ label: '净输赢', formula: '总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费', value: `¥${team.metrics.currentNet.toLocaleString()}` }, { label: '冲正后净输赢 / 本月结余', formula: '净输赢 + 上月结余 + 本月结余调整', value: `¥${team.metrics.correctedNet.toLocaleString()}` }, { label: '佣金', formula: 'MAX（0，冲正后净输赢 × 比例 + 佣金调整）', value: `¥${team.metrics.payable.toLocaleString()}` }]} /></div>}
    {tab === 'bills' && <Panel title="团队平台账单" description="每个佣金周期最多一张团队账单，唯一收款方为当期主线。"><DataTable columns={billColumns((row) => <ActionLink onClick={() => onToast(`${row.id} 账单详情已打开`)}>详情</ActionLink>)} rows={billRows} minWidth={4200} paginated /></Panel>}
    {tab === 'internal' && <div className="ta-stack"><MetricGrid columns={4}><MetricCard label="累计平台到账" value={<Money value={team.cumulativeReceived} />} tone="green" /><MetricCard label="成功内部转账" value={<Money value={team.successfulTransfers} />} /><MetricCard label="处理中占用" value={<Money value={team.processingOccupied} />} tone="orange" /><MetricCard label="团队可用余额" value={<Money value={teamAvailableBalance(team.id)} />} tone="blue" /></MetricGrid><Panel title="副线内部结算记录" description="金额由主线自主决定，不要求合计等于团队佣金。" actions={<Button icon={<WalletOutlined />} size="small" onClick={() => setModal('settle')}>新增内部结算</Button>}><DataTable columns={internalColumns} rows={internalRows} minWidth={1120} /></Panel><FormulaPanel title="主线团队可用余额" items={[{ label: '团队可用余额', formula: '累计成功到账 − 成功内部转账 − 处理中占用 − 其他扣减', value: `¥${teamAvailableBalance(team.id).toLocaleString()}` }, { label: '本次可转金额', formula: 'MIN（主线录入金额，团队可用余额）' }]} /></div>}
    {tab === 'changes' && <Panel title="关系与模式变更" description="所有变更从未来完整周期生效，并明确当月结余归属。"><DataTable columns={requestColumns} rows={changeRows} minWidth={1600} paginated /></Panel>}
    {tab === 'operations' && <Panel title="团队操作记录" description="记录创建、编辑、开副线和关系操作，并保留结余处理说明。"><DataTable columns={operationColumns} rows={operationRows} minWidth={1500} paginated /></Panel>}

    <Modal open={modal === 'secondary'} title={`为 ${team.name} 开设副线`} description="副线范围必须明确且不能与其他结算单元重叠。" onClose={closeModal} onConfirm={() => showResult(addSecondary(team.id, { ...secondaryForm, requireReview: true }), onToast, closeModal)}>
      <FormGrid><Field label="副线负责人" required><Input value={secondaryForm.agent} onChange={(value) => setSecondaryForm({ ...secondaryForm, agent: value })} placeholder="请输入代理账号" /></Field><Field label="生效周期"><Select value={secondaryForm.startCycle} onChange={(value) => setSecondaryForm({ ...secondaryForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field><Field label="业务范围" className="ta-field-full"><Input value={secondaryForm.scope} onChange={(value) => setSecondaryForm({ ...secondaryForm, scope: value })} placeholder="例如：该代理节点及直属会员" /></Field></FormGrid>
      <Alert title="唯一归属检查">保存前会检查目标代理是否已属于其他团队或独立单线；当前周期不追溯切分。</Alert>
    </Modal>
    <Modal open={modal === 'main'} title={`更换 ${team.name} 主管主线`} description="换主线只影响未来周期，历史账单和内部结算仍归原主线。" onClose={closeModal} onConfirm={() => showResult(changeMain(team.id, mainForm.nextMain, mainForm.effectiveCycle), onToast, closeModal)}>
      <FormGrid><Field label="当前主线"><Input value={team.mainAgent} disabled /></Field><Field label="新主管主线" required><Input value={mainForm.nextMain} onChange={(value) => setMainForm({ ...mainForm, nextMain: value })} placeholder="请输入代理账号" /></Field><Field label="生效周期"><Select value={mainForm.effectiveCycle} onChange={(value) => setMainForm({ ...mainForm, effectiveCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
      {team.processingOccupied > 0 && <Alert tone="error" title="当前存在阻止项">处理中内部结算金额为 ¥{team.processingOccupied.toLocaleString()}，申请可保存但完成前不能批准。</Alert>}
    </Modal>
    <Modal open={modal === 'settle'} title="新增副线内部结算" description={`当前团队可用余额：¥${teamAvailableBalance(team.id).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`} onClose={closeModal} onConfirm={() => showResult(addInternalSettlement({ teamId: team.id, ...settleForm }), onToast, closeModal)}>
      <FormGrid><Field label="收款副线" required><Select value={settleForm.secondaryAgent} onChange={(value) => setSettleForm({ ...settleForm, secondaryAgent: value })} options={team.lines.filter((line) => line.identity === '副线').map((line) => line.agent)} /></Field><Field label="结算金额" required><Input type="number" min="0" value={settleForm.amount} onChange={(value) => setSettleForm({ ...settleForm, amount: value })} placeholder="请输入金额" /></Field><Field label="结算依据"><Select value={settleForm.basis} onChange={(value) => setSettleForm({ ...settleForm, basis: value })} options={['固定金额', '内部比例', '参考副线业绩', '其他约定']} /></Field><Field label="资金来源"><Select value={settleForm.source} onChange={(value) => setSettleForm({ ...settleForm, source: value })} options={['平台已到账余额', '主线自有资金', '线下资金']} /></Field><Field label="备注 / 凭证" className="ta-field-full"><Input value={settleForm.voucher} onChange={(value) => setSettleForm({ ...settleForm, voucher: value })} placeholder="请输入约定或凭证说明" /></Field></FormGrid>
      <Alert tone="warning" title="资金控制">平台已到账余额不能透支；主线自有资金仅作为演示选项，不改变团队平台账单。</Alert>
    </Modal>
    <Modal open={modal === 'edit'} title={`${team.name} · 编辑团队`} description="维护团队类型、名称和副线会员详情查看权限。" onClose={closeModal} onConfirm={() => showResult(updateTeamPreferences(team.id, { name: editTeamForm.name, teamType: editTeamForm.teamType, memberDetailPermission: editTeamForm.memberDetailPermission === '允许' }), onToast, closeModal)}>
      <FormGrid><Field label="团队名称"><Input value={editTeamForm.name} onChange={(value) => setEditTeamForm({ ...editTeamForm, name: value })} /></Field><Field label="团队类型"><Select value={editTeamForm.teamType} onChange={(value) => setEditTeamForm({ ...editTeamForm, teamType: value })} options={['推广团队', '运营团队']} /></Field><Field label="副线会员详情"><Select value={editTeamForm.memberDetailPermission} onChange={(value) => setEditTeamForm({ ...editTeamForm, memberDetailPermission: value })} options={['不允许', '允许']} /></Field></FormGrid>
    </Modal>
  </>
}

const internalColumns = [
  { key: 'id', label: '内部结算单号' }, { key: 'cycle', label: '周期' }, { key: 'mainAgent', label: '付款主线' }, { key: 'secondaryAgent', label: '收款副线' }, { key: 'amount', label: '结算金额', render: (value) => <Money value={value} /> },
  { key: 'basis', label: '结算依据' }, { key: 'source', label: '资金来源' }, { key: 'state', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'voucher', label: '备注 / 凭证' }, { key: 'createdAt', label: '操作时间' },
]

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
    return { ...bill, sequence: index + 1, agentId: agent?.id || '—', parentAccount: agent?.parent || '—', developer: agent?.developer || '—', inTeam: bill.type === '团队佣金' ? '是' : '否', isMainLine: bill.type === '团队佣金' ? '是' : '否', remaining: Math.max(0, bill.payable - bill.issued) }
  })
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

function MasterPlansPage({ onToast }) {
  const { data, addPlan, copyPlan, updatePlanLevel, updateActivityDefinition, updateAgentCost } = useTeamAgent()
  const [section, setSection] = useState('plans')
  const [type, setType] = useState('团队佣金方案')
  const [selected, setSelected] = useState(null)
  const [showAdd, setShowAdd] = useState(false)
  const [levelEdit, setLevelEdit] = useState(null)
  const [levelForm, setLevelForm] = useState({ newActive: '', activeMembers: '', netWinLoss: '', rate: '' })
  const [definitionEdit, setDefinitionEdit] = useState(null)
  const [definitionForm, setDefinitionForm] = useState({ depositThreshold: '', validBetThreshold: '', period: '' })
  const [costEdit, setCostEdit] = useState(null)
  const [costForm, setCostForm] = useState({ method: '', value: '', effectiveCycle: '', status: '' })
  const [form, setForm] = useState({ name: '', type: '团队佣金方案', effectiveCycle: '2026-08', rewardRate: '0.10' })
  const types = ['团队佣金方案', '独立单线方案', '推荐奖励方案', '历史代理方案']
  const rows = data.plans.filter((plan) => plan.type === type)
  const columns = [
    { key: 'id', label: '方案编号' }, { key: 'name', label: '方案名称', render: (value) => <b className="ta-primary-text">{value}</b> }, { key: 'type', label: '方案类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'site', label: '适用站点' },
    { key: 'levels', label: '等级 / 奖励摘要', render: (value, row) => row.type === '推荐奖励方案' ? `${(row.rewardRate * 100).toFixed(0)}% · ${row.rewardBase}` : value?.length ? `${value.length} 个等级，最高 ${value.at(-1).grade} / ${(value.at(-1).rate * 100).toFixed(0)}%` : '历史兼容查询' },
    { key: 'effectiveCycle', label: '生效周期' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><ActionLink onClick={() => setSelected(row)}>查看配置</ActionLink><ActionLink onClick={() => showResult(copyPlan(row.id), onToast)}>复制版本</ActionLink></div> },
  ]
  function openLevel(plan, level) {
    setSelected(null)
    setLevelEdit({ planId: plan.id, planName: plan.name, grade: level.grade })
    setLevelForm({ newActive: level.newActive, activeMembers: level.activeMembers, netWinLoss: level.netWinLoss, rate: level.rate })
  }
  function openDefinition(row) {
    setDefinitionEdit(row)
    setDefinitionForm({ depositThreshold: row.depositThreshold, validBetThreshold: row.validBetThreshold, period: row.period })
  }
  function openCost(row) {
    setCostEdit(row)
    setCostForm({ method: row.method, value: row.value, effectiveCycle: row.effectiveCycle, status: row.status })
  }
  return <>
    <SectionHeader title="佣金管理" description="在同一模块维护佣金方案、活跃会员定义和代理成本。" actions={section === 'plans' && <Button icon={<PlusOutlined />} onClick={() => setShowAdd(true)}>新增方案</Button>} />
    <Tabs items={[{ value: 'plans', label: '佣金方案', count: data.plans.length }, { value: 'activity', label: '活跃会员定义', count: data.activityDefinitions.length }, { value: 'costs', label: '代理成本', count: data.agentCosts.length }]} active={section} onChange={setSection} />
    {section === 'plans' && <><Tabs items={types.map((item) => ({ value: item, label: item, count: data.plans.filter((plan) => plan.type === item).length }))} active={type} onChange={setType} /><DataTable minWidth={1120} columns={columns} rows={rows} paginated /><FormulaPanel title="方案匹配规则" items={[{ label: '等级条件', formula: '新增活跃会员 ≥ 门槛 AND 活跃会员 ≥ 门槛 AND 冲正后净输赢 ≥ 门槛' }, { label: '命中等级', formula: '从高到低取全部条件同时满足的最高等级' }, { label: '佣金', formula: 'MAX（0，冲正后净输赢 × 佣金比例 + 佣金调整）' }]} /></>}
    {section === 'activity' && <DataTable columns={[{ key: 'name', label: '定义名称' }, { key: 'period', label: '统计周期' }, { key: 'depositThreshold', label: '存款条件', render: (value) => <Money value={value} /> }, { key: 'validBetThreshold', label: '有效投注条件', render: (value) => <Money value={value} /> }, { key: 'operator', label: '操作人' }, { key: 'updatedAt', label: '操作时间' }, { key: 'action', label: '操作', render: (_, row) => <ActionLink onClick={() => openDefinition(row)}>修改</ActionLink> }]} rows={data.activityDefinitions} paginated />}
    {section === 'costs' && <DataTable columns={[{ key: 'name', label: '成本名称' }, { key: 'method', label: '计算方式' }, { key: 'value', label: '配置值' }, { key: 'site', label: '适用站点' }, { key: 'effectiveCycle', label: '生效周期' }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'operator', label: '操作人' }, { key: 'updatedAt', label: '操作时间' }, { key: 'action', label: '操作', render: (_, row) => <ActionLink onClick={() => openCost(row)}>修改</ActionLink> }]} rows={data.agentCosts} paginated />}
    <Modal open={showAdd} title="新增团队代理方案" description="新方案从未来完整佣金周期开始生效。" onClose={() => setShowAdd(false)} onConfirm={() => showResult(addPlan(form), onToast, () => setShowAdd(false))}>
      <FormGrid><Field label="方案名称" required><Input value={form.name} onChange={(value) => setForm({ ...form, name: value })} placeholder="请输入方案名称" /></Field><Field label="方案类型"><Select value={form.type} onChange={(value) => setForm({ ...form, type: value })} options={types.slice(0, 3)} /></Field><Field label="生效周期"><Select value={form.effectiveCycle} onChange={(value) => setForm({ ...form, effectiveCycle: value })} options={['2026-08', '2026-09']} /></Field>{form.type === '推荐奖励方案' && <Field label="奖励比例"><Input type="number" min="0" max="1" step="0.01" value={form.rewardRate} onChange={(value) => setForm({ ...form, rewardRate: value })} /></Field>}</FormGrid>
      {form.type !== '推荐奖励方案' && <Alert title="默认等级">保存后将生成一个一星等级：新增活跃5人、活跃会员20人、冲正后净输赢50,000、佣金比例30%，可在配置详情中继续演示调整。</Alert>}
    </Modal>
    <Modal open={!!selected} title={selected?.name || ''} description={`${selected?.type || ''} · ${selected?.effectiveCycle || ''} 生效`} onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭" width={820}>
      {selected?.type === '推荐奖励方案' ? <DescriptionGrid columns={2} items={[{ label: '奖励比例', value: <Percent value={selected.rewardRate} /> }, { label: '奖励基数', value: selected.rewardBase }, { label: '是否从单线佣金扣减', value: selected.deductedFromSingle ? '是' : '否，平台另行计提' }, { label: '有效期', value: '随推荐关系有效' }]} /> : <DataTable columns={[{ key: 'grade', label: '佣金等级' }, { key: 'newActive', label: '新增活跃 ≥' }, { key: 'activeMembers', label: '活跃会员 ≥' }, { key: 'netWinLoss', label: '冲正后净输赢 ≥', render: (value) => <Money value={value} /> }, { key: 'rate', label: '佣金比例', render: (value) => <Percent value={value} /> }, { key: 'action', label: '操作', render: (_, row) => <ActionLink onClick={() => openLevel(selected, row)}>调整</ActionLink> }]} rows={selected?.levels || []} rowKey="grade" />}
    </Modal>
    <Modal open={!!levelEdit} title={`${levelEdit?.planName || ''} · ${levelEdit?.grade || ''}`} description="调整佣金等级的数值门槛与比例。" onClose={() => setLevelEdit(null)} onConfirm={() => showResult(updatePlanLevel(levelEdit.planId, levelEdit.grade, { newActive: Number(levelForm.newActive), activeMembers: Number(levelForm.activeMembers), netWinLoss: Number(levelForm.netWinLoss), rate: Number(levelForm.rate) }), onToast, () => setLevelEdit(null))}>
      <FormGrid><Field label="新增活跃 ≥"><Input type="number" value={levelForm.newActive} onChange={(value) => setLevelForm({ ...levelForm, newActive: value })} /></Field><Field label="活跃会员 ≥"><Input type="number" value={levelForm.activeMembers} onChange={(value) => setLevelForm({ ...levelForm, activeMembers: value })} /></Field><Field label="冲正后净输赢 ≥"><Input type="number" value={levelForm.netWinLoss} onChange={(value) => setLevelForm({ ...levelForm, netWinLoss: value })} /></Field><Field label="佣金比例"><Input type="number" min="0" max="1" step="0.01" value={levelForm.rate} onChange={(value) => setLevelForm({ ...levelForm, rate: value })} /></Field></FormGrid>
    </Modal>
    <Modal open={!!definitionEdit} title={`${definitionEdit?.name || ''} · 修改定义`} description="按 Excel 口径维护存款、有效投注和统计周期。" onClose={() => setDefinitionEdit(null)} onConfirm={() => showResult(updateActivityDefinition(definitionEdit.id, { depositThreshold: Number(definitionForm.depositThreshold), validBetThreshold: Number(definitionForm.validBetThreshold), period: definitionForm.period }), onToast, () => setDefinitionEdit(null))}>
      <FormGrid><Field label="统计周期"><Select value={definitionForm.period} onChange={(value) => setDefinitionForm({ ...definitionForm, period: value })} options={['佣金当月', '首存当月']} /></Field><Field label="存款条件"><Input type="number" value={definitionForm.depositThreshold} onChange={(value) => setDefinitionForm({ ...definitionForm, depositThreshold: value })} /></Field><Field label="有效投注条件"><Input type="number" value={definitionForm.validBetThreshold} onChange={(value) => setDefinitionForm({ ...definitionForm, validBetThreshold: value })} /></Field></FormGrid>
    </Modal>
    <Modal open={!!costEdit} title={`${costEdit?.name || ''} · 修改成本`} description="维护成本计算方式、配置值、生效周期和状态。" onClose={() => setCostEdit(null)} onConfirm={() => showResult(updateAgentCost(costEdit.id, costForm), onToast, () => setCostEdit(null))}>
      <FormGrid><Field label="计算方式"><Input value={costForm.method} onChange={(value) => setCostForm({ ...costForm, method: value })} /></Field><Field label="配置值"><Input value={costForm.value} onChange={(value) => setCostForm({ ...costForm, value: value })} /></Field><Field label="生效周期"><Input type="month" value={costForm.effectiveCycle} onChange={(value) => setCostForm({ ...costForm, effectiveCycle: value })} /></Field><Field label="状态"><Select value={costForm.status} onChange={(value) => setCostForm({ ...costForm, status: value })} options={['生效中', '待生效', '停用']} /></Field></FormGrid>
    </Modal>
  </>
}

function MasterSettlementPage({ onToast }) {
  const { data, dailyRemaining, submitBill, approveBill, payoutBill, adjustBillBalance } = useTeamAgent()
  const emptyFilters = { type: '', state: '', unit: '', cycle: '', account: '', agentType: '', teamType: '', reviewer: '' }
  const [filters, setFilters] = useState(emptyFilters)
  const [detail, setDetail] = useState(null)
  const [payout, setPayout] = useState(null)
  const [adjusting, setAdjusting] = useState(null)
  const [amount, setAmount] = useState('')
  const [adjustForm, setAdjustForm] = useState({ amount: '', reason: '' })
  const allRows = enrichBills(data)
  const rows = allRows.filter((bill) => (!filters.type || bill.type === filters.type) && (!filters.state || bill.state === filters.state) && (!filters.unit || `${bill.unitName}${bill.unitId}`.toLowerCase().includes(filters.unit.toLowerCase())) && (!filters.cycle || bill.cycle === filters.cycle) && (!filters.account || `${bill.agentId}${bill.payee}`.toLowerCase().includes(filters.account.toLowerCase())) && (!filters.agentType || bill.agentType === filters.agentType) && (!filters.teamType || bill.teamType === filters.teamType) && (!filters.reviewer || String(bill.reviewer).includes(filters.reviewer)))
  const totals = data.bills.reduce((acc, bill) => ({ payable: acc.payable + bill.payable, issued: acc.issued + bill.issued }), { payable: 0, issued: 0 })
  const allColumns = billColumns((row) => <><ActionLink onClick={() => setDetail(row)}>详情</ActionLink>{row.cycle === '2026-07' && <ActionLink onClick={() => { setAdjusting(row); setAdjustForm({ amount: row.balanceAdjustment, reason: row.adjustmentReason === '—' ? '' : row.adjustmentReason }) }}>结余调整</ActionLink>}{row.state === '待提交' && <ActionLink onClick={() => showResult(submitBill(row.id), onToast)}>提交</ActionLink>}{row.state === '待审核' && <><ActionLink onClick={() => showResult(approveBill(row.id, true), onToast)}>通过</ActionLink><ActionLink onClick={() => showResult(approveBill(row.id, false), onToast)}>退回</ActionLink></>}{['待发放', '部分发放'].includes(row.state) && <ActionLink onClick={() => { setPayout(row); setAmount(String(Math.min(row.payable - row.issued, dailyRemaining))) }}>发放</ActionLink>}</>)
  const [visibleKeys, setVisibleKeys] = useState(() => allColumns.map((column) => column.key))
  const columns = allColumns.filter((column) => visibleKeys.includes(column.key))
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  return <>
    <SectionHeader title="代理佣金结算" description="按 Excel 账单字段审核团队佣金、独立单线佣金和推荐奖励。" actions={<ColumnSettings columns={allColumns} visibleKeys={visibleKeys} onChange={setVisibleKeys} fixedKeys={['sequence', 'cycle', 'payee', 'action']} />} />
    <MetricGrid columns={4}><MetricCard label="账单应付合计" value={<Money value={totals.payable} />} icon={<FileDoneOutlined />} /><MetricCard label="今日成功发放" value={<Money value={data.siteQuota.successfulToday} />} tone="green" icon={<SendOutlined />} /><MetricCard label="待处理占用" value={<Money value={data.siteQuota.pendingOccupied} />} tone="orange" icon={<ClockCircleOutlined />} /><MetricCard label="站点当日剩余额度" value={<Money value={dailyRemaining} />} tone="blue" icon={<WalletOutlined />} /></MetricGrid>
    <FilterBar onSearch={() => onToast(`已查询 ${rows.length} 张账单`)} onReset={() => setFilters(emptyFilters)} onExport={() => onToast('佣金结算明细已导出')}><Field label="账单类型"><Select value={filters.type} onChange={(value) => setFilter('type', value)} placeholder="全部类型" options={['团队佣金', '独立单线佣金', '推荐奖励']} /></Field><Field label="账单状态"><Select value={filters.state} onChange={(value) => setFilter('state', value)} placeholder="全部状态" options={['待提交', '待审核', '审核退回', '待发放', '部分发放', '已发放', '无佣金结转']} /></Field><Field label="团队 / 单线"><Input value={filters.unit} onChange={(value) => setFilter('unit', value)} placeholder="名称或编号" /></Field><Field label="佣金月份"><Select value={filters.cycle} onChange={(value) => setFilter('cycle', value)} placeholder="全部月份" options={['2026-08', '2026-07', '2026-06']} /></Field><Field label="代理ID / 账号"><Input value={filters.account} onChange={(value) => setFilter('account', value)} /></Field><Field label="代理类型"><Select value={filters.agentType} onChange={(value) => setFilter('agentType', value)} placeholder="全部类型" options={['官方代理', '普通代理']} /></Field><Field label="团队类型"><Select value={filters.teamType} onChange={(value) => setFilter('teamType', value)} placeholder="全部团队" options={['推广团队', '运营团队', '—']} /></Field><Field label="审核人"><Input value={filters.reviewer} onChange={(value) => setFilter('reviewer', value)} /></Field></FilterBar>
    <DataTable minWidth={5200} columns={columns} rows={rows} paginated />
    <FormulaPanel title="当月结余与佣金口径" items={[{ label: '净输赢', formula: '总输赢 − 场馆费 − 会员红利 − 会员返水 + 账户调整 + 补单输赢 − 存款手续费 − 提款手续费' }, { label: '冲正后净输赢 / 本月结余', formula: '净输赢 + 上月结余 + 本月结余调整' }, { label: '佣金', formula: 'MAX（0，冲正后净输赢 × 比例 + 佣金调整）' }, { label: '本次可发金额', formula: 'MIN（待发佣金，站点当日剩余额度）', value: `剩余额度 ¥${dailyRemaining.toLocaleString()}` }]} />
    <Modal open={!!detail} title={`${detail?.id || ''} · 账单详情`} description="账单关系、经营指标、成本、当月结余和发放快照。" onClose={() => setDetail(null)} onConfirm={() => setDetail(null)} confirmText="关闭" showCancel={false} width={900}>
      {detail && <div className="ta-stack"><DescriptionGrid columns={3} items={[{ label: '佣金月份 / 类型', value: `${detail.cycle} / ${detail.type}` }, { label: '团队 / 单线', value: detail.unitName }, { label: '代理ID / 账号', value: `${detail.agentId} / ${detail.payee}` }, { label: '代理 / 团队类型', value: `${detail.agentType} / ${detail.teamType}` }, { label: '注册 / 首存 / 活跃', value: `${detail.registeredCount} / ${detail.firstDepositCount} / ${detail.activeCount}` }, { label: '新增活跃', value: detail.newActiveCount }, { label: '总输赢', value: <Money value={detail.totalWinLoss} signed /> }, { label: '净输赢', value: <Money value={detail.netWinLossRaw} signed /> }, { label: '上月结余', value: <Money value={detail.lastBalance} signed /> }, { label: '本月结余调整', value: <Money value={detail.balanceAdjustment} signed /> }, { label: '冲正后净输赢 / 本月结余', value: <Money value={detail.correctedNet} signed /> }, { label: '等级 / 比例', value: `${detail.grade} / ${(detail.rate * 100).toFixed(2)}%` }, { label: '佣金调整', value: <Money value={detail.commissionAdjustment} signed /> }, { label: '佣金 / 已发 / 待发', value: <><Money value={detail.payable} /> / <Money value={detail.issued} /> / <Money value={detail.remaining} /></> }, { label: '审核人 / 时间', value: `${detail.reviewer} / ${detail.reviewedAt}` }]} /><Alert title="本月结余调整说明">{detail.adjustmentReason}</Alert>{detail.type === '推荐奖励' && <Alert title="推荐奖励计算">奖励基数为独立单线已审核应付佣金，乘以 {(detail.rate * 100).toFixed(0)}%，不从独立线主佣金中扣减。</Alert>}</div>}
    </Modal>
    <Modal open={!!adjusting} title={`${adjusting?.id || ''} · 本月结余调整`} description="仅当前佣金月份可调整；保存后按 Excel 公式重算本月结余和佣金。" onClose={() => setAdjusting(null)} onConfirm={() => showResult(adjustBillBalance(adjusting.id, adjustForm), onToast, () => setAdjusting(null))}><FormGrid><Field label="本月结余调整" required><Input type="number" value={adjustForm.amount} onChange={(value) => setAdjustForm({ ...adjustForm, amount: value })} /></Field><Field label="调整原因" required><Input value={adjustForm.reason} onChange={(value) => setAdjustForm({ ...adjustForm, reason: value })} /></Field></FormGrid>{adjusting && <FormulaPanel title="调整预览" items={[{ label: '净输赢', formula: '按账单成本项计算', value: `¥${adjusting.netWinLossRaw.toLocaleString()}` }, { label: '调整后本月结余', formula: '净输赢 + 上月结余 + 本月结余调整', value: `¥${(adjusting.netWinLossRaw + adjusting.lastBalance + Number(adjustForm.amount || 0)).toLocaleString()}` }]} />}</Modal>
    <Modal open={!!payout} title="发放账单" description={`${payout?.id || ''} · 收款方 ${payout?.payee || ''}`} onClose={() => setPayout(null)} onConfirm={() => showResult(payoutBill(payout.id, amount), onToast, () => setPayout(null))} confirmText="确认发放">
      {payout && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '账单剩余', value: <Money value={payout.payable - payout.issued} /> }, { label: '站点当日剩余额度', value: <Money value={dailyRemaining} /> }, { label: '本次最多可发', value: <Money value={Math.min(payout.payable - payout.issued, dailyRemaining)} /> }, { label: '当前状态', value: <StatusTag>{payout.state}</StatusTag> }]} /><Field label="本次发放金额" required><Input type="number" min="0" value={amount} onChange={setAmount} /></Field></div>}
    </Modal>
  </>
}

function MasterRecordsPage({ onToast }) {
  const { data } = useTeamAgent()
  const [tab, setTab] = useState('platform')
  const emptyFilters = { type: '', account: '', site: '', state: '' }
  const [filters, setFilters] = useState(emptyFilters)
  const [detail, setDetail] = useState(null)
  const allRows = enrichBills(data)
  const rows = allRows.filter((row) => (!filters.type || row.type === filters.type) && (!filters.account || `${row.agentId}${row.payee}${row.unitName}`.toLowerCase().includes(filters.account.toLowerCase())) && (!filters.site || row.site === filters.site) && (!filters.state || row.state === filters.state))
  const allColumns = billColumns((row) => <ActionLink onClick={() => setDetail(row)}>详情</ActionLink>)
  const [visibleKeys, setVisibleKeys] = useState(() => allColumns.map((column) => column.key))
  const columns = allColumns.filter((column) => visibleKeys.includes(column.key))
  return <>
    <SectionHeader title="佣金记录" description="平台团队佣金、单线佣金、推荐奖励与主副线内部结算分别回放。" actions={tab === 'platform' && <ColumnSettings columns={allColumns} visibleKeys={visibleKeys} onChange={setVisibleKeys} fixedKeys={['sequence', 'cycle', 'payee', 'action']} />} />
    <Tabs items={[{ value: 'platform', label: '平台账单记录', count: data.bills.length }, { value: 'internal', label: '副线内部结算', count: data.internalSettlements.length }]} active={tab} onChange={setTab} />
    <FilterBar onSearch={() => onToast(`已查询 ${tab === 'platform' ? rows.length : data.internalSettlements.length} 条记录`)} onReset={() => setFilters(emptyFilters)} onExport={() => onToast('记录已导出')}><Field label="账单类型"><Select value={filters.type} onChange={(value) => setFilters({ ...filters, type: value })} placeholder="全部类型" options={['团队佣金', '独立单线佣金', '推荐奖励']} /></Field><Field label="对象账号"><Input value={filters.account} onChange={(value) => setFilters({ ...filters, account: value })} placeholder="代理、团队或副线" /></Field><Field label="所属站点"><Select value={filters.site} onChange={(value) => setFilters({ ...filters, site: value })} placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field><Field label="记录状态"><Select value={filters.state} onChange={(value) => setFilters({ ...filters, state: value })} placeholder="全部状态" options={['待审核', '待发放', '部分发放', '已发放', '无佣金结转']} /></Field></FilterBar>
    {tab === 'platform' ? <DataTable minWidth={5200} columns={columns} rows={rows} paginated /> : <DataTable minWidth={1120} columns={internalColumns} rows={data.internalSettlements} paginated />}
    <Alert title="对账边界" tone="warning">平台只对团队主线、独立线主和推荐奖励收款方承担付款责任；主线未向副线结算不形成平台欠款。</Alert>
    <Modal open={!!detail} title={`${detail?.id || ''} · 佣金记录详情`} description="查看生成时锁定的当月结余、比例、佣金和发放记录。" onClose={() => setDetail(null)} onConfirm={() => setDetail(null)} confirmText="关闭" showCancel={false} width={860}>{detail && <DescriptionGrid columns={3} items={[{ label: '账单类型 / 月份', value: `${detail.type} / ${detail.cycle}` }, { label: '团队 / 单线', value: detail.unitName }, { label: '代理ID / 账号', value: `${detail.agentId} / ${detail.payee}` }, { label: '净输赢', value: <Money value={detail.netWinLossRaw} signed /> }, { label: '上月结余', value: <Money value={detail.lastBalance} signed /> }, { label: '本月结余调整', value: <Money value={detail.balanceAdjustment} signed /> }, { label: '本月结余', value: <Money value={detail.correctedNet} signed /> }, { label: '比例 / 佣金调整', value: <><Percent value={detail.rate} /> / <Money value={detail.commissionAdjustment} signed /></> }, { label: '佣金 / 已发 / 待发', value: <><Money value={detail.payable} /> / <Money value={detail.issued} /> / <Money value={detail.remaining} /></> }, { label: '状态', value: <StatusTag>{detail.state}</StatusTag> }, { label: '审核人 / 时间', value: `${detail.reviewer} / ${detail.reviewedAt}` }, { label: '发放人 / 时间', value: `${detail.issuedBy} / ${detail.issuedAt}` }]} />}</Modal>
  </>
}

function MasterRelationsPage({ onToast }) {
  const { data } = useTeamAgent()
  const [tab, setTab] = useState('relations')
  const [selected, setSelected] = useState(null)
  const columns = requestColumns.concat({ key: 'action', label: '操作', render: (_, row) => <ActionLink onClick={() => setSelected(row)}>查看</ActionLink> })
  const operationRows = data.teamOperations.map((item) => ({ ...item, balanceHandling: item.balanceHandling || (item.action.includes('加入') ? '加入团队当月结余带入新团队' : item.action.includes('解散') ? '指定代理承接团队剩余结余' : '团队当月结余继续归属原团队') }))
  return <>
    <SectionHeader title="团队关系与操作记录" description="回放未来周期关系变更、团队管理操作与当月结余处理。" />
    <Tabs items={[{ value: 'relations', label: '代理关系记录', count: data.requests.length }, { value: 'operations', label: '团队操作记录', count: operationRows.length }]} active={tab} onChange={setTab} />
    <FilterBar onSearch={() => onToast('关系记录已查询')} onReset={() => onToast('筛选条件已重置')} onExport={() => onToast('关系记录已导出')}><Field label="变更类型"><Select value="" placeholder="全部类型" options={['开设副线', '副线转独立单线', '独立单线加入团队', '团队换主线', '终止独立单线']} /></Field><Field label="目标账号"><Input placeholder="申请人或结算单元" /></Field><Field label="生效周期"><Select value="" placeholder="全部周期" options={['2026-08', '2026-09']} /></Field><Field label="状态"><Select value="" placeholder="全部状态" options={['待站点复核', '已批准·待生效', '待补充资料', '审核退回']} /></Field></FilterBar>
    {tab === 'relations' ? <DataTable minWidth={1850} columns={columns} rows={data.requests} paginated /> : <DataTable minWidth={1700} columns={operationColumns} rows={operationRows} paginated />}
    <Modal open={!!selected} title={`${selected?.id || ''} · 变更详情`} description={selected?.type} onClose={() => setSelected(null)} onConfirm={() => setSelected(null)} confirmText="关闭">
      {selected && <div className="ta-stack"><DescriptionGrid columns={2} items={[{ label: '申请人', value: selected.applicant }, { label: '生效周期', value: selected.effectiveCycle }, { label: '原结算单元', value: selected.currentUnit }, { label: '目标结算单元', value: selected.targetUnit }, { label: '推荐人', value: selected.recommender }, { label: '当月结余处理', value: selected.balanceHandling }, { label: '状态', value: <StatusTag>{selected.status}</StatusTag> }, { label: '冲突检查', value: <StatusTag>{selected.conflict}</StatusTag> }, { label: '申请时间', value: selected.createdAt }]} /><Alert title="业务处理说明">{selected.note}</Alert></div>}
    </Modal>
  </>
}

function MasterReportPage({ kind, onToast }) {
  const { data } = useTeamAgent()
  if (kind === 'reversal') {
    const columns = ['site', 'agent', 'identity', 'unit', 'people', 'balance', 'level', 'member', 'direct', 'debt'].map((key, index) => ({ key, label: ['所属站点', '代理账号', '结算身份', '结算单元', '垫付人数', '垫付余额', '垫付级差佣金', '垫付会员盈利', '垫付直属佣金', '欠款额度'][index], render: index >= 5 ? (value) => <Money value={value} /> : index === 2 ? (value) => <StatusTag tone="blue">{value}</StatusTag> : undefined }))
    const rows = LEGACY_REPORT_ROWS.reversal.map((row, index) => Object.fromEntries(['site', 'agent', 'identity', 'unit', 'people', 'balance', 'level', 'member', 'direct', 'debt'].map((key, cell) => [key, row[cell]]).concat([['id', index]])))
    return <><SectionHeader title="冲正统计报表" description="保留原冲正口径，并补充团队身份与结算单元识别。" /><MetricGrid columns={4}><MetricCard label="总垫付代理数" value="18" /><MetricCard label="总欠款人数" value="34" /><MetricCard label="总垫付额度" value={<Money value={181210.41} />} tone="green" /><MetricCard label="总欠款额度" value={<Money value={96344.85} />} tone="orange" /></MetricGrid><FilterBar onSearch={() => onToast('冲正统计已查询')} onReset={() => onToast('筛选条件已重置')} onExport={() => onToast('冲正统计已导出')}><Field label="所属站点"><Select value="" placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field><Field label="结算模式"><Select value="" placeholder="全部模式" options={['团队模式', '独立单线', '原代理模式']} /></Field><Field label="搜索代理"><Input placeholder="名称或ID" /></Field></FilterBar><DataTable columns={columns} rows={rows} /></>
  }
  if (kind === 'returns') {
    const keys = ['site', 'agent', 'identity', 'type', 'flow', 'amount', 'gap', 'ledger', 'time']
    const columns = keys.map((key, index) => ({ key, label: ['所属站点', '代理账号', '结算身份', '类型', '垫付/回款', '额度', '额度缺口', '冲正账目ID', '时间'][index], render: index === 2 ? (value) => <StatusTag tone="blue">{value}</StatusTag> : index === 4 ? (value) => <StatusTag>{value}</StatusTag> : [5, 6].includes(index) ? (value) => <Money value={value} /> : undefined }))
    const rows = LEGACY_REPORT_ROWS.returns.map((row, index) => Object.fromEntries(keys.map((key, cell) => [key, row[cell]]).concat([['id', index]])))
    return <><SectionHeader title="冲正回款报表" description="查看代理冲正和后续回款明细，团队关系不改变原台账责任。" /><FilterBar onSearch={() => onToast('冲正回款已查询')} onReset={() => onToast('筛选条件已重置')} onExport={() => onToast('冲正回款已导出')}><Field label="结算身份"><Select value="" placeholder="全部身份" options={['团队主线', '团队副线', '独立线主', '原代理模式']} /></Field><Field label="垫付/回款"><Select value="" placeholder="全部" options={['垫付', '回款']} /></Field><Field label="搜索代理"><Input placeholder="名称或ID" /></Field></FilterBar><DataTable columns={columns} rows={rows} /></>
  }
  if (kind === 'revenue') {
    const rows = [
      ...data.teams.map((team) => ({ id: team.id, mode: '团队模式', unit: team.name, owner: team.mainAgent, newActive: team.metrics.newActive, active: team.metrics.activeMembers, net: team.metrics.correctedNet, grade: team.metrics.grade, commission: team.metrics.payable, balance: team.cumulativeReceived })),
      ...data.singles.map((single) => ({ id: single.id, mode: '独立单线', unit: single.name, owner: single.owner, newActive: single.metrics.newActive, active: single.metrics.activeMembers, net: single.metrics.assessmentNet, grade: single.metrics.grade, commission: single.metrics.payable, balance: data.agents.find((agent) => agent.account === single.owner)?.balance || 0 })),
    ]
    const columns = [{ key: 'mode', label: '结算模式', render: (value) => <StatusTag tone="blue">{value}</StatusTag> }, { key: 'unit', label: '结算单元' }, { key: 'owner', label: '收款负责人' }, { key: 'newActive', label: '新增活跃' }, { key: 'active', label: '活跃会员' }, { key: 'net', label: '冲正后净输赢 / 本月结余', render: (value) => <Money value={value} signed /> }, { key: 'grade', label: '等级' }, { key: 'commission', label: '本期应付佣金', render: (value) => <Money value={value} /> }, { key: 'balance', label: '当前余额', render: (value) => <Money value={value} /> }]
    return <><SectionHeader title="代理收益看板" description="按结算单元展示团队合并和独立单线的经营结果。" /><FilterBar onSearch={() => onToast('收益数据已刷新')} onReset={() => onToast('筛选条件已重置')} onExport={() => onToast('收益数据已导出')}><Field label="结算模式"><Select value="" placeholder="全部模式" options={['团队模式', '独立单线']} /></Field><Field label="结算单元"><Input placeholder="名称或编号" /></Field></FilterBar><DataTable columns={columns} rows={rows} /></>
  }
  return null
}

function MasterCyclePage({ onToast }) {
  const [cycle, setCycle] = useState('月结算')
  return <><SectionHeader title="结算周期设置" description="配置佣金账单生成时间，团队关系与方案只从未来完整周期生效。" actions={<Button onClick={() => onToast('结算周期设置已保存')}>保存设置</Button>} /><Panel title="站点结算周期" description="当前查看：旺财体育"><div className="ta-choice-grid"><button className={cycle === '周结算' ? 'active' : ''} onClick={() => setCycle('周结算')}><CalendarOutlined /><strong>周结算</strong><span>每周固定日期结算上周佣金</span></button><button className={cycle === '月结算' ? 'active' : ''} onClick={() => setCycle('月结算')}><CalendarOutlined /><strong>月结算</strong><span>每月固定日期结算上月佣金</span></button></div><DescriptionGrid items={[{ label: '当前周期', value: cycle }, { label: '执行频率', value: cycle === '月结算' ? '每月一次' : '每周一次' }, { label: '执行时间', value: '02:00' }, { label: '下一次执行', value: cycle === '月结算' ? '2026-08-01 02:00' : '2026-07-20 02:00' }]} /></Panel><Alert title="团队代理生效规则">开副线、转独立单线、加入团队、换主线以及方案和推荐关系变更，只能选择尚未开始的完整周期。</Alert></>
}

export function MasterPage({ page, navigate, onToast }) {
  if (page === 'agents') return <MasterAgentsPage navigate={navigate} onToast={onToast} />
  if (page === 'teams') return <MasterTeamsPage onToast={onToast} />
  if (page === 'singles') return <MasterSinglesPage onToast={onToast} />
  if (page === 'plans') return <MasterPlansPage onToast={onToast} />
  if (page === 'settlement') return <MasterSettlementPage onToast={onToast} />
  if (page === 'records') return <MasterRecordsPage onToast={onToast} />
  if (page === 'relations') return <MasterRelationsPage onToast={onToast} />
  if (page === 'cycle') return <MasterCyclePage onToast={onToast} />
  if (['reversal', 'returns', 'revenue'].includes(page)) return <MasterReportPage kind={page} onToast={onToast} />
  return <MasterAgentsPage navigate={navigate} onToast={onToast} />
}
