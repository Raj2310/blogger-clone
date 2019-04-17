var articles = require('./articles')

var registerModule = function (app) {
    app.post('/admin/addExternalArticle', articles.addArticle)
    app.get('/publishes/:num', articles.articles)
}

module.exports = registerModule