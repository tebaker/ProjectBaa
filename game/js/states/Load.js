'use strict';
var Load = function(game) {};
Load.prototype =
{
	//artificial pause time to help game feel
	pause: function(miliseconds){
		var currentTime = new Date().getTime();
   		while (currentTime + this.miliseconds >= new Date().getTime()) {}
	},

	//functions that will each have a specific preloading task
	loadSplash: function(){
		// Display text
		this.add.text(650, 20, 'Loading...', {fontSize: '32px', fill: 'white'});
		//adding splash screen team name
		var teamName = this.add.sprite(100, 100,'teamName');
	},
	//loading all images
	loadImages: function(){
		// Load image assets
		this.load.images(
			[
				'tilesheet',
				'cTiles',
				'dustParticle',
				'resourceParticle',
				'bg1',
				'titleScreen'
			], 
			[
				'assets/tilesheet/TileSheet_v3.png', 
				'assets/tilesheet/BasicColorTiles_40x40px.png',
				//change the color of the particle to change the effect [white, black, red, or brown]
				'assets/img/dustParticle_white.png',
				'assets/img/resourceParticle.png',
				'assets/img/environmentAssets/BackgroundCavernLessColor.png',
				'assets/img/menuStuff/titleScreen.png'
			]);
	},
	//loading all sounds
	loadSounds: function(){
		//Load audio assets
		game.load.audio('music1',['assets/sound/circleRain.mp3','assets/sound/circleRain.ogg']);
		//game.load.audio("music2",['circleRain.mp3','circleRain.ogg']);
		game.load.audio('heart',['assets/sound/heartbeat_repitch.mp3','assets/sound/heartbeat_repitch.ogg']);
		game.load.audio('jupiter',['assets/sound/jupiter.mp3','assets/sound/jupiter.ogg']);
	},
	//loading everything else including, but not limited to, sprite sheets, physics, etc.
	loadOther: function(){
		this.load.spritesheet('enemy', 'assets/img/EnemyLandSheet.png', 432, 432, 57);

		this.load.spritesheet('player', 'assets/img/ProtoMamaSheetAdj.png', 367, 400, 118);
    this.load.spritesheet('taker', 'assets/img/TheTakerSheet.png', 600, 600, 57);
		this.load.physics('playerCollision', 'assets/physicsObjects/playerCollision1.json');
		this.load.physics('ramCollisionJSON', 'assets/physicsObjects/RammingCollisionObjects.json');

		this.load.tilemap('levelOne', 'assets/tilesheet/talonLevelTEST.json', null, Phaser.Tilemap.TILED_JSON);
	},

	preload: function() 
	{
		var holdTime = 0; //To test loading bar
		//calling everything to be loaded in order
		this.loadSplash();
		this.pause(holdTime);
		this.loadImages();
		this.pause(holdTime);
		this.loadSounds();
		this.pause(holdTime);
		this.loadOther();
		this.pause(holdTime);

		// Add Load bar and set as Load sprite (auto-crops sprite)
		var loadingBar = this.add.sprite(600, 400,'loadingBar');
		loadingBar.anchor.set(0.5);
		this.load.setPreloadSprite(loadingBar);
		game.time.advancedTiming = true;
	},

	create: function ()
	{
		this.game.state.start('MainMenu');
	}
};
