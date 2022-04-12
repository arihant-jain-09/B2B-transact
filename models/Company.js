const mongoose=require('mongoose');
const userSchema=require('./User');
const invoiceSchema=require('./Invoice');
const companySchema=new mongoose.Schema({
    company_name:{
        type:String,
        required:true,
    },
    users:[{_id:{type: mongoose.Schema.Types.ObjectId}}],
    invoices:[invoiceSchema],
    createdAt:Date
    
})
mongoose.model('companies',companySchema);