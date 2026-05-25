import { Router } from "express";
import { registerValidator, loginValidator } from "../../middlewares/validator.js";
import { register, login, logout } from "./auth.controller.js";

const api = Router();

api.post("/register", [registerValidator], register);
api.post("/login", [loginValidator], login);
api.post("/logout", logout);

export default api;