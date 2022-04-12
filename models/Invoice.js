const mongoose=require('mongoose');
const InvoiceSchema=new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    status:{
        type:String
    },   
    _sentBy:{_id:{type: mongoose.Schema.Types.ObjectId},company_name:String},
    _receivedBy:{_id:{type: mongoose.Schema.Types.ObjectId},company_name:String},
    _UserId:{_id:{type: mongoose.Schema.Types.ObjectId},name:String},
    createdAt:Date
})
mongoose.model('invoices',InvoiceSchema);