import { Router } from "express";
import { loginUser, registerUser, logoutUser } from "../controllers/authenticationRouteController.ts";

const authRouter = Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logoutUser);

export default authRouter;