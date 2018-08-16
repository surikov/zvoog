console.log('test2 v1.02');
function ComponentMIDIKeyboard(session){
	var component=new ZvoogComponent();
	var out=new ZvoogCueOutput();
	component.cueOutputs.push(out);
	component.UIpressKey=function(pitch,velocity){
		out.openKey(pitch,velocity);
	}
	component.UIfreeKey=function(pitch){
		out.closeKey(pitch);
		out.setNote(null);
	}
	return component;
}
function ComponentPianoSynth(session){
	var component=new ZvoogComponent();
	var out=new ZvoogCueOutput();
	var inp=new ZvoogCueInput();
	inp.openKey=function(pitch,volume){
		console.log('piano openKey',pitch,volume);
	};
	inp.closeKey=function(pitch){
		console.log('piano closeKey',pitch);
	};
	component.cueOutputs.push(out);
	component.cueInputs.push(inp);
	return component;
}
function test2() {
	console.log('start test 2');
	var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
	var mainAudioContext = new AudioContextFunc();
	var session = new ZvoogSession();
	var host = new ZvoogHost();
	//
	var midiKeyboard = new ComponentMIDIKeyboard(session);
	var harmonyAssist = new ZvoogComponent(session);
	var recorder = new ZvoogComponent(session);
	var pianoSynth = new ComponentPianoSynth(session);
	var drumSynth = new ZvoogComponent(session);
	var guitarSynth = new ZvoogComponent(session);
	var master = new ZvoogComponent(session);
	var fader = new ZvoogComponent(session);
	var out = new ZvoogComponent(session);
	//
	var guitarChannel = new ZvoogChannel();
	var pianoChannel = new ZvoogChannel();
	var drumChannel = new ZvoogChannel();
	var faderChannel = new ZvoogChannel();
	var voxChannel = new ZvoogChannel();
	//	
	//session.route(midiKeyboard.cueOutputs[0], pianoSynth.cueInputs[0]);
	midiKeyboard.cueOutputs[0].inputs.push(pianoSynth.cueInputs[0]);
	midiKeyboard.cueOutputs[0].inputs.push(pianoChannel.cueInputs[0]);
	//
	midiKeyboard.UIpressKey(60,127);
	midiKeyboard.UIfreeKey(60,127);
}
