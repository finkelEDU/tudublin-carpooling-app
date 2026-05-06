"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Leaf, Euro, Car, Shield, Copy, Check } from "lucide-react"

export default function About() {
  const [stats, setStats] = useState(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setStats({
      co2: (Math.floor(Math.random() * (980 - 320 + 1)) + 320).toLocaleString(),
      cost: (Math.floor(Math.random() * (65 - 18 + 1)) + 18).toLocaleString(),
      cars: (Math.floor(Math.random() * (180 - 40 + 1)) + 40).toLocaleString(),
    })
  }, [])

  const copyEmail = async () => {
    await navigator.clipboard.writeText("carpool@tudublin.example")
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12 space-y-16">

      {/* Hero */}
      <section className="space-y-4">
        <Badge variant="secondary">About</Badge>
        <h1 className="text-4xl font-bold leading-tight">
          Built for TU Dublin students,<br />staff & campus life.
        </h1>
        <p className="text-lg text-muted-foreground max-w-xl">
          TU Dublin Carpool is a community-first platform designed around real campus schedules —
          early labs, late studio sessions, multiple campuses, and the everyday need for
          affordability, reliability, and safety.
        </p>
      </section>

      {/* Mission */}
      <section className="space-y-4" id="mission">
        <h2 className="text-2xl font-bold">Mission</h2>
        <p className="text-muted-foreground leading-relaxed">
          Our goal is to reduce single-occupancy trips to and from TU Dublin by making
          carpooling genuinely convenient — clear pickup points, 
          ad-hoc payment system. and a respectful community standard.
        </p>
        <div className="flex gap-2 flex-wrap">
          <Badge><Leaf className="h-3 w-3 mr-1" />CO₂ reduction</Badge>
          <Badge><Euro className="h-3 w-3 mr-1" />Cost sharing</Badge>
          <Badge><Car className="h-3 w-3 mr-1" />Campus community</Badge>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-6" id="how">
        <h2 className="text-2xl font-bold">How it works</h2>
        <ol className="space-y-4">
          {[
            { n: "1", title: "Create a profile", body: "Set your commuting preferences, pickup flexibility, and verify your TU Dublin affiliation." },
            { n: "2", title: "Post or request a ride", body: "Drivers post routes with dates and seats. Passengers browse, filter, and request a seat in minutes." },
            { n: "3", title: "Confirm with clear expectations", body: "See seat availability, departure time, and the agreed contribution before committing." },
            { n: "4", title: "Travel and review", body: "After the ride both sides leave a rating, building trust for future trips." },
          ].map(({ n, title, body }) => (
            <li key={n} className="flex gap-4">
              <span className="text-3xl font-bold text-muted-foreground/20 leading-none w-8 shrink-0">{n}</span>
              <div>
                <p className="font-semibold">{title}</p>
                <p className="text-sm text-muted-foreground">{body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Trust & Safety */}
      <section className="space-y-3" id="trust">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Shield className="h-5 w-5" /> Trust & Safety
        </h2>
        <p className="text-muted-foreground leading-relaxed">
          We prioritise safety with TU Dublin email verification, ride history, user ratings,
          and clear reporting pathways. Drivers and passengers can rate each trip and flag
          any issues directly for admins to review.
        </p>
      </section>

      {/* Sample stats */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Sample Impact</h2>
        <p className="text-sm text-muted-foreground">Placeholder figures — replace with real data once rides are collected.</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{stats?.co2 ?? "—"} kg</p>
              <p className="text-sm text-muted-foreground mt-1">CO₂ saved / month</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">€{stats?.cost ?? "—"}</p>
              <p className="text-sm text-muted-foreground mt-1">Avg cost saved / commuter</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold">{stats?.cars ?? "—"}</p>
              <p className="text-sm text-muted-foreground mt-1">Cars removed from peak parking</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-3" id="faq">
        <h2 className="text-2xl font-bold">FAQ</h2>
        <div className="space-y-2">
          {[
            { q: "Is this an official TU Dublin service?", a: "No — this is a student project concept. We're transparent about ownership and support." },
            { q: "How do costs work?", a: "Costs are contribution-based (fuel/parking split) with a suggested amount shown before confirmation." },
            { q: "What happens if someone cancels?", a: "Cancellation windows and reliability scores help improve matching over time." },
            { q: "What about privacy?", a: "We limit data exposure. Location sharing during rides is opt-in only." },
          ].map(({ q, a }) => (
            <details key={q} className="border rounded-xl px-4 py-3">
              <summary className="font-medium cursor-pointer list-none">{q}</summary>
              <p className="text-sm text-muted-foreground mt-2">{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="space-y-3">
        <h2 className="text-2xl font-bold">Contact</h2>
        <p className="text-muted-foreground text-sm">For questions or feedback, reach us at carpool@tudublin.example</p>
        <Button variant="outline" onClick={copyEmail} className="gap-2">
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? "Copied!" : "Copy email"}
        </Button>
      </section>

    </div>
  )
}
