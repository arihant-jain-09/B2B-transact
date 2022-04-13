const GET="SELECT * FROM invoice";
// const INSERT_USER="INSERT INTO invoices(name,username) VALUES";
const ADD_INVOICE="INSERT INTO invoice(buyer_id,seller_id,employee_id,grand_total ) VALUES";

const db=require('../sql/connect');

module.exports=(app)=>{

  const updateInvoice=(grand_total,invoice_id,status,callback)=>{
    let query;
    if(status && (status!=='pending' || status!=='approved')) return callback({"message":"please enter a status of pending and approved only"})
    else if(status && grand_total){
      query=`UPDATE invoice SET grand_total = '${grand_total}' WHERE invoice_id = ${invoice_id}`
    }
    else if(status){
      query=`UPDATE invoice SET status = '${status}' WHERE invoice_id = ${invoice_id}`
    }
    else if(grand_total){
      query=`UPDATE invoice SET grand_total = '${grand_total}' WHERE invoice_id = ${invoice_id}`
    }
    else
      return callback({"message":"query cannot be executed"})
    db.query(query,(err,results)=>{
      if(err) return callback(err);
      return callback({"message":"invoice updated"})
    })
  }

  app.patch('/invoices/:id',(req,res)=>{
    const invoice_id=req.params.id;
    const {employee_id,grand_total,status}=req.body;
    if(!employee_id || !grand_total) return res.send({'message':"please enter both employee_id and grand_total"})
      const check_invoice=`SELECT 1 FROM invoice WHERE invoice_id='${invoice_id}' LIMIT 1`;

    db.query(check_invoice,(err,results)=>{
      if(err) return res.send(err);
      else if(results && results.rowCount==1){
        const check_employee=`SELECT 1 FROM employee WHERE employee_id='${employee_id}' LIMIT 1`;
        db.query(check_employee,(err,results)=>{
          if(err) return res.send(err);
          else if(results && results.rowCount==1){
            updateInvoice(grand_total,invoice_id,status,function (message) {
              return res.send(message);
            })
          }
          else return res.send({"message":"please enter a valid employee id"});
        })
      }
      else return res.send({"message":"column does not exists"})
    })
    
  })

  app.get('/invoices',(req,res)=>{
    db.query(GET,(err,results)=>{
      if(err) res.send(err);
      return res.send(results && results.rows);
    })
  })

  app.post('/invoices',(req,res)=>{
    const {seller_id,buyer_id,employee_id,grand_total} = req.body;
    if(!seller_id || !buyer_id || !employee_id || !grand_total)
      return res.send({"message":"please enter all valid body params"})
    if(grand_total<=0) return res.send({"message":"please enter grand_total > 0"})
    else{
      const check_sender=`SELECT company_name FROM company WHERE company_id='${seller_id}' LIMIT 1`
      const check_receiver=`SELECT company_name FROM company WHERE company_id='${buyer_id}' LIMIT 1`
      const check_employee=`SELECT 1 FROM employee WHERE employee_id='${employee_id}' LIMIT 1`
      try {
        Promise.all([
          db.query(check_sender),
          db.query(check_receiver),
          db.query(check_employee),
        ]).then(([sender,receiver,employee])=>{
            // return res.send({sender,receiver,employee})
          if(sender.rowCount==1 && receiver.rowCount==1 && employee.rowCount==1){
            db.query(`${ADD_INVOICE}('${buyer_id}','${seller_id}','${employee_id}','${grand_total}')`,(err,results)=>{
              if(err) return res.send(err);
              return res.send(`{"message":"added invoice" with buyer being ${sender.rows[0].company_name}, sender being ${receiver.rows[0].company_name} and employee id ${employee_id}`)
            })
          }
          else if(sender.rowCount==1 && receiver.rowCount==1)
            return res.send({"message":"please enter a valid employee id"})
          else if(sender.rowCount==1 && employee.rowCount==1)
            return res.send({"message":"please enter a valid receiver company id"})
          else if(receiver.rowCount==1 && employee.rowCount==1)
            return res.send({"message":"please enter a valid sender company id"})
          else if(sender.rowCount==1)
            return res.send({"message":"please enter a valid receiver and employee id's"})
          else if(receiver.rowCount==1)
            return res.send({"message":"please enter a valid sender and employee id's"})
          else if(employee.rowCount==1)
            return res.send({"message":"please enter a valid sender and receiver id's"})
          else
            return res.send({"message":"please enter a valid sender, receiver and employee id's"})
        })
      } catch (error) {
        return res.send(error);
      }
    }
  })
}