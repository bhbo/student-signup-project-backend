const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: '192.168.178.64',
  database: 'api',
  password: 'password',
  port: 5432,
})


const getGroupPref = (request, response) => {
  pool.query('SELECT * FROM group_preference', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getStudents = (request, response) => {
  pool.query('SELECT * FROM students', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getGroups = (request, response) => {
  pool.query('SELECT * FROM groups', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}


const getGroupById = (request, response) => {
  const id = request.params.id

  pool.query('SELECT * FROM groups WHERE group_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getProjects = (request, response) => {
  pool.query('SELECT * FROM projects ORDER BY project_id ASC', (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const getProjectById = (request, response) => {
  const id = request.params.id

  pool.query('SELECT * FROM projects WHERE project_id = $1', [id], (error, results) => {
    if (error) {
      throw error
    }
    response.status(200).json(results.rows)
  })
}

const createProject = (request, response) => { //project_id is autogenerated
  const { title, description, category,requirement } = request.body

  pool.query('INSERT INTO projects (title, description, category, requirement) VALUES ($1, $2, $3, $4)', 
  [title, description, category,requirement], (error, results) => {
    if (error) {
      throw error
    }
    response.status(201).send(`Project added with ID: ${result.insertId}`)
  })
}


const getAdmins = (request, response) => {
    pool.query('SELECT * FROM admins ORDER BY admin_id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const getAdminById = (request, response) => {
    const id = request.params.id
  
    pool.query('SELECT * FROM admins WHERE admin_id = $1', [id], (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
  }
  
  const createAdmin = (request, response) => {
    const { admin_id, password, first_name, last_name } = request.body
  
    pool.query('INSERT INTO admins (admin_id, password, first_name, last_name) VALUES ($1, $2, $3, $4)', 
    [admin_id, password, first_name, last_name], (error, results) => {
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

    getProjects,
    getProjectById,
    createProject,

    getGroups,
    getGroupById,
    getStudents,
    getGroupPref,
  }

  const db = require('./queries')