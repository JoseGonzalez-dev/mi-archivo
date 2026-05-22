import { Router } from "express";
import { registerValidator } from "../../middlewares/validator.js";
import { register } from "./auth.controller.js";

const api = Router();

api.post("/register", [registerValidator], register);

export default api;