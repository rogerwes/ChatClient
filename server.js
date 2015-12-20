var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(express.static(__dirname));
var port = 3001;

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get('/chatt', function(req, res){
    console.log('sending to chatt')
    res.sendFile(__dirname + "/chatt.html");
});
app.post('/login', function (req, res) {
    console.log('req: ' + req.body);
    var user_name = req.body.user;
    var password = req.body.password;
    console.log("User name = " + user_name + ", password is " + password);
    user = user_name;
    //todo: the ending should be a json with success, and the username.
    res.end("done");
});

app.use(function (req, res, next) {
    console.log('cant get something');
    res.status(404).send('Sorry cant find that!');
});

var io = require('socket.io').listen(app.listen(port, function () {
    console.log('listening on port ' + port);
}));

//change the emit and on if not using a seperate js file...
io.on('connection', function (socket) {
    socket.on('chat message', function(msg){
        io.emit('chat message', msg);
    });

    socket.on('add user', function(username){
       console.log('user added: ' + username);
    });
});
