import { QueryResult } from "pg"

export type User = {
    id: number
    username: string
    password?: string
    salt?: string
    createdAt?: Date
    deletedAt?: Date
}

export const UserMapper = (data: any): User => {
    return {
        id: data.id,
        username: data.username,
        password: data.password,
        salt: data.salt,
        createdAt: data.created_at,
        deletedAt: data.deleted_at
    }
}

export type UserResponse = {
    id?: number
    username: string
    createdAt?: Date
}

export const UserResponseMapper = (usr: User): UserResponse => {
    return {
        id: usr.id,
        username: usr.username,
        createdAt: usr.createdAt
    }
}