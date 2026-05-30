"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { SEGMENT_LABELS, NEEDS_OPTIONS } from "@/types/lead"
import type { Segment } from "@/types/lead"
import { Analytics } from "@/lib/analytics"

const schema = z.object({
  name: z.string().min(2, "Please enter your name"),
  email: z.string().email("Please enter a valid email"),
  whatsapp: z.string().min(7, "Please enter your WhatsApp number"),
  segment: z.enum(
    ["corporate", "nomad", "tech", "retiree", "visitor"] as const,
    { message: "Please select your situation to continue." }
  ),
  needs: z.array(z.string()).min(1, "Please select at least one option"),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const STEPS = ["Who are you?", "What do you need?", "How can we reach you?"]

const inputBase: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--ink-200)",
  borderRadius: 12,
  padding: "10px 14px",
  fontSize: 14,
  outline: "none",
  background: "rgba(255,255,255,0.7)",
  color: "var(--navy-900)",
  transition: "border-color 150ms, box-shadow 150ms",
}

export default function ContactForm() {
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { needs: [] },
  })

  const selectedSegment = watch("segment")
  const selectedNeeds = watch("needs") ?? []

  const nextStep = async () => {
    let valid = false
    if (step === 0) valid = await trigger("segment")
    if (step === 1) valid = await trigger("needs")
    if (step === 2) valid = await trigger(["name", "email", "whatsapp"])
    if (valid) {
      if (step === 0) Analytics.formStarted()
      setStep((s) => s + 1)
    }
  }

  const onSubmit = async (data: FormData) => {
    setSubmitting(true)
    setError("")
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Submission failed")
      const json = await res.json()
      Analytics.formCompleted(json.score ?? 0)
      setSubmitted(true)
    } catch {
      setError("Something went wrong. Please try WhatsApp instead.")
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="text-center py-10">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
          style={{ background: "var(--success-soft)", color: "var(--success)" }}
        >
          <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-black text-navy-900 mb-2" style={{ letterSpacing: "-0.02em" }}>
          Thank you!
        </h3>
        <p className="mb-6 text-sm" style={{ color: "var(--ink-600)", maxWidth: 320, margin: "8px auto 24px" }}>
          Our team will personally follow up within 24 hours. In the meantime, feel free to WhatsApp us directly.
        </p>
        <a
          href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi! I just submitted the form on your website!")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
          style={{ background: "linear-gradient(160deg, #2EDF74, #25D366)" }}
        >
          Open WhatsApp
        </a>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className="text-xs font-medium transition-colors"
              style={{ color: i <= step ? "var(--sky-600)" : "var(--ink-300)" }}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-1 rounded-full overflow-hidden" style={{ background: "var(--ink-100)" }}>
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%`, background: "var(--sky-500)" }}
          />
        </div>
      </div>

      {/* Step 0: Segment */}
      {step === 0 && (
        <div>
          <h3 className="text-lg font-bold text-navy-900 mb-4">Who are you?</h3>
          <div className="grid grid-cols-2 gap-2">
            {(Object.entries(SEGMENT_LABELS) as [Segment, string][]).map(([value, label], i, arr) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("segment", value, { shouldValidate: true })}
                className="p-4 rounded-2xl text-left text-sm font-medium transition-all duration-150 cursor-pointer border-2"
                style={{
                  borderColor: selectedSegment === value ? "var(--sky-500)" : "var(--ink-200)",
                  background: selectedSegment === value ? "var(--sky-50)" : "rgba(255,255,255,0.5)",
                  color: "var(--navy-900)",
                  ...(arr.length % 2 !== 0 && i === arr.length - 1 ? { gridColumn: "span 2" } : {}),
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.segment && (
            <p className="text-sm mt-2" style={{ color: "#D14343" }}>{errors.segment.message}</p>
          )}
          <button
            type="button"
            onClick={nextStep}
            className="mt-6 w-full py-3 rounded-full text-sm font-semibold text-white transition-all duration-150 hover:opacity-90"
            style={{ background: "var(--sky-500)", boxShadow: "var(--glow-sky-soft)" }}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 1: Needs */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-bold text-navy-900 mb-1">What do you need?</h3>
          <p className="text-sm mb-4" style={{ color: "var(--ink-500)" }}>Select all that apply</p>
          <div className="flex flex-col gap-2">
            {NEEDS_OPTIONS.map((option) => {
              const checked = selectedNeeds.includes(option)
              return (
                <label
                  key={option}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150 border-2"
                  style={{
                    borderColor: checked ? "var(--sky-500)" : "var(--ink-200)",
                    background: checked ? "var(--sky-50)" : "rgba(255,255,255,0.5)",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => {
                      const current = getValues("needs") ?? []
                      setValue(
                        "needs",
                        e.target.checked ? [...current, option] : current.filter((n) => n !== option),
                        { shouldValidate: true }
                      )
                    }}
                    style={{ accentColor: "var(--sky-500)" }}
                  />
                  <span className="text-sm" style={{ color: "var(--navy-800)" }}>{option}</span>
                </label>
              )
            })}
          </div>
          {errors.needs && (
            <p className="text-sm mt-2" style={{ color: "#D14343" }}>{errors.needs.message}</p>
          )}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex-1 py-3 rounded-full text-sm font-medium transition-colors"
              style={{ border: "1px solid var(--ink-200)", color: "var(--ink-700)", background: "transparent" }}
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: "var(--sky-500)" }}
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Contact */}
      {step === 2 && (
        <div>
          <h3 className="text-lg font-bold text-navy-900 mb-4">How can I reach you?</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-navy-700">Full Name</label>
              <input
                {...register("name")}
                placeholder="Your name"
                style={inputBase}
                onFocus={(e) => { e.target.style.borderColor = "var(--sky-500)"; e.target.style.boxShadow = "var(--glow-sky)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--ink-200)"; e.target.style.boxShadow = "none"; }}
              />
              {errors.name && <p className="text-xs mt-1" style={{ color: "#D14343" }}>{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-navy-700">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@email.com"
                style={inputBase}
                onFocus={(e) => { e.target.style.borderColor = "var(--sky-500)"; e.target.style.boxShadow = "var(--glow-sky)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--ink-200)"; e.target.style.boxShadow = "none"; }}
              />
              {errors.email && <p className="text-xs mt-1" style={{ color: "#D14343" }}>{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-navy-700">WhatsApp Number</label>
              <input
                {...register("whatsapp")}
                placeholder="+66 or your country code"
                style={inputBase}
                onFocus={(e) => { e.target.style.borderColor = "var(--sky-500)"; e.target.style.boxShadow = "var(--glow-sky)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--ink-200)"; e.target.style.boxShadow = "none"; }}
              />
              {errors.whatsapp && <p className="text-xs mt-1" style={{ color: "#D14343" }}>{errors.whatsapp.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-navy-700">
                Anything else? <span style={{ color: "var(--ink-400)", fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                {...register("message")}
                rows={3}
                placeholder="Your current coverage, questions, or specific needs..."
                style={{ ...inputBase, resize: "none" }}
                onFocus={(e) => { e.target.style.borderColor = "var(--sky-500)"; e.target.style.boxShadow = "var(--glow-sky)"; }}
                onBlur={(e) => { e.target.style.borderColor = "var(--ink-200)"; e.target.style.boxShadow = "none"; }}
              />
            </div>
          </div>
          {error && <p className="text-sm mt-2" style={{ color: "#D14343" }}>{error}</p>}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 py-3 rounded-full text-sm font-medium"
              style={{ border: "1px solid var(--ink-200)", color: "var(--ink-700)", background: "transparent" }}
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-full text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ background: "var(--sky-500)", boxShadow: "var(--glow-sky-soft)" }}
            >
              {submitting ? "Sending..." : "Get My Free Quote →"}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
