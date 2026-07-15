import { useState } from 'react'
import {
  AlipayCircleFilled,
  ArrowLeftOutlined,
  CaretDownOutlined,
  CaretUpOutlined,
  CheckOutlined,
  ExclamationCircleFilled,
  FileTextOutlined,
  ReloadOutlined,
  WalletOutlined,
} from '@ant-design/icons'
import withdrawEmptyState from '../assets/withdraw-empty-state.png'

const venueTurnoverDetails = [
  { venue: 'AG真人', locked: '¥3,600.00', valid: '14,400.00', remaining: '12,500.00' },
  { venue: 'PG电子', locked: '¥2,850.00', valid: '8,750.00', remaining: '8,650.00' },
  { venue: '体育投注', locked: '¥3,926.00', valid: '10,780.00', remaining: '10,170.00' },
]

const rechargeTurnoverDetails = [
  { id: 'RECHARGE-01', type: '充值', time: '2026-07-13 10:18', amount: '¥30,000.00', remaining: '¥0.00', status: '已完成' },
  { id: 'BONUS-01', type: '系统发放彩金', time: '2026-07-13 10:19', amount: '¥1,000.00', remaining: '¥0.00', status: '已完成' },
  { id: 'RECHARGE-02', type: '充值', time: '2026-07-14 18:32', amount: '¥20,000.00', remaining: '¥30,000.00', status: '进行中' },
  { id: 'BONUS-02', type: '系统发放彩金', time: '2026-07-14 18:34', amount: '¥1,000.00', remaining: '¥1,320.00', status: '待解锁' },
]

const rechargeProfitUnlock = { amount: '¥22,528.50', status: '本轮全部充值流水完成后可领取' }

export function H5Withdrawal({ onBack, onOpenNotes, onToast }) {
  const [method, setMethod] = useState('usdt')
  const [showTurnoverDetails, setShowTurnoverDetails] = useState(false)
  const [turnoverView, setTurnoverView] = useState('venue')

  return <main className="h5-preview-stage"><section className="h5-withdraw-screen" aria-label="H5 提现页面">
    <header className="h5-withdraw-head">
      <button className="h5-back-button" aria-label="返回后台" onClick={onBack}><ArrowLeftOutlined /></button>
      <h1>提现</h1>
      <button className="h5-notes-button" onClick={onOpenNotes}><FileTextOutlined /><span>业务说明</span></button>
    </header>
        <div className="h5-requirement-stamp">业务及需求说明 · 2026-07-15 12:47</div>
    <div className="h5-withdraw-content">
      <section className="h5-balance-card">
        <div className="h5-balance-top"><span>总额度（元）</span><button className="h5-recycle-button" onClick={() => onToast('已提交一键回收申请')}><ReloadOutlined />一键回收</button></div>
        <strong>¥74,528.50</strong>
        <div className="h5-balance-divider" />
        <div className="h5-balance-split"><div><span>可提现余额</span><b>¥64,152.50</b></div><div><span>锁定余额</span><b>¥10,376.00</b></div></div>
      </section>
      <section className={`h5-turnover-card ${showTurnoverDetails ? 'expanded' : ''}`}>
        <button className="h5-turnover-toggle" onClick={() => setShowTurnoverDetails((current) => !current)} aria-expanded={showTurnoverDetails}>
          <ExclamationCircleFilled /><span>还差 <b>31,320.00</b> 投注流水可全额提现</span>{showTurnoverDetails ? <CaretUpOutlined /> : <CaretDownOutlined />}
        </button>
        {showTurnoverDetails && <div className="h5-turnover-details">
          <div className="h5-turnover-tabs" role="tablist" aria-label="提现流水统计切页">
            <button type="button" role="tab" aria-selected={turnoverView === 'venue'} className={turnoverView === 'venue' ? 'active' : ''} onClick={() => setTurnoverView('venue')}>场馆流水</button>
            <button type="button" role="tab" aria-selected={turnoverView === 'recharge'} className={turnoverView === 'recharge' ? 'active' : ''} onClick={() => setTurnoverView('recharge')}>充值流水</button>
          </div>
          <div className="h5-turnover-rule"><strong>锁定额度说明</strong><span>成功充值与系统发放彩金均视为充值行为，独立建立流水记录，无需关联充值订单；按发生时间 FIFO 解锁。有效投注确认后，已完成流水、剩余解锁量及对应锁定额度同步更新；若本轮盈利，盈利解锁额度需本轮全部充值流水完成后可领取，亏损则不展示额度。</span></div>
          {turnoverView === 'venue' ? <>
            <div className="h5-turnover-headings"><span>场馆</span><span>锁定额度</span><span>还需解锁流水</span></div>
            {venueTurnoverDetails.map((item) => <div className="h5-turnover-row" key={item.venue}><div><b>{item.venue}</b><small>已完成有效流水 ¥{item.valid}</small></div><span>{item.locked}</span><strong>¥{item.remaining}</strong></div>)}
            <p>总需解锁流水 = 各场馆还需解锁流水之和</p>
          </> : <>
            <div className="h5-turnover-headings h5-recharge-headings"><span>流水记录</span><span>计入额度</span><span>还需解锁流水</span></div>
            {rechargeTurnoverDetails.map((item) => <div className="h5-turnover-row h5-recharge-row" key={item.id}><div><b>{item.type}</b><small>{item.time} · {item.status}</small></div><span>{item.amount}</span><strong>{item.remaining}</strong></div>)}
            <div className="h5-profit-unlock-row"><div><b>盈利解锁额度</b><small>{rechargeProfitUnlock.status}</small></div><strong>{rechargeProfitUnlock.amount}</strong></div>
            <p>共 {rechargeTurnoverDetails.length} 条记录（2 笔充值 + 2 笔系统发放彩金）；充值提现流水 = 各笔还需解锁流水之和</p>
          </>}
        </div>}
      </section>
      <section className="h5-withdraw-methods">
        <h2>提现方式</h2>
        <div className="h5-method-options">
          <button className={`h5-method-card ${method === 'usdt' ? 'selected' : ''}`} onClick={() => setMethod('usdt')}><span className="h5-method-icon usdt"><WalletOutlined /></span><b>USDT提现</b>{method === 'usdt' && <i><CheckOutlined /></i>}</button>
          <button className={`h5-method-card ${method === 'alipay' ? 'selected' : ''}`} onClick={() => setMethod('alipay')}><span className="h5-method-icon alipay"><AlipayCircleFilled /></span><b>支付宝提现</b>{method === 'alipay' && <i><CheckOutlined /></i>}</button>
        </div>
      </section>
      <section className="h5-withdraw-info">
        <h2>取款信息</h2>
        <div className="h5-empty-state"><img src={withdrawEmptyState} alt="未绑定取款地址" /><p>您尚未绑定{method === 'usdt' ? 'USDT' : '支付宝'}取款地址，请<button onClick={() => onToast('已打开添加取款地址演示')}>点击添加</button></p></div>
      </section>
    </div>
  </section></main>
}
