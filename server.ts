import express, { type NextFunction, type Request, type Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./dbConnect.ts";
import moviesRouter from "./routes/moviesRoute.ts";
import authRouter from "./routes/authenticationRoute.ts";
import watchlistRouter from "./routes/watchlistRoute.ts";

async function start() {
    dotenv.config({
        path: "./.env" 
    });

    const app = express();
    const PORT = process.env.PORT || 5000;

    await connectDB();

    app.use(cors({
        origin: "http://localhost:5173",
        credentials: true
    }));
    app.use(cookieParser());
    app.use(express.json());

    app.use("/api/auth", authRouter);
    app.use("/api/movies", moviesRouter);
    app.use("/api/watchlist", watchlistRouter);

    app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
        res.status(500).json({
            message: err.message || "Internal Server Error"
        });
    });

    app.listen(PORT, () => {
        console.log(`Server listening on Port ${PORT}`);
    });
}

start();