
type XYp = {
	x: number;
	y: number;
};
type PP = {
	p1: XYp;
	p2: XYp;
};
class DataViewStream {
	position = 0;
	buffer: DataView;
	constructor(dv: DataView) {
		this.buffer = dv;
	}
	readUint8(): number {
		var n: number = (this.buffer as DataView).getUint8(this.position);
		this.position++;
		return n;
	}
	readUint16(): number {
		var v = (this.buffer as DataView).getUint16(this.position);
		this.position = this.position + 2;
		return v;
	}
	readVarInt(): number {
		var v: number = 0;
		var i: number = 0;
		var b: number;
		while (i < 4) {
			b = this.readUint8();
			if (b & 0x80) {
				v = v + (b & 0x7f);
				v = v << 7;
			} else {
				return v + b;
			}
			i++;
		}
		throw new Error('readVarInt ' + i);
	}
	readBytes(length: number): number[] {
		var bytes: number[] = [];
		for (var i = 0; i < length; i++) {
			bytes.push(this.readUint8());
		}
		return bytes;
	}
	/*pos(): string {
		return '0x' + (this.buffer.byteOffset + this.position).toString(16);
	}*/
	offset(): number {
		return this.buffer.byteOffset + this.position;
	}
	end(): boolean {
		return this.position == this.buffer.byteLength;
	}
}
class MIDIFileHeader {
	datas: DataView;
	HEADER_LENGTH: number = 14;
	//FRAMES_PER_SECONDS: number = 1;
	//TICKS_PER_BEAT: number = 2;
	format: number;
	trackCount: number;
	//ticksPerBeat: number;
	//ticksPerFrame: number;
	tempoBPM: number = 120;
	meterCount: number = 4;
	meterDivision: number = 4;
	keyFlatSharp: number = 0;
	keyMajMin: number = 0;
	lastNonZeroQuarter: number = 0;
	constructor(buffer: ArrayBuffer) {
		this.datas = new DataView(buffer, 0, this.HEADER_LENGTH);
		this.format = this.datas.getUint16(8);
		this.trackCount = this.datas.getUint16(10);
		//this.ticksPerBeat = this.datas.getUint16(12);
		//this.ticksPerFrame = this.datas.getUint16(12);
	}
	getTickResolution(tempo: number): number {
		//console.log('getTickResolution', tempo);
		if (tempo) {
			this.lastNonZeroQuarter = tempo;
		} else {
			if (this.lastNonZeroQuarter) {
				tempo = this.lastNonZeroQuarter;
			} else {
				tempo = 60000000 / this.tempoBPM;
			}
		}

		// Frames per seconds
		if (this.datas.getUint16(12) & 0x8000) {
			var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
			// Ticks per beat
			//console.log('per frame', r);
			return r;
		} else {
			// Default MIDI tempo is 120bpm, 500ms per beat
			tempo = tempo || 500000;
			var r: number = tempo / this.getTicksPerBeat();
			//console.log('per beat', r);
			return r;
		}
	}
	/*getTimeDivision(): number {
		if (this.datas.getUint16(12) & 0x8000) {
			return this.FRAMES_PER_SECONDS;
		}
		return this.TICKS_PER_BEAT;
	}*/
	getTicksPerBeat(): number {
		var divisionWord = this.datas.getUint16(12);
		return divisionWord;
	}
	getTicksPerFrame(): number {
		const divisionWord = this.datas.getUint16(12);
		return divisionWord & 0x00ff;
	}
	getSMPTEFrames(): number {
		const divisionWord = this.datas.getUint16(12);
		let smpteFrames: number;
		smpteFrames = divisionWord & 0x7f00;
		if (smpteFrames == 29) {
			return 29.97
		} else {
			return smpteFrames;
		}
	}
}
type TrackChord = {
	when: number
	, channel: number
	, notes: TrackNote[]
};
type TrackNote = {
	closed: boolean
	, points: NotePitch[]
}
type NotePitch = {
	pointDuration: number
	, pitch: number
}
class MIDIFileTrack {
	datas: DataView;
	HDR_LENGTH: number = 8;
	trackLength: number;
	trackContent: DataView;
	events: MIDIEvent[];
	title: string;
	instrument: string;
	program: number;
	volume: number;
	chords: TrackChord[] = [];
	constructor(buffer: ArrayBuffer, start: number) {
		this.datas = new DataView(buffer, start, this.HDR_LENGTH);
		this.trackLength = this.datas.getUint32(4);
		/*console.log(String.fromCharCode(this.datas.getUint8(0)));
		console.log(String.fromCharCode(this.datas.getUint8(1)));
		console.log(String.fromCharCode(this.datas.getUint8(2)));
		console.log(String.fromCharCode(this.datas.getUint8(3)));
		console.log(this.trackLength);*/
		this.datas = new DataView(buffer, start, this.HDR_LENGTH + this.trackLength);
		this.trackContent = new DataView(this.datas.buffer, this.datas.byteOffset + this.HDR_LENGTH, this.datas.byteLength - this.HDR_LENGTH);
		this.events = [];
	}
}
type MIDIEvent = {
	offset: number
	, delta: number
	, eventTypeByte: number

	, basetype?: number
	, subtype?: number
	, index?: string
	, length?: number
	, msb?: number
	, lsb?: number
	, prefix?: number
	, data?: number[]
	, tempo?: number
	, tempoBPM?: number
	, hour?: number
	, minutes?: number
	, seconds?: number
	, frames?: number
	, subframes?: number
	, key?: number
	, param1?: number
	, param2?: number
	, param3?: number
	, param4?: number
	, scale?: number
	, badsubtype?: number
	, midiChannel?: number
	, playTime?: number
	, trackNum?: number
	, text?: string
}
class MidiParser {
	header: MIDIFileHeader;
	tracks: MIDIFileTrack[];

