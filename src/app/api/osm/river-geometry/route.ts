import { NextRequest, NextResponse } from 'next/server'
import type { Feature, LineString, MultiLineString, Position } from 'geojson'
import { getRiverConfigByKey } from '@/lib/osm/config'
import type { BBox, RiverGeometry } from '@/lib/osm/types'

const OVERPASS_API_URL = process.env.OVERPASS_API_URL ?? 'https://overpass-api.de/api/interpreter'
const CACHE_TTL_MS = 6 * 60 * 60 * 1000
const REQUEST_TIMEOUT_MS = 12_000
const MIN_SEGMENT_M = 30
const ENDPOINT_EPSILON = 0.0002
const MIN_BBOX_SIZE_DEG = 0.0005

type CacheEntry = {
  expiresAt: number
  value: RiverGeometry
}

type OverpassGeometryPoint = {
  lat: number
  lon: number
}

type OverpassWayElement = {
  type: 'way'
  id: number
  geometry?: OverpassGeometryPoint[]
  tags?: Record<string, string>
}

type OverpassRelationMember = {
  type: 'way' | 'node' | 'relation'
  ref: number
}

type OverpassRelationElement = {
  type: 'relation'
  id: number
  members?: OverpassRelationMember[]
}

type OverpassElement = OverpassWayElement | OverpassRelationElement | { type: string; id: number }

type OverpassResponse = {
  elements: OverpassElement[]
}

const geometryCache = new Map<string, CacheEntry>()

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function parseBbox(rawBbox: string): BBox | null {
  const values = rawBbox.split(',').map((value) => Number(value.trim()))
  if (values.length !== 4 || values.some((value) => Number.isNaN(value))) {
    return null
  }

  const [minLon, minLat, maxLon, maxLat] = values
  if (minLon >= maxLon || minLat >= maxLat) {
    return null
  }

  return [minLon, minLat, maxLon, maxLat]
}

function expandBbox(bbox: BBox, paddingDeg = 0.08): BBox {
  const [minLon, minLat, maxLon, maxLat] = bbox
  return [
    clamp(minLon - paddingDeg, -180, 180),
    clamp(minLat - paddingDeg, -90, 90),
    clamp(maxLon + paddingDeg, -180, 180),
    clamp(maxLat + paddingDeg, -90, 90),
  ]
}

function roundBbox(bbox: BBox, decimals = 4): BBox {
  const factor = 10 ** decimals
  return bbox.map((value) => Math.round(value * factor) / factor) as BBox
}

function bboxToOverpassArea(bbox: BBox): string {
  const [minLon, minLat, maxLon, maxLat] = bbox
  return `${minLat},${minLon},${maxLat},${maxLon}`
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function buildNamePattern(names: string[]): string {
  return names.map(escapeRegex).join('|')
}

function buildRelationQuery(names: string[], bbox: BBox): string {
  const pattern = buildNamePattern(names)
  const overpassBbox = bboxToOverpassArea(bbox)
  return `
[out:json][timeout:25];
(
  relation["type"="waterway"]["waterway"="river"]["name"~"^(${pattern})$",i](${overpassBbox});
  relation["waterway"="river"]["name"~"^(${pattern})$",i](${overpassBbox});
  relation["type"="waterway"]["waterway"="river"]["name:th"~"^(${pattern})$",i](${overpassBbox});
);
(._;>;);
out body geom;
`.trim()
}

function buildWayFallbackQuery(bbox: BBox): string {
  return `
[out:json][timeout:25];
way["waterway"="river"](${bboxToOverpassArea(bbox)});
out body geom;
`.trim()
}

async function fetchOverpass(query: string, timeoutMs: number): Promise<OverpassResponse> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(OVERPASS_API_URL, {
      method: 'POST',
      headers: { 'content-type': 'text/plain' },
      body: query,
      signal: controller.signal,
      cache: 'no-store',
    })

    if (!response.ok) {
      const message = await response.text()
      throw new Error(message || `Overpass request failed (${response.status})`)
    }

    return (await response.json()) as OverpassResponse
  } finally {
    clearTimeout(timeout)
  }
}

async function fetchOverpassWithRetry(query: string): Promise<OverpassResponse> {
  try {
    return await fetchOverpass(query, REQUEST_TIMEOUT_MS)
  } catch {
    return fetchOverpass(query, REQUEST_TIMEOUT_MS)
  }
}

