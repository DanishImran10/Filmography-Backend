import { Router } from "express";
import { getMovies, getMovieById, getTrendingMovies } from "../controllers/moviesRouteController.ts";
import type { Request, Response, NextFunction } from "express";
import decodeToken from "../utils/decodeToken.ts";

const moviesRouter = Router();

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const result = decodeToken(req, res);

    if (!req.body)
        req.body = {};

    if (result.token === null || result.user === null)
        req.body.userId = null;
    else
        req.body.userId = result.user.id;
    
    next();
};

moviesRouter.get("/", authMiddleware, getMovies);
moviesRouter.get("/trending", getTrendingMovies);
moviesRouter.get("/:movieId", authMiddleware, getMovieById);

export default moviesRouter;