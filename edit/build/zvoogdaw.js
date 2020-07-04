"use strict";
var ZvoogPopup = /** @class */ (function () {
    function ZvoogPopup(app) {
        this.app = app;
    }
    ZvoogPopup.prototype.showPopupMenu = function (x, y, z, w, size, items) {
        this.app.popupMenuGroup.content.length = 0;
        this.app.popupMenuGroup.ww = this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize;
        this.app.popupMenuGroup.hh = this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize;
        this.app.popupMenuGroup.content.push({
            x: 0, y: 0, w: this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize,
            h: this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize,
            css: 'fog', action: this.closePopupMenu.bind(this)
        });
        this.app.popupMenuGroup.content.push({ x: size + x, y: size + y, w: w, h: items.length * size * 2, css: 'popupFill' });
        for (var i = 0; i < items.length; i++) {
            this.app.addMainTextButton(size + x, size + y + i * 2 * size, 2 * size, items[i].label, 'fontSize' + size, this.app.popupMenuGroup.content, this.createDoItem(items[i], 2 * size + x, 2 * size + y + i * 2 * size, w, size));
        }
        this.app.tileLevel.redrawAnchor(this.app.popupMenuGroup);
        this.app.tileLevel.startSlideTo(-x * this.app.tileLevel.tapSize, -y * this.app.tileLevel.tapSize, z, null);
    };
    ZvoogPopup.prototype.showPopupSubMenu = function (x, y, w, size, items) {
        this.app.popupSubMenuGroup.content.length = 0;
        this.app.popupSubMenuGroup.ww = this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize;
        this.app.popupSubMenuGroup.hh = this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize;
        this.app.popupSubMenuGroup.content.push({
            x: 0, y: 0, w: this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize,
            h: this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize,
            css: 'fog', action: this.closePopupSubMenu.bind(this)
        });
        this.app.popupSubMenuGroup.content.push({ x: size + x, y: size + y, w: w, h: items.length * size * 2, css: 'popupFill' });
        for (var i = 0; i < items.length; i++) {
            this.app.addMainTextButton(size + x, size + y + i * 2 * size, 2 * size, items[i].label, 'fontSize' + size, this.app.popupSubMenuGroup.content, this.createDoSubItem(items[i], 2 * size + x, 2 * size + y + i * 2 * size, w, size));
        }
        this.app.tileLevel.redrawAnchor(this.app.popupSubMenuGroup);
    };
    ZvoogPopup.prototype.showPopupSubSubMenu = function (x, y, w, size, items) {
        this.app.popupSubSubMenuGroup.content.length = 0;
        this.app.popupSubSubMenuGroup.ww = this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize;
        this.app.popupSubSubMenuGroup.hh = this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize;
        this.app.popupSubSubMenuGroup.content.push({
            x: 0, y: 0, w: this.app.tileLevel.innerWidth / this.app.tileLevel.tapSize,
            h: this.app.tileLevel.innerHeight / this.app.tileLevel.tapSize,
            css: 'fog', action: this.closePopupSubSubMenu.bind(this)
        });
        this.app.popupSubSubMenuGroup.content.push({ x: size + x, y: size + y, w: w, h: items.length * size * 2, css: 'popupFill' });
        for (var i = 0; i < items.length; i++) {
            this.app.addMainTextButton(size + x, size + y + i * 2 * size, 2 * size, items[i].label, 'fontSize' + size, this.app.popupSubSubMenuGroup.content, this.createDoSubSubItem(items[i], 2 * size + x, 2 * size + y + i * 2 * size, w, size));
        }
        this.app.tileLevel.redrawAnchor(this.app.popupSubSubMenuGroup);
    };
    ZvoogPopup.prototype.closePopupMenu = function () {
        this.app.popupMenuGroup.content.length = 0;
        this.app.tileLevel.redrawAnchor(this.app.popupMenuGroup);
    };
    ZvoogPopup.prototype.closePopupSubMenu = function () {
        this.app.popupSubMenuGroup.content.length = 0;
        this.app.tileLevel.redrawAnchor(this.app.popupSubMenuGroup);
    };
    ZvoogPopup.prototype.closePopupSubSubMenu = function () {
        this.app.popupSubSubMenuGroup.content.length = 0;
        this.app.tileLevel.redrawAnchor(this.app.popupSubSubMenuGroup);
    };
    ZvoogPopup.prototype.createDoSubSubItem = function (item, x, y, w, size) {
        var me = this;
        return function () {
            me.closePopupSubSubMenu();
            me.closePopupSubMenu();
            me.closePopupMenu();
            if (item.action)
                item.action();
        };
    };
    ZvoogPopup.prototype.createDoSubItem = function (item, x, y, w, size) {
        var me = this;
        if (item.subSubMenu.length > 0) {
            return function () {
                me.showPopupSubSubMenu(x, y, w, size, item.subSubMenu);
            };
        }
        else {
            return function () {
                me.closePopupSubMenu();
                me.closePopupMenu();
                if (item.action)
                    item.action();
            };
        }
    };
    ZvoogPopup.prototype.createDoItem = function (item, x, y, w, size) {
        var me = this;
        if (item.subMenu.length > 0) {
            return function () {
                me.showPopupSubMenu(x, y, w, size, item.subMenu);
            };
        }
        else {
            return function () {
                me.closePopupMenu();
                if (item.action)
                    item.action();
            };
        }
    };
    return ZvoogPopup;
}());
var ZvoogLang = /** @class */ (function () {
    function ZvoogLang() {
        this._labels = [];
        this._labels.push({ key: 'undo', label: 'Undo' });
        this._labels.push({ key: 'redo', label: 'Redo' });
        this._labels.push({ key: 'menu', label: '...' });
        this._labels.push({ key: 'layersMenuTitle', label: 'Layers' });
    }
    ZvoogLang.prototype.label = function (key) {
        var r = '?' + key;
        for (var i = 0; i < this._labels.length; i++) {
            if (key == this._labels[i].key) {
                return this._labels[i].label;
            }
        }
        return r;
    };
    return ZvoogLang;
}());
var UndoRedoChangeTitle = /** @class */ (function () {
    function UndoRedoChangeTitle(o) {
        this.props = o;
    }
    UndoRedoChangeTitle.prototype.undo = function (app) {
        app.currentSong.title = this.props.oldTitle;
    };
    ;
    UndoRedoChangeTitle.prototype.redo = function (app) {
        app.currentSong.title = this.props.newTitle;
    };
    ;
    return UndoRedoChangeTitle;
}());
var UndoRedoChangeDescription = /** @class */ (function () {
    function UndoRedoChangeDescription(o) {
        this.props = o;
    }
    UndoRedoChangeDescription.prototype.undo = function (app) {
        app.currentSong.description = this.props.oldDescription;
    };
    ;
    UndoRedoChangeDescription.prototype.redo = function (app) {
        app.currentSong.description = this.props.newDescription;
    };
    ;
    return UndoRedoChangeDescription;
}());
var UndoRedoMoveTrack = /** @class */ (function () {
    function UndoRedoMoveTrack(o) {
        this.props = o;
    }
    UndoRedoMoveTrack.prototype.undo = function (app) {
        //var tracks: ZvoogTrack[] = app.currentSong.tracks.splice(this.props.newTrackPosition, 1);
        //app.currentSong.tracks.splice(this.props.oldTrackPosition, 0, tracks[0]);
        app.currentSong.selectedTrack = this.props.oldTrackPosition;
        app.currentSong.selectedVoice = this.props.oldVoicePosition;
    };
    ;
    UndoRedoMoveTrack.prototype.redo = function (app) {
        //var tracks: ZvoogTrack[] = app.currentSong.tracks.splice(this.props.oldTrackPosition, 1);
        //app.currentSong.tracks.splice(this.props.newTrackPosition, 0, tracks[0]);
        app.currentSong.selectedTrack = this.props.newTrackPosition;
        app.currentSong.selectedVoice = this.props.newVoicePosition;
    };
    ;
    return UndoRedoMoveTrack;
}());
var UndoRedoMoveVoice = /** @class */ (function () {
    function UndoRedoMoveVoice(o) {
        this.props = o;
    }
    UndoRedoMoveVoice.prototype.undo = function (app) {
        //var tracks: ZvoogTrack[] = app.currentSong.tracks.splice(this.props.newTrackPosition, 1);
        //app.currentSong.tracks.splice(this.props.oldTrackPosition, 0, tracks[0]);
        //var voices: ZvoogVoice[] = tracks[0].voices.splice(this.props.newVoicePosition, 1);
        //tracks[0].voices.splice(this.props.oldTrackPosition, 0, voices[0]);
        app.currentSong.selectedTrack = this.props.oldTrackPosition;
        app.currentSong.selectedVoice = this.props.oldVoicePosition;
    };
    ;
    UndoRedoMoveVoice.prototype.redo = function (app) {
        //var tracks: ZvoogTrack[] = app.currentSong.tracks.splice(this.props.oldTrackPosition, 1);
        //app.currentSong.tracks.splice(this.props.newTrackPosition, 0, tracks[0]);
        //var voices: ZvoogVoice[] = tracks[0].voices.splice(this.props.oldVoicePosition, 1);
        //tracks[0].voices.splice(this.props.newTrackPosition, 0, voices[0]);
        app.currentSong.selectedTrack = this.props.newTrackPosition;
        app.currentSong.selectedVoice = this.props.newVoicePosition;
    };
    ;
    return UndoRedoMoveVoice;
}());
var UndoRedoBunch = /** @class */ (function () {
    function UndoRedoBunch(o) {
        this.props = o;
    }
    UndoRedoBunch.prototype.undo = function (app) {
        for (var i = 0; i < this.props.commands.length; i++) {
            var c = this.props.commands[this.props.commands.length - i - 1];
            var a = app.undoRedo.createUndoRedoAction(c);
            if (a)
                a.undo(app);
        }
    };
    ;
    UndoRedoBunch.prototype.redo = function (app) {
        for (var i = 0; i < this.props.commands.length; i++) {
            var c = this.props.commands[i];
            var a = app.undoRedo.createUndoRedoAction(c);
            if (a)
                a.redo(app);
        }
    };
    ;
    return UndoRedoBunch;
}());
var ZvoogUndoRedo = /** @class */ (function () {
    function ZvoogUndoRedo(app) {
        this.app = app;
    }
    ZvoogUndoRedo.prototype.addRedo = function (command) {
        this.app.currentSong.macros.length = this.app.currentSong.macroPosition;
        this.app.currentSong.macros.push(command);
        this.doRedo();
    };
    ZvoogUndoRedo.prototype.doRedo = function () {
        if (this.app.currentSong.macros.length > 0 && this.app.currentSong.macroPosition < this.app.currentSong.macros.length) {
            var command = this.app.currentSong.macros[this.app.currentSong.macroPosition];
            var a = this.app.undoRedo.createUndoRedoAction(command);
            if (a) {
                a.redo(this.app);
                this.app.currentSong.macroPosition++;
                this.app.resetWholeProject();
                return command.point;
            }
            else {
                console.log('wrong redo', this.app.currentSong.macros[this.app.currentSong.macroPosition]);
                return null;
            }
        }
        else {
            console.log('wrong redo position', this.app.currentSong.macroPosition, this.app.currentSong.macros.length);
            return null;
        }
    };
    ZvoogUndoRedo.prototype.doUndo = function () {
        if (this.app.currentSong.macros.length > 0 && this.app.currentSong.macroPosition > 0 && this.app.currentSong.macroPosition <= this.app.currentSong.macros.length) {
            var command = this.app.currentSong.macros[this.app.currentSong.macroPosition - 1];
            var a = this.app.undoRedo.createUndoRedoAction(command);
            if (a) {
                a.undo(this.app);
                this.app.currentSong.macroPosition--;
                this.app.resetWholeProject();
                return command.point;
            }
            else {
                console.log('wrong undo', this.app.currentSong.macros[this.app.currentSong.macroPosition]);
                return null;
            }
        }
        else {
            console.log('wrong undo position', this.app.currentSong.macroPosition, this.app.currentSong.macros.length);
            return null;
        }
    };
    ZvoogUndoRedo.prototype.createUndoRedoAction = function (command) {
        var r = null;
        if (command) {
            switch (command.key) {
                case undoRedoChangeProjectTitle: {
                    r = new UndoRedoChangeTitle(command.properties);
                    break;
                }
                case undoRedoChangeProjectDescription: {
                    r = new UndoRedoChangeDescription(command.properties);
                    break;
                }
                case undoRedoMoveVoice: {
                    r = new UndoRedoMoveVoice(command.properties);
                    break;
                }
                case undoRedoMoveTrack: {
                    r = new UndoRedoMoveTrack(command.properties);
                    break;
                }
                case undoRedoBunch: {
                    r = new UndoRedoBunch(command.properties);
                    break;
                }
                default: {
                    break;
                }
            }
        }
        else {
            console.log('empty undo action');
        }
        return r;
    };
    return ZvoogUndoRedo;
}());
var ZvoogFilterSourceEmpty = /** @class */ (function () {
    function ZvoogFilterSourceEmpty() {
        this.params = [];
        this.vals = [];
        //
    }
    ZvoogFilterSourceEmpty.prototype.prepare = function (audioContext) {
        this.base = audioContext.createGain();
        //this.params = [];
    };
    ZvoogFilterSourceEmpty.prototype.getInput = function () {
        return this.base;
    };
    ZvoogFilterSourceEmpty.prototype.getOutput = function () {
        return this.base;
    };
    ZvoogFilterSourceEmpty.prototype.getParams = function () {
        return this.params;
    };
    ZvoogFilterSourceEmpty.prototype.getValues = function () {
        return this.vals;
    };
    ZvoogFilterSourceEmpty.prototype.cancelSchedule = function () {
        //
    };
    ZvoogFilterSourceEmpty.prototype.schedule = function (when, tempo, chord) {
        //
    };
    ZvoogFilterSourceEmpty.prototype.busy = function () {
        return 0;
    };
    ZvoogFilterSourceEmpty.prototype.label = function () {
        return 'stub';
    };
    return ZvoogFilterSourceEmpty;
}());
var TestSong = /** @class */ (function () {
    function TestSong() {
    }
    TestSong.prototype.createRandomCurve = function (duration) {
        var cu = {
            duration: duration,
            points: []
        };
        var curPoint = 0;
        while (curPoint < duration) {
            //var delta = Math.round(Math.random() * 5000 + 5000);
            var delta = 384 * Math.random() > 0.5 ? 1 / 4 : 1 / 2; //{ count: Math.random() > 0.5 ? 0.25 : 0.5, division: duration.division };
            var po = { duration: delta, velocity: Math.floor(Math.random() * 127) };
            cu.points.push(po);
            curPoint = curPoint + delta;
        }
        return cu;
    };
    TestSong.prototype.createRandomLine = function (songlenseconds) {
        var lin = {
            segments: []
        };
        var curPoint = 0;
        while (curPoint < songlenseconds) {
            //var delta = Math.round(Math.random() * 24000 + 3000);
            var delta = Math.round(Math.random() * songlenseconds);
            lin.segments.push(this.createRandomCurve(delta));
            curPoint = curPoint + delta;
        }
        return lin;
    };
    TestSong.prototype.createRandomEffect = function (songlenseconds) {
        var plugin = new ZvoogFilterSourceEmpty();
        var parameters = [];
        var parCount = Math.round(Math.random() * 5);
        for (var i = 0; i < parCount; i++) {
            parameters.push(this.createRandomLine(songlenseconds));
        }
        var fx = { plugin: plugin, parameters: parameters };
        return fx;
    };
    TestSong.prototype.createRandomPitch = function (pre) {
        var d = 384 / 8;
        if (Math.random() > 0.5) {
            d = 384 / 4;
        }
        if (Math.random() > 0.5) {
            d = 384 / 2;
        }
        var pi = {
            duration: d,
            pitch: (pre > 0) ? pre + Math.floor(Math.random() * 21 - 10) : Math.floor(Math.random() * 120)
            //,pitch: (pre > 0) ?pre+ 0 : Math.floor(Math.random() * 120)
        };
        //console.log(pre,pi.pitch);
        return pi;
    };
    TestSong.prototype.createRandomName = function () {
        var colors = ['Red', 'Green', 'Magenta', 'White', 'Yellow', 'Black', 'Pink', 'Blue', 'Cyan', 'Silver'];
        var cnt = 1 + Math.ceil(Math.random() * 3);
        var t = '';
        for (var i = 0; i < cnt; i++) {
            var n = Math.floor(Math.random() * colors.length);
            t = t + colors[n] + ' ';
        }
        return t;
    };
    TestSong.prototype.createRandomChord = function (count, division) {
        var ch = {
            //when: Math.round(Math.random() * duration.count ) 
            when: Math.floor((384 * Math.random() * count / division) / 24) * 24,
            values: [],
            title: '',
            fretHint: [],
            text: ''
        };
        if (Math.random() > 0.95) {
            ch.title = 'G' + Math.round(Math.random() * 10);
        }
        if (Math.random() > 0.95) {
            ch.title = 'Em' + Math.round(Math.random() * 10);
        }
        if (Math.random() > 0.95) {
            ch.title = 'A7' + Math.round(Math.random() * 10);
        }
        if (Math.random() > 0.95) {
            ch.text = 'Bla-bla-bla';
        }
        var valCount = Math.round(Math.random() * 2) + 1;
        /*var k: ZvoogKey = { envelope: [this.createRandomPitch()] };
        if (Math.random() > 0.9) {
            k.envelope.push(this.createRandomPitch());
        }*/
        for (var i = 0; i < valCount; i++) {
            //var pitch:ZvoogPitch=this.createRandomPitch();
            var k = {
                envelope: [this.createRandomPitch(0)],
                stepHint: 0,
                shiftHint: 0,
                octaveHint: 0
            };
            if (Math.random() > 0.9) {
                k.envelope.push(this.createRandomPitch(k.envelope[0].pitch));
            }
            //k.envelope.push(this.createRandomPitch(k.envelope[0].pitch));
            //k.envelope.push(this.createRandomPitch(k.envelope[0].pitch));
            ch.values.push(k);
        }
        return ch;
    };
    TestSong.prototype.createRandomChunk = function (count, division) {
        var p = {
            //meter: duration
            meter: {
                count: count,
                division: division
            },
            tempo: Math.random() > 0.8 ? 120 : 100,
            chords: [],
            title: '/' + Math.round(Math.random() * 1000),
            clefHint: Math.round(Math.random() * 3),
            keyHint: Math.round(Math.random() * 22 - 11)
        };
        var chCount = 1 + Math.round(Math.random() * 2);
        for (var i = 0; i < chCount; i++) {
            p.chords.push(this.createRandomChord(count, division));
        }
        return p;
    };
    TestSong.prototype.createRandomVoice = function (songlenseconds, voiceOrder) {
        var v = {
            chunks: [],
            source: {
                plugin: new ZvoogFilterSourceEmpty(),
                parameters: []
            },
            effects: [],
            title: this.createRandomName() + 'voice '
        };
        var parCount = Math.round(Math.random() * 5);
        for (var i = 0; i < parCount; i++) {
            v.source.parameters.push(this.createRandomLine(songlenseconds));
        }
        var mainFxCount = Math.round(Math.random() * 3);
        for (var i = 0; i < mainFxCount; i++) {
            v.effects.push(this.createRandomEffect(songlenseconds));
        }
        var curPoint = 0;
        while (curPoint < songlenseconds) {
            //var delta = Math.round(Math.random() * 5000 + 3000);
            //var delta: number = Math.random() > 0.9 ? 3 * 384 / 4 : 4 * 384 / 4;
            var cnt = Math.random() > 0.9 ? 3 : 4;
            v.chunks.push(this.createRandomChunk(cnt, 4));
            curPoint = curPoint + cnt * 384 / 4;
        }
        return v;
    };
    TestSong.prototype.createRandomTrack = function (songlenseconds, trackOrder) {
        var t = {
            voices: [],
            effects: [],
            title: this.createRandomName() + 'track ',
            strings: []
        };
        var mainFxCount = Math.round(Math.random() * 3);
        for (var i = 0; i < mainFxCount; i++) {
            t.effects.push(this.createRandomEffect(songlenseconds));
        }
        var mainVoxCount = Math.round(Math.random() * 3 + 1);
        for (var i = 0; i < mainVoxCount; i++) {
            t.voices.push(this.createRandomVoice(songlenseconds, i));
        }
        return t;
    };
    TestSong.prototype.createKeyPattern = function () {
        var keyPattern = [];
        for (var o = 0; o < 10; o++) {
            keyPattern.push(3);
            keyPattern.push(2);
            keyPattern.push(1);
            keyPattern.push(2);
            keyPattern.push(1);
            keyPattern.push(1);
            keyPattern.push(2);
            keyPattern.push(1);
            keyPattern.push(2);
            keyPattern.push(1);
            keyPattern.push(2);
            keyPattern.push(1);
        }
        return keyPattern;
    };
    TestSong.prototype.createRandomSchedule = function () {
        //var duration: ZvoogMeter = { count: Math.round(Math.random() * 100 + 50) * 4, division: 4 };//Math.round(Math.random() * 2 + 1) * 60000;
        var songlenseconds = Math.round(Math.random() * 200 + 150) * 50; //Math.round(Math.random() * 2 + 1) * 60000;
        var t = this.createRandomName() + 'project';
        var s = {
            title: t,
            description: this.createRandomName() + 'description'
            //, duration: duration
            ,
            tracks: [],
            effects: [],
            macros: [
                {
                    key: undoRedoBunch, point: { x: 0, y: 0, z: 100 }, properties: {
                        commands: [
                            { key: undoRedoChangeProjectTitle, properties: { oldTitle: 'old project title', newTitle: 'Next title' }, point: { x: 0, y: 0, z: 100 } },
                            { key: undoRedoChangeProjectTitle, properties: { oldTitle: 'Next title', newTitle: 'Another title' }, point: { x: 0, y: 0, z: 100 } },
                            { key: undoRedoChangeProjectTitle, properties: { oldTitle: 'Another title', newTitle: t }, point: { x: 0, y: 0, z: 100 } }
                        ]
                    }
                }
            ],
            macroPosition: 2,
            masterPosition: 1,
            gridPattern: [
                { duration: 384 / 16, power: 3 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 1 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 2 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 1 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 0 },
                { duration: 384 / 16, power: 0 }
            ],
            keyPattern: this.createKeyPattern(),
            horizontal: true,
            locked: false,
            selectedTrack: 0,
            selectedVoice: 0
        };
        var mainFxCount = Math.round(Math.random() * 3);
        for (var i = 0; i < mainFxCount; i++) {
            s.effects.push(this.createRandomEffect(songlenseconds));
        }
        var trkCount = Math.round(Math.random() * 5) + 1;
        for (var i = 0; i < trkCount; i++) {
            s.tracks.push(this.createRandomTrack(songlenseconds, i));
        }
        var tc = 0;
        var vc = 0;
        if (s.tracks.length > 1)
            tc = 1;
        if (s.tracks[tc].voices.length > 1)
            vc = 1;
        s.selectedTrack = tc;
        s.selectedVoice = vc;
        return s;
    };
    return TestSong;
}());
console.log('ZvoogEngine v1.52');
//function duration2time(bpm: number, duration: ZvoogMeter): number {
function duration2time(bpm, duration384) {
    var n4 = 60 / bpm;
    //var part = duration.division / (4 * duration.count);
    var part = 384 / (4 * duration384);
    return n4 / part;
}
function time2Duration(time, bpm) {
    var n4 = 60 / bpm;
    var n384 = n4 / 96;
    return Math.round(time / n384);
}
function duration384(meter) {
    return meter.count * (384 / meter.division);
}
var undoRedoChangeProjectTitle = 'changeProjectTitle';
var undoRedoChangeProjectDescription = 'changeProjectDescription';
var undoRedoMoveTrack = 'moveTrack';
//type UndoRedoMoveTrackProperties = { oldTrackPosition: number, newTrackPosition: number };
var undoRedoMoveVoice = 'moveVoice';
var undoRedoBunch = 'bunch';
var ZvoogPlayer = /** @class */ (function () {
    function ZvoogPlayer() {
        this.afterTime = 0.05;
        this.envelopes = [];
        this.nearZero = 0.000001;
        this.instrumentKeyArray = [];
        this.instrumentNamesArray = [];
        this.wafratio = 0.5;
        this.drumKeyArray = [];
        this.drumNamesArray = [];
    }
    ZvoogPlayer.prototype.waitGlobalVariable = function (variableName, onFinish) {
        if (window[variableName]) {
            if (window[variableName]) {
                onFinish();
                return;
            }
        }
        var me = this;
        setTimeout(function () {
            me.waitGlobalVariable(variableName, onFinish);
        }, 111);
    };
    ZvoogPlayer.prototype.zones = function (variableName) {
        if (window[variableName]) {
            var preset = window[variableName];
            for (var i = 0; i < preset.zones.length; i++) {
                if (!(preset.zones[i].buffer)) {
                    return null;
                }
            }
            return window[variableName];
        }
        else {
            return null;
        }
    };
    ZvoogPlayer.prototype.afterAdjust = function (variableName, onFinish) {
        if (window[variableName]) {
            var preset = window[variableName];
            var done = true;
            for (var i = 0; i < preset.zones.length; i++) {
                done = done && (!!(preset.zones[i].buffer));
            }
            if (done) {
                onFinish();
                return;
            }
        }
        var me = this;
        setTimeout(function () {
            me.afterAdjust(variableName, onFinish);
        }, 111);
    };
    ZvoogPlayer.prototype.adjustPreset = function (audioContext, preset) {
        for (var i = 0; i < preset.zones.length; i++) {
            this.adjustZone(audioContext, preset.zones[i]);
        }
    };
    ;
    ZvoogPlayer.prototype.adjustAHDSR = function (zone) {
        if (zone.ahdsr) {
            if (zone.ahdsr.length > 0) {
                zone.ahdsrPoints = [];
                for (var i = 0; i < zone.ahdsr.length; i++) {
                    zone.ahdsrPoints.push({
                        duration: zone.ahdsr[i].duration,
                        volume: zone.ahdsr[i].volume
                    });
                }
            }
            else {
                zone.ahdsrPoints = [{
                        duration: 3, volume: 1
                    }, {
                        duration: 0.5, volume: 0.75
                    }, {
                        duration: 1.5, volume: 0.5
                    }, {
                        duration: 3, volume: 0
                    }];
            }
        }
        else {
            zone.ahdsrPoints = [{
                    duration: 3600,
                    volume: 1
                }
            ];
        }
    };
    ZvoogPlayer.prototype.adjustZone = function (audioContext, zone) {
        if (zone.buffer) {
            //
        }
        else {
            zone.delay = 0;
            this.adjustAHDSR(zone);
            if (zone.sample) {
                var decoded = atob(zone.sample);
                zone.buffer = audioContext.createBuffer(1, decoded.length / 2, zone.sampleRate);
                var float32Array = zone.buffer.getChannelData(0);
                var b1 = void 0;
                var b2 = void 0;
                var n = void 0;
                for (var i = 0; i < decoded.length / 2; i++) {
                    b1 = decoded.charCodeAt(i * 2);
                    b2 = decoded.charCodeAt(i * 2 + 1);
                    if (b1 < 0) {
                        b1 = 256 + b1;
                    }
                    if (b2 < 0) {
                        b2 = 256 + b2;
                    }
                    n = b2 * 256 + b1;
                    if (n >= 65536 / 2) {
                        n = n - 65536;
                    }
                    float32Array[i] = n / 65536.0;
                }
                //console.log('sample parsed');
            }
            else {
                if (zone.file) {
                    var datalen = zone.file.length;
                    var arraybuffer = new ArrayBuffer(datalen);
                    var view = new Uint8Array(arraybuffer);
                    var decoded = atob(zone.file);
                    var b = void 0;
                    for (var i = 0; i < decoded.length; i++) {
                        b = decoded.charCodeAt(i);
                        view[i] = b;
                    }
                    audioContext.decodeAudioData(arraybuffer, function (audioBuffer) {
                        zone.buffer = audioBuffer;
                        //console.log('file parsed');
                    });
                }
            }
        }
    };
    ZvoogPlayer.prototype.numValue = function (aValue, defValue) {
        if (typeof aValue === "number") {
            return aValue;
        }
        else {
            return defValue;
        }
    };
    ;
    ZvoogPlayer.prototype.noZeroVolume = function (n) {
        if (n > this.nearZero) {
            return n;
        }
        else {
            return this.nearZero;
        }
    };
    ZvoogPlayer.prototype.findZone = function (preset, pitch) {
        for (var i = preset.zones.length - 1; i >= 0; i--) {
            var zone = preset.zones[i];
            if (zone.keyRangeLow <= pitch && zone.keyRangeHigh + 1 >= pitch) {
                return zone;
            }
        }
        return null;
    };
    ;
    ZvoogPlayer.prototype.findEnvelope = function (audioContext, target, preset) {
        var envelope = null;
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            if (e.target == target && audioContext.currentTime > e.when + e.duration + 0.001) {
                try {
                    if (e.audioBufferSourceNode) {
                        e.audioBufferSourceNode.disconnect();
                        e.audioBufferSourceNode.stop(0);
                        e.audioBufferSourceNode = null;
                    }
                }
                catch (x) {
                    //audioBufferSourceNode is dead already
                }
                envelope = e;
                break;
            }
        }
        if (!(envelope)) {
            envelope = {
                base: audioContext.createGain(),
                target: target,
                audioBufferSourceNode: null,
                when: 0,
                duration: 0,
                pitch: 0,
                preset: preset,
                cancel: function () {
                    if (envelope)
                        if (envelope.when + envelope.duration > audioContext.currentTime) {
                            envelope.base.gain.cancelScheduledValues(0);
                            envelope.base.gain.setTargetAtTime(0.00001, audioContext.currentTime, 0.1);
                            envelope.when = audioContext.currentTime + 0.00001;
                            envelope.duration = 0;
                        }
                }
            };
            envelope.base.gain.setValueAtTime(this.wafratio, 0);
            envelope.base.connect(target);
            this.envelopes.push(envelope);
        }
        return envelope;
    };
    ;
    ZvoogPlayer.prototype.setupEnvelope = function (audioContext, envelope, zone //, volume: number
    , when, waveDuration, noteDuration) {
        envelope.base.gain.setValueAtTime(this.noZeroVolume(0), audioContext.currentTime);
        var playDuration = noteDuration;
        var envPoints = zone.ahdsrPoints;
        if (waveDuration < playDuration + this.afterTime) {
            playDuration = waveDuration - this.afterTime;
        }
        envelope.base.gain.cancelScheduledValues(when);
        var currentDuration = 0;
        var currentVolume = envPoints[0].volume;
        envelope.base.gain.setValueAtTime(this.noZeroVolume(currentVolume * this.wafratio), when);
        for (var i = 0; i < envPoints.length; i++) {
            if (currentDuration + envPoints[i].duration > playDuration) {
                var remains = envPoints[i].duration + currentDuration - playDuration;
                var ratio = 1 - remains / envPoints[i].duration;
                var revolume = currentVolume - ratio * (currentVolume - envPoints[i].volume);
                envelope.base.gain.linearRampToValueAtTime(this.noZeroVolume(revolume * this.wafratio), when + playDuration);
                break;
            }
            currentDuration = currentDuration + envPoints[i].duration;
            currentVolume = envPoints[i].volume;
            envelope.base.gain.linearRampToValueAtTime(this.noZeroVolume(currentVolume * this.wafratio), when + currentDuration);
        }
        if (currentDuration < playDuration) {
            envelope.base.gain.linearRampToValueAtTime(this.noZeroVolume(currentVolume * this.wafratio), when + playDuration);
        }
        envelope.base.gain.linearRampToValueAtTime(this.noZeroVolume(0), when + playDuration + this.afterTime);
    };
    ;
    ZvoogPlayer.prototype.calculateDuration = function (tempo, pitches) {
        var r = 0;
        for (var i = 0; i < pitches.length; i++) {
            //if(pitches.length>1)console.log(r,pitches[i].duration);
            if (pitches[i].duration)
                r = r + duration2time(tempo, pitches[i].duration);
        }
        //if(pitches.length>1)console.log(r,pitches);
        return r;
    };
    ZvoogPlayer.prototype.queueWaveTable = function (audioContext, target, preset, when, tempo, pitches) {
        if (audioContext.state == 'suspended') {
            console.log('audioContext.resume');
            audioContext.resume();
        }
        var pitch = pitches[0].pitch;
        var zone = this.findZone(preset, pitch);
        if (!zone) {
            console.log('no zone for', pitch, 'in', preset);
            return null;
        }
        if (!(zone.buffer)) {
            console.log('empty buffer', zone);
            return null;
        }
        var duration = this.calculateDuration(tempo, pitches);
        if (when > 0 && when + duration < audioContext.currentTime) {
            console.log('skip');
            return null;
        }
        var baseDetune = zone.originalPitch - 100.0 * zone.coarseTune - zone.fineTune;
        var currentPlaybackRate = 1.0 * Math.pow(2, (100.0 * pitch - baseDetune) / 1200.0);
        var startWhen = when;
        if (startWhen < audioContext.currentTime) {
            startWhen = audioContext.currentTime;
        }
        var waveDuration = duration + this.afterTime;
        var loop = true;
        if (zone.loopStart < 1 || zone.loopStart >= zone.loopEnd) {
            loop = false;
        }
        if (!loop) {
            if (waveDuration > zone.buffer.duration / currentPlaybackRate) {
                waveDuration = zone.buffer.duration / currentPlaybackRate;
            }
        }
        var envelope = this.findEnvelope(audioContext, target, preset);
        this.setupEnvelope(audioContext, envelope, zone, startWhen, waveDuration, duration);
        envelope.audioBufferSourceNode = audioContext.createBufferSource();
        envelope.audioBufferSourceNode.playbackRate.setValueAtTime(currentPlaybackRate, 0);
        envelope.audioBufferSourceNode.playbackRate.setValueAtTime(currentPlaybackRate, startWhen);
        if (pitches.length > 1) {
            //console.log('start', duration, startWhen.toFixed(3), (startWhen + duration));
            var newWhen = startWhen;
            for (var i = 1; i < pitches.length; i++) {
                var newPlaybackRate = 1.0 * Math.pow(2, (100.0 * pitches[i].pitch - baseDetune) / 1200.0);
                //console.log(i, newWhen.toFixed(3), (newWhen + pitches[i - 1].duration).toFixed(3));
                if (pitches[i - 1].duration) {
                    newWhen = newWhen + duration2time(tempo, pitches[i - 1].duration);
                    //if(newWhen>oldWhen+0.01){
                    envelope.audioBufferSourceNode.playbackRate.linearRampToValueAtTime(newPlaybackRate, newWhen);
                    //oldWhen=newWhen
                }
            }
        }
        envelope.audioBufferSourceNode.buffer = zone.buffer;
        if (loop) {
            envelope.audioBufferSourceNode.loop = true;
            envelope.audioBufferSourceNode.loopStart = zone.loopStart / zone.sampleRate + zone.delay;
            envelope.audioBufferSourceNode.loopEnd = zone.loopEnd / zone.sampleRate + zone.delay;
        }
        else {
            envelope.audioBufferSourceNode.loop = false;
        }
        envelope.audioBufferSourceNode.connect(envelope.base);
        envelope.audioBufferSourceNode.start(startWhen, zone.delay);
        envelope.audioBufferSourceNode.stop(startWhen + waveDuration);
        envelope.when = startWhen;
        envelope.duration = waveDuration;
        envelope.pitch = pitch;
        envelope.preset = preset;
        return envelope;
    };
    ;
    ZvoogPlayer.prototype.cancelQueue = function (audioContext) {
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            e.base.gain.cancelScheduledValues(0);
            e.base.gain.setValueAtTime(this.nearZero, audioContext.currentTime + 0.01);
            e.when = -1;
            //console.log(e);
            try {
                if (e.audioBufferSourceNode)
                    e.audioBufferSourceNode.disconnect();
                //console.log('disconnect');
            }
            catch (ex) {
                console.log(ex);
            }
        }
    };
    ;
    ZvoogPlayer.prototype.instrumentKeys = function () {
        if (this.instrumentKeyArray.length) {
            //
        }
        else {
            this.instrumentKeyArray = [
                '0000_JCLive_sf2_file', '0000_Aspirin_sf2_file', '0000_Chaos_sf2_file', '0000_FluidR3_GM_sf2_file', '0000_GeneralUserGS_sf2_file', '0000_SBLive_sf2',
                '0000_SoundBlasterOld_sf2', '0001_FluidR3_GM_sf2_file', '0001_GeneralUserGS_sf2_file', '0002_GeneralUserGS_sf2_file', '0003_GeneralUserGS_sf2_file',
                '0010_Aspirin_sf2_file', '0010_Chaos_sf2_file', '0010_FluidR3_GM_sf2_file', '0010_GeneralUserGS_sf2_file', '0010_JCLive_sf2_file', '0010_SBLive_sf2',
                '0010_SoundBlasterOld_sf2', '0011_Aspirin_sf2_file', '0011_FluidR3_GM_sf2_file', '0011_GeneralUserGS_sf2_file', '0012_GeneralUserGS_sf2_file',
                '0020_Aspirin_sf2_file', '0020_Chaos_sf2_file', '0020_FluidR3_GM_sf2_file', '0020_GeneralUserGS_sf2_file', '0020_JCLive_sf2_file', '0020_SBLive_sf2',
                '0020_SoundBlasterOld_sf2', '0021_Aspirin_sf2_file', '0021_GeneralUserGS_sf2_file', '0022_Aspirin_sf2_file', '0030_Aspirin_sf2_file', '0030_Chaos_sf2_file',
                '0030_FluidR3_GM_sf2_file', '0030_GeneralUserGS_sf2_file', '0030_JCLive_sf2_file', '0030_SBLive_sf2', '0030_SoundBlasterOld_sf2', '0031_Aspirin_sf2_file',
                '0031_FluidR3_GM_sf2_file', '0031_GeneralUserGS_sf2_file', '0031_SoundBlasterOld_sf2', '0040_Aspirin_sf2_file', '0040_Chaos_sf2_file', '0040_FluidR3_GM_sf2_file',
                '0040_GeneralUserGS_sf2_file', '0040_JCLive_sf2_file', '0040_SBLive_sf2', '0040_SoundBlasterOld_sf2', '0041_FluidR3_GM_sf2_file', '0041_GeneralUserGS_sf2_file',
                '0041_SoundBlasterOld_sf2', '0042_GeneralUserGS_sf2_file', '0043_GeneralUserGS_sf2_file', '0044_GeneralUserGS_sf2_file', '0045_GeneralUserGS_sf2_file',
                '0046_GeneralUserGS_sf2_file', '0050_Aspirin_sf2_file', '0050_Chaos_sf2_file', '0050_FluidR3_GM_sf2_file', '0050_GeneralUserGS_sf2_file', '0050_JCLive_sf2_file',
                '0050_SBLive_sf2', '0050_SoundBlasterOld_sf2', '0051_FluidR3_GM_sf2_file', '0051_GeneralUserGS_sf2_file', '0052_GeneralUserGS_sf2_file', '0053_GeneralUserGS_sf2_file',
                '0054_GeneralUserGS_sf2_file', '0060_Aspirin_sf2_file', '0060_Chaos_sf2_file', '0060_FluidR3_GM_sf2_file', '0060_GeneralUserGS_sf2_file', '0060_JCLive_sf2_file',
                '0060_SBLive_sf2', '0060_SoundBlasterOld_sf2', '0061_Aspirin_sf2_file', '0061_GeneralUserGS_sf2_file', '0061_SoundBlasterOld_sf2', '0062_GeneralUserGS_sf2_file',
                '0070_Aspirin_sf2_file', '0070_Chaos_sf2_file', '0070_FluidR3_GM_sf2_file', '0070_GeneralUserGS_sf2_file', '0070_JCLive_sf2_file', '0070_SBLive_sf2',
                '0070_SoundBlasterOld_sf2', '0071_GeneralUserGS_sf2_file', '0080_Aspirin_sf2_file', '0080_Chaos_sf2_file', '0080_FluidR3_GM_sf2_file', '0080_GeneralUserGS_sf2_file',
                '0080_JCLive_sf2_file', '0080_SBLive_sf2', '0080_SoundBlasterOld_sf2', '0081_FluidR3_GM_sf2_file', '0081_GeneralUserGS_sf2_file', '0081_SoundBlasterOld_sf2',
                '0090_Aspirin_sf2_file', '0090_Chaos_sf2_file', '0090_FluidR3_GM_sf2_file', '0090_GeneralUserGS_sf2_file', '0090_JCLive_sf2_file', '0090_SBLive_sf2',
                '0090_SoundBlasterOld_sf2', '0091_SoundBlasterOld_sf2', '0100_Aspirin_sf2_file', '0100_Chaos_sf2_file', '0100_FluidR3_GM_sf2_file', '0100_GeneralUserGS_sf2_file',
                '0100_JCLive_sf2_file', '0100_SBLive_sf2', '0100_SoundBlasterOld_sf2', '0101_GeneralUserGS_sf2_file', '0101_SoundBlasterOld_sf2', '0110_Aspirin_sf2_file',
                '0110_Chaos_sf2_file', '0110_FluidR3_GM_sf2_file', '0110_GeneralUserGS_sf2_file', '0110_JCLive_sf2_file', '0110_SBLive_sf2', '0110_SoundBlasterOld_sf2',
                '0111_FluidR3_GM_sf2_file', '0120_Aspirin_sf2_file', '0120_Chaos_sf2_file', '0120_FluidR3_GM_sf2_file', '0120_GeneralUserGS_sf2_file', '0120_JCLive_sf2_file',
                '0120_SBLive_sf2', '0120_SoundBlasterOld_sf2', '0121_FluidR3_GM_sf2_file', '0121_GeneralUserGS_sf2_file', '0130_Aspirin_sf2_file', '0130_Chaos_sf2_file',
                '0130_FluidR3_GM_sf2_file', '0130_GeneralUserGS_sf2_file', '0130_JCLive_sf2_file', '0130_SBLive_sf2', '0130_SoundBlasterOld_sf2', '0131_FluidR3_GM_sf2_file',
                '0140_Aspirin_sf2_file', '0140_Chaos_sf2_file', '0140_FluidR3_GM_sf2_file', '0140_GeneralUserGS_sf2_file', '0140_JCLive_sf2_file', '0140_SBLive_sf2',
                '0140_SoundBlasterOld_sf2', '0141_FluidR3_GM_sf2_file', '0141_GeneralUserGS_sf2_file', '0142_GeneralUserGS_sf2_file', '0143_GeneralUserGS_sf2_file',
                '0150_Aspirin_sf2_file', '0150_Chaos_sf2_file', '0150_FluidR3_GM_sf2_file', '0150_GeneralUserGS_sf2_file', '0150_JCLive_sf2_file', '0150_SBLive_sf2',
                '0150_SoundBlasterOld_sf2', '0151_FluidR3_GM_sf2_file', '0160_Aspirin_sf2_file', '0160_Chaos_sf2_file', '0160_FluidR3_GM_sf2_file', '0160_GeneralUserGS_sf2_file',
                '0160_JCLive_sf2_file', '0160_SBLive_sf2', '0160_SoundBlasterOld_sf2', '0161_Aspirin_sf2_file', '0161_FluidR3_GM_sf2_file', '0161_SoundBlasterOld_sf2',
                '0170_Aspirin_sf2_file', '0170_Chaos_sf2_file', '0170_FluidR3_GM_sf2_file', '0170_GeneralUserGS_sf2_file', '0170_JCLive_sf2_file', '0170_SBLive_sf2',
                '0170_SoundBlasterOld_sf2', '0171_FluidR3_GM_sf2_file', '0171_GeneralUserGS_sf2_file', '0172_FluidR3_GM_sf2_file', '0180_Aspirin_sf2_file', '0180_Chaos_sf2_file',
                '0180_FluidR3_GM_sf2_file', '0180_GeneralUserGS_sf2_file', '0180_JCLive_sf2_file', '0180_SBLive_sf2', '0180_SoundBlasterOld_sf2', '0181_Aspirin_sf2_file',
                '0181_GeneralUserGS_sf2_file', '0181_SoundBlasterOld_sf2', '0190_Aspirin_sf2_file', '0190_Chaos_sf2_file', '0190_FluidR3_GM_sf2_file',
                '0190_GeneralUserGS_sf2_file', '0190_JCLive_sf2_file', '0190_SBLive_sf2', '0190_SoundBlasterOld_sf2', '0191_Aspirin_sf2_file', '0191_GeneralUserGS_sf2_file', '0191_SoundBlasterOld_sf2',
                '0200_Aspirin_sf2_file', '0200_Chaos_sf2_file', '0200_FluidR3_GM_sf2_file', '0200_GeneralUserGS_sf2_file', '0200_JCLive_sf2_file', '0200_SBLive_sf2',
                '0200_SoundBlasterOld_sf2', '0201_Aspirin_sf2_file', '0201_FluidR3_GM_sf2_file', '0201_GeneralUserGS_sf2_file', '0201_SoundBlasterOld_sf2', '0210_Aspirin_sf2_file',
                '0210_Chaos_sf2_file', '0210_FluidR3_GM_sf2_file', '0210_GeneralUserGS_sf2_file', '0210_JCLive_sf2_file', '0210_SBLive_sf2', '0210_SoundBlasterOld_sf2',
                '0211_Aspirin_sf2_file', '0211_FluidR3_GM_sf2_file', '0211_GeneralUserGS_sf2_file', '0211_SoundBlasterOld_sf2', '0212_GeneralUserGS_sf2_file',
                '0220_Aspirin_sf2_file', '0220_Chaos_sf2_file', '0220_FluidR3_GM_sf2_file', '0220_GeneralUserGS_sf2_file', '0220_JCLive_sf2_file', '0220_SBLive_sf2',
                '0220_SoundBlasterOld_sf2', '0221_FluidR3_GM_sf2_file', '0230_Aspirin_sf2_file', '0230_Chaos_sf2_file', '0230_FluidR3_GM_sf2_file', '0230_GeneralUserGS_sf2_file',
                '0230_JCLive_sf2_file', '0230_SBLive_sf2', '0230_SoundBlasterOld_sf2', '0231_FluidR3_GM_sf2_file', '0231_GeneralUserGS_sf2_file', '0231_JCLive_sf2_file',
                '0231_SoundBlasterOld_sf2', '0232_FluidR3_GM_sf2_file', '0233_FluidR3_GM_sf2_file', '0240_Aspirin_sf2_file', '0240_Chaos_sf2_file', '0240_FluidR3_GM_sf2_file',
                '0240_GeneralUserGS_sf2_file', '0240_JCLive_sf2_file', '0240_LK_Godin_Nylon_SF2_file', '0240_SBLive_sf2', '0240_SoundBlasterOld_sf2',
                '0241_GeneralUserGS_sf2_file', '0241_JCLive_sf2_file', '0242_JCLive_sf2_file', '0243_JCLive_sf2_file', '0253_Acoustic_Guitar_sf2_file', '0250_Aspirin_sf2_file',
                '0250_Chaos_sf2_file', '0250_FluidR3_GM_sf2_file', '0250_GeneralUserGS_sf2_file', '0250_JCLive_sf2_file', '0250_LK_AcousticSteel_SF2_file', '0250_SBLive_sf2', '0250_SoundBlasterOld_sf2', '0251_Acoustic_Guitar_sf2_file', '0251_GeneralUserGS_sf2_file', '0252_Acoustic_Guitar_sf2_file', '0252_GeneralUserGS_sf2_file',
                '0253_Acoustic_Guitar_sf2_file', '0253_GeneralUserGS_sf2_file', '0254_Acoustic_Guitar_sf2_file', '0254_GeneralUserGS_sf2_file', '0255_GeneralUserGS_sf2_file',
                '0260_Aspirin_sf2_file', '0260_Chaos_sf2_file', '0260_FluidR3_GM_sf2_file', '0260_GeneralUserGS_sf2_file', '0260_JCLive_sf2_file', '0260_SBLive_sf2',
                '0260_SoundBlasterOld_sf2', '0260_Stratocaster_sf2_file', '0261_GeneralUserGS_sf2_file', '0261_SoundBlasterOld_sf2', '0261_Stratocaster_sf2_file',
                '0262_Stratocaster_sf2_file', '0270_Aspirin_sf2_file', '0270_Chaos_sf2_file', '0270_FluidR3_GM_sf2_file', '0270_GeneralUserGS_sf2_file',
                '0270_Gibson_Les_Paul_sf2_file', '0270_JCLive_sf2_file', '0270_SBAWE32_sf2_file', '0270_SBLive_sf2', '0270_SoundBlasterOld_sf2', '0270_Stratocaster_sf2_file',
                '0271_GeneralUserGS_sf2_file', '0271_Stratocaster_sf2_file', '0272_Stratocaster_sf2_file', '0280_Aspirin_sf2_file', '0280_Chaos_sf2_file',
                '0280_FluidR3_GM_sf2_file', '0280_GeneralUserGS_sf2_file', '0280_JCLive_sf2_file', '0280_LesPaul_sf2', '0280_LesPaul_sf2_file', '0280_SBAWE32_sf2_file',
                '0280_SBLive_sf2', '0280_SoundBlasterOld_sf2', '0281_Aspirin_sf2_file', '0281_FluidR3_GM_sf2_file', '0281_GeneralUserGS_sf2_file', '0282_FluidR3_GM_sf2_file',
                '0282_GeneralUserGS_sf2_file', '0283_GeneralUserGS_sf2_file', '0290_Aspirin_sf2_file', '0290_Chaos_sf2_file', '0290_FluidR3_GM_sf2_file', '0290_GeneralUserGS_sf2_file', '0290_JCLive_sf2_file', '0290_LesPaul_sf2', '0290_LesPaul_sf2_file', '0290_SBAWE32_sf2_file', '0290_SBLive_sf2', '0290_SoundBlasterOld_sf2', '0291_Aspirin_sf2_file', '0291_LesPaul_sf2', '0291_LesPaul_sf2_file', '0291_SBAWE32_sf2_file', '0291_SoundBlasterOld_sf2', '0292_Aspirin_sf2_file', '0292_LesPaul_sf2', '0292_LesPaul_sf2_file', '0300_Aspirin_sf2_file', '0300_Chaos_sf2_file', '0300_FluidR3_GM_sf2_file', '0300_GeneralUserGS_sf2_file', '0300_JCLive_sf2_file', '0300_LesPaul_sf2', '0300_LesPaul_sf2_file', '0300_SBAWE32_sf2_file', '0300_SBLive_sf2', '0300_SoundBlasterOld_sf2', '0301_Aspirin_sf2_file', '0301_FluidR3_GM_sf2_file', '0301_GeneralUserGS_sf2_file', '0301_JCLive_sf2_file', '0301_LesPaul_sf2', '0301_LesPaul_sf2_file', '0302_Aspirin_sf2_file', '0302_GeneralUserGS_sf2_file', '0302_JCLive_sf2_file', '0303_Aspirin_sf2_file', '0304_Aspirin_sf2_file', '0310_Aspirin_sf2_file', '0310_Chaos_sf2_file', '0310_FluidR3_GM_sf2_file', '0310_GeneralUserGS_sf2_file', '0310_JCLive_sf2_file', '0310_LesPaul_sf2', '0310_LesPaul_sf2_file', '0310_SBAWE32_sf2_file', '0310_SBLive_sf2', '0310_SoundBlasterOld_sf2', '0311_FluidR3_GM_sf2_file', '0311_GeneralUserGS_sf2_file', '0320_Aspirin_sf2_file', '0320_Chaos_sf2_file', '0320_FluidR3_GM_sf2_file', '0320_GeneralUserGS_sf2_file', '0320_JCLive_sf2_file', '0320_SBLive_sf2', '0320_SoundBlasterOld_sf2', '0321_GeneralUserGS_sf2_file', '0322_GeneralUserGS_sf2_file', '0330_Aspirin_sf2_file', '0330_Chaos_sf2_file', '0330_FluidR3_GM_sf2_file', '0330_GeneralUserGS_sf2_file', '0330_JCLive_sf2_file', '0330_SBLive_sf2', '0330_SoundBlasterOld_sf2', '0331_GeneralUserGS_sf2_file', '0332_GeneralUserGS_sf2_file', '0340_Aspirin_sf2_file', '0340_Chaos_sf2_file', '0340_FluidR3_GM_sf2_file', '0340_GeneralUserGS_sf2_file', '0340_JCLive_sf2_file', '0340_SBLive_sf2', '0340_SoundBlasterOld_sf2', '0341_Aspirin_sf2_file', '0341_GeneralUserGS_sf2_file', '0350_Aspirin_sf2_file', '0350_Chaos_sf2_file', '0350_FluidR3_GM_sf2_file', '0350_GeneralUserGS_sf2_file', '0350_JCLive_sf2_file', '0350_SBLive_sf2', '0350_SoundBlasterOld_sf2', '0351_GeneralUserGS_sf2_file', '0360_Aspirin_sf2_file', '0360_Chaos_sf2_file', '0360_FluidR3_GM_sf2_file', '0360_GeneralUserGS_sf2_file', '0360_JCLive_sf2_file', '0360_SBLive_sf2', '0360_SoundBlasterOld_sf2', '0361_GeneralUserGS_sf2_file', '0370_Aspirin_sf2_file', '0370_Chaos_sf2_file', '0370_FluidR3_GM_sf2_file', '0370_GeneralUserGS_sf2_file', '0370_JCLive_sf2_file', '0370_SBLive_sf2', '0370_SoundBlasterOld_sf2', '0371_GeneralUserGS_sf2_file', '0372_GeneralUserGS_sf2_file', '0380_Aspirin_sf2_file', '0380_Chaos_sf2_file', '0380_FluidR3_GM_sf2_file', '0380_GeneralUserGS_sf2_file', '0380_JCLive_sf2_file', '0380_SBLive_sf2', '0380_SoundBlasterOld_sf2', '0381_FluidR3_GM_sf2_file', '0381_GeneralUserGS_sf2_file', '0382_FluidR3_GM_sf2_file', '0382_GeneralUserGS_sf2_file', '0383_GeneralUserGS_sf2_file', '0384_GeneralUserGS_sf2_file', '0385_GeneralUserGS_sf2_file', '0386_GeneralUserGS_sf2_file', '0387_GeneralUserGS_sf2_file', '0390_Aspirin_sf2_file', '0390_Chaos_sf2_file', '0390_FluidR3_GM_sf2_file', '0390_GeneralUserGS_sf2_file', '0390_JCLive_sf2_file', '0390_SBLive_sf2', '0390_SoundBlasterOld_sf2', '0391_FluidR3_GM_sf2_file', '0391_GeneralUserGS_sf2_file', '0391_SoundBlasterOld_sf2', '0392_FluidR3_GM_sf2_file', '0392_GeneralUserGS_sf2_file', '0393_GeneralUserGS_sf2_file', '0400_Aspirin_sf2_file', '0400_Chaos_sf2_file', '0400_FluidR3_GM_sf2_file', '0400_GeneralUserGS_sf2_file', '0400_JCLive_sf2_file', '0400_SBLive_sf2', '0400_SoundBlasterOld_sf2', '0401_Aspirin_sf2_file', '0401_FluidR3_GM_sf2_file', '0401_GeneralUserGS_sf2_file', '0402_GeneralUserGS_sf2_file', '0410_Aspirin_sf2_file', '0410_Chaos_sf2_file', '0410_FluidR3_GM_sf2_file', '0410_GeneralUserGS_sf2_file', '0410_JCLive_sf2_file', '0410_SBLive_sf2', '0410_SoundBlasterOld_sf2', '0411_FluidR3_GM_sf2_file', '0420_Aspirin_sf2_file', '0420_Chaos_sf2_file', '0420_FluidR3_GM_sf2_file', '0420_GeneralUserGS_sf2_file', '0420_JCLive_sf2_file', '0420_SBLive_sf2', '0420_SoundBlasterOld_sf2', '0421_FluidR3_GM_sf2_file', '0421_GeneralUserGS_sf2_file', '0430_Aspirin_sf2_file', '0430_Chaos_sf2_file', '0430_FluidR3_GM_sf2_file', '0430_GeneralUserGS_sf2_file', '0430_JCLive_sf2_file', '0430_SBLive_sf2', '0430_SoundBlasterOld_sf2', '0431_FluidR3_GM_sf2_file', '0440_Aspirin_sf2_file', '0440_Chaos_sf2_file', '0440_FluidR3_GM_sf2_file', '0440_GeneralUserGS_sf2_file', '0440_JCLive_sf2_file', '0440_SBLive_sf2', '0440_SoundBlasterOld_sf2', '0441_GeneralUserGS_sf2_file', '0442_GeneralUserGS_sf2_file', '0450_Aspirin_sf2_file', '0450_Chaos_sf2_file', '0450_FluidR3_GM_sf2_file', '0450_GeneralUserGS_sf2_file', '0450_JCLive_sf2_file', '0450_SBLive_sf2', '0450_SoundBlasterOld_sf2', '0451_FluidR3_GM_sf2_file', '0460_Aspirin_sf2_file', '0460_Chaos_sf2_file', '0460_FluidR3_GM_sf2_file', '0460_GeneralUserGS_sf2_file', '0460_JCLive_sf2_file', '0460_SBLive_sf2', '0460_SoundBlasterOld_sf2', '0461_FluidR3_GM_sf2_file', '0470_Aspirin_sf2_file', '0470_Chaos_sf2_file', '0470_FluidR3_GM_sf2_file', '0470_GeneralUserGS_sf2_file', '0470_JCLive_sf2_file', '0470_SBLive_sf2', '0470_SoundBlasterOld_sf2', '0471_FluidR3_GM_sf2_file', '0471_GeneralUserGS_sf2_file', '0480_Aspirin_sf2_file', '0480_Chaos_sf2_file', '0480_FluidR3_GM_sf2_file', '0480_GeneralUserGS_sf2_file', '0480_JCLive_sf2_file', '0480_SBLive_sf2', '0480_SoundBlasterOld_sf2', '04810_GeneralUserGS_sf2_file', '04811_GeneralUserGS_sf2_file', '04812_GeneralUserGS_sf2_file', '04813_GeneralUserGS_sf2_file', '04814_GeneralUserGS_sf2_file', '04815_GeneralUserGS_sf2_file', '04816_GeneralUserGS_sf2_file', '04817_GeneralUserGS_sf2_file', '0481_Aspirin_sf2_file', '0481_FluidR3_GM_sf2_file', '0481_GeneralUserGS_sf2_file', '0482_Aspirin_sf2_file', '0482_GeneralUserGS_sf2_file', '0483_GeneralUserGS_sf2_file', '0484_GeneralUserGS_sf2_file', '0485_GeneralUserGS_sf2_file', '0486_GeneralUserGS_sf2_file', '0487_GeneralUserGS_sf2_file', '0488_GeneralUserGS_sf2_file', '0489_GeneralUserGS_sf2_file', '0490_Aspirin_sf2_file', '0490_Chaos_sf2_file', '0490_FluidR3_GM_sf2_file', '0490_GeneralUserGS_sf2_file', '0490_JCLive_sf2_file', '0490_SBLive_sf2', '0490_SoundBlasterOld_sf2', '0491_GeneralUserGS_sf2_file', '0492_GeneralUserGS_sf2_file', '0500_Aspirin_sf2_file', '0500_Chaos_sf2_file', '0500_FluidR3_GM_sf2_file', '0500_GeneralUserGS_sf2_file', '0500_JCLive_sf2_file', '0500_SBLive_sf2', '0500_SoundBlasterOld_sf2', '0501_FluidR3_GM_sf2_file', '0501_GeneralUserGS_sf2_file', '0502_FluidR3_GM_sf2_file', '0502_GeneralUserGS_sf2_file', '0503_FluidR3_GM_sf2_file', '0504_FluidR3_GM_sf2_file', '0505_FluidR3_GM_sf2_file', '0510_Aspirin_sf2_file', '0510_Chaos_sf2_file', '0510_FluidR3_GM_sf2_file', '0510_GeneralUserGS_sf2_file', '0510_JCLive_sf2_file', '0510_SBLive_sf2', '0510_SoundBlasterOld_sf2', '0511_GeneralUserGS_sf2_file', '0511_SoundBlasterOld_sf2', '0520_Aspirin_sf2_file', '0520_Chaos_sf2_file', '0520_FluidR3_GM_sf2_file', '0520_GeneralUserGS_sf2_file', '0520_JCLive_sf2_file', '0520_SBLive_sf2', '0520_Soul_Ahhs_sf2_file', '0520_SoundBlasterOld_sf2', '0521_FluidR3_GM_sf2_file', '0521_Soul_Ahhs_sf2_file', '0521_SoundBlasterOld_sf2', '0522_Soul_Ahhs_sf2_file', '0530_Aspirin_sf2_file', '0530_Chaos_sf2_file', '0530_FluidR3_GM_sf2_file', '0530_GeneralUserGS_sf2_file', '0530_JCLive_sf2_file', '0530_SBLive_sf2', '0530_Soul_Ahhs_sf2_file', '0530_SoundBlasterOld_sf2', '0531_FluidR3_GM_sf2_file', '0531_GeneralUserGS_sf2_file', '0531_JCLive_sf2_file', '0531_SoundBlasterOld_sf2', '0540_Aspirin_sf2_file', '0540_Chaos_sf2_file', '0540_FluidR3_GM_sf2_file', '0540_GeneralUserGS_sf2_file', '0540_JCLive_sf2_file', '0540_SBLive_sf2', '0540_SoundBlasterOld_sf2', '0541_FluidR3_GM_sf2_file', '0550_Aspirin_sf2_file', '0550_Chaos_sf2_file', '0550_FluidR3_GM_sf2_file', '0550_GeneralUserGS_sf2_file', '0550_JCLive_sf2_file', '0550_SBLive_sf2', '0550_SoundBlasterOld_sf2', '0551_Aspirin_sf2_file', '0551_FluidR3_GM_sf2_file', '0560_Aspirin_sf2_file', '0560_Chaos_sf2_file', '0560_FluidR3_GM_sf2_file', '0560_GeneralUserGS_sf2_file', '0560_JCLive_sf2_file', '0560_SBLive_sf2', '0560_SoundBlasterOld_sf2', '0570_Aspirin_sf2_file', '0570_Chaos_sf2_file', '0570_FluidR3_GM_sf2_file', '0570_GeneralUserGS_sf2_file', '0570_JCLive_sf2_file', '0570_SBLive_sf2', '0570_SoundBlasterOld_sf2', '0571_GeneralUserGS_sf2_file', '0580_Aspirin_sf2_file', '0580_Chaos_sf2_file', '0580_FluidR3_GM_sf2_file', '0580_GeneralUserGS_sf2_file', '0580_JCLive_sf2_file', '0580_SBLive_sf2', '0580_SoundBlasterOld_sf2', '0581_GeneralUserGS_sf2_file', '0590_Aspirin_sf2_file', '0590_Chaos_sf2_file', '0590_FluidR3_GM_sf2_file', '0590_GeneralUserGS_sf2_file', '0590_JCLive_sf2_file', '0590_SBLive_sf2', '0590_SoundBlasterOld_sf2', '0591_GeneralUserGS_sf2_file', '0600_Aspirin_sf2_file', '0600_Chaos_sf2_file', '0600_FluidR3_GM_sf2_file', '0600_GeneralUserGS_sf2_file', '0600_JCLive_sf2_file', '0600_SBLive_sf2', '0600_SoundBlasterOld_sf2', '0601_FluidR3_GM_sf2_file', '0601_GeneralUserGS_sf2_file', '0602_GeneralUserGS_sf2_file', '0603_GeneralUserGS_sf2_file', '0610_Aspirin_sf2_file', '0610_Chaos_sf2_file', '0610_FluidR3_GM_sf2_file', '0610_GeneralUserGS_sf2_file', '0610_JCLive_sf2_file', '0610_SBLive_sf2', '0610_SoundBlasterOld_sf2', '0611_GeneralUserGS_sf2_file', '0612_GeneralUserGS_sf2_file', '0613_GeneralUserGS_sf2_file', '0614_GeneralUserGS_sf2_file', '0615_GeneralUserGS_sf2_file', '0620_Aspirin_sf2_file', '0620_Chaos_sf2_file', '0620_FluidR3_GM_sf2_file', '0620_GeneralUserGS_sf2_file', '0620_JCLive_sf2_file', '0620_SBLive_sf2', '0620_SoundBlasterOld_sf2', '0621_Aspirin_sf2_file', '0621_FluidR3_GM_sf2_file', '0621_GeneralUserGS_sf2_file', '0622_FluidR3_GM_sf2_file', '0622_GeneralUserGS_sf2_file', '0630_Aspirin_sf2_file', '0630_Chaos_sf2_file', '0630_FluidR3_GM_sf2_file', '0630_GeneralUserGS_sf2_file', '0630_JCLive_sf2_file', '0630_SBLive_sf2', '0630_SoundBlasterOld_sf2', '0631_Aspirin_sf2_file', '0631_FluidR3_GM_sf2_file', '0631_GeneralUserGS_sf2_file', '0632_FluidR3_GM_sf2_file', '0633_FluidR3_GM_sf2_file', '0640_Aspirin_sf2_file', '0640_Chaos_sf2_file', '0640_FluidR3_GM_sf2_file', '0640_GeneralUserGS_sf2_file', '0640_JCLive_sf2_file', '0640_SBLive_sf2', '0640_SoundBlasterOld_sf2', '0641_FluidR3_GM_sf2_file', '0650_Aspirin_sf2_file', '0650_Chaos_sf2_file', '0650_FluidR3_GM_sf2_file', '0650_GeneralUserGS_sf2_file', '0650_JCLive_sf2_file', '0650_SBLive_sf2', '0650_SoundBlasterOld_sf2', '0651_Aspirin_sf2_file', '0651_FluidR3_GM_sf2_file', '0660_Aspirin_sf2_file', '0660_Chaos_sf2_file', '0660_FluidR3_GM_sf2_file', '0660_GeneralUserGS_sf2_file', '0660_JCLive_sf2_file', '0660_SBLive_sf2', '0660_SoundBlasterOld_sf2', '0661_FluidR3_GM_sf2_file', '0661_GeneralUserGS_sf2_file', '0670_Aspirin_sf2_file', '0670_Chaos_sf2_file', '0670_FluidR3_GM_sf2_file', '0670_GeneralUserGS_sf2_file', '0670_JCLive_sf2_file', '0670_SBLive_sf2', '0670_SoundBlasterOld_sf2', '0671_FluidR3_GM_sf2_file', '0680_Aspirin_sf2_file', '0680_Chaos_sf2_file', '0680_FluidR3_GM_sf2_file', '0680_GeneralUserGS_sf2_file', '0680_JCLive_sf2_file', '0680_SBLive_sf2', '0680_SoundBlasterOld_sf2', '0681_FluidR3_GM_sf2_file', '0690_Aspirin_sf2_file', '0690_Chaos_sf2_file', '0690_FluidR3_GM_sf2_file', '0690_GeneralUserGS_sf2_file', '0690_JCLive_sf2_file', '0690_SBLive_sf2', '0690_SoundBlasterOld_sf2', '0691_FluidR3_GM_sf2_file', '0700_Aspirin_sf2_file', '0700_Chaos_sf2_file', '0700_FluidR3_GM_sf2_file', '0700_GeneralUserGS_sf2_file', '0700_JCLive_sf2_file', '0700_SBLive_sf2', '0700_SoundBlasterOld_sf2', '0701_FluidR3_GM_sf2_file', '0701_GeneralUserGS_sf2_file', '0710_Aspirin_sf2_file', '0710_Chaos_sf2_file', '0710_FluidR3_GM_sf2_file', '0710_GeneralUserGS_sf2_file', '0710_JCLive_sf2_file', '0710_SBLive_sf2', '0710_SoundBlasterOld_sf2', '0711_FluidR3_GM_sf2_file', '0720_Aspirin_sf2_file', '0720_Chaos_sf2_file', '0720_FluidR3_GM_sf2_file', '0720_GeneralUserGS_sf2_file', '0720_JCLive_sf2_file', '0720_SBLive_sf2', '0720_SoundBlasterOld_sf2', '0721_FluidR3_GM_sf2_file', '0721_SoundBlasterOld_sf2', '0730_Aspirin_sf2_file', '0730_Chaos_sf2_file', '0730_FluidR3_GM_sf2_file', '0730_GeneralUserGS_sf2_file', '0730_JCLive_sf2_file', '0730_SBLive_sf2', '0730_SoundBlasterOld_sf2', '0731_Aspirin_sf2_file', '0731_FluidR3_GM_sf2_file', '0731_SoundBlasterOld_sf2', '0740_Aspirin_sf2_file', '0740_Chaos_sf2_file', '0740_FluidR3_GM_sf2_file', '0740_GeneralUserGS_sf2_file', '0740_JCLive_sf2_file', '0740_SBLive_sf2', '0740_SoundBlasterOld_sf2', '0741_GeneralUserGS_sf2_file', '0750_Aspirin_sf2_file', '0750_Chaos_sf2_file', '0750_FluidR3_GM_sf2_file', '0750_GeneralUserGS_sf2_file', '0750_JCLive_sf2_file', '0750_SBLive_sf2', '0750_SoundBlasterOld_sf2', '0751_Aspirin_sf2_file', '0751_FluidR3_GM_sf2_file', '0751_GeneralUserGS_sf2_file', '0751_SoundBlasterOld_sf2', '0760_Aspirin_sf2_file', '0760_Chaos_sf2_file', '0760_FluidR3_GM_sf2_file', '0760_GeneralUserGS_sf2_file', '0760_JCLive_sf2_file', '0760_SBLive_sf2', '0760_SoundBlasterOld_sf2', '0761_FluidR3_GM_sf2_file', '0761_GeneralUserGS_sf2_file', '0761_SoundBlasterOld_sf2', '0762_GeneralUserGS_sf2_file', '0770_Aspirin_sf2_file', '0770_Chaos_sf2_file', '0770_FluidR3_GM_sf2_file', '0770_GeneralUserGS_sf2_file', '0770_JCLive_sf2_file', '0770_SBLive_sf2', '0770_SoundBlasterOld_sf2', '0771_FluidR3_GM_sf2_file', '0771_GeneralUserGS_sf2_file', '0772_GeneralUserGS_sf2_file', '0780_Aspirin_sf2_file', '0780_Chaos_sf2_file', '0780_FluidR3_GM_sf2_file', '0780_GeneralUserGS_sf2_file', '0780_JCLive_sf2_file', '0780_SBLive_sf2', '0780_SoundBlasterOld_sf2', '0781_GeneralUserGS_sf2_file', '0790_Aspirin_sf2_file', '0790_Chaos_sf2_file', '0790_FluidR3_GM_sf2_file', '0790_GeneralUserGS_sf2_file', '0790_JCLive_sf2_file', '0790_SBLive_sf2', '0790_SoundBlasterOld_sf2', '0791_GeneralUserGS_sf2_file', '0800_Aspirin_sf2_file', '0800_Chaos_sf2_file', '0800_FluidR3_GM_sf2_file', '0800_GeneralUserGS_sf2_file', '0800_JCLive_sf2_file', '0800_SBLive_sf2', '0800_SoundBlasterOld_sf2', '0801_FluidR3_GM_sf2_file', '0801_GeneralUserGS_sf2_file', '0810_Aspirin_sf2_file', '0810_Chaos_sf2_file', '0810_FluidR3_GM_sf2_file', '0810_GeneralUserGS_sf2_file', '0810_JCLive_sf2_file', '0810_SBLive_sf2', '0810_SoundBlasterOld_sf2', '0811_Aspirin_sf2_file', '0811_GeneralUserGS_sf2_file', '0811_SoundBlasterOld_sf2', '0820_Aspirin_sf2_file', '0820_Chaos_sf2_file', '0820_FluidR3_GM_sf2_file', '0820_GeneralUserGS_sf2_file', '0820_JCLive_sf2_file', '0820_SBLive_sf2', '0820_SoundBlasterOld_sf2', '0821_FluidR3_GM_sf2_file', '0821_GeneralUserGS_sf2_file', '0821_SoundBlasterOld_sf2', '0822_GeneralUserGS_sf2_file', '0823_GeneralUserGS_sf2_file', '0830_Aspirin_sf2_file', '0830_Chaos_sf2_file', '0830_FluidR3_GM_sf2_file', '0830_GeneralUserGS_sf2_file', '0830_JCLive_sf2_file', '0830_SBLive_sf2', '0830_SoundBlasterOld_sf2', '0831_FluidR3_GM_sf2_file', '0831_GeneralUserGS_sf2_file', '0831_SoundBlasterOld_sf2', '0840_Aspirin_sf2_file', '0840_Chaos_sf2_file', '0840_FluidR3_GM_sf2_file', '0840_GeneralUserGS_sf2_file', '0840_JCLive_sf2_file', '0840_SBLive_sf2', '0840_SoundBlasterOld_sf2', '0841_Aspirin_sf2_file', '0841_Chaos_sf2_file', '0841_FluidR3_GM_sf2_file', '0841_GeneralUserGS_sf2_file', '0841_JCLive_sf2_file', '0841_SoundBlasterOld_sf2', '0842_FluidR3_GM_sf2_file', '0850_Aspirin_sf2_file', '0850_Chaos_sf2_file', '0850_FluidR3_GM_sf2_file', '0850_GeneralUserGS_sf2_file', '0850_JCLive_sf2_file', '0850_SBLive_sf2', '0850_SoundBlasterOld_sf2', '0851_FluidR3_GM_sf2_file', '0851_GeneralUserGS_sf2_file', '0851_JCLive_sf2_file', '0851_SoundBlasterOld_sf2', '0860_Aspirin_sf2_file', '0860_Chaos_sf2_file', '0860_FluidR3_GM_sf2_file', '0860_GeneralUserGS_sf2_file', '0860_JCLive_sf2_file', '0860_SBLive_sf2', '0860_SoundBlasterOld_sf2', '0861_Aspirin_sf2_file', '0861_FluidR3_GM_sf2_file', '0861_SoundBlasterOld_sf2', '0870_Aspirin_sf2_file', '0870_Chaos_sf2_file', '0870_FluidR3_GM_sf2_file', '0870_GeneralUserGS_sf2_file', '0870_JCLive_sf2_file', '0870_SBLive_sf2', '0870_SoundBlasterOld_sf2', '0871_GeneralUserGS_sf2_file', '0872_GeneralUserGS_sf2_file', '0873_GeneralUserGS_sf2_file', '0880_Aspirin_sf2_file', '0880_Chaos_sf2_file', '0880_FluidR3_GM_sf2_file', '0880_GeneralUserGS_sf2_file', '0880_JCLive_sf2_file', '0880_SBLive_sf2', '0880_SoundBlasterOld_sf2', '0881_Aspirin_sf2_file', '0881_FluidR3_GM_sf2_file', '0881_GeneralUserGS_sf2_file', '0881_SoundBlasterOld_sf2', '0882_Aspirin_sf2_file', '0882_FluidR3_GM_sf2_file', '0882_GeneralUserGS_sf2_file', '0883_GeneralUserGS_sf2_file', '0884_GeneralUserGS_sf2_file', '0885_GeneralUserGS_sf2_file', '0886_GeneralUserGS_sf2_file', '0887_GeneralUserGS_sf2_file', '0888_GeneralUserGS_sf2_file', '0889_GeneralUserGS_sf2_file', '0890_Aspirin_sf2_file', '0890_Chaos_sf2_file', '0890_FluidR3_GM_sf2_file', '0890_GeneralUserGS_sf2_file', '0890_JCLive_sf2_file', '0890_SBLive_sf2', '0890_SoundBlasterOld_sf2', '0891_Aspirin_sf2_file', '0891_FluidR3_GM_sf2_file', '0891_GeneralUserGS_sf2_file', '0900_Aspirin_sf2_file', '0900_Chaos_sf2_file', '0900_FluidR3_GM_sf2_file', '0900_GeneralUserGS_sf2_file', '0900_JCLive_sf2_file', '0900_SBLive_sf2', '0900_SoundBlasterOld_sf2', '0901_Aspirin_sf2_file', '0901_FluidR3_GM_sf2_file', '0901_GeneralUserGS_sf2_file', '0901_SoundBlasterOld_sf2', '0910_Aspirin_sf2_file', '0910_Chaos_sf2_file', '0910_FluidR3_GM_sf2_file', '0910_GeneralUserGS_sf2_file', '0910_JCLive_sf2_file', '0910_SBLive_sf2', '0910_SoundBlasterOld_sf2', '0911_Aspirin_sf2_file', '0911_GeneralUserGS_sf2_file', '0911_JCLive_sf2_file', '0911_SoundBlasterOld_sf2', '0920_Aspirin_sf2_file', '0920_Chaos_sf2_file', '0920_FluidR3_GM_sf2_file', '0920_GeneralUserGS_sf2_file', '0920_JCLive_sf2_file', '0920_SBLive_sf2', '0920_SoundBlasterOld_sf2', '0921_Aspirin_sf2_file', '0921_GeneralUserGS_sf2_file', '0921_SoundBlasterOld_sf2', '0930_Aspirin_sf2_file', '0930_Chaos_sf2_file', '0930_FluidR3_GM_sf2_file', '0930_GeneralUserGS_sf2_file', '0930_JCLive_sf2_file', '0930_SBLive_sf2', '0930_SoundBlasterOld_sf2', '0931_Aspirin_sf2_file', '0931_FluidR3_GM_sf2_file', '0931_GeneralUserGS_sf2_file', '0931_SoundBlasterOld_sf2', '0940_Aspirin_sf2_file', '0940_Chaos_sf2_file', '0940_FluidR3_GM_sf2_file', '0940_GeneralUserGS_sf2_file', '0940_JCLive_sf2_file', '0940_SBLive_sf2', '0940_SoundBlasterOld_sf2', '0941_Aspirin_sf2_file', '0941_FluidR3_GM_sf2_file', '0941_GeneralUserGS_sf2_file', '0941_JCLive_sf2_file', '0950_Aspirin_sf2_file', '0950_Chaos_sf2_file', '0950_FluidR3_GM_sf2_file', '0950_GeneralUserGS_sf2_file', '0950_JCLive_sf2_file', '0950_SBLive_sf2', '0950_SoundBlasterOld_sf2', '0951_FluidR3_GM_sf2_file', '0951_GeneralUserGS_sf2_file', '0960_Aspirin_sf2_file', '0960_Chaos_sf2_file', '0960_FluidR3_GM_sf2_file', '0960_GeneralUserGS_sf2_file', '0960_JCLive_sf2_file', '0960_SBLive_sf2', '0960_SoundBlasterOld_sf2', '0961_Aspirin_sf2_file', '0961_FluidR3_GM_sf2_file', '0961_GeneralUserGS_sf2_file', '0961_SoundBlasterOld_sf2', '0962_GeneralUserGS_sf2_file', '0970_Aspirin_sf2_file', '0970_Chaos_sf2_file', '0970_FluidR3_GM_sf2_file', '0970_GeneralUserGS_sf2_file', '0970_JCLive_sf2_file', '0970_SBLive_sf2', '0970_SoundBlasterOld_sf2', '0971_FluidR3_GM_sf2_file', '0971_GeneralUserGS_sf2_file', '0971_SoundBlasterOld_sf2', '0980_Aspirin_sf2_file', '0980_Chaos_sf2_file', '0980_FluidR3_GM_sf2_file', '0980_GeneralUserGS_sf2_file', '0980_JCLive_sf2_file', '0980_SBLive_sf2', '0980_SoundBlasterOld_sf2', '0981_Aspirin_sf2_file', '0981_FluidR3_GM_sf2_file', '0981_GeneralUserGS_sf2_file', '0981_SoundBlasterOld_sf2', '0982_GeneralUserGS_sf2_file', '0983_GeneralUserGS_sf2_file', '0984_GeneralUserGS_sf2_file', '0990_Aspirin_sf2_file', '0990_Chaos_sf2_file', '0990_FluidR3_GM_sf2_file', '0990_GeneralUserGS_sf2_file', '0990_JCLive_sf2_file', '0990_SBLive_sf2', '0990_SoundBlasterOld_sf2', '0991_Aspirin_sf2_file', '0991_FluidR3_GM_sf2_file', '0991_GeneralUserGS_sf2_file', '0991_JCLive_sf2_file', '0991_SoundBlasterOld_sf2', '0992_FluidR3_GM_sf2_file', '0992_JCLive_sf2_file', '0993_JCLive_sf2_file', '0994_JCLive_sf2_file', '1000_Aspirin_sf2_file', '1000_Chaos_sf2_file', '1000_FluidR3_GM_sf2_file', '1000_GeneralUserGS_sf2_file', '1000_JCLive_sf2_file', '1000_SBLive_sf2', '1000_SoundBlasterOld_sf2', '1001_Aspirin_sf2_file', '1001_FluidR3_GM_sf2_file', '1001_GeneralUserGS_sf2_file', '1001_JCLive_sf2_file', '1001_SoundBlasterOld_sf2', '1002_Aspirin_sf2_file', '1002_FluidR3_GM_sf2_file', '1002_GeneralUserGS_sf2_file', '1010_Aspirin_sf2_file', '1010_Chaos_sf2_file', '1010_FluidR3_GM_sf2_file', '1010_GeneralUserGS_sf2_file', '1010_JCLive_sf2_file', '1010_SBLive_sf2', '1010_SoundBlasterOld_sf2', '1011_Aspirin_sf2_file', '1011_FluidR3_GM_sf2_file', '1011_JCLive_sf2_file', '1012_Aspirin_sf2_file', '1020_Aspirin_sf2_file', '1020_Chaos_sf2_file', '1020_FluidR3_GM_sf2_file', '1020_GeneralUserGS_sf2_file', '1020_JCLive_sf2_file', '1020_SBLive_sf2', '1020_SoundBlasterOld_sf2', '1021_Aspirin_sf2_file', '1021_FluidR3_GM_sf2_file', '1021_GeneralUserGS_sf2_file', '1021_JCLive_sf2_file', '1021_SoundBlasterOld_sf2', '1022_GeneralUserGS_sf2_file', '1030_Aspirin_sf2_file', '1030_Chaos_sf2_file', '1030_FluidR3_GM_sf2_file', '1030_GeneralUserGS_sf2_file', '1030_JCLive_sf2_file', '1030_SBLive_sf2', '1030_SoundBlasterOld_sf2', '1031_Aspirin_sf2_file', '1031_FluidR3_GM_sf2_file', '1031_GeneralUserGS_sf2_file', '1031_SoundBlasterOld_sf2', '1032_FluidR3_GM_sf2_file', '1040_Aspirin_sf2_file', '1040_Chaos_sf2_file', '1040_FluidR3_GM_sf2_file', '1040_GeneralUserGS_sf2_file', '1040_JCLive_sf2_file', '1040_SBLive_sf2', '1040_SoundBlasterOld_sf2', '1041_FluidR3_GM_sf2_file', '1041_GeneralUserGS_sf2_file', '1050_Aspirin_sf2_file', '1050_Chaos_sf2_file', '1050_FluidR3_GM_sf2_file', '1050_GeneralUserGS_sf2_file', '1050_JCLive_sf2_file', '1050_SBLive_sf2', '1050_SoundBlasterOld_sf2', '1051_GeneralUserGS_sf2_file', '1060_Aspirin_sf2_file', '1060_Chaos_sf2_file', '1060_FluidR3_GM_sf2_file', '1060_GeneralUserGS_sf2_file', '1060_JCLive_sf2_file', '1060_SBLive_sf2', '1060_SoundBlasterOld_sf2', '1061_FluidR3_GM_sf2_file', '1061_GeneralUserGS_sf2_file', '1061_SoundBlasterOld_sf2', '1070_Aspirin_sf2_file', '1070_Chaos_sf2_file', '1070_FluidR3_GM_sf2_file', '1070_GeneralUserGS_sf2_file', '1070_JCLive_sf2_file', '1070_SBLive_sf2', '1070_SoundBlasterOld_sf2', '1071_FluidR3_GM_sf2_file', '1071_GeneralUserGS_sf2_file', '1072_GeneralUserGS_sf2_file', '1073_GeneralUserGS_sf2_file', '1080_Aspirin_sf2_file', '1080_Chaos_sf2_file', '1080_FluidR3_GM_sf2_file', '1080_GeneralUserGS_sf2_file', '1080_JCLive_sf2_file', '1080_SBLive_sf2', '1080_SoundBlasterOld_sf2', '1081_SoundBlasterOld_sf2', '1090_Aspirin_sf2_file', '1090_Chaos_sf2_file', '1090_FluidR3_GM_sf2_file', '1090_GeneralUserGS_sf2_file', '1090_JCLive_sf2_file', '1090_SBLive_sf2', '1090_SoundBlasterOld_sf2', '1091_SoundBlasterOld_sf2', '1100_Aspirin_sf2_file', '1100_Chaos_sf2_file', '1100_FluidR3_GM_sf2_file', '1100_GeneralUserGS_sf2_file', '1100_JCLive_sf2_file', '1100_SBLive_sf2', '1100_SoundBlasterOld_sf2', '1101_Aspirin_sf2_file', '1101_FluidR3_GM_sf2_file', '1101_GeneralUserGS_sf2_file', '1102_GeneralUserGS_sf2_file', '1110_Aspirin_sf2_file', '1110_Chaos_sf2_file', '1110_FluidR3_GM_sf2_file', '1110_GeneralUserGS_sf2_file', '1110_JCLive_sf2_file', '1110_SBLive_sf2', '1110_SoundBlasterOld_sf2', '1120_Aspirin_sf2_file', '1120_Chaos_sf2_file', '1120_FluidR3_GM_sf2_file', '1120_GeneralUserGS_sf2_file', '1120_JCLive_sf2_file', '1120_SBLive_sf2', '1120_SoundBlasterOld_sf2', '1121_SoundBlasterOld_sf2', '1130_Aspirin_sf2_file', '1130_Chaos_sf2_file', '1130_FluidR3_GM_sf2_file', '1130_GeneralUserGS_sf2_file', '1130_JCLive_sf2_file', '1130_SBLive_sf2', '1130_SoundBlasterOld_sf2', '1131_FluidR3_GM_sf2_file', '1131_SoundBlasterOld_sf2', '1140_Aspirin_sf2_file', '1140_Chaos_sf2_file', '1140_FluidR3_GM_sf2_file', '1140_GeneralUserGS_sf2_file', '1140_JCLive_sf2_file', '1140_SBLive_sf2', '1140_SoundBlasterOld_sf2', '1141_FluidR3_GM_sf2_file', '1150_Aspirin_sf2_file', '1150_Chaos_sf2_file', '1150_FluidR3_GM_sf2_file', '1150_GeneralUserGS_sf2_file', '1150_JCLive_sf2_file', '1150_SBLive_sf2', '1150_SoundBlasterOld_sf2', '1151_FluidR3_GM_sf2_file', '1151_GeneralUserGS_sf2_file', '1152_FluidR3_GM_sf2_file', '1152_GeneralUserGS_sf2_file', '1160_Aspirin_sf2_file', '1160_Chaos_sf2_file', '1160_FluidR3_GM_sf2_file', '1160_GeneralUserGS_sf2_file', '1160_JCLive_sf2_file', '1160_SBLive_sf2', '1160_SoundBlasterOld_sf2', '1161_FluidR3_GM_sf2_file', '1161_GeneralUserGS_sf2_file', '1161_SoundBlasterOld_sf2', '1162_FluidR3_GM_sf2_file', '1162_GeneralUserGS_sf2_file', '1163_FluidR3_GM_sf2_file', '1170_Aspirin_sf2_file', '1170_Chaos_sf2_file', '1170_FluidR3_GM_sf2_file', '1170_GeneralUserGS_sf2_file', '1170_JCLive_sf2_file', '1170_SBLive_sf2', '1170_SoundBlasterOld_sf2', '1171_FluidR3_GM_sf2_file', '1171_GeneralUserGS_sf2_file', '1172_FluidR3_GM_sf2_file', '1173_FluidR3_GM_sf2_file', '1180_Aspirin_sf2_file', '1180_Chaos_sf2_file', '1180_FluidR3_GM_sf2_file', '1180_GeneralUserGS_sf2_file', '1180_JCLive_sf2_file', '1180_SBLive_sf2', '1180_SoundBlasterOld_sf2', '1181_FluidR3_GM_sf2_file', '1181_GeneralUserGS_sf2_file', '1181_SoundBlasterOld_sf2', '1190_Aspirin_sf2_file', '1190_Chaos_sf2_file', '1190_FluidR3_GM_sf2_file', '1190_GeneralUserGS_sf2_file', '1190_JCLive_sf2_file', '1190_SBLive_sf2', '1190_SoundBlasterOld_sf2', '1191_GeneralUserGS_sf2_file', '1192_GeneralUserGS_sf2_file', '1193_GeneralUserGS_sf2_file', '1194_GeneralUserGS_sf2_file', '1200_Aspirin_sf2_file', '1200_Chaos_sf2_file', '1200_FluidR3_GM_sf2_file', '1200_GeneralUserGS_sf2_file', '1200_JCLive_sf2_file', '1200_SBLive_sf2', '1200_SoundBlasterOld_sf2', '1201_Aspirin_sf2_file', '1201_GeneralUserGS_sf2_file', '1202_GeneralUserGS_sf2_file', '1210_Aspirin_sf2_file', '1210_Chaos_sf2_file', '1210_FluidR3_GM_sf2_file', '1210_GeneralUserGS_sf2_file', '1210_JCLive_sf2_file', '1210_SBLive_sf2', '1210_SoundBlasterOld_sf2', '1211_Aspirin_sf2_file', '1211_GeneralUserGS_sf2_file', '1212_GeneralUserGS_sf2_file', '1220_Aspirin_sf2_file', '1220_Chaos_sf2_file', '1220_FluidR3_GM_sf2_file', '1220_GeneralUserGS_sf2_file', '1220_JCLive_sf2_file', '1220_SBLive_sf2', '1220_SoundBlasterOld_sf2', '1221_Aspirin_sf2_file', '1221_GeneralUserGS_sf2_file', '1221_JCLive_sf2_file', '1222_Aspirin_sf2_file', '1222_GeneralUserGS_sf2_file', '1223_Aspirin_sf2_file', '1223_GeneralUserGS_sf2_file', '1224_Aspirin_sf2_file', '1224_GeneralUserGS_sf2_file', '1225_GeneralUserGS_sf2_file', '1226_GeneralUserGS_sf2_file', '1230_Aspirin_sf2_file', '1230_Chaos_sf2_file', '1230_FluidR3_GM_sf2_file', '1230_GeneralUserGS_sf2_file', '1230_JCLive_sf2_file', '1230_SBLive_sf2', '1230_SoundBlasterOld_sf2', '1231_Aspirin_sf2_file', '1231_GeneralUserGS_sf2_file', '1232_Aspirin_sf2_file', '1232_GeneralUserGS_sf2_file', '1233_GeneralUserGS_sf2_file', '1234_GeneralUserGS_sf2_file', '1240_Aspirin_sf2_file', '1240_Chaos_sf2_file', '1240_FluidR3_GM_sf2_file', '1240_GeneralUserGS_sf2_file', '1240_JCLive_sf2_file', '1240_SBLive_sf2', '1240_SoundBlasterOld_sf2', '1241_Aspirin_sf2_file', '1241_GeneralUserGS_sf2_file', '1242_Aspirin_sf2_file', '1242_GeneralUserGS_sf2_file', '1243_Aspirin_sf2_file', '1243_GeneralUserGS_sf2_file', '1244_Aspirin_sf2_file', '1244_GeneralUserGS_sf2_file', '1250_Aspirin_sf2_file', '1250_Chaos_sf2_file', '1250_FluidR3_GM_sf2_file', '1250_GeneralUserGS_sf2_file', '1250_JCLive_sf2_file', '1250_SBLive_sf2', '1250_SoundBlasterOld_sf2', '1251_Aspirin_sf2_file', '1251_FluidR3_GM_sf2_file', '1251_GeneralUserGS_sf2_file', '1252_Aspirin_sf2_file', '1252_FluidR3_GM_sf2_file', '1252_GeneralUserGS_sf2_file', '1253_Aspirin_sf2_file', '1253_GeneralUserGS_sf2_file', '1254_Aspirin_sf2_file', '1254_GeneralUserGS_sf2_file', '1255_Aspirin_sf2_file', '1255_GeneralUserGS_sf2_file', '1256_Aspirin_sf2_file', '1256_GeneralUserGS_sf2_file', '1257_Aspirin_sf2_file', '1257_GeneralUserGS_sf2_file', '1258_Aspirin_sf2_file', '1258_GeneralUserGS_sf2_file', '1259_GeneralUserGS_sf2_file', '1260_Aspirin_sf2_file', '1260_Chaos_sf2_file', '1260_FluidR3_GM_sf2_file', '1260_GeneralUserGS_sf2_file', '1260_JCLive_sf2_file', '1260_SBLive_sf2', '1260_SoundBlasterOld_sf2', '1261_Aspirin_sf2_file', '1261_GeneralUserGS_sf2_file', '1262_Aspirin_sf2_file', '1262_GeneralUserGS_sf2_file', '1263_Aspirin_sf2_file', '1263_GeneralUserGS_sf2_file', '1264_Aspirin_sf2_file', '1264_GeneralUserGS_sf2_file', '1265_Aspirin_sf2_file', '1265_GeneralUserGS_sf2_file', '1270_Aspirin_sf2_file', '1270_Chaos_sf2_file', '1270_FluidR3_GM_sf2_file', '1270_GeneralUserGS_sf2_file', '1270_JCLive_sf2_file', '1270_SBLive_sf2', '1270_SoundBlasterOld_sf2', '1271_Aspirin_sf2_file', '1271_GeneralUserGS_sf2_file', '1272_Aspirin_sf2_file', '1272_GeneralUserGS_sf2_file', '1273_GeneralUserGS_sf2_file', '1274_GeneralUserGS_sf2_file'
            ];
        }
        return this.instrumentKeyArray;
    };
    ;
    ZvoogPlayer.prototype.instrumentTitles = function () {
        if (this.instrumentNamesArray.length > 0) {
            //
        }
        else {
            var insNames = [];
            insNames[0] = "Acoustic Grand Piano: Piano";
            insNames[1] = "Bright Acoustic Piano: Piano";
            insNames[2] = "Electric Grand Piano: Piano";
            insNames[3] = "Honky-tonk Piano: Piano";
            insNames[4] = "Electric Piano 1: Piano";
            insNames[5] = "Electric Piano 2: Piano";
            insNames[6] = "Harpsichord: Piano";
            insNames[7] = "Clavinet: Piano";
            insNames[8] = "Celesta: Chromatic Percussion";
            insNames[9] = "Glockenspiel: Chromatic Percussion";
            insNames[10] = "Music Box: Chromatic Percussion";
            insNames[11] = "Vibraphone: Chromatic Percussion";
            insNames[12] = "Marimba: Chromatic Percussion";
            insNames[13] = "Xylophone: Chromatic Percussion";
            insNames[14] = "Tubular Bells: Chromatic Percussion";
            insNames[15] = "Dulcimer: Chromatic Percussion";
            insNames[16] = "Drawbar Organ: Organ";
            insNames[17] = "Percussive Organ: Organ";
            insNames[18] = "Rock Organ: Organ";
            insNames[19] = "Church Organ: Organ";
            insNames[20] = "Reed Organ: Organ";
            insNames[21] = "Accordion: Organ";
            insNames[22] = "Harmonica: Organ";
            insNames[23] = "Tango Accordion: Organ";
            insNames[24] = "Acoustic Guitar (nylon): Guitar";
            insNames[25] = "Acoustic Guitar (steel): Guitar";
            insNames[26] = "Electric Guitar (jazz): Guitar";
            insNames[27] = "Electric Guitar (clean): Guitar";
            insNames[28] = "Electric Guitar (muted): Guitar";
            insNames[29] = "Overdriven Guitar: Guitar";
            insNames[30] = "Distortion Guitar: Guitar";
            insNames[31] = "Guitar Harmonics: Guitar";
            insNames[32] = "Acoustic Bass: Bass";
            insNames[33] = "Electric Bass (finger): Bass";
            insNames[34] = "Electric Bass (pick): Bass";
            insNames[35] = "Fretless Bass: Bass";
            insNames[36] = "Slap Bass 1: Bass";
            insNames[37] = "Slap Bass 2: Bass";
            insNames[38] = "Synth Bass 1: Bass";
            insNames[39] = "Synth Bass 2: Bass";
            insNames[40] = "Violin: Strings";
            insNames[41] = "Viola: Strings";
            insNames[42] = "Cello: Strings";
            insNames[43] = "Contrabass: Strings";
            insNames[44] = "Tremolo Strings: Strings";
            insNames[45] = "Pizzicato Strings: Strings";
            insNames[46] = "Orchestral Harp: Strings";
            insNames[47] = "Timpani: Strings";
            insNames[48] = "String Ensemble 1: Ensemble";
            insNames[49] = "String Ensemble 2: Ensemble";
            insNames[50] = "Synth Strings 1: Ensemble";
            insNames[51] = "Synth Strings 2: Ensemble";
            insNames[52] = "Choir Aahs: Ensemble";
            insNames[53] = "Voice Oohs: Ensemble";
            insNames[54] = "Synth Choir: Ensemble";
            insNames[55] = "Orchestra Hit: Ensemble";
            insNames[56] = "Trumpet: Brass";
            insNames[57] = "Trombone: Brass";
            insNames[58] = "Tuba: Brass";
            insNames[59] = "Muted Trumpet: Brass";
            insNames[60] = "French Horn: Brass";
            insNames[61] = "Brass Section: Brass";
            insNames[62] = "Synth Brass 1: Brass";
            insNames[63] = "Synth Brass 2: Brass";
            insNames[64] = "Soprano Sax: Reed";
            insNames[65] = "Alto Sax: Reed";
            insNames[66] = "Tenor Sax: Reed";
            insNames[67] = "Baritone Sax: Reed";
            insNames[68] = "Oboe: Reed";
            insNames[69] = "English Horn: Reed";
            insNames[70] = "Bassoon: Reed";
            insNames[71] = "Clarinet: Reed";
            insNames[72] = "Piccolo: Pipe";
            insNames[73] = "Flute: Pipe";
            insNames[74] = "Recorder: Pipe";
            insNames[75] = "Pan Flute: Pipe";
            insNames[76] = "Blown bottle: Pipe";
            insNames[77] = "Shakuhachi: Pipe";
            insNames[78] = "Whistle: Pipe";
            insNames[79] = "Ocarina: Pipe";
            insNames[80] = "Lead 1 (square): Synth Lead";
            insNames[81] = "Lead 2 (sawtooth): Synth Lead";
            insNames[82] = "Lead 3 (calliope): Synth Lead";
            insNames[83] = "Lead 4 (chiff): Synth Lead";
            insNames[84] = "Lead 5 (charang): Synth Lead";
            insNames[85] = "Lead 6 (voice): Synth Lead";
            insNames[86] = "Lead 7 (fifths): Synth Lead";
            insNames[87] = "Lead 8 (bass + lead): Synth Lead";
            insNames[88] = "Pad 1 (new age): Synth Pad";
            insNames[89] = "Pad 2 (warm): Synth Pad";
            insNames[90] = "Pad 3 (polysynth): Synth Pad";
            insNames[91] = "Pad 4 (choir): Synth Pad";
            insNames[92] = "Pad 5 (bowed): Synth Pad";
            insNames[93] = "Pad 6 (metallic): Synth Pad";
            insNames[94] = "Pad 7 (halo): Synth Pad";
            insNames[95] = "Pad 8 (sweep): Synth Pad";
            insNames[96] = "FX 1 (rain): Synth Effects";
            insNames[97] = "FX 2 (soundtrack): Synth Effects";
            insNames[98] = "FX 3 (crystal): Synth Effects";
            insNames[99] = "FX 4 (atmosphere): Synth Effects";
            insNames[100] = "FX 5 (brightness): Synth Effects";
            insNames[101] = "FX 6 (goblins): Synth Effects";
            insNames[102] = "FX 7 (echoes): Synth Effects";
            insNames[103] = "FX 8 (sci-fi): Synth Effects";
            insNames[104] = "Sitar: Ethnic";
            insNames[105] = "Banjo: Ethnic";
            insNames[106] = "Shamisen: Ethnic";
            insNames[107] = "Koto: Ethnic";
            insNames[108] = "Kalimba: Ethnic";
            insNames[109] = "Bagpipe: Ethnic";
            insNames[110] = "Fiddle: Ethnic";
            insNames[111] = "Shanai: Ethnic";
            insNames[112] = "Tinkle Bell: Percussive";
            insNames[113] = "Agogo: Percussive";
            insNames[114] = "Steel Drums: Percussive";
            insNames[115] = "Woodblock: Percussive";
            insNames[116] = "Taiko Drum: Percussive";
            insNames[117] = "Melodic Tom: Percussive";
            insNames[118] = "Synth Drum: Percussive";
            insNames[119] = "Reverse Cymbal: Percussive";
            insNames[120] = "Guitar Fret Noise: Sound effects";
            insNames[121] = "Breath Noise: Sound effects";
            insNames[122] = "Seashore: Sound effects";
            insNames[123] = "Bird Tweet: Sound effects";
            insNames[124] = "Telephone Ring: Sound effects";
            insNames[125] = "Helicopter: Sound effects";
            insNames[126] = "Applause: Sound effects";
            insNames[127] = "Gunshot: Sound effects";
            this.instrumentNamesArray = insNames;
        }
        return this.instrumentNamesArray;
    };
    ;
    ZvoogPlayer.prototype.instrumentInfo = function (n) {
        var key = this.instrumentKeys()[n];
        var num = key.substring(0, 3);
        var p = parseInt(num);
        return {
            variable: '_tone_' + key,
            url: 'https://surikov.github.io/webaudiofontdata/sound/' + key + '.js',
            title: this.instrumentTitles()[p]
        };
    };
    ;
    ZvoogPlayer.prototype.drumTitles = function () {
        if (this.drumNamesArray.length < 1) {
            var drumNames = [];
            drumNames[35] = "Bass Drum 2";
            drumNames[36] = "Bass Drum 1";
            drumNames[37] = "Side Stick/Rimshot";
            drumNames[38] = "Snare Drum 1";
            drumNames[39] = "Hand Clap";
            drumNames[40] = "Snare Drum 2";
            drumNames[41] = "Low Tom 2";
            drumNames[42] = "Closed Hi-hat";
            drumNames[43] = "Low Tom 1";
            drumNames[44] = "Pedal Hi-hat";
            drumNames[45] = "Mid Tom 2";
            drumNames[46] = "Open Hi-hat";
            drumNames[47] = "Mid Tom 1";
            drumNames[48] = "High Tom 2";
            drumNames[49] = "Crash Cymbal 1";
            drumNames[50] = "High Tom 1";
            drumNames[51] = "Ride Cymbal 1";
            drumNames[52] = "Chinese Cymbal";
            drumNames[53] = "Ride Bell";
            drumNames[54] = "Tambourine";
            drumNames[55] = "Splash Cymbal";
            drumNames[56] = "Cowbell";
            drumNames[57] = "Crash Cymbal 2";
            drumNames[58] = "Vibra Slap";
            drumNames[59] = "Ride Cymbal 2";
            drumNames[60] = "High Bongo";
            drumNames[61] = "Low Bongo";
            drumNames[62] = "Mute High Conga";
            drumNames[63] = "Open High Conga";
            drumNames[64] = "Low Conga";
            drumNames[65] = "High Timbale";
            drumNames[66] = "Low Timbale";
            drumNames[67] = "High Agogo";
            drumNames[68] = "Low Agogo";
            drumNames[69] = "Cabasa";
            drumNames[70] = "Maracas";
            drumNames[71] = "Short Whistle";
            drumNames[72] = "Long Whistle";
            drumNames[73] = "Short Guiro";
            drumNames[74] = "Long Guiro";
            drumNames[75] = "Claves";
            drumNames[76] = "High Wood Block";
            drumNames[77] = "Low Wood Block";
            drumNames[78] = "Mute Cuica";
            drumNames[79] = "Open Cuica";
            drumNames[80] = "Mute Triangle";
            drumNames[81] = "Open Triangle";
            this.drumNamesArray = drumNames;
        }
        return this.drumNamesArray;
    };
    ;
    ZvoogPlayer.prototype.drumInfo = function (n) {
        var key = this.drumKeys()[n];
        var num = key.substring(0, 2);
        var p = parseInt(num);
        return {
            variable: '_drum_' + key,
            url: 'https://surikov.github.io/webaudiofontdata/sound/128' + key + '.js',
            pitch: p,
            title: this.drumTitles()[p]
        };
    };
    ;
    ZvoogPlayer.prototype.findInstrument = function (program) {
        for (var i = 0; i < this.instrumentKeys().length; i++) {
            var num = this.instrumentKeys()[i].substring(0, 3);
            if (program == parseInt(num) + 1) {
                return i;
            }
        }
        console.log('program', program, 'not found');
        return 0;
    };
    ;
    ZvoogPlayer.prototype.drumKeys = function () {
        if (this.drumKeyArray.length < 1) {
            this.drumKeyArray = [
                '35_0_SBLive_sf2', '35_12_JCLive_sf2_file', '35_16_JCLive_sf2_file', '35_18_JCLive_sf2_file', '35_4_Chaos_sf2_file', '36_0_SBLive_sf2', '36_12_JCLive_sf2_file', '36_16_JCLive_sf2_file', '36_18_JCLive_sf2_file', '36_4_Chaos_sf2_file', '37_0_SBLive_sf2', '37_12_JCLive_sf2_file', '37_16_JCLive_sf2_file', '37_18_JCLive_sf2_file', '37_4_Chaos_sf2_file', '38_0_SBLive_sf2', '38_12_JCLive_sf2_file', '38_16_JCLive_sf2_file', '38_18_JCLive_sf2_file', '38_4_Chaos_sf2_file', '39_0_SBLive_sf2', '39_12_JCLive_sf2_file', '39_16_JCLive_sf2_file', '39_18_JCLive_sf2_file', '39_4_Chaos_sf2_file', '40_0_SBLive_sf2', '40_12_JCLive_sf2_file', '40_16_JCLive_sf2_file', '40_18_JCLive_sf2_file', '40_4_Chaos_sf2_file', '41_0_SBLive_sf2', '41_12_JCLive_sf2_file', '41_16_JCLive_sf2_file', '41_18_JCLive_sf2_file', '41_4_Chaos_sf2_file', '42_0_SBLive_sf2', '42_12_JCLive_sf2_file', '42_16_JCLive_sf2_file', '42_18_JCLive_sf2_file', '42_4_Chaos_sf2_file', '43_0_SBLive_sf2', '43_12_JCLive_sf2_file', '43_16_JCLive_sf2_file', '43_18_JCLive_sf2_file', '43_4_Chaos_sf2_file', '44_0_SBLive_sf2', '44_12_JCLive_sf2_file', '44_16_JCLive_sf2_file', '44_18_JCLive_sf2_file', '44_4_Chaos_sf2_file', '45_0_SBLive_sf2', '45_12_JCLive_sf2_file', '45_16_JCLive_sf2_file', '45_18_JCLive_sf2_file', '45_4_Chaos_sf2_file', '46_0_SBLive_sf2', '46_12_JCLive_sf2_file', '46_16_JCLive_sf2_file', '46_18_JCLive_sf2_file', '46_4_Chaos_sf2_file', '47_0_SBLive_sf2', '47_12_JCLive_sf2_file', '47_16_JCLive_sf2_file', '47_18_JCLive_sf2_file', '47_4_Chaos_sf2_file', '48_0_SBLive_sf2', '48_12_JCLive_sf2_file', '48_16_JCLive_sf2_file', '48_18_JCLive_sf2_file', '48_4_Chaos_sf2_file', '49_0_SBLive_sf2', '49_12_JCLive_sf2_file', '49_16_JCLive_sf2_file', '49_18_JCLive_sf2_file', '49_4_Chaos_sf2_file', '50_0_SBLive_sf2', '50_12_JCLive_sf2_file', '50_16_JCLive_sf2_file', '50_18_JCLive_sf2_file', '50_4_Chaos_sf2_file', '51_0_SBLive_sf2', '51_12_JCLive_sf2_file', '51_16_JCLive_sf2_file', '51_18_JCLive_sf2_file', '51_4_Chaos_sf2_file', '52_0_SBLive_sf2', '52_12_JCLive_sf2_file', '52_16_JCLive_sf2_file', '52_18_JCLive_sf2_file', '52_4_Chaos_sf2_file', '53_0_SBLive_sf2', '53_12_JCLive_sf2_file', '53_16_JCLive_sf2_file', '53_18_JCLive_sf2_file', '53_4_Chaos_sf2_file', '54_0_SBLive_sf2', '54_12_JCLive_sf2_file', '54_16_JCLive_sf2_file', '54_18_JCLive_sf2_file', '54_4_Chaos_sf2_file', '55_0_SBLive_sf2', '55_12_JCLive_sf2_file', '55_16_JCLive_sf2_file', '55_18_JCLive_sf2_file', '55_4_Chaos_sf2_file', '56_0_SBLive_sf2', '56_12_JCLive_sf2_file', '56_16_JCLive_sf2_file', '56_18_JCLive_sf2_file', '56_4_Chaos_sf2_file', '57_0_SBLive_sf2', '57_12_JCLive_sf2_file', '57_16_JCLive_sf2_file', '57_18_JCLive_sf2_file', '57_4_Chaos_sf2_file', '58_0_SBLive_sf2', '58_12_JCLive_sf2_file', '58_16_JCLive_sf2_file', '58_18_JCLive_sf2_file', '58_4_Chaos_sf2_file', '59_0_SBLive_sf2', '59_12_JCLive_sf2_file', '59_16_JCLive_sf2_file', '59_18_JCLive_sf2_file', '59_4_Chaos_sf2_file', '60_0_SBLive_sf2', '60_12_JCLive_sf2_file', '60_16_JCLive_sf2_file', '60_18_JCLive_sf2_file', '60_4_Chaos_sf2_file', '61_0_SBLive_sf2', '61_12_JCLive_sf2_file', '61_16_JCLive_sf2_file', '61_18_JCLive_sf2_file', '61_4_Chaos_sf2_file', '62_0_SBLive_sf2', '62_12_JCLive_sf2_file', '62_16_JCLive_sf2_file', '62_18_JCLive_sf2_file', '62_4_Chaos_sf2_file', '63_0_SBLive_sf2', '63_12_JCLive_sf2_file', '63_16_JCLive_sf2_file', '63_18_JCLive_sf2_file', '63_4_Chaos_sf2_file', '64_0_SBLive_sf2', '64_12_JCLive_sf2_file', '64_16_JCLive_sf2_file', '64_18_JCLive_sf2_file', '64_4_Chaos_sf2_file', '65_0_SBLive_sf2', '65_12_JCLive_sf2_file', '65_16_JCLive_sf2_file', '65_18_JCLive_sf2_file', '65_4_Chaos_sf2_file', '66_0_SBLive_sf2', '66_12_JCLive_sf2_file', '66_16_JCLive_sf2_file', '66_18_JCLive_sf2_file', '66_4_Chaos_sf2_file', '67_0_SBLive_sf2', '67_12_JCLive_sf2_file', '67_16_JCLive_sf2_file', '67_18_JCLive_sf2_file', '67_4_Chaos_sf2_file', '68_0_SBLive_sf2', '68_12_JCLive_sf2_file', '68_16_JCLive_sf2_file', '68_18_JCLive_sf2_file', '68_4_Chaos_sf2_file', '69_0_SBLive_sf2', '69_12_JCLive_sf2_file', '69_16_JCLive_sf2_file', '69_18_JCLive_sf2_file', '69_4_Chaos_sf2_file', '70_0_SBLive_sf2', '70_12_JCLive_sf2_file', '70_16_JCLive_sf2_file', '70_18_JCLive_sf2_file', '70_4_Chaos_sf2_file', '71_0_SBLive_sf2', '71_12_JCLive_sf2_file', '71_16_JCLive_sf2_file', '71_18_JCLive_sf2_file', '71_4_Chaos_sf2_file', '72_0_SBLive_sf2', '72_12_JCLive_sf2_file', '72_16_JCLive_sf2_file', '72_18_JCLive_sf2_file', '72_4_Chaos_sf2_file', '73_0_SBLive_sf2', '73_12_JCLive_sf2_file', '73_16_JCLive_sf2_file', '73_18_JCLive_sf2_file', '73_4_Chaos_sf2_file', '74_0_SBLive_sf2', '74_12_JCLive_sf2_file', '74_16_JCLive_sf2_file', '74_18_JCLive_sf2_file', '74_4_Chaos_sf2_file', '75_0_SBLive_sf2', '75_12_JCLive_sf2_file', '75_16_JCLive_sf2_file', '75_18_JCLive_sf2_file', '75_4_Chaos_sf2_file', '76_0_SBLive_sf2', '76_12_JCLive_sf2_file', '76_16_JCLive_sf2_file', '76_18_JCLive_sf2_file', '76_4_Chaos_sf2_file', '77_0_SBLive_sf2', '77_12_JCLive_sf2_file', '77_16_JCLive_sf2_file', '77_18_JCLive_sf2_file', '77_4_Chaos_sf2_file', '78_0_SBLive_sf2', '78_12_JCLive_sf2_file', '78_16_JCLive_sf2_file', '78_18_JCLive_sf2_file', '78_4_Chaos_sf2_file', '79_0_SBLive_sf2', '79_12_JCLive_sf2_file', '79_16_JCLive_sf2_file', '79_18_JCLive_sf2_file', '79_4_Chaos_sf2_file', '80_0_SBLive_sf2', '80_12_JCLive_sf2_file', '80_16_JCLive_sf2_file', '80_18_JCLive_sf2_file', '80_4_Chaos_sf2_file', '81_0_SBLive_sf2', '81_12_JCLive_sf2_file', '81_16_JCLive_sf2_file', '81_18_JCLive_sf2_file', '81_4_Chaos_sf2_file'
            ];
        }
        return this.drumKeyArray;
    };
    ;
    ZvoogPlayer.prototype.findDrum = function (nn) {
        for (var i = 0; i < this.drumKeys().length; i++) {
            var num = this.drumKeys()[i].substring(0, 2);
            if (nn == parseInt(num)) {
                return i;
            }
        }
        return 0;
    };
    ZvoogPlayer.prototype.startLoad = function (audioContext, filePath, variableName) {
        if (window[variableName]) {
            this.adjustPreset(audioContext, window[variableName]);
        }
        else {
            var r = document.createElement('script');
            r.setAttribute("type", "text/javascript");
            r.setAttribute("src", filePath);
            document.getElementsByTagName("head")[0].appendChild(r);
            //this.decodeAfterLoading(audioContext, variableName);
            var me = this;
            this.waitOrFinish(variableName, function () {
                me.adjustPreset(audioContext, window[variableName]);
            });
        }
    };
    ;
    ZvoogPlayer.prototype.waitOrFinish = function (variableName, onFinish) {
        if (window[variableName]) {
            onFinish();
        }
        else {
            var me = this;
            setTimeout(function () {
                me.waitOrFinish(variableName, onFinish);
            }, 111);
        }
    };
    ;
    return ZvoogPlayer;
}());
;
var ZvoogFxGain = /** @class */ (function () {
    function ZvoogFxGain() {
        this.vals = [];
    }
    ZvoogFxGain.prototype.prepare = function (audioContext) {
        this.base = audioContext.createGain();
        var me = this;
        this.gainParam = {
            label: function () { return "level"; },
            cancelScheduledValues: function (cancelTime) { me.base.gain.cancelScheduledValues(cancelTime); },
            linearRampToValueAtTime: function (value, endTime) { me.base.gain.linearRampToValueAtTime(value, endTime); },
            setValueAtTime: function (value, startTime) { me.base.gain.setValueAtTime(value, startTime); }
        };
        this.params = [];
        this.params.push(this.gainParam);
        //this.props = [];
    };
    ZvoogFxGain.prototype.getInput = function () {
        return this.base;
    };
    ZvoogFxGain.prototype.getOutput = function () {
        return this.base;
    };
    ZvoogFxGain.prototype.getParams = function () {
        return this.params;
    };
    ZvoogFxGain.prototype.getValues = function () {
        return this.vals;
    };
    ZvoogFxGain.prototype.busy = function () {
        return 0;
    };
    ZvoogFxGain.prototype.label = function () {
        return 'Volume';
    };
    return ZvoogFxGain;
}());
var ZvoogWaveSource = /** @class */ (function () {
    function ZvoogWaveSource(url, rootPitch, startOffset) {
        this.vals = [];
        this.afterTime = 0.008;
        this.busyState = 1;
        this.offset = 0;
        this.path = url;
        this.root = rootPitch;
        this.offset = startOffset;
        this.busyState = 1;
        //this.properties = [];
    }
    ZvoogWaveSource.prototype.label = function () {
        return 'Audio Wave';
    };
    ZvoogWaveSource.prototype.getValues = function () {
        return this.vals;
    };
    ZvoogWaveSource.prototype.prepare = function (audioContext) {
        this.out = audioContext.createGain();
        this.params = [];
        this.waves = [];
        this.envelopes = [];
        this.audioContext = audioContext;
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.open('GET', this.path, true);
        xmlHttpRequest.responseType = 'arraybuffer';
        var me = this;
        xmlHttpRequest.onload = function (progressEvent) {
            var arrayBuffer = xmlHttpRequest.response;
            if (arrayBuffer) {
                audioContext.decodeAudioData(arrayBuffer, function (audioBuffer) {
                    me.buffer = audioBuffer;
                    me.busyState = 0;
                });
            }
        };
        xmlHttpRequest.send(null);
    };
    ZvoogWaveSource.prototype.getOutput = function () {
        return this.out;
    };
    ZvoogWaveSource.prototype.getParams = function () {
        return this.params;
    };
    ZvoogWaveSource.prototype.cancelSchedule = function () {
        for (var i = 0; i < this.waves.length; i++) {
            this.waves[i].audio.stop();
        }
    };
    ZvoogWaveSource.prototype.schedule = function (when, tempo, chord) {
        for (var i = 0; i < chord.length; i++) {
            this.single(when, tempo, chord[i]);
        }
    };
    ZvoogWaveSource.prototype.single = function (when, tempo, pitches) {
        this.cleanup();
        var audioBufferSourceNode = this.audioContext.createBufferSource();
        audioBufferSourceNode.buffer = this.buffer;
        var currentPlaybackRate = this.freq(pitches[0].pitch) / this.freq(this.root);
        audioBufferSourceNode.playbackRate.setValueAtTime(currentPlaybackRate, 0);
        var at = when + duration2time(tempo, pitches[0].duration);
        for (var i = 1; i < pitches.length; i++) {
            audioBufferSourceNode.playbackRate.linearRampToValueAtTime(this.freq(pitches[i].pitch) / this.freq(this.root), at);
            at = at + duration2time(tempo, pitches[i].duration);
        }
        var time = 0;
        for (var i_1 = 0; i_1 < pitches.length; i_1++) {
            time = time + duration2time(tempo, pitches[i_1].duration);
        }
        var e = this.findEnvelope(when, time);
        audioBufferSourceNode.connect(e.base);
        audioBufferSourceNode.start(when, this.offset);
        audioBufferSourceNode.stop(when + time + this.afterTime);
        this.waves.push({ audio: audioBufferSourceNode, end: at });
    };
    ZvoogWaveSource.prototype.findEnvelope = function (when, duration) {
        var envelope = null;
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            if (this.audioContext.currentTime > e.when + e.duration + this.afterTime) {
                envelope = e;
                break;
            }
        }
        if (!(envelope)) {
            envelope = {
                base: this.audioContext.createGain(),
                when: 0,
                duration: 0
            };
            this.envelopes.push(envelope);
            envelope.base.connect(this.out);
        }
        envelope.when = when;
        envelope.duration = duration;
        envelope.base.gain.setValueAtTime(0, 0);
        envelope.base.gain.setValueAtTime(0, when);
        envelope.base.gain.linearRampToValueAtTime(1, when + this.afterTime);
        envelope.base.gain.setValueAtTime(1, when + duration);
        envelope.base.gain.linearRampToValueAtTime(0, when + duration + this.afterTime);
        return envelope;
    };
    ;
    ZvoogWaveSource.prototype.busy = function () {
        return this.busyState;
    };
    ZvoogWaveSource.prototype.freq = function (key) {
        var O4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
        var half = Math.floor(key % 12);
        var octave = Math.floor(key / 12);
        var freq0 = O4[half] / (2 * 2 * 2 * 2);
        return freq0 * Math.pow(2, octave);
    };
    ZvoogWaveSource.prototype.nextClear = function () {
        for (var i = 0; i < this.waves.length; i++) {
            if (this.waves[i].end < this.audioContext.currentTime) {
                try {
                    this.waves[i].audio.stop();
                    this.waves[i].audio.disconnect();
                }
                catch (x) {
                    console.log(x);
                }
                this.waves.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    ZvoogWaveSource.prototype.cleanup = function () {
        while (this.nextClear()) {
            //
        }
        ;
    };
    return ZvoogWaveSource;
}());
var ZvoogSimpleSource = /** @class */ (function () {
    function ZvoogSimpleSource() {
        this.afterTime = 0.008;
        this.vals = [];
    }
    ZvoogSimpleSource.prototype.prepare = function (audioContext) {
        this.out = audioContext.createGain();
        this.params = [];
        this.sines = [];
        this.envelopes = [];
        this.audioContext = audioContext;
        //this.properties = [];
    };
    ZvoogSimpleSource.prototype.label = function () {
        return 'Sine Wave';
    };
    ZvoogSimpleSource.prototype.getValues = function () {
        return this.vals;
    };
    ZvoogSimpleSource.prototype.getOutput = function () {
        return this.out;
    };
    ZvoogSimpleSource.prototype.getParams = function () {
        return this.params;
    };
    ZvoogSimpleSource.prototype.cancelSchedule = function () {
        for (var i = 0; i < this.sines.length; i++) {
            this.sines[i].node.stop();
        }
    };
    ZvoogSimpleSource.prototype.schedule = function (when, tempo, chord) {
        for (var i = 0; i < chord.length; i++) {
            this.single(when, tempo, chord[i]);
        }
    };
    ZvoogSimpleSource.prototype.single = function (when, tempo, pitches) {
        this.cleanup();
        var oscillator = this.audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(this.freq(pitches[0].pitch), when);
        var at = when + duration2time(tempo, pitches[0].duration);
        for (var i = 1; i < pitches.length; i++) {
            oscillator.frequency.linearRampToValueAtTime(this.freq(pitches[i].pitch), at);
            at = at + duration2time(tempo, pitches[i].duration);
        }
        var duration = 0;
        for (var i_2 = 0; i_2 < pitches.length; i_2++) {
            duration = duration + duration2time(tempo, pitches[i_2].duration);
        }
        var e = this.findEnvelope(when, duration);
        //console.log(this.audioContext.currentTime,when,when+duration,e);
        //oscillator.connect(this.out);
        oscillator.connect(e.base);
        oscillator.start(when);
        oscillator.stop(when + duration + this.afterTime);
        this.sines.push({ node: oscillator, end: at });
    };
    ZvoogSimpleSource.prototype.findEnvelope = function (when, duration) {
        var envelope = null;
        for (var i = 0; i < this.envelopes.length; i++) {
            var e = this.envelopes[i];
            if (this.audioContext.currentTime > e.when + e.duration + this.afterTime) {
                envelope = e;
                //console.log('found');
                break;
            }
        }
        if (!(envelope)) {
            envelope = {
                base: this.audioContext.createGain()
                //, target: target
                ,
                when: 0,
                duration: 0
                /*, cancel: function (): void {
                    if (envelope) if (envelope.when + envelope.duration > this.audioContext.currentTime) {
                        envelope.base.gain.cancelScheduledValues(0);
                        envelope.base.gain.setTargetAtTime(0.00001, this.audioContext.currentTime, 0.1);
                        envelope.when = this.audioContext.currentTime + 0.00001;
                        envelope.duration = 0;
                    }
                }*/
            };
            this.envelopes.push(envelope);
            envelope.base.connect(this.out);
            //envelope.base.gain.setValueAtTime(0.5,0);
            //console.log('created',this.envelopes.length);
        }
        envelope.when = when;
        envelope.duration = duration;
        envelope.base.gain.setValueAtTime(0, 0);
        envelope.base.gain.setValueAtTime(0, when);
        envelope.base.gain.linearRampToValueAtTime(1, when + this.afterTime);
        envelope.base.gain.setValueAtTime(1, when + duration);
        envelope.base.gain.linearRampToValueAtTime(0, when + duration + this.afterTime);
        //envelope.base.gain.setValueAtTime(0, when + duration + this.afterTime);
        //console.log(envelope);
        return envelope;
    };
    ;
    ZvoogSimpleSource.prototype.busy = function () {
        return 0;
    };
    ZvoogSimpleSource.prototype.freq = function (key) {
        var O4 = [261.63, 277.18, 293.66, 311.13, 329.63, 349.23, 369.99, 392.00, 415.30, 440.00, 466.16, 493.88];
        var half = Math.floor(key % 12);
        var octave = Math.floor(key / 12);
        var freq0 = O4[half] / (2 * 2 * 2 * 2);
        return freq0 * Math.pow(2, octave);
    };
    ZvoogSimpleSource.prototype.nextClear = function () {
        for (var i = 0; i < this.sines.length; i++) {
            if (this.sines[i].end < this.audioContext.currentTime) {
                try {
                    this.sines[i].node.stop();
                    this.sines[i].node.disconnect();
                }
                catch (x) {
                    console.log(x);
                }
                this.sines.splice(i, 1);
                return true;
            }
        }
        return false;
    };
    ZvoogSimpleSource.prototype.cleanup = function () {
        while (this.nextClear()) {
            //
        }
        ;
    };
    return ZvoogSimpleSource;
}());
var ZvoogInstrumentSource = /** @class */ (function () {
    function ZvoogInstrumentSource(midi) {
        this.midi = -1;
        this.vals = [];
        this.midi = midi;
        //this.properties=[];
    }
    ZvoogInstrumentSource.prototype.label = function () {
        return 'WAF instrument';
    };
    ZvoogInstrumentSource.prototype.getValues = function () {
        return this.vals;
    };
    ZvoogInstrumentSource.prototype.prepare = function (audioContext) {
        this.base = audioContext.createGain();
        //this.base.gain.setValueAtTime(0.5,0);
        this.params = [];
        this.audioContext = audioContext;
        this.player = new ZvoogPlayer();
        var nn = this.player.findInstrument(this.midi);
        var info = this.player.instrumentInfo(nn);
        this.player.startLoad(audioContext, info.url, info.variable);
    };
    ZvoogInstrumentSource.prototype.getOutput = function () {
        return this.base;
    };
    ZvoogInstrumentSource.prototype.getParams = function () {
        return this.params;
    };
    ZvoogInstrumentSource.prototype.cancelSchedule = function () {
        this.player.cancelQueue(this.audioContext);
    };
    ZvoogInstrumentSource.prototype.schedule = function (when, tempo, chord) {
        if (this.zones) {
            for (var i = 0; i < chord.length; i++) {
                this.player.queueWaveTable(this.audioContext, this.base, this.zones, when, tempo, chord[i]);
            }
        }
    };
    ZvoogInstrumentSource.prototype.busy = function () {
        if (this.zones) {
            return 0;
        }
        var nn = this.player.findInstrument(this.midi);
        var info = this.player.instrumentInfo(nn);
        var z = this.player.zones(info.variable);
        if (z) {
            this.zones = z;
            return 0;
        }
        else {
            return 1;
        }
    };
    return ZvoogInstrumentSource;
}());
var ZvoogDrumSource = /** @class */ (function () {
    function ZvoogDrumSource(midi) {
        this.midi = -1;
        this.midi = midi;
        //this.properties=[];
    }
    ZvoogDrumSource.prototype.label = function () {
        return 'WAF drum';
    };
    ZvoogDrumSource.prototype.getValues = function () {
        return this.vals;
    };
    ZvoogDrumSource.prototype.prepare = function (audioContext) {
        this.base = audioContext.createGain();
        //this.base.gain.setValueAtTime(0.5,0);
        this.params = [];
        this.audioContext = audioContext;
        this.player = new ZvoogPlayer();
        var nn = this.player.findDrum(this.midi);
        var info = this.player.drumInfo(nn);
        this.player.startLoad(audioContext, info.url, info.variable);
    };
    ZvoogDrumSource.prototype.getOutput = function () {
        return this.base;
    };
    ZvoogDrumSource.prototype.getParams = function () {
        return this.params;
    };
    ZvoogDrumSource.prototype.cancelSchedule = function () {
        this.player.cancelQueue(this.audioContext);
    };
    ZvoogDrumSource.prototype.schedule = function (when, tempo, chord) {
        if (this.zones) {
            for (var i = 0; i < chord.length; i++) {
                this.player.queueWaveTable(this.audioContext, this.base, this.zones, when, tempo, chord[i]);
            }
        }
    };
    ZvoogDrumSource.prototype.busy = function () {
        if (this.zones) {
            return 0;
        }
        var nn = this.player.findDrum(this.midi);
        var info = this.player.drumInfo(nn);
        var z = this.player.zones(info.variable);
        if (z) {
            this.zones = z;
            return 0;
        }
        else {
            return 1;
        }
    };
    return ZvoogDrumSource;
}());
console.log('tilelevel v2.15');
//let this: TileLevel = null;
/*
let layerModeLockX: string = 'lockX';
let layerModeNormal: string = 'normal';
let layerModeOverlay: string = 'overlay';
let layerModeLockY: string = 'lockY';
let layerModeStickBottom: string = 'stickBottom';
let layerModeStickRight: string = 'stickRight';
*/
var CannyDo = /** @class */ (function () {
    function CannyDo() {
        this.currentID = 0;
    }
    CannyDo.prototype.start = function (ms, action) {
        var startId = -1;
        this.currentID = setTimeout(function () {
            //console.log(startId,this.currentID,this);
            if (startId == this.currentID) {
                action();
            }
        }.bind(this), ms);
        startId = this.currentID;
    };
    return CannyDo;
}());
var TileLevel = /** @class */ (function () {
    function TileLevel(svgObject, inWidth, inHeight, minZoom, curZoom, maxZoom, layers) {
        this.tapSize = 50;
        this.twoZoom = false;
        this.clickLimit = this.tapSize / 6;
        this.svgns = "http://www.w3.org/2000/svg";
        this.viewWidth = 0;
        this.viewHeight = 0;
        this.innerWidth = 0;
        this.innerHeight = 0;
        this._translateX = 0;
        this._translateY = 0;
        this._translateZ = 1;
        this.startMouseScreenX = 0;
        this.startMouseScreenY = 0;
        this.clickX = 0;
        this.clickY = 0;
        this.dragZoom = 1;
        this.allTilesOK = false;
        this.clicked = false;
        this.mx = 100;
        this.mn = 1;
        this.startedTouch = false;
        this.twodistance = 0;
        this.model = [];
        this.slidingLockTo = 0;
        this.slidingID = 0;
        this.onResizeDo = new CannyDo();
        this.onZoom = new CannyDo();
        this.lastTickTime = 0;
        this.fastenUp = true;
        this.fastenDown = true;
        this.fastenLeft = true;
        this.fastenRight = true;
        this.lastMoveDx = 0;
        this.lastMoveDy = 0;
        this.lastMoveDt = 0;
        //onMoveStop: CannyDo = new CannyDo();
        this.mouseDownMode = false;
        //console.log('TileLevel');
        //this = this;
        this.svg = svgObject;
        this.setupTapSize();
        this.viewWidth = this.svg.clientWidth;
        this.viewHeight = this.svg.clientHeight;
        //this.innerWidth = this.viewWidth;
        //this.innerHeight = this.viewHeight;
        this.innerWidth = inWidth * this.tapSize;
        this.innerHeight = inHeight * this.tapSize;
        this.mx = maxZoom;
        this.mn = minZoom;
        this.translateZ = curZoom;
        this.svg.addEventListener("wheel", this.rakeMouseWheel.bind(this), { capture: false, passive: false });
        this.svg.addEventListener("touchstart", this.rakeTouchStart.bind(this), { capture: false, passive: false });
        this.svg.addEventListener("touchmove", this.rakeTouchMove.bind(this), { capture: false, passive: false });
        this.svg.addEventListener("touchend", this.rakeTouchEnd.bind(this), { capture: false, passive: false });
        this.svg.addEventListener('mousedown', this.rakeMouseDown.bind(this), { capture: false, passive: false });
        this.svg.addEventListener('mousemove', this.rakeMouseMove.bind(this), { capture: false, passive: false });
        this.svg.addEventListener('mouseup', this.rakeMouseUp.bind(this), { capture: false, passive: false });
        window.addEventListener('resize', this.onAfterResize.bind(this));
        this.setModel(layers);
        this.startLoop();
        this.applyZoomPosition();
        this.clearUselessDetails();
    }
    TileLevel.prototype.anchor = function (xx, yy, ww, hh, showZoom, hideZoom) {
        return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [] };
    };
    TileLevel.prototype.rectangle = function (x, y, w, h, rx, ry, css) {
        return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, css: css };
    };
    TileLevel.prototype.actionRectangle = function (action, x, y, w, h, rx, ry, css) {
        return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, css: css, action: action };
    };
    TileLevel.prototype.line = function (x1, y1, x2, y2, css) {
        return { x1: x1, y1: y1, x2: x2, y2: y2, css: css };
    };
    TileLevel.prototype.text = function (x, y, text, css) {
        return { x: x, y: y, text: text, css: css };
    };
    TileLevel.prototype.isLayerStickTop = function (t) {
        return t.stickTop !== undefined;
    };
    TileLevel.prototype.isLayerStickBottom = function (t) {
        return t.stickBottom !== undefined;
    };
    TileLevel.prototype.isLayerStickRight = function (t) {
        return t.stickRight !== undefined;
    };
    TileLevel.prototype.isLayerOverlay = function (t) {
        return t.overlay !== undefined;
    };
    TileLevel.prototype.isTilePath = function (t) {
        return t.points !== undefined;
    };
    TileLevel.prototype.isTileText = function (t) {
        return t.text !== undefined;
    };
    TileLevel.prototype.isTileLine = function (t) {
        return t.x1 !== undefined;
    };
    TileLevel.prototype.isTilePolygon = function (t) {
        return t.dots !== undefined;
    };
    TileLevel.prototype.isLayerStickLeft = function (t) {
        return t.stickLeft !== undefined;
    };
    TileLevel.prototype.isTileRectangle = function (t) {
        return t.h !== undefined;
    };
    TileLevel.prototype.isTileGroup = function (t) {
        return t.content !== undefined;
    };
    TileLevel.prototype.isLayerNormal = function (t) {
        return t.stickLeft === undefined
            && t.stickTop === undefined
            && t.stickBottom === undefined
            && t.stickRight === undefined
            && t.overlay === undefined;
    };
    TileLevel.prototype.rid = function () {
        return 'id' + Math.floor(Math.random() * 1000000000);
    };
    Object.defineProperty(TileLevel.prototype, "translateZ", {
        get: function () {
            return this._translateZ;
        },
        set: function (z) {
            if (z != this._translateZ) {
                //console.log('z',this._translateZ,'=>',z);
                this._translateZ = z;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TileLevel.prototype, "translateX", {
        get: function () {
            return this._translateX;
        },
        set: function (x) {
            if (x != this._translateX) {
                //console.log('x',this._translateX,'=>',x);
                this._translateX = x;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TileLevel.prototype, "translateY", {
        get: function () {
            return this._translateY;
        },
        set: function (y) {
            if (y != this._translateY) {
                //console.log('y',this._translateY,'=>',y);
                this._translateY = y;
            }
        },
        enumerable: true,
        configurable: true
    });
    TileLevel.prototype.dump = function () {
        console.log('dump', this);
    };
    /*
    start(layers: TileModelLayer[]){//layers: TileModelLayer[], innerWidth: number, innerHeight: number, minZoom: number, curZoom: number, maxZoom: number) {
        this.setModel(layers);
        this.startLoop();
        //this.innerWidth = innerWidth;
        //this.innerHeight = innerHeight;
        //this.mx = maxZoom;
        //this.mn = minZoom;
        //this.translateZ = curZoom;
        this.applyZoomPosition();
        this.clearUselessDetails();
        //console.log('start', this);
    }*/
    TileLevel.prototype.setupTapSize = function () {
        var rect = document.createElementNS(this.svgns, 'rect');
        rect.setAttributeNS(null, 'height', '1cm');
        rect.setAttributeNS(null, 'width', '1cm');
        this.svg.appendChild(rect);
        var tbb = rect.getBBox();
        this.tapSize = tbb.width;
        this.svg.removeChild(rect);
        this.clickLimit = this.tapSize / 6;
    };
    TileLevel.prototype.onAfterResize = function () {
        this.onResizeDo.start(333, function () {
            //console.log('resized', this);
            this.viewWidth = this.svg.clientWidth;
            this.viewHeight = this.svg.clientHeight;
            //this.resetModel();
            if (this.afterResizeCallback) {
                this.afterResizeCallback();
            }
            this.applyZoomPosition();
            this.adjustContentPosition();
            this.slideToContentPosition();
        }.bind(this));
    };
    TileLevel.prototype.onMove = function (dx, dy) {
        var d = new Date();
        //console.log('onMove speed', d, d.getMilliseconds(), dx, dy, Math.sqrt(dx * dx + dy * dy));
        this.lastMoveDx = dx;
        this.lastMoveDy = dy;
        this.lastMoveDt = Date.now();
        /*var me=this;
        this.onMoveStop.start(100, function () {
            me.moveTail();
        }.bind(this));*/
    };
    TileLevel.prototype.moveTail = function (speed) {
        //if(speed>1){
        //var speed = Math.sqrt(this.lastMoveDx * this.lastMoveDx + this.lastMoveDy * this.lastMoveDy) / (Date.now() - this.lastMoveDt)
        var dx = this.translateX + 2 * this.tapSize * speed * this.lastMoveDx;
        var dy = this.translateY + 2 * this.tapSize * speed * this.lastMoveDy;
        //console.log('moveTail', speed, 'from', this.translateX, this.translateY, 'to', dx, dy);//Math.sqrt(this.lastMoveDx * this.lastMoveDx + this.lastMoveDy * this.lastMoveDy) / (Date.now() - this.lastMoveDt));
        //this.cancelDragZoom();
        //this.slideToContentPosition();
        //this.allTilesOK = false;
        //var me=this;
        this.startSlideTo(dx, dy, this.translateZ, function () {
            //console.log('done',this.translateX,this.translateY,this.translateZ);
        }.bind(this));
        //}
    };
    TileLevel.prototype.rakeMouseWheel = function (e) {
        //console.log('rakeMouseWheel',e);
        this.slidingLockTo = -1;
        //console.log('rakeMouseWheel',e.wheelDelta,e.detail,e.deltaX,e.deltaY,e.deltaZ,e);
        e.preventDefault();
        //let wheelVal = e.wheelDelta || -e.detail;
        var wheelVal = e.deltaY;
        var min = Math.min(1, wheelVal);
        var delta = Math.max(-1, min);
        var zoom = this.translateZ - delta * (this.translateZ) * 0.077;
        if (zoom < this.minZoom()) {
            zoom = this.minZoom();
        }
        if (zoom > this.maxZoom()) {
            zoom = this.maxZoom();
        }
        this.translateX = this.translateX - (this.translateZ - zoom) * e.offsetX;
        this.translateY = this.translateY - (this.translateZ - zoom) * e.offsetY;
        this.translateZ = zoom;
        this.applyZoomPosition();
        this.adjustContentPosition();
        this.allTilesOK = false;
        return false;
    };
    TileLevel.prototype.rakeMouseDown = function (mouseEvent) {
        this.slidingLockTo = -1;
        //console.log('rakeMouseDown',mouseEvent);
        mouseEvent.preventDefault();
        //this.svg.addEventListener('mousemove', this.rakeMouseMove.bind(this), true);
        //this.svg.addEventListener('mouseup', this.rakeMouseUp.bind(this), false);
        this.mouseDownMode = true;
        this.startMouseScreenX = mouseEvent.offsetX;
        this.startMouseScreenY = mouseEvent.offsetY;
        this.clickX = this.startMouseScreenX;
        this.clickY = this.startMouseScreenY;
        this.clicked = false;
        this.startDragZoom();
    };
    TileLevel.prototype.rakeMouseMove = function (mouseEvent) {
        //console.log('rakeMouseMove',mouseEvent);
        if (this.mouseDownMode) {
            mouseEvent.preventDefault();
            var dX = mouseEvent.offsetX - this.startMouseScreenX;
            var dY = mouseEvent.offsetY - this.startMouseScreenY;
            this.translateX = this.translateX + dX * this.translateZ;
            this.translateY = this.translateY + dY * this.translateZ;
            this.startMouseScreenX = mouseEvent.offsetX;
            this.startMouseScreenY = mouseEvent.offsetY;
            this.applyZoomPosition();
            this.onMove(dX, dY);
        }
    };
    TileLevel.prototype.rakeMouseUp = function (mouseEvent) {
        //console.log('rakeMouseUp',mouseEvent);
        if (this.mouseDownMode) {
            this.mouseDownMode = false;
            mouseEvent.preventDefault();
            //this.svg.removeEventListener('mousemove', this.rakeMouseMove, true);
            //this.svg.removeEventListener('mousemove', this.rakeMouseMove.bind(this));
            this.cancelDragZoom();
            if (Math.abs(this.clickX - mouseEvent.offsetX) < this.clickLimit //
                &&
                    Math.abs(this.clickY - mouseEvent.offsetY) < this.clickLimit) {
                this.clicked = true;
                //this.cancelDragZoom();
                this.slideToContentPosition();
                this.allTilesOK = false;
            }
            else {
                //var speed = Math.sqrt(this.lastMoveDx * this.lastMoveDx + this.lastMoveDy * this.lastMoveDy) / (Date.now() - this.lastMoveDt);
                //if (speed > 1) {
                //this.moveTail(speed);
                //} else {
                //this.cancelDragZoom();
                this.slideToContentPosition();
                this.allTilesOK = false;
                //}
            }
        }
    };
    TileLevel.prototype.rakeTouchStart = function (touchEvent) {
        //console.log('rakeTouchStart',touchEvent.touches.length);
        this.slidingLockTo = -1;
        touchEvent.preventDefault();
        this.startedTouch = true;
        if (touchEvent.touches.length < 2) {
            this.twoZoom = false;
            this.startMouseScreenX = touchEvent.touches[0].clientX;
            this.startMouseScreenY = touchEvent.touches[0].clientY;
            this.clickX = this.startMouseScreenX;
            this.clickY = this.startMouseScreenY;
            this.twodistance = 0;
            this.startDragZoom();
            return;
        }
        else {
            this.startTouchZoom(touchEvent);
        }
        this.clicked = false;
    };
    TileLevel.prototype.rakeTouchMove = function (touchEvent) {
        //console.log('rakeTouchMove',touchEvent.touches.length);
        touchEvent.preventDefault();
        if (this.startedTouch) {
            if (touchEvent.touches.length < 2) {
                if (this.twoZoom) {
                    //
                }
                else {
                    var dX = touchEvent.touches[0].clientX - this.startMouseScreenX;
                    var dY = touchEvent.touches[0].clientY - this.startMouseScreenY;
                    this.translateX = this.translateX + dX * this.translateZ;
                    this.translateY = this.translateY + dY * this.translateZ;
                    this.startMouseScreenX = touchEvent.touches[0].clientX;
                    this.startMouseScreenY = touchEvent.touches[0].clientY;
                    this.applyZoomPosition();
                    this.onMove(dX, dY);
                    return;
                }
            }
            else {
                if (!this.twoZoom) {
                    this.startTouchZoom(touchEvent);
                }
                else {
                    var p1 = this.vectorFromTouch(touchEvent.touches[0]);
                    var p2 = this.vectorFromTouch(touchEvent.touches[1]);
                    var d = this.vectorDistance(p1, p2);
                    if (d <= 0) {
                        d = 1;
                    }
                    var ratio = d / this.twodistance;
                    this.twodistance = d;
                    var zoom = this.translateZ / ratio;
                    if (zoom < this.minZoom()) {
                        zoom = this.minZoom();
                    }
                    if (zoom > this.maxZoom()) {
                        zoom = this.maxZoom();
                    }
                    /*let cX:number = 0;
                    let cY:number = 0;
                    if (this.viewWidth * this.translateZ > this.innerWidth) {
                        cX = (this.viewWidth - this.innerWidth / this.translateZ) / 2;
                    }
                    if (this.viewHeight * this.translateZ > this.innerHeight) {
                        cY = (this.viewHeight - this.innerHeight / this.translateZ) / 2;
                    }*/
                    if (this.viewWidth * this.translateZ < this.innerWidth) {
                        this.translateX = this.translateX - (this.translateZ - zoom) * (this.twocenter.x);
                    }
                    if (this.viewHeight * this.translateZ < this.innerHeight) {
                        this.translateY = this.translateY - (this.translateZ - zoom) * (this.twocenter.y);
                    }
                    this.translateZ = zoom;
                    this.dragZoom = 1.0;
                    this.applyZoomPosition();
                }
            }
        }
    };
    TileLevel.prototype.rakeTouchEnd = function (touchEvent) {
        //console.log('rakeTouchEnd',touchEvent.touches.length);
        touchEvent.preventDefault();
        this.allTilesOK = false;
        if (!this.twoZoom) {
            if (touchEvent.touches.length < 2) {
                this.cancelDragZoom();
                if (this.startedTouch) {
                    if (Math.abs(this.clickX - this.startMouseScreenX) < this.translateZ * this.clickLimit //
                        &&
                            Math.abs(this.clickY - this.startMouseScreenY) < this.translateZ * this.clickLimit) {
                        this.clicked = true;
                        this.slideToContentPosition();
                    }
                    else {
                        //var speed = Math.sqrt(this.lastMoveDx * this.lastMoveDx + this.lastMoveDy * this.lastMoveDy) / (Date.now() - this.lastMoveDt);
                        //if (speed > 1) {
                        //	this.moveTail(speed);
                        //} else {
                        this.slideToContentPosition();
                        //}
                    }
                }
                else {
                    //console.log('touch ended already');
                }
                //this.cancelDragZoom();
                //this.slideToContentPosition();
                return;
            }
        }
        this.twoZoom = false;
        this.startedTouch = false;
        this.cancelDragZoom();
        this.slideToContentPosition();
    };
    TileLevel.prototype.startDragZoom = function () {
        this.dragZoom = 1.002;
        this.applyZoomPosition();
    };
    ;
    TileLevel.prototype.cancelDragZoom = function () {
        this.dragZoom = 1.0;
        this.applyZoomPosition();
    };
    ;
    TileLevel.prototype.applyZoomPosition = function () {
        var rx = -this.translateX - this.dragZoom * this.translateZ * (this.viewWidth - this.viewWidth / this.dragZoom) * (this.clickX / this.viewWidth);
        var ry = -this.translateY - this.dragZoom * this.translateZ * (this.viewHeight - this.viewHeight / this.dragZoom) * (this.clickY / this.viewHeight);
        var rw = this.viewWidth * this.translateZ * this.dragZoom;
        var rh = this.viewHeight * this.translateZ * this.dragZoom;
        this.svg.setAttribute('viewBox', rx + ' ' + ry + ' ' + rw + ' ' + rh);
        if (this.model) {
            for (var k = 0; k < this.model.length; k++) {
                var layer = this.model[k];
                var tx = 0;
                var ty = 0;
                var tz = 1;
                var cX = 0;
                var cY = 0;
                var sX = 0;
                var sY = 0;
                if (this.viewWidth * this.translateZ > this.innerWidth) {
                    cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
                }
                if (this.viewHeight * this.translateZ > this.innerHeight) {
                    cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
                }
                if (this.isLayerOverlay(layer)) {
                    tz = this.translateZ;
                    tx = -this.translateX;
                    ty = -this.translateY;
                    cX = 0;
                    cY = 0;
                }
                else {
                    if (this.isLayerStickLeft(layer)) {
                        tx = -this.translateX;
                        cX = 0;
                        if (layer.stickLeft) {
                            sX = layer.stickLeft * this.tapSize * this.translateZ;
                        }
                    }
                    else {
                        if (this.isLayerStickTop(layer)) {
                            ty = -this.translateY;
                            cY = 0;
                            if (layer.stickTop) {
                                sY = layer.stickTop * this.tapSize * this.translateZ;
                            }
                        }
                        else {
                            if (this.isLayerStickBottom(layer)) {
                                ty = -this.translateY;
                                cY = 0;
                                sY = this.viewHeight * this.translateZ;
                                if (layer.stickBottom) {
                                    sY = this.viewHeight * this.translateZ - layer.stickBottom * this.tapSize;
                                }
                            }
                            else {
                                if (this.isLayerStickRight(layer)) {
                                    tx = -this.translateX;
                                    cX = 0;
                                    sX = this.viewWidth * this.translateZ;
                                    if (layer.stickRight) {
                                        sX = this.viewWidth * this.translateZ - layer.stickRight * this.tapSize;
                                    }
                                }
                            }
                        }
                    }
                }
                layer.g.setAttribute('transform', 'translate(' + (tx + cX + sX) + ',' + (ty + cY + sY) + ') scale(' + tz + ',' + tz + ')');
            }
        }
        this.checkAfterZoom();
    };
    TileLevel.prototype.checkAfterZoom = function () {
        if (this.afterZoomCallback) {
            this.onZoom.start(555, function () {
                //console.log('afterZoom', this);
                this.afterZoomCallback();
            }.bind(this));
        }
    };
    TileLevel.prototype.slideToContentPosition = function () {
        var a = this.calculateValidContentPosition();
        //console.log(a,this.translateX,this.translateY,this.translateZ);
        if (a.x != this.translateX || a.y != this.translateY || a.z != this.translateZ) {
            this.startSlideTo(a.x, a.y, a.z, null);
        }
    };
    TileLevel.prototype.maxZoom = function () {
        return this.mx;
    };
    ;
    TileLevel.prototype.minZoom = function () {
        return this.mn;
    };
    ;
    TileLevel.prototype.adjustContentPosition = function () {
        var a = this.calculateValidContentPosition();
        if (a.x != this.translateX || a.y != this.translateY || a.z != this.translateZ) {
            this.translateX = a.x;
            this.translateY = a.y;
            this.translateZ = a.z;
            this.applyZoomPosition();
        }
    };
    TileLevel.prototype.calculateValidContentPosition = function () {
        var vX = this.translateX;
        var vY = this.translateY;
        var vZ = this.translateZ;
        if (this.translateX > 0) {
            vX = 0;
        }
        else {
            if (this.viewWidth - this.translateX / this.translateZ > this.innerWidth / this.translateZ) {
                if (this.viewWidth * this.translateZ - this.innerWidth <= 0) {
                    vX = this.viewWidth * this.translateZ - this.innerWidth;
                }
                else {
                    vX = 0;
                }
            }
        }
        var upLimit = this.viewHeight * this.translateZ;
        if (this.fastenUp) {
            upLimit = 0;
        }
        if (this.translateY > upLimit) {
            vY = upLimit;
        }
        else {
            if (this.viewHeight - this.translateY / this.translateZ > this.innerHeight / this.translateZ) {
                if (this.viewHeight * this.translateZ - this.innerHeight <= 0) {
                    vY = this.viewHeight * this.translateZ - this.innerHeight;
                    //console.log('to border');
                }
                else {
                    vY = 0;
                    //console.log('to 0');
                }
            }
        }
        if (this.translateZ < this.minZoom()) {
            vZ = this.minZoom();
        }
        else {
            if (this.translateZ > this.maxZoom()) {
                vZ = this.maxZoom();
            }
        }
        //console.log(this.translateX,this.translateY,this.translateZ,vX,vY,vZ);
        return {
            x: vX,
            y: vY,
            z: vZ
        };
    };
    TileLevel.prototype.startTouchZoom = function (touchEvent) {
        this.twoZoom = true;
        var p1 = this.vectorFromTouch(touchEvent.touches[0]);
        var p2 = this.vectorFromTouch(touchEvent.touches[1]);
        this.twocenter = this.vectorFindCenter(p1, p2);
        var d = this.vectorDistance(p1, p2);
        if (d <= 0) {
            d = 1;
        }
        this.twodistance = d;
    };
    TileLevel.prototype.vectorFromTouch = function (touch) {
        return {
            x: touch.clientX,
            y: touch.clientY
        };
    };
    TileLevel.prototype.vectorFindCenter = function (xy1, xy2) {
        var xy = this.vectorAdd(xy1, xy2);
        return this.vectorScale(xy, 0.5);
    };
    ;
    TileLevel.prototype.vectorAdd = function (xy1, xy2) {
        return {
            x: xy1.x + xy2.x,
            y: xy1.y + xy2.y
        };
    };
    ;
    TileLevel.prototype.vectorScale = function (xy, coef) {
        return {
            x: xy.x * coef,
            y: xy.y * coef
        };
    };
    ;
    TileLevel.prototype.vectorDistance = function (xy1, xy2) {
        var xy = this.vectorSubstract(xy1, xy2);
        var n = this.vectorNorm(xy);
        return n;
    };
    TileLevel.prototype.vectorNorm = function (xy) {
        return Math.sqrt(this.vectorNormSquared(xy));
    };
    TileLevel.prototype.vectorSubstract = function (xy1, xy2) {
        return {
            x: xy1.x - xy2.x,
            y: xy1.y - xy2.y
        };
    };
    TileLevel.prototype.vectorNormSquared = function (xy) {
        return xy.x * xy.x + xy.y * xy.y;
    };
    TileLevel.prototype.startSlideCenter = function (x, y, z, w, h, action) {
        var dx = (z * this.viewWidth / this.tapSize - w) / 2;
        var dy = (z * this.viewHeight / this.tapSize - h) / 2;
        this.startSlideTo((dx - x) * this.tapSize, (dy - y) * this.tapSize, z, action);
    };
    TileLevel.prototype.startSlideTo = function (x, y, z, action) {
        this.startStepSlideTo(20, x, y, z, action);
    };
    TileLevel.prototype.startStepSlideTo = function (s, x, y, z, action) {
        clearTimeout(this.slidingID);
        var stepCount = s;
        //let dx: number = (x - this.translateX) / stepCount;
        //let dy: number = (y - this.translateY) / stepCount;
        //let dz: number = (z - this.translateZ) / stepCount;
        var xyz = [];
        for (var i = 0; i < stepCount; i++) {
            /*xyz.push({
                x: this.translateX + dx * i,
                y: this.translateY + dy * i,
                z: this.translateZ + dz * i
            });*/
            xyz.push({
                x: this.translateX + (x - this.translateX) * Math.cos((Math.PI / 2) / (1 + i)),
                y: this.translateY + (y - this.translateY) * Math.cos((Math.PI / 2) / (1 + i)),
                z: this.translateZ + (z - this.translateZ) * Math.cos((Math.PI / 2) / (1 + i))
            });
            //console.log(i,xyz[xyz.length-1]);
        }
        xyz.push({
            x: x,
            y: y,
            z: z
        });
        this.slidingLockTo = Math.random();
        this.stepSlideTo(this.slidingLockTo, xyz, action);
        //console.log('start',new Date());
    };
    TileLevel.prototype.stepSlideTo = function (key, xyz, action) {
        var n = xyz.shift();
        if (n) {
            if (key == this.slidingLockTo) {
                this.translateX = n.x;
                this.translateY = n.y;
                this.translateZ = n.z;
                this.applyZoomPosition();
                var main_1 = this;
                this.slidingID = setTimeout(function () {
                    main_1.stepSlideTo(key, xyz, action);
                }, 30);
            }
            else {
                //console.log('cancel slide');
            }
        }
        else {
            if (action) {
                action();
            }
            this.adjustContentPosition();
            this.allTilesOK = true;
            this.queueTiles();
            //console.log('done',new Date());
        }
    };
    TileLevel.prototype.queueTiles = function () {
        this.clearUselessDetails();
        this.tileFromModel();
    };
    TileLevel.prototype.clearUselessDetails = function () {
        if (this.model) {
            for (var k = 0; k < this.model.length; k++) {
                var group = this.model[k].g;
                this.clearUselessGroups(group, this.model[k]);
            }
        }
    };
    TileLevel.prototype.clearUselessGroups = function (group, layer) {
        var x = -this.translateX;
        var y = -this.translateY;
        var w = this.svg.clientWidth * this.translateZ;
        var h = this.svg.clientHeight * this.translateZ;
        var cX = 0;
        var cY = 0;
        if (this.viewWidth * this.translateZ > this.innerWidth) {
            cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
            x = x - cX;
        }
        if (this.viewHeight * this.translateZ > this.innerHeight) {
            cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
            y = y - cY;
        }
        if (this.isLayerOverlay(layer)) {
            //if (kind == layerModeOverlay) {
            x = 0;
            y = 0;
        }
        else {
            if (this.isLayerStickLeft(layer)) {
                //if (kind == layerModeLockX) {
                x = 0;
            }
            else {
                if (this.isLayerStickTop(layer)) {
                    //if (kind == layerModeLockY) {
                    y = 0;
                }
                else {
                    if (this.isLayerStickRight(layer)) {
                        //if (kind == layerModeStickRight) {
                        x = 0;
                    }
                    else {
                        if (this.isLayerStickBottom(layer)) {
                            //if (kind == layerModeStickBottom) {
                            y = 0;
                        }
                    }
                }
            }
        }
        if (group)
            this.msEdgeHook(group);
        //console.log('this.translateZ',this.translateZ);
        for (var i = 0; i < group.children.length; i++) {
            var child = group.children[i];
            //console.log('check',child.minZoom,child.maxZoom,child);
            if (this.outOfWatch(child, x, y, w, h) || child.minZoom > this.translateZ || child.maxZoom <= this.translateZ) {
                group.removeChild(child);
                i--;
            }
            else {
                if (child.localName == 'g') {
                    this.clearUselessGroups(child, layer);
                }
            }
        }
    };
    TileLevel.prototype.msEdgeHook = function (g) {
        if (g.childNodes && (!(g.children))) {
            g.children = g.childNodes;
        }
    };
    TileLevel.prototype.outOfWatch = function (g, x, y, w, h) {
        var watchX = g.watchX;
        var watchY = g.watchY;
        var watchW = g.watchW;
        var watchH = g.watchH;
        return !(this.collision(watchX, watchY, watchW, watchH, x, y, w, h));
    };
    TileLevel.prototype.collision = function (x1, y1, w1, h1, x2, y2, w2, h2) {
        if (this.collision2(x1, w1, x2, w2) && this.collision2(y1, h1, y2, h2)) {
            return true;
        }
        else {
            return false;
        }
    };
    TileLevel.prototype.collision2 = function (x, w, left, width) {
        if (x + w <= left || x >= left + width) {
            return false;
        }
        else {
            return true;
        }
    };
    TileLevel.prototype.tileFromModel = function () {
        //console.log('tileFromModel',this.model);
        if (this.model) {
            for (var k = 0; k < this.model.length; k++) {
                var svggroup = this.model[k].g;
                var arr = this.model[k].anchors;
                for (var i = 0; i < arr.length; i++) {
                    var a = arr[i];
                    this.addGroupTile(svggroup, a, this.model[k]);
                }
            }
        }
        this.allTilesOK = true;
    };
    TileLevel.prototype.addGroupTile = function (parentSVGElement, anchor, layer) {
        //console.log('addGroupTile',this.translateZ,definitions);
        var x = -this.translateX;
        var y = -this.translateY;
        var w = this.svg.clientWidth * this.translateZ;
        var h = this.svg.clientHeight * this.translateZ;
        var cX = 0;
        var cY = 0;
        if (this.viewWidth * this.translateZ > this.innerWidth) {
            cX = (this.viewWidth * this.translateZ - this.innerWidth) / 2;
            x = x - cX;
        }
        if (this.viewHeight * this.translateZ > this.innerHeight) {
            cY = (this.viewHeight * this.translateZ - this.innerHeight) / 2;
            y = y - cY;
        }
        if (this.isLayerOverlay(layer)) {
            //if (layerKind == layerModeOverlay) {
            x = 0;
            y = 0;
        }
        else {
            if (this.isLayerStickLeft(layer)) {
                //if (layerKind == layerModeLockX) {
                x = 0;
            }
            else {
                if (this.isLayerStickTop(layer)) {
                    //if (layerKind == layerModeLockY) {
                    y = 0;
                }
                else {
                    if (this.isLayerStickRight(layer)) {
                        //if (layerKind == layerModeStickRight) {
                        x = 0;
                    }
                    else {
                        if (this.isLayerStickBottom(layer)) {
                            //if (layerKind == layerModeStickBottom) {
                            y = 0;
                        }
                    }
                }
            }
        }
        //if (definitions.z[0] <= this.translateZ && definitions.z[1] > this.translateZ) {
        if (anchor.showZoom <= this.translateZ && anchor.hideZoom > this.translateZ) {
            //console.log(this.collision(definitions.x * this.tapSize, definitions.y * this.tapSize, definitions.w * this.tapSize, definitions.h * this.tapSize, x, y, w, h));
            if (this.collision(anchor.xx * this.tapSize, anchor.yy * this.tapSize, anchor.ww * this.tapSize, anchor.hh * this.tapSize //
            , x, y, w, h)) {
                var gid = anchor.id ? anchor.id : '';
                //console.log('el',gid,tileGroup);
                var xg = this.childExists(parentSVGElement, gid);
                //console.log('exists',xg);
                if (xg) {
                    //if (isTileGroup(tileGroup)) {
                    //console.log('anchor',anchor);
                    for (var n = 0; n < anchor.content.length; n++) {
                        var d = anchor.content[n];
                        //if (d.draw == 'group') {
                        if (this.isTileGroup(d)) {
                            //console.log(n, d);
                            this.addElement(xg, d, layer);
                        }
                    }
                    //}
                }
                else {
                    var g = document.createElementNS(this.svgns, 'g');
                    //console.log(parentGroup,g);
                    g.id = gid; //tileGroup.id;
                    //let gg = g as any;
                    g.watchX = anchor.xx * this.tapSize;
                    g.watchY = anchor.yy * this.tapSize;
                    g.watchW = anchor.ww * this.tapSize;
                    g.watchH = anchor.hh * this.tapSize;
                    parentSVGElement.appendChild(g);
                    g.minZoom = anchor.showZoom;
                    g.maxZoom = anchor.hideZoom;
                    //if (isTileGroup(tileGroup)) {
                    for (var n = 0; n < anchor.content.length; n++) {
                        var d = anchor.content[n];
                        this.addElement(g, d, layer);
                    }
                    //}
                }
            }
        }
    };
    TileLevel.prototype.childExists = function (group, id) {
        //console.log('childExists',group, id);
        //console.dir(group);
        if (id) {
            if (group)
                this.msEdgeHook(group);
            for (var i = 0; i < group.children.length; i++) {
                var child = group.children[i];
                if (child.id == id) {
                    return child;
                }
            }
        }
        return null;
    };
    TileLevel.prototype.addElement = function (g, d, layer) {
        var element = null;
        //if (d.draw == 'rectangle') {
        if (this.isTileRectangle(d)) {
            //let r=d as TileRectangle;
            element = this.tileRectangle(g, d.x * this.tapSize, d.y * this.tapSize, d.w * this.tapSize, d.h * this.tapSize, (d.rx ? d.rx : 0) * this.tapSize, (d.ry ? d.ry : 0) * this.tapSize, (d.css ? d.css : ''));
        }
        //if (d.draw == 'text') {
        if (this.isTileText(d)) {
            element = this.tileText(g, d.x * this.tapSize, d.y * this.tapSize, d.text, d.css ? d.css : '');
        }
        //if (d.draw == 'path') {
        if (this.isTilePath(d)) {
            element = this.tilePath(g, (d.x ? d.x : 0) * this.tapSize, (d.y ? d.y : 0) * this.tapSize, (d.scale ? d.scale : 0), d.points, d.css ? d.css : '');
        }
        if (this.isTilePolygon(d)) {
            element = this.tilePolygon(g, (d.x ? d.x : 0) * this.tapSize, (d.y ? d.y : 0) * this.tapSize, d.scale, d.dots, d.css);
        }
        //if (d.draw == 'line') {
        if (this.isTileLine(d)) {
            element = this.tileLine(g, d.x1 * this.tapSize, d.y1 * this.tapSize, d.x2 * this.tapSize, d.y2 * this.tapSize, d.css);
        }
        //if (d.draw == 'group') {
        if (this.isTileGroup(d)) {
            this.addGroupTile(g, d, layer);
        }
        if (element) {
            //console.log('add',d.showZoom,d.hideZoom,d,element);
            //element.minZoom = d.showZoom;
            //element.maxZoom = d.hideZoom;
            //console.log('addElement',this.translateZ,d,element);
            if (d.action) {
                //let e:any = element as any;
                //let e:TileSVGElement = element;
                element.onClickFunction = d.action;
                var me_1 = this;
                var click = function () {
                    if (me_1.clicked) {
                        if (element) {
                            //console.log('click',element);
                            if (element.onClickFunction) {
                                var xx = element.getBoundingClientRect().left - me_1.svg.getBoundingClientRect().left;
                                var yy = element.getBoundingClientRect().top - me_1.svg.getBoundingClientRect().top;
                                element.onClickFunction(me_1.translateZ * (me_1.clickX - xx) / me_1.tapSize, me_1.translateZ * (me_1.clickY - yy) / me_1.tapSize);
                            }
                        }
                    }
                };
                element.onclick = click;
                element.ontouchend = click;
            }
        }
    };
    TileLevel.prototype.tilePolygon = function (g, x, y, z, dots, cssClass) {
        var polygon = document.createElementNS(this.svgns, 'polygon');
        var points = '';
        var dlmtr = '';
        for (var i = 0; i < dots.length; i = i + 2) {
            points = points + dlmtr + dots[i] * this.tapSize + ',' + dots[i + 1] * this.tapSize;
            dlmtr = ', ';
        }
        polygon.setAttributeNS(null, 'points', points);
        var t = "";
        if ((x) || (y)) {
            t = 'translate(' + x + ',' + y + ')';
        }
        if (z) {
            t = t + ' scale(' + z + ')';
        }
        if (t.length > 0) {
            polygon.setAttributeNS(null, 'transform', t);
        }
        if (cssClass) {
            polygon.classList.add(cssClass);
        }
        g.appendChild(polygon);
        return polygon;
    };
    TileLevel.prototype.tilePath = function (g, x, y, z, data, cssClass) {
        var path = document.createElementNS(this.svgns, 'path');
        path.setAttributeNS(null, 'd', data);
        var t = "";
        if ((x) || (y)) {
            t = 'translate(' + x + ',' + y + ')';
        }
        if (z) {
            t = t + ' scale(' + z + ')';
        }
        if (t.length > 0) {
            path.setAttributeNS(null, 'transform', t);
        }
        if (cssClass) {
            path.classList.add(cssClass);
        }
        g.appendChild(path);
        return path;
    };
    TileLevel.prototype.tileRectangle = function (g, x, y, w, h, rx, ry, cssClass) {
        var rect = document.createElementNS(this.svgns, 'rect');
        rect.setAttributeNS(null, 'x', '' + x);
        rect.setAttributeNS(null, 'y', '' + y);
        rect.setAttributeNS(null, 'height', '' + h);
        rect.setAttributeNS(null, 'width', '' + w);
        if (rx) {
            rect.setAttributeNS(null, 'rx', '' + rx);
        }
        if (ry) {
            rect.setAttributeNS(null, 'ry', '' + ry);
        }
        if (cssClass) {
            rect.classList.add(cssClass);
        }
        g.appendChild(rect);
        //console.log(cssClass,rect);
        return rect;
    };
    TileLevel.prototype.tileLine = function (g, x1, y1, x2, y2, cssClass) {
        var line = document.createElementNS(this.svgns, 'line');
        line.setAttributeNS(null, 'x1', '' + x1);
        line.setAttributeNS(null, 'y1', '' + y1);
        line.setAttributeNS(null, 'x2', '' + x2);
        line.setAttributeNS(null, 'y2', '' + y2);
        if (cssClass) {
            line.classList.add(cssClass);
        }
        g.appendChild(line);
        return line;
    };
    TileLevel.prototype.tileText = function (g, x, y, html, cssClass) {
        var txt = document.createElementNS(this.svgns, 'text');
        txt.setAttributeNS(null, 'x', '' + x);
        txt.setAttributeNS(null, 'y', '' + y);
        if (cssClass) {
            txt.setAttributeNS(null, 'class', cssClass);
        }
        txt.innerHTML = html;
        g.appendChild(txt);
        //console.log('tileText',g,txt);
        return txt;
    };
    TileLevel.prototype.clearAllDetails = function () {
        if (this.model) {
            for (var i = 0; i < this.model.length; i++) {
                this.clearGroupDetails(this.model[i].g);
            }
        }
    };
    TileLevel.prototype.clearGroupDetails = function (group) {
        if (group)
            this.msEdgeHook(group);
        //console.log(group);
        while (group.children.length) {
            group.removeChild(group.children[0]);
        }
    };
    TileLevel.prototype.autoID = function (definition) {
        if (definition) {
            if (definition.length) {
                for (var i = 0; i < definition.length; i++) {
                    if (!(definition[i].id)) {
                        //definition[i].id = 'id' + Math.floor(Math.random() * 1000000000);
                        definition[i].id = this.rid();
                        //console.log('/',definition[i]);
                    }
                    //let tt:TileGroup|TileDefinition=definition[i];
                    //this.autoID(tt.sub);
                    if (this.isTileGroup(definition[i])) {
                        var group = definition[i];
                        this.autoID(group.content);
                    }
                    //this.autoID(definition[i].sub);
                }
            }
        }
    };
    TileLevel.prototype.setModel = function (layers) {
        for (var i = 0; i < layers.length; i++) {
            this.autoID(layers[i].anchors);
        }
        //console.log(layers);
        this.model = layers;
        this.resetModel();
    };
    TileLevel.prototype.resetModel = function () {
        for (var i = 0; i < this.model.length; i++) {
            this.autoID(this.model[i].anchors);
        }
        this.clearAllDetails();
        this.applyZoomPosition();
        this.adjustContentPosition();
        this.slideToContentPosition();
        this.allTilesOK = false;
    };
    TileLevel.prototype.resetAnchor = function (anchor, svgGroup) {
        var gid = anchor.id ? anchor.id : '';
        var xg = this.childExists(svgGroup, gid);
        if (xg) {
            svgGroup.removeChild(xg);
        }
    };
    TileLevel.prototype.redrawAnchor = function (anchor) {
        //this.autoID([anchor]);
        if (anchor.id) {
            for (var i = 0; i < this.model.length; i++) {
                var layer = this.model[i];
                var svgEl = layer.g;
                if (this.removeFromTree(anchor, svgEl, layer)) {
                    return true;
                }
            }
        }
        return false;
    };
    TileLevel.prototype.removeFromTree = function (anchor, parentSVG, layer) {
        if (parentSVG)
            this.msEdgeHook(parentSVG);
        if (anchor.id) {
            for (var i = 0; i < parentSVG.children.length; i++) {
                var child = parentSVG.children[i];
                if (child.id == anchor.id) {
                    parentSVG.removeChild(child);
                    this.addGroupTile(parentSVG, anchor, layer);
                    return true;
                }
                else {
                    if (child.localName == 'g') {
                        if (this.removeFromTree(anchor, child, layer)) {
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    };
    /*
    startLoop() {
        //console.log('startLoop', this.model);
        let last: number = new Date().getTime();
        let me: TileLevel = this;
        let step: () => void = function () {
            let now = new Date().getTime();
            if (last + 33 < now) {
                if (!(me.valid)) {
                    me.queueTiles();
                }
                last = new Date().getTime();
            }
            window.requestAnimationFrame(step);
        };
        step();
    }*/
    TileLevel.prototype.startLoop = function () {
        this.lastTickTime = new Date().getTime();
        this.tick();
    };
    TileLevel.prototype.tick = function () {
        var now = new Date().getTime();
        if (this.lastTickTime + 33 < now) {
            if (!(this.allTilesOK)) {
                this.queueTiles();
            }
            this.lastTickTime = new Date().getTime();
        }
        window.requestAnimationFrame(this.tick.bind(this));
    };
    return TileLevel;
}());
var DataViewStream = /** @class */ (function () {
    function DataViewStream(dv) {
        this.position = 0;
        this.buffer = dv;
    }
    DataViewStream.prototype.readUint8 = function () {
        var n = this.buffer.getUint8(this.position);
        this.position++;
        return n;
    };
    DataViewStream.prototype.readUint16 = function () {
        var v = this.buffer.getUint16(this.position);
        this.position = this.position + 2;
        return v;
    };
    DataViewStream.prototype.readVarInt = function () {
        var v = 0;
        var i = 0;
        var b;
        while (i < 4) {
            b = this.readUint8();
            if (b & 0x80) {
                v = v + (b & 0x7f);
                v = v << 7;
            }
            else {
                return v + b;
            }
            i++;
        }
        throw new Error('readVarInt ' + i);
    };
    DataViewStream.prototype.readBytes = function (length) {
        var bytes = [];
        for (var i = 0; i < length; i++) {
            bytes.push(this.readUint8());
        }
        return bytes;
    };
    /*pos(): string {
        return '0x' + (this.buffer.byteOffset + this.position).toString(16);
    }*/
    DataViewStream.prototype.offset = function () {
        return this.buffer.byteOffset + this.position;
    };
    DataViewStream.prototype.end = function () {
        return this.position == this.buffer.byteLength;
    };
    return DataViewStream;
}());
var MIDIFileHeader = /** @class */ (function () {
    function MIDIFileHeader(buffer) {
        this.HEADER_LENGTH = 14;
        //ticksPerBeat: number;
        //ticksPerFrame: number;
        this.tempoBPM = 120;
        this.meterCount = 4;
        this.meterDivision = 4;
        this.keyFlatSharp = 0;
        this.keyMajMin = 0;
        this.lastNonZeroQuarter = 0;
        this.datas = new DataView(buffer, 0, this.HEADER_LENGTH);
        this.format = this.datas.getUint16(8);
        this.trackCount = this.datas.getUint16(10);
        //this.ticksPerBeat = this.datas.getUint16(12);
        //this.ticksPerFrame = this.datas.getUint16(12);
    }
    MIDIFileHeader.prototype.getTickResolution = function (tempo) {
        //console.log('getTickResolution', tempo);
        if (tempo) {
            this.lastNonZeroQuarter = tempo;
        }
        else {
            if (this.lastNonZeroQuarter) {
                tempo = this.lastNonZeroQuarter;
            }
            else {
                tempo = 60000000 / this.tempoBPM;
            }
        }
        // Frames per seconds
        if (this.datas.getUint16(12) & 0x8000) {
            var r = 1000000 / (this.getSMPTEFrames() * this.getTicksPerFrame());
            // Ticks per beat
            //console.log('per frame', r);
            return r;
        }
        else {
            // Default MIDI tempo is 120bpm, 500ms per beat
            tempo = tempo || 500000;
            var r = tempo / this.getTicksPerBeat();
            //console.log('per beat', r);
            return r;
        }
    };
    /*getTimeDivision(): number {
        if (this.datas.getUint16(12) & 0x8000) {
            return this.FRAMES_PER_SECONDS;
        }
        return this.TICKS_PER_BEAT;
    }*/
    MIDIFileHeader.prototype.getTicksPerBeat = function () {
        var divisionWord = this.datas.getUint16(12);
        return divisionWord;
    };
    MIDIFileHeader.prototype.getTicksPerFrame = function () {
        var divisionWord = this.datas.getUint16(12);
        return divisionWord & 0x00ff;
    };
    MIDIFileHeader.prototype.getSMPTEFrames = function () {
        var divisionWord = this.datas.getUint16(12);
        var smpteFrames;
        smpteFrames = divisionWord & 0x7f00;
        if (smpteFrames == 29) {
            return 29.97;
        }
        else {
            return smpteFrames;
        }
    };
    return MIDIFileHeader;
}());
var MIDIFileTrack = /** @class */ (function () {
    function MIDIFileTrack(buffer, start) {
        this.HDR_LENGTH = 8;
        this.chords = [];
        this.datas = new DataView(buffer, start, this.HDR_LENGTH);
        this.trackLength = this.datas.getUint32(4);
        /*console.log(String.fromCharCode(this.datas.getUint8(0)));
        console.log(String.fromCharCode(this.datas.getUint8(1)));
        console.log(String.fromCharCode(this.datas.getUint8(2)));
        console.log(String.fromCharCode(this.datas.getUint8(3)));
        console.log(this.trackLength);*/
        this.datas = new DataView(buffer, start, this.HDR_LENGTH + this.trackLength);
        this.trackContent = new DataView(this.datas.buffer, this.datas.byteOffset + this.HDR_LENGTH, this.datas.byteLength - this.HDR_LENGTH);
        this.events = [];
    }
    return MIDIFileTrack;
}());
var MidiParser = /** @class */ (function () {
    function MidiParser(arrayBuffer) {
        this.EVENT_META = 0xff;
        this.EVENT_SYSEX = 0xf0;
        this.EVENT_DIVSYSEX = 0xf7;
        this.EVENT_MIDI = 0x8;
        // Meta event types
        this.EVENT_META_SEQUENCE_NUMBER = 0x00;
        this.EVENT_META_TEXT = 0x01;
        this.EVENT_META_COPYRIGHT_NOTICE = 0x02;
        this.EVENT_META_TRACK_NAME = 0x03;
        this.EVENT_META_INSTRUMENT_NAME = 0x04;
        this.EVENT_META_LYRICS = 0x05;
        this.EVENT_META_MARKER = 0x06;
        this.EVENT_META_CUE_POINT = 0x07;
        this.EVENT_META_MIDI_CHANNEL_PREFIX = 0x20;
        this.EVENT_META_END_OF_TRACK = 0x2f;
        this.EVENT_META_SET_TEMPO = 0x51;
        this.EVENT_META_SMTPE_OFFSET = 0x54;
        this.EVENT_META_TIME_SIGNATURE = 0x58;
        this.EVENT_META_KEY_SIGNATURE = 0x59;
        this.EVENT_META_SEQUENCER_SPECIFIC = 0x7f;
        // MIDI event types
        this.EVENT_MIDI_NOTE_OFF = 0x8;
        this.EVENT_MIDI_NOTE_ON = 0x9;
        this.EVENT_MIDI_NOTE_AFTERTOUCH = 0xa;
        this.EVENT_MIDI_CONTROLLER = 0xb;
        this.EVENT_MIDI_PROGRAM_CHANGE = 0xc;
        this.EVENT_MIDI_CHANNEL_AFTERTOUCH = 0xd;
        this.EVENT_MIDI_PITCH_BEND = 0xe;
        // MIDI event sizes
        //MIDI_1PARAM_EVENTS: number[];
        //MIDI_2PARAMS_EVENTS: number[];
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        /*this.MIDI_1PARAM_EVENTS = [
            this.EVENT_MIDI_PROGRAM_CHANGE,
            this.EVENT_MIDI_CHANNEL_AFTERTOUCH,
        ];
        this.MIDI_2PARAMS_EVENTS = [
            this.EVENT_MIDI_NOTE_OFF,
            this.EVENT_MIDI_NOTE_ON,
            this.EVENT_MIDI_NOTE_AFTERTOUCH,
            this.EVENT_MIDI_CONTROLLER,
            this.EVENT_MIDI_PITCH_BEND,
        ];*/
        this.header = new MIDIFileHeader(arrayBuffer);
        this.parseTracks(arrayBuffer);
    }
    MidiParser.prototype.parseTracks = function (arrayBuffer) {
        var curIndex = this.header.HEADER_LENGTH;
        var trackCount = this.header.trackCount;
        this.tracks = [];
        for (var i = 0; i < trackCount; i++) {
            var track = new MIDIFileTrack(arrayBuffer, curIndex);
            this.tracks.push(track);
            // Updating index to the track end
            curIndex = curIndex + track.trackLength + 8;
        }
        for (var i = 0; i < this.tracks.length; i++) {
            this.parseEvents(this.tracks[i]);
        }
        this.parseNotes();
        this.simplify();
    };
    MidiParser.prototype.toText = function (arr) {
        var r = '';
        for (var i = 0; i < arr.length; i++) {
            r = r + String.fromCharCode(arr[i]);
        }
        return r;
    };
    MidiParser.prototype.findChordBefore = function (when, track, channel) {
        for (var i = 0; i < track.chords.length; i++) {
            var chord = track.chords[track.chords.length - i - 1];
            if (chord.when < when && chord.channel == channel) {
                return chord;
            }
        }
        return null;
    };
    MidiParser.prototype.findOpenedNoteBefore = function (firstPitch, when, track, channel) {
        var before = when;
        var chord = this.findChordBefore(before, track, channel);
        while (chord) {
            for (var i = 0; i < chord.notes.length; i++) {
                var note = chord.notes[i];
                if (!(note.closed)) {
                    if (firstPitch == note.points[0].pitch) {
                        return { chord: chord, note: note };
                    }
                }
            }
            before = chord.when;
            chord = this.findChordBefore(before, track, channel);
        }
        //console.log('no',first,'before',when,'at',trackNo);
        return null;
    };
    MidiParser.prototype.takeChord = function (when, track, channel) {
        for (var i = 0; i < track.chords.length; i++) {
            if (track.chords[i].when == when && track.chords[i].channel == channel) {
                return track.chords[i];
            }
        }
        var ch = {
            when: when,
            channel: channel,
            notes: []
        };
        track.chords.push(ch);
        return ch;
    };
    MidiParser.prototype.takeOpenedNote = function (first, when, track, channel) {
        var chord = this.takeChord(when, track, channel);
        for (var i = 0; i < chord.notes.length; i++) {
            if (!(chord.notes[i].closed)) {
                if (chord.notes[i].points[0].pitch == first) {
                    return chord.notes[i];
                }
            }
        }
        var pi = { closed: false, points: [] };
        pi.points.push({ pointDuration: -1, pitch: first });
        chord.notes.push(pi);
        return pi;
    };
    MidiParser.prototype.distanceToPoint = function (line, point) {
        var m = (line.p2.y - line.p1.y) / (line.p2.x - line.p1.x);
        var b = line.p1.y - (m * line.p1.x);
        var d = [];
        d.push(Math.abs(point.y - (m * point.x) - b) / Math.sqrt(Math.pow(m, 2) + 1));
        d.push(Math.sqrt(Math.pow((point.x - line.p1.x), 2) + Math.pow((point.y - line.p1.y), 2)));
        d.push(Math.sqrt(Math.pow((point.x - line.p2.x), 2) + Math.pow((point.y - line.p2.y), 2)));
        d.sort(function (a, b) {
            return (a - b);
        });
        return d[0];
    };
    ;
    MidiParser.prototype.douglasPeucker = function (points, tolerance) {
        if (points.length <= 2) {
            return [points[0]];
        }
        var returnPoints = [];
        var line = { p1: points[0], p2: points[points.length - 1] };
        var maxDistance = 0;
        var maxDistanceIndex = 0;
        var p;
        for (var i = 1; i <= points.length - 2; i++) {
            var distance = this.distanceToPoint(line, points[i]);
            if (distance > maxDistance) {
                maxDistance = distance;
                maxDistanceIndex = i;
            }
        }
        if (maxDistance >= tolerance) {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(0, maxDistanceIndex + 1), tolerance));
            returnPoints = returnPoints.concat(this.douglasPeucker(points.slice(maxDistanceIndex, points.length), tolerance));
        }
        else {
            p = points[maxDistanceIndex];
            this.distanceToPoint(line, p);
            returnPoints = [points[0]];
        }
        return returnPoints;
    };
    ;
    MidiParser.prototype.simplifyPath = function (points, tolerance) {
        var arr = this.douglasPeucker(points, tolerance);
        arr.push(points[points.length - 1]);
        return arr;
    };
    MidiParser.prototype.simplify = function () {
        for (var t = 0; t < this.tracks.length; t++) {
            var track = this.tracks[t];
            for (var ch = 0; ch < track.chords.length; ch++) {
                var chord = track.chords[ch];
                for (var n = 0; n < chord.notes.length; n++) {
                    var note = chord.notes[n];
                    if (note.points.length > 5) {
                        var xx = 0;
                        var pnts = [];
                        for (var p = 0; p < note.points.length; p++) {
                            note.points[p].pointDuration = Math.max(note.points[p].pointDuration, 0);
                            pnts.push({ x: xx, y: note.points[p].pitch });
                            xx = xx + note.points[p].pointDuration;
                        }
                        pnts.push({ x: xx, y: note.points[note.points.length - 1].pitch });
                        var lessPoints = this.simplifyPath(pnts, 1.5);
                        //console.log(note);
                        //console.log(pnts);
                        //console.log(lessPoints);
                        note.points = [];
                        for (var p = 0; p < lessPoints.length - 1; p++) {
                            var xypoint = lessPoints[p];
                            var xyduration = lessPoints[p + 1].x - xypoint.x;
                            note.points.push({ pointDuration: xyduration, pitch: xypoint.y });
                        }
                    }
                    else {
                        if (note.points.length == 1) {
                            if (note.points[0].pointDuration > 4321) {
                                //console.log(note.points[0].pointDuration,note);
                                note.points[0].pointDuration = 1234;
                            }
                        }
                    }
                }
            }
        }
    };
    MidiParser.prototype.parseNotes = function () {
        for (var t = 0; t < this.tracks.length; t++) {
            var track = this.tracks[t];
            var playTimeTicks = 0;
            var tickResolution = this.header.getTickResolution(0);
            for (var e = 0; e < track.events.length; e++) {
                var evnt = track.events[e];
                var curDelta = 0;
                if (evnt.delta)
                    curDelta = evnt.delta;
                //playTimeTicks = playTimeTicks + curDelta;
                playTimeTicks = playTimeTicks + curDelta * tickResolution / 1000;
                //console.log(playTimeTicks,curDelta,curDelta * tickResolution / 1000);
                if (evnt.basetype === this.EVENT_META) {
                    // tempo change events
                    if (evnt.subtype === this.EVENT_META_SET_TEMPO) {
                        if (evnt.tempo)
                            tickResolution = this.header.getTickResolution(evnt.tempo);
                    }
                }
                evnt.playTime = playTimeTicks;
                //console.log(tickResolution, evnt.playTime, evnt);
            }
            //console.log(t, playTime);
            for (var e = 0; e < track.events.length; e++) {
                var evnt = track.events[e];
                //console.log(t, evnt);
                if (evnt.basetype == this.EVENT_MIDI) {
                    evnt.param1 = evnt.param1 ? evnt.param1 : 0;
                    /*if (evnt.midiChannel == 9) {
                        if (evnt.param1 >= 35 && evnt.param1 <= 81) {
                            if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
                                //this.startDrum(evnt);
                            } else {
                                if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
                                    //this.closeDrum(evnt);
                                }
                            }
                        }
                    } else {*/
                    //console.log(evnt.subtype);
                    if (evnt.subtype == this.EVENT_MIDI_NOTE_ON) {
                        if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                            //this.startNote(evnt);
                            //console.log(evnt);
                            var pitch = evnt.param1 ? evnt.param1 : 0;
                            var when = 0;
                            if (evnt.playTime)
                                when = evnt.playTime;
                            this.takeOpenedNote(pitch, when, track, evnt.midiChannel ? evnt.midiChannel : 0);
                        }
                    }
                    else {
                        if (evnt.subtype == this.EVENT_MIDI_NOTE_OFF) {
                            if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                //this.closeNote(evnt);
                                var pitch = evnt.param1 ? evnt.param1 : 0;
                                var when = 0;
                                if (evnt.playTime)
                                    when = evnt.playTime;
                                var chpi = this.findOpenedNoteBefore(pitch, when, track, evnt.midiChannel ? evnt.midiChannel : 0);
                                if (chpi) {
                                    var duration = 0;
                                    for (var i = 0; i < chpi.note.points.length - 1; i++) {
                                        duration = duration + chpi.note.points[i].pointDuration;
                                    }
                                    chpi.note.points[chpi.note.points.length - 1].pointDuration = when - chpi.chord.when - duration;
                                    chpi.note.closed = true;
                                }
                            }
                        }
                        else {
                            if (evnt.subtype == this.EVENT_MIDI_PROGRAM_CHANGE) {
                                if (evnt.param1 >= 0 && evnt.param1 <= 127) {
                                    //this.setProgram(evnt);
                                    //console.log('setProgram', evnt.param1,evnt.param2,evnt);
                                    track.program = evnt.param1 ? evnt.param1 : 0;
                                    //track.volume = evnt.param2 ? evnt.param2 : 0.001;
                                }
                            }
                            else {
                                if (evnt.subtype == this.EVENT_MIDI_PITCH_BEND) {
                                    //this.bendNote(evnt);
                                    var pitch = evnt.param1 ? evnt.param1 : 0;
                                    var slide = ((evnt.param2 ? evnt.param2 : 0) - 64) / 6;
                                    var when = evnt.playTime ? evnt.playTime : 0;
                                    var chord = this.findChordBefore(when, track, evnt.midiChannel ? evnt.midiChannel : 0);
                                    if (chord) {
                                        for (var i = 0; i < chord.notes.length; i++) {
                                            var note = chord.notes[i];
                                            if (!(note.closed)) {
                                                var duration = 0;
                                                for (var k = 0; k < note.points.length - 1; k++) {
                                                    duration = duration + note.points[k].pointDuration;
                                                }
                                                note.points[note.points.length - 1].pointDuration = when - chord.when - duration;
                                                //console.log('bend',t,note.points[note.points.length - 1].pointDuration, when, chord.when, duration);
                                                var firstpitch = note.points[0].pitch + slide;
                                                var point = {
                                                    pointDuration: -1,
                                                    pitch: firstpitch
                                                };
                                                note.points.push(point);
                                            }
                                        }
                                    }
                                }
                                else {
                                    if (evnt.subtype == this.EVENT_MIDI_CONTROLLER && evnt.param1 == 7) {
                                        //console.log(evnt);
                                        track.volume = evnt.param2 ? evnt.param2 / 127 : 0;
                                    }
                                    else {
                                        //
                                    }
                                }
                            }
                        }
                    }
                    //}
                }
                else {
                    //console.log((evnt.subtype?evnt.subtype:0).toString(16), evnt);
                    if (evnt.subtype == this.EVENT_META_TEXT) {
                        //console.log('EVENT_META_TEXT', this.eventText(evnt), evnt);
                    }
                    if (evnt.subtype == this.EVENT_META_COPYRIGHT_NOTICE) {
                        //console.log('EVENT_META_COPYRIGHT_NOTICE', this.eventText(evnt), evnt);
                    }
                    if (evnt.subtype == this.EVENT_META_TRACK_NAME) {
                        //console.log('EVENT_META_TRACK_NAME', this.eventText(evnt), evnt);
                        //this.setTitle(evnt);
                        //console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
                        track.title = this.toText(evnt.data ? evnt.data : []);
                    }
                    if (evnt.subtype == this.EVENT_META_INSTRUMENT_NAME) {
                        //console.log('EVENT_META_INSTRUMENT_NAME', this.eventText(evnt), evnt);
                        //console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
                        track.instrument = this.toText(evnt.data ? evnt.data : []);
                    }
                    if (evnt.subtype == this.EVENT_META_LYRICS) {
                        //console.log('EVENT_META_LYRICS', this.eventText(evnt), evnt);
                        //console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
                    }
                    if (evnt.subtype == this.EVENT_META_LYRICS) {
                        //console.log('EVENT_META_LYRICS', this.eventText(evnt), evnt);
                        //console.log(t,this.toText(evnt.data?evnt.data:[]), evnt);
                    }
                    if (evnt.subtype == this.EVENT_META_KEY_SIGNATURE) {
                        //console.log(t,'EVENT_META_KEY_SIGNATURE',evnt.key,evnt.scale);
                        var key = evnt.key ? evnt.key : 0;
                        if (key > 127)
                            key = key - 256;
                        this.header.keyFlatSharp = key; //-sharp+flat
                        this.header.keyMajMin = evnt.scale ? evnt.scale : 0; //0-maj, 1 min
                    }
                    if (evnt.subtype == this.EVENT_META_SET_TEMPO) {
                        //console.log(t,'EVENT_META_SET_TEMPO',evnt.tempoBPM);
                        this.header.tempoBPM = evnt.tempoBPM ? evnt.tempoBPM : 120;
                    }
                    if (evnt.subtype == this.EVENT_META_TIME_SIGNATURE) {
                        //console.log(t,'EVENT_META_TIME_SIGNATURE',evnt);
                        this.header.meterCount = evnt.param1 ? evnt.param1 : 4;
                        var dvsn = evnt.param2 ? evnt.param2 : 2;
                        if (dvsn == 1)
                            this.header.meterDivision = 2;
                        else if (dvsn == 2)
                            this.header.meterDivision = 4;
                        else if (dvsn == 3)
                            this.header.meterDivision = 8;
                        else if (dvsn == 4)
                            this.header.meterDivision = 16;
                        else if (dvsn == 5)
                            this.header.meterDivision = 32;
                        //console.log(t,'EVENT_META_TIME_SIGNATURE',this.header.meterCount,this.header.meterDivision,evnt);
                    }
                }
            }
        }
    };
    MidiParser.prototype.nextEvent = function (stream) {
        var index = stream.offset();
        var delta = stream.readVarInt();
        var eventTypeByte = stream.readUint8();
        var event = { offset: index, delta: delta, eventTypeByte: eventTypeByte };
        //track.events.push(event);
        if (0xf0 === (eventTypeByte & 0xf0)) {
            // Meta events
            if (eventTypeByte === this.EVENT_META) {
                event.basetype = this.EVENT_META;
                event.subtype = stream.readUint8();
                event.length = stream.readVarInt();
                switch (event.subtype) {
                    case this.EVENT_META_SEQUENCE_NUMBER:
                        event.msb = stream.readUint8();
                        event.lsb = stream.readUint8();
                        console.log('EVENT_META_SEQUENCE_NUMBER', event);
                        return event;
                    case this.EVENT_META_TEXT:
                    case this.EVENT_META_COPYRIGHT_NOTICE:
                    case this.EVENT_META_TRACK_NAME:
                    case this.EVENT_META_INSTRUMENT_NAME:
                    case this.EVENT_META_LYRICS:
                    case this.EVENT_META_MARKER:
                    case this.EVENT_META_CUE_POINT:
                        event.data = stream.readBytes(event.length);
                        event.text = this.toText(event.data ? event.data : []);
                        //console.log('txt',event);
                        return event;
                    case this.EVENT_META_MIDI_CHANNEL_PREFIX:
                        event.prefix = stream.readUint8();
                        //console.log('EVENT_META_MIDI_CHANNEL_PREFIX',event);
                        return event;
                    case this.EVENT_META_END_OF_TRACK:
                        //console.log('EVENT_META_END_OF_TRACK',event);
                        return event;
                    case this.EVENT_META_SET_TEMPO:
                        event.tempo = (stream.readUint8() << 16) + (stream.readUint8() << 8) + stream.readUint8();
                        event.tempoBPM = 60000000 / event.tempo;
                        //console.log('EVENT_META_SET_TEMPO',event);
                        return event;
                    case this.EVENT_META_SMTPE_OFFSET:
                        event.hour = stream.readUint8();
                        event.minutes = stream.readUint8();
                        event.seconds = stream.readUint8();
                        event.frames = stream.readUint8();
                        event.subframes = stream.readUint8();
                        //console.log('EVENT_META_SMTPE_OFFSET',event);
                        return event;
                    case this.EVENT_META_KEY_SIGNATURE:
                        event.key = stream.readUint8();
                        event.scale = stream.readUint8();
                        //console.log('EVENT_META_KEY_SIGNATURE',event);
                        return event;
                    case this.EVENT_META_TIME_SIGNATURE:
                        event.data = stream.readBytes(event.length);
                        event.param1 = event.data[0];
                        event.param2 = event.data[1];
                        event.param3 = event.data[2];
                        event.param4 = event.data[3];
                        //console.log('EVENT_META_TIME_SIGNATURE',event);
                        return event;
                    case this.EVENT_META_SEQUENCER_SPECIFIC:
                        event.data = stream.readBytes(event.length);
                        //console.log('EVENT_META_SEQUENCER_SPECIFIC',event);
                        return event;
                    default:
                        event.data = stream.readBytes(event.length);
                        //console.log('unknown meta',event);
                        return event;
                }
                // System events
            }
            else {
                if (eventTypeByte === this.EVENT_SYSEX || eventTypeByte === this.EVENT_DIVSYSEX) {
                    event.basetype = eventTypeByte;
                    event.length = stream.readVarInt();
                    event.data = stream.readBytes(event.length);
                    return event;
                    // Unknown event, assuming it's system like event
                }
                else {
                    event.basetype = eventTypeByte;
                    event.badsubtype = stream.readVarInt();
                    event.length = stream.readUint8();
                    event.data = stream.readBytes(event.length);
                    return event;
                }
            }
        }
        else {
            // running status
            if (0 === (eventTypeByte & 0x80)) {
                if (!this.midiEventType) {
                    throw new Error('no pre event' + stream.offset());
                }
                this.midiEventParam1 = eventTypeByte;
            }
            else {
                this.midiEventType = eventTypeByte >> 4;
                this.midiEventChannel = eventTypeByte & 0x0f;
                this.midiEventParam1 = stream.readUint8();
            }
            event.basetype = this.EVENT_MIDI;
            event.subtype = this.midiEventType;
            event.midiChannel = this.midiEventChannel;
            event.param1 = this.midiEventParam1;
            switch (this.midiEventType) {
                case this.EVENT_MIDI_NOTE_OFF:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_NOTE_ON:
                    event.param2 = stream.readUint8();
                    // If velocity is 0, it's a note off event in fact
                    if (!event.param2) {
                        event.subtype = this.EVENT_MIDI_NOTE_OFF;
                        event.param2 = 127; // Find a standard telling what to do here
                    }
                    return event;
                case this.EVENT_MIDI_NOTE_AFTERTOUCH:
                    event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_CONTROLLER:
                    event.param2 = stream.readUint8();
                    if (event.param1 == 7) {
                        //console.log(event);
                    }
                    return event;
                case this.EVENT_MIDI_PROGRAM_CHANGE:
                    //event.param2 = stream.readUint8();
                    return event;
                case this.EVENT_MIDI_CHANNEL_AFTERTOUCH:
                    return event;
                case this.EVENT_MIDI_PITCH_BEND:
                    event.param2 = stream.readUint8();
                    return event;
                default:
                    //console.log('unknown note',event);
                    return event;
            }
        }
        //console.log(stream.position,stream.buffer.byteLength);
    };
    MidiParser.prototype.parseEvents = function (track) {
        var stream = new DataViewStream(track.trackContent);
        this.midiEventType = 0;
        this.midiEventChannel = 0;
        this.midiEventParam1 = 0;
        while (!stream.end()) {
            var e = this.nextEvent(stream);
            track.events.push(e);
        }
    };
    MidiParser.prototype.takeMeasure = function (track, when, bpm, meter) {
        var q = 60 / bpm;
        var duration = 1000 * q * meter * 4;
        var idx = Math.floor(when / duration);
        for (var i = 0; i <= idx; i++) {
            if (track.measures.length < 1 + idx) {
                var m = {
                    duration: duration,
                    chords: []
                };
                track.measures.push(m);
            }
        }
        //console.log(when,track.measures.length,idx);
        return track.measures[idx];
    };
    MidiParser.prototype.takeDrumVoice = function (drum, drumVoices) {
        for (var i = 0; i < drumVoices.length; i++) {
            if (drumVoices[i].drum == drum) {
                return drumVoices[i];
            }
        }
        var voice = {
            chunks: [],
            source: {
                plugin: new ZvoogFilterSourceEmpty(),
                parameters: []
            },
            effects: [],
            title: 'Drum ' + drum
        };
        var drvc = { voice: voice, drum: drum };
        drumVoices.push(drvc);
        return drvc;
    };
    MidiParser.prototype.meter44 = function () {
        return [
            { duration: 384 / 16, power: 3 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 1 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 2 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 1 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 }
        ];
    };
    MidiParser.prototype.meter24 = function () {
        return [
            { duration: 384 / 16, power: 3 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 1 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 }
        ];
    };
    MidiParser.prototype.meter54 = function () {
        return [
            { duration: 384 / 16, power: 3 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 1 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 1 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 1 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 1 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 }
        ];
    };
    MidiParser.prototype.meter34 = function () {
        return [
            { duration: 384 / 16, power: 3 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 1 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 1 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 },
            { duration: 384 / 16, power: 0 }
        ];
    };
    MidiParser.prototype.convert = function () {
        var midisong = this.dump();
        var gridPat = this.meter44();
        if (midisong.meter.count == 2 && midisong.meter.division == 4) {
            gridPat = this.meter24();
        }
        if (midisong.meter.count == 3 && midisong.meter.division == 4) {
            gridPat = this.meter34();
        }
        if (midisong.meter.count == 5 && midisong.meter.division == 4) {
            gridPat = this.meter54();
        }
        var schedule = {
            title: 'import from *.mid',
            description: 'none'
            //, duration: duration
            ,
            tracks: [],
            effects: [],
            macros: [],
            macroPosition: 2,
            masterPosition: 1,
            gridPattern: gridPat,
            keyPattern: [],
            horizontal: true,
            locked: false,
            selectedTrack: 0,
            selectedVoice: 0
        };
        for (var o = 0; o < 10; o++) {
            schedule.keyPattern.push(3);
            schedule.keyPattern.push(2);
            schedule.keyPattern.push(1);
            schedule.keyPattern.push(2);
            schedule.keyPattern.push(1);
            schedule.keyPattern.push(1);
            schedule.keyPattern.push(2);
            schedule.keyPattern.push(1);
            schedule.keyPattern.push(2);
            schedule.keyPattern.push(1);
            schedule.keyPattern.push(2);
            schedule.keyPattern.push(1);
        }
        for (var i = 0; i < midisong.tracks.length; i++) {
            var miditrack = midisong.tracks[i];
            var track = {
                voices: [],
                effects: [],
                title: 'track ' + i + ' ' + miditrack.title,
                strings: []
            };
            var voice = {
                chunks: [],
                source: {
                    plugin: new ZvoogFilterSourceEmpty(),
                    parameters: []
                },
                effects: [],
                title: 'MIDI ' + miditrack.program
            };
            var time = 0;
            for (var m = 0; m < miditrack.measures.length; m++) {
                var measure = miditrack.measures[m];
                var chunk = {
                    meter: {
                        count: midisong.meter.count,
                        division: midisong.meter.division
                    },
                    tempo: Math.round(midisong.bpm),
                    chords: [],
                    title: 'start at ' + time,
                    clefHint: 0,
                    keyHint: 0
                };
                for (var c = 0; c < measure.chords.length; c++) {
                    var midichord = measure.chords[c];
                    var chordtime = midichord.when - time;
                    //console.log(midichord.when - time,time2Duration(chordtime/1000, midisong.bpm))
                    var zvoogchord = {
                        //when: chordtime
                        when: time2Duration(chordtime / 1000, midisong.bpm),
                        values: [],
                        title: '',
                        fretHint: [],
                        text: ''
                    };
                    if (midichord.channel != 9) {
                        for (var n = 0; n < midichord.notes.length; n++) {
                            //console.log(m,n,midichord.when);
                            var midinote = midichord.notes[n];
                            var zvoogkey = {
                                envelope: [],
                                stepHint: 0,
                                shiftHint: 0,
                                octaveHint: 0
                            };
                            zvoogchord.values.push(zvoogkey);
                            //if(midinote.points.length>5)console.log(midichord,midinote);
                            for (var p = 0; p < midinote.points.length; p++) {
                                var point = midinote.points[p];
                                //if(midinote.points.length>5)console.log(p,point.pitch,point.duration);
                                var zvoogPitch = {
                                    duration: time2Duration(point.duration / 1000, midisong.bpm),
                                    pitch: point.pitch
                                };
                                zvoogkey.envelope.push(zvoogPitch);
                            }
                        }
                    }
                    chunk.chords.push(zvoogchord);
                }
                voice.chunks.push(chunk);
                time = time + measure.duration;
            }
            track.voices.push(voice);
            //for(var t=0;t<midisong.tracks.length;t++){
            //var miditrack:SongTrack=midisong.tracks[t];
            var fordrum = [];
            for (var m = 0; m < miditrack.measures.length; m++) {
                var measure = miditrack.measures[m];
                for (var c = 0; c < measure.chords.length; c++) {
                    var chord = measure.chords[c];
                    if (chord.channel == 9) {
                        //console.log(i, m, chord);
                        for (var n = 0; n < chord.notes.length; n++) {
                            var note = chord.notes[n];
                            for (var p = 0; p < note.points.length; p++) {
                                var point = note.points[p];
                                this.takeDrumVoice(point.pitch, fordrum);
                            }
                        }
                    }
                }
            }
            for (var d = 0; d < fordrum.length; d++) {
                var zvoice = fordrum[d].voice;
                track.voices.push(zvoice);
                //console.log(fordrum[d].voice);
                var time = 0;
                for (var m = 0; m < miditrack.measures.length; m++) {
                    var measure = miditrack.measures[m];
                    var chunk = {
                        meter: {
                            count: midisong.meter.count,
                            division: midisong.meter.division
                        },
                        tempo: Math.round(midisong.bpm),
                        chords: [],
                        title: 'start at ' + time,
                        clefHint: 0,
                        keyHint: 0
                    };
                    zvoice.chunks.push(chunk);
                    for (var c = 0; c < measure.chords.length; c++) {
                        var midichord_1 = measure.chords[c];
                        if (midichord_1.channel == 9) {
                            var chordtime = midichord_1.when - time;
                            var zvoogchord = {
                                when: time2Duration(chordtime / 1000, midisong.bpm),
                                values: [],
                                title: '',
                                fretHint: [],
                                text: ''
                            };
                            for (var n = 0; n < midichord_1.notes.length; n++) {
                                var midinote = midichord_1.notes[n];
                                var point = midinote.points[0];
                                if (point.pitch == fordrum[d].drum) {
                                    var zvoogkey = {
                                        envelope: [],
                                        stepHint: 0,
                                        shiftHint: 0,
                                        octaveHint: 0
                                    };
                                    var zvoogPitch = {
                                        duration: time2Duration(point.duration / 1000, midisong.bpm),
                                        pitch: point.pitch
                                    };
                                    zvoogkey.envelope.push(zvoogPitch);
                                    zvoogchord.values.push(zvoogkey);
                                }
                            }
                            if (zvoogchord.values.length) {
                                chunk.chords.push(zvoogchord);
                            }
                        }
                    }
                    time = time + measure.duration;
                }
            }
            //}
            schedule.tracks.push(track);
        }
        return schedule;
    };
    MidiParser.prototype.dump = function () {
        var a = {
            parser: '1.01',
            duration: 0,
            bpm: this.header.tempoBPM,
            key: this.header.keyFlatSharp,
            mode: this.header.keyMajMin,
            meter: { count: this.header.meterCount, division: this.header.meterDivision },
            tracks: [],
            speedMode: 0,
            lineMode: 0
        };
        for (var i = 0; i < this.tracks.length; i++) {
            var miditrack = this.tracks[i];
            var tr = { order: i, title: miditrack.title ? miditrack.title : '', volume: miditrack.volume ? miditrack.volume : 1, program: miditrack.program ? miditrack.program : 0, measures: [] };
            for (var ch = 0; ch < miditrack.chords.length; ch++) {
                var midichord = miditrack.chords[ch];
                var newchord = { when: midichord.when, notes: [], channel: midichord.channel };
                var measure = this.takeMeasure(tr, midichord.when, this.header.tempoBPM, this.header.meterCount / this.header.meterDivision);
                //tr.chords.push(newchord);
                measure.chords.push(newchord);
                for (var n = 0; n < midichord.notes.length; n++) {
                    var midinote = midichord.notes[n];
                    var newnote = { points: [] };
                    newchord.notes.push(newnote);
                    for (var v = 0; v < midinote.points.length; v++) {
                        var midipoint = midinote.points[v];
                        var newpoint = { pitch: midipoint.pitch, duration: midipoint.pointDuration };
                        newnote.points.push(newpoint);
                    }
                }
            }
            if (tr.measures.length > 0) {
                a.tracks.push(tr);
                var d = tr.measures.length * tr.measures[0].duration;
                if (a.duration < d)
                    a.duration = d;
            }
        }
        //console.log(this);
        //console.log(a);
        return a;
    };
    return MidiParser;
}());
console.log('ZvoogApp v1.01');
var ZvoogApp = /** @class */ (function () {
    function ZvoogApp() {
        this.minZoom = 1;
        this.maxZoom = 1024;
        this.menuStyleWidth = '7cm';
        this.gridIndentUp = 256;
        this.gridIndentDown = 10;
        this.gridIndentLeft = 10;
        this.gridIndentRight = 10;
        this.lengthOfSecond = 50;
        this.noteLineWidth = 3;
        this.undoRedo = new ZvoogUndoRedo(this);
        this.lang = new ZvoogLang();
        this.popup = new ZvoogPopup(this);
        console.log('ZvoogApp init');
    }
    ZvoogApp.prototype.start = function () {
        console.log('ZvoogApp start');
        var testSong = new TestSong();
        this.currentSong = testSong.createRandomSchedule();
        //console.log(this.currentSong);
        var menuDiv = document.getElementById('mainMenuDiv');
        if (menuDiv) {
            menuDiv.addEventListener("touchstart", this.preventTouch.bind(this), { capture: true, passive: false });
            menuDiv.addEventListener("touchmove", this.preventTouch.bind(this), { capture: true, passive: false });
            menuDiv.addEventListener("touchend", this.preventTouch.bind(this), { capture: true, passive: false });
        }
        var layers = this.createLayers();
        this.tileLevel = new TileLevel(document.getElementById('contentSVG'), 100, 100, this.minZoom, 20, this.maxZoom - 0.001, layers);
        this.tileLevel.afterResizeCallback = this.afterResizeCallback.bind(this);
        this.tileLevel.afterZoomCallback = this.afterZoomCallback.bind(this);
        this.resetWholeProject();
        var filesinput = document.getElementById('filesinput');
        if (filesinput)
            filesinput.addEventListener('change', this.handleFileSelect.bind(this), false);
    };
    ZvoogApp.prototype.preventTouch = function (touchEvent) {
        if (touchEvent.touches.length > 1) {
            touchEvent.preventDefault();
        }
    };
    ZvoogApp.prototype.handleFileSelect = function (event) {
        var file = event.target.files[0];
        var fileReader = new FileReader();
        var me = this;
        fileReader.onload = function (progressEvent) {
            if (progressEvent.target) {
                var arrayBuffer = progressEvent.target.result;
                me.parseMIDI(arrayBuffer);
            }
        };
        fileReader.readAsArrayBuffer(file);
    };
    ZvoogApp.prototype.parseMIDI = function (arrayBuffer) {
        var midiParser = new MidiParser(arrayBuffer);
        console.log(midiParser.dump());
        this.currentSong = midiParser.convert();
        this.resetWholeProject();
    };
    ZvoogApp.prototype.afterResizeCallback = function () {
        this.resetWholeProject();
    };
    ZvoogApp.prototype.afterZoomCallback = function () {
        console.log(this.tileLevel.translateX, this.tileLevel.translateY, this.tileLevel.translateZ);
    };
    ZvoogApp.prototype.addMainTextButton = function (x, y, size, text, sizecss, content, action) {
        content.push({ x: x, y: y, w: size, h: size, rx: 0.5 * size, ry: 0.5 * size, css: 'fillButtonSpot', action: action.bind(this) });
        content.push({ x: x + 0.3 * size, y: y + 0.8 * size, css: sizecss + ' fillColorContent', text: text });
        content.push({ x: x, y: y, w: size, h: size, css: 'fillButtonActionPoint', action: action.bind(this) });
    };
    ZvoogApp.prototype.addBlockedTextButton = function (x, y, size, text, sizecss, content) {
        content.push({ x: x, y: y, w: size, h: size, rx: 0.5 * size, ry: 0.5 * size, css: 'fillButtonSpot' });
        content.push({ x: x + 0.3 * size, y: y + 0.8 * size, css: sizecss + ' fillColorSub', text: text });
    };
    ZvoogApp.prototype.resetButtons = function () {
        this.workButtonsGroup.content.length = 0;
        this.overButtonsAnchor.content.length = 0;
        this.addMainTextButton(0, 0, 32, 'import', 'fontSize16', this.workButtonsGroup.content, this.importTestMIDI);
        this.addMainTextButton(32, 32, 128, this.currentSong.title, 'fontSize128', this.workButtonsGroup.content, this.promptTitle);
        this.addMainTextButton(256, 224, 32, this.currentSong.description, 'fontSize16', this.workButtonsGroup.content, this.promptDescription);
        if (this.currentSong.macros.length > 0 && this.currentSong.macroPosition < this.currentSong.macros.length) {
            this.addMainTextButton(this.tileLevel.viewWidth / this.tileLevel.tapSize - 1.5, 0.5, 1, this.lang.label('redo'), 'fontSize05', this.overButtonsAnchor.content, this.clickRedo);
        }
        else {
            this.addBlockedTextButton(this.tileLevel.viewWidth / this.tileLevel.tapSize - 1.5, 0.5, 1, this.lang.label('redo'), 'fontSize05', this.overButtonsAnchor.content);
        }
        if (this.currentSong.macros.length > 0 && this.currentSong.macroPosition > 0) {
            this.addMainTextButton(this.tileLevel.viewWidth / this.tileLevel.tapSize - 3, 0.5, 1, this.lang.label('undo'), 'fontSize05', this.overButtonsAnchor.content, this.clickUndo);
        }
        else {
            this.addBlockedTextButton(this.tileLevel.viewWidth / this.tileLevel.tapSize - 3, 0.5, 1, this.lang.label('undo'), 'fontSize05', this.overButtonsAnchor.content);
        }
        this.addMainTextButton(this.tileLevel.viewWidth / this.tileLevel.tapSize - 1.5, this.tileLevel.viewHeight / this.tileLevel.tapSize - 1.5, 1, this.lang.label('menu'), 'fontSize05', this.overButtonsAnchor.content, this.openLayersMenu);
    };
    ZvoogApp.prototype.importTestMIDI = function () {
        console.log('importTestMIDI');
        var filesinput = document.getElementById('filesinput');
        if (filesinput)
            filesinput.click();
    };
    ZvoogApp.prototype.createMoveUpVoice = function (t, v) {
        var me = this;
        return function () {
            //me.closeLayersMenu();
            //me.undoRedo.addRedo({ key: undoRedoMoveVoice, point: me.uiTapPosition(), properties: { oldTrackPosition: t, newTrackPosition: 0, oldVoicePosition: v, newVoicePosition: 0 } });
            me.undoRedo.addRedo({
                key: undoRedoMoveVoice, point: me.uiTapPosition(), properties: {
                    oldTrackPosition: me.currentSong.selectedTrack,
                    newTrackPosition: t,
                    oldVoicePosition: me.currentSong.selectedVoice,
                    newVoicePosition: v
                }
            });
            me.openLayersMenu();
        };
    };
    ZvoogApp.prototype.createMoveUpTrack = function (t) {
        var me = this;
        return function () {
            //me.closeLayersMenu();
            //me.undoRedo.addRedo({ key: undoRedoMoveTrack, point: me.uiTapPosition(), properties: { oldTrackPosition: t, newTrackPosition: 0 } });
            me.undoRedo.addRedo({
                key: undoRedoMoveTrack, point: me.uiTapPosition(), properties: {
                    oldTrackPosition: me.currentSong.selectedTrack,
                    newTrackPosition: t,
                    oldVoicePosition: me.currentSong.selectedVoice,
                    newVoicePosition: 0
                }
            });
            me.openLayersMenu();
        };
    };
    ZvoogApp.prototype.promptTitle = function () {
        var result = window.prompt('Title', this.currentSong.title);
        if ((result) && result != this.currentSong.title) {
            this.undoRedo.addRedo({ key: undoRedoChangeProjectTitle, point: this.uiTapPosition(), properties: { newTitle: result, oldTitle: this.currentSong.title } });
        }
    };
    ZvoogApp.prototype.promptDescription = function () {
        var result = window.prompt('Description', this.currentSong.title);
        if ((result) && result != this.currentSong.description) {
            this.undoRedo.addRedo({ key: undoRedoChangeProjectDescription, point: this.uiTapPosition(), properties: { newDescription: result, oldDescription: this.currentSong.description } });
        }
    };
    ZvoogApp.prototype.uiTapPosition = function () {
        return { x: -this.tileLevel.translateX / this.tileLevel.tapSize, y: -this.tileLevel.translateY / this.tileLevel.tapSize, z: this.tileLevel.translateZ };
    };
    ZvoogApp.prototype.clickRedo = function () {
        var xyz = this.undoRedo.doRedo();
        if (xyz) {
            this.tileLevel.startSlideTo(-xyz.x * this.tileLevel.tapSize, -xyz.y * this.tileLevel.tapSize, xyz.z, null);
        }
    };
    ZvoogApp.prototype.openLayersMenu = function () {
        var _this = this;
        console.log(this.currentSong);
        var items = [];
        for (var t = 0; t < this.currentSong.tracks.length; t++) {
            var track = this.currentSong.tracks[t];
            if (t == this.currentSong.selectedTrack) {
                items.push({ label: track.title, power: 0, subpadding: false, action: function () { return console.log('skip track'); } });
                for (var v = 0; v < track.voices.length; v++) {
                    var voice = track.voices[v];
                    if (v == this.currentSong.selectedVoice) {
                        items.push({ label: voice.title, power: 2, subpadding: true, action: function () { return console.log('skip voice'); } });
                    }
                    else {
                        items.push({ label: voice.title, power: 1, subpadding: true, action: this.createMoveUpVoice(t, v) });
                    }
                }
            }
            else {
                items.push({ label: track.title, power: 0, subpadding: false, action: this.createMoveUpTrack(t) });
            }
        }
        var mainMenuDiv = document.getElementById('mainMenuDiv');
        if (mainMenuDiv && mainMenuDiv.style.width == this.menuStyleWidth) {
            this.closeLayersMenu();
            setTimeout(function () { _this.showLayersMenu(items); }, 200);
        }
        else {
            this.showLayersMenu(items);
        }
    };
    ZvoogApp.prototype.showLayersMenu = function (items) {
        console.log('showLayersMenu');
        var o = document.getElementById('menuItemRows');
        if (o) {
            while (o.children.length)
                o.removeChild(o.children[0]);
            for (var i = 0; i < items.length; i++) {
                var row = document.createElement('div');
                if (items[i].power == 1) {
                    if (items[i].subpadding) {
                        row.classList.add('subMenuSelected1');
                    }
                    else {
                        row.classList.add('mainMenuSelected1');
                    }
                }
                else {
                    if (items[i].power == 2) {
                        if (items[i].subpadding) {
                            row.classList.add('subMenuSelected2');
                        }
                        else {
                            row.classList.add('mainMenuSelected2');
                        }
                    }
                    else {
                        if (items[i].subpadding) {
                            row.classList.add('subMenuButtonRow');
                        }
                        else {
                            row.classList.add('mainMenuButtonRow');
                        }
                    }
                }
                row.innerText = items[i].label;
                var a = items[i].action;
                row.onclick = items[i].action;
                o.appendChild(row);
            }
            var row = document.createElement('div');
            row.innerHTML = '&nbsp;';
            row.classList.add('mainMenuButtonRow');
            o.appendChild(row);
            row = document.createElement('div');
            row.innerHTML = '&nbsp;';
            row.classList.add('mainMenuButtonRow');
            o.appendChild(row);
            o.scrollTop = 0;
        }
        var menuTitleText = document.getElementById('menuTitleText');
        if (menuTitleText)
            menuTitleText.style.width = menuTitleText.innerText = this.lang.label('layersMenuTitle');
        var mainMenuDiv = document.getElementById('mainMenuDiv');
        if (mainMenuDiv)
            mainMenuDiv.style.width = this.menuStyleWidth;
    };
    ZvoogApp.prototype.closeLayersMenu = function () {
        console.log('closeLayersMenu');
        document.getElementById('mainMenuDiv').style.width = '0cm';
    };
    ZvoogApp.prototype.clickUndo = function () {
        var xyz = this.undoRedo.doUndo();
        if (xyz) {
            this.tileLevel.startSlideTo(-xyz.x * this.tileLevel.tapSize, -xyz.y * this.tileLevel.tapSize, xyz.z, null);
        }
    };
    ZvoogApp.prototype.resetNotes = function () {
        this.firstAnchor.content.length = 0;
        this.secondAnchor.content.length = 0;
        this.otherAnchor.content.length = 0;
        for (var t = 0; t < this.currentSong.tracks.length; t++) {
            var track = this.currentSong.tracks[t];
            for (var v = 0; v < track.voices.length; v++) {
                var voice = track.voices[v];
                var nextMeasureX = 0;
                for (var i = 0; i < voice.chunks.length; i++) {
                    var chunk = voice.chunks[i];
                    //console.log('track', t, 'voice', v, 'chunk', i);
                    var chunkAnchor = this.tileLevel.anchor(this.gridIndentLeft + nextMeasureX, this.gridIndentUp, this.patternDuration(chunk) * this.lengthOfSecond * 4, 120 * this.noteLineWidth, this.minZoom, this.maxZoom);
                    /*chunkAnchor.content.push(this.tileLevel.rectangle(this.gridIndentLeft + nextMeasureX
                        , this.gridIndentUp
                        , this.patternDuration(chunk) * this.lengthOfSecond
                        , 120 * this.noteLineWidth
                        , 0, 0
                        , 'debug'));*/
                    if (t == this.currentSong.selectedTrack && v == this.currentSong.selectedVoice) {
                        this.firstAnchor.content.push(chunkAnchor);
                        this.addChordNotes(chunkAnchor, nextMeasureX, chunk, 'firstLine');
                    }
                    else {
                        if (t == this.currentSong.selectedTrack && v != this.currentSong.selectedVoice) {
                            this.secondAnchor.content.push(chunkAnchor);
                            this.addChordNotes(chunkAnchor, nextMeasureX, chunk, 'secondLine');
                        }
                        else {
                            this.otherAnchor.content.push(chunkAnchor);
                            this.addChordNotes(chunkAnchor, nextMeasureX, chunk, 'otherLine');
                        }
                    }
                    nextMeasureX = nextMeasureX + this.patternDuration(chunk) * this.lengthOfSecond;
                    //if (i > -10) break;
                }
            }
        }
    };
    ZvoogApp.prototype.addChordNotes = function (chunkAnchor, nextMeasureX, chunk, css) {
        for (var ch = 0; ch < chunk.chords.length; ch++) {
            var chord = chunk.chords[ch];
            //console.log(chord);
            for (var n = 0; n < chord.values.length; n++) {
                var key = chord.values[n];
                this.addNoteLine(chunkAnchor, nextMeasureX, chunk, chord, key, css);
            }
        }
    };
    ZvoogApp.prototype.addNoteLine = function (anchor, nextMeasureX, chunk, chord, key, css) {
        var chordX = this.gridIndentLeft + nextMeasureX + duration2time(chunk.tempo, chord.when) * this.lengthOfSecond;
        var noteY = this.gridIndentUp + (120 - 0.5 - key.envelope[0].pitch) * this.noteLineWidth;
        var noteX = chordX;
        for (var i = 0; i < key.envelope.length; i++) {
            var iWidth = duration2time(chunk.tempo, key.envelope[i].duration) * this.lengthOfSecond;
            /*if (key.envelope.length > 5) {
                console.log(i, noteWidth);
            }*/
            var slide = 0;
            if (key.envelope.length > i + 1) {
                //console.log(key);
                slide = key.envelope[i].pitch - key.envelope[i + 1].pitch;
            }
            var dx = 0;
            if (i > 0) {
                dx = this.noteLineWidth;
                //console.log(i,key.envelope[i],iWidth);
            }
            /*anchor.content.push(this.tileLevel.line(
                noteX + 0.5 * this.noteLineWidth - dx
                , noteY
                , noteX + noteWidth - 0.5 * this.noteLineWidth
                , noteY + slide * this.noteLineWidth
                , css));*/
            anchor.content.push(this.tileLevel.line(noteX + 0.5 * this.noteLineWidth - dx, noteY, noteX + iWidth - 0.5 * this.noteLineWidth, noteY + slide * this.noteLineWidth, css));
            //anchor.content.push(this.tileLevel.text(noteX + 0.5 * this.noteLineWidth, noteY, '.' + i, 'fontSize2 debug'));
            noteY = noteY + slide * this.noteLineWidth;
            noteX = noteX + iWidth; // - 0.5 * this.noteLineWidth;
        }
    };
    ZvoogApp.prototype.resetGrid = function () {
        //this.gridAnchor.content.length = 0;
        this.keyZoomAnchor.content.length = 0;
        this.keyWholeAnchor.content.length = 0;
        this.meterPatternAnchor.content.length = 0;
        /*this.backgroundAnchor.content.length = 0;


        this.backgroundAnchor.content.push({
            x: 0
            , y: 0
            , w: this.gridIndentLeft + this.wholeDuration(this.currentSong) * this.lengthOfSecond + this.gridIndentRight
            , h: this.gridIndentUp + 120 * this.noteLineWidth + this.gridIndentDown
            , rx: 32
            , ry: 32
            , css: 'fillBack'
        });*/
        var nextMeasureX = 0;
        if (this.currentSong.tracks.length > this.currentSong.selectedTrack) {
            var track = this.currentSong.tracks[this.currentSong.selectedTrack];
            if (track.voices.length > this.currentSong.selectedVoice) {
                var voice = track.voices[this.currentSong.selectedVoice];
                //console.log(track.title, voice);
                //var tempo = 0;
                //var count = 0;
                //var division = 0;
                for (var i = 0; i < voice.chunks.length; i++) {
                    var chunk = voice.chunks[i];
                    var measureAnchor = {
                        xx: this.gridIndentLeft + nextMeasureX,
                        yy: this.gridIndentUp,
                        ww: this.patternDuration(chunk) * this.lengthOfSecond,
                        hh: 120 * this.noteLineWidth,
                        showZoom: this.minZoom,
                        hideZoom: 25,
                        content: []
                    };
                    this.meterPatternAnchor.content.push(measureAnchor);
                    /*var firstChunkAnchor: TileAnchor = {
                        xx: this.gridIndentLeft + nextMeasureX
                        , yy: this.gridIndentUp
                        , ww: this.patternDuration(chunk) * this.lengthOfSecond
                        , hh: 120 * this.noteLineWidth
                        , showZoom: this.minZoom
                        , hideZoom: 25
                        , content: []
                    };
                    this.firstAnchor.content.push(firstChunkAnchor);
                    for (var ch = 0; ch < chunk.chords.length; ch++) {
                        var chord: ZvoogChord = chunk.chords[ch];
                        for (var v = 0; v < chord.values.length; v++) {
                            var key: ZvoogKey = chord.values[v];
                            this.addNoteLine(firstChunkAnchor, nextMeasureX, chunk, chord, key,'firstLine');
                        }
                    }*/
                    var idx = 0;
                    var gduration = 0;
                    //if(i==0)
                    while (gduration < duration384(chunk.meter) && idx < this.currentSong.gridPattern.length) {
                        var step = this.currentSong.gridPattern[idx];
                        var sx = duration2time(chunk.tempo, gduration) * this.lengthOfSecond;
                        var thick = 0.05;
                        if (step.power > 0) {
                            thick = 0.1;
                        }
                        if (step.power > 1) {
                            thick = 0.3;
                        }
                        if (step.power > 2) {
                            thick = 0.7;
                        }
                        if (gduration > 0 || i > 0) {
                            measureAnchor.content.push({
                                x: this.gridIndentLeft + nextMeasureX + sx,
                                y: this.gridIndentUp, w: thick, h: 120 * this.noteLineWidth, css: 'meterLine'
                            });
                            //console.log('add',i,gduration,thick);
                        } //else{
                        //console.log('skip',i,gduration,thick);
                        //}
                        gduration = gduration + step.duration;
                        idx++;
                        if (idx > this.currentSong.gridPattern.length) {
                            idx = 0;
                        }
                    }
                    nextMeasureX = nextMeasureX + this.patternDuration(chunk) * this.lengthOfSecond;
                }
            }
        }
        this.keyZoomAnchor.ww = nextMeasureX;
        this.keyWholeAnchor.ww = nextMeasureX;
        for (var k = 0; k < 120; k++) {
            if (this.currentSong.keyPattern[k]) {
                var css = 'keyFillWhite';
                if (this.currentSong.keyPattern[k] > 1) {
                    css = 'keyFillBlack';
                }
                if (this.currentSong.keyPattern[k] > 2) {
                    css = 'keyFillWhite';
                }
                this.keyZoomAnchor.content.push({
                    x: this.gridIndentLeft, y: this.gridIndentUp + (120 - k - 1) * this.noteLineWidth,
                    w: nextMeasureX, h: 0.9 * this.noteLineWidth, css: css
                });
                if (k > 0) {
                    if (this.currentSong.keyPattern[k] > 2) {
                        this.keyZoomAnchor.content.push({
                            x: this.gridIndentLeft, y: this.gridIndentUp + (120 - k - 0.05) * this.noteLineWidth,
                            w: nextMeasureX, h: 0.1 * this.noteLineWidth, css: 'meterLine'
                        });
                    }
                }
            }
        }
        for (var k = 0; k < 10; k++) {
            var css = 'keyFillWhite';
            if (k % 2) {
                css = 'keyFillBlack';
            }
            this.keyWholeAnchor.content.push({
                x: this.gridIndentLeft, y: this.gridIndentUp + (120 - k * 12 - 12) * this.noteLineWidth,
                w: nextMeasureX, h: 12 * this.noteLineWidth, css: css
            });
        }
    };
    ZvoogApp.prototype.resetTrackVoiceName = function () {
    };
    ZvoogApp.prototype.createLayers = function () {
        var layers = [];
        this.overButtonsAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
        this.keyZoomAnchor = { xx: 0, yy: this.gridIndentUp, ww: 1, hh: 120 * this.noteLineWidth, showZoom: this.minZoom, hideZoom: 25, content: [] };
        this.keyWholeAnchor = { xx: 0, yy: this.gridIndentUp, ww: 1, hh: 120 * this.noteLineWidth, showZoom: 25, hideZoom: this.maxZoom, content: [] };
        this.meterPatternAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
        //this.gridAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
        this.firstAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: 100, content: [] };
        this.secondAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: 50, content: [] };
        this.otherAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: 25, content: [] };
        this.workButtonsGroup = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
        //this.backgroundAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
        this.popupMenuGroup = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
        this.popupSubMenuGroup = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
        this.popupSubSubMenuGroup = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
        layers.push({ g: document.getElementById('overButtonsGroup'), anchors: [this.overButtonsAnchor], overlay: 1 });
        layers.push({ g: document.getElementById('keyPatternGroup'), anchors: [this.keyZoomAnchor, this.keyWholeAnchor] });
        //layers.push({ g: (document.getElementById('backgroundGroup') as any) as SVGElement, anchors: [this.backgroundAnchor] });
        layers.push({ g: document.getElementById('meterPatternGroup'), anchors: [this.meterPatternAnchor] });
        //layers.push({ g: (document.getElementById('gridGroup') as any) as SVGElement, anchors: [this.gridAnchor] });
        layers.push({ g: document.getElementById('otherVoicesGroup'), anchors: [this.otherAnchor] });
        layers.push({ g: document.getElementById('secondaryVoicesGroup'), anchors: [this.secondAnchor] });
        layers.push({ g: document.getElementById('mainVoiceGroup'), anchors: [this.firstAnchor] });
        layers.push({ g: document.getElementById('workButtonsGroup'), anchors: [this.workButtonsGroup] });
        this.popupLayer = { g: document.getElementById('popupGroup'), anchors: [this.popupMenuGroup, this.popupSubMenuGroup, this.popupSubSubMenuGroup] };
        layers.push(this.popupLayer);
        return layers;
    };
    ZvoogApp.prototype.resetWholeProject = function () {
        this.resetFieldSize();
        this.resetButtons();
        this.resetGrid();
        this.resetNotes();
        this.tileLevel.resetModel();
    };
    ZvoogApp.prototype.patternDuration = function (pattern) {
        return duration2time(pattern.tempo, duration384(pattern.meter));
    };
    ZvoogApp.prototype.voiceDuration = function (voice) {
        var ms = 0;
        for (var i = 0; i < voice.chunks.length; i++) {
            ms = ms + this.patternDuration(voice.chunks[i]);
        }
        return ms;
    };
    ZvoogApp.prototype.trackDuration = function (track) {
        var ms = 0;
        for (var i = 0; i < track.voices.length; i++) {
            var t = this.voiceDuration(track.voices[i]);
            if (t > ms) {
                ms = t;
            }
        }
        return ms;
    };
    ZvoogApp.prototype.wholeDuration = function (schedule) {
        var ms = 0;
        for (var i = 0; i < schedule.tracks.length; i++) {
            var t = this.trackDuration(schedule.tracks[i]);
            if (t > ms) {
                ms = t;
            }
        }
        return ms;
    };
    ZvoogApp.prototype.resetFieldSize = function () {
        this.tileLevel.innerWidth = this.tileLevel.tapSize * (this.gridIndentLeft + this.wholeDuration(this.currentSong) * this.lengthOfSecond + this.gridIndentRight);
        this.tileLevel.innerHeight = this.tileLevel.tapSize * (this.gridIndentUp + 120 * this.noteLineWidth + this.gridIndentDown);
        //this.gridAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
        //this.gridAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
        this.firstAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
        this.firstAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
        this.secondAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
        this.secondAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
        this.otherAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
        this.otherAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
        this.keyZoomAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
        this.keyZoomAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
        this.keyWholeAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
        this.keyWholeAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
        this.meterPatternAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
        this.meterPatternAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
        this.workButtonsGroup.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
        this.workButtonsGroup.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
        //this.backgroundAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
        //this.backgroundAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
    };
    ZvoogApp.prototype.resetRandom = function () {
        var testSong = new TestSong();
        this.currentSong = testSong.createRandomSchedule();
        this.resetWholeProject();
    };
    return ZvoogApp;
}());
