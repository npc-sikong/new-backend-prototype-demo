import { useMemo, useState } from 'react'
import { DownOutlined, DownloadOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useTeamAgent } from './context'
import {
  Button,
  DataTable,
  Field,
  FilterBar,
  FormulaPanel,
  Input,
  Money,
  Panel,
  Percent,
  SectionHeader,
  Select,
  StatusTag,
  Toolbar,
} from './ui'

const FILTER_DEFAULTS = { cycle: '', teamType: '', commissionState: '', auditState: '', keyword: '' }
const MONEY_KEYS = ['depositAmount', 'withdrawalAmount', 'totalWinLoss', 'venueFee', 'memberBonus', 'memberRebate', 'accountAdjustment', 'depositFee', 'withdrawalFee', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet', 'commissionAdjustment', 'commission']

const COLUMN_DEFS = [
  { key: 'index', label: '序号' },
  { key: 'cycle', label: '佣金周期' },
  { key: 'teamName', label: '团队名称' },
  { key: 'agentId', label: '代理编号' },
  { key: 'agentAccount', label: '代理账号' },
  { key: 'teamType', label: '团队类型' },
  { key: 'parentAccount', label: '上级账号' },
  { key: 'teamMembers', label: '团队人数' },
  { key: 'subAgentCount', label: '下级人数' },
  { key: 'registeredCount', label: '注册人数' },
  { key: 'firstDepositCount', label: '首存人数' },
  { key: 'activeCount', label: '活跃人数' },
  { key: 'newActiveCount', label: '新增活跃人数' },
  { key: 'depositAmount', label: '存款金额' },
  { key: 'withdrawalAmount', label: '提款金额' },
  { key: 'totalWinLoss', label: '总输赢' },
  { key: 'venueFee', label: '场馆费' },
  { key: 'memberBonus', label: '红利' },
  { key: 'memberRebate', label: '返水' },
  { key: 'accountAdjustment', label: '账户调整' },
  { key: 'depositFee', label: '存款手续费' },
  { key: 'withdrawalFee', label: '提款手续费' },
  { key: 'manualOrderWinLoss', label: '补单输赢' },
  { key: 'netWinLossRaw', label: '净输赢' },
  { key: 'lastBalance', label: '上月结余' },
  { key: 'correctedNet', label: '冲正后净输赢' },
  { key: 'rate', label: '佣金比例' },
  { key: 'commissionAdjustment', label: '佣金调整' },
  { key: 'commission', label: '佣金' },
  { key: 'commissionState', label: '佣金状态' },
  { key: 'becameAgentAt', label: '成为代理时间' },
  { key: 'joinedAt', label: '加入团队时间' },
  { key: 'issuedBy', label: '发放人' },
  { key: 'issuedAt', label: '发放时间' },
  { key: 'reviewer', label: '审核人员' },
  { key: 'reviewedAt', label: '审核时间' },
  { key: 'auditState', label: '审核状态' },
  { key: 'maintainer', label: '维护人' },
  { key: 'adjustmentReason', label: '调整原因' },
]

const ALL_KEYS = COLUMN_DEFS.map((column) => column.key)
const COUNT_KEYS = ['teamMembers', 'subAgentCount', 'registeredCount', 'firstDepositCount', 'activeCount', 'newActiveCount']
const COUNT_KEY_SET = new Set(COUNT_KEYS)
const SIGNED_MONEY_KEYS = new Set(['totalWinLoss', 'accountAdjustment', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet', 'commissionAdjustment'])

const unique = (rows, key) => Array.from(new Set(rows.map((row) => row[key]).filter(Boolean)))
const formatDate = (value) => String(value || '—').slice(0, 16)
const sumRows = (rows, key) => rows.reduce((sum, row) => sum + Number(row[key] || 0), 0)

function auditStateOf(bill) {
  if (bill.state === '审核退回') return '审核退回'
  if (['待审核', '待提交'].includes(bill.state)) return '待审核'
  if (bill.reviewer && bill.reviewer !== '—') return '已审核'
  return '待审核'
}

function buildRows(data) {
  return data.bills
    .filter((bill) => ['团队佣金', '独立单线佣金'].includes(bill.type))
    .map((bill) => {
      const agent = data.agents.find((item) => item.account === bill.payee) || {}
      const team = data.teams.find((item) => item.id === bill.unitId || item.name === bill.unitName)
      const isNegativeMode = agent.model === '负盈利模式' || Number(bill.correctedNet || 0) < 0
      if (!isNegativeMode) return null
      return {
        id: bill.id,
        index: 0,
        cycle: bill.cycle,
        teamName: bill.unitName || team?.name || agent.unit || '—',
        agentId: agent.id || bill.agentId || '—',
        agentAccount: bill.payee,
        teamType: bill.teamType || team?.teamType || (bill.type === '独立单线佣金' ? '独立单线' : '—'),
        parentAccount: agent.parent || bill.recommender || '—',
        teamMembers: bill.teamMembers ?? team?.lines?.length ?? (bill.type === '独立单线佣金' ? 1 : 0),
        subAgentCount: bill.subAgentCount ?? agent.subAgents ?? 0,
        registeredCount: bill.registeredCount ?? agent.members ?? 0,
        firstDepositCount: bill.firstDepositCount ?? 0,
        activeCount: bill.activeCount ?? agent.activeMembers ?? 0,
        newActiveCount: bill.newActiveCount ?? agent.newActiveMembers ?? 0,
        depositAmount: bill.depositAmount ?? agent.depositAmount ?? 0,
        withdrawalAmount: bill.withdrawalAmount ?? agent.withdrawalAmount ?? 0,
        totalWinLoss: bill.totalWinLoss ?? agent.totalWinLoss ?? 0,
        venueFee: bill.venueFee ?? 0,
        memberBonus: bill.memberBonus ?? 0,
        memberRebate: bill.memberRebate ?? 0,
        accountAdjustment: bill.accountAdjustment ?? 0,
        depositFee: bill.depositFee ?? 0,
        withdrawalFee: bill.withdrawalFee ?? 0,
        manualOrderWinLoss: bill.manualOrderWinLoss ?? 0,
        netWinLossRaw: bill.netWinLossRaw ?? 0,
        lastBalance: bill.lastBalance ?? 0,
        correctedNet: bill.correctedNet ?? 0,
        rate: bill.rate ?? 0,
        commissionAdjustment: bill.commissionAdjustment ?? 0,
        commission: bill.payable ?? 0,
        commissionState: bill.state || '待审核',
        becameAgentAt: formatDate(bill.becameAgentAt || agent.registeredAt),
        joinedAt: formatDate(team?.joinedAt || agent.effectiveCycle || bill.createdAt),
        issuedBy: bill.issuedBy || '—',
        issuedAt: formatDate(bill.issuedAt),
        reviewer: bill.reviewer || '—',
        reviewedAt: formatDate(bill.reviewedAt),
        auditState: auditStateOf(bill),
        maintainer: bill.maintainer || agent.developer || team?.developer || '—',
        adjustmentReason: bill.adjustmentReason || (Number(bill.commissionAdjustment || 0) ? '佣金调整' : '—'),
      }
    })
    .filter(Boolean)
    .map((row, index) => ({ ...row, index: index + 1 }))
}

function FieldColumnFilter({ columns, visibleKeys, onChange }) {
  const [open, setOpen] = useState(false)
  const toggleKey = (key) => {
    const next = visibleKeys.includes(key) ? visibleKeys.filter((item) => item !== key) : [...visibleKeys, key]
    if (next.length) onChange(next)
  }
  const selectedText = visibleKeys.length === columns.length ? '全部字段' : `已选 ${visibleKeys.length}/${columns.length}`

  return <div className="negative-field-filter">
    <button type="button" className="negative-field-filter-trigger" onClick={() => setOpen((value) => !value)}>
      <span>{selectedText}</span><DownOutlined />
    </button>
    {open && <div className="negative-field-filter-menu">
      <header><span>选择明细字段</span><div><button type="button" onClick={() => onChange(ALL_KEYS)}>全选</button><button type="button" onClick={() => onChange(['index'])}>仅序号</button></div></header>
      <div className="negative-field-filter-options">
        {columns.map((column) => <label key={column.key}>
          <input type="checkbox" checked={visibleKeys.includes(column.key)} onChange={() => toggleKey(column.key)} />
          <span>{column.label}</span>
        </label>)}
      </div>
    </div>}
  </div>
}

function renderTotalCell(column, rows) {
  if (column.key === 'index') return <b>总计</b>
  if (column.key === 'cycle') return <span>当前筛选 {rows.length} 条</span>
  if (COUNT_KEY_SET.has(column.key)) return <b>{sumRows(rows, column.key)}</b>
  if (MONEY_KEYS.includes(column.key)) return <Money value={sumRows(rows, column.key)} signed={SIGNED_MONEY_KEYS.has(column.key)} />
  return <span className="negative-total-muted">—</span>
}

function NegativeReportTotalRow({ columns, rows }) {
  return <tr className="negative-profit-total-row">
    {columns.map((column) => <td key={column.key}>{renderTotalCell(column, rows)}</td>)}
  </tr>
}

export function NegativeProfitReportPage({ onToast }) {
  const { data } = useTeamAgent()
  const allRows = useMemo(() => buildRows(data), [data])
  const [filters, setFilters] = useState(FILTER_DEFAULTS)
  const [visibleKeys, setVisibleKeys] = useState(ALL_KEYS)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const rows = allRows.filter((row) => (!filters.cycle || row.cycle === filters.cycle)
    && (!filters.teamType || row.teamType === filters.teamType)
    && (!filters.commissionState || row.commissionState === filters.commissionState)
    && (!filters.auditState || row.auditState === filters.auditState)
    && (!filters.keyword || `${row.teamName}${row.agentId}${row.agentAccount}${row.parentAccount}`.toLowerCase().includes(filters.keyword.toLowerCase())))
  const columns = COLUMN_DEFS
    .filter((column) => visibleKeys.includes(column.key))
    .map((column) => ({
      ...column,
      render: (value) => {
        if (MONEY_KEYS.includes(column.key)) return <Money value={value} signed={['totalWinLoss', 'accountAdjustment', 'manualOrderWinLoss', 'netWinLossRaw', 'lastBalance', 'correctedNet', 'commissionAdjustment'].includes(column.key)} />
        if (column.key === 'rate') return <Percent value={value} />
        if (column.key === 'commissionState') return <StatusTag>{value}</StatusTag>
        if (column.key === 'auditState') return <StatusTag>{value}</StatusTag>
        if (column.key === 'agentAccount') return <b className="ta-primary-text">{value}</b>
        return value
      },
    }))
  const tableMinWidth = Math.max(1480, columns.length * 118)
  const resetFilters = () => {
    setFilters(FILTER_DEFAULTS)
    setVisibleKeys(ALL_KEYS)
  }

  return <section className="ta-stack negative-profit-report-screen">
    <SectionHeader title="负盈利代理报表" description="按佣金周期汇总负盈利模式代理及负向结余账单，集中核对人数、收支、成本、结余、佣金和审核发放信息。" actions={<Toolbar><Button icon={<DownloadOutlined />} variant="slate" onClick={() => onToast(`负盈利代理报表已导出 ${rows.length} 条`)}>导出</Button><Button icon={<FolderOpenOutlined />} variant="ghost" onClick={() => onToast('负盈利代理报表文件已下载')}>下载文件</Button></Toolbar>} />
    <FilterBar onSearch={() => onToast(`已查询 ${rows.length} 条负盈利代理记录`)} onReset={resetFilters}>
      <Field label="佣金周期"><Select value={filters.cycle} onChange={(value) => setFilter('cycle', value)} placeholder="全部周期" options={unique(allRows, 'cycle')} /></Field>
      <Field label="团队类型"><Select value={filters.teamType} onChange={(value) => setFilter('teamType', value)} placeholder="全部类型" options={unique(allRows, 'teamType')} /></Field>
      <Field label="佣金状态"><Select value={filters.commissionState} onChange={(value) => setFilter('commissionState', value)} placeholder="全部状态" options={unique(allRows, 'commissionState')} /></Field>
      <Field label="审核状态"><Select value={filters.auditState} onChange={(value) => setFilter('auditState', value)} placeholder="全部状态" options={unique(allRows, 'auditState')} /></Field>
      <Field label="字段筛选"><FieldColumnFilter columns={COLUMN_DEFS} visibleKeys={visibleKeys} onChange={setVisibleKeys} /></Field>
      <Field label="代理/团队"><Input value={filters.keyword} onChange={(value) => setFilter('keyword', value)} placeholder="代理账号、编号、团队或上级" /></Field>
    </FilterBar>
    <Panel title="负盈利代理明细" description="字段较多时可通过字段筛选多选需要展示的明细字段。">
      <DataTable className="negative-profit-report-table" minWidth={tableMinWidth} columns={columns} rows={rows} paginated footer={<NegativeReportTotalRow columns={columns} rows={rows} />} />
    </Panel>
    <FormulaPanel title="负盈利代理报表口径" items={[
      { label: '净输赢', formula: '总输赢 - 场馆费 - 红利 - 返水 + 账户调整 - 存款手续费 - 提款手续费 + 补单输赢' },
      { label: '冲正后净输赢', formula: '净输赢 + 上月结余' },
      { label: '佣金', formula: 'MAX(0，冲正后净输赢 × 佣金比例 + 佣金调整)' },
    ]} warning="报表展示负盈利模式代理及冲正后净输赢为负的账单记录；刷新演示数据后恢复初始模拟数据。" />
  </section>
}
