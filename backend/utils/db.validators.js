import { findByIdentifier } from '../src/user/user.model.js'

export const existEmail = async (email) => {
    const user = await findByIdentifier(email)
    if (user) {
        throw new Error(`El email ${email} ya está en uso`)
    }
}

export const existNickname = async (nickname) => {
    const user = await findByIdentifier(nickname)
    if (user) {
        throw new Error(`El nickname ${nickname} ya está en uso`)
    }
}

export const commonPasswords = (password) => {
    const common = ['Password1', 'Test1234', 'Prueba123', '12345678', 'Admin123']
    if (common.includes(password)) {
        throw new Error('La contraseña es muy común')
    }
    return true
}