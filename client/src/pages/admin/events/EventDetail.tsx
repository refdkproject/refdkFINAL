import { useEffect, useState } from "react";
import { SearchIcon } from "../../../icons/icons";
import { Card, CardContent } from "../../../components/ui/Card";
import { useAuth } from "../../../context/AuthContext";
import { useParams } from "react-router-dom";

export default function AdminEventDetailPage() {
  const { user } = useAuth();
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId || !user?.token) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/event/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch event.");
        }

        const data = await response.json();
        if (data.success) {
          console.log(data.data);
          setEvent(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch event.");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user]);

  return (
    <main className="min-h-[calc(100vh-4rem)] bg-[#E5EAE7] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-[#2D5A4C] mb-6">Discover Events</h1>

        {/* Search Bar */}
        <div className="relative mb-12">
          <input
            type="search"
            placeholder="Search..."
            className="w-full bg-white/80 backdrop-blur-sm pl-4 pr-12 h-12 text-lg"
          />
          <SearchIcon className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" />
        </div>

        {/* Event Details */}
        <div className="grid gap-8">
          <h2 className="text-3xl font-bold text-[#2D5A4C]">EVENT DETAILS</h2>

          <div className="grid gap-4">
            {loading ? (
              <p>Loading...</p>
            ) : event ? (
              <>
                <Card key={event._id} className="bg-white min-w-[50%]">
                  <CardContent className="p-6">
                    {event.eventPic && (
                      <img
                        src={`${event.eventPic.replace(/\\/g, "/")}`}
                        alt={event.name}
                        className="w-[20%] h-auto m-auto rounded-lg"
                      />
                    )}

                    <div className="space-y-4 mt-4">
                      <div className="flex justify-start gap-2 w-full">
                          <TextInput label="Event Name" value={event.name} />
                          <TextInput label="Description" value={event.description} />
                      </div>
                      <div className="flex justify-start gap-2 w-full">
                          <TextInput label="City" value={event.city} />
                          <TextInput label="Region" value={event.region} />
                      </div>
                      <div className="flex justify-start gap-2 w-full">
                          <TextInput label="Location" value={event.location} />
                          <TextInput label="Skill Level" value={event.skillLevel} />
                      </div>
                      <div className="flex justify-start gap-2 w-full">
                          <TextInput label="Number of Volunteers Required" value={event.numberOfVolunteer} />
                          <TextInput label="Volunteers Joined" value={event.volunteers.length} />
                      </div>
                      <div className="flex justify-start gap-2 w-full">
                          <TextInput
                          label="Start Date"
                          value={new Date(event.startDate).toLocaleString()}
                          />
                          <TextInput
                          label="End Date"
                          value={new Date(event.endDate).toLocaleString()}
                          />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white min-w-[50%]">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold">Volunteers Joined</h3>
                    <table className="min-w-full mt-4">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left">Name</th>
                    
                          <th className="px-4 py-2 text-left">Email</th>

                          <th className="px-4 py-2 text-left">Phone No.</th>
                        </tr>
                      </thead>
                      <tbody>
                        {event.volunteers.map((volunteer: any) => (
                          <tr key={volunteer._id}>
                            <td className="px-4 py-2 border-b">{volunteer.name}</td>
                            <td className="px-4 py-2 border-b">{volunteer.email}</td>
                            <td className="px-4 py-2 border-b">{volunteer.phoneNumber}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              </>
            ) : (
              <p>No event found.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function TextInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col w-full">
      <label className="text-lg font-semibold text-gray-700">{label}</label>
      <input
        type="text"
        value={value}
        readOnly
        className="bg-transparent border border-gray-400 rounded text-xl text-gray-900 focus:outline-none focus:border-[#2D5A4C] px-2 py-1"
      />
    </div>
  );
}
