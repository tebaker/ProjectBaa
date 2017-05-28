'use strict';

/*
	@resourceMax: the maximum amount the Resource can hold
	@resourceName: the name of the resource stored. Used to check what is being extracted
*/
var Resource = function(game, x, y, key, frame, resourceMax, resourceName)
{
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	// Custom properties
	this.resourceMax = resourceMax;
	this.resourceCurrent = resourceMax; // Default to full of resource
	this.resourceName = resourceName;
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
	
	return amountTaken;
}

// Update the sprite after taking resources
Resource.prototype.updateSprite = function() {
	this.alpha = this.resourceCurrent / this.resourceMax;
	
}
