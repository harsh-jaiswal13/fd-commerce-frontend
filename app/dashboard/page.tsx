"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LogOut, Send, X } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: "online" | "offline"
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
}

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isChatOpen, setIsChatOpen] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = localStorage.getItem("currentUser")
    if (!user) {
      router.push("/")
      return
    }

    const parsedUser = JSON.parse(user)
    setCurrentUser(parsedUser)

    // Mock users data
    const mockUsers: User[] = [
      {
        id: "2",
        name: "Alice Johnson",
        email: "alice@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        status: "online",
      },
      {
        id: "3",
        name: "Bob Smith",
        email: "bob@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        status: "online",
      },
      {
        id: "4",
        name: "Carol Davis",
        email: "carol@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
        status: "offline",
      },
      {
        id: "5",
        name: "David Wilson",
        email: "david@example.com",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        status: "online",
      },
    ]

    setUsers(mockUsers)

    // Mock messages
    const mockMessages: Message[] = [
      {
        id: "1",
        senderId: "2",
        receiverId: parsedUser.id,
        content: "Hey there! How are you doing?",
        timestamp: new Date(Date.now() - 3600000),
      },
      {
        id: "2",
        senderId: parsedUser.id,
        receiverId: "2",
        content: "Hi Alice! I'm doing great, thanks for asking!",
        timestamp: new Date(Date.now() - 3500000),
      },
    ]

    setMessages(mockMessages)
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("currentUser")
    router.push("/")
  }

  const handleUserClick = (user: User) => {
    setSelectedUser(user)
    setIsChatOpen(true)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !selectedUser || !currentUser) return

    const message: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      receiverId: selectedUser.id,
      content: newMessage.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, message])
    setNewMessage("")

    // Simulate receiving a response
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        senderId: selectedUser.id,
        receiverId: currentUser.id,
        content: `Thanks for your message! This is an auto-reply from ${selectedUser.name}.`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, response])
    }, 1000)
  }

  const getChatMessages = (userId: string) => {
    if (!currentUser) return []
    return messages
      .filter(
        (msg) =>
          (msg.senderId === currentUser.id && msg.receiverId === userId) ||
          (msg.senderId === userId && msg.receiverId === currentUser.id),
      )
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
  }

  if (!currentUser) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
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
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="flex h-[calc(100vh-80px)]">
        {/* Users List */}
        <div className="w-80 bg-white border-r border-gray-200">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold">Users</h2>
          </div>
          <ScrollArea className="h-full">
            <div className="p-2">
              {users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => handleUserClick(user)}
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

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center">
          {!isChatOpen ? (
            <div className="text-center">
              <h3 className="text-xl font-medium text-gray-900 mb-2">Select a user to start chatting</h3>
              <p className="text-gray-500">Choose someone from the users list to begin a conversation</p>
            </div>
          ) : null}
        </div>
      </div>

      {/* Chat Modal */}
      {isChatOpen && selectedUser && (
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
              <Button variant="ghost" size="sm" onClick={() => setIsChatOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {getChatMessages(selectedUser.id).map((message) => (
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
      )}
    </div>
  )
}
