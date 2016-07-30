$(document).ready(function () {
    var socket = io.connect('http://localhost:3001');
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
        //game.load.spritesheet('player','images/jump.png', 16, 16);//length, height
    }


    var player;
    var cursors;
    var people;
    var platforms;
    var jumpButton;
    var doubleJump = false;


    function create() {
        //  A simple background for our game
        game.add.sprite(0, 0, 'sky');

        player = game.add.sprite(100, 200, 'player');

        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
        player.body.gravity.y = 1000;
        player.JumpState = JumpState.onGround;
        platforms = game.add.physicsGroup();

        platforms.create(500, 150, 'platform');
        platforms.create(-200, 300, 'platform');
        platforms.create(400, 450, 'platform');

        platforms.setAll('body.immovable', true);


        people = game.add.group();
        people.enableBody = true;

        for (var i = 0; i < 3; i++) {
            var person = people.create(i * 70, 30 * i, 'baddie');
            person.body.gravity.y = 250;
            person.body.bounce.y = .3 + Math.random() * .5;
            person.body.collideWorldBounds = true;
            /* Create a star inside of the 'stars'

            player.body.collideWorldBounds = true;

             group
             var star = stars.create(i * 70, 0, 'star');

             //  Let gravity do its thing
             star.body.gravity.y = 300;

             //  This just gives each star a slightly random bounce value
             star.body.bounce.y = 0.3 + Math.random() * 0.5;*/

        }

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);


        //        game.add.sprite(0, 0, 800, 600, 'background');
        //
        //        game.world.setBounds(0, 0, 800, 600);
        //
        //        //game.physics.startSystem(Phaser.Physics.P2JS);
        //
        //        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
        //        game.physics.enable(player);
        //        player.body.collideWorldBounds = true;
        //        player.body.gravity.y = 500;
        //
        //        game.physics.p2.enable(player);
        //
        //        cursors = game.input.keyboard.createCursorKeys();
        //
        //        game.camera.follow(player);
        //        //player.animations.add('jump', [0, 1, 2, 3, 4], 10, true);
        //
        //
        //        platforms = game.add.physicsGroup();
        //        platforms.create(500, 150, 'platform');
        //        platforms.setAll('body.immovalbe', true);
        //
        //        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        //        //var ground = platforms.create(0, game.world.height + 64, 'ground');
        //        //ground.scale.setTo(2, 2);
        //        //ground.body.immovable = true;

    }

    function update() {
        game.physics.arcade.collide(player, platforms);
        game.physics.arcade.collide(people, platforms);
        game.physics.arcade.collide(people, player);
        player.body.velocity.x = 0;

        if (cursors.left.isDown) {
            player.body.velocity.x = -250;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 250;
        }

        if (player.body.onFloor()) {
            player.JumpState = JumpState.onGround;
        }

        if (jumpButton.isDown && (player.body.onFloor() || player.body.touching.down)) {
            player.body.velocity.y = -400;
            doubleJump = true; //activate the double jump
            console.log('single jumping');
            player.JumpState = JumpState.jumping;
        } /*else if (!player.body.onFloor() && jumpButton.isDown && doubleJump) { // && player.body.velocity.y >= 0){
            player.body.velocity.y = -400;
            console.log('double jupmppp');
            doubleJump = false;
        }*/
        else if(player.JumpState == JumpState.jumping && jumpButton.isDown){
            player.JumpState = JumpState.doubleJumping;
            player.body.velocity.y = -200;
        }


        //console.log(doubleJump);
        //        var x = player.x;
        //        var y = player.y;
        //
        //        player.body.setZeroVelocity();
        //
        //        if (cursors.up.isDown) {
        //            player.body.moveUp(300)
        //            player.animations.play('jump');
        //        } else if (cursors.down.isDown) {
        //            player.body.moveDown(300);
        //            player.animations.stop();
        //            player.frame = 0;
        //        }
        //
        //        if (cursors.left.isDown) {
        //            player.body.velocity.x = -300;
        //            player.animations.stop();
        //            player.frame = 0;
        //        } else
        //        if (cursors.right.isDown) {
        //            player.body.moveRight(300);
        //            player.animations.stop();
        //            player.frame = 0;
        //        }
        //        if (player.x != x && player.y != y) {
        //            console.log('x: ' + player.x + ' y: ' + player.y);
        //            socket.emit("gameUpdate", player.x);
        //        }
    }

    function render() {

        // use this one for camera debugging.
        //game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);

    }
    var JumpState = {
        onGround: 'canJump, is on grouind',
        jumping: 'on first jump',
        doubleJumping: 'doubleJumping'
    }
})
