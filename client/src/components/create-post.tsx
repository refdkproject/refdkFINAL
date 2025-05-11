import React, { useState } from 'react'
import { Card, CardFooter, CardHeader } from './ui/Card'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { useAuth } from '../context/AuthContext'

const CreatePost = ({addNewPost, setTotalPosts}: {addNewPost: any, setTotalPosts: any}) => {
  const [newPostContent, setNewPostContent] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { user } = useAuth();
  

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const previewUrl = URL.createObjectURL(file)
      setImagePreview(previewUrl)
    }
  }

  const handleCreatePost = async () => {
    
    if (!newPostContent.trim() && !imagePreview) return

    const formData = new FormData();
    formData.append("message", newPostContent.trim())
    if (imageFile) {
      formData.append("postPic", imageFile)
    }

    // Send the formData to your API endpoint
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/news-feed/`, {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    })
    const data = await response.json()
    if (!response.ok) {
      console.error("Error creating post:", data.message)
      return
    }

    const newPost = data

    addNewPost(newPost)
    setTotalPosts((prev: any) => prev + 1)
    setNewPostContent("")
    setImageFile(null)
    setImagePreview(null)
  }

  return (
    <Card>
        <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
            <Avatar>
                <AvatarImage src={user.profilePic} alt="User" />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <Textarea
                placeholder="What's on your mind?"
                className="resize-none"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
            />
            </div>
            {imagePreview && (
            <div className="mt-3 relative">
                <img
                src={imagePreview || "/placeholder.svg"}
                alt="Selected image"
                className="w-full h-auto max-h-80 object-contain rounded-md"
                />
                <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-black/50 text-white rounded-full h-8 w-8"
                onClick={() => {
                    setImagePreview(null)
                    setImageFile(null)
                }}
                >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                </svg>
                <span className="sr-only">Remove image</span>
                </Button>
            </div>
            )}
        </CardHeader>
        <CardFooter className="border-t pt-3 flex justify-between">
            <div className="flex gap-2">
            <input type="file" id="photo-upload" accept="image/*" className="hidden" onChange={handleImageSelect} />
            <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground"
                onClick={() => document.getElementById("photo-upload")?.click()}
            >
                <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-1"
                >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="9" cy="9" r="2" />
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                Photo
            </Button>
            </div>
            <Button size="sm" onClick={handleCreatePost} disabled={!newPostContent.trim() && !imagePreview}>
            Post
            </Button>
        </CardFooter>
        </Card>
  )
}

export default CreatePost