	EVENT_META: number = 0xff;
	EVENT_SYSEX: number = 0xf0;
	EVENT_DIVSYSEX: number = 0xf7;
	EVENT_MIDI: number = 0x8;
	// Meta event types
	EVENT_META_SEQUENCE_NUMBER: number = 0x00;
	EVENT_META_TEXT: number = 0x01;
	EVENT_META_COPYRIGHT_NOTICE: number = 0x02;
	EVENT_META_TRACK_NAME: number = 0x03;
	EVENT_META_INSTRUMENT_NAME: number = 0x04;
	EVENT_META_LYRICS: number = 0x05;
	EVENT_META_MARKER: number = 0x06;
	EVENT_META_CUE_POINT: number = 0x07;
	EVENT_META_MIDI_CHANNEL_PREFIX: number = 0x20;
	EVENT_META_END_OF_TRACK: number = 0x2f;
	EVENT_META_SET_TEMPO: number = 0x51;
	EVENT_META_SMTPE_OFFSET: number = 0x54;
	EVENT_META_TIME_SIGNATURE: number = 0x58;
	EVENT_META_KEY_SIGNATURE: number = 0x59;
	EVENT_META_SEQUENCER_SPECIFIC: number = 0x7f;
	// MIDI event types
	EVENT_MIDI_NOTE_OFF: number = 0x8;
	EVENT_MIDI_NOTE_ON: number = 0x9;
	EVENT_MIDI_NOTE_AFTERTOUCH: number = 0xa;
	EVENT_MIDI_CONTROLLER: number = 0xb;
	EVENT_MIDI_PROGRAM_CHANGE: number = 0xc;
	EVENT_MIDI_CHANNEL_AFTERTOUCH: number = 0xd;
	EVENT_MIDI_PITCH_BEND: number = 0xe;
	// MIDI event sizes
	//MIDI_1PARAM_EVENTS: number[];
	//MIDI_2PARAMS_EVENTS: number[];

	midiEventType: number = 0;
	midiEventChannel: number = 0;
	midiEventParam1: number = 0;

	constructor(arrayBuffer: ArrayBuffer) {
		/*this.MIDI_1PARAM_EVENTS = [
			this.EVENT_MIDI_PROGRAM_CHANGE,
			this.EVENT_MIDI_CHANNEL_AFTERTOUCH,
		];
		this.MIDI_2PARAMS_EVENTS = [
			this.EVENT_MIDI_NOTE_OFF,
			this.EVENT_MIDI_NOTE_ON,
			this.EVENT_MIDI_NOTE_AFTERTOUCH,
			this.EVENT_MIDI_CONTROLLER,
			this.EVENT_MIDI_PITCH_BEND,
		];*/
		this.header = new MIDIFileHeader(arrayBuffer);
		this.parseTracks(arrayBuffer);
	}
	parseTracks(arrayBuffer: ArrayBuffer) {
		var curIndex: number = this.header.HEADER_LENGTH;
		var trackCount: number = this.header.trackCount;
		this.tracks = [];
		for (var i = 0; i < trackCount; i++) {
			var track: MIDIFileTrack = new MIDIFileTrack(arrayBuffer, curIndex);
			this.tracks.push(track);
			// Updating index to the track end
			curIndex = curIndex + track.trackLength + 8;
		}
		for (var i = 0; i < this.tracks.length; i++) {
			this.parseEvents(this.tracks[i]);
		}
		this.parseNotes();
		this.simplify();
	}
	toText(arr: number[]): string {
		var r: string = '';
		for (var i = 0; i < arr.length; i++) {
			r = r + String.fromCharCode(arr[i]);
		}
		return r;
	}
	findChordBefore(when: number, track: MIDIFileTrack, channel: number): TrackChord | null {
		for (var i = 0; i < track.chords.length; i++) {
			var chord = track.chords[track.chords.length - i - 1];
			if (chord.when < when && chord.channel == channel) {
				return chord;
			}
		}
		return null;
	}
	findOpenedNoteBefore(firstPitch: number, when: number, track: MIDIFileTrack, channel: number): { chord: TrackChord, note: TrackNote } | null {
		var before = when;
		var chord = this.findChordBefore(before, track, channel);
		while (chord) {
			for (var i = 0; i < chord.notes.length; i++) {
				var note: TrackNote = chord.notes[i];
				if (!(note.closed)) {
					if (firstPitch == note.points[0].pitch) {
						return { chord: chord, note: note };
					}
				}
			}
			before = chord.when;
			chord = this.findChordBefore(before, track, channel);
		}
		//console.log('no',first,'before',when,'at',trackNo);
		return null;
	}
	takeChord(when: number, track: MIDIFileTrack, channel: number): TrackChord {
		for (var i = 0; i < track.chords.length; i++) {
			if (track.chords[i].when == when && track.chords[i].channel == channel) {
				return track.chords[i];
			}
		}
		var ch: TrackChord = {
			when: when
			, channel: channel
			, notes: []
		};
		track.chords.push(ch);
		return ch;
	}
	takeOpenedNote(first: number, when: number, track: MIDIFileTrack, channel: number): TrackNote {
		var chord: TrackChord = this.takeChord(when, track, channel);
		for (var i = 0; i < chord.notes.length; i++) {
			if (!(chord.notes[i].closed)) {
				if (chord.notes[i].points[0].pitch == first) {
					return chord.notes[i];
				}
			}
		}
		var pi: TrackNote = { closed: false, points: [] };
		pi.points.push({ pointDuration: -1, pitch: first });
		chord.notes.push(pi);
		return pi;
	}

