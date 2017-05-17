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
	
	//set button callbacks to 
	buttons.right.onDown.add(startRun, this);
	buttons.right.onUp(stopRun, this);
	buttons.left.onDown.add(startRun, this);
	buttons.left.onUp.add(stopRun, this)


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

	//if the user is pressing right and left at the same time, stop movement
	if(buttons.left.isDown && buttons.right.isDown) this.body.velocity.x = 0;
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
	console.info("jumping");
}
ram = function(){
	console.info("ramming");
}
defend = function(){
	console.info("Defending");
}
