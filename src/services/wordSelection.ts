import { select, upsert } from "../database/postgresql"
import { getRandomWordExcludingId } from "../database/sql/words"
import { getLastActiveWord, insertWordHistoryRow, setLastActiveWord } from "../database/sql/word_history"
import { Word, WordMapper } from "../entities/models/word"
import { WordHistory, WordHistoryMapper } from "../entities/models/wordHistory"
import { ServiceResponse } from "../entities/serviceResponse"

/**
 * Creates a new word 
 * @param {number|null} excluding - The Word id to exclude, if null nothing excluded
 * @returns {ServiceResponse<Word>} - The new word or errors
 */
const createWord = async(excluding: number|null) : Promise<ServiceResponse<Word>> => {
    var response: ServiceResponse<Word> = {done: false}
    try {
        let {done, result} = await select( getRandomWordExcludingId, [excluding] )
        if(!done || !result.length) throw Error("Word data was not correctly loaded")
        let word: Word = WordMapper( result.pop() )
        response.data = word
        response.done = true
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally{
        return response
    }
    
} 

/**
 * Selects a word, deactivate previous if exists, finally udates the word history
 * @param {number|null} excluding - The Word id to exclude, if null nothing excluded
 * @returns {ServiceResponse<Word>} - The new word or errors
 */
const selectWord = async() : Promise<ServiceResponse<Word>> => {
    var response: ServiceResponse<Word> = {done: false}
    try {
        var currentWord: WordHistory|undefined = undefined
        const {done, result} = await select( getLastActiveWord )
        if( done && result.length ) {
            currentWord = WordHistoryMapper( result.pop() )
            await upsert(setLastActiveWord, [currentWord.id])
        }
        let createdWord = await createWord( currentWord?.wordId?? null )
        if(!createdWord.done)   throw Error(createdWord.data as string)

        await upsert( insertWordHistoryRow, [(createdWord.data as Word).id] )

        response.done = true
        response.data = (createdWord.data as Word)
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}

export {createWord, selectWord}