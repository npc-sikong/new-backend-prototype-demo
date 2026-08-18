export const REBATE_HANDICAP_LIMITS = { 'A盘': 6, 'B盘': 4, 'C盘': 2, 'D盘': 1 }

export function rebateOddsOf(rate) {
  const normalized = Number(rate)
  return Number.isFinite(normalized) ? Math.max(0, 2 - normalized * 0.02).toFixed(2) : '—'
}

export function RebateOddsReference({ activeHandicap, activeRate, showHandicaps = true }) {
  if (!showHandicaps) return <div className="rebate-current-odds"><span>当前彩票赔率</span><strong>{rebateOddsOf(activeRate)}</strong><small>赔率 = 2.00 − 返水比例 × 0.02</small></div>
  return <div className="rebate-odds-reference">
    <header><div><strong>A/B/C/D盘口赔率参考</strong><small>返水比例按百分比展示，调整比例后当前盘口赔率实时变化</small></div><b>当前赔率 {rebateOddsOf(activeRate)}</b></header>
    <div className="rebate-odds-grid">{Object.entries(REBATE_HANDICAP_LIMITS).map(([handicap, limit]) => {
      const active = handicap === activeHandicap
      return <article className={active ? 'is-active' : ''} key={handicap}><span>{handicap}{active && <em>当前</em>}</span><div><small>返水上限</small><strong>{limit.toFixed(2)}%</strong></div><div><small>上限对应赔率</small><strong>{rebateOddsOf(limit)}</strong></div>{active && <div><small>当前设置</small><strong>{Number(activeRate || 0).toFixed(2)}% / {rebateOddsOf(activeRate)}</strong></div>}</article>
    })}</div>
    <footer>示例：返水4.00%对应赔率1.92；返水6.00%对应赔率1.88。</footer>
  </div>
}
