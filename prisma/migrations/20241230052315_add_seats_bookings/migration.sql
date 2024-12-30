/*
  Warnings:

  - You are about to drop the `booking_seats` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `bookings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `seats` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "booking_seats" DROP CONSTRAINT "booking_seats_booking_id_fkey";

-- DropForeignKey
ALTER TABLE "booking_seats" DROP CONSTRAINT "booking_seats_seat_id_fkey";

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_user_id_fkey";

-- DropTable
DROP TABLE "booking_seats";

-- DropTable
DROP TABLE "bookings";

-- DropTable
DROP TABLE "seats";

-- CreateTable
CREATE TABLE "Bookings" (
    "ticket_id" SERIAL NOT NULL,
    "train_no" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "tickets_count" INTEGER NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'BOOKED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookings_pkey" PRIMARY KEY ("ticket_id")
);

-- CreateTable
CREATE TABLE "Seats" (
    "train_no" INTEGER NOT NULL,
    "seat_id" SERIAL NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "is_booked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Seats_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "Booking_seats" (
    "booking_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,

    CONSTRAINT "Booking_seats_pkey" PRIMARY KEY ("booking_id","seat_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Seats_seat_number_key" ON "Seats"("seat_number");

-- CreateIndex
CREATE UNIQUE INDEX "Seats_train_no_seat_number_key" ON "Seats"("train_no", "seat_number");

-- AddForeignKey
ALTER TABLE "Bookings" ADD CONSTRAINT "Bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking_seats" ADD CONSTRAINT "Booking_seats_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "Bookings"("ticket_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking_seats" ADD CONSTRAINT "Booking_seats_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "Seats"("seat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
