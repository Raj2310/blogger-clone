module.exports = function (req, res) {
    req.session = null
    res.send("logged out")
}