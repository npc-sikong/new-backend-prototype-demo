import { formatGradeConditionValue, teamGradeProgress, teamOverviewCounts } from './team-management-helpers'
import { recommenderOf } from './recommender'
import { Money, Panel } from './ui'

function OverviewList({ items, columns = 4 }) {
  return <dl className="team-overview-list" style={{ '--overview-columns': columns }}>{items.map((item) => (
    <div key={item.label}>
      <dt>{item.label}</dt>
      <dd>{item.value ?? '—'}{item.helper && <small>{item.helper}</small>}</dd>
    </div>
  ))}</dl>
}

export function TeamOverviewList({ team, data }) {
  const metrics = team.metrics
  const counts = teamOverviewCounts(team, data)
  const progress = teamGradeProgress(team, data)
  const rate = `${(Number(metrics.rate || 0) * 100).toFixed(0)}%`
  const nextGrade = progress.completed ? '最高等级' : progress.nextGrade
  const gradeConditions = progress.completed
    ? [{ label: '升档状态', value: '已达最高等级', helper: '本周期暂无更高门槛' }]
    : progress.conditions.map((condition) => ({
      label: condition.label,
      value: condition.missing <= 0 ? '已达标' : `差 ${formatGradeConditionValue(condition, condition.missing)}`,
      helper: `当前 ${formatGradeConditionValue(condition, condition.current)} / 目标 ${formatGradeConditionValue(condition, condition.target)}`,
    }))

  return <div className="ta-stack team-overview-sections">
    <Panel title="资金概况" description="优先核对团队当前余额与本周期未结算收益。">
      <OverviewList columns={2} items={[
        { label: '团队当前余额', value: <Money value={metrics.correctedNet} signed />, helper: '当月结余 = 冲正后净输赢' },
        { label: '未结算收益', value: <Money value={metrics.payable} />, helper: `${metrics.grade} / ${rate} 团队返佣` },
      ]} />
    </Panel>
    <Panel title="团队基础资料">
      <OverviewList columns={5} items={[
        { label: '代理部编号', value: `${team.code} / ${team.id}` },
        { label: '所属站点 / 币种', value: `${team.site} / ${team.currency}` },
        { label: '团队负责人', value: team.mainAgent },
        { label: '代理类型', value: team.teamAgentType || team.teamType },
        { label: '推荐人', value: recommenderOf(team) },
        { label: '团队方案', value: team.plan },
        { label: '创建时间', value: team.createdAt },
        { label: '加入团队时间', value: team.joinedAt },
      ]} />
    </Panel>
    <Panel title="团队规模">
      <OverviewList columns={5} items={[
        { label: '团队代理总人数', value: counts.agentTotal },
        { label: '总会员数', value: counts.memberTotal },
        { label: '活跃会员数', value: counts.activeMembers },
        { label: '副线', value: counts.secondaryTotal },
        { label: '单线代理', value: counts.singleTotal },
      ]} />
    </Panel>
    <Panel title="团队返佣等级" description="当前返佣星级为主要结果，下一等级条件仅用于升档参考。">
      <OverviewList columns={4} items={[
        { label: '当前返佣星级', value: <strong className="team-overview-grade">{progress.currentGrade || metrics.grade}</strong> },
        { label: '团队返佣比例', value: rate },
        { label: '下一等级', value: nextGrade },
        ...gradeConditions,
      ]} />
    </Panel>
  </div>
}
