

module.exports = function (app, member) {

    app.get('/', function (req, res, next) {
 
        res.render('index', {});
    });
    app.post('/login.do', function (req, res, next) {
        if (req.body.pw == "yerin!23") {
            member.logon(req);
            res.redirect("/main.do");
        } else {

            res.redirect("/");
        }
    });
    app.get('/logout.do', function (req, res, next) {
        member.logoff(req);
        res.redirect("/");
    });
    app.get('/main.do', function (req, res, next) {
        if (!member.handleLogin(req, res)) {
            return;
        }
        res.render('main', {});
    });


}