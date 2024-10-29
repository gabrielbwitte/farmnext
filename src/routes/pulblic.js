import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

//cadastro
router.post("/cadastro", async (req, res) => {
  try {
    const user = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(user.password, salt);
    const userdb = await prisma.user.create({
      data: {
        email: user.email,
        name: user.name,
        password: hashPassword,
      },
    });
    res.status(201).json(userdb);
  } catch (error) {
    res.status(500).json({ error });
  }
  const user = req.body;
});

//login

router.post("/login", async (req, res) => {
  try {
    const userInfo = req.body;

    //busca o usuario no banco
    const user = await prisma.user.findUnique({
      where: { email: userInfo.email },
    });

    // verifica se o usuario existe no banco
    if (!user) {
      return res.status(404).json({ message: "Usuario não encontrado." });
    }

    //compara as senhas com bcrypt
    const isWatch = await bcrypt.compare(userInfo.password, user.password);
    if (!isWatch) {
      return res.status(400).json({ message: "Senha invalida" });
    }

    //gerar o token JWT
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "1d" });

    res.status(200).json(token);
  } catch (error) {}
});

export default router;
