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
		
		//Load audio assets
		this.load.path = 'assets/sound/';
		game.load.audio("music1",['circleRain.mp3','circleRain.ogg']);
		//game.load.audio("music2",['circleRain.mp3','circleRain.ogg']);
		game.load.audio('heart',['heartbeat_repitch.mp3','heartbeat_repitch.ogg']);
		game.load.audio("jupiter",['jupiter.mp3','jupiter.ogg']);

		// Load image assets
		this.load.path = 'assets/';
		this.load.images(['tilesheet','cTiles', 'player', 'enemy', 'dustParticle', 'resourceParticle'], 
			[
			'tilesheet/TileSheet_v3.png', 
			'tilesheet/BasicColorTiles_40x40px.png',
			'img/player.png',
			'img/Enemy_Placeholder.png',
			//change the color of the particle to change the effect [white, black, red, brown]
			'img/dustParticle_brown.png',
			'img/resourceParticle.png'
			]);
		this.load.spritesheet('enemy', 'img/EnemyLandSheet.png', 432, 432, 57);
		this.load.spritesheet('player', 'img/ProtoMamaSheetADJ.png', 366, 400, 92);
		this.load.physics('playerCollision', 'physics objects/playerCollision.json');
		this.load.physics('ramCollisionJSON', 'physics objects/RammingCollisionObjects.json');
		this.load.tilemap('testLevel', 'tilesheet/LukesLevel1.json', null, Phaser.Tilemap.TILED_JSON);

	},

	create: function ()
	{
		this.game.state.start('MainMenu');
	}
};
