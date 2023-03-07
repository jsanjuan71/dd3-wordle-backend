import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../entities/apiResponse';
import { User, UserResponse, UserResponseMapper, UserStats } from '../entities/models/user';
import { RequestWithPayload, UserPayload } from '../entities/userPayload';
import { validateAccess } from '../middleware/authorization';
import { getUserStats } from '../services/gameHistory';
import { createUser } from '../services/users';

const router: Router = express.Router();

router.get("/", validateAccess, async(req: Request, res: Response) : Promise<void> => {
    let response: ApiResponse<UserResponse[]> = {done: false }

    res.status( StatusCodes.NOT_IMPLEMENTED ).send(response)
})

router.get("/:id", validateAccess, async(req: Request, res: Response) : Promise<void> => {
    let response: ApiResponse<UserResponse> = {done: false }

    res.status( StatusCodes.NOT_IMPLEMENTED ).send(response)
})

router.get("/:id/stats", validateAccess, async(req: Request, res: Response) : Promise<void> => {
    let response: ApiResponse<UserStats> = {done: false }
    let userId = ((req as RequestWithPayload).user as UserPayload).id
    const {done, data } = await getUserStats(userId)

    response.done = done
    response.result = data as UserStats
    res.send(response)
})

router.post("/", async(req: Request, res: Response) : Promise<void> => {
    let response: ApiResponse<UserResponse|string> = {done: false }
    const {done, data} = await createUser(req.body)
    response.done = done
    if(done) {
        response.result = UserResponseMapper(data as User)
    } else {
        response.result = data
    }
    res.send(response)
})

export default router