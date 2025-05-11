"use client"

import { useEffect, useState } from "react"
import {MessageSquare, User } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardHeader } from "./ui/Card"
import { Separator } from "./ui/separator"
import PostCard from "./post-card"
import CreatePost from "./create-post"
import { useAuth } from "../context/AuthContext"

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

export default function NewsFeed() {
    const { user } = useAuth();
    const [userData, setUserData] = useState<any>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [likes, setLikes] = useState(user?.totallikes ? user?.totallikes : 0);
    const [totalposts, setTotalPosts] = useState(user?.totalPosts ? user?.totalPosts : 0);
    const [error, setError] = useState<string | null>(null);

    const addNewPost = (newPost: Post) => {
      console.log(newPost);
      setPosts([newPost, ...posts])
    }

    const deletePost = (id: string) => {
      setPosts(posts.filter((post) => post._id !== id))
    }
    
    // Fetch data from API
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/users/profile`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.token}`,
            },
          });
          
          if (!response.ok) throw new Error("Failed to fetch posts");
          
          const data = await response.json();
          setUserData(data.data);
        } catch (error) {
          setError("Error fetching posts.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchUserData();
    }, []);
    
    // Fetch data from API
    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await fetch(`${import.meta.env.VITE_BASE_URL}/news-feed/`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${user?.token}`,
              // Do NOT add "Content-Type": "multipart/form-data" (browser will set it automatically)
            },
          });
          
          if (!response.ok) throw new Error("Failed to fetch posts");
          
          const data = await response.json();
          console.log(data)
          setPosts(data);
        } catch (error) {
          setError("Error fetching posts.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchPosts();
    }, []);

  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-4 gap-6">
      {/* Left sidebar */}
      <aside className="hidden md:block col-span-1">
        <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col items-center text-center">
          <Avatar className="h-16 w-16 mb-2">
            <AvatarImage src={userData?.profilePic ?? '' } alt="User" />
            <AvatarFallback>{user?.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="font-semibold">{user?.name}</h2>
          <p className="text-sm text-muted-foreground">{user?.role}</p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Total Post</span>
            <span className="font-medium">{userData?.totalPosts > totalposts ? userData?.totalPosts : totalposts}</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-muted-foreground">Likes</span>
            <span className="font-medium">{userData?.totalLikes > likes ? userData?.totalLikes : likes}</span>
          </div>
          </div>
          <Separator className="my-3" />
          <nav className="space-y-1">
          <Link to="/profile" className="flex items-center gap-2 py-1.5 text-sm hover:text-blue-600">
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </Link>
          <Link to="/chat" className="flex items-center gap-2 py-1.5 text-sm hover:text-blue-600">
            <MessageSquare className="h-4 w-4" />
            <span>Messages</span>
          </Link>
          </nav>
        </CardContent>
        </Card>
      </aside>

      {/* Main feed */}
      <div className="col-span-1 md:col-span-3 space-y-4">
        {/* Loading state */}
        {loading && <p className="text-center text-gray-500">Loading posts...</p>}
        {/* Error state */}
        {error && <p className="text-center text-red-500">{error}</p>}
        {/* Create post */}
        {!loading && !error && <CreatePost addNewPost={addNewPost} setTotalPosts={setTotalPosts} />}
        {/* Posts */}
        {!loading && !error && posts.map((post) => (
        <PostCard key={post._id} post={post} setLikes={setLikes} deletePost={deletePost} />
        ))}
      </div>
      </main>
    </div>
  )
}
