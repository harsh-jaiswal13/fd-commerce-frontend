"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { User } from "@/lib/types"

interface UserListProps {
  users: User[]
  onUserClick: (user: User) => void
}

export function UserList({ users, onUserClick }: UserListProps) {
  return (
    <div className="w-80 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Users</h2>
      </div>
      <ScrollArea className="h-full">
        <div className="p-2">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onUserClick(user)}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
            >
              <div className="relative">
                <Avatar>
                  <AvatarImage src={user.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.status}</p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
