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
	this.pCG = pCG;			//playerCollisionGroup
	this.eCG = eCG;			//enemyCollisionGroup
	this.rCG = rCG;			//resourceCollisionGroup
	this.tCG = tCG;			//tileCollisionGroup
};
//object to hold material data, just in case we want to add different materials to stuff
function MaterialGroup(tMG){
	this.tileMaterial = tMG;			//tile material
}
//'Play' state constructor
var Play = function(game)
{
	this.cols = null;

	//Collision bitmasks
	this.pCG;	//playerCollisionGroup
	this.tCG;	//tilesCollisionGroup
	this.rCG;	//resourceCollisionGroup
	this.eCG;	//enemyCollisionGroup

	this.map;				//Tile map json data
	this.collisionLayer;	//collision layer retrieved from map
	this.renderLayer;		//tile layer for rendering
	this.tileMaterial;		//tile material

	this.cG;	//object to hold all collision groups
	this.mG;	//object to hold all material groups
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
		//game.world.setBounds(0,0,3000,2080);								//Set Background size

		//Physics
		game.physics.startSystem(Phaser.Physics.P2JS);						//Physics ignition
		game.physics.p2.gravity.y = 2500;									//World gravity
		
		//Tile Mapping
		this.map = game.add.tilemap('testLevel');							//create map
		this.map.addTilesetImage('tiles', 'tilesheet');						//set tile images
		this.map.addTilesetImage('collision', 'cTiles');					//set invisible tiles for collision
		this.collisionLayer = this.map.createLayer('collision Layer');		//create layer for collision
		this.collisionLayer.visible = false;
		this.collisionLayer.renderable = false;
		this.renderLayer = this.map.createLayer('render Layer');			//create render layer
		this.renderLayer.resizeWorld();										//resize world to fit tile map
		this.map.setCollision(1, true, 'collision Layer');					//activate the collision on first tile
		game.physics.p2.convertTilemap(this.map, this.collisionLayer);		//converrts tiles into bodies for calculations
		game.physics.p2.setBoundsToWorld(true, true, true, true, true);		//reset the boundaries of the world because it was resized to fit tilemap

		//Create materials
		this.tileMaterial = game.physics.p2.createMaterial('tileMaterial');	//create collision material
		this.mG = new MaterialGroup(this.tileMaterial);

		//Create collision Groups
		this.pCG = game.physics.p2.createCollisionGroup();
		this.tCG = game.physics.p2.createCollisionGroup();
		this.eCG = game.physics.p2.createCollisionGroup();
		this.rCG = game.physics.p2.createCollisionGroup();
		this.cG = new CollisionGroups(this.pCG, this.eCG, this.rCG, this.tCG);
		
		//console.info(this.collisionLayer.layer.bodies.length);
		//set all the tiles in the tile map to be in the tileCollisionGroup
		for (var bodyIndex = 0; bodyIndex < this.collisionLayer.layer.bodies.length; bodyIndex++) {
       		var tileBody = this.collisionLayer.layer.bodies[bodyIndex];
       		tileBody.setCollisionGroup(this.cG.tCG);
       		tileBody.collides([this.cG.pCG, this.cG.eCG]);
       		tileBody.setMaterial(this.mG.tileMaterial);
       		//console.info(tileBody);
  		}

		//Player properties: game, x, y, key, frame, buttons, collisionGroup
		player = new Player(this.game, 9760, 880, 'player', 0, buttons, this.cG, this.mG);
		//create left and jump animations right coming soon!
		player.animations.add('left', Phaser.ArrayUtils.numberArray(0,51), 30, false, true);
		//player.animations.add('right', [], 30, false, true);
		player.animations.add('jump', Phaser.ArrayUtils.numberArray(52, 91), 30, false, true);	

		//enemy properties: game, x, y, key, frame, player, maxSpeed
		enemy = new Enemy(this.game, 6360, 800, 'enemy', 0, buttons, 200, this.cG);


	},

	update: function()
	{
		
	},

	render: function()
	{
		if (debug) {
			//game.debug.cameraInfo(game.camera, 32, 32);
			//game.debug.spriteCoords(player, 900, 32);
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00")
		}
	},
};
