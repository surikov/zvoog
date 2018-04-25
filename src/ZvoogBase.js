console.log('ZvoogBase v1.01');
var ZvoogKeys = ['off', 'on', 'value', 'volume'];
function ZvoogBase(audioContext, name) {
	this.name = name;
	this.zvoogChannels = [];
	this.implementation = new ZvoogImplementation(audioContext, this);
	this.connectFrom = function (audioNode) {
		if ((this.input()) && (audioNode)) {
			audioNode.connect(this.input());
		}
		return this;
	};
	this.connectTo = function (audioNode) {
		if ((this.input()) && (audioNode)) {
			this.output().connect(audioNode);
		}
		return this;
	};
	this.disconnect = function (audioNode) {
		if ((this.input()) && (audioNode)) {
			this.otput().disconnect(audioNode);
			audioNode.disconnect(this.input());
		}
		return this;
	};
	this.routeTo = function (zvoogBase) {
		if(this.output() && zvoogBase.input()){
			zvoogBase.connectFrom(this.output());
		}
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
		return this.implementation.input();
	};
	this.output = function () {
		//console.log(this.implementation);
		return this.implementation.output();
	};
	this.loadFromObject = function (object) {
		this.implementation = object;
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
function ZvoogImplementation(audioContext, owner) {
	this.owner = owner;
	this.audioContext = audioContext;
	this.input = function () {
		return null;
	};
	this.output = function () {
		return null;
	};
	this.onMessage = function (channelName, zvoogMessage) {
		console.log('	.onMessage', this.owner.name, channelName, zvoogMessage.value);
	};
	return this;
}
function ZvoogImplementationRange(audioContext, owner) {
	this.owner = owner;
	this.onMessage = function (channelName, zvoogMessage) {
		console.log('	.onMessage', this.owner.name, channelName, zvoogMessage.value);
	};
	return this;
}
function ZvoogImplementationToggle(audioContext, owner) {
	this.owner = owner;
	this.onMessage = function (channelName, zvoogMessage) {
		console.log('	.onMessage', this.owner.name, channelName, zvoogMessage.value);
	};
	return this;
}
function ZvoogImplementationState(audioContext, owner) {
	this.owner = owner;
	this.onMessage = function (channelName, zvoogMessage) {
		console.log('	.onMessage', this.owner.name, channelName, zvoogMessage.value);
	};
	return this;
}
function ZvoogImplementationTicker(audioContext, owner) {
	this.owner = owner;
	this.audioContext = audioContext;
	//this.input = audioContext.createGain();
	//input.gain.setValueAtTime(0.1, audioContext.currentTime);
	//this.input.connect(audioContext.destination);
	this.outputGain = audioContext.createGain();
	//input.gain.setValueAtTime(0.1, audioContext.currentTime);
	//this.output.connect(audioContext.destination);
	this.tick = function (when, duration) {
		//console.log('tick', when, duration);
		var osc = audioContext.createOscillator();
		osc.connect(this.outputGain);
		osc.frequency.value = 880.0;
		osc.start(when);
		osc.stop(when + duration);

		//console.log(osc);
	};
	this.output = function () {
		return this.outputGain;
	};
	var me = this;
	var n = setInterval(function () {
			me.tick(audioContext.currentTime, 0.1);
		}, 1000);
	this.onMessage = function (channelName, zvoogMessage) {
		console.log('	.onMessage', this.owner.name, channelName, zvoogMessage.value);
	};
	return this;
}
function ZvoogImplementationGain(audioContext, owner) {
	this.owner = owner;
	this.audioContext = audioContext;
	this.inputGain = audioContext.createGain();
	this.outputGain = audioContext.createGain();
	this.inputGain.connect(this.outputGain);
	this.outputGain.gain.setValueAtTime(0.5, 0);
	this.input = function () {
		return this.inputGain;
	};
	this.output = function () {
		return this.outputGain;
	};
	this.onMessage = function (channelName, zvoogMessage) {
		console.log('	.onMessage', this.owner.name, channelName, zvoogMessage.value);
		if (channelName == 'volume') {
			this.outputGain.gain.setValueAtTime(zvoogMessage.value, zvoogMessage.when);
		}
	};
	return this;
}
function ZvoogChannel(owner) {
	this.name = 'empty';
	this.owner = owner;
	this.zvoogChannels = [];
	this.bind = function (channel) {
		if (this.zvoogChannels.indexOf(channel) < 0) {
			console.log(this.owner.name, this.name, 'bind', channel.owner.name, channel.name);
			this.zvoogChannels.push(channel);
			channel.bind(this);
		}
		return this;
	};
	this.unbind = function (channel) {
		var n = this.zvoogChannels.indexOf(channel);
		if (n > -1) {
			var c = this.zvoogChannels[n];
			this.zvoogChannels.splice(n, 1);
			c.unbind(this);
		}
		return this;
	};
	this.schedule = function (zvoogMessage) {
		console.log(this.owner.name, 'schedule', this.name, zvoogMessage.value);
		this.relay(zvoogMessage, [this]);
	};
	this.relay = function (zvoogMessage, stopList) {
		for (var i = 0; i < this.zvoogChannels.length; i++) {
			if (stopList.indexOf(this.zvoogChannels[i]) < 0) {
				this.zvoogChannels[i].send(zvoogMessage);
				stopList.push(this.zvoogChannels[i]);
				this.zvoogChannels[i].relay(zvoogMessage, stopList);
			}
		}
		return this;
	};
	this.send = function (zvoogMessage) {
		this.owner.implementation.onMessage(this.name, zvoogMessage.clone());
	};
	return this;
}
function ZvoogMessage() {
	this.when = 0;
	this.duration = 0;
	this.value = 0;
	this.tag = '';
	this.shifts = [];
	this.clone = function () {
		var c = new ZvoogMessage();
		c.when = this.when;
		c.duration = this.duratio;
		c.value = this.value;
		c.tag = '' + this.tag;
		for (var i = 0; i < this.shifts.length; i++) {
			var s = new ZvoogShift();
			s.skip = this.shifts[i].skip;
			s.delta = this.shifts[i].delta;
			c.shifts.push(s);
		}
		return c;
	};
	return this;
}
function ZvoogShift() {
	this.skip = 0;
	this.delta = 0;
	return this;
}
/*
var ac = null;
var cfgState = new ZvoogBase(ac, 'cfgState');
var mediaStream = new ZvoogBase(ac, 'mediaStream');
var volumeRange = new ZvoogBase(ac, 'volumeRange');
var gainFx = new ZvoogBase(ac, 'gainFx');
var muteToggle = new ZvoogBase(ac, 'muteToggle');
var echoFx = new ZvoogBase(ac, 'echoFx');
var outputSpeaker = new ZvoogBase(ac, 'outputSpeaker');
echoFx.connectFrom(mediaStream).routeTo(gainFx).connectTo(outputSpeaker);
volumeRange.channel('value').bind(gainFx.channel('volume'));
muteToggle.channel('state').bind(gainFx.channel('volume'));
cfgState.channel('mainVolume').bind(gainFx.channel('volume'));
var on = new ZvoogMessage();
var off = new ZvoogMessage();
var loud = new ZvoogMessage();
on.value = 1;
off.value = 0;
loud.value = 0.75;
console.log('start');
cfgState.channel('restore').schedule(new ZvoogMessage());
muteToggle.channel('state').schedule(on);
muteToggle.channel('state').schedule(off);
volumeRange.channel('value').schedule(loud);
gainFx.channel('volume').schedule(off);
cfgState.channel('save').schedule(new ZvoogMessage());
//console.log('unbind');
//muteToggle.channel('state').unbind(gainFx.channel('volume'));
//gainFx.channel('volume').schedule(on);
console.log('done');
*/
