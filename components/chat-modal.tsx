"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, X } from "lucide-react"
import type { User, Message } from "@/lib/types"

interface ChatModalProps {
  currentUser: User
  selectedUser: User
  messages: Message[]
  onClose: () => void
  onSendMessage: (content: string) => void
}

export function ChatModal({ currentUser, selectedUser, messages, onClose, onSendMessage }: ChatModalProps) {
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    onSendMessage(newMessage.trim())
    setNewMessage("")
  }

  const getChatMessages = () => {
    return messages
      .filter(
        (msg) =>
          (msg.senderId === currentUser.id && msg.receiverId === selectedUser.id) ||
          (msg.senderId === selectedUser.id && msg.receiverId === currentUser.id),
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl h-[600px] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} />
              <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{selectedUser.name}</CardTitle>
              <p className="text-sm text-gray-500">{selectedUser.status}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {getChatMessages().map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === currentUser.id ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.senderId === currentUser.id ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        message.senderId === currentUser.id ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1"
              />
              <Button type="submit" disabled={!newMessage.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
