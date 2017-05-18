//Input Variable
var buttons;					//object to hold KeyCode properties

//collision Variables
var headCollision;				//shape for head
var bodyCollision;				//shape for body
var legsCollision;				//shape for legs

//Physics Variable
var gravity = 400;				//magnitude of gravity
var moveSpeed = 200;			//magnitude of lateral speed

//Physics Flags
var isJumping;

/**
*Player prefab constructor
*
*@game: reference to game prototype
*@key: reference to spritesheet
*@frame: initial frame
*@buttonObj: reference to button keyCodes object [up, down, left ,right, jump, ram, defend]
*@collisionGroup: reference to the collision bitmask
*/
function Player(game, x, y, key, frame, buttonObj, collisionGroups){

	//call to Phaser.Sprite //new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);

	//Physics
	if (debug) {
		game.physics.p2.enable(this, true);
	} else {
		game.physics.p2.enable(this);										//enable physics for player		
	}
	this.enableBody = true;												//enable body for physics calculations
	this.body.enableGravity = false;									//disable world gravity: gravity will be handled locally
	this.body.fixedRotation = true;										//restrict rotation				
	//this.body.setCollisionGroup(collisionGroups.playerCollisionGroup);	//set the collision group
	this.body.restitution = 0.5;										//collision restitution
	this.body.clearShapes();											//clear all collision shapes
	isJumping = false;													//player is not jumping

	//Create Capsule for leg collision
	//capsule is 1/3h x 1/3w of the sprite size and centered on x origin and positioned against the y upper bound
	this.body.addCapsule(this.width / 3, this.height / 3, 0, this.height * (1/6));

	//Input mapping
	buttons = game.input.keyboard.addKeys(buttonObj);					//Sets all the input keys for this prototype
	buttons.ram.onDown.add(ram, this);									//captures the first frame of the jumpKey press event
	buttons.jump.onDown.add(jump, this);								//captures the first frame of the ramKey press event

	game.camera.follow(this);											//attach the camera to the player
	game.add.existing(this);											//add this Sprite prefab to the game cache
}

Player.prototype = Object.create(Phaser.Sprite.prototype);				//create prototype of type Player
Player.prototype.constructor = Player;									//set constructor function name

/**
*Override the player update function
*/
Player.prototype.update = function(){

	//if the Player is not in the middle of a jump, gravity is applied to this body
	if( !isJumping ) this.body.velocity.y = gravity * this.body.mass;

	//Movement
	if(buttons.left.isDown){
		this.body.moveLeft(moveSpeed / this.body.mass);
	}
	if(buttons.right.isDown){
		this.body.moveRight(moveSpeed / this.body.mass);
	}

	//Defend
	if(buttons.defend.isDown){
		defend();
	}

}

/**
*Mechanic functions
*/
jump = function(){
	console.info("jumping");
}
ram = function(){
	console.info("ramming");
}
defend = function(){
	console.info("Defending");
}
