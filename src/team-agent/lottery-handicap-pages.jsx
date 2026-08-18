import { createContext, useContext, useMemo, useState } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Alert, Button, DataTable, DescriptionGrid, Field, FilterBar, FormGrid, Input, Modal, SectionHeader, Select, StatusTag, Toolbar } from './ui'
import { rebateOddsOf } from './rebate-odds'

export const LOTTERY_HANDICAPS = ['A盘', 'B盘', 'C盘', 'D盘']
export const LOTTERY_NAMES = ['幸运飞艇', '重庆时时彩', '北京PK10', '澳洲幸运5', '香港六合彩', '加拿大28']
export const LOTTERY_SITES = ['旺财体育', '财神客栈']

const INITIAL_CONFIGS = [
  { id: 'LHP-001', site: '旺财体育', lotteries: ['幸运飞艇', '重庆时时彩'], rebateRate: 0.8, handicap: 'A盘', status: '启用', effectiveAt: '2026-08-17', operator: '若依', updatedAt: '2026-08-17 17:25' },
  { id: 'LHP-002', site: '旺财体育', lotteries: ['北京PK10'], rebateRate: 1.1, handicap: 'B盘', status: '启用', effectiveAt: '2026-08-17', operator: '若依', updatedAt: '2026-08-17 17:25' },
  { id: 'LHP-003', site: '财神客栈', lotteries: ['澳洲幸运5', '香港六合彩', '加拿大28'], rebateRate: 1.35, handicap: 'C盘', status: '停用', effectiveAt: '2026-08-18', operator: '若依', updatedAt: '2026-08-17 17:25' },
]

const LOTTERY_PLAY_PRESETS = {
  speed: [['冠亚和值', '冠亚和值大', 4], ['冠亚和值', '冠亚和值小', 4], ['冠亚和值', '冠亚和值单', 3], ['冠亚和值', '冠亚和值双', 3], ['定位胆', '冠军号码', 2], ['定位胆', '亚军号码', 2], ['两面盘', '冠军大小单双', 5], ['两面盘', '亚军大小单双', 5], ['龙虎', '冠军龙', 6], ['龙虎', '冠军虎', 6], ['龙虎', '第五名龙', 4], ['龙虎', '第五名虎', 4]],
  number: [['总和', '总和大', 4], ['总和', '总和小', 4], ['总和', '总和单', 3], ['总和', '总和双', 3], ['定位胆', '第一球数字', 2], ['定位胆', '第五球数字', 2], ['两面盘', '第一球大小单双', 5], ['两面盘', '第五球大小单双', 5], ['龙虎', '龙', 6], ['龙虎', '虎', 6], ['特殊玩法', '豹子', 1], ['特殊玩法', '顺子', 1]],
  markSix: [['特码', '特码A', 4], ['特码', '特码B', 4], ['特码', '特码大小单双', 5], ['色波', '红波', 3], ['色波', '蓝波', 3], ['色波', '绿波', 3], ['生肖', '特肖', 2], ['生肖', '六肖', 2], ['正码', '正码一至六', 4], ['连码', '二全中', 1], ['连码', '三全中', 1], ['尾数', '特码尾数', 2]],
  canada: [['混合', '混合大', 4], ['混合', '混合小', 4], ['混合', '混合单', 4], ['混合', '混合双', 4], ['极值', '极大', 2], ['极值', '极小', 2], ['特码', '三个数字和值', 3], ['色波', '红波', 2], ['色波', '蓝波', 2], ['色波', '绿波', 2], ['组合', '大单/小双', 1], ['组合', '大双/小单', 1]],
}
const playRowsFor = (lottery) => { const key = lottery.includes('六合彩') ? 'markSix' : lottery.includes('加拿大') ? 'canada' : lottery.includes('时时彩') || lottery.includes('幸运5') ? 'number' : 'speed'; return LOTTERY_PLAY_PRESETS[key].map(([group, play, rebateRate], index) => ({ id: `${key}-${index + 1}`, group, play, rebateRate, odds: rebateOddsOf(rebateRate), status: '启用' })) }

const LotteryHandicapContext = createContext(null)
const emptyForm = () => ({ site: '旺财体育', lotteries: [...LOTTERY_NAMES], rebateRate: '0.80', handicap: 'A盘', status: '启用', effectiveAt: '2026-08-17' })

