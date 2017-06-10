'use strict';
var EndWin = function(game) {};
EndWin.prototype =
{
	create: function()
	{
		this.add.text(this.world.centerX, this.world.centerY, 'You win!', {fontSize: '32px', fill: 'white'});
	},

	update: function()
	{
	},
};
