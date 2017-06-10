'use strict';
var EndLose = function(game) {};
EndLose.prototype =
{
	create: function()
	{
		this.add.text(this.camera.x, this.camera.y, 'You lose...', {fontSize: '32px', fill: 'white'});
	},

	update: function()
	{
	},
};
