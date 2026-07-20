import { useState } from 'react'
import {
  AlipayCircleFilled,
  ArrowLeftOutlined,
  CheckOutlined,
  CloseOutlined,
  CreditCardOutlined,
  EyeInvisibleOutlined,
  FileTextOutlined,
  InfoCircleFilled,
  PlusCircleFilled,
  ReloadOutlined,
  RightOutlined,
  WalletOutlined,
} from '@ant-design/icons'

const WALLET = { withdrawable: 64152.5, locked: 10376, maxSingle: 10000, min: 10, fee: 5 }
const METHODS = [
  { key: 'usdt', label: 'USDT提现', icon: <WalletOutlined />, tone: 'usdt' },
  { key: 'alipay', label: '支付宝提现', icon: <AlipayCircleFilled />, tone: 'alipay' },
  { key: 'ebpay', label: 'EBPay提现', icon: <CreditCardOutlined />, tone: 'ebpay' },
  { key: 'combo', label: '综合提现', icon: <CreditCardOutlined />, tone: 'combo' },
]
const ACCOUNTS = {
  usdt: { name: 'TRC20 地址', detail: 'TNx8****8F2' },
  alipay: { name: '张三', detail: '339998998' },
  ebpay: { name: 'EBPay账户', detail: 'EBP****6628' },
  combo: { name: '综合提现账户', detail: '优先匹配可用收款方式' },
}
const UNLOCK_ROWS = [
  { id: 'venue-ag', type: 'AG真人', locked: 3600, remaining: 12500 },
  { id: 'venue-pg', type: 'PG电子', locked: 2850, remaining: 8650 },
  { id: 'recharge-1', type: '充值', locked: 0, remaining: 0, status: '已解锁' },
  { id: 'bonus-1', type: 'VIP周礼金', locked: 626, remaining: 3200 },
  { id: 'recharge-2', type: '充值', locked: 2500, remaining: 6970 },
]

