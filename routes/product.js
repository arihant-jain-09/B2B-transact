const GET="SELECT * FROM product";
// const INSERT_USER="INSERT INTO products(name,username) VALUES";
const ADD_PRODUCT="INSERT INTO product(sku,item_name,price) VALUES";

const db=require('../sql/connect');

module.exports=(app)=>{

  const updateProduct=(item_name,price,product_id,currency,callback)=>{
    let query;
    const updateAll=`UPDATE product SET item_name = '${item_name}' , price = '${price}', currency = '${currency}'  WHERE product_id = ${product_id}`;
    const updateNamePrice=`UPDATE product SET item_name = '${item_name}' , price = '${price}' WHERE product_id = ${product_id}`;
    const updateNameCurrency=`UPDATE product SET item_name = '${item_name}' , currency = '${currency}' WHERE product_id = ${product_id}`;
    const updatePriceCurrency=`UPDATE product SET currency = '${currency}' , price = '${price}' WHERE product_id = ${product_id}`;
    const updatePrice=`UPDATE product SET price = '${price}' WHERE product_id = ${product_id}`;
    const updateCurrency=`UPDATE product SET currency = '${currency}' WHERE product_id = ${product_id}`;
    const updateName=`UPDATE product SET item_name = '${item_name}' WHERE product_id = ${product_id}`;
      if(item_name && price && currency)
        query=updateAll;
      else if(item_name && price)
        query=updateNamePrice;
      else if(item_name && currency)
        query=updateNameCurrency;
      else if(price && currency)
        query=updatePriceCurrency;
      else if(item_name)
        query=updateName;
      else if(price)
        query=updatePrice;
      else if(currency)
        query=updateCurrency;
      else return callback("no valid query for this");
      db.query(query,(err,results)=>{
        if(err) return callback(err.message);
        return callback("changed product properties");
      });
  }

  app.patch('/products/:id',(req,res)=>{
    const product_id=req.params.id;
    const {item_name,price,currency}=req.body;
    if(!item_name && !price && !currency)
      return res.send({"message":"please enter body params"});
    else{
      const check_product=`SELECT 1 FROM product WHERE product_id='${product_id}' LIMIT 1`;
      db.query(check_product,(err,results)=>{
        if(err) return res.send(err);
        else if(results && results.rowCount==1){
          updateProduct(item_name,price,product_id,currency,function (message) {
            return res.send(message);
          })
        }
        else return res.send({"message":"column does not exists"})
      })
    }
    
    
  })

  app.get('/products',(req,res)=>{
    db.query(GET,(err,results)=>{
      if(err) res.send(err);
      return res.send(results && results.rows);
    })
  })

  app.post('/products',(req,res)=>{
    const {item_name,sku,price} = req.body;
    if(!item_name || !sku || !price)
      return res.send({"message":"please enter all valid body params"})
    if(price<=0) return res.send({"message":"please enter price > 0"})
    else{
      const check_sku=`SELECT 1 FROM product WHERE sku='${sku}' LIMIT 1`
      db.query(check_sku,(err,results)=>{
        if(err) res.send(err);
        else if(results && results.rowCount==1)
          return res.send({"message":"Choose a different sku this one already exists"})
        else{
          db.query(`${ADD_PRODUCT}('${sku}','${item_name}','${price}')`,(err,results)=>{
            if(err) return res.send(err)
            return res.send({"message":{
              "query":"success",
              "sku":sku,
              "item_name":item_name,
              "price":price
            }})
          })
        }
      })
    }
  })
}