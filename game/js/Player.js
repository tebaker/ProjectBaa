/**
*Player prefab constructor
*
*@game: reference to game prototype
*@key: reference to spritesheet
*@frame: initial frame
*@buttonObj: reference to button keyCodes object [up, down, left ,right, jump, ram, defend]
*@cg: collisionGroup: reference to the collision bitmask
*/

function Player(game, x, y, key, frame, buttonObj, cgIn, mg, resources){
	//call to Phaser.Sprite //new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);

	var heart;
	this.heart = game.add.audio('heart', 1, true, true);
	this.heart.allowMultiple = false;
	this.heart.addMarker('full', 0, 14.4,  true);
	this.heart.addMarker('mid', 14.4, 11.3, true);
	this.heart.addMarker('half', 25.8, 10.1, true);
	this.heart.addMarker('low', 35.9, 10.1, true);

	//im lookin for a heartbeattttt
   	//for creating audio sprite objects
	var heart;
	this.heart = game.add.audio('heart', 1, true, true);
	this.heart.allowMultiple = false;
	this.heart.addMarker('full', 0, 14.4,  true);
	this.heart.addMarker('mid', 14.4, 11.3, true);
	this.heart.addMarker('half', 25.8, 10.1, true);
	this.heart.addMarker('low', 35.9, 10.1, true);

	//Player stats
	this.stamina = 100;				
	this.health = 100;
	this.STA_MAX = 100;
	this.STA_THRESHOLD = 25;
	this.STA_STEP = .1;
	this.staConst = .2;
	this.HP_MAX = 100;
	
	// Enemy-player interaction
	this.enemyDamage = 20; // Resources lost when hit by an enemy
	this.invincible = false; // Can't take damage while true
	this.invincibleTime = 5; //Number of seconds of invincibility after being hit

	//Orientation flags
	this.playerFaceLeft = true;

	//Physics Variables
	this.GRAVITYMAX = 1000;			//maximum magnitude of gravity
	this.gravity = 100;				//current magnitude of gravity
	this.gravityConst = 0.1;		//gravity scalar
	this.stopTime = 0;				//timer used to create gravity acceleration
	this.moveSpeed = 20;			//magnitude of lateral speed
	this.airFriction = 1;			//slow movement while in the air
	this.AFM = 0.6;					//slow movement speed by 40% while not on the ground

	//Jumping variables
	this.isJumping = false;							//is player jumping?
	this.jumpDelay = 0;								//when should the player stop jumping
	this.startTime= 0;								//how long has the player been jumping
	this.jumpTime = .7;								//the length of time in seconds of one jump
	this.jumpSpeed = 60;							//velocity of the upward motion
	this.jumpThreshold = .05;						//if time left until end of jump < jumpThreshhold, cancel jump
	this.jumpVar = false;							//checking if a jump has started
	this.jumpAniTimer = game.time.create(false);	//jump timer for animation events
	this.hasJumped = false;							//did the player complete a jump?

	//Sprinting variables
	this.SPRINT_MAX_SPD = this.moveSpeed * 2;	//max sprint speed
	this.SPRINT_ANI_SPD = 90;					//animation speed while sprinting
	this.WALK_ANI_SPD = 30;						//animation speed while walking
	this.isSprinting = false;					//is the player sprinting?
	this.sprintSPD = 0;							//current velocity increase
	this.sprintACC = 5;							//acceleration
	this.dashConst = 1;							//change the speed of the sprint
	this.staStep = 1;							//change the duration of the sprint
	this.isDashing = false;						//is the player performing an In-Air dash?

	//defense variables
	this.isDefending = false;		//is the player defending?
	this.defendSTACost = .5;			//the stamina cost to defend
	this.hasBeenHit = false;		//has the player come in contact with enemy?
	this.blinkTimer = false;

	// Resource variables
	this.resources = resources;
	this.resourceDistance = 200; 				//Needs to be this close to resources to gather them
	this.maxResource = 100;						//The maximum amount of resource you can carry
	this.currentResource = 75;	//The current amount of recourse you are carrying
	this.resourceGatherPerFrame = 0.1;			//The number of resource gathered per second
	this.resourceDrain = 0.75; 					//Amount or resource lost/second
	this.resourceDrainTimer = game.time.create(this);
	this.resourceDrainTimer.loop(1000, this.decreaseResource, this, this.resourceDrain);
	this.resourceDrainTimer.start();
	
	// Emitter
	this.resourceEmitter = game.add.emitter(x, y);
	this.resourceEmitter.width = 1;
	this.resourceEmitter.height = 1;
	//Emitter physics
	this.resourceEmitter.enableBody = true;
	this.resourceEmitter.physicsBodyType = Phaser.Physics.ARCADE;
	this.resourceEmitter.gravity.set(0, -50);
	// Emitter setup
	this.resourceEmitter.makeParticles('resourceParticle');
	this.resourceEmitter.setXSpeed(-50, 50);
	this.resourceEmitter.setYSpeed(0, 50);
	// Emitter variables
	this.resourceEmitterCounter = 0;

	//Physics
	game.physics.p2.enable(this, debug);									//enable physics for player

	this.enableBody = true;													//enable body for physics calculations
	this.body.gravity = [0,0];												//disable world gravity: gravity will be handled locally
	this.body.fixedRotation = true;											//restrict rotation
	this.anchor.setTo(0.5, 0.5);
	this.cg = cgIn;

	this.body.clearShapes();												//clear all collision shapes
	this.body.loadPolygon('playerCollision', 'player');						//set polygon data as collision
	this.body.setCollisionGroup(this.cg.pCG);								//set the collision group (playerCollisionGroup)
	this.body.collides([this.cg.tCG, this.cg.eCG, this.cg.rCG])				//player collides with these groups

	this.body.createGroupCallback(this.cg.eCG, this.enemyHitDef, this);		//Collision callback when player collides with an enemy

	this.body.collideWorldBounds = true;									//player collides with edges of the screen
	this.material = game.physics.p2.createMaterial('material', this.body);	//create new material

	//create contact properties between player and tiles
	this.contactMaterial = game.physics.p2.createContactMaterial(this.material, mg.tileMaterial);
	this.contactMaterial.friction = 0.6;
	this.contactMaterial.frictionStiffness = 1e7;
	this.contactMaterial.restitution = 0;
	this.contactMaterial.surfaceVelocity = 0;

	//create left and jump animations right coming soon!
	this.idleAni = this.animations.add('idle', Phaser.ArrayUtils.numberArray(92, 106), 13, true, true);
	this.walkAni = this.animations.add('walk', Phaser.ArrayUtils.numberArray(0,51), this.WALK_ANI_SPD, true, true);
	this.sprintAni = this.animations.add('sprint', Phaser.ArrayUtils.numberArray(0,51), 60, true, true);
	this.dashAni = this.animations.add('dash', Phaser.ArrayUtils.numberArray(107, 116), 44, false, true);
	this.dashRevAni = this.animations.add('dashRev', Phaser.ArrayUtils.numberArrayStep(116, 107, -1), 44, false, true);
	//this.decendAni = this.animations.add('decend', Phaser.ArrayUtils.numberArrayStep(72, 52, -1), 20, false, true);
	this.defendAni = this.animations.add('defend', Phaser.ArrayUtils.numberArray(107, 116), 45, false, true);
	this.standAni = this.animations.add('stand', Phaser.ArrayUtils.numberArrayStep(116, 107, -1), 60, false, true);
	//this.landAni = this.animations.add('land', Phaser.ArrayUtils.numberArrayStep(75, 67, -1), 32, false, true);
	this.jumpAni = this.animations.add('jump', Phaser.ArrayUtils.numberArray(53, 75), 23, false, true);
	//this.jumpAni.onComplete.add(this.startDescent, this);

	//Input mapping
	this.buttons = game.input.keyboard.addKeys(buttonObj);				//Sets all the input keys for this prototype

	this.buttons.sprint.onDown.add(this.startSprint, this);				//captures the first frame of the ramKey press event
	this.buttons.sprint.onUp.add(this.stopSprint, this);				//End the ramming action

	this.buttons.jump.onDown.add(this.jump, this);						//captures the first frame of the jumpKey press event
	this.buttons.jump.onUp.add(this.jumpRelease, this);					//end the jumping action

	this.buttons.defend.onDown.add( this.startDefend, this);			//captures the first frame of the defendKey press event
	this.buttons.defend.onUp.add( this.stopDefend, this);				//end defending action

	//set button callbacks reverse the direction of the player
	this.buttons.right.onDown.add(this.walkRight, this);
	this.buttons.right.onUp.add(this.stopWalk, this);
	this.buttons.left.onDown.add(this.walkLeft, this);
	this.buttons.left.onUp.add(this.stopWalk, this);

	this.hud = new HUD( game );
	this.hud.changeHP( this.currentResource / this.maxResource );
	game.camera.follow(this, Phaser.Camera.FOLLOW_PLATFORMER);			//attach the camera to the player
	game.camera.roundPX = false;										//optimizes camera movement
	game.add.existing(this);											//add this Sprite prefab to the game cache
}
/**							**Define Prefab**
*/
Player.prototype = Object.create(Phaser.Sprite.prototype);	//create prototype of type Player
Player.prototype.constructor = Player;						//set constructor function name

