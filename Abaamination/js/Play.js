var Play = function(game) {};
Play.prototype =
{
	preload: function() 
	{
		game.load.image('mock', 'assets/mock.png');
		game.load.image('player', 'assets/player.png');
		game.load.image('col', 'assets/col2004x132.png');
		game.load.image('col1', 'assets/col941x341.png');
		game.load.image('col2', 'assets/col327x141.png');
		game.load.image('col3', 'assets/col704x90.png');
		game.load.image('col4', 'assets/col1310x126.png');
	},

	create: function ()
	{
		//start physics
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.arcade.gravity.y = 2500;
		game.physics.arcade.OVERLAP_BIAS = 30;

		 //mock background is this big
		game.world.setBounds(0,0,3000,2080)

		//create background
		var mock = game.add.image(0, 0, 'mock');

		//create invisible collider group
		cols = game.add.group();
		cols.enableBody = true;

		// . . . THIS IS WHY YOU USE A TILEMAP >_<!!!
		//if u try to make one giant map image for some reason it doesnt work. needs singular pieces
		var col = cols.create(0, 1830, 'col');
		col.scale.x = .93;
		col.renderable = false;
		col.body.immovable = true;
		col.body.allowGravity = false;

		var col1 = cols.create(2050, 1443, 'col1');
		col1.renderable = false;
		col1.body.immovable = true;
		col1.body.allowGravity = false;

		var col2 = cols.create(2031, 837, 'col2');
		col2.renderable = false;
		col2.body.immovable = true;
		col2.body.allowGravity = false;

		var col3 = cols.create(450, 1050, 'col3');
		col3.renderable = false;
		col3.body.immovable = true;
		col3.body.allowGravity = false;

		var col4 = cols.create(650, 445, 'col4');
		col4.renderable = false;
		col4.body.immovable = true;
		col4.body.allowGravity = false;

		//add player
		player = game.add.sprite(300, 1330, 'player');
		game.physics.arcade.enable(player);
		player.body.width = 256 ;
		player.body.height = 414;
		player.body.bounce.y = 0.2;
		player.body.collideWorldBounds = false;

		//temporary movement
		cursors = game.input.keyboard.createCursorKeys();
		//basic camera no adjustments
		game.camera.follow(player);
		game.camera.deadzone = new Phaser.Rectangle(100, 100, 300, 20);
	},

	update: function()
	{
		var hitCol = game.physics.arcade.collide(player, cols);
		player.body.velocity.x = 0;
		
		if(cursors.left.isDown)
		{
			player.body.velocity.x = -500;

		}

		if(cursors.right.isDown)
		{
			player.body.velocity.x = 500;
		}

		//  Allow the player to jump if they are touching the ground.
			if (cursors.up.isDown && hitCol)
			{
					player.body.velocity.y = -1100;
			}

			if (player.body.y > game.world.height)
			{
					game.state.start("Play");
			}	
	},

	render: function()
	{
		game.debug.cameraInfo(game.camera, 32, 32);
		game.debug.spriteCoords(player, 900, 32);
	},
};
