var blog = require('./blog')

app.get()
app.get()
app.get()
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

var routes = [
    {
        routePath: '/blogsAll/:num',
        routeFunction : blog.findAll
    },
    {
        routePath: '/top-blog',
        routeFunction :  blog.topBlog
    },
    {
        routePath: '/byTag/:tag/:num',
        routeFunction : blog.findByTag
    },
    {
        routePath: '/blog/:id/',
        routeFunction :blog.findById 
    },
    {
         
        routePath: '/topBlogs',
        routeFunction :blog.topBlogs 
    },
    {
        routePath: '/blog-search/:searchText',
        routeFunction :blog.blogSearch 
    },
    {
        routePath: '',
        routeFunction : 
    },
{
    routePath: '',
    routeFunction : 
},
{
    routePath: '',
    routeFunction : 
},
{
    routePath: '',
    routeFunction : 
}]

var moduleObject ={
    routes: routes
}

module.exports = moduleObject