export function LotteryHandicapProvider({ children }) {
  const [configs, setConfigs] = useState(() => structuredClone(INITIAL_CONFIGS))

  function saveConfig(form, editingId) {
    const lotteries = [...new Set(form.lotteries || [])]
    const rebateRate = Number(form.rebateRate)
    if (!form.site) return { ok: false, message: '请选择站点' }
    if (!lotteries.length) return { ok: false, message: '请至少选择一个彩票' }
    if (!LOTTERY_HANDICAPS.includes(form.handicap)) return { ok: false, message: '请选择A、B、C或D盘口' }
    if (!Number.isFinite(rebateRate) || rebateRate <= 0 || rebateRate > 100) return { ok: false, message: '返水比例必须大于0且不超过100%' }
    const conflict = configs.some((row) => row.id !== editingId && row.site === form.site && row.handicap === form.handicap && row.lotteries.some((lottery) => lotteries.includes(lottery)))
    if (conflict) return { ok: false, message: '所选站点、彩票和盘口已存在配置' }
    const timestamp = '2026-08-17 17:25'
    if (editingId) {
      setConfigs((current) => current.map((row) => row.id === editingId ? { ...row, ...form, lotteries, rebateRate, operator: '若依', updatedAt: timestamp } : row))
      return { ok: true, message: '彩票盘口配置已更新' }
    }
    const nextNumber = Math.max(0, ...configs.map((row) => Number(String(row.id).match(/\d+$/)?.[0] || 0))) + 1
    const nextId = `LHP-${String(nextNumber).padStart(3, '0')}`
    setConfigs((current) => [{ id: nextId, ...form, lotteries, rebateRate, operator: '若依', updatedAt: timestamp }, ...current])
    return { ok: true, message: '彩票盘口配置已新增' }
  }

  function deleteConfig(id) {
    setConfigs((current) => current.filter((row) => row.id !== id))
    return { ok: true, message: '彩票盘口配置已删除' }
  }

  const value = useMemo(() => ({ configs, saveConfig, deleteConfig, resetLotteryHandicaps: () => setConfigs(structuredClone(INITIAL_CONFIGS)) }), [configs])
  return <LotteryHandicapContext.Provider value={value}>{children}</LotteryHandicapContext.Provider>
}

export function useLotteryHandicap() {
  const value = useContext(LotteryHandicapContext)
  if (!value) throw new Error('useLotteryHandicap must be used inside LotteryHandicapProvider')
  return value
}

function LotteryMultiSelect({ value, onChange }) {
  const allSelected = value.length === LOTTERY_NAMES.length
  const toggle = (lottery) => onChange(value.includes(lottery) ? value.filter((item) => item !== lottery) : [...value, lottery])
  return <div className="lottery-handicap-multi">
    <label className="is-all"><input type="checkbox" checked={allSelected} onChange={() => onChange(allSelected ? [] : [...LOTTERY_NAMES])} /><span>全选</span><small>已选 {value.length} 项</small></label>
    <div>{LOTTERY_NAMES.map((lottery) => <label key={lottery}><input type="checkbox" checked={value.includes(lottery)} onChange={() => toggle(lottery)} /><span>{lottery}</span></label>)}</div>
  </div>
}

