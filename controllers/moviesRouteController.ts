import { prisma } from "../dbConnect.ts";
import express from "express";
import asyncHandler from "../utils/asyncHandler.ts";

type Params = {
    movieId: string
};
    
const getMovies = asyncHandler(async (req : express.Request, res : express.Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);

    const skip = (page - 1) * limit;

    const movies = await prisma.movie.findMany({
        skip,
        take: limit
    });

    const count = await prisma.movie.count();
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
        movies,
        totalPages
    });
});

const getMovieById = asyncHandler(async (req : express.Request<Params>, res : express.Response) => {
    const { movieId } = req.params;
    
    const movie = await prisma.movie.findFirst({
        where: {
            id: movieId
        }
    });

    res.status(200).json(movie);
});

const getTrendingMovies = asyncHandler(async (req: express.Request, res: express.Response) => {
    const movies = await prisma.movie.findMany({
        select: {
            id: true,
            posterUrl: true
        },
        where: {
            imdbRating: { gte: 8.0 }
        },
        take: 10,
        orderBy: {
            imdbRating: 'desc'
        }
    });
    res.status(200).json(movies);
});

export { getMovies, getMovieById, getTrendingMovies };