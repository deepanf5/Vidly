import { jwtVerify } from 'jose';
dotenv.config();
import config from 'config'

function auth(req, res, next) {
    const token = req.header('x-auth-token');
    if (token) return res.status(401).send('Acess denied. No token provided')

    try {
        const decode = jwtVerify(token, config.get('jwtPrivateKey'))
        req.user = decode
        next()
    }
    catch (ex) {
        res.status(400).send('Invalid token')
    }
}

export default auth