export function LotteryHandicapSettingsPage({ onToast }) {
  const { configs, saveConfig, deleteConfig } = useLotteryHandicap()
  const [filters, setFilters] = useState({ site: '', lottery: '', handicap: '', status: '' })
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)
  const [detail, setDetail] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const rows = useMemo(() => configs.filter((row) => (!filters.site || row.site === filters.site)
    && (!filters.lottery || row.lotteries.includes(filters.lottery))
    && (!filters.handicap || row.handicap === filters.handicap)
    && (!filters.status || row.status === filters.status)), [configs, filters])
  const setFilter = (key, value) => setFilters((current) => ({ ...current, [key]: value }))
  const openCreate = () => { setEditing({ id: null }); setForm(emptyForm()) }
  const openEdit = (row) => { setEditing(row); setForm({ ...row, lotteries: [...row.lotteries], rebateRate: Number(row.rebateRate).toFixed(2) }) }
  const closeEditor = () => setEditing(null)
  const submit = () => {
    const result = saveConfig(form, editing?.id)
    onToast(result.message, result.ok ? 'success' : 'error')
    if (result.ok) closeEditor()
  }
  const confirmDelete = () => {
    const result = deleteConfig(deleting.id)
    onToast(result.message, 'success')
    setDeleting(null)
  }
  const columns = [
    { key: 'sequence', label: '序号', render: (_, row, index) => index + 1 },
    { key: 'site', label: '所属站点' },
    { key: 'lotteries', label: '彩票名称', render: (value, row) => <div className="lottery-handicap-tags">{value.map((lottery) => <button key={lottery} onClick={() => setDetail({ lottery, config: row })}>{lottery}</button>)}</div> },
    { key: 'rebateRate', label: '返水比例', render: (value) => <b className="ta-primary-text">{Number(value).toFixed(2)}%</b> },
    { key: 'handicap', label: '彩票赔率盘口', render: (value) => <StatusTag tone="blue">{value}</StatusTag> },
    { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
    { key: 'effectiveAt', label: '生效日期' },
    { key: 'operator', label: '操作人' },
    { key: 'updatedAt', label: '修改时间' },
    { key: 'action', label: '操作', render: (_, row) => <div className="ta-table-actions"><button className="ta-table-link" onClick={() => openEdit(row)}><EditOutlined /> 修改</button><button className="ta-table-link danger" onClick={() => setDeleting(row)}><DeleteOutlined /> 删除</button></div> },
  ]
  return <section className="lottery-handicap-screen">
    <SectionHeader title="彩票ABCD盘口设置" description="按站点和彩票配置A、B、C、D四类赔率盘口返水比例，供返水代理选择对应彩票赔率盘口。" />
    <Alert title="配置口径">同一站点、同一彩票、同一盘口只能存在一条配置；一次可全选、多选或单选彩票，保存后作为一组配置展示。</Alert>
    <FilterBar onSearch={() => onToast(`已查询到 ${rows.length} 条盘口配置`)} onReset={() => setFilters({ site: '', lottery: '', handicap: '', status: '' })}>
      <Field label="所属站点"><Select value={filters.site} onChange={(value) => setFilter('site', value)} placeholder="全部站点" options={LOTTERY_SITES} /></Field>
      <Field label="彩票名称"><Select value={filters.lottery} onChange={(value) => setFilter('lottery', value)} placeholder="全部彩票" options={LOTTERY_NAMES} /></Field>
      <Field label="彩票赔率盘口"><Select value={filters.handicap} onChange={(value) => setFilter('handicap', value)} placeholder="全部盘口" options={LOTTERY_HANDICAPS} /></Field>
      <Field label="状态"><Select value={filters.status} onChange={(value) => setFilter('status', value)} placeholder="全部状态" options={['启用', '停用']} /></Field>
    </FilterBar>
    <Toolbar><Button icon={<PlusOutlined />} onClick={openCreate}>新增盘口设置</Button></Toolbar>
    <DataTable minWidth={1280} columns={columns} rows={rows} paginated />
    <Modal open={Boolean(editing)} title={editing?.id ? '修改彩票ABCD盘口设置' : '新增彩票ABCD盘口设置'} description="彩票支持全选、多选或单选；盘口必须在A、B、C、D中四选一。" onClose={closeEditor} onConfirm={submit} width={760}>
      <FormGrid><Field label="所属站点" required><Select value={form.site} onChange={(value) => setForm({ ...form, site: value })} options={LOTTERY_SITES} /></Field><Field label="返水比例" required help="按百分比录入，保留两位小数"><Input type="number" min="0.01" max="100" step="0.01" value={form.rebateRate} onChange={(value) => setForm({ ...form, rebateRate: value })} /></Field><Field label="彩票赔率盘口" required><Select value={form.handicap} onChange={(value) => setForm({ ...form, handicap: value })} options={LOTTERY_HANDICAPS} /></Field><Field label="状态" required><Select value={form.status} onChange={(value) => setForm({ ...form, status: value })} options={['启用', '停用']} /></Field><Field label="生效日期" required><Input type="date" value={form.effectiveAt} onChange={(value) => setForm({ ...form, effectiveAt: value })} /></Field><Field label="彩票名称" required className="ta-field-full"><LotteryMultiSelect value={form.lotteries || []} onChange={(lotteries) => setForm({ ...form, lotteries })} /></Field></FormGrid>
    </Modal>
    <Modal open={Boolean(deleting)} title="确认删除盘口配置" description="删除后该配置将从当前演示列表移除，不影响其他站点、彩票或盘口。" onClose={() => setDeleting(null)} onConfirm={confirmDelete} confirmText="确认删除"><p>确定删除“{deleting?.site} / {deleting?.lotteries?.join('、')} / {deleting?.handicap}”配置吗？</p></Modal>
    <Modal open={Boolean(detail)} title={`${detail?.lottery || ''}玩法返水及赔率详情`} description="参照代理端玩法配置结构展示；风格、字段和交互沿用当前后台原型。" onClose={() => setDetail(null)} onConfirm={() => setDetail(null)} confirmText="关闭" showCancel={false} width={860}><div className="lottery-play-detail"><DescriptionGrid columns={4} items={[{ label: '所属站点', value: detail?.config?.site }, { label: '彩票名称', value: detail?.lottery }, { label: '当前盘口', value: detail?.config?.handicap }, { label: '配置返水', value: `${Number(detail?.config?.rebateRate || 0).toFixed(2)}%` }]} /><Alert title="赔率换算口径">赔率 = 2.00 − 返水比例 × 0.02；例如返水4.00%对应1.92，返水6.00%对应1.88。下表为玩法级演示数据。</Alert><DataTable minWidth={680} columns={[{ key: 'group', label: '玩法分类' }, { key: 'play', label: '彩票玩法' }, { key: 'rebateRate', label: '返水比例', render: (value) => <b className="ta-primary-text">{Number(value).toFixed(2)}%</b> }, { key: 'odds', label: '对应赔率', render: (value) => <b>{value}</b> }, { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> }]} rows={detail ? playRowsFor(detail.lottery) : []} /></div></Modal>
  </section>
}
