$(document).ready(function () {
    var socket = io.connect('http://localhost:3001');
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'phaser socket game', {
        preload: preload,
        create: create,
        update: update,
        render: render
    });

    function preload() {

        game.load.image('background', 'assets/sky.png');
        game.load.image('player', 'assets/particle.png');
        game.load.image('ground', 'assets/ground.png');
        //game.load.spritesheet('player','images/jump.png', 16, 16);//length, height
    }


    var player;
    var cursors;
    var people = {};
    var platforms;

    function create() {

        game.add.sprite(0, 0, 800, 600, 'background');

        game.world.setBounds(0, 0, 800, 600);

        game.physics.startSystem(Phaser.Physics.P2JS);

        player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');

        game.physics.p2.enable(player);

        cursors = game.input.keyboard.createCursorKeys();

        game.camera.follow(player);
        //player.animations.add('jump', [0, 1, 2, 3, 4], 10, true);


        platforms = game.add.group();
        platforms.enableBody = true;
        var ground = platforms.create(0, game.world.height + 64, 'ground');
        //ground.scale.setTo(2, 2);
        ground.body.immovable = true;

    }

    function update() {
        var x = player.x;
        var y = player.y;

        player.body.setZeroVelocity();

        if (cursors.up.isDown) {
            player.body.moveUp(300)
            player.animations.play('jump');
        } else if (cursors.down.isDown) {
            player.body.moveDown(300);
            player.animations.stop();
            player.frame = 0;
        }

        if (cursors.left.isDown) {
            player.body.velocity.x = -300;
            player.animations.stop();
            player.frame = 0;
        } else
        if (cursors.right.isDown) {
            player.body.moveRight(300);
            player.animations.stop();
            player.frame = 0;
        }
        if (player.x != x && player.y != y) {
            console.log('x: ' + player.x + ' y: ' + player.y);
            socket.emit("gameUpdate", player.x);
        }
    }

    function render() {

        game.debug.cameraInfo(game.camera, 32, 32);
        game.debug.spriteCoords(player, 32, 500);

    }
})
