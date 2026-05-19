"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import type { Hospital } from "@/lib/hospitals-data"

interface Props {
  hospitals: Hospital[]
  selectedProvince?: string
}

const PREMIER_COLOR = "#00A4E4"  // sky-500
const STANDARD_COLOR = "#94a3b8"
const PREMIER_BORDER = "#003781"  // navy-700
const STANDARD_BORDER = "#64748b"

function makeIcon(L: typeof import("leaflet"), isPremier: boolean, score: number | null) {
  const size = isPremier ? 14 : 9
  const color = isPremier ? PREMIER_COLOR : STANDARD_COLOR
  const border = isPremier ? PREMIER_BORDER : STANDARD_BORDER
  const glow = isPremier && score && score >= 9 ? "box-shadow:0 0 0 3px rgba(0,164,228,0.35);" : ""
  return L.divIcon({
    className: "",
    html: `<div style="width:${size}px;height:${size}px;background:${color};border:2px solid ${border};border-radius:50%;${glow}"></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  })
}

function makePopup(h: Hospital): string {
  const ratingHtml = h.googleRating
    ? `<span style="font-size:12px;color:#92400e">★ ${h.googleRating.toFixed(1)}${h.googleReviews ? ` <span style="color:#9ca3af">(${h.googleReviews.toLocaleString()})</span>` : ""}</span>`
    : ""

  const tierBadge = h.tier === "Premier"
    ? `<span style="background:#e0f5ff;color:#00A4E4;border:1px solid #bae6fd;font-size:10px;font-weight:600;padding:1px 6px;border-radius:9999px;">Premier</span>`
    : ""
  const scoreBadge = h.tier === "Premier" && h.overallScore
    ? `<span style="background:#00A4E4;color:white;font-size:10px;font-weight:600;padding:1px 6px;border-radius:9999px;margin-left:4px;">${h.overallScore}/10</span>`
    : ""

  const specialtiesHtml =
    h.specialties && h.specialties.length > 0
      ? h.specialties.slice(0, 4).map((s) =>
          `<span style="font-size:10px;background:#e0f5ff;color:#00A4E4;border:1px solid #bae6fd;padding:1px 5px;border-radius:9999px;">${s}</span>`
        ).join(" ")
      : ""

  const mapsLink = h.mapsUrl
    ? `<a href="${h.mapsUrl}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#00A4E4;font-weight:500;text-decoration:none;">↗ Google Maps</a>`
    : ""

  return `
    <div style="min-width:180px;max-width:220px;font-family:system-ui,sans-serif;line-height:1.4;">
      ${tierBadge || scoreBadge ? `<div style="margin-bottom:4px;">${tierBadge}${scoreBadge}</div>` : ""}
      <div style="font-weight:600;font-size:13px;color:#0f172a;margin-bottom:2px;">${h.name}</div>
      <div style="font-size:11px;color:#6b7280;margin-bottom:4px;">📍 ${h.city || h.province}, Thailand</div>
      ${ratingHtml ? `<div style="margin-bottom:4px;">${ratingHtml}</div>` : ""}
      ${specialtiesHtml ? `<div style="display:flex;flex-wrap:wrap;gap:3px;margin-bottom:4px;">${specialtiesHtml}</div>` : ""}
      ${mapsLink}
    </div>`
}

export default function HospitalMap({ hospitals, selectedProvince }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<import("leaflet").Map | null>(null)
  const markersRef = useRef<import("leaflet").LayerGroup | null>(null)
  // Store resolved L so the markers effect can use it without re-importing
  const lRef = useRef<typeof import("leaflet") | null>(null)

  // Effect 1: init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    import("leaflet").then((L) => {
      // @ts-expect-error – _getIconUrl is internal
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(containerRef.current!, {
        center: [13.0, 101.5],
        zoom: 6,
        scrollWheelZoom: true,
      })

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      const markersLayer = L.layerGroup().addTo(map)

      mapRef.current = map
      markersRef.current = markersLayer
      lRef.current = L

      // Trigger the markers effect by populating refs (the hospitals effect sees null on first run)
      // We add initial markers directly here since the effect already fired with null refs
      const valid = hospitals.filter((h) => h.lat && h.lng)
      for (const h of valid) {
        const icon = makeIcon(L, h.tier === "Premier", h.overallScore)
        L.marker([h.lat!, h.lng!], { icon })
          .bindPopup(makePopup(h), { maxWidth: 240 })
          .addTo(markersLayer)
      }

      // Fit to Thailand bounds initially
      map.fitBounds([[5.5, 97.5], [20.5, 105.8]])
    })

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
        markersRef.current = null
        lRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Effect 2: update markers whenever the filtered hospitals list changes
  useEffect(() => {
    const L = lRef.current
    const layer = markersRef.current
    const map = mapRef.current
    if (!L || !layer || !map) return  // map not ready yet

    layer.clearLayers()
    const valid = hospitals.filter((h) => h.lat && h.lng)
    for (const h of valid) {
      const icon = makeIcon(L, h.tier === "Premier", h.overallScore)
      L.marker([h.lat!, h.lng!], { icon })
        .bindPopup(makePopup(h), { maxWidth: 240 })
        .addTo(layer)
    }

    // Zoom to filtered hospitals when a province is selected
    if (selectedProvince && valid.length > 0) {
      const bounds = L.latLngBounds(valid.map((h) => [h.lat!, h.lng!] as [number, number]))
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 12 })
    } else if (!selectedProvince) {
      map.fitBounds([[5.5, 97.5], [20.5, 105.8]])
    }
  }, [hospitals, selectedProvince])

  return (
    <div
      ref={containerRef}
      style={{ height: "100%", width: "100%" }}
      aria-label="Map showing Allianz Ayudhya hospital network locations across Thailand"
    />
  )
}
