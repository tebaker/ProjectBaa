'use strict';
var Boot = function(game) {};
Boot.prototype =
{
  preload: function()
  {
    //quick loading a few assets for later
    this.load.images(
    [
      'loadingBar',
      'teamName'
    ],
    [
      'assets/img/menuStuff/loadingBar.png',
      'assets/img/menuStuff/teamName.png'
    ]);

  },

  create: function ()
  {
    this.game.state.start('Load');
  }
};
