import Navbar from "@/app/components/navbar";
import SeatSelection from "@/app/components/seats";
import '@/app/globals.css'; 
import Cookies from 'js-cookie'
import { useState,useEffect } from "react";
import { useRouter } from "next/router"; // Ensure this line is present
export default function TrainPage(){
    const router = useRouter();

    // Access query parameters from the URL
    const [username, setUsername] = useState<string>('');
    useEffect(() => {
      const cookieUsername = Cookies.get('username');
      setUsername(cookieUsername || ""); 
    }, []);
    const trainNo = 1000;
    const trainName = "TRAIN-A";
    return(
        <div>
    <Navbar username={username}/>
    <SeatSelection train_no={trainNo} train_name={trainName}/>
    </div>
    )
}