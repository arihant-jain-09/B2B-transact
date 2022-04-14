const GET="SELECT * FROM invoice";
const GET_SORTED_BY_GRAND_TOTAL="SELECT * FROM invoice ORDER BY grand_total";
// const INSERT_USER="INSERT INTO invoices(name,username) VALUES";
const ADD_INVOICE="INSERT INTO invoice(buyer_id,seller_id,employee_id,products_services,grand_total ) VALUES";

const db=require('../sql/connect');

module.exports=(app)=>{

  const updateInvoice=(grand_total,invoice_id,status,callback)=>{
    let query;
    if(status && (status!=='pending' || status!=='approved' || status!=='denied')) return callback({"message":"please enter a status of pending and approved only"})
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
    const {employee_id,seller_id,grand_total,status}=req.body;
    if(!employee_id || !grand_total) return res.send({'message':"please enter both employee_id and grand_total"})
      const check_invoice=`SELECT 1 FROM invoice WHERE invoice_id='${invoice_id}' LIMIT 1`;

    db.query(check_invoice,(err,results)=>{
      if(err) return res.send(err);
      else if(results && results.rowCount==1){
        const check_employee=`SELECT employee.employee_id,company.company_id from employee INNER JOIN company ON employee.company_id=company.company_id`;
        db.query(check_employee,(err,results)=>{
          if(err) return res.send(err);
          else if(results && results.rowCount==1){
            if(results.rows[0].employee_id == employee_id && results.rows[0].company_id == seller_id)
              updateInvoice(grand_total,invoice_id,status,function (message) {
                return res.send(message);
              })
            else
              res.send({"message":"employee must be of the seller company"})
          }
          else return res.send({"message":"please enter a valid employee id"});
        })
      }
      else return res.send({"message":"column does not exists"})
    })
    
  })

  app.get('/invoices',(req,res)=>{
    const {sortBy,filter_status,count,page}=req.query;
    const DefaultLimit=5;
    let query;
    if(filter_status && (!filter_status=='pending' || !filter_status=='approved' || !filter_status=='denied'))
      return res.send({"message":"enter a valid filter_status (pending,approved,denied)"})

    else if(count && page && sortBy && filter_status)
        query=`SELECT * FROM invoice WHERE status = '${filter_status}' ORDER BY ${sortBy} OFFSET ${count * page - count} LIMIT ${count}`;
    
    else if(count && page && sortBy){
        query=`SELECT * FROM invoice ORDER BY ${sortBy} OFFSET ${count * page - count} LIMIT ${count}`;
    }
    else if(count && page && filter_status){
        query=`SELECT * FROM invoice WHERE status = '${filter_status}' ORDER BY invoice_id OFFSET ${count * page - count} LIMIT ${count}`;
    }
    else if(page && sortBy && filter_status){
        query=`SELECT * FROM invoice WHERE status = '${filter_status}' ORDER BY ${sortBy} OFFSET ${DefaultLimit * page - DefaultLimit} LIMIT ${DefaultLimit}`;
    }
    else if(count && page){
      query=`SELECT * FROM invoice ORDER BY invoice_id OFFSET ${count * page - count} LIMIT ${count}`;
    }
    else if(count && filter_status)
      query=`SELECT * FROM invoice WHERE status = '${filter_status}' ORDER BY invoice_id LIMIT ${count}`;
    
    else if(page && filter_status)
      query=`SELECT * FROM invoice WHERE status = '${filter_status}' ORDER BY invoice_id OFFSET ${DefaultLimit * page - DefaultLimit} LIMIT ${DefaultLimit}`;
    
    else if(filter_status)
      query=`SELECT * FROM invoice WHERE status = '${filter_status}'`
    else if(count)
      query=`SELECT * FROM invoice LIMIT ${count}`
    else if(page)
      query=`SELECT * FROM invoice ORDER BY invoice_id OFFSET ${DefaultLimit * page - DefaultLimit} LIMIT ${DefaultLimit}`;
    else 
      query=`SELECT * FROM invoice`;

        db.query(query,(err,results)=>{
          if(err) return res.send(err);
          else if(results && results.rows)
              return res.send(results.rows);
            
        })
  })

  app.post('/invoices',(req,res)=>{
    const {seller_id,buyer_id,employee_id,sku,grand_total} = req.body;
    if(!seller_id || !buyer_id || !employee_id || !grand_total || !sku)
      return res.send({"message":"please enter all valid body params"})
    if(grand_total<=0) return res.send({"message":"please enter grand_total > 0"})
    else{
      const check_sender=`SELECT company_name FROM company WHERE company_id='${seller_id}' LIMIT 1`
      const check_receiver=`SELECT company_name FROM company WHERE company_id='${buyer_id}' LIMIT 1`
      const check_employee=`SELECT 1 FROM employee WHERE employee_id='${employee_id}' LIMIT 1`
      const check_product=`SELECT sku FROM product WHERE sku='${sku}' LIMIT 1`
      try {
        Promise.all([
          db.query(check_sender),
          db.query(check_receiver),
          db.query(check_employee),
          db.query(check_product),
        ]).then(([sender,receiver,employee,product])=>{
          if(sender.rowCount==1 && receiver.rowCount==1 && employee.rowCount==1 && product.rowCount==1){
            db.query(`${ADD_INVOICE}('${buyer_id}','${seller_id}','${employee_id}','${product.rows[0].sku}','${grand_total}')`,(err,results)=>{
              if(err) return res.send(err);
              return res.send({"message":{
                "buyer_id":buyer_id,
                "seller_id":seller_id,
                "products_services":product.rows[0].sku,
                "employee_id":employee_id,
                "grand_total":grand_total
              }})
            })
          }
          else
            return res.send({"message":"please enter a valid sender, receiver, product and employee id's"})
        })
      } catch (error) {
        return res.send(error);
      }
    }
  })
}