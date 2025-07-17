export interface User {
  id: string
  name: string
  email: string
  avatar: string
  status: "online" | "offline"
}

export interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  timestamp: Date
}

export interface ChatState {
  currentUser: User | null
  users: User[]
  messages: Message[]
  selectedUser: User | null
  isChatOpen: boolean
}
