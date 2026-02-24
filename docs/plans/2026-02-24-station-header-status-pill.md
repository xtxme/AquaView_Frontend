# Station Header Status Pill Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Make the status badge in the station header use the same capsule visual style as the `status-row` badge in `station-risk-hero`.

**Architecture:** Update `src/app/components/dashboard/station/station-header.tsx` only. Reuse the existing status color tokens and add the same pill sizing/spacing plus a matching status icon per state.

**Tech Stack:** React, TypeScript, styled-components, lucide-react

---

### Task 1: Update Station Header Status Badge UI

**Files:**
- Modify: `src/app/components/dashboard/station/station-header.tsx`

**Step 1: Update badge styles**
- Change `StatusBadge` to pill/capsule layout (`inline-flex`, centered items, gap, larger pill radius, stronger weight).
- Keep status color mapping (`normal`, `warning`, `critical`) using existing CSS vars.

**Step 2: Add status icon mapping**
- Import `CheckCircle2`, `AlertTriangle`, `ShieldAlert` from `lucide-react`.
- Render the icon inside the badge before the text.

**Step 3: Keep layout behavior**
- Preserve right alignment with `margin-left: auto` in `HeaderContainer`.

**Step 4: Sanity check**
- Confirm TypeScript compiles for the edited component and badge displays correctly in header.
