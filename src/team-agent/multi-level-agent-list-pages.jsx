import { useMemo, useState } from 'react'
import { DownloadOutlined, EditOutlined, LockOutlined, PlusOutlined } from '@ant-design/icons'
import { AGENT_ROWS, BET_ROWS, MEMBER_ROWS, rowsForAgentRole } from './multi-level-agent-data'
import { Button, DataTable, Field, FormGrid, Input, Modal, Select, StatusTag } from './ui'

function FilterSurface({ children, actions }) {
  return <div className="ml-filter-surface"><div className="ml-filter-grid">{children}</div><div className="ml-filter-actions">{actions}</div></div>
}

function compactMoney(value) {
  return <span className={Number(value) > 0 ? 'ml-positive' : ''}>CNY {Number(value || 0).toFixed(2)}</span>
}

export function MultiLevelAgentsPage({ onToast }) {
  const empty = { id: '', account: '', type: '多层级代理', level: '1层代理', status: '正常', plan: '层级代理方案A' }
  const [rows, setRows] = useState(AGENT_ROWS)
  const [filters, setFilters] = useState({ id: '', account: '', status: '' })
  const [selected, setSelected] = useState(null)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(empty)
  const visibleRows = useMemo(() => rows.filter((row) => (!filters.id || String(row.id).includes(filters.id)) && (!filters.account || row.account.toLowerCase().includes(filters.account.toLowerCase())) && (!filters.status || row.status === filters.status)), [rows, filters])
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const open = (kind, row = empty) => { setModal(kind); setForm({ ...row }) }
  const save = () => {
    if (!form.account.trim()) return onToast('请输入代理账号', 'error')
    if (modal === 'create') setRows((current) => [{ ...form, id: Math.max(...current.map((item) => item.id)) + 1, siteCode: '2222', childAgents: 0, childMembers: 0, lastLogin: '—' }, ...current])
    else if (modal === 'edit') setRows((current) => current.map((item) => item.id === form.id ? form : item))
    setModal(null); onToast(modal === 'create' ? '代理已新增' : modal === 'edit' ? '代理资料已修改' : '代理密码已更新')
  }
  const columns = [
    { key: 'select', label: '', render: (_, row) => <input type="radio" name="ml-agent-selected" checked={selected?.id === row.id} onChange={() => setSelected(row)} /> },
    { key: 'id', label: '代理ID' }, { key: 'account', label: '代理账号', render: (value) => <b>{value}</b> },
    { key: 'type', label: '代理模型', render: (value) => <StatusTag tone="orange">{value}</StatusTag> },
    { key: 'starLevel', label: '星级级别' }, { key: 'level', label: '层级级别' }, { key: 'siteCode', label: '站点编码' },
    { key: 'status', label: '代理状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'childAgents', label: '下属代理' }, { key: 'childMembers', label: '下属会员' }, { key: 'plan', label: '佣金方案' }, { key: 'lastLogin', label: '最后登录' },
    { key: 'action', label: '操作', render: (_, row) => <div className="ml-table-actions"><button onClick={() => open('edit', row)}><EditOutlined />修改</button><button onClick={() => open('password', row)}><LockOutlined />修改密码</button></div> },
  ]
  return <section className="ml-screen">
    <FilterSurface actions={<><Button onClick={() => onToast(`已查询 ${visibleRows.length} 条代理`)}>搜索</Button><Button variant="ghost" onClick={() => setFilters({ id: '', account: '', status: '' })}>重置</Button></>}><Field label="代理ID"><Input value={filters.id} onChange={(value) => setFilter('id', value)} placeholder="请输入代理ID" /></Field><Field label="代理账号"><Input value={filters.account} onChange={(value) => setFilter('account', value)} placeholder="请输入代理账号" /></Field><Field label="代理状态"><Select value={filters.status} onChange={(value) => setFilter('status', value)} placeholder="代理状态" options={['正常', '停用']} /></Field></FilterSurface>
    <div className="ml-list-toolbar"><Button icon={<PlusOutlined />} onClick={() => open('create')}>新增代理</Button><Button icon={<EditOutlined />} variant="success" disabled={!selected} onClick={() => selected && open('edit', selected)}>修改</Button><Button icon={<LockOutlined />} variant="warning" disabled={!selected} onClick={() => selected && open('password', selected)}>修改密码</Button></div>
    <div className="ml-card"><DataTable paginated minWidth={1650} columns={columns} rows={visibleRows} /></div>
    <Modal open={Boolean(modal)} title={modal === 'create' ? '新增多层级代理' : modal === 'edit' ? '修改多层级代理' : '修改代理密码'} onClose={() => setModal(null)} onConfirm={save}>
      {modal === 'password' ? <FormGrid columns={1}><Field label="代理账号"><Input value={form.account} disabled /></Field><Field label="新密码" required><Input type="password" value={form.password || ''} onChange={(value) => setForm({ ...form, password: value })} /></Field></FormGrid> : <FormGrid><Field label="代理账号" required><Input value={form.account} onChange={(value) => setForm({ ...form, account: value })} /></Field><Field label="代理模型"><Input value="多层级代理" disabled /></Field><Field label="层级级别"><Select value={form.level} onChange={(value) => setForm({ ...form, level: value })} options={['1层代理', '2层代理', '3层代理', '4层代理', '5层代理', '6层代理', '7层代理', '8层代理']} /></Field><Field label="代理状态"><Select value={form.status} onChange={(value) => setForm({ ...form, status: value })} options={['正常', '停用']} /></Field><Field label="佣金方案"><Select value={form.plan} onChange={(value) => setForm({ ...form, plan: value })} options={['层级代理方案A', '层级代理方案B', '未设置']} /></Field></FormGrid>}
    </Modal>
  </section>
}

export function MultiLevelMembersPage({ role = 'multiLevel', onToast }) {
  const defaults = { id: '', account: '', parent: '', status: '', type: '' }
  const [filters, setFilters] = useState(defaults)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const scopedRows = rowsForAgentRole(MEMBER_ROWS, role)
  const rows = useMemo(() => scopedRows.filter((row) => (!filters.id || String(row.id).includes(filters.id)) && (!filters.account || row.account.includes(filters.account)) && (!filters.parent || row.parent.includes(filters.parent)) && (!filters.status || row.status === filters.status) && (!filters.type || row.type === filters.type)), [filters, scopedRows])
  const columns = [{ key: 'id', label: '会员ID' }, { key: 'vip', label: 'VIP等级' }, { key: 'account', label: '会员账号', render: (value) => <b>{value}</b> }, { key: 'validBet', label: '总有效投注额', render: compactMoney }, { key: 'winLoss', label: '总输赢', render: (value) => <span className={value > 0 ? 'ml-positive' : ''}>{compactMoney(value)}</span> }, { key: 'balance', label: '钱包余额', render: compactMoney }, { key: 'type', label: '会员/代理', render: (value) => <StatusTag tone={value === '代理' ? 'orange' : 'blue'}>{value}</StatusTag> }, { key: 'parent', label: '上级代理' }, { key: 'deposit', label: '总充值', render: compactMoney }, { key: 'firstDeposit', label: '首充金额', render: compactMoney }, { key: 'received', label: '实际到账', render: compactMoney }, { key: 'registeredDeposit', label: '注册入金金额', render: compactMoney }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }]
  return <section className="ml-screen"><div className="ml-section-title"><h1>会员管理</h1><StatusTag tone="blue">全部 {scopedRows.length}</StatusTag></div><FilterSurface actions={<><Button icon={<DownloadOutlined />} variant="warning" onClick={() => onToast('会员数据已导出')}>导出Excel</Button><Button onClick={() => onToast(`已查询 ${rows.length} 条会员`)}>搜索</Button><Button variant="ghost" onClick={() => onToast('下载文件入口已触发')}>下载文件</Button><Button variant="ghost" onClick={() => setFilters(defaults)}>重置</Button></>}>
    <Field label="会员ID"><Input value={filters.id} onChange={(value) => setFilter('id', value)} placeholder="请输入会员ID" /></Field><Field label="会员账号"><Input value={filters.account} onChange={(value) => setFilter('account', value)} placeholder="请输入会员账号" /></Field><Field label="上级代理"><Input value={filters.parent} onChange={(value) => setFilter('parent', value)} placeholder="请输入上级代理账号" /></Field><Field label="状态"><Select value={filters.status} onChange={(value) => setFilter('status', value)} placeholder="全部" options={['正常', '禁用']} /></Field><Field label="会员/代理"><Select value={filters.type} onChange={(value) => setFilter('type', value)} placeholder="全部" options={['会员', '代理']} /></Field></FilterSurface><div className="ml-card"><DataTable paginated minWidth={1500} columns={columns} rows={rows} /></div></section>
}

