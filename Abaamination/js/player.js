//Input Variable
var buttons;					//object to hold KeyCode properties

//material Variables
var material;					//collision material
var contactMaterial;			//contact Material

//orientation flags
var playerFaceLeft = false;
var playerFaceRight = false;

//emitter variables
var emitter;
var jumpVar = false;		//checking if a jump has started

//Physics Variable
var GRAVITYMAX = 500;			//maximum magnitude of gravity
var gravity = 500;				//current magnitude of gravity
var stopTime;					//timer used to create gravity acceleration
var moveSpeed = 400;			//magnitude of lateral speed
var airFriction = 1;			//slow movement while in the air
var AFM = 0.6;					//slow movement speed by 40% while not on the ground
var bodyFriction = 0.5;			//friction between tiles and this body

//Physics Flags
var isJumping;					//is player jumping?
var jumpDelay = 0;				//when should the player stop jumping
var jumpTimer = 0;				//how long has the player been jumping
var jumpTime = 1;				//the length of time in seconds of one jump
var jumpSpeed = 500;			//velocity of the upward motion
var jumpThreshold = .1;			//if time left until end of jump < jumpThreshhold, cancel jump

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
	game.physics.p2.enable(this);										//enable physics for player

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
	contactMaterial.friction = bodyFriction;
	contactMaterial.restitution = 0;
	contactMaterial.surfaceVelocity = 0;

	isJumping = false;													//player is not jumping

	//Input mapping
	buttons = game.input.keyboard.addKeys(buttonObj);					//Sets all the input keys for this prototype
	buttons.ram.onDown.add(ram, this);									//captures the first frame of the jumpKey press event
	buttons.jump.onDown.add(jump, this);								//captures the first frame of the ramKey press event
	buttons.jump.onUp.add(stopJump, this);
	
	//set button callbacks to create movement acceleration curve
	buttons.right.onDown.add(startRun, this);
	buttons.left.onDown.add(startRun, this);


	game.camera.follow(this, Phaser.Camera.FOLLOW_PLATFORMER);			//attach the camera to the player
	game.camera.roundPX = false;
	game.add.existing(this);											//add this Sprite prefab to the game cache

	// //creating emitter where the player is currently standing
	// emitter = game.add.emitter(this.x, this.y, 200);
	// emitter.makeParticles(['dustParticle']);

}

Player.prototype = Object.create(Phaser.Sprite.prototype);	//create prototype of type Player
Player.prototype.constructor = Player;						//set constructor function name

/**
*Override the player update function
*/
Player.prototype.update = function(){

	var currentTime = this.game.time.totalElapsedSeconds();		//game time that has passed (paused during pause state)
	
	if( !touchingDown( this.body )) {
		if( airFriction != AFM ){ 
			airFriction = AFM;
			contactMaterial.friction = 0.0;
		} 
	} else {
		if( airFriction != 1){
			airFriction = 1;
			contactMaterial.friction = bodyFriction;	
		}
	}
	
	//Jumping and gravity
	if( !isJumping ) {											//the player is not jumping
	//Gravity
		if( gravity >= GRAVITYMAX){								//is the player falling faster than terminal?
			if(gravity != GRAVITYMAX) gravity = GRAVITYMAX;		//clamp gravity	
		} else {
			gravity = GRAVITYMAX * (currentTime - stopTime);	//increase magnitude of gravity
		} 
		this.body.velocity.y = gravity * this.body.mass;		//apply gravity
	//Jumping
	} else {													//player is jumping
		var timeLeft = jumpDelay - currentTime;					//time left until the jump cancels
		if( timeLeft < jumpThreshold ) {						//is the time left withing the threshold?
			stopJump();											//cancel jump
		} else {
			//apply upward motion with a curve.  It starts fast and slows at the top of the jump.  Increased mass will decrease the power of the jump
			this.body.velocity.y = (-1 * jumpSpeed * timeLeft) / this.body.mass;	
		}

	}

	//if the user is pressing right and left at the same time, stop movement
	if(buttons.left.isDown && buttons.right.isDown){
		this.body.velocity.x = 0;
	}
	//Movement + setting direction the player is currently facing (for ramming direction)
	if(buttons.left.isDown){
		playerFaceLeft = true;
		playerFaceRight = false;
		this.body.moveLeft(moveSpeed / this.body.mass * airFriction);
		player.play('left');
	}
	if(buttons.right.isDown){
		playerFaceLeft = false;
		playerFaceRight = true;
		this.body.moveRight(moveSpeed / this.body.mass * airFriction);
		//player.play('right');
	}
	//added up arrow key for testing (also to get out of holes...)
	if(buttons.up.isDown){
		this.body.moveUp(moveSpeed / this.body.mass * airFriction);
		player.play('jump');
	}


	//checking if jump was started and if player is touching ground
	if(jumpVar == true && touchingDown(this.body)){
		console.info("landed");

		//creating emitter where the player is currently standing (offsetting to spawn right at the player's feet)
		emitter = game.add.emitter(this.x, (this.y + 100), 200);
		emitter.makeParticles(['dustParticle']);

		//(explode, lifespan, frequency, quantity, forceQuantity)
		emitter.start(true, 200, 20, 20, 20);
		jumpVar = false;
	}

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
	}

	return result;
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

//Start Jump if the player is not on the ground and is not currently jumping
//jump.onDown callback
jump = function(){
	console.info("Jump started\n");

	if(isJumping) return;					//if player is in the middle of a jump, do nothing
	if(!touchingDown(this.body)) return; 	//if player is not on the ground, do nothing
	isJumping = true;						//start jump
	jumpTimer = this.game.time.totalElapsedSeconds();	//current time in seconds
	jumpDelay = jumpTimer + jumpTime;					//jump stops after "jumpTime" seconds

	//console.info("jumping");
}
//Stops the current jump
//jump.onUp callback
stopJump = function(){
	//setting jumpVar to true
	jumpVar = true;
	console.info("Jump ending\n");
	if( !isJumping ) return;							//if the player is not currently jumping, do nothing
	isJumping = false;									//player is not jumping
	gravity = 200;										//reset gravity
	stopTime = this.game.time.totalElapsedSeconds();	//get the time when the jump was stopped
}
ram = function(){
	//outputting ramming info
	console.info("ramming\n");
	console.info("facing right: " + playerFaceRight + "\n");
	console.info("facing left: " + playerFaceLeft + "\n");
	//checking direction of player and adding a 'burst' of velocity in that direction
	if(playerFaceLeft == true){
		this.body.velocity.x = -1000;
	}
	else {
		this.body.velocity.x = 1000;
	}
}
defend = function(){
	console.info("Defending");
}
