import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./dbConnect.ts";

dotenv.config({
   path: "./.env" 
});

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());

app.get("/", (req, res) => {
    res.status(200).json({
        message: "hoolla",
        ind: 3
    });
});

app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
});