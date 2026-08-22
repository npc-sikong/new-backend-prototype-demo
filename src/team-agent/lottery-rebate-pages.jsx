import { createContext, useContext, useMemo, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Button, DataTable, Field, FilterBar, FormGrid, Input, Modal, Money, Panel, Percent, SectionHeader, Select, StatusTag } from './ui'

const LOTTERY_OPTIONS = ['时时彩', '北京赛车', '六合彩', '分分彩']
const PLAY_OPTIONS = {
  时时彩: ['五星直选', '定位胆', '大小单双'],
  北京赛车: ['冠亚和', '定位胆', '前五名'],
  六合彩: ['特码', '正码', '连码'],
  分分时时彩: ['五星直选', '定位胆', '大小单双'],
}
const ALL_PLAY_OPTIONS = [...new Set(Object.values(PLAY_OPTIONS).flat())]
const SITE_OPTIONS = ['旺财体育', '财神客栈']

const INITIAL_CONFIGS = [
  { id: 'REB-001', site: '旺财体育', lottery: '时时彩', play: '五星直选', rate: 0.008, status: '生效中', updatedAt: '2026-08-08 14:20', operator: '若依' },
  { id: 'REB-002', site: '旺财体育', lottery: '时时彩', play: '定位胆', rate: 0.006, status: '生效中', updatedAt: '2026-08-08 14:22', operator: '若依' },
  { id: 'REB-003', site: '旺财体育', lottery: '北京赛车', play: '冠亚和', rate: 0.01, status: '生效中', updatedAt: '2026-08-08 14:25', operator: '若依' },
  { id: 'REB-004', site: '财神客栈', lottery: '六合彩', play: '特码', rate: 0.012, status: '生效中', updatedAt: '2026-08-08 14:30', operator: '若依' },
  { id: 'REB-005', site: '财神客栈', lottery: '分分彩', play: '大小单双', rate: 0.005, status: '已停用', updatedAt: '2026-08-08 14:35', operator: '若依' },
]

const REPORT_SEEDS = [
  { member: 'member_10086', agent: 'gaodashang', validBet: 42800 },
  { member: 'wc_member02', agent: 'WC002', validBet: 28800 },
  { member: 'vip_8821', agent: 'gaodashang', validBet: 19300 },
  { member: 'fee_member8', agent: 'FEE0428_A8', validBet: 47300 },
  { member: 'na7_player', agent: 'NA7', validBet: 13200 },
  { member: 'single_0201', agent: 'dailiwc001', validBet: 23800 },
]
const REBATE_REPORT_SEEDS = [
  { member: 'rebate_vip01', agent: 'rebate_agent88', validBet: 51600 },
  { member: 'rebate_user12', agent: 'rebate_child01', validBet: 34600 },
  { member: 'rebate_user27', agent: 'rebate_child03', validBet: 18200 },
]
const REPORT_DATES = ['2026-08-03', '2026-08-04', '2026-08-05', '2026-08-06', '2026-08-07', '2026-08-08']
const REBATE_AGENT_ACCOUNTS = new Set(['rebate_agent88', 'rebate_child01', 'rebate_child03'])

const LotteryRebateContext = createContext(null)

