import { Router } from "express";
import { getMovies } from "../controllers/moviesRouteController.ts";

const moviesRouter = Router();

moviesRouter.get("/", getMovies);

export default moviesRouter;