export function MultiLevelBetsPage({ role = 'multiLevel', onToast }) {
  const defaults = { member: '', orderNo: '', venue: '', status: '', minAmount: '' }
  const [filters, setFilters] = useState(defaults)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const scopedRows = rowsForAgentRole(BET_ROWS, role)
  const rows = useMemo(() => scopedRows.filter((row) => (!filters.member || row.member.includes(filters.member)) && (!filters.orderNo || row.orderNo.includes(filters.orderNo)) && (!filters.venue || row.venue === filters.venue) && (!filters.status || row.result === filters.status) && (!filters.minAmount || row.amount >= Number(filters.minAmount))), [filters, scopedRows])
  const columns = [{ key: 'id', label: 'ID' }, { key: 'orderNo', label: '注单号' }, { key: 'siteCode', label: '站点编码' }, { key: 'member', label: '会员账号' }, { key: 'parent', label: '上级代理' }, { key: 'venueType', label: '场馆类型' }, { key: 'venue', label: '场馆名称' }, { key: 'gameId', label: '游戏ID' }, { key: 'game', label: '游戏名称' }, { key: 'detail', label: '下注详情' }, { key: 'amount', label: '下注金额' }, { key: 'validBet', label: '有效投注' }, { key: 'odds', label: '赔率' }, { key: 'result', label: '订单状态', render: (value) => <StatusTag>{value}</StatusTag> }, { key: 'time', label: '下注时间' }]
  return <section className="ml-screen"><FilterSurface actions={<><Button onClick={() => onToast(`已查询 ${rows.length} 条投注记录`)}>搜索</Button><Button variant="ghost" onClick={() => setFilters(defaults)}>重置</Button><Button icon={<DownloadOutlined />} variant="warning" onClick={() => onToast('投注记录已导出')}>导出</Button><Button variant="ghost" onClick={() => onToast('投注文件下载入口已触发')}>下载文件</Button></>}>
    <Field label="会员账号"><Input value={filters.member} onChange={(value) => setFilter('member', value)} placeholder="请输入会员账号" /></Field><Field label="注单流水号"><Input value={filters.orderNo} onChange={(value) => setFilter('orderNo', value)} placeholder="请输入三方注单号" /></Field><Field label="场馆名称"><Select value={filters.venue} onChange={(value) => setFilter('venue', value)} placeholder="请选择场馆名称" options={['DB真人']} /></Field><Field label="订单状态"><Select value={filters.status} onChange={(value) => setFilter('status', value)} placeholder="请选择订单状态" options={['已结算', '未结算']} /></Field><Field label="下注金额"><Input type="number" value={filters.minAmount} onChange={(value) => setFilter('minAmount', value)} placeholder="最小金额" /></Field><Field label="下注时间"><Input type="date" value="2026-07-21" /></Field></FilterSurface><div className="ml-card"><DataTable paginated minWidth={1900} columns={columns} rows={rows} /></div></section>
}
