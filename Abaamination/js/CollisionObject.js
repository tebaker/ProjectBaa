'use strict';

function CollisionObject( game, state, shapeKey, shapeObject, collisionGr, collidesWith, x, y, type){
	//call to Phaser.Sprite //new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y);
	//Physics
	game.physics.p2.enable(this, debug);							//enable physics for player

	this.enableBody = true;										//enable body for physics calculations

	this.body.clearShapes();									//clear all collision shapes
	this.body.loadPolygon(shapeKey, shapeObject);				//set polygon data as collision
	this.anchor.setTo(0.5, 0.5);
	this.body.setCollisionGroup(collisionGr);					//set the collision group (playerCollisionGroup)
	this.body.onBeginContact.add(this.hit, this);				//on beginning collision contact
	this.body.collideWorldBounds = true;						//player collides with edges of the screen
	this.body.gravity = [0,0];									//disable world gravity: gravity will be handled locally
	this.body.kinematic = true;
	this.body.fixedRotation = true;								//restrict rotation							
	this.type = type;
	this.state = state;
}

/**							**Define Prefab**
*/
CollisionObject.prototype = Object.create(Phaser.Sprite.prototype);		//create prototype of type Player
CollisionObject.prototype.constructor = CollisionObject;				//set constructor function name

/**								**Update**
*/
CollisionObject.prototype.update = function(){
	console.info(this.body.velocity.x, this.body.velocity.y);
}
CollisionObject.prototype.hit = function(bodyA, bodyB){
	this.state.madeContact( bodyA, bodyB, this.type );		//might be able to trigger a method in the parent prototype?
}
