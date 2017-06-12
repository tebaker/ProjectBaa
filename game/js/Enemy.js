'use strict';

// Constructor
var Enemy = function(game, x, y, key, frame, player, cg)
{
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
	// Scale
	this.scale.x = 0.3;
	this.scale.y = 0.3;
	
    // Animation
	this.animations.add('shake', Phaser.ArrayUtils.numberArray(0, 20), 30);
	this.animations.add('attack', Phaser.ArrayUtils.numberArray(21, 57), 30);
	
	// // Physics
	game.physics.enable(this, Phaser.Physics.P2JS, debug); // enable physics
	this.body.setRectangle(this.width - 10, this.height - 30, 0, 30); //Temporary
	this.body.enableGravity = true;
	this.body.fixedRotation = true;
	this.body.setCollisionGroup( cg.eCG );
	this.body.collides([cg.pCG, cg.tCG]);
	
	// // Custom properties
	this.currentState = this.idleState;
	this.player = player;
	this.attackingDistance = 500;
	this.attackVelocityX = 300;
	this.attackVelocityY = -800;
	this.hitPlayer = false;
	this.doNothing = false;
	
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
	// Check if hit the player
	if (this.hitPlayer) {
		this.hitPlayer = false;
		this.doNothing = true;
		game.time.events.add(Phaser.Timer.SECOND * 1.5, function() {
			this.doNothing = false;
		}, this);
	}
	
	// Update state
	this.currentState = this.idleState;
	if (this.playerDistance() < this.attackingDistance)
	{
		// Attack if next to player
		this.currentState = this.attackingState;
	}
	
	// Call the current state function
	this.currentState();
}

// Returns the distance to the player in px
Enemy.prototype.playerDistance = function()
{
	return Phaser.Point.distance(this, player);
}

// Called every update when in the attacking state
Enemy.prototype.attackingState = function()
{
	var animation = this.animations.getAnimation('attack');
	if (this.frame == 0 && !this.doNothing) {
		// Start attack
		animation.play('attack');
		
		// Set direction towards player
		var angleTo = this.worldPosition.angle(player.worldPosition);
		var playerIsLeft = angleTo < Math.PI / 2 && angleTo < Math.PI / -2;
		this.setDirection(playerIsLeft);
		
		// Launch forward
		if (playerIsLeft)
		{
			this.body.velocity.x = -this.attackVelocityX;
		} else
		{
			this.body.velocity.x = this.attackVelocityX;
		}
		this.body.velocity.y = this.attackVelocityY;
	} else if (animation.isFinished) {
		this.frame = 0;
		animation.setFrame(0, true);
	}
}

Enemy.prototype.setDirection = function(isLeft) {
	if (isLeft)
	{
		this.scale.x = Math.abs(this.scale.x);
	} else
	{
		this.scale.x = Math.abs(this.scale.x) * -1;
	}
}

// Called every update when in the idle state
Enemy.prototype.idleState = function()
{
	this.body.velocity.x = 0;
}
