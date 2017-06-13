'use strict';
//,.-'`*`'-..,Surrogate 
//Globals
var player;
var cursors;
var game;
var rng;
var debug = false;


// Main game
window.onload = function()
{
  game = new Phaser.Game(1280, 720, Phaser.AUTO, "game");
  rng = new Phaser.RandomDataGenerator();
  
  // Game states
  game.state.add('Boot', Boot);
  game.state.add('MainMenu', MainMenu);
  game.state.add('Play', Play);
  game.state.add('Load', Load);
  game.state.add('EndWin', EndWin);
  game.state.add('EndLose', EndLose);
  game.state.start('Boot');
}

