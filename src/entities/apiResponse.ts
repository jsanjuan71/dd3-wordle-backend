export interface ApiResponse<Type> {
    done: boolean
    result?: Type | Type[]
}