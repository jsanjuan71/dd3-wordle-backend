import { Pool, PoolClient, QueryResult } from "pg";
import { DatabaseResponse } from "./response";
import { createUsersTable } from "./sql/users";
import { createWordsTable } from "./sql/words";
import { createWordsHistoryTable } from "./sql/word_history";

const migrators: string[] = [
    createWordsTable,
    createWordsHistoryTable,
    createUsersTable
]

const pool : Pool = new Pool()

const migrateAll = async() : Promise<DatabaseResponse> => {
    var response: DatabaseResponse = {done: false, result: []};
    var client : PoolClient
    try {
        client = await pool.connect()
        var rows: QueryResult[] = []
        migrators.map( async(migration: string) => {
            let response = await client.query(migration)
            rows.push(response)
        } )
        response.done = true
        response.result = rows
        client.release()
    } catch (error: any) {
        response.result = error.message
    } finally {
        return response
    }
}

export {migrateAll};