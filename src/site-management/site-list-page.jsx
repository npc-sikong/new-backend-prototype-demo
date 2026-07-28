import { useMemo, useState } from 'react'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import {
  Button,
  DataTable,
  Field,
  FilterBar,
  FormGrid,
  Input,
  Modal,
  Select,
  StatusTag,
} from '../team-agent/ui'
import { SITE_CONFIG_TABS, SITE_LIST_ROWS, SITE_REBATE_PLANS } from './site-list-data'
import './site-list.css'

const EMPTY_FILTERS = { code: '', name: '', adminAccount: '', status: '' }

function ActionLink({ icon, children, tone = '', onClick }) {
  return <button type="button" className={`site-list-action ${tone}`} onClick={onClick}>{icon}{children}</button>
}

function ConfigPlaceholder({ tab, site }) {
  return <section className="site-config-placeholder">
    <SettingOutlined />
    <strong>{tab}</strong>
    <p>{site.name}（{site.code}）的{tab}已定位，当前暂无需要维护的配置项。</p>
  </section>
}

function SiteComprehensiveConfig({ site, form, setForm, plans, onSave, onAddPlan, onEditPlan, onDeletePlan }) {
  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const columns = [
    { key: 'name', label: '基础返佣方案' },
    { key: 'type', label: '类型' },
    { key: 'parameters', label: '专用参数', render: (value) => <span className="site-plan-parameters">{value}</span> },
    { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    {
      key: 'actions',
      label: '操作',
      render: (_, row) => <div className="site-plan-actions">
        <ActionLink icon={<EditOutlined />} onClick={() => onEditPlan(row)}>修改</ActionLink>
        <ActionLink icon={<DeleteOutlined />} tone="danger" onClick={() => onDeletePlan(row)}>删除</ActionLink>
      </div>,
    },
  ]

  return <div className="site-comprehensive">
    <section className="site-config-card">
      <header><h3>站点综合配置</h3><Button onClick={onSave}>保存综合配置</Button></header>
      <div className="site-config-card-body">
        <FormGrid columns={2}>
          <Field label="站点编号"><Input value={site.code} disabled /></Field>
          <Field label="站点月费额度(CNY)"><Input type="number" min="0" value={form.monthlyLimit} onChange={(value) => setValue('monthlyLimit', value)} /></Field>
          <Field label="站点名称"><Input value={site.name} disabled /></Field>
          <Field label="免月费利润阈值(CNY)"><Input type="number" min="0" value={form.freeProfitThreshold} onChange={(value) => setValue('freeProfitThreshold', value)} /></Field>
        </FormGrid>
        <div className="site-share-divider"><span>站点分润百分比</span></div>
        <FormGrid columns={2}>
          <Field label="站点分润(%)"><Input type="number" min="0" max="100" value={form.siteShare} onChange={(value) => setValue('siteShare', value)} /></Field>
          <Field label="总站分润(%)"><Input type="number" min="0" max="100" value={form.masterShare} onChange={(value) => setValue('masterShare', value)} /></Field>
        </FormGrid>
        <div className="site-share-divider"><span>运营手续费承担占比</span></div>
        <FormGrid columns={2}>
          <Field label="站点承担运营手续费"><Input type="number" min="0" max="100" value={form.siteOperatingFeeShare} onChange={(value) => setValue('siteOperatingFeeShare', value)} /></Field>
          <Field label="总站承担运营手续费"><Input type="number" min="0" max="100" value={form.masterOperatingFeeShare} onChange={(value) => setValue('masterOperatingFeeShare', value)} /></Field>
        </FormGrid>
      </div>
    </section>

    <section className="site-config-card site-balance-card">
      <header><h3>站点额度</h3></header>
      <div className="site-config-card-body">
        <Field label="当前可用额度(CNY)"><Input value={`¥${Number(site.availableBalance).toLocaleString('zh-CN', { minimumFractionDigits: 2 })}`} disabled /></Field>
      </div>
    </section>

    <section className="site-config-card site-plan-card">
      <header><h3>返佣方案配置</h3><Button icon={<PlusOutlined />} onClick={onAddPlan}>新增返佣方案</Button></header>
      <div className="site-config-card-body"><DataTable minWidth={1120} columns={columns} rows={plans} /></div>
    </section>
  </div>
}

function SiteConfigPage({ site, onBack, onToast }) {
  const [activeTab, setActiveTab] = useState('站点综合配置')
  const [form, setForm] = useState(() => ({
    monthlyLimit: site?.monthlyLimit ?? 0,
    freeProfitThreshold: site?.freeProfitThreshold ?? 0,
    siteShare: site?.siteShare ?? 80,
    masterShare: site?.masterShare ?? 20,
    siteOperatingFeeShare: site?.siteOperatingFeeShare ?? 80,
    masterOperatingFeeShare: site?.masterOperatingFeeShare ?? 20,
  }))
  const [plans, setPlans] = useState(SITE_REBATE_PLANS)
  const [planModal, setPlanModal] = useState(null)
  const [planName, setPlanName] = useState('')

  function saveConfig() {
    const total = Number(form.siteShare || 0) + Number(form.masterShare || 0)
    if (total !== 100) {
      onToast('站点分润与总站分润合计必须为 100%', 'error')
      return
    }
    const operatingFeeTotal = Number(form.siteOperatingFeeShare || 0) + Number(form.masterOperatingFeeShare || 0)
    if (operatingFeeTotal !== 100) {
      onToast('站点与总站运营手续费承担占比合计必须为 100%', 'error')
      return
    }
    onToast(`${site.name}综合配置已保存`)
  }

  function openPlanModal(mode, plan) {
    setPlanModal({ mode, plan })
    setPlanName(plan?.name || '')
  }

  function savePlan() {
    if (!planName.trim()) return
    if (planModal.mode === 'add') {
      setPlans((current) => [...current, {
        id: `rp-${Date.now()}`,
        name: planName.trim(),
        type: '多层级代理',
        parameters: '1级/30.00%  2级/35.00%  3级/40.00%',
        status: '启用',
      }])
      onToast('返佣方案已新增')
    } else {
      setPlans((current) => current.map((item) => item.id === planModal.plan.id ? { ...item, name: planName.trim() } : item))
      onToast('返佣方案已修改')
    }
    setPlanModal(null)
  }

  function deletePlan(plan) {
    setPlans((current) => current.filter((item) => item.id !== plan.id))
    onToast(`${plan.name}已从当前站点移除`)
  }

  return <>
    <section className="site-config-page" aria-label={`站点配置 - ${site.code}`}>
      <header className="site-config-page-head">
        <h2>站点配置 - {site.code}</h2>
        <button type="button" onClick={onBack}>返回列表</button>
      </header>
      <div className="site-config-tabs" role="tablist">{SITE_CONFIG_TABS.map((tab) => <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'active' : ''} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div>
      <div className="site-config-page-body">
        {activeTab === '站点综合配置'
          ? <SiteComprehensiveConfig
              site={site}
              form={form}
              setForm={setForm}
              plans={plans}
              onSave={saveConfig}
              onAddPlan={() => openPlanModal('add')}
              onEditPlan={(plan) => openPlanModal('edit', plan)}
              onDeletePlan={deletePlan}
            />
          : <ConfigPlaceholder tab={activeTab} site={site} />}
      </div>
    </section>
    <Modal
      open={Boolean(planModal)}
      title={planModal?.mode === 'add' ? '新增返佣方案' : '修改返佣方案'}
      description="维护当前站点使用的基础返佣方案名称。"
      onClose={() => setPlanModal(null)}
      onConfirm={savePlan}
      confirmDisabled={!planName.trim()}
    >
      <Field label="方案名称" required><Input value={planName} onChange={setPlanName} placeholder="请输入返佣方案名称" /></Field>
    </Modal>
  </>
}

function SiteEditDialog({ site, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...site }))
  if (!site) return null
  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  return <Modal open title={`修改站点 - ${site.code}`} description="修改当前站点的中英文名称、管理员账号和状态。" width={760} onClose={onClose} onConfirm={() => onSave(form)}>
    <FormGrid columns={2}>
      <Field label="站点名称" required><Input value={form.name} onChange={(value) => setValue('name', value)} /></Field>
      <Field label="站点英文名称" required><Input value={form.englishName} onChange={(value) => setValue('englishName', value)} /></Field>
      <Field label="站点管理员账号" required><Input value={form.adminAccount} onChange={(value) => setValue('adminAccount', value)} /></Field>
      <Field label="站点状态"><Select value={form.status} onChange={(value) => setValue('status', value)} options={['启用', '停用', '审批通过']} /></Field>
    </FormGrid>
  </Modal>
}

