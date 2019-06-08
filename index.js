const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 8000

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
app.delete('/admins/:id', db.deleteAdmin)


app.get('/projects', db.getProjects)
app.get('/projects/:id', db.getProjectById)
app.post('/projects', db.createProject)


//app.get('/groups', db.getGroups)
//app.get('/groups/:id', db.getGroupById)

app.get('/students', db.getStudents)

//app.get('/group_pref', db.getGroupPref)

//app.post('/group', db.createGroup)






app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})