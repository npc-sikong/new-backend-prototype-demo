import { formatGradeConditionValue } from './team-management-helpers'
import { MetricCard, MetricGrid, Panel } from './ui'

export function TeamGradeSummary({ metrics, progress }) {
  const grade = progress.currentGrade || metrics.grade
  const rate = `${(Number(metrics.rate || 0) * 100).toFixed(0)}%`
  return <Panel className="team-grade-summary" title="当前返佣星级" description="当前等级为团队概况主体，下一等级条件作为升档参考。">
    <div className="team-grade-summary-main">
      <div>
        <span>团队返佣等级</span>
        <strong>{grade}</strong>
        <small>{rate} 团队返佣比例</small>
      </div>
      <div>
        <span>下一等级</span>
        <strong>{progress.completed ? '最高等级' : progress.nextGrade}</strong>
        <small>{progress.completed ? '本周期暂无更高门槛' : '以下条件需同时满足'}</small>
      </div>
    </div>
    {!progress.completed && <div className="team-grade-summary-conditions">
      <h3>下一等级所需条件</h3>
      <MetricGrid columns={5}>{progress.conditions.map((condition) => (
        <MetricCard
          key={condition.label}
          label={condition.label}
          value={condition.missing <= 0 ? '已达标' : `差 ${formatGradeConditionValue(condition, condition.missing)}`}
          helper={`当前 ${formatGradeConditionValue(condition, condition.current)} / 目标 ${formatGradeConditionValue(condition, condition.target)}`}
          tone={condition.missing <= 0 ? 'green' : 'orange'}
        />
      ))}</MetricGrid>
    </div>}
  </Panel>
}
