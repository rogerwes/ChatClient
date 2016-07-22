//$(document).ready(function () {
//    var $window = $(window);
//    var $loginPage = $('')
//    var socket = io();

    function logIn(username, pass) {
        console.log('username: ' + username);
        console.log('pass: ' + password);
        $.post('http://localhost:3001/login', {
            user: username,
            password: pass
        }, function (data) {
            if (data == 'done') {
                console.log('done');
                window.location = 'http://localhost:3001/chatt'
            }
            else{
                console.log("something went wrong");
                alert("Invalid login information");
            }
        });
        //Instead of using jquery to post, can use socket to emit our add user (similar to connection I think?)
        //        socket.emit("add user", username);
    };
//});
