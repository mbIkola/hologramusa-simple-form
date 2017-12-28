const collectionName='callcentre-form-v1';


const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var investmentSchema = new Schema({
    email: String,
    fullname: String,
    phone: String,
    hearAboutUs: String,
    message: String,
    otherSource: String,
    referralSource : String,
    company: String,
    investment_low: Number,
    investment_high: Number,
    investment_paid: Number,
    is_archived : { type: Boolean, default: false },
    agreement_date: { type: Date, default: null},
    payment_date: { type: Date, default: null},
    message: String,
    notes : [String],
    amount: String,
    created_at:  { type: Date, required: true, default: Date.now },
    salesman : { type: Schema.Types.ObjectId, ref: 'User'}
}, {
    collection: collectionName ,
    timestamps : { createdAt: 'created_at_timestamp'}
});



module.exports = function(db) {
    return db.model('Investment', investmentSchema);
};
