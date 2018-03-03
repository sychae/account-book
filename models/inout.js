var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var categories = require("./category").categories;

var log = require("../fstapp/log");
var paginate = require("mongoose-paginate");

var inOutSchema = new Schema({
	in: { type: Number, required: true }
,	out: { type: Number, required: true }
,	name: { type: String, required: true }
,	category: { type: String, enum: categories, required: true }
,	payType: { type: String, enum: ["card", "bankbook", "card_ija"], required: true }
,	card: { type: Schema.ObjectId, ref: 'Card', required: function () { return this.payType == "card" || this.payType == "card_ija"; } }
,	bankbook: { type: Schema.ObjectId, ref: 'BankBook', required: true }
,	isImmediate: { type: Boolean, required: true, default: true } 
,	balance: { type: Number, required: true, default:1 }
,	installment: { type: Number, required: true }
,	desc: { type: String, required: false }
,	issueDate: { type: Date, required: true }
,	status: { type: Number, required: true, default : 1 }
,	regDate: { type: Date, required: true, default: Date.now }
,	modDate: Date
});
inOutSchema.plugin(paginate);
/*
inOutSchema.pre('save', function(next) {
	log.debug("inOutSchema, pre, save", this);
	next();
});

inOutSchema.post('save', function(doc) {
	log.debug("inOutSchema, post, save", this==doc, doc);
});

inOutSchema.pre('update', function(next) {
	log.debug("inOutSchema, pre, update", this);
	next();
});

inOutSchema.post('update', function(doc) {
	log.debug("inOutSchema, post, update", this==doc, doc);
});

inOutSchema.pre('findOneAndUpdate', function(next) {
	log.debug("inOutSchema, pre, findOneAndUpdate", this);
	next();
});

inOutSchema.post('findOneAndUpdate', function(doc) {
	log.debug("inOutSchema, post, findOneAndUpdate", this==doc, doc);
});
*/


module.exports = mongoose.model('InOut', inOutSchema);