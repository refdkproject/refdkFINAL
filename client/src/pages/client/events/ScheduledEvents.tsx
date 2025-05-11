import { useEffect, useState } from "react";
import { SearchIcon } from "../../../icons/icons";
import { Card, CardContent } from "../../../components/ui/Card";
import { useAuth } from "../../../context/AuthContext";
import { Link } from "react-router-dom";
import { MoveRight } from "lucide-react";

export default function ScheduledEventsPage() {
  const { user } = useAuth()
  
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/event/joined`, {
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
          Scheduled Events
        </h1>

        <div className="relative mb-12">
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-white/80 backdrop-blur-sm pl-4 pr-12 h-12 text-lg"
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="grid gap-8">
          <div>
            <h2 className="text-3xl font-bold text-[#2D5A4C] mb-8">List of your Scheduled Events</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {events.map((event: any) => (
                <Card key={event._id} className="bg-white min-w-[50%]">
                <CardContent className="p-4">
                  <img
                    src={`${event.eventPic.replace(/\\/g, "/")}`}
                    alt={event.name}
                    className="w-[400px] h-[200px] object-cover rounded-lg"
                  />
                  <h3 className="font-semibold mt-2">{event.name}</h3>
                  <i className="text-sm text-gray-600">{event.description}</i>
                  <p className="text-sm text-gray-600">Volunteers Needed: {event?.numberOfVolunteer}</p>
                  <p className="text-sm text-gray-600">Volunteers Joined: {event?.volunteers.length > 0 ? event.volunteers.length : 'None' }</p>
                  <p className="text-sm text-gray-600 mt-2">
                      <Link className="flex items-center gap-2 cursor-pointer" to={`/event-detail/${event._id}`}>
                          Details <MoveRight />
                      </Link>
                    </p>

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
