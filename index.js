const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/admins', db.getAdmins)
app.get('/admins/:id', db.getAdminById)
app.post('/admins', db.createAdmin)
//app.put('/users/:id', db.updateUser)
app.delete('/admins/:id', db.deleteAdmin)

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})