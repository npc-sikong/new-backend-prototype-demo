import { useMemo, useState } from 'react'
import {
  Alert,
  DataTable,
  DescriptionGrid,
  Field,
  FilterBar,
  Input,
  Modal,
  Money,
  Pagination,
  SectionHeader,
  Select,
  StatusTag,
} from './team-agent/ui'

const INITIAL_FILTERS = {
  site: '',
  agent: '',
  member: '',
}

const MEMBER_TURNOVER_ROWS = [
  {
    id: 'M10086',
    site: '旺财体育',
    agent: 'gaodashang',
    member: 'member_10086',
    currency: 'CNY',
    rechargeAmount: 50000,
    totalBalance: 74528.5,
    withdrawableBalance: 64152.5,
    lockedBalance: 10376,
    requiredTurnover: 31320,
    status: '进行中',
    attribution: '指定场馆',
    lastRechargeAt: '2026-07-14 18:32',
    lastSyncAt: '2026-07-14 21:20',
    details: [
      { id: 'AG', venue: 'AG真人', mode: '可归因', lockedAmount: 3600, targetTurnover: 26900, confirmedTurnover: 14400, pendingTurnover: 0, remainingTurnover: 12500, status: '进行中' },
      { id: 'PG', venue: 'PG电子', mode: '可归因', lockedAmount: 2850, targetTurnover: 17400, confirmedTurnover: 8750, pendingTurnover: 0, remainingTurnover: 8650, status: '进行中' },
      { id: 'SPORT', venue: '体育投注', mode: '可归因', lockedAmount: 3926, targetTurnover: 20950, confirmedTurnover: 10780, pendingTurnover: 0, remainingTurnover: 10170, status: '进行中' },
    ],
  },
  {
    id: 'M10087',
    site: '旺财体育',
    agent: 'WC002',
    member: 'wc_member02',
    currency: 'CNY',
    rechargeAmount: 30000,
    totalBalance: 26400,
    withdrawableBalance: 20400,
    lockedBalance: 6000,
    requiredTurnover: 15000,
    status: '进行中',
    attribution: '通用归集',
    lastRechargeAt: '2026-07-14 16:05',
    lastSyncAt: '2026-07-14 21:18',
    details: [
      { id: 'GENERAL-01', venue: '通用', mode: '不可归因·FIFO', lockedAmount: 6000, targetTurnover: 33000, confirmedTurnover: 18000, pendingTurnover: 0, remainingTurnover: 15000, status: '进行中' },
    ],
  },
  {
    id: 'M10088',
    site: '旺财体育',
    agent: 'gaodashang',
    member: 'vip_8821',
    currency: 'CNY',
    rechargeAmount: 18000,
    totalBalance: 20000,
    withdrawableBalance: 12800,
    lockedBalance: 7200,
    requiredTurnover: 9000,
    status: '进行中',
    attribution: '场馆+通用',
    lastRechargeAt: '2026-07-13 22:18',
    lastSyncAt: '2026-07-14 21:16',
    details: [
      { id: 'AG-02', venue: 'AG真人', mode: '可归因', lockedAmount: 4200, targetTurnover: 16800, confirmedTurnover: 12000, pendingTurnover: 0, remainingTurnover: 4800, status: '进行中' },
      { id: 'GENERAL-02', venue: '通用', mode: '平台流水', lockedAmount: 3000, targetTurnover: 12000, confirmedTurnover: 7800, pendingTurnover: 0, remainingTurnover: 4200, status: '进行中' },
    ],
  },
  {
    id: 'M10089',
    site: '旺财体育',
    agent: 'LGNB',
    member: 'lgnb_5908',
    currency: 'CNY',
    rechargeAmount: 12000,
    totalBalance: 14850,
    withdrawableBalance: 11650,
    lockedBalance: 3200,
    requiredTurnover: 10000,
    status: '待确认',
    attribution: '延迟归因',
    lastRechargeAt: '2026-07-14 19:47',
    lastSyncAt: '2026-07-14 20:52',
    details: [
      { id: 'EVO', venue: 'EVO真人', mode: '延迟归因', lockedAmount: 3200, targetTurnover: 12800, confirmedTurnover: 2800, pendingTurnover: 1600, remainingTurnover: 10000, status: '待确认' },
    ],
  },
  {
    id: 'M10090',
    site: '旺财体育',
    agent: 'dailiwc001',
    member: 'single_0201',
    currency: 'CNY',
    rechargeAmount: 26000,
    totalBalance: 31560,
    withdrawableBalance: 31560,
    lockedBalance: 0,
    requiredTurnover: 0,
    status: '已完成',
    attribution: '指定场馆',
    lastRechargeAt: '2026-07-12 13:21',
    lastSyncAt: '2026-07-14 21:08',
    details: [
      { id: 'SPORT-02', venue: '体育投注', mode: '可归因', lockedAmount: 0, targetTurnover: 18000, confirmedTurnover: 18000, pendingTurnover: 0, remainingTurnover: 0, status: '已完成' },
    ],
  },
  {
    id: 'M10091',
    site: '财神客栈',
    agent: 'FEE0428_A8',
    member: 'fee_member8',
    currency: 'CNY',
    rechargeAmount: 80000,
    totalBalance: 92600,
    withdrawableBalance: 80600,
    lockedBalance: 12000,
    requiredTurnover: 28000,
    status: '进行中',
    attribution: '通用归集',
    lastRechargeAt: '2026-07-14 11:40',
    lastSyncAt: '2026-07-14 21:15',
    details: [
      { id: 'GENERAL-03', venue: '通用', mode: '不可归因·FIFO', lockedAmount: 12000, targetTurnover: 60000, confirmedTurnover: 32000, pendingTurnover: 0, remainingTurnover: 28000, status: '进行中' },
    ],
  },
  {
    id: 'M10092',
    site: '财神客栈',
    agent: 'NA7',
    member: 'na7_player',
    currency: 'CNY',
    rechargeAmount: 10000,
    totalBalance: 7800,
    withdrawableBalance: 5300,
    lockedBalance: 2500,
    requiredTurnover: 6800,
    status: '即将到期',
    attribution: '指定场馆',
    lastRechargeAt: '2026-07-09 09:22',
    lastSyncAt: '2026-07-14 21:02',
    details: [
      { id: 'JDB', venue: 'JDB电子', mode: '可归因', lockedAmount: 2500, targetTurnover: 10000, confirmedTurnover: 3200, pendingTurnover: 0, remainingTurnover: 6800, status: '即将到期' },
    ],
  },
  {
    id: 'M10093',
    site: '旺财体育',
    agent: 'WC002',
    member: 'wc_member19',
    currency: 'CNY',
    rechargeAmount: 45000,
    totalBalance: 51280,
    withdrawableBalance: 44980,
    lockedBalance: 6300,
    requiredTurnover: 17400,
    status: '进行中',
    attribution: '指定场馆',
    lastRechargeAt: '2026-07-14 08:13',
    lastSyncAt: '2026-07-14 21:19',
    details: [
      { id: 'PG-03', venue: 'PG电子', mode: '可归因', lockedAmount: 4100, targetTurnover: 20500, confirmedTurnover: 9100, pendingTurnover: 0, remainingTurnover: 11400, status: '进行中' },
      { id: 'SPORT-03', venue: '体育投注', mode: '可归因', lockedAmount: 2200, targetTurnover: 8800, confirmedTurnover: 2800, pendingTurnover: 0, remainingTurnover: 6000, status: '进行中' },
    ],
  },
]

