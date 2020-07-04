console.log('ZvoogEngine v1.52');
//function duration2time(bpm: number, duration: ZvoogMeter): number {
function duration2time(bpm: number, duration384: number): number {
	var n4 = 60 / bpm;
	//var part = duration.division / (4 * duration.count);
	var part = 384 / (4 * duration384);
	return n4 / part;
}
function time2Duration(time: number, bpm: number): number {
	var n4 = 60 / bpm;
	var n384=n4/96;
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
	properties: any
	, key: string
	, point: XYZ
};
var undoRedoChangeProjectTitle: string = 'changeProjectTitle';
type UndoRedoChangeProjectTitleProperties = { newTitle: string, oldTitle: string };
var undoRedoChangeProjectDescription: string = 'changeProjectDescription';
type UndoRedoProjectDescriptionProperties = { newDescription: string, oldDescription: string };
var undoRedoMoveTrack: string = 'moveTrack';
//type UndoRedoMoveTrackProperties = { oldTrackPosition: number, newTrackPosition: number };
var undoRedoMoveVoice: string = 'moveVoice';
type UndoRedoMoveVoiceProperties = { oldTrackPosition: number, newTrackPosition: number, newVoicePosition: number, oldVoicePosition: number };
var undoRedoBunch: string = 'bunch';
type UndoRedoBunchProperties = { commands: UndoRedoCommand[] };

type ZvoogMeter = {
	count: number
	, division: number
};
type ZvoogTrackSource = {
	plugin: ZvoogSource
	, parameters: ZvoogParameterLine[]
};
type ZvoogVoice = {
	chunks: ZvoogPattern[]
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
type ZvoogPattern = {
	meter: ZvoogMeter//ZvoogMeter
	, tempo: number
	, chords: ZvoogChord[]
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
	duration: number//ZvoogMeter
	, velocity: number
};
type ZvoogCurve = {
	duration: number//ZvoogMeter
	, points: ZvoogPoint[]
};
type ZvoogParameterLine = {
	segments: ZvoogCurve[]
};
type ZvoogTrackEffect = {
	plugin: ZvoogEffect
	, parameters: ZvoogParameterLine[]
};
type ZvoogGridStep = {
	duration: number;
	power: number;
};

type ZvoogSchedule = {
	tracks: ZvoogTrack[]
	//, duration: number
	, effects: ZvoogTrackEffect[]
	//, patterns: ZvoogPattern[]
	//, curves: ZvoogCurve[]
	, title: string
	, description: string
	, macros: UndoRedoCommand[]
	, macroPosition: number
	, masterPosition: number
	, gridPattern: ZvoogGridStep[]
	, keyPattern: number[]
	, horizontal: boolean
	, locked: boolean
	, selectedTrack: number
	, selectedVoice: number
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
