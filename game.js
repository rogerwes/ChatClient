$(document).ready(function () {
    var socket = io.connect('http://localhost:3001');
    var player;
    var cursors;
    var people;
    var platforms;
    var jumpButton;

    // Setup the Phaser object, and define the functions for
    // the core game logic
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser socket game', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });

    function preload() {
        game.load.image('sky', 'assets/sky.png');
        game.load.image('player', 'assets/particle.png');
        game.load.image('platform', 'assets/ground.png');
        game.load.image('baddie', 'assets/baddie.png');
    }

    function create() {
        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        // The player
        player = game.add.sprite(100, 200, 'player');
        game.physics.arcade.enable(player);
        player.body.collideWorldBounds = true;
        player.body.gravity.y = 800;
        player.canDoubleJump = false;

        // The platforms
        platforms = game.add.physicsGroup();
        platforms.create(500, 150, 'platform');
        platforms.create(-200, 300, 'platform');
        platforms.create(400, 450, 'platform');
        platforms.setAll('body.immovable', true);

        // The other people sprites
        people = game.add.group();
        people.enableBody = true;
        for (var i = 0; i < 3; i++) {
            var person = people.create(i * 70, 30 * i, 'baddie');
            person.body.gravity.y = 250;
            person.body.bounce.y = .3 + Math.random() * .5;
            person.body.collideWorldBounds = true;
        }

        // Gather input
        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    function collisionHandler(p1, p2){
     console.log("handled collision");
    }

    function update() {
        // Do collision detection, order appears to matter
        // as the people are going through the ground somehow
        var plat = (game.physics.arcade.collide(player, platforms))
        game.physics.arcade.collide(people, platforms);
        game.physics.arcade.collide(people, player);
        (game.physics.arcade.collide(people, people, collisionHandler, null, this))


        //    game.physics.arcade.overlap(bullets, veggies, collisionHandler, null, this);


        player.body.velocity.x = 0;

        // Left / Right input
        if (cursors.left.isDown) {
            if (player.body.velocity.y > 0) {
                player.body.velocity.x = -200;
            } else
                player.body.velocity.x = -250;
        } else if (cursors.right.isDown) {
            if (player.body.velocity.y > 0) {
                player.body.velocity.x = 200;
            } else
                player.body.velocity.x = 250;
        }

        if(!plat && !player.body.onFloor()){
            if(!jumpButton.isDown){
                player.canDoubleJump = true;
                console.log('can double');
            }
        }

        // Jumping
        if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -500;
            console.log('single jumping');
            //player.canDoubleJump = true;
        } else if (!player.body.onFloor() && !plat && jumpButton.isDown && (player.body.velocity.y >= -50) && player.canDoubleJump) { // && player.body.velocity.y >= 0){
            player.body.velocity.y = -400;
            console.log('double jupmppp');
            player.canDoubleJump = false;
        }
    }

    function render() {
        // use this one for camera debugging.
        //game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);
    }
})
