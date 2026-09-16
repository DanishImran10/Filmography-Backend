import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

type AuthPayload = {
  id: string,
  iat: number,
  exp: number
};

type DecodeType = {
    token: string | null,
    user: AuthPayload | null
};

export function decodeToken(req: Request, res: Response): DecodeType {
  const token = req.cookies?.jwt;

  if (!token) {
    return {
        token: null,
        user: null
    };
  }

  const secret = process.env.JWT_SECRET_KEY;
  if (!secret) {
    throw new Error("JWT_SECRET_KEY is not configured");
  }

  try {
    const decoded = jwt.verify(token, secret) as AuthPayload;
    return {
      token, 
      user: decoded 
    };
  } catch {
    return {
      token,
      user: null
    };
  }
}

export default decodeToken;
