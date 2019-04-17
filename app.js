const express = require('express')
const registerModule = require('./inf/module-register')
const blogModule = require('./blog/index')
const blog = require('./blog/blog')
const articles = require('./article/articles')
const loginAttempt = require('./user/login')
const logoutAttempt = require('./user/logout')
const uploadFile = require('./blog/uploadFile')
const app = express()
app.use(express.static('public'))
app.post('/logout', logoutAttempt.logout)
app.post('/login_attempt', loginAttempt.login)
app.get('/top-blog', blog.topBlog)
//app.get('/blogsAll/:num', blog.findAll)
registerModule(app,[blogModule])
app.get('/publishes/:num', articles.articles)
app.get('/byTag/:tag/:num', blog.findByTag)
app.get('/blog/:id/', blog.findById)
app.get('/topBlogs', blog.topBlogs)
app.get('/blog-search/:searchText', blog.blogSearch)
app.post('/blog', blog.addblog)
app.post('/admin/updateBlog/:id', blog.updateBlog)
app.post('/admin/deleteblog/:id', blog.deleteblog)
app.post('/admin/addExternalArticle', articles.addArticle)
app.post('/newsletterSignup', blog.newsletterSignup)
app.post('/signup', blog.newUserSignup)
app.get('/userinfo', blog.sendUserInfo)
app.get('/post/:id', blog.individualPost)
app.get('/dashboard', blog.authorDashboard)
app.get('/adminBlogs', blog.adminBlogs)
app.get('/admin/editPost/:id', blog.editPost)
app.post('/suggestionRecieve', blog.suggestionRecieve)
app.post('/upload',uploadFile)

module.exports = app