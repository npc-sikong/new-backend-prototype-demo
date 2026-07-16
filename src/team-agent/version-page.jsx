import { useState } from 'react'
import { ApartmentOutlined, BankOutlined, MobileOutlined, SafetyCertificateOutlined, TeamOutlined } from '@ant-design/icons'
import { Button, Tabs } from './ui'

const VERSION_2_GROUPS = [
  {
    portal: 'master', title: '总控后台', icon: <SafetyCertificateOutlined />, items: [
      ['memberTurnover', '会员打码流水统计表', '会员余额与提现流水统计', '新增站点、代理、会员、充值额度、总余额、可提现余额、锁定余额、场馆提现流水和充值提现流水等字段；两类流水均说明锁定额度会随用户有效投注变化重新计算。场馆提现流水可查看场馆或通用归集明细，充值提现流水可查看每笔充值额度与提现流水需求。', '可筛选会员记录，并核对场馆/通用明细、每笔充值的充值额度与提现流水需求，以及锁定额度随投注变化的统计规则。'],
      ['agents', '代理管理', '代理资料、经营统计与结算身份', '在原列表增加代理类型、推广人员、注册登录资料、活跃会员、存提款、总输赢、有效投注、结算身份及可选绑定会员；增加资料、密码、历史佣金余额、下级代理和渠道统计弹窗。', '组合筛选、列表分页、详情及历史已发月份余额调整均可演示，代理模式与结算身份分开表达。'],
      ['teams', '团队代理管理', '代理部全生命周期、统一考核与当月结余', '补充团队类型、创建/加入时间、副线会员详情权限和团队操作记录；加入团队当月结余带入，移出留原团队，解散由指定代理承接。', '可创建代理部、开副线、查看合并考核、换主线、冻结、解散及结余归属。'],
      ['singles', '独立单线管理', '独立单线及推荐关系', '新增站点直建与副线转入来源、独立考核、推荐人、加入团队和终止申请。', '独立线主可单独查看等级、账单和推荐关系。'],
      ['plans', '佣金管理', '方案、活跃定义与代理成本', '原返佣方案增加佣金方案、活跃会员定义和代理成本页签，支持方案复制、等级调整及场馆费、存提款手续费口径展示。', '可在一个旧模块内完成方案、活跃定义和成本的查看与调整。'],
      ['settlement', '代理佣金结算', '完整佣金字段与当月结余调整', '补齐总输赢、各类成本、净输赢、上月结余、本月结余调整、冲正后净输赢和佣金调整；Excel 当月结余规则覆盖旧口径。', '可选择列表字段、查看完整计算详情并调整当前佣金月份的本月结余。'],
      ['records', '佣金记录', '平台账单与内部结算对账', '增加账单类型、完整佣金字段、列信息和详情，区分平台账单与主线内部结算。', '可按记录类型查询并回放计算与资金责任边界。'],
      ['withdrawals', '代理提款', '代理提款审核与记录', '在代理管理大模块下新增提款审核和提款记录，补充上级账号、代理类型、金额、收款信息及审核信息。', '可组合筛选、审核通过或拒绝，并与站点和代理端共享订单状态。'],
      ['relations', '修改代理关系记录', '关系版本、团队操作与结余归属', '增加开副线、转独立、加入团队、换主线、解散的当月结余处理和团队操作记录。', '当前和历史账单不回写，加入带入、移出留原团队、解散指定承接清晰可见。'],
      ['reversal', '冲正统计报表', '冲正汇总识别', '在原报表补充结算身份和结算单元，不改变原冲正统计口径。', '可区分团队主线、团队副线、独立线主和原代理模式。'],
      ['returns', '冲正回款报表', '回款明细识别', '在原回款明细补充结算身份，保留原额度与回款字段。', '可按身份查看回款，不影响团队关系。'],
      ['revenue', '代理收益看板', '三种结算模式收益', '增加结算模式、结算单元和团队三个考核指标，团队使用合并口径。', '可避免父子范围重复统计。'],
      ['cycle', '结算周期设置', '未来完整周期约束', '补充关系、方案和推荐变更只能选择未来完整佣金周期的规则。', '当前周期和已锁定账单保持不变。'],
    ],
  },
  {
    portal: 'site', title: '站点后台', icon: <BankOutlined />, items: [
      ['siteDashboard', '运营首页', '站点代理运营总览', '保留原指标看板、周期切换、趋势和排行，增加佣金余额、代理余额、指标组成明细、结算归属说明和团队维度下钻。', '可切换周期、点击每张指标卡查看组成，并核对团队或结算单元归属。'],
      ['siteAgents', '代理管理', '代理主档与团队代理兼容', '保留原代理资料和维护结构，增加结算模式、团队身份、代理部、line_id、负责人、生效周期、当月结余、组合筛选、经营详情和关系历史；团队代理、独立单线和模式审核作为新增子模块。', '可组合筛选并查看资料、经营和关系历史；创建团队、开副线和换主线只选择本站启用代理。'],
      ['plans', '佣金管理', '方案、结算、发放与冲正', '保留原返佣方案、账单、佣金记录和冲正结构，增加团队佣金、独立单线佣金、推荐奖励、活跃定义、代理成本、当月结余公式、部分发放和站点日额度。', '可核对三类方案与账单、提交和部分发放，并在佣金记录、冲正和回款页面追溯。'],
      ['members', '代理报表', '原有代理经营报表', '保留代理会员、代理财务、存款、游戏、账变、转账、充提统计、场馆费用和站点利润，统一增加团队、线路、结算身份、结算单元、生效周期及各页专属经营字段。', '各报表可按新增条件筛选、分页、导出和打开详情，金额页面展示统一当月结余口径。'],
      ['prepaid', '资金操作', '预付金、代理代存与提款', '保留预付金、额度或佣金代存和代理提款结构，增加团队归属、扣款账户、流水倍数、站点审核、提款审核与记录、USDT和CNY金额及跨后台状态联动。', '可调整预付金、审核代存、审核并完成提款，代理端可看到对应状态和余额变化。'],
    ],
  },
  {
    portal: 'agent', title: '代理后台', icon: <TeamOutlined />, items: [
      ['dashboard', '运营首页', '三身份代理经营总览', '保留原经营指标、周期切换和明细，增加主管主线、副线负责人、独立线主切换，以及团队线路、当月结余、佣金、余额、身份操作和数据隔离。', '三种身份切换可用；副线不显示其他线路、团队余额或平台应付账单。'],
      ['downline', '我的代理', '下级代理、代理会员与关系申请', '保留原代理和会员查询，增加结算模式、身份、结算单元、line_id、生效周期、团队归属、关系历史页签及关系与模式申请。', '可查看本人代理树、会员和关系历史，并从页面进入未来周期关系申请。'],
      ['readonlyPlans', '我的佣金', '方案、个人佣金、账单与冲正', '保留原返佣方案、个人佣金、账单、佣金记录和冲正回款，增加方案类型、活跃定义、代理成本、当月结余、三身份资金边界和主线内部结算。', '主线与独立线主可核对当月结余账单，副线只查看本人内部结算。'],
      ['agentPay', '资金操作', '代存、提款、账变与转账', '保留额度或佣金代存、提款、账变和转账，增加当前身份、结算单元、可选会员范围、扣款类型、流水倍数、本人可提现余额、处理中占用和CNY换算。', '代存和提款均校验本人余额，审核结果可在相关记录中联动查看。'],
      ['finance', '经营报表', '个人经营报表', '保留个人财务、存款、游戏、充提统计和场馆费用，统一增加团队、线路、结算身份、结算单元、生效周期筛选与详情，并按身份限制查看范围。', '筛选、分页、详情和导出可用；副线只看到本人 LINE-B，独立线主只看到独立单线01。'],
    ],
  },
]

