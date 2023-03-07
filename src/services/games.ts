import { select, upsert } from "../database/postgresql"
import { fetchAllActiveGames, getGameById, resetAttempsForAllGames, upsertGameRow } from "../database/sql/games"
import { closeGameHistoryRow, insertGameHistoryRow } from "../database/sql/game_history"
import { getLastActiveWord, getLastActiveWordName } from "../database/sql/word_history"
import { Game, GameMapper } from "../entities/models/game"
import { GameHistory, GameHistoryMapper } from "../entities/models/gameHistory"
import { Letter, LetterValue, Word } from "../entities/models/word"
import { WordHistory, WordHistoryMapper } from "../entities/models/wordHistory"
import { ServiceResponse } from "../entities/serviceResponse"
import { getCurrentWord } from "./words"

const NUM_OF_WORD_CHARS = 5;
const MAX_ATTEMPS = 5

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

/**
 * 
 * @param {string} referenceWord - The current word
 * @param {string} evaluatedWord - The word to compare for
 * @returns { Letter[]} - A list of letter evaluation
 */
const analyzeLetters = (referenceWord: string, evaluatedWord: string) : Letter[] => {
    var response: Letter[] = []
    var source: string[] = Array.from(referenceWord)
    var compared: string[] = Array.from(evaluatedWord)

    compared.forEach( (letter: string, index: number) => {
        let letterValue: Letter = {letter: letter}
        if( source[index] === letter ) letterValue.value = LetterValue.Matchs
        else if( source.includes( letter ) ) letterValue.value = LetterValue.Exists
        else letterValue.value = LetterValue.NotExists

        response.push( letterValue )
    } )

    return response
}


/**
 * 
 * @param {string} word - The word to compare with 
 * @param {number|null} gameId - The game where to take the data for
 * @returns {ServiceResponse<Letter[]>} - An array of each letter evaluation result
 */
const evaluateGame = async(word: string, gameId?: number) : Promise<ServiceResponse<Letter[]>> => {
    var response: ServiceResponse<Letter[]> = {done: false}
    try {
        if(word.length != NUM_OF_WORD_CHARS) throw Error(`Word must contain ${NUM_OF_WORD_CHARS} letters`)

        const {done, data} = await getCurrentWord()
        if( !done && !data) throw Error("Could not load current word data")

        const currentGame = await select( getGameById, [gameId] )
        if(!currentGame.done && currentGame.result.length)  throw Error("Could not load game data")
        const game = GameMapper(currentGame.result.pop());
        
        if(game.attemps>= MAX_ATTEMPS) throw ("Game is currently over")

        const letterAnalysed = analyzeLetters( (data as Word).name, word)
        const won: boolean = letterAnalysed.every( analysed => analysed.value === LetterValue.Matchs )

        if(won) {
            closeGameHistory(game, true)
            response.data = letterAnalysed
            response.done = true
        } else {
            let currentAttemps = game.attemps + 1
            if(currentAttemps >= MAX_ATTEMPS) {
                closeGameHistory(game, false)
                response.data = letterAnalysed
            } else {
                response.data = letterAnalysed
            }

            await select( upsertGameRow, [game.userId, (data as Word).id, currentAttemps ] )
        }
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}

export {createGame, resetGames, evaluateGame}