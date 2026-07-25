"use client"

import { Analytics } from "@/lib/analytics"

type LineLinkProps = Omit<
  React.ComponentPropsWithoutRef<"a">,
  "target" | "rel"
> & {
  /**
   * Where on the site this link lives (e.g. "footer", "contact_section").
   * Sent to analytics so you can see which placement drives LINE chats.
   */
  source: string
}

/**
 * A LINE link that records a lead in analytics when clicked.
 *
 * Mirror of WhatsAppLink for the LINE Official Account. Fires `line_clicked`
 * (with source) and GA4's standard `generate_lead` event before opening LINE,
 * so LINE — a primary contact channel for Thai customers — shows up in the
 * lead reports instead of vanishing on navigation. Safe inside server
 * components — it's a client component.
 */
export default function LineLink({
  source,
  onClick,
  children,
  ...props
}: LineLinkProps) {
  return (
    <a
      {...props}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        Analytics.lineClicked(source)
        onClick?.(e)
      }}
    >
      {children}
    </a>
  )
}
