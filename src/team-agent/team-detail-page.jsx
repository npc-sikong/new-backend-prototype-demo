import { useEffect, useMemo, useState } from 'react'
import { LockOutlined, StopOutlined, SwapOutlined, UserAddOutlined } from '@ant-design/icons'
import { AgentOperationRecordsPage } from './agent-operation-records-page'
import { useTeamAgent } from './context'
import { TeamOverviewList } from './team-overview-list'
import {
  Alert,
  Button,
  Field,
  FilterBar,
  FormGrid,
  Input,
  Modal,
  Panel,
  SectionHeader,
  Select,
  Tabs,
} from './ui'

const ROLE_ACCOUNTS = { main: ['gaodashang', 'WC002', 'LGNB'], secondary: ['WC002'], independent: ['dailiwc001'] }
const accountsFor = (role) => ROLE_ACCOUNTS[role] || ROLE_ACCOUNTS.main
const normalizeTab = (value) => value === 'operations' ? 'operations' : 'overview'

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
  const scopedTeams = useMemo(() => portalTeams(data, portal, role), [data, portal, role])
  const [teamFilters, setTeamFilters] = useState({ site: '', keyword: '', mainAgent: '' })
  const visibleTeams = useMemo(() => scopedTeams.filter((item) => {
    const keyword = teamFilters.keyword.trim().toLowerCase()
    const mainAgent = teamFilters.mainAgent.trim().toLowerCase()
    return (!teamFilters.site || item.site === teamFilters.site)
      && (!keyword || `${item.name}${item.code}`.toLowerCase().includes(keyword))
      && (!mainAgent || item.mainAgent.toLowerCase().includes(mainAgent))
  }), [scopedTeams, teamFilters])
  const siteOptions = useMemo(() => [...new Set(scopedTeams.map((item) => item.site))], [scopedTeams])
  const [selectedId, setSelectedId] = useState(() => target?.teamId || scopedTeams[0]?.id || '')
  const [tab, setTab] = useState(() => normalizeTab(target?.tab))
  const [modal, setModal] = useState(null)
  const [secondaryForm, setSecondaryForm] = useState({ agent: '', scope: '', startCycle: '2026-08' })
  const [mainForm, setMainForm] = useState({ nextMain: '', effectiveCycle: '2026-08' })

  useEffect(() => {
    if (target?.teamId && visibleTeams.some((team) => team.id === target.teamId)) setSelectedId(target.teamId)
    if (target?.tab) setTab(normalizeTab(target.tab))
  }, [target?.teamId, target?.tab, visibleTeams])

  useEffect(() => {
    if (!visibleTeams.some((team) => team.id === selectedId)) setSelectedId(visibleTeams[0]?.id || '')
  }, [selectedId, visibleTeams])

  const team = visibleTeams.find((item) => item.id === selectedId)
  const resetTeamFilters = () => {
    setTeamFilters({ site: '', keyword: '', mainAgent: '' })
    setSelectedId(scopedTeams[0]?.id || '')
    setTab('overview')
  }
  const teamFiltersBar = <FilterBar onSearch={() => onToast(`已查询 ${visibleTeams.length} 个团队`)} onReset={resetTeamFilters}>
    {portal !== 'agent' && <Field label="所属站点"><Select value={teamFilters.site} onChange={(value) => setTeamFilters({ ...teamFilters, site: value })} placeholder="全部站点" options={siteOptions} /></Field>}
    <Field label="团队搜索"><Input value={teamFilters.keyword} onChange={(value) => setTeamFilters({ ...teamFilters, keyword: value })} placeholder="团队名称或编号" /></Field>
    <Field label="团队负责人搜索"><Input value={teamFilters.mainAgent} onChange={(value) => setTeamFilters({ ...teamFilters, mainAgent: value })} placeholder="负责人账号" /></Field>
  </FilterBar>
  if (!team) return <section className="ta-stack team-detail-module-screen"><SectionHeader title="团队详情" description="集中查看团队概况和当前团队代理操作记录。" />{teamFiltersBar}<Panel title="暂无匹配团队" description="请调整站点、团队或团队负责人筛选条件后重新查询。"><div className="ta-empty-cell">暂无数据</div></Panel></section>

  const closeModal = () => setModal(null)
  const openSecondary = () => {
    setSecondaryForm({ agent: '', scope: '', startCycle: '2026-08' })
    setModal('secondary')
  }
  const tabs = [
    { value: 'overview', label: '团队概况' },
    { value: 'operations', label: '代理操作记录' },
  ]

  return <section className="ta-stack team-detail-module-screen">
    <SectionHeader title="团队详情" description="集中查看团队概况和当前团队代理操作记录。" actions={portal !== 'agent' && <><Button icon={<UserAddOutlined />} onClick={openSecondary}>开设副线</Button><Button icon={<SwapOutlined />} variant="ghost" onClick={() => setModal('main')}>更换主线</Button><Button icon={<LockOutlined />} variant="warning" onClick={() => setModal('freeze')}>{team.status === '冻结' ? '解除冻结' : '冻结团队'}</Button><Button icon={<StopOutlined />} variant="danger" onClick={() => showResult(setTeamStatus(team.id, '已解散'), onToast)}>解散</Button></>} />
    {teamFiltersBar}
    <div className="team-detail-current"><b>{team.name}</b><span>{team.code}</span><span>{team.site} / {team.currency}</span></div>
    <Tabs items={tabs} active={tab} onChange={setTab} />
    {tab === 'overview' && <TeamOverviewList team={team} data={data} />}
    {tab === 'operations' && <AgentOperationRecordsPage embedded teamId={team.id} portal={portal} role={role} onToast={onToast} />}

    <Modal open={modal === 'secondary'} title={`为 ${team.name} 开设副线`} description="副线范围必须明确且不能与其他结算单元重叠。" onClose={closeModal} onConfirm={() => showResult(addSecondary(team.id, { ...secondaryForm, requireReview: true }), onToast, closeModal)}>
      <FormGrid><Field label="副线" required><Input value={secondaryForm.agent} onChange={(value) => setSecondaryForm({ ...secondaryForm, agent: value })} placeholder="请输入代理账号" /></Field><Field label="生效周期"><Select value={secondaryForm.startCycle} onChange={(value) => setSecondaryForm({ ...secondaryForm, startCycle: value })} options={['2026-08', '2026-09']} /></Field><Field label="业务范围" className="ta-field-full"><Input value={secondaryForm.scope} onChange={(value) => setSecondaryForm({ ...secondaryForm, scope: value })} placeholder="例如：该代理节点及直属会员" /></Field></FormGrid>
      <Alert title="唯一归属检查">保存前会检查目标代理是否已属于其他团队或单线代理；当前周期不追溯切分。</Alert>
    </Modal>
    <Modal open={modal === 'main'} title={`更换 ${team.name} 团队负责人`} description="换主线只影响未来周期，历史账单和历史结算记录仍归原主线。" onClose={closeModal} onConfirm={() => showResult(changeMain(team.id, mainForm.nextMain, mainForm.effectiveCycle), onToast, closeModal)}>
      <FormGrid><Field label="当前主线"><Input value={team.mainAgent} disabled /></Field><Field label="新团队负责人" required><Input value={mainForm.nextMain} onChange={(value) => setMainForm({ ...mainForm, nextMain: value })} placeholder="请输入代理账号" /></Field><Field label="生效周期"><Select value={mainForm.effectiveCycle} onChange={(value) => setMainForm({ ...mainForm, effectiveCycle: value })} options={['2026-08', '2026-09']} /></Field></FormGrid>
      {team.processingOccupied > 0 && <Alert tone="error" title="当前存在阻止项">处理中发放占用金额为 ¥{team.processingOccupied.toLocaleString()}，申请可保存但完成前不能批准。</Alert>}
    </Modal>
    <Modal
      open={modal === 'freeze'}
      title={team.status === '冻结' ? `解除冻结 · ${team.name}` : `冻结团队 · ${team.name}`}
      description={team.status === '冻结' ? '解除冻结后，团队及全部代理账号恢复正常状态。' : '冻结后，团队负责人和全部副线代理均不能登录代理后台。'}
      onClose={closeModal}
      onConfirm={() => showResult(setTeamStatus(team.id, team.status === '冻结' ? '正常' : '冻结'), onToast, closeModal)}
      confirmText={team.status === '冻结' ? '确认解除' : '确认冻结'}
    >
      <Alert tone={team.status === '冻结' ? 'info' : 'error'} title={team.status === '冻结' ? '解除后的状态' : '冻结影响'}>
        {team.status === '冻结' ? '解除后团队状态恢复为正常，团队负责人及全部副线代理恢复登录。' : '冻结团队将同时禁止团队负责人和全部副线代理登录；解除冻结后恢复正常状态。'}
      </Alert>
    </Modal>
  </section>
}
