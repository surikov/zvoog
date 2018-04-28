console.log('ZvoogTest v1.01');
function letsgo() {
	console.log('Let\'s go');
	var dispatcher = new ZvoogDispatcher('testing');
	var mediaInput = dispatcher.createPluginFromFunction(Zvoog_LocalMediaFile_withUI, 'mediaInput');
	var togglePlay = dispatcher.createPluginFromFunction(Zvoog_Toggle_withUI, 'togglePlay');
	var gainControl = dispatcher.createPluginFromFunction(ZvoogPlugin, 'gainControl');
	var filterControl = dispatcher.createPluginFromFunction(ZvoogPlugin, 'filterControl');
	var metronome = dispatcher.createPluginFromFunction(ZvoogPlugin, 'metronome');
	var synth = dispatcher.createPluginFromFunction(ZvoogPlugin, 'synth');
	var startPause = dispatcher.createPluginFromFunction(ZvoogPlugin, 'synth');
	dispatcher.connect(mediaInput.output, filterControl.input);
	dispatcher.connect(filterControl.output, gainControl.input);
	dispatcher.connect(gainControl.output, dispatcher.audioContext.destination);
	dispatcher.connect(synth.output, gainControl.input);
	dispatcher.route('metronome', 'synth');
	mediaInput.attachToDIV(document.getElementById('mediFileUI'));
	togglePlay.attachToDIV(document.getElementById('toggleUI'));
}
