var mongoose = require('mongoose');
//var encrypt = require('mongoose-field-encryption').fieldEncryption;
var Schema = mongoose.Schema;

var bankbookSchema = new Schema({
	bank: { type: String, required: true }
,	number: { type: String, required: true, unique: true }
,	name: { type: String, required: true }
,	deposit: { type: Number, required: true }
,	isUse: { type: Boolean, required: true, default: true } 
,	desc: String
,	issueDate: Date
,	regDate: { type: Date, required: true, default: Date.now }
,	modDate: Date
});

module.exports = mongoose.model('BankBook', bankbookSchema);