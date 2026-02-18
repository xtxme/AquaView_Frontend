import type { BBox, RiverConfig, RiverGeometry } from '@/lib/osm/types'

function serializeBbox(bbox: BBox): string {
  return bbox.map((value) => value.toFixed(6)).join(',')
}

export async function fetchRiverGeometryFromOverpass(
  river: RiverConfig,
  aroundBbox: BBox
): Promise<RiverGeometry> {
  const params = new URLSearchParams({
    riverKey: river.key,
    bbox: serializeBbox(aroundBbox),
  })

  const response = await fetch(`/api/osm/river-geometry?${params.toString()}`)
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Failed to fetch river geometry (${response.status})`)
  }

  return (await response.json()) as RiverGeometry
}