const RECHARGE_TURNOVER_DETAILS = {
  M10086: [
    { id: 'M10086-R1', sequence: 1, type: '充值', rechargeAt: '2026-07-13 10:18', rechargeAmount: 30000, targetTurnover: 30000, confirmedTurnover: 30000, requiredTurnover: 0, status: '已完成' },
    { id: 'M10086-B1', sequence: 2, type: '系统发放彩金', rechargeAt: '2026-07-13 10:19', rechargeAmount: 1000, targetTurnover: 1000, confirmedTurnover: 1000, requiredTurnover: 0, status: '已完成' },
    { id: 'M10086-R2', sequence: 3, type: '充值', rechargeAt: '2026-07-14 18:32', rechargeAmount: 20000, targetTurnover: 30000, confirmedTurnover: 0, requiredTurnover: 30000, status: '进行中' },
    { id: 'M10086-B2', sequence: 4, type: '系统发放彩金', rechargeAt: '2026-07-14 18:34', rechargeAmount: 1000, targetTurnover: 1320, confirmedTurnover: 0, requiredTurnover: 1320, status: '待解锁' },
  ],
  M10087: [
    { id: 'M10087-R1', sequence: 1, type: '充值', rechargeAt: '2026-07-13 15:26', rechargeAmount: 18000, targetTurnover: 18000, confirmedTurnover: 9000, requiredTurnover: 9000, status: '进行中' },
    { id: 'M10087-R2', sequence: 2, type: '充值', rechargeAt: '2026-07-14 16:05', rechargeAmount: 12000, targetTurnover: 12000, confirmedTurnover: 6000, requiredTurnover: 6000, status: '进行中' },
  ],
  M10088: [
    { id: 'M10088-R1', sequence: 1, type: '充值', rechargeAt: '2026-07-13 17:42', rechargeAmount: 10000, targetTurnover: 10000, confirmedTurnover: 4800, requiredTurnover: 5200, status: '进行中' },
    { id: 'M10088-R2', sequence: 2, type: '充值', rechargeAt: '2026-07-13 22:18', rechargeAmount: 8000, targetTurnover: 8000, confirmedTurnover: 4200, requiredTurnover: 3800, status: '进行中' },
  ],
  M10089: [
    { id: 'M10089-R1', sequence: 1, type: '充值', rechargeAt: '2026-07-14 19:47', rechargeAmount: 12000, targetTurnover: 12000, confirmedTurnover: 2000, requiredTurnover: 10000, status: '待确认' },
  ],
  M10090: [
    { id: 'M10090-R1', sequence: 1, type: '充值', rechargeAt: '2026-07-11 12:36', rechargeAmount: 16000, targetTurnover: 16000, confirmedTurnover: 16000, requiredTurnover: 0, status: '已完成' },
    { id: 'M10090-R2', sequence: 2, type: '充值', rechargeAt: '2026-07-12 13:21', rechargeAmount: 10000, targetTurnover: 10000, confirmedTurnover: 10000, requiredTurnover: 0, status: '已完成' },
  ],
  M10091: [
    { id: 'M10091-R1', sequence: 1, type: '充值', rechargeAt: '2026-07-13 09:05', rechargeAmount: 50000, targetTurnover: 50000, confirmedTurnover: 33000, requiredTurnover: 17000, status: '进行中' },
    { id: 'M10091-R2', sequence: 2, type: '充值', rechargeAt: '2026-07-14 11:40', rechargeAmount: 30000, targetTurnover: 30000, confirmedTurnover: 19000, requiredTurnover: 11000, status: '进行中' },
  ],
  M10092: [
    { id: 'M10092-R1', sequence: 1, type: '充值', rechargeAt: '2026-07-09 09:22', rechargeAmount: 10000, targetTurnover: 10000, confirmedTurnover: 3200, requiredTurnover: 6800, status: '即将到期' },
  ],
  M10093: [
    { id: 'M10093-R1', sequence: 1, type: '充值', rechargeAt: '2026-07-13 21:04', rechargeAmount: 25000, targetTurnover: 25000, confirmedTurnover: 15000, requiredTurnover: 10000, status: '进行中' },
    { id: 'M10093-R2', sequence: 2, type: '充值', rechargeAt: '2026-07-14 08:13', rechargeAmount: 20000, targetTurnover: 20000, confirmedTurnover: 12600, requiredTurnover: 7400, status: '进行中' },
  ],
}

