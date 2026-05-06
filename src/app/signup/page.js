"use client"

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NativeSelect } from "@/components/ui/native-select";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("Student");
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const supabase = createClient();

  async function handleOAuth(provider) {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/api/auth/callback` },
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setIsSuccess(false);

    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password, userType }),
    });

    const data = await res.json();

    if (res.ok) {
      setIsSuccess(true);
      setMessage("Account created! Check your email to verify your account before logging in.");
    } else {
      setMessage(data.error || "Something went wrong");
    }
  }

  return (
    <div className="max-w-md mx-auto mt-12">
      <Card>
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="userType">User Type</Label>
              <NativeSelect
                id="userType"
                value={userType}
                onChange={e => setUserType(e.target.value)}
              >
                <option value="Student">Student</option>
                <option value="Driver">Driver</option>
              </NativeSelect>
            </div>

            <Button type="submit" className="w-full">Create Account</Button>

            {message && (
              <p className={`text-sm text-center ${isSuccess ? "text-green-600" : "text-red-500"}`}>{message}</p>
            )}
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs text-muted-foreground">
              <span className="bg-card px-2">or sign up with</span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button type="button" variant="outline" className="w-full gap-2" onClick={() => handleOAuth("google")}>
              <FcGoogle size={18} /> Google
            </Button>
            <Button type="button" variant="outline" className="w-full gap-2" onClick={() => handleOAuth("github")}>
              <FaGithub size={18} /> GitHub
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
