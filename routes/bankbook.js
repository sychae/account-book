module.exports = function (app, member) {
    var cryptFields = ['number', 'deposit'];

    app.get('/bankbook/', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }

        var BankBook = require("../models/bankBook");
        BankBook.find(function (err, books) {
            if (err) return res.status(500).send({ error: 'database failure' });
            res.render('bankbook/index', { _datas: books });
        })
        
    });

    app.post('/bankbook/save_prc.do', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }
        var BankBook = require("../models/bankBook");
        var bankBookID = req.body.objid;

        if (bankBookID && bankBookID != "") {
            BankBook.update({ _id: bankBookID }, req.body, { multi: false }, function (err) {

                var obj = {};
                if (err) { 
                    obj.errcode = err.code;
                    obj.errmsg = err.errmsg;
                }
                res.json(obj);
            });

        } else {
            var bankBook = new BankBook(req.body);
            bankBook.save(function (err, bankBook) {
                var obj = {};
                if (err) {
                    try {
                        obj.errcode = err.code;
                    } catch (e) {
                        obj.errcode = 8080;
                    }
                    try {
                        obj.errmsg = err.errmsg;
                    } catch (e) {
                        obj.errmsg = "알수 없는 에러"
                    }                   
                    
                } else {
                    obj = bankBook;
                }
                res.json(obj);
            });
        }
       


        




    
    });

}