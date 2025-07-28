import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from '@google/generative-ai';
import fetch from 'node-fetch';
import 'dotenv/config';
import mongoose from "mongoose";
import chartRoutes from "./routes/chat.js"
import userRoutes from "./routes/users.routes.js";

const app = express();
const PORT =  8080;

app.use(express.json());
app.use(cors());

app.use("/api", chartRoutes);
app.use("/api", userRoutes);


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
  } catch (err) {
    console.log("Failed to connect with Db", err);
  }
};



app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
    connectDB();
});