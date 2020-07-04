var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
console.log('ZvoogState v2.03');
function cloneMeasureTempo(s) {
    var t = {
        bpm: s.bpm,
        fraction: s.fraction
    };
    return t;
}
function cloneTimeSignature(s) {
    var t = {
        count: s.count,
        fraction: s.fraction
    };
    return t;
}
function clonePoint(p) {
    var t = {
        at: cloneTimeSignature(p.at),
        pitch: p.pitch
    };
    return t;
}
function cloneValue(v) {
    var t = {
        start: clonePoint(v.start),
        end: clonePoint(v.end)
    };
    return t;
}
function cloneMeasure(m) {
    var t = {
        tempo: cloneMeasureTempo(m.tempo),
        meter: m.meter,
        values: []
    };
    for (var i = 0; i < m.values.length; i++) {
        t.values.push(cloneValue(m.values[i]));
    }
    return t;
}
function cloneStateChannel(c) {
    var t = {
        title: c.title,
        measures: []
    };
    for (var i = 0; i < c.measures.length; i++) {
        t.measures.push(cloneMeasure(c.measures[i]));
    }
    return t;
}
function cloneZvoogState(s) {
    var n = {
        title: s.title,
        channels: []
    };
    for (var i = 0; i < s.channels.length; i++) {
        n.channels.push(cloneStateChannel(s.channels[i]));
    }
    return n;
}
var ZvoogDispatcher = /** @class */ (function () {
    function ZvoogDispatcher() {
        console.log('ZvoogDispatcher');
    }
    ZvoogDispatcher.prototype.registerRoute = function (from, to) {
    };
    return ZvoogDispatcher;
}());
var ZvoogNode = /** @class */ (function () {
    function ZvoogNode() {
        console.log('ZvoogNode');
    }
    return ZvoogNode;
}());
var ZvoogNodeButton = /** @class */ (function (_super) {
    __extends(ZvoogNodeButton, _super);
    function ZvoogNodeButton() {
        var _this = _super.call(this) || this;
        console.log('ZvoogNodeButton');
        return _this;
    }
    ZvoogNodeButton.prototype.uiClick = function () {
        console.log('uiClick');
    };
    return ZvoogNodeButton;
}(ZvoogNode));
var d = new ZvoogDispatcher();
var b = new ZvoogNodeButton();
b.uiClick();
