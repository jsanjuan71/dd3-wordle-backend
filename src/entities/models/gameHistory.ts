export type GameHistory = {
    id: number
    gameId: number
    attemps: number
    won: boolean
    createdAt: Date
    closedAt: Date
}

export const GameHistoryMapper = (data: any): GameHistory => {
    return {
        id: data.id,
        gameId: data.user_id,
        attemps: data.attemps,
        won: data.won,
        createdAt: data.created_at,
        closedAt: data.deleted_at
    }
}