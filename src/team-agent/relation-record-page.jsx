import { useMemo, useState } from 'react'
import {
  LinkOutlined,
  ReloadOutlined,
  SearchOutlined,
  SlidersOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Button, DataTable, Field, Input, Modal, Select } from './ui'

const DEFAULT_FILTERS = {
  site: '',
  keyword: '',
  accountType: '',
  operator: '',
  migrateFee: '',
  changeStatus: '',
  migrateStatus: '',
  operatedAt: '',
  effectDate: '',
}

const RELATION_ROWS = [
  { id: 'REL-20260715-001', account: 'dengji111', accountId: '1780', site: '旺财体育', siteId: '2222', accountType: '会员', oldParent: '--', oldParentName: '--', newParent: '1749', newParentName: 'dailiwc001', effectDate: '2026-07-15', changeStatus: '已生效', migrateFee: '否', migrateStatus: '无需迁移', retryCount: '--', completedAt: '--', errorReason: '--', operator: 'system', remark: '会员上级代理关系按日生效。' },
  { id: 'REL-20260713-002', account: 'charles02', accountId: '884', site: '旺财体育', siteId: '2222', accountType: '会员', oldParent: '1774', oldParentName: 'charles', newParent: '--', newParentName: '--', effectDate: '2026-07-13', changeStatus: '已生效', migrateFee: '是', migrateStatus: '已完成', retryCount: '0', completedAt: '2026-07-13 11:24:04', errorReason: '--', operator: 'admin', remark: '迁移本期未结算费用已完成。' },
  { id: 'REL-20260713-003', account: 'charles02', accountId: '884', site: '旺财体育', siteId: '2222', accountType: '会员', oldParent: '--', oldParentName: '--', newParent: '1774', newParentName: 'charles', effectDate: '2026-07-13', changeStatus: '已生效', migrateFee: '是', migrateStatus: '已完成', retryCount: '0', completedAt: '2026-07-13 11:23:23', errorReason: '--', operator: 'admin', remark: '会员重新挂接至 charles 名下。' },
  { id: 'REL-20260720-004', account: 'charles02', accountId: '884', site: '旺财体育', siteId: '2222', accountType: '会员', oldParent: '--', oldParentName: '--', newParent: '1774', newParentName: 'charles', effectDate: '2026-07-20', changeStatus: '已取消', migrateFee: '否', migrateStatus: '无需迁移', retryCount: '--', completedAt: '--', errorReason: '--', operator: 'admin', remark: '未来生效关系已取消。' },
  { id: 'REL-20260712-005', account: 'dailiwc001b', accountId: '1784', site: '旺财体育', siteId: '2222', accountType: '代理', oldParent: '1749', oldParentName: 'dailiwc001', newParent: '1774', newParentName: 'charles', effectDate: '2026-07-16', changeStatus: '待生效', migrateFee: '是', migrateStatus: '待处理', retryCount: '0', completedAt: '--', errorReason: '--', operator: 'siteops', remark: '代理关系变更等待生效日处理。' },
  { id: 'REL-20260710-006', account: 'test1111', accountId: '1754', site: '财神客栈', siteId: '8888', accountType: '代理', oldParent: '--', oldParentName: '--', newParent: '1702', newParentName: 'C3', effectDate: '2026-07-18', changeStatus: '已失败', migrateFee: '是', migrateStatus: '失败', retryCount: '2', completedAt: '--', errorReason: '目标代理状态不可用', operator: 'siteops', remark: '需确认目标代理状态后重试。' },
]

function twoLineCell(primary, secondary, primaryClassName = '') {
  return <div className="relation-two-line"><strong className={primaryClassName}>{primary}</strong><small>{secondary}</small></div>
}

function ParentCell({ id, name }) {
  return <div className="relation-parent-cell"><b>{id}</b><span>{name}</span></div>
}

function Pill({ children, tone = 'blue' }) {
  return <span className={`relation-pill relation-pill-${tone}`}>{children}</span>
}

function statusTone(value) {
  if (value === '已生效' || value === '已完成') return 'green'
  if (value === '已取消' || value === '无需迁移') return 'gray'
  if (value === '待生效' || value === '待处理') return 'orange'
  return 'red'
}

function filterRows(rows, filters) {
  return rows.filter((row) => {
    const haystack = `${row.id}${row.account}${row.accountId}${row.remark}${row.operator}`.toLowerCase()
    return (!filters.site || row.site === filters.site)
      && (!filters.keyword || haystack.includes(filters.keyword.toLowerCase()))
      && (!filters.accountType || row.accountType === filters.accountType)
      && (!filters.operator || row.operator.toLowerCase().includes(filters.operator.toLowerCase()))
      && (!filters.migrateFee || row.migrateFee === filters.migrateFee)
      && (!filters.changeStatus || row.changeStatus === filters.changeStatus)
      && (!filters.migrateStatus || row.migrateStatus === filters.migrateStatus)
      && (!filters.operatedAt || row.completedAt.includes(filters.operatedAt))
      && (!filters.effectDate || row.effectDate.includes(filters.effectDate))
  })
}

