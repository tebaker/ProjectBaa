'use strict';

//object to hold the KeyCode properties
function Buttons(up, down, left, right, jump, defend, ram){
	this.up = up;
	this.down = down;
	this.right = right;
	this.left = left;
	this.jump = jump;
	this.sprint = ram;
	this.defend = defend;
};
//object to hold collision groups for easy referencing
function CollisionGroups(pCG, eCG, rCG, tCG, aCG){
	this.pCG = pCG;			//playerCollisionGroup
	this.eCG = eCG;			//enemyCollisionGroup
	this.rCG = rCG;			//resourceCollisionGroup
	this.tCG = tCG;			//tileCollisionGroup
	this.aCG = aCG;			//ramming collision group
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
	this.rCG;	//ramming collision group

	this.map;				//Tile map json data
	this.collisionLayer;	//collision layer retrieved from map
	this.renderLayer;		//tile layer for rendering
	this.tileMaterial;		//tile material

	this.cG;	//object to hold all collision groups
	this.mG;	//object to hold all material groups
	
	this.resources;
};

Play.prototype =
{
	preload: function() 
	{
		// enable FPS monitoring
		if (debug) {
			game.time.advancedTiming = true;
		}
	},

	create: function ()
	{
		//play some funky music
		var music1 = game.add.audio("music1", 1, true);
    		music1.play();
		
		//Set input properties: Could create menu where User can change input mapping
		var buttons = new Buttons(Phaser.KeyCode.UP, Phaser.KeyCode.DOWN, 
			Phaser.KeyCode.LEFT, Phaser.KeyCode.RIGHT, Phaser.KeyCode.W, 
			Phaser.KeyCode.Q, Phaser.KeyCode.E);

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
		this.aCG = game.physics.p2.createCollisionGroup();
		this.cG = new CollisionGroups(this.pCG, this.eCG, this.rCG, this.tCG, this.aCG);
		
		//console.info(this.collisionLayer.layer.bodies.length);
		//set all the tiles in the tile map to be in the tileCollisionGroup
		for (var bodyIndex = 0; bodyIndex < this.collisionLayer.layer.bodies.length; bodyIndex++) {
       		var tileBody = this.collisionLayer.layer.bodies[bodyIndex];
       		tileBody.setCollisionGroup(this.cG.tCG);
       		tileBody.collides([this.cG.pCG, this.cG.eCG]);
       		tileBody.setMaterial(this.mG.tileMaterial);
       		tileBody.debug = debug;
       		// console.info(tileBody);
		}
		
		// Create resources
		var tileIndex = 262;
		this.resources = game.add.group();
		this.resources.classType = Resource;
		var resourceTemp = game.add.group();
		// Create bitmap from tile
		var tileSet = this.map.tilesets[this.map.getTilesetIndex('tiles')];
		var tileSprite = new Phaser.BitmapData(game, 'tileSprite', tileSet.tileWidth, tileSet.tileHeight);
		tileSet.draw(tileSprite.context, 0, 0, tileIndex);
		// Put all Sprite instances into a temporary group
		this.map.createFromTiles(tileIndex, null, null, 'render Layer', resourceTemp);
		// Copy x and y from the temporary group into a new group of Resource instances
		var tileXOffset = this.map.layers[this.map.getLayerIndex('render Layer')].offsetX;
		var tileYOffset = this.map.layers [this.map.getLayerIndex('render Layer')].offsetY;
		for (var i = 0; i < resourceTemp.children.length; i++) {
			var x = resourceTemp.children[i].x;
			var y = resourceTemp.children[i].y;
			this.resources.add(new Resource(game, x + tileXOffset, y + tileYOffset, tileSprite, 0, 'resourceParticle', 50, 'energy'));
		}
		// Cleanup temporary group
		resourceTemp.destroy();

		//Player properties: game, x, y, key, frame, buttons, collisionGroup
		player = new Player(this.game, 9560, 700, 'player', 0, buttons, this.cG, this.mG, this.resources);	

		//enemy properties: game, x, y, key, frame, player, maxSpeed
		var enemy = new Enemy(this.game, 6360, 800, 'enemy', 0, buttons, 200, this.cG);
	},

	update: function()
	{
		
	},

	render: function()
	{
		if (debug) {
			game.debug.cameraInfo(game.camera, 32, 32);
			game.debug.spriteCoords(player, 900, 32);
			game.debug.text(game.time.fps || '--', 2, 14, "#00ff00")
		}
	},
};

/**
*		Utility Methods
*			@resizePolygon: Change the scale of a Json Polygon by a constant
*			@touchingDown: Determine if there is a downward collsion made by this.body, determine if this sprite is on ground
*/
//Resize a polygon Json file.  The polygon needs to be resized before it is applied to the body and 
//the string associated with newPhysicsKey must be used. 
function resizePolygon(originalPhysicsKey, newPhysicsKey, shapeKey, scale){

	var newData = [];										//array to hold new polygon

	var data = this.game.cache.getPhysicsData(originalPhysicsKey, shapeKey); //grab physics file

	
	for (var i = 0; i < data.length; i++) {					//iterate through all shapes in polygon
		var vertices = [];									//new array to hold vertex data
		for (var j = 0; j < data[i].shape.length; j += 2) {	//iterate through all vertices
			vertices[j] = data[i].shape[j] * scale;			//scale
			vertices[j+1] = data[i].shape[j+1] * scale; 	//scale
		}
		newData.push({shape : vertices}); 					//set new shape
	}
	var item = {};											//new object to hold json data
	item[shapeKey] = newData;								//set adjusted polygon
	game.load.physics(newPhysicsKey, '', item);				//create new key in cashe

	//debugPolygon(newPhysicsKey, shapeKey);
}

//Check to see if a "downward" collision is happening
function touchingDown(player) {    
	var yAxis = p2.vec2.fromValues(0, 1);    
	var result = false;    
	for (var i = 0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++) {        
		var c = game.physics.p2.world.narrowphase.contactEquations[i];        
		if (c.bodyA === player.data || c.bodyB === player.data)        
		{            
			var d = p2.vec2.dot(c.normalA, yAxis); // Normal dot Y-axis            
			if (c.bodyA === player.data) d *= -1;            
			if (d > 0.5) result = true;        
		}    
	}

	return result;
}
