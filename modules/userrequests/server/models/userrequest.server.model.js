'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Userrequest Schema
 */
var UserrequestSchema = new Schema({
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  },issueStatus:{
    type:String,
    default:"Requested"
  },
  bookId:{
    type: Schema.ObjectId,
    ref: 'Article'
  },
  issueType:{
    type:String,
    required : "Issue type required"
  }
});

mongoose.model('Userrequest', UserrequestSchema);