/**
*							**Update Function**
*/

Player.prototype.update = function(){
	this.resourceEmitter.x = this.world.x;
	this.resourceEmitter.y = this.world.y;
	if(!this.heart.isPlaying){
		if(this.currentResource >= this.maxResource)
		{
			this.heart.play('full');
			//console.log('full');
		}
		else if (this.currentResource >= (this.maxResource*.75))
		{
			this.heart.play('mid');
			//console.log('mid');
		}
		else if(this.currentResource >= (this.maxResource*.25))
		{
			this.heart.play('half');
			//console.log('half');
		}
		else if(this.currentResource < (this.maxResource)*.25)
		{
			this.heart.play('low');
			//console.log('low');
		}
	}


	//console.info( " PST: ", game.time.elapsedMS);					//time delta between each update
	if( this.standAni.isPlaying ) return;
	//if( this.landAni.isPlaying) return;

	if( this.isDefending ) {										//is the player defending?
		this.defend();												//make defense action
		return;														//if player is defending, prevent any updates from taking place
	}
	/**
	//if the user performed a whole jump, the player will hit the ground curled up
	//the player will then stand back to idle before movement can take place.
	if( touchingDown( this.body ) && this.hasJumped ){
		this.hasJumped = false;
		this.body.velocity.x = 0;
		this.landAni.play();
		return;
	}*/

	var currentTime = this.game.time.totalElapsedSeconds();			//game time that has passed (paused during pause state)
	
	this.updateAirFriction( this.body );							//does air friction need to be applied?
	if ( this.isBlinking ) this.blink();			
	if(this.isSprinting){											//is the player ramming?
		this.sprint( this.body );									//perform ram step
		return;														//drop out of update so no more action will be taken.(prevents movement from input, jump and gravity)
	}
	if( this.stamina < this.STA_MAX ) 								//is stamina less than full?
		this.stamina += this.STA_STEP * game.time.elapsed * this.staConst;			//increase stamina by one step

	if( this.stamina > this.STA_MAX ) this.stamina = this.STA_MAX;	//cap stamina
	this.hud.changeSTA( this.stamina / this.STA_MAX );				//change sta bar
	if(this.hasBeenHit == true) return;
	this.applyVerticalVelocity( this.body, currentTime);			//apply velocity to the players vertical axis
	this.updateInput( this.body, this.buttons );					//update user input and move player

	// Check for resources
	var closestResource = this.resources.getClosestTo(this);
	if (Math.abs(Phaser.Point.distance(this, closestResource)) <= this.resourceDistance) {
		this.getResource(closestResource);
	}


	//console.info(touchingDown(this.body));
	//console.info(isJumping);
}

