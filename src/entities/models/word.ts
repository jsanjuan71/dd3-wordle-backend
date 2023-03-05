import { QueryResult } from "pg"

export type Word = {
    id: number
    name?: number
}

export const WordMapper = (data: QueryResult): Word => {
    return {
        id: data.id,
        name: data.name
    }
}