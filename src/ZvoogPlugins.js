console.log('ZvoogPlugins v1.01');
function ZvoogPlugin(audioContext, newState, scheduleEvent) {
	this.input = null;
	this.output = null;
	this.onEvent = function (zvoogEvent) {
		console.log('onEvent', zvoogEvent);
	};
	this.tick = function (when, duration) {
		console.log('tick', when, duration);
	};
	return this;
}
function Zvoog_Volume(audioContext, newState) {
	var me = this;
	var gainNode = audioContext.createGain();
	this.input = gainNode;
	this.output = gainNode;
	this.loudness = newState('volume value', function () {
			console.log('set volume to', me.loudness.value());
			gainNode.gain.setValueAtTime(me.loudness.value(), audioContext.currentTime);
		});
	return this;
}
function Zvoog_LocalMediaFile_withUI(audioContext, newState) {
	var me = this;
	this.output = audioContext.createGain();
	this.id='Zvoog_LocalMediaFile_withUI' + Math.round(Math.random() * 10000000);
	this.attachToDIV = function (div) {
		div.innerHTML = '<p>Media<input id="fileinput' + this.id + '" type="file" name="name" style="display: none;" /><audio id="audio' + this.id + '" /></p>';
		console.log(div);
	};
	return this;
}
function Zvoog_Toggle_withUI(audioContext, newState) {
	var me = this;
	this.id='Zvoog_Toggle_withUI' + Math.round(Math.random() * 10000000);
	this.onOff = newState('on/off', function () {
			console.log('set on/off to', me.onOff.value());
			document.getElementById(me.id).checked=me.loudness.value()>0;
		});
	this.attachToDIV = function (div) {
		div.innerHTML = '<p><input id="' + this.id + '" type="checkbox">&nbsp;&nbsp;&nbsp;</input></p>';
		document.getElementById(this.id).onchange = function (e) {
			var value = e.target.checked ? 1:0;
			console.log(value);
		};
	};
	return this;
}
