function RandomSound(soundType){

}

RandomSound.prototype.playRandomSound = function(){
	var rndIndex = Math.floor((Math.random() * 6));
	// if(isMuted === false){
	// 	rndSound.play();
	// }
}

var randomSound = new RandomSound(['crunch_1', 'crunch_2', 'crunch_3', 'crunch_4', 'crunch_6']);
randomSound.playRandomSound();