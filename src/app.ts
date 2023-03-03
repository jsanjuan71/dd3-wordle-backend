import express, { Express, Request, Response } from 'express'
import { checkDatabase } from './services/healthCheck'


const app: Express = express()

app.get('/', async(req: Request, res: Response) => {
    const dbAlive = await checkDatabase()
    res.json({
        done: true,
        result: {
            name: process.env.npm_package_name,
            version: process.env.npm_package_version,
            services: {
                database: dbAlive
            }
        }
    })
})

export default app