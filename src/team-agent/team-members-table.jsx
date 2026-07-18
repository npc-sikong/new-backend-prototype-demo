import { UserAddOutlined } from '@ant-design/icons'
import { Button, DataTable, Money, StatusTag } from './ui'

export function TeamMembersTable({ team, onInspect, onAddSecondary }) {
  const columns = [
    { key: 'identity', label: '身份', render: (value) => <StatusTag tone={['主线', '团队负责人'].includes(value) ? 'blue' : 'gray'}>{value === '主线' ? '团队负责人' : value}</StatusTag> },
    { key: 'lineId', label: 'line_id' },
    { key: 'agent', label: '代理名称', render: (value) => <b>{value}</b> },
    { key: 'activeMembers', label: '活跃会员', render: (value, row) => <button className="ta-table-link" disabled={!Number(value)} onClick={() => onInspect(row, 'activeMembers')}>{value}</button> },
    { key: 'newActive', label: '新增活跃', render: (value, row) => <button className="ta-table-link" disabled={!Number(value)} onClick={() => onInspect(row, 'newActive')}>{value}</button> },
    { key: 'firstDepositCount', label: '新增首存', render: (value) => Number(value || 0) },
    { key: 'firstDepositAmount', label: '首存额度', render: (value) => <Money value={value} /> },
    { key: 'netWinLoss', label: '总盈亏', render: (value) => <Money value={value} signed /> },
    { key: 'startCycle', label: '生效周期' },
    { key: 'status', label: '状态', render: (value) => <StatusTag>{value}</StatusTag> },
  ]

  return <div className="team-members-modal-content">
    <div className="team-members-modal-toolbar">
      <span>共 {team.lines.length} 名团队成员</span>
      {onAddSecondary && <Button icon={<UserAddOutlined />} size="small" onClick={onAddSecondary}>开副线</Button>}
    </div>
    <DataTable columns={columns} rows={team.lines} rowKey="lineId" minWidth={1180} paginated />
  </div>
}
