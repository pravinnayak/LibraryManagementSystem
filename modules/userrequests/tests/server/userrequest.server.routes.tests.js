'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Userrequest = mongoose.model('Userrequest'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  userrequest;

/**
 * Userrequest routes tests
 */
describe('Userrequest CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Userrequest
    user.save(function () {
      userrequest = {
        name: 'Userrequest name'
      };

      done();
    });
  });

  it('should be able to save a Userrequest if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userrequest
        agent.post('/api/userrequests')
          .send(userrequest)
          .expect(200)
          .end(function (userrequestSaveErr, userrequestSaveRes) {
            // Handle Userrequest save error
            if (userrequestSaveErr) {
              return done(userrequestSaveErr);
            }

            // Get a list of Userrequests
            agent.get('/api/userrequests')
              .end(function (userrequestsGetErr, userrequestsGetRes) {
                // Handle Userrequests save error
                if (userrequestsGetErr) {
                  return done(userrequestsGetErr);
                }

                // Get Userrequests list
                var userrequests = userrequestsGetRes.body;

                // Set assertions
                (userrequests[0].user._id).should.equal(userId);
                (userrequests[0].name).should.match('Userrequest name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Userrequest if not logged in', function (done) {
    agent.post('/api/userrequests')
      .send(userrequest)
      .expect(403)
      .end(function (userrequestSaveErr, userrequestSaveRes) {
        // Call the assertion callback
        done(userrequestSaveErr);
      });
  });

  it('should not be able to save an Userrequest if no name is provided', function (done) {
    // Invalidate name field
    userrequest.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userrequest
        agent.post('/api/userrequests')
          .send(userrequest)
          .expect(400)
          .end(function (userrequestSaveErr, userrequestSaveRes) {
            // Set message assertion
            (userrequestSaveRes.body.message).should.match('Please fill Userrequest name');

            // Handle Userrequest save error
            done(userrequestSaveErr);
          });
      });
  });

  it('should be able to update an Userrequest if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userrequest
        agent.post('/api/userrequests')
          .send(userrequest)
          .expect(200)
          .end(function (userrequestSaveErr, userrequestSaveRes) {
            // Handle Userrequest save error
            if (userrequestSaveErr) {
              return done(userrequestSaveErr);
            }

            // Update Userrequest name
            userrequest.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Userrequest
            agent.put('/api/userrequests/' + userrequestSaveRes.body._id)
              .send(userrequest)
              .expect(200)
              .end(function (userrequestUpdateErr, userrequestUpdateRes) {
                // Handle Userrequest update error
                if (userrequestUpdateErr) {
                  return done(userrequestUpdateErr);
                }

                // Set assertions
                (userrequestUpdateRes.body._id).should.equal(userrequestSaveRes.body._id);
                (userrequestUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Userrequests if not signed in', function (done) {
    // Create new Userrequest model instance
    var userrequestObj = new Userrequest(userrequest);

    // Save the userrequest
    userrequestObj.save(function () {
      // Request Userrequests
      request(app).get('/api/userrequests')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Userrequest if not signed in', function (done) {
    // Create new Userrequest model instance
    var userrequestObj = new Userrequest(userrequest);

    // Save the Userrequest
    userrequestObj.save(function () {
      request(app).get('/api/userrequests/' + userrequestObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', userrequest.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Userrequest with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/userrequests/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Userrequest is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Userrequest which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Userrequest
    request(app).get('/api/userrequests/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Userrequest with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Userrequest if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Userrequest
        agent.post('/api/userrequests')
          .send(userrequest)
          .expect(200)
          .end(function (userrequestSaveErr, userrequestSaveRes) {
            // Handle Userrequest save error
            if (userrequestSaveErr) {
              return done(userrequestSaveErr);
            }

            // Delete an existing Userrequest
            agent.delete('/api/userrequests/' + userrequestSaveRes.body._id)
              .send(userrequest)
              .expect(200)
              .end(function (userrequestDeleteErr, userrequestDeleteRes) {
                // Handle userrequest error error
                if (userrequestDeleteErr) {
                  return done(userrequestDeleteErr);
                }

                // Set assertions
                (userrequestDeleteRes.body._id).should.equal(userrequestSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Userrequest if not signed in', function (done) {
    // Set Userrequest user
    userrequest.user = user;

    // Create new Userrequest model instance
    var userrequestObj = new Userrequest(userrequest);

    // Save the Userrequest
    userrequestObj.save(function () {
      // Try deleting Userrequest
      request(app).delete('/api/userrequests/' + userrequestObj._id)
        .expect(403)
        .end(function (userrequestDeleteErr, userrequestDeleteRes) {
          // Set message assertion
          (userrequestDeleteRes.body.message).should.match('User is not authorized');

          // Handle Userrequest error error
          done(userrequestDeleteErr);
        });

    });
  });

  it('should be able to get a single Userrequest that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Userrequest
          agent.post('/api/userrequests')
            .send(userrequest)
            .expect(200)
            .end(function (userrequestSaveErr, userrequestSaveRes) {
              // Handle Userrequest save error
              if (userrequestSaveErr) {
                return done(userrequestSaveErr);
              }

              // Set assertions on new Userrequest
              (userrequestSaveRes.body.name).should.equal(userrequest.name);
              should.exist(userrequestSaveRes.body.user);
              should.equal(userrequestSaveRes.body.user._id, orphanId);

              // force the Userrequest to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Userrequest
                    agent.get('/api/userrequests/' + userrequestSaveRes.body._id)
                      .expect(200)
                      .end(function (userrequestInfoErr, userrequestInfoRes) {
                        // Handle Userrequest error
                        if (userrequestInfoErr) {
                          return done(userrequestInfoErr);
                        }

                        // Set assertions
                        (userrequestInfoRes.body._id).should.equal(userrequestSaveRes.body._id);
                        (userrequestInfoRes.body.name).should.equal(userrequest.name);
                        should.equal(userrequestInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Userrequest.remove().exec(done);
    });
  });
});
