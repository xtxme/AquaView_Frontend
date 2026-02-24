# StationRiskHero KPI Replacement Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the right-side summary box in `StationRiskHero` with three KPI values matching the station overview data set.

**Architecture:** Keep `StationRiskHero` as the same component and swap only the right-side panel internals from one large number to a small KPI list. Extend props and pass computed values from the station page container.

**Tech Stack:** Next.js App Router, React, TypeScript, styled-components

---

### Task 1: Extend StationRiskHero props and UI

**Files:**
- Modify: `src/app/components/dashboard/station/station-risk-hero.tsx`

**Step 1: Update props interface**
Add `nearOverflowPercentage` and `warningLevel` to `StationRiskHeroProps`.

**Step 2: Replace right panel markup**
Render three KPI rows/cards for water level, percent near bank, and warning threshold, while keeping updated timestamp text.

**Step 3: Adjust styles**
Update right panel styles so labels/values remain readable and responsive.

### Task 2: Pass new props from station page

**Files:**
- Modify: `src/app/(protected)/dashboard/station/page.tsx`

**Step 1: Update `StationRiskHero` usage**
Pass `nearOverflowPercentage` and `warningLevel` from existing computed values.

**Step 2: Verify prop usage**
Search for other `StationRiskHero` usages and confirm no missing required props.

### Task 3: Quick verification

**Files:**
- N/A

**Step 1: Static check by search/read**
Confirm component usage compiles conceptually (all required props provided) and strings/formatting look correct.
