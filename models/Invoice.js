const mongoose=require('mongoose');
const InvoiceSchema=new mongoose.Schema({
    amount:{
        type:Number,
        required:true,
    },
    _sentBy:{type:mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    _receivedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User', required:true},
    createdAt:Date
    
})
mongoose.model('invoices',InvoiceSchema);