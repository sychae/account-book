module.exports = function (app, member) {
    app.get('/memo/', function (req, res, next) {
        res.render('memo/index', {  });

    });
}