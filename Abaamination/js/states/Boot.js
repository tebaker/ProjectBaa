'use strict';
var Boot = function(game) {};
Boot.prototype =
{
	preload: function() 
	{
	},

	create: function ()
	{
		this.game.state.start('MainMenu')
	},

	update: function()
	{
	},
};