/**								
*								**Movement**	
*/

/**								**Input**
*/
//Check for input each update cycle
Player.prototype.updateInput = function( body, buttons ){

	if(buttons.left.isDown){

		//move this body to the left relative to a constant physics timestep
		body.moveLeft(((this.moveSpeed) * this.airFriction) * game.time.elapsed);

		//is the player is not jumping and the is on the ground: player walking animation
		if(!this.isJumping && touchingDown( body )) this.play('walk');

	} else if(buttons.right.isDown){
		//move this body to the right relative to a constant physics timestep
		body.moveRight(((this.moveSpeed) * this.airFriction) * game.time.elapsed);

		//is the player is not jumping and the is on the ground: player walking animation
		if(!this.isJumping && touchingDown( body )) this.play('walk');

	} else if(buttons.up.isDown){
		body.moveUp(((this.moveSpeed) * this.airFriction) * game.time.elapsed);
		this.jumpAni.play(true);

	} else if(!this.isJumping && touchingDown( body )){
		this.play('idle');
	}
}
/**						**Player orientation**
*/
//Right key onDown callback
Player.prototype.walkRight = function(){
	if( this.hasBeenHit ) return;									//stop orientation change if player has been hit
	if( this.isSprinting ) return;									//stop orientation change if sprinting
	if( this.isDefending ) return;									//stop orientation change if defending
	if( this.hasBeenHit ) return;									//stop orientation change if player has been hit

	this.playerFaceLeft = false;									//set orientation
	if(this.buttons.left.isDown ) this.buttons.left.reset(false);	//if the left key is down, reset it
	if( this.scale.x > 0 ) this.scale.x *= -1;						//if the sprite is not facing right, switch it to right
}

