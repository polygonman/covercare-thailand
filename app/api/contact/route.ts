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

  if (process.env.RESEND_API_KEY) {
    const { sendLeadNotification, sendLeadConfirmation } = await import("@/lib/email")
    await Promise.all([sendLeadNotification(lead), sendLeadConfirmation(lead)])
  } else {
    console.log("[contact] Lead received (no email API key configured):", lead)
  }

  return NextResponse.json({ success: true, score: lead.score })
}
