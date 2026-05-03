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
  segment: z.enum(["corporate", "nomad", "tech", "retiree"] as const),
  needs: z.array(z.string()).min(1, "Please select at least one option"),
  message: z.string().optional(),
})

type FormData = z.infer<typeof schema>

const STEPS = ["Who are you?", "What do you need?", "How can we reach you?"]

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
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-teal-50 border border-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg viewBox="0 0 24 24" className="w-8 h-8 text-teal-600" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-600 mb-6">
          I&apos;ll personally follow up within 24 hours. In the meantime, feel free to WhatsApp me directly.
        </p>
        <a
          href={`https://wa.me/66611965363?text=${encodeURIComponent("Hi Tonkla, I just submitted the form on your website!")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block bg-green-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-600 transition-colors"
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
        <div className="flex justify-between mb-1">
          {STEPS.map((label, i) => (
            <span
              key={label}
              className={`text-xs font-medium ${i <= step ? "text-teal-600" : "text-gray-300"}`}
            >
              {label}
            </span>
          ))}
        </div>
        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-teal-600 transition-all duration-300 rounded-full"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step 0: Segment */}
      {step === 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Who are you?</h3>
          <div className="grid grid-cols-2 gap-3">
            {(Object.entries(SEGMENT_LABELS) as [Segment, string][]).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setValue("segment", value, { shouldValidate: true })}
                className={`p-4 border-2 rounded-xl text-left transition-all ${
                  selectedSegment === value
                    ? "border-teal-600 bg-teal-50"
                    : "border-gray-200 hover:border-teal-300"
                }`}
              >
                <span className="text-sm font-medium text-gray-900">{label}</span>
              </button>
            ))}
          </div>
          {errors.segment && (
            <p className="text-red-500 text-sm mt-2">{errors.segment.message}</p>
          )}
          <button
            type="button"
            onClick={nextStep}
            className="mt-6 w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
          >
            Continue →
          </button>
        </div>
      )}

      {/* Step 1: Needs */}
      {step === 1 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">What do you need? <span className="text-gray-400 font-normal text-sm">(select all that apply)</span></h3>
          <div className="flex flex-col gap-2">
            {NEEDS_OPTIONS.map((option) => {
              const checked = selectedNeeds.includes(option)
              return (
                <label
                  key={option}
                  className={`flex items-center gap-3 p-3 border-2 rounded-xl cursor-pointer transition-all ${
                    checked ? "border-teal-600 bg-teal-50" : "border-gray-200 hover:border-teal-300"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="accent-teal-600"
                    checked={checked}
                    onChange={(e) => {
                      const current = getValues("needs") ?? []
                      setValue(
                        "needs",
                        e.target.checked ? [...current, option] : current.filter((n) => n !== option),
                        { shouldValidate: true }
                      )
                    }}
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              )
            })}
          </div>
          {errors.needs && (
            <p className="text-red-500 text-sm mt-2">{errors.needs.message}</p>
          )}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setStep(0)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              type="button"
              onClick={nextStep}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
            >
              Continue →
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Contact details */}
      {step === 2 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How can I reach you?</h3>
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                {...register("name")}
                placeholder="Your name"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                {...register("email")}
                type="email"
                placeholder="you@email.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                {...register("whatsapp")}
                placeholder="+66 or your country code"
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              {errors.whatsapp && <p className="text-red-500 text-xs mt-1">{errors.whatsapp.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Anything else? <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                {...register("message")}
                rows={3}
                placeholder="Your current coverage, questions, or specific needs..."
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50"
            >
              {submitting ? "Sending..." : "Get My Free Quote →"}
            </button>
          </div>
        </div>
      )}
    </form>
  )
}