const MEMBER_TURNOVER_DATA = MEMBER_TURNOVER_ROWS.map((row) => {
  const rechargeDetails = RECHARGE_TURNOVER_DETAILS[row.id] || []
  const rechargeCycleAmount = rechargeDetails.reduce((total, item) => total + item.rechargeAmount, 0)
  const rechargeRequiredTurnover = rechargeDetails.reduce((total, item) => total + item.requiredTurnover, 0)
  const profitUnlockAmount = Math.max(0, row.totalBalance - rechargeCycleAmount)
  return {
    ...row,
    rechargeDetails,
    rechargeRequiredTurnover,
    profitUnlockAmount,
    profitUnlockStatus: profitUnlockAmount <= 0 ? '亏损无额度' : rechargeRequiredTurnover > 0 ? '待本轮全部完成' : '可领取',
  }
})

function matchesText(value, keyword) {
  return String(value).toLowerCase().includes(String(keyword).trim().toLowerCase())
}

function MemberCell({ row }) {
  return <div className="member-account-cell"><strong>{row.member}</strong><small>会员ID：{row.id}</small></div>
}

function ProfitUnlockCell({ amount, status }) {
  if (amount <= 0) return <span className="profit-unlock-empty">亏损无额度</span>
  return <div className="profit-unlock-cell"><Money value={amount} tone={status === '可领取' ? 'positive' : 'neutral'} /><small>{status}</small></div>
}

