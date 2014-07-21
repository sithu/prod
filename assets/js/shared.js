
socket.on('connect', function () {

	socket.get('/api/v1/activity', function(res) { 
   	socket.on('activity', function(message) {
	   	console.log(message);
	   });
   });

/*
    socket.get('/firehose', function nowListeningToFirehose() {

       // Attach a listener which fires every time the server publishes
       // a message to the firehose:
       socket.on('firehose', function newMessageFromSails(message) {
           typeof console !== 'undefined' &&
               console.log('New message published from Sails ::\n', message);
       });
   });
*/
});
