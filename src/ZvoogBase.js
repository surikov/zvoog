console.log('ZvoogBase v1.02');
function ZvoogDispatcher(name) {
	var me = this;
	var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
	this.audioContext = new AudioContextFunc();
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
	this.intervalID = 0;
	this.saveStatesToLocalStorage = function () {
		//console.log('saveStatesToLocalStorage');
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
		var state = new ZvoogState(stateID);
		this._states.push({
			pluginID: pluginID,
			stateID: stateID,
			state: state
		});
		return state;
	};
	this.setStateAction = function (pluginID, stateID, action) {
		var state = this.takeState(pluginID, stateID);
		state._action = action;
		//state.set(state.value());
		return state;
	};
	this.scheduleMessage = function (fromPluginID, zvoogMessage) {
		console.log('event', zvoogMessage);
		for (var i = 0; i < this._routes.length; i++) {
			if (this._routes[i].fromPluginID == fromPluginID) {
				console.log('route', this._routes[i]);
			}
		}
	};
	this.setPluginObject = function (pluginID, o) {
		var p = this.findPlugin(pluginID);
		if (!(p)) {
			p = {
				pluginID: pluginID,
				zvoogPlugin: o
			};
			this._plugins.push(p);
		} else {
			p.o = o;
		}
	};
	this.createPluginFromFunction = function (functionDefinition, pluginID) {
		var newState = function (stateID, action) {
			return me.setStateAction(pluginID, stateID, action);
		};
		var scheduleMessage = function (zvoogMessage) {
			me.scheduleMessage(pluginID, me.cloneMessage(zvoogMessage));
		};
		var o = new functionDefinition(this.audioContext, newState, scheduleMessage);
		o.pluginID = pluginID;
		this.setPluginObject(pluginID, o);
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
	this.findPlugin = function (pluginID) {
		for (var i = 0; i < this._plugins.length; i++) {
			if (this._plugins[i].pluginID == pluginID) {
				return this._plugins[i].o;
			}
		}
		return null;
	};
	this.findRoute = function (fromPluginID, toPluginID) {
		for (var i = 0; i < this._routes.length; i++) {
			if (this._routes[i].fromPluginID == fromPluginID && this._routes[i].toPluginID == toPluginID) {
				return this._routes[i];
			}
		}
		return null;
	};
	this.routeMessages = function (fromPlugin, fromChannel, toPlugin, toChannel) {
		var fromPluginID = '';
		if (fromPlugin) {
			fromPluginID = fromPlugin.pluginID;
		}
		var toPluginID = '';
		if (toPlugin) {
			toPluginID = toPlugin.pluginID;
		}
		if (!this.findRoute(fromPluginID, fromChannel, toPluginID, toChannel)) {
			this._routes.push({
				fromPluginID: fromPluginID,
				fromChannel: fromChannel,
				toPluginID: toPluginID,
				toChannel: toChannel
			});
		}
	};
	this.unroute = function (fromPluginID, fromChannel, toPluginID, toChannel) {
		for (var i = 0; i < this._routes.length; i++) {
			if (this._routes[i].fromPluginID == fromPluginID //
				 && this._routes[i].fromChannel == fromChannel //
				 && this._routes[i].toPluginID == toPluginID //
				 && this._routes[i].toChannel == toChannel) {
				this._routes.splice(i, 1);
			}
		}
	};
	this.sendTick = function () {
		console.log('tick');
	};
	this.startTicker = function () {
		this.intervalID = setInterval(function () {
				me.sendTick()
			}, 2000);

	};
	this.cancelTicker = function () {
		console.log('cancel');
	};
	/*this.channelPurpose = function (n) {
		if (n >= 0 && n <= 127) {
			return 'melody track';
		}
		if (n >= 1035 && n <= 1081) {
			return 'percussion track';
		}
		if (n == 2000) {
			return 'start ticker';
		}
		if (n == 2001) {
			return 'cancel ticker';
		}
		if (n == 3000) {
			return 'button click';
		}
		return 'unknown channel';
	};*/
	this.cloneMessage = function (zvoogMessage) {
		var c = new ZvoogMessage();
		c.channel = zvoogMessage.channel;
		c.key = zvoogMessage.key;
		c.variation = zvoogMessage.variation;
		c.when = zvoogMessage.when;
		c.duration = zvoogMessage.duratio;
		c.value = zvoogMessage.value;
		for (var i = 0; i < zvoogMessage.shifts.length; i++) {
			var s = new ZvoogShift();
			s.skip = zvoogMessage.shifts[i].skip;
			s.delta = zvoogMessage.shifts[i].delta;
			c.shifts.push(s);
		}
		return c;
	};
	this.restoreStatesFromLocalStorage();
	return this;
}
function ZvoogMessage(channel, key, variation, when, duration, value, shifts) {
	this.channel = channel||0;
	this.key = key||0;
	this.variation = variation||0;
	this.when = when||0;
	this.duration = duration||0;
	this.value = value||0;
	this.shifts = shifts||[];
	return this;
}
