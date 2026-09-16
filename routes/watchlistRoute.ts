import { Router } from "express";
import { addMovie, deleteMovie, getMovies } from "../controllers/watchlistRouteController.ts";
import type { Request, Response, NextFunction } from "express";
import decodeToken from "../utils/decodeToken.ts";

const watchlistRouter = Router();

watchlistRouter.use("/", (req: Request, res: Response, next: NextFunction) => {
    const result = decodeToken(req, res);

    if (result.token === null)
        return res.status(404).json({error: "User isn't logged in!"});
    else if (result.user === null)
        return res.status(500).json({error: "Unknown error occurred!"});

    req.body.userId = result.user.id;
    next();
});

watchlistRouter.post("/", addMovie);
watchlistRouter.get("/", getMovies);
watchlistRouter.delete("/:id", deleteMovie);

export default watchlistRouter;