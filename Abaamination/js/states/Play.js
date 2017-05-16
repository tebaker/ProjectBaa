//object to hold the KeyCode properties
function Buttons(up, down, left, right, jump, defend, ram){
	this.up = up;
	this.down = down;
	this.right = right;
	this.left = left;
	this.jump = jump;
	this.ram = ram;
	this.defend = defend;
};
//object to hold collision groups for easy referencing
function CollisionGroups(pCG, eCG, rCG, tCG){
	this.playerCollisionGroup = pCG;
	this.enemyCollisionGroup = eCG;
	this.resourceCollisionGroup = rCG;
	this.tilesCollisionGroup = tCG;
};

//'Play' state constructor
var Play = function(game)
{
	this.cols = null;

	//Collision bitmasks
	this.pCG;	//playerCollisionGroup
	this.tCG;	//tilesCollisionGroup
	this.rCG;	//resourceCollisionGroup
	this.eCG;	//enemyCollisionGroup

	//object to hold all collision groups
	this.collisionGroups;	
};

Play.prototype =
{
	preload: function() 
	{
	},

	create: function ()
	{
		//Set input properties: Could create menu where User can change input mapping
		var buttons = new Buttons(Phaser.KeyCode.UP, Phaser.KeyCode.DOWN, 
			Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT, Phaser.KeyCode.W, 
			Phaser.KeyCode.Q, Phaser.KeyCode.E);

		//Game World
		game.world.setBounds(0,0,3000,2080);				//Set Background size
		var mock = game.add.image(0, 0, 'mock');			//create background

		//Physics
		game.physics.startSystem(Phaser.Physics.P2JS);		//Physics ignition
		game.physics.p2.gravity.y = 2500;					//World gravity

		//Create collision groups
		this.pCG = this.physics.p2.createCollisionGroup();
		this.tCG = this.physics.p2.createCollisionGroup();
		this.eCG = this.physics.p2.createCollisionGroup();
		this.rCG = this.physics.p2.createCollisionGroup();
		this.collisionGroups = new CollisionGroups(this.pCG, this.eCG, this.rCG, this.tCG);

		//Create group of environmental colliders
		this.cols = game.add.group();
		this.cols.enableBody = true;
		this.cols.physicsBodyType = Phaser.Physics.P2JS;

		// . . . THIS IS WHY YOU USE A TILEMAP >_<!!!
		//if u try to make one giant map image for some reason it doesnt work. needs singular pieces
		var col = this.cols.create(0, 1830, 'col');
		col.scale.x = .93;
		col.renderable = false;
		col.body.immovable = true;
		col.body.allowGravity = false;

		var col1 = this.cols.create(2050, 1443, 'col1');
		col1.renderable = false;
		col1.body.immovable = true;
		col1.body.allowGravity = false;

		var col2 = this.cols.create(2031, 837, 'col2');
		col2.renderable = false;
		col2.body.immovable = true;
		col2.body.allowGravity = false;

		var col3 = this.cols.create(450, 1050, 'col3');
		col3.renderable = false;
		col3.body.immovable = true;
		col3.body.allowGravity = false;

		var col4 = this.cols.create(650, 445, 'col4');
		col4.renderable = false;
		col4.body.immovable = true;
		col4.body.allowGravity = false;
		//just experimentation: all of this collision data will be replaced with tile data
		this.cols.forEach(function(shape){
			shape.body.setCollisionGroup(this.tCG);
		}, this, true, this.tCG);

		//Player properties: game, x, y, key, frame, buttons, collisionGroup
		player = new Player(this.game, 300, 1330, 'player', 0, buttons, this.collisionGroups);			
		//Array of Collision groups to define player collisions
		player.body.collides([	
			this.collisionGroups.tilesCollisionGroup, 
			this.collisionGroups.resourceCollisionGroup, 
			this.collisionGroups.enemyCollisionGroup	
		]);		 

		game.camera.deadzone = new Phaser.Rectangle(100, 100, 300, 20);
	},

	update: function()
	{
		
	},

	render: function()
	{
		if (debug) {
			game.debug.cameraInfo(game.camera, 32, 32);
			game.debug.spriteCoords(player, 900, 32);
		}
	},
};
