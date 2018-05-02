console.log('ZvoogStatye v1.03');

function ZvoogState(tag) {
	this.tag = tag;
	this._value = '';
	this._binded = [];
	this._changes = [];
	this.nestLimit = 10;
	//this._lock = [];
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
	this.set = function (newText) {
		console.log('set', this.tag, 'to <',newText,'> from <',this._value,'>');
		if (ZvoogState.lock.length > 0) {
			//console.log('	delay', this.tag, newText,'from <',this._value,'> to',ZvoogState.lock[0].tag);
			ZvoogState.lock[0]._changes.push(newText);
		} else {
			this._changes = [newText];
			//this._lock=[this];
			this.change(true);
			ZvoogState.lock = [];
		}
	};
	this.change = function (root) {
		//console.log('	start changes', this.tag, 'size',this._changes.length);
		var nestCounter=0;
		while (this._changes.length > 0) {
		//for (var i = 0; i < this.nestLimit; i++) {
			//if (this._changes.length > 0) {
				nestCounter++;
				if(this.nestLimit<nestCounter){
					console.log('nesting error');
					break;
				}
				var t = this._changes.shift();
				//console.log('		changes', this.tag, 'to <',t,'>');
				//console.log('try change', this.tag, t, 'from', this._value);
				//if (!(this._value == t)) {
					//console.log('change', this.tag, t, 'binded', this._binded.length);
					this._value = t;
					if (this._action) {
						this._action();
					}
					if(root){
						ZvoogState.lock = [];
					}
					ZvoogState.lock.push(this);
					//console.log('lock', this.tag);
					for (var i = 0; i < this._binded.length; i++) {
						//console.log('relay', this._binded[i].tag);
						if (ZvoogState.lock.indexOf(this._binded[i]) < 0) {
							//console.log('next', this._binded[i].tag);
							this._binded[i]._changes = [t];
							this._binded[i].change();
						}
					}
				//}
			//}else{
			//	break;
			//}
		}
	};
	/*this.set = function (newText) {
	this.change(newText);
	this.relay(newText, [this]);
	};
	this.change = function (newText) {
	var t = '' + newText;
	if (!(this._value == t)) {
	console.log('change', t);
	this._value = t;
	if (this._action) {
	this._action();
	}
	}
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
	};*/
	this.value = function () {
		return this._value;
	};
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
	};
	return this;
}
ZvoogState.lock = [];
