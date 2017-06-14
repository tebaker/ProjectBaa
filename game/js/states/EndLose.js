'use strict';
var EndLose = function(game) {};
this.key;
EndLose.prototype =
{
	preload: function()
	{
		game.load.audio('fail',['assets/sound/fail.mp3','assets/sound/fail.ogg']);
	},
	
	create: function()
	{
		var fail = game.add.audio("fail", 1, false);
		fail.play();
		this.add.text(this.camera.x, this.camera.y, 'You lose...', {fontSize: '32px', fill: 'white'});
		this.add.text(690, 360, 'Press Enter to try again. . .', {fontSize: '48px', fill: 'white'});
		this.key = this.input.keyboard.addKey(Phaser.KeyCode.ENTER);

	},

	update: function()
	{
		if (this.key.justPressed())
		{
		this.game.state.start('Play');
		}
	},
};
