exports.handleLogin = function (req, res) {
    if (req.session.isLogon != "y") {
        res.redirect("/");
        return false;
    } else
        return true;
};
exports.logon = function (req) {
    req.session.isLogon = "y";
};
exports.logoff = function (req) {
    req.session.destroy();
};