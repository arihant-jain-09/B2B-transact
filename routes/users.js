const GET="SELECT * FROM users";
const GET_INVOICES="SELECT invoice_id,grand_total,buyer_id,seller_id,status,created_at FROM invoice";
const INSERT_USER="INSERT INTO users(name,username) VALUES";

const db=require('../sql/connect');
module.exports=(app)=>{

    const updateUser=(name,username,user_id,callback)=>{
      if(username===null){
        const updateUserQuery=`UPDATE users SET name = '${name}' WHERE user_id = ${user_id}`;
          db.query(updateUserQuery,(err,results)=>{
            if(err) return callback(err);
              return callback({"message":"changed user properties"})
          })
      }
      else if(name===null){
        const updateUserQuery=`UPDATE users SET username = '${username}' WHERE user_id = ${user_id}`;
          db.query(updateUserQuery,(err,results)=>{
            if(err) return callback(err);
              return callback({"message":"changed user properties"})
          })
      }
      else{
        const updateUserQuery=`UPDATE users SET username = '${username}' , name = '${name}' WHERE user_id = ${user_id}`;
          db.query(updateUserQuery,(err,results)=>{
            if(err) return callback(err);
              return callback({"message":"changed user properties"})
          })
      }
      }

    app.patch('/users/:id',(req,res)=>{
      const {username,name,company_id,email}=req.body;
      const user_id=req.params.id;
      if(company_id && email==null)
        return res.send({"message":"please enter email for employee"});
      else if(email && company_id==null)
        return res.send({"message":"please enter company_id for employee"})

      else if(username && name && company_id && email){
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
      else if(name && company_id && email){
        const check_company=`SELECT 1 FROM company WHERE company_id='${company_id}' LIMIT 1`
            db.query(check_company,(err,results)=>{
              if(err) res.send(err.message)
              else if(results.rowCount==1){
                insertEmployee(user_id,company_id,email,function (employeeAddMessage) {
                  updateUser(name,null,user_id,function(userMessage) {
                    res.send({...userMessage,employeeAddMessage});
                  })
                })
              }
              else res.send({"message":"please enter a valid company id"})
            })
      }
      else if(username && company_id && email){
        const check_company=`SELECT 1 FROM company WHERE company_id='${company_id}' LIMIT 1`
            db.query(check_company,(err,results)=>{
              if(err) res.send(err.message)
              else if(results.rowCount==1){
                insertEmployee(user_id,company_id,email,function (employeeAddMessage) {
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
      else if(company_id && email){
        const check_company=`SELECT 1 FROM company WHERE company_id='${company_id}' LIMIT 1`
            db.query(check_company,(err,results)=>{
              if(err) res.send(err.message)
              else if(results.rowCount==1){
                insertEmployee(user_id,company_id,email,function (employeeAddMessage) {
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

    app.get('/users/:id/invoices',(req,res)=>{
      const user_id=req.params.id;
      const check_user=`SELECT 1 FROM users WHERE user_id='${user_id}' LIMIT 1`;
      db.query(check_user,(err,results)=>{
        if(err) return res.send(err);
        else if(results && results.rowCount==1){
          db.query(GET_INVOICES,(err,results)=>{
            if(err) return res.send(err);
            else if(results && results.rows)
              return res.send(results.rows);
          })
        }
        else return res.send({"message":"use a valid user id in url params"});
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