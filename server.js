var express = require("express");
var bodyParser = require('body-parser');
var app = express();
app.use(express.static(__dirname));
var port = 3001;

var people = {};

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
    extended: false
}))

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/index.html");
});
app.get('/chatt', function (req, res) {
    console.log('sending to chatt')
    res.sendFile(__dirname + "/chatt.html");
});
app.get('/w', function(req, res){
    res.sendFile(__dirname + "/updatedindex.html");
});

app.post('/login', function (req, res) {
    console.log('req: ' + req.body.user.toString());
    if (req.body.user == '' || req.body.password == '') {
        //res.status(404).send("Sorry you need to login");
        res.end("Error");
    }
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

    socket.on('gameUpdate', function(coords){
       console.log("games updated " + coords);
    });

    socket.on('join', function (name) {
        people[socket.id] = name;
        //this only emits to the unique user
        socket.emit("update", "You have connected");
        //this will emit to all users
        io.emit("update", name + " has joined");
        io.emit('update-people', people);
    });

    socket.on('chat message', function (msg) {
        console.log('message being sent: ' + msg + ' by ' + people[socket.id]);
        io.emit('chat message', msg);
        io.emit("chat", people[socket.id], msg);
    });

    socket.on("disconnect", function(){
        io.emit("update", people[socket.id] + " has left");
        delete people[socket.id];
        io.emit('update-people', people);
    });
});
