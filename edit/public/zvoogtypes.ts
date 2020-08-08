console.log('ZvoogEngine v1.52');
//function duration2time(bpm: number, duration: ZvoogMeter): number {
function duration2time(bpm: number, duration384: number): number {
	var n4 = 60 / bpm;
	//var part = duration.division / (4 * duration.count);
	var part = 384 / (4 * duration384);
	return n4 / part;
}
function durations2time(measures: ZvoogMeasure[]): number {
	var t = 0;
	for (var i = 0; i < measures.length; i++) {
		t = t + duration2time(measures[i].tempo, duration384(measures[i].meter));
	}
	return t;
}
function time2Duration(time: number, bpm: number): number {
	var n4 = 60 / bpm;
	var n384 = n4 / 96;
	return Math.round(time / n384);
}
function duration384(meter: ZvoogMeter): number {
	return meter.count * (384 / meter.division);
}
type XYZ = {
	x: number;
	y: number;
	z: number
};
type UndoRedoAction = {
	undo: (app: ZvoogApp) => void;
	redo: (app: ZvoogApp) => void;
};
type UndoRedoCommand = {
	properties: UndoRedoProperties
	, key: string
	, point: XYZ
};
enum UndoRedoKeys {
	undoRedoChangeProjectTitle = 'changeProjectTitle'
	, undoRedoChangeProjectDescription = 'changeProjectDescription'
	, undoRedoSelectLayer = 'selectLayer'
	, undoRedoDisableTrack = 'disableTrack'
	, undoRedoDisableSongFx = 'disableSongFx'
	, undoRedoDisableTrackFx = 'disableTrackFx'
	, undoRedoDisableVoice = 'disableSongVoice'
	, undoRedoDisableVoiceFx = 'disableVoiceFx'
	, undoRedoBunch = 'bunch'
};
type UndoRedoProperties = {  };
//var undoRedoChangeProjectTitle: string = 'changeProjectTitle';
type UndoRedoChangeProjectTitleProperties = UndoRedoProperties & { newTitle: string, oldTitle: string };
//var undoRedoChangeProjectDescription: string = 'changeProjectDescription';
type UndoRedoProjectDescriptionProperties = { newDescription: string, oldDescription: string };
//var undoRedoMoveTrack: string = 'moveTrack';
//type UndoRedoMoveTrackProperties = { oldTrackPosition: number, newTrackPosition: number };
//var undoRedoMoveVoice: string = 'moveVoice';
//type UndoRedoMoveVoiceProperties = { oldTrackPosition: number, newTrackPosition: number, newVoicePosition: number, oldVoicePosition: number };

//var undoRedoSelectLayer: string = 'moveVoice';
type UndoRedoSelectLayerProperties = { oldSelection: ZvoogLayerSelection, newSelection: ZvoogLayerSelection };
type UndoRedoDisableTrackProperties = { track: number, oldState: boolean, newState:boolean };
type UndoRedoDisableSongFxProperties = { effect: number,oldState: boolean, newState:boolean };
type UndoRedoDisableTrackFxProperties = { track: number, effect: number,oldState: boolean, newState:boolean };
type UndoRedoDisableVoiceProperties = { track: number, voice: number,oldState: boolean, newState:boolean };
type UndoRedoDisableVoiceFxProperties = { track: number, voice: number,effect: number,oldState: boolean, newState:boolean };

//var undoRedoBunch: string = 'bunch';
type UndoRedoBunchProperties = { commands: UndoRedoCommand[] };

type ZvoogMeter = {
	count: number
	, division: number
};
type ZvoogTrackSource = {
	plugin: ZvoogSource
	, parameters: ZvoogCurve[]
};
type ZvoogVoice = {
	chunks: ZvoogPattern[]
	,disabled:boolean
	, source: ZvoogTrackSource
	, effects: ZvoogTrackEffect[]
	, title: string
};
type ZvoogString = {
	order: number
	, pitch: number
}
type ZvoogTrack = {
	voices: ZvoogVoice[]
	,disabled:boolean
	, effects: ZvoogTrackEffect[]
	, title: string
	, strings: ZvoogString[]
};
type ZvoogFrets = {
	stringIndex: number
	, fret: number
};
type ZvoogChord = {
	when: number//ZvoogMeter
	, values: ZvoogKey[]
	, title: string
	, fretHint: ZvoogFrets[]
	, text: string
};
type ZvoogMeasure = {
	meter: ZvoogMeter//ZvoogMeter
	, tempo: number
};
type ZvoogPattern = {
	chords: ZvoogChord[]
	, title: string
	, clefHint: number
	, keyHint: number
};
type ZvoogKey = {
	envelope: ZvoogPitch[]
	, stepHint: number
	, shiftHint: number
	, octaveHint: number
}
type ZvoogPitch = {
	duration: number//ZvoogMeter
	, pitch: number
};
type ZvoogPoint = {
	skipMeasures: number//ZvoogMeter
	, skip384: number
	, velocity: number
};
type ZvoogCurve = {
	//duration: number//ZvoogMeter
	points: ZvoogPoint[]
};
/*
type ZvoogParameterLine = {
	segments: ZvoogCurve[]
};*/
type ZvoogTrackEffect = {
	plugin: ZvoogEffect
	,disabled:boolean
	, parameters: ZvoogCurve[]
};
type ZvoogGridStep = {
	duration: number;
	power: number;
};
type ZvoogLayerSelection = {
	level1: number
	, level2: number
	, level3: number
	, level4: number
};
type ZvoogMeasureSelection = {
	from: number
	, duration: number
};
type ZvoogSchedule = {
	tracks: ZvoogTrack[]
	//, duration: number
	, effects: ZvoogTrackEffect[]
	//, patterns: ZvoogPattern[]
	//, curves: ZvoogCurve[]
	, timeline: ZvoogMeasure[]
	, title: string
	, description: string
	, macros: UndoRedoCommand[]
	, macroPosition: number
	, masterPosition: number
	, gridPattern: ZvoogGridStep[]
	, keyPattern: number[]
	, horizontal: boolean
	, locked: boolean
	, selectedLayer: ZvoogLayerSelection
	, selectedMeasures: ZvoogMeasureSelection
};
type ZvoogValue = {
	data: string
	, label: string
	, hint: string
};
interface ZvoogParameter {
	label(): string;
	cancelScheduledValues(cancelTime: number): void;
	linearRampToValueAtTime(value: number, endTime: number): void;
	setValueAtTime(value: number, startTime: number): void;
}
type ZvoogPlugin = {
	label: () => string //plugin title
	, getParams: () => ZvoogParameter[] //parameters automation
	, getValues: () => ZvoogValue[] //properties from UI
	, prepare: (audioContext: AudioContext) => void
	, busy: () => number
}
type ZvoogEffect = ZvoogPlugin & {
	getInput: () => AudioNode
	, getOutput: () => AudioNode
}
type ZvoogSource = ZvoogPlugin & {
	getOutput: () => AudioNode
	, schedule: (when: number, tempo: number, chord: ZvoogPitch[][]) => void
	, cancelSchedule: () => void
}

