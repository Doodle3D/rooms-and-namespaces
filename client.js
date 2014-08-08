//  _  _                                        
// | \| |__ _ _ __  ___ ____ __  __ _ __ ___ ___
// | .` / _` | '  \/ -_|_-< '_ \/ _` / _/ -_|_-<
// |_|\_\__,_|_|_|_\___/__/ .__/\__,_\__\___/__/
//                        |_|                   
// Issue: Can't reconnect to namespace...
// multiple multiplexed sockets using namespaces
var sockets = {};
function joinNamespace(namespace) {
	console.log("joinNamespace: ",namespace);	
	var socket = sockets[namespace] = io("/"+namespace);
	socket.on('chat message', function(msg){
		$('#messages').append($('<li>').text(msg));
	});
  socket.on('connect_error', function(err){
		console.log("connect_error: ",err);
	});
  socket.on('connect_timeout', function(err){
		console.log("connect_timeout: ",err);
	});
  socket.on('reconnect', function(reconnectCount){
		console.log("reconnect: ",reconnectCount);
	});
  socket.on('reconnect_attempt', function(err){
		console.log("reconnect_attempt: ",err);
	});
  socket.on('reconnecting', function(reconnectCount){
		console.log("reconnecting: ",reconnectCount);
	});
  socket.on('reconnect_error', function(err){
		console.log("reconnect_error: ",err);
	});
  socket.on('reconnect_failed', function(err){
		console.log("reconnect_failed: ",err);
	});
}
function closeNamespace(namespace) {
	console.log("closeNamespace: ",namespace);	
	//sockets[namespace].close();
	sockets[namespace].disconnect();
}
joinNamespace("");
$('#namespace1, #namespace2, #namespaceroot').change(function() {
	if(this.checked) {
		joinNamespace(this.value);
	} else {
		closeNamespace(this.value)
	}
})

//  ___                   
// | _ \___  ___ _ __  ___
// |   / _ \/ _ \ '  \(_-<
// |_|_\___/\___/_|_|_/__/                 
function joinRoom(name) {
	console.log("joinRoom: ",name);	  
  for(var i in sockets) {
		var socket = sockets[i];
    socket.emit('joinRoom', name);
  }
}
function leaveRoom(name) {
	console.log("leaveRoom: ",name);
  for(var i in sockets) {
    var socket = sockets[i];
    socket.emit('leaveRoom', name);
  }
}
$('#rooma, #roomb').change(function() {
	if(this.checked) {
		joinRoom(this.value);
	} else {
		leaveRoom(this.value)
	}
})


$('form').submit(function(){
	var msg = $('#m').val();
	$('#m').val('');
	
	for(var i in sockets) {
		var socket = sockets[i];
		switch(msg) {
			case "close":
				socket.close();
				break;
			case "disconnect":
				socket.disconnect();
				break;
			default:
				socket.emit('chat message', msg);
				console.log("msg > ",i,socket);
				break;
		}
	}
	return false;
});