import Link from "next/link";
import '@/app/globals.css';  
export default function HomePage() {
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
            href="/signup"
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 transition"
          >
            Signup
          </Link>
        </div>

        <div className="mt-8">
          <Link
            href={`/trains/TRAIN-A`}
            className="text-blue-500 hover:underline font-medium text-lg"
          >
            Go to Train A Booking
          </Link>
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