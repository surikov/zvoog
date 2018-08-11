console.log('ZvoogComponent v1.02');
function ZvoogComponent() {
	this.audioInputs = [];
	this.audioOutputs = [];
	this.init = function (session) {
		this.session = session;
	};
	return this;
}
