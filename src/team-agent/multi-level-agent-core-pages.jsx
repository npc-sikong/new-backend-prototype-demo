import { useMemo, useState } from 'react'
import {
  BankOutlined,
  GiftOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
  SwapOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import avatarUrl from '../assets/multi-level-agent-avatar.png'
import { useTeamAgent } from './context'
import { AGENT_ROLE_PROFILES, DASHBOARD_GROUPS } from './multi-level-agent-data'
import { Alert, Button, DataTable, Field, FormGrid, Input, Modal, StatusTag, Tabs } from './ui'

const toneClass = (tone) => `ml-tone-${tone || 'default'}`

const DASHBOARD_ROLE_ACCOUNTS = { main: 'gaodashang', secondary: 'WC002', independent: 'dailiwc001' }

function dashboardGroupsForRole(data, role) {
  if (role === 'multiLevel') return DASHBOARD_GROUPS
  const account = DASHBOARD_ROLE_ACCOUNTS[role]
  const agent = data.agents.find((item) => item.account === account)
  if (!agent) return DASHBOARD_GROUPS
  const bill = data.bills.find((item) => item.payee === account && item.cycle === '2026-07')
  const pendingWithdrawal = data.withdrawals
    .filter((item) => item.account === account && ['待审核', '处理中'].includes(item.status))
    .reduce((sum, item) => sum + Number(item.actualAmountCny || 0), 0)
  const activeAgents = Math.max(1, Number(agent.subAgents || 0) + 1)
  const members = Number(agent.members || bill?.registeredCount || 0)
  const activeMembers = Number(agent.activeMembers || bill?.activeCount || 0)
  const values = {
    '本期佣金预估/净收益': Number(bill?.payable || 0),
    '当前余额': Number(agent.balance || 0),
    '提现中佣金': pendingWithdrawal,
    '已结算佣金': Number(bill?.issued || 0),
    '总充值': Number(agent.depositAmount || 0),
    '总提现': Number(agent.withdrawalAmount || 0),
    '总投注': Number(agent.validBetting || 0),
    '有效投注': Number(agent.validBetting || 0),
    '总盈亏': Number(agent.totalWinLoss || 0),
    '代理总人数': activeAgents,
    '新增代理': 0,
    '活跃代理': activeAgents,
    '会员总数': members,
    '新增会员': 0,
    '活跃会员': activeMembers,
    '付费会员': Number(bill?.firstDepositCount || 0),
    '新增付费': Number(bill?.firstDepositCount || 0),
    '代理推广会员': 0,
    '会员推广会员': 0,
    '30天未登录会员': Math.max(0, members - activeMembers),
  }
  const moneyLabels = new Set(['本期佣金预估/净收益', '当前余额', '提现中佣金', '已结算佣金', '总充值', '总提现', '总投注', '有效投注', '总盈亏'])
  return DASHBOARD_GROUPS.map((group) => ({
    ...group,
    items: group.items.map((item) => values[item.label] === undefined ? item : {
      ...item,
      value: moneyLabels.has(item.label) ? `¥${values[item.label].toLocaleString('zh-CN', { maximumFractionDigits: 2 })}` : String(values[item.label]),
      note: item.label === '有效投注' ? '占比 100%' : item.label === '活跃代理' ? '活跃率 100.0%' : item.note,
    }),
  }))
}

export function MultiLevelDashboardPage({ role = 'multiLevel', onToast }) {
  const { data } = useTeamAgent()
  const [period, setPeriod] = useState('2026-07-21')
  const groups = useMemo(() => dashboardGroupsForRole(data, role), [data, role])
  const scopeLabel = role === 'main' ? '当前团队' : role === 'secondary' ? '当前副线' : role === 'independent' ? '当前单线' : '当前多层级代理授权下级'
  return <section className="ml-screen ml-dashboard-screen">
    <div className="ml-screen-toolbar"><div className="ml-compact-tabs"><button className="active">代理数据看板</button><button onClick={() => onToast('数据筛选项已打开')}>数据筛选⌄</button></div><Input type="date" value={period} onChange={setPeriod} /></div>
    <Alert title="数据说明">这里展示{scopeLabel}范围内的代理、一般为累计数据，只有在代理新增数据时会每天更新；不建议通过日期筛选来更新，白底卡片数据会根据日期筛选范围同步变化。</Alert>
    {groups.map((group) => <section className="ml-dashboard-group" key={group.title}>
      <h2>{group.title}</h2>
      <div className="ml-dashboard-grid" style={{ '--ml-columns': group.columns }}>
        {group.items.map((item) => <article className={`ml-dashboard-card ${toneClass(item.tone)}`} key={item.label}>
          <div><span>{item.label}</span><i>?</i></div><strong>{item.value}</strong>
          <footer><small>{item.helper || '较上周期'}</small>{item.note && <em>{item.note}</em>}{item.link && <button onClick={() => onToast(`${item.label}明细已打开`)}>{item.link}</button>}</footer>
        </article>)}
      </div>
    </section>)}
  </section>
}

const PROFILE_TABS = [
  { value: 'basic', label: '基本资料' },
  { value: 'password', label: '修改密码' },
  { value: 'security', label: '安全设置' },
]

export function MultiLevelProfilePage({ role = 'multiLevel', onToast }) {
  const profile = AGENT_ROLE_PROFILES[role] || AGENT_ROLE_PROFILES.multiLevel
  const [tab, setTab] = useState('basic')
  const [form, setForm] = useState({ nickname: profile.account, phone: profile.phone, email: profile.email, gender: '男', oldPassword: '', newPassword: '', confirmPassword: '' })
  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  return <section className="ml-screen ml-profile-layout">
    <article className="ml-card ml-profile-card"><header><h2>个人信息</h2></header><div className="ml-profile-avatar"><img src={avatarUrl} alt={`${profile.roleLabel}演示头像`} /></div><dl>
      <div><dt><UserOutlined />用户名称</dt><dd>{profile.account}</dd></div>
      <div><dt><SafetyCertificateOutlined />所属角色</dt><dd>{profile.roleLabel}</dd></div>
      <div><dt>推广码</dt><dd>{profile.promotionCode}</dd></div>
      <div><dt>创建日期</dt><dd>{profile.createdAt}</dd></div>
      <div><dt>App下载链接</dt><dd>未配置 <button onClick={() => onToast('复制入口已触发')}>复制</button></dd></div>
    </dl></article>
    <article className="ml-card ml-profile-form-card"><header><h2>基本资料</h2></header><Tabs items={PROFILE_TABS} active={tab} onChange={setTab} />
      {tab === 'basic' && <FormGrid columns={1}><Field label="用户昵称" required><Input value={form.nickname} onChange={(value) => update('nickname', value)} /></Field><Field label="手机号码" required><Input value={form.phone} onChange={(value) => update('phone', value)} /></Field><Field label="邮箱" required><Input value={form.email} onChange={(value) => update('email', value)} /></Field><Field label="性别"><div className="ml-radio-row">{['男', '女'].map((item) => <label key={item}><input type="radio" checked={form.gender === item} onChange={() => update('gender', item)} />{item}</label>)}</div></Field></FormGrid>}
      {tab === 'password' && <FormGrid columns={1}><Field label="当前密码" required><Input type="password" value={form.oldPassword} onChange={(value) => update('oldPassword', value)} /></Field><Field label="新密码" required><Input type="password" value={form.newPassword} onChange={(value) => update('newPassword', value)} /></Field><Field label="确认新密码" required><Input type="password" value={form.confirmPassword} onChange={(value) => update('confirmPassword', value)} /></Field></FormGrid>}
      {tab === 'security' && <div className="ml-security-list"><div><LockOutlined /><span><b>登录密码</b><small>建议定期更换密码，保护账号安全。</small></span><StatusTag>已设置</StatusTag></div><div><SafetyCertificateOutlined /><span><b>谷歌验证</b><small>资金操作前进行二次安全验证。</small></span><StatusTag tone="orange">待绑定</StatusTag></div></div>}
      <div className="ml-profile-actions"><Button onClick={() => onToast(tab === 'basic' ? '基本资料已保存' : tab === 'password' ? '密码已修改' : '安全设置已更新')}>保存</Button><Button variant="danger" onClick={() => onToast('表单已关闭')}>关闭</Button></div>
    </article>
  </section>
}

const ACTIONS = [
  { id: 'recharge', label: '快速充值', icon: <WalletOutlined /> },
  { id: 'withdraw', label: '余额提现', icon: <BankOutlined /> },
  { id: 'transfer', label: '内部转账', icon: <SwapOutlined /> },
  { id: 'packet', label: '发放红包', icon: <GiftOutlined /> },
]

export function MultiLevelFinancePage({ role = 'multiLevel', onToast }) {
  const profile = AGENT_ROLE_PROFILES[role] || AGENT_ROLE_PROFILES.multiLevel
  const [balance, setBalance] = useState(profile.availableBalance)
  const [modal, setModal] = useState(null)
  const [amount, setAmount] = useState('')
  const [records, setRecords] = useState([])
  const rows = useMemo(() => records.map((item, index) => ({ ...item, id: `MLF-${String(index + 1).padStart(4, '0')}` })), [records])
  const action = ACTIONS.find((item) => item.id === modal)
  const submit = () => {
    const value = Number(amount)
    if (!value || value <= 0) return onToast('请输入正确金额', 'error')
    const direction = modal === 'recharge' ? 1 : -1
    if (direction < 0 && value > balance) return onToast('可用额度不足', 'error')
    setBalance((current) => current + direction * value)
    setRecords((current) => [{ member: modal === 'transfer' ? profile.transferTarget : profile.account, type: action.label, amount: direction * value, relation: modal === 'packet' ? '活动红包' : '代理余额', time: '2026-07-21 12:30:00', status: '处理成功' }, ...current])
    setModal(null); setAmount(''); onToast(`${action.label}演示已完成`)
  }
  return <section className="ml-screen ml-finance-screen">
    <div className="ml-finance-search"><h1>财务中心</h1><Input placeholder="搜索用户或站点..." /><Button variant="ghost" onClick={() => onToast('财务数据已刷新')}>刷新</Button></div>
    <div className="ml-finance-overview"><article className="ml-balance-card"><span><WalletOutlined /> 当前可用额度（CNY）</span><strong>¥{balance.toLocaleString('zh-CN', { minimumFractionDigits: 2 })}</strong><small>站点：{profile.siteCode} · {profile.roleLabel}</small><div>{ACTIONS.map((item) => <button key={item.id} className={item.id === 'packet' ? 'danger' : ''} onClick={() => setModal(item.id)}>{item.icon}{item.label}</button>)}</div></article><article className="ml-withdraw-account"><h3><BankOutlined /> 提现账号</h3><div><span>USDT（TRC20）</span><button onClick={() => onToast('提现账号更换入口已打开')}>更换</button><b>{profile.withdrawalAccount}</b><small>链路协议：TRC20</small></div><p>提现申请将在 2 小时内处理完成，请留意到账情况</p></article></div>
    <article className="ml-card ml-finance-records"><header><div><h2>近期收支明细</h2></div><div className="ml-inline-filters"><Field label="创建时间"><Input type="date" value="2026-07-21" /></Field><Button variant="ghost" onClick={() => onToast('近期明细已筛选')}>筛选</Button><Button variant="ghost" onClick={() => onToast('收支明细已导出')}>导出报表</Button></div></header><DataTable columns={[{ key: 'id', label: '流水单号' }, { key: 'member', label: '会员名' }, { key: 'type', label: '业务类型' }, { key: 'amount', label: '主体变动额度', render: (value) => <b className={value >= 0 ? 'ml-positive' : 'ml-negative'}>{value >= 0 ? '+' : ''}¥{Number(value).toFixed(2)}</b> }, { key: 'relation', label: '关联方名称' }, { key: 'time', label: '时间' }, { key: 'status', label: '操作', render: (value) => <StatusTag>{value}</StatusTag> }]} rows={rows} emptyText="暂无数据" /></article>
    <Modal open={Boolean(modal)} title={action?.label || ''} description="演示操作仅更新当前页面模拟余额与收支流水。" onClose={() => setModal(null)} onConfirm={submit}><FormGrid columns={1}><Field label="金额" required><Input type="number" value={amount} onChange={setAmount} placeholder="请输入金额" /></Field>{modal === 'transfer' && <Field label="接收代理"><Input value={profile.transferTarget} /></Field>}{modal === 'packet' && <Field label="红包说明"><Input value="代理活动红包" /></Field>}</FormGrid></Modal>
  </section>
}
