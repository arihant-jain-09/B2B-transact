const mongoose=require('mongoose');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    userName:{
        type:String,
        required:true
    },
    _company:{_id:{type: mongoose.Schema.Types.ObjectId},company_name:String},
    createdAt:Date
    
})
mongoose.model('users',userSchema);