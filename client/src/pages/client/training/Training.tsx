import { useEffect, useState } from "react";
import { SearchIcon } from "../../../icons/icons";
import { Card, CardContent } from "../../../components/ui/Card";
import { useAuth } from "../../../context/AuthContext";

export default function TrainingPage() {
  const { user } = useAuth()
  
  const [events, setEvents] = useState([]);
  const [tempEvents, setTempEvents] = useState(events);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/training`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Attach Bearer Token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch events. Please check your token.");
        }
      
        const data = await response.json();
        if (data.success) {
          setEvents(data.data);
          setTempEvents(data.data); // Store the original data for filtering
        } else {
          throw new Error(data.message || "Failed to fetch events.");
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchEvents();
  }, []);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E5EAE7] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2D5A4C] mb-6">
          Discover Tutorials
        </h1>

        <div className="relative mb-12">
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-white/80 backdrop-blur-sm pl-4 pr-12 h-12 text-lg"
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              if (searchTerm === "") {
                setEvents(tempEvents);
                return;
              }
              setEvents((prevEvents) =>
                prevEvents.filter((event: any) =>
                  event.title.toLowerCase().includes(searchTerm)
                )
              );
            }}
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="grid gap-8">
          <div>
            <h2 className="text-3xl font-bold text-[#2D5A4C] mb-8">Tutorials</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {events.map((event: any) => (
                <Card key={event._id} className="bg-white hover:bg-[#F7F7F7] min-w-[50%]">
                  <CardContent className="p-4">
                    <video className='w-full h-[250px]' controls src={event.mediaUrl}></video>

                    <h3 className="font-semibold mt-2">Title: {event.title}</h3>
                    <h4 className="text-sm mb-3">Organization: {event.tags}</h4>
                    <blockquote className="text-sm text-gray-600 italic border-l-4 border-gray-400 pl-3">
                        "{event.description}"
                    </blockquote>
                  </CardContent>
                </Card>
              ))}

            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
