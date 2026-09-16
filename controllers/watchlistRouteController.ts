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
        orderBy: {
            createdAt: "desc"
        }
    });

    return res.status(200).json({
        data: movies
    });
});

const deleteMovie = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params as {id: string};
    
    const watchlistEntry = await prisma.watchlistEntry.findUnique({
        where: {
            id
        }
    });

    if (!watchlistEntry)
    {
        return res.status(404).json({
            error: "No such watchlist entry exists!"
        });
    }

    if (watchlistEntry.userId !== req.body.userId)
    {
        return res.status(404).json({
            error: "Specified entry doesn't belong to the current user!"
        });
    }

    await prisma.watchlistEntry.delete({
        where: {
            id: id
        }
    });

    return res.status(201).json({
        message: "Movie removed from the watchlist!"
    });
});

export { addMovie, getMovies, deleteMovie };