export const LOTTERY_REBATE_NOTES = {
  'master:version': {
    title: '版本需求说明：新增3.0并改为按明确指令升级版本',
    updatedAt: '2026-08-08 20:14',
    summary: '版本需求说明默认展示当前3.0版本，并保留2.0与1.0历史版本；后续不再按自然周自动切换版本号。',
    fields: '页面展示版本号、版本状态、版本主题、后台分组、模块数量、完成时间、模块说明、修改说明、功能验收和页面跳转。3.0当前包含彩票会员返水及彩票会员返水报表。',
    logic: '版本号仅在收到用户明确升级指令时新增或切换；未收到版本指令时，后续修改继续归入当前3.0版本，同一模块反复调整时使用最新说明覆盖。彩票会员返水报表按查询日期区间汇总，同一会员与同一彩票玩法的不同天数据合并展示。',
    related: '关联总控后台、站点后台、代理后台各业务模块及各页面业务及需求说明；版本条目可跳转到对应页面。',
    requirement: '新增3.0版本，移除按周更换版本的规则，改为由用户明确指令控制版本升级；同步记录彩票会员返水报表的跨日期区间合并口径。',
    acceptance: '首次进入默认显示3.0；可切换查看2.0与1.0历史版本；3.0不显示周次，明确提示“按指令更新”；两个新增模块均可直接跳转，返水报表说明明确不同天数合并。',
    boundary: '版本说明为演示原型内置内容，不提供页面内编辑或自动按日期升级能力。',
    record: '2026-08-08 20:14｜修改说明：同步彩票会员返水报表的跨日期区间汇总口径。修改内容：3.0版本说明补充同一会员、站点、上级代理、彩票及玩法在不同日期的数据合并展示，并按区间累计有效投注额和总返水额度。',
    comparison: {
      mark: '改', baseline: '原总控后台版本需求说明', legacy: '原页面按1.0对应第26周、2.0对应第27周展示，并默认进入2.0。',
      additions: {
        fields: ['3.0当前版本状态', '按指令更新说明', '彩票会员返水与报表模块条目'],
        views: ['新增3.0版本页签', '2.0与1.0改为历史版本标识'],
        actions: ['3.0模块可跳转至两个新增会员管理页面'],
        rules: ['版本号仅在收到明确指令时升级', '不再按自然周自动切换版本', '彩票会员返水报表的不同天数据按查询日期区间合并'],
      },
    },
  },
  'master:lotteryMemberRebate': {
    title: '彩票会员返水：按站点、彩票名称和彩票玩法维护会员返水比例',
    updatedAt: '2026-08-08 15:22',
    summary: '总控后台会员管理下新增独立的彩票会员返水配置页，用于维护不同站点、彩票名称与彩票玩法对应的返水比例。',
    fields: '筛选区包含站点、彩票名称、彩票玩法和状态；配置列表展示配置编号、站点、彩票名称、彩票玩法、返水比例、状态、更新时间、操作人和操作。新增或修改弹窗必填站点、彩票名称、彩票玩法及返水比例。',
    logic: '同一站点、彩票名称与彩票玩法只能存在一条配置；返水比例按百分比录入并保留两位小数，允许范围为大于0%且不超过100%。配置新增或修改后，彩票会员返水报表按最新比例计算；删除配置后不再生成对应玩法的新报表记录。',
    related: '关联会员管理、彩票会员返水报表及会员有效投注统计；本页配置是彩票会员返水报表的计算来源。',
    requirement: '新增“彩票会员返水”独立入口，支持指定站点、彩票名称、彩票玩法设置返水比例，并提供配置列表、新增、修改和删除操作。',
    acceptance: '可按条件查询配置；可新增不重复的配置；可修改返水比例或状态；删除需二次确认；配置变化后报表中的比例与返水金额同步变化。',
    boundary: '使用前端模拟数据演示，不连接真实彩票投注、会员钱包或发放服务；停用配置不生成当前演示报表记录。',
    record: '2026-08-08 15:22｜修改说明：建立彩票会员返水的统一配置入口，便于产品与运营按站点及玩法维护比例。修改内容：新增菜单、筛选、配置列表、新增/修改弹窗、重复校验、比例校验、停用状态和删除确认。',
    comparison: {
      mark: '新', baseline: '原总控后台会员管理无对应独立页面', legacy: '原后台没有按彩票名称及玩法维护会员返水比例的独立配置能力。',
      additions: {
        fields: ['站点、彩票名称、彩票玩法、返水比例、状态、更新时间、操作人'],
        filters: ['站点、彩票名称、彩票玩法、状态'],
        views: ['新增/修改彩票会员返水配置弹窗', '删除配置二次确认弹窗'],
        actions: ['新增配置', '修改配置', '删除配置'],
        rules: ['同一站点+彩票名称+彩票玩法不得重复', '返水比例按百分比录入并用于报表计算'],
      },
    },
  },
  'master:lotteryMemberRebateReport': {
    title: '彩票会员返水报表：按有效投注额和配置比例计算会员返水',
    updatedAt: '2026-08-08 20:14',
    summary: '总控后台会员管理下的彩票会员返水报表按查询日期区间汇总，将同一会员在同一彩票玩法下的不同天数据合并为一行。',
    fields: '筛选区包含日期区间、站点、会员账号、上级代理、彩票名称、彩票玩法、有效投注额区间和总返水额度区间；列表展示日期区间、站点、会员账号、上级代理、彩票名称、彩票玩法、返水比例、区间有效投注额和区间总返水额度。',
    logic: '仅对生效中的彩票会员返水配置生成报表。系统先按日期区间筛选每日数据，再按站点、会员账号、上级代理、彩票名称、彩票玩法及返水比例合并；区间有效投注额 = 各日有效投注额之和，区间总返水额度 = 区间有效投注额 × 返水比例。金额区间筛选作用于合并后的结果。',
    related: '关联彩票会员返水配置、会员有效投注统计、会员管理及返水发放核对；报表比例来源于“彩票会员返水”页面。',
    requirement: '彩票会员返水报表的日期采用跨时间段统计，不同天数的数据按相同会员与玩法维度合并展示，并累计有效投注额和总返水额度。',
    acceptance: '同一会员、站点、上级代理、彩票名称、彩票玩法和返水比例在所选日期区间内只展示一行；日期列显示查询区间；金额筛选、列表合计和导出均使用合并后的区间数据。',
    boundary: '本页为前端模拟报表，不触发真实返水发放；新配置会生成演示记录，停用或删除配置不再出现在当前报表。',
    record: '2026-08-08 20:14｜修改说明：避免同一会员的跨天返水记录分散，改为按查询时间段统一核对。修改内容：日期列改为日期区间；不同天数按站点、会员、上级代理、彩票、玩法和比例合并；有效投注额与总返水额度按区间累计；金额筛选、合计和导出同步使用合并结果。',
    comparison: {
      mark: '新', baseline: '原总控后台会员管理无对应独立页面', legacy: '原后台没有基于彩票玩法返水配置生成会员级返水报表的独立查询页。',
      additions: {
        fields: ['日期区间、站点、会员账号、上级代理、彩票名称、彩票玩法、返水比例、区间有效投注额、区间总返水额度'],
        filters: ['日期区间、站点、会员账号、上级代理、彩票名称、彩票玩法、有效投注额区间、总返水额度区间'],
        actions: ['组合查询', '重置筛选', '导出当前结果'],
        rules: ['不同天数按相同会员与玩法维度合并', '区间总返水额度=区间有效投注额×返水比例', '仅生效配置生成报表', '金额筛选与总计作用于合并结果'],
      },
    },
  },
  'site:lotteryMemberRebateReport': {
    title: '彩票会员返水报表：核对旺财体育本站会员应计返水',
    updatedAt: '2026-08-22 15:38',
    summary: '站点后台新增彩票会员返水报表，固定展示旺财体育本站范围，并按查询日期区间合并同一会员、彩票与玩法的不同天记录。',
    fields: '筛选区包含日期区间、会员账号、上级代理、彩票名称、彩票玩法、有效投注额区间和总返水额度区间；列表不展示跨站点字段，展示日期区间、会员账号、上级代理、彩票名称、彩票玩法、返水比例、有效投注额和总返水额度。',
    logic: '站点范围固定为旺财体育。区间有效投注额 = 本站相同会员、上级代理、彩票、玩法和返水比例各日有效投注额之和；区间总返水额度 = 区间有效投注额 × 返水比例。金额筛选、合计与导出均基于合并后的本站结果。',
    related: '关联总控后台彩票会员返水配置、本站会员列表、投注记录及返水代理经营核对。',
    requirement: '将总控后台彩票会员返水报表同步至站点后台，并按站点运营身份固定为旺财体育本站数据，不提供跨站点查看。',
    acceptance: '站点后台可独立进入报表；筛选区和列表均不出现可切换的站点范围；所有结果均为旺财体育数据；跨日期汇总、金额合计和导出可用。',
    boundary: '纯前端本站报表演示，不连接真实投注、会员钱包或返水发放服务，不产生真实资金变化。',
    record: '修改时间：2026-08-22 15:38；修改说明：为站点运营补充本站彩票会员返水核对入口；修改内容：新增站点菜单与页面，固定旺财体育数据范围，隐藏跨站点筛选和列表字段，保留区间查询、金额筛选、合计和导出。',
    comparison: {
      mark: '新', baseline: '原站点后台无对应独立页面', legacy: '原站点后台没有会员彩票返水区间报表。',
      additions: { fields: ['日期区间', '会员账号', '上级代理', '彩票与玩法', '返水比例', '有效投注额', '总返水额度'], filters: ['日期区间', '会员账号', '上级代理', '彩票名称', '彩票玩法', '金额区间'], actions: ['查询', '重置', '导出'], rules: ['固定旺财体育本站范围', '不同天数按相同会员与玩法合并', '总返水额度=有效投注额×返水比例'] },
    },
  },
  'agent:lotteryMemberRebateReport': {
    title: '彩票会员返水报表：返水代理授权会员区间返水核对',
    updatedAt: '2026-08-22 15:38',
    summary: '代理后台仅向返水代理身份开放彩票会员返水报表，并只展示当前返水代理本人及授权下级代理所属会员数据。',
    fields: '筛选区包含日期区间、会员账号、授权上级代理、彩票名称、彩票玩法、有效投注额区间和总返水额度区间；列表展示日期区间、会员账号、上级代理、彩票名称、彩票玩法、返水比例、有效投注额和总返水额度，不展示站点字段。',
    logic: '返水代理仅能查看 rebate_agent88、rebate_child01 与 rebate_child03 授权范围内的演示会员。不同日期按会员、上级代理、彩票、玩法及返水比例合并；总返水额度 = 有效投注额 × 返水比例。其他代理身份没有本模块入口。',
    related: '关联返水代理的代理列表、会员列表、投注记录、会员资金记录及总控彩票会员返水配置。',
    requirement: '将彩票会员返水报表加入代理后台返水代理菜单，按当前返水代理及授权下级收窄数据，并隐藏跨站点内容。',
    acceptance: '切换返水代理后可看到报表入口；其他代理身份不显示；报表只出现当前返水代理授权账号及会员，跨日期合并、筛选、合计和导出可用。',
    boundary: '纯前端授权范围和报表演示，不连接真实身份权限、投注、钱包或返水发放服务。',
    record: '修改时间：2026-08-22 15:38；修改说明：为返水代理补充本人授权范围内的会员返水核对能力；修改内容：新增专属菜单，按返水代理及授权下级过滤数据，隐藏站点字段，保留区间筛选、汇总和导出。',
    comparison: {
      mark: '新', baseline: '原代理后台返水代理身份无对应独立页面', legacy: '原返水代理授权模块中没有彩票会员返水报表。',
      additions: { fields: ['日期区间', '会员账号', '授权上级代理', '彩票与玩法', '返水比例', '有效投注额', '总返水额度'], filters: ['日期区间', '会员账号', '授权上级代理', '彩票名称', '彩票玩法', '金额区间'], actions: ['只读查询', '重置', '导出'], rules: ['仅返水代理身份可见', '仅本人及授权下级数据', '总返水额度=有效投注额×返水比例'] },
    },
  },
}

