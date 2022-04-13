const mongoose=require('mongoose');
const Company=mongoose.model('companies');
const User=mongoose.model('users');

//Function to update a company name
const updateCompanyName=(company_id,company_name,callback)=>{
  Company.updateOne({_id:company_id},{company_name:company_name},(err,results)=>{
    if(err) return callback(err.message);
    else return callback("changed name of company");
  })
}

//Function to add a user to company
const addUserToCompany=(user,company_id,company_name,callback)=>{
  Company.exists({users:{ $elemMatch: {_id:user._id} }}).then((result)=>{
    if(result) return callback("user already exists in company");
    else{
      Promise.all([
        Company.updateOne({_id:company_id},{$push: {
          users:{_id:user._id,name:user.name}
        }}),
        User.updateOne({_id:user._id},{_company:{_id:company_id,name:company_name}})
      ]).then(([comp,user])=>{
        if(comp.modifiedCount ===1 && user.modifiedCount===1)
          return callback("added user and changed name of company")
        else if(comp.modifiedCount === 1)
          return callback("added user")
        else if(user.modifiedCount === 1)
          return callback("changed name of company")
        else
          return callback("nothing changed")
      })
    }
  })
  return;
}

module.exports=(app)=>{

        //Update properties based on body params
        app.patch('/companies/:id',(req,res)=>{
          const {user_id,company_name}=req.body;
          const company_id=req.params.id;
          if (!mongoose.Types.ObjectId.isValid(company_id)) {
            return res.status(400).send("Invalid company Id");
          }
          else if (user_id && !mongoose.Types.ObjectId.isValid(user_id)) {
            return res.status(400).send("Invalid user Id");
          }
          //For adding user to a company
          if(user_id && company_name){
            User.findOne({_id:user_id}).then((user)=>{
              Company.findOne({_id:company_id}).then((response)=>{
                if(user && response){
                  Promise.all([
                    addUserToCompany(user,company_id,company_name,function(result) {
                      console.log(result);
                    }),
                    updateCompanyName(company_id,company_name,function(result){
                      res.send(result);
                    })
                  ])
                }
                else if(user)
                  res.send("Enter a valid company name");
                else if(company_name)
                  res.send("Enter a valid user Id");
                else{
                  res.send("Both userId and company Name is invalid")
                }
              })
            })
          }
          else if(user_id){
            User.findOne({_id:user_id}).then((user)=>{
              if(user){
                return addUserToCompany(user,company_id,res,function(result){
                  res.send(result);
                });
              }
              else res.send("user does not exist in our database")
            })
          }
          //For changing name of the company
          else if(company_name){
            return updateCompanyName(company_id,company_name,function(result){
              res.send(result);
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
        Company.findOne({"company_name":company_name})
            .then(async(resExists)=>{
            if(resExists){
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