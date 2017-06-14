var express = require('express');
var router = express.Router();
var mongdb = require('mongodb');
var db = require('monk')('localhost:27017/pin');

/* display post form. */

router.get('/add', function(req, res, next) {
    var categories = db.get('categories')
    categories.find({}, {}, (err, data) => {
        res.render('add-post', {
            'categories': data
        });
    })

});
router.post('/add', function(req, res, next) {
    var title = req.body.title
    var category = req.body.category
    var body = req.body.body
    var author = req.body.author
    var date = new Date()
    if (req.files.image) {
        var imagename = req.files.image.originalname
        var imagename = req.files.image.name
        var imagemime = req.files.image.mimetype
        var imagepath = req.files.image.path
        var imageExt = req.files.image.extension
        var imagesize = req.files.image.size
    } else {
        var imagename = 'noimage.png'
    }

    req.checkBody('title', 'title is required').notEmpty()
    req.checkBody('category', 'select category').notEmpty()
    req.checkBody('body', 'body is required').notEmpty()
    req.checkBody('author', 'select author').notEmpty()

    var errors = req.validationErrors();
    if (errors) {
        res.render('add-post', {
            "errors": errors,
            "title": title,
            "body": body
        })
    } else {
        var posts = db.get('post')
        posts.insert({
            title: title,
            body: body,
            author: author,
            category: category,
            imagename: imagename,
            date: date
        }, (err, data) => {
            if (err) throw err;
            req.flash('success', 'post submitted')
            res.location('/')
            res.redirect('/')
        })
    }
});

module.exports = router;