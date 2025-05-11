import type React from "react"

import { useEffect, useState } from "react"
import { MessageSquare, Send, Users } from "lucide-react"
import { SidebarProvider } from "./components/side-provider"
import ChatSidebar from "./components/chat-sidebar"
import ChatMessages from "./components/chat-messages"
import { Button } from "../../../components/ui/button"
import { getSocket } from "../../../socket.ts";
import { useAuth } from "../../../context/AuthContext.tsx"
import { Textarea } from '../../../components/ui/textarea.tsx';

type Group = { id: number | string; name: string; volunteers: any[] }

export default function ChatRoom() {
  const [groups, setGroups] = useState([])
  const [activeGroup, setActiveGroup] = useState<Group | undefined>(groups[0])
  const [messages, setMessages] = useState<any>([])
  const [newMessage, setNewMessage] = useState("")
  const [socket] = useState(getSocket());
  const { user } = useAuth()

  const activeGroupId = activeGroup?.id;

  // Fetch data from API
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const url = user.role === 'charity_admin' ? `${import.meta.env.VITE_BASE_URL}/admin/event` : `${import.meta.env.VITE_BASE_URL}/api/event/joined`;
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        
        if (!response.ok) throw new Error("Failed to fetch posts");
        
        const data = await response.json();
        setGroups(data.data.map((group: any) => ({
          id: group._id,
          name: group.name,
          volunteers: group.volunteers || [], // Ensure volunteers property exists
        })))
        if(data.data.length) {
        setActiveGroup({
          id: data.data[0]._id,
          name: data.data[0].name,
          volunteers: data.data[0].volunteers || [], // Ensure volunteers property exists
        })
      }
      } catch (error) {
        console.log("ERROR FETCHING MESSAGES")
      }
    };

    fetchGroups();
  }, []);

  useEffect(() => {
    if (!activeGroupId) return
    const fetchMessages = async () => {
      try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/chat/${activeGroupId}`
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        })

        if (!response.ok) throw new Error("Failed to fetch messages")

        const data = await response.json()
        const formattedMessages = data.map((msg: any) => ({
          id: msg._id,
          groupId: activeGroupId,
          sender: msg.user,
          avatar: msg.avatar || "/placeholder.svg",
          content: msg.message,
          timestamp: msg.timestamp,
          isCurrentUser: user._id === msg.senderId,
        }))

        setMessages(formattedMessages)
      } catch (error) {
        console.error("Error fetching messages:", error)
      }
    }

    fetchMessages()
  }, [activeGroupId, user])


  useEffect(() => {
    if (!socket || !activeGroupId) return;
  
    // Join the event room
    socket.emit("joinEvent", activeGroupId);
  
    const handleReceiveMessage = (payload: any) => {
      const msgEventId = payload.eventId;
      if(msgEventId !== activeGroup?.id) return;
      const msg = payload.message;
      setMessages((prev: any) => [
        ...prev,
        {
          id: msg._id,
          sender: msg.user,
          isCurrentUser: user._id === msg.senderId,
          avatar: "/placeholder.svg?height=40&width=40",
          timestamp: msg.timestamp,
          content: msg.message,
        }
      ]);
    };
  
    // Register the listener
    socket.on("receiveMessage", handleReceiveMessage);
  
    // Clean up the listener BEFORE the effect re-runs or unmounts
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [activeGroupId, socket, user._id]);
  

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return

    socket.emit("broadcastMessage", {
      event: activeGroupId,
      user: user.name,
      senderId: user._id,
      message: newMessage,
      groupId: activeGroupId,
    });
    
 
    setNewMessage("")
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };


  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden bg-background">
        <ChatSidebar groups={groups} activeGroup={activeGroup} setActiveGroup={(group: Group) => {
          setActiveGroup(group);
          setMessages([]);
        }} />

        <div className="flex flex-1 flex-col">
          <div className="border-b p-4 flex items-center gap-2 bg-muted/30">
            <MessageSquare className="h-5 w-5" />
            <h1 className="text-xl font-semibold">{activeGroup?.name}</h1>
            <div className="ml-auto flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm text-muted-foreground">{activeGroup?.volunteers.length} volunteers</span>
            </div>
          </div>

          <ChatMessages messages={messages} />

          <div className="border-t p-4 flex gap-2">
          <Textarea
              placeholder="Type a message..."
              className="max-h-36 min-h-10 flex-1 resize-none bg-gray-200 text-sm sm:text-base"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              style={{ fieldSizing: 'content' } as React.CSSProperties}
            />
            <Button onClick={handleSendMessage} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}
