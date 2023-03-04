import { QueryResult } from "pg"
import { select, upsert } from "../database/postgresql"
import { getRandomWordExcludingId } from "../database/sql/words"
import { getLastActiveWord, insertWordHistoryRow, setLastActiveWord } from "../database/sql/word_history"
import { Word, WordModel } from "../entities/models/word"
import { WordHistoryModel } from "../entities/models/wordHistory"
import { ServiceResponse } from "../entities/serviceResponse"

const selectWord = async() : Promise<ServiceResponse<Word>> => {
    var response: ServiceResponse<Word> = {done: false}
    try {
        const {done, result} = await select( getLastActiveWord )
        if( done && result.length ) {
            let model =  new WordHistoryModel()
            let current = model.mapper( result.pop() )
            await upsert(setLastActiveWord, [current.id])
            let newWord = await select( getRandomWordExcludingId, [current.id] )
            let wordModel = new WordModel()
            let word = wordModel.mapper(newWord.result.pop())
            await upsert( insertWordHistoryRow, [word.id] )
            response.done = true
            response.data = word
        }
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}

export {selectWord}