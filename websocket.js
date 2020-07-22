var WebSocketServer = require('ws').Server,
request = require('request');
var mysql = require('mysql');

/*
  wss = new WebSocketServer({host: '172.31.36.14',port: 6003,autoAcceptConnections: false});
  var db = mysql.createConnection({
    host: '3.16.175.69',
    user: 'root',
    password: '10dulkar',
    database: 'heytaxi'
});  
 */
 wss = new WebSocketServer({host: '192.168.0.43',port: 6003,autoAcceptConnections: false});
  var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'test'
}); 
client_connection = [];

var connections = new Map();
var idCounter = 0;
var POLLING_INTERVAL = 1000;
var connectionsArray = [];
var id = 0;
var lookup = {};


var isInitNotes = false;
var notes = [];
// Log any errors connected to the db
db.connect(function(err){
    if (err) console.log(err)
})	

/*
* This function loops on itself since there are sockets connected to the page
* sending the result of the database query after a constant interval
*
*/
var pollingLoop = function () {
	
	
	var collection = { history:[] };
	
    // get data
    //updated_at >= timestamp(DATE_SUB(NOW(), INTERVAL 1 second)
    
   var query = db.query('SELECT name,data,created_at,updated_at FROM sockets;');
    query.on('error', function(err) {
        // Handle error, and 'end' event will be emitted after this as well
        console.log( err );
        updateSockets( err );
    }).on('result', function( details ) {        
       collection.history.push( details );
    }).on('end',function(){
        
    });
	

	
	
};


wss.on('connection', function(ws) {
	console.log('Server was connected.');
	console.log('Number of connections:' + connectionsArray.length);
	console.log("user_id"+ws.upgradeReq.url);
	
	 ws.id = ws.upgradeReq.url;
	
    if (!connectionsArray.length) {
        pollingLoop();
    }
    ws.on('close', function () {
        var socketIndex = connectionsArray.indexOf( ws );
        console.log('socket = ' + socketIndex + ' disconnected');
        if (socketIndex >= 0) {
            connectionsArray.splice( socketIndex, 1 );
        }
    });
	
    console.log( 'A new socket is connected!' );
    connectionsArray.push( ws );
	ws.on('message', function (data) {
		console.log("data:"+data);
		var update_data = JSON.parse(data);
		 console.log("update_data->type : ",update_data.type);
		connectionsArray.forEach(function( tmpSocket ){
			if(tmpSocket.readyState == 1) {
				tmpSocket.send( data );
				console.log(data);
			}
		});
		//console.log("Success");
	});
	
	
     
});
var updateSockets = function ( data ) {
    // store the time of the latest update
     data.time = new Date();
    // send new data to all the sockets connected
    connectionsArray.forEach(function( tmpSocket ){

		if(tmpSocket.readyState == 1) {
			if(data.history.length > 0 )  {
				console.log(JSON.stringify(data));
				tmpSocket.send( JSON.stringify(data) );
			}
			
		} 
    });
};
