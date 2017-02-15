var express = require('express'),
    wine = require('./routes/wine');
var bodyParser     =        require("body-parser");
var app = express();
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var fileUpload = require('express-fileupload');
//app.configure(function () {
  //  app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
  //  app.use(express.bodyParser());
//});
app.use(fileUpload());

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
app.get('/wines', wine.findAll);
/*app.post('/wines',function(request,response){
var query1=request.body.var1;
var query2=request.body.var2;
console.log(request.body.fname);
});*/
app.get('/byTag/:tag',wine.findByTag);
app.get('/wines/:id', wine.findById);
//app.get('/addFromJsonData',wine.addFromJsonData);
app.post('/wines', wine.addWine);
app.put('/wines/:id', wine.updateWine);
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
  var fileName=req.fileUploadName;
  sampleFile.mv('upload/'+fileName+'.jpg', function(err) {
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
