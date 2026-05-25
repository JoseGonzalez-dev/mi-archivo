import { createUser, findByIdentifier } from "../user/user.model.js";
import { encrypt, checkPassword } from "../../utils/encrypt.js";
import { generateJwt } from "../../utils/jwt.js";

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
        // Obtenemos los campos, si mandan identifier en lugar de email/nickname también lo atrapamos
        const { email, nickname, password, identifier } = req.body;
        const userIdentifier = email || nickname || identifier;

        if (!userIdentifier || !password) {
            return res.status(400).json({ success: false, message: "El email/nickname y la contraseña son requeridos" });
        }

        const user = await findByIdentifier(userIdentifier);
        if (!user) {
            return res.status(400).json({ success: false, message: "Credenciales incorrectas" });
        }

        const validPassword = await checkPassword(user.Password, password);
        if (!validPassword) {
            return res.status(400).json({ success: false, message: "Credenciales incorrectas" });
        }

        // Generar el token
        const token = await generateJwt({ uid: user.Id, nickname: user.Nickname });

        // Configurar y enviar la cookie
        res.cookie('token', token, {
            httpOnly: true, // No accesible desde el DOM / JavaScript del lado del cliente
            secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
            sameSite: 'strict', // Protección CSRF
            maxAge: 4 * 60 * 60 * 1000 // Expira en 4 horas
        });

        res.status(200).json({
            success: true,
            message: "Inicio de sesión exitoso",
            user: {
                id: user.Id,
                nombres: user.Nombres,
                apellidos: user.Apellidos,
                email: user.Email,
                nickname: user.Nickname
            },
            token
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error al iniciar sesión" });
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: 'strict'
        });
        return res.status(200).json({ success: true, message: "Sesión cerrada correctamente" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error al cerrar sesión" });
    }
}