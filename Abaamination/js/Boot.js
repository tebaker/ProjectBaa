var Boot = function(game) {};
Boot.prototype =
{
	preload: function() 
	{
		//load stuff
	//this.game.load.image("key", "path");
	//this.game.load.image("key", "path");
	},

	create: function ()
	{
   	this.game.state.start('MainMenu')
	},

	update: function()
	{
	},
};