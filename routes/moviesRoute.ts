import { Router } from "express";
import { getMovies, getMovieById, getTrendingMovies } from "../controllers/moviesRouteController.ts";

const moviesRouter = Router();

moviesRouter.get("/", getMovies);
moviesRouter.get("/trending", getTrendingMovies);
moviesRouter.get("/:movieId", getMovieById);

export default moviesRouter;