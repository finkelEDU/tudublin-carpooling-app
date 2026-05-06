"use client"

import { useState } from "react"
import { useFormState } from "react-dom"
import { completeOnboarding } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function OnboardingPage() {
  const [state, action] = useFormState(completeOnboarding, null)

  return (
    <div className="flex min-h-screen items-start justify-center pt-16">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>One last step</CardTitle>
          <p className="text-sm text-muted-foreground">Choose a username and account type to finish setting up your account.</p>
        </CardHeader>
        <CardContent>
          <form action={action} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" placeholder="e.g. johndoe" required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="userType">I am a</Label>
              <select
                id="userType"
                name="userType"
                required
                className="border rounded-md px-3 py-2 text-sm bg-background"
              >
                <option value="">Select...</option>
                <option value="Student">Student</option>
                <option value="Driver">Driver</option>
              </select>
            </div>

            {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

            <Button type="submit" className="w-full">Get started</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
