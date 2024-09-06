import { Router } from "express";
import {register, login, checkUser, checkUserById,  editUser} from "../controllers/usuarioController.js"

import verifyToken from "../helpers/verify-token.js";

const router = Router()

router.post("/register", register);
router.post("/login", login);
router.get("/checkUser", checkUser);
router.get("/:id", checkUserById);
router.put("/edit/:id", verifyToken, editUser);

export default router