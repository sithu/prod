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

//###################### DB CRUD Tests ################################
var PRODUCT_ID, RAW_MATERIAL_ID, ORDER_ID;

// STEP 1 - Create Product
describe('#### Product ####', function(done) {
   it('create()', function(done) {
      Product.create({
         name : 'Blue Chair',
         type : 'CHAIR',
         timeToBuildInSec : 30,
         weight : 2.5,
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

// STEP 2 - Create Raw Material
describe('#### RawMaterial ####', function(done) {
   it("create()", function(done) {
      RawMaterial.create({
         name: 'Marble', 
         weight: 25, 
         count: 200,
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
            if(err) return done(err);

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

// STEP 3 - Create Order

describe('#### New Order ####', function(done) {
   it('create()', function(done) {
      Order.create({
         name : 'New Chair Regular Order',
         quantity : 1000,
         forProduct : PRODUCT_ID
      }, 
      function(err, order) {
         assert.notEqual(order, undefined);
         console.log(order);
         ORDER_ID = order.id;
         assert(order.id > 0, 'New order id must be an integer');
         Order.findOne(order.id).exec(
            function(err, actual) {
               if(err) return done(err);

               assert.equal(actual.id, order.id);
               assert.equal(actual.name, order.name);
               // checking default status
               assert.equal('WAITING_FOR_PRODUCTION', actual.status);
               done();
         });
      }); // end - Product.create()
   }); // end - it
}); // end New Order

describe('#### Update Order ####', function(done) {
   it('update()', function(done) {
      Order.update({ id : ORDER_ID }, { status : 'IN_PRODUCTION' }).exec(
         function(err, orderUpdated) {
            if(err) return done(err);

            Order.findOne(ORDER_ID).exec(
               function(err, actual) {
                  assert.equal(ORDER_ID, actual.id);
                  assert.equal('IN_PRODUCTION', actual.status);
                  assert.deepEqual(actual.productionStartAt, actual.updatedAt);
                  done();
            });
      }); // end update 
   }); // end - it
}); // end Update Order

// Step 4 - Create Production Entry


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

describe('Delete RawMaterial API', function(done) {
   it('DELETE /api/v1/rawmaterial/{id} should return 200', function (done) {
      request(sails.hooks.http.app)
      .del('/api/v1/rawmaterial/2')
      .set('Accept', 'application/json')
      .expect(200, done);
   });
});

describe('Delete Product API', function(done) {
   it('DELETE /api/v1/product/{id} should return 200', function (done) {
      request(sails.hooks.http.app)
      .del('/api/v1/product/2')
      .set('Accept', 'application/json')
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