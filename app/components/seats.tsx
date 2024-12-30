import { useState } from "react";

interface TrainProps {
  train_no: string;
  train_name:string
}

const SeatSelection: React.FC<TrainProps> = ({ train_no = "Unknown",train_name="Unknown" }) => {
    console.log(train_no)
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [seatCount, setSeatCount] = useState<number>(1);

  const totalSeats = 80; // Total number of seats

  // Auto-select seats based on dropdown selection
  const handleSeatSelection = (count: number) => {
    const availableSeats = Array.from({ length: totalSeats })
      .map((_, index) => index + 1)
      .filter((seat) => !selectedSeats.includes(seat)); // Get available seats

    const seatsToSelect = availableSeats.slice(0, count); // Pick the required number of seats
    setSelectedSeats([...selectedSeats, ...seatsToSelect]);
  };

  // Toggle individual seat selection
  const toggleSeatSelection = (seatNumber: number) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((seat) => seat !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      {/* Train Info */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Train Name:  {train_name}</h1>
        <h1 className="text-xl font-semibold text-gray-700">Train No: {train_no}</h1>
        <h2 className="text-xl mt-4 font-bold text-gray-900">Seat Selection</h2>
      </div>

      <div className="flex flex-col md:flex-row items-start justify-center gap-8">
        {/* Seat Grid */}
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: totalSeats }).map((_, index) => {
              const seatNumber = index + 1;
              const isSelected = selectedSeats.includes(seatNumber);

              return (
                <button
                  key={seatNumber}
                  className={`w-12 h-12 flex items-center justify-center rounded-md border ${
                    isSelected
                      ? "bg-green-500 text-white border-green-700"
                      : "bg-gray-200 text-black border-gray-300"
                  } hover:bg-gray-300 focus:outline-none`}
                  onClick={() => toggleSeatSelection(seatNumber)}
                  disabled={isSelected} // Disable button if already selected
                >
                  {seatNumber}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdown and Selected Seats */}
        <div className="w-full md:w-1/4 bg-white p-4 shadow-md rounded-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Select Seats:</h2>
          <select
            className="w-full p-2 border rounded-md mb-4 text-black" 
            value={seatCount}
            onChange={(e) => setSeatCount(Number(e.target.value))}
          >
            {Array.from({ length: 7 }).map((_, index) => (
              <option key={index + 1} value={index + 1}>
                {index + 1}
              </option>
            ))}
          </select>
          <button
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
            onClick={() => handleSeatSelection(seatCount)}
          >
            Select {seatCount} Seats
          </button>

          <h2 className="text-lg font-semibold mt-6 text-gray-800">Selected Seats:</h2>
          {selectedSeats.length > 0 ? (
            <>
              <p className="text-gray-800 mb-2">
                <strong>Count:</strong> {selectedSeats.length}
              </p>
              <p className="text-gray-800">
                <strong>Seat Numbers:</strong> {selectedSeats.join(", ")}
              </p>
            </>
          ) : (
            <p className="text-gray-500">No seats selected</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;