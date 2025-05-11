import { useEffect, useState } from 'react';
import { Card, CardContent } from '../../../components/ui/Card';
import { useAuth } from '../../../context/AuthContext';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

type Event = {
  _id: string;
  name: string;
  description: string;
  city: string;
  region: string;
  location: string;
  skillLevel: string;
  numberOfVolunteer: number;
  volunteers: string[]; // Assuming this is an array of user IDs
  startDate: any; // Adjust types if needed
  endDate: any; // Adjust types if needed
  eventPic?: string; // Optional property
};

export default function EventDetailPage() {
  const { user } = useAuth();
  const { eventId } = useParams<{ eventId: string }>();

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId || !user?.token) return;

    const fetchEvent = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/event/${eventId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch event.');
        }

        const data = await response.json();
        if (data.success) {
          setEvent(data.data);
        } else {
          throw new Error(data.message || 'Failed to fetch event.');
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId, user]);

  const handleSubmit = async () => {
    if (!user?.token) {
      alert('You need to log in to join the event.');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/event/${eventId}/volunteer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Successfully joined the event!', { autoClose: 1500 });

        // Optionally, you can update the local event state to reflect the new number of volunteers
        setEvent((prevEvent: Event) => ({
          ...prevEvent,
          volunteers: [...prevEvent.volunteers, user.id], // Assuming user.id is the ID of the user
        }));
      } else {
        toast.error(data.message);
        // throw new Error(data.message || "Failed to join event.");
      }
    } catch (error: any) {
      console.error('Error joining event:', error);
      toast.error(error.message || 'Error Occured');
    }
  };

  return (
    <main className='min-h-[calc(100vh-4rem)] bg-[#E5EAE7] p-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-4xl font-bold text-[#2D5A4C] mb-6'>Discover Charities</h1>

        {/* Event Details */}
        <div className='grid gap-8'>
          <h2 className='text-3xl font-bold text-[#2D5A4C]'>EVENT DETAILS</h2>

          <div className='grid gap-4'>
            {loading ? (
              <p>Loading...</p>
            ) : event ? (
              <Card key={event._id} className='bg-white min-w-[50%]'>
                <CardContent className='p-6'>
                  {event.eventPic && (
                    <img
                      src={`${event.eventPic.replace(/\\/g, '/')}`}
                      alt={event.name}
                      className='w-[20%] h-auto m-auto rounded-lg'
                    />
                  )}

                  <div className='space-y-4 mt-4'>
                    <div className='flex justify-start gap-2 w-full'>
                      <TextInput label='Event Name' value={event.name} />
                      <TextInput label='Description' value={event.description} />
                    </div>
                    <div className='flex justify-start gap-2 w-full'>
                      <TextInput label='City' value={event.city} />
                      <TextInput label='Region' value={event.region} />
                    </div>
                    <div className='flex justify-start gap-2 w-full'>
                      <TextInput label='Location' value={event.location} />
                      <TextInput label='Skill Level' value={event.skillLevel} />
                    </div>
                    <div className='flex justify-start gap-2 w-full'>
                      <TextInput label='Number of Volunteers Required' value={event.numberOfVolunteer} />
                      <TextInput label='Volunteers Joined' value={event.volunteers.length} />
                    </div>
                    <div className='flex justify-start gap-2 w-full'>
                      <TextInput label='Start Date' value={new Date(event.startDate).toLocaleString()} />
                      <TextInput label='End Date' value={new Date(event.endDate).toLocaleString()} />
                    </div>
                  </div>

                  {event.volunteers.includes(user?._id) ? (
                    <p className='mt-6 text-green-500'>You have already joined this event.</p>
                  ) : new Date(event.endDate) < new Date() ? (
                    <p className='mt-6 text-red-500'>This event has already ended.</p>
                  ) : (
                    <button
                      className='bg-[#2D5A4C] text-white px-4 py-2 rounded hover:bg-[#1b3d3a] transition duration-300'
                      onClick={handleSubmit}
                    >
                      Join Event
                    </button>
                  )}
                </CardContent>
              </Card>
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
    <div className='flex flex-col w-full'>
      <label className='text-lg font-semibold text-gray-700'>{label}</label>
      <input
        type='text'
        value={value}
        readOnly
        className='bg-transparent border border-gray-400 rounded text-xl text-gray-900 focus:outline-none focus:border-[#2D5A4C] px-2 py-1'
      />
    </div>
  );
}
