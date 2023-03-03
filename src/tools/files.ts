import { createReadStream } from 'fs'
import { createInterface } from 'readline'
import events from 'events'

const readFileLines = async(path: string) : Promise<string[]> => {
    const words: string[] = []
    try {
        const reader = createInterface({
            input: createReadStream(path)
        })

        reader.on('line', (line: string) => {
            words.push(line)
        })

        await events.once(reader, 'close')

        return words
    } catch (error: any) {
        console.error(error.message)
        return []
    }
}

export {readFileLines}