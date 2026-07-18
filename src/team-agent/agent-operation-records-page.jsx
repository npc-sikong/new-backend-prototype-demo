import { useMemo, useState } from 'react'
import { DownloadOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useTeamAgent } from './context'
import {
  Alert,
  Button,
  DataTable,
  Field,
  FilterBar,
  Input,
  Panel,
  SectionHeader,
  Select,
  StatusTag,
  Toolbar,
} from './ui'

const FILTER_DEFAULTS = { teamName: '', agentIdentity: '', agentId: '', agentAccount: '', createdFrom: '', createdTo: '' }
const ROLE_ACCOUNTS = { main: 'gaodashang', secondary: 'WC002', independent: 'dailiwc001' }

const unique = (rows, key) => Array.from(new Set(rows.map((row) => row[key]).filter(Boolean)))
const contains = (value, keyword) => !keyword || String(value || '').toLowerCase().includes(String(keyword).toLowerCase())
const inDateRange = (value, from, to) => (!from || String(value || '').slice(0, 10) >= from) && (!to || String(value || '').slice(0, 10) <= to)

function buildOperationRows(data) {
  return [...(data.teamOperations || [])]
    .sort((left, right) => String(right.createdAt || '').localeCompare(String(left.createdAt || '')))
    .map((item, index) => {
      const mainAgent = data.agents.find((agent) => agent.account === item.mainAccount)
      return {
      ...item,
      index: index + 1,
      site: item.site || data.teams.find((team) => team.id === item.teamId)?.site || '旺财体育',
      mainId: item.mainId || mainAgent?.id || '—',
      agentIdentity: mainAgent?.teamAgentType === '官方代理' ? '官方代理' : '普通代理',
      secondaryAccounts: item.secondaryAccounts || '—',
    }})
}

function SecondaryAccounts({ value }) {
  const accounts = String(value || '—').split(/[、,，]/).map((item) => item.trim()).filter(Boolean)
  if (!accounts.length || accounts[0] === '—') return '—'
  return <div className="agent-operation-secondary">{accounts.map((account) => <span key={account}>{account}</span>)}</div>
}

export function AgentOperationRecordsPage({ onToast, portal = 'master', role = 'main' }) {
  const { data } = useTeamAgent()
  const allRows = useMemo(() => buildOperationRows(data).filter((row) => {
    if (portal === 'site') return row.site === '旺财体育'
    if (portal === 'agent') {
      const account = ROLE_ACCOUNTS[role]
      return row.mainAccount === account || String(row.secondaryAccounts).includes(account)
    }
    return true
  }), [data, portal, role])
  const [filters, setFilters] = useState(FILTER_DEFAULTS)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const rows = allRows.filter((row) => (!filters.teamName || row.teamName === filters.teamName)
    && (!filters.agentIdentity || row.agentIdentity === filters.agentIdentity)
    && contains(row.mainId, filters.agentId)
    && (!filters.agentAccount || contains(`${row.mainAccount}${row.secondaryAccounts}`, filters.agentAccount))
    && inDateRange(row.createdAt, filters.createdFrom, filters.createdTo))
    .map((row, index) => ({ ...row, index: index + 1 }))
  const columns = [
    { key: 'index', label: '序号' },
    { key: 'teamName', label: '团队名称', render: (value) => <b className="ta-primary-text">{value}</b> },
    { key: 'agentIdentity', label: '代理身份', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'mainId', label: '主线编号' },
    { key: 'mainAccount', label: '主线账号' },
    { key: 'secondaryAccounts', label: '副线账号', render: (value) => <SecondaryAccounts value={value} /> },
    { key: 'action', label: '操作内容', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'reason', label: '操作理由' },
    { key: 'createdAt', label: '操作时间' },
    { key: 'operator', label: '操作人' },
  ].filter((column) => portal !== 'agent' || column.key !== 'operator')
  const reset = () => setFilters(FILTER_DEFAULTS)

  return <section className="ta-stack agent-operation-records-screen">
    <SectionHeader title="代理操作记录" description={portal === 'master' ? '集中记录代理团队创建、副线调整、关系变更和团队状态等操作流水。' : portal === 'site' ? '同步总控操作记录，仅查看旺财体育本站代理团队的操作流水。' : '同步总控操作记录，仅查看当前演示身份本人相关的团队操作流水。'} actions={<Toolbar><Button icon={<DownloadOutlined />} variant="slate" onClick={() => onToast(`代理操作记录已导出 ${rows.length} 条`)}>导出</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast('代理操作记录文件已下载')}>下载文件</Button></Toolbar>} />
    {portal !== 'master' && <Alert title="角色查看范围" tone="warning">{portal === 'site' ? '当前页面固定展示旺财体育本站记录，不提供跨站点数据。' : '当前页面仅展示与当前代理身份有关的操作记录，并隐藏后台操作人字段。'}</Alert>}
    <FilterBar onSearch={() => onToast(`已查询 ${rows.length} 条代理操作记录`)} onReset={reset}>
      <Field label="团队名称"><Select value={filters.teamName} onChange={(value) => setFilter('teamName', value)} placeholder="全部团队" options={unique(allRows, 'teamName')} /></Field>
      <Field label="代理身份"><Select value={filters.agentIdentity} onChange={(value) => setFilter('agentIdentity', value)} placeholder="全部身份" options={unique(allRows, 'agentIdentity')} /></Field>
      <Field label="代理编号"><Input value={filters.agentId} onChange={(value) => setFilter('agentId', value)} placeholder="主线编号" /></Field>
      <Field label="代理账号"><Input value={filters.agentAccount} onChange={(value) => setFilter('agentAccount', value)} placeholder="主线或副线账号" /></Field>
      <Field label="创建时间起"><Input type="date" value={filters.createdFrom} onChange={(value) => setFilter('createdFrom', value)} /></Field>
      <Field label="创建时间止"><Input type="date" value={filters.createdTo} onChange={(value) => setFilter('createdTo', value)} /></Field>
    </FilterBar>
    <Panel title="操作记录列表" description="副线账号支持多账号排列展示，记录每次操作内容、原因、时间和操作人。">
      <DataTable className="agent-operation-records-table" minWidth={1280} columns={columns} rows={rows} paginated />
    </Panel>
  </section>
}
