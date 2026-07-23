const RECOMMENDER_BY_ACCOUNT = {
  gaodashang: 'charles',
  WC002: 'charles',
  LGNB: 'WC002',
  dailiwc001: 'apppay',
  dailiwc001a: 'hddaili',
  FEE0428_A8: 'fee0428',
}

const ACCOUNT_KEYS = ['account', 'agent', 'agentName', 'agentAccount', 'payee', 'mainAgent', 'mainAccount', 'owner']

export function recommenderOf(record) {
  if (!record) return '—'
  if (record.recommender && record.recommender !== '无推荐人') return record.recommender
  const account = ACCOUNT_KEYS.map((key) => record[key]).find(Boolean)
  return RECOMMENDER_BY_ACCOUNT[account] || '—'
}

export function recommenderColumn() {
  return { key: 'recommender', label: '推荐人', render: (_, row) => recommenderOf(row) }
}
