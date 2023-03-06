
import dotenv from 'dotenv'
import { seedWords } from './database/seeder'
import cron from 'node-cron'
dotenv.config()

import app from './app'
import { migrateAll } from './database/migrations'
import { selectWord } from './services/wordSelection'

const port = process.env.SERVER_PORT
const cronTimer: string = "*/60 * * * * *" // every 30 seconds

app.listen(port, async() => {
    console.info(`Running at http://localhost:${port}`)

    if( process.env.MIGRATE_ON_STARTUP === "true" ){
        console.info("Migrating", ( await migrateAll() ) )
    }

    if( process.env.SEED_ON_STARTUP === "true" ){
        console.info("Seeding", ( await seedWords("/words.txt") ))
    }
    
    cron.schedule(cronTimer, async() => {
        console.info("Selecting word", ( await selectWord() )) 
    } )
    
})