
import dotenv from 'dotenv'
import { seedWords } from './database/seeder'
dotenv.config()

import app from './app'

const port = process.env.SERVER_PORT

app.listen(port, async() => {
    console.info(`Running at http://localhost:${port}`)

    if( process.env.SEED_ON_STARTUP === "true" ){
        console.info("seeding", (await seedWords("/words.txt")))
    }
    
})