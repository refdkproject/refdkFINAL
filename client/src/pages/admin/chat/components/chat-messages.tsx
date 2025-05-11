import { useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar"
import { ScrollArea } from "../../../../components/ui/scroll-area"

type Message = {
  id: number
  sender: string
  avatar: string
  content: string
  timestamp: string
  isCurrentUser: boolean
}

interface ChatMessagesProps {
  messages: Message[]
}

export default function ChatMessages({ messages }: ChatMessagesProps) {
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  return (
    <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
      <div className="flex flex-col gap-4">
        {messages.map((message: Message) => (
          <div key={message.id} className={`flex gap-3 ${message.isCurrentUser ? "flex-row-reverse" : ""}`}>
            <Avatar>
              <AvatarImage src={message.avatar || "/placeholder.svg"} alt={message.sender} />
              <AvatarFallback>{message.sender[0]}</AvatarFallback>
            </Avatar>

            <div className={`flex max-w-[70%] flex-col ${message.isCurrentUser ? "items-end" : ""}`}>
              <div className="flex items-center gap-2">
                <span className={`text-sm font-medium ${message.isCurrentUser ? "order-2" : ""}`}>
                  {message.sender}
                </span>
                <span>
                 {formatDistanceFromNow(message.timestamp)}
                </span>
              </div>

              <div
                className={`
                  mt-1 rounded-lg p-3
                  ${message.isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"}
                `}
              >
                {message.content}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  )
}

function formatDistanceFromNow(timestamp: string){
  const currentDate = new Date(timestamp);
  const now = new Date();

  const diffInSeconds = Math.floor((now.getTime() - currentDate.getTime()) / 1000);

  if (diffInSeconds < 5) return "just now";
  if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
  if (diffInSeconds < 120) return "a minute ago";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 7200) return "an hour ago";
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 172800) return "a day ago";
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
}