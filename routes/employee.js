const GET="SELECT * FROM employee";
const INSERT_EMPLOYEE="INSERT INTO employee(user_id,company_id,email) VALUES";

const db=require('../sql/connect');
module.exports=(app)=>{

  app.get('/employee',(req,res)=>{
    db.query(GET,(err,results)=>{
      if(err) return res.send(err);
      return res.send(results && results.rows);
    })
  })

  app.get('/employee/invoice',(req,res)=>{
    const {employee_id,page,count,type,sortBy}=req.query;
    const DefaultLimit=5;
    let query;
    if(!employee_id) return res.send({"message":"please enter employee id"})

    if(type && (!type=='buyer' || !type=='seller'))
      return res.send({"message":"enter a valid type (buyer,seller)"});

    else if(count && page && sortBy && type)
        query=`SELECT * FROM invoice WHERE status = '${type}',employee_id = ${employee_id} ORDER BY ${sortBy} OFFSET ${count * page - count} LIMIT ${count}`;
    
    else if(count && page && sortBy){
        query=`SELECT * FROM invoice WHERE employee_id = ${employee_id} ORDER BY ${sortBy} OFFSET ${count * page - count} LIMIT ${count}`;
    }
    else if(count && page && type){
        query=`SELECT * FROM invoice WHERE status = '${type}',employee_id = ${employee_id} ORDER BY invoice_id OFFSET ${count * page - count} LIMIT ${count}`;
    }
    else if(page && sortBy && type){
        query=`SELECT * FROM invoice WHERE status = '${type}',employee_id = ${employee_id} ORDER BY ${sortBy} OFFSET ${DefaultLimit * page - DefaultLimit} LIMIT ${DefaultLimit}`;
    }
    else if(count && page){
      query=`SELECT * FROM invoice WHERE employee_id = ${employee_id} ORDER BY invoice_id OFFSET ${count * page - count} LIMIT ${count}`;
    }
    else if(count && type)
      query=`SELECT * FROM invoice WHERE status = '${type}',employee_id = ${employee_id} ORDER BY invoice_id LIMIT ${count}`;
    
    else if(page && type)
      query=`SELECT * FROM invoice WHERE status = '${type}',employee_id = ${employee_id} ORDER BY invoice_id OFFSET ${DefaultLimit * page - DefaultLimit} LIMIT ${DefaultLimit}`;
    
    else if(type)
      query=`SELECT * FROM invoice WHERE status = '${type}',employee_id = ${employee_id}`
    else if(count)
      query=`SELECT * FROM invoice WHERE employee_id = ${employee_id} LIMIT ${count}`
    else if(page)
      query=`SELECT * FROM invoice WHERE employee_id = ${employee_id} ORDER BY invoice_id OFFSET ${DefaultLimit * page - DefaultLimit} LIMIT ${DefaultLimit}`;
    else 
      query=`SELECT * FROM invoice WHERE employee_id = ${employee_id}`;
        db.query(query,(err,results)=>{
          if(err) return res.send(err);
          else if(results && results.rows)
              return res.send(results.rows);
            
        })
  })

  const updateEmployee=(email,company_id,employee_id,callback)=>{
    let query;
    const updateAll=`UPDATE employee SET email = '${email}' , company_id = '${company_id}'WHERE employee_id = ${employee_id}`;
    const updateEmail=`UPDATE employee SET email = '${email}' WHERE employee_id = ${employee_id}`;
    const updateCompId=`UPDATE employee SET company_id = '${company_id}' WHERE employee_id = ${employee_id}`;
    if(email && company_id){
      query=updateAll;
    }
    else if(email){
      query=updateEmail;
    }
    else if(company_id){
      query=updateCompId;
    }
    else return callback({"message":"cannot execute query"})

    db.query(query,(err,results)=>{
      if(err) return callback(err);
      return callback({"message":"employee properties changed"})
    })
  }

  app.patch('/employee/:id',(req,res)=>{
    const {email,company_id}=req.body;
    const employee_id=req.params.id;
    const check_employee=`SELECT 1 FROM employee WHERE employee_id='${employee_id}' LIMIT 1`;
    db.query(check_employee,(err,results)=>{
      if(err) return res.send(err);
      else if(results && results.rowCount==1){
        const check_company=`SELECT 1 FROM company WHERE company_id='${company_id}' LIMIT 1`
        if(company_id){
          db.query(check_company,(err,results)=>{
            if(err) return res.send(err);
            if(results && results.rowCount==1){
              updateEmployee(email,company_id,employee_id,function (message) {
                return res.send(message)
              })
            }
            else return res.send({"message":"please enter a valid company_id"})
          })
        }
        else if(email){
          updateEmployee(email,company_id,employee_id,function (message) {
            return res.send(message)
          })
        }
        else return res.send({"message":"please provide valid body params"});
        }
      })
  })

  const insertEmployee=(user_id,company_id,email,callback)=>{
    const check_employee=`SELECT 1 FROM employee WHERE user_id='${user_id}' LIMIT 1`
      db.query(check_employee,(err,results)=>{
        if(err) return callback(err);
        else if(results.rowCount==1)
          return callback({"message":"employee already exists"})
        else
          db.query(`${INSERT_EMPLOYEE} ('${user_id}','${company_id}','${email}')`,(err,results)=>{
          if(err) return callback(err)
          return callback({"message":"Added employee"});
        })
      
      })
  }

  app.post('/employee',(req,res)=>{
    const {email,company_id,user_id}=req.body;
    if(email && company_id && user_id){
      const check_company=`SELECT 1 FROM company WHERE company_id='${company_id}' LIMIT 1`
      db.query(check_company,(err,results)=>{
        if(err) res.send(err.message)
        else if(results.rowCount==1){
          insertEmployee(user_id,company_id,email,function (message) {
           return res.send(message);
          })
        }
        else res.send({"message":"please enter a valid company id"})
      })
    }
    else if(email && company_id)
      return res.send({"message":"please provide user_id"});
    else if(company_id && user_id)
      return res.send({"message":"please provide email"})
    else if(email && user_id)
      return res.send({"message":"please provide company_id"})
    else if(email)
      return res.send({"message":"please provide company_id and user_id"})
    else if(company_id)
      return res.send({"message":"please provide email and user_id"})
    else if(user_id)
      return res.send({"message":"please provide company_id and email"})
    else 
      return res.send({"message":"please provide company_id, user_id and email"})
  })
}