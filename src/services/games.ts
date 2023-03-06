import { select, upsert } from "../database/postgresql"
import { fetchAllActiveGames, resetAttempsForAllGames, upsertGameRow } from "../database/sql/games"
import { closeGameHistoryRow, insertGameHistoryRow } from "../database/sql/game_history"
import { getLastActiveWord } from "../database/sql/word_history"
import { Game, GameMapper } from "../entities/models/game"
import { GameHistory, GameHistoryMapper } from "../entities/models/gameHistory"
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

/**
 * 
 * @param {Game} game - The Game to close 
 * @param {boolean} won - Flag indicating if this Game is closed by win 
 * @returns 
 */
const closeGameHistory= async(game: Game, won: boolean = false) : Promise<ServiceResponse<GameHistory>> => {
    var response: ServiceResponse<GameHistory> = {done: false}
    try {
        const {done, result} = await upsert( closeGameHistoryRow, [game.id, game.attemps, won] )
        if(!done || !result.length) throw Error("Could not close game history")

        response.data = GameHistoryMapper(result.pop())
        await upsert( insertGameHistoryRow, [response.data.gameId] )

        response.done = true
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}

/**
 * 
 * @returns {ServiceResponse<number[]>} - A list of update GameHistory ids
 */
const resetGames = async() : Promise<ServiceResponse<number[]>> => {
    var response: ServiceResponse<number[]> = {done: false}
    try {
        const {done, result} = await select( fetchAllActiveGames )
        if(!done || !result.length) throw Error("No active games found")
        
        const updatedGames: ServiceResponse<GameHistory>[] = 
            await Promise.all(result.map( game => closeGameHistory( GameMapper(game) ) ))

        await upsert( resetAttempsForAllGames )

        response.done = true
        response.data = updatedGames.map(updated => (updated.data as GameHistory).id )
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}

export {createGame, resetGames}