Player.prototype.walkLeft = function(){
	if( this.hasBeenHit ) return;									//stop orientation change if player has been hit
	if( this.isSprinting ) return;									//stop orientation change if sprinting
	if( this.isDefending ) return;									//stop orientation change if defending
	if( this.hasBeenHit  )	return;									//stop orientation change if player has been hit

	this.playerFaceLeft = true;										//set orientation
	if(this.buttons.right.isDown ) this.buttons.right.reset(false);	//if the right key is down, reset it
	if( this.scale.x < 0) this.scale.x *= -1;						//if the sprite is not facing left, switch it to left
}

Player.prototype.stopWalk = function(){
	this.body.velocity.x = 0;
}

/**							**In Air Physics**
*/
//Determine if gravity or jump force is applied to this body
Player.prototype.applyVerticalVelocity = function( body, time ){

	var velY = this.gravity;
	if( !this.isJumping && !touchingDown( this.body ) ) {			//if the player is not jumping
	//Set Gravity: gravity magnitude has a direct relationship the the amount of time the player has been falling
		if( this.gravity < this.GRAVITYMAX){
			this.gravity = this.GRAVITYMAX * (time - this.stopTime);
		}
		if( this.gravity >= this.GRAVITYMAX ){
			if( this.gravity != this.GRAVITYMAX ) this.gravity = this.GRAVITYMAX;
		}
		velY = this.gravity * this.gravityConst;
	//Jumping
	} else if( this.isJumping ) {												//the player is jumping
		var timeLeft = this.jumpDelay - time;				//the time left until the jump cancels
		if( timeLeft < this.jumpThreshold ) {				//is the time left withing the threshold?
			this.stopJump();								//cancel jump														
			velY = this.gravity * this.gravityConst;		//restart gravity after jump ends	
		} else {
			//apply upward motion with a curve.  
			//It starts fast and slows at the top of the jump.  
			//Increased mass will decrease the power of the jump
			velY = ((-1 * this.jumpSpeed * timeLeft));	
		}
	} else {
		velY = 5;
	}
	velY *= this.game.time.elapsed;	//final velocity calculation
	if( velY > this.GRAVITYMAX ) velY = this.GRAVITYMAX;		//cap velocity on y
	this.body.velocity.y = velY;								//set velocity on y

}
//If player is not on the ground, apply "air friction" to slow lateral movement
Player.prototype.updateAirFriction = function( body, isInAir, airFriction, AFM, contactMaterial ){
	if( !touchingDown( body )) {							//is player in the air?
		if( this.airFriction != this.AFM ){ 				//has airFriction been activated?
			this.isInAir = true;							//player is no longer on the ground
			this.airFriction = this.AFM;					//activate air friction
			this.contactMaterial.friction = 0.1;			//set friction with tiles to zero so player wont stick to walls
		} 
	} else {												//is player on the ground?
		if( this.airFriction != 1){							//has airFriction been decativated?
			this.fireLandingDustEmmiter( body );			//start the dust emmiter when player touches ground
			this.airFriction = 1;							//deactivate airFriction
			this.contactMaterial.friction = 0.6;			//restore tile friction so player wont slide on tiles
		}
	}
}

