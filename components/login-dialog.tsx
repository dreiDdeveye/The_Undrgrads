"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { generateToken } from "@/lib/jwt"
import { LogIn } from "lucide-react"

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || "Maynard"
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "benzaralihd1st"

interface LoginDialogProps {
  onLogin: (token: string) => void
}

export default function LoginDialog({ onLogin }: LoginDialogProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = generateToken(username)
      localStorage.setItem("authToken", token)
      onLogin(token)
    } else {
      setError("Invalid credentials. Please try again.")
      setPassword("")
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-slate-900 flex flex-col items-center justify-center p-4">
      {/* Logo above the card */}
      <div className="mb-6">
        <Image
          src="/logo1.png"
          alt="Logo"
          width={200}
          height={200}
          className="object-contain"
          priority
        />
      </div>

      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Username</label>
            <Input
              type="text"
              placeholder="admin"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setError("")
              }}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Password</label>
            <Input
              type="password"
              placeholder="**************"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError("")
              }}
              onKeyDown={handleKeyDown}
              className="w-full"
            />
          </div>

          {error && <div className="text-sm text-red-400 bg-red-900/30 border border-red-800 p-3 rounded">{error}</div>}

          <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 flex items-center justify-center gap-2">
            <LogIn className="w-4 h-4" />
            Login
          </Button>
        </div>
      </Card>
    </div>
  )
}
