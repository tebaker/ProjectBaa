'use strict';
var Boot = function(game) {};
Boot.prototype =
{
	preload: function()
	{
		// Get loading bar
		this.load.image('loadingBar', 'assets/img/bar.png');
	},

	create: function ()
	{
		this.game.state.start('Load');
	}
};
