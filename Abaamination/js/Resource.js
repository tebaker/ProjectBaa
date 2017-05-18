'use strict';

/*
	@resourceMax: the maximum amount the Resource can hold
	@resourceName: the name of the resource stored. Used to check what is being extracted
	@resourceThresholds: an optional array of decreasing percentages corresponding to when certain
											 frames should be shown.
	                     So [0.3, 0.2, 0.1] would show frame 0 when there are more than 30% left,
	                     1 between 30% and 21% resources, frame 2 for 20%-11%, and frame 3 for 10% or less.
	                     Note that applying an atlas/spritesheet as the key is the only tested method,
	                     adding an animation has not been tested.
*/
var Resource = function(game, x, y, key, frame, resourceMax, resourceName, resourceThresholds)
{
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	// Custom properties
	this.resourceMax = resourceMax;
	this.resourceCurrent = resourceMax; // Default to full of resource
	this.resourceName = resourceName;
	this.resourceThresholds = resourceThresholds;
	
	// Add to game
	game.add.existing(this);
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
	// If resource thresholds exist
	if (this.resourceThresholds != null)
	{
		var currentPercent = this.resourceCurrent / this.resourceMax;
		console.log(currentPercent);
		// Default
		for (var i = 0; i < this.resourceThresholds.length; i++)
		{
			if (this.resourceThresholds[i] < currentPercent)
			{
				// Set to first match
				this.frame = i;
				return;
			}
		}
		
		// Else off the bottom
		this.frame = this.resourceThresholds.length;
	}
}
