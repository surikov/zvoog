console.log('ZvoogCueOutput v1.02');
function ZvoogCueOutput() {
	this.inputs = [];
	this.openKey = function (pitch, volume) {
		for (var i = 0; i < this.inputs.length; i++) {
			this.inputs[i].openKey(pitch, volume);
		}
	};
	this.closeKey = function (pitch) {
		for (var i = 0; i < this.inputs.length; i++) {
			this.inputs[i].closeKey(pitch);
		}
	};
	this.setNote = function (note) {
		for (var i = 0; i < this.inputs.length; i++) {
			this.inputs[i].setNote(note);
		}
	};
}
