console.log('ZvoogTest v1.01');
function letsgo() {
	console.log('Let\'s go');
	var dispatcher = new ZvoogDispatcher('testing2');
	var mediaInput = dispatcher.createPluginFromFunction(Zvoog_LocalMediaFile_withUI, 'mediaInput');
	var togglePlay = dispatcher.createPluginFromFunction(Zvoog_Toggle_withUI, 'togglePlay');
	var gainControl = dispatcher.createPluginFromFunction(Zvoog_Range_withUI, 'gainControl');
	var gainFx = dispatcher.createPluginFromFunction(Zvoog_Volume, 'gainFx');
	var playButton = dispatcher.createPluginFromFunction(Zvoog_buttonUI, 'playButton');
	//var filterControl = dispatcher.createPluginFromFunction(ZvoogPlugin, 'filterControl');
	//var metronome = dispatcher.createPluginFromFunction(ZvoogPlugin, 'metronome');
	//var synth = dispatcher.createPluginFromFunction(ZvoogPlugin, 'synth');
	//var startPause = dispatcher.createPluginFromFunction(ZvoogPlugin, 'synth');
	dispatcher.connect(mediaInput.output, gainFx.input);
	//dispatcher.connect(filterControl.output, gainControl.input);
	dispatcher.connect(gainFx.output, dispatcher.audioContext.destination);
	
	//dispatcher.connect(synth.output, gainControl.input);
	//dispatcher.connect(mediaInput.output, dispatcher.audioContext.destination);
	dispatcher.routeMessages(playButton, 0,'',0);
	//dispatcher.route('metronome', 'synth');
	playButton.attachToDIV(document.getElementById('playButton'));
	mediaInput.attachToDIV(document.getElementById('mediFileUI'));
	togglePlay.attachToDIV(document.getElementById('toggleUI'));
	gainControl.attachToDIV(document.getElementById('gainUI'));
	mediaInput.playState.bind(togglePlay.onOff);
	gainControl.value.bind(gainFx.loudness);
	//console.log('restoreStatesFromLocalStorage');
	//dispatcher.restoreStatesFromLocalStorage();
	//console.log('unset');
	mediaInput.playState.set(0);
/*
	var t1 = dispatcher.setStateAction('nope', 't1', function () {
			console.log('			done t1');
		});
	var t2 = dispatcher.setStateAction('nope', 't2', function () {
			console.log('			done t2');
			//t2.set('22222');
		});
	var t3 = dispatcher.setStateAction('nope', 't3', function () {
			console.log('			done t3');
		});
	var t4 = dispatcher.setStateAction('nope', 't4', function () {
			console.log('			done t4');
			//t2.set('44444');
		});
	t1.bind(t2);
	t1.bind(t3);
	t3.bind(t4);
	t3.bind(t2);
	t1.set('111111');
	console.log(t1.value(),t2.value(),t3.value(),t4.value());*/
}
