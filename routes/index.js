var express = require('express');
var router = express.Router();

const { Book } = require('../models');

/* GET home page. */
router.get('/', async function(req, res, next) {
  // res.render('index', { title: 'Express' });
    res.redirect("/books")
});


module.exports = router;