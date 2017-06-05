'use strict';
var MainMenu = function(game) {};
MainMenu.prototype =
{
	preload: function()
	{
		// Loading menu assets
		this.load.path = 'assets/img/';
		this.load.images(['buttonUp', 'buttonDown', 'gameName'],
			[
			'menuStuff/buttonUp.png', 
			'menuStuff/buttonDown.png',
			'menuStuff/name.png',
			]);
	},

	create: function()
	{
		//placing menu assets on the screen
		var gameName = this.add.sprite(100, 100,'gameName');
		var buttonUp = this.add.sprite(150, 150,'buttonUp');
		var buttonDown = this.add.sprite(150, 200,'buttonDown');
		this.add.text(650, 20, 'Press any key to continue....', {fontSize: '32px', fill: 'white'});

	},

	update: function()
	{

		this.game.state.start('Play');
	},
};
