import { select, upsert } from "../database/postgresql"
import { fetchUserByUsername, insertUserRow } from "../database/sql/users"
import { User, UserMapper } from "../entities/models/user"
import { ServiceResponse } from "../entities/serviceResponse"
import { encrypt, EncryptInfo } from "../tools/encrypt"
import { generateToken } from '../middleware/authorization'

const createUser = async(data: any) : Promise<ServiceResponse<User>> => {
    var response: ServiceResponse<User> = {done: false}
    try {
        const encrypted: EncryptInfo|null = encrypt(data.password)
        if(!encrypted) throw Error(`Encryption error`)

        const {done, result} = await upsert( insertUserRow, [data.username, encrypted.salt, encrypted.data  ] )
        if( done && result.length ) {
            let user: User = UserMapper( result.pop() )
            response.done = true
            response.data = user
        } else{
            response.data = result
        }
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}

const validateUser = async(data: any) : Promise<ServiceResponse<string>> => {
    var response: ServiceResponse<string> = {done: false}
    try {
        const {done, result} = await select( fetchUserByUsername, [data.username] )
        if(!done || !result.length)   throw Error("User not found")

        var user: User = UserMapper( result.pop() )
        const encrypted: EncryptInfo|null = encrypt(data.password, user.salt )
        if(!encrypted)  throw Error(`Encryption error`)

        if(encrypted.data === user.password){
            response.data = generateToken({
                id: user.id,
                name: data.username
            })
            response.done = true
        } else throw Error("Password does not match")
        
    } catch (error: any) {
        console.error(error.message)
        response.data = error.message
    } finally {
        return response
    }
}

export {createUser, validateUser}