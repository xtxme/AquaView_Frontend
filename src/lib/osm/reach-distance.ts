import lineSlice from '@turf/line-slice'
import length from '@turf/length'
import nearestPointOnLine from '@turf/nearest-point-on-line'
import { lineString, point } from '@turf/helpers'
import type { Feature, LineString, MultiLineString } from 'geojson'
import type { ReachRiverDistance } from '@/lib/osm/types'

const MAX_SNAP_DISTANCE_KM = 1.5

type Coordinate = [number, number]

type Candidate = {
  segment: Feature<LineString>
  distanceKm: number
}

function toLineFeatures(riverFeature: Feature<LineString | MultiLineString>): Feature<LineString>[] {
  if (riverFeature.geometry.type === 'LineString') {
    return [lineString(riverFeature.geometry.coordinates as Coordinate[])]
  }

  return riverFeature.geometry.coordinates
    .filter((coordinates) => coordinates.length >= 2)
    .map((coordinates) => lineString(coordinates as Coordinate[]))
}

function isValidSnapDistance(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value <= MAX_SNAP_DISTANCE_KM
}

function computeCandidate(
  lineFeature: Feature<LineString>,
  upstream: Coordinate,
  downstream: Coordinate
): Candidate | null {
  const upstreamPoint = point(upstream)
  const downstreamPoint = point(downstream)

  const upstreamSnap = nearestPointOnLine(lineFeature, upstreamPoint, { units: 'kilometers' })
  const downstreamSnap = nearestPointOnLine(lineFeature, downstreamPoint, { units: 'kilometers' })

  const upstreamDist = upstreamSnap.properties?.dist
  const downstreamDist = downstreamSnap.properties?.dist
  if (!isValidSnapDistance(upstreamDist) || !isValidSnapDistance(downstreamDist)) {
    return null
  }

  const sliced = lineSlice(upstreamSnap, downstreamSnap, lineFeature)
  if (sliced.geometry.coordinates.length < 2) {
    return null
  }

  const distanceKm = length(sliced, { units: 'kilometers' })
  if (!Number.isFinite(distanceKm) || distanceKm <= 0) {
    return null
  }

  return {
    segment: sliced,
    distanceKm,
  }
}

export function computeReachDistanceOnRiver(
  riverFeature: Feature<LineString | MultiLineString>,
  upstream: Coordinate,
  downstream: Coordinate,
  upstreamStationId = 'upstream',
  downstreamStationId = 'downstream'
): ReachRiverDistance | null {
  const candidates: Candidate[] = []
  const lines = toLineFeatures(riverFeature)

  for (const lineFeature of lines) {
    const candidate = computeCandidate(lineFeature, upstream, downstream)
    if (candidate) {
      candidates.push(candidate)
    }
  }

  if (candidates.length === 0) {
    return null
  }

  candidates.sort((a, b) => a.distanceKm - b.distanceKm)
  const best = candidates[0]

  return {
    upstreamStationId,
    downstreamStationId,
    distanceKm: Number(best.distanceKm.toFixed(3)),
    source: 'river-line',
    segmentGeojson: best.segment,
  }
}
