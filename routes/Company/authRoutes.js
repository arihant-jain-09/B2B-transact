// const passport = require('passport');
const mongoose=require('mongoose');
const Company=mongoose.model('companies');

module.exports=(app)=>{

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
