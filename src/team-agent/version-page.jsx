import { useState } from 'react'
import { ApartmentOutlined, BankOutlined, MobileOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Tabs } from './ui'

const VERSION_2_GROUPS = [
  {
    portal: 'master', title: '总控后台', icon: <SafetyCertificateOutlined />, items: [
      ['memberTurnover', '会员打码流水统计表', '会员余额与提现流水统计', '新增站点、代理、会员、充值额度、总余额、可提现余额、锁定余额、场馆提现流水和充值提现流水等字段；两类流水均说明锁定额度会随用户有效投注变化重新计算。场馆提现流水可查看场馆或通用归集明细，充值提现流水可查看每笔充值额度与提现流水需求。', '可筛选会员记录，并核对场馆/通用明细、每笔充值的充值额度与提现流水需求，以及锁定额度随投注变化的统计规则。'],
      ['agents', '代理管理', '代理资料与结算身份', '新增结算模式、团队身份、代理部、line_id 和生效周期，代理模型与结算身份分开表达。', '可筛选三种结算模式并跳转所属结算单元。'],
      ['teams', '团队代理管理', '代理部全生命周期与统一考核', '新增团队概况、主副线结构、业绩考核、团队账单、内部结算和变更记录六个标签。', '可创建代理部、开副线、查看合并考核、换主线、冻结和解散。'],
      ['singles', '独立单线管理', '独立单线及推荐关系', '新增站点直建与副线转入来源、独立考核、推荐人、加入团队和终止申请。', '独立线主可单独查看等级、账单和推荐关系。'],
      ['plans', '返佣方案', '三类团队代理方案', '增加团队方案、独立单线方案和推荐奖励方案，同时保留历史代理方案查询。', '可查看等级三条件门槛、佣金比例和推荐奖励基数。'],
      ['settlement', '代理佣金结算', '三类平台账单', '增加团队佣金、独立单线佣金、推荐奖励的审核、退回、部分发放和额度限制。', '账单剩余和站点额度共同限制本次可发金额。'],
      ['records', '佣金记录', '平台账单与内部结算对账', '增加结算单元、收付款对象、资金来源和凭证，区分平台账单与主线内部结算。', '可按两类记录回放资金责任边界。'],
      ['relations', '修改代理关系记录', '未来周期关系版本', '增加开副线、转独立、加入团队、换主线和终止等变更类型与冲突提示。', '当前和历史周期不回写，阻止项清晰可见。'],
      ['reversal', '冲正统计报表', '冲正汇总识别', '在原报表补充结算身份和结算单元，不改变原冲正统计口径。', '可区分团队主线、团队副线、独立线主和原代理模式。'],
      ['returns', '冲正回款报表', '回款明细识别', '在原回款明细补充结算身份，保留原额度与回款字段。', '可按身份查看回款，不影响团队关系。'],
      ['revenue', '代理收益看板', '三种结算模式收益', '增加结算模式、结算单元和团队三个考核指标，团队使用合并口径。', '可避免父子范围重复统计。'],
      ['cycle', '结算周期设置', '未来完整周期约束', '补充关系、方案和推荐变更只能选择未来完整佣金周期的规则。', '当前周期和已锁定账单保持不变。'],
    ],
  },
  {
    portal: 'site', title: '站点后台', icon: <BankOutlined />, items: [
      ['teams', '团队代理管理', '站点团队创建与维护', '新增创建代理部、指定主线、开副线、换主线、冻结、待解散及内部结算监控。', '站点可完成团队全生命周期操作并看到阻止原因。'],
      ['singles', '独立单线管理', '站点直接创建单人单线', '新增单人单线创建、推荐人绑定、加入团队和终止申请。', '可区分站点直建与副线转入来源。'],
      ['review', '模式变更审核', '关系切换复核', '集中审核副线转独立、独立单线加入团队、换主线和终止申请。', '重复归属、未结账单和处理中资金可阻止批准。'],
      ['plans', '方案与推荐奖励', '站点方案选择', '配置团队、独立单线和推荐奖励方案，并统一选择未来生效周期。', '历史账单继续使用原方案快照。'],
      ['settlement', '账单提交与发放', '站点账单流转', '新增账单提交、审核后发放、部分发放和每日额度监控。', '可完成待提交到已发放的状态演示。'],
    ],
  },
  {
    portal: 'agent', title: '代理后台', icon: <TeamOutlined />, items: [
      ['dashboard', '团队经营看板', '主线、副线、独立线主三身份经营', '增加一键身份切换，按权限展示团队合并、本人副线或独立单线经营数据。', '副线看不到其他副线和团队余额。'],
      ['bills', '我的佣金账单', '身份化账单视图', '主线查看团队账单，独立线主查看单线账单，副线仅查看内部结算记录。', '副线不会出现平台应付账单。'],
      ['internal', '副线内部结算', '主线自主结算副线', '新增结算金额、依据、资金来源、凭证和可用余额校验。', '超过团队可用余额时阻止提交。'],
      ['requests', '关系与模式申请', '代理自助关系申请', '按身份发起开副线、转独立、加入团队或终止申请，并回放审核状态。', '所有申请默认选择下一完整周期。'],
    ],
  },
]

