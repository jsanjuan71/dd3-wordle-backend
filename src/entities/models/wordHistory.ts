import { QueryResult } from "pg"
import { Model } from "./model"

export type WordHistory = {
    id?: number
    wordId: number
    isActive: boolean
    createdAt: Date
    closedAt: Date
}

export class WordHistoryModel implements Model<WordHistory>{
    mapper(data: QueryResult): WordHistory {
        return {
            id: data.id,
            wordId: data.word_id,
            isActive: data.is_active,
            createdAt: data.created_at,
            closedAt: data.closed_at
        }
    }
}