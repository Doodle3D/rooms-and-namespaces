var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendfile('index.html');
});
app.get('/client.js', function(req, res){
  res.sendfile('client.js');
});

/**
 * Create a namespace
 * @param name name for namespace
 */
function createNamespace(name) {
	name = '/'+name;
	console.log("createNamespace: ",name);
	var nsp = io.of(name);
	nsp.on('connection', function(socket){
		console.log(name+": new connection: ",socket.id);
		nsp.emit("chat message", name+": new connection!");
		
		socket.on('connect', function(msg){
			console.log(name+": connect (socket): ",socket.id);
		});
		
		socket.on('chat message', function(msg){
			console.log(name+": chat message: ",msg);
			nsp.emit("chat message", name+": "+msg);
		});
		
		socket.on('disconnect', function(){
			console.log(name+": disconnect (socket): ",socket.id)
			nsp.emit("chat message", name+": disconnection");
		});
    
    // Rooms
    socket.on('joinRoom', function(room){
			console.log(name+": joinRoom: ",room,"("+socket.id+")");
      console.log("  socket's rooms: ",socket.rooms);
      socket.join(room,function(err){
        console.log("  > socket's rooms: ",socket.rooms);
        //io.sockets.to("rooma").emit("chat message","welcome in socket");
        io.to("rooma").emit("chat message","welcome in socket");
        //socket.to("rooma").emit("chat message","welcome in socket");
      });
      
      
      
		});
    socket.on('leaveRoom', function(room){
			console.log(name+": leaveRoom: ",room,"("+socket.id+")");
      console.log("  socket's rooms: ",socket.rooms);
      socket.leave(room,function(err){
        console.log("  > socket's rooms: ",socket.rooms);
      });
		});
	});
	nsp.on('connect', function(msg){
		console.log(name+": connect (nsp)");
	});
}
createNamespace("");
createNamespace("namespace1");
createNamespace("namespace2");

setInterval(emitTime,3000);
function emitTime() {
  console.log("emitTime");
  //io.sockets.to("rooma").emit("chat message",'time: '+(new Date()));
  io.to("rooma").emit("chat message",'time: '+(new Date()));
}


http.listen(3000, function(){
  console.log('listening on *:3000');
});
