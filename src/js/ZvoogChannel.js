console.log('ZvoogChannel v1.02');
function ZvoogChannel() {
	this.audioInputs = [];
	this.audioOutputs = [];
	this.cueInputs = [];
	this.cueOutputs = [];
	var out = new ZvoogCueOutput();
	var inp = new ZvoogCueInput();
	this.cueOutputs.push(out);
	this.cueInputs.push(inp);
	inp.setNote = function (note) {
		console.log('channel setNote', note);
	};
	return this;
}
