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
		game.time.advancedTiming = true;

		// Load image assets
		this.load.path = 'assets/';  
		this.load.images(['tiles','cTiles', 'enemy'], 
			[
			'tilesheet/TileSheet_v3.png', 
			'tilesheet/BasicColorTiles_40x40px.png',
			'img/Enemy_Placeholder.png'
			]);
		this.load.spritesheet('player', 'img/ProtoMamaSheet.png', 366, 400, 92);
		this.load.physics('playerCollision', 'physics objects/playerCollision.json');
		this.load.tilemap('testLevel', 'tilesheet/testLevel_tiledCollisionLayer2.json', null, Phaser.Tilemap.TILED_JSON);

	},

	create: function ()
	{
		this.game.state.start('MainMenu');
	}
};
