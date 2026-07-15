# Design QA

## Comparison target

- Source visual truth: `/var/folders/v8/fnkczfq12v92tk9mtwcq1_p40000gn/T/codex-clipboard-81bfd8cb-9d12-4c78-9423-bdacc99abd5b.png` and `/var/folders/v8/fnkczfq12v92tk9mtwcq1_p40000gn/T/codex-clipboard-135e76ac-72fd-4b34-b2a9-36da6f075eb1.png`.
- Source intent: desktop H5 withdrawal composition, wide blue balance card, pale rounded turnover reminder, large section heading; the expanded venue content remains unchanged.
- Implementation viewport: 1707 × 960 in the Codex in-app browser.
- Implementation screenshots: `outputs/h5-final-collapsed.png` and `outputs/h5-final-expanded.png`.
- Combined comparison inputs: `outputs/design-qa-comparison-1.png` and `outputs/design-qa-comparison-2.png`.
- State: H5 withdrawal screen initially collapsed; expanded state tested with existing venue rows and formula; USDT remains selected.

## Findings

- No actionable P0/P1/P2 differences remain in the focused comparison region.
- The supplied references are cropped around the lower balance-card area, while the implementation capture includes the full H5 page header and total amount. This is an intentional crop difference; the shared blue-card, turnover-card, typography, spacing, and heading treatment were compared in the same visual region.
- Reference 1 shows a narrower wrapped turnover message and Reference 2 shows the horizontal message at a wider width. The implementation follows the wider responsive treatment at the verified desktop viewport and keeps the existing mobile rules below 720px.

## Comparison history

1. Baseline: the H5 page was rendered as a centered 390px phone card, with compact typography and a narrow wrapped turnover reminder.
2. Fix: desktop-only styles were added for the wide page surface, large blue balance card with bottom radius, pale rounded turnover reminder, large section heading, and scaled withdrawal method cards. The venue detail data, amounts, formula, toggle behavior, and method switching were not changed.
3. Post-fix evidence: `outputs/design-qa-comparison-1.png`, `outputs/design-qa-comparison-2.png`, `outputs/h5-final-collapsed.png`, and `outputs/h5-final-expanded.png`.

## Required fidelity surfaces

- Fonts and typography: retained the existing PingFang SC / Microsoft YaHei stack; desktop hierarchy now uses the reference's enlarged balance values, labels, turnover amount, and section heading.
- Spacing and layout rhythm: the desktop screen uses a wide white surface, balanced side padding, a wide blue card, a 40px card gap, and a large rounded turnover surface matching the reference proportions.
- Colors and visual tokens: retained the reference blue balance card, pale blue-gray turnover surface, dark slate copy, orange warning icon, and blue section marker.
- Image quality and asset fidelity: the existing empty-state asset remains unchanged; no new placeholder or CSS-drawn visual was introduced.
- Copy and content: all existing H5 copy, venue rows, locked amounts, completed turnover, remaining turnover, formula, and withdrawal methods remain present.

## Implementation checklist

- [x] Add desktop reference styling without changing H5 business content or toggle logic.
- [x] Preserve the expanded venue details and formula.
- [x] Preserve the visible business summary, modification date, and full business-notes entry.
- [x] Run `npm run build` successfully.
- [x] Verify the local page renders with no error overlay or browser console errors.
- [x] Verify the turnover card expands and exposes all three venues, six amounts, formula, and both withdrawal methods.

## Follow-up polish

- P3 only: if a second exact desktop viewport is required, tune the turnover-message wrap breakpoint against that viewport's crop.

final result: passed
