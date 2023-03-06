export interface ServiceResponse<Type> {
    done: boolean
    data?: Type | Type[] | string
}