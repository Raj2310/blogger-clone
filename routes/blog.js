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
var moment = require('moment');
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
exports.individualPost=function(req,res){
  var id = req.params.id;
  let html="";
  const main_url="http://murmuring-fortress-10024.herokuapp.com";
  console.log('Retrieving blog: ' + id);
  MongoClient.connect(database_url,function(err, db) {
    db.collection('blogs', function(err, collection) {
      if(err){
        res.redirect("/");
        //console.log(err);
      }
      else {
        collection.findOne({_id:objectId(id)}, function(err, item) {
          //console.log(item);
          const mainPost_id=item._id;
          const mainPost_image_url="/upload/"+item._id+".jpg";
          const mainPost_title=item.title;
          const mainPost_body=item.body;
          const mainPost_date=item.date;
          const mainPost_tag=item.tag;
          html+=`
<!doctype html>
<html lang='en'>
  <head>
    <meta charset='utf-8'>
    
    
    <title>Feedcob | Posts</title>
    <link rel='icon' href='../images/logo.png' type='image/gif'>
    <meta name='description' content='GOSSIPS.TRENDING.HUMOR'>
    <meta name='author' content='Feedcob'>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <meta property='og:type'          content='website' />
    <meta property='og:title'         content='`+mainPost_title+`' />
    
    <meta property='og:image'         content='`+mainPost_image_url+`' /> 
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:site" content="@Feedcob" />
    <meta name="twitter:title" content="`+mainPost_title+`" />
    <meta name="twitter:description" content="View the post on Feedcob." />
    <meta name="twitter:image" content="`+mainPost_image_url+`" />
    <link rel='stylesheet' href='../css/bootstrap.min.css'>
    <link rel='stylesheet' href='../css/bootstrap-social.css'>
    <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css'>
    <link rel='stylesheet' href='../css/styles.css'>
  </head>
  <body>
      <div id='fb-root'></div>
    <script>(function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.8&appId=124336507997973';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));</script>
    <div class='main-outer-container container-fluid'>
      <nav class="arial-font navbar navbar-default navbar-fixed-top"">
      <div class="container-fluid">
        <!-- Brand and toggle get grouped for better mobile display -->
        <div class="navbar-header">
        <a class="navbar-brand no-padding" href="/">
          <img alt="Brand" class="logo-image " src="../images/logo.png">
        </a>
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
         <!--  <a class="navbar-brand" href="#">Brand</a> -->
        </div>

        <!-- Collect the nav links, forms, and other content for toggling -->
        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul class="nav navbar-nav">
          <!-- <li><a href="/">Home</a></li> -->
            <li><a href="/?tag=trend_feed" class="text-uppercase reduce-padding-right">TrendFeed</a></li>
            <li><a href="/?tag=gossip" class="text-uppercase reduce-padding-right">Gossips</a></li>
            <li><a href="/?tag=this_is_desi" class="text-uppercase reduce-padding-right">DesiFeed</a></li>
             <li><a href="/?tag=hera_pheri" class="text-uppercase reduce-padding-right">HeraPheri</a></li>
            <li><a href="/?tag=wtf_i_go" class="text-uppercase reduce-padding-right">FeedMore</a></li>
            <li><a href="../publish.html" class="text-uppercase reduce-padding-right">FeedTales</a></li>
            
          </ul>
          <div class="navbar-form navbar-left">
            <div class="form-group">
              <input type="text" class="form-control" id="searchBar" placeholder="Search">
            </div>
            <a id="searchBtn" class="btn btn-default">Go</a>
          </div>
          <ul class="nav navbar-nav navbar-right">

            
            <li><a href="https://www.facebook.com/Feedcob-766691663508464/" target="_blank"><img src="../images/nfb.png" class="nav-icon-image"></span></a></li>
            <li><a href="https://twitter.com/Feedcobofficial" target="_blank"><img src="../images/ntt.png"class="nav-icon-image"></span></a></li>
            <li><a href="https://plus.google.com/u/2/102020403779099888425" target="_blank"><img src="../images/ngp.png" class="nav-icon-image"></a></li>
            <li><a href="https://www.instagram.com/feedcob/" target="_blank"><img src="../images/nig.png" class="nav-icon-image"></a></li>

            
          </ul>
        </div><!-- /.navbar-collapse -->
    </div><!-- /.container-fluid -->
    </nav>
      <!--<div class="floating-share visible-xs">
        
       
        <a href='http://www.facebook.com/sharer/sharer.php?u=`+main_url+`/post/`+mainPost_id+`'><img src="../images/facebook-share-mobile.jpg"/></a>
        <a href="http://twitter.com/share?text=New post On Feedcob &url=`+main_url+`/post/`+mainPost_id+`
" role='button' ><img src="../images/twitter-share-mobile.jpg"/></a>
        <a href='http://pinterest.com/pin/create/button/?url=`+main_url+`/post/`+mainPost_id+`
              &media=`+main_url+`/upload/`+mainPost_id+`.jpg&description=`+mainPost_title+`'><img src="../images/pinterest-share-mobile.jpg"/></a>
        <a href='whatsapp://send?text='`+main_url+`/post/`+mainPost_id+`' data-action='share/whatsapp/share' class="whatsapp-share"><img src="../images/whatsapp-share-mobile.jpg"/></a>

        
      </div>-->
    
        
      
            <div class='col-md-8'>
              <img src='../images/heroFeedcob.png' class='banner'>
              
            </div>
            <div class="col-sm-4">
          <div class="signup-section alert alert-dismissable row">
		  <center>
			<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
            <div class="upper-form">
			<center>
              <h3>
                SIGNUP TO OUR NEWSLETTER
              </h3>
			  </center>
              <center><div class="comic-font white">
                Get weekly stories & more
              </div></center>
              
                <center><div class="comic-font white inyourmailbox">
                  IN YOUR MAILBOX!
				  </div>
                </center>
              
              <form class="input-group" method='post' action='/newsletterSignup' id='newsletterForm'>
                  <input type="email" class="form-control" placeholder="Enter your email" name='email' id="submail" aria-describedby="basic-addon2">
                  <span class="input-group-addon feedme-button" id="basic-addon2" onClick='submitNewsletterRequest()'>Feedme</span>
              </form>
			  <br>
			  <div class="alert alert-success alert-dismissable fade in " id="inner-message">
			<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>
			<strong>Thank you!</strong> You are now registered to us.
			</div>
            </div>
            
			</center>
          </div>
		  
        </div>
          
        </div>  
        <h1><center><div id='postTitle'>`+mainPost_title+`</div></center></h1>
		<center>
        <!-- Go to www.addthis.com/dashboard to customize your tools --> <div class="addthis_inline_share_toolbox"></div>
		<center>
		<br>
        <img class='img-responsive ' alt='Responsive image' src="`+mainPost_image_url+`" id='mainPostImage' onerror="this.onerror=null;this.src='https://placehold.it/800x400'" >  
        <div class="mainPostContent ">
          <div class=" col-md-12  col-lg-12 col-sm-12  col-xs-12">
            <p id='postBody '>`
              +mainPost_body+`
            </p>
          </div>
        </div>
        <center>
          <!-- Go to www.addthis.com/dashboard to customize your tools --> <div class="addthis_inline_share_toolbox"></div>
        </center>
      

      <br/>
      <br/>
      <hr class='below-editor-pick'/>
      <div class='hero-content  below'>

      <div class='main-outer-container below'>
        <div id="suggestedPosts">
        <h2><center><span class='label label-default'>Similar Readings</span></center></h2>
        </div>
        <a href='/blogs.html' class='btn btn-success pull-right space-bottom-20' >See All Posts</a>
      </div>

    </div>
	
	<div class="main-outer-container container-fluid" style="border-top-width:0px">

    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">
          
          <center>GOSSIPS.TRENDING.HUMOR</center>
          <div>
            <center>
            <a href="https://www.facebook.com/Feedcob-766691663508464/" target="_blank"><i class="fa fa-facebook-square fa-2x" aria-hidden="true"></i></a>
            <a href="https://twitter.com/Feedcobofficial" target="_blank"><i class="fa fa-twitter-square fa-2x" aria-hidden="true"></i></a>
			<a href="https://plus.google.com/u/2/102020403779099888425" target="_blank"><i class="fa fa-google-plus fa-2x" aria-hidden="true"></i></a>
			<a href="https://www.instagram.com/feedcob/" target="_blank"><i class="fa fa-instagram fa-2x" aria-hidden="true"></i></a>
            </center>
          <div>
          <div>
            <center>
			<a href="aboutus.html">About Us</a>
			<a href="contactus.html">Contact Us</a>
			<a href="advertise.html">Advertise</a>
			<a href="privacypolicy.html">Privacy Policy</a>
			</center>
          </div>
        </div>
         <div class="col-lg-4 col-md-3 col-sm-2 col-xs-12">
          <div class="fb-like" data-href="https://www.feedcob.com/" data-layout="standard" data-action="like" data-size="small" data-show-faces="true" data-share="true"></div>
        </div>
      </div>
    </div>
  </div>
  </div>
  </div>
    <script src='../js/jquery.js'></script>
    <script src='../js/bootstrap.min.js'></script>
    <script src="../js/test.js"></script>
    <script type='text/javascript' src='../js/moment.js'></script>
    <script async src='//platform.twitter.com/widgets.js' charset='utf-8'></script>
	<!-- Go to www.addthis.com/dashboard to customize your tools --> <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-58f9b697c911d569"></script> 
  </body>
</html>`;
          res.send(html);
        });
      }
    });
    db.close();
  });
 /* if(req.params.id==="1"){
    res.redirect("/");
  }else{
    res.send(req.params.id);
  }*/
}

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
  const mailCompose="Name: "+name+"<br> Email: "+email+"<br>Message: "+msg+"";
  mailer('publicdesk@feedcob.com',mailCompose,subject);
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
          collection.find({}).sort('date', -1).skip(num).limit(12).toArray(function(err, items) {
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
				  var mailText='<!DOCTYPE html>'+
'<html>'+
  '<head>'+
    '<style>'+
      '@media only screen and (max-device-width: 480px) {'+
        '/* mobile-specific CSS styles go here */'+
      '}'+
    '</style>'+
  '</head>'+
  '<body>'+
    '<p><img src="https://image.ibb.co/g14fgQ/subscribe.png" alt="Subscription successful" width="443" height="626" style="display: block; margin-left: auto; margin-right: auto;" /></p>'+
    '<p></p>'+
    '<p><span style="font-size: 14pt;"><em><strong>Website -</strong></em></span></p>'+
    '<p><span style="font-size: 12pt;"><em><strong><a href="https://feedcob.com/" target="_blank">Feedcob</a></strong></em></span></p>'+
    '<p><span style="font-size: 14pt;"><em><strong></strong></em></span></p>'+
    '<p><span style="font-size: 14pt;"><em><strong><span style="font-family: Georgia, palatino, '+"times new roman"+', times, serif;">Follow Us On -</span></strong></em></span></p>'+
    '<p><span style="font-size: 12pt;"><em><strong><a href="https://www.facebook.com/Feedcob-766691663508464/" target="_blank">Facebook </a></strong></em></span></p>'+
    '<p><span style="font-size: 12pt;"><em><strong><a href="https://twitter.com/Feedcobofficial" target="_blank">Twitter</a></strong></em></span></p>'+
    '<p><span style="font-size: 12pt;"><em><strong><a href="https://plus.google.com/u/2/102020403779099888425" target="_blank">Google-Plus</a></strong></em></span></p>'+
    '<p><span style="font-size: 12pt;"><em><strong><a href="https://www.instagram.com/feedcob/" target="_blank">Instagram</a></strong></em></span></p>'+
    '<p><em><strong></strong></em></p>'+
    '<p><em><strong></strong></em><em><strong>-- Feedcob Team</strong></em></p>'+
  '</body>'+
'</html>';
				  mailer(user.email,mailText,'Feedcob | Thank you ! Successful subscription');
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
                  if(blog.sendmail==1){
					sendMailForNewPost(inserted_id,""+blog.title+"");  
				  }
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
    blog.date=new Date()/*.getDate()*/;
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
   const registration_link='http://feedcob.com/post.html?id='+id;
  const mailText='<h3>Hello Friend ,</h3>'+
  '<p>Greetings from Feedcob<p>Check out our new post here : <a href="'+registration_link+'">'+title+'</a></p></p>';
  MongoClient.connect(database_url,function(err, db) {
      db.collection('signups', function(err, collection) {
        if(err){
            return;
        }
        else {
          collection.find({}).toArray(function(err, items) {
            for(item of items){
              mailer(item.email,mailText,'Feedcob | New Post');
            }
              
          });
        }
      });
       db.close();
    });
 
  
}
function mailer(email,text,sub){
  var transporter = nodemailer.createTransport({
    service: 'Godaddy',
    auth: {
      user: 'publicdesk@feedcob.com', // Your email id
      pass: 'S1H9A0Y3@17' // Your password
    }
  });
  
  var mailOptions = {
    from: 'publicdesk@feedcob.com', // sender address
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