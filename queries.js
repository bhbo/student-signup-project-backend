const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: 'localhost',
  database: 'api',
  password: 'password',
  port: 5432,
})

const getAdmins = (request, response) => {
    pool.query('SELECT * FROM admins ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const getAdminById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM admins WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const createAdmin = (request, response) => {
    const { name, username, password } = request.body
  
    pool.query('INSERT INTO users (name, username, password) VALUES ($1, $2, $3)', [name, username,password], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${result.insertId}`)
    })
  }

  
  const deleteAdmin = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM admins WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
  }

  module.exports = {
    getAdmins,
    getAdminById,
    createAdmin,
    //updateUser,
    deleteAdmin,
  }

  const db = require('./queries')