export function LotteryRebateProvider({ children }) {
  const [configs, setConfigs] = useState(INITIAL_CONFIGS)
  function saveConfig(next) {
    const record = { ...next, id: next.id || `REB-${Date.now()}`, rate: Number(next.rate), updatedAt: '2026-08-08 15:22', operator: '若依' }
    setConfigs((current) => current.some((item) => item.id === record.id)
      ? current.map((item) => item.id === record.id ? record : item)
      : [record, ...current])
  }
  function deleteConfig(id) {
    setConfigs((current) => current.filter((item) => item.id !== id))
  }
  function resetLotteryRebates() {
    setConfigs(INITIAL_CONFIGS)
  }
  return <LotteryRebateContext.Provider value={{ configs, saveConfig, deleteConfig, resetLotteryRebates }}>{children}</LotteryRebateContext.Provider>
}

export function useLotteryRebate() {
  const value = useContext(LotteryRebateContext)
  if (!value) throw new Error('useLotteryRebate must be used inside LotteryRebateProvider')
  return value
}

function LotteryRebateFormModal({ config, configs, onClose, onSave, onToast }) {
  const [form, setForm] = useState(() => config
    ? { ...config, rate: String(Number(config.rate) * 100) }
    : { id: '', site: '旺财体育', lottery: '', play: '', rate: '', status: '生效中' })
  const [error, setError] = useState('')
  const playOptions = PLAY_OPTIONS[form.lottery] || []
  function submit() {
    const rate = Number(form.rate)
    if (!form.site || !form.lottery || !form.play || !form.rate) return setError('请完整填写站点、彩票名称、彩票玩法和返水比例。')
    if (!Number.isFinite(rate) || rate <= 0 || rate > 100) return setError('返水比例必须大于0%且不超过100%。')
    const duplicate = configs.some((item) => item.id !== form.id && item.site === form.site && item.lottery === form.lottery && item.play === form.play)
    if (duplicate) return setError('该站点、彩票名称和彩票玩法已存在返水配置。')
    onSave({ ...form, rate: rate / 100 })
    onToast?.(form.id ? '彩票会员返水配置已更新' : '彩票会员返水配置已新增')
    onClose()
  }
  return <Modal open title={form.id ? '修改彩票会员返水' : '新增彩票会员返水'} description="按站点、彩票名称和彩票玩法设置唯一的返水比例。" onClose={onClose} onConfirm={submit} confirmText={form.id ? '保存修改' : '确认新增'} width={680}>
    <FormGrid columns={2}>
      <Field label="站点" required><Select value={form.site} onChange={(site) => setForm((current) => ({ ...current, site }))} options={SITE_OPTIONS} /></Field>
      <Field label="彩票名称" required><Select value={form.lottery} onChange={(lottery) => setForm((current) => ({ ...current, lottery, play: '' }))} placeholder="请选择彩票名称" options={LOTTERY_OPTIONS} /></Field>
      <Field label="彩票玩法" required><Select value={form.play} onChange={(play) => setForm((current) => ({ ...current, play }))} placeholder="请选择彩票玩法" options={playOptions} disabled={!form.lottery} /></Field>
      <Field label="返水比例（%）" required help="按百分比录入，最多保留两位小数"><Input type="number" min="0.01" max="100" step="0.01" value={form.rate} onChange={(rate) => setForm((current) => ({ ...current, rate }))} placeholder="请输入返水比例" /></Field>
      <Field label="状态"><Select value={form.status} onChange={(status) => setForm((current) => ({ ...current, status }))} options={['生效中', '已停用']} /></Field>
    </FormGrid>
    {error && <Alert title="无法保存" tone="error">{error}</Alert>}
  </Modal>
}

