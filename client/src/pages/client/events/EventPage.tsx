import { useEffect, useState } from "react";
import { SearchIcon, MapPinIcon } from "../../../icons/icons";
import { Card, CardContent } from "../../../components/ui/Card";
import { useAuth } from "../../../context/AuthContext";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function EventsPage() {
  const { user } = useAuth()
  
  const [events, setEvents] = useState([]);
  const [tempEvents, setTempEvents] = useState(events);
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/event`, {
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
          setTempEvents(data.data);
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
          Discover Events
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
                  event.name.toLowerCase().includes(searchTerm)
                )
              );
            }}
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        <div className="flex gap-8">
          <div className="space-y-6 max-w-[75%]">
            <h2 className="text-3xl font-bold text-[#2D5A4C] mb-8">EVENTS</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {events.map((event: any) => (
                <Card key={event._id} className="bg-white min-w-[50%]">
                  <CardContent className="p-4">
                    <img
                      src={`${event.eventPic.replace(/\\/g, "/")}`}
                      alt={event.name}
                      className="w-[400px] h-[200px] object-cover rounded-lg"
                    />
                    <h3 className="font-semibold mt-2">{event.name}</h3>
                    <i className="text-sm text-gray-600">{event.description.length > 100 ? `${event.description.substring(0, 100)}...` : event.description}</i>
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

              <Card className="bg-white">
                <CardContent className="p-4 flex flex-col items-center gap-2">
                  <MapPinIcon size={40} />
                  <h3 className="font-semibold">Nearby Location</h3>
                  <p className="text-sm text-center text-gray-600">
                    Find Nearby Centers For You
                  </p>
                  <a href={'https://maps.app.goo.gl/HLxL45qTn2fmRCLu8'} target="_blank" className="text-center">
                    <button className="mt-2 sm:w-full">Search</button>
                  </a>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-6 w-[25%]">
            <div>
              <h3 className="text-md font-semibold mb-2">
                FOR OFFICIAL SIGNED CREDIT HOURS PLEASE REGISTER IN NVG
              </h3>
              <a
                href="https://nvg.gov.sa/"
                target="_blank"
                className="block text-center py-2 bg-[#2D5A4C] text-white hover:bg-[#234539] rounded"
              >
                Register at NVG
              </a>
            </div>

            <div>
              <h3 className="text-md font-semibold mb-2">
                FOR EVENT SCHEDULES PLEASE CHECK THE EVENT SCHEDULE
              </h3>
              <Link to={'/scheduled-events'}>
                <button className="w-full text-white py-2 bg-[#2D5A4C] hover:bg-[#234539]">
                  Scheduled Events
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
