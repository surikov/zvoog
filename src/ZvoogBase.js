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
		var state = new ZvoogState();
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
		return state;
	};
	this.scheduleEvent = function (fromPluginID, zvoogEvent) {
		for (var i = 0; i < this._routes.length; i++) {
			if (this._routes[i].fromPluginID == fromPluginID) {}
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
		var scheduleEvent = function (zvoogEvent) {
			me.scheduleEvent(pluginID, zvoogEvent.clone());
		};
		var o = new functionDefinition(this.audioContext, newState, scheduleEvent);
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
	this.route = function (fromPluginID, toPluginID) {
		if (!this.findRoute(fromPluginID, toPluginID)) {
			this._routes.push({
				fromPluginID: fromPluginID,
				toPluginID: toPluginID
			});
		}
	};
	this.unroute = function (fromPluginID, toPluginID) {
		for (var i = 0; i < this._routes.length; i++) {
			if (this._routes[i].fromPluginID == fromPluginID && this._routes[i].toPluginID == toPluginID) {
				this._routes.splice(i, 1);
			}
		}
	};
	return this;
}
function ZvoogEvent(channel, key, variation, when, duration, value, shifts) {
	this.channel = channel;
	this.key = key;
	this.variation = variation;
	this.when = when;
	this.duration = duration;
	this.value = value;
	this.shifts = [];
	if (this.shifts) {
		this.shifts = shifts;
	}
	this.clone = function () {
		var c = new ZvoogMessage();
		c.channel = this.channel;
		c.key = this.key;
		c.variation = this.variation;
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
