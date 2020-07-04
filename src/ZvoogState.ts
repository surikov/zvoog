console.log('ZvoogState v2.03');

type MeasureTempo = {
	bpm: number;
	fraction: number;
};
type TimeSignature = {
	count: number;
	fraction: number;
};
type ValuePoint = {
	at: TimeSignature;
	pitch: number;
};
type MeasureValue = {
	start: ValuePoint;
	end: ValuePoint;
};
type ChannelMeasure = {
	tempo: MeasureTempo;
	meter: TimeSignature;
	values: MeasureValue[];
};
type StateChannel = {
	title: string;
	measures: ChannelMeasure[];
};
type ZvoogState = {
	title: string;
	channels: StateChannel[];
};
function cloneMeasureTempo(s:MeasureTempo):MeasureTempo{
	let t: MeasureTempo={
		bpm:s.bpm
		,fraction:s.fraction
	};
	return t;
}
function cloneTimeSignature(s:TimeSignature):TimeSignature{
	let t: TimeSignature={
		count:s.count
		,fraction:s.fraction
	};
	return t;
}
function clonePoint(p:ValuePoint):ValuePoint{
	let t: ValuePoint={
		at: cloneTimeSignature(p.at)
		,pitch: p.pitch
	};
	return t;
}
function cloneValue(v:MeasureValue):MeasureValue{
	let t: MeasureValue={
		start: clonePoint(v.start)
		,end:clonePoint(v.end)
	};
	return t;
}
function cloneMeasure(m: ChannelMeasure): ChannelMeasure{
	let t: ChannelMeasure={
		tempo: cloneMeasureTempo(m.tempo)
		,meter: m.meter
		,values: []
	};
	for(let i=0;i<m.values.length;i++){
		t.values.push(cloneValue(m.values[i]));
	}
	return t;
}
function cloneStateChannel(c: StateChannel): StateChannel{
	let t: StateChannel={
		title: c.title
		,measures: []
	};
	for(let i=0;i<c.measures.length;i++){
		t.measures.push(cloneMeasure(c.measures[i]));
	}
	return t;
}
function cloneZvoogState(s:ZvoogState):ZvoogState{
	let n:ZvoogState={
		title:s.title
		,channels:[]
	};
	for(let i=0;i<s.channels.length;i++){
		n.channels.push(cloneStateChannel(s.channels[i]));
	}
	return n;
}
class ZvoogDispatcher{
	constructor(){
		console.log('ZvoogDispatcher');
	}
	registerRoute(from,to){
		
	}
}
class ZvoogNode{
	constructor(){
		console.log('ZvoogNode');
	}
}
class ZvoogNodeButton extends ZvoogNode{
	constructor(){
		super();
		console.log('ZvoogNodeButton');
	}
	uiClick(){
		console.log('uiClick');
	}
}
let d:ZvoogDispatcher=new ZvoogDispatcher();
let b:ZvoogNodeButton=new ZvoogNodeButton();
b.uiClick();
