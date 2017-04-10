var mongo = require('mongodb');
var jsonfile = require('jsonfile')
var file = 'jsonData.json'
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
var objectId=mongo.ObjectId;
var MongoClient = mongo.MongoClient;
var database_url="mongodb://admin:nljtmvmkhk@ds157549.mlab.com:57549/blog_website";
var nodemailer = require('nodemailer');
exports.topBlog=function(req,res){
  MongoClient.connect(database_url,function(err, db) {
      db.collection('blogs', function(err, collection) {
        if(err){
            res.send({status:0});
            console.log("Error in topBlog function "+err);
        }
        else {
          collection.findOne({}, function(err, item) {
              if (err) {
                 console.log("Error in topBlog function "+err);
                  res.send({status:0});

              } else{
                  res.send({status:1,blog:item});
              };
              
          });
        }

      });
       db.close();
    });
}

exports.topBlogs=function(req,res){
  MongoClient.connect(database_url,function(err, db) {
      db.collection('blogs', function(err, collection) {
        if(err){
            res.send({status:0});
            console.log("Error in topBlog function "+err);
        }
        else {
          collection.find({}).limit(3).sort('date', -1).toArray(function(err, items) {
              if (err) {
                 console.log("Error in topBlog function "+err);
                  res.send({status:0});

              } else{
                  res.send({status:1,blog:items});
			  //console.log({blog:items});
              }
              
          });
        }
      });
       db.close();
    });
}



exports.addFromJsonData = function(){

  jsonfile.readFile(file, function(err, obj) {
    MongoClient.connect(database_url,function(err, db) {
      if(err){
        console.log("Error coccurres in db "+error);
      }
      else{
        obj.forEach(function(object) {
         object.date=new Date();
           db.collection('blogs', function(err, collection) {
            collection.insert(object, {safe:true}, function(err, result) {
               if (err) {
                   res.send({'error':'An error has occurred'});
               } else {
                   console.log('Success: ' + JSON.stringify(result[0]));
                   //res.send(result[0]);
               }
             });
           });
          }); 
        db.close();
      }
   });
  });
}

exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving blog: ' + id);
    MongoClient.connect(database_url,function(err, db) {
      db.collection('blogs', function(err, collection) {
        if(err){
            res.send("here");
            //console.log(err);
        }
        else {
          collection.findOne({_id:objectId(id)}, function(err, item) {
            //console.log(item);
              res.send(item);
          });
        }

      });
       db.close();
    });
};
exports.findByTag = function(req, res) {
    var tag = req.params.tag;
    var num=Number(req.params.num);
    console.log('Retrieving  tag: ' + tag);
    MongoClient.connect(database_url,function(err, db) {
      db.collection('blogs', function(err, collection) {
        if(err){
            res.send("here");
            console.log(err);
        }
        else {
          collection.find({tag:tag}).sort('date', -1).skip(num).limit(10).toArray(function(err, items) {
              res.send(items);
			  //console.log(items);
          });
        }
      });
       db.close();
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

exports.adminBlogs=function(req,res){
  if(req.session.id){
    let user={};
    usertype(req.session.id,function(user){
      if(user.type==="writer"){
          getUserBlogs(user.id,function(blogs){
        res.send(blogs);
            
          });
      }else if(user.type==="admin"){
          getAllBlogs(function(blogs){
        res.send(blogs);
            
          });
      }
      else{
        res.send();
      }
    });
  }else{
    res.send("Sorry You are mot logged in");
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
    MongoClient.connect(database_url,function(err, db) {
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
                              console.log(err);
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
    });  
};

exports.suggestionRecieve=function(req,res){
  const name=req.body.name;
  const email=req.body.email;
  const subject=req.body.subject;
  const msg=req.body.msg;
  const mailCompose="Name: "+name+"\n Email: "+email+"\n"+msg;
  mailer('blogwebsite2302@gmail.com',mailCompose,subject);
  res.redirect('/');
}

exports.findAll = function(req, res) {
   var num=Number(req.params.num);
   MongoClient.connect(database_url,function(err, db) {
     console.log("Connected successfully to server");
     db.collection('blogs', function(err, collection) {
        if(err){
          console.log(err);
        }
        else{
          collection.find({}).sort('date', -1).skip(num).limit(10).toArray(function(err, items) {
            res.send(items);
          }); 
        }
      });
    //console.log(req.params);
      db.close();
  });
   
    
};


exports.newsletterSignup = function(req,res){
  var user=req.body;
   MongoClient.connect(database_url,function(err, db) {

      db.collection('signups', function(err, collection) {

          collection.insert(user, {safe:true}, function(err, result) {
              if (err) {
                  res.send({'error':'An error has occurred'});
              } else {
                var inserted_id=result.insertedIds[0];
                  console.log('Success: ' + JSON.stringify(inserted_id));
                  res.send("Success");
              }
          });
      });
       db.close();
    });
}


exports.addblog = function(req, res) {
    var blog = req.body;
    blog.date=new Date()/*.getDate()*/;
    console.log('Adding blog: ' + JSON.stringify(blog));
    MongoClient.connect(database_url,function(err, db) {

      db.collection('blogs', function(err, collection) {

          collection.insert(blog, {safe:true}, function(err, result) {
              if (err) {
                  res.send({'error':'An error has occurred'});
              } else {
                var inserted_id=result.insertedIds[0];
                  console.log('Success: ' + JSON.stringify(inserted_id));
                  sendMailForNewPost(inserted_id,"Feedcob")
                  res.send(inserted_id);
              }
          });
      });
       db.close();
    });
}

exports.updateBlog = function(req, res) {
    var id = req.params.id;
    var blog = req.body;
    MongoClient.connect(database_url,function(err, db) {
       if(err){
          console.log("err1"+err);
        }
      db.collection('blogs', function(err1, collection) {
        if(err1){
          console.log("err1"+err1);
        }
          collection.update({_id:objectId(id)}, blog, {safe:true}, function(err, result) {
              if (err) {
                  console.log('Error updating blog: ' + err);
                  res.send({'error':'An error has occurred'});
              } else {
                  console.log('' + result + ' document(s) updated');
                  res.send(blog);
              }
          });
      });
       db.close();
    });
}

exports.deleteblog = function(req, res) {
    var id = req.params.id;
    console.log('Deleting blog: ' + id);
    let session_id=req.session.id;
    usertype(session_id,function(user){
      if(user.type=="admin"){
         MongoClient.connect(database_url,function(err, db) {
         console.log("Connected successfully to server");
         db.collection('blogs', function(err, collection) {
            collection.remove({'_id':objectId(id)}, {safe:true}, function(err, result) {
                if (err) {
                    res.send({'error':'An error has occurred - ' + err});
                } else {
                    console.log('' + result + ' document(s) deleted');
                    res.send("Post Deleted");
                }
            });
          });
           db.close();
        });
      }
      else{
        console.log("Not authorzed to delete");
        res.send("Not Authorized");
      }
    }); 
    
}


exports.editPost=function(req,res){
  let post_id=req.params.id;
  let session_id=req.session.id;
  usertype(session_id,function(user){
    getBlogById(post_id,function(blog){
      
      if(blog && ( blog.author.id.toString()==user.id || user.type=="admin")){
        //console.log("Blog Here");
        //console.log(blog)
        res.send(blog);
      }
      else{
        res.send("Not Authorized");
      }
    });
  });

}


exports.authorDashboard = function(req,res){
  if(req.session.id){
     var author_id=req.session.id;
     MongoClient.connect(database_url,function(err, db) {
     console.log("Connected successfully to server");
       db.collection('blogs', function(err, collection) {
           collection.find({'author.id':author_id}).toArray(function(err, items) {
              if(err){
                console.log(err);
                 res.send({status:0})
              }
              else{
                console.log(items);
                res.send({status:1,blogs:items});
              }
             
          });
        });
        db.close();
      });
    }
    else{
      res.send({status:0})
    }
}


exports.blogSearch = function(req,res){
  var text=req.params.searchText;
  MongoClient.connect(database_url,function(err, db) {
     console.log("Connected successfully to server");
     db.collection('blogs', function(err, collection) {
        if(err){
          console.log(err);
        }
        else{
          collection.find({$text:{$search:text}}).toArray(function(err, items) {
            res.send(items);
          }); 
        }
      });
    //console.log(req.params);
      db.close();
  });
}

function usertype(session_id,callback){
  var return_obj={};
  MongoClient.connect(database_url,function(err, db) {
      db.collection('users', function(err, collection) {
        if(err){
            return;
        }
        else {
          collection.find({_id:objectId(session_id)}).limit(1).toArray(function(err, item) {
           // console.log(item);
              callback({id:item[0]._id,type:item[0].type});
          });
        }
      });
       db.close();
    });
}

function getBlogById(blogid,callback){
    MongoClient.connect(database_url,function(err, db) {
      db.collection('blogs', function(err, collection) {
        if(err){
            return("here");
            //console.log(err);
        }
        else {
          collection.findOne({_id:objectId(blogid)}, function(err, item) {
            //console.log(item);
              callback(item);
          });
        }

      });
       db.close();
    });
};
function getAllBlogs(callback){
   MongoClient.connect(database_url,function(err, db) {
      db.collection('blogs', function(err, collection) {
        if(err){
            return;
        }
        else {
          collection.find({}).sort('date', -1).toArray(function(err, items) {
            console.log(items);
              callback(items);
          });
        }
      });
       db.close();
    });
}
function getUserBlogs(userid,callback){
   MongoClient.connect(database_url,function(err, db) {
      db.collection('blogs', function(err, collection) {
        if(err){
            return;
        }
        else {
          collection.find({"author.id":userid.toString()}).toArray(function(err, items) {
            console.log(items);
              callback(items);
          });
        }
      });
       db.close();
    });
}
function sendMailForNewPost(id,title){
   const registration_link='http://feedcop.com/post.html?id='+id;
  const mailText='<h3>Hello Friend</h3>'+
  '<p>Here is link to our new blog post : <a href="'+registration_link+'">'+title+'</a></p>';
  MongoClient.connect(database_url,function(err, db) {
      db.collection('signups', function(err, collection) {
        if(err){
            return;
        }
        else {
          collection.find({}).toArray(function(err, items) {
            for(item of items){
              mailer(item.email,mailText,'New blog post in feedcob');
            }
              
          });
        }
      });
       db.close();
    });
 
  
}
function mailer(email,text,sub){
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'blogwebsite2302@gmail.com', // Your email id
      pass: 'sahirblog2302' // Your password
    }
  });
  
  var mailOptions = {
    from: 'blogwebsite2302@gmail.com', // sender address
    to: email, // list of receivers
    subject: sub, // Subject line
    html: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
  };
  transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
        
    }else{
        console.log('Message sent: ' + info.response);
    };
  });
}