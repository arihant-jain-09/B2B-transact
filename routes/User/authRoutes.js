// const passport = require('passport');
const mongoose=require('mongoose');
const User=mongoose.model('users');

module.exports=(app)=>{

        app.get('/users',(req,res)=>{
            User.find({}).then((response)=>{
                res.send(response)
            })
        })
        app.post('/users',async(req,res)=>{
        const {name,userName}=req.body;
        User.find({"userName":userName})
            .then(async(resExists)=>{
            if(resExists && resExists.length>0){
                res.send({"messsage":'User with that username already exists'})
            }
            else{
                const user=new User({
                    name,
                    userName,
                    createdAt: Date.now()
                });
                try {
                    await user.save();
                    res.send('user created')
                } catch (error) {
                    res.status(404).send(error.message);
                }
            }
            })
            .catch((err)=>{
            console.log(err);
            })
    })
}
