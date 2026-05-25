import { body } from "express-validator";
import { existEmail, commonPasswords } from "../utils/db.validators.js";
import { validateErrors } from "./validate.errors.js";

export const registerValidator = [
    body("nombres")
        .notEmpty().withMessage("El nombre es requerido")
        .isLength({ min: 3, max: 100 }).withMessage("El nombre debe tener entre 3 y 100 caracteres"),
    body("apellidos")
        .notEmpty().withMessage("Los apellidos son requeridos")
        .isLength({ min: 3, max: 100 }).withMessage("Los apellidos deben tener entre 3 y 100 caracteres"),
    body("email")
        .notEmpty().withMessage("El email es requerido")
        .isEmail().withMessage("Email inválido")
        .custom(existEmail),
    body("nickname")
        .notEmpty().withMessage("El nickname es requerido")
        .isLength({ min: 3, max: 50 }).withMessage("El nickname debe tener entre 3 y 50 caracteres"),
    body("password")
        .notEmpty().withMessage("La contraseña es requerida")
        .isStrongPassword(
            {
                minLength: 4,
                minLowercase: 1,
                minNumbers: 1,
                minUppercase: 1,
                minSymbols: 0,
            }
        )
        .isLength({ min: 4 }).withMessage("La contraseña debe tener al menos 4 caracteres")
        .custom(commonPasswords),
    validateErrors
]

export const loginValidator = [
    body("identifier", "El email o nickname es requerido").notEmpty(),
    body("password", "La contraseña es requerida").notEmpty(),
    validateErrors
]