console.log('songProject v2.03');
function createEmptyRhythmPattern() {
    return {
        positions: []
    };
}
function createEmptyChannelSynth() {
    return {
        title: ''
    };
}
function createEmptyChannelFx() {
    return {
        title: ''
    };
}
function createSongChannel() {
    return {
        title: '',
        tracks: [],
        synth: createEmptyChannelSynth(),
        fx: []
    };
}
function createEmptySong() {
    return {
        title: '',
        channels: [],
        fx: [],
        rhythmPattern: createEmptyRhythmPattern()
    };
}
function createRandomSongProject() {
    var rhythmPattern = {
        positions: []
    };
    var testProj = {
        title: 'test',
        channels: [],
        fx: [],
        rhythmPattern: rhythmPattern
    };
    var chanCount = Math.ceil(Math.random() * 5 + 1);
    var measureTempo = {
        bpm: 120,
        fraction: 4
    };
    var meter = {
        count: 4,
        fraction: 4
    };
    var scaleMode = {
        whiteKeys: []
    };
    for (var c = 0; c < chanCount; c++) {
        var channelSynth = {
            title: "synth" + c
        };
        var songChannel = {
            title: "channel" + c,
            tracks: [],
            synth: channelSynth,
            fx: []
        };
        testProj.channels.push(songChannel);
        var songTrack = {
            title: "track" + c,
            measures: []
        };
        songChannel.tracks.push(songTrack);
        for (var m = 0; m < 200; m++) {
            var trackMeasure = { title: "meausгre" + c + "x" + m, tempo: measureTempo, meter: meter, chords: [], mode: scaleMode };
            songTrack.measures.push(trackMeasure);
            for (var a = 0; a < 5; a++) {
                var pos = {
                    count: Math.round(Math.random() * 31),
                    fraction: 16
                };
                var chord = { title: 'chord' + c + 'x' + m + 'a', notes: [], effects: [], position: pos };
                trackMeasure.chords.push(chord);
                for (var n = 0; n < 3; n++) {
                    var note = {
                        title: '',
                        pitches: [],
                        ornaments: []
                    };
                    chord.notes.push(note);
                }
            }
        }
    }
    return testProj;
}