function money(value, prefix = '') {
  return `${prefix}${Number(value || 0).toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

export function H5Withdrawal({ onBack, onOpenNotes, onToast }) {
  const [method, setMethod] = useState('alipay')
  const [amount, setAmount] = useState('')
  const [hideZeroBalanceVenues, setHideZeroBalanceVenues] = useState(false)
  const [showUnlockConditions, setShowUnlockConditions] = useState(false)
  const selectedAccount = ACCOUNTS[method]
  const numericAmount = Number(amount || 0)
  const arrivalAmount = numericAmount > 0 ? Math.max(0, numericAmount - WALLET.fee) : 0
  const visibleUnlockRows = UNLOCK_ROWS.filter((row) => row.status !== '已解锁')
  const totalRemaining = visibleUnlockRows.reduce((sum, row) => sum + (typeof row.remaining === 'number' ? row.remaining : 0), 0)
  const unlockDialog = <div className="h5-unlock-backdrop" onClick={() => setShowUnlockConditions(false)}>
    <section className="h5-unlock-dialog" role="dialog" aria-modal="true" aria-label="解锁条件" onClick={(event) => event.stopPropagation()}>
      <header><div><span>解锁条件</span><small>场馆流水与充值流水合并展示</small></div><button aria-label="关闭解锁条件" onClick={() => setShowUnlockConditions(false)}><CloseOutlined /></button></header>
      <div className="h5-unlock-summary"><div><span>锁定金额</span><b>{money(WALLET.locked, '¥')}</b></div><div><span>还需解锁流水</span><b>{money(totalRemaining, '¥')}</b></div></div>
      <div className="h5-unlock-table"><div className="h5-unlock-row head"><span>类型</span><span>锁定额度</span><span>还需解锁流水</span></div>
        {visibleUnlockRows.map((row) => <div className="h5-unlock-row" key={row.id}><span>{row.type}</span><b>{money(row.locked, '¥')}</b><strong>{typeof row.remaining === 'number' ? money(row.remaining, '¥') : row.remaining}</strong>{row.status && <em>{row.status}</em>}</div>)}
      </div>
      <ol className="h5-unlock-notes">
        <li>投注流水同步可能存在延迟，如当前解锁额度与实际情况不符，请稍后刷新并重新查看。</li>
        <li>充值或活动的盈利金额会在所有提现流水完成后一并解锁。</li>
      </ol>
    </section>
  </div>

  return <main className="h5-preview-stage"><section className="h5-withdraw-screen" aria-label="H5 提现页面">
    <header className="h5-withdraw-head">
      <button className="h5-back-button" aria-label="返回后台" onClick={onBack}><ArrowLeftOutlined /></button>
      <h1>提现</h1>
      <button className="h5-notes-button" onClick={onOpenNotes}><FileTextOutlined /><span>业务说明</span></button>
    </header>
    <div className="h5-withdraw-content">
      <section className="h5-balance-card">
        <div className="h5-balance-top"><span>中心钱包</span><button className="h5-recycle-button" onClick={() => onToast('已提交一键回收申请')}><ReloadOutlined />一键回收</button></div>
        <strong>74,528.50</strong>
        <div className="h5-balance-split"><div><span>锁定钱包</span><b>10,376.00</b></div><div><span>福利中心</span><b>0.00</b></div></div>
      </section>
      <button className={`h5-hide-empty-toggle ${hideZeroBalanceVenues ? 'active' : ''}`} type="button" role="switch" aria-checked={hideZeroBalanceVenues} onClick={() => setHideZeroBalanceVenues((current) => !current)}><span><EyeInvisibleOutlined /></span>隐藏无余额场馆</button>
      <section className="h5-withdraw-methods">
        <h2>提现方式</h2>
        <div className="h5-method-options">
          {METHODS.map((item) => <button key={item.key} className={`h5-method-card ${method === item.key ? 'selected' : ''}`} onClick={() => setMethod(item.key)}><span className={`h5-method-icon ${item.tone}`}>{item.icon}</span><b>{item.label}</b>{method === item.key && <i><CheckOutlined /></i>}</button>)}
        </div>
      </section>
      <section className="h5-withdraw-info">
        <div className="h5-withdraw-title-row"><h2>提现账户</h2><button onClick={() => onToast('已打开添加账户演示')}><PlusCircleFilled />添加账户</button></div>
        <button className="h5-account-card" onClick={() => onToast('已打开提现账户选择演示')}>
          <span className={`h5-method-icon ${METHODS.find((item) => item.key === method)?.tone || 'alipay'}`}>{METHODS.find((item) => item.key === method)?.icon}</span>
          <strong>{selectedAccount.name}<small>{selectedAccount.detail}</small></strong>
          <RightOutlined />
        </button>
      </section>
      <section className="h5-withdraw-info">
        <h2>提现金额 (CNY)</h2>
        <div className="h5-withdrawable-line">
          <p><span>可提现:<b>{money(WALLET.withdrawable)}</b></span><span>锁定:<b>{money(WALLET.locked)}</b></span></p>
          <button onClick={() => setShowUnlockConditions(true)}>解锁条件</button>
        </div>
        <label className="h5-amount-input"><b>¥</b><input value={amount} inputMode="decimal" placeholder={`单笔最大额度${money(WALLET.maxSingle)} CNY`} onChange={(event) => setAmount(event.target.value.replace(/[^\d.]/g, ''))} /></label>
        <div className="h5-fee-line"><span><InfoCircleFilled /></span><b>手续费：{money(WALLET.fee)} CNY</b><b>实际到账：<em>{money(arrivalAmount)} CNY</em></b><button onClick={() => onToast('已打开详情说明演示')}>详情说明</button></div>
        <p className="h5-min-amount">最低提现额度：{money(WALLET.min)} CNY</p>
      </section>
      <section className="h5-withdraw-info">
        <h2>资金密码</h2>
        <div className="h5-password-boxes">{Array.from({ length: 6 }).map((_, index) => <button key={index} aria-label={`资金密码第${index + 1}位`} onClick={() => onToast('资金密码输入为演示状态')} />)}</div>
        <button className="h5-submit-button" onClick={() => onToast('请先输入提现金额和资金密码')}>立即提现</button>
        <p className="h5-withdraw-time">可提现时间段为00:01–23:59,请您留意!</p>
      </section>
    </div>
    {showUnlockConditions && unlockDialog}
  </section></main>
}
