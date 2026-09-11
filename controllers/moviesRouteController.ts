import { prisma } from "../dbConnect.ts";
import express from "express";
    
async function getMovies(req : express.Request, res : express.Response) {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const skip = page * limit;

    const movies = await prisma.movie.findMany({
        skip,
        take: limit
    });
    res.status(200).json(movies);
}

export { getMovies };