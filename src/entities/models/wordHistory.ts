import { QueryResult } from "pg"

export type WordHistory = {
    id: number
    wordId: number
    isActive: boolean
    createdAt: Date
    closedAt: Date
}

export const WordHistoryMapper = (data: any): WordHistory => {
    return {
        id: data.id,
        wordId: data.word_id,
        isActive: data.is_active,
        createdAt: data.created_at,
        closedAt: data.closed_at
    }
}