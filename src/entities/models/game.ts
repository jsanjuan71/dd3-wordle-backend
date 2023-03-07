export type Game = {
    id: number
    userId: number
    wordId: number
    attemps: number
    createdAt: Date
    deletedAt: Date
}

export const GameMapper = (data: any): Game => {
    return {
        id: data.id,
        userId: data.user_id,
        wordId: data.word_id,
        attemps: data.attemps,
        createdAt: data.created_at,
        deletedAt: data.deleted_at
    }
}

export type GameResponse = {
    id: number
    username: string
    createdAt?: Date
}