import { jwtVerify } from 'jose';
import dotenv from 'dotenv';
dotenv.config();
import config from 'config'

export  default async function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Acess denied. No token provided')

    try {
        const decode = await jwtVerify(token, config.get('jwtPrivateKey'))
        req.user = decode
        next()
    }
    catch (ex) {
        res.status(400).send('Invalid token')
    }
}
