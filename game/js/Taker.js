'use strict';

// Constructor
var Taker = function(game, x, y, key, frame, player)
{
	// call Sprite constructor within this object
	// new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game, x, y, key, frame);
	
  // Animation
  this.animations.add('wave', Phaser.ArrayUtils.numberArray(0, 30), 30);
	this.animations.add('idle', Phaser.ArrayUtils.numberArray(31, 42), 30);
	this.animations.add('take', Phaser.ArrayUtils.numberArray(43, 56), 15);
	
	this.anchor.set(0.5, 0.5);
	
	// // Custom properties
	this.currentState = this.idleState;
	this.player = player;
	this.takeDistance = this.width - 250;
	this.isTaking = false;
	
	// Add to game
	game.add.existing(this);
};

// Inherit prototype from Phaser.Sprite and set constructor
// The Object.create method creates a new object with the specified prototype object and properties
Taker.prototype = Object.create(Phaser.Sprite.prototype);
// Since we used Object.create, we need to explicitly set the constructor
Taker.prototype.constructor = Taker;  

// Override the Phaser.Sprite update function
Taker.prototype.update = function()
{
	// Update state
	this.currentState = this.idleState;
	if (this.playerDistance() < this.takeDistance)
	{
		// Take if near player
		this.currentState = this.takingState;
	}
	
	// Call the current state function
	this.currentState();
}

// Called every update when in the idle state
Taker.prototype.idleState = function()
{
	this.playAnimation('idle');
}

// Called every update when in the idle state
Taker.prototype.takingState = function()
{
	this.playAnimation('take');
	if (!this.isTaking) {
		// Execute once when first taking
		this.game.camera.fade(0x000000, 2000);
		this.game.camera.unfollow();
		this.isTaking = true;
		this.game.camera.onFadeComplete.add(function() {
			game.state.start('EndWin');
		}, this);
	}
	
}

Taker.prototype.playAnimation = function(animationName) {
	var animation = this.animations.getAnimation(animationName);
	if (!this.animations.currentAnim.isPlaying)
	{
		animation.play(animationName);
	}
}

// Returns the distance to the player in px
Taker.prototype.playerDistance = function()
{
	return Phaser.Point.distance(this, player);
}
