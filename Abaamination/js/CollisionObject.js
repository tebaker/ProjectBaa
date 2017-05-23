

function CollisionObject( shape, collisionGroup){

}

/**							**Define Prefab**
*/
CollisionObject.prototype = Object.create(Phaser.Sprite.prototype);		//create prototype of type Player
CollisionObject.prototype.constructor = CollisionObject;				//set constructor function name

/**								**Update**
*/
CollisionObject.prototype.update = function(){

}