export function MasterRelationsPage({ onToast }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS)
  const [detail, setDetail] = useState(null)
  const rows = useMemo(() => filterRows(RELATION_ROWS, filters), [filters])
  const hasFilters = Object.values(filters).some(Boolean)
  const totalText = hasFilters ? rows.length : 56
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
    onToast('筛选条件已重置')
  }
  const columns = [
    { key: 'index', label: '序号', render: (_, row, index) => index + 1 },
    { key: 'account', label: '账号', render: (_, row) => twoLineCell(row.account, `ID: ${row.accountId}`) },
    { key: 'site', label: '所属站点', render: (_, row) => twoLineCell(row.site, `ID: ${row.siteId}`) },
    { key: 'accountType', label: '账号类型', render: (value) => <Pill>{value}</Pill> },
    { key: 'oldParent', label: '原上级', render: (_, row) => <ParentCell id={row.oldParent} name={row.oldParentName} /> },
    { key: 'newParent', label: '新上级', render: (_, row) => <ParentCell id={row.newParent} name={row.newParentName} /> },
    { key: 'effectDate', label: '新代理生效日', render: (value) => <span className="relation-date-pill">{value}</span> },
    { key: 'changeStatus', label: '变更状态', render: (value) => <Pill tone={statusTone(value)}>{value}</Pill> },
    { key: 'migrateFee', label: '是否迁移本期未结算费用', render: (value) => <Pill tone={value === '是' ? 'green' : 'gray'}>{value}</Pill> },
    { key: 'migrateStatus', label: '迁移状态', render: (value) => <Pill tone={statusTone(value)}>{value}</Pill> },
    { key: 'retryCount', label: '重试次数' },
    { key: 'completedAt', label: '完成时间' },
    { key: 'errorReason', label: '错误原因' },
    { key: 'action', label: '操作', className: 'relation-sticky-col', cellClassName: 'relation-sticky-col', render: (_, row) => <button className="relation-action" onClick={() => setDetail(row)}>查看</button> },
  ]

  return <section className="relation-record-screen">
    <header className="relation-record-hero">
      <div><h1>修改代理关系记录</h1><p>查看和筛查全站以及关联子站点下，会员和代理的上级代理关系人工维护历史记录。</p></div>
      <Button icon={<ReloadOutlined />} variant="ghost" onClick={() => onToast('代理关系记录已刷新')}>刷新数据</Button>
    </header>

    <section className="relation-filter-card">
      <div className="relation-card-title"><SlidersOutlined /><strong>全局筛选条件</strong></div>
      <div className="relation-record-filter-grid">
        <Field label="所属站点"><Select value={filters.site} onChange={(value) => setFilter('site', value)} placeholder="全部站点" options={['旺财体育', '财神客栈']} /></Field>
        <Field label="目标账号 / 记录编号"><Input value={filters.keyword} onChange={(value) => setFilter('keyword', value)} placeholder="搜索账号 / ID / 备注..." /></Field>
        <Field label="账号类型"><Select value={filters.accountType} onChange={(value) => setFilter('accountType', value)} placeholder="全部类型" options={['会员', '代理']} /></Field>
        <Field label="操作人"><Input value={filters.operator} onChange={(value) => setFilter('operator', value)} placeholder="搜索操作人账号..." /></Field>
        <Field label="迁移本期未结算费用"><Select value={filters.migrateFee} onChange={(value) => setFilter('migrateFee', value)} placeholder="全部" options={['是', '否']} /></Field>
        <Field label="变更状态"><Select value={filters.changeStatus} onChange={(value) => setFilter('changeStatus', value)} placeholder="全部状态" options={['已生效', '待生效', '已取消', '已失败']} /></Field>
        <Field label="迁移状态"><Select value={filters.migrateStatus} onChange={(value) => setFilter('migrateStatus', value)} placeholder="全部状态" options={['无需迁移', '待处理', '已完成', '失败']} /></Field>
        <Field label="操作日期"><Input type="date" value={filters.operatedAt} onChange={(value) => setFilter('operatedAt', value)} /></Field>
        <Field label="新代理生效日（按日匹配）"><Input type="date" value={filters.effectDate} onChange={(value) => setFilter('effectDate', value)} /></Field>
      </div>
      <div className="relation-filter-actions">
        <Button icon={<ReloadOutlined />} variant="ghost" onClick={resetFilters}>重置条件</Button>
        <Button icon={<SearchOutlined />} onClick={() => onToast(`已查询 ${rows.length} 条关系变更记录`)}>查询</Button>
      </div>
      <p className="relation-filter-help">请选择并填写上方筛选条件，点击查询按钮进行结果筛查。</p>
    </section>

    <section className="relation-record-table-card">
      <header className="relation-record-table-head">
        <div className="relation-card-title"><LinkOutlined /><div><strong>变更明细</strong><span>支持按站点、账号类型、操作人及时间筛选</span></div></div>
        <b>共计：{totalText} 条记录</b>
      </header>
      <DataTable className="relation-record-table" minWidth={2200} columns={columns} rows={rows} rowKey="id" emptyText="暂无变更记录" />
    </section>

    <Modal open={!!detail} title="变更记录详情" description={detail?.id} onClose={() => setDetail(null)} onConfirm={() => setDetail(null)} confirmText="关闭" showCancel={false} width={720}>
      {detail && <div className="relation-detail-modal">
        <p><UserOutlined /> {detail.account}（ID: {detail.accountId}）</p>
        <p>原上级：{detail.oldParent} / {detail.oldParentName}</p>
        <p>新上级：{detail.newParent} / {detail.newParentName}</p>
        <p>新代理生效日：{detail.effectDate}</p>
        <p>迁移状态：{detail.migrateStatus}，重试次数：{detail.retryCount}</p>
        <p>备注：{detail.remark}</p>
      </div>}
    </Modal>
  </section>
}
