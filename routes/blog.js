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
          collection.find({tag:tag}).sort('date', -1).skip(num).limit(12).toArray(function(err, items) {
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
          const mainPost_image_url=item.mainImage;
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

    <meta name='author' content='Feedcob'>
    <meta charset='utf-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1'>
    <meta property="og:site_name" content="feedcob.com"/>
    <meta property='og:type'          content='article' />
    <meta property='og:title'         content='`+mainPost_title+`' />
    <meta property='og:image'         content='`+mainPost_image_url+`' />
    <meta property='og:image:width '  content='600px'/>
    <meta property='og:image:height '  content='315px'/>
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
        <div class="mainPostContent container">
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

	<div class="main-outer-container container-fluid bottomdiv_postpage" style="border-top-width:0px">

    <div class="container-fluid">
      <div class="row">
        <div class="col-lg-4 col-lg-offset-4 col-md-6 col-md-offset-3 col-sm-8 col-sm-offset-2 col-xs-12">

          <center>GOSSIPS.TRENDING.HUMOUR</center>
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
	<script>
	function submitNewsletterRequest(){
      var frm = $('#newsletterForm');
        $.ajax({
            type: frm.attr('method'),
            url: frm.attr('action'),
            data: frm.serialize(),
            success: function (data) {
			   setTimeout(function(){ $("#inner-message").hide(); }, 3000);
            }
        });
		$("#inner-message").show();
		$("#submail").val('');
    }
	</script>
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
				  console.log(err);
                  res.send({'error':'An error has occurred'});
              } else {
                var inserted_id=result.insertedIds[0];
                  console.log('Success: ' + JSON.stringify(inserted_id));
                  res.send("Success");
				  var mailText='<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie-browser" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>'+
'    <!--[if gte mso 9]><xml>'+
'     <o:OfficeDocumentSettings>'+
'      <o:AllowPNG/>'+
'      <o:PixelsPerInch>96</o:PixelsPerInch>'+
'     </o:OfficeDocumentSettings>'+
'    </xml><![endif]-->'+
'    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">'+
'    <meta name="viewport" content="width=device-width">'+
'    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->'+
'    <title>Template Base</title>'+
'    '+
'    '+
'    <style type="text/css" id="media-query">'+
'      body {'+
'  margin: 0;'+
'  padding: 0; }'+
''+
'table, tr, td {'+
'  vertical-align: top;'+
'  border-collapse: collapse; }'+
''+
'.ie-browser table, .mso-container table {'+
'  table-layout: fixed; }'+
''+
'* {'+
'  line-height: inherit; }'+
''+
'a[x-apple-data-detectors=true] {'+
'  color: inherit !important;'+
'  text-decoration: none !important; }'+
''+
'[owa] .img-container div, [owa] .img-container button {'+
'  display: block !important; }'+
''+
'[owa] .fullwidth button {'+
'  width: 100% !important; }'+
''+
'.ie-browser .col, [owa] .block-grid .col {'+
'  display: table-cell;'+
'  float: none !important;'+
'  vertical-align: top; }'+
''+
'.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {'+
'  width: 500px !important; }'+
''+
'.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {'+
'  line-height: 100%; }'+
''+
'.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {'+
'  width: 164px !important; }'+
''+
'.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {'+
'  width: 328px !important; }'+
''+
'.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {'+
'  width: 250px !important; }'+
''+
'.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {'+
'  width: 166px !important; }'+
''+
'.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {'+
'  width: 125px !important; }'+
''+
'.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {'+
'  width: 100px !important; }'+
''+
'.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {'+
'  width: 83px !important; }'+
''+
'.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {'+
'  width: 71px !important; }'+
''+
'.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {'+
'  width: 62px !important; }'+
''+
'.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {'+
'  width: 55px !important; }'+
''+
'.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {'+
'  width: 50px !important; }'+
''+
'.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {'+
'  width: 45px !important; }'+
''+
'.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {'+
'  width: 41px !important; }'+
''+
'@media only screen and (min-width: 520px) {'+
'  .block-grid {'+
'    width: 500px !important; }'+
'  .block-grid .col {'+
'    display: table-cell;'+
'    Float: none !important;'+
'    vertical-align: top; }'+
'    .block-grid .col.num12 {'+
'      width: 500px !important; }'+
'  .block-grid.mixed-two-up .col.num4 {'+
'    width: 164px !important; }'+
'  .block-grid.mixed-two-up .col.num8 {'+
'    width: 328px !important; }'+
'  .block-grid.two-up .col {'+
'    width: 250px !important; }'+
'  .block-grid.three-up .col {'+
'    width: 166px !important; }'+
'  .block-grid.four-up .col {'+
'    width: 125px !important; }'+
'  .block-grid.five-up .col {'+
'    width: 100px !important; }'+
'  .block-grid.six-up .col {'+
'    width: 83px !important; }'+
'  .block-grid.seven-up .col {'+
'    width: 71px !important; }'+
'  .block-grid.eight-up .col {'+
'    width: 62px !important; }'+
'  .block-grid.nine-up .col {'+
'    width: 55px !important; }'+
'  .block-grid.ten-up .col {'+
'    width: 50px !important; }'+
'  .block-grid.eleven-up .col {'+
'    width: 45px !important; }'+
'  .block-grid.twelve-up .col {'+
'    width: 41px !important; } }'+
''+
'@media (max-width: 520px) {'+
'  .block-grid, .col {'+
'    min-width: 320px !important;'+
'    max-width: 100% !important; }'+
'  .block-grid {'+
'    width: calc(100% - 40px) !important; }'+
'  .col {'+
'    width: 100% !important; }'+
'    .col > div {'+
'      margin: 0 auto; }'+
'  img.fullwidth {'+
'    max-width: 100% !important; } }'+
''+
'    </style>'+
'</head>'+
'<!--[if mso]>'+
'<body class="mso-container" style="background-color:#FFFFFF;">'+
'<![endif]-->'+
'<!--[if !mso]><!-->'+
'<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF">'+
'<!--<![endif]-->'+
'  <div class="nl-container" style="min-width: 320px;Margin: 0 auto;background-color: #FFFFFF">'+
'    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #FFFFFF;"><![endif]-->'+
''+
'    <div style="background-color:transparent;">'+
'      <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">'+
'        <div style="border-collapse: collapse;display: table;width: 100%;">'+
'          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->'+
''+
'              <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->'+
'            <div class="col num12" style="min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;">'+
'              <div style="background-color: transparent; width: 100% !important;">'+
'              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->'+
''+
'                  '+
'                    <div align="center" class="img-container center fullwidth" style="padding-right: 0px;  padding-left: 0px;">'+
'<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->'+
'  <a href="https://feedcob.com/" target="_blank">'+
'    <img class="center fullwidth" align="center" border="0" src="https://image.ibb.co/k4oFy5/subscribe3.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 500px" width="500">'+
'  </a>'+
'<!--[if mso]></td></tr></table><![endif]-->'+
'</div>'+
''+
'                  '+
'              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->'+
'              </div>'+
'            </div>'+
'          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->'+
'        </div>'+
'      </div>'+
'    </div>    <div style="background-color:transparent;">'+
'      <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">'+
'        <div style="border-collapse: collapse;display: table;width: 100%;">'+
'          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->'+
''+
'              <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->'+
'            <div class="col num12" style="min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;">'+
'              <div style="background-color: transparent; width: 100% !important;">'+
'              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->'+
''+
'                  '+
'                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 30px; padding-bottom: 10px;"><![endif]-->'+
'<div style="padding-right: 10px; padding-left: 10px; padding-top: 30px; padding-bottom: 10px;">'+
'	<div style="font-size:12px;line-height:14px;text-align:center;color:#555555;font-family:\'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Geneva, Verdana, sans-serif;"><p style="margin: 0;font-size: 12px;line-height: 14px;text-align: center"><span style="font-size: 18px; line-height: 21px;">Feedcob Team</span></p></div>'+
'</div>'+
'<!--[if mso]></td></tr></table><![endif]-->'+
''+
'                  '+
'              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->'+
'              </div>'+
'            </div>'+
'          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->'+
'        </div>'+
'      </div>'+
'    </div>    <div style="background-color:#ffffff;">'+
'      <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">'+
'        <div style="border-collapse: collapse;display: table;width: 100%;">'+
'          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->'+
''+
'              <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:30px; padding-bottom:30px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->'+
'            <div class="col num12" style="min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;">'+
'              <div style="background-color: transparent; width: 100% !important;">'+
'              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:30px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->'+
''+
'                  '+
'                    '+
'<div align="center" style="Margin-right: 15px; Margin-left: 15px; Margin-bottom: 15px;">'+
'  <div style="line-height:15px;font-size:1px"> </div>'+
'  <div style="display: table; max-width:213px;">'+
'  <!--[if (mso)|(IE)]><table width="213" align="center" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:213px;"><tr><td width="52" style="width:52px;" valign="top"><![endif]-->'+
'    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 20px">'+
'      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
'        <a href="https://www.facebook.com/Feedcob-766691663508464/" title="Facebook" target="_blank">'+
'          <img src="https://image.ibb.co/kt2p85/nfb.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
'        </a>'+
'      <div style="line-height:5px;font-size:1px"> </div>'+
'      </td></tr>'+
'    </tbody></table>'+
'      <!--[if (mso)|(IE)]></td><td width="52" style="width:52px;" valign="top"><![endif]-->'+
'    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 20px">'+
'      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
'        <a href="https://twitter.com/Feedcobofficial" title="Twitter" target="_blank">'+
'          <img src="https://image.ibb.co/hUjQgQ/ntt.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
'        </a>'+
'      <div style="line-height:5px;font-size:1px"> </div>'+
'      </td></tr>'+
'    </tbody></table>'+
'      <!--[if (mso)|(IE)]></td><td width="52" style="width:52px;" valign="top"><![endif]-->'+
'    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 20px">'+
'      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
'        <a href="https://plus.google.com/u/2/102020403779099888425" title="Google+" target="_blank">'+
'          <img src="https://image.ibb.co/mXZ2T5/ngp.png" alt="Google+" title="Google+" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
'        </a>'+
'      <div style="line-height:5px;font-size:1px"> </div>'+
'      </td></tr>'+
'    </tbody></table>'+
'      <!--[if (mso)|(IE)]></td><td width="52" style="width:52px;" valign="top"><![endif]-->'+
'    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0">'+
'      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
'        <a href="https://www.instagram.com/feedcob/" title="Instagram" target="_blank">'+
'          <img src="https://image.ibb.co/jPhZak/nig.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
'        </a>'+
'      <div style="line-height:5px;font-size:1px"> </div>'+
'      </td></tr>'+
'    </tbody></table>'+
'    <!--[if (mso)|(IE)]></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td> </td></tr></table><![endif]-->'+
'  </div>'+
'</div>'+
''+
'                  '+
'                  '+
'                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 10px;"><![endif]-->'+
'<div style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 10px;">'+
'	<div style="font-size:12px;line-height:18px;color:#959595;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 18px;text-align: center"><span style="font-size: 16px; line-height: 24px;">GOSSIPS. TRENDING. HUMOUR</span></p></div>'+
'</div>'+
'<!--[if mso]></td></tr></table><![endif]-->'+
''+
'                  '+
'              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->'+
'              </div>'+
'            </div>'+
'          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->'+
'        </div>'+
'      </div>'+
'    </div>   <!--[if (mso)|(IE)]></td></tr></table><![endif]-->'+
'  </div>'+
''+
''+
'</body></html>';


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
   const registration_link='http://feedcob.com/post/'+id;
  const mailText='<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><!--[if IE]><html xmlns="http://www.w3.org/1999/xhtml" class="ie-browser" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><![endif]--><!--[if !IE]><!--><html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>'+
'    <!--[if gte mso 9]><xml>'+
'     <o:OfficeDocumentSettings>'+
'      <o:AllowPNG/>'+
'      <o:PixelsPerInch>96</o:PixelsPerInch>'+
'     </o:OfficeDocumentSettings>'+
'    </xml><![endif]-->'+
'    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">'+
'    <meta name="viewport" content="width=device-width">'+
'    <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->'+
'    <title>Template Base</title>'+
'    '+
'    '+
'    <style type="text/css" id="media-query">'+
'      body {'+
'  margin: 0;'+
'  padding: 0; }'+
''+
'table, tr, td {'+
'  vertical-align: top;'+
'  border-collapse: collapse; }'+
''+
'.ie-browser table, .mso-container table {'+
'  table-layout: fixed; }'+
''+
'* {'+
'  line-height: inherit; }'+
''+
'a[x-apple-data-detectors=true] {'+
'  color: inherit !important;'+
'  text-decoration: none !important; }'+
''+
'[owa] .img-container div, [owa] .img-container button {'+
'  display: block !important; }'+
''+
'[owa] .fullwidth button {'+
'  width: 100% !important; }'+
''+
'.ie-browser .col, [owa] .block-grid .col {'+
'  display: table-cell;'+
'  float: none !important;'+
'  vertical-align: top; }'+
''+
'.ie-browser .num12, .ie-browser .block-grid, [owa] .num12, [owa] .block-grid {'+
'  width: 500px !important; }'+
''+
'.ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {'+
'  line-height: 100%; }'+
''+
'.ie-browser .mixed-two-up .num4, [owa] .mixed-two-up .num4 {'+
'  width: 164px !important; }'+
''+
'.ie-browser .mixed-two-up .num8, [owa] .mixed-two-up .num8 {'+
'  width: 328px !important; }'+
''+
'.ie-browser .block-grid.two-up .col, [owa] .block-grid.two-up .col {'+
'  width: 250px !important; }'+
''+
'.ie-browser .block-grid.three-up .col, [owa] .block-grid.three-up .col {'+
'  width: 166px !important; }'+
''+
'.ie-browser .block-grid.four-up .col, [owa] .block-grid.four-up .col {'+
'  width: 125px !important; }'+
''+
'.ie-browser .block-grid.five-up .col, [owa] .block-grid.five-up .col {'+
'  width: 100px !important; }'+
''+
'.ie-browser .block-grid.six-up .col, [owa] .block-grid.six-up .col {'+
'  width: 83px !important; }'+
''+
'.ie-browser .block-grid.seven-up .col, [owa] .block-grid.seven-up .col {'+
'  width: 71px !important; }'+
''+
'.ie-browser .block-grid.eight-up .col, [owa] .block-grid.eight-up .col {'+
'  width: 62px !important; }'+
''+
'.ie-browser .block-grid.nine-up .col, [owa] .block-grid.nine-up .col {'+
'  width: 55px !important; }'+
''+
'.ie-browser .block-grid.ten-up .col, [owa] .block-grid.ten-up .col {'+
'  width: 50px !important; }'+
''+
'.ie-browser .block-grid.eleven-up .col, [owa] .block-grid.eleven-up .col {'+
'  width: 45px !important; }'+
''+
'.ie-browser .block-grid.twelve-up .col, [owa] .block-grid.twelve-up .col {'+
'  width: 41px !important; }'+
''+
'@media only screen and (min-width: 520px) {'+
'  .block-grid {'+
'    width: 500px !important; }'+
'  .block-grid .col {'+
'    display: table-cell;'+
'    Float: none !important;'+
'    vertical-align: top; }'+
'    .block-grid .col.num12 {'+
'      width: 500px !important; }'+
'  .block-grid.mixed-two-up .col.num4 {'+
'    width: 164px !important; }'+
'  .block-grid.mixed-two-up .col.num8 {'+
'    width: 328px !important; }'+
'  .block-grid.two-up .col {'+
'    width: 250px !important; }'+
'  .block-grid.three-up .col {'+
'    width: 166px !important; }'+
'  .block-grid.four-up .col {'+
'    width: 125px !important; }'+
'  .block-grid.five-up .col {'+
'    width: 100px !important; }'+
'  .block-grid.six-up .col {'+
'    width: 83px !important; }'+
'  .block-grid.seven-up .col {'+
'    width: 71px !important; }'+
'  .block-grid.eight-up .col {'+
'    width: 62px !important; }'+
'  .block-grid.nine-up .col {'+
'    width: 55px !important; }'+
'  .block-grid.ten-up .col {'+
'    width: 50px !important; }'+
'  .block-grid.eleven-up .col {'+
'    width: 45px !important; }'+
'  .block-grid.twelve-up .col {'+
'    width: 41px !important; } }'+
''+
'@media (max-width: 520px) {'+
'  .block-grid, .col {'+
'    min-width: 320px !important;'+
'    max-width: 100% !important; }'+
'  .block-grid {'+
'    width: calc(100% - 40px) !important; }'+
'  .col {'+
'    width: 100% !important; }'+
'    .col > div {'+
'      margin: 0 auto; }'+
'  img.fullwidth {'+
'    max-width: 100% !important; } }'+
''+
'    </style>'+
'</head>'+
'<!--[if mso]>'+
'<body class="mso-container" style="background-color:#FFFFFF;">'+
'<![endif]-->'+
'<!--[if !mso]><!-->'+
'<body class="clean-body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #FFFFFF">'+
'<!--<![endif]-->'+
'  <div class="nl-container" style="min-width: 320px;Margin: 0 auto;background-color: #FFFFFF">'+
'    <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #FFFFFF;"><![endif]-->'+
''+
'    <div style="background-color:transparent;">'+
'      <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">'+
'        <div style="border-collapse: collapse;display: table;width: 100%;">'+
'          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->'+
''+
'              <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->'+
'            <div class="col num12" style="min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;">'+
'              <div style="background-color: transparent; width: 100% !important;">'+
'              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->'+
''+
'                  '+
'                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;"><![endif]-->'+
'<div style="padding-right: 10px; padding-left: 10px; padding-top: 10px; padding-bottom: 10px;">'+
'	<div style="font-size:12px;line-height:14px;color:#555555;font-family:\'Lucida Sans Unicode\', \'Lucida Grande\', \'Lucida Sans\', Geneva, Verdana, sans-serif;text-align:left;"><p style="margin: 0;font-size: 18px;line-height: 22px;text-align: center"><span style="font-size: 18px; line-height: 21px;"><span style="font-size: 18px; line-height: 21px;"><a style="color:#000;text-decoration: none;" href="'+registration_link+'" target="_blank" rel="noopener noreferrer">'+title+'</a></span></span></p></div>'+
'</div>'+
'<!--[if mso]></td></tr></table><![endif]-->'+
''+
'                  '+
'              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->'+
'              </div>'+
'            </div>'+
'          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->'+
'        </div>'+
'      </div>'+
'    </div>    <div style="background-color:transparent;">'+
'      <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">'+
'        <div style="border-collapse: collapse;display: table;width: 100%;">'+
'          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->'+
''+
'              <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->'+
'            <div class="col num12" style="min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;">'+
'              <div style="background-color: transparent; width: 100% !important;">'+
'              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->'+
''+
'                  '+
'                    <div align="center" class="img-container center fullwidth" style="padding-right: 0px;  padding-left: 0px;">'+
'<!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 0px; padding-left: 0px;" align="center"><![endif]-->'+
'  <a href="'+registration_link+'" target="_blank">'+
'    <img class="center fullwidth" align="center" border="0" src="https://image.ibb.co/fXuEak/newstory3.jpg" alt="Image" title="Image" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 500px" width="500">'+
'  </a>'+
'<!--[if mso]></td></tr></table><![endif]-->'+
'</div>'+
''+
'                  '+
'              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->'+
'              </div>'+
'            </div>'+
'          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->'+
'        </div>'+
'      </div>'+
'    </div>    <div style="background-color:transparent;">'+
'      <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">'+
'        <div style="border-collapse: collapse;display: table;width: 100%;">'+
'          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->'+
''+
'              <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:5px; padding-bottom:5px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->'+
'            <div class="col num12" style="min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;">'+
'              <div style="background-color: transparent; width: 100% !important;">'+
'              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:5px; padding-bottom:5px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->'+
''+
'                  '+
'                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 30px; padding-bottom: 10px;"><![endif]-->'+
'<div style="padding-right: 10px; padding-left: 10px; padding-top: 30px; padding-bottom: 10px;">'+
'	<div style="font-size:12px;line-height:14px;color:#555555;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 14px;text-align: center"><span style="font-size: 18px; line-height: 21px;">Feedcob Team</span></p></div>'+
'</div>'+
'<!--[if mso]></td></tr></table><![endif]-->'+
''+
'                  '+
'              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->'+
'              </div>'+
'            </div>'+
'          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->'+
'        </div>'+
'      </div>'+
'    </div>    <div style="background-color:#ffffff;">'+
'      <div style="Margin: 0 auto;min-width: 320px;max-width: 500px;width: 500px;width: calc(19000% - 98300px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;" class="block-grid ">'+
'        <div style="border-collapse: collapse;display: table;width: 100%;">'+
'          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="background-color:#ffffff;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width: 500px;"><tr class="layout-full-width" style="background-color:transparent;"><![endif]-->'+
''+
'              <!--[if (mso)|(IE)]><td align="center" width="500" style=" width:500px; padding-right: 0px; padding-left: 0px; padding-top:30px; padding-bottom:30px; border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent;" valign="top"><![endif]-->'+
'            <div class="col num12" style="min-width: 320px;max-width: 500px;width: 500px;width: calc(18000% - 89500px);background-color: transparent;">'+
'              <div style="background-color: transparent; width: 100% !important;">'+
'              <!--[if (!mso)&(!IE)]><!--><div style="border-top: 0px solid transparent; border-left: 0px solid transparent; border-bottom: 0px solid transparent; border-right: 0px solid transparent; padding-top:30px; padding-bottom:30px; padding-right: 0px; padding-left: 0px;"><!--<![endif]-->'+
''+
'                  '+
'                    '+
'<div align="center" style="Margin-right: 15px; Margin-left: 15px; Margin-bottom: 15px;">'+
'  <div style="line-height:15px;font-size:1px"> </div>'+
'  <div style="display: table; max-width:213px;">'+
'  <!--[if (mso)|(IE)]><table width="213" align="center" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:213px;"><tr><td width="52" style="width:52px;" valign="top"><![endif]-->'+
'    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 20px">'+
'      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
'        <a href="https://www.facebook.com/Feedcob-766691663508464/" title="Facebook" target="_blank">'+
'          <img src="https://image.ibb.co/kt2p85/nfb.png" alt="Facebook" title="Facebook" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
'        </a>'+
'      <div style="line-height:5px;font-size:1px"> </div>'+
'      </td></tr>'+
'    </tbody></table>'+
'      <!--[if (mso)|(IE)]></td><td width="52" style="width:52px;" valign="top"><![endif]-->'+
'    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 20px">'+
'      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
'        <a href="https://twitter.com/Feedcobofficial" title="Twitter" target="_blank">'+
'          <img src="https://image.ibb.co/hUjQgQ/ntt.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
'        </a>'+
'      <div style="line-height:5px;font-size:1px"> </div>'+
'      </td></tr>'+
'    </tbody></table>'+
'      <!--[if (mso)|(IE)]></td><td width="52" style="width:52px;" valign="top"><![endif]-->'+
'    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 20px">'+
'      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
'        <a href="https://plus.google.com/u/2/102020403779099888425" title="Google+" target="_blank">'+
'          <img src="https://image.ibb.co/mXZ2T5/ngp.png" alt="Google+" title="Google+" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
'        </a>'+
'      <div style="line-height:5px;font-size:1px"> </div>'+
'      </td></tr>'+
'    </tbody></table>'+
'      <!--[if (mso)|(IE)]></td><td width="52" style="width:52px;" valign="top"><![endif]-->'+
'    <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;Margin-right: 0">'+
'      <tbody><tr style="vertical-align: top"><td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">'+
'        <a href="https://www.instagram.com/feedcob/" title="Instagram" target="_blank">'+
'          <img src="https://image.ibb.co/jPhZak/nig.png" alt="Instagram" title="Instagram" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">'+
'        </a>'+
'      <div style="line-height:5px;font-size:1px"> </div>'+
'      </td></tr>'+
'    </tbody></table>'+
'    <!--[if (mso)|(IE)]></td></tr></table><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td> </td></tr></table><![endif]-->'+
'  </div>'+
'</div>'+
''+
'                  '+
'                  '+
'                    <!--[if mso]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 10px;"><![endif]-->'+
'<div style="padding-right: 10px; padding-left: 10px; padding-top: 15px; padding-bottom: 10px;">'+
'	<div style="font-size:12px;line-height:18px;color:#959595;font-family:Arial, \'Helvetica Neue\', Helvetica, sans-serif;text-align:left;"><p style="margin: 0;font-size: 12px;line-height: 18px;text-align: center"><span style="font-size: 16px; line-height: 24px;">GOSSIPS. TRENDING. HUMOUR</span></p></div>'+
'</div>'+
'<!--[if mso]></td></tr></table><![endif]-->'+
''+
'                  '+
'              <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->'+
'              </div>'+
'            </div>'+
'          <!--[if (mso)|(IE)]></td></tr></table></td></tr></table><![endif]-->'+
'        </div>'+
'      </div>'+
'    </div>   <!--[if (mso)|(IE)]></td></tr></table><![endif]-->'+
'  </div>'+
''+
''+
'</body></html>';


  MongoClient.connect(database_url,function(err, db) {
      db.collection('signups', function(err, collection) {
        if(err){
            return;
        }
        else {
          collection.find({}).toArray(function(err, items) {
            for(item of items){
              mailer(item.email,mailText,'Feedcob | Greetings , a New Post added. Check it out !');
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
    from: 'Feedcob.com<publicdesk@feedcob.com>', // sender address
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
