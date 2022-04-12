const mongoose=require('mongoose');
const Invoice=mongoose.model('invoices');
const User=mongoose.model('users');
const Company=mongoose.model('companies');

module.exports=(app)=>{

        app.patch('/invoices/:id',(req,res)=>{
          const invoice_id=req.params.id;
          const {status}=req.body;
          if (!mongoose.Types.ObjectId.isValid(invoice_id)) {
            return res.status(400).send("Invalid Invoice Id");
          }
          if(status!=='pending' || status !== 'approved')
            return res.status(400).send("Enter a valid status")

          Invoice.findByIdAndUpdate(invoice_id,{status})
            .then((response)=>{
              res.send("changed status")
            })
            .catch((err)=>res.send(err.message))
          // Invoice.findOne({_id:invoice_id}).then((results)=>{
          //   if(results){
          //     Invoice.updateOne({_id:invoice_id},{status}).then((result)=>{
          //       console.log(result);
          //       res.send(result)
          //     })
          //   }
          //   else{
          //     res.send("invoice does not exits in our database")
          //   }
          // })
        })

        app.get('/invoices',(req,res)=>{
          Invoice.find({}).then((response)=>{
                res.send(response)
            })
        })
        app.post('/invoices',async(req,res)=>{
          const {amount,_sentBy,_receivedBy,_UserId}=req.body;
          Promise.all([
            Company.findOne({ _id: _sentBy }),
            Company.findOne({ _id: _receivedBy}),
            User.findOne({ _id: _UserId})
          ]).then( async([ sender, receiver,user ]) => {
            if(sender && receiver && user){
              const invoice=new Invoice({
                amount,
                _sentBy:{_id:sender._id,company_name:sender.company_name},
                _receivedBy:{_id:receiver._id,company_name:receiver.company_name},
                _UserId:{_id:user._id,name:user.name},
                status:"pending",
                createdAt: Date.now()
              });
              try {
                  await invoice.save();
              } catch (error) {
                  res.status(404).send(error.message);
              }
              try {
                Promise.all([
                  Company.updateOne({_id:sender._id},{$push: {
                    invoices:{id:invoice._id}
                  }}),
                  Company.updateOne({_id:receiver._id},{$push: {
                    invoices:{id:invoice._id}
                  }}),
                  ])
                  .then(([ senderCompany, receiverCompany])=>{
                    // console.log(senderCompany);
                    // console.log(receiverCompany);
                    res.send({
                      'transactionId':invoice.id,
                      'companies':{
                        'sender':sender.company_name,
                        'receiver':receiver.company_name
                      },
                      'transacted By':user.name
                    })
                  })
                  .catch((err)=>{
                    res.send(err.message);
                  })

              } catch (error) {
                res.send(err.message);
              }
            }
            else if(sender && user){
              res.send('message: receiver does not exits in our database')
            }
            else if(receiver && user){
              res.send('message: sender does not exits in our database')
            }
            else{
              res.send('message: User who is transacting does not exists')
            }
          });
    })
}
