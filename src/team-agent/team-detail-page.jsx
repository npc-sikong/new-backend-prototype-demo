import { useEffect, useMemo, useState } from 'react'
import { LockOutlined, StopOutlined, SwapOutlined, UserAddOutlined } from '@ant-design/icons'
import { AgentOperationRecordsPage } from './agent-operation-records-page'
import { useTeamAgent } from './context'
import { buildTeamCommissionRows } from './team-management-helpers'
import { TeamOverviewList } from './team-overview-list'
import {
  Alert,
  Button,
  DataTable,
  Field,
  FilterBar,
  FormulaPanel,
  FormGrid,
  Input,
  Modal,
  Money,
  Panel,
  Percent,
  SectionHeader,
  Select,
  StatusTag,
  Tabs,
} from './ui'

const ROLE_ACCOUNTS = { main: ['gaodashang', 'WC002', 'LGNB'], secondary: ['WC002'], independent: ['dailiwc001'] }
const accountsFor = (role) => ROLE_ACCOUNTS[role] || ROLE_ACCOUNTS.main
const EMPTY_PERFORMANCE_FILTERS = { agent: '', identity: '', lineId: '', statFrom: '', statTo: '' }

function showResult(result, onToast, onSuccess) {
  onToast(result.message, result.ok ? 'success' : 'error')
  if (result.ok) onSuccess?.()
}

function portalTeams(data, portal, role) {
  return data.teams
    .filter((team) => portal === 'master' || (portal === 'site' ? team.site === '旺财体育' : team.lines.some((line) => accountsFor(role).includes(line.agent))))
    .map((team) => portal === 'agent' && role !== 'main' ? { ...team, lines: team.lines.filter((line) => accountsFor(role).includes(line.agent)) } : team)
}

