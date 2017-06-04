'use strict';
var MainMenu = function(game) {};
MainMenu.prototype =
{
	preload: function()
	{
		//assets for the main menu
		this.load.images(
		[
			'buttonUp',
			'buttonDown',
			'gameName'
		],
		[
			'assets/img/menuStuff/buttonUp.png',
			'assets/img/menuStuff/buttonDown.png',
			'assets/img/menuStuff/teamName.png'
		]);
	},

	create: function()
	{
		//placing menu assets on the screen
		var buttonUp = this.add.sprite(150, 150,'buttonUp');
		var buttonDown = this.add.sprite(150, 200,'buttonDown');

	},

	update: function()
	{
		this.game.state.start('Play');
	},
};
