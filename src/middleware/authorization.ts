import { Request, Response, NextFunction } from 'express';
import jwt, {JwtPayload, Secret} from 'jsonwebtoken'
import { RequestWithPayload, UserPayload } from '../entities/userPayload';
import { ApiResponse } from '../entities/apiResponse';
import { StatusCodes } from 'http-status-codes';

const SECRET_KEY: Secret = process.env.JWT_SECRET||'';

const generateToken = (payload: UserPayload ) : string => {
    return jwt.sign(payload, SECRET_KEY);
}

export const readToken = (token: string) => {
    try {
        return jwt.verify(token, SECRET_KEY);
    } catch (error: any) {
        console.error(error.message);
        throw new Error("Invalid token provided");
    }
}

export const validateAccess = (req: Request, res: Response, next: NextFunction): void => {
    try{
        var {authorization} = req.headers;
        if(authorization){
            var [_, token] = authorization.split(" ");
            if(!token) {
                throw new Error("Token not provided.")
            }
            const payload: JwtPayload | string = readToken(token);
            (req as RequestWithPayload).user = payload
            next();
        } else throw new Error("Token is required to achieve this service.");
    } catch(error: any){
        res.status(StatusCodes.FORBIDDEN);
        const response: ApiResponse<String> = {done: false, result: error.message}
        res.send( response  );
    }
}
