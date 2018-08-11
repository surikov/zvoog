console.log('test2 v1.02');
function test2() {
	console.log('start test 2');
	var AudioContextFunc = window.AudioContext || window.webkitAudioContext;
	var mainAudioContext = new AudioContextFunc();
	var session = new ZvoogSession();
	var host=new ZvoogHost();
	//
	var midiKeyboard = new ZvoogComponent();
	var gridUI = new ZvoogComponent();
	var recorder = new ZvoogComponent();
	var fileImport = new ZvoogComponent();
	var pianoSynth = new ZvoogComponent();
	var guitarSynth = new ZvoogComponent();
	var drumSynth = new ZvoogComponent();
	var output= new ZvoogComponent();
	var waveExport= new ZvoogComponent();
	var equalizer= new ZvoogComponent();
	var volume= new ZvoogComponent();
	var distortion= new ZvoogComponent();
	//
	var guitarChannel=new ZvoogChannel();
	var pianoChannel=new ZvoogChannel();
	var drumChannel=new ZvoogChannel();
	var faderChannel=new ZvoogChannel();
	var voxChannel=new ZvoogChannel();
	/*
	session.channels.push(midiKeyboard);
	session.channels.push(recorder);
	session.channels.push(fileImport);
	session.channels.push(pianoSynth);
	session.channels.push(guitarSynth);
	session.channels.push(drumSynth);
	session.channels.push(output);
	session.channels.push(waveExport);
	session.channels.push(equalizer);
	session.channels.push(distortion); 
	session.channels.push(volume);
	
	session.route(gridUI,guitarChannel);
	session.route(gridUI,pianoChannel);
	session.route(gridUI,drumChannel);
	session.route(gridUI,faderChannel);
	session.route(gridUI,voxChannel);
	
	session.route(guitarChannel,gridUI);
	session.route(pianoChannel,gridUI);
	session.route(drumChannel,gridUI);
	session.route(faderChannel,gridUI);
	session.route(voxChannel,gridUI);
	
	session.route(midiKeyboard,pianoChannel);
	*/
}
