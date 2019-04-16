var cookieSession = require('cookie-session')
var fileUpload = require('express-fileupload')
var bodyParser = require("body-parser")
var app = require('../../../app')

app.set('port', (process.env.PORT || 50000))
app.set('trust proxy', 1) // trust first proxy
app.use(cookieSession({
	name: 'session',
	keys: ['key1', 'key2']
}))
app.use(fileUpload())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(function (req, res, next) {

	// Website you wish to allow to connect
	res.setHeader('Access-Control-Allow-Origin', '*'/*'http://localhost:3000'*/)

	// Request methods you wish to allow
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')

	// Request headers you wish to allow
	res.setHeader('Access-Control-Allow-Headers', '*'/*'X-Requested-With,content-type'*/)

	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	res.setHeader('Access-Control-Allow-Credentials', true)

	// Pass to next layer of middleware
	next()
})
app.listen(app.get('port'))
console.log('Listening on port ', app.get('port'))
