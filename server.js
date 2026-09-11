import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./dbConnect.ts";
import moviesRouter from "./routes/moviesRoute.ts";

async function start() {
    dotenv.config({
        path: "./.env" 
    });

    const app = express();
    const PORT = process.env.PORT || 5000;

    await connectDB();

    app.use(cors());
    app.use(express.json());

    app.use("/movies", moviesRouter);

    app.listen(PORT, () => {
        console.log(`Server listening on Port ${PORT}`);
    });
}

start();