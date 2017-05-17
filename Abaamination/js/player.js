//Input Variable
var buttons;					//object to hold KeyCode properties

//collision Variables
var headCollision;				//shape for head
var bodyCollision;				//shape for body
var legsCollision;				//shape for legs
var material;					//collision material
var contactMaterial;			//contact Material

//Physics Variable
var gravity = 400;				//magnitude of gravity
var moveSpeed = 400;			//magnitude of lateral speed

//Physics Flags
var isJumping;
var jumpDelay;
var jumpTimer;
var delayTimer;

/**
*Player prefab constructor
*
*@game: reference to game prototype
*@key: reference to spritesheet
*@frame: initial frame
*@buttonObj: reference to button keyCodes object [up, down, left ,right, jump, ram, defend]
*@cg: collisionGroup: reference to the collision bitmask
*/
function Player(game, x, y, key, frame, buttonObj, cg, mg){

	//call to Phaser.Sprite //new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);

	//Scale the player sprite and resize the polygon collision data
	this.scale.x = .5;
	this.scale.y = .5;
	resizePolygon('playerCollision', 'playerCollisionADJ', 'player', 0.5);	

	//Physics
	game.physics.p2.enable(this, true);									//enable physics for player

	this.enableBody = true;												//enable body for physics calculations
	this.body.enableGravity = false;									//disable world gravity: gravity will be handled locally
	this.body.fixedRotation = true;										//restrict rotation

	this.body.clearShapes();											//clear all collision shapes
	this.body.loadPolygon('playerCollisionADJ', 'player');				//set polygon data as collision
	this.body.setCollisionGroup(cg.pCG);								//set the collision group (playerCollisionGroup)
	this.body.collides([cg.tCG, cg.eCG, cg.rCG])						//player collides with these groups
	this.body.collideWorldBounds = true;								//player collides with edges of the screen
	material = game.physics.p2.createMaterial('material', this.body);	//create new material

	//create contact properties between player and tiles
	contactMaterial = game.physics.p2.createContactMaterial(material, mg.tileMaterial);
	contactMaterial.friction = 0.5;
	contactMaterial.restitution = 0;
	contactMaterial.surfaceVelocity = 0;

	isJumping = false;													//player is not jumping

	//Input mapping
	buttons = game.input.keyboard.addKeys(buttonObj);					//Sets all the input keys for this prototype
	buttons.ram.onDown.add(ram, this);									//captures the first frame of the jumpKey press event
	buttons.jump.onDown.add(jump, this);								//captures the first frame of the ramKey press event
	
	//set button callbacks to 
	buttons.right.onDown.add(startRun, this);
	buttons.left.onDown.add(startRun, this);


	game.camera.follow(this);								//attach the camera to the player
	game.add.existing(this);								//add this Sprite prefab to the game cache
	console.log(this.body.debug);							//draw collision polygon
}

Player.prototype = Object.create(Phaser.Sprite.prototype);	//create prototype of type Player
Player.prototype.constructor = Player;						//set constructor function name

/**
*Override the player update function
*/
Player.prototype.update = function(){

	//if the Player is not in the middle of a jump, gravity is applied to this body
	if( !isJumping ) this.body.velocity.y = gravity * this.body.mass;

	//if the user is pressing right and left at the same time, stop movement
	if(buttons.left.isDown && buttons.right.isDown) this.body.velocity.x = 0;
	//Movement
	if(buttons.left.isDown){
		this.body.moveLeft(moveSpeed / this.body.mass);
	}
	if(buttons.right.isDown){
		this.body.moveRight(moveSpeed / this.body.mass);
	}

	//if the player is standing on the ground, allow for jump
	if(touchingDown(this.body) && !jumpDelay) isJumping = false;

	//Defend
	if(buttons.defend.isDown){
		defend();
	}
	//console.info(touchingDown(this.body));
	//console.info(isJumping);

}
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
	} return result;
}
/**
*Movement button callbacks
*Used for running acceleration curve
*/
startRun = function(){

}
stopRun = function(){

}
/**
*Mechanic functions
*/
jump = function(){
	if(isJumping) return;					//if player is in the middle of a jump, do nothing
	if(!touchingDown(this.body)) return; 	//if player is not on the ground, do nothing
	this.body.applyImpulseLocal([0, 50], this.width /2, this.height)
	isJumping = true;
	jumpDelay = true;
	game.time.events.add(Phaser.Timer.SECOND * 3, stopJump, this);
	game.time.events.add(Phaser.Timer.SECOND * 0.2, endDelay, this);

	//console.info("jumping");
}
function endDelay(){
	jumpDelay = false;
}
function stopJump(){
	isJumping = false;
}
ram = function(){
	console.info("ramming");
}
defend = function(){
	console.info("Defending");
}
