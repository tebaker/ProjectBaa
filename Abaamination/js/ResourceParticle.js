'use strict';

var ResourceParticle = function(game, x, y, key, frame)
{
  Phaser.Particle.call(this, game, x, y, key, frame);
  
  this.acceleration = 2;
  this.maxVelocity = 200;
  this.destroyRadius = 50;
  this.target = player;
};

// Inherit prototype from Phaser.Particle and set constructor
ResourceParticle.prototype = Object.create(Phaser.Particle.prototype);
// Since we used Object.create, we need to explicitly set the constructor
ResourceParticle.prototype.constructor = ResourceParticle;  

ResourceParticle.prototype.update = function()
{
  var newVelocity = new Phaser.Point(player.centerX - this.x, player.centerY - this.y).setMagnitude(this.acceleration);
  this.body.velocity = Phaser.Point.add(this.body.velocity, newVelocity);
  // this.body.velocity.set()
  if (this.body.velocity.getMagnitude() > this.maxVelocity) {
    this.body.velocity.setMagnitude(this.maxVelocity);
  }
  
  if (Phaser.Point.distance(this.position, new Phaser.Point(player.centerX, player.centerY)) < this.destroyRadius) {
    this.kill();
  }
}
