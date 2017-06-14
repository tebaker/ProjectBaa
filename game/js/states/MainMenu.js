'use strict';
var MainMenu = function(game) {
	this.key;
};
MainMenu.prototype =
{
	create: function()
	{
		this.add.tileSprite(0, 0, this.world.width, this.world.height, 'titleScreen');
		
		this.key = this.input.keyboard.addKey(Phaser.KeyCode.ENTER);
	},

	update: function()
	{
		if (this.key.justPressed())
		{
			this.game.state.start('Play');
		}
	}
};
