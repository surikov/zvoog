console.log('rockstar among us v3.05');
/*
class RoundedHandler {
    value: number = 0;
    click: () => void;
    interend: () => void;
    change: (nn: number) => void;
    rotation: HTMLElement;
    component: HTMLElement;
    startY: number = 0;
    delta: number = 0;
    startValue: number = 0;
    watchMouse: boolean = false;
    constructor(maincomp: HTMLElement, rocomp: HTMLElement, onclick: () => void, onchange: (nn: number) => void, eninteraction: () => void) {
        this.value = 0;
        this.interend = eninteraction;
        this.click = onclick;
        this.change = onchange;
        this.rotation = rocomp;
        this.component = maincomp;
        this.startY = 0;
        this.delta = 0;
        this.startValue = 0;
        this.watchMouse = false;
        window.addEventListener('mouseup', this.onMouseUp.bind(this), false);
        window.addEventListener('mousemove', this.onMouseMove.bind(this), true);
        this.component.addEventListener('mousedown', this.cmousedown.bind(this), false);
        this.component.addEventListener("touchstart", this.ctouchstart.bind(this), false);
        this.component.addEventListener("touchmove", this.ctouchmove.bind(this), false);
        this.component.addEventListener("touchend", this.ctouchend.bind(this), false);

    }
    //let me = this;


    setValue(n: number) {
        var o = this.value;
        this.value = n;
        this.rotation.style.transform = "rotate(" + n * 360 / (332 * 4) + "deg)";
        if (o != n) {
            this.change(this.value);
        }
    }
    cmousedown(mouseEvent: any) {
        mouseEvent.preventDefault();
        this.startY = mouseEvent.clientY;
        this.startValue = this.value;
        this.delta = 0;
        this.watchMouse = true;
    }
    onMouseUp(mouseEvent: any) {
        if (this.watchMouse) {
            this.watchMouse = false;
            mouseEvent.preventDefault();
            if (this.delta < 10) {
                this.click();
            }
            this.interend();
        }

    };
    onMouseMove(mouseEvent: any) {
        if (this.watchMouse) {
            mouseEvent.preventDefault();
            var dY = mouseEvent.clientY - this.startY;
            this.delta = Math.abs(dY);
            var newVal = Math.floor(this.startValue - dY / 1);
            if (newVal >= 0 && newVal < 1000) {
                this.setValue(this.startValue - dY / 1);
            }
        }
    };

    ctouchstart(touchEvent: any) {
        touchEvent.preventDefault();
        this.startY = touchEvent.touches[0].clientY;
        this.startValue = this.value;
        this.delta = 0;
    }
    ctouchmove(touchEvent: any) {
        touchEvent.preventDefault();
        var dY = touchEvent.touches[0].clientY - this.startY;
        this.delta = Math.abs(dY);
        var newVal = Math.floor(this.startValue - dY / 1);
        if (newVal >= 0 && newVal < 1000) {
            this.setValue(this.startValue - dY / 1);
        }
    }
    ctouchend(touchEvent: any) {
        touchEvent.preventDefault();
        if (this.delta < 10) {
            this.click();
        }
        this.interend();
    }


}*/
var PageControl = /** @class */ (function () {
    //me:PageControl;
    function PageControl(genr) {
        this.preProgNN = 0;
        this.progNN = 0;
        //drumControl: RoundedHandler;
        //bassControl: RoundedHandler;
        //leadControl: RoundedHandler;
        //padControl: RoundedHandler;
        this.drumSeedValue = 0;
        this.bassSeedValue = 0;
        this.leadSeedValue = 0;
        this.padSeedValue = 0;
        this.progressionSeedValue = 0;
        this.chordProgressionTitle = "";
        //skipSaveState: boolean = false;
        this.editProgText = '';
        this.adMobCounterData = 0;
        this.adMobMaxCounter = 50;
        this.adMobBlocked = false;
        this.nameOfState = 'rockDice';
        this.nameOfProgs = 'progList';
        this.currentEditFieldID = 'currentEditField';
        this.currentEditFieldNum = -1;
        //let me: PageControl = this;
        this.genRiff = genr;
        this.preProgNN = 0;
        this.progNN = 0;
        /*this.drumControl = new RoundedHandler(document.getElementById('svgdrums'), document.getElementById('roundDrums'), function () {
            me.drumControl.setValue(Math.floor(Math.random() * 1000));
            me.parsChanged();
            
        }, function (nn) {
            if (me.genRiff.onAir)
                me.parsChanged();
        }, function () {
            //me.adCounterDecrease();
            me.saveCurrentState();
        });
        this.bassControl = new RoundedHandler(document.getElementById('svgbass'), document.getElementById('roundBass'), function () {
            me.bassControl.setValue(Math.floor(Math.random() * 1000));
            me.parsChanged();
        }, function (nn) {
            if (me.genRiff.onAir)
                me.parsChanged();
        }, function () {
            //me.adCounterDecrease();
            me.saveCurrentState();
        });
        this.leadControl = new RoundedHandler(document.getElementById('svglead'), document.getElementById('roundLead'), function () {
            me.leadControl.setValue(Math.floor(Math.random() * 1000));
            me.parsChanged();
        }, function (nn) {
            if (me.genRiff.onAir)
                me.parsChanged();
        }, function () {
            //me.adCounterDecrease();
            me.saveCurrentState();
        });
        this.padControl = new RoundedHandler(document.getElementById('svgpad'), document.getElementById('roundPad'), function () {
            me.padControl.setValue(Math.floor(Math.random() * 1000));
            me.parsChanged();
        }, function (nn) {
            if (me.genRiff.onAir)
                me.parsChanged();
        }, function () {
            //me.adCounterDecrease();
            me.saveCurrentState();
        });*/
        this.readChanged();
        //this.fillProgList();
        window.addEventListener("pagehide", this.saveCurrentState.bind(this));
        window.addEventListener("blur", this.saveCurrentState.bind(this));
        window.addEventListener("unload", this.saveCurrentState.bind(this));
        window.addEventListener("pagehide", this.pausePlay.bind(this));
        window.addEventListener("blur", this.pausePlay.bind(this));
        window.addEventListener("unload", this.pausePlay.bind(this));
        //document.onunload=function(){this.pausePlay.bind(this);}
        this.loadState();
    }
    PageControl.prototype.saveCurrentState = function () {
        /*if (this.skipSaveState) {
            console.log('skipSaveState');
            return;
        }*/
        try {
            this.readChanged();
            var progressionN = Math.floor(this.genRiff.progressions.length * this.progNN / 1000);
            var chords = this.genRiff.progressions[progressionN].chords;
            var chordLine = this.chords2title(chords);
            var state = chordLine
                + '/' + this.drumSeedValue
                + '/' + this.bassSeedValue
                + '/' + this.leadSeedValue
                + '/' + this.padSeedValue;
            var encoded = encodeURIComponent(state);
            console.log('save state', encoded);
            console.log(decodeURIComponent(encoded));
            this.saveText2localStorage(this.nameOfState, encoded);
            this.saveText2localStorage(this.nameOfProgs, JSON.stringify(this.genRiff.progressions));
            //this.adSaveData();
        }
        catch (ex) {
            console.log(ex);
        }
    };
    PageControl.prototype.loadState = function () {
        var decoded = '';
        try {
            //this.adLoadData();
            var progListTxt = this.readTextFromlocalStorage(this.nameOfProgs);
            if (progListTxt) {
                try {
                    var arr = JSON.parse(progListTxt);
                    //console.log('arr', arr);
                    if (arr.length) {
                        this.genRiff.progressions = [];
                        for (var i = 0; i < arr.length; i++) {
                            this.genRiff.progressions.push({
                                name: arr[i].name, chords: arr[i].chords
                            });
                        }
                    }
                }
                catch (xx) {
                    console.log(xx);
                }
            }
            var raw = this.readTextFromlocalStorage(this.nameOfState);
            decoded = decodeURIComponent(raw);
            if (raw) {
                var items = decoded.split('/');
                var chords = this.convertChords(items[0]);
                var title = this.chords2title(chords);
                var pnn = -1;
                for (var i = 0; i < this.genRiff.progressions.length; i++) {
                    var it = this.chords2title(this.genRiff.progressions[i].chords);
                    if (title == it) {
                        pnn = i;
                        break;
                    }
                }
                if (pnn < 0) {
                    pnn = 0;
                    this.genRiff.progressions.unshift({
                        //category: '', 
                        name: this.dateName(), chords: chords
                    });
                    console.log(this.genRiff.progressions);
                }
                var step = 1000 / this.genRiff.progressions.length;
                var nProg = Math.floor(step * pnn + 0.5 * step);
                this.drumSeedValue = Number(items[1]);
                this.bassSeedValue = Number(items[2]);
                this.leadSeedValue = Number(items[3]);
                this.padSeedValue = Number(items[4]);
                //this.drumControl.setValue(Number(items[1]));
                //this.bassControl.setValue(Number(items[2]));
                //this.leadControl.setValue(Number(items[3]));
                //this.padControl.setValue(Number(items[4]));
                //(document.getElementById('sliderProgression') as any).value = nProg;
                this.progressionSeedValue = nProg;
                this.readChanged();
            }
        }
        catch (ex) {
            console.log(ex);
        }
        console.log('done loadState', decoded, this);
    };
    PageControl.prototype.promptShare = function () {
        //this.test();
        this.saveCurrentState();
        var playInfo = this.genRiff.generateAll(this.progNN
        //, this.drumControl.value, this.bassControl.value, this.leadControl.value, this.padControl.value
        , this.drumSeedValue, this.bassSeedValue, this.leadSeedValue, this.padSeedValue);
        console.log('playInfo', playInfo);
        this.saveText2localStorage('playInfo', JSON.stringify(playInfo));
        window.location.href = 'sharethis.html';
    };
    PageControl.prototype.readObjectFromlocalStorage = function (name) {
        var o = null;
        try {
            o = JSON.parse(localStorage.getItem(name));
        }
        catch (ex) {
            console.log(ex);
            return {};
        }
        return o;
    };
    PageControl.prototype.saveText2localStorage = function (name, text) {
        //console.log('saveText2localStorage', name, text);
        localStorage.setItem(name, text);
    };
    PageControl.prototype.readTextFromlocalStorage = function (name) {
        var o = '';
        try {
            o = localStorage.getItem(name);
        }
        catch (ex) {
            //console.log(ex);
        }
        return o;
    };
    PageControl.prototype.editSetting = function () {
        //console.log('editSetting',this);
        if (this.genRiff.onAir) {
            this.pausePlay();
        }
        this.unSetEditNewProg();
        this.fillProgList();
        //this.setEditSelectedProg(2);
        var div = document.getElementById('settingDiv');
        //document.getElementById('settingDiv').style.display = 'block';
        div.style.display = 'block';
        var rowHeight = div.scrollHeight / (3 + this.genRiff.progressions.length);
        var hh = div.scrollHeight * this.progNN / 1000 - 2 * rowHeight;
        if (hh < 0)
            hh = 0;
        var r = Math.floor(this.genRiff.progressions.length * this.progNN / 1000);
        //console.log(r,rowHeight, this.progNN, hh);
        div.scrollTo(0, hh);
        this.setEditSelectedProg(r);
    };
    PageControl.prototype.closeSetting = function () {
        document.getElementById('settingDiv').style.display = 'none';
    };
    /*
    promptAdSell() {
        alert('disable ad');
        console.log('promptAdSell');
    }
    adSaveData() {
        //console.log('adSaveData', this.adMobCounterData);
        localStorage.setItem('adMobCounterData', '' + this.adMobCounterData);
    }
    adLoadData() {

        this.adMobCounterData = this.adMobMaxCounter;
        var o = localStorage.getItem('adMobCounterData');
        //console.log('adLoadData', o);
        try {
            var nn = parseInt(o);
            if (nn > 0 && nn <= this.adMobMaxCounter) {
                this.adMobCounterData = nn;
            }
        } catch (xx) {
            console.log(xx);
        }
        this.adCounterRefresh();

    }
    
    adCounterRefresh() {
        //console.log('adCounterRefresh');
        if (this.adMobBlocked) {
            document.getElementById('adMobInfo').innerHTML = '&nbsp;';
            document.getElementById('adMobDescript').innerHTML = '&nbsp;';
        } else {
            //document.getElementById('adMobInfo').innerHTML = '' + this.adMobCounterData;
            document.getElementById('adMobInfo').innerHTML = '' + this.adMobCounterData;
            document.getElementById('adMobDescript').innerHTML = loLabel('beforeAd');
        }
    }
    adCounterSet(nn:number) {
        //console.log('adCounterSet', nn);
        this.adMobCounterData = nn;
        this.adSaveData();
        this.adCounterRefresh();
    }
    adCounterDecrease() {
        //console.log('adCounterDecrease');
        
        if (this.adMobCounterData < 2) {
            this.adShowAd();
        } else {
            this.adMobCounterData--;
            this.adSaveData();
            this.adCounterRefresh();
        }
    }
    adShowAd() {
        console.log('adShowAd');
        this.pausePlay();
        var rr=confirm(loLabel('promptAd'));
        if(rr){
            //this.adCounterSet(this.adMobMaxCounter);
            invokeShowAd();
        }else{
            //
        }
    }
    saveSelProg() {
        var res = (document.getElementById('newProgField') as any).value;
        //console.log('saveSelProg', '[' + this.editProgText + ']->[' + res + ']');
        document.getElementById('settingDiv').style.display = 'none';
    }
*/
    PageControl.prototype.chords2title = function (chords) {
        var title = '';
        var dlmtr = '';
        for (var i = 0; i < chords.length; i = i + 2) {
            title = title + dlmtr;
            title = title + chords[i];
            if (chords[i] != chords[i + 1]) {
                title = title + '-' + chords[i + 1];
            }
            dlmtr = ', ';
        }
        return title;
    };
    PageControl.prototype._chordsHighlight = function (chords, currentBeat) {
        var title = '';
        var dlmtr = '';
        for (var i = 0; i < chords.length; i = i + 2) {
            var curMeasure = chords[i];
            if (chords[i] != chords[i + 1]) {
                curMeasure = curMeasure + '-' + chords[i + 1];
            }
            title = title + dlmtr;
            if (currentBeat == i * 8) {
                title = title + '[' + curMeasure + ']';
            }
            else {
                title = title + curMeasure;
            }
            dlmtr = ', ';
        }
        return title;
    };
    PageControl.prototype.parsChanged = function () {
        this.genRiff.initAudio();
        this.readChanged();
        this.startPlay();
    };
    PageControl.prototype.readChanged = function () {
        var sz = this.genRiff.progressions.length;
        //var nn = 1 * (document.getElementById('sliderProgression') as any).value;
        var nn = this.progressionSeedValue;
        var r = Math.floor(sz * nn / 1000);
        //console.log(r,nn,sz,this.genRiff.progressions);
        this.progNN = nn;
        this.chordProgressionTitle = this.chords2title(this.genRiff.progressions[r].chords);
        /*
                document.getElementById('progNameRow').innerHTML
                    = this.chords2title(this.genRiff.progressions[r].chords);
                    */
        //= this.chordsHighlight(this.genRiff.progressions[r].chords,48);
        //document.getElementById('progSubName').innerHTML
        //	= '&nbsp;' + this.genRiff.progressions[r].name;
        this.genRiff.playInfo = this.genRiff.generateAll(this.progNN
        //, this.drumControl.value, this.bassControl.value, this.leadControl.value, this.padControl.value
        , this.drumSeedValue, this.bassSeedValue, this.leadSeedValue, this.padSeedValue);
        if (this.preProgNN != this.progNN) {
            this.genRiff.nextBeat = 0;
            if (this.genRiff.onAir) {
                this.genRiff.player.cancelQueue(this.genRiff.audioContext);
            }
        }
        this.preProgNN = this.progNN;
    };
    PageControl.prototype.clickPlay = function () {
        if (this.genRiff.onAir) {
            this.pausePlay();
        }
        else {
            this.startPlay();
            this.test();
        }
    };
    PageControl.prototype.startPlay = function () {
        this.genRiff.initAudio();
        this.genRiff.startPlay(this.progNN
        //, this.drumControl.value, this.bassControl.value, this.leadControl.value, this.padControl.value
        , this.drumSeedValue, this.bassSeedValue, this.leadSeedValue, this.padSeedValue);
        //(document.getElementById('menuPlayButton') as any).src = 'resources/buttonPause.svg';
        //document.getElementById('playDiv').style.display = 'block';
        startDance();
        return null;
    };
    PageControl.prototype.pausePlay = function () {
        console.log('control pausePlay');
        this.genRiff.stopPlay();
        //(document.getElementById('menuPlayButton') as any).src = 'resources/buttonPlay.svg';
        //document.getElementById('playDiv').style.display = 'none';
        stopDance();
        console.log('done pausePlay');
        return null;
    };
    PageControl.prototype.playRandom = function () {
        this.genRiff.initAudio();
        //(document.getElementById('sliderProgression') as any).value = Math.floor(1000 * Math.random());
        this.progressionSeedValue = Math.floor(1000 * Math.random());
        /*
        this.drumControl.setValue(Math.floor(1000 * Math.random()));
        this.bassControl.setValue(Math.floor(1000 * Math.random()));
        //ld.setValue(Math.floor(1000 * Math.random()));
        this.leadControl.setValue(0);
        this.padControl.setValue(0);
        */
        this.drumSeedValue = Number(Math.floor(1000 * Math.random()));
        this.bassSeedValue = Number(Math.floor(1000 * Math.random()));
        this.leadSeedValue = Number(0);
        this.padSeedValue = Number(0);
        if (Math.random() < 0.25) {
            //this.padControl.setValue(Math.floor(1000 * Math.random()));
            this.padSeedValue = Number(Math.floor(1000 * Math.random()));
        }
        else {
            if (Math.random() < 0.50) {
                //this.leadControl.setValue(Math.floor(1000 * Math.random()));
                this.leadSeedValue = Number(Math.floor(1000 * Math.random()));
            }
            else {
                //this.padControl.setValue(Math.floor(1000 * Math.random()));
                //this.leadControl.setValue(Math.floor(1000 * Math.random()));
                this.padSeedValue = Number(Math.floor(1000 * Math.random()));
                this.leadSeedValue = Number(Math.floor(1000 * Math.random()));
            }
        }
        this.parsChanged();
        //this.adCounterDecrease();
        this.saveCurrentState();
        updateProgressionSlider(this.progressionSeedValue);
    };
    PageControl.prototype.createNewProg = function () {
        console.log('createNewProg');
    };
    ;
    PageControl.prototype.createProgClick = function (nn) {
        var me = this;
        return function () {
            console.log('click', nn);
            me.setEditSelectedProg(nn);
        };
    };
    PageControl.prototype.fillProgList = function () {
        var me = this;
        var list = document.getElementById('progListDiv');
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
        for (var i = 0; i < this.genRiff.progressions.length; i++) {
            var p = document.createElement('p');
            var a = document.createElement('a');
            a.textContent = this.chords2title(this.genRiff.progressions[i].chords);
            a.onclick = this.createProgClick(i);
            list.appendChild(p);
            p.appendChild(a);
            var span = document.createElement('span');
            span.classList.add('smallFont');
            span.textContent = ' ' + this.genRiff.progressions[i].name;
            a.appendChild(span);
        }
        var p = document.createElement('p');
        var a = document.createElement('a');
        a.textContent = '[x] ' + loLabel('resetList'); //'[x] reset';
        a.onclick = function () { me.promptResetList(); };
        list.appendChild(p);
        p.appendChild(a);
    };
    PageControl.prototype.promptResetList = function () {
        var res = window.confirm(loLabel('resetConfirm')); //'Remove all custom progressions and reset list.');
        if (res) {
            console.log('reset list');
            this.genRiff.resetProgressions();
            this.editSetting();
            document.getElementById('settingDiv').scrollTo(0, 0);
        }
    };
    PageControl.prototype.test = function () {
        this.parsChanged();
        var urlprj = this.genRiff.generate(this.progNN
        //, this.drumControl.value, this.bassControl.value, this.leadControl.value, this.padControl.value
        , this.drumSeedValue, this.bassSeedValue, this.leadSeedValue, this.padSeedValue);
        console.log(urlprj);
        //console.log(urlprj);
        //window.open(urlprj);
        //return null;
    };
    PageControl.prototype.setEditSelectedProg = function (nn) {
        this.unSetEditNewProg();
        if (this.currentEditFieldNum > -1) {
            this.unSetEditSelectedProg(this.currentEditFieldNum);
        }
        this.currentEditFieldNum = nn;
        var div = document.getElementById('progListDiv');
        var p = div.children.item(nn);
        //console.log(nn, p);
        while (p.firstChild) {
            p.removeChild(p.firstChild);
        }
        var txtfld = document.createElement('input');
        txtfld.classList.add('progEditField');
        txtfld.id = this.currentEditFieldID;
        txtfld.placeholder = loLabel('deleteProgression'); //'Delete progression';
        txtfld.type = 'text';
        txtfld.value = this.chords2title(this.genRiff.progressions[nn].chords);
        var imgbtn = document.createElement('input');
        imgbtn.classList.add('saveProgButton');
        imgbtn.type = 'image';
        imgbtn.src = 'resources/buttonOK.svg';
        var me = this;
        imgbtn.onclick = function () {
            console.log('set');
            me.approveSelectedProg(nn);
        };
        var subdiv = document.createElement('div');
        subdiv.classList.add('proEditgForm');
        subdiv.appendChild(txtfld);
        subdiv.appendChild(imgbtn);
        p.appendChild(subdiv);
    };
    PageControl.prototype.unSetEditSelectedProg = function (nn) {
        this.currentEditFieldNum = -1;
        var div = document.getElementById('progListDiv');
        var p = div.children.item(nn);
        //console.log(nn, p);
        while (p.firstChild) {
            p.removeChild(p.firstChild);
        }
        var a = document.createElement('a');
        a.textContent = this.chords2title(this.genRiff.progressions[nn].chords);
        a.onclick = this.createProgClick(nn);
        p.appendChild(a);
        var span = document.createElement('span');
        span.classList.add('smallFont');
        span.textContent = ' ' + this.genRiff.progressions[nn].name;
        a.appendChild(span);
    };
    PageControl.prototype.dateName = function () {
        return new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
    };
    PageControl.prototype.approveSelectedProg = function (nn) {
        //this.unSetEditSelectedProg(nn);
        var fld = document.getElementById(this.currentEditFieldID);
        if (fld) {
            var txt = fld.value.trim();
            if (txt.length > 0) {
                if (txt == this.chords2title(this.genRiff.progressions[nn].chords).trim()) {
                    console.log('no changes', txt);
                    //this.unSetEditSelectedProg(nn);
                }
                else {
                    console.log('save', txt, this.genRiff.progressions[nn]);
                    this.genRiff.progressions[nn].chords = this.convertChords(txt);
                    this.genRiff.progressions[nn].name = this.dateName(); //new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString();
                    //this.unSetEditSelectedProg(nn);
                }
                this.closeSetting();
                var step = 1000 / this.genRiff.progressions.length;
                var v = Math.floor(step * nn + 0.5 * step);
                //console.log(nn,this.genRiff.progressions.length,v,this.genRiff.progressions);
                //(document.getElementById('sliderProgression') as any).value = v;
                this.progressionSeedValue = v;
                //updateProgressionSlider(this.progressionSeedValue);
                this.genRiff.initAudio();
                this.readChanged();
                this.startPlay();
            }
            else {
                console.log('delete', txt);
                this.genRiff.progressions.splice(nn, 1);
                //this.unSetEditSelectedProg(nn);
                //(document.getElementById('sliderProgression') as any).value = 0;
                this.progressionSeedValue = 0;
                this.progNN = 0;
                this.editSetting();
            }
            updateProgressionSlider(this.progressionSeedValue);
        }
        else {
            console.log('ops');
            this.unSetEditSelectedProg(nn);
        }
    };
    PageControl.prototype.setEditNewProg = function () {
        this.unSetEditNewProg();
        if (this.currentEditFieldNum > -1) {
            this.unSetEditSelectedProg(this.currentEditFieldNum);
        }
        var div = document.getElementById('otherSettingDiv');
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        var txtfld = document.createElement('input');
        txtfld.id = this.currentEditFieldID;
        txtfld.classList.add('progEditField');
        txtfld.type = 'text';
        //this.currentEditFieldValue = '';
        //txtfld.value=this.chords2title(this.genRiff.progressions[i].chords);
        txtfld.placeholder = '+' + loLabel('addNew'); //'+New progression';
        var imgbtn = document.createElement('input');
        imgbtn.classList.add('saveProgButton');
        imgbtn.type = 'image';
        imgbtn.src = 'resources/buttonOK.svg';
        var me = this;
        imgbtn.onclick = function () {
            //console.log('save', me);
            //me.unSetEditNewProg();
            me.approveNewProg();
        };
        //div.appendChild(div);
        div.appendChild(txtfld);
        div.appendChild(imgbtn);
        //console.log('txtfld',txtfld);
        document.getElementById('settingDiv').scrollTo(0, 0);
    };
    PageControl.prototype.unSetEditNewProg = function () {
        var div = document.getElementById('otherSettingDiv');
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        var p = document.createElement('p');
        p.classList.add('newProgLabel');
        var a = document.createElement('a');
        a.textContent = '[+] progression';
        var me = this;
        //
        a.onclick = function () {
            //console.log('new clicked');
            me.setEditNewProg();
        };
        div.appendChild(p);
        p.appendChild(a);
    };
    PageControl.prototype.existsChordName = function (chord) {
        for (var k = 0; k < this.genRiff.chordfretsData.length; k++) {
            if (this.genRiff.chordfretsData[k].name == chord) {
                return true;
            }
        }
        return false;
    };
    PageControl.prototype.convertChords = function (txt) {
        var strings = [];
        var pairs = txt.split(',');
        //console.log(pairs);
        for (var i = 0; i < pairs.length; i++) {
            var one = pairs[i].split('-');
            if (one.length > 1) {
                strings.push(one[0].trim());
                strings.push(one[1].trim());
            }
            else {
                strings.push(one[0].trim());
                strings.push(one[0].trim());
            }
        }
        for (var i = 0; i < strings.length; i++) {
            var chord = strings[i];
            if (chord) {
                if (!this.existsChordName(chord)) {
                    chord = chord.substr(0, 1).toUpperCase();
                    if (!this.existsChordName(chord)) {
                        chord = 'A';
                    }
                }
            }
            else {
                chord = 'C';
            }
            strings[i] = chord;
        }
        var sz = strings.length;
        for (var i = sz; i < 8; i++) {
            strings.push(strings[strings.length - 1]);
        }
        sz = strings.length;
        if (sz > 8 && sz < 16) {
            for (var i = sz; i < 16; i++) {
                strings.push(strings[strings.length - 1]);
            }
        }
        sz = strings.length;
        if (sz > 16) {
            strings.length = 16;
        }
        return strings;
    };
    PageControl.prototype.approveNewProg = function () {
        var fld = document.getElementById(this.currentEditFieldID);
        if (fld) {
            var txt = fld.value.trim();
            if (txt.length > 0) {
                console.log('add', txt);
                var newprog = this.convertChords(txt);
                console.log(newprog);
                this.genRiff.progressions.unshift({
                    //category: 'custom'
                    //, 
                    name: this.dateName() //new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString()
                    ,
                    chords: newprog
                });
                //this.unSetEditNewProg();
                this.closeSetting();
                //(document.getElementById('sliderProgression') as any).value = 0;
                this.progressionSeedValue = 0;
                this.genRiff.initAudio();
                this.readChanged();
                this.startPlay();
                updateProgressionSlider(this.progressionSeedValue);
            }
            else {
                console.log('cancel', txt);
                this.unSetEditNewProg();
            }
        }
        else {
            console.log('ops');
            this.unSetEditNewProg();
        }
    };
    PageControl.prototype.updateChordPosition = function (beat) {
        //console.log(beat,this.progNN,this.genRiff.progressions.length);
        var idx = Math.floor(this.genRiff.progressions.length * this.progNN / 1000);
        var chords = this.genRiff.progressions[idx].chords;
        //var txt=this.chordsHighlight(this.genRiff.progressions[idx].chords,beat);
        //console.log(beat,txt);
        var first = '';
        var second = '';
        var third = '';
        var dlmtr = '';
        for (var i = 0; i < chords.length; i = i + 2) {
            var curMeasure = chords[i];
            if (chords[i] != chords[i + 1]) {
                curMeasure = curMeasure + '-' + chords[i + 1];
            }
            //console.log(curMeasure,i*8);
            if (beat == i * 8) {
                //second = second + dlmtr + '[' + curMeasure + ']';
                first = first + dlmtr;
                second = curMeasure;
            }
            else {
                if (beat > i * 8) {
                    first = first + dlmtr + curMeasure;
                }
                else {
                    third = third + dlmtr + curMeasure;
                }
            }
            dlmtr = ', ';
        }
        //console.log(beat,first+'{'+second+'}'+third);
        third = third + ' - ' + this.genRiff.progressions[idx].name;
        var div = document.getElementById('titleChord');
        while (div.firstChild) {
            div.removeChild(div.firstChild);
        }
        div.appendChild(document.createTextNode(first));
        var span = document.createElement('span');
        span.classList.add('auxText');
        span.textContent = second;
        div.appendChild(span);
        div.appendChild(document.createTextNode(third));
    };
    ;
    return PageControl;
}());
