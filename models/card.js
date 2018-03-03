var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var cardSchema = new Schema({
	name: { type: String, required: true }
,	number: { type: String, required: true, unique: true}
,	payDay: { type: Number, required: true }
,	startDay: { type: Number, required: true }
,	bankbook: { type: Schema.ObjectId, ref: 'BankBook', required: true }
,	isUse: { type: Boolean, required: true, default: true } 
,	isCheckCard: { type: Boolean, required: true, default: false } 
,	issueDate: Date
,	desc : String
,	regDate: { type: Date, required: true, default: Date.now }  
,	modDate: Date
});

module.exports = mongoose.model('Card', cardSchema);