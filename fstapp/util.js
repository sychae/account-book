exports.nteInt = function (val, def) {
	if(typeof(val)=="undefined" || val==null) return def;
	else if(typeof(val)=="number") return ~~val;
	
	var ret = parseInt(val);
	if(isNaN(ret)) ret=def;
	return ret;
}
exports.toCurrency = function(n){
	if(typeof(n)=="number") return n.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

		
	else return 0;
}

exports.toDateStr = function(date) {
	var yyyy = date.getFullYear();
	var mm = date.getMonth() + 1;
	var date = date.getDate();
	if(mm<10) mm='0' + mm;
	if(date<10) date = '0' + date;

	return yyyy + "-" + mm + "-" + date;
}