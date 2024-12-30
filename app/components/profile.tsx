import Link from "next/link";
interface Ticket {
    ticketNumber: string;
    seatNumber: string;
  }
  
  interface UserProfileProps {
    username: string;
    tickets: Ticket[];
    onCancel: (ticketNumber: string) => void;
  }
  
  export default function UserProfile({ username, tickets, onCancel }: UserProfileProps) {
    return (
        
      <div className="flex flex-col items-center bg-white shadow-md rounded-lg p-6 max-w-md mx-auto">
        <Link
        href="/"
        className="absolute top-4 left-4 text-blue-500 hover:underline font-medium text-lg"
      >
        &#8592; Back to Home
      </Link>
        {/* Profile Header */}
        <div className="w-24 h-24 bg-blue-500 text-white flex items-center justify-center rounded-full text-2xl font-bold mb-4">
          {username.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-lg font-semibold text-gray-800">{username}</h2>
        <p className="text-gray-500 text-sm">User Profile</p>
  
        {/* Booked Tickets Section */}
        <div className="mt-6 w-full">
          <h3 className="text-gray-700 font-medium text-lg mb-4">Booked Tickets</h3>
          {tickets.length === 0 ? (
            <p className="text-gray-500 text-sm text-center">No tickets booked yet.</p>
          ) : (
            <ul className="space-y-4">
              {tickets.map((ticket) => (
                <li
                  key={ticket.ticketNumber}
                  className="flex items-center justify-between bg-gray-50 p-4 rounded-lg shadow-sm border"
                >
                  <div>
                    <p className="text-gray-700 font-medium">
                      Ticket #{ticket.ticketNumber}
                    </p>
                    <p className="text-gray-500 text-sm">Seat: {ticket.seatNumber}</p>
                  </div>
                  <button
                    onClick={() => onCancel(ticket.ticketNumber)}
                    className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600"
                  >
                    Cancel
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    );
  }