const mongoose=require('mongoose');
const User=mongoose.model('users');
const Invoice=mongoose.model('invoices');

module.exports=(app)=>{

        app.patch('/users/:id',(req,res)=>{
            const user_id=req.params.id;
            const {trxId,amount} = req.body;
            if (!mongoose.Types.ObjectId.isValid(trxId)) {
                    return res.status(400).send("Invalid trx Id");
            }
            if(trxId && amount){
                Invoice.findOne({trxId}).then((trx)=>{
                    if(trx && trx.status === 'pending' && trx._UserId?.toString() === user_id){
                        Invoice.findByIdAndUpdate(trxId,{amount}).then((result)=>{
                            if(result)
                                res.send('invoice updated Success')
                            else
                                res.send('Invoice does not exists please enter a valid Id')
                        })
                    }
                    else if(trx && trx.status === 'pending')
                        res.send('Please pass the user who started transaction')
                    
                    else if(trx)
                        res.send('Invoice is not in pending state cannot be changed')
                    
                    else
                        res.send('Invoice does not exists please enter a valid Id')
                })
            }
            else if(trxId)
                res.send('please add amount body param');
            else
                res.send('trxId is missing')
        })

    //GET ALL USERS
        app.get('/users',(req,res)=>{
            User.find({}).then((response)=>{
                res.send(response)
            })
        })

    //ADD a user
        app.post('/users',async(req,res)=>{
        const {name,userName}=req.body;
        if(name && userName)
        {
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
                    res.send(err.message);
                })
        }
        else if(name)
            res.send('name body param missing')
        else 
            res.send('userName param missing')
    })
}
