$(document).ready(function() {
    var socket = io.connect();

    $('#send-message').submit(function(event) {
        event.preventDefault();
        var message = $('#send-message #message').val();
        socket.emit('sendMessage', message, function() {
            $('#send-message #message').val("");
        });
    });
    
    $('#enter-chat').submit(function(event) {
        event.preventDefault();
        var nickname = $('#enter-chat #nickname').val();
        socket.emit('enterChat', nickname, function(validate) {
            if(validate) {
                $('#enter-chat').addClass("d-none");
                $('#send-message').removeClass("d-none");
                $('#message-box').removeClass("d-none");
            } else {
                alert('Nome de usuário já utilizado!');
            }
        });
    });

    socket.on('updateMessages', function(data) {
        var messageDOM = $('#message-box #message-default').clone();
        messageDOM.attr('id', 'message');
        messageDOM.removeClass('d-none');
        messageDOM.find('#nickname').text(data.nickname);
        messageDOM.find('#nickname').css('color', 'rgb(' + data.color + ')');
        messageDOM.find('p').text(data.message);
        $('#message-box #messages-list').append(messageDOM);
        $('#message-box').scrollTop($('#message-box #messages-list').height());
    });
});