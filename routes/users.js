const GET="SELECT * FROM users";
const INSERT_USER="INSERT INTO users(name,username) VALUES";
const INSERT_EMPLOYEE="INSERT INTO employee(user_id,company_id) VALUES";

const db=require('../sql/connect');
module.exports=(app)=>{

    const updateUser=(name,username,user_id,callback)=>{
      if(username===null){
        const updateUser=`UPDATE users SET name = '${name}' WHERE user_id = ${user_id}`;
          db.query(updateUser,(err,results)=>{
            if(err) return callback(err);
              return callback({"message":"changed user properties"})
          })
      }
      else if(name===null){
        const updateUser=`UPDATE users SET username = '${username}' WHERE user_id = ${user_id}`;
          db.query(updateUser,(err,results)=>{
            if(err) return callback(err);
              return callback({"message":"changed user properties"})
          })
      }
      else{
        const updateUser=`UPDATE users SET username = '${username}' , name = '${name}' WHERE user_id = ${user_id}`;
          db.query(updateUser,(err,results)=>{
            if(err) return callback(err);
              return callback({"message":"changed user properties"})
          })
      }
      }

    const insertEmployee=(user_id,company_id,callback)=>{
      const check_employee=`SELECT 1 FROM employee WHERE user_id='${user_id}' LIMIT 1`
        db.query(check_employee,(err,results)=>{
          if(err) return callback(err);
          else if(results.rowCount==1)
            return callback({"message":"employee already exists"})
          else
            db.query(`${INSERT_EMPLOYEE} ('${user_id}','${company_id}')`,(err,results)=>{
            if(err) return callback(err)
            return callback({"message":"Added employee"});
          })
        })
    }

    app.patch('/users/:id',(req,res)=>{
      const {username,name,company_id}=req.body;
      const user_id=req.params.id;
      if(username && name && company_id){
        const query=`SELECT 1 FROM users WHERE user_id='${user_id}' LIMIT 1;`;
        db.query(query,(err,results)=>{
          if(err) res.send(err.message)
          else if(results.rowCount==1){
            const check_company=`SELECT 1 FROM company WHERE company_id='${company_id}' LIMIT 1`
            db.query(check_company,(err,results)=>{
              if(err) res.send(err.message)
              else if(results.rowCount==1){
                insertEmployee(user_id,company_id,function (employeeAddMessage) {
                  updateUser(name,username,user_id,function(userMessage) {
                    res.send({...userMessage,employeeAddMessage});
                  })
                })
              }
              else res.send({"message":"please enter a valid company id"})
            })
          }
          else res.send({"message":"please enter a valid user id"})
        })
      }
      else if(username && name){
        const query=`SELECT 1 FROM users WHERE user_id='${user_id}' LIMIT 1;`;
        db.query(query,(err,results)=>{
          if(err) res.send(err.message)
          else if(results.rowCount==1){
            updateUser(name,username,user_id,function(userMessage) {
              res.send(userMessage);
            })
          }
          else res.send({"message":"please enter a valid user id"})
        })
      }
      else if(name && company_id){
        const check_company=`SELECT 1 FROM company WHERE company_id='${company_id}' LIMIT 1`
            db.query(check_company,(err,results)=>{
              if(err) res.send(err.message)
              else if(results.rowCount==1){
                insertEmployee(user_id,company_id,function (employeeAddMessage) {
                  updateUser(name,null,user_id,function(userMessage) {
                    res.send({...userMessage,employeeAddMessage});
                  })
                })
              }
              else res.send({"message":"please enter a valid company id"})
            })
      }
      else if(username && company_id){
        const check_company=`SELECT 1 FROM company WHERE company_id='${company_id}' LIMIT 1`
            db.query(check_company,(err,results)=>{
              if(err) res.send(err.message)
              else if(results.rowCount==1){
                insertEmployee(user_id,company_id,function (employeeAddMessage) {
                  updateUser(null,username,user_id,function(userMessage) {
                    res.send({...userMessage,employeeAddMessage});
                  })
                })
              }
              else res.send({"message":"please enter a valid company id"})
            })
      }
      else if(username){
        updateUser(null,username,user_id,function(userMessage) {
          res.send({...userMessage});
        })
      }
      else if(name){
        updateUser(name,null,user_id,function(userMessage) {
          res.send({...userMessage});
        })
      }
      else if(company_id){
        const check_company=`SELECT 1 FROM company WHERE company_id='${company_id}' LIMIT 1`
            db.query(check_company,(err,results)=>{
              if(err) res.send(err.message)
              else if(results.rowCount==1){
                insertEmployee(user_id,company_id,function (employeeAddMessage) {
                  res.send(employeeAddMessage)
                })
              }
              else res.send({"message":"please enter a valid company id"})
            })
      }
      else res.send({"message":"enter valid body params"})
    })

    
    app.get('/users',(req,res)=>{
      db.query(GET,(err,results)=>{
        res.send(results.rows);
      })
    })

    app.post('/users',(req,res)=>{
      const {name,username}=req.body;
      const query=`SELECT 1 FROM users WHERE username='${username}' LIMIT 1`;
      db.query(query,(err,results)=>{
        if(err) throw err;
        if(results.rowCount==1)
          res.send({"message":"username already exists please choose a different username"});  
        else{
          db.query(`${INSERT_USER}('${name}','${username}')`,(err,results)=>{
            if(err) throw err;
            res.send(results);
          })
        }
      })
    })
}