export function TeamDetailPage({ onToast, portal = 'master', role = 'main', target }) {
  const { data, addSecondary, setTeamStatus, changeMain } = useTeamAgent()
  const visibleTeams = useMemo(() => portalTeams(data, portal, role), [data, portal, role])
  const [selectedId, setSelectedId] = useState(() => target?.teamId || visibleTeams[0]?.id || '')
  const [tab, setTab] = useState(() => target?.tab || 'overview')
  const [modal, setModal] = useState(null)
  const [secondaryForm, setSecondaryForm] = useState({ agent: '', scope: '', startCycle: '2026-08' })
  const [mainForm, setMainForm] = useState({ nextMain: '', effectiveCycle: '2026-08' })
  const [performanceFilters, setPerformanceFilters] = useState(EMPTY_PERFORMANCE_FILTERS)

  useEffect(() => {
    if (target?.teamId && visibleTeams.some((team) => team.id === target.teamId)) setSelectedId(target.teamId)
    if (target?.tab) setTab(target.tab)
  }, [target?.teamId, target?.tab, visibleTeams])

  useEffect(() => {
    if (!visibleTeams.some((team) => team.id === selectedId)) setSelectedId(visibleTeams[0]?.id || '')
  }, [selectedId, visibleTeams])

  const team = visibleTeams.find((item) => item.id === selectedId)
  if (!team) return <Panel title="团队详情" description="当前身份暂无可查看团队。"><div className="ta-empty-cell">暂无数据</div></Panel>

  const statDates = ['2026-07-17', '2026-07-16', '2026-07-15']
  const commissionRows = buildTeamCommissionRows(team)
    .filter((row) => portal !== 'agent' || role === 'main' || accountsFor(role).includes(row.agent))
    .map((row, index) => ({ ...row, statDate: row.statDate || statDates[index % statDates.length] }))
  const performanceRows = commissionRows.filter((row) => (!performanceFilters.agent || row.agent.toLowerCase().includes(performanceFilters.agent.toLowerCase()))
    && (!performanceFilters.identity || row.identity === performanceFilters.identity)
    && (!performanceFilters.lineId || row.lineId.toLowerCase().includes(performanceFilters.lineId.toLowerCase()))
    && (!performanceFilters.statFrom || row.statDate >= performanceFilters.statFrom)
    && (!performanceFilters.statTo || row.statDate <= performanceFilters.statTo))
  const performanceTotal = performanceRows.reduce((sum, row) => ({
    newActive: sum.newActive + Number(row.newActive || 0),
    firstDepositCount: sum.firstDepositCount + Number(row.firstDepositCount || 0),
    firstDepositAmount: sum.firstDepositAmount + Number(row.firstDepositAmount || 0),
    activeMembers: sum.activeMembers + Number(row.activeMembers || 0),
    totalWinLoss: sum.totalWinLoss + Number(row.totalWinLoss || 0),
    operationFee: sum.operationFee + Number(row.operationFee || 0),
    netRevenue: sum.netRevenue + Number(row.netRevenue || 0),
  }), { newActive: 0, firstDepositCount: 0, firstDepositAmount: 0, activeMembers: 0, totalWinLoss: 0, operationFee: 0, netRevenue: 0 })

  const performanceColumns = [
    { key: 'identity', label: '身份', render: (value) => <StatusTag tone={value === '主线' ? 'blue' : 'gray'}>{value}</StatusTag> },
    { key: 'lineId', label: 'line_id' },
    { key: 'agent', label: '代理名称', render: (value) => <b>{value}</b> },
    { key: 'statDate', label: '统计日期' },
    { key: 'scope', label: '显式业务范围' },
    { key: 'newActive', label: '新增活跃' },
    { key: 'firstDepositCount', label: '新增首存' },
    { key: 'firstDepositAmount', label: '首存额度', render: (value) => <Money value={value} /> },
    { key: 'activeMembers', label: '活跃会员' },
    { key: 'totalWinLoss', label: '总盈亏', render: (value) => <Money value={value} signed /> },
    { key: 'operationFee', label: '运营费用', render: (value) => <Money value={value} /> },
    { key: 'netRevenue', label: '净收益', render: (value) => <Money value={value} signed /> },
    { key: 'contributionRate', label: '团队贡献占比', render: (value) => <Percent value={value} /> },
  ]

  const closeModal = () => setModal(null)
  const openSecondary = () => {
    setSecondaryForm({ agent: '', scope: '', startCycle: '2026-08' })
    setModal('secondary')
  }
  const tabs = [
    { value: 'overview', label: '团队概况' },
    { value: 'performance', label: '团队业绩查看' },
    { value: 'operations', label: '代理操作记录' },
  ]

  return <section className="ta-stack team-detail-module-screen">
    <SectionHeader title="团队详情" description="独立查看团队概况、团队业绩和代理操作记录，不再占用团队代理管理列表页面。" actions={portal !== 'agent' && <><Button icon={<UserAddOutlined />} onClick={openSecondary}>开设副线</Button><Button icon={<SwapOutlined />} variant="ghost" onClick={() => setModal('main')}>更换主线</Button><Button icon={<LockOutlined />} variant="warning" onClick={() => showResult(setTeamStatus(team.id, team.status === '冻结' ? '生效中' : '冻结'), onToast)}>{team.status === '冻结' ? '解冻' : '冻结'}</Button><Button icon={<StopOutlined />} variant="danger" onClick={() => showResult(setTeamStatus(team.id, '已解散'), onToast)}>解散</Button></>} />
    <FilterBar onSearch={() => onToast(`已切换至 ${team.name}`)} onReset={() => { setSelectedId(visibleTeams[0]?.id || ''); setTab('overview') }}>
      <Field label="选择团队"><Select value={selectedId} onChange={(value) => { setSelectedId(value); setPerformanceFilters(EMPTY_PERFORMANCE_FILTERS) }} options={visibleTeams.map((item) => ({ value: item.id, label: `${item.name} / ${item.mainAgent}` }))} /></Field>
      <Field label="团队编号"><Input value={team.code} disabled /></Field>
      {portal === 'master' && <Field label="所属站点"><Input value={team.site} disabled /></Field>}
      <Field label="团队负责人"><Input value={team.mainAgent} disabled /></Field>
    </FilterBar>
    <div className="team-detail-current"><b>{team.name}</b><span>{team.code}</span><span>{team.site} / {team.currency}</span><StatusTag>{team.status}</StatusTag></div>
    <Tabs items={tabs} active={tab} onChange={setTab} />
    {tab === 'overview' && <TeamOverviewList team={team} data={data} />}
    {tab === 'performance' && <div className="ta-stack">
      <FilterBar onSearch={() => onToast(`已查询 ${performanceRows.length} 条团队业绩`)} onReset={() => setPerformanceFilters(EMPTY_PERFORMANCE_FILTERS)} onExport={() => onToast(`团队业绩已导出 ${performanceRows.length} 条`)}>
        <Field label="代理名称"><Input value={performanceFilters.agent} onChange={(value) => setPerformanceFilters({ ...performanceFilters, agent: value })} placeholder="代理账号" /></Field>
        <Field label="身份"><Select value={performanceFilters.identity} onChange={(value) => setPerformanceFilters({ ...performanceFilters, identity: value })} placeholder="全部身份" options={['主线', '副线']} /></Field>
        <Field label="line_id"><Input value={performanceFilters.lineId} onChange={(value) => setPerformanceFilters({ ...performanceFilters, lineId: value })} placeholder="LINE-A" /></Field>
        <Field label="统计日期起"><Input type="date" value={performanceFilters.statFrom} onChange={(value) => setPerformanceFilters({ ...performanceFilters, statFrom: value })} /></Field>
        <Field label="统计日期止"><Input type="date" value={performanceFilters.statTo} onChange={(value) => setPerformanceFilters({ ...performanceFilters, statTo: value })} /></Field>
      </FilterBar>
      <Panel title="团队业绩查看" description="按线路查看团队业绩、运营成本、净收益和贡献占比，仅做业绩核对，不在此页发放。">
        <DataTable columns={performanceColumns} rows={performanceRows} rowKey="lineId" minWidth={1500} paginated />
        <div className="team-performance-total"><b>总计</b><span>记录 {performanceRows.length} 条</span><span>新增活跃 {performanceTotal.newActive}</span><span>新增首存 {performanceTotal.firstDepositCount}</span><span>首存额度 <Money value={performanceTotal.firstDepositAmount} /></span><span>活跃会员 {performanceTotal.activeMembers}</span><span>总盈亏 <Money value={performanceTotal.totalWinLoss} signed /></span><span>运营费用 <Money value={performanceTotal.operationFee} /></span><span>净收益 <Money value={performanceTotal.netRevenue} signed /></span></div>
      </Panel>
      <FormulaPanel title="团队业绩查看口径" items={[{ label: '总盈亏', formula: '各线路总输赢合计', value: `¥${performanceTotal.totalWinLoss.toLocaleString()}` }, { label: '运营费用', formula: '按线路运营成本合计', value: `¥${performanceTotal.operationFee.toLocaleString()}` }, { label: '净收益', formula: '总盈亏 − 运营费用', value: `¥${performanceTotal.netRevenue.toLocaleString()}` }, { label: '团队贡献占比', formula: '单线正向净收益 ÷ 全团队正向净收益' }]} />
    </div>}
    {tab === 'operations' && <AgentOperationRecordsPage embedded teamId={team.id} portal={portal} role={role} onToast={onToast} />}

    <Modal open={modal === 'secondary'} title={`为 ${team.name} 开设副线`} description="副线范围必须明确且不能与其他结算单元重叠。" onClose={closeModal} onConfirm={() => showResult(addSecondary(team.id, { ...secondaryForm, requireReview: true }), onToast, closeModal)}>
      <FormGrid><Field label="副线" required><Input value={secondaryForm.agent} onChange={(value) => setSecondaryForm({ ...secondaryForm, agent: value })} placeholder="请输入代理账号" /></Field><Field label="生效周期"><Select value={secondaryForm.startCycle} onChange={(value) => setSecondaryForm({ ...secondaryForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field><Field label="业务范围" className="ta-field-full"><Input value={secondaryForm.scope} onChange={(value) => setSecondaryForm({ ...secondaryForm, scope: value })} placeholder="例如：该代理节点及直属会员" /></Field></FormGrid>
      <Alert title="唯一归属检查">保存前会检查目标代理是否已属于其他团队或单线代理；当前周期不追溯切分。</Alert>
    </Modal>
    <Modal open={modal === 'main'} title={`更换 ${team.name} 团队负责人`} description="换主线只影响未来周期，历史账单和历史结算记录仍归原主线。" onClose={closeModal} onConfirm={() => showResult(changeMain(team.id, mainForm.nextMain, mainForm.effectiveCycle), onToast, closeModal)}>
      <FormGrid><Field label="当前主线"><Input value={team.mainAgent} disabled /></Field><Field label="新团队负责人" required><Input value={mainForm.nextMain} onChange={(value) => setMainForm({ ...mainForm, nextMain: value })} placeholder="请输入代理账号" /></Field><Field label="生效周期"><Select value={mainForm.effectiveCycle} onChange={(value) => setMainForm({ ...mainForm, effectiveCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
      {team.processingOccupied > 0 && <Alert tone="error" title="当前存在阻止项">处理中发放占用金额为 ¥{team.processingOccupied.toLocaleString()}，申请可保存但完成前不能批准。</Alert>}
    </Modal>
  </section>
}
