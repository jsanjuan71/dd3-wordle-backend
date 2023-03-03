import { Pool, PoolClient, QueryResult } from "pg";
import { DatabaseResponse } from "./response";

const connectionString = process.env.PG_URI

const pool : Pool = new Pool()

const select = async(query: string, params?: any[]) : Promise<DatabaseResponse> => {
    var response: DatabaseResponse = {done: false};
    var client : PoolClient
    try {
        client = await pool.connect()
        const {rows} : QueryResult<any> = await client.query(query, params)
        response.done = true
        response.result = rows
        client.release()
    } catch (error: any) {
        response.result = error.message
    } finally {
        return response
    }
}

export {select};