$(document).ready(function () {
    var socket = io.connect('http://localhost:3001');
    $("#chat").hide();
    $("#name").focus();
    $("form").submit(function (event) {
        event.preventDefault();
    });

    $("#join").click(function () {
        var name = $("#name").val();
        if (name != "") {
            socket.emit("join", name);
            $("#login").detach();
            $("#chat").show();
            $("#msg").focus();
            ready = true;
        }
    });

    $("#name").keypress(function (e) {
        if (e.which == 13) {
            var name = $("#name").val();
            if (name != "") {
                socket.emit("join", name);
                ready = true;
                $("#login").detach();
                $("#chat").show();
                $("#msg").focus();
            }
            else{
                alert("You must enter in a name!");
            }
        }
    });

    socket.on("update", function (msg) {
        if (ready) {
            $("#msgs").append($('<li>').text(msg));
        }
    });

    socket.on("update-people", function (people) {
        if (ready) {
            $("#people").empty();
            $.each(people, function (clientid, name) {
                $('#people').append($('<li>').text(name));
            });
        }
    });

    socket.on("chat", function (who, msg) {
        if (ready) {
            $("#msgs").append($('<li>').text(who + ' says: ' + msg));
        }
    });

    socket.on("disconnect", function () {
        $("#msgs").append($('<li>').text("Server disconnected"));
        $("#msg").attr("disabled", "disabled");
        $("#send").attr("disabled", "disabled");
    });


    $("#send").click(function () {
        var msg = $("#msg").val();
        console.log('message to send: ' + msg);
        socket.emit("chat message", msg);
        $("#msg").val("");
    });

    $("#msg").keypress(function (e) {
        if (e.which == 13) {
            var msg = $("#msg").val();
            console.log('message clicked')
            socket.emit("chat message", msg);
            $("#msg").val("");
        }
    });

});
