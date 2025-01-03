import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import {jwtVerify,JWTPayload} from 'jose';
import { use } from "react";

const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_here'


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



export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const prisma = new PrismaClient();
    try {
        const token = req.headers.authorization?.split(' ')[1]; // Extract JWT from Authorization header

            if (!token) {
                return res.status(401).send("Authorization token is required");
            }

            // Verify the JWT token
            const username = await verifyToken(token,res);
            if (username=="Invalid Token"){
                return res.send("Invalid Token")
            }
        if (req.method === "GET") {
            const ticket_details= await prisma.bookings.findMany({
                where:{
                    user_id:Number(username?.id)
                },
                select:{
                    train_no:true,
                    ticket_id:true,
                    tickets_count:true,
                    status:true,
                    createdAt:true,
                    updatedAt:true
                }
            })
            res.json({"username":username?.username,ticket_details})
        }
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).send("Internal Server error");
    } finally {
        await prisma.$disconnect();
    }
}