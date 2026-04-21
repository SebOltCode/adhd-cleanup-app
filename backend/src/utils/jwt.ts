import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "development-secret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN ?? "7d";

export const createToken = (userId: string) =>
  jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
