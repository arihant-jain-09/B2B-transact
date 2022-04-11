const express=require('express');
const mongoose=require('mongoose');
const keys=require('./config/keys');
require('./models/User');
require('./models/Company');
require('./models/Invoice');

mongoose.connect('mongodb+srv://arihant_jain_09:8CcQPrAtA8BfMjnN@transact.izaa0.mongodb.net/B2B?retryWrites=true&w=majority',{},(err)=>{
  if(err){
    console.log(err);
  }
  else console.log('connected to mongodb');
})
console.log(mongoose.connection.readyState);
const app=express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
require('./routes/User/authRoutes')(app);
require('./routes/Company/authRoutes')(app);
require('./routes/Invoice/routes')(app);

const PORT=process.env.PORT || 5000;
app.listen(PORT);

app.get('/',(req,res)=>{
  res.send('Welcome to B2B transact')
})


