'use strict'
import jwt from 'jsonwebtoken'
import { findByIdentifier } from '../src/user/user.model.js'

export const validateTokenJWT = async(req, res, next)=> {
    try {
        const token = req.cookies.token || req.cookies.access_token
        if(!token) return res.status(401).send(
            {
                success: false,
                message: 'Unauthorized, no token provided'
            }
        )
        const user = jwt.verify(token, process.env.SECRET_KEY)
        const userVerify = await findByIdentifier(user.nickname)
        if(!userVerify) return res.status(404).send(
            {
                success: false,
                message: 'User not found - unauthorized'
            }
        )
        req.user = user
        console.log('user: ', user.uid);
        
        next() 
    } catch (e) {
        console.error(e)
        return res.status(401).send(
            {
                success: false,
                message: 'Invalid credentials'
            }
        )
    }
}