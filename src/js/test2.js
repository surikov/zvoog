console.log('test2 v1.02');
function test2() {
	console.log('start test 2');
	var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
	var mainAudioContext = new AudioContextFunc();
	var session = new ZvoogSession();
	var host = new ZvoogHost();
	//
	var midiKeyboard = new ZvoogComponent();
	midiKeyboard.cueOutputs.push(new ZvoogCueOutput());
	var harmonyAssist = new ZvoogComponent();
	var recorder = new ZvoogComponent();
	var pianoSynth = new ZvoogComponent();
	var drumSynth = new ZvoogComponent();
	var guitarSynth = new ZvoogComponent();
	var master = new ZvoogComponent();
	var fader = new ZvoogComponent();
	var out = new ZvoogComponent();
	//
	var guitarChannel = new ZvoogChannel();
	var pianoChannel = new ZvoogChannel();
	var drumChannel = new ZvoogChannel();
	var faderChannel = new ZvoogChannel();
	var voxChannel = new ZvoogChannel();
	//
	session.route(midiKeyboard.cueOutputs[0], pianoSynth.cueInputs[0]);
}
