'use client';
import Link from "next/link";
import { useEffect } from "react";
import '@/app/globals.css'; 
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import profile from '../pages/profile';
export default function HomePage() {

  const router=useRouter()
  const handleTrainBooking = () =>  {
    const authToken = Cookies.get('authToken');
    if (!authToken) {
      alert('You are not signed in. Sign in or Register');
    }
    else{
      router.push('/trains/TRAIN-A')
    }
  }
  const profileHandling = () =>  {
    const authToken = Cookies.get('authToken');
    if (!authToken) {
      alert('You are not signed in. Sign in or Register');
    }
    else{
      router.push('/profile')
      
    }
  }
  return (
    
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="w-full bg-blue-500 text-white py-4">
        <div className="container mx-auto text-center">
          <h1 className="text-2xl font-bold">Train Seat Reservation System</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col items-center justify-center w-full flex-1 px-4">
        <h2 className="text-xl font-semibold mb-4 text-black">Welcome to the Booking Portal</h2>
        <p className="text-gray-700 mb-8 text-center max-w-2xl">
          Reserve seats easily with our system! There are 80 seats in the train, with 7 seats in each row and 3 in the last row. 
          You can reserve up to 7 seats at a time, and we prioritize booking seats in the same row. If not possible, we will try to allocate nearby seats.
        </p>

        {/* Links */}
        <div className="flex gap-6">
          <Link
            href="/login"
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Signup
          </Link>
          <button
          onClick={profileHandling}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Profile
          </button>
        </div>

        <div className="mt-8">
        <button
          onClick={handleTrainBooking}
          className="bg-green-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
        >
          Go to Booking
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© 2024 Train Reservation System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}