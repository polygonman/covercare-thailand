"use client"

import { usePathname, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { track } from "@/lib/analytics"

export default function PageViewTracker() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : "")
    track("$pageview", { $current_url: url })
  }, [pathname, searchParams])

  return null
}
