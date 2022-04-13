const GET="SELECT * FROM company";
const INSERT="INSERT INTO company(company_name,email,established) VALUES";

const db=require('../sql/connect');
module.exports=(app)=>{

    const updateCompany=(company_name,email,established,company_id,callback)=>{
      const updateAll=`UPDATE company SET company_name = '${company_name}' , email = '${email}', established = '${established}' WHERE company_id = ${company_id}`;
      const updateCNameEmail=`UPDATE company SET company_name = '${company_name}' , email = '${email}' WHERE company_id = ${company_id}`;
      const updateCEmailEstd=`UPDATE company SET email = '${email}' , established = '${established}' WHERE company_id = ${company_id}`;
      const updateCNameEstd=`UPDATE company SET company_name = '${company_name}' , established = '${established}' WHERE company_id = ${company_id}`;
      const updateCName=`UPDATE company SET company_name = '${company_name}' WHERE company_id = ${company_id}`;
      const updateEmail=`UPDATE company SET email = '${email}' WHERE company_id = ${company_id}`;
      const updateEst=`UPDATE company SET established = '${established}' WHERE company_id = ${company_id}`;
      let query;
      if(company_name && email && established)
        query=updateAll;
      else if(company_name && email)
        query=updateCNameEmail;
      else if(company_name && established)
        query=updateCNameEstd;
      else if(email && established)
        query=updateCEmailEstd;
      else if(company_name)
        query=updateCName;
      else if(email)
        query=updateEmail;
      else if(established)
        query=updateEst;
      else return callback("no valid query for this")
      db.query(query,(err,results)=>{
        if(err) callback(err.message);
        return callback("changed company properties");
      });
    }

    app.patch('/companies/:id',(req,res)=>{
      const company_id=req.params.id;
      const {company_name,email,established}=req.body;
      const check_company=`SELECT 1 FROM company WHERE company_id='${company_id}' LIMIT 1`
        db.query(check_company,(err,results)=>{
          if(err) res.send(err.message)
          else if(results.rowCount==1){
            updateCompany(company_name,email,established,company_id,function (message) {
              res.send(message);
            })
          }
          else res.send({"message":"please enter a valid company id"})
        })

    })
    app.get('/companies',(req,res)=>{
        db.query(GET,(err,results)=>{
        if(err) res.send(err.message)
        res.send(results.rows);
      })
    })

    app.post('/companies',(req,res)=>{
      const {company_name,email,established}=req.body;
      const query=`SELECT 1 FROM company WHERE company_name='${company_name}' OR email='${email}' LIMIT 1`;
      db.query(query,(err,results)=>{
        if(err) return res.send(err.message);
        if(results && results?.rowCount==1)
          return res.send({"message":"company with either same name or email already exists please choose different values"});  
        else{
          db.query(`${INSERT}('${company_name}','${email}','${established}')`,(err,results)=>{
            if(err) return res.send(err.message);
            return res.send(results);
          })
        }
      })
    })
}
