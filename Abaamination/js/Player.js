
/**
*Player prefab constructor
*
*@game: reference to game prototype
*@key: reference to spritesheet
*@frame: initial frame
*@buttonObj: reference to button keyCodes object [up, down, left ,right, jump, ram, defend]
*@cg: collisionGroup: reference to the collision bitmask
*/
function Player(game, x, y, key, frame, buttonObj, cgIn, mg){
	//Player stats
	this.stamina = 100;				
	this.health = 100;
	this.STA_MAX = 100;
	this.STA_THRESHOLD = 10;
	this.STA_STEP = .2;
	this.HP_MAX = 100;

	//Orientation flags
	this.playerFaceLeft = false;

	//Physics Variables
	this.GRAVITYMAX = 50;			//maximum magnitude of gravity
	this.gravity = 5;				//current magnitude of gravity
	this.stopTime = 0;				//timer used to create gravity acceleration
	this.moveSpeed = 20;			//magnitude of lateral speed
	this.airFriction = 1;			//slow movement while in the air
	this.AFM = 0.6;					//slow movement speed by 40% while not on the ground
	this.bodyFriction = 1;		//friction between tiles and this body

	//Jumping variables
	this.isJumping = false;							//is player jumping?
	this.jumpDelay = 0;								//when should the player stop jumping
	this.startTime= 0;								//how long has the player been jumping
	this.jumpTime = 1.1;							//the length of time in seconds of one jump
	this.jumpSpeed = 30;							//velocity of the upward motion
	this.jumpThreshold = .1;						//if time left until end of jump < jumpThreshhold, cancel jump
	this.jumpVar = false;							//checking if a jump has started
	this.jumpAniTimer = game.time.create(false);	//jump timer for animation events
	this.hasJumped = false;							//did the player complete a jump?

	//Attack variables
	this.isSprinting = false;		//is the player attacking?
	this.sprintSPD = 0;				//current velocity increase
	this.sprintACC = 5;				//acceleration
	this.RAM_MAX_SPEED;				//max attack speed
	this.RAM_SPD_RATIO = 1.75;		//max attack speed = movespeed * ratio
	this.ramColPoly = null;			//holds the collision polygon while attacking

	//defense variables
	this.isDefending = false;		//is the player defending?
	this.defendSTACost = 1;			//the stamina cost to defend

	//call to Phaser.Sprite //new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);

	//Scale the player sprite and resize the polygon collision data
	//this.scale.x = 1;
	//this.scale.y = 1;
	//resizePolygon('playerCollision', 'playerCollisionADJ', 'player', 1);	

	//Physics
	game.physics.p2.enable(this);											//enable physics for player

	this.enableBody = true;													//enable body for physics calculations
	this.body.gravity = [0,0];												//disable world gravity: gravity will be handled locally
	this.body.fixedRotation = true;											//restrict rotation
	this.anchor.setTo(0.5, 0.5);
	this.cg = cgIn;

	this.body.clearShapes();												//clear all collision shapes
	this.body.loadPolygon('playerCollision', 'player');						//set polygon data as collision
	this.body.setCollisionGroup(this.cg.pCG);								//set the collision group (playerCollisionGroup)
	this.body.collides([this.cg.tCG, this.cg.eCG, this.cg.rCG])				//player collides with these groups
	this.body.collideWorldBounds = true;									//player collides with edges of the screen
	this.material = game.physics.p2.createMaterial('material', this.body);	//create new material

	//create contact properties between player and tiles
	this.contactMaterial = game.physics.p2.createContactMaterial(this.material, mg.tileMaterial);
	this.contactMaterial.friction = this.bodyFriction;
	this.contactMaterial.restitution = 0;
	this.contactMaterial.surfaceVelocity = 0;

	//create left and jump animations right coming soon!
	this.idleAni = this.animations.add('idle', Phaser.ArrayUtils.numberArray(93, 107), 13, true, true);
	this.walkAni = this.animations.add('walk', Phaser.ArrayUtils.numberArray(0,51), 30, true, true);
	this.sprintAni = this.animations.add('sprint', Phaser.ArrayUtils.numberArray(0,51), 60, true, true);
	this.dashAni = this.animations.add('dash', Phaser.ArrayUtils.numberArray(106, 117), 44, false, true);
	//this.dashAni.onComplete.add(this.revDashAni, this);
	this.dashRevAni = this.animations.add('dashRev', Phaser.ArrayUtils.numberArrayStep(117, 106, -1), 44, false, true);
	//this.decendAni = this.animations.add('decend', Phaser.ArrayUtils.numberArrayStep(72, 52, -1), 20, false, true);
	this.defendAni = this.animations.add('defend', Phaser.ArrayUtils.numberArray(76, 92), 45, false, true);
	this.standAni = this.animations.add('stand', Phaser.ArrayUtils.numberArrayStep(92, 69, -1), 60, false, true);
	//this.landAni = this.animations.add('land', Phaser.ArrayUtils.numberArrayStep(75, 67, -1), 32, false, true);
	this.jumpAni = this.animations.add('jump', Phaser.ArrayUtils.numberArray(52, 75), 23, false, true);
	//this.jumpAni.onComplete.add(this.startDescent, this);

	//Input mapping
	this.buttons = game.input.keyboard.addKeys(buttonObj);				//Sets all the input keys for this prototype

	this.buttons.sprint.onDown.add(this.startSprint, this);				//captures the first frame of the ramKey press event
	this.buttons.sprint.onUp.add(this.stopSprint, this);				//End the ramming action
	this.RAM_MAX_SPEED = this.moveSpeed * this.RAM_SPD_RATIO;			//set the max speed of the ram attack

	this.buttons.jump.onDown.add(this.jump, this);						//captures the first frame of the jumpKey press event
	this.buttons.jump.onUp.add(this.jumpRelease, this);					//end the jumping action

	this.buttons.defend.onDown.add( this.startDefend, this);			//captures the first frame of the defendKey press event
	this.buttons.defend.onUp.add( this.stopDefend, this);				//end defending action

	//set button callbacks reverse the direction of the player
	this.buttons.right.onDown.add(this.walkRight, this);
	this.buttons.right.onUp.add(this.stopWalk, this);
	this.buttons.left.onDown.add(this.walkLeft, this);
	this.buttons.left.onUp.add(this.stopWalk, this);

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
					
	if(this.isSprinting){											//is the player ramming?
		this.sprint( this.body );									//perform ram step
		return;														//drop out of update so no more action will be taken.(prevents movement from input, jump and gravity)
	}
	if( this.stamina < this.STA_MAX ) 								//is stamina less than full?
		this.stamina += this.STA_STEP * game.time.elapsed;			//increase stamina by one step

	if( this.stamina > this.STA_MAX ) this.stamina = this.STA_MAX;	//cap stamina

	this.applyVerticalVelocity( this.body, currentTime);			//apply velocity to the players vertical axis

	this.updateInput( this.body, this.buttons );					//update user input and move player


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
		body.moveLeft(((this.moveSpeed / body.mass) * this.airFriction) * game.time.elapsed);

		//is the player is not jumping and the is on the ground: player walking animation
		if(!this.isJumping && touchingDown( body )) this.play('walk');

	} else if(buttons.right.isDown){
		//move this body to the right relative to a constant physics timestep
		body.moveRight(((this.moveSpeed / body.mass) * this.airFriction) * game.time.elapsed);

		//is the player is not jumping and the is on the ground: player walking animation
		if(!this.isJumping && touchingDown( body )) this.play('walk');

	} else if(buttons.up.isDown){
		body.moveUp(((this.moveSpeed / body.mass) * this.airFriction) * game.time.elapsed);
		this.jumpAni.play(true);

	} else if(!this.isJumping && touchingDown( body )){
		this.play('idle');
	}
}
/**						**Walking direction**
*/
//Right key onDown callback
Player.prototype.walkRight = function(){
	if( this.isSprinting ) return;									//stop orientation change if sprinting
	if( this.isDefending ) return;									//stop orientation change if defending
	this.playerFaceLeft = false;									//set orientation
	if(this.buttons.left.isDown ) this.buttons.left.reset(false);	//if the left key is down, reset it
	if( this.scale.x > 0 ) this.scale.x *= -1;						//if the sprite is not facing right, switch it to right
}

