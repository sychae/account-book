var BankBook = require("../models/bankBook");
var Card = require("../models/card");
var categories = require("../models/category").categories;

var InOut = require("../models/inout");
var log = require("../fstapp/log");

var util = require("../fstapp/util");

var mongoose = require('mongoose');

module.exports = function (app, member) {

    app.get('/inout/', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }
		var ObjectId = mongoose.Types.ObjectId; 

		var reqry = req.query;

		var page = util.nteInt(reqry.page, 1);
		if(page<1) page = 1;
		reqry.page = page;



		var query = {
			status:{$gt:0}
		};
		if(reqry.category) query.category = reqry.category;

		var inorout = reqry.inorout;
		var equality = reqry.equality;
		var ninout =  util.nteInt(reqry.inout, 0);
		if (inorout && inorout != "" && ninout > 0) {
			if(equality=="lte")
				query[inorout] = {$lte:ninout, $gt:0}
			else if(equality=="gte")
				query[inorout] = {$gte:ninout}
			else
				query[inorout] = ninout;
		}

		var sdate = new Date(req.query.sdate);
		var edate = new Date(req.query.edate);

		if (sdate != 'Invalid Date' && edate != 'Invalid Date') {
			sdate.setHours(0);
			sdate.setMinutes(0);
			sdate.setSeconds(0);
			edate.setHours(23);
			edate.setMinutes(59);
			edate.setSeconds(59);

			query.issueDate = {$gte:sdate, $lte:edate};
		}

		
		if (reqry.payType=="card-checkcard") {
			query.isImmediate = false;
		} else if (reqry.payType=="bankbook+checkcard") {
			query.isImmediate = true;
		}
		var options = {
			sort : {issueDate:-1, regDate:-1}
		,	lean:     true
		,	page:	page
		,	limit:    200
		}

		/*
		var query_sum = {};
		query_sum.category = {$ne:"통장간 이제"};
		*/

		log.debug("inout query", query);
		var aggr = InOut.aggregate(
			[
				{	$match : {
						$and : [ query
/*
						,	{category : {$ne:"통장간 이체"}} 
						,	{category : {$ne:"이월"}} 
*/
						]
					}
				}
			,	{	$project:{
						in : "$in"
					
					,	out : {$cond: [ { $eq: [ "$isImmediate", true] }, "$out", 0 ]}
					,	out_card : {$cond: [ { $eq: [ "$isImmediate", false] }, "$out", 0 ]}
					,	return_card : {$cond: [ { $eq: [ "$category","카드대금"] }, "$out", 0 ]}
					,	in_trans : {$cond: [ { $eq: [ "$category", "통장간 이체"] }, "$in", 0 ]}
					,	out_trans : {$cond: [ { $eq: [ "$category", "통장간 이체"] }, "$out", 0 ]}
					,	in_forward : {$cond: [ { $eq: [ "$category", "이월"] }, "$in", 0 ]}
					,	out_forward : {$cond: [ { $eq: [ "$category", "이월"] }, "$out", 0 ]}
					}
				}
			,	{	$group: {
						_id : null
					,	in : {$sum : "$in"}
					,	out : {$sum : "$out"}
					,	out_card : {$sum : "$out_card"}
					,	return_card : {$sum : "$return_card"}
					,	in_trans : {$sum : "$in_trans"}
					,	out_trans : {$sum : "$out_trans"}
					,	in_forward : {$sum : "$in_forward"}
					,	out_forward : {$sum : "$out_forward"}
					}
				}
			]
		,	function(err, sum){
				if(sum.length<1) sum[0] = {in : 0, out : 0};

				InOut.paginate(query, options).then(function (result) {
					log.debug(query, sum, result.total , result.page, result.pages);
						BankBook.find(function (err, bankBooks) {
							Card.find(function (err, cards) {
									
								res.render('inout/index', {util:util, _query:reqry, _result: result, _sum:sum[0], _bankBooks: bankBooks, _cards: cards, _categories: categories });
							});
						});
				});
			}
		);
		/*
        InOut.find()
            .where('status').gt(0)
            .sort('issueDate')
            .exec(function (err, inouts) {

        });
		*/
    });
	app.get('/inout/classfy.do', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }
		var sdate = new Date(req.query.sdate);
		var edate = new Date(req.query.edate);

