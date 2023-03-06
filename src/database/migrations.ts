import { Pool, PoolClient, QueryResult } from "pg";
import { DatabaseResponse } from "./response";
import { createGamesTable } from "./sql/games";
import { createGameHistoryTable } from "./sql/game_history";
import { createUsersTable } from "./sql/users";
import { createWordsTable } from "./sql/words";
import { createWordsHistoryTable } from "./sql/word_history";

const migrators: string[] = [
    createWordsTable,
    createWordsHistoryTable,
    createUsersTable,
    createGamesTable,
    createGameHistoryTable
]

const pool : Pool = new Pool()

const migrateAll = async() : Promise<DatabaseResponse> => {
    var response: DatabaseResponse = {done: false, result: []};
    var client : PoolClient
    try {
        client = await pool.connect()
        var queries: Promise<QueryResult<any>>[] = migrators.map( async(migration: string) => {
            let response = client.query(migration)
            return response
        } )
        
        response.result = (await Promise.all(queries))
            .map((query: QueryResult) => {
                return {
                    "command": query.command,
                    "affectedRows": query.rowCount
                }
            } )
        response.done = true
        client.release()
    } catch (error: any) {
        response.result = error.message
    } finally {
        return response
    }
}

export {migrateAll};