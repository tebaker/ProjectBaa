'use strict';

// Constructor
var Resource = function(game, x, y, key, frame, maxResource, resourceName)
{
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	// Custom properties
	this.resource = maxResource;
	
	// Add to game
	game.add.existing(this);
};

// Inherit prototype from Phaser.Sprite and set constructor
// The Object.create method creates a new object with the specified prototype object and properties
Resource.prototype = Object.create(Phaser.Sprite.prototype);
// Since we used Object.create, we need to explicitly set the constructor
Resource.prototype.constructor = Resource;  
