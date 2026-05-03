import { NextResponse } from "next/server"
import { z } from "zod"
import { scoreLead } from "@/types/lead"
import type { Lead } from "@/types/lead"

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().min(7),
  segment: z.enum(["corporate", "nomad", "tech", "retiree"]),
  needs: z.array(z.string()).min(1),
  message: z.string().optional(),
})

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid fields", details: parsed.error.flatten() }, { status: 400 })
  }

  const data = parsed.data
  const lead: Lead = {
    ...data,
    score: scoreLead(data.segment, data.needs),
    createdAt: new Date().toISOString(),
  }

  // Fan out to all destinations in parallel
  const tasks: Promise<unknown>[] = []

  // Formspree — always on, delivers to covercareTH@gmail.com
  tasks.push(
    (async () => {
      const form = new FormData()
      Object.entries({ ...lead, needs: lead.needs.join(", ") }).forEach(([k, v]) =>
        form.append(k, String(v))
      )
      await fetch("https://formspree.io/f/xzdodkda", {
        method: "POST",
        body: form,
        headers: { Accept: "application/json" },
      })
    })()
  )

  // Notion CRM — when credentials are configured
  tasks.push(import("@/lib/notion").then(({ createLeadRow }) => createLeadRow(lead)))

  // Resend emails — when API key is configured
  if (process.env.RESEND_API_KEY) {
    tasks.push(
      import("@/lib/email").then(({ sendLeadNotification, sendLeadConfirmation }) =>
        Promise.all([sendLeadNotification(lead), sendLeadConfirmation(lead)])
      )
    )
  }

  await Promise.allSettled(tasks)

  return NextResponse.json({ success: true, score: lead.score })
}
