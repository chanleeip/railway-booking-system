import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';
import { useRouter } from 'next/router'; // Import useRouter from next/router

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter(); // Initialize useRouter hook for navigation

  // Function to handle the ticket cancellation
  const cancelTicket = async (ticket_id) => {
    try {
      const token = Cookies.get("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        }
      };

      // Send the cancellation request using axios
      const res = await axios.delete(`/api/bookings?ticket_id=${ticket_id}`, config);

      if (res.status !== 200) {
        throw new Error('Failed to cancel ticket');
      }

      // Update the profile state with the new ticket status
      setProfile((prevProfile) => {
        const updatedTicketDetails = prevProfile.ticket_details.map((ticket) => {
          if (ticket.ticket_id === ticket_id) {
            return { ...ticket, status: 'CANCELLED' };
          }
          return ticket;
        });

        return { ...prevProfile, ticket_details: updatedTicketDetails };
      });
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    // Fetch the profile data from the API
    const fetchProfileData = async () => {
      try {
        const token = Cookies.get("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        };
        const res = await axios.get('/api/profile', config);

        if (res.status !== 200) {
          throw new Error('Failed to fetch profile data');
        }

        setProfile(res.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>No profile data available.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      {/* Back button using useRouter */}
      <button
        onClick={() => router.push('/')} // Use router.push to go to the homepage
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        Back to Home
      </button>
      
      <h1 className="text-2xl font-semibold mb-4 text-black">Profile: {profile.username}</h1>
      
      <div className="space-y-6">
        {profile.ticket_details.map((ticket) => (
          <div key={ticket.ticket_id} className="border-b pb-4">
            <h2 className="text-xl font-medium text-black">Ticket ID: {ticket.ticket_id}</h2>
            <div className="flex justify-between mb-4 text-black-600">
              <p className="text-black">Train No: {ticket.train_no}</p> {/* Set train no color to black */}
              <p>Status: 
                <span className={`font-semibold ${ticket.status === "BOOKED" ? 'text-green-500' : 'text-red-500'}`}>
                  {ticket.status}
                </span>
              </p>
            </div>
            <div className="flex justify-between text-gray-500">
              <p>Tickets Count: {ticket.tickets_count}</p>
              <p>Created At: {new Date(ticket.createdAt).toLocaleString()}</p>
            </div>
            <div className="flex justify-between text-gray-500">
              <p>Updated At: {new Date(ticket.updatedAt).toLocaleString()}</p>
            </div>
            
            {/* Show Cancel button only for BOOKED status */}
            {ticket.status === 'BOOKED' && (
              <button
                onClick={() => cancelTicket(ticket.ticket_id)}
                className="mt-4 bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              >
                Cancel Ticket
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;