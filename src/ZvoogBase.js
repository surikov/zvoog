console.log('ZvoogBase v1.02');
function ZvoogDispatсher(audioContext, name) {
	var me = this;
	var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
	var audioContext = new AudioContextFunc();
	window.addEventListener("blur", function (event) {
		me.saveStatesToLocalStorage();
	});
	window.addEventListener("pagehide", function (event) {
		me.saveStatesToLocalStorage();
	});
	window.addEventListener("beforeunload", function (event) {
		me.saveStatesToLocalStorage();
	});
	this._plugins = [];
	this._states = [];
	this._routes = [];
	this.saveStatesToLocalStorage = function () {
		console.log('saveStatesToLocalStorage');
		var arr = [];
		for (var i = 0; i < this._states.length; i++) {
			arr.push({
				pluginID: this._states[i].pluginID,
				stateID: this._states[i].stateID,
				value: this._states[i].state.value()
			});
		}
		localStorage.setItem(name, JSON.stringify(arr));
	};
	this.restoreStatesFromLocalStorage = function () {
		try {
			var o = JSON.parse(localStorage.getItem(name));
			if (o) {
				for (var i = 0; i < o.length; i++) {
					this.takeState(o[i].pluginID, o[i].stateID).set(o[i].value);
				}
			}
		} catch (ex) {
			console.log(ex);
			return {};
		}
	};
	this.takeState = function (pluginID, stateID) {
		for (var i = 0; i < this._states.length; i++) {
			if (this._states[i].pluginID == pluginID && this._states[i].stateID == stateID) {
				return this._states[i].state;
			}
		}
		var state = new ZvoogState();
		this._states.push({
			pluginID: pluginID,
			stateID: stateID,
			state: state
		});
		return state;
	};
	this.createPluginFromFunction = function (functionDefinition, pluginID) {
		var newState=function (stateID, action) {
				var state = me.takeState(pluginID, stateID);
				state._action = action;
				return state;
			};
		var o = new functionDefinition(audioContext, newState);
		this._plugins.push({
			pluginID: pluginID,
			zvoogPlugin: o
		});
		return o;
	};
	this.connect = function (fromAudioNode, toAudioNode) {
		if ((fromAudioNode) && (toAudioNode)) {
			fromAudioNode.connect(toAudioNode);
		}
	};
	this.disconnect = function (fromAudioNode, toAudioNode) {
		if ((fromAudioNode) && (toAudioNode)) {
			fromAudioNode.disconnect(toAudioNode);
		}
	};
	this.route = function (fromPlugin, toPlugin) {};
	this.unroute = function (fromPlugin, toPlugin) {};
	this.send = function (fromPlugin, toPlugin) {};
	return this;
}
function ZvoogPlugin(audioContext, newState) {
	this.input = null;
	this.output = null;
	return this;
}
function ZvoogEvent(when, duration, value, shifts) {
	this.key = key;
	this.when = when;
	this.duration = duration;
	this.value = value;
	this.shifts = [];
	if (this.shifts) {
		this.shifts = shifts;
	}
	this.clone = function () {
		var c = new ZvoogMessage();
		c.key = this.key;
		c.when = this.when;
		c.duration = this.duratio;
		c.value = this.value;
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
function Zvoog_Volume(audioContext, newState) {
	var me = this;
	this.loudness = newState('volume value', function () {
			//console.log('set volume to', me.loudness.value());
		});
	return this;
}
function ZvoogState() {
	this._value = '';
	this._binded = [];
	this._action = null;
	this.action = function (afterChange) {
		this._action = afterChange;
		return this;
	};
	this.bind = function (zvoogState) {
		if (this._binded.indexOf(zvoogState) < 0) {
			this._binded.push(zvoogState);
			zvoogState.bind(this);
		}
		return this;
	};
	this.unbind = function (zvoogState) {
		var n = this._binded.indexOf(zvoogState);
		if (n > -1) {
			var c = this._binded[n];
			this._binded.splice(n, 1);
			c.unbind(this);
		}
		return this;
	};
	this.relay = function (newValue, stopList) {
		for (var i = 0; i < this._binded.length; i++) {
			if (stopList.indexOf(this._binded[i]) < 0) {
				this._binded[i].change(newValue);
				stopList.push(this._binded[i]);
				this._binded[i].relay(newValue, stopList);
			}
		}
		return this;
	};
	this.set = function (newText) {
		this.change(newText);
		this.relay(newText, [this]);
	}
	this.change = function (newText) {
		var t = '' + newText;
		if (!(this._value == t)) {
			this._value = t;
			if (this._action) {
				this._action();
			}
		}
	}
	this.value = function () {
		return this._value;
	}
	this.numeric = function () {
		if (this._value) {
			var r = 1 * this._value;
			if (!(r)) {
				r = 0;
			}
			return r;
		} else {
			return 0;
		}
	}
	return this;
}

//mediaFile.routeTo(gainFx).connectTo(outputSpeaker);
/*
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
if (this.output() && zvoogBase.input()) {
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
 */
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
