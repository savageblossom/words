import wordsJson from '../words-list-grammar.json'

interface ISearchParams {
    time: 'string' | 'past' | 'present' | 'future' | null
    num: 'string' | 'singular' | 'plural' | null
}

interface IWord extends ISearchParams {
    [key: string]: string | null
    type: 'string' | 'pronoun' | 'noun' | 'verb'
    sex: 'string' | 'male' | 'female' | null
    person: 'string' | 'first' | 'third' | null
}

interface IWordList {
    [key: string]: IWord
}

const wordsList: IWordList = wordsJson as IWordList

const findSimiliarWord = (word: string): Set<string> => {
    const words = Object.keys(wordsList)

    const letters = word.split('')

    const occurenices = new Set()

    // "Grid" search
    // (!) In case of typo
    letters.forEach((_, index) => {
        const left = letters.slice(0, index).join('')
        const right = letters.slice(index + 1, letters.length).join('')
        const foundWord = words.find(
            (word) => word.includes(left) && word.includes(right)
        )
        if (foundWord) {
            occurenices.add(foundWord)
        }
    })

    // "Half-word" search
    const halfOfWord = word.slice(0, Math.round(word.length / 2))

    words.forEach((wordFromList) => {
        if (wordFromList.includes(halfOfWord)) {
            occurenices.add(wordFromList)
        }
    })

    return occurenices as Set<string>
}

const createSuggestion = (
    { word }: { word: string },
    searchParams: ISearchParams
) => {
    const similiarWords = findSimiliarWord(word)
    let foundSuggestion = ''

    Object.keys(searchParams).forEach((paramName) => {
        similiarWords.forEach((similiarWord) => {
            if (
                (wordsList[similiarWord] as any)[paramName] ===
                (searchParams as any)[paramName]
            ) {
                foundSuggestion = similiarWord
            }
        })
    })

    return foundSuggestion
}

const grammarCheck = (input: string) => {
    const convertedText = input.split(' ').map((word) => {
        return { word, ...wordsList[word.toLocaleLowerCase()] }
    })

    const pronoun = convertedText.find(
        (word) => word.type === 'pronoun'
    ) as IWord
    const verb = convertedText.find((word) => word.type === 'verb') as IWord

    if (pronoun.num !== verb.num) {
        const word = verb.word as string
        const params = {
            num: pronoun.num,
            time: verb.time,
        }

        return {
            status: 'error',
            payload: {
                words: [pronoun, verb],
                suggestion: createSuggestion({ word }, params),
            },
        }
    } else {
        return {
            status: 'ok',
            payload: null,
        }
    }
}

export default grammarCheck