function pointInBbox(point: Position, bbox: BBox): boolean {
  const [lon, lat] = point
  const [minLon, minLat, maxLon, maxLat] = bbox
  return lon >= minLon && lon <= maxLon && lat >= minLat && lat <= maxLat
}

function coordinateDistanceMeters(a: Position, b: Position): number {
  const toRad = (value: number) => (value * Math.PI) / 180
  const [lon1, lat1] = a
  const [lon2, lat2] = b

  const r = 6371000
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const lat1Rad = toRad(lat1)
  const lat2Rad = toRad(lat2)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
  return r * c
}

function lineLengthMeters(line: Position[]): number {
  let total = 0
  for (let index = 1; index < line.length; index += 1) {
    total += coordinateDistanceMeters(line[index - 1], line[index])
  }
  return total
}

function toPositions(geometry?: OverpassGeometryPoint[]): Position[] {
  if (!geometry || geometry.length < 2) {
    return []
  }

  const points: Position[] = []
  for (const point of geometry) {
    const lon = Number(point.lon)
    const lat = Number(point.lat)
    if (!Number.isFinite(lon) || !Number.isFinite(lat)) {
      continue
    }

    const next: Position = [lon, lat]
    const last = points[points.length - 1]
    if (!last || last[0] !== next[0] || last[1] !== next[1]) {
      points.push(next)
    }
  }

  return points.length >= 2 ? points : []
}

function endpointsAlmostEqual(a: Position, b: Position): boolean {
  return Math.abs(a[0] - b[0]) <= ENDPOINT_EPSILON && Math.abs(a[1] - b[1]) <= ENDPOINT_EPSILON
}

function reverseLine(line: Position[]): Position[] {
  return [...line].reverse()
}

function mergeSegments(segments: Position[][]): Position[][] {
  const remaining = segments
    .map((segment) => [...segment])
    .filter((segment) => segment.length >= 2)

  const chains: Position[][] = []

  while (remaining.length > 0) {
    let current = remaining.shift()
    if (!current) {
      continue
    }

    let mergedAny = true
    while (mergedAny) {
      mergedAny = false

      for (let index = 0; index < remaining.length; index += 1) {
        const candidate = remaining[index]
        const currentStart = current[0]
        const currentEnd = current[current.length - 1]
        const candidateStart = candidate[0]
        const candidateEnd = candidate[candidate.length - 1]

        let merged: Position[] | null = null

        if (endpointsAlmostEqual(currentEnd, candidateStart)) {
          merged = [...current, ...candidate.slice(1)]
        } else if (endpointsAlmostEqual(currentEnd, candidateEnd)) {
          merged = [...current, ...reverseLine(candidate).slice(1)]
        } else if (endpointsAlmostEqual(currentStart, candidateEnd)) {
          merged = [...candidate, ...current.slice(1)]
        } else if (endpointsAlmostEqual(currentStart, candidateStart)) {
          merged = [...reverseLine(candidate), ...current.slice(1)]
        }

        if (merged) {
          current = merged
          remaining.splice(index, 1)
          mergedAny = true
          break
        }
      }
    }

    chains.push(current)
  }

  return chains
}

function computeBbox(lines: Position[][]): BBox {
  const longitudes: number[] = []
  const latitudes: number[] = []

  for (const line of lines) {
    for (const [lon, lat] of line) {
      longitudes.push(lon)
      latitudes.push(lat)
    }
  }

  return [
    Math.min(...longitudes),
    Math.min(...latitudes),
    Math.max(...longitudes),
    Math.max(...latitudes),
  ]
}

function toFeature(lines: Position[][]): Feature<LineString | MultiLineString> {
  if (lines.length === 1) {
    return {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: lines[0],
      },
    }
  }

  return {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiLineString',
      coordinates: lines,
    },
  }
}

function scoreLineOverlap(line: Position[], bbox: BBox): number {
  let score = 0
  for (const point of line) {
    if (pointInBbox(point, bbox)) {
      score += 1
    }
  }
  return score
}