/**
*									**Special Effects**
*/
Player.prototype.fireLandingDustEmmiter = function( body ){
	//creating emitter where the player is currently standing (offsetting to spawn right at the player's feet)
	this.emitter = game.add.emitter(body.x, (body.y + 188), 200);
	this.emitter.makeParticles(['dustParticle']);

	//(explode, lifespan, frequency, quantity, forceQuantity)
	this.emitter.start(true, 200, 20, 20, 20);
	this.jumpVar = false;
}
/**
*									**Mechanic functions**
*/

/**				Jumping Methods			
*/
//Start Jump if the player is not on the ground and is not currently jumping
//jump.onDown callback
Player.prototype.jump = function(){

	//Conditions for no jump
	if( this.hasBeenHit ) return;							//if player has been hit, do nothing
	if( this.standAni.isPlaying) return;					//if player is standing from a fall, do nothing
	if( this.isDefending ) return;							//if player is defending, do nothing
	if(!touchingDown(this.body)) return; 					//if player is not on the ground, do nothing
	if(this.isJumping) return;								//if player is in the middle of a jump, do nothing
	if(this.isSprinting) return;							//if player is sprinting, do nothing

	//console.info( jumpAniTimer.running );
	//Jump animation timer allows the animation to continue running if the user 
	//releases button early.  It just makes for a smoother looking jump animation.
	//To see it work, just tap the jump button at different intervals. 
	if( this.jumpAniTimer.running){							//is the jump Animation timer playing?
		this.jumpAniTimer.stop(false);						//Stop jump Animation timer
	}

	this.jumpAni.play(false);								//Start jup animation	
	this.isJumping = true;									//start jump
	this.startTime = this.game.time.totalElapsedSeconds();	//current time in seconds
	this.jumpDelay = this.startTime + this.jumpTime;		//jump stops after "jumpTime" seconds

	//console.info("jumping");
}
//Stops the current jump
Player.prototype.stopJump = function(){

	if( !this.isJumping ) return;							//if the player is not currently jumping, do nothing
	this.stopTime = this.game.time.totalElapsedSeconds();	//get the time when the jump was stopped
	this.isJumping = false;									//player is not jumping
	this.gravity = this.GRAVITYMAX * (1/3);					//reset gravity
}

//if the ascent animation has finished, start descent animation
Player.prototype.startDescent = function(){
	//this.decendAni.play();
	this.hasJumped = true;
}

//stop all jump animations
Player.prototype.stopAnimation = function(){
	this.jumpAni.stop();
	 
}

//jump onUp callback: if the user releases the button early, stop the animation early
Player.prototype.jumpRelease = function(){
	if(!this.isJumping) return;	//if player is not jumping, do nothing

	//console.info("time of button press: ", this.game.time.totalElapsedSeconds() - startTime);

	//timed event to stop jump animation
	this.jumpAniTimer.add(Phaser.Timer.SECOND * .6, this.stopAnimation, this );
	this.jumpAniTimer.start();	//start animation delay timer
	
	this.stopJump();	//stop jump physics
	
}

/**				Ramming Methods
*/
//Attack button: onDown callback
Player.prototype.startSprint = function(){

	if( this.hasBeenHit ) return;					//disable sprint if player has been hit
	if(this.isSprinting) return;					//if the player is already attacking, do nothing
	if(this.stamina < this.STA_THRESHOLD) return;	//if the player's stamina is too low, do nothing

	if(this.isJumping) this.stopJump();				//if the player is jumping, stop jump
	this.isSprinting = true;						//start the attack
	this.sprintSPD = 0;								//reset the ramming speed increase
	this.body.velocity.y - 0;						//stop gravity

	if( touchingDown(this.body)){					//if player is on the ground
		this.walkAni.speed = this.SPRINT_ANI_SPD;	//increase walk animation speed
		this.dashConst = 1;							//set sprint speed
		this.staStep = 1;							//set sprint duration
		if(!this.walkAni.isPlaying) 				//if walk amimation is not playing
			this.walkAni.play();					//play walk animation

	} else {										//if player is not on the ground
		this.isDashing = true;						//set player is dashing
		this.dashAni.play(false);					//play air dash animation
		this.dashConst = 1.5;						//set dash speed
		this.staStep = 3;							//set dash duration
	}
}

