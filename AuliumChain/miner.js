let socket = require('socket.io-client')('http://localhost:3000');
let blockchain = require("./blockchain");

socket.on('connect', function(){});
socket.on('event', function(data){});
socket.on('disconnect', function(){});