import { Router } from "express";
import { loginUser, registerUser, logoutUser, verifyToken } from "../controllers/authenticationRouteController.ts";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);
authRouter.get("/", verifyToken);

export default authRouter;