function TurnoverDetailModal({ member, onClose }) {
  if (!member) return null
  return <Modal
    open
    title="场馆提现流水明细"
    description={`${member.member} · ${member.site} · 统计截至 ${member.lastSyncAt}`}
    width={940}
    onClose={onClose}
    onConfirm={onClose}
    confirmText="关闭"
    showCancel={false}
  >
    <div className="member-turnover-modal">
      <DescriptionGrid columns={4} items={[
        { label: '会员账号', value: member.member },
        { label: '锁定余额', value: <Money value={member.lockedBalance} /> },
        { label: '场馆提现流水', value: <Money value={member.requiredTurnover} tone="positive" /> },
        { label: '当前状态', value: <StatusTag>{member.status}</StatusTag> },
      ]} />
      <DataTable
        rows={member.details}
        rowKey="id"
        minWidth={860}
        columns={[
          { key: 'venue', label: '场馆', render: (value) => <strong className="member-venue-name">{value}</strong> },
          { key: 'mode', label: '归因方式', render: (value) => <StatusTag tone={value.includes('不可归因') || value === '平台流水' ? 'orange' : value === '延迟归因' ? 'gray' : 'blue'}>{value}</StatusTag> },
          { key: 'lockedAmount', label: '锁定额度', render: (value) => <Money value={value} /> },
          { key: 'targetTurnover', label: '目标流水', render: (value) => <Money value={value} /> },
          { key: 'confirmedTurnover', label: '已完成有效流水', render: (value) => <Money value={value} /> },
          { key: 'pendingTurnover', label: '待确认流水', render: (value) => <Money value={value} /> },
          { key: 'remainingTurnover', label: '还需解锁流水', render: (value) => <Money value={value} tone={value > 0 ? 'positive' : 'neutral'} /> },
          { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
        ]}
      />
      <Alert title="统计口径">
        单项还需解锁流水 = MAX（0，目标流水 − 已完成有效流水）；总场馆提现流水 = 各场馆及“通用”任务还需解锁流水之和。待确认流水仅展示进度，不提前计入已完成流水或释放锁定余额。
      </Alert>
    </div>
  </Modal>
}

function RechargeTurnoverDetailModal({ member, onClose }) {
  if (!member) return null
  const rechargeTotal = member.rechargeDetails.filter((item) => item.type === '充值').reduce((total, item) => total + item.rechargeAmount, 0)
  const systemBonusTotal = member.rechargeDetails.filter((item) => item.type === '系统发放彩金').reduce((total, item) => total + item.rechargeAmount, 0)
  return <Modal
    open
    title="充值提现流水明细"
    description={`${member.member} · ${member.site} · 充值与系统发放彩金均按发生顺序 FIFO 解锁`}
    width={1040}
    onClose={onClose}
    onConfirm={onClose}
    confirmText="关闭"
    showCancel={false}
  >
    <div className="member-turnover-modal recharge-turnover-modal">
      <DescriptionGrid columns={5} items={[
        { label: '会员账号', value: member.member },
        { label: '流水记录', value: `${member.rechargeDetails.length} 笔（充值 / 系统发放彩金）` },
        { label: '计入额度', value: <><Money value={rechargeTotal} /> / <Money value={systemBonusTotal} /></> },
        { label: '还需解锁流水', value: <Money value={member.rechargeRequiredTurnover} tone="positive" /> },
        { label: '盈利解锁额度', value: <ProfitUnlockCell amount={member.profitUnlockAmount} status={member.profitUnlockStatus} /> },
      ]} />
      <DataTable
        rows={member.rechargeDetails}
        rowKey="id"
        minWidth={940}
        columns={[
          { key: 'sequence', label: '顺序' },
          { key: 'type', label: '类型', render: (value) => <StatusTag tone={value === '系统发放彩金' ? 'orange' : 'blue'}>{value}</StatusTag> },
          { key: 'rechargeAt', label: '发生时间' },
          { key: 'rechargeAmount', label: '计入额度', render: (value) => <Money value={value} /> },
          { key: 'targetTurnover', label: '目标流水', render: (value) => <Money value={value} /> },
          { key: 'confirmedTurnover', label: '已完成流水', render: (value) => <Money value={value} /> },
          { key: 'requiredTurnover', label: '还需解锁流水', render: (value) => <Money value={value} tone={value > 0 ? 'positive' : 'neutral'} /> },
          { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
        ]}
      />
      <Alert title="统计口径">
        成功充值与系统发放彩金均视为充值行为，独立建立流水记录，无需关联充值订单；按发生时间 FIFO 解锁，前一笔未完成时不得跳过。充值提现流水 = 当前周期内各笔记录还需解锁流水之和；有效投注确认后同步更新，盈利解锁额度仅在用户盈利时展示，需本轮全部充值流水完成后才可领取。
      </Alert>
    </div>
  </Modal>
}

export function MemberTurnoverPage({ onToast }) {
  const [draftFilters, setDraftFilters] = useState(INITIAL_FILTERS)
  const [filters, setFilters] = useState(INITIAL_FILTERS)
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedRechargeMember, setSelectedRechargeMember] = useState(null)

  const rows = useMemo(() => MEMBER_TURNOVER_DATA.filter((row) => {
    if (filters.site && row.site !== filters.site) return false
    if (filters.agent && !matchesText(row.agent, filters.agent)) return false
    if (filters.member && !matchesText(`${row.member} ${row.id}`, filters.member)) return false
    return true
  }), [filters])

  function updateDraft(key, value) {
    setDraftFilters((current) => ({ ...current, [key]: value }))
  }

  function search() {
    setFilters(draftFilters)
    const resultCount = MEMBER_TURNOVER_DATA.filter((row) => {
      if (draftFilters.site && row.site !== draftFilters.site) return false
      if (draftFilters.agent && !matchesText(row.agent, draftFilters.agent)) return false
      if (draftFilters.member && !matchesText(`${row.member} ${row.id}`, draftFilters.member)) return false
      return true
    }).length
    onToast?.(`查询完成，共 ${resultCount} 条会员流水记录`)
  }

  function reset() {
    setDraftFilters(INITIAL_FILTERS)
    setFilters(INITIAL_FILTERS)
    onToast?.('筛选条件已重置')
  }

  return <div className="member-turnover-page">
    <SectionHeader
      title="会员打码流水统计表"
      description="集中查看会员余额、提现资格及场馆或充值行为流水；本页只做统计查询与明细说明。"
    />
    <FilterBar onSearch={search} onReset={reset} onExport={() => onToast?.(`已生成当前 ${rows.length} 条统计数据的导出演示`)}>
      <Field label="站点">
        <Select value={draftFilters.site} onChange={(value) => updateDraft('site', value)} placeholder="全部站点" options={['旺财体育', '财神客栈']} />
      </Field>
      <Field label="代理账号">
        <Input value={draftFilters.agent} onChange={(value) => updateDraft('agent', value)} placeholder="请输入代理账号" />
      </Field>
      <Field label="会员账号 / ID">
        <Input value={draftFilters.member} onChange={(value) => updateDraft('member', value)} placeholder="请输入会员账号或ID" />
      </Field>
    </FilterBar>
    <Alert title="金额与流水口径">
      总余额 = 可提现余额 + 锁定余额；场馆提现流水为各场馆及“通用”未完成任务的剩余流水合计。充值提现流水将成功充值与系统发放彩金均作为独立记录，按发生顺序 FIFO 统计还需解锁流水；有效投注确认后锁定额度同步更新，盈利解锁额度仅在用户盈利时展示，并需本轮全部充值流水完成后可领取。
    </Alert>
    <DataTable
      rows={rows}
      rowKey="id"
      minWidth={1800}
      className="member-turnover-table"
      columns={[
        { key: 'site', label: '站点' },
        { key: 'agent', label: '代理' },
        { key: 'member', label: '会员', render: (_, row) => <MemberCell row={row} /> },
        { key: 'currency', label: '币种' },
        { key: 'rechargeAmount', label: '充值额度', render: (value) => <Money value={value} /> },
        { key: 'totalBalance', label: '总余额', render: (value) => <Money value={value} /> },
        { key: 'withdrawableBalance', label: '可提现余额', render: (value) => <Money value={value} tone="positive" /> },
        { key: 'lockedBalance', label: '锁定余额', render: (value) => <Money value={value} /> },
        { key: 'requiredTurnover', label: '场馆提现流水', render: (value, row) => <button className="ta-table-link member-turnover-link" onClick={() => setSelectedMember(row)}><Money value={value} tone={value > 0 ? 'positive' : 'neutral'} /><span>查看明细</span></button> },
        { key: 'rechargeRequiredTurnover', label: '充值提现流水', render: (value, row) => <button className="ta-table-link member-turnover-link" onClick={() => setSelectedRechargeMember(row)}><Money value={value} tone={value > 0 ? 'positive' : 'neutral'} /><span>查看明细</span></button> },
        { key: 'profitUnlockAmount', label: '盈利解锁额度', render: (value, row) => <ProfitUnlockCell amount={value} status={row.profitUnlockStatus} /> },
        { key: 'lastRechargeAt', label: '最近充值时间' },
        { key: 'lastSyncAt', label: '最近统计时间' },
      ]}
    />
    <Pagination total={rows.length} />
    <TurnoverDetailModal member={selectedMember} onClose={() => setSelectedMember(null)} />
    <RechargeTurnoverDetailModal member={selectedRechargeMember} onClose={() => setSelectedRechargeMember(null)} />
  </div>
}
