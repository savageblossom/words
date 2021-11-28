import express, { Request, Response, Application } from 'express'
import bodyParser from 'body-parser'

import { searchByWord, generateWord, grammarCheck } from './modules'

const app: Application = express()

app.use(bodyParser.json())

app.post('/word-parser/search', (req: Request, res: Response) => {
    const inputFromRequest = req.body.text
    const foundWord = searchByWord(inputFromRequest)

    res.send(foundWord)
})

app.post('/word-parser/generate', (req: Request, res: Response) => {
    const inputFromRequest = req.body.text
    const generatedWord = generateWord(inputFromRequest)

    res.send(generatedWord)
})

app.post('/word-parser/grammar', (req: Request, res: Response) => {
    const inputFromRequest = req.body.text
    const grammarCheckResult = grammarCheck(inputFromRequest)

    res.send(grammarCheckResult)
})

app.listen(1200)
