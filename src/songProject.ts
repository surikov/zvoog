console.log('songProject v2.03');

type MeasureTempo = {
	bpm: number;
	fraction: number;
};
type NotePitch = {
	key: number;
	shift: number;
	octave: number;
	duration: TimeSignature;
};
type TimeSignature = {
	count: number;
	fraction: number;
};
type ScaleMode = {
	whiteKeys: number[];
};
type GridMode = {
	positions: TimeSignature[];
};
type ChordNote = {
	title: string;
	pitches: NotePitch[];
	ornaments: number[];
};
type MeasureChord = {
	title: string;
	position: TimeSignature;
	notes: ChordNote[];
	effects: number[];
};
type TrackMeasure = {
	title: string;
	tempo: MeasureTempo;
	meter: TimeSignature;
	chords: MeasureChord[];
	mode: ScaleMode;

};
type SongTrack = {
	title: string;
	measures: TrackMeasure[];
};
type ChannelSynth = {
	title: string;
};
type ChannelFx = {
	title: string;
};
type SongChannel = {
	title: string;
	tracks: SongTrack[];
	synth: ChannelSynth;
	fx: ChannelFx[];
};
type SongProject = {
	title: string;
	channels: SongChannel[];
	fx: ChannelFx[];
	grid: GridMode;
};

function createRandomSongProject(): SongProject {
	let gridMode: GridMode = { positions: [] };
	let testProj: SongProject = { title: 'test', channels: [], fx: [], grid: gridMode };
	let chanCount = Math.ceil(Math.random() * 5 + 1);
	let measureTempo:MeasureTempo={bpm:120,fraction:4};
	let meter:TimeSignature={count:4,fraction:4};
	let scaleMode:ScaleMode={whiteKeys:[]};
	for (let c = 0; c < chanCount; c++) {
		let channelSynth: ChannelSynth = { title: "synth" + c };
		let songChannel: SongChannel = { title: "channel" + c, tracks: [], synth: channelSynth, fx: [] };
		testProj.channels.push(songChannel);
		let songTrack: SongTrack = { title: "track" + c, measures: [] };
		songChannel.tracks.push(songTrack);
		for(var m=0;m<200;m++){
			let trackMeasure:TrackMeasure={title:"meausгre"+c+"x"+m,tempo:measureTempo,meter:meter,chords:[],mode:scaleMode};
			songTrack.measures.push(trackMeasure);
			for(var a=0;a<5;a++){
				let chord:MeasureChord={title:'chord'+};
				trackMeasure.chords.push(chord);
				
			}
		}
	}
	return testProj;
}