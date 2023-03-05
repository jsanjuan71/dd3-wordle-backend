import crypto from 'crypto'

const encryptConfig = {
    "saltLength": 16,
    "algorythm" : "sha256",
    "iterarions": 1024,
    "length": 256
}

type EncryptInfo = {
    salt: string
    data: string
}

const encrypt = (source: string) : EncryptInfo|null => {
    try {
        const salt: string = crypto.randomBytes( encryptConfig.saltLength ).toString("hex")
        const encrypted: string = crypto
            .pbkdf2Sync(source, salt, encryptConfig.iterarions, encryptConfig.length, encryptConfig.algorythm)
            .toString("hex")
        return {salt: salt, data:encrypted}
    } catch (error: any) {
        console.error(error.message)
        return null
    }
}

export {EncryptInfo, encrypt}