'use strict';

function HUD( game ){
	//call to Phaser.Sprite //new Sprite(game, x, y, key, frame)
	Phaser.Sprite.call(this, game );
	//Hit points bar
	this.hp = game.add.sprite( window.innerWidth / 3 , window.innerHeight / 30, 'hpJuice');
	this.hpBar = game.add.sprite( this.hp.x - 12, this.hp.y - 3, 'statBar');
	this.hp.fixedToCamera = true;
	this.hpBar.fixedToCamera = true;
	this.hpWidth = this.hp.width;
	this.hpHeight = this.hp.height;
	this.hp.cropEnabled = true;

	//stamina bar
	this.sta = game.add.sprite( this.hp.x , this.hp.y + this.hp.height + 5, 'staJuice');
	this.staBar = game.add.sprite(this.sta.x - 10, this.sta.y - 1,  'staBar');
	this.sta.fixedToCamera = true;
	this.staBar.fixedToCamera = true;
	this.staWidth = this.sta.width;
	this.staHeight = this.sta.height;
	this.sta.cropEnabled = true;



	//this.sta = game.add.sprite( )

	game.add.existing(this);

}

HUD.prototype = Object.create(Phaser.Sprite.prototype);	//create prototype of type Heads Up Display
HUD.prototype.constructor = HUD;						//set constructor function name

HUD.prototype.changeHP = function( amount ){
	this.hp.crop( new Phaser.Rectangle( 0, 0, amount * this.hpWidth, this.hpHeight) );
}

HUD.prototype.changeSTA = function( amount ){
	this.sta.crop( new Phaser.Rectangle( 0, 0, amount * this.staWidth, this.staHeight) );
}