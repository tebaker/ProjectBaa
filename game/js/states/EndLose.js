'use strict';
var EndLose = function(game) {};
EndLose.prototype =
{
	create: function()
	{
		this.add.text(this.world.centerX, this.world.centerY, 'You lose...', {fontSize: '32px', fill: 'white'});
	},

	update: function()
	{
	},
};
