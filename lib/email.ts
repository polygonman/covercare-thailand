import { Resend } from 'resend'
import type { Lead } from '@/types/lead'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendLeadNotification(lead: Lead) {
  const scoreLabel = lead.score >= 70 ? '🔥 HOT' : lead.score >= 40 ? '⚡ WARM' : '❄️ COLD'

  await resend.emails.send({
    from: 'CoverCare Thailand <leads@thaicovercare.com>',
    to: 'covercareTH@gmail.com',
    subject: `[${scoreLabel}] New Lead: ${lead.name} (${lead.segment})`,
    html: `
      <h2>New Lead — Score: ${lead.score}/100 ${scoreLabel}</h2>
      <table style="border-collapse:collapse;width:100%">
        <tr><td><strong>Name</strong></td><td>${lead.name}</td></tr>
        <tr><td><strong>Email</strong></td><td>${lead.email}</td></tr>
        <tr><td><strong>WhatsApp</strong></td><td>${lead.whatsapp}</td></tr>
        <tr><td><strong>Segment</strong></td><td>${lead.segment}</td></tr>
        <tr><td><strong>Needs</strong></td><td>${lead.needs.join(', ')}</td></tr>
        ${lead.message ? `<tr><td><strong>Message</strong></td><td>${lead.message}</td></tr>` : ''}
        <tr><td><strong>Submitted</strong></td><td>${lead.createdAt}</td></tr>
      </table>
      <p><a href="https://wa.me/${lead.whatsapp.replace(/\D/g, '')}">
        Reply on WhatsApp →
      </a></p>
    `,
  })
}

export async function sendLeadConfirmation(lead: Lead) {
  await resend.emails.send({
    from: 'Tonkla at CoverCare Thailand <covercareTH@gmail.com>',
    to: lead.email,
    subject: "I'll be in touch soon — CoverCare Thailand",
    html: `
      <p>Hi ${lead.name},</p>
      <p>Thank you for reaching out! I'm Tonkla, your dedicated health insurance advisor at CoverCare Thailand.</p>
      <p>I'll personally follow up within 24 hours to discuss the best Allianz Ayudhya plan for your situation.</p>
      <p>In the meantime, feel free to WhatsApp me directly at <strong>+66 61 196 5363</strong>.</p>
      <br/>
      <p>Best regards,<br/>Tonkla<br/>CoverCare Thailand<br/>
      <a href="https://www.thaicovercare.com">www.thaicovercare.com</a></p>
    `,
  })
}
