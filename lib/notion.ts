import type { Lead } from "@/types/lead"

const NOTION_API = "https://api.notion.com/v1"
const NOTION_VERSION = "2022-06-28"

function headers() {
  return {
    Authorization: `Bearer ${process.env.NOTION_TOKEN}`,
    "Content-Type": "application/json",
    "Notion-Version": NOTION_VERSION,
  }
}

export async function createLeadRow(lead: Lead): Promise<void> {
  const dbId = process.env.NOTION_DATABASE_ID
  if (!dbId || !process.env.NOTION_TOKEN) {
    console.log("[notion] Skipped — NOTION_TOKEN or NOTION_DATABASE_ID not set")
    return
  }

  const body = {
    parent: { database_id: dbId },
    properties: {
      Name: { title: [{ text: { content: lead.name } }] },
      Email: { email: lead.email },
      WhatsApp: { phone_number: lead.whatsapp },
      Segment: { select: { name: lead.segment } },
      Needs: { multi_select: lead.needs.map((n) => ({ name: n })) },
      Score: { number: lead.score },
      Status: { select: { name: "New" } },
      ...(lead.message ? { Message: { rich_text: [{ text: { content: lead.message } }] } } : {}),
      Submitted: { date: { start: lead.createdAt } },
    },
  }

  const res = await fetch(`${NOTION_API}/pages`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error("[notion] Failed to create row:", err)
  }
}
