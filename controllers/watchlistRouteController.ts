import { prisma } from "../dbConnect.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import type { Request, Response } from "express";

const addMovie = asyncHandler(async (req: Request, res: Response) => {
    const { userId, movieId } = req.body;

    const movie = await prisma.movie.findUnique({
        where: {
            id: movieId
        }
    });

    if (!movie)
    {
        return res.status(404).json({
            error: "Movie doesn't exist in the database!"
        });
    }

    const watchlistEntry = await prisma.watchlistEntry.findUnique({
        where: {
            userId_movieId: {
                userId,
                movieId
            }
        }
    });

    if (watchlistEntry)
    {
        return res.status(404).json({
            error: "Movie already exists in the watchlist!"
        });
    }

    const result = await prisma.watchlistEntry.create({
        data: {
            userId,
            movieId
        }
    });

    return res.status(201).json({
        message: "Movie added to watchlist!",
        result
    });
});

const getMovies = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.body;

    const movies = await prisma.watchlistEntry.findMany({
        where: {
            userId
        },
        include: {
            movie: {
                select: {
                    title: true,
                    imdbRating: true,
                    year: true,
                    runtime: true,
                    director: true,
                    posterUrl: true
                }
            }
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    return res.status(200).json(movies);
});

const deleteMovie = asyncHandler(async (req: Request, res: Response) => {
    const { movieId } = req.params as {movieId: string};
    const { userId } = req.body;
    
    const result = await prisma.watchlistEntry.deleteMany({
        where: {
            userId,
            movieId
        }
    });

    if (result.count === 0)
    {
        return res.status(404).json({
            error: "Movie doesn't exist in the watchlist!"
        });
    }

    return res.status(201).json({
        message: "Movie removed from the watchlist!",
    });
});

export { addMovie, getMovies, deleteMovie };