//Sprint button: onHold callback
Player.prototype.sprint = function( body ){				
	var dashStep = this.STA_STEP * this.staStep;			//set dash duration
	var dashMax = this.SPRINT_MAX_SPD * this.dashConst;		//set dash speed
	this.stamina -= dashStep * this.game.time.elapsed;		//reduce stamina by one step
	if ( this.isDashing ) body.velocity.y = 0;				//negate gravity if player is performing in air dash
	if (this.sprintSPD + this.moveSpeed < dashMax)			//has the player reached the maximum attack speed?
		this.sprintSPD += this.sprintACC * this.dashConst;	//increase ram speed

	this.hud.changeSTA( this.stamina / this.STA_MAX);

	var moveStep = ((this.moveSpeed) * this.airFriction);	//move step before boost
	var boostStep = moveStep + this.sprintSPD;				//move step after boost
	var aniFPS = boostStep / moveStep;						//ratio to control animations FPS(as the player moves faster, the animation plays faster)
	
	if( this.stamina <= 0 ){	//if the player has run out of stamina, stop the attack
	this.stopSprint();			//stop sprint
	return;						//cancel any further action
	} 

	if( this.playerFaceLeft ){
		body.moveLeft( boostStep * this.game.time.elapsed );	//move player left at a faster speed
	} else {
		body.moveRight( boostStep * this.game.time.elapsed );	//move player right at a faster speed
	}
}
Player.prototype.revDashAni = function(){
	this.dashAni.stop();
	this.dashRevAni.play(false);
}

//Sprint button: onUp callback
Player.prototype.stopSprint = function(){
	if(!this.isSprinting) return;					//if the player is not ramming, then do nothing
	if( this.isDashing ){							//if the player is dashing
		this.revDashAni();							//reverse dash animation
		this.isDashing = false;						//set dashing to false
	}
	this.walkAni.speed = this.WALK_ANI_SPD;			//reset walk speed animation
	this.body.velocity.x = 5;						//halt velocity
	this.isSprinting = false;						//stop the movement

	//make sure orientation is correct
	if(this.buttons.left.isDown) this.walkLeft();	
	if(this.buttons.right.isDown) this.walkRight(); 
}

/**				Defending Methods
*/

//defend button onDown callback
Player.prototype.startDefend = function(){

	if( this.hasBeenHit ) return;					//stop orientation change if player has been hit
	if(!touchingDown( this.body )) return;			//if player is not touching the ground, do nothing

	if( this.stamina <= this.STA_THRESHOLD){		//is the player stamina too low to defend?
		//
		//behavior for a defend(hide) failure, can add in an animaton and a sound or something
		//
	} else {
		this.body.velocity.x = 0;							//stop movement on the x axis when defend mechanic is initiated
		this.defendAni.play();								//play the defend animation
		this.body.removeCollisionGroup(this.cg.eCG, true);	//remove enemies from the player collision group
		this.isDefending = true;							//player is now defending( interupts input and gravity while active)		
	}
}
//defend button onHold callback
Player.prototype.defend = function(){
	//console.info("isDefending: STA: ", this.stamina);
	if( this.stamina <= 0) {
		this.stopDefend();
	} else {
		this.stamina -= this.defendSTACost;	//reduce stamina while player is defending
	}
	this.hud.changeSTA( this.stamina / this.STA_MAX);
}
//defend button onUp callback
Player.prototype.stopDefend = function(){
	//console.info("'End Defend");

	if( !this.isDefending ) return;			//if player is not defending, then return
	this.standAni.play();
	this.isDefending = false;				//cancel defend
	this.body.collides(this.cg.eCG);		//enable collision calculations for enemies
	this.body.createGroupCallback(this.cg.eCG, this.enemyHitDef, this);			//Collision callback when player collides with an enemy

}

