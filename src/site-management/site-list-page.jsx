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
import {
  OPERATING_FEE_CATEGORIES,
  SITE_CONFIG_TABS,
  SITE_LIST_ROWS,
  SITE_REBATE_PLANS,
} from './site-list-data'
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

function createOperatingFeeCategories(site) {
  return OPERATING_FEE_CATEGORIES.map((name) => {
    const configured = site?.operatingFeeCategories?.find((item) => item.name === name)
    return {
      name,
      custom: Boolean(configured?.custom),
      siteShare: configured?.siteShare ?? site?.siteOperatingFeeShare ?? 80,
      masterShare: configured?.masterShare ?? site?.masterOperatingFeeShare ?? 20,
      agentBearsShare: configured?.agentBearsShare ?? true,
    }
  })
}

function SiteComprehensiveConfig({ site, form, setForm, plans, onSave, onAddPlan, onEditPlan, onDeletePlan }) {
  const setValue = (key, value) => setForm((current) => ({ ...current, [key]: value }))
  const setMasterShare = (value) => setForm((current) => ({
    ...current,
    masterShare: value,
    siteShare: 100 - Number(value || 0),
  }))
  const setDefaultMasterShare = (value) => setForm((current) => ({
    ...current,
    masterOperatingFeeShare: value,
    siteOperatingFeeShare: 100 - Number(value || 0),
  }))
  const setCategoryValue = (name, key, value) => setForm((current) => ({
    ...current,
    operatingFeeCategories: current.operatingFeeCategories.map((item) => item.name === name
      ? {
          ...item,
          [key]: value,
          ...(key === 'masterShare' ? { siteShare: 100 - Number(value || 0) } : {}),
        }
      : item),
  }))
  const toggleCategory = (name, custom) => setForm((current) => ({
    ...current,
    operatingFeeCategories: current.operatingFeeCategories.map((item) => item.name === name
      ? {
          ...item,
          custom,
          siteShare: custom ? current.siteOperatingFeeShare : item.siteShare,
          masterShare: custom ? current.masterOperatingFeeShare : item.masterShare,
        }
      : item),
  }))
  const setAgentBearing = (name, agentBearsShare) => setForm((current) => ({
    ...current,
    operatingFeeCategories: current.operatingFeeCategories.map((item) => item.name === name
      ? { ...item, agentBearsShare }
      : item),
  }))
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
          <Field label="站点自动分润(%)"><Input type="number" value={form.siteShare} disabled /></Field>
          <Field label="总站分润(%)"><Input type="number" min="0" max="100" value={form.masterShare} onChange={setMasterShare} /></Field>
        </FormGrid>
        <div className="site-share-divider"><span>运营手续费默认承担占比</span></div>
        <FormGrid columns={2}>
          <Field label="站点自动承担(%)"><Input type="number" value={form.siteOperatingFeeShare} disabled /></Field>
          <Field label="总站承担(%)"><Input type="number" min="0" max="100" value={form.masterOperatingFeeShare} onChange={setDefaultMasterShare} /></Field>
        </FormGrid>
        <p className="site-operating-fee-note">仅需填写总站承担比例，站点承担比例自动按“100% − 总站承担比例”计算且不可编辑。每类费用同时显示“继承总分摊”和“单独设置”，勾选哪项就按哪种方式生效；代理默认按比例承担，选择“不承担”后该费用不计入代理承担范围。</p>
        <div className="site-operating-fee-table" role="table" aria-label="运营手续费分类承担占比">
          <div className="site-operating-fee-row site-operating-fee-head" role="row">
            <span role="columnheader">费用类别</span>
            <span role="columnheader">分摊方式</span>
            <span role="columnheader">站点自动承担(%)</span>
            <span role="columnheader">总站承担(%)</span>
            <span role="columnheader">代理是否按自身比例承担</span>
          </div>
          {form.operatingFeeCategories.map((item) => {
            const siteShare = item.custom ? item.siteShare : form.siteOperatingFeeShare
            const masterShare = item.custom ? item.masterShare : form.masterOperatingFeeShare
            return <div className={`site-operating-fee-row${item.custom ? ' custom' : ''}`} role="row" key={item.name}>
              <strong role="cell">{item.name}</strong>
              <div className="site-operating-fee-modes" role="radiogroup" aria-label={`${item.name}分摊方式`}>
                <label className={!item.custom ? 'selected' : ''}>
                  <input type="checkbox" checked={!item.custom} onChange={() => toggleCategory(item.name, false)} />
                  <span>继承总分摊</span>
                </label>
                <label className={item.custom ? 'selected' : ''}>
                  <input type="checkbox" checked={item.custom} onChange={() => toggleCategory(item.name, true)} />
                  <span>单独设置</span>
                </label>
              </div>
              <div role="cell"><Input type="number" disabled value={siteShare} /></div>
              <div role="cell"><Input type="number" min="0" max="100" disabled={!item.custom} value={masterShare} onChange={(value) => setCategoryValue(item.name, 'masterShare', value)} /></div>
              <div className="site-operating-fee-modes site-agent-bearing-modes" role="radiogroup" aria-label={`${item.name}代理是否按自身比例承担`}>
                <label className={item.agentBearsShare ? 'selected' : ''}>
                  <input type="checkbox" checked={item.agentBearsShare} onChange={() => setAgentBearing(item.name, true)} />
                  <span>承担</span>
                </label>
                <label className={!item.agentBearsShare ? 'selected' : ''}>
                  <input type="checkbox" checked={!item.agentBearsShare} onChange={() => setAgentBearing(item.name, false)} />
                  <span>不承担</span>
                </label>
              </div>
            </div>
          })}
        </div>
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
    operatingFeeCategories: createOperatingFeeCategories(site),
  }))
  const [plans, setPlans] = useState(SITE_REBATE_PLANS)
  const [planModal, setPlanModal] = useState(null)
  const [planName, setPlanName] = useState('')

  function saveConfig() {
    const masterShare = Number(form.masterShare)
    if (!Number.isFinite(masterShare) || masterShare < 0 || masterShare > 100) {
      onToast('总站分润比例必须在 0% 至 100% 之间', 'error')
      return
    }
    const inheritedCategories = form.operatingFeeCategories.filter((item) => !item.custom)
    const defaultMasterShare = Number(form.masterOperatingFeeShare)
    if (inheritedCategories.length && (!Number.isFinite(defaultMasterShare) || defaultMasterShare < 0 || defaultMasterShare > 100)) {
      onToast('总站默认承担比例必须在 0% 至 100% 之间', 'error')
      return
    }
    const invalidCategory = form.operatingFeeCategories.find((item) => {
      const masterShare = Number(item.masterShare)
      return item.custom && (!Number.isFinite(masterShare) || masterShare < 0 || masterShare > 100)
    })
    if (invalidCategory) {
      onToast(`${invalidCategory.name}的总站承担比例必须在 0% 至 100% 之间`, 'error')
      return
    }
    const customCount = form.operatingFeeCategories.filter((item) => item.custom).length
    const excludedAgentCount = form.operatingFeeCategories.filter((item) => !item.agentBearsShare).length
    onToast(`${site.name}综合配置已保存，${customCount}类费用使用独立分摊，${excludedAgentCount}类费用代理不承担`)
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
