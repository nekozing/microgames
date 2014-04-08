(function(global){
	var MAX_NOTES = 10;
	var MIN_FREQ = 27.5;
	var MAX_FREQ = 4186.01;
	var MIN_GAIN = 0;
	var MAX_GAIN = 1;

	var NoteFactory = {
		audioContext : new webkitAudioContext(),
		createNote : function(){
			var audioContext = this.audioContext;
			var oscillator = audioContext.createOscillator();
			var gain = audioContext.createGainNode();
			oscillator.type = 0;
			oscillator.connect(gain);
			gain.connect(audioContext.destination);
			// not decided whether having fixed number of parameters for the Note constructor yet
			var note = new Note();
			note.oscillator = oscillator;
			note.gain = gain;
			note.destination = audioContext.destination;
			return note;
		}
	};

	var Note = function(){
		this.oscillator = null;
		this.gain = null;
		this.destination = null;
		this.loudness = 0;
		this.frequency = 440;
	};
	Note.prototype.play = function(){
		this.oscillator.noteOn(0);
	};
	Note.prototype.pause = function(){
		this.gain.disconnect();
	};
	Note.prototype.resume = function(){
		this.gain.connect(this.destination);
	};
	Note.prototype.stop = function(){
		this.oscillator.noteOff(0);
	};
	Note.prototype.edit = function(freq, gain){
		if(freq > MAX_FREQ) freq = MAX_FREQ;
		if(freq < MIN_FREQ) freq = MIN_FREQ;
		if(gain > MAX_GAIN) gain = MAX_GAIN;
		if(gain < MIN_GAIN) gain = MIN_GAIN;

		this.oscillator.frequency.value = freq;
		this.gain.gain.value = gain;
	};
	// todo : rewrite the audio core
	var ac = {
		notePool : [],
		playNote : function(id, frequency, volume){
			if(outOfBounds(id)) return;
			var oscillator = context.createOscillator();
			oscillator.type = 0;
			oscillator.frequency.value = 440;
			oscillator.connect(context.destination);
			oscillator.start();
			notePool[id] = oscillator;
		},
		modifyNote : function(id, frequency, volume){
			if(outOfBounds(id)) return;	
			try{
				var oscillator = notePool[id];
				oscillator.frequency.value = this.trimFrequency(frequency);
			}catch(e){
				//do nothing
			}
		},
		stopNote : function(id, frequency){
			if(outOfBounds(id)) return;
			try{
				notePool[id].stop();
				delete notePool[id];
			}catch(e){
				// do nothing
			}
		},
		stopAll : function(){

		},
		outOfBounds : function(id){
			return id < 0 || id >= MAX_NOTES;
		},
		trimFrequency : function(freq){
			if(freq > MAX_FREQ) return MAX_FREQ;
			if(freq < MIN_FREQ) return MIN_FREQ;
		}
	};


	global.ac = ac;
	global.Note = Note;
	global.NoteFactory = NoteFactory;
})(this)