//Callback when the player comes in contact with an enemy
Player.prototype.enemyHitDef = function( player, enemy){
	if(this.isBlinking) return;									//if the player is already blinking, do nothing
	this.body.velocity.y = 0; this.body.velocity.x = 0;			//stop any movement
	this.body.removeCollisionGroup( this.cg.eCG );				//remove enemies from the player collision group
	this.game.input.reset(false);								//reset all input keys and stop any furture callbacks
	this.hasBeenHit = true;										//prevent input for a short time after injury
	this.decreaseResource(this.enemyDamage);					//decrease the player resource
	var dirOfHit = enemy.x - player.x;							//direction from the player to the enemy
	dirOfHit /= Math.abs(dirOfHit);								//normalize the direction of the hit( -1 left/ 1 right)
	this.body.applyImpulseLocal([dirOfHit * 25, 35], 0, 1);		//apply inpuse away from hit
	this.isBlinking = true;										//enable blinking effect
	this.blinkTimer = false;									//start the blinking effect timer
	//for one second, disable input
	this.game.time.events.add(Phaser.Timer.SECOND * 1.2, this.allowInput, this);			//disable input for one second
	this.game.time.events.add(Phaser.Timer.SECOND * 5, this.finishHit, this);		//make player invicible for 5 seconds

}
//call back to toggle input after a hit
Player.prototype.allowInput = function(){
	this.hasBeenHit = false;						//allow for input
	this.game.input.reset( false );					//reset input

}
//callback to finish the hasBeenHit event
Player.prototype.finishHit = function(){
	this.isBlinking = false;													//stop blinking
	if( this.alpha != 1) this.alpha = 1;										//reset alpha
	this.blinkTimer = true;														//stop the timer for the blink effect
	this.body.collides( this.cg.eCG );											//reinitialize collision with enemies
	this.body.createGroupCallback(this.cg.eCG, this.enemyHitDef, this);			//Collision callback when player collides with an enemy
}
//toggle the alpha of the sprite, ,so that it will blink
Player.prototype.blink = function(){
	if(this.blinkTimer) return;													//if the blink timer is running, do nothing

	//alternate between full alpha and no alpha to create a blinking effect
	if( this.alpha == 0){
		this.alpha = 1;
	} else{
		this.alpha = 0;
	}
	this.blinkTimer = true;
	this.game.time.events.add(Phaser.Timer.SECOND * 0.25, this.switch, this);
}
Player.prototype.switch = function(){
	this.blinkTimer = false;
}
/*
		Resource Methods
*/
// Call to add resources to the player
Player.prototype.getResource = function(resource) {
	var available = this.maxResource - this.currentResource;
	// If room for more resource
	if (available > 0) {
		if (available < this.resourceGatherPerFrame) {
			// Nearly full, so take less than max resources
			this.currentResource += resource.getResource(available);
		} else {
			this.currentResource += resource.getResource(this.resourceGatherPerFrame);
		}
		this.hud.changeHP( this.currentResource / this.maxResource );
		//console.log("Resource = "+this.currentResource);
	}
}

// Call to remove resources from the player
Player.prototype.decreaseResource = function(amount) {
	this.currentResource -= amount;
	this.resourceEmitterCounter += amount;
	//console.log("Resource = "+this.currentResource);
	if (this.resourceEmitterCounter >= 1) {
		// Emit resources when one or more has decreased
		this.resourceEmitter.explode(3000, Math.floor(this.resourceEmitterCounter));
		this.resourceEmitterCounter = 0;
	}
	this.hud.changeHP( this.currentResource / this.maxResource );
	
	if (this.currentResource < 0) {
		// Fade to black when out of resources
		this.fadeToDeath();
	}
}

/*
		Misc.
*/
// Call when the player dies
Player.prototype.fadeToDeath = function() {
	this.game.camera.fade(0x000000, 2000);
	this.game.camera.unfollow();
	this.game.camera.onFadeComplete.add(function() {
		game.state.start('EndLose');
	}, this);
}
