import express from "express";
import "dotenv/config";
import cors from 'cors';
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRouter.js";

const app=express()
//conn db
await connectDB()

app.use(cors())
app.use(express.json())


//Route
app.get('/',(req,res)=>res.send("Server is running"))
app.use('/api/user',userRouter)


const PORT=process.env.PORT  || 3000

app.listen(PORT,()=>console.log(`Server running on PORT:${PORT}`))

