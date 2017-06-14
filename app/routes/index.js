var express = require('express');
var router = express.Router();
var moment = require('moment');
var mongdb = require('mongodb');
var db = require('monk')('localhost:27017/pin');


/* GET home page. */
router.get('/', function(req, res, next) {
    var db = req.db
    var posts = db.get('post')

    posts.find({}, {}, (err, posts) => {
        res.render('home', {
            posts: posts,
            formatDate: function(date, format) {
                return moment(date).format("MM-DD-Y");
            }

        })
    })

});

module.exports = router;