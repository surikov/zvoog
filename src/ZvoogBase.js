console.log('ZvoogBase v1.01');
var ZvoogKeys = ['off', 'on', 'value', 'volume'];
function ZvoogBase(audioContext) {
	this.zvoogChannels = [];
	this.implementation = new ZvoogImplementation();
	this.connectFrom = function (audioNode) {
		return this;
	};
	this.connectTo = function (audioNode) {
		return this;
	};
	this.disconnect = function (audioNode) {
		return this;
	};
	this.routeTo = function (zvoogBase) {
		return zvoogBase;
	};
	this.unRouteFrom = function (zvoogBase) {
		return zvoogBase;
	};
	this.channel = function (name) {
		for (var i = 0; i < this.zvoogChannels.length; i++) {
			if (this.zvoogChannels[i].name == name) {
				return this.zvoogChannels[i];
			}
		}
		var c = new ZvoogChannel(this);
		c.name = name;
		this.zvoogChannels.push(c);
		return c;
	};
	this.channels = function () {
		return this.zvoogChannels;
	};
	this.input = function () {
		return null;
	};
	this.output = function () {
		return null;
	};
	this.loadFromObject = function (object) {
		return null;
	};
	return this;
}
if (typeof module === 'object' && module.exports) {
	module.exports = ZvoogBase;
}
if (typeof window !== 'undefined') {
	window.ZvoogBase = ZvoogBase;
}
function ZvoogImplementation(audioContext) {
	
	return this;
}
function ZvoogChannel(owner) {
	this.name = 'empty';
	this.owner = owner;
	this.zvoogChannels = [];
	this.bind = function (channel) {
		if(this.zvoogChannels.indexOf(channel)<0){
			this.zvoogChannels.push(channel);
		}
		return this;
	};
	this.unbind = function (channel) {
		var n=this.zvoogChannels.indexOf(channel);
		if(n>-1){
			var c=this.zvoogChannels[n];
			this.zvoogChannels.splice(n,1);
			c.unbind(this);
		}
		return this;
	};
	this.send = function (zvoogMessage) {
		for(var i=0;i<this.zvoogChannels.length;i++){
			this.zvoogChannels[i].onMessage(zvoogMessage);
		}
		return this;
	};
	this.onMessage=function(zvoogMessage){
		console.log(zvoogMessage);
	};
	return this;
}
function ZvoogMessage() {
	this.when = 0;
	this.duration = 0;
	this.value = 0;
	this.shifts = [];
	return this;
}
function ZvoogShift() {
	this.skip = 0;
	this.value = 0;
	return this;
}
var ac = null;
var mediaStream = new ZvoogBase(ac);
var volumeRange = new ZvoogBase(ac);
var gainFx = new ZvoogBase(ac);
var muteToggle = new ZvoogBase(ac);
var echoFx = new ZvoogBase(ac);
var outputSpeaker = new ZvoogBase(ac);
echoFx.connectFrom(mediaStream).routeTo(gainFx).connectTo(outputSpeaker);
volumeRange.channel('value').bind(gainFx.channel('volume'));
muteToggle.channel('state').bind(gainFx.channel('volume'));
var on = new ZvoogMessage();
var off = new ZvoogMessage();
var half = new ZvoogMessage();
on.value = 1;
off.value = 0;
half.value = 0.5;
console.log('start');
muteToggle.channel('state').send(on);
console.log('done');
