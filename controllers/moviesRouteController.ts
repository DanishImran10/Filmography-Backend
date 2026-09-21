import { prisma } from "../dbConnect.ts";
import express from "express";
import asyncHandler from "../utils/asyncHandler.ts";
import type { MovieWhereInput } from "../generated/prisma/models.ts";

type Params = {
    movieId: string
};
    
const getMovies = asyncHandler(async (req : express.Request, res : express.Response) => {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const search = req.query.search === undefined || req.query.search === "null" ?
        "" : String(req.query.search);

    const { userId } = req.body;

    const skip = (page - 1) * limit;

    const whereFilter : MovieWhereInput = {
        title: {
            contains: search,
            mode: "insensitive"
        }
    };

    const count = await prisma.movie.count({
        where: whereFilter
    });
    const totalPages = Math.ceil(count / limit);

    const movies = await prisma.movie.findMany({
        skip,
        take: limit,
        where: whereFilter,
        include: {
            watchlist: {
                where: userId ? {userId} : {userId: ""}
            }
        }
    });

    const formattedMovies = movies.map((movie) => {
        return {
            ...movie,
            isInWatchlist: movie.watchlist.length !== 0,
            watchlist: undefined
        }
    });

    res.status(200).json({
        movies: formattedMovies,
        totalPages
    });
});

const getMovieById = asyncHandler(async (req : express.Request<Params>, res : express.Response) => {
    const { movieId } = req.params;
    const { userId } = req.body;
    
    const movie = await prisma.movie.findFirst({
        where: {
            id: movieId
        },
        include: {
            watchlist: {
                where: userId ? { userId } : {userId: ""}
            }
        }
    });

    if (!movie)
    {
        return res.status(404).json({
            error: "Movie doesn't exist!"
        });
    }

    const formattedMovie = {
        ...movie,
        isInWatchlist: movie.watchlist.length !== 0,
        watchlist: undefined
    };

    res.status(200).json(formattedMovie);
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
        take: 24,
        orderBy: {
            imdbRating: 'desc'
        }
    });
    res.status(200).json(movies);
});

const getMoviesByName = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { search } = req.query as { search: string };

    const movies = await prisma.movie.findMany({
        where: {
            title: {
                contains: search,
                mode: "insensitive"
            }
        },
        orderBy: {
            year: "desc"
        },
        select: {
            id: true,
            posterUrl: true,
            title: true,
            imdbRating: true,
            year: true
        },
        take: 3
    });

    res.status(200).json(movies);
});

export { getMovies, getMovieById, getTrendingMovies, getMoviesByName };