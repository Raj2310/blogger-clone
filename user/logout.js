exports.logout = function (req, res) {
    req.session = null
    res.send("logged out")
}