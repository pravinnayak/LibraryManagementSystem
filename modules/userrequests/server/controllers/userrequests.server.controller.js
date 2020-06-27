'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Userrequest = mongoose.model('Userrequest'),
  User = mongoose.model("User"),
  Book = mongoose.model("Article"),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Userrequest
 */
exports.create = function (req, res) {
  var userrequest = new Userrequest(req.body);
  userrequest.user = req.user;
  Userrequest.find({
    bookId: userrequest.bookId,
    issueStatus: "Requested"

  }).populate("user").then((success) => {
    let error = false;
    for (let i of success) {
      if (String(i.user._id) == String(req.user._id)) {
        if (i.issueType == userrequest.issueType) {
          error = true
        }

      }

    }
    if (error) {
      return res.status(400).send({
        message: "cant submit request for same book,Please wait till the admin accepts"
      });
    }
    return userrequest.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(userrequest);
      }
    });
    // if (String(success.user._id) == String(req.user._id)) {
    //   console.log(success.issueType == userrequest.issueType,success.issueType,userrequest.issueType)
    //   if (success.issueType == userrequest.issueType) {

    //   } else {


    //   }



    // } else {
    //   userrequest.save(function (err) {
    //     if (err) {
    //       return res.status(400).send({
    //         message: errorHandler.getErrorMessage(err)
    //       });
    //     } else {
    //       res.jsonp(userrequest);
    //     }
    //   });
    // }
  }).catch((err) => {
    console.log(err, "err lin 38")
    userrequest.save(function (err) {
      if (err) {
        return res.status(400).send({
          message: errorHandler.getErrorMessage(err)
        });
      } else {
        res.jsonp(userrequest);
      }
    });
  })

};

/**
 * Show the current Userrequest
 */
exports.read = function (req, res) {
  // convert mongoose document to JSON
  var userrequest = req.userrequest ? req.userrequest.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  userrequest.isCurrentUserOwner = req.user && userrequest.user && userrequest.user._id.toString() === req.user._id.toString();

  res.jsonp(userrequest);
};

/**
 * Update a Userrequest
 */
exports.update = function (req, res) {
  var userrequest = req.userrequest;

  // console.log(req.body)
  userrequest = _.extend(userrequest, req.body);
  // console.log(userrequest)

  userrequest.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {

      User.findOne({
        "_id": userrequest.user._id
      }).then((user) => {
        console.log(user, "user found from the request")
        let book = user.booksIssueHistory
        if (book.length == 0) {
          book.push(userrequest.bookId._id)
        } else {
          let tempBook = []
          for (let i of book) {
            tempBook.push(String(i))

          }
          if(!tempBook.includes(String(userrequest.bookId._id))){
            book.push(userrequest.bookId._id)
          }
        }
       

        user.booksIssueHistory = book;

        console.log(user.booksIssueHistory, "updated history")
        user.save(function (err) {
          if (err) {
            console.log(err)
          }
          // console.log(success)
          // console.log(userrequest.issueStatus,"status")
          if (userrequest.issueStatus == "Approved") {
            Book.findById(userrequest.bookId._id).then((book) => {
              book.issued = true;
              // book.issuedTill = 
              if (userrequest.issueType.includes("between")) {
                book.issuedTill = new Date(new Date().toLocaleString().split(",")[0] + ", " + "05:00:00 PM").toISOString()

              } else {
                book.issuedTill = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()
              }
              book.save(function () {
                console.log(book)
              })

            }).catch((err) => {
              return res.status(400).send({
                message: errorHandler.getErrorMessage(err)
              });
            })
          }
        })



      }).catch((err) => {
        return res.status(401).send({
          message: "User not signed in"
        });
      })


      res.jsonp(userrequest);
    }
  });
};

exports.resolveUserRequest = function (req, res) {
  var userrequest = req.userrequest;

  // console.log(req.body)
  userrequest = _.extend(userrequest, req.body);
  console.log(userrequest)

  userrequest.save(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userrequest);
    }
  });
};

/**
 * Delete an Userrequest
 */
exports.delete = function (req, res) {
  var userrequest = req.userrequest;

  userrequest.remove(function (err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userrequest);
    }
  });
};

/**
 * List of Userrequests
 */
exports.list = function (req, res) {
  Userrequest.find({
    issueStatus: "Requested"
  }).sort('-created').populate('user', 'displayName').populate("bookId").exec(function (err, userrequests) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userrequests);
    }
  });
};
exports.allRequest = function (req, res) {
  Userrequest.find().sort('-created').populate('user', 'displayName').populate("bookId").exec(function (err, userrequests) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(userrequests);
    }
  });
};

exports.manageUserRequest = function (req, res) {
  let user = req.user
  Userrequest.find().sort('-created').populate('user', 'displayName').populate("bookId").exec(function (err, userrequests) {
    // console.log(user)
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      let sendJson = [];
      for (let i of userrequests) {
        if (String(i.user._id) == String(user._id)) {
          sendJson.push(i)
        }
      }
      // console.log()
      res.jsonp(sendJson);
    }
  });
};

/**
 * Userrequest middleware
 */
exports.userrequestByID = function (req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Userrequest is invalid'
    });
  }

  Userrequest.findById(id).populate('user', 'displayName').populate("bookId").exec(function (err, userrequest) {
    if (err) {
      return next(err);
    } else if (!userrequest) {
      return res.status(404).send({
        message: 'No Userrequest with that identifier has been found'
      });
    }
    req.userrequest = userrequest;
    next();
  });
};
