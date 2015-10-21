/**
 * Created by ricardomendes on 12/05/15.
 */
var socket = io.connect('127.0.0.1:8080');

var current_user ='';
socket.on('connect', function () {
    current_user = prompt("Nome?");
    socket.emit('adduser', current_user);
});

socket.on('updatechat', function (color, username, data) {
    var isCurrentUser = (username == current_user) ? "left": "right";
    $('#conversation').append('<div class="chat-box-' + isCurrentUser + '">' + data + '</div><div class="chat-box-name-' + isCurrentUser + '"><div class="chat-box-name-elem1" style="background:'+color+';"> ' + username[0]+username[username.length-1] + '</div><div class="chat-box-name-elem2" style="color:'+color+'"> - ' + username + '</div></div><hr class="hr-clas">'); 
    $('#data').focus();
    $("#conversation").scrollTop($("#conversation")[0].scrollHeight);
    
});

socket.on('updaterooms', function (rooms, current_room) {
    $('#numChats').empty();
    $('#numChats').append("(" + rooms.length + ")");
    $('#listChats').empty();    
    $.each(rooms, function (key, value) {
        if (value == current_room) {
                $('#listChats').append('<a class="chat-box-online-left"><div class="chat-box-name-elem1" style="background:#049e64;"> <img class="img-circle" src="/images/room.png"></div><div class="chat-box-name-elem2" style="color:#049e64">- (' + value + ')</div>');            
        }
        else {
            $('#listChats').append('<a class="chat-box-online-left" onclick="switchRoom(\'' + value + '\')"><div class="chat-box-name-elem1"> <img class="img-circle" src="/images/room.png"></div><div class="chat-box-name-elem2">- (' + value + ')</div></a>');            
        }
        $('#listChats').append('<hr class="hr-clas-low">');
    });
});

socket.on('updateNumOnline', function (numOnline, users) {
    $('#numUsers').empty();
    $('#numUsers').append("(" + numOnline + ")");
    $('#listUsers').empty();    
    $.each(users, function (key, value) { 
        $('#listUsers').append('<div class="chat-box-online-users-left"><div class="chat-box-name-elem1" style="background:' + value + ';"> ' + key[0]+key[key.length-1] + '</div><div class="chat-box-name-elem2" style="color:' + value + '">- ' + key + '</div></div><hr class="hr-clas-low">');
    });
});

function switchRoom(room) {
    socket.emit('switchRoom', room);
}

$(function () {
    $('#datasend').click(function () {
        var message = $('#data').val();
        $('#data').val('');
        socket.emit('sendchat', message);
    });

    $('#data').keypress(function (e) {
        if (e.which == 13) {
            $(this).blur();
            $('#datasend').focus().click();
        }
    });
});
