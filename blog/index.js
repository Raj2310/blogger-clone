var blog = require('./blog')

var routes = [{
    routePath: 'topBlogs',
    routeFunction : blog.topBlogs
}]

var moduleObject ={
    routes: routes
}

module.exports = moduleObject