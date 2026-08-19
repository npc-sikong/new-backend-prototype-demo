export const REBATE_HANDICAP_LIMITS = { 'A盘': 6, 'B盘': 4, 'C盘': 2, 'D盘': 1 }

export function rebateOddsOf(rate) {
  const normalized = Number(rate)
  return Number.isFinite(normalized) ? Math.max(0, 2 - normalized * 0.02).toFixed(2) : '—'
}
export const REBATE_HANDICAP_OPTIONS = Object.entries(REBATE_HANDICAP_LIMITS).map(([handicap, limit]) => ({ value: handicap, label: `${handicap}｜返水上限${limit.toFixed(2)}%｜赔率${rebateOddsOf(limit)}` }))
export const REBATE_HANDICAP_SUMMARY = REBATE_HANDICAP_OPTIONS.map((item) => item.label.replaceAll('｜', ' ')).join('；')
