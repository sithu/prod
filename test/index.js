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
        module: 'sails-postgresql',
        host: 'localhost',
        database: 'prod',
        user: 'saung',
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
   /*
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
*/
  sails.lower(done);
});

describe('Basic', function(done) {
  it("1 + 1 should get 2", function(done) {
    assert.equal(1 + 1, 2, "1 + 1 = 2");
    done();
  });
});

var RAW_MATERIAL_ID, PRODUCT_ID;

describe('Product', function(done) {
   it('should be able to create Product', function(done) {
      Product.create({
         name : 'Blue Chair',
         type : 'CHAIR',
         timeToBuildInSec : 60,
         weight : 5,
         price : 1000.00,
         color : 'BLUE',
      }, 
      function(err, product) {
         assert.notEqual(product, undefined);
         console.log(product);
         PRODUCT_ID = product.id;
         assert(product.id > 0, 'Newly inserted Product id must be an integer');
         Product.findOne(product.id).exec(
            function(err, actual) {
               assert.equal(actual.id, product.id);
               assert.equal(actual.name, product.name);
               done();
         });
      }); // end - Product.create()
   }); // end - it
});

describe('RawMaterial', function(done) {
   it("should be able to create RawMaterial", function(done) {
      RawMaterial.create({
         name: 'Marble', 
         weight: 25, 
         count: 10,
         cost: 1000.00,
         color: 'BLUE',
         forProduct: PRODUCT_ID
      }, 
      function(err, rawMaterial) {
         assert.notEqual(rawMaterial, undefined);
         console.log(rawMaterial);
         RAW_MATERIAL_ID = rawMaterial.id;
         assert(rawMaterial.id > 0, 'Newly inserted RawMaterial id must be an integer');
         RawMaterial.findOne(rawMaterial.id).populate('forProduct').exec(function(err, actual) {
            console.log(actual);
            assert.equal(actual.id, rawMaterial.id);
            assert.equal(actual.name, rawMaterial.name);
            // checking forProduct relationship
            assert.equal(actual.forProduct.id, PRODUCT_ID);
            assert.equal(actual.forProduct.name, 'Blue Chair');
            done();
         });
      });
   });
});

//###################### REST API Tests ################################
describe('Home page', function(done) {
   it('GET / should return 200', function (done) {
      request(sails.hooks.http.app)
      .get('/').expect(200, done);
   });
});

describe('Add Product API', function(done) {
   it('POST /api/v1/product should return 200', function (done) {
      request(sails.hooks.http.app)
      .post('/api/v1/product')
      .set('Accept', 'application/json')
      .send({
         name : 'Green Chair',
         type : 'CHAIR',
         timeToBuildInSec : 60,
         weight : 4,
         price : 500.00,
         color : 'GREEN',
      })
      .expect(200, done);
   });
});

describe('Add RawMaterial API', function(done) {
   it('POST /api/v1/rawmaterial should return 200', function (done) {
      request(sails.hooks.http.app)
      .post('/api/v1/rawmaterial')
      .set('Accept', 'application/json')
      .send({
         name: 'Marble', 
         weight: 25, 
         count: 10,
         cost: 1000.00,
         color: 'GREEN',
         forProduct: 2
      })
      .expect(200, done);
   });
});

/*
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
*/


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