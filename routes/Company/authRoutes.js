const mongoose=require('mongoose');
const Company=mongoose.model('companies');
const User=mongoose.model('users');

module.exports=(app)=>{

        //Add a user to this company by sending id
        app.patch('/companies/:id',(req,res)=>{
          const {user_id}=req.body;
          const company_id=req.params.id;
          User.findOne({_id:user_id}).then((user)=>{
            if(user){
              Company.exists({users:{ $elemMatch: {id:user_id} }}).then((result)=>{
                if(result) res.send("user already exists in company");
                else{
                  Company.updateOne({_id:company_id},{$push: {
                    users:{id:user._id}
                  }},(err,results)=>{
                    if(err) res.send(err.message);
                    else res.send("added user to this company")
                  })
                }
              })
            }
            else res.send("user does not exist in our database")
          })
        })


        //GET all the companies
        app.get('/companies',(req,res)=>{
            Company.find({}).then((response)=>{
                res.send(response)
            })
        })

        //Create a company
        app.post('/companies',async(req,res)=>{
        const {company_name}=req.body;

        //check if a company exits with a same name only unique names are allowed
        Company.find({"company_name":company_name})
            .then(async(resExists)=>{
            if(resExists && resExists.length>0){
                res.send({"messsage":'Company with that name already exists'})
            }
            else{
                const company=new Company({
                    company_name,
                    createdAt: Date.now()
                });
                try {
                    await company.save();
                    res.send('company created')
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
