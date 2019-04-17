var blog = require('./blog')
const uploadFile = require('./uploadFile')

var registerModule = function (app) {
    app.get('/top-blog', blog.topBlog)
    app.get('/blogsAll/:num', blog.findAll)
    app.get('/byTag/:tag/:num', blog.findByTag)
    app.get('/blog/:id/', blog.findById)
    app.get('/topBlogs', blog.topBlogs)
    app.get('/blog-search/:searchText', blog.blogSearch)
    app.post('/blog', blog.addblog)
    app.post('/admin/updateBlog/:id', blog.updateBlog)
    app.post('/admin/deleteblog/:id', blog.deleteblog)
    app.post('/newsletterSignup', blog.newsletterSignup)
    app.post('/signup', blog.newUserSignup)
    app.get('/userinfo', blog.sendUserInfo)
    app.get('/post/:id', blog.individualPost)
    app.get('/dashboard', blog.authorDashboard)
    app.get('/adminBlogs', blog.adminBlogs)
    app.get('/admin/editPost/:id', blog.editPost)
    app.post('/suggestionRecieve', blog.suggestionRecieve)
    app.post('/upload', uploadFile)
}

module.exports = registerModule