import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../entities/apiResponse';
import { Game } from '../entities/models/game';
import { Letter } from '../entities/models/word';
import { RequestWithPayload, UserPayload } from '../entities/userPayload';
import { validateAccess } from '../middleware/authorization';
import { evaluateGame } from '../services/games';

const router: Router = express.Router();


router.get("/", validateAccess, async(req: Request, res: Response) : Promise<void> => {
    let response: ApiResponse< Game[]> = {done: false }

    res.status( StatusCodes.NOT_IMPLEMENTED ).send(response)
})

router.get("/:id", validateAccess, async(req: Request, res: Response) : Promise<void> => {
    let response: ApiResponse<Game> = {done: false }

    res.status( StatusCodes.NOT_IMPLEMENTED ).send(response)
})

router.post("/evaluate", validateAccess, async(req: Request, res: Response) : Promise<void> => {
    let response: ApiResponse<Letter[]|string> = {done: false }
    const {user_word} = req.body
    let gameId = ((req as RequestWithPayload).user as UserPayload).gameId
    const {done, data} = await evaluateGame(user_word, gameId )
    response.done = done
    response.result = data
    res.send(response)
})

export default router