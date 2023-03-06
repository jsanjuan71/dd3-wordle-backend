import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface UserPayload {
    id: number
    name? : string
    gameId? : number
}

export interface RequestWithPayload extends Request {
    user : JwtPayload | string 
}