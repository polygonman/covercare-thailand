"use client"

import { useState } from "react"

export default function GuideForm() {
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    setError("")
    const form = e.currentTarget
    const data = new FormData(form)

    try {
      const res = await fetch("https://formspree.io/f/xzdodkda", {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
      if (!res.ok) throw new Error()
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Email me at covercareTH@gmail.com instead.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="text-4xl mb-3">📬</div>
        <h3 className="font-bold text-gray-900 text-lg mb-2">Check your inbox!</h3>
        <p className="text-gray-500 text-sm mb-4">
          The guide is on its way. While you wait —
        </p>
        <a
          href="/contact"
          className="inline-block bg-teal-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
        >
          Book a free consultation →
        </a>
        <p className="mt-4 text-xs text-gray-400">
          Can&apos;t find the email? Check spam or{" "}
          <a href="/public/expat-guide.pdf" download className="text-teal-600 underline">
            download directly
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <input type="hidden" name="_subject" value="New guide download request" />
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your name</label>
        <input
          name="name"
          required
          placeholder="First name"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@email.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>
      {error && <p className="text-red-500 text-xs">{error}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
      >
        {submitting ? "Sending..." : "Send Me the Free Guide →"}
      </button>
      <p className="text-xs text-gray-400 text-center">
        No spam. Just the guide and the occasional useful tip.
      </p>
    </form>
  )
}
