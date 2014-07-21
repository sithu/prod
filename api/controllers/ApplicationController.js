/**
 * ApplicationController
 *
 * @module      :: Controller
 * @description   :: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
var Q = require('q');

module.exports = {
   
   upload: function (req, res) {
      var _app_name = req.body.app_name
         , _app_id = req.body.app_id 
         // get the temporary location of the file
         , tmp_path = req.files.properties_file.path
         // Not in used yet!
         , file_name = req.files.properties_file.name;
      
      var fs = require('fs');

      readLines(fs.createReadStream(tmp_path), parseKV).then(function (result) {
         
         var application = {
            app_name: _app_name,
            app_id: _app_id,
            config: result
         };

         Application.create(application, function(err, new_record) {
               if (err) {
                  return res.json(err, 500);
             }
             // FIXME: make this Ajax call rather than from POST and return JSON response
             return res.redirect('/');
         });

      });

   },

   /**
       * Find all applications
     */
   index: function(req, res) {
      Application.find().done(function(err, applications) {
         return res.json(applications);
      });
   },

   /**
       * View application By app_id, not MongoDB "id". 
     */
   viewByAppId: function(req, res) {
      var id = req.param('id');
      Application.findOne({ app_id : id }).done(function(err, application) {
         return res.view('application/index', application);
      });   
   },

   /**
       * Convert application JSON attributes into key-value properties format. 
     */
   toPropertiesFile: function(req, res) {
      var id = req.param('id');
      Application.findOne({ app_id : id }).done(function(err, application) {
         var kvArray = [];
         for (var key in application.config) {
            kvArray.push(key + "=" + application.config[key]);
         }
         res.send(kvArray.join("\n"), { 'Content-Type': 'text/plain' }, 200);
      });   
   },
   
   newProperty: function(req, res) {
      newOrUpdateProperty(req, res, 'add');
   },

   updateProperty: function(req, res) {
      newOrUpdateProperty(req, res, 'update');
   },

   deleteProperty: function(req, res) {
      newOrUpdateProperty(req, res, 'delete');
   },

   /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to ApplicationController)
   */
   _config: {}

  
};

function newOrUpdateProperty(req, res, action) {
   var _id = req.param('id')
      ,_key = req.param('key')
      ,_value = req.param('value');
   
   console.log("app_id=" + _id + "::key=" + _key + "=" + _value);

   Application.findOne(_id)
   .done(function(err, app) {
      if (err) {
         return res.json(err, 400);
      } else if (action === 'add' && _key in app.config) {
         return res.json('Could not add duplicate Property', 400);
      } 

      var activity = {
         app_id      : app.id,
         action      : action,
         key         : _key,
         to_value    : _value,
         changed_by  : 'Admin',
         timestamp   : app.updatedAt
      };

      if (action === 'edit') {
         activity['action'] = action;
         activity['from_value'] = app.config[_key]; 
      }

      if (action === 'delete') {
         delete app.config[_key];
      } else {
         app.config[_key] = _value;
      }
      // save the updated value
      app.save(function(err) {
         if (err) {
            res.json('Failed to add/update/delete the property due to ' + err, 400);
         }
      })
      .done(function(app) {
         // create new activity
         activity['version'] = app.version - 1;
         console.log(activity);

         Activity.create(activity)
         .done(function(err, activity) {
            if (err) {
               console.log("Failed to save the activity, but ignore for now");
            }
            // FIXME: should return JSON to be consistent with other responses.
            return res.view('application/index', app);
         }); // Activity.create.done()

      }); // app.save.done()
   
   }); // Application.findOne.done()
};


/**
 * Read the input stream line by line.
 *
 */
function readLines(input, func) {
   var deferred = Q.defer();
   var remaining = '';
   var result = {};

   input.on('data', function(data) {
      remaining += data;
      var index = remaining.indexOf('\n');
      while (index > -1) {
         var line = remaining.substring(0, index);
         remaining = remaining.substring(index + 1);
         var kv = func(line);
         if (kv) {
            result[kv.key] = kv.value;
         }
         index = remaining.indexOf('\n');
      }
   });

   input.on('end', function() {
      if (remaining.length > 0) {
        func(remaining);
      }
      // pass back the result to the next part of the chain, e.g. .then()
      deferred.resolve(result);
   });

   input.on('error', function() {
      console.log('Something went wrong while reading the file');
      deferred.reject(new Error('An error occurred while reading the file'));
   });
   // returning promise is required so that the next 'then' chain will work.
   return deferred.promise;
};


function parseKV(line) {
   line = line.toString().trim();
   var kv = line.split('=', 2);
   var _key, _value;

   if (kv.length > 1) {
      _key = kv[0];
      _key = _key.replace('.', '_'); // because MongoDB doesn't allow attribute name with '.' in it.
      _value = kv[1];
   } else {
      console.log('Skipping line - ' + line);
      return null;
   }

   return { key: _key, value: _value };
};