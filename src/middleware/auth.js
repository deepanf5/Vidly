import { jwtVerify } from 'jose';
import dotenv from 'dotenv';
dotenv.config();
import config from 'config'

export  default async function auth(req, res, next) {

      const validationOptions = {
    algorithms: ['HS256'],
};
   



    const token = req.header('x-auth-token');
    if (!token) return res.status(401).send('Acess denied. No token provided')

    try {
           const secret = new TextEncoder().encode(config.get('jwtPrivateKey'));
    const { payload } = await jwtVerify(token, secret, {
      algorithms: ['HS256'],
    });

    req.user = payload; // Use decoded payload (e.g. {_id: ...})
    next();

    }
    catch (ex) {
        res.status(400).send('Invalid token')
    }
}
