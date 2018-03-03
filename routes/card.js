var BankBook = require("../models/bankBook");
var Card = require("../models/card");
var categories = require("../models/category").categories;

var InOut = require("../models/inout");
var log = require("../fstapp/log");

var util = require("../fstapp/util");

var mongoose = require('mongoose');

module.exports = function (app, member) {
    app.get('/card/', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }

       
        Card.find(function (err, cards) {
            if (err) return res.status(500).send({ error: 'database failure' });
            var BankBook = require("../models/bankBook");

            BankBook.find(function (err, bankBooks) {
                res.render('card/index', { _datas: cards, _bankBooks: bankBooks });
            });
        });

    });

	 app.get('/card/use.do', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }
		Card
			.find({isCheckCard:false})
			.populate('bankbook')
			.exec(function (err, cards) {
				res.render('card/use', {_query:req.query, _util:util, _cards:cards});
			});
	});
	 app.get('/card/use_search.do', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }
		var cardID = req.query.card;
		var startDay = util.nteInt(req.query.startDay, 0);
		var yyyy = util.nteInt(req.query.yyyy, 0);
		var mm = util.nteInt(req.query.mm, 0);

		var temp = new Date(yyyy, mm-2, startDay);
		

		InOut.find({ 
				card: cardID
			,	status : 1
			,	issueDate : {$lt : temp}
			,	$where : "this.issueDate >=  new Date(" + yyyy + ", " + (mm - 2) + " - this.installment, " + startDay + ") "
			})
			.sort({issueDate:1})
			.exec(function(err, results){
				if (err) {
					log.debug("error", temp.getFullYear(), temp.getMonth()  + 1, temp.getDate());
					res.json([]);
				}else{
					log.debug("111------------->", "length=", results.length, temp.getFullYear(), temp.getMonth()  + 1, temp.getDate());
					res.json(results);
				}
			});

		//res.json(req.query);
		/*
		Card.findOne({
			_id : req.query.card
		}).exec(function (err, card) {

			res.json(card);
		});
		 */
	});

    app.post('/card/save_prc.do', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }
        var cardID = req.body.objid;


        if (cardID && cardID != "") {
            Card.update({ _id: cardID }, req.body, { multi: false }, function (err) {

                var obj = {};
                if (err) {
                    obj.errcode = err.code;
                    obj.errmsg = err.errmsg;
                } else {
                    obj._id = cardID;

                }
                res.json(obj);
            });

        } else {
            var card = new Card(req.body);
            card.save(function (err, card) {
                var obj;
                if (err) {
                    obj = {};
                    obj.errcode = err.code;
                    obj.errmsg = err.errmsg;
                } else {
                    obj = card;
                }
                res.json(obj);
            });
        }

    });

}