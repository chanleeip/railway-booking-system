import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import {jwtVerify} from 'jose';
import { JWTPayload } from "jose";
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_here'

interface SeatRow {
    [row_no: number]: number[];
}

interface BestSeats {
    seats: number[];
}
async function verifyToken(token: string,res:NextApiResponse):Promise<JWTPayload | "Invalid Token">{
    try {
        // console.log(token)
        const { payload } = await jwtVerify(token, new TextEncoder().encode(SECRET_KEY));
        // console.log(payload)
        return payload;
    } catch (error) {
        // console.log(error)
       return "Invalid Token"
    }
}

async function find_best_seats(rows: SeatRow, num_seats: number): Promise<BestSeats | null> {
    for (const row in rows) {
        if (rows[row].length >= num_seats) {
            const seats = rows[row].slice(0, num_seats);
            return { seats };
        }
    }

    const allAvailableSeats = Object.values(rows).flat();
    if (allAvailableSeats.length >= num_seats) {
        allAvailableSeats.sort((a, b) => a - b);  // Sort seats by seat number
        return { seats: allAvailableSeats.slice(0, num_seats) };
    }

    return null;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    try {
        const token = req.headers.authorization?.split(' ')[1]; 
            if (!token) {
                return res.status(401).send("Authorization token is required");
            }

            // Verify the JWT token
            const username = await verifyToken(token,res);
            if (username=="Invalid Token"){
                return res.status(400).send("Invalid Token")
            }
        if (req.method === "POST") {

            const { ticket_count, train_no } = req.body;
            if (!ticket_count || !train_no) {
                return res.status(422).send("Missing attributes");
            }

            if (ticket_count > 7) {
                return res.status(422).send("Cannot book more than 7 tickets at the same time");
            }

            const user_id = typeof username === 'object' && username !== null ? username.id : null;

            if (!user_id) {
                return res.status(404).json({ message: "User not found" });
            }

            const booked_seats = await prisma.$transaction(async (tx) => {
                const available_tickets = await tx.seats.findMany({
                    where: { train_no: train_no, is_booked: false },
                    select: { seat_id: true, seat_number: true },
                    orderBy: { seat_number: 'asc' },
                });

                if (available_tickets.length < ticket_count) {
                    throw new Error("Seats not available");
                }

                let rows: SeatRow = {};
                available_tickets.forEach(({ seat_id, seat_number }) => {
                    const currentRow = seat_number >= 77 && seat_number <= 80 ? 12 : Math.ceil(seat_number / 7);
                    if (!rows[currentRow]) {
                        rows[currentRow] = [];
                    }
                    rows[currentRow].push(seat_id);
                });

                const booked_seats = await find_best_seats(rows, Number(ticket_count));

                if (!booked_seats) {
                    throw new Error("Not enough seats available");
                }

                const booking = await tx.bookings.create({
                    data: {
                        train_no: Number(train_no),
                        user_id: Number(user_id),
                        tickets_count: Number(ticket_count),
                        status: 'BOOKED',
                    },
                    select: { ticket_id: true },
                });

                for (const seat_id of booked_seats.seats) {
                    await tx.seats.update({
                        where: { seat_id: seat_id },
                        data: { is_booked: true },
                    });
                    await tx.booking_seats.create({
                        data: {
                            booking_id: booking.ticket_id,
                            seat_id: seat_id,
                        },
                    });
                }

                return booked_seats.seats;
            });

            return res.json({ message: "Booking successful", booked_seats });
        }
            else if(req.method == 'GET') {
            const { train_no } = req.query;
            // console.log(train_no)
            if (!train_no) {
                return res.status(400).send("Train number is required");
            }
            let available_seats_count = await prisma.seats.findMany({
                where: {
                    train_no: Number(train_no),
                    is_booked: false
                },
                select: {
                    seat_number: true
                }
            });
            return res.json({ "count": available_seats_count.length, "seats": available_seats_count });
        }
        else if(req.method=='DELETE'){
            const {ticket_id}=req.query
            if (!ticket_id) {
                return res.status(400).send("Train number is required");
            }
            const cancelResult = await prisma.$transaction(async (tx)=>{
                let available_seats_count=await tx.booking_seats.findMany({
                     where:{
                       booking_id:Number(ticket_id),
                   },
                   select:{
                        seat_id:true
                   }
                  })
                    if (available_seats_count.length === 0) {
                      return res.status(404).send("No seats found for this ticket ID");
                    }
                    await tx.seats.updateMany({
                       where: {
                          seat_id: { in: available_seats_count.map(seat => seat.seat_id) },  
                      },
                   data: {
                       is_booked: false,  
                   }
                });
                await tx.bookings.updateMany({
                    where: {
                       ticket_id: Number(ticket_id),  
                   },
                data: {
                    status: 'CANCELLED',  
                }
             });
               return {message:"Cancelled Tickets Sucessfully"}
            })
            res.json(cancelResult)
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server error");
    } finally {
        await prisma.$disconnect();
    }
}