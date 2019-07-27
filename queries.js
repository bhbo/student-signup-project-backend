const Pool = require('pg').Pool
const pool = new Pool({
  user: 'me',
  host: '192.168.178.64',
  database: 'api',
  password: 'password',
  port: 5432,
})
var groupId


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

  pool.query('INSERT INTO projects (title, description, category, requirement) VALUES ($1, $2, $3, $4) RETURNING project_id', 
  [title, description, category,requirement], function(error, results) {
    if (error) {
      throw error
    }
    response.status(201).send(`Project added with ID: ${results.rows[0].project_id}`) 
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

  const getList = (request, response) => {
    pool.query('select gr.group_id, st.student_id, st.first_name, st.email, pj1.title as choice1, pj2.title as choice2, pj3.title as choice3 \
    from public.groups gr \
    left join students st on st.student_id = gr.student_id \
    left join group_preference gr_prf on gr_prf.group_id = gr.group_id::varchar(10) \
    left join projects pj1 on pj1.project_id::varchar(10) = gr_prf.choice_1\
    left join projects pj2 on pj2.project_id::varchar(10) = gr_prf.choice_2\
    left join projects pj3 on pj3.project_id::varchar(10) = gr_prf.choice_3\
    order by gr.group_id, st.student_id', (error, results) => {
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
    const { admin_id, admin_password, first_name, last_name } = request.body
  
    pool.query('INSERT INTO admins (admin_id, admin_password, first_name, last_name) VALUES ($1, $2, $3, $4)', 
    [admin_id, admin_password, first_name, last_name], (error, results) => {
      if (error) {
        throw error
      }
      response.status(201).send(`User added with ID: ${admin_id}`)
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

  const createGroup = (request, response) => { 
    const {student_id1, student_id2, student_id3, first_name1, first_name2, first_name3, 
     email1, email2, email3, choice1,choice2,choice3} = request.body

    const column_name = ["student_id", "first_name", "email"] 

    for(var i=1;i<=3;i++){

      pool.query('INSERT INTO students (student_id, first_name, email) VALUES ($1, $2, $3) RETURNING student_id', 
        [request.body[column_name[0].concat(i)], request.body[column_name[1].concat(i)], 
          request.body[column_name[2].concat(i)]], (error, results) => {
          if (error) {
            throw error
          }  
          console.log(`Student added with ID: ${results.rows[0].student_id}`)
        })
    }
    //response.status(201).send(`Student added with ID: ${student_id1}, ${student_id2}, ${student_id3}`)
  
    pool.query('SELECT MAX(group_id)+1 as max_id FROM groups', function(error, results){
      if (error) {
        throw error
      }
      
      if(results.rows[0]["max_id"] === null){
        results.rows[0]["max_id"] = 1
      } 
      addGroup(results.rows[0]["max_id"])

      response.status(200)

    })

    function addGroup(groupId) {
      for(var i=1;i<=3;i++){
        pool.query('INSERT INTO groups (group_id, student_id) VALUES ($1, $2) RETURNING *',
        [groupId, request.body[column_name[0].concat(i)]], function(error, results) {
          if (error) {
            throw error
          }
          console.log(`Student added with ID: ${results.rows[0].student_id}, added to group: `, groupId)
        })
      }
      //response.status(201).send(`Student added to group: ${student_id1}, ${student_id2}, ${student_id3}`)

      addGroupPreference(groupId)
    }

    function addGroupPreference(groupId) {
        pool.query('INSERT INTO group_preference (group_id, choice_1, choice_2, choice_3) VALUES ($1, $2, $3, $4) RETURNING *',
        [groupId, choice1,choice2,choice3], function(error, results) {
          if (error) {
            throw error
          }
          console.log(`Choices: ${choice1}, ${choice2}, ${choice3}, added to group: `, groupId)
        })
      response.status(201).send(`Student added to group: ${student_id1}, ${student_id2}, ${student_id3}`)
    }
  
    // pool.query('INSERT INTO group (student_id) WHERE EXISTS(select 1 from group where group_id ='+groupId+' ) VALUES (SELECT student_id from student WHERE student_id =$1)',
    // [student_id2], (error, results) => {
    //   if (error) {
    //     throw error
    //   }
    //   response.status(201).send(`Group added with ID: ${result.insertId}`)
    // }
    // )
  
  //   pool.query('INSERT INTO group (student_id) WHERE EXISTS(select 1 from group where group_id ='+groupId+' ) VALUES (SELECT student_id from student WHERE student_id =$1)',
  //   [student_id3], (error, results) => {
  //     if (error) {
  //       throw error
  //     }
  //     response.status(201).send(`Group added with ID: ${result.insertId}`)
  //   }
  //   )
  
  //   pool.query('INSERT INTO group_preference (group_id, choice1, choice2, choice3) VALUES (SELECT group_id from group WHERE group_id =$1),$2,$3,$4',
  //   [groupId, choice1, choice2, choice3], (error, results) => {
  //     if (error) {
  //       throw error
  //     }
  //     response.status(201).send(`Group_preference added with ID: ${result.insertId}`)
  //   }
  //   )
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
    createGroup,

    getList
  }