const GET="SELECT * FROM employee";
// const INSERT_USER="INSERT INTO invoices(name,username) VALUES";
// const INSERT_EMPLOYEE="INSERT INTO employee(user_id,company_id,email) VALUES";

const db=require('../sql/connect');
module.exports=(app)=>{
  app.get('/employee',(req,res)=>{
    db.query(GET,(err,results)=>{
      if(err) return res.send(err);
      return res.send(results && results.rows);
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

  // app.post('/employee',(req,res)=>{
  //   const {email,company_id}=req.body;
  //   if(email && company_id){

  //   }
  // })
}