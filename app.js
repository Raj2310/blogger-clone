var express = require('express')
var mongo = require('mongodb')
var blog = require('./routes/blog')
var articles = require('./routes/articles')
const database_url = "mongodb://admin:saajansaajan@ds139072.mlab.com:39072/testing"

var app = express()
var MongoClient = mongo.MongoClient;
app.use(express.static('public'));
app.post('/logout', function(req, res){
    req.session = null;
    res.send("logged out");
})
app.post('/login_attempt', function(req, res){
  console.log(req.session);
  if (req.session.id) {
       res.send({
        status:2
	   })
  }
  else{
              var email=req.body.email;
               var password=req.body.password;
              // console.log(req.body);
              MongoClient.connect(database_url,function(err, db) {
                db.collection('users', function(err, collection) {
                  if(err){
					  res.send({status: 0, msg: 'An error occured'})
					  console.log(err)
                  }
                  else {
                    console.log(email+" "+password);
                    collection.findOne({email:email,password:password}, function(err, item) {
                        if(item){
							req.session.email = item.email
							req.session.password = item.password
							req.session.firstName = item.firstName
							req.session.lastName = item.lastName
							req.session.id = item._id
							res.send({status: 1})
                        }
                        else{
							res.send({status: 0, msg: "Email and password Do no match"})
                        }
					})
                  }
				})
				  db.close()
			  })
  }
})
app.get('/top-blog', blog.topBlog)
app.get('/blogsAll/:num', blog.findAll)
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
app.post('/upload', function(req, res) {
  var sampleFile;

  if (!req.files) {
	  res.send('No files were uploaded.')
	  return
  }
	sampleFile = req.files.sampleFile
	console.log(req)
  // Use the mv() method to place the file somewhere on your server
	var fileName = req.body.fileUploadName
  sampleFile.mv('public/upload/'+fileName+'.jpg', function(err) {
    if (err) {
      res.status(500).send(err);
		console.log("There was upload error" + err)
    }
    else {
		res.send('File uploaded!')
    }
  })
})

module.exports = app