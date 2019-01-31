var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload = multer ({dest:'./uploads'});
var mongo = require('mongodb');

var db = require('monk')('localhost/blog');

/* GET home page. */
router.get('/add', function(req, res, next) {
    
    var categories = db.get('categories');

    categories.find({},{}, function (err,categories){
        res.render('addpost', {
            'title':'Add Post',
            'categories': categories

         });
    });
        
  
        
});

router.post('/add', upload.single('mainimage'), function(req, res, next) {
     

        var title = req.body.title;
        var category = req.body.category;
        var body = req.body.body;
        var author = req.body.author;
        var date = new Date();

        console.log (title);

        if (req.file) {

            console.log(req.file);
            var mainimage = req.file.filename;
            
        } else {
         
            console.log('no file');
            var mainimage = 'noimage.jpg';
        }


        req.checkBody('title', 'title is required').notEmpty();
        req.checkBody('body', 'body is required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {

            res.render('addpost', {
                'errors':errors  
        
              });
            
        } else {

            var posts = db.get('post');
            posts.insert({

                "title":title,
                "body":body,
                "category":category,
                "date": date,
                "author": author,
                "mainimage": mainimage

            }, function(err,post){

                if (err) {
                    res.send(err);
                } else {

                    req.flash('success','Post sent successfully');
                    res.location('/');
                    res.redirect('/');
                }

            });
            
        }



});



router.get('/show/:id', function(req,res,next){

    console.log('show id');
var post = db.get('post');

post.find({_id:req.params.id},{}, function(err,posts){
    
    res.render('show', {
        'posts':posts
    });
});

});


router.post('/addcomment', function(req, res, next) {
     

    var name = req.body.name;
    var email = req.body.email;
    var body = req.body.body;
    var postid = req.body.postid;
    var commentDate = new Date();

    //console.log (title);

    req.checkBody('name', 'name is required').notEmpty();
    req.checkBody('body', 'body is required').notEmpty();

    var errors = req.validationErrors();

    if (errors) {
        
        var post = db.get('post');

        post.find({_id:postid},{}, function(err,posts){
            
            res.render('show', {
                'posts':posts,
                'errors':errors
            });
        });

        
    } else {

        var comment = {
            'name' : name,
            'email' : email,
            'body' : body,
            'commentDate' : commentDate
        };

        var posts = db.get('post');
        posts.update({
            '_id':postid },
            {
                $push:{
                    'comments': comment
                }
        }, function(err,post){

            if (err) {
                res.send(err);
            } else {

                req.flash('success','Comment sent successfully');
                res.location('/posts/show/'+postid);
                res.redirect('/posts/show/'+postid);
            }

        });
        
    }



});


module.exports = router;
