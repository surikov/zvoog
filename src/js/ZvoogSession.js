console.log('ZvoogSession v1.02');
function ZvoogSession() {
	this.measures = [];
	this.channels = [];
	this.links = [];
	this.master = new ZvoogChannel();
	this.init = function (audioContext) {
		this.audioContext = audioContext;
	};
	/*this.route = function (output, input) {
		this.links.push({
			output: output,
			input: input
		});
	};*/
	return this;
}
