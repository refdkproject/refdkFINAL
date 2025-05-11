import { useEffect, useState } from "react";
import { Card, CardContent } from "../../../components/ui/Card";
import { useAuth } from "../../../context/AuthContext";

export default function InstitutionPage() {
  const { user } = useAuth()
  
  const [institution, setInstitution] = useState([]);

  useEffect(() => {
    const fetchInstitution = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/institutions`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Attach Bearer Token
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch Institution. Please check your token.");
        }
      
        const data = await response.json();
        if (data.success) {
          setInstitution(data.data);
        } else {
          throw new Error(data.message || "Failed to fetch Institution.");
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchInstitution();
  }, []);

  return (
    <main className="min-h-[calc(100vh-4rem)] p-8">
      <div className="max-w-6xl mx-auto">

        <div className="grid gap-8">
          <div>
            <h2 className="text-3xl font-bold text-[#2D5A4C] mb-8">My Charity Info</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-1 gap-2">
              {institution.map((institution: any) => (
                <Card key={institution._id} className="bg-white min-w-[50%]">
                  <CardContent className="p-4">
                    <img
                      src={institution.logo || "https://via.placeholder.com/150"}
                      alt={`${institution.name} logo`}
                      className="w-40 h-auto rounded-lg"
                    />
                    <h3 className="font-semibold mt-2">Name: {institution.name}</h3>
                    <h4 className="text-sm mb-3">Organization Type: {institution.type}</h4>
                    <h4 className="text-sm mb-3">Events:</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                        {institution?.events && institution.events.length > 0 ? (
                            institution.events.map((event: any, index: number) => (
                            <div key={index} className="border p-4 rounded-lg shadow-md bg-white">
                                <h4 className="font-semibold">{event.name}</h4>
                                <p className="text-sm text-gray-600">{event.date}</p>
                                {/* Uncomment below if description is needed */}
                                {/* <p className="text-sm text-gray-700 italic">"{event.description}"</p> */}
                                <p className="text-xs text-gray-500 mt-2">
                                Location: {event.city}, {event.region}, {event.location}
                                </p>
                            </div>
                            ))
                        ) : (
                            <p className="text-gray-600">No events available</p>
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
