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
	//this.scale.x = 1;
	//this.scale.y = 1;
	//resizePolygon('playerCollision', 'playerCollisionADJ', 'player', 1);	

	//orientation flags
	this.playerFaceLeft = false;
	this.playerFaceRight = false;

	//emitter variables
	this.emitter = null;
	this.jumpVar = false;		//checking if a jump has started

	//Physics Variable
	this.GRAVITYMAX = 500;			//maximum magnitude of gravity
	this.gravity = 500;				//current magnitude of gravity
	this.stopTime;					//timer used to create gravity acceleration
	this.moveSpeed = 350;			//magnitude of lateral speed
	this.airFriction = 1;			//slow movement while in the air
	this.AFM = 0.6;					//slow movement speed by 40% while not on the ground
	this.bodyFriction = 0.5;			//friction between tiles and this body

	//Physics Flags
	this.jumpDelay = 0;				//when should the player stop jumping
	this.jumpTimer = 0;				//how long has the player been jumping
	this.jumpTime = 1;				//the length of time in seconds of one jump
	this.jumpSpeed = 500;			//velocity of the upward motion
	this.jumpThreshold = .1;			//if time left until end of jump < jumpThreshhold, cancel jump

	//Physics
	game.physics.p2.enable(this);										//enable physics for player

	this.enableBody = true;												//enable body for physics calculations
	this.body.enableGravity = false;									//disable world gravity: gravity will be handled locally
	this.body.fixedRotation = true;										//restrict rotation

	this.body.clearShapes();											//clear all collision shapes
	this.body.loadPolygon('playerCollision', 'player');				//set polygon data as collision
	this.body.setCollisionGroup(cg.pCG);								//set the collision group (playerCollisionGroup)
	this.body.collides([cg.tCG, cg.eCG, cg.rCG])						//player collides with these groups
	this.body.collideWorldBounds = true;								//player collides with edges of the screen
	this.material = game.physics.p2.createMaterial('material', this.body);	//create new material

	//create contact properties between player and tiles
	this.contactMaterial = game.physics.p2.createContactMaterial(this.material, mg.tileMaterial);
	this.contactMaterial.friction = this.bodyFriction;
	this.contactMaterial.restitution = 0;
	this.contactMaterial.surfaceVelocity = 0;

	this.isJumping = false;													//player is not jumping

	//Input mapping
	this.buttons = game.input.keyboard.addKeys(buttonObj);					//Sets all the input keys for this prototype
	this.buttons.ram.onDown.add(this.ram, this);									//captures the first frame of the jumpKey press event
	this.buttons.jump.onDown.add(this.jump, this);								//captures the first frame of the ramKey press event
	this.buttons.jump.onUp.add(this.stopJump, this);
	
	//set button callbacks to create movement acceleration curve
	this.buttons.right.onDown.add(this.startRun, this);
	this.buttons.left.onDown.add(this.startRun, this);


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
	
	if( !this.touchingDown( this.body )) {
		if( this.airFriction != this.AFM ){ 
			this.airFriction = this.AFM;
			this.contactMaterial.friction = 0.0;
		} 
	} else {
		if( this.airFriction != 1){
			this.airFriction = 1;
			this.contactMaterial.friction = this.bodyFriction;	
		}
	}
	
	//Jumping and gravity
	if( !this.isJumping ) {											//the player is not jumping
	//Gravity
		if( this.gravity >= this.GRAVITYMAX){								//is the player falling faster than terminal?
			if(this.gravity != this.GRAVITYMAX) this.gravity = this.GRAVITYMAX;		//clamp gravity	
		} else {
			this.gravity = this.GRAVITYMAX * (currentTime - this.stopTime);	//increase magnitude of gravity
		} 
		this.body.velocity.y = this.gravity * this.body.mass;		//apply gravity
	//Jumping
	} else {													//player is jumping
		var timeLeft = this.jumpDelay - currentTime;					//time left until the jump cancels
		this.play('jump');
		if( timeLeft < this.jumpThreshold ) {						//is the time left withing the threshold?
			stopJump();											//cancel jump
		} else {
			//apply upward motion with a curve.  It starts fast and slows at the top of the jump.  Increased mass will decrease the power of the jump
			this.body.velocity.y = (-1 * this.jumpSpeed * timeLeft) / this.body.mass;	
		}

	}

	//if the user is pressing right and left at the same time, stop movement
	if(this.buttons.left.isDown && this.buttons.right.isDown){
		this.body.velocity.x = 0;
	}
	//Movement + setting direction the player is currently facing (for ramming direction)
	if(this.buttons.left.isDown){
		this.playerFaceLeft = true;
		this.playerFaceRight = false;
		this.body.moveLeft(this.moveSpeed / this.body.mass * this.airFriction);
		if(!this.isJumping && this.touchingDown( this.body )) this.play('left');
	}
	if(this.buttons.right.isDown){
		this.playerFaceLeft = false;
		this.playerFaceRight = true;
		this.body.moveRight(this.moveSpeed / this.body.mass * this.airFriction);
		if(!this.isJumping && this.touchingDown( this.body )) this.play('left');
	}
	//added up arrow key for testing (also to get out of holes...)
	if(this.buttons.up.isDown){
		//testing playing a random sound
		// var rndSound = new RandomSound('sound');

		this.body.moveUp(this.moveSpeed / this.body.mass * this.airFriction);
		this.play('jump');
	}


	//checking if jump was started and if player is touching ground
	if(this.jumpVar == true && this.touchingDown(this.body)){
		//console.info("landed");

		//creating emitter where the player is currently standing (offsetting to spawn right at the player's feet)
		this.emitter = game.add.emitter(this.x, (this.y + 100), 200);
		this.emitter.makeParticles(['dustParticle']);

		//(explode, lifespan, frequency, quantity, forceQuantity)
		this.emitter.start(true, 200, 20, 20, 20);
		this.jumpVar = false;
	}

	//Defend
	if(this.buttons.defend.isDown){
		this.defend();
	}
	//console.info(this.touchingDown(this.body));
	//console.info(this.isJumping);

}
//Resize a polygon Json file.  The polygon needs to be resized before it is applied to the body and 
//the string associated with newPhysicsKey must be used. 
Player.prototype.resizePolygon = function(originalPhysicsKey, newPhysicsKey, shapeKey, scale){

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
Player.prototype.touchingDown = function(player) {    
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
Player.prototype.startRun = function(){

}
Player.prototype.stopRun = function(){

}
/**
*Mechanic functions
*/

//Start Jump if the player is not on the ground and is not currently jumping
//jump.onDown callback
Player.prototype.jump = function(){
	//console.info("Jump started\n");

	if(this.isJumping) return;					//if player is in the middle of a jump, do nothing
	if(!this.touchingDown(this.body)) return; 	//if player is not on the ground, do nothing
	this.isJumping = true;						//start jump
	this.jumpTimer = this.game.time.totalElapsedSeconds();	//current time in seconds
	this.jumpDelay = this.jumpTimer + this.jumpTime;					//jump stops after "jumpTime" seconds

	//console.info("jumping");
}
//Stops the current jump
//jump.onUp callback
Player.prototype.stopJump = function(){
	//setting this.jumpVar to true
	this.jumpVar = true;
	//console.info("Jump ending\n");
	if( !this.isJumping ) return;							//if the player is not currently jumping, do nothing
	this.isJumping = false;									//player is not jumping
	this.gravity = 200;										//reset gravity
	this.stopTime = this.game.time.totalElapsedSeconds();	//get the time when the jump was stopped
}
Player.prototype.ram = function(){
	//outputting ramming info
	//console.info("ramming\n");
	//console.info("facing right: " + this.playerFaceRight + "\n");
	//console.info("facing left: " + this.playerFaceLeft + "\n");
	//checking direction of player and adding a 'burst' of velocity in that direction
	if(this.playerFaceLeft == true){
		this.body.velocity.x = -1000;
	}
	else {
		this.body.velocity.x = 1000;
	}
}
Player.prototype.defend = function(){
	console.info("Defending");
}
