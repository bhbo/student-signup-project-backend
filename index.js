const express = require('express')
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 8000

var auth = {
  type: 'oauth2',
  user: 'awtproject.signup@gmail.com',
  clientId: '145650667844-ru36qg84otlcl1vbp8h19frbcc06p16s.apps.googleusercontent.com',
  clientSecret: '6sgIugmL6mmgSFfN1d2-JMoV',
  refreshToken: '1/BzHIPxqUILPqA6p3H7hTgk7DNF7zDzOfRr_R7h0VXmBD_E__Pw0CJEsLxz0LZORn',
};

app.use(bodyParser.json()) // handle json data
app.use(bodyParser.urlencoded({ extended: true })) // handle URL-encoded data

//app.use(express.urlencoded());
//app.use(express.multipart());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

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


app.get('/groups', db.getGroups)
app.get('/groups/:id', db.getGroupById)

app.get('/students', db.getStudents)

app.get('/group_pref', db.getGroupPref)

app.post('/group', db.createGroup)

app.post('/send_email', function(req, res){
  response = {
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  }
  var mailOptions = {
    from: req.body.name,
    to: req.body.email,
    subject: 'AWT Project signup confirmation: ',
    text: req.body.message,
    html: 'Message from: ' + req.body.name + '<br></br> Email: ' +  req.body.email + '<br></br> Message: ' + req.body.message,
  };
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: auth,
  });
  transporter.sendMail(mailOptions, (err, res) => {
      if (err) {
          return console.log(err);
      } else {
          console.log(JSON.stringify(res));
      }
  });
})
  






app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})