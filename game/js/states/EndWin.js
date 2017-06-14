'use strict';
var EndWin = function(game) {};
this.key;
EndWin.prototype =
{
	preload: function()
	{
		game.load.audio('success',['assets/sound/success.mp3','assets/sound/success.ogg']);
	},

	create: function()
	{
	var success = game.add.audio("success", 1, false);
	success.play();
	this.add.text(this.camera.x, this.camera.y, 'SUCCESS', {fontSize: '56px', fill: 'white'});
	this.add.text(690, 360, 'Thank you for your child. . .Press Enter to repeat this process. . .', {fontSize: '48px', fill: 'white'});
	this.key = this.input.keyboard.addKey(Phaser.KeyCode.ENTER);
	},

	update: function()
	{
  	if (this.key.justPressed())
		{
		this.game.state.start('MainMenu');
		}
	},
};
