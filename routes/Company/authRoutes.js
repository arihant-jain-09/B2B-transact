const mongoose=require('mongoose');
const Company=mongoose.model('companies');
const User=mongoose.model('users');

module.exports=(app)=>{

        //Update properties based on body params
        app.patch('/companies/:id',(req,res)=>{
          const {user_id,company_name}=req.body;
          const company_id=req.params.id;
          //For adding user to a company
          if(user_id){
            User.findOne({_id:user_id}).then((user)=>{
              if(user){
                Company.exists({users:{ $elemMatch: {id:user._id} }}).then((result)=>{
                  if(result) res.send("user already exists in company");
                  else{
                    // Promise.all([
                    //   Company.updateOne({_id:company_id},{$push: {
                    //     users:{id:user._id}
                    //   }}),
                    //   User.updateOne({_id:user._id},{_companyId:company_id})
                    // ]).then( async([ company, user ]) => {
                    //   if(company.acknowledged && user.acknowledged){
                    //     res.send("added user to this company")
                    //   }
                    //   if(user.acknowledged){
                    //     res.send("user a")
                    //   }
                    // })

                    Company.updateOne({_id:company_id},{$push: {
                      users:{id:user._id}
                    }},(err,results)=>{
                      if(err) res.send(err.message);
                      else res.send("added user to this company")
                    })
                    User.updateOne({_id:user._id},{_companyId:company_id},(err,results)=>{
                      if(err)
                        res.send(err.message)
                      else res.send("changed user company Id")
                    })
                  }
                })
              }
              else res.send("user does not exist in our database")
            })
          }
          //For changing name of the company
          else if(company_name){
            Company.updateOne({_id:company_id},{company_name},(err,results)=>{
              if(err) res.send(err.message);
              else res.send("changed name of company")
            })
          }
          //Body params are invalid
          else res.send('Enter valid body params')
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
