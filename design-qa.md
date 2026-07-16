# Design QA

## Comparison target

- Source visual truth: `/var/folders/v8/fnkczfq12v92tk9mtwcq1_p40000gn/T/codex-clipboard-f1b32d19-2af0-4175-a601-fd4e02bb9f5f.png`, `/var/folders/v8/fnkczfq12v92tk9mtwcq1_p40000gn/T/codex-clipboard-7a05f9b1-3e52-4354-8a18-c04858b5d502.png`, `/var/folders/v8/fnkczfq12v92tk9mtwcq1_p40000gn/T/codex-clipboard-69b6ed5d-d3c8-4905-8502-4c7f6500af39.png`, and `/var/folders/v8/fnkczfq12v92tk9mtwcq1_p40000gn/T/codex-clipboard-c8dda574-d899-4193-a374-0d07e063bd7a.png`.
- Source intent: H5 withdrawal method selected state, account card, withdrawal amount input, fee/arrival row, fund-password boxes, and the added unlock-condition entry.
- Implementation viewport: Codex in-app browser local preview at `http://localhost:5173/`.
- State tested: H5 withdrawal page after selecting a withdrawal method; unlock-condition dialog opened from the amount section.

## Findings

- No actionable P0/P1/P2 differences remain in the focused implementation area.
- The withdrawal-method expanded state now matches the reference structure: method cards, selected account, CNY amount input, fee and arrival information, fund-password boxes, and submit button.
- The requested addition is present between `提现金额 (CNY)` and the amount input: `可提现` amount, `锁定` amount, and a right-side `解锁条件` button.
- The unlock-condition dialog is fixed to the viewport and combines venue turnover, recharge turnover, and bonus turnover in one table with `流水类型 / 锁定额度 / 还需解锁流水`; the profit unlock amount row is no longer shown in H5.
- The unlock-condition dialog first column now displays direct names: venue rows use venue names, recharge rows use `充值`, and bonus rows use the actual bonus name such as `VIP周礼金`.
- The unlock-condition dialog no longer shows records whose status is `已解锁`; only records that still need unlock are visible.
- The H5 page no longer shows the standalone `业务及需求说明 · 2026-07-16 16:21` timestamp line, while keeping the explicit `业务说明` entry in the header.
- The unlock-condition dialog footer now uses the delayed-statistics reminder: `投注流水同步可能存在延迟，如当前解锁额度与实际情况不符，请稍后刷新并重新查看。`

## Implementation checklist

- [x] Move withdrawable and locked amounts above the CNY withdrawal input with simplified labels and no unit suffix.
- [x] Add `解锁条件` button and dialog.
- [x] Merge existing venue and recharge unlock data into one dialog table.
- [x] Remove the H5 profit unlock amount row from the unlock-condition dialog.
- [x] Hide unlocked records from the H5 unlock-condition dialog.
- [x] Simplify the unlock-condition first column to direct names without `场馆流水 ·` or `充值流水 ·` prefixes.
- [x] Remove the visible business-requirement timestamp line under the H5 page header.
- [x] Replace the unlock-condition footer copy with the delayed-statistics reminder.
- [x] Preserve the H5 business-notes entry and update its modification time.
- [x] Update the version-requirements H5 entry.
- [x] Run `npm run build` successfully.
- [x] Verify local H5 interaction in the in-app browser with no console errors.

final result: passed
