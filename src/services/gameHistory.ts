import { select, upsert } from "../database/postgresql"
import { fetchGamesByUserId, fetchMostWinnerUsers } from "../database/sql/game_history"
import { UserStats, UserStatsMapper } from "../entities/models/user"
import { ServiceResponse } from "../entities/serviceResponse"
import {TopGamer, TopGammerMapper} from '../entities/models/gameHistory'


const getUserStats = async(userId: number) : Promise<ServiceResponse<UserStats>> => {
    var response: ServiceResponse<UserStats> = {done: false}
    try {
        const {done, result} =  await select( fetchGamesByUserId, [userId] )
        if(!done || !result.length) throw Error("User games data was not correctly loaded")

        const stats = UserStatsMapper({...result.pop(), user_id: userId })

        response.done = true
        response.data = stats
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}

const getMostWinners = async(limit: number) : Promise<ServiceResponse<TopGamer[]>> => {
    var response: ServiceResponse<TopGamer[]> = {done: false}
    try {
        const {done, result} =  await select( fetchMostWinnerUsers, [limit] )
        if(!done || !result.length) throw Error("No winner users found")

        const mostWinners:TopGamer[] = result.map( winner => TopGammerMapper(winner) )

        response.done = true
        response.data = mostWinners
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}



export {getUserStats, getMostWinners}