	distanceToPoint(line: PP, point: XYp): number {
		var m: number = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
		var b: number = line.p1.y - (m * line.p1.x);
		var d: number[] = [];
		d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
		d.push(Math.sqrt(Math.pow((point.x - line.p1.x), 2) + Math.pow((point.y - line.p1.y), 2)));
		d.push(Math.sqrt(Math.pow((point.x - line.p2.x), 2) + Math.pow((point.y - line.p2.y), 2)));
		d.sort(function (a, b) {
			return (a - b);
		});
		return d[0];
	};
	douglasPeucker(points: XYp[], tolerance: number): XYp[] {
		if (points.length <= 2) {
			return [points[0]];
		}
		var returnPoints: XYp[] = [];
		var line: PP = { p1: points[0], p2: points[points.length - 1] };
		var maxDistance = 0;
		var maxDistanceIndex = 0;
		var p: XYp;
		for (var i = 1; i <= points.length - 2; i++) {
			var distance = this.distanceToPoint(line, points[i]);
			if (distance > maxDistance) {
				maxDistance = distance;
				maxDistanceIndex = i;
			}
		}
		if (maxDistance >= tolerance) {
			p = points[maxDistanceIndex];
			this.distanceToPoint(line, p);
			returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
			returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
		} else {
			p = points[maxDistanceIndex];
			this.distanceToPoint(line, p);
			returnPoints = [points[0]];
		}
		return returnPoints;
	};
	simplifyPath(points: XYp[], tolerance: number): XYp[] {
		var arr: XYp[] = this.douglasPeucker(points, tolerance);
		arr.push(points[points.length - 1]);
		return arr;
	}
	simplify() {
		for (var t = 0; t < this.tracks.length; t++) {
			var track: MIDIFileTrack = this.tracks[t];
			for (var ch = 0; ch < track.chords.length; ch++) {
				var chord: TrackChord = track.chords[ch];
				for (var n = 0; n < chord.notes.length; n++) {
					var note: TrackNote = chord.notes[n];
					if (note.points.length > 5) {
						var xx = 0;
						var pnts: XYp[] = [];
						for (var p = 0; p < note.points.length; p++) {
							note.points[p].pointDuration = Math.max(note.points[p].pointDuration, 0);
							pnts.push({ x: xx, y: note.points[p].pitch });
							xx = xx + note.points[p].pointDuration;
						}
						pnts.push({ x: xx, y: note.points[note.points.length-1].pitch });
						var lessPoints: XYp[] = this.simplifyPath(pnts, 1.5);
						//console.log(note);
						//console.log(pnts);
						//console.log(lessPoints);

						note.points = [];
						for (var p = 0; p < lessPoints.length - 1; p++) {
							var xypoint: XYp = lessPoints[p];
							var xyduration = lessPoints[p + 1].x - xypoint.x;
							note.points.push({ pointDuration: xyduration, pitch: xypoint.y });
						}
					} else {
						if (note.points.length == 1) {
							if (note.points[0].pointDuration > 4321) {
								//console.log(note.points[0].pointDuration,note);
								note.points[0].pointDuration = 1234;
							}
						}
					}
				}
			}
		}
	}
	parseNotes() {
		for (var t = 0; t < this.tracks.length; t++) {
			var track: MIDIFileTrack = this.tracks[t];
			var playTimeTicks = 0;
			var tickResolution = this.header.getTickResolution(0);

			for (var e = 0; e < track.events.length; e++) {
				var evnt = track.events[e];
				var curDelta = 0;
				if (evnt.delta) curDelta = evnt.delta;
				//playTimeTicks = playTimeTicks + curDelta;
				playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000;
				//console.log(playTimeTicks,curDelta,curDelta * tickResolution / 1000);
				if (evnt.basetype === this.EVENT_META) {
					// tempo change events
					if (evnt.subtype === this.EVENT_META_SET_TEMPO) {
						if (evnt.tempo) tickResolution = this.header.getTickResolution(evnt.tempo);
					}
				}
				evnt.playTime = playTimeTicks;
				//console.log(tickResolution, evnt.playTime, evnt);
			}
			//console.log(t, playTime);
			for (var e = 0; e < track.events.length; e++) {
				var evnt = track.events[e];
				//console.log(t, evnt);
				if (evnt.basetype == this.EVENT_MIDI) {

					evnt.param1 = evnt.param1 ? evnt.param1 : 0;
					/*if (evnt.midiChannel == 9) {
						if (evnt.param1 >= 35 && evnt.param1 <= 81) {
							if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
								//this.startDrum(evnt);
							} else {
								if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
									//this.closeDrum(evnt);
								}
							}
						}
					} else {*/
					//console.log(evnt.subtype);
					if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
						if (evnt.param1 >= 0 && evnt.param1 <= 127) {
							//this.startNote(evnt);
							//console.log(evnt);
							var pitch = evnt.param1 ? evnt.param1 : 0;
							var when = 0;
							if (evnt.playTime) when = evnt.playTime;
							this.takeOpenedNote(pitch, when, track, evnt.midiChannel ? evnt.midiChannel : 0);
						}
					} else {
						if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
							if (evnt.param1 >= 0 && evnt.param1 <= 127) {
								//this.closeNote(evnt);
								var pitch = evnt.param1 ? evnt.param1 : 0;
								var when = 0;
								if (evnt.playTime) when = evnt.playTime;
								var chpi = this.findOpenedNoteBefore(pitch, when, track, evnt.midiChannel ? evnt.midiChannel : 0);
								if (chpi) {
									var duration = 0;
									for (var i = 0; i < chpi.note.points.length - 1; i++) {
										duration = duration + chpi.note.points[i].pointDuration;
									}
									chpi.note.points[chpi.note.points.length - 1].pointDuration = when - chpi.chord.when - duration;
									chpi.note.closed = true;
								}
							}
						} else {
							if (evnt.subtype == this.EVENT_MIDI_PROGRAM_CHANGE) {
								if (evnt.param1 >= 0 && evnt.param1 <= 127) {
									//this.setProgram(evnt);
									//console.log('setProgram', evnt.param1,evnt.param2,evnt);
									track.program = evnt.param1 ? evnt.param1 : 0;
									//track.volume = evnt.param2 ? evnt.param2 : 0.001;
								}
							} else {
								if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
									//this.bendNote(evnt);

									var pitch = evnt.param1 ? evnt.param1 : 0;
									var slide = ((evnt.param2 ? evnt.param2 : 0) - 64) / 6;
									var when = evnt.playTime ? evnt.playTime : 0;
									var chord: TrackChord | null = this.findChordBefore(when, track, evnt.midiChannel ? evnt.midiChannel : 0);
									if (chord) {
										for (var i = 0; i < chord.notes.length; i++) {
											var note: TrackNote = chord.notes[i];
											if (!(note.closed)) {
												var duration = 0;
												for (var k = 0; k < note.points.length - 1; k++) {
													duration = duration + note.points[k].pointDuration;
												}
												note.points[note.points.length - 1].pointDuration = when - chord.when - duration;
												//console.log('bend',t,note.points[note.points.length - 1].pointDuration, when, chord.when, duration);
												var firstpitch: number = note.points[0].pitch + slide;
												var point: NotePitch = {
													pointDuration: -1
													, pitch: firstpitch
												};
												note.points.push(point);
											}
										}
									}
								} else {

									if (evnt.subtype == this.EVENT_MIDI_CONTROLLER && evnt.param1 == 7) {
										//console.log(evnt);
										track.volume = evnt.param2 ? evnt.param2 / 127 : 0;
									} else {
										//
									}
								}
							}
						}
					}
					//}
				} else {
					//console.log((evnt.subtype?evnt.subtype:0).toString(16), evnt);
					if (evnt.subtype == this.EVENT_META_TEXT) {
						//console.log('EVENT_META_TEXT', this.eventText(evnt), evnt);
					}
					if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
						//console.log('EVENT_META_COPYRIGHT_NOTICE', this.eventText(evnt), evnt);
					}
					if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
						//console.log('EVENT_META_TRACK_NAME', this.eventText(evnt), evnt);
						//this.setTitle(evnt);
						//console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
						track.title = this.toText(evnt.data ? evnt.data : []);
					}
					if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
						//console.log('EVENT_META_INSTRUMENT_NAME', this.eventText(evnt), evnt);
						//console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
						track.instrument = this.toText(evnt.data ? evnt.data : []);
					}
					if (evnt.subtype == this.EVENT_META_LYRICS) {
						//console.log('EVENT_META_LYRICS', this.eventText(evnt), evnt);
						//console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
					}
					if (evnt.subtype == this.EVENT_META_LYRICS) {
						//console.log('EVENT_META_LYRICS', this.eventText(evnt), evnt);
						//console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
					}
					if (evnt.subtype == this.EVENT_META_KEY_SIGNATURE) {
						//console.log(t,'EVENT_META_KEY_SIGNATURE',evnt.key,evnt.scale);
						var key: number = evnt.key ? evnt.key : 0;
						if (key > 127) key = key - 256;
						this.header.keyFlatSharp = key;//-sharp+flat
						this.header.keyMajMin = evnt.scale ? evnt.scale : 0;//0-maj, 1 min
					}
					if (evnt.subtype == this.EVENT_META_SET_TEMPO) {
						//console.log(t,'EVENT_META_SET_TEMPO',evnt.tempoBPM);
						this.header.tempoBPM = evnt.tempoBPM ? evnt.tempoBPM : 120;
					}
					if (evnt.subtype == this.EVENT_META_TIME_SIGNATURE) {
						//console.log(t,'EVENT_META_TIME_SIGNATURE',evnt);
						this.header.meterCount = evnt.param1 ? evnt.param1 : 4;
						var dvsn: number = evnt.param2 ? evnt.param2 : 2;
						if (dvsn == 1) this.header.meterDivision = 2
						else if (dvsn == 2) this.header.meterDivision = 4
						else if (dvsn == 3) this.header.meterDivision = 8
						else if (dvsn == 4) this.header.meterDivision = 16
						else if (dvsn == 5) this.header.meterDivision = 32

						//console.log(t,'EVENT_META_TIME_SIGNATURE',this.header.meterCount,this.header.meterDivision,evnt);
					}
				}
			}
		}
	}
	nextEvent(stream: DataViewStream): MIDIEvent {
		var index = stream.offset();
		var delta = stream.readVarInt();
		var eventTypeByte: number = stream.readUint8();
		var event: MIDIEvent = { offset: index, delta: delta, eventTypeByte: eventTypeByte };
		//track.events.push(event);
		if (0xf0 === (eventTypeByte & 0xf0)) {
			// Meta events
			if (eventTypeByte === this.EVENT_META) {
				event.basetype = this.EVENT_META;
				event.subtype = stream.readUint8();
				event.length = stream.readVarInt();
				switch (event.subtype) {
					case this.EVENT_META_SEQUENCE_NUMBER:
						event.msb = stream.readUint8();
						event.lsb = stream.readUint8();
						console.log('EVENT_META_SEQUENCE_NUMBER', event);
						return event;
					case this.EVENT_META_TEXT:
					case this.EVENT_META_COPYRIGHT_NOTICE:
					case this.EVENT_META_TRACK_NAME:
					case this.EVENT_META_INSTRUMENT_NAME:
					case this.EVENT_META_LYRICS:
					case this.EVENT_META_MARKER:
					case this.EVENT_META_CUE_POINT:
						event.data = stream.readBytes(event.length);
						event.text = this.toText(event.data ? event.data : []);
						//console.log('txt',event);
						return event;
					case this.EVENT_META_MIDI_CHANNEL_PREFIX:
						event.prefix = stream.readUint8();
						//console.log('EVENT_META_MIDI_CHANNEL_PREFIX',event);
						return event;
					case this.EVENT_META_END_OF_TRACK:
						//console.log('EVENT_META_END_OF_TRACK',event);
						return event;
					case this.EVENT_META_SET_TEMPO:
						event.tempo = (stream.readUint8() << 16) + (stream.readUint8() << 8) + stream.readUint8();
						event.tempoBPM = 60000000 / event.tempo;
						//console.log('EVENT_META_SET_TEMPO',event);
						return event;
					case this.EVENT_META_SMTPE_OFFSET:
						event.hour = stream.readUint8();
						event.minutes = stream.readUint8();
						event.seconds = stream.readUint8();
						event.frames = stream.readUint8();
						event.subframes = stream.readUint8();
						//console.log('EVENT_META_SMTPE_OFFSET',event);
						return event;
					case this.EVENT_META_KEY_SIGNATURE:
						event.key = stream.readUint8();
						event.scale = stream.readUint8();
						//console.log('EVENT_META_KEY_SIGNATURE',event);
						return event;
					case this.EVENT_META_TIME_SIGNATURE:
						event.data = stream.readBytes(event.length);
						event.param1 = event.data[0];
						event.param2 = event.data[1];
						event.param3 = event.data[2];
						event.param4 = event.data[3];
						//console.log('EVENT_META_TIME_SIGNATURE',event);
						return event;
					case this.EVENT_META_SEQUENCER_SPECIFIC:
						event.data = stream.readBytes(event.length);
						//console.log('EVENT_META_SEQUENCER_SPECIFIC',event);
						return event;
					default:
						event.data = stream.readBytes(event.length);
						//console.log('unknown meta',event);
						return event;
				}
				// System events
			} else {
				if (eventTypeByte === this.EVENT_SYSEX || eventTypeByte === this.EVENT_DIVSYSEX) {
					event.basetype = eventTypeByte;
					event.length = stream.readVarInt();
					event.data = stream.readBytes(event.length);
					return event;
					// Unknown event, assuming it's system like event
				} else {
					event.basetype = eventTypeByte;
					event.badsubtype = stream.readVarInt();
					event.length = stream.readUint8();
					event.data = stream.readBytes(event.length);
					return event;
				}
			}
		} else {
			// running status
			if (0 === (eventTypeByte & 0x80)) {
				if (!this.midiEventType) {
					throw new Error('no pre event' + stream.offset());
				}
				this.midiEventParam1 = eventTypeByte;
			} else {
				this.midiEventType = eventTypeByte >> 4;
				this.midiEventChannel = eventTypeByte & 0x0f;
				this.midiEventParam1 = stream.readUint8();
			}
			event.basetype = this.EVENT_MIDI;
			event.subtype = this.midiEventType;
			event.midiChannel = this.midiEventChannel;
			event.param1 = this.midiEventParam1;
			switch (this.midiEventType) {
				case this.EVENT_MIDI_NOTE_OFF:
					event.param2 = stream.readUint8();
					return event;
				case this.EVENT_MIDI_NOTE_ON:
					event.param2 = stream.readUint8();
					// If velocity is 0, it's a note off event in fact
					if (!event.param2) {
						event.subtype = this.EVENT_MIDI_NOTE_OFF;
						event.param2 = 127; // Find a standard telling what to do here
					}
					return event;
				case this.EVENT_MIDI_NOTE_AFTERTOUCH:
					event.param2 = stream.readUint8();
					return event;
				case this.EVENT_MIDI_CONTROLLER:
					event.param2 = stream.readUint8();
					if (event.param1 == 7) {
						//console.log(event);
					}
					return event;
				case this.EVENT_MIDI_PROGRAM_CHANGE:
					//event.param2 = stream.readUint8();
					return event;
				case this.EVENT_MIDI_CHANNEL_AFTERTOUCH:
					return event;
				case this.EVENT_MIDI_PITCH_BEND:
					event.param2 = stream.readUint8();
					return event;
				default:
					//console.log('unknown note',event);
					return event;
			}
		}
		//console.log(stream.position,stream.buffer.byteLength);
	}
	parseEvents(track: MIDIFileTrack) {
		var stream: DataViewStream = new DataViewStream(track.trackContent);
		this.midiEventType = 0;
		this.midiEventChannel = 0;
		this.midiEventParam1 = 0;
		while (!stream.end()) {
			var e: MIDIEvent = this.nextEvent(stream);
			track.events.push(e);
		}
	}
	takeMeasure(track: SongTrack, when: number, bpm: number, meter: number): SongMeasure {
		var q: number = 60 / bpm;
		var duration: number = 1000 * q * meter * 4;
		var idx = Math.floor(when / duration);
		for (var i = 0; i <= idx; i++) {
			if (track.measures.length < 1 + idx) {
				var m: SongMeasure = {
					duration: duration,
					chords: []
				};
				track.measures.push(m);
			}
		}
		//console.log(when,track.measures.length,idx);
		return track.measures[idx];
	}
	takeDrumVoice(drum: number, drumVoices: { voice: ZvoogVoice, drum: number }[]): { voice: ZvoogVoice, drum: number } {
		for (var i = 0; i < drumVoices.length; i++) {
			if (drumVoices[i].drum == drum) {
				return drumVoices[i];
			}
		}
		var voice: ZvoogVoice = {
			chunks: []
			, source: {
				plugin: new ZvoogFilterSourceEmpty()
				, parameters: []
			}
			, effects: []
			, title: 'Drum ' + drum
		};
		var drvc = { voice: voice, drum: drum };
		drumVoices.push(drvc);
		return drvc;
	}
	meter44(): ZvoogGridStep[] {
		return [
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
		];
	}
	meter24(): ZvoogGridStep[] {
		return [
			{ duration: 384 / 16, power: 3 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
		];
	}
	meter54(): ZvoogGridStep[] {
		return [
			{ duration: 384 / 16, power: 3 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
		];
	}
	meter34(): ZvoogGridStep[] {
		return [
			{ duration: 384 / 16, power: 3 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 1 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
			, { duration: 384 / 16, power: 0 }
		];
	}
	convert(): ZvoogSchedule {
		var midisong: SongData = this.dump();
		var gridPat: ZvoogGridStep[] = this.meter44();
		if (midisong.meter.count == 2 && midisong.meter.division == 4) {
			gridPat = this.meter24();
		}
		if (midisong.meter.count == 3 && midisong.meter.division == 4) {
			gridPat = this.meter34();
		}
		if (midisong.meter.count == 5 && midisong.meter.division == 4) {
			gridPat = this.meter54();
		}
		let schedule: ZvoogSchedule = {
			title: 'import from *.mid'
			, description: 'none'
			//, duration: duration
			, tracks: []
			, effects: []
			, macros: []
			, macroPosition: 2
			, masterPosition: 1
			, gridPattern: gridPat
			, keyPattern: []
			, horizontal: true
			, locked: false
			, selectedTrack: 0
			, selectedVoice: 0
		};
		for (var o = 0; o < 10; o++) {
			schedule.keyPattern.push(3);
			schedule.keyPattern.push(2);
			schedule.keyPattern.push(1);
			schedule.keyPattern.push(2);
			schedule.keyPattern.push(1);
			schedule.keyPattern.push(1);
			schedule.keyPattern.push(2);
			schedule.keyPattern.push(1);
			schedule.keyPattern.push(2);
			schedule.keyPattern.push(1);
			schedule.keyPattern.push(2);
			schedule.keyPattern.push(1);
		}
		for (var i = 0; i < midisong.tracks.length; i++) {
			var miditrack: SongTrack = midisong.tracks[i];
			var track: ZvoogTrack = {
				voices: []
				, effects: []
				, title: 'track ' + i + ' ' + miditrack.title
				, strings: []
			};

			var voice: ZvoogVoice = {
				chunks: []
				, source: {
					plugin: new ZvoogFilterSourceEmpty()
					, parameters: []
				}
				, effects: []
				, title: 'MIDI ' + miditrack.program
			};
			var time = 0;
			for (var m = 0; m < miditrack.measures.length; m++) {
				var measure: SongMeasure = miditrack.measures[m];
				var chunk: ZvoogPattern = {
					meter: {
						count: midisong.meter.count
						, division: midisong.meter.division
					}
					, tempo: Math.round(midisong.bpm)
					, chords: []
					, title: 'start at ' + time
					, clefHint: 0
					, keyHint: 0
				};
				for (var c = 0; c < measure.chords.length; c++) {
					var midichord: SongChord = measure.chords[c];
					var chordtime = midichord.when - time;
					//console.log(midichord.when - time,time2Duration(chordtime/1000, midisong.bpm))
					var zvoogchord: ZvoogChord = {
						//when: chordtime
						when: time2Duration(chordtime / 1000, midisong.bpm)
						, values: []
						, title: ''
						, fretHint: []
						, text: ''
					};
					if (midichord.channel != 9) {
						for (var n = 0; n < midichord.notes.length; n++) {
							//console.log(m,n,midichord.when);
							var midinote: SongNote = midichord.notes[n];
							var zvoogkey: ZvoogKey = {
								envelope: []
								, stepHint: 0
								, shiftHint: 0
								, octaveHint: 0
							};
							zvoogchord.values.push(zvoogkey);
							//if(midinote.points.length>5)console.log(midichord,midinote);
							for (var p = 0; p < midinote.points.length; p++) {
								var point: SongPoint = midinote.points[p];
								//if(midinote.points.length>5)console.log(p,point.pitch,point.duration);
								var zvoogPitch: ZvoogPitch = {
									duration: time2Duration(point.duration / 1000, midisong.bpm)
									, pitch: point.pitch
								};
								zvoogkey.envelope.push(zvoogPitch);
							}
						}
					}
					chunk.chords.push(zvoogchord);
				}
				voice.chunks.push(chunk);
				time = time + measure.duration;
			}
			track.voices.push(voice);
			//for(var t=0;t<midisong.tracks.length;t++){
			//var miditrack:SongTrack=midisong.tracks[t];
			var fordrum: { voice: ZvoogVoice, drum: number }[] = [];
			for (var m = 0; m < miditrack.measures.length; m++) {
				var measure: SongMeasure = miditrack.measures[m];
				for (var c = 0; c < measure.chords.length; c++) {
					let chord: SongChord = measure.chords[c];
					if (chord.channel == 9) {
						//console.log(i, m, chord);
						for (var n = 0; n < chord.notes.length; n++) {
							var note: SongNote = chord.notes[n];
							for (var p = 0; p < note.points.length; p++) {
								var point: SongPoint = note.points[p];
								this.takeDrumVoice(point.pitch, fordrum);
							}
						}
					}
				}
			}
			for (var d = 0; d < fordrum.length; d++) {
				var zvoice: ZvoogVoice = fordrum[d].voice;
				track.voices.push(zvoice);
				//console.log(fordrum[d].voice);
				var time = 0;
				for (var m = 0; m < miditrack.measures.length; m++) {
					var measure: SongMeasure = miditrack.measures[m];
					var chunk: ZvoogPattern = {
						meter: {
							count: midisong.meter.count
							, division: midisong.meter.division
						}
						, tempo: Math.round(midisong.bpm)
						, chords: []
						, title: 'start at ' + time
						, clefHint: 0
						, keyHint: 0
					};
					zvoice.chunks.push(chunk);
					for (var c = 0; c < measure.chords.length; c++) {
						let midichord: SongChord = measure.chords[c];
						if (midichord.channel == 9) {
							var chordtime = midichord.when - time;
							var zvoogchord: ZvoogChord = {
								when: time2Duration(chordtime / 1000, midisong.bpm)
								, values: []
								, title: ''
								, fretHint: []
								, text: ''
							};
							for (var n = 0; n < midichord.notes.length; n++) {
								var midinote: SongNote = midichord.notes[n];
								var point: SongPoint = midinote.points[0];
								if (point.pitch == fordrum[d].drum) {
									var zvoogkey: ZvoogKey = {
										envelope: []
										, stepHint: 0
										, shiftHint: 0
										, octaveHint: 0
									};
									var zvoogPitch: ZvoogPitch = {
										duration: time2Duration(point.duration / 1000, midisong.bpm)
										, pitch: point.pitch
									};
									zvoogkey.envelope.push(zvoogPitch);
									zvoogchord.values.push(zvoogkey);
								}
							}
							if (zvoogchord.values.length) {
								chunk.chords.push(zvoogchord);
							}
						}
					}
					time = time + measure.duration;
				}

			}
			//}
			schedule.tracks.push(track);
		}
		return schedule;
	}
	dump(): SongData {
		var a: SongData = {
			parser: '1.01'
			, duration: 0
			, bpm: this.header.tempoBPM
			, key: this.header.keyFlatSharp
			, mode: this.header.keyMajMin
			, meter: { count: this.header.meterCount, division: this.header.meterDivision }
			, tracks: []
			, speedMode: 0
			, lineMode: 0
		};
		for (var i = 0; i < this.tracks.length; i++) {
			var miditrack: MIDIFileTrack = this.tracks[i];
			var tr: SongTrack = { order: i, title: miditrack.title ? miditrack.title : '', volume: miditrack.volume ? miditrack.volume : 1, program: miditrack.program ? miditrack.program : 0, measures: [] };
			for (var ch = 0; ch < miditrack.chords.length; ch++) {
				var midichord: TrackChord = miditrack.chords[ch];
				var newchord: SongChord = { when: midichord.when, notes: [], channel: midichord.channel };
				var measure: SongMeasure = this.takeMeasure(tr, midichord.when, this.header.tempoBPM, this.header.meterCount / this.header.meterDivision);
				//tr.chords.push(newchord);
				measure.chords.push(newchord);
				for (var n = 0; n < midichord.notes.length; n++) {
					var midinote: TrackNote = midichord.notes[n];
					var newnote: SongNote = { points: [] };
					newchord.notes.push(newnote);
					for (var v = 0; v < midinote.points.length; v++) {
						var midipoint: NotePitch = midinote.points[v];
						var newpoint: SongPoint = { pitch: midipoint.pitch, duration: midipoint.pointDuration };
						newnote.points.push(newpoint);
					}
				}
			}
			if (tr.measures.length > 0) {
				a.tracks.push(tr);
				var d = tr.measures.length * tr.measures[0].duration;
				if (a.duration < d) a.duration = d;
			}
		}
		//console.log(this);
		//console.log(a);
		return a;
	}
}
type SongMeasure = {
	duration: number;
	chords: SongChord[];
};
type SongPoint = {
	pitch: number;
	duration: number;
}
type SongNote = {
	points: SongPoint[];
	nn?: number;
}
type SongChord = {
	when: number;
	channel: number;
	notes: SongNote[];
};
type SongTrack = {
	title: string;
	program: number;
	volume: number;
	measures: SongMeasure[];
	order: number;
};
type SongData = {
	duration: number;
	parser: string;
	bpm: number;
	key: number;
	mode: number;
	meter: { count: number, division: number };
	tracks: SongTrack[];
	speedMode: number;
	lineMode: number;
};
