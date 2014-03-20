// core functionalities for basic gameplay
// event-based, NOT state based
(function(global){
	var EVENTTYPE = {
		'KEYBOARD' : 0,
		'MOUSE'    : 1
	}
	var KEY = {
		'LEFTARROW' : 37,
		'UPARROW'   : 38,
		'RIGHTARROW': 39,
		'DOWNARROW' : 40,
		'W'         : 87,
		'S'         : 83,
		'A'         : 65,
		'D'         : 68
	};
	var supportedEventMap = {
		'directionArrowKeys' : {
			'type' : EVENTTYPE.KEYBOARD,
			'functionKeyMaps' : {
				'left'  : KEY.LEFTARROW,
				'right' : KEY.RIGHTARROW,
				'up'    : KEY.UPARROW,
				'down'  : KEY.DOWNARROW 
			}
		},
		'directionWASDKeys'  : {
			'type' : EVENTTYPE.KEYBOARD,
			'functionKeyMaps' : {
				'left'  : KEY.A,
				'right' : KEY.D,
				'up'    : KEY.W,
				'down'  : KEY.S
			}
		},
		'mouseLeftClick' : {

		}
	};
	var mg = {
		p : function(x, y){
			return new mg.point2d(x, y);
		},
		point2d : function(x, y){
			this.x = x;
			this.y = y;
		},
		createEvent : function(callObj, eventName){
			var eventInfo = supportedEventMap[eventName];
			if(eventInfo.type == EVENTTYPE.KEYBOARD){
				if(!callObj.eventMapping){
					callObj.eventMapping = new Object();
				}
				for(var functionName in eventInfo.functionKeyMaps){
					var keyCode = eventInfo.functionKeyMaps[functionName];
					functionName = 'on' + functionName.charAt(0).toUpperCase() + functionName.slice(1);
					callObj.eventMapping[keyCode] = functionName;
				}
			}
		},
		bindEvents : function(listener, callObj, eventNames){
			// injects some helpers into the game object to decouple mg from the game object
			callObj.delegateKeys = this.delegateKeys;
			listener.addEventListener('keydown', callObj.delegateKeys.bind(callObj));
			for(var i=0; i<eventNames.length; i++){
				this.createEvent(callObj, eventNames[i]);
			}
		},
		delegateKeys : function(event){
			var functionName = this.eventMapping[event.keyCode];
			if(!!functionName)
				this[functionName]();
		}
	};
	mg.point2d.prototype.add = function(q){
		this.x += q.x;
		this.y += q.y;
	};
	mg.point2d.prototype.scale = function(a){
		this.x *= a;
		this.y *= a;
	};
	global.mg = mg;
})(this);