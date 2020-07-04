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

class CannyDo {
	currentID: number = 0;
	start(ms: number, action: () => void) {
		var startId = -1;
		this.currentID = setTimeout(function () {
			//console.log(startId,this.currentID,this);
			if (startId == this.currentID) {
				action();
			}
		}.bind(this), ms);
		startId = this.currentID;
	}
}

type TileZoom = {
	x: number,
	y: number,
	z: number
}
type TilePoint = {
	x: number,
	y: number
}
type TileModelLayer = {
	g: SVGElement,
	//mode: string = 'normal';
	//shift: number;
	//viceversa: boolean;
	//definition: TileDefinition[] = [];
	anchors: TileAnchor[]
}

type TileLayerStickLeft = {
	stickLeft: number
} & TileModelLayer;

type TileLayerStickTop = {
	stickTop: number
} & TileModelLayer;

type TileLayerStickBottom = {
	stickBottom: number
} & TileModelLayer;

type TileLayerStickRight = {
	stickRight: number
} & TileModelLayer;

type TileLayerOverlay = {
	overlay: number
} & TileModelLayer;

type TileBaseDefinition = {
	id?: string// = 'id'+Math.floor(Math.random()*1000000000)
	, css?: string// string
	, action?: (x: number, y: number) => void | undefined
};
type TileAnchor = {
	xx: number
	, yy: number
	, ww: number
	, hh: number
	, showZoom: number
	, hideZoom: number
	, content: (TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon)[]
} & TileBaseDefinition;


type TileRectangle = {
	x: number
	, y: number
	, w: number
	, h: number
	, rx?: number
	, ry?: number
} & TileBaseDefinition;

type TileText = {
	x: number
	, y: number
	, text: string
} & TileBaseDefinition;

type TilePath = {
	x?: number
	, y?: number
	, scale?: number
	, points: string//path definition
} & TileBaseDefinition;

type TileLine = {
	x1: number
	, x2: number
	, y1: number
	, y2: number
} & TileBaseDefinition;

type TilePolygon = {
	x?: number
	, y?: number
	, scale?: number
	, dots: number[]
} & TileBaseDefinition;

type TileSVGElement = SVGElement & {
	onClickFunction: (x: number, y: number) => void
	, watchX: number
	, watchY: number
	, watchW: number
	, watchH: number
	, minZoom: number
	, maxZoom: number
};
class TileLevel {
	svg: SVGElement;
	tapSize: number = 50;
	twoZoom: boolean = false;
	clickLimit: number = this.tapSize / 6;
	svgns: string = "http://www.w3.org/2000/svg";
	viewWidth: number = 0;
	viewHeight: number = 0;
	innerWidth: number = 0;
	innerHeight: number = 0;
	_translateX: number = 0;
	_translateY: number = 0;
	_translateZ: number = 1;
	startMouseScreenX: number = 0;
	startMouseScreenY: number = 0;
	clickX: number = 0;
	clickY: number = 0;
	dragZoom: number = 1;
	allTilesOK: boolean = false;
	clicked: boolean = false;
	mx: number = 100;
	mn: number = 1;
	startedTouch: boolean = false;
	twodistance: number = 0;
	twocenter: TilePoint;
	model: TileModelLayer[] = [];
	slidingLockTo: number = 0;
	slidingID: number = 0;
	onResizeDo: CannyDo = new CannyDo();
	onZoom: CannyDo = new CannyDo();
	afterZoomCallback: () => void;
	afterResizeCallback: () => void;

	lastTickTime: number = 0;

	fastenUp: boolean = true;
	fastenDown: boolean = true;
	fastenLeft: boolean = true;
	fastenRight: boolean = true;

	lastMoveDx: number = 0;
	lastMoveDy: number = 0;
	lastMoveDt: number = 0;
	//onMoveStop: CannyDo = new CannyDo();

