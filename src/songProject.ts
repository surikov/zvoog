console.log('songProject v2.03');

type MeasureTempo={
	bpm: number;
	step: number;
};
type NotePitch={
	key: number;
	shift: number;
	octave:number;
	duration:TimeSignature;
};
type TimeSignature={
	divident: number;
	divisor: number;
};
type ScaleMode={
	whiteKeys:number[];
};
type MeterMode={
	positions:TimeSignature[];
};
type ChordNote={
	title: string;
	pitches:NotePitch[];
	ornaments:number[];
};
type MeasureChord={
	title: string;
	position:TimeSignature;
	notes:ChordNote[];
	effects:number[];
};
type TrackMeasure={
	title: string;
	tempo:MeasureTempo;
	meter:TimeSignature;
	chords:MeasureChord[];
	mode:ScaleMode;
	grid:MeterMode;
};
type SongTrack={
	title: string;
	measures:TrackMeasure[];
};
type ChannelSynth={
	title: string;
};
type ChannelFx={
	title: string;
};
type SongChannel={
	title: string;
	tracks:SongTrack[];
	synth:ChannelSynth;
	fx:ChannelFx[];
};
type SongProject = {
	title: string;
	channels:SongChannel[];
	fx:ChannelFx[];
};

