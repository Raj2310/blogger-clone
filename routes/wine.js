var mongo = require('mongodb');
var jsonfile = require('jsonfile')
var file = 'jsonData.json'
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
var objectId=mongo.ObjectId;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('winedb', server);

db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'winedb' database");
        db.collection('wines', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'wines' collection doesn't exist. Creating it with sample data...");
              //  populateDB();
            }
        });
        db.collection('wines').ensureIndex( { url: 1 }, { url: true } )
    }
});

exports.addFromJsonData = function(){

  jsonfile.readFile(file, function(err, obj) {
    obj.forEach(function(object) {
     object.date=new Date();
     db.collection('wines', function(err, collection) {
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
    console.log('Retrieving wine: ' + id);
    db.collection('wines', function(err, collection) {
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
    var num=req.params.num;
    console.log('Retrieving  tag: ' + tag);
    db.collection('wines', function(err, collection) {
      if(err){
          res.send("here");
          console.log(err);
      }
      else {
        collection.find({tag:tag}).limit(5).toArray(function(err, items) {
            res.send(items);
        });
      }

    });
};
exports.addNewWine = function(req,res){
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
   var num=req.params.num;
    db.collection('wines', function(err, collection) {
        collection.find().limit(5).toArray(function(err, items) {
            res.send(items);
        });
    });
};

exports.addWine = function(req, res) {
    var wine = req.body;
    wine.date=new Date()/*.getDate()*/;
    console.log('Adding wine: ' + JSON.stringify(wine));

    db.collection('wines', function(err, collection) {

        collection.insert(wine, {safe:true}, function(err, result) {
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

exports.updateWine = function(req, res) {
    var id = /*"587b53314e78291b00b3bca4";*/req.params.id;
    var wine = req.body;
    //console.log('Updating wine: ' + id);
    wine._id=new mongo.ObjectID(id);
    //console.log(JSON.stringify(wine));
    db.collection('wines', function(err, collection) {
        collection.update({_id:new mongo.ObjectID(id)}, wine, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating wine: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(wine);
            }
        });
    });
}

exports.deleteWine = function(req, res) {
    var id = req.params.id;
    console.log('Deleting wine: ' + id);
    db.collection('wines', function(err, collection) {
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
