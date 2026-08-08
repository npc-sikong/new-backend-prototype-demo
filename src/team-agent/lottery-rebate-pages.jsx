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
  { member: 'member_10086', agent: 'gaodashang', date: '2026-08-08', validBet: 128600 },
  { member: 'wc_member02', agent: 'WC002', date: '2026-08-07', validBet: 86400 },
  { member: 'vip_8821', agent: 'gaodashang', date: '2026-08-06', validBet: 57800 },
  { member: 'fee_member8', agent: 'FEE0428_A8', date: '2026-08-05', validBet: 142000 },
  { member: 'na7_player', agent: 'NA7', date: '2026-08-04', validBet: 39600 },
  { member: 'single_0201', agent: 'dailiwc001', date: '2026-08-03', validBet: 71500 },
]

const LotteryRebateContext = createContext(null)

export const LOTTERY_REBATE_NOTES = {
  'master:version': {
    title: '版本需求说明：新增3.0并改为按明确指令升级版本',
    updatedAt: '2026-08-08 15:22',
    summary: '版本需求说明默认展示当前3.0版本，并保留2.0与1.0历史版本；后续不再按自然周自动切换版本号。',
    fields: '页面展示版本号、版本状态、版本主题、后台分组、模块数量、完成时间、模块说明、修改说明、功能验收和页面跳转。3.0当前包含彩票会员返水及彩票会员返水报表。',
    logic: '版本号仅在收到用户明确升级指令时新增或切换；未收到版本指令时，后续修改继续归入当前3.0版本，同一模块反复调整时使用最新说明覆盖。',
    related: '关联总控后台、站点后台、代理后台各业务模块及各页面业务及需求说明；版本条目可跳转到对应页面。',
    requirement: '新增3.0版本，移除按周更换版本的规则，改为由用户明确指令控制版本升级。',
    acceptance: '首次进入默认显示3.0；可切换查看2.0与1.0历史版本；3.0不显示周次，明确提示“按指令更新”；两个新增模块均可直接跳转。',
    boundary: '版本说明为演示原型内置内容，不提供页面内编辑或自动按日期升级能力。',
    record: '2026-08-08 15:22｜修改说明：将版本节奏由按周切换改为按用户指令升级，并建立3.0当前版本。修改内容：新增3.0版本页签、当前版本主题、两项会员管理模块说明、历史版本标识和页面跳转。',
    comparison: {
      mark: '改', baseline: '原总控后台版本需求说明', legacy: '原页面按1.0对应第26周、2.0对应第27周展示，并默认进入2.0。',
      additions: {
        fields: ['3.0当前版本状态', '按指令更新说明', '彩票会员返水与报表模块条目'],
        views: ['新增3.0版本页签', '2.0与1.0改为历史版本标识'],
        actions: ['3.0模块可跳转至两个新增会员管理页面'],
        rules: ['版本号仅在收到明确指令时升级', '不再按自然周自动切换版本'],
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
    updatedAt: '2026-08-08 15:22',
    summary: '总控后台会员管理下新增独立的彩票会员返水报表，用于查询各会员在指定彩票玩法下的有效投注额、适用返水比例与总返水额度。',
    fields: '筛选区包含日期区间、站点、会员账号、上级代理、彩票名称、彩票玩法、有效投注额区间和总返水额度区间；列表展示日期、站点、会员账号、上级代理、彩票名称、彩票玩法、返水比例、有效投注额和总返水额度。',
    logic: '仅对生效中的彩票会员返水配置生成报表。单条总返水额度 = 有效投注额 × 返水比例；当前筛选总计为筛选结果内有效投注额与总返水额度分别求和。修改配置比例后，演示报表按最新配置重新计算。',
    related: '关联彩票会员返水配置、会员有效投注统计、会员管理及返水发放核对；报表比例来源于“彩票会员返水”页面。',
    requirement: '新增“彩票会员返水报表”独立入口，可按日期、站点、会员、上级代理、彩票与玩法及金额区间查询，并展示有效投注额和总返水额度。',
    acceptance: '默认可看到生效配置生成的报表；筛选条件可组合查询和重置；有效投注额及总返水额度汇总随筛选结果变化；导出内容与当前筛选结果一致。',
    boundary: '本页为前端模拟报表，不触发真实返水发放；新配置会生成演示记录，停用或删除配置不再出现在当前报表。',
    record: '2026-08-08 15:22｜修改说明：为彩票返水提供可核对、可筛选的会员级计算报表。修改内容：新增菜单、日期及业务筛选、金额区间筛选、配置联动、公式提示、列表汇总和CSV导出。',
    comparison: {
      mark: '新', baseline: '原总控后台会员管理无对应独立页面', legacy: '原后台没有基于彩票玩法返水配置生成会员级返水报表的独立查询页。',
      additions: {
        fields: ['日期、站点、会员账号、上级代理、彩票名称、彩票玩法、返水比例、有效投注额、总返水额度'],
        filters: ['日期区间、站点、会员账号、上级代理、彩票名称、彩票玩法、有效投注额区间、总返水额度区间'],
        actions: ['组合查询', '重置筛选', '导出当前结果'],
        rules: ['总返水额度=有效投注额×返水比例', '仅生效配置生成报表', '汇总随当前筛选结果联动'],
      },
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

function buildReportRows(configs) {
  return configs.filter((config) => config.status === '生效中').flatMap((config, configIndex) => [0, 1].map((offset) => {
    const seed = REPORT_SEEDS[(configIndex * 2 + offset) % REPORT_SEEDS.length]
    const validBet = seed.validBet + configIndex * 7200 + offset * 3600
    return {
      id: `${config.id}-${offset}`,
      date: seed.date,
      site: config.site,
      member: seed.member,
      agent: seed.agent,
      lottery: config.lottery,
      play: config.play,
      rate: config.rate,
      validBet,
      totalRebate: Math.round(validBet * config.rate * 100) / 100,
    }
  }))
}

export function LotteryMemberRebateReportPage({ onToast }) {
  const { configs } = useLotteryRebate()
  const defaults = { startDate: '2026-08-01', endDate: '2026-08-08', site: '', member: '', agent: '', lottery: '', play: '', minValidBet: '', maxValidBet: '', minRebate: '', maxRebate: '' }
  const [draft, setDraft] = useState(defaults)
  const [filters, setFilters] = useState(defaults)
  const sourceRows = useMemo(() => buildReportRows(configs), [configs])
  const playOptions = draft.lottery ? PLAY_OPTIONS[draft.lottery] : ALL_PLAY_OPTIONS
  const rows = useMemo(() => sourceRows.filter((row) => (!filters.startDate || row.date >= filters.startDate)
    && (!filters.endDate || row.date <= filters.endDate)
    && (!filters.site || row.site === filters.site)
    && (!filters.member || row.member.toLowerCase().includes(filters.member.toLowerCase()))
    && (!filters.agent || row.agent.toLowerCase().includes(filters.agent.toLowerCase()))
    && (!filters.lottery || row.lottery === filters.lottery)
    && (!filters.play || row.play === filters.play)
    && (!filters.minValidBet || row.validBet >= Number(filters.minValidBet))
    && (!filters.maxValidBet || row.validBet <= Number(filters.maxValidBet))
    && (!filters.minRebate || row.totalRebate >= Number(filters.minRebate))
    && (!filters.maxRebate || row.totalRebate <= Number(filters.maxRebate))), [sourceRows, filters])
  const totals = rows.reduce((result, row) => ({ validBet: result.validBet + row.validBet, totalRebate: result.totalRebate + row.totalRebate }), { validBet: 0, totalRebate: 0 })
  const columns = [
    { key: 'date', label: '日期' },
    { key: 'site', label: '站点' },
    { key: 'member', label: '会员账号', render: (value) => <b>{value}</b> },
    { key: 'agent', label: '上级代理' },
    { key: 'lottery', label: '彩票名称' },
    { key: 'play', label: '彩票玩法' },
    { key: 'rate', label: '返水比例', render: (value) => <Percent value={value} /> },
    { key: 'validBet', label: '有效投注额', render: (value) => <Money value={value} /> },
    { key: 'totalRebate', label: '总返水额度', render: (value) => <Money value={value} tone="positive" /> },
  ]
  function exportRows() {
    const headers = ['日期', '站点', '会员账号', '上级代理', '彩票名称', '彩票玩法', '返水比例', '有效投注额', '总返水额度']
    const values = rows.map((row) => [row.date, row.site, row.member, row.agent, row.lottery, row.play, `${(row.rate * 100).toFixed(2)}%`, row.validBet, row.totalRebate])
    const csv = [headers, ...values].map((cells) => cells.map((cell) => `"${String(cell ?? '').replaceAll('"', '""')}"`).join(',')).join('\n')
    const url = URL.createObjectURL(new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' }))
    const link = document.createElement('a')
    link.href = url
    link.download = '彩票会员返水报表.csv'
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
    <SectionHeader title="彩票会员返水报表" description="根据彩票会员返水配置，查询会员有效投注额与应计返水额度。" />
    <FilterBar onSearch={() => { setFilters(draft); onToast?.('彩票会员返水报表已查询') }} onReset={reset} onExport={exportRows}>
      <Field label="开始日期"><Input type="date" value={draft.startDate} onChange={(startDate) => setDraft((current) => ({ ...current, startDate }))} /></Field>
      <Field label="结束日期"><Input type="date" value={draft.endDate} onChange={(endDate) => setDraft((current) => ({ ...current, endDate }))} /></Field>
      <Field label="站点"><Select value={draft.site} onChange={(site) => setDraft((current) => ({ ...current, site }))} placeholder="全部站点" options={SITE_OPTIONS} /></Field>
      <Field label="会员账号"><Input value={draft.member} onChange={(member) => setDraft((current) => ({ ...current, member }))} placeholder="请输入会员账号" /></Field>
      <Field label="上级代理"><Input value={draft.agent} onChange={(agent) => setDraft((current) => ({ ...current, agent }))} placeholder="请输入上级代理" /></Field>
      <Field label="彩票名称"><Select value={draft.lottery} onChange={(lottery) => setDraft((current) => ({ ...current, lottery, play: '' }))} placeholder="全部彩票" options={LOTTERY_OPTIONS} /></Field>
      <Field label="彩票玩法"><Select value={draft.play} onChange={(play) => setDraft((current) => ({ ...current, play }))} placeholder="全部玩法" options={playOptions} /></Field>
      <Field label="有效投注额（最低）"><Input type="number" min="0" value={draft.minValidBet} onChange={(minValidBet) => setDraft((current) => ({ ...current, minValidBet }))} placeholder="最低金额" /></Field>
      <Field label="有效投注额（最高）"><Input type="number" min="0" value={draft.maxValidBet} onChange={(maxValidBet) => setDraft((current) => ({ ...current, maxValidBet }))} placeholder="最高金额" /></Field>
      <Field label="总返水额度（最低）"><Input type="number" min="0" value={draft.minRebate} onChange={(minRebate) => setDraft((current) => ({ ...current, minRebate }))} placeholder="最低金额" /></Field>
      <Field label="总返水额度（最高）"><Input type="number" min="0" value={draft.maxRebate} onChange={(maxRebate) => setDraft((current) => ({ ...current, maxRebate }))} placeholder="最高金额" /></Field>
    </FilterBar>
    <Alert title="返水计算口径">总返水额度 = 有效投注额 × 彩票会员返水配置比例；仅生效中的配置参与当前报表生成。</Alert>
    <div className="lottery-rebate-summary"><span>当前筛选结果</span><b>{rows.length} 条</b><span>有效投注额合计</span><strong><Money value={totals.validBet} /></strong><span>总返水额度合计</span><strong><Money value={totals.totalRebate} tone="positive" /></strong></div>
    <Panel title="彩票会员返水明细" description="报表比例与彩票会员返水配置实时联动"><DataTable minWidth={1180} columns={columns} rows={rows} paginated footer={<tr className="lottery-rebate-total-row"><td colSpan={7}>当前筛选总计</td><td><Money value={totals.validBet} /></td><td><Money value={totals.totalRebate} tone="positive" /></td></tr>} /></Panel>
  </section>
}
