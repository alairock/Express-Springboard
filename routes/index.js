var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

//Find the controller and let the controller handle things. Else NEXT!
router.all('/:model/:modelId?/:related?/:relatedId?', function (req, res) {
    var verb = req.method;
    var newController = require('../controllers/' + req.params.model + '.js');
    newController[verb.toLowerCase()](req, res);
});

module.exports = router;
