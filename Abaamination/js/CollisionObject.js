


function CollisionObject( type, shapeKey, shapeObject, collisionGr, collidesWith, x, y, parent){
	//call to Phaser.Sprite //new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y);

	//Physics
	game.physics.p2.enable(this, true);							//enable physics for player

	this.enableBody = true;										//enable body for physics calculations
	this.body.enableGravity = false;							//disable world gravity: gravity will be handled locally
	this.body.fixedRotation = true;								//restrict rotation

	this.body.clearShapes();									//clear all collision shapes
	this.body.loadPolygon(shapeKey, shapeObject);				//set polygon data as collision
	this.body.setCollisionGroup(collisionGr);					//set the collision group (playerCollisionGroup)
	this.body.onBeginContact.add(hit, this);					//on beginning collision contact
	this.body.collideWorldBounds = true;						//player collides with edges of the screen
	this.parent = parent;										//this allows access to the parent of this object							
	this.type = type;
}

/**							**Define Prefab**
*/
CollisionObject.prototype = Object.create(Phaser.Sprite.prototype);		//create prototype of type Player
CollisionObject.prototype.constructor = CollisionObject;				//set constructor function name

/**								**Update**
*/
CollisionObject.prototype.update = function(){

}
function hit(bodyA, bodyB){
	this.parent.madeContact( bodyA, bodyB, type );		//might be able to trigger a method in the parent prototype?
}

