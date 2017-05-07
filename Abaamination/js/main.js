//,.-'`*`'-..,Abaamination 
//globals
var player;
var cursors;
var game = new Phaser.Game(1280, 720, Phaser.AUTO, "game");

//states
game.state.add('Boot', Boot);
game.state.add('MainMenu', MainMenu);
game.state.add('Play', Play);
game.state.start('Boot');
