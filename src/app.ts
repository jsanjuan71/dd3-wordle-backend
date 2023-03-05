import express, { Express, Request, Response } from 'express'
import { validateAccess } from './middleware/authorization'
import { checkDatabase } from './services/healthCheck'
import { ApiResponse } from './entities/apiResponse'
import { RequestWithPayload, UserPayload } from './entities/userPayload'
import userRoutes from './routes/users'
import authRoutes from './routes/auth'

const app: Express = express()

app.use( express.json() )

app.get('/', validateAccess, async(req: Request, res: Response) => {
    const dbAlive = await checkDatabase()

    var response: ApiResponse<any> = {
        done: true,
        result: {
            name: process.env.npm_package_name,
            version: process.env.npm_package_version,
            user: ((req as RequestWithPayload).user as UserPayload).name,
            services: {
                database: dbAlive
            }
        }
    }
    res.send(response);
})

app.use( "/users", userRoutes )
app.use("/auth", authRoutes)

export default app