import { select, upsert } from "../database/postgresql"
import { fetchGamesByUserId } from "../database/sql/game_history"
import { UserStats, UserStatsMapper } from "../entities/models/user"
import { ServiceResponse } from "../entities/serviceResponse"


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

export {getUserStats}