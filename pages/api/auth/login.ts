import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import bcryptjs from 'bcryptjs';
import {SignJWT} from 'jose';
let prisma=new PrismaClient()
const SECRET_KEY = process.env.JWT_SECRET || 'your_secret_key_here'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { username, password } = req.body;
    
        try {
          const user = await prisma.users.findUnique({
            where: { username },
          });
    
          if (!user) {
            return res.status(400).json({ error: "User not found" });
          }
    
          const isPasswordValid = await bcryptjs.compare(password, user.password);
          if (!isPasswordValid) {
            return res.status(400).json({ error: "Invalid credentials" });
          }
    
          const token = await new SignJWT({ id: user.id, username: user.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(new TextEncoder().encode(SECRET_KEY));
          res.status(200).json({ "token":token,"username":username });
          console.log("Logged")
        } catch (error) {
          res.status(500).json({ error: "Internal server error" });
        } finally {
          await prisma.$disconnect();
        }
      } else {
        res.status(405).json({ error: "Method Not Allowed" });
      }
    }

