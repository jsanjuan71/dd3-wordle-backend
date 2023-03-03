import { Pool, PoolClient, QueryResult } from "pg"
import { readFileLines } from "../tools/files"
import { DatabaseResponse } from "./response"
import { deleteWordsTable, createWordsTable, insertWordRow } from "./sql"
import path from 'path'


const pool : Pool = new Pool()

const seedWords = async(filename: string) : Promise<DatabaseResponse> => {
    console.info(`Seeder launched with file ${filename}`)
    var response: DatabaseResponse = {done: false};
    var client : PoolClient
    try {
        client = await pool.connect()
        await client.query(deleteWordsTable)
        await client.query(createWordsTable)
        const inserted: number = (await readFileLines( process.cwd() + filename  ))
            .filter(word => word.length === 5)
            .map( async(word) => {
                await client.query( insertWordRow, [word]  )
            })
            .length
        response.done = true
        response.result = [{inserted}]
        client.release()
    } catch (error: any) {
        response.result = error.message
    } finally {
        return response
    }
}

export {seedWords};