'use strict';

/**
 * Module dependencies
 */
var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function () {
  // Use local strategy
  passport.use(new LocalStrategy({
      usernameField: 'usernameOrEmail',
      passwordField: 'password'
    },
    function (usernameOrEmail, password, done) {

      let returnFromMongo = User.findOne({
        $or: [{
          username: usernameOrEmail.toLowerCase()
        }, {
          email: usernameOrEmail.toLowerCase()
        }]
      })

      // console.log(returnFromMongo, "ret")
      returnFromMongo.then(function (user) {
        // console.log(user,"u")
        if (user) {
          user.populate("booksIssueHistory")
          // .then((user) => {
          
          console.log(user.populated("booksIssueHistory"))
          console.log(user)
          console.log(user.booksIssueHistory)
          if (!user || !user.authenticate(password)) {
            return done(null, false, {
              message: 'Invalid username or password (' + (new Date()).toLocaleTimeString() + ')'
            });
          }
          return done(null, user);
          // })
        } else {
          return done("Please sign up to signin");
        }


      }).catch((err) => {

        if (err) {
          console.log(err)
          return done(err);
        }
      })

    }));
};
