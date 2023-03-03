import express, { Express, Request, Response } from 'express'


const app: Express = express()

app.get('/', (req: Request, res: Response) => {
    res.json({
        done: true,
        result: {
            name: process.env.npm_package_name,
            version: process.env.npm_package_version
        }     
    })
})

export default app