function collectRelationSegments(response: OverpassResponse, targetBbox: BBox): Position[][] {
  const wayMap = new Map<number, OverpassWayElement>()
  const relations: OverpassRelationElement[] = []

  for (const element of response.elements) {
    if (element.type === 'way') {
      wayMap.set(element.id, element)
    } else if (element.type === 'relation') {
      relations.push(element)
    }
  }

  if (relations.length === 0) {
    return []
  }

  let bestSegments: Position[][] = []
  let bestScore = -1

  for (const relation of relations) {
    const segments: Position[][] = []
    for (const member of relation.members ?? []) {
      if (member.type !== 'way') {
        continue
      }

      const way = wayMap.get(member.ref)
      const points = toPositions(way?.geometry)
      if (points.length >= 2) {
        segments.push(points)
      }
    }

    if (segments.length === 0) {
      continue
    }

    const score = segments.reduce((total, line) => total + scoreLineOverlap(line, targetBbox), 0)
    if (score > bestScore) {
      bestScore = score
      bestSegments = segments
    }
  }

  return bestSegments
}

function collectFallbackWaySegments(response: OverpassResponse): Position[][] {
  const segments: Position[][] = []
  for (const element of response.elements) {
    if (element.type !== 'way') {
      continue
    }

    if (element.tags?.waterway !== 'river') {
      continue
    }

    const points = toPositions(element.geometry)
    if (points.length < 2) {
      continue
    }

    if (lineLengthMeters(points) < MIN_SEGMENT_M) {
      continue
    }

    segments.push(points)
  }

  return segments
}

function normalizeGeometry(
  riverKey: string,
  source: RiverGeometry['source'],
  segments: Position[][]
): RiverGeometry {
  const merged = mergeSegments(segments)
  if (merged.length === 0) {
    throw new Error('River geometry is empty after normalization.')
  }

  return {
    riverKey,
    source,
    geojson: toFeature(merged),
    bbox: computeBbox(merged),
  }
}

function validateBboxSize(bbox: BBox): boolean {
  const [minLon, minLat, maxLon, maxLat] = bbox
  return maxLon - minLon >= MIN_BBOX_SIZE_DEG && maxLat - minLat >= MIN_BBOX_SIZE_DEG
}

export async function GET(request: NextRequest) {
  const riverKey = request.nextUrl.searchParams.get('riverKey')?.trim()
  const bboxParam = request.nextUrl.searchParams.get('bbox')?.trim()

  if (!riverKey) {
    return NextResponse.json(
      { error: 'Missing required parameter: riverKey' },
      { status: 400 }
    )
  }

  if (!bboxParam) {
    return NextResponse.json({ error: 'Missing required parameter: bbox' }, { status: 400 })
  }

  const rawBbox = parseBbox(bboxParam)
  if (!rawBbox || !validateBboxSize(rawBbox)) {
    return NextResponse.json(
      { error: 'Invalid bbox. Expected minLon,minLat,maxLon,maxLat with non-trivial size.' },
      { status: 400 }
    )
  }

  const river = getRiverConfigByKey(riverKey)
  if (!river) {
    return NextResponse.json({ error: `Unknown riverKey: ${riverKey}` }, { status: 404 })
  }

  const paddedBbox = expandBbox(rawBbox)
  const roundedBbox = roundBbox(paddedBbox)
  const cacheKey = `${river.key}:${roundedBbox.join(',')}`

  const cached = geometryCache.get(cacheKey)
  if (cached && cached.expiresAt > Date.now()) {
    return NextResponse.json(cached.value)
  }

  try {
    const relationQuery = buildRelationQuery(river.names, paddedBbox)
    const relationResponse = await fetchOverpassWithRetry(relationQuery)
    const relationSegments = collectRelationSegments(relationResponse, paddedBbox)

    let riverGeometry: RiverGeometry
    if (relationSegments.length > 0) {
      riverGeometry = normalizeGeometry(river.key, 'relation', relationSegments)
    } else {
      const fallbackQuery = buildWayFallbackQuery(paddedBbox)
      const fallbackResponse = await fetchOverpassWithRetry(fallbackQuery)
      const fallbackSegments = collectFallbackWaySegments(fallbackResponse)
      if (fallbackSegments.length === 0) {
        return NextResponse.json(
          { error: 'River geometry not found from relation and fallback way query.' },
          { status: 404 }
        )
      }

      riverGeometry = normalizeGeometry(river.key, 'way-fallback', fallbackSegments)
    }

    geometryCache.set(cacheKey, {
      value: riverGeometry,
      expiresAt: Date.now() + CACHE_TTL_MS,
    })

    return NextResponse.json(riverGeometry)
  } catch (error) {
    console.error('[osm/river-geometry] Failed to fetch geometry:', error)
    return NextResponse.json(
      { error: 'Failed to fetch geometry from Overpass API.' },
      { status: 502 }
    )
  }
}
