'use strict';

// Constructor
var Enemy = function(game, x, y, key, frame, player, maxSpeed)
{
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	// Properties
	this.anchor.set(0.5, 0);
	
	// // Physics
	game.physics.enable(this, Phaser.Physics.ARCADE); // enable physics
	
	// // Custom properties
	this.currentState = this.idleState;
	this.maxSpeed = maxSpeed;
	this.player = player;
	this.chasingDistance = 700;
	this.attackingDistance = 300;
	
	// Add to game
	game.add.existing(this);
};

// Inherit prototype from Phaser.Sprite and set constructor
// The Object.create method creates a new object with the specified prototype object and properties
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
// Since we used Object.create, we need to explicitly set the constructor
Enemy.prototype.constructor = Enemy;  

// Override the Phaser.Sprite update function
Enemy.prototype.update = function()
{
	var dist = this.playerDistance();
	if (dist < this.chasingDistance)
	{
		// Chase when near player
		this.currentState = this.chasingState;
		
		if (dist < this.attackingDistance)
		{
			// Attack if next to player
			this.currentState = this.attackingState;
		}
	}
	 else
	 {
	 	// Idle when player is not around
		this.currentState = this.idleState;
	}
	
	// Call the current state function
	this.currentState();
	
	// Update sprite direction
	if (this.body.velocity.x > 0)
	{
		this.scale.x = -1;
	} else if (this.body.velocity.x < 0)
	{
		this.scale.x = 1;
	}
}

// Returns the distance to the player in px
Enemy.prototype.playerDistance = function()
{
	return Phaser.Point.distance(this, player);
}

// Called every update when in the attacking state
Enemy.prototype.attackingState = function()
{
	this.body.velocity.x = 0;
}

// Called every update when in the chasing state
Enemy.prototype.chasingState = function()
{
	if (this.x - player.x > 0)
	{
		this.body.velocity.x = -this.maxSpeed;
	} else
	{
		this.body.velocity.x = this.maxSpeed;
	}
}

// Called every update when in the idle state
Enemy.prototype.idleState = function()
{
	this.body.velocity.x = 0;
}
