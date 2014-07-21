/**
 * ActivityController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
   
   stream: function(req, res) {
      if (req.param('startStream') && req.isSocket) {
         var  socket = req.socket
            , _app_id    = req.param('app_id')
            , query     = (_app_id) ? { app_id : _app_id } : {};

         console.log(query);
         Activity.find({}).exec(function(e, users) {
            console.log("num of users = " + users.length);
            Activity.subscribe(socket, users, ['create','destroy']);
         });

      } else {
         res.view();
      }
   },

   subscribe: function (req, res) {
      Activity.subscribe(req.socket, 'activity', ['create', 'destroy']);
      res.json({ success : true });
   }

};