//		console.log("aaaaaaaaa");
//		log.debug("/inout/classfy.do", req.query, sdate);
		if(sdate!='Invalid Date' && edate != 'Invalid Date'){
			sdate.setHours(0);
			sdate.setMinutes(0);
			sdate.setSeconds(0);
			edate.setHours(23);
			edate.setMinutes(59);
			edate.setSeconds(59);
			var query = {};
			query.status = {$gt:0};
			query.issueDate = {$gte:sdate, $lte:edate};
			log.debug("**>/inout/classfy.do",  query);
			InOut.aggregate(
				[
					{	$match : query }
				,	{	$project:{
							category : "$category"
						,	in : "$in"
						,	out : {$cond: [ { $eq: [ "$isImmediate", true] }, "$out", 0 ]}
						,	out_card : {$cond: [ { $eq: [ "$isImmediate", false] }, "$out", 0 ]}
						}
					}
				
				,	{	$group: {
							_id : "$category"
						,	in : {$sum : "$in"}
						,	out : {$sum : "$out"}
						,	out_card : {$sum : "$out_card"}
						}
					}
				,	{ "$sort" : { _id : 1} }
				]
			,	function (err, results) {
					
					res.render('inout/classfy', {util:util, query:req.query, categories : results});
				}
			);
		} else {
			res.render('inout/classfy', {util:util, query:req.query, categories : []});
		}

		
	});

	function updateBankbookById(id, plus, callBack) {
		BankBook.findById(
			id
		,	function (err, bankbook) {
				if (err){
					callBack.call(null, err);
					return;
				}
				log.debug("bankbook log|id="+id + "|deposit="+bankbook.deposit + "|plus=" + plus);
				bankbook.deposit = bankbook.deposit + plus;
				bankbook.save();

				callBack.call(null, null);
			}
		);
	}
	function updateBankbook(inout, isDeleted, callBack) {
		var plus = (isDeleted?-1:1)*(inout.in - inout.out);
		if (inout.isImmediate && inout.category!="이월") {
			updateBankbookById(inout.bankbook, plus, callBack);	
		} else {
			callBack.call(null, null);	
		}
	};

    app.post('/inout/save_prc.do', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }
        var inoutID = req.body.objid;
       
        if (inoutID && inoutID != "") {
            InOut.findByIdAndUpdate(inoutID, req.body, function (err, inout) {
                if (err){
					log.error(err);
					throw(err);
				}
				log.debug("updated IN Out", inout.payType, inout.in, inout.out);
                res.json(inout);
            });
        } else {
			log.debug("inout|insert req.body=>", req.body);

			var inoutScm = new InOut(req.body);
			
            inoutScm.save(function (err, inout) {
                if (err){
					log.error(err);
					throw(err);
				}
				log.debug("inout|insert", inout.payType, inout.in, inout.out);
				updateBankbook(
					inout
				,	false
				,	function (err) {
						if (err){
							log.error(err);
							throw(err);
						}
						res.json(inout);
					}
				);
            });
        }
    });

    app.post('/inout/delete_prc.do', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }
        var inoutID = req.body._id;
        log.debug("delete inout|id=" + inoutID);

        if (inoutID && inoutID != "") {
            InOut.findByIdAndUpdate(inoutID, { $set: {status:0} }, function (err, inout) {
                if (err){
					log.error(err);
					throw(err);
				}

				log.debug("inout|delete", inout);
				updateBankbook(
					inout
				,	true
				,	function (err) {
						if (err){
							log.error(err);
							throw(err);
						}
						res.json(inout);
					}
				);
            });
        } else {
            var obj = {};
            obj.errcode = -1;
            obj.errmsg = "inoutID is null";
            res.json(obj);
        }

    });

}