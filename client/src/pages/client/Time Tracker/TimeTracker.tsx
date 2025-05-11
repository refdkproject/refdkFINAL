import { useEffect, useState } from 'react'
import { Card, CardContent } from '../../../components/ui/Card'
import { useAuth } from '../../../context/AuthContext';

const TimeTracker = () => {
    const { user } = useAuth()
    const [events, setEvents] = useState([])

    // Fetch data from API
    useEffect(() => {
    const fetchPosts = async () => {
        try {
        const url = `${import.meta.env.VITE_BASE_URL}/api/event/joined`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
            Authorization: `Bearer ${user?.token}`,
            // Do NOT add "Content-Type": "multipart/form-data" (browser will set it automatically)
            },
        });
        
        if (!response.ok) throw new Error("Failed to fetch posts");
        
        const data = await response.json();
        if (!data.success) {
            setEvents([])
            return;
        }
        setEvents(data.data)
        } catch (error) {
            console.log(error)
        }
    };

    fetchPosts();
    }, []);

  return (
    <>
        <Card className="min-h-screen bg-[#E5EAE7] min-w-[50%] p-4">
            <CardContent className="p-6">
            <h3 className="text-xl font-semibold">Events Attendance Record</h3>
            <table className="min-w-full mt-4">
                <thead>
                <tr className='bg-gray-100'>
                    <th className="px-4 py-2 text-left">Image</th>

                    <th className="px-4 py-2 text-left">Event Name</th>
            
                    <th className="px-4 py-2 text-left">Location</th>
                    
                    <th className="px-4 py-2 text-left">Region</th>

                    <th className="px-4 py-2 text-left">Total Volunteers</th>

                    <th className="px-4 py-2 text-left">Duration</th>
                </tr>
                </thead>
                <tbody>
                {events?.length === 0 && (
                    <tr>
                        <td colSpan={6} className="text-center py-4">No events found.</td>
                    </tr>
                )}
                {events?.map((event: any) => (
                    <tr key={event._id} className='odd:bg-white even:bg-gray-100'>
                    <td className="px-4 py-2 border-b"> <img src={event.eventPic} alt="" width={50} /></td>
                    <td className="px-4 py-2 border-b">{event.name}</td>
                    <td className="px-4 py-2 border-b">{event.location}</td>
                    <td className="px-4 py-2 border-b">{event.region}</td>
                    <td className="px-4 py-2 border-b">{event.numberOfVolunteer}</td>
                    <td className="px-4 py-2 border-b">
                        {(() => {
                            const createdAtDate = new Date(event.startDate);
                            const now = new Date(event.endDate);
                            const diffInSeconds = Math.floor((now.getTime() - createdAtDate.getTime()) / 1000);
                            let timeAgo = '';

                            if (diffInSeconds < 60) {
                            timeAgo = `${diffInSeconds} seconds`;
                            } else if (diffInSeconds < 3600) {
                            const minutes = Math.floor(diffInSeconds / 60);
                            timeAgo = `${minutes} minute${minutes > 1 ? "s" : ""}`;
                            } else if (diffInSeconds < 86400) {
                            const hours = Math.floor(diffInSeconds / 3600);
                            timeAgo = `${hours} hour${hours > 1 ? "s" : ""}`;
                            } else {
                            const days = Math.floor(diffInSeconds / 86400);
                            timeAgo = `${days} day${days > 1 ? "s" : ""}`;
                            }

                            return timeAgo;
                        })()}
                    </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </CardContent>
        </Card>
    </>
  )
}

export default TimeTracker