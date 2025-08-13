import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

dotenv.config();


const Port = process.env.PORT || 3000;
const _dirname = path.resolve();

app.use(express.json({ limit: '10mb' }))
app.use(cookieParser())
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(_dirname, "../client/dist")));

    app.get("*",(req, res)=>{
        res.sendFile(path.join(_dirname, "../client", "dist", "index.html"))
    })
}

 connectDB();
server.listen(Port, () => {
   
    console.log(`server is running at http://localhost:${Port}hi`);
    
});
