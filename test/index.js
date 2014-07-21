var assert = require('assert')
  , Sails = require('sails')
  , barrels = require('barrels')
  , request = require('supertest')
  , fixtures;

// Global before hook
before(function (done) {
  // Lift Sails with test database
  Sails.lift({
    log: {
      level: 'error'
    },
    adapters: {
      mongo: {
        module: 'sails-mongo',
        host: 'localhost',
        database: 'hydra',
        user: null,
        pass: null
      }
    }
  }, function(err, sails) {
    if (err)
      return done(err);
    // Load fixtures
    barrels.populate(function(err) {
      done(err, sails);
    });
    // Save original objects in `fixtures` variable
    fixtures = barrels.objects;
  });
});

// Global after hook
after(function (done) {
   // delete all test data
   Application.findOne({ app_id : 'test' })
   .done(function(err, app) {
      var id = app.id;
      app.destroy()
      .done(function(err, app) { 
         console.log("test Application deleted app.id = " + id); 
         
         Activity.destroy({ app_id: id })
         .done(function(err) { 
            console.log("test Activity deleted"); 
            
            console.log();
            sails.lower(done);

         }); // Activity.destroy.done()

      }); // Application.destroy.done()

   }); // Application.findOne.done()
});

describe('Basic', function(done) {
  it("1 + 1 should get 2", function(done) {
    assert.equal(1 + 1, 2, "1 + 1 = 2");
    done();
  });
});

// Global variable to store 'test' application id
var ID; 

describe('Application', function(done) {
  it("should be able to create application", function(done) {
    Application.create({
         app_id: "test", 
         app_name: "Test App", 
         config: { key : "value" } 
      }, function(err, app) {
         assert.notEqual(app, undefined);
         ID = app.id;
         done();
    });
  });
});

describe('Home page', function(done) {
   it('GET / should return 200', function (done) {
      request(sails.hooks.http.app)
      .get('/').expect(200, done);
   });
});

describe('Property', function() {
   describe('Add Property', function(done) {
      it('POST /api/v1/application/:id/property should return 200', function (done) {
         request(sails.hooks.http.app)
         .post('/api/v1/application/' + ID + '/property')
         .set('Accept', 'application/json')
         .send({ key : 'newkey', value : 'newvalue' })
         .expect(200, done);
      });
   });

   describe('Update Property', function(done) {
      it('PUT /api/v1/application/:id/property should return 200', function (done) {
         request(sails.hooks.http.app)
         .put('/api/v1/application/' + ID + '/property')
         .set('Accept', 'application/json')
         .send({ key : 'key', value : 'updatedValue' })
         .expect(200, done);
      });
   });

   describe('Delete Property', function(done) {
      it('DELETE /api/v1/application/:id/property should return 200', function (done) {
         request(sails.hooks.http.app)
         .del('/api/v1/application/' + ID + '/property')
         .set('Accept', 'application/json')
         .send({ key : 'newkey' })
         .expect(200, done);
      });
   });
});

describe('Activity', function(done) {

   describe('Create Activity', function(done) {
      it('should be able to create activity', function(done) {
         Application.findOne({ app_id : "test" })
         .done(function(err, app) {
            // add new property to the application
            var _new_key = "key1";
            app.config[_new_key] = "value1";
            app.save(function(err) {
               return new Error('Failed to add new property');
            })
            .done(function(app) {
               // create new activity
               Activity.create({
                  app_id      : app.id,
                  action      : 'add',
                  key         : 'key1',
                  to_value    : 'value1',
                  changed_by  : 'admin',
                  version     : app.version - 1,
                  timestamp   : app.updatedAt
               })
               .done(function(err, activity) {
                  done();
               }); // Activity.create() - end

            }); // app.save#done() - end
         });
      });
   });

   describe('Get All Activities', function(done) {
      it('GET /api/v1/activity should return all activities', function (done) {
         request(sails.hooks.http.app)
         .get('/api/v1/activity')
         .set('Accept', 'application/json')
         .expect('Content-Type', /json/)
         .expect(200)
         .end(function(err, res) {
            if (err) return done(err);
            if(res.body.length == 0) throw new Error('Expected at least activity');
            done();
         });
      });
   });

}); // end of 'Activity'


/*
// How to load data from fixtures
//
describe('Fruits', function() {
  describe('#list()', function() {
    it ('should list the sorts of apples and oranges', function() {
      // All apples
      Apples.find(function(err, apples) {
        var gotApples = (fixtures['apples'].length > 0);
        var applesAreInTheDb = (apples.length === fixtures['apples'].length);
        assert(gotApples&&applesAreInTheDb, 'There must be something!');

        // All oranges
        Oranges.find(function(err, oranges) {
          assert.equal(apples.length, oranges.length,
            'The amount of varieties of apples and oranges should be equal!');
        }); 
      });
    });
  });
});
*/