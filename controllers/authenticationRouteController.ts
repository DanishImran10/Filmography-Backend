import express from "express";
import bcrypt from "bcryptjs";
import jwt, { type SignOptions } from "jsonwebtoken";
import { prisma } from "../dbConnect.ts";
import asyncHandler from "../utils/asyncHandler.ts";
import decodeToken from "../utils/decodeToken.ts";

type RegisterBody = {
  name: string;
  email: string;
  password: string;
};

function generateJWTToken(userId: string, res: express.Response): string {
  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not configured");
  }

  const payload = { id: userId };
  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  };

  const token = jwt.sign(payload, secret, {
    ...options,
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 1000 * 60 * 60 * 24 * 7,
  });

  return token;
}

const registerUser = asyncHandler(
  async (req: express.Request<RegisterBody>, res: express.Response) => {
    const { name, email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(404).json({
        error: "User already exists!",
      });
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(password, salt);

    const result = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
      },
    });

    const token = generateJWTToken(result.id, res);

    res.status(201).json({
      message: "User created successfully!",
      data: {
        user: name,
        email,
      },
      token,
    });
  },
);

const loginUser = async (req: express.Request, res: express.Response) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    return res.status(404).json({
      error: "Invalid email or password!",
    });
  }

  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    return res.status(404).json({
      error: "Invalid email or password!",
    });
  }

  const token = generateJWTToken(user.id, res);

  res.status(201).json({
    message: "Login successful!",
    data: {
      user: user.name,
      email: user.email,
    },
    token,
  });
};

const logoutUser = async (req: express.Request, res: express.Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });

  res.status(201).json({
    message: "User logged out successfully!",
  });
};

function verifyToken(req: express.Request, res: express.Response) {
  const result = decodeToken(req, res);

  if (result.token === null)
    return res.status(200).json({ user: null });
  else if (result.user === null)
    return res.status(500).json({ user: null });
  else
    return res.status(200).json({ user: result.user });
}

export { registerUser, loginUser, logoutUser, verifyToken };
