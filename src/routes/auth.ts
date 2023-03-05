import express, { Request, Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from '../entities/apiResponse';
import { User, UserResponse, UserResponseMapper } from '../entities/models/user';
import { validateAccess } from '../middleware/authorization';
import { validateUser } from '../services/users';

const router: Router = express.Router();

router.post("/login", async(req: Request, res: Response) : Promise<void> => {
    let response: ApiResponse<string> = {done: false }
    const {done, data} = await validateUser(req.body)
    response.done = done
    if(!done) {
        res.status( StatusCodes.UNAUTHORIZED )
    }
    response.result = data
    res.send(response)
})

export default router