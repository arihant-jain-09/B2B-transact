const mongoose=require('mongoose');
const InvoiceSchema=new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    status:{
        type:String
    },   
    _sentBy:{type:mongoose.Schema.Types.ObjectId,ref:'Company', required:true},
    _receivedBy:{type:mongoose.Schema.Types.ObjectId,ref:'Company', required:true},
    _UserId:{type:mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    createdAt:Date
})
mongoose.model('invoices',InvoiceSchema);