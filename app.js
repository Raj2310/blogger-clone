const express = require('express')
const registerBlogModule = require('./blog/index')
const registerArticles = require('./article/index')
const registerUser = require('./user/index')
const app = express()
app.use(express.static('public'))
registerBlogModule(app)
registerArticles(app)
registerUser(app)



module.exports = app