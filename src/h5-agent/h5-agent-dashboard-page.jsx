import { useMemo, useState } from 'react'
import { useTeamAgent } from '../team-agent/context'
import { dashboardGroupsForRole } from '../team-agent/multi-level-agent-core-pages'
import { H5AgentSheet } from './h5-agent-ui'

const SCOPE_LABELS = {
  main: '当前团队',
  secondary: '当前副线',
  independent: '当前单线',
  multiLevel: '当前多层级代理授权下级',
  rebate: '当前返水代理及授权下级',
}

const ACCUMULATED_CARD_LABELS = new Set([
  '本期佣金预估/净收益',
  '当前余额',
  '未结算佣金',
  '已结算佣金',
  '代理总人数',
  '会员总数',
  '30天未登录会员',
])

const DASHBOARD_DETAIL_CONFIGS = {
  '会员VIP福利': {
    title: '会员VIP福利详情',
    columns: ['会员账号', 'VIP等级', '福利类型', '发放金额', '发放时间'],
    tip: '筛选时间内，您代理体系下会员领取并生效的贵宾礼金、周礼金、月礼金和投注返水金额合计。明细金额为原始发生金额，合计与当前卡片保持一致。',
  },
  '活动福利': {
    title: '活动福利详情',
    columns: ['会员账号', '参与活动', '奖励类目', '活动奖励', '时间'],
    tip: '筛选时间内，您代理体系下会员领取并生效的活动奖励金额合计，例如活动礼金、任务奖励、活动彩金等。明细金额为原始发生金额，合计与当前卡片保持一致。',
  },
  '会员推广福利': {
    title: '会员推广福利详情',
    columns: ['推荐人', '被推荐人', '推广类型', '产生奖励', '时间'],
    tip: '筛选时间内，您代理体系下会员通过邀请好友、推广会员等方式获得的推广奖励金额合计。明细金额为原始发生金额，合计与当前卡片保持一致。',
  },
  '充提手续运营费': {
    title: '充提手续运营费详情',
    columns: ['会员账号', '交易类型', '交易金额', '承担金额', '交易时间'],
    tip: '筛选时间内，您本人按承担比例分摊后的充值、提现手续运营费合计。明细金额为原始发生金额，合计与当前卡片保持一致。',
  },
}

export function H5AgentDashboardPage({ role = 'main', onToast = () => {} }) {
  const { data } = useTeamAgent()
  const [period, setPeriod] = useState('2026-07-21')
  const [detailKey, setDetailKey] = useState(null)
  const groups = useMemo(() => dashboardGroupsForRole(data, role), [data, role])
  const detail = DASHBOARD_DETAIL_CONFIGS[detailKey]

  const openDetail = (item) => {
    if (!DASHBOARD_DETAIL_CONFIGS[item.label]) return onToast(`${item.label}明细已打开`)
    setDetailKey(item.label)
  }

  return <section className="h5-agent-page h5-agent-dashboard-page">
    <div className="h5-agent-dashboard-toolbar">
      <input aria-label="统计日期" type="date" value={period} onChange={(event) => setPeriod(event.target.value)} />
      <button type="button" onClick={() => onToast('数据筛选项已打开')}>数据筛选⌄</button>
    </div>
    <p className="h5-agent-dashboard-alert">这里展示{SCOPE_LABELS[role]}范围内的代理数据；蓝色强调底卡片为累计或当前状态数据，普通深色底卡片会根据日期筛选范围同步变化。</p>
    <div className="h5-agent-dashboard-mobile h5-agent-dashboard-module">
      {groups.map((group) => <section key={group.title}>
        <h3>{group.title}</h3>
        <div className="h5-agent-dashboard-cards">{group.items.map((item) => <article className={`tone-${item.tone || 'default'}${ACCUMULATED_CARD_LABELS.has(item.label) ? ' is-accumulated' : ''}`} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <footer>
            <small>{item.helper || '较上周期'}</small>
            {item.note && <em>{item.note}</em>}
            {item.link && <button type="button" aria-label={`查看${item.label}明细`} onClick={() => openDetail(item)}>{item.link}</button>}
          </footer>
        </article>)}</div>
      </section>)}
    </div>
    <H5AgentSheet
      open={Boolean(detail)}
      title={detail?.title || ''}
      onClose={() => setDetailKey(null)}
      className="h5-agent-dashboard-detail-sheet"
      footer={<button type="button" className="primary" onClick={() => setDetailKey(null)}>关闭</button>}
    >
      {detail && <>
        <div className="h5-agent-dashboard-detail-meta">
          <span>流水类型</span><b>{detailKey}</b><i />
          <span>账期</span><b>{period}</b>
        </div>
        <div className="h5-agent-dashboard-detail-table-scroll">
          <div className="h5-agent-dashboard-detail-table" role="table" aria-label={detail.title}>
            <div className="h5-agent-dashboard-detail-head" role="row">
              {detail.columns.map((column) => <span role="columnheader" key={column}>{column}</span>)}
            </div>
            <div className="h5-agent-dashboard-detail-empty" role="row">暂无明细数据</div>
          </div>
        </div>
        <div className="h5-agent-dashboard-detail-total"><span>金额合计</span><strong>¥0.00</strong></div>
        <p className="h5-agent-dashboard-detail-tip"><b>提示：</b>{detail.tip}</p>
      </>}
    </H5AgentSheet>
  </section>
}
