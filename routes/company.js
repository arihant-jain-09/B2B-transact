const GET="SELECT * FROM company";
const INSERT="INSERT INTO company(company_name,email,established) VALUES";

const db=require('../sql/connect');
module.exports=(app)=>{
    app.get('/companies',(req,res)=>{
        db.query(GET,(err,results)=>{
        if(err) res.send(err.message)
        res.send(results);
      })
    })

    app.post('/companies',(req,res)=>{
      const {company_name,email,established}=req.body;
      const query=`SELECT 1 FROM company WHERE company_name="${company_name}" OR email="${email}" LIMIT 1`;
      db.query(query,(err,results)=>{
        if(err) res.send(err.message);
        if(results?.length>0 && results[0]['1'])
          res.send({"message":"company with either same name or email already exists please choose different values"});  
        else{
          db.query(`${INSERT}('${company_name}','${email}','${established}')`,(err,results)=>{
            if(err) res.send(err.message);
            res.send(results);
          })
        }
      })
    })
}
