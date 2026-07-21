import {
  ArrowRightOutlined,
  CheckCircleOutlined,
  LockOutlined,
  OrderedListOutlined,
  ReloadOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Alert, SectionHeader } from './ui'

const FLOW_STEPS = [
  ['每笔独立建单', '每次充值或获得彩金时，独立记录入账额度和对应的提现投注流水。'],
  ['按顺序完成', '多笔记录同时存在时，按发生时间顺序优先解锁第一笔，不可跳过。'],
  ['逐笔释放本金', '某笔流水完成后，仅将该笔尚未亏损的充值本金转入可提现余额。'],
  ['统一释放盈利', '只有本轮全部提现流水完成后，剩余盈利才从锁定余额转入可提现余额。'],
  ['结束并重开周期', '全部余额完成解锁后本轮结束；之后再次充值时，重新作为新一轮第一笔记录。'],
]

function RuleCard({ icon, title, children, tone = 'blue' }) {
  return <article className={`negative-mode-rule-card is-${tone}`}>
    <i>{icon}</i>
    <div><h3>{title}</h3><p>{children}</p></div>
  </article>
}

function Scenario({ number, title, summary, points }) {
  return <article className="negative-mode-scenario">
    <header><span>特殊情况 {number}</span><div><h3>{title}</h3><p>{summary}</p></div></header>
    <ol>{points.map((point) => <li key={point}>{point}</li>)}</ol>
  </article>
}

export function NegativeProfitModeGuidePage() {
  return <section className="negative-mode-guide-screen">
    <SectionHeader title="负盈利模式说明" description="说明充值、彩金、锁定余额与提现投注流水之间的逐笔解锁规则。" />

    <div className="negative-mode-hero">
      <div className="negative-mode-hero-icon"><LockOutlined /></div>
      <div><span>提现核心限制</span><h2>只要存在锁定余额，就不能全额提现</h2><p>用户只能提取已完成提现投注流水的充值订单本金；本轮仍有未完成记录时，未解锁充值额度与盈利继续保留在锁定余额。</p></div>
      <div className="negative-mode-hero-result"><small>全部流水完成后</small><strong><CheckCircleOutlined /> 锁定余额转为可提现</strong></div>
    </div>

    <section className="negative-mode-section">
      <div className="negative-mode-section-title"><OrderedListOutlined /><div><h2>逐笔统计与解锁顺序</h2><p>每笔充值或彩金都拥有独立的提现流水记录，按发生时间 FIFO 解锁。</p></div></div>
      <div className="negative-mode-flow">{FLOW_STEPS.map(([title, description], index) => <div className="negative-mode-flow-step" key={title}>
        <b>{index + 1}</b><div><strong>{title}</strong><span>{description}</span></div>{index < FLOW_STEPS.length - 1 && <ArrowRightOutlined />}
      </div>)}</div>
    </section>

    <div className="negative-mode-rule-grid">
      <RuleCard icon={<WalletOutlined />} title="单笔充值单独锁定">每笔充值均记录充值额度和对应的提现投注流水。未达到该笔目标流水时，该笔充值额度保持锁定，不能转入可提现余额。</RuleCard>
      <RuleCard icon={<OrderedListOutlined />} title="新增资金继续排队">第一笔尚未完成时再次充值，会新增第二笔独立记录；如果之后继续充值或获得彩金，则继续新增第三笔记录，前面的记录不会被覆盖。</RuleCard>
      <RuleCard icon={<CheckCircleOutlined />} title="已完成记录释放本金" tone="green">第一笔完成后，只释放第一笔尚未亏损的充值本金。第二笔、第三笔未完成时，其对应余额和本轮盈利仍保持锁定。</RuleCard>
      <RuleCard icon={<ReloadOutlined />} title="盈利最后统一解锁" tone="orange">即使前面的充值本金已转为可提现，只要本轮还有任何一笔提现流水未完成，盈利部分就不能提现；全部记录完成后再一并解锁。</RuleCard>
    </div>

    <Alert title="金额与流水口径">单笔还需提现投注流水 = MAX（0，单笔目标流水 − 单笔已完成有效流水）；单笔可转本金不超过该笔充值额度，并受用户当前剩余余额限制；本轮全部记录完成前，盈利金额继续计入锁定余额。</Alert>

    <section className="negative-mode-section">
      <div className="negative-mode-section-title"><LockOutlined /><div><h2>特殊场景说明</h2><p>充值次数增加或用户产生输赢时，仍按每笔记录的完成顺序与剩余余额判断可提现金额。</p></div></div>
      <div className="negative-mode-scenarios">
        <Scenario number="1" title="多次充值后盈利增加" summary="三笔充值同时存在时，按已完成记录逐笔释放本金，盈利等待全部完成。" points={[
          '第一笔流水完成后，可将第一笔尚未亏损的充值本金转为可提现余额。',
          '若只完成第一笔和第二笔，则只释放前两笔尚未亏损的充值本金。',
          '第三笔充值额度和全部盈利继续锁定，直到第三笔提现投注流水也完成。',
          '三笔全部完成后，剩余锁定余额与盈利统一转为可提现余额，本轮统计结束。',
        ]} />
        <Scenario number="2" title="前序充值已产生亏损" summary="已完成流水不代表一定有同额本金可释放，可转金额还要受当前余额限制。" points={[
          '第一笔完成后，如第一笔充值资金仅剩一部分，只能释放尚未亏损的部分。',
          '如果第一笔充值资金已经全部亏损，该笔完成时没有金额可以转入可提现余额。',
          '剩余余额归属于后续充值记录时，必须完成对应的第二笔或后续提现投注流水后才能提现。',
          '即使用第二笔资金产生了更多盈利，也必须完成第二笔流水；本轮仍有未完成记录时盈利继续锁定。',
        ]} />
      </div>
    </section>
  </section>
}
