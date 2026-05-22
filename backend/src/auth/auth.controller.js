import { createUser, findByIdentifier } from "../user/user.model.js";
import { encrypt, checkPassword } from "../../utils/encrypt.js";

export const register = async (req, res) => {
    try {
        const { nombres, apellidos, email, nickname, password } = req.body;

        const existe = await findByIdentifier(email);
        if(existe) return res.status(400).json({ success: false, message: "El usuario ya existe" });

        const hashedPass = await encrypt(password);

        await createUser({nombres, apellidos, email, nickname, password: hashedPass});

        res.status(201).json({ success: true, message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error al registrar usuario" });
    }
}

export const login = async (req, res) => {
    try {

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error al iniciar sesión" });
    }
}