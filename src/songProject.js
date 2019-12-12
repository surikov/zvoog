console.log('songProject v2.03');
function createRandomSongProject() {
    var gridMode = { positions: [] };
    var testProj = { title: 'test', channels: [], fx: [], grid: gridMode };
    var chanCount = Math.ceil(Math.random() * 5 + 1);
    var measureTempo = { bpm: 120, fraction: 4 };
    var meter = { count: 4, fraction: 4 };
    var scaleMode = { whiteKeys: [] };
    for (var c = 0; c < chanCount; c++) {
        var channelSynth = { title: "synth" + c };
        var songChannel = { title: "channel" + c, tracks: [], synth: channelSynth, fx: [] };
        testProj.channels.push(songChannel);
        var songTrack = { title: "track" + c, measures: [] };
        songChannel.tracks.push(songTrack);
        for (var m = 0; m < 200; m++) {
            var trackMeasure = { title: "meausre" + c + "x" + m, tempo: measureTempo, meter: meter, chords: [], mode: scaleMode };
            songTrack.measures.push(trackMeasure);
        }
    }
    return testProj;
}
