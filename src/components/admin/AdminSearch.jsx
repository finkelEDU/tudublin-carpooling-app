"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Input } from "@/components/ui/input"

export default function AdminSearch({ placeholder = "Search..." }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleChange = useCallback((e) => {
    const q = e.target.value
    const params = new URLSearchParams(searchParams)
    if (q) {
      params.set("q", q)
    } else {
      params.delete("q")
    }
    router.replace(`?${params.toString()}`)
  }, [router, searchParams])

  return (
    <Input
      placeholder={placeholder}
      defaultValue={searchParams.get("q") ?? ""}
      onChange={handleChange}
      className="max-w-xs"
    />
  )
}
