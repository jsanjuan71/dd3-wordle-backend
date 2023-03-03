import { select } from "../database/postgresql"

const checkDatabase = async() : Promise<boolean> => {
    const result = await select("select 1 as DONE")
    return result.done
}

export {checkDatabase}