import UserProfile from "@/app/components/profile";
import { useState } from "react";
import '@/app/globals.css'
export default function profile(){
    const initialTickets = [
        { ticketNumber: "1001", seatNumber: "A1" },
        { ticketNumber: "1002", seatNumber: "A2" },
        { ticketNumber: "1003", seatNumber: "B1" },
      ];
    
      const [tickets, setTickets] = useState(initialTickets);
    
      const handleCancel = (ticketNumber: string) => {
        setTickets((prevTickets) => prevTickets.filter(ticket => ticket.ticketNumber !== ticketNumber));
        alert(`Canceled ticket #${ticketNumber}`);
      };
    
      return (
        <UserProfile username="gnm" tickets={tickets} onCancel={handleCancel} />
      );
}