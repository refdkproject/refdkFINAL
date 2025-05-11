
import { MessageSquare, Menu, X } from "lucide-react"
import { useSidebar } from "./side-provider"
import { Button } from "../../../../components/ui/button"
import { ScrollArea } from "../../../../components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "../../../../components/ui/avatar"
import { useAuth } from "../../../../context/AuthContext"

type Group = {
  id: number | string
  name: string
  volunteers: any[]
}

interface ChatSidebarProps {
  groups: Group[]
  activeGroup: Group | undefined
  setActiveGroup: (group: Group) => void
}

export default function ChatSidebar({ groups, activeGroup, setActiveGroup }: ChatSidebarProps) {
  const { isOpen, setIsOpen, isMobile } = useSidebar()
  const { user } = useAuth()

  if (!isOpen && isMobile) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <>
      {isMobile && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}
      <div
        className={`
          ${isMobile ? "fixed inset-y-0 left-0 z-50" : "relative"}
          flex h-full w-64 flex-col border-r bg-muted/30
        `}
      >
        <div className="flex items-center justify-between border-b p-4">
          <h2 className="text-lg font-semibold">Chat Groups</h2>
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="flex items-center justify-between p-4">
          <h3 className="text-sm font-medium">Channels</h3>
        </div>

        <ScrollArea className="flex-1">
          <div className="px-2">
            {groups.map((group) => (
              <button
                key={group.id}
                className={`
                  flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors
                  ${activeGroup?.id === group.id ? "bg-accent text-accent-foreground" : "hover:bg-muted"}
                `}
                onClick={() => {
                  setActiveGroup(group)
                  if (isMobile) setIsOpen(false)
                }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
                  <MessageSquare className="h-4 w-4 text-primary" />
                </div>
                <span className="flex-1 truncate">{group.name}</span>
              </button>
            ))}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src={user.profilePic} alt="User" />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
