
class ZvoogParameterEmpty implements ZvoogParameter {
	label(): string {
		return 'Empty parameter';
	}
	cancelScheduledValues(cancelTime: number): void {
		//
	}
	linearRampToValueAtTime(value: number, endTime: number): void {
		//
	}
	setValueAtTime(value: number, startTime: number): void {
		//
	}
}
class ZvoogFilterSourceEmpty implements ZvoogSource, ZvoogEffect {
	base: GainNode;
	params: ZvoogParameter[];
	vals: ZvoogValue[] = [];
	constructor() {
		//
	}
	prepare(audioContext: AudioContext): void {
		this.base = audioContext.createGain();
		this.params = [new ZvoogParameterEmpty(), new ZvoogParameterEmpty()];
	}
	getInput(): AudioNode {
		return this.base;
	}
	getOutput(): AudioNode {
		return this.base;
	}
	getParams(): ZvoogParameter[] {
		return this.params;
	}
	getValues(): ZvoogValue[] {
		return this.vals;
	}
	cancelSchedule(): void {
		//
	}
	schedule(when: number, tempo: number, chord: ZvoogPitch[][]): void {
		//
	}
	busy(): number {
		return 0;
	}
	label(): string {
		return 'Empty filter or source';
	}
}
class TestSong {
	/*createRandomCurve(duration: number): ZvoogCurve {
		//console.log('createRandomCurve',duration);
		let cu: ZvoogCurve = {
			duration: duration
			, points: []
		};
		var curPoint: number = 0;
		while (curPoint < duration) {
			//var delta = Math.round(Math.random() * 5000 + 5000);
			var delta: number = 384 * (Math.random() > 0.5 ? 1 / 4 : 2);//{ count: Math.random() > 0.5 ? 0.25 : 0.5, division: duration.division };
			var po: ZvoogPoint = { duration: delta, velocity: Math.floor(Math.random() * 127) };
			cu.points.push(po);
			curPoint = curPoint + delta;
		}
		return cu;
	}
	createRandomPoint(duration: number):ZvoogPoint{

	}*/
	//createRandomLine(songlenseconds: number): ZvoogParameterLine {
	createRandomLine(measures: ZvoogMeasure[]): ZvoogCurve {

		let lin: ZvoogCurve = {
			points: []
		};
		var m=0;
		lin.points.push({ skipMeasures: 0,skip384:0, velocity: Math.floor(Math.random() * 127) });
		for(let i=0;i<measures.length;i++){
			m=m+1;
			if(Math.random()>0.8){
				lin.points.push({ skipMeasures: m,skip384:0, velocity: Math.floor(Math.random() * 127) });
				m=0;
			}
		}



/*
		var curPoint: number = 0;
		var songlenseconds = durations2time(measures);
		while (curPoint < songlenseconds) {
			//var delta = Math.round(Math.random() * 24000 + 3000);
			var delta: number = 1 + Math.round(Math.random() * songlenseconds);
			var po: ZvoogPoint = { duration: delta, velocity: Math.floor(Math.random() * 127) };
			lin.points.push(po);
			curPoint = curPoint + delta;
		}*/
		return lin;
	}
	//createRandomEffect(songlenseconds: number): ZvoogTrackEffect {
	createRandomEffect(measures: ZvoogMeasure[]): ZvoogTrackEffect {

		let plugin: ZvoogEffect = new ZvoogFilterSourceEmpty();
		let parameters: ZvoogCurve[] = [];
		let parCount: number = 1 + Math.round(Math.random() * 5);
		for (var i = 0; i < parCount; i++) {
			parameters.push(this.createRandomLine(measures));
		}
		let fx: ZvoogTrackEffect = { plugin: plugin,disabled:false, parameters: parameters };
		return fx;
	}
	createRandomPitch(pre: number): ZvoogPitch {
		let d: number = 384 / 8;
		if (Math.random() > 0.5) {
			d = 384 / 4;
		}
		if (Math.random() > 0.5) {
			d = 384 / 2;
		}
		var pi: ZvoogPitch = {
			duration: d
			, pitch: (pre > 0) ? pre + Math.floor(Math.random() * 21 - 10) : Math.floor(Math.random() * 120)
			//,pitch: (pre > 0) ?pre+ 0 : Math.floor(Math.random() * 120)
		};
		//console.log(pre,pi.pitch);
		return pi;

	}
	createRandomName(): string {
		var colors: string[] = ['Red', 'Green', 'Magenta', 'White', 'Yellow', 'Black', 'Pink', 'Blue', 'Cyan', 'Silver'];
		var cnt: number = 1 + Math.ceil(Math.random() * 3);
		var t: string = '';
		for (var i = 0; i < cnt; i++) {
			var n: number = Math.floor(Math.random() * colors.length);
			t = t + colors[n] + ' ';
		}
		return t;
	}
	createRandomChord(count: number, division: number): ZvoogChord {
		let ch: ZvoogChord = {
			//when: Math.round(Math.random() * duration.count ) 
			when: Math.floor((384 * Math.random() * count / division) / 24) * 24
			, values: []
			, title: ''
			, fretHint: []
			, text: ''
		};
		if (Math.random() > 0.95) {
			ch.title = 'G' + Math.round(Math.random() * 10);
		}
		if (Math.random() > 0.95) {
			ch.title = 'Em' + Math.round(Math.random() * 10);
		}
		if (Math.random() > 0.95) {
			ch.title = 'A7' + Math.round(Math.random() * 10);
		}
		if (Math.random() > 0.95) {
			ch.text = 'Bla-bla-bla';
		}
		let valCount: number = Math.round(Math.random() * 2) + 1;
		/*var k: ZvoogKey = { envelope: [this.createRandomPitch()] };
		if (Math.random() > 0.9) {
			k.envelope.push(this.createRandomPitch());
		}*/
		for (var i = 0; i < valCount; i++) {
			//var pitch:ZvoogPitch=this.createRandomPitch();
			var k: ZvoogKey = {
				envelope: [this.createRandomPitch(0)]
				, stepHint: 0
				, shiftHint: 0
				, octaveHint: 0
			};
			if (Math.random() > 0.9) {
				k.envelope.push(this.createRandomPitch(k.envelope[0].pitch));
			}
			//k.envelope.push(this.createRandomPitch(k.envelope[0].pitch));
			//k.envelope.push(this.createRandomPitch(k.envelope[0].pitch));
			ch.values.push(k);
		}
		return ch;
	}
	//createRandomChunk(count: number, division: number): ZvoogPattern {
	createRandomChunk(meausere: ZvoogMeasure): ZvoogPattern {
		var p: ZvoogPattern = {
			//meter: duration
			/*meter: {
				count: count
				, division: division
			}
			, tempo: Math.random() > 0.8 ? 120 : 100
			,*/ chords: []
			, title: '/' + Math.round(Math.random() * 1000)
			, clefHint: Math.round(Math.random() * 3)
			, keyHint: Math.round(Math.random() * 22 - 11)
		};
		let chCount: number = 1 + Math.round(Math.random() * 2);
		for (var i = 0; i < chCount; i++) {
			p.chords.push(this.createRandomChord(meausere.meter.count, meausere.meter.division));
		}
		return p;
	}
	createRandomMeasure(count: number, division: number): ZvoogMeasure {
		var p: ZvoogMeasure = {
			meter: {
				count: count
				, division: division
			}
			, tempo: Math.random() > 0.8 ? 120 : 100
		};
		return p;
	}
	createRandomVoice(measures: ZvoogMeasure[], voiceOrder: number): ZvoogVoice {
		let v: ZvoogVoice = {
			chunks: []
			,disabled:false
			, source: {
				plugin: new ZvoogFilterSourceEmpty()
				, parameters: []
			}
			, effects: []
			, title: this.createRandomName() + 'voice '
		};
		let parCount: number = 1 + Math.round(Math.random() * 5);
		for (var i = 0; i < parCount; i++) {
			v.source.parameters.push(this.createRandomLine(measures));
		}
		var mainFxCount = 1 + Math.round(Math.random() * 3);
		for (var i = 0; i < mainFxCount; i++) {
			v.effects.push(this.createRandomEffect(measures));
		}
		/*var curPoint: number = 0;
		while (curPoint < songlenseconds) {
			//var delta = Math.round(Math.random() * 5000 + 3000);
			//var delta: number = Math.random() > 0.9 ? 3 * 384 / 4 : 4 * 384 / 4;
			var cnt = Math.random() > 0.9 ? 3 : 4;
			v.chunks.push(this.createRandomChunk(cnt, 4));
			curPoint = curPoint + cnt * 384 / 4;
		}*/
		for (var i = 0; i < measures.length; i++) {
			v.chunks.push(this.createRandomChunk(measures[i]));
		}
		return v;
	}
	//createRandomTrack(songlenseconds: number, trackOrder: number): ZvoogTrack {
	createRandomTrack(measures: ZvoogMeasure[], trackOrder: number): ZvoogTrack {
		let t: ZvoogTrack = {
			voices: []
			,disabled:false
			, effects: []
			, title: this.createRandomName() + 'track '
			, strings: []
		};
		var mainFxCount = 1 + Math.round(Math.random() * 3);
		for (var i = 0; i < mainFxCount; i++) {
			t.effects.push(this.createRandomEffect(measures));
		}
		var mainVoxCount = 1 + Math.round(Math.random() * 3 + 1);
		for (var i = 0; i < mainVoxCount; i++) {
			t.voices.push(this.createRandomVoice(measures, i));
		}
		return t;
	}
	createKeyPattern(): number[] {
		var keyPattern: number[] = [];
		for (var o = 0; o < 10; o++) {
			keyPattern.push(3);
			keyPattern.push(2);
			keyPattern.push(1);
			keyPattern.push(2);
			keyPattern.push(1);
			keyPattern.push(1);
			keyPattern.push(2);
			keyPattern.push(1);
			keyPattern.push(2);
			keyPattern.push(1);
			keyPattern.push(2);
			keyPattern.push(1);
		}
		return keyPattern;
	}
	createRandomSchedule(): ZvoogSchedule {
		//var duration: ZvoogMeter = { count: Math.round(Math.random() * 100 + 50) * 4, division: 4 };//Math.round(Math.random() * 2 + 1) * 60000;
		var songdurationseconds: number = Math.round(Math.random() * 200 + 150) * 50;//Math.round(Math.random() * 2 + 1) * 60000;
		var t = this.createRandomName() + 'project';

		let s: ZvoogSchedule = {
			title: t
			, description: this.createRandomName() + 'description'
			//, duration: duration
			, timeline: []
			, tracks: []
			, effects: []
			, macros: [
				/*
								{
									key: undoRedoBunch, point: { x: 0, y: 0, z: 100 }, properties: {
										commands: [
											{ key: undoRedoChangeProjectTitle, properties: { oldTitle: 'old project title', newTitle: 'Next title' }, point: { x: 0, y: 0, z: 100 } }
											, { key: undoRedoChangeProjectTitle, properties: { oldTitle: 'Next title', newTitle: 'Another title' }, point: { x: 0, y: 0, z: 100 } }
											, { key: undoRedoChangeProjectTitle, properties: { oldTitle: 'Another title', newTitle: t }, point: { x: 0, y: 0, z: 100 } }
										]
									}
								}*/

			]
			, macroPosition: 2
			, masterPosition: 1
			, gridPattern: [
				{ duration: 384 / 16, power: 3 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 1 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 2 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 1 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 0 }
				, { duration: 384 / 16, power: 0 }
			]
			, keyPattern: this.createKeyPattern()
			, horizontal: true
			, locked: false
			, selectedLayer: { track_songFx: 0, voice_trackFx_songFxParam: 0, source_voiceFx_trackParam: 0, sourceParam_voiceFxParam: 0 }
			,selectedMeasures:{from:0,duration:0}
		};
		var curPoint: number = 0;
		while (curPoint < songdurationseconds) {
			var cnt = Math.random() > 0.9 ? 3 : 4;
			var measure: ZvoogMeasure = this.createRandomMeasure(cnt, 4);
			s.timeline.push(measure);
			curPoint = curPoint + cnt * 384 / 4;
		}
		var mainFxCount = 1 + Math.round(Math.random() * 3);
		//console.log('mainFxCount',mainFxCount);
		for (var i = 0; i < mainFxCount; i++) {
			s.effects.push(this.createRandomEffect(s.timeline));
		}
		var trkCount = Math.round(Math.random() * 5) + 1;
		for (var i = 0; i < trkCount; i++) {
			s.tracks.push(this.createRandomTrack(s.timeline, i));
		}
		var tc: number = 0;
		var vc: number = 0;
		if (s.tracks.length > 1) tc = 1;
		if (s.tracks[tc].voices.length > 1) vc = 1;
		s.selectedLayer.track_songFx = tc;
		s.selectedLayer.voice_trackFx_songFxParam = vc;
		return s;
	}
}

