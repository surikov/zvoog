class ZvoogWaveSource implements ZvoogSource {
	out: GainNode;
	params: ZvoogParameter[];
	vals: ZvoogValue[]=[];
	//zones: ZvoogPreset;
	player: ZvoogPlayer;
	audioContext: AudioContext;
	waves: { audio: AudioBufferSourceNode, end: number }[];
	envelopes: { when: number, duration: number, base: GainNode }[];
	afterTime: number = 0.008;
	buffer: AudioBuffer;
	root: number;
	path: string;
	busyState: number = 1;
	offset: number = 0;
	constructor(url: string, rootPitch: number, startOffset: number) {
		this.path = url;
		this.root = rootPitch;
		this.offset = startOffset;
		this.busyState = 1;
		//this.properties = [];
	}
	label(): string {
		return 'Audio Wave';
	}
	getValues(): ZvoogValue[] {
		return this.vals;
	}
	prepare(audioContext: AudioContext): void {
		this.out = audioContext.createGain();
		this.params = [];
		this.waves = [];
		this.envelopes = [];
		this.audioContext = audioContext;
		var xmlHttpRequest: XMLHttpRequest = new XMLHttpRequest();
		xmlHttpRequest.open('GET', this.path, true);
		xmlHttpRequest.responseType = 'arraybuffer';
		let me = this;
		xmlHttpRequest.onload = function (progressEvent: ProgressEvent) {
			var arrayBuffer: ArrayBuffer = xmlHttpRequest.response;
			if (arrayBuffer) {
				audioContext.decodeAudioData(arrayBuffer, function (audioBuffer: AudioBuffer) {
					me.buffer = audioBuffer;
					me.busyState = 0;
				});

			}
		};
		xmlHttpRequest.send(null);
	}
	getOutput(): AudioNode {
		return this.out;
	}
	getParams(): ZvoogParameter[] {
		return this.params;
	}
	cancelSchedule(): void {
		for (var i = 0; i < this.waves.length; i++) {
			this.waves[i].audio.stop();
		}
	}
	schedule(when: number, tempo: number, chord: ZvoogPitch[][]): void {
		for (var i = 0; i < chord.length; i++) {
			this.single(when, tempo, chord[i]);
		}
	}
	single(when: number, tempo: number, pitches: ZvoogPitch[]): void {
		this.cleanup();
		let audioBufferSourceNode = this.audioContext.createBufferSource();
		audioBufferSourceNode.buffer = this.buffer;
		var currentPlaybackRate = this.freq(pitches[0].pitch) / this.freq(this.root);
		audioBufferSourceNode.playbackRate.setValueAtTime(currentPlaybackRate, 0);
		var at = when + duration2time(tempo, pitches[0].duration);
		for (var i = 1; i < pitches.length; i++) {
			audioBufferSourceNode.playbackRate.linearRampToValueAtTime(this.freq(pitches[i].pitch) / this.freq(this.root), at);
			at = at + duration2time(tempo, pitches[i].duration);
		}
		var time = 0;
		for (let i = 0; i < pitches.length; i++) {
			time = time + duration2time(tempo, pitches[i].duration);
		}
		var e = this.findEnvelope(when, time);
		audioBufferSourceNode.connect(e.base);
		audioBufferSourceNode.start(when, this.offset);
		audioBufferSourceNode.stop(when + time + this.afterTime);
		this.waves.push({ audio: audioBufferSourceNode, end: at });
	}
	findEnvelope(when: number, duration: number): { when: number, duration: number, base: GainNode } {
		let envelope: { when: number, duration: number, base: GainNode } | null = null;
		for (let i = 0; i < this.envelopes.length; i++) {
			let e = this.envelopes[i];
			if (this.audioContext.currentTime > e.when + e.duration + this.afterTime) {
				envelope = e;
				break;
			}
		}
		if (!(envelope)) {
			envelope = {
				base: this.audioContext.createGain()
				, when: 0
				, duration: 0
			};
			this.envelopes.push(envelope);
			envelope.base.connect(this.out);
		}
		envelope.when = when;
		envelope.duration = duration;
		envelope.base.gain.setValueAtTime(0, 0);
		envelope.base.gain.setValueAtTime(0, when);
		envelope.base.gain.linearRampToValueAtTime(1, when + this.afterTime);
		envelope.base.gain.setValueAtTime(1, when + duration);
		envelope.base.gain.linearRampToValueAtTime(0, when + duration + this.afterTime);
		return envelope;
	};
	busy(): number {
		return this.busyState;
	}
	freq(key: number) {
		var O4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
		var half = Math.floor(key % 12);
		var octave = Math.floor(key / 12);
		var freq0 = O4[half] / (2 * 2 * 2 * 2);
		return freq0 * Math.pow(2, octave);
	}
	nextClear() {
		for (var i = 0; i < this.waves.length; i++) {
			if (this.waves[i].end < this.audioContext.currentTime) {
				try {
					this.waves[i].audio.stop();
					this.waves[i].audio.disconnect();
				} catch (x) {
					console.log(x);
				}
				this.waves.splice(i, 1);
				return true;
			}
		}
		return false;
	}
	cleanup() {
		while (this.nextClear()) {
			//
		};
	}
}
class ZvoogSimpleSource implements ZvoogSource {
	out: GainNode;
	params: ZvoogParameter[];
	//zones: ZvoogPreset;
	//player: ZvoogPlayer;
	audioContext: AudioContext;
	sines: { node: OscillatorNode, end: number }[];
	envelopes: { when: number, duration: number, base: GainNode }[];
	afterTime: number = 0.008;
	vals: ZvoogValue[]=[];
	prepare(audioContext: AudioContext): void {
		this.out = audioContext.createGain();
		this.params = [];
		this.sines = [];
		this.envelopes = [];
		this.audioContext = audioContext;
		//this.properties = [];
	}
	label(): string {
		return 'Sine Wave';
	}
	getValues(): ZvoogValue[] {
		return this.vals;
	}
	getOutput(): AudioNode {
		return this.out;
	}
	getParams(): ZvoogParameter[] {
		return this.params;
	}
	cancelSchedule(): void {
		for (var i = 0; i < this.sines.length; i++) {
			this.sines[i].node.stop();
		}
	}
	schedule(when: number, tempo: number, chord: ZvoogPitch[][]): void {
		for (var i = 0; i < chord.length; i++) {
			this.single(when, tempo, chord[i]);
		}
	}
	single(when: number, tempo: number, pitches: ZvoogPitch[]): void {
		this.cleanup();
		var oscillator = this.audioContext.createOscillator();
		oscillator.type = 'sine';
		oscillator.frequency.setValueAtTime(this.freq(pitches[0].pitch), when);
		var at = when + duration2time(tempo, pitches[0].duration);
		for (var i = 1; i < pitches.length; i++) {
			oscillator.frequency.linearRampToValueAtTime(this.freq(pitches[i].pitch), at);
			at = at + duration2time(tempo, pitches[i].duration);
		}
		var duration = 0;
		for (let i = 0; i < pitches.length; i++) {
			duration = duration + duration2time(tempo, pitches[i].duration);
		}

		var e = this.findEnvelope(when, duration);
		//console.log(this.audioContext.currentTime,when,when+duration,e);
		//oscillator.connect(this.out);
		oscillator.connect(e.base);

		oscillator.start(when);
		oscillator.stop(when + duration + this.afterTime);
		this.sines.push({ node: oscillator, end: at });

	}
	findEnvelope(when: number, duration: number): { when: number, duration: number, base: GainNode } {
		let envelope: { when: number, duration: number, base: GainNode } | null = null;

		for (let i = 0; i < this.envelopes.length; i++) {
			let e = this.envelopes[i];
			if (this.audioContext.currentTime > e.when + e.duration + this.afterTime) {
				envelope = e;
				//console.log('found');
				break;
			}
		}
		if (!(envelope)) {
			envelope = {
				base: this.audioContext.createGain()
				//, target: target
				, when: 0
				, duration: 0
				/*, cancel: function (): void {
					if (envelope) if (envelope.when + envelope.duration > this.audioContext.currentTime) {
						envelope.base.gain.cancelScheduledValues(0);
						envelope.base.gain.setTargetAtTime(0.00001, this.audioContext.currentTime, 0.1);
						envelope.when = this.audioContext.currentTime + 0.00001;
						envelope.duration = 0;
					}
				}*/
			};
			this.envelopes.push(envelope);
			envelope.base.connect(this.out);
			//envelope.base.gain.setValueAtTime(0.5,0);
			//console.log('created',this.envelopes.length);
		}
		envelope.when = when;
		envelope.duration = duration;
		envelope.base.gain.setValueAtTime(0, 0);
		envelope.base.gain.setValueAtTime(0, when);
		envelope.base.gain.linearRampToValueAtTime(1, when + this.afterTime);
		envelope.base.gain.setValueAtTime(1, when + duration);
		envelope.base.gain.linearRampToValueAtTime(0, when + duration + this.afterTime);
		//envelope.base.gain.setValueAtTime(0, when + duration + this.afterTime);
		//console.log(envelope);
		return envelope;
	};
	busy(): number {
		return 0;
	}
	freq(key: number) {
		var O4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
		var half = Math.floor(key % 12);
		var octave = Math.floor(key / 12);
		var freq0 = O4[half] / (2 * 2 * 2 * 2);
		return freq0 * Math.pow(2, octave);
	}
	nextClear() {
		for (var i = 0; i < this.sines.length; i++) {
			if (this.sines[i].end < this.audioContext.currentTime) {
				try {
					this.sines[i].node.stop();
					this.sines[i].node.disconnect();
				} catch (x) {
					console.log(x);
				}
				this.sines.splice(i, 1);
				return true;
			}
		}
		return false;
	}
	cleanup() {
		while (this.nextClear()) {
			//
		};
	}
}
class ZvoogInstrumentSource implements ZvoogSource {
	base: GainNode;
	params: ZvoogParameter[];
	zones: ZvoogPreset;
	player: ZvoogPlayer;
	audioContext: AudioContext;
	midi = -1;
	vals: ZvoogValue[]=[];
	constructor(midi: number) {
		this.midi = midi;
		//this.properties=[];
	}
	label(): string {
		return 'WAF instrument';
	}
	getValues(): ZvoogValue[] {
		return this.vals;
	}
	prepare(audioContext: AudioContext): void {
		this.base = audioContext.createGain();
		//this.base.gain.setValueAtTime(0.5,0);
		this.params = [];
		this.audioContext = audioContext;
		this.player = new ZvoogPlayer();
		var nn = this.player.findInstrument(this.midi);
		var info = this.player.instrumentInfo(nn);
		this.player.startLoad(audioContext, info.url, info.variable);
	}
	getOutput(): AudioNode {
		return this.base;
	}
	getParams(): ZvoogParameter[] {
		return this.params;
	}
	cancelSchedule(): void {
		this.player.cancelQueue(this.audioContext);
	}
	schedule(when: number, tempo: number, chord: ZvoogPitch[][]): void {
		if (this.zones) {
			for (let i = 0; i < chord.length; i++) {
				this.player.queueWaveTable(this.audioContext, this.base, this.zones, when, tempo,chord[i]);
			}
		}
	}
	busy(): number {
		if (this.zones) {
			return 0;
		}
		var nn = this.player.findInstrument(this.midi);
		var info = this.player.instrumentInfo(nn);
		let z: ZvoogPreset | null = this.player.zones(info.variable);
		if (z) {
			this.zones = z;
			return 0;
		} else {
			return 1;
		}
	}
}
class ZvoogDrumSource implements ZvoogSource {
	base: GainNode;
	params: ZvoogParameter[];
	zones: ZvoogPreset;
	player: ZvoogPlayer;
	audioContext: AudioContext;
	midi = -1;
	vals: ZvoogValue[];
	constructor(midi: number) {
		this.midi = midi;
		//this.properties=[];
	}
	label(): string {
		return 'WAF drum';
	}
	getValues(): ZvoogValue[] {
		return this.vals;
	}
	prepare(audioContext: AudioContext): void {
		this.base = audioContext.createGain();
		//this.base.gain.setValueAtTime(0.5,0);
		this.params = [];
		this.audioContext = audioContext;
		this.player = new ZvoogPlayer();
		var nn = this.player.findDrum(this.midi);
		var info = this.player.drumInfo(nn);
		this.player.startLoad(audioContext, info.url, info.variable);
	}
	getOutput(): AudioNode {
		return this.base;
	}
	getParams(): ZvoogParameter[] {
		return this.params;
	}
	cancelSchedule(): void {
		this.player.cancelQueue(this.audioContext);
	}
	schedule(when: number, tempo: number, chord: ZvoogPitch[][]): void {
		if (this.zones) {
			for (let i = 0; i < chord.length; i++) {
				this.player.queueWaveTable(this.audioContext, this.base, this.zones, when,  tempo,chord[i]);
			}
		}
	}
	busy(): number {
		if (this.zones) {
			return 0;
		}
		var nn = this.player.findDrum(this.midi);
		var info = this.player.drumInfo(nn);
		let z: ZvoogPreset | null = this.player.zones(info.variable);
		if (z) {
			this.zones = z;
			return 0;
		} else {
			return 1;
		}
	}
}

