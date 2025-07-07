import express from "express";
import "dotenv/config";
import cors from 'cors';
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRouter.js";
import ownerRouter from "./routes/ownerRoute.js";
import bookingRouter from "./routes/bookingRoutes.js";
const app=express()
//conn db
await connectDB()

app.use(cors())
app.use(express.json())


//Route
app.get('/',(req,res)=>res.send("Server is running"))
app.use('/api/user',userRouter)
app.use('/api/owner',ownerRouter)
app.use('/api/bookings',bookingRouter)

const PORT=process.env.PORT  || 3000

app.listen(PORT,()=>console.log(`Server running on PORT:${PORT}`))

