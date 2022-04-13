const express=require('express');
const createTable=require('./sql/create');


const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
const db=require('./sql/connect');
require('./routes/users')(app);
require('./routes/company')(app);

// Create table
app.post("/addtable", (req, res) => {
  const {sqlQuery}=req.body;
  console.log(sqlQuery);
  db.query(sqlQuery, (err) => {
    if (err) {
      throw err;
    }
    res.send("table created");
  });
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


