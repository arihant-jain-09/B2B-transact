const mongoose=require('mongoose');
const Invoice=mongoose.model('invoices');
const User=mongoose.model('users');

module.exports=(app)=>{

        app.get('/invoices',(req,res)=>{
          Invoice.find({}).then((response)=>{
                res.send(response)
            })
        })
        app.post('/invoices',async(req,res)=>{
          const {amount,_sentBy,_receivedBy}=req.body;

          Promise.all([
            User.find({ _id: _sentBy }),
            User.find({ _id: _receivedBy})
          ]).then( async([ sender, receiver ]) => {
            if(sender.length>0 && receiver.length>0){
              const invoice=new Invoice({
                amount,
                _sentBy:sender[0],
                _receivedBy:receiver[0],
                createdAt: Date.now()
              });
              try {
                  await invoice.save();
                  res.send(`${`invoice created with transaction Id:`}${invoice.id} sender being ${sender[0].name} and receiver is ${receiver[0].name}`)
              } catch (error) {
                  res.status(404).send(error.message);
              }
            }
            else if(sender.length>0){
              res.send('message: receiver does not exits in our database')
            }
            else{
              res.send('message: sender does not exits in our database')
            }
          });
    })
}
