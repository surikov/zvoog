console.log('Zvoog v1.02');
function Zvoog() {
	var me = this;
	this.loadUnit = function (id) {
		return new ZvoogNode();
	};
	this.takeState = function (nodeId, stateId, count) {
		return new ZvoogState();
	};
	return me;
}
function ZvoogNode(id) {
	var me = this;
	this.addInputStream = function (audioNode) {
		//
	};
	this.removeInputStream = function (audioNode) {
		//
	};
	this.addOutputStream = function (audioNode) {
		//
	};
	this.removeOutputStream = function (audioNode) {
		//
	};
	this.combineStates = function (zvoogNode) {
		//
	};
	this.unCombineStates = function (zvoogNode) {
		//
	};
	return me;
}
function ZvoogState() {
	var me = this;
	this.value = 0;
	this.change=function(newValue){
		this.value = newValue;
	};
	return me;
}

function Velocity_1(zvoog, id) {
	var zn = new ZvoogNode();
	zn._id = id;
	zn._state = zvoog.takeState(this._id, 'vel', 2,function(){
		console.log('changed',zn._id,'vel');
	});
	return zn;
}

var z = new Zvoog();

var sequencer = z.loadUnit('sequencer-1');
var instrument = z.loadUnit('instrument-1');
var velocity = new Velocity_1(z,'velocity-aaa');
var velocityB = new Velocity_1(z,'velocity-bbb');
var knob = z.loadUnit('knob-1');
var slider = z.loadUnit('slider-1');
var keyboard = z.loadUnit('keyboard-1');
var ticker = z.loadUnit('ticker-1');

var audioNode1 = {};
var audioNode2 = {};

velocity.addInputStream(instrument);
velocity.addInputStream(audioNode1);
velocity.addOutputStream(audioNode2);

//keyboard.addStateReceiver(instrument);
velocity.combineStates(velocityB);

console.log('done init');

velocity._state.change(0.5);

console.log('done test');

velocity.unCombineStates(velocityB);

instrument.removeOutputStream(velocity);
velocity.removeInputStream(audioNode1);
velocity.removeOutputStream(audioNode2);

//keyboard.removeStateReceiver(instrument);

console.log('done cleanup');
