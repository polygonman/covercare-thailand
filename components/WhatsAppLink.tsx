"use client"

import { Analytics } from "@/lib/analytics"

type WhatsAppLinkProps = Omit<
  React.ComponentPropsWithoutRef<"a">,
  "target" | "rel"
> & {
  /**
   * Where on the site this link lives (e.g. "hero", "floating_cta").
   * Sent to analytics so you can see which CTA actually drives chats.
   */
  source: string
}

/**
 * A WhatsApp link that records a lead in analytics when clicked.
 *
 * Plain `<a href="wa.me/...">` links can't be tracked — the browser just
 * navigates away and the analytics tools never hear about the click. This
 * wrapper fires `whatsapp_clicked` (with source) and GA4's standard
 * `generate_lead` event before opening WhatsApp. Safe to use inside server
 * components — it's a client component.
 */
export default function WhatsAppLink({
  source,
  onClick,
  children,
  ...props
}: WhatsAppLinkProps) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        Analytics.whatsappClicked(source)
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
