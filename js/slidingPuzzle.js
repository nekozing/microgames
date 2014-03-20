var Game = {
	start : function(listenerObject){
		if(!listenerObject)
			listenerObject = window;
		mg.bindEvents(listenerObject, this, ['directionArrowKeys']);
	},
	onLeft : function(){
		console.log('left');
	},
	onRight : function(){
		console.log('right');
	},
	onUp : function(){
		console.log('up');
	},
	onDown : function(){
		console.log('down');
	}
};
