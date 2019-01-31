var express = require('express');
var router = express.Router();
var multer = require('multer');


var db = require('monk')('localhost/blog');

/* GET home page. */
router.get('/add', function(req, res, next) {
    
    var categories = db.get('categories');

    categories.find({},{}, function (err,categories){
        res.render('addcategory', {
            'title':'Add Category',
            'categories': categories

         });
    });
        
  
        
});

router.post('/add', function(req, res, next) {
     

        var name = req.body.name;
        
        //var date = new Date();

        console.log (name);

        req.checkBody('name', 'Name is required').notEmpty();

        var errors = req.validationErrors();

        if (errors) {

            res.render('addcategory', {
                'errors':errors  
        
              });
            
        } else {

            var posts = db.get('categories');
            posts.insert({

                "name":name,
                
             //   "date": date,
                

            }, function(err,category){

                if (err) {
                    res.send(err);
                } else {

                    req.flash('success','Category added successfully');
                    res.location('/');
                    res.redirect('/');
                }

            });
            
        }



});

router.get('/show/:category', function(req, res, next) {

    console.log('router');

    var posts = db.get('post');
    posts.find({category:req.params.category},{},function(err,posts){

          res.render('index', {
          
          'title':req.params.category,
          'posts':posts
            
          });
    })


});


module.exports = router;
