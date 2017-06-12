'use strict';

/*
	@resourceMax: the maximum amount the Resource can hold
	@resourceName: the name of the resource stored. Used to check what is being extracted
*/
var Resource = function(game, x, y, key, frame, emitterSprite, resourceMax, resourceName)
{
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	// Custom properties
	this.resourceMax = resourceMax;
	this.resourceCurrent = resourceMax; // Default to full of resource
	this.resourceName = resourceName;
	this.particlesToEmmit = 0;
	
	// Emitter
	this.emitter = game.add.emitter(x, y);
	this.emitter.particleClass = ResourceParticle;
	this.emitter.width = this.width;
	this.emitter.height = this.height;
	//Emitter physics
	this.emitter.enableBody = true;
	this.emitter.physicsBodyType = Phaser.Physics.ARCADE;
	this.emitter.gravity.set(0, -100);
	// Emitter setup
	this.emitter.makeParticles(emitterSprite);
	this.emitter.setXSpeed(-100, 100);
	this.emitter.setYSpeed(-10, 100);
};

// Inherit prototype from Phaser.Sprite and set constructor
// The Object.create method creates a new object with the specified prototype object and properties
Resource.prototype = Object.create(Phaser.Sprite.prototype);
// Since we used Object.create, we need to explicitly set the constructor
Resource.prototype.constructor = Resource;  

// Takes @amount out of the Resource and returns it
Resource.prototype.getResource = function(amount)
{
	var amountTaken = amount;
	// Take resource
	this.resourceCurrent -= amount;
	
	// Get a partial amount of resource
	if (this.resourceCurrent < 0)
	{
		if (this.resourceCurrent >= -amount)
		{
			// We took some 
			amountTaken += this.resourceCurrent;
		}
			else
		{
			// None left
			amountTaken = 0;
		}
		
		// We took them all
		this.resourceCurrent = 0;
	}
	
	this.updateSprite();
	
	this.emitResource(amountTaken);
	
	return amountTaken;
}

// Update the sprite after taking resources
Resource.prototype.updateSprite = function() {
	this.alpha = this.resourceCurrent / this.resourceMax;
	
}

// Visually emits @amount number of resource
Resource.prototype.emitResource = function(amount) {
	this.particlesToEmmit += amount;
	if (this.particlesToEmmit >= 1) {
		this.emitter.explode(5000, this.particlesToEmmit);
		this.particlesToEmmit = 0;
	}
}
