import wordsList from '../words-list.json'
import grammarCheck from './grammarCheck'

const searchByWord = (input: string) => {
    return wordsList.filter((word) => word.slice(0, input.length) === input)
}

const generateWord = (input: string) => {
    return wordsList.filter((word) => word.includes(input))
}

export { searchByWord, generateWord, grammarCheck }