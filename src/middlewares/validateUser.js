import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import validateUserRepository from "../repositories/validateUserRepository.js"


dotenv.config();

async function validateUser (req, res, next) {

    const { authorization } = req.headers;
    const token = authorization?.replace('Bearer ', '');
    const jwtKey = process.env.JWT_SECRET_KEY;

    if (!token) {
        res.status(401).send('Invalid header');
        return;
    }

    try {
        const jwtData = jwt.verify(token, jwtKey);
        
        const session = await validateUserRepository.getSessionByToken(token);

        if (session.length === 0) {
            res.status(401).send('Invalid header');
            return;
        }

    } catch (error) {
        res.status(401).send('Invalid header');
        return;
    }

    try {
        const jwtData = jwt.verify(token, jwtKey);
        res.locals.session = jwtData;
        next();
   
    } catch (error) {
        res.sendStatus(500);
        return;
    }

}

export default validateUser;