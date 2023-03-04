import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload {
    id: number
    name? : string
}

export interface RequestWithPayload extends Request {
    user : JwtPayload | string 
}