const VERSION_1_GROUPS = [
  { portal: 'master', title: '总控后台', icon: <SafetyCertificateOutlined />, items: [['h5', 'H5 前端切换与提现页', '后台到会员端演示入口', '在详情页顶部保留 H5 前端切换入口；H5 提现页按手机端窄屏样式展示，选择提现方式后展开账户、金额和资金密码，并在提现金额标题下方展示可提现、锁定及“解锁条件”弹层。', '可从后台进入 H5、以手机端比例查看钱包概览、切换隐藏无余额场馆、选择提现方式、查看可提/锁定金额，并在解锁条件弹层内合并核对场馆流水、充值流水和彩金流水；弹层不展示已解锁记录和盈利解锁额度行。', 'h5']] },
  { portal: 'site', title: '站点后台', icon: <BankOutlined />, items: [] },
  { portal: 'agent', title: '代理后台', icon: <TeamOutlined />, items: [] },
]

function VersionGroup({ group, navigateTo }) {
  return <section className="ta-version-group"><header><div><i>{group.icon}</i><div><h2>{group.title}</h2><span>按模块展示最新需求说明</span></div></div><b>{group.items.length} 个模块</b></header>
    {group.items.length ? <div className="ta-version-modules">{group.items.map(([page, title, module, change, acceptance, targetPortal]) => <article className="ta-version-module" key={`${group.portal}-${page}`}>
      <div className="ta-version-module-head"><div><h3>{title}</h3><time>完成时间：{page === 'memberTurnover' ? '2026-07-14' : page === 'h5' ? '2026-07-16' : '2026-07-15'}</time></div><Button size="small" variant="ghost" onClick={() => navigateTo(targetPortal || group.portal, targetPortal ? undefined : page)}>前往页面</Button></div>
      <div className="ta-version-content"><div><b>模块说明</b><p>{module}</p></div><div><b>修改说明</b><p>{change}</p></div><div><b>功能验收</b><p>{acceptance}</p></div></div>
    </article>)}</div> : <div className="ta-version-empty">本版本该后台无新增业务模块。</div>}
  </section>
}

