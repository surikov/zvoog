console.log('songProject v2.03');

type MeasureTempo={
	bpm: number;
	divisor: number;
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
type GridMode={
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
	modeId:number;
	gridId:number;
};
type SongTrack={
	title: string;
	measures:TrackMeasure[];
};
type SongProject = {
	title: string;
	tracks:SongTrack[];
};

