# StationRiskHero KPI Replacement Design

**Context**
The station page hero (`src/app/components/dashboard/station/station-risk-hero.tsx`) currently shows a single right-side summary card with latest water level and timestamp. The requested change is to replace that right-side content with the same key metrics set used elsewhere in the station overview UI.

## Goal
Replace the right-side hero summary with three KPI values:
- ระดับน้ำปัจจุบัน
- ใกล้ตลิ่ง
- ระดับเฝ้าระวัง (เริ่มเตือน)

Keep the left-side status/message/recommendation content unchanged.

## Scope
- Modify `StationRiskHero` props to accept `nearOverflowPercentage` and `warningLevel` (keep `waterLevel` and `updatedAtLabel`).
- Update `src/app/(protected)/dashboard/station/page.tsx` to pass the additional props.
- Preserve responsive behavior and timestamp display under the KPI set.

## Non-Goals
- Rebuild the full hero layout to match the overview card exactly.
- Extract shared KPI component in this change.