export function VersionRequirementsPage({ navigateTo }) {
  const [version, setVersion] = useState('2.0')
  const groups = version === '2.0' ? VERSION_2_GROUPS : VERSION_1_GROUPS
  return <div className="ta-version-page">
    <div className="ta-version-hero"><div><span>{version} 版本 · {version === '2.0' ? '原第 27 周需求' : '原第 26 周需求'}</span><h1>{version === '2.0' ? '业务运营与团队代理演示原型' : 'H5 提现与后台切换演示'}</h1><p>{version === '2.0' ? '在团队代理三后台闭环与会员打码流水统计基础上，恢复站点后台和代理后台原有代理业务模块；团队代理只在旧页面补充字段、页签与角色口径，并统一采用当月结余规则。' : '保留后台到 H5 前端的切换入口，以及手机端比例的钱包概览、提现方式、取款账户和金额输入演示。'}</p></div><div className="ta-version-seal">{version === '2.0' ? <ApartmentOutlined /> : <MobileOutlined />}<strong>{version}</strong><span>{version === '2.0' ? 'P0 业务演示' : '需求归档'}</span></div></div>
    <Tabs items={[{ value: '2.0', label: '2.0 · 第 27 周' }, { value: '1.0', label: '1.0 · 第 26 周' }]} active={version} onChange={setVersion} />
    <div className="ta-version-groups">{groups.map((group) => <VersionGroup key={`${version}-${group.portal}`} group={group} navigateTo={navigateTo} />)}</div>
    {version === '2.0' && <section className="ta-version-roadmap"><h2>后续增强能力</h2><p>以下能力只作为后续路线图，不计入本次已完成验收：批量开副线、内部结算模板、主线自有资金提前结算、方案计算预演、阶梯奖励和历史余额移交。</p></section>}
  </div>
}
