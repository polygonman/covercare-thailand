"use client"

import { useEffect, useRef } from "react"
import "leaflet/dist/leaflet.css"
import type { Hospital } from "@/lib/hospitals-data"

interface Props {
  hospitals: Hospital[]
  selectedProvince?: string
}

// Marker colors per tier
const PREMIER_COLOR = "#0f766e"  // teal-700
const STANDARD_COLOR = "#94a3b8" // slate-400
const PREMIER_BORDER = "#065f46"
const STANDARD_BORDER = "#64748b"

function makeIcon(L: typeof import("leaflet"), isPremier: boolean, score: number | null) {
  const size = isPremier ? 14 : 9
  const color = isPremier ? PREMIER_COLOR : STANDARD_COLOR
  const border = isPremier ? PREMIER_BORDER : STANDARD_BORDER
  const opacity = isPremier ? 1 : 0.7

  return L.divIcon({
    className: "",
    html: `<div style="
      width:${size}px;
      height:${size}px;
      background:${color};
      border:2px solid ${border};
      border-radius:50%;
      opacity:${opacity};
      ${isPremier && score && score >= 9 ? "box-shadow:0 0 0 3px rgba(15,118,110,0.3);" : ""}
    "></div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2 - 4],
  })
}

function makePopup(h: Hospital): string {
  const ratingHtml = h.googleRating
    ? `<span style="display:inline-flex;align-items:center;gap:3px;font-size:12px;color:#92400e">
        ★ ${h.googleRating.toFixed(1)}
        ${h.googleReviews ? `<span style="color:#9ca3af">(${h.googleReviews.toLocaleString()})</span>` : ""}
       </span>`
    : ""

  const badgeHtml = h.tier === "Premier" && h.overallScore
    ? `<span style="
        display:inline-block;
        background:#0f766e;
        color:white;
        font-size:10px;
        font-weight:600;
        padding:1px 6px;
        border-radius:9999px;
        margin-left:4px;
      ">${h.overallScore}/10</span>`
    : ""

  const tierBadge = h.tier === "Premier"
    ? `<span style="
        display:inline-block;
        background:#f0fdfa;
        color:#0f766e;
        border:1px solid #99f6e4;
        font-size:10px;
        font-weight:600;
        padding:1px 6px;
        border-radius:9999px;
      ">Premier</span>`
    : ""

  const mapsLink = h.mapsUrl
    ? `<a href="${h.mapsUrl}" target="_blank" rel="noopener noreferrer"
        style="display:inline-flex;align-items:center;gap:3px;font-size:11px;color:#0f766e;font-weight:500;text-decoration:none;margin-top:4px;">
        ↗ View on Google Maps
       </a>`
    : ""

  const specialtiesHtml =
    h.tier === "Premier" && h.specialties && h.specialties.length > 0
      ? `<div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:5px;">
          ${h.specialties
            .slice(0, 4)
            .map(
              (s) =>
                `<span style="font-size:10px;background:#f0fdfa;color:#0f766e;border:1px solid #99f6e4;padding:1px 5px;border-radius:9999px;">${s}</span>`
            )
            .join("")}
         </div>`
      : ""

  return `
    <div style="min-width:180px;max-width:220px;font-family:system-ui,sans-serif;">
      <div style="display:flex;align-items:center;gap:4px;margin-bottom:4px;">
        ${tierBadge}
        ${badgeHtml}
      </div>
      <div style="font-weight:600;font-size:13px;color:#0f172a;line-height:1.4;margin-bottom:3px;">
        ${h.name}
      </div>
      <div style="font-size:11px;color:#6b7280;margin-bottom:3px;">
        📍 ${h.city || h.province}, Thailand
      </div>
      ${ratingHtml ? `<div style="margin-bottom:3px;">${ratingHtml}</div>` : ""}
      ${specialtiesHtml}
      ${mapsLink ? `<div>${mapsLink}</div>` : ""}
    </div>
  `
}

export default function HospitalMap({ hospitals, selectedProvince }: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null)

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    // Dynamically import leaflet (browser-only)
    import("leaflet").then((L) => {
      // Fix default icon URL path issues with Next.js bundler
      // @ts-expect-error – _getIconUrl is internal
      delete L.Icon.Default.prototype._getIconUrl
      L.Icon.Default.mergeOptions({
        iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      })

      const map = L.map(mapRef.current!, {
        center: [13.75, 100.52],
        zoom: 6,
        zoomControl: true,
        scrollWheelZoom: true,
      })

      mapInstanceRef.current = map

      // OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      // Add markers
      const validHospitals = hospitals.filter((h) => h.lat && h.lng)

      for (const h of validHospitals) {
        const isPremier = h.tier === "Premier"
        const icon = makeIcon(L, isPremier, h.overallScore)
        const marker = L.marker([h.lat!, h.lng!], { icon })
        marker.bindPopup(makePopup(h), {
          maxWidth: 240,
          className: "hospital-popup",
        })
        marker.addTo(map)
      }

      // Fit bounds to Thailand if no province filter
      if (!selectedProvince) {
        map.fitBounds([
          [5.5, 97.5],
          [20.5, 105.8],
        ])
      }
    })

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      ref={mapRef}
      style={{ height: "100%", width: "100%" }}
      aria-label="Map showing Allianz Ayudhya hospital network locations across Thailand"
    />
  )
}