export function LotteryMemberRebatePage({ onToast }) {
  const { configs, saveConfig, deleteConfig } = useLotteryRebate()
  const emptyFilters = { site: '', lottery: '', play: '', status: '' }
  const [draft, setDraft] = useState(emptyFilters)
  const [filters, setFilters] = useState(emptyFilters)
  const [editing, setEditing] = useState(null)
  const [formOpen, setFormOpen] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const rows = useMemo(() => configs.filter((row) => (!filters.site || row.site === filters.site)
    && (!filters.lottery || row.lottery === filters.lottery)
    && (!filters.play || row.play === filters.play)
    && (!filters.status || row.status === filters.status)), [configs, filters])
  const playOptions = draft.lottery ? PLAY_OPTIONS[draft.lottery] : ALL_PLAY_OPTIONS
  const columns = [
    { key: 'id', label: '配置编号', render: (value) => <b>{value}</b> },
    { key: 'site', label: '站点' },
    { key: 'lottery', label: '彩票名称' },
    { key: 'play', label: '彩票玩法' },
    { key: 'rate', label: '返水比例', render: (value) => <b><Percent value={value} /></b> },
    { key: 'status', label: '状态', render: (value) => <StatusTag tone={value === '生效中' ? 'green' : 'gray'}>{value}</StatusTag> },
    { key: 'updatedAt', label: '更新时间' },
    { key: 'operator', label: '操作人' },
    { key: 'operation', label: '操作', render: (_, row) => <div className="ta-table-actions"><Button size="small" variant="ghost" icon={<EditOutlined />} onClick={() => { setEditing(row); setFormOpen(true) }}>修改</Button><Button size="small" variant="danger" icon={<DeleteOutlined />} onClick={() => setDeleting(row)}>删除</Button></div> },
  ]
  function reset() {
    setDraft(emptyFilters)
    setFilters(emptyFilters)
    onToast?.('筛选条件已重置')
  }
  return <section className="lottery-rebate-screen">
    <SectionHeader title="彩票会员返水" description="按站点、彩票名称及彩票玩法维护会员返水比例。" actions={<Button icon={<PlusOutlined />} onClick={() => { setEditing(null); setFormOpen(true) }}>新增配置</Button>} />
    <FilterBar onSearch={() => { setFilters(draft); onToast?.('彩票会员返水配置已查询') }} onReset={reset}>
      <Field label="站点"><Select value={draft.site} onChange={(site) => setDraft((current) => ({ ...current, site }))} placeholder="全部站点" options={SITE_OPTIONS} /></Field>
      <Field label="彩票名称"><Select value={draft.lottery} onChange={(lottery) => setDraft((current) => ({ ...current, lottery, play: '' }))} placeholder="全部彩票" options={LOTTERY_OPTIONS} /></Field>
      <Field label="彩票玩法"><Select value={draft.play} onChange={(play) => setDraft((current) => ({ ...current, play }))} placeholder="全部玩法" options={playOptions} /></Field>
      <Field label="状态"><Select value={draft.status} onChange={(status) => setDraft((current) => ({ ...current, status }))} placeholder="全部状态" options={['生效中', '已停用']} /></Field>
    </FilterBar>
    <Alert title="配置口径">同一站点、彩票名称和彩票玩法只能配置一条返水比例；报表总返水额度按“有效投注额 × 返水比例”计算。</Alert>
    <Panel title="返水配置列表" description={`当前筛选共 ${rows.length} 条配置`}><DataTable minWidth={1120} columns={columns} rows={rows} paginated /></Panel>
    {formOpen && <LotteryRebateFormModal key={editing?.id || 'new'} config={editing} configs={configs} onClose={() => setFormOpen(false)} onSave={saveConfig} onToast={onToast} />}
    <Modal open={!!deleting} title="删除彩票会员返水配置" description="删除后，该玩法不再生成新的演示返水报表记录。" onClose={() => setDeleting(null)} onConfirm={() => { deleteConfig(deleting.id); setDeleting(null); onToast?.('彩票会员返水配置已删除') }} confirmText="确认删除" width={520}>
      <Alert title="请确认删除" tone="warning">{deleting ? `${deleting.site} / ${deleting.lottery} / ${deleting.play} / ${(deleting.rate * 100).toFixed(2)}%` : ''}</Alert>
    </Modal>
  </section>
}

