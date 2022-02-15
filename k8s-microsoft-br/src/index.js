/**
 * ATTENTION!
 * Only for tests purpose.
 * Don't use this code as an example for your applications.
 */
const express = require('express')
const { MongoClient } = require('mongodb')

const app = express()
const port = 3000
const www = process.env.WWW || './'
const message = {
  message: process.env.MESSAGE || 'Service healthy',
  mongo: process.env.MONGO_URL
}

if (!!message.mongo) {
  const uri = `mongodb://${message.mongo}:27017/?maxPoolSize=20&w=majority`
  const client = new MongoClient(uri, {
    connectTimeoutMS: 5000
  })

  console.log('Starting MongoDB connection')
  client
    .connect()
    .then(() => console.log('Connected on MongoDB!'))
    .catch((error) => console.dir(error))
    .finally(() => {
      console.log('MongoDB connection closed!')
      return client.close()
    })
}

app.use(express.static(www))
console.log(`serving ${www}`)
console.log(message)

app.get('/', (req, res) => {
  res.sendFile(`index.html`, { root: www })
})

app.get('/status', (req, res) => res.send({ message }))

app.listen(port, () => console.log(`listening on http://localhost:${port}`))
