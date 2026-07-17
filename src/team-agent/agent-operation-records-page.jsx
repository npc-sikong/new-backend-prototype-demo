import { useMemo, useState } from 'react'
import { DownloadOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useTeamAgent } from './context'
import {
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

const FILTER_DEFAULTS = { teamName: '', teamType: '', agentId: '', agentAccount: '', createdFrom: '', createdTo: '' }

const unique = (rows, key) => Array.from(new Set(rows.map((row) => row[key]).filter(Boolean)))
const contains = (value, keyword) => !keyword || String(value || '').toLowerCase().includes(String(keyword).toLowerCase())
const inDateRange = (value, from, to) => (!from || String(value || '').slice(0, 10) >= from) && (!to || String(value || '').slice(0, 10) <= to)

function buildOperationRows(data) {
  return [...(data.teamOperations || [])]
    .sort((left, right) => String(right.createdAt || '').localeCompare(String(left.createdAt || '')))
    .map((item, index) => ({
      ...item,
      index: index + 1,
      mainId: item.mainId || data.agents.find((agent) => agent.account === item.mainAccount)?.id || '—',
      secondaryAccounts: item.secondaryAccounts || '—',
    }))
}

function SecondaryAccounts({ value }) {
  const accounts = String(value || '—').split(/[、,，]/).map((item) => item.trim()).filter(Boolean)
  if (!accounts.length || accounts[0] === '—') return '—'
  return <div className="agent-operation-secondary">{accounts.map((account) => <span key={account}>{account}</span>)}</div>
}

export function AgentOperationRecordsPage({ onToast }) {
  const { data } = useTeamAgent()
  const allRows = useMemo(() => buildOperationRows(data), [data])
  const [filters, setFilters] = useState(FILTER_DEFAULTS)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const rows = allRows.filter((row) => (!filters.teamName || row.teamName === filters.teamName)
    && (!filters.teamType || row.teamType === filters.teamType)
    && contains(row.mainId, filters.agentId)
    && (!filters.agentAccount || contains(`${row.mainAccount}${row.secondaryAccounts}`, filters.agentAccount))
    && inDateRange(row.createdAt, filters.createdFrom, filters.createdTo))
    .map((row, index) => ({ ...row, index: index + 1 }))
  const columns = [
    { key: 'index', label: '序号' },
    { key: 'teamName', label: '团队名称', render: (value) => <b className="ta-primary-text">{value}</b> },
    { key: 'teamType', label: '团队类型', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'mainId', label: '主线编号' },
    { key: 'mainAccount', label: '主线账号' },
    { key: 'secondaryAccounts', label: '副线账号', render: (value) => <SecondaryAccounts value={value} /> },
    { key: 'action', label: '操作内容', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'reason', label: '操作理由' },
    { key: 'createdAt', label: '操作时间' },
    { key: 'operator', label: '操作人' },
  ]
  const reset = () => setFilters(FILTER_DEFAULTS)

  return <section className="ta-stack agent-operation-records-screen">
    <SectionHeader title="代理操作记录" description="集中记录代理团队创建、副线调整、关系变更和团队状态等操作流水。" actions={<Toolbar><Button icon={<DownloadOutlined />} variant="slate" onClick={() => onToast(`代理操作记录已导出 ${rows.length} 条`)}>导出</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast('代理操作记录文件已下载')}>下载文件</Button></Toolbar>} />
    <FilterBar onSearch={() => onToast(`已查询 ${rows.length} 条代理操作记录`)} onReset={reset}>
      <Field label="团队名称"><Select value={filters.teamName} onChange={(value) => setFilter('teamName', value)} placeholder="全部团队" options={unique(allRows, 'teamName')} /></Field>
      <Field label="团队类型"><Select value={filters.teamType} onChange={(value) => setFilter('teamType', value)} placeholder="全部类型" options={unique(allRows, 'teamType')} /></Field>
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
