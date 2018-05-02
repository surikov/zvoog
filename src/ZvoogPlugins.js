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
			//console.log('set volume to', me.loudness.value());
			gainNode.gain.setValueAtTime(me.loudness.value(), audioContext.currentTime);
		});
	gainNode.gain.setValueAtTime(me.loudness.value(), audioContext.currentTime);
	return this;
}
function Zvoog_LocalMediaFile_withUI(audioContext, newState) {
	var me = this;
	this.output = audioContext.createGain();
	//this.output.connect(audioContext.destination);
	//this.output.gain.setValueAtTime(0.1, 0);
	this.id = 'Zvoog_LocalMediaFile_withUI' + Math.round(Math.random() * 10000000);
	this.playState = newState('play-pause', function () {
			me.togglePlay();
		});
	this.attachToDIV = function (div) {
		div.innerHTML = '<p><input id="fileinput' + this.id + '" type="file" name="name" style="display: none;" /><audio id="audio' + this.id + '" loop /></p>';
		//console.log(div);
		document.getElementById('fileinput' + this.id).onchange = function () {
			var files = this.files;
			var file = URL.createObjectURL(files[0]);
			//console.log(file);
			var audio = document.getElementById('audio' + me.id);
			audio.src = file;
			//
			if (me.mediaElementSource) {
				me.mediaElementSource.disconnect();
			}
			me.mediaElementSource = audioContext.createMediaElementSource(audio);
			me.mediaElementSource.connect(me.output);

			//console.log(audio,me.mediaElementSource);
			//audio.play();
			me.playState.set(1);
		};
	};
	this.togglePlay = function () {
		var audio = document.getElementById('audio' + this.id);
		//console.log('togglePlay',this.playState.value(),audio.src);
		if (this.playState.value() > 0) {
			//console.log('try play');
			if (audio.src) {
				audio.play();
			} else {
				//console.log('try load');
				this.playState.set(0);
				this.promptFile();
			}
		} else {
			//console.log('stop');
			audio.pause();
		}
	};
	this.promptFile = function () {
		//console.log('start prompt');
		document.getElementById('fileinput' + this.id).click();
		//console.log('done prompt');
	};
	return this;
}
function Zvoog_Toggle_withUI(audioContext, newState) {
	var me = this;
	this.id = 'Zvoog_Toggle_withUI' + Math.round(Math.random() * 10000000);
	this.onOff = newState('on/off', function () {
			var v=false;
			if(me.onOff.value()){
				v=true;
			}
			//console.log('set toggle',v);
			document.getElementById(me.id).checked = v;
		});
	this.attachToDIV = function (div) {
		div.innerHTML = '<p><input id="' + this.id + '" type="checkbox">&nbsp;&nbsp;&nbsp;</input></p>';
		document.getElementById(this.id).onchange = function (e) {
			var value = e.target.checked ? 1 : 0;
			me.onOff.set(value);
		};
		document.getElementById(me.id).checked = me.onOff.value()? 1 : 0;
	};

	return this;
}
function Zvoog_Range_withUI(audioContext, newState) {
	var me = this;
	this.id = 'Zvoog_Range_withUI' + Math.round(Math.random() * 10000000);
	this.value = newState('value', function () {
			document.getElementById(me.id).value = me.value.value();
		});
	this.attachToDIV = function (div) {
		div.innerHTML = '<p><input id="' + this.id + '" type="range" min=0.0 max=1.0 value=1.0 step=0.01></input></p>';
		document.getElementById(this.id).onchange = function (e) {
			me.value.set(e.target.value * 1);
		};
		document.getElementById(me.id).value = me.value.value();
	};

	return this;
}
function Zvoog_buttonUI(audioContext, newState, scheduleEvent) {
	var me = this;
	this.id = 'Zvoog_buttonUI' + Math.round(Math.random() * 10000000);
	var clickevent=new ZvoogEvent(3000,0,0,0,0,0);
	this.attachToDIV = function (div) {
		div.innerHTML = '<p><button id="' + this.id + '" >press me</button></p>';
		document.getElementById(this.id).onclick = function (e) {
			console.log('click');
			scheduleEvent(clickevent);
		};
	};

	return this;
}