export function buildLotteryRebateReportRows(configs) {
  return configs.filter((config) => config.status === '生效中').flatMap((config, configIndex) => {
    const baseSeeds = [0, 1].map((memberOffset) => REPORT_SEEDS[(configIndex * 2 + memberOffset) % REPORT_SEEDS.length])
    const seeds = config.site === '旺财体育' ? [...baseSeeds, ...REBATE_REPORT_SEEDS] : baseSeeds
    return seeds.flatMap((seed, memberOffset) => {
      return [0, 1, 2].map((dayOffset) => {
        const date = REPORT_DATES[(configIndex + memberOffset + dayOffset) % REPORT_DATES.length]
        const validBet = seed.validBet + configIndex * 2400 + memberOffset * 1200 + dayOffset * 800
        return {
          id: `${config.id}-${memberOffset}-${date}`,
          configId: config.id,
          date,
          site: config.site,
          member: seed.member,
          agent: seed.agent,
          lottery: config.lottery,
          play: config.play,
          rate: config.rate,
          validBet,
          totalRebate: Math.round(validBet * config.rate * 100) / 100,
        }
      })
    })
  })
}

export function aggregateLotteryRebateReportRows(dailyRows, startDate, endDate) {
  const groups = new Map()
  dailyRows.forEach((row) => {
    const key = [row.configId, row.site, row.member, row.agent, row.lottery, row.play, row.rate].join('|')
    const current = groups.get(key) || { ...row, id: key, dates: [], validBet: 0, totalRebate: 0 }
    current.dates.push(row.date)
    current.validBet += row.validBet
    current.totalRebate += row.totalRebate
    groups.set(key, current)
  })
  return [...groups.values()].map((row) => {
    const dates = [...row.dates].sort()
    const rangeStart = startDate || dates[0]
    const rangeEnd = endDate || dates.at(-1)
    return { ...row, dateRange: rangeStart === rangeEnd ? rangeStart : `${rangeStart} 至 ${rangeEnd}`, totalRebate: Math.round(row.validBet * row.rate * 100) / 100 }
  })
}

