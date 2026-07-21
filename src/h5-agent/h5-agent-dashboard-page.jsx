import { useMemo, useState } from 'react'
import { useTeamAgent } from '../team-agent/context'
import { dashboardGroupsForRole } from '../team-agent/multi-level-agent-core-pages'

const SCOPE_LABELS = {
  main: '当前团队',
  secondary: '当前副线',
  independent: '当前单线',
  multiLevel: '当前多层级代理授权下级',
}

export function H5AgentDashboardPage({ role = 'main', onToast = () => {} }) {
  const { data } = useTeamAgent()
  const [period, setPeriod] = useState('2026-07-21')
  const groups = useMemo(() => dashboardGroupsForRole(data, role), [data, role])

  return <section className="h5-agent-page h5-agent-dashboard-page">
    <div className="h5-agent-dashboard-toolbar">
      <button type="button" className="active">代理数据看板</button>
      <button type="button" onClick={() => onToast('数据筛选项已打开')}>数据筛选⌄</button>
      <input aria-label="统计日期" type="date" value={period} onChange={(event) => setPeriod(event.target.value)} />
    </div>
    <p className="h5-agent-dashboard-alert">这里展示{SCOPE_LABELS[role]}范围内的代理、一般为累计数据，只有在代理新增数据时会每天更新；不建议通过日期筛选来更新，白底卡片数据会根据日期筛选范围同步变化。</p>
    <div className="h5-agent-dashboard-mobile h5-agent-dashboard-module">
      {groups.map((group) => <section key={group.title}>
        <h3>{group.title}</h3>
        <div className="h5-agent-dashboard-cards">{group.items.map((item) => <article className={`tone-${item.tone || 'default'}`} key={item.label}>
          <span>{item.label}</span>
          <strong>{item.value}</strong>
          <footer>
            <small>{item.helper || '较上周期'}</small>
            {item.note && <em>{item.note}</em>}
            {item.link && <button type="button" onClick={() => onToast(`${item.label}明细已打开`)}>{item.link}</button>}
          </footer>
        </article>)}</div>
      </section>)}
    </div>
  </section>
}
