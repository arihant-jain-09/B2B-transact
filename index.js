const express=require('express');
const createTable=require('./sql/create');
// const pool=require('./sql/pool');
const db=require('./sql/connect');
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
require('./routes/users')(app);
require('./routes/company')(app);
require('./routes/employee')(app);
require('./routes/invoice')(app);
require('./routes/product')(app);
// Create table
app.post("/addtable", async(req, res) => {
  const {sqlQuery}=req.body;
  console.log(sqlQuery);
  try {
    const results=await db.query(sqlQuery);
    res.json(results);
  } catch (error) {
    console.log(error);
    res.send(error)
  }
  
});

// require('./routes/User/authRoutes')(app);
// require('./routes/Company/authRoutes')(app);
// require('./routes/Invoice/routes')(app);

if(process.env.NODE_ENV ==='production'){
  app.use(express.static('client/build'));
  const path=require('path');
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}

const PORT=process.env.PORT || 5000;
app.listen(PORT);

app.get('/',(req,res)=>{
  res.send('Welcome to B2B transact')
})