	mouseDownMode: boolean = false;
	anchor(xx: number, yy: number, ww: number, hh: number, showZoom: number, hideZoom: number): TileAnchor {
		return { xx: xx, yy: yy, ww: ww, hh: hh, showZoom: showZoom, hideZoom: hideZoom, content: [] };
	}
	rectangle(x: number, y: number, w: number, h: number, rx?: number, ry?: number, css?: string): TileRectangle {
		return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, css: css };
	}
	actionRectangle(action: (x: number, y: number) => void | undefined, x: number, y: number, w: number, h: number, rx?: number, ry?: number, css?: string): TileRectangle {
		return { x: x, y: y, w: w, h: h, rx: rx, ry: ry, css: css, action: action };
	}
	line(x1: number, y1: number, x2: number, y2: number, css?: string): TileLine {
		return { x1: x1, y1: y1, x2: x2, y2: y2, css: css };
	}
	text(x: number, y: number, text: string, css?: string): TileText {
		return { x: x, y: y, text: text, css: css };
	}


	isLayerStickTop(t: TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay): t is TileLayerStickTop {
		return (t as TileLayerStickTop).stickTop !== undefined;
	}
	isLayerStickBottom(t: TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay): t is TileLayerStickBottom {
		return (t as TileLayerStickBottom).stickBottom !== undefined;
	}
	isLayerStickRight(t: TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay): t is TileLayerStickRight {
		return (t as TileLayerStickRight).stickRight !== undefined;
	}
	isLayerOverlay(t: TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay): t is TileLayerOverlay {
		return (t as TileLayerOverlay).overlay !== undefined;
	}
	isTilePath(t: TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon): t is TilePath {
		return (t as TilePath).points !== undefined;
	}
	isTileText(t: TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon): t is TileText {
		return (t as TileText).text !== undefined;
	}
	isTileLine(t: TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon): t is TileLine {
		return (t as TileLine).x1 !== undefined;
	}
	isTilePolygon(t: TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon): t is TilePolygon {
		return (t as TilePolygon).dots !== undefined;
	}
	isLayerStickLeft(t: TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay): t is TileLayerStickLeft {
		return (t as TileLayerStickLeft).stickLeft !== undefined;
	}
	isTileRectangle(t: TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon): t is TileRectangle {
		return (t as TileRectangle).h !== undefined;
	}
	isTileGroup(t: TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon): t is TileAnchor {
		return (t as TileAnchor).content !== undefined;
	}
	isLayerNormal(t: TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay): t is TileModelLayer {
		return (t as any).stickLeft === undefined
			&& (t as any).stickTop === undefined
			&& (t as any).stickBottom === undefined
			&& (t as any).stickRight === undefined
			&& (t as any).overlay === undefined
			;
	}
	rid() {
		return 'id' + Math.floor(Math.random() * 1000000000);
	}
	get translateZ(): number {
		return this._translateZ;
	}
	set translateZ(z: number) {
		if (z != this._translateZ) {
			//console.log('z',this._translateZ,'=>',z);
			this._translateZ = z;
		}

	}
	get translateX(): number {
		return this._translateX;
	}
	set translateX(x: number) {
		if (x != this._translateX) {
			//console.log('x',this._translateX,'=>',x);
			this._translateX = x;
		}

	}
	get translateY(): number {
		return this._translateY;
	}
	set translateY(y: number) {
		if (y != this._translateY) {
			//console.log('y',this._translateY,'=>',y);
			this._translateY = y;
		}

	}

	constructor(svgObject: SVGElement, inWidth: number, inHeight: number, minZoom: number, curZoom: number, maxZoom: number, layers: TileModelLayer[]) {
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
	dump() {
		console.log('dump', this);
	}
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
	setupTapSize() {
		let rect: Element = document.createElementNS(this.svgns, 'rect');
		rect.setAttributeNS(null, 'height', '1cm');
		rect.setAttributeNS(null, 'width', '1cm');
		this.svg.appendChild(rect);
		let tbb: DOMRect = (rect as SVGSVGElement).getBBox();
		this.tapSize = tbb.width;
		this.svg.removeChild(rect);
		this.clickLimit = this.tapSize / 6;
	}
	onAfterResize() {
		this.onResizeDo.start(333, function () {
			//console.log('resized', this);
			this.viewWidth = this.svg.clientWidth;
			this.viewHeight = this.svg.clientHeight;
			//this.resetModel();
			if (this.afterResizeCallback) { this.afterResizeCallback(); }
			this.applyZoomPosition();
			this.adjustContentPosition();
			this.slideToContentPosition();
		}.bind(this));
	}
	onMove(dx: number, dy: number) {
		var d = new Date();
		//console.log('onMove speed', d, d.getMilliseconds(), dx, dy, Math.sqrt(dx * dx + dy * dy));
		this.lastMoveDx = dx;
		this.lastMoveDy = dy;
		this.lastMoveDt = Date.now();
		/*var me=this;
		this.onMoveStop.start(100, function () {
			me.moveTail();
		}.bind(this));*/
	}
	moveTail(speed: number) {
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
	}
	rakeMouseWheel(e: WheelEvent) {
		//console.log('rakeMouseWheel',e);
		this.slidingLockTo = -1;
		//console.log('rakeMouseWheel',e.wheelDelta,e.detail,e.deltaX,e.deltaY,e.deltaZ,e);
		e.preventDefault();
		//let wheelVal = e.wheelDelta || -e.detail;
		let wheelVal: number = e.deltaY;
		let min: number = Math.min(1, wheelVal);
		let delta: number = Math.max(-1, min);
		let zoom: number = this.translateZ - delta * (this.translateZ) * 0.077;
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
	}
	rakeMouseDown(mouseEvent: MouseEvent) {
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
	}
	rakeMouseMove(mouseEvent: MouseEvent) {
		//console.log('rakeMouseMove',mouseEvent);
		if (this.mouseDownMode) {
			mouseEvent.preventDefault();
			let dX: number = mouseEvent.offsetX - this.startMouseScreenX;
			let dY: number = mouseEvent.offsetY - this.startMouseScreenY;
			this.translateX = this.translateX + dX * this.translateZ;
			this.translateY = this.translateY + dY * this.translateZ;
			this.startMouseScreenX = mouseEvent.offsetX;
			this.startMouseScreenY = mouseEvent.offsetY;
			this.applyZoomPosition();
			this.onMove(dX, dY);
		}
	}
	rakeMouseUp(mouseEvent: MouseEvent) {
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
			} else {
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
	}
	rakeTouchStart(touchEvent: TouchEvent) {
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
		} else {
			this.startTouchZoom(touchEvent);
		}
		this.clicked = false;
	}
	rakeTouchMove(touchEvent: TouchEvent) {
		//console.log('rakeTouchMove',touchEvent.touches.length);
		touchEvent.preventDefault();
		if (this.startedTouch) {
			if (touchEvent.touches.length < 2) {
				if (this.twoZoom) {
					//
				} else {
					let dX: number = touchEvent.touches[0].clientX - this.startMouseScreenX;
					let dY: number = touchEvent.touches[0].clientY - this.startMouseScreenY;
					this.translateX = this.translateX + dX * this.translateZ;
					this.translateY = this.translateY + dY * this.translateZ;
					this.startMouseScreenX = touchEvent.touches[0].clientX;
					this.startMouseScreenY = touchEvent.touches[0].clientY;
					this.applyZoomPosition();
					this.onMove(dX, dY);
					return;
				}
			} else {
				if (!this.twoZoom) {
					this.startTouchZoom(touchEvent);
				} else {
					let p1: TilePoint = this.vectorFromTouch(touchEvent.touches[0]);
					let p2: TilePoint = this.vectorFromTouch(touchEvent.touches[1]);
					let d: number = this.vectorDistance(p1, p2);
					if (d <= 0) {
						d = 1;
					}
					let ratio: number = d / this.twodistance;
					this.twodistance = d;
					let zoom: number = this.translateZ / ratio;
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
	}
	rakeTouchEnd(touchEvent: TouchEvent) {
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
					} else {
						//var speed = Math.sqrt(this.lastMoveDx * this.lastMoveDx + this.lastMoveDy * this.lastMoveDy) / (Date.now() - this.lastMoveDt);
						//if (speed > 1) {
						//	this.moveTail(speed);
						//} else {
						this.slideToContentPosition();
						//}
					}
				} else {
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
	}
	startDragZoom() {
		this.dragZoom = 1.002;
		this.applyZoomPosition();
	};
	cancelDragZoom() {
		this.dragZoom = 1.0;
		this.applyZoomPosition();
	};
	applyZoomPosition() {
		let rx: number = -this.translateX - this.dragZoom * this.translateZ * (this.viewWidth - this.viewWidth / this.dragZoom) * (this.clickX / this.viewWidth);
		let ry: number = -this.translateY - this.dragZoom * this.translateZ * (this.viewHeight - this.viewHeight / this.dragZoom) * (this.clickY / this.viewHeight);
		let rw: number = this.viewWidth * this.translateZ * this.dragZoom;
		let rh: number = this.viewHeight * this.translateZ * this.dragZoom;
		this.svg.setAttribute('viewBox', rx + ' ' + ry + ' ' + rw + ' ' + rh);
		if (this.model) {
			for (let k: number = 0; k < this.model.length; k++) {
				let layer: TileModelLayer = this.model[k];
				let tx: number = 0;
				let ty: number = 0;
				let tz: number = 1;
				let cX: number = 0;
				let cY: number = 0;
				let sX: number = 0;
				let sY: number = 0;
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
				} else {
					if (this.isLayerStickLeft(layer)) {
						tx = -this.translateX;
						cX = 0;
						if (layer.stickLeft) {
							sX = layer.stickLeft * this.tapSize * this.translateZ;
						}
					} else {
						if (this.isLayerStickTop(layer)) {
							ty = -this.translateY;
							cY = 0;
							if (layer.stickTop) {
								sY = layer.stickTop * this.tapSize * this.translateZ;
							}
						} else {
							if (this.isLayerStickBottom(layer)) {
								ty = -this.translateY;
								cY = 0;
								sY = this.viewHeight * this.translateZ;
								if (layer.stickBottom) {
									sY = this.viewHeight * this.translateZ - layer.stickBottom * this.tapSize;
								}
							} else {

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
	}
	checkAfterZoom() {
		if (this.afterZoomCallback) {
			this.onZoom.start(555, function () {
				//console.log('afterZoom', this);
				this.afterZoomCallback();
			}.bind(this));
		}
	}


	slideToContentPosition() {
		let a = this.calculateValidContentPosition();
		//console.log(a,this.translateX,this.translateY,this.translateZ);
		if (a.x != this.translateX || a.y != this.translateY || a.z != this.translateZ) {
			this.startSlideTo(a.x, a.y, a.z, null);
		}
	}
	maxZoom() {
		return this.mx;
	};
	minZoom() {
		return this.mn;
	};
	adjustContentPosition() {
		let a: TileZoom = this.calculateValidContentPosition();
		if (a.x != this.translateX || a.y != this.translateY || a.z != this.translateZ) {
			this.translateX = a.x;
			this.translateY = a.y;
			this.translateZ = a.z;
			this.applyZoomPosition();
		}
	}
	calculateValidContentPosition(): TileZoom {
		let vX: number = this.translateX;
		let vY: number = this.translateY;
		let vZ: number = this.translateZ;
		if (this.translateX > 0) {
			vX = 0;
		} else {
			if (this.viewWidth - this.translateX / this.translateZ > this.innerWidth / this.translateZ) {
				if (this.viewWidth * this.translateZ - this.innerWidth <= 0) {
					vX = this.viewWidth * this.translateZ - this.innerWidth;
				} else {
					vX = 0;
				}
			}
		}
		var upLimit: number = this.viewHeight * this.translateZ;
		if (this.fastenUp) {
			upLimit = 0;
		}
		if (this.translateY > upLimit) {
			vY = upLimit;
		} else {
			if (this.viewHeight - this.translateY / this.translateZ > this.innerHeight / this.translateZ) {
				if (this.viewHeight * this.translateZ - this.innerHeight <= 0) {
					vY = this.viewHeight * this.translateZ - this.innerHeight;
					//console.log('to border');
				} else {
					vY = 0;
					//console.log('to 0');
				}
			}
		}
		if (this.translateZ < this.minZoom()) {
			vZ = this.minZoom();
		} else {
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
	}
	startTouchZoom(touchEvent: TouchEvent) {
		this.twoZoom = true;
		let p1: TilePoint = this.vectorFromTouch(touchEvent.touches[0]);
		let p2: TilePoint = this.vectorFromTouch(touchEvent.touches[1]);
		this.twocenter = this.vectorFindCenter(p1, p2);
		let d: number = this.vectorDistance(p1, p2);
		if (d <= 0) {
			d = 1;
		}
		this.twodistance = d;
	}
	vectorFromTouch(touch: Touch): TilePoint {
		return {
			x: touch.clientX,
			y: touch.clientY
		};
	}
	vectorFindCenter(xy1: TilePoint, xy2: TilePoint): TilePoint {
		let xy: TilePoint = this.vectorAdd(xy1, xy2);
		return this.vectorScale(xy, 0.5);
	};
	vectorAdd(xy1: TilePoint, xy2: TilePoint): TilePoint {
		return {
			x: xy1.x + xy2.x,
			y: xy1.y + xy2.y
		};
	};
	vectorScale(xy: TilePoint, coef: number): TilePoint {
		return {
			x: xy.x * coef,
			y: xy.y * coef
		};
	};
	vectorDistance(xy1: TilePoint, xy2: TilePoint): number {
		let xy: TilePoint = this.vectorSubstract(xy1, xy2);
		let n: number = this.vectorNorm(xy);
		return n;
	}
	vectorNorm(xy: TilePoint): number {
		return Math.sqrt(this.vectorNormSquared(xy));
	}
	vectorSubstract(xy1: TilePoint, xy2: TilePoint): TilePoint {
		return {
			x: xy1.x - xy2.x,
			y: xy1.y - xy2.y
		};
	}
	vectorNormSquared(xy: TilePoint): number {
		return xy.x * xy.x + xy.y * xy.y;
	}
	startSlideCenter(x: number, y: number, z: number, w: number, h: number, action: () => void) {
		let dx = (z * this.viewWidth / this.tapSize - w) / 2;
		let dy = (z * this.viewHeight / this.tapSize - h) / 2;
		this.startSlideTo((dx - x) * this.tapSize, (dy - y) * this.tapSize, z, action)
	}
	startSlideTo(x: number, y: number, z: number, action: (() => void) | null) {
		this.startStepSlideTo(20, x, y, z, action);
	}
	startStepSlideTo(s: number, x: number, y: number, z: number, action: (() => void) | null) {
		clearTimeout(this.slidingID);
		let stepCount: number = s;
		//let dx: number = (x - this.translateX) / stepCount;
		//let dy: number = (y - this.translateY) / stepCount;
		//let dz: number = (z - this.translateZ) / stepCount;
		let xyz: TileZoom[] = [];
		for (let i: number = 0; i < stepCount; i++) {
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
	}
	stepSlideTo(key: number, xyz: TileZoom[], action: (() => void) | null) {
		let n: TileZoom | undefined = xyz.shift();
		if (n) {
			if (key == this.slidingLockTo) {
				this.translateX = n.x;
				this.translateY = n.y;
				this.translateZ = n.z;
				this.applyZoomPosition();
				let main: TileLevel = this;
				this.slidingID = setTimeout(function () {
					main.stepSlideTo(key, xyz, action);
				}, 30);
			} else {
				//console.log('cancel slide');
			}
		} else {
			if (action) {
				action();
			}
			this.adjustContentPosition();
			this.allTilesOK = true;
			this.queueTiles();
			//console.log('done',new Date());
		}
	}
	queueTiles() {
		this.clearUselessDetails();
		this.tileFromModel();
	}
	clearUselessDetails() {
		if (this.model) {
			for (let k = 0; k < this.model.length; k++) {
				let group: SVGElement = this.model[k].g;
				this.clearUselessGroups(group, this.model[k]);
			}
		}
	}
	clearUselessGroups(group: SVGElement, layer: TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay) {
		let x: number = -this.translateX;
		let y: number = -this.translateY;
		let w: number = this.svg.clientWidth * this.translateZ;
		let h: number = this.svg.clientHeight * this.translateZ;
		let cX: number = 0;
		let cY: number = 0;
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
		} else {
			if (this.isLayerStickLeft(layer)) {
				//if (kind == layerModeLockX) {
				x = 0;
			} else {
				if (this.isLayerStickTop(layer)) {
					//if (kind == layerModeLockY) {
					y = 0;
				} else {
					if (this.isLayerStickRight(layer)) {
						//if (kind == layerModeStickRight) {
						x = 0;
					} else {
						if (this.isLayerStickBottom(layer)) {
							//if (kind == layerModeStickBottom) {
							y = 0;
						}
					}
				}
			}
		}
		if (group) this.msEdgeHook(group);
		//console.log('this.translateZ',this.translateZ);
		for (let i: number = 0; i < group.children.length; i++) {
			let child: TileSVGElement = group.children[i] as TileSVGElement;
			//console.log('check',child.minZoom,child.maxZoom,child);
			if (this.outOfWatch(child, x, y, w, h) || child.minZoom > this.translateZ || child.maxZoom <= this.translateZ) {
				group.removeChild(child);
				i--;
			} else {
				if (child.localName == 'g') {
					this.clearUselessGroups(child, layer);
				}
			}
		}
	}
	msEdgeHook(g: SVGElement) {
		if (g.childNodes && (!(g.children))) {
			(g as any).children = g.childNodes;
		}
	}
	outOfWatch(g: TileSVGElement, x: number, y: number, w: number, h: number): boolean {
		let watchX: number = g.watchX;
		let watchY: number = g.watchY;
		let watchW: number = g.watchW;
		let watchH: number = g.watchH;
		return !(this.collision(watchX, watchY, watchW, watchH, x, y, w, h));
	}
	collision(x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number): boolean {
		if (this.collision2(x1, w1, x2, w2) && this.collision2(y1, h1, y2, h2)) {
			return true;
		} else {
			return false;
		}
	}
	collision2(x: number, w: number, left: number, width: number): boolean {
		if (x + w <= left || x >= left + width) {
			return false;
		} else {
			return true;
		}
	}
	tileFromModel() {
		//console.log('tileFromModel',this.model);
		if (this.model) {
			for (let k = 0; k < this.model.length; k++) {
				let svggroup: SVGElement = this.model[k].g;
				let arr: TileAnchor[] = this.model[k].anchors;
				for (let i: number = 0; i < arr.length; i++) {
					let a: TileAnchor = arr[i];
					this.addGroupTile(svggroup, a, this.model[k]);
				}
			}
		}
		this.allTilesOK = true;
	}
	addGroupTile(parentSVGElement: SVGElement, anchor: TileAnchor, layer: TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay) {
		//console.log('addGroupTile',this.translateZ,definitions);
		let x: number = -this.translateX;
		let y: number = -this.translateY;
		let w: number = this.svg.clientWidth * this.translateZ;
		let h: number = this.svg.clientHeight * this.translateZ;
		let cX: number = 0;
		let cY: number = 0;
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
		} else {
			if (this.isLayerStickLeft(layer)) {
				//if (layerKind == layerModeLockX) {
				x = 0;
			} else {
				if (this.isLayerStickTop(layer)) {
					//if (layerKind == layerModeLockY) {
					y = 0;
				} else {
					if (this.isLayerStickRight(layer)) {
						//if (layerKind == layerModeStickRight) {
						x = 0;
					} else {
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

			if (this.collision(anchor.xx * this.tapSize
				, anchor.yy * this.tapSize
				, anchor.ww * this.tapSize
				, anchor.hh * this.tapSize //
				, x, y, w, h)) {

				var gid: string = anchor.id ? anchor.id : '';
				//console.log('el',gid,tileGroup);
				let xg: SVGElement | null = this.childExists(parentSVGElement, gid);
				//console.log('exists',xg);
				if (xg) {
					//if (isTileGroup(tileGroup)) {
					//console.log('anchor',anchor);
					for (let n = 0; n < anchor.content.length; n++) {
						let d = anchor.content[n];
						//if (d.draw == 'group') {
						if (this.isTileGroup(d)) {
							//console.log(n, d);
							this.addElement(xg, d, layer);
						}
					}
					//}
				} else {
					let g: TileSVGElement = document.createElementNS(this.svgns, 'g') as TileSVGElement;
					//console.log(parentGroup,g);
					g.id = gid;//tileGroup.id;
					//let gg = g as any;
					g.watchX = anchor.xx * this.tapSize;
					g.watchY = anchor.yy * this.tapSize;
					g.watchW = anchor.ww * this.tapSize;
					g.watchH = anchor.hh * this.tapSize;
					parentSVGElement.appendChild(g);
					g.minZoom = anchor.showZoom;
					g.maxZoom = anchor.hideZoom;
					//if (isTileGroup(tileGroup)) {
					for (let n = 0; n < anchor.content.length; n++) {
						let d = anchor.content[n];
						this.addElement(g, d, layer);
					}
					//}
				}
			}
		}
	}
	childExists(group: SVGElement, id: string): SVGElement | null {//SVGGraphicsElement/SVGElement
		//console.log('childExists',group, id);
		//console.dir(group);
		if (id) {
			if (group) this.msEdgeHook(group);
			for (let i: number = 0; i < group.children.length; i++) {
				let child: SVGElement = group.children[i] as SVGElement;
				if (child.id == id) {
					return child;
				}
			}
		}
		return null;
	}
	addElement(g: SVGElement, d: TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon, layer: TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay) {

		let element: TileSVGElement | null = null;
		//if (d.draw == 'rectangle') {
		if (this.isTileRectangle(d)) {
			//let r=d as TileRectangle;
			element = this.tileRectangle(g, d.x * this.tapSize, d.y * this.tapSize
				, d.w * this.tapSize, d.h * this.tapSize
				, (d.rx ? d.rx : 0) * this.tapSize, (d.ry ? d.ry : 0) * this.tapSize
				, (d.css ? d.css : ''));
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
				let me: TileLevel = this;
				let click: () => void = function () {
					if (me.clicked) {
						if (element) {
							//console.log('click',element);
							if (element.onClickFunction) {
								let xx: number = element.getBoundingClientRect().left - me.svg.getBoundingClientRect().left;
								let yy: number = element.getBoundingClientRect().top - me.svg.getBoundingClientRect().top;
								element.onClickFunction(me.translateZ * (me.clickX - xx) / me.tapSize, me.translateZ * (me.clickY - yy) / me.tapSize);
							}
						}
					}
				};
				element.onclick = click;
				element.ontouchend = click;
			}
		}
	}
	tilePolygon(g: SVGElement, x: number, y: number, z: number | undefined, dots: number[], cssClass: string | undefined): TileSVGElement {
		let polygon: TileSVGElement = document.createElementNS(this.svgns, 'polygon') as TileSVGElement;
		let points: string = '';
		let dlmtr = '';
		for (let i = 0; i < dots.length; i = i + 2) {
			points = points + dlmtr + dots[i] * this.tapSize + ',' + dots[i + 1] * this.tapSize;
			dlmtr = ', ';
		}
		polygon.setAttributeNS(null, 'points', points);
		let t: string = "";
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
	}
	tilePath(g: SVGElement, x: number, y: number, z: number, data: string, cssClass: string): TileSVGElement {
		let path: TileSVGElement = document.createElementNS(this.svgns, 'path') as TileSVGElement;
		path.setAttributeNS(null, 'd', data);
		let t: string = "";
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
	}
	tileRectangle(g: SVGElement, x: number, y: number, w: number, h: number, rx: number | undefined, ry: number | undefined, cssClass: string): TileSVGElement {
		let rect: TileSVGElement = document.createElementNS(this.svgns, 'rect') as TileSVGElement;
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
	}
	tileLine(g: SVGElement, x1: number, y1: number, x2: number, y2: number, cssClass: string | undefined): TileSVGElement {
		let line: TileSVGElement = document.createElementNS(this.svgns, 'line') as TileSVGElement;
		line.setAttributeNS(null, 'x1', '' + x1);
		line.setAttributeNS(null, 'y1', '' + y1);
		line.setAttributeNS(null, 'x2', '' + x2);
		line.setAttributeNS(null, 'y2', '' + y2);
		if (cssClass) {
			line.classList.add(cssClass);
		}
		g.appendChild(line);
		return line;
	}
	tileText(g: SVGElement, x: number, y: number, html: string, cssClass: string): TileSVGElement {

		let txt: TileSVGElement = document.createElementNS(this.svgns, 'text') as TileSVGElement;
		txt.setAttributeNS(null, 'x', '' + x);
		txt.setAttributeNS(null, 'y', '' + y);
		if (cssClass) {
			txt.setAttributeNS(null, 'class', cssClass);
		}
		txt.innerHTML = html;
		g.appendChild(txt);
		//console.log('tileText',g,txt);
		return txt;
	}
	clearAllDetails() {
		if (this.model) {
			for (let i: number = 0; i < this.model.length; i++) {
				this.clearGroupDetails(this.model[i].g);
			}
		}
	}
	clearGroupDetails(group: SVGElement) {
		if (group) this.msEdgeHook(group);
		//console.log(group);
		while (group.children.length) {
			group.removeChild(group.children[0]);
		}
	}
	autoID(definition: (TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon)[]) {
		if (definition) {
			if (definition.length) {
				for (let i: number = 0; i < definition.length; i++) {

					if (!(definition[i].id)) {
						//definition[i].id = 'id' + Math.floor(Math.random() * 1000000000);
						definition[i].id = this.rid();
						//console.log('/',definition[i]);
					}
					//let tt:TileGroup|TileDefinition=definition[i];
					//this.autoID(tt.sub);
					if (this.isTileGroup(definition[i])) {
						let group: TileAnchor = definition[i] as TileAnchor;
						this.autoID(group.content);
					}
					//this.autoID(definition[i].sub);
				}
			}
		}
	}

	setModel(layers: TileModelLayer[]) {
		for (let i: number = 0; i < layers.length; i++) {
			this.autoID(layers[i].anchors);
		}
		//console.log(layers);
		this.model = layers;
		this.resetModel();
	}
	resetModel() {
		for (let i: number = 0; i < this.model.length; i++) {
			this.autoID(this.model[i].anchors);
		}
		this.clearAllDetails();
		this.applyZoomPosition();
		this.adjustContentPosition();
		this.slideToContentPosition();
		this.allTilesOK = false;
	}
	resetAnchor(anchor: TileAnchor, svgGroup: SVGElement) {
		var gid: string = anchor.id ? anchor.id : '';
		let xg: SVGElement | null = this.childExists(svgGroup, gid);
		if (xg) {
			svgGroup.removeChild(xg);
		}
	}
	redrawAnchor(anchor: TileAnchor) {
		//this.autoID([anchor]);
		if (anchor.id) {
			for (var i = 0; i < this.model.length; i++) {

				var layer = this.model[i];
				var svgEl: SVGElement = layer.g;
				if (this.removeFromTree(anchor, svgEl, layer)) {
					return true;
				}
			}
		}
		return false;
	}
	removeFromTree(anchor: TileAnchor, parentSVG: SVGElement, layer: TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay): boolean {
		if (parentSVG) this.msEdgeHook(parentSVG);
		if (anchor.id) {
			for (var i: number = 0; i < parentSVG.children.length; i++) {
				var child: SVGElement = parentSVG.children[i] as SVGElement;
				if (child.id == anchor.id) {
					parentSVG.removeChild(child);
					this.addGroupTile(parentSVG, anchor, layer);
					return true;
				} else {
					if (child.localName == 'g') {
						if (this.removeFromTree(anchor, child, layer)) {
							return true;
						}
					}
				}
			}
		}
		return false;
	}
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
	startLoop() {
		this.lastTickTime = new Date().getTime();
		this.tick();
	}
	tick() {
		let now = new Date().getTime();
		if (this.lastTickTime + 33 < now) {
			if (!(this.allTilesOK)) {
				this.queueTiles();
			}
			this.lastTickTime = new Date().getTime();
		}
		window.requestAnimationFrame(this.tick.bind(this));
	}

}