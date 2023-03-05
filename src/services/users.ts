import { select, upsert } from "../database/postgresql"
import { insertUserRow } from "../database/sql/users"
import { User, UserMapper } from "../entities/models/user"
import { ServiceResponse } from "../entities/serviceResponse"
import { encrypt, EncryptInfo } from "../tools/encrypt"

const createUser = async(data: any) : Promise<ServiceResponse<User>> => {
    var response: ServiceResponse<User> = {done: false}
    try {
        const encrypted: EncryptInfo|null = encrypt(data.password)
        if(encrypted){
            const {done, result} = await upsert( insertUserRow, [data.username, encrypted.salt, encrypted.data  ] )
            if( done ) {
                let user: User = UserMapper( result.pop() )
                response.done = true
                response.data = user
            } else{
                response.data = result
            }
        } else throw Error(`Encryption error`)
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}

export {createUser}