Player.prototype.walkLeft = function(){
	if( this.isSprinting ) return;									//stop orientation change if sprinting
	if( this.isDefending ) return;									//stop orientation change if defending
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

	if( !this.isJumping ) {														//the player is not jumping
//Gravity
		if( this.gravity >= this.GRAVITYMAX){									//is the player falling faster than terminal?
			if(this.gravity != this.GRAVITYMAX) this.gravity = this.GRAVITYMAX;	//clamp gravity	
		} else {
			this.gravity = this.GRAVITYMAX * ((time - this.stopTime));			//increase magnitude of gravity
		} 
		body.velocity.y = (this.gravity * body.mass) * this.game.time.elapsed;	//apply gravity
//Jumping
	} else {																	//player is jumping
		var timeLeft = this.jumpDelay - time;									//time left until the jump cancels
		if( timeLeft < this.jumpThreshold ) {									//is the time left withing the threshold?
			this.stopJump();													//cancel jump
			body.velocity.y = this.gravity * body.mass * this.game.time.elapsed;//restart gravity after jump ends	
		} else {
			//apply upward motion with a curve.  
			//It starts fast and slows at the top of the jump.  
			//Increased mass will decrease the power of the jump
			body.velocity.y = ((-1 * this.jumpSpeed * timeLeft) / body.mass) * this.game.time.elapsed;	
		}

	}
}
//If player is not on the ground, apply "air friction" to slow lateral movement
Player.prototype.updateAirFriction = function( body, isInAir, airFriction, AFM, contactMaterial ){
	if( !touchingDown( body )) {								//is player in the air?
		if( this.airFriction != this.AFM ){ 					//has airFriction been activated?
			this.isInAir = true;								//player is no longer on the ground
			this.airFriction = this.AFM;						//activate air friction
			this.contactMaterial.friction = 0.0;				//set friction with tiles to zero so player wont stick to walls
		} 
	} else {													//is player on the ground?
		if( this.airFriction != 1){								//has airFriction been decativated?
			this.fireLandingDustEmmiter( body );				//start the dust emmiter when player touches ground
			this.airFriction = 1;								//deactivate airFriction
			this.contactMaterial.friction = this.bodyFriction;	//restore tile friction so player wont slide on tiles
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
	if( this.standAni.isPlaying) return;					//if player is standing from a fall, do nothing
	//if( this.landAni.isPlaying) return;						//if player is landing from a jump, do nothing
	if( this.isDefending ) return;							//if player is defending, do nothing
	if(!touchingDown(this.body)) return; 					//if player is not on the ground, do nothing
	if(this.isJumping) return;								//if player is in the middle of a jump, do nothing

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
	
	this.stopJump();				//stop jump physics
	
}

/**				Ramming Methods
*/
//Attack button: onDown callback
Player.prototype.startSprint = function(){
	if(this.isSprinting) return;					//if the player is already attacking, do nothing
	if(this.stamina < this.STA_THRESHOLD) return;	//if the player's stamina is too low, do nothing

	if(this.isJumping) this.stopJump();				//if the player is jumping, stop jump
	this.isSprinting = true;						//start the attack
	this.sprintSPD = 0;								//reset the ramming speed increase
	this.body.velocity.y - 0;						//stop gravity
	if( touchingDown(this.body)){					//is the player standing on the ground?
		this.sprintAni.play(true);					//if yes, sprint
	} else {
		this.dashAni.play(false);					//if no, dash
	}

}
Player.prototype.revDashAni = function(){
	this.dashAni.stop();
	this.dashRevAni.play(false);
}
//Attack button: onUp callback
Player.prototype.stopSprint = function(){
	if(!this.isSprinting) return;					//if the player is not ramming, then do nothing
	if(!this.sprintAni.isPlaying) this.revDashAni();//if the dash animation is player, then reverse it
	this.isSprinting = false;						//stop the attack
}
//Attack button: onHold callbackq
Player.prototype.sprint = function( body ){
	if( this.stamina <= 0 ) this.stopSprint(); 							//if the player has run out of stamina, stop the attack

	this.stamina -= this.STA_STEP * this.game.time.elapsed;				//reduce stamina by one step
	if( body.velocity.y != 0) body.velocity.y = 0;						//dont let the player fall!
	if (this.sprintSPD + this.moveSpeed < this.RAM_MAX_SPEED)			//has the player reached the maximum attack speed?
		this.sprintSPD += this.sprintACC;								//increase ram speed
	var moveStep = ((this.moveSpeed / body.mass) * this.airFriction);	//move step before boost
	var boostStep = moveStep + this.sprintSPD;							//move step after boost
	var aniFPS = boostStep / moveStep;									//ratio to control animations FPS(as the player moves faster, the animation plays faster)
	
	if( this.playerFaceLeft ){
		body.moveLeft( boostStep * this.game.time.elapsed );			//move player left at a faster speed
	} else {
		body.moveRight( boostStep * this.game.time.elapsed );			//move player right at a faster speed
	}
}

/**				Defending Methods
*/

//defend button onDown callback
Player.prototype.startDefend = function(){

	if(!touchingDown( this.body )) return;			//if player is not touching the ground, do nothing

	if( this.stamina <= this.STA_THRESHOLD){		//is the player stamina too low to defend?
		//
		//behavior for a defend(hide) failure, can add in an animaton and a sound or something
		//
	} else {
		this.defendAni.play();
		this.body.removeCollisionGroup(this.cg.eCG, true);
		this.isDefending = true;					//player is now defending( interupts input and gravity while active)		
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
}
//defend button onUp callback
Player.prototype.stopDefend = function(){
	//console.info("'End Defend");

	if( !this.isDefending ) return;			//if player is not defending, then return
	this.standAni.play();
	this.isDefending = false;				//cancel defend
	this.body.collides(this.cg.eCG);		//enable collision calculations for enemies

}
//This function is called by any collision objects that are children of this body
Player.prototype.madeContact = function( bodyA, bodyB, type){
	console.info("madeContact fired");
	if( type =- 'ramCollision') this.ramCollision( ramCollision, bodyB );
	if( type == 'wombCollision') this.wombCollision( wombCollision, bodyB );

}
Player.prototype.ramCollision = function( bodyA, bodyB){
	console.info("ramCollision fired");
}
Player.prototype.wombCollision = function( bodyA, bodyB){
	console.info("wombCollision fired");
}

