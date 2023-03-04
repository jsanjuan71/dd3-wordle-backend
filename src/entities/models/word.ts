import { QueryResult } from "pg"
import { Model } from "./model"

export type Word = {
    id?: number
    name?: number
}

export class WordModel implements Model<Word>{
    mapper(data: QueryResult): Word {
        return {
            id: data.id,
            name: data.name
        }
    }
}