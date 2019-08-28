var http = require('http');
var fs = require('fs');
var io = require('socket.io');

var server = http.createServer(function(req, res) {
    var url = req.url;
    
    if(url == '/') {
        url = '/index.html';
    }
    
    fs.readFile(__dirname + '/src' + url, function(error, data) {
        if(error) {
            res.writeHead(404);
            return res.end('Página ou arquivo não encontrados');
        }
        
        res.writeHead(200);
        return res.end(data);
    });
});

var socketServer = io.listen(server);
var usersChat = [];

socketServer.on('connection', function(socket) {
    socket.on('enterChat', function(data, callback) {
        if(data in usersChat) {
            callback(false);
        } else {
            var r = Math.floor(Math.random() * 256);
            var g = Math.floor(Math.random() * 256);
            var b = Math.floor(Math.random() * 256);
            socket.color = r + ',' + g + ',' + b;
            socket.nickname = data;
            usersChat[data] = socket;
            callback(true);
        }
    });
    socket.on('sendMessage', function(data, callback) {
        socketServer.sockets.emit('updateMessages', {
            nickname: socket.nickname,
            color: socket.color,
            message: data
        });
        
        callback();
    });
});

server.listen(80);