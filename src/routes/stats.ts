import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../entities/apiResponse';
import { TopGamer } from '../entities/models/gameHistory';
import { TopWord } from '../entities/models/word';
import { validateAccess } from '../middleware/authorization';
import { getMostWinners } from '../services/gameHistory';
import { createUser } from '../services/users';

const router: Router = express.Router();

router.get("/top/gamer", validateAccess, async(req: Request, res: Response) : Promise<void> => {
    let response: ApiResponse<TopGamer[]> = {done: false }
    const{done, data} =  await getMostWinners(10)
    response.done = done
    response.result = data as TopGamer[]
    res.status( StatusCodes.NOT_IMPLEMENTED ).send(response)
})

router.get("/top/word", validateAccess, async(req: Request, res: Response) : Promise<void> => {
    let response: ApiResponse<TopWord[]> = {done: false }

    res.status( StatusCodes.NOT_IMPLEMENTED ).send(response)
})


export default router