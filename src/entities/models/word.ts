import { QueryResult } from "pg"

export type Word = {
    id: number
    name: string
}

export const WordMapper = (data: any): Word => {
    return {
        id: data.id,
        name: data.name
    }
}

export type Letter = {
    letter: string
    value?: number
}

export enum LetterValue {
    Matchs = 1,
    Exists,
    NotExists
}
