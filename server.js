var express = require('express')

	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	usernames = [];

server.listen(process.env.PORT || 3000);
console.log('Running on PORT 3000')

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.use(express.static(__dirname + '/public'));

io.on('connection', function(socket){
  console.log('a user connected');

  //New user
  //I use "push" to add value to array

  socket.on('new user', function(data, callback){
  	if(usernames.indexOf(data)!= -1){
  		callback(false);
  	}else{
  		callback(true);
  		socket.username = data;
  		usernames.push(socket.username);
  		updateUsernames();
  	}

  });

  //Update Username
  function updateUsernames(){
  	io.sockets.emit('usernames', usernames);
  }

  //Send messages
  //socket.on is used to handling events

  socket.on('send message', function(data){
  	io.sockets.emit('new message', {msg: data, user: socket.username});
  });

  socket.on('disconnect', function(){
    console.log('a user disconnected');
    if(!socket.username){
    	return;
    }
    usernames.splice(usernames.indexOf(socket.username), 1);
    updateUsernames();
  });

});