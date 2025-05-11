"use client"

import { useState } from "react"
import { DeleteIcon, Heart } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/Card"
import { Separator } from "./ui/separator"
import { useAuth } from "../context/AuthContext"
import { toast } from "react-toastify"

type Post = {
    message: string,
    media: string,
    _id: string,
    likedBy: {likedBy: string, _id: string}[],
    createdAt: string,
    userId: {
      _id: string,
      name: string,
      profilePic: string,
      role: string
    },
    likes: number
  }

export default function PostCard({ post, setLikes, deletePost }: {post: Post, setLikes: any, deletePost: any}) {
  const [likeCount, setLikeCount] = useState(post.likes ? post.likes : 0)
  const { user } = useAuth();
  
  const [liked, setLike] = useState(post.likedBy.map((like) => like.likedBy).includes(user?._id))
  
  const handleLike = async (id: string) => {
    setLike((prev: any) => !prev)

    if (liked) {
        setLikeCount(likeCount - 1)
        setLikes((prev: any) => prev - 1)
    } else {
        setLikeCount(likeCount + 1)
        setLikes((prev: any) => prev + 1)
    }      
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/news-feed/likes/${id}`, {
            method: "PUT",
            body: JSON.stringify({ type: 1 }),
            headers: {
                Authorization: `Bearer ${user?.token}`,
            },
        })
        const data = await response.json()
        
        if (!response.ok) {
            console.error("Error creating LIKE:", data.message)
            return
        }
  }
  
  const handleDelete = async (id: string) => {
    
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/news-feed/${id}`, {
        method: "DELETE",
        body: JSON.stringify({ type: 1 }),
        headers: {
            Authorization: `Bearer ${user?.token}`,
        },
    })
    const data = await response.json()
    
    if (!response.ok) {
        console.error("Error deleting Post:", data.message)
        toast.error("Error deleting Post", {
            position: "top-right"
          });
        return
    }

    deletePost(id);
    toast.success("Post deleted successfully", {
        position: "top-right"
      });  

  }

  const createdAtDate = new Date(post.createdAt);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - createdAtDate.getTime()) / 1000);
  let timeAgo = '';

  if (diffInSeconds < 60) {
      timeAgo = `${diffInSeconds} seconds ago`;
  } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      timeAgo = `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
      const days = Math.floor(diffInSeconds / 86400);
      timeAgo = `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={post.userId.profilePic || "/placeholder.svg"} alt={post.userId.name} />
            <AvatarFallback>{post.userId.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{post.userId.name}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <span>{post.userId.role}</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="w-full h-auto bg-gray-100 p-4 rounded-md text-sm">{post.message}</p>
        {post.media && (
          <div className="mt-3 rounded-md overflow-hidden">
            <img src={post.media || "/placeholder.svg"} alt="Post content" className="w-[200px] h-auto m-auto object-cover" />
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <div className="w-full">
          <div className="flex items-center text-xs text-muted-foreground mb-2">
            <span>{likeCount} likes</span>
          </div>
          <Separator />
          <div className="flex justify-between pt-2">
          <Button
              variant="ghost"
              size="sm"
              className={`flex-1 ${liked ? "text-red-500" : "text-muted-foreground"}`}
              onClick={() => handleLike(post._id)}
            >
              <Heart className="h-4 w-4 mr-2" fill={liked ? "currentColor" : "none"} />
              Like
            </Button>
           
            {
              post.userId._id === user?._id ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex-1 text-muted-foreground `}
                  onClick={() => handleDelete(post._id)}
                >
                  <DeleteIcon className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              ) : (
                null
              )
            }
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
