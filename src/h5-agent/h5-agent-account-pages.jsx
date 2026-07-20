import { useEffect, useMemo, useState } from 'react'
import {
  CopyOutlined,
  EyeOutlined,
  LockOutlined,
  SafetyCertificateOutlined,
} from '@ant-design/icons'
import { ACTIVITY_ROWS } from '../team-agent/multi-level-agent-data'
import { H5AgentDetailSheet, H5AgentEmpty, H5AgentFields, H5AgentFilterSheet, H5AgentFormField, H5AgentPagination, H5AgentSearch, H5AgentSegments, H5AgentStatus } from './h5-agent-ui'
import { middleEllipsis, roleProfile } from './h5-agent-data'

function createProfileState() {
  return Object.fromEntries(['main', 'secondary', 'independent', 'multiLevel'].map((role) => {
    const profile = roleProfile(role)
    return [role, {
      nickname: profile.account,
      phone: profile.phone,
      email: profile.email,
      gender: '男',
      appLink: '',
    }]
  }))
}

export function H5ProfilePage({ role = 'main', profileState, onProfileChange, onToast = () => {} }) {
  const profile = roleProfile(role)
  const current = profileState || createProfileState()[role]
  const [tab, setTab] = useState('basic')
  const [form, setForm] = useState(current)
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })

  useEffect(() => {
    setTab('basic')
    setForm(current)
    setPasswords({ current: '', next: '', confirm: '' })
  }, [role, profileState])

  const saveBasic = () => {
    onProfileChange?.(form)
    onToast('基本资料已保存')
  }

  const savePassword = () => {
    setPasswords({ current: '', next: '', confirm: '' })
    onToast('密码已修改')
  }

  return <section className="h5-agent-account-page">
    <div className="h5-agent-profile-hero">
      <span className="h5-agent-profile-avatar">{profile.account.slice(0, 1)}</span>
      <div><strong>{profile.account}</strong><p>{profile.roleLabel}</p></div>
    </div>
    <H5AgentSegments active={tab} onChange={setTab} items={[{ value: 'basic', label: '基本资料' }, { value: 'password', label: '修改密码' }, { value: 'security', label: '安全设置' }]} />
    {tab === 'basic' && <div className="h5-agent-panel h5-agent-profile-form">
      <H5AgentFields items={[
        { label: '用户名称', value: profile.account },
        { label: '所属角色', value: profile.roleLabel },
        { label: '推广码', value: profile.promotionCode },
        { label: '创建日期', value: profile.createdAt },
        { label: 'App下载链接', value: <span>未配置 <button type="button" className="h5-agent-inline-link" onClick={() => onToast('复制入口已触发')}><CopyOutlined />复制</button></span> },
      ]} columns={2} />
      <H5AgentFormField label="用户昵称" required><input value={form.nickname} onChange={(event) => setForm((state) => ({ ...state, nickname: event.target.value }))} /></H5AgentFormField>
      <H5AgentFormField label="手机号码" required><input value={form.phone} onChange={(event) => setForm((state) => ({ ...state, phone: event.target.value }))} /></H5AgentFormField>
      <H5AgentFormField label="邮箱" required><input type="email" value={form.email} onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))} /></H5AgentFormField>
      <H5AgentFormField label="性别"><div className="h5-agent-radio-row">{['男', '女'].map((item) => <button type="button" key={item} className={form.gender === item ? 'active' : ''} onClick={() => setForm((state) => ({ ...state, gender: item }))}>{item}</button>)}</div></H5AgentFormField>
      <div className="h5-agent-form-actions"><button type="button" className="h5-agent-primary-button" onClick={saveBasic}>保存</button><button type="button" className="h5-agent-danger-button" onClick={() => onToast('表单已关闭')}>关闭</button></div>
    </div>}
    {tab === 'password' && <div className="h5-agent-panel h5-agent-profile-form">
      <div className="h5-agent-security-heading"><LockOutlined /><div><strong>修改登录密码</strong><p>填写当前密码并设置新的登录密码。</p></div></div>
      <H5AgentFormField label="当前密码" required><input type="password" value={passwords.current} onChange={(event) => setPasswords((state) => ({ ...state, current: event.target.value }))} /></H5AgentFormField>
      <H5AgentFormField label="新密码" required><input type="password" value={passwords.next} onChange={(event) => setPasswords((state) => ({ ...state, next: event.target.value }))} /></H5AgentFormField>
      <H5AgentFormField label="确认新密码" required><input type="password" value={passwords.confirm} onChange={(event) => setPasswords((state) => ({ ...state, confirm: event.target.value }))} /></H5AgentFormField>
      <div className="h5-agent-form-actions"><button type="button" className="h5-agent-primary-button" onClick={savePassword}>保存</button><button type="button" className="h5-agent-danger-button" onClick={() => onToast('表单已关闭')}>关闭</button></div>
    </div>}
    {tab === 'security' && <div className="h5-agent-panel h5-agent-security-list">
      <div><span><LockOutlined /></span><section><strong>登录密码</strong><p>建议定期更换密码，保护账号安全。</p></section><H5AgentStatus>已设置</H5AgentStatus></div>
      <div><span><SafetyCertificateOutlined /></span><section><strong>谷歌验证</strong><p>资金操作前进行二次安全验证。</p></section><H5AgentStatus tone="warning">待绑定</H5AgentStatus></div>
      <div className="h5-agent-form-actions"><button type="button" className="h5-agent-primary-button" onClick={() => onToast('安全设置已更新')}>保存</button><button type="button" className="h5-agent-danger-button" onClick={() => onToast('表单已关闭')}>关闭</button></div>
    </div>}
  </section>
}

