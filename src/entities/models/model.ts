import { QueryResult } from "pg";

export interface Model<Type> {
    mapper(data: QueryResult): Type
}