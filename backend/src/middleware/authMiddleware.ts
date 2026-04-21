import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../models/User";

export interface AuthenticatedRequest extends Request {
  currentUser?: User;
}

interface JwtPayload {
  userId: string;
}

const JWT_SECRET = process.env.JWT_SECRET ?? "development-secret";

export async function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Kein Token übermittelt" });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ message: "Benutzer nicht gefunden" });
    }

    req.currentUser = user;
    return next();
  } catch (error) {
    console.error("JWT Fehler", error);
    return res.status(401).json({ message: "Ungültiger oder abgelaufener Token" });
  }
}
