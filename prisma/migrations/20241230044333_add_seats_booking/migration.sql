/*
  Warnings:

  - Added the required column `tickets_count` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `train_no` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `bookings` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('BOOKED', 'CANCELLED');

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "status" "BookingStatus" NOT NULL DEFAULT 'BOOKED',
ADD COLUMN     "tickets_count" INTEGER NOT NULL,
ADD COLUMN     "train_no" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "seats" (
    "train_no" INTEGER NOT NULL,
    "seat_id" SERIAL NOT NULL,
    "seat_number" INTEGER NOT NULL,
    "is_booked" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("seat_id")
);

-- CreateTable
CREATE TABLE "booking_seats" (
    "booking_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,

    CONSTRAINT "booking_seats_pkey" PRIMARY KEY ("booking_id","seat_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seats_seat_number_key" ON "seats"("seat_number");

-- CreateIndex
CREATE UNIQUE INDEX "seats_train_no_seat_number_key" ON "seats"("train_no", "seat_number");

-- AddForeignKey
ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("ticket_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking_seats" ADD CONSTRAINT "booking_seats_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("seat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
