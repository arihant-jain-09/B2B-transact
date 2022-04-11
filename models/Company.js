const mongoose=require('mongoose');
const userSchema=require('./User');
const invoiceSchema=require('./Invoice');
const companySchema=new mongoose.Schema({
    company_name:{
        type:String,
        required:true,
    },
    users:[{id:{type: mongoose.Schema.Types.ObjectId, ref: 'User'}}],
    invoices:[invoiceSchema],
    createdAt:Date
    
})
mongoose.model('companies',companySchema);