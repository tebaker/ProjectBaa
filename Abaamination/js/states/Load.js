'use strict';
var Load = function(game) {};
Load.prototype =
{
	preload: function() 
	{
		// Display text
		this.add.text(650, 20, 'Loading...', {fontSize: '32px', fill: 'white'});

		// Add Load bar and set as Load sprite (auto-crops sprite)
		var loadingBar = this.add.sprite(100, 100,'loadingBar');
		loadingBar.anchor.set(0.5);
		this.load.setPreloadSprite(loadingBar);

		// Load image assets
		this.load.path = 'assets/img/';  
		this.load.images(['mock', 'player', 'col', 'col1', 'col2', 'col3', 'col4'],
										 ['mock.png', 'player.png', 'col2004x132.png', 'col941x341.png', 'col327x141.png', 'col704x90.png', 'col1310x126.png']);
	},

	create: function ()
	{
		this.game.state.start('MainMenu');
	}
};
