var login = require('./login.js')
var logout = require('./logout.js')

var registerModule = function (app) {
    app.post('/logout', logout)
    app.post('/login_attempt', login)
}

module.exports = registerModule