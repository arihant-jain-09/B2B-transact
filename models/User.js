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
    _companyName:{type:mongoose.Schema.Types.ObjectId,ref:'company'},
    createdAt:Date
    
})
mongoose.model('users',userSchema);