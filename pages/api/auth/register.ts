import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface SeatRow {
    [row_no:number]: number[];
  }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const prisma=new PrismaClient()
  try{
    if (req.method === "POST") {
        const { ticket_count,username,train_no } = req.body;
        if (!ticket_count || !username || !train_no) {
            res.status(422).send("Missing attributes")
             return
        }
        if (ticket_count>7){
            res.status(422).send("Cannot book more than 7 tickets at same time")
             return
        }
        const user_id=await prisma.users.findFirst({where:{username:username},select:{id:true}})

          if(!user_id){
            res.status(404).json({message:"User not found"})
           return
          }
        let available_tickets = await prisma.seats.findMany(
            {
            where: {
              train_no: train_no, 
              is_booked: false,
            },
            select: {
                seat_id: true,
                seat_number: true,
              },
            orderBy:{
                seat_number:'asc'
            },
          }
        );
        if (available_tickets.length < ticket_count) {
            res.status(422).json({ message: "Seats not available" });
             return
          } 
          let rows:SeatRow={}
        available_tickets.forEach(({seat_id,seat_number},number)=>{
            var currentRow = Math.ceil(seat_number / 7);
            if (seat_number >=77 && seat_number<=80){
                currentRow=12
            }
           if(!rows[currentRow]){
            rows[currentRow] = [];
           }
           rows[currentRow].push(seat_id)
            
        })
        res.json(rows)
}
  }
   catch (error) {
       console.error("error",error)
     res.status(500).send("internal server error");
  }
    finally {
     await prisma.$disconnect()
  }
}