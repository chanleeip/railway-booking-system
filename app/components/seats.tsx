import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

interface TrainProps {
  train_no: number;
  train_name: string;
}

const SeatSelection: React.FC<TrainProps> = ({
  train_no = "Unknown",
  train_name = "Unknown",
}) => {
  const totalSeats = 80;
  const [count, setCount] = useState<number | null>(null);
  const [bookedSeats, setBookedSeats] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<number>(1);
  const [bookingResult, setBookingResult] = useState<string>("");

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const token = Cookies.get("authToken");
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
            "Cache-Control": "no-cache",
          },
        };
        const response = await axios.get(
          `/api/bookings?train_no=${train_no}`,
          config
        );
        if (response.data) {
          setCount(response.data.count);
          setBookedSeats(
            response.data.seats.map((seat: any) => seat.seat_number)
          );
        }
      } catch (error) {
        console.error("Error fetching booking data:", error);
      }
    };

    fetchBookingData();
  }, [train_no]);

  const handleBookSeats = async () => {
    try {
      const token = Cookies.get("authToken");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(
        `/api/bookings`,
        {
          ticket_count: String(selectedSeats),
          train_no: Number(train_no),
        },
        config
      );
      setBookingResult(response.data.message);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setBookingResult("Error booking seats. Please try again.");
      console.error("Booking error:", error);
    }
  };

  // Determine the number of options based on the available seats
  const seatOptions = count && count < 7 ? Array.from({ length: count }, (_, i) => i + 1) : [1, 2, 3, 4, 5, 6, 7];

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Train Info */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Train Name: {train_name}
        </h1>
        <h1 className="text-xl font-semibold text-gray-700">
          Train No: {train_no}
        </h1>
        <h2 className="text-xl mt-4 font-bold text-gray-900">Seat Map</h2>
        <h3 className="text-xl mt-4 font-bold text-red-700">Red is Occupied</h3>
        <h3 className="text-xl mt-4 font-bold text-green-700">Green is Available</h3>
      </div>

      {/* Display Booking Count */}
      <div className="text-center my-8">
        <h1 className="text-3xl font-bold text-blue-600">
          {count !== null ? `Available Seats: ${count}` : "Loading..."}
        </h1>
      </div>

      <div className="flex flex-row items-start justify-center gap-8">
        {/* Seat Grid */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: totalSeats }).map((_, index) => {
              const seatNumber = index + 1;
              const isBooked = bookedSeats.includes(seatNumber);
              return (
                <div
                  key={seatNumber}
                  className={`w-12 h-12 flex items-center justify-center rounded-md border ${
                    isBooked
                      ? "bg-green-500 text-white border-green-700"
                      : "bg-red-500 text-white border-red-700"
                  }`}
                >
                  {seatNumber}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/3 bg-white shadow-lg p-6">
          <h2 className="text-lg font-bold mb-4 text-black">Book Your Seats</h2>
          {count === 0 ? (
            <p className="text-red-500 font-bold">All seats are full</p>
          ) : (
            <>
              <div className="mb-4">
                <label
                  htmlFor="seatSelector"
                  className="block text-sm font-medium mb-4 text-black"
                >
                  Number of Seats
                </label>
                <select
                  id="seatSelector"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md text-black"
                  value={selectedSeats}
                  onChange={(e) => setSelectedSeats(Number(e.target.value))}
                >
                  {seatOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <button
                onClick={handleBookSeats}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Book Now
              </button>
            </>
          )}

          {bookingResult && (
            <p className="mt-4 text-sm text-gray-700">{bookingResult}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;