import { Router } from "express";
import { listarLivro, registerLivro } from "../controllers/produtosControllers.js";

const routerL = Router()

routerL.post("/register", registerLivro);
routerL.get("/listar", listarLivro);

export default routerL