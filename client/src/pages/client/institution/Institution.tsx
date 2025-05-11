import { useEffect, useState } from 'react';
import { SearchIcon } from '../../../icons/icons';
import { Card, CardContent } from '../../../components/ui/Card';
import { useAuth } from '../../../context/AuthContext';
import { Link } from 'react-router-dom';

export default function InstitutionPage() {
  const { user } = useAuth();

  const [institution, setInstitution] = useState([]);
  const [tempEvents, setTempEvents] = useState(institution);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/institutions`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`, // Attach Bearer Token
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch Institution. Please check your token.');
        }

        const data = await response.json();
        if (data.success) {
          setInstitution(data.data);
          setTempEvents(data.data); // Store the original data for filtering
        } else {
          throw new Error(data.message || 'Failed to fetch Institution.');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchInstitution();
  }, []);

  return (
    <main className='min-h-[calc(100vh-4rem)] bg-[#E5EAE7] p-8'>
      <div className='max-w-6xl mx-auto'>
        <h1 className='text-4xl font-bold text-[#2D5A4C] mb-6'>Discover Charities</h1>

        <div className='relative mb-12'>
          <input
            type='search'
            placeholder='Search...'
            className='w-full bg-white/80 backdrop-blur-sm pl-4 pr-12 h-12 text-lg'
            onChange={(e) => {
              const searchTerm = e.target.value.toLowerCase();
              if (searchTerm === '') {
                setInstitution(tempEvents);
                return;
              }
              setInstitution((prevEvents) =>
                prevEvents.filter(
                  (event: any) =>
                    event.name.toLowerCase().includes(searchTerm) || event.type.toLowerCase().includes(searchTerm)
                )
              );
            }}
          />
          <SearchIcon className='absolute right-4 top-1/2 -translate-y-1/2 text-gray-500' />
        </div>

        <div className='grid gap-8'>
          <div>
            <h2 className='text-3xl font-bold text-[#2D5A4C] mb-8'>Charity Centers</h2>
            <div className='grid sm:grid-cols-2 lg:grid-cols-1 gap-2'>
              {institution.map((institution: any) => (
                <Card key={institution._id} className='bg-white min-w-[50%]'>
                  <CardContent className='p-4'>
                    {institution.logo ? (
                      <img src={institution.logo} alt={`${institution.name} logo`} className='w-40 h-auto rounded-lg' />
                    ) : null}
                    <h3 className='font-semibold mt-2'>Name: {institution.name}</h3>
                    <h4 className='text-sm mb-3'>Organization Type: {institution.type}</h4>
                    <h4 className='text-sm mb-3'>Events:</h4>
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
                      {institution?.events && institution.events.length > 0 ? (
                        institution.events.map((event: any) => {
                          console.log(event);
                          return (
                            <Link to={`/event-detail/${event._id}`} className='block' key={event._id}>
                              <div key={event._id} className='border p-4 rounded-lg shadow-md bg-white'>
                                <h4 className='font-semibold'>{event.name}</h4>
                                <p className='text-sm text-gray-600'>{event.date}</p>
                                <p className='text-xs text-gray-500 mt-2'>
                                  Location: {event.city}, {event.region}, {event.location}
                                </p>
                              </div>
                            </Link>
                          );
                        })
                      ) : (
                        <p className='text-gray-600'>No events available</p>
                      )}
                    </div>
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
