import 'dotenv/config'
import express from 'express'
import analyzeHandler from './api/analyze.js'
import lookupHandler from './api/lookup.js'

const app = express()
app.use(express.json({ limit: '100kb' }))

app.post('/api/analyze', (req, res) => analyzeHandler(req, res))
app.post('/api/lookup', (req, res) => lookupHandler(req, res))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