export function SiteListPage({ onToast }) {
  const [rows, setRows] = useState(SITE_LIST_ROWS)
  const [filters, setFilters] = useState(EMPTY_FILTERS)
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS)
  const [configSite, setConfigSite] = useState(null)
  const [editSite, setEditSite] = useState(null)
  const [deleteSite, setDeleteSite] = useState(null)
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))

  const visibleRows = useMemo(() => rows.filter((row) => {
    const codeMatches = !appliedFilters.code || row.code.includes(appliedFilters.code.trim())
    const nameMatches = !appliedFilters.name || row.name.toLowerCase().includes(appliedFilters.name.trim().toLowerCase())
    const adminMatches = !appliedFilters.adminAccount || row.adminAccount.toLowerCase().includes(appliedFilters.adminAccount.trim().toLowerCase())
    const statusMatches = !appliedFilters.status || row.status === appliedFilters.status
    return codeMatches && nameMatches && adminMatches && statusMatches
  }), [rows, appliedFilters])

  const columns = [
    { key: 'selected', label: <input type="checkbox" aria-label="全选站点" />, render: () => <input type="checkbox" aria-label="选择站点" /> },
    { key: 'id', label: '站点ID' },
    { key: 'code', label: '站点编码' },
    { key: 'name', label: '站点名称' },
    { key: 'englishName', label: '站点英文名称' },
    { key: 'adminAccount', label: '站点管理员账号', render: (value) => <span className="site-admin-account">{value}</span> },
    { key: 'status', label: '站点状态', render: (value) => <StatusTag tone={value === '启用' ? 'green' : value === '审批通过' ? 'blue' : 'red'}>{value}</StatusTag> },
    { key: 'appliedAt', label: '申请时间' },
    {
      key: 'actions',
      label: '操作',
      render: (_, row) => <div className="site-list-actions">
        <ActionLink icon={<SettingOutlined />} onClick={() => setConfigSite(row)}>配置</ActionLink>
        <ActionLink icon={<EditOutlined />} onClick={() => setEditSite(row)}>修改</ActionLink>
        <ActionLink icon={<DeleteOutlined />} onClick={() => setDeleteSite(row)}>删除</ActionLink>
      </div>,
    },
  ]

  function resetFilters() {
    setFilters(EMPTY_FILTERS)
    setAppliedFilters(EMPTY_FILTERS)
    onToast('站点筛选条件已重置')
  }

  function saveSite(next) {
    setRows((current) => current.map((item) => item.id === next.id ? next : item))
    setEditSite(null)
    onToast(`${next.name}站点资料已修改`)
  }

  function confirmDelete() {
    setRows((current) => current.filter((item) => item.id !== deleteSite.id))
    onToast(`${deleteSite.name}已从站点列表删除`)
    setDeleteSite(null)
  }

  if (configSite) {
    return <SiteConfigPage
      key={configSite.id}
      site={configSite}
      onBack={() => setConfigSite(null)}
      onToast={onToast}
    />
  }

  return <section className="site-list-screen">
    <FilterBar
      onSearch={() => { setAppliedFilters(filters); onToast('站点资料查询已更新') }}
      onReset={resetFilters}
    >
      <Field label="站点编码"><Input value={filters.code} onChange={(value) => setFilter('code', value)} placeholder="请输入站点编码" /></Field>
      <Field label="站点名称"><Input value={filters.name} onChange={(value) => setFilter('name', value)} placeholder="请输入站点中文名称" /></Field>
      <Field label="站点管理员账号"><Input value={filters.adminAccount} onChange={(value) => setFilter('adminAccount', value)} placeholder="请输入站点管理员账号" /></Field>
      <Field label="站点状态"><Select value={filters.status} onChange={(value) => setFilter('status', value)} placeholder="站点状态" options={['启用', '停用', '审批通过']} /></Field>
    </FilterBar>
    <div className="site-list-quick-actions"><button type="button" aria-label="快速搜索" onClick={() => setAppliedFilters(filters)}><SearchOutlined /></button><button type="button" aria-label="刷新列表" onClick={resetFilters}><ReloadOutlined /></button></div>
    <DataTable className="site-list-table" minWidth={1180} columns={columns} rows={visibleRows} paginated />
    <SiteEditDialog key={editSite?.id || 'edit-closed'} site={editSite} onClose={() => setEditSite(null)} onSave={saveSite} />
    <Modal open={Boolean(deleteSite)} title="删除站点" description="删除后该站点将从当前前端演示列表移除。" onClose={() => setDeleteSite(null)} onConfirm={confirmDelete} confirmText="确认删除">
      <p className="site-delete-copy">确认删除站点“{deleteSite?.name}（{deleteSite?.code}）”吗？</p>
    </Modal>
  </section>
}
