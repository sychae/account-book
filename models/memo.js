var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var memoSchema = new Schema({
    title: { type: String, required: true }
,   type : { type: String, required: true }
,	desc : { type: String, required: false} 
,   isLunar: { type: Boolean, required: true, default: false }
,   repeat: { type: String, required: true, default: "no" }
,	startDate: Date
,   endDate: Date
,   completeDate : Date
,	regDate: { type: Date, required: true, default: Date.now }  
,	modDate: Date
});

module.exports = mongoose.model('Memo', memoSchema);


module.exports.memoTypes = [
	"할일"
,   "기념일"
];