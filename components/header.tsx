"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut } from "lucide-react"
import type { User } from "@/lib/types"

interface HeaderProps {
  currentUser: User
  onSignOut: () => void
}

export function Header({ currentUser, onSignOut }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Avatar>
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
            <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">Welcome, {currentUser.name}</h1>
            <p className="text-sm text-gray-500">Chat Dashboard</p>
          </div>
        </div>
        <Button variant="outline" onClick={onSignOut}>
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </header>
  )
}