export function scopeLotteryRebateReportRows(rows, scope = 'master') {
  if (scope === 'site') return rows.filter((row) => row.site === '旺财体育')
  if (scope === 'rebate') return rows.filter((row) => row.site === '旺财体育' && REBATE_AGENT_ACCOUNTS.has(row.agent))
  return rows
}

export function LotteryMemberRebateReportPage({ onToast, scope = 'master' }) {
  const { configs } = useLotteryRebate()
  const isMaster = scope === 'master'
  const scopeName = scope === 'site' ? '旺财体育本站' : scope === 'rebate' ? '当前返水代理及授权下级' : '全部站点'
  const defaults = { startDate: '2026-08-01', endDate: '2026-08-08', site: isMaster ? '' : '旺财体育', member: '', agent: '', lottery: '', play: '', minValidBet: '', maxValidBet: '', minRebate: '', maxRebate: '' }
  const [draft, setDraft] = useState(defaults)
  const [filters, setFilters] = useState(defaults)
  const sourceRows = useMemo(() => scopeLotteryRebateReportRows(buildLotteryRebateReportRows(configs), scope), [configs, scope])
  const playOptions = draft.lottery ? PLAY_OPTIONS[draft.lottery] : ALL_PLAY_OPTIONS
  const rows = useMemo(() => {
    const dailyRows = sourceRows.filter((row) => (!filters.startDate || row.date >= filters.startDate)
    && (!filters.endDate || row.date <= filters.endDate)
    && (!filters.site || row.site === filters.site)
    && (!filters.member || row.member.toLowerCase().includes(filters.member.toLowerCase()))
    && (!filters.agent || row.agent.toLowerCase().includes(filters.agent.toLowerCase()))
    && (!filters.lottery || row.lottery === filters.lottery)
    && (!filters.play || row.play === filters.play))
    return aggregateLotteryRebateReportRows(dailyRows, filters.startDate, filters.endDate).filter((row) => (
      (!filters.minValidBet || row.validBet >= Number(filters.minValidBet))
    && (!filters.maxValidBet || row.validBet <= Number(filters.maxValidBet))
    && (!filters.minRebate || row.totalRebate >= Number(filters.minRebate))
    && (!filters.maxRebate || row.totalRebate <= Number(filters.maxRebate))))
  }, [sourceRows, filters])
  const totals = rows.reduce((result, row) => ({ validBet: result.validBet + row.validBet, totalRebate: result.totalRebate + row.totalRebate }), { validBet: 0, totalRebate: 0 })
  const columns = [
    { key: 'dateRange', label: '日期区间' },
    ...(isMaster ? [{ key: 'site', label: '站点' }] : []),
    { key: 'member', label: '会员账号', render: (value) => <b>{value}</b> },
    { key: 'agent', label: '上级代理' },
    { key: 'lottery', label: '彩票名称' },
    { key: 'play', label: '彩票玩法' },
    { key: 'rate', label: '返水比例', render: (value) => <Percent value={value} /> },
    { key: 'validBet', label: '有效投注额', render: (value) => <Money value={value} /> },
    { key: 'totalRebate', label: '总返水额度', render: (value) => <Money value={value} tone="positive" /> },
  ]
  function exportRows() {
    const headers = ['日期区间', ...(isMaster ? ['站点'] : []), '会员账号', '上级代理', '彩票名称', '彩票玩法', '返水比例', '有效投注额', '总返水额度']
    const values = rows.map((row) => [row.dateRange, ...(isMaster ? [row.site] : []), row.member, row.agent, row.lottery, row.play, `${(row.rate * 100).toFixed(2)}%`, row.validBet, row.totalRebate])
    const csv = [headers, ...values].map((cells) => cells.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = `${scopeName}彩票会员返水报表.csv`
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
    onToast?.(`已导出 ${rows.length} 条彩票会员返水报表`)
  }
  function reset() {
    setDraft(defaults)
    setFilters(defaults)
    onToast?.('报表筛选条件已重置')
  }
  return <section className="lottery-rebate-report-screen">
    <SectionHeader title="彩票会员返水报表" description={`按查询日期区间合并不同天数，汇总${scopeName}会员有效投注额与应计返水额度。`} />
    <FilterBar onSearch={() => { setFilters(draft); onToast?.('彩票会员返水报表已查询') }} onReset={reset} onExport={exportRows}>
      <Field label="开始日期"><Input type="date" value={draft.startDate} onChange={(startDate) => setDraft((current) => ({ ...current, startDate }))} /></Field>
      <Field label="结束日期"><Input type="date" value={draft.endDate} onChange={(endDate) => setDraft((current) => ({ ...current, endDate }))} /></Field>
      {isMaster && <Field label="站点"><Select value={draft.site} onChange={(site) => setDraft((current) => ({ ...current, site }))} placeholder="全部站点" options={SITE_OPTIONS} /></Field>}
      <Field label="会员账号"><Input value={draft.member} onChange={(member) => setDraft((current) => ({ ...current, member }))} placeholder="请输入会员账号" /></Field>
      <Field label="上级代理"><Input value={draft.agent} onChange={(agent) => setDraft((current) => ({ ...current, agent }))} placeholder="请输入上级代理" /></Field>
      <Field label="彩票名称"><Select value={draft.lottery} onChange={(lottery) => setDraft((current) => ({ ...current, lottery, play: '' }))} placeholder="全部彩票" options={LOTTERY_OPTIONS} /></Field>
      <Field label="彩票玩法"><Select value={draft.play} onChange={(play) => setDraft((current) => ({ ...current, play }))} placeholder="全部玩法" options={playOptions} /></Field>
      <Field label="有效投注额（最低）"><Input type="number" min="0" value={draft.minValidBet} onChange={(minValidBet) => setDraft((current) => ({ ...current, minValidBet }))} placeholder="最低金额" /></Field>
      <Field label="有效投注额（最高）"><Input type="number" min="0" value={draft.maxValidBet} onChange={(maxValidBet) => setDraft((current) => ({ ...current, maxValidBet }))} placeholder="最高金额" /></Field>
      <Field label="总返水额度（最低）"><Input type="number" min="0" value={draft.minRebate} onChange={(minRebate) => setDraft((current) => ({ ...current, minRebate }))} placeholder="最低金额" /></Field>
      <Field label="总返水额度（最高）"><Input type="number" min="0" value={draft.maxRebate} onChange={(maxRebate) => setDraft((current) => ({ ...current, maxRebate }))} placeholder="最高金额" /></Field>
    </FilterBar>
    <Alert title={`${scopeName} · 跨日期汇总口径`}>先按日期区间筛选每日记录，再将同一会员、上级代理、彩票及玩法的不同天数合并；区间总返水额度 = 区间有效投注额 × 返水比例。</Alert>
    <div className="lottery-rebate-summary"><span>统计区间</span><b>{filters.startDate || '最早记录'} 至 {filters.endDate || '最新记录'}</b><span>汇总结果</span><b>{rows.length} 条</b><span>有效投注额合计</span><strong><Money value={totals.validBet} /></strong><span>总返水额度合计</span><strong><Money value={totals.totalRebate} tone="positive" /></strong></div>
    <Panel title="彩票会员返水区间汇总" description={`${scopeName} · 不同日期按相同会员与彩票玩法合并`}><DataTable minWidth={isMaster ? 1180 : 1050} columns={columns} rows={rows} paginated footer={<tr className="lottery-rebate-total-row"><td colSpan={columns.length - 2}>当前筛选总计</td><td><Money value={totals.validBet} /></td><td><Money value={totals.totalRebate} tone="positive" /></td></tr>} /></Panel>
  </section>
}
