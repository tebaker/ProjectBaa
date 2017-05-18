/**
*Player prefab constructor
*
*@game: reference to game prototype
*@key: reference to spritesheet
*@frame: initial frame
*@buttonObj: reference to button keyCodes object [up, down, left ,right, jump, ram, defend]
*@collisionGroup: reference to the collision bitmask
*/
function Player(game, x, y, key, frame, buttonObj, collisionGroups)
{
	//call to Phaser.Sprite //new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);

	//Physics
	if (debug)
	{
		game.physics.p2.enable(this, true);
	} else
	{
		game.physics.p2.enable(this);										//enable physics for player		
	}
	this.enableBody = true;												//enable body for physics calculations
	this.body.enableGravity = false;									//disable world gravity: gravity will be handled locally
	this.body.fixedRotation = true;										//restrict rotation				
	//this.body.setCollisionGroup(collisionGroups.playerCollisionGroup);	//set the collision group
	this.body.restitution = 0.5;										//collision restitution
	this.body.clearShapes();											//clear all collision shapes
	this.isJumping = false;													//player is not jumping
	this.gravity = 400;				//magnitude of gravity
	this.moveSpeed = 200;			//magnitude of lateral speed
	
	//Create Capsule for leg collision
	//capsule is 1/3h x 1/3w of the sprite size and centered on x origin and positioned against the y upper bound
	this.body.addCapsule(this.width / 3, this.height / 3, 0, this.height * (1/6));

	//collision Variables
	this.headCollision = null;				//shape for head
	this.bodyCollision = null;				//shape for body
	this.legsCollision = null;				//shape for legs

	//Input mapping
	this.buttons = game.input.keyboard.addKeys(buttonObj);					//Sets all the input keys for this prototype
	this.buttons.ram.onDown.add(this.ram, this);									//captures the first frame of the jumpKey press event
	this.buttons.jump.onDown.add(this.jump, this);								//captures the first frame of the ramKey press event

	game.camera.follow(this);											//attach the camera to the player
	game.add.existing(this);											//add this Sprite prefab to the game cache
}

Player.prototype = Object.create(Phaser.Sprite.prototype);				//create prototype of type Player
Player.prototype.constructor = Player;									//set constructor function name

/**
*Override the player update function
*/
Player.prototype.update = function()
{
	//if the Player is not in the middle of a jump, gravity is applied to this body
	if( !this.isJumping ) this.body.velocity.y = this.gravity * this.body.mass;

	//Movement
	if(this.buttons.left.isDown){
		this.body.moveLeft(this.moveSpeed / this.body.mass);
	}
	if(this.buttons.right.isDown){
		this.body.moveRight(this.moveSpeed / this.body.mass);
	}

	//Defend
	if(this.buttons.defend.isDown){
		defend();
	}
}

/**
*Mechanic functions
*/
Player.prototype.jump = function()
{
	console.info("jumping");
}
Player.prototype.ram = function()
{
	console.info("ramming");
}
Player.prototype.defend = function()
{
	console.info("Defending");
}
