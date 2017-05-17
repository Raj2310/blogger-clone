let ArticleParser =require('article-parser');
let mongo = require('mongodb');
let Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
let objectId=mongo.ObjectId;
let MongoClient = mongo.MongoClient;
let database_url="mongodb://admin:nljtmvmkhk@ds157549.mlab.com:57549/blog_website";


exports.addArticle=function(req,res){
	let url=req.body.url;
	ArticleParser.extract(url).then((article) => {
	  MongoClient.connect(database_url,function(err, db) {
     	console.log("Connected successfully to server");
       db.collection('publishes', function(err, collection) {
           collection.insert(article,{safe:true},function(err, result) {
              if(err){
                console.log(err);
                 res.send({status:0})
              }
              else{
               res.send({status:1});
              }
          });
        });
        db.close();
      });
	}).catch((err) => {
	  console.log(err);
	});
}


exports.articles=function(req,res) {
	 var num=Number(req.params.num);
   MongoClient.connect(database_url,function(err, db) {
     console.log("Connected successfully to server");
     db.collection('publishes', function(err, collection) {
        if(err){
          console.log(err);
        }
        else{
          collection.find({}).skip(num).limit(10).sort({"publishedTime": 1}).toArray(function(err, items) {
            res.send(items);
          });
        }
      });
    //console.log(req.params);
      db.close();
  });
}
