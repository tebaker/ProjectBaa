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
		this.load.path = 'assets/';  
		this.load.images(['tiles','cTiles', 'player'], 
			[
			'tilesheet/TileSheet_v3.png', 
			'tilesheet/BasicColorTiles_40x40px.png',
			'img/player.png'
			]);
		this.load.tilemap('testLevel', 'tilesheet/testLevel_tiledCollisionLayer.json', null, Phaser.Tilemap.TILED_JSON);

	},

	create: function ()
	{
		this.game.state.start('MainMenu');
	}
};
