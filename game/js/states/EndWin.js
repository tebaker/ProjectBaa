'use strict';
var EndWin = function(game) {};
EndWin.prototype =
{
	create: function()
	{
		this.add.text(this.camera.x, this.camera.y, 'You win!', {fontSize: '32px', fill: 'white'});
	},

	update: function()
	{
    this.game.state.start('MainMenu');
	},
};
