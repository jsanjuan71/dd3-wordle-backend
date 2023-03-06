import { select, upsert } from "../database/postgresql"
import { upsertGameRow } from "../database/sql/games"
import { insertGameHistoryRow } from "../database/sql/game_history"
import { getLastActiveWord } from "../database/sql/word_history"
import { Game, GameMapper } from "../entities/models/game"
import { WordHistory, WordHistoryMapper } from "../entities/models/wordHistory"
import { ServiceResponse } from "../entities/serviceResponse"

/**
 * @param {number} userId - The user id to attach the created/updated game
 * @returns {ServiceResponse<Game>} Response containing the Game data
 */
const createGame = async(userId: number) : Promise<ServiceResponse<Game>> => {
    var response: ServiceResponse<Game> = {done: false}
    try {
        const {done, result} = await select( getLastActiveWord )
        if(!done || !result.length) throw Error("No active word found")
        let currentWord: WordHistory = WordHistoryMapper( result.pop() )

        const gameUpsert = await upsert( upsertGameRow, [userId, currentWord.wordId, 0] )
        if(!gameUpsert.done || !gameUpsert.result.length)   throw Error("Game data was not correctly stored")
        const game: Game = GameMapper(gameUpsert.result.pop())

        await upsert( insertGameHistoryRow, [game.id] )
        response.done = true
        response.data = game
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}

export {createGame}