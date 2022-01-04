const express = require('express')
const app = express()
const port = 3000
const www = process.env.WWW || './'
const message = {
  message: process.env.MESSAGE || 'Service healthy',
  mongo: process.env.MONGO_URL
}

app.use(express.static(www))
console.log(`serving ${www}`)
console.log(message)

app.get('/', (req, res) => {
  res.sendFile(`index.html`, { root: www })
})

app.get('/status', (req, res) => res.send({ message }))

app.listen(port, () => console.log(`listening on http://localhost:${port}`))
