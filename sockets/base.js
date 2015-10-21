/**
 * Created by ricardomendes on 12/05/15.
 */
module.exports = function (io) {
    'use strict';
    
    var usernames = {};
    var rooms = ['@room1', '@room2', '@room3', '@room4'];
    var colors = ['#218C8D', '#6CCECB', '#F9E559', '#EF7126', '#8EDC9D', '#07AAFF'];
    var colorServer = '#000000';

    io.sockets.on('connection', function (socket) {
        socket.on('adduser', function (username) {
            socket.color = colors[Math.floor(Math.random() * colors.length)];
            socket.username = username;
            socket.room = rooms[0];
            usernames[username] = socket.color;

            socket.join(socket.room);
            socket.emit('updatechat', colorServer, 'SERVER', 'Conectou-se a ' + socket.room);
            socket.broadcast.to(socket.room).emit('updatechat', colorServer, 'SERVER', socket.username + ' juntou-se à sala' + socket.room);
            socket.emit('updaterooms', rooms, socket.room);
            updateNumOnline();
        });

        socket.on('sendchat', function (data) {
            io.sockets.in(socket.room).emit('updatechat', socket.color, socket.username, data);
        });

        socket.on('switchRoom', function (newroom) {
            socket.leave(socket.room);
            socket.join(newroom);
            socket.emit('updatechat', colorServer, 'SERVER', 'Conectou-se a ' + newroom);
            socket.broadcast.to(socket.room).emit('updatechat', colorServer, 'SERVER',
                                socket.username + ' abandonou a sala ' + socket.room);
            socket.room = newroom;
            socket.broadcast.to(newroom).emit('updatechat', colorServer, 'SERVER', socket.username + ' juntou-se à sala ' + socket.room);
            socket.emit('updaterooms', rooms, newroom);
        });

        socket.on('disconnect', function () {
            delete usernames[socket.username];
            io.sockets.emit('updateusers', usernames);
            socket.broadcast.emit('updatechat', colorServer, 'SERVER', socket.username + ' desconnectou-se');
            socket.leave(socket.room);
            updateNumOnline();
        });

        function updateNumOnline() {
            var numOnline = Object.keys(usernames).length;
            console.log("numOnline:" + numOnline);            
            io.sockets.emit('updateNumOnline', numOnline, usernames);
        }
    });
};