export function H5ActivitiesPage({ onToast = () => {} }) {
  const defaults = { keyword: '', type: '' }
  const [filters, setFilters] = useState(defaults)
  const [filterOpen, setFilterOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(20)
  const rows = useMemo(() => ACTIVITY_ROWS.filter((row) => (!filters.keyword || row.name.toLowerCase().includes(filters.keyword.toLowerCase())) && (!filters.type || row.type === filters.type)), [filters])
  const visible = rows.slice((page - 1) * pageSize, page * pageSize)

  return <section className="h5-agent-list-page">
    <H5AgentSearch value={filters.keyword} onChange={(value) => { setFilters((state) => ({ ...state, keyword: value })); setPage(1) }} onFilter={() => setFilterOpen(true)} placeholder="搜索活动名称" />
    <div className="h5-agent-list-toolbar"><span>当前共 {rows.length} 个活动</span></div>
    <div className="h5-agent-card-list">
      {visible.map((row) => <article className="h5-agent-record-card" key={row.id} onClick={() => setSelected(row)}>
        <header><div><strong>{row.name}</strong><small>{middleEllipsis(row.id, 10, 6)}</small></div><H5AgentStatus>{row.status}</H5AgentStatus></header>
        <div className="h5-agent-record-summary"><span>活动类型<b>{row.type}</b></span><span>活动对象<b>{row.target}</b></span><span>开始时间<b>{row.start}</b></span><span>结束时间<b>{row.end}</b></span></div>
        <footer><span>{row.site}</span><button type="button"><EyeOutlined />查看详情</button></footer>
      </article>)}
      {!visible.length && <H5AgentEmpty />}
    </div>
    <H5AgentPagination total={rows.length} page={page} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={(value) => { setPageSize(value); setPage(1) }} />
    <H5AgentFilterSheet open={filterOpen} onClose={() => setFilterOpen(false)} onReset={() => { setFilters(defaults); setPage(1) }} onApply={() => { setFilterOpen(false); setPage(1); onToast(`已查询 ${rows.length} 个活动`) }}>
      <H5AgentFormField label="活动类型"><select value={filters.type} onChange={(event) => setFilters((state) => ({ ...state, type: event.target.value }))}><option value="">全部类型</option>{[...new Set(ACTIVITY_ROWS.map((row) => row.type))].map((item) => <option key={item}>{item}</option>)}</select></H5AgentFormField>
      <H5AgentFormField label="站点"><input value="旺财体育" readOnly /></H5AgentFormField>
      <H5AgentFormField label="查询日期"><input type="date" value="2026-07-21" readOnly /></H5AgentFormField>
    </H5AgentFilterSheet>
    <H5AgentDetailSheet open={Boolean(selected)} title="活动详情" description={selected?.name} onClose={() => setSelected(null)}>
      {selected && <H5AgentFields items={[
        { label: '活动编码', value: selected.id }, { label: '活动名称', value: selected.name }, { label: '活动类型', value: selected.type }, { label: '活动对象', value: selected.target },
        { label: '所属站点', value: selected.site }, { label: '开始时间', value: selected.start }, { label: '结束时间', value: selected.end }, { label: '当前状态', value: <H5AgentStatus>{selected.status}</H5AgentStatus> },
        { label: '活动排序', value: selected.order }, { label: '热门排序', value: selected.hot }, { label: '创建时间', value: selected.createdAt },
      ]} />}
      <div className="h5-agent-detail-note"><strong>活动说明</strong><p>活动按页面展示时间和对象生效，具体领取条件以旺财体育站点活动规则为准。</p></div>
    </H5AgentDetailSheet>
  </section>
}
