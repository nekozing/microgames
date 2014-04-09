(function(global){
	var MAX_NOTES = 6;
	var MIN_FREQ = 27.5;
	var MAX_FREQ = 4186.01;
	var MIN_GAIN = 0;
	var MAX_GAIN = 1;

	var NoteFactory = {
		createNote : function(){
			var audioContext = new webkitAudioContext();
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
		this.init = false;
	};
	Note.prototype.play = function(freq, gain){
		if(freq != null && gain != null){
			this.edit(freq, gain);
		}
		if(this.init){
			this.resume();
		}else{
			this.oscillator.noteOn(0);
			this.init = true;
		}
	};
	Note.prototype.pause = function(){
		this.gain.disconnect();
	};
	Note.prototype.resume = function(){
		this.gain.connect(this.destination);
	};
	Note.prototype.stop = function(){
		this.pause();
		// this.oscillator.noteOff(0);
	};
	Note.prototype.edit = function(freq, gain){
		if(freq > MAX_FREQ) freq = MAX_FREQ;
		if(freq < MIN_FREQ) freq = MIN_FREQ;
		if(gain > MAX_GAIN) gain = MAX_GAIN;
		if(gain < MIN_GAIN) gain = MIN_GAIN;

		this.oscillator.frequency.value = freq;
		this.gain.gain.value = gain;
	};

	// ac is a note manager
	var ac = {
		notePool : function(){
			var notes = [];
			for(var i= 0; i< MAX_NOTES; i++){
				notes.push(NoteFactory.createNote());
			}
			return notes;
		}(),
		usedNotesIndex : {},
		unusedNote: function(){
			var arr = [];
			for(var i= 0; i< MAX_NOTES; i++){
				arr.push(i);
			}
			return arr;
		}(),
		playNote : function(id, frequency, gain){
			if(!id) return;
			if(this.unusedNote.length == 0) return;

			var noteNumber = this.unusedNote.pop();
			this.usedNotesIndex[id] = noteNumber;

			this.notePool[ this.usedNotesIndex[id] ].play(frequency, gain);
			
		},
		modifyNote : function(id, frequency, gain){
			if(!id || this.usedNotesIndex[id] == null) return;

			var noteNumber = this.usedNotesIndex[id];
			this.notePool[noteNumber].edit(frequency, gain);
		},
		stopNote : function(id){
			if(!id || this.usedNotesIndex[id] == null) return;
			var noteNumber = this.usedNotesIndex[id];

			this.notePool[noteNumber].pause();

			delete this.usedNotesIndex[id];
			this.unusedNote.push(noteNumber);
		},
		stopAll : function(){
			
		}
	};


	global.ac = ac;
	global.Note = Note;
	global.NoteFactory = NoteFactory;
})(this)