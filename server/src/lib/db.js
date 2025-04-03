import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL);
        console.log(`Database Connected`)
    } catch (error) {
        console.log("Database connection error", error)
    }
}