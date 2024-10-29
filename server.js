import express from "express";
import publicRoutes from "./src/routes/pulblic.js";
import privateRoutes from "./src/routes/private.js";
import auth from "./middlewares/auth.js";

const app = express();
app.use(express.json());

app.use("/", publicRoutes);
app.use("/", auth, privateRoutes);

app.listen(3000, () => console.log("Servidor rodando..."));