const VERSION_1_GROUPS = [
  { portal: 'master', title: '总控后台', icon: <SafetyCertificateOutlined />, items: [['h5', 'H5 前端切换与提现流水', '后台到会员端演示入口', '在详情页顶部增加 H5 前端切换入口；提现页流水提示可展开切换场馆流水和充值流水，并逐笔查看充值额度与还需解锁流水，同时说明锁定额度会随用户投注变化重新计算。', '可从后台进入 H5、展开流水明细、切换场馆/充值两个统计页签并返回原后台。', 'h5']] },
  { portal: 'site', title: '站点后台', icon: <BankOutlined />, items: [] },
  { portal: 'agent', title: '代理后台', icon: <TeamOutlined />, items: [] },
]

function VersionGroup({ group, navigateTo }) {
  return <section className="ta-version-group"><header><div><i>{group.icon}</i><div><h2>{group.title}</h2><span>按模块展示最新需求说明</span></div></div><b>{group.items.length} 个模块</b></header>
    {group.items.length ? <div className="ta-version-modules">{group.items.map(([page, title, module, change, acceptance, targetPortal]) => <article className="ta-version-module" key={`${group.portal}-${page}`}>
      <div className="ta-version-module-head"><div><h3>{title}</h3><time>完成时间：2026-07-14</time></div><Button size="small" variant="ghost" onClick={() => navigateTo(targetPortal || group.portal, targetPortal ? undefined : page)}>前往页面</Button></div>
      <div className="ta-version-content"><div><b>模块说明</b><p>{module}</p></div><div><b>修改说明</b><p>{change}</p></div><div><b>功能验收</b><p>{acceptance}</p></div></div>
    </article>)}</div> : <div className="ta-version-empty">本版本该后台无新增业务模块。</div>}
  </section>
}

export function VersionRequirementsPage({ navigateTo }) {
  const [version, setVersion] = useState('2.0')
  const groups = version === '2.0' ? VERSION_2_GROUPS : VERSION_1_GROUPS
  return <div className="ta-version-page">
    <div className="ta-version-hero"><div><span>{version} 版本 · {version === '2.0' ? '原第 27 周需求' : '原第 26 周需求'}</span><h1>{version === '2.0' ? '业务运营与团队代理演示原型' : 'H5 提现与后台切换演示'}</h1><p>{version === '2.0' ? '在团队代理三后台演示闭环基础上，补充总控会员打码流水统计，便于运营查询余额、提现资格及场馆或通用流水明细。' : '保留后台到 H5 前端的切换入口，以及提现额度、场馆锁定和解锁流水的产品说明。'}</p></div><div className="ta-version-seal">{version === '2.0' ? <ApartmentOutlined /> : <MobileOutlined />}<strong>{version}</strong><span>{version === '2.0' ? 'P0 业务演示' : '需求归档'}</span></div></div>
    <Tabs items={[{ value: '2.0', label: '2.0 · 第 27 周' }, { value: '1.0', label: '1.0 · 第 26 周' }]} active={version} onChange={setVersion} />
    <div className="ta-version-groups">{groups.map((group) => <VersionGroup key={`${version}-${group.portal}`} group={group} navigateTo={navigateTo} />)}</div>
    {version === '2.0' && <section className="ta-version-roadmap"><h2>后续增强能力</h2><p>以下能力只作为后续路线图，不计入本次已完成验收：批量开副线、内部结算模板、主线自有资金提前结算、方案计算预演、阶梯奖励和历史余额移交。</p></section>}
  </div>
}
