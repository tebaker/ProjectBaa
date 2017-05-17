//Input Variable
var buttons;					//object to hold KeyCode properties

//collision Variables
var headCollision;				//shape for head
var bodyCollision;				//shape for body
var legsCollision;				//shape for legs

//Physics Variable
var gravity = 400;				//magnitude of gravity
var moveSpeed = 400;			//magnitude of lateral speed

//Physics Flags
var isJumping;

/**
*Player prefab constructor
*
*@game: reference to game prototype
*@key: reference to spritesheet
*@frame: initial frame
*@buttonObj: reference to button keyCodes object [up, down, left ,right, jump, ram, defend]
*@cg: collisionGroup: reference to the collision bitmask
*/
function Player(game, x, y, key, frame, buttonObj, cg){

	//call to Phaser.Sprite //new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);
	this.scale.x = .5;
	this.scale.y = .5;	

	//Physics
	game.physics.p2.enable(this, true);										//enable physics for player		
	this.enableBody = true;												//enable body for physics calculations
	this.body.enableGravity = false;									//disable world gravity: gravity will be handled locally
	this.body.fixedRotation = true;										//restrict rotation	
	this.body.clearShapes();											//clear all collision shapes
	isJumping = false;													//player is not jumping

	resizePolygon('playerCollision', 'playerCollisionADJ', 'player', 0.5);

	this.body.loadPolygon('playerCollisionADJ', 'player');


	console.log(this.body.debug);	
	this.body.setCollisionGroup(cg.pCG);					//set the collision group (playerCollisionGroup)
	this.body.collides([cg.tCG, cg.eCG, cg.rCG])
	this.body.collideWorldBounds = true;
	this.body.restitution = 0.5;										//collision restitution


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
function resizePolygon(originalPhysicsKey, newPhysicsKey, shapeKey, scale){
	var newData = [];
	var data = this.game.cache.getPhysicsData(originalPhysicsKey, shapeKey);
	for (var i = 0; i < data.length; i++) {
		var vertices = [];
		for (var j = 0; j < data[i].shape.length; j += 2) {
			vertices[j] = data[i].shape[j] * scale;
			vertices[j+1] = data[i].shape[j+1] * scale; 
		}newData.push({shape : vertices});
	}var item = {};
	item[shapeKey] = newData;game.load.physics(newPhysicsKey, '', item);
	//
	//debugPolygon(newPhysicsKey, shapeKey);
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
