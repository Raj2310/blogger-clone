var mongo = require('mongodb');
var jsonfile = require('jsonfile')
var file = 'jsonData.json'
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
var objectId=mongo.ObjectId;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('blogdb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'blogdb' database");
        db.collection('blogs', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'blogs' collection doesn't exist. Creating it with sample data...");
              //  populateDB();
            }
        });
        db.collection('blogs').ensureIndex( { url: 1 }, { url: true } )
    }
});

exports.addFromJsonData = function(){

  jsonfile.readFile(file, function(err, obj) {
    obj.forEach(function(object) {
     object.date=new Date();
     db.collection('blogs', function(err, collection) {
      collection.insert(object, {safe:true}, function(err, result) {
         if (err) {
             //res.send({'error':'An error has occurred'});
         } else {
             //console.log('Success: ' + JSON.stringify(result[0]));
             //res.send(result[0]);
         }
       });
     });
    });
  //  console.dir(obj)
  });
}
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving blog: ' + id);
    db.collection('blogs', function(err, collection) {
      if(err){
          res.send("here");
          //console.log(err);
      }
      else {
        collection.findOne({_id:objectId(id)}, function(err, item) {
          console.log(item);
            res.send(item);
        });
      }

    });
};
exports.findByTag = function(req, res) {
    var tag = req.params.tag;
    var num=Number(req.params.num);
    console.log('Retrieving  tag: ' + tag);
    db.collection('blogs', function(err, collection) {
      if(err){
          res.send("here");
          console.log(err);
      }
      else {
        collection.find({tag:tag}).skip(num).limit(5).toArray(function(err, items) {
            res.send(items);
        });
      }

    });
};
exports.addNewblog = function(req,res){
   console.log(req.query.color);
   console.log(req.query.handle);
};


exports.sendUserInfo = function(req,res){
    if(req.session.id){
     res.send({status:1,firstName:req.session.firstName,lastName:req.session.lastName,id:req.session.id});   
    }
    else{
      res.send({status:0})
    }

}








exports.newUserSignup = function(req,res){
   var user=req.body;
   var signUpKey=user.signUpKey;
   var email=user.email;
   var firstName=user.firstName;
   var lastName=user.lastName;
   var password=user.password;
  // var confirmPassword=user.confirmPassword;
  if(req.session.id){
     res.send({status:2});
     return;
  }
   var age=user.age;
    db.collection('users', function(err, collection) {
      if(err){
          res.send({status:0,msg:'An error has occurred'});
          console.log(err);
      }
      else {
        collection.findOne({email: email},{_id:1},function(err,result) {
         if (err) {
                console.log(err);
                res.send({status:0,msg:'An error has occurred'});
            } else {
                if(result){
                    console.log('Success: ' + result._id);
                    res.send({status:0,msg:"Email id is already registered , try a new one"});
                  }
                  else{
                     //Add new User
                      if(signUpKey==="Iig20022017"){
                        collection.insert({firstName:firstName,lastName:lastName,email:email,password:password,age:age}, {safe:true}, function(err, result) {
                          if (err) {
                              res.send({'error':'An error has occurred'});
                          } else {
                              //console.log('Success: ' + JSON.stringify(result[0]));
                              req.session.email = email;
                               req.session.password =password;
                               req.session.firstName =firstName;
                               req.session.lastName =lastName;
                               req.session.id =result._id;
                              res.send({status:1});
                          }
                        });
                      }
                      else{
                         res.send({status:0,msg:'Wrong Confirmation Code'});
                      }
                      
                  }
                }
              
        });
      }
    });
   
};

exports.findAll = function(req, res) {
   var num=Number(req.params.num);
   console.log(req.params);
    db.collection('blogs', function(err, collection) {
        collection.find({}).skip(num).limit(5).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addblog = function(req, res) {
    var blog = req.body;
    blog.date=new Date()/*.getDate()*/;
    console.log('Adding blog: ' + JSON.stringify(blog));

    db.collection('blogs', function(err, collection) {

        collection.insert(blog, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });

res.send(req.body);
}

exports.updateblog = function(req, res) {
    var id = /*"587b53314e78291b00b3bca4";*/req.params.id;
    var blog = req.body;
    //console.log('Updating blog: ' + id);
    blog._id=new mongo.ObjectID(id);
    //console.log(JSON.stringify(blog));
    db.collection('blogs', function(err, collection) {
        collection.update({_id:new mongo.ObjectID(id)}, blog, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating blog: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(blog);
            }
        });
    });
}

exports.deleteblog = function(req, res) {
    var id = req.params.id;
    console.log('Deleting blog: ' + id);
    db.collection('blogs', function(err, collection) {
        collection.remove({'_id':new mongo.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}


/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.