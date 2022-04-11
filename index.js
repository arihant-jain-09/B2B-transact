const express=require('express');
const mongoose=require('mongoose');
const cookieSession=require('cookie-session');
const keys=require('./config/keys');
require('./models/User');
require('./models/Company');
require('./models/Invoice');

const serverStatus = () => {
  return { 
     state: 'up', 
     dbState: mongoose.STATES[mongoose.connection.readyState] 
  }
};

mongoose.connect(keys.mongoURI,{},(err)=>{
  if(err){
    console.log(err);
  }
  else console.log('connected to mongodb');
})
console.log(mongoose.connection.readyState);
const app=express();
app.use(cookieSession({
    maxAge:30 * 24 * 60 * 60 *1000,
    keys: [keys.cookieKey],
}))

app.use(express.json());
app.use(express.urlencoded({extended:true}));
require('./routes/User/authRoutes')(app);
require('./routes/Company/authRoutes')(app);
require('./routes/Invoice/routes')(app);

if(process.env.NODE_ENV ==='production'){
  app.use(express.static('client/build'));
  const path=require('path');
  app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'client','build','index.html'))
  })
}
const PORT=process.env.PORT || 5000;
app.listen(PORT);

app.use('/api/uptime', require('express-healthcheck')({
  healthy: serverStatus
}));


