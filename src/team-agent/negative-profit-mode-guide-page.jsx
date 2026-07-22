import {
  ApartmentOutlined,
  CalculatorOutlined,
  LineChartOutlined,
  OrderedListOutlined,
  TeamOutlined,
  UserOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import { Alert, SectionHeader } from './ui'

const MODE_SECTIONS = [
  {
    icon: <LineChartOutlined />,
    title: '一、负盈利模式',
    description: '返佣等级由代理在当前结算周期内的实际运营数据决定。',
    points: [
      '返佣比例不是固定给，而是按实际运营数据确定返佣级别；每个返佣级别都有指定条件。',
      '代理未达到最低等级的返佣条件时，本期收益为 0，盈亏收益计入结余并带到下期；若本期为亏损，则按负数记录。',
      '负盈利模式升级条件包括：有效活跃人数、新增活跃人数、投注总盈亏。',
    ],
  },
  {
    icon: <TeamOutlined />,
    title: '二、团队代理（负盈利模式）',
    description: '以整个团队的汇总运营数据确定统一返佣等级。',
    points: [
      '团队代理可以看成由多个代理组成的星级代理。多个代理组成一个代理团队，以团队内所有代理的总数据确定返佣等级。',
      '团队设一名团队负责人，其余团队成员称为副线。负责人可在线下或通过转账向副线发放工资，平台不处理团队内部工资分配。',
      '团队区分官方代理和普通代理；官方代理只能加入官方代理团队，普通代理只能加入普通代理团队。',
      '奖励可以不发放，也可以在发放时扣减。不发放时，本周期收益转入下个周期的上周期结余；少发放时，按实际发放结果扣减对应佣金。',
      '团队不能直接踢人，可向官方申请移出成员，或申请将副线转为单线代理、团队负责人。',
    ],
  },
  {
    icon: <UserOutlined />,
    title: '三、单线代理（负盈利模式）',
    description: '单线代理独立计算经营数据，并可绑定上级代理。',
    points: [
      '单线代理类似星级代理，但采用负盈利模式；可按现有关系绑定上级代理。',
      '单线代理的返佣定级、结余和佣金发放规则与团队代理一致。',
    ],
  },
  {
    icon: <CalculatorOutlined />,
    title: '四、结算模式',
    description: '按周期定级、计算佣金，并将未消化的盈亏带入下期。',
    points: [
      '先根据结算周期内的代理运营数据确定返佣等级，再按命中的返佣比例计算佣金。',
      '负盈利模式代理只有一个层级，因此不产生级差佣金，也不产生级差运营手续费分摊。',
      '去除垫付和回款功能，改为上周期结余。本周期产生负盈利时，以负数计入下个周期的上周期结余。',
      '增加“不发放 / 修改发放”佣金功能。不发放时，本周期盈利计入下个周期的上周期结余；少发放时，直接扣减对应佣金。',
    ],
  },
]

const TURNOVER_EXAMPLE = [
  ['充值', '充值 1,000 元，提现流水倍数为 1 倍，需要完成 1,000 元充值提现流水。'],
  ['参加真人活动', '从中心钱包转 200 元参加真人场馆首充活动，获得活动彩金 100 元，流水倍数为 10 倍；真人场馆提现流水为（200 + 100）× 10 = 3,000 元。'],
  ['真人场馆投注', '用户在真人场馆完成 200 元有效流水，真人场馆提现流水减少 200 元，剩余 2,800 元；充值提现流水不减少。'],
  ['彩票场馆投注', '用户将中心钱包剩余 800 元转入彩票场馆并完成 200 元有效流水，充值提现流水减少 200 元，剩余 800 元；真人场馆首充流水仍为 2,800 元。'],
]

function ModeSection({ icon, title, description, points }) {
  return <article className="negative-mode-business-card">
    <header><i>{icon}</i><div><h2>{title}</h2><p>{description}</p></div></header>
    <ol>{points.map((point) => <li key={point}>{point}</li>)}</ol>
  </article>
}

export function NegativeProfitModeGuidePage() {
  return <section className="negative-mode-guide-screen">
    <SectionHeader title="负盈利模式说明" description="说明负盈利模式的返佣定级、团队与单线代理规则、结算口径及不同类型提现流水的计算方式。" />

    <div className="negative-mode-hero">
      <div className="negative-mode-hero-icon"><ApartmentOutlined /></div>
      <div><span>负盈利模式核心</span><h2>按实际运营数据确定返佣等级，不采用固定返佣比例</h2><p>每个返佣等级配置指定条件。系统按当前结算周期的代理或团队汇总数据命中等级，并将本期未发放收益或负盈利通过上周期结余带入下期。</p></div>
      <div className="negative-mode-hero-result"><small>主要定级条件</small><strong><LineChartOutlined /> 有效活跃 / 新增活跃 / 投注总盈亏</strong></div>
    </div>

    <div className="negative-mode-business-grid">
      {MODE_SECTIONS.map((section) => <ModeSection key={section.title} {...section} />)}
    </div>

    <section className="negative-mode-formula-section">
      <div className="negative-mode-section-title"><CalculatorOutlined /><div><h2>佣金计算</h2><p>先计算当月净利润，再乘以代理命中的佣金比例。</p></div></div>
      <div className="negative-mode-formulas">
        <div><span>代理佣金</span><strong>当月净利润 × 代理佣金比例</strong></div>
        <div><span>当月净利润</span><strong>结算周期内会员给平台带来的盈利 − 三方场馆费用 − 运营费用 + 上周期结余</strong></div>
      </div>
      <Alert title="运营费用范围">会员礼金、会员返水、会员推荐会员奖励、会员活动领取奖励，以及充值和提现手续费。</Alert>
    </section>

    <section className="negative-mode-section">
      <div className="negative-mode-section-title"><WalletOutlined /><div><h2>充值与场馆活动提现流水示例</h2><p>充值提现流水与场馆活动提现流水按资金实际使用场景分别扣减，互不混算。</p></div></div>
      <div className="negative-mode-flow is-four-steps">{TURNOVER_EXAMPLE.map(([title, description], index) => <div className="negative-mode-flow-step" key={title}>
        <b>{index + 1}</b><div><strong>{title}</strong><span>{description}</span></div>
      </div>)}</div>
      <Alert title="示例结论">真人场馆内产生的有效流水只扣减真人场馆首充活动流水；彩票场馆内使用充值本金产生的有效流水扣减充值提现流水，不影响真人场馆首充活动剩余流水。</Alert>
    </section>
  </section>
}
