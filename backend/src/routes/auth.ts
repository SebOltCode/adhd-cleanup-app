import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { AppDataSource } from "../data-source";
import { seedDefaultContentForUser } from "../seeds/defaultData";
import { User } from "../models/User";
import { createToken } from "../utils/jwt";
import { asyncHandler } from "../utils/asyncHandler";

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  displayName: z.string().min(2).max(40),
});

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const parsed = registerSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Ungültige Daten", issues: parsed.error.issues });
    }

    const { email, password, displayName } = parsed.data;
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "E-Mail bereits registriert" });
    }

    let createdUser: User | null = null;

    await AppDataSource.transaction(async (manager) => {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = manager.create(User, { email, passwordHash, displayName });
      const savedUser = await manager.save(User, user);
      await seedDefaultContentForUser(manager, savedUser);
      createdUser = savedUser;
    });

    if (!createdUser) {
      return res.status(500).json({ message: "Registrierung fehlgeschlagen" });
    }

    const token = createToken(createdUser.id);

    return res.status(201).json({
      token,
      user: {
        id: createdUser.id,
        email: createdUser.email,
        displayName: createdUser.displayName,
        level: createdUser.level,
        experience: createdUser.experience,
        streak: createdUser.streak,
      },
    });
  }),
);

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const parsed = loginSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Ungültige Daten", issues: parsed.error.issues });
    }

    const { email, password } = parsed.data;
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: "E-Mail oder Passwort falsch" });
    }

    const isValidPassword = await bcrypt.compare(password, user.passwordHash);

    if (!isValidPassword) {
      return res.status(401).json({ message: "E-Mail oder Passwort falsch" });
    }

    const token = createToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        level: user.level,
        experience: user.experience,
        streak: user.streak,
      },
    });
  }),
);

export default router;
