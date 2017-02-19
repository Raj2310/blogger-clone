var express = require('express'),
    wine = require('./routes/wine');
var bodyParser     =        require("body-parser");
var app = express();
var cookieParser = require('cookie-parser')
var expressSession = require('express-session');
var cookieSession = require('cookie-session')
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var fileUpload = require('express-fileupload');
//app.configure(function () {
  //  app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
  //  app.use(express.bodyParser());
//});
app.use(fileUpload());
//app.use(cookieParser());   
app.set('trust proxy', 1) // trust first proxy
 
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*'/*'http://localhost:3000'*/);

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});
/*app.get('/setcookie', function (req, res) {
    res.cookie('name', 'express', {signed: true}).send('cookie set');
  //console.log('Cookies: ', req.cookies)
});
app.get('/getcookie',function(req,res){
      console.log('Cookies: ', req.signedCookies['name'])

});*/
/*app.get('/login', function(req, res){
  var html="";
  if (req.session.id) {
    html += '<br>Your username from your session is: ' + req.session.userName;
  }
  else{
            html = '<form action="/login_attempt" method="post">' +
             'Your name: <input type="text" name="userName"><br>' +
             '<button type="submit">Submit</button>' +
             '</form>';  
  }
  res.send(html);
});*/
app.post('/logout', function(req, res){
    req.session = null;
    res.send("logged out");
});
app.post('/login_attempt', function(req, res){
  console.log(req.session);
  if (req.session.id) {
       res.send({
        status:2
       });
  }
  else{
              var email=req.body.email;
               var password=req.body.password;
              // console.log(req.body);
              db.collection('users', function(err, collection) {
                if(err){
                    res.send({status:0,msg:'An error occured'});
                    console.log(err);
                }
                else {
                  console.log(email+" "+password);
                  collection.findOne({email:email,password:password}, function(err, item) {
                      if(item){
                          req.session.email = item.email;
                          req.session.password =item.password;
                         req.session.firstName =item.firstName;
                               req.session.lastName =item.lastName;
                               req.session.id =item._id;
                          res.send({status:1});
                      }
                      else{
                          res.send({status:0,msg:"Email and password Do no match"});
                      }
                  });
                }
              });
  }
});
app.get('/dashboard', function(req, res){
  var html="";
  if (req.session.userName) {
   
    var html = '<h2>Hello '+req.session.userName+'</h2>';  
             res.send(html);
  }
  else{
             res.redirect('/login');
  }
  
});
app.post('logout',function(req,res){
  req.session.destroy(function(err) {
    // cannot access session here
  })
});
app.get('/winesAll/:num', wine.findAll);
/*app.post('/wines',function(request,response){
var query1=request.body.var1;
var query2=request.body.var2;
console.log(request.body.fname);
});*/
app.get('/byTag/:tag/:num',wine.findByTag);
app.get('/wines/:id/', wine.findById);
//app.get('/addFromJsonData',wine.addFromJsonData);
app.post('/wines', wine.addWine);
app.post('/signup',wine.newUserSignup);
app.put('/wines/:id', wine.updateWine);
app.get('/userinfo',wine.sendUserInfo);
app.delete('/wines/:id', wine.deleteWine);
app.post('/upload', function(req, res) {
  var sampleFile;
 
  if (!req.files) {
    res.send('No files were uploaded.');
    return;
  }
 
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file 
  sampleFile = req.files.sampleFile;
 console.log(req);
  // Use the mv() method to place the file somewhere on your server 
  var fileName=req.body.fileUploadName;
  sampleFile.mv('public/upload/'+fileName+'.jpg', function(err) {
    if (err) {
      res.status(500).send(err);
      console.log("There was upload error"+err);
    }
    else {
      res.send('File uploaded!');
    }
  });
});
app.listen(3000);
console.log('Listening on port 3000...');
