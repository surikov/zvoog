console.log('ZvoogSession v1.02');
function ZvoogSession() {
	this.measures = [];
	this.channels = [];
	this.master = new ZvoogChannel();
	this.init = function (audioContext) {
		this.audioContext = audioContext;
		for(var i=0;i<this.channels.length;i++){
			//this.channels[i].init(this);
		}
	};
	this.route = function (output, input) {
		//
	};
	return this;
}
