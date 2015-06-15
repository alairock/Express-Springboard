var express = require('express');
var router = express.Router();
var _ = require("lodash");
var User = require('../models/user');
var utils = require('../utils');
var mongoose = require('mongoose');


var authenticate = function (req, res, next) {
    var username = req.body.username,
        password = req.body.password;
    if (_.isEmpty(username) || _.isEmpty(password)) {
        return next(new UnauthorizedAccessError("401", {
            message: 'Invalid username or password'
        }));
    }

    User.findOne({
        username: username
    }, function (err, user) {
        if (err || !user) {
            return next(new UnauthorizedAccessError("401", {
                message: 'Invalid username or password'
            }));
        }
        user.comparePassword(password, function (err, isMatch) {
            if (isMatch && !err) {
                utils.create(user, req, res, next);
            } else {
                return next(new UnauthorizedAccessError("401", {
                    message: 'Invalid username or password'
                }));
            }
        });
    });
};

router.post('/login', authenticate, function (req, res, next) {
    console.log('made it!');
    return res.status(200).json(req.user);
});

router.get("/verify", function (req, res, next) {
    return res.status(200).json(undefined);
});

router.get("/logout", function (req, res, next) {
    if (utils.expire(req.headers)) {
        delete req.user;
        return res.status(200).json({
            "message": "User has been successfully logged out"
        });
    } else {
        return next(new UnauthorizedAccessError("401"));
    }
});

router.post('/register', function (req, res, next) {
    // Unexpected token u - Comes from malformatted JSON
    console.log("Mongoose connected to the database");

    var user = new User();

    user.username = req.body.username;
    user.password = req.body.password;

    user.save(function (err) {
        if (err) {
            console.log(err);
            next(new Error("Something bad happened..."));
        } else {
            console.log(user);
            res.send({'status': 'success'})
        }
    });

});

module.exports = router;