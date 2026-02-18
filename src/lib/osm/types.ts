import type { Feature, LineString, MultiLineString } from 'geojson'

export type BBox = [number, number, number, number] // [minLon, minLat, maxLon, maxLat]

export type RiverGeometry = {
  riverKey: string
  source: 'relation' | 'way-fallback'
  geojson: Feature<LineString | MultiLineString>
  bbox: BBox
}

export type RiverConfig = {
  key: string
  names: string[]
}

export type ReachRiverDistance = {
  upstreamStationId: string
  downstreamStationId: string
  distanceKm: number
  source: 'river-line'
  segmentGeojson: Feature<LineString>
}
