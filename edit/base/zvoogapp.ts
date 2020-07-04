console.log('ZvoogApp v1.01');


class ZvoogApp {
	minZoom: number = 1;
	maxZoom: number = 1024;
	tileLevel: TileLevel;
	menuStyleWidth = '7cm';

	overButtonsAnchor: TileAnchor;
	//gridAnchor: TileAnchor;
	firstAnchor: TileAnchor;
	secondAnchor: TileAnchor;
	otherAnchor: TileAnchor;
	keyPatternAnchor: TileAnchor;
	meterPatternAnchor: TileAnchor;
	workButtonsGroup: TileAnchor;
	popupMenuGroup: TileAnchor;
	popupSubMenuGroup: TileAnchor;
	popupSubSubMenuGroup: TileAnchor;
	backgroundAnchor: TileAnchor;

	popupLayer: TileModelLayer;

	gridIndentUp: number = 256;
	gridIndentDown: number = 10;
	gridIndentLeft: number = 10;
	gridIndentRight: number = 10;

	lengthOfSecond: number = 50;
	noteLineWidth = 3;

	currentSong: ZvoogSchedule;
	undoRedo: ZvoogUndoRedo = new ZvoogUndoRedo(this);

	lang = new ZvoogLang();

	popup: ZvoogPopup = new ZvoogPopup(this);
	constructor() {
		console.log('ZvoogApp init');
	}
	start() {
		console.log('ZvoogApp start');
		let testSong: TestSong = new TestSong();

		this.currentSong = testSong.createRandomSchedule();
		console.log(this.currentSong);
		let layers: (TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay)[]
			= this.createLayers();
		this.tileLevel = new TileLevel((document.getElementById('contentSVG') as any) as SVGElement, 100, 100
			, this.minZoom, 20, this.maxZoom - 0.001
			, layers);
		this.tileLevel.afterResizeCallback = this.afterResizeCallback.bind(this);
		this.tileLevel.afterZoomCallback = this.afterZoomCallback.bind(this);
		this.resetWholeProject();
		var filesinput: HTMLElement | null = document.getElementById('filesinput');
		if (filesinput) filesinput.addEventListener('change', this.handleFileSelect.bind(this), false);
	}
	handleFileSelect(event) {
		var file = event.target.files[0];
		var fileReader: FileReader = new FileReader();
		var me = this;
		fileReader.onload = function (progressEvent) {
			if (progressEvent.target) {
				var arrayBuffer: ArrayBuffer = (progressEvent.target as any).result as ArrayBuffer;
				me.parseMIDI(arrayBuffer);
			}
		};
		fileReader.readAsArrayBuffer(file);
	}
	parseMIDI(arrayBuffer: ArrayBuffer) {
		var midiParser: MidiParser = new MidiParser(arrayBuffer);
		console.log(midiParser.dump());
		this.currentSong = midiParser.convert();
		this.resetWholeProject()
	}
	afterResizeCallback() {
		this.resetWholeProject();
	}
	afterZoomCallback() {
		console.log(this.tileLevel.translateX, this.tileLevel.translateY, this.tileLevel.translateZ);
	}
	addMainTextButton(x: number, y: number, size: number, text: string, sizecss: string
		, content: (TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon)[]
		, action: () => void) {
		content.push({ x: x, y: y, w: size, h: size, rx: 0.5 * size, ry: 0.5 * size, css: 'fillButtonSpot', action: action.bind(this) });
		content.push({ x: x + 0.3 * size, y: y + 0.8 * size, css: sizecss + ' fillColorContent', text: text });
		content.push({ x: x, y: y, w: size, h: size, css: 'fillButtonActionPoint', action: action.bind(this) });
	}
	addBlockedTextButton(x: number, y: number, size: number, text: string, sizecss: string, content: (TileAnchor | TileRectangle | TileText | TilePath | TileLine | TilePolygon)[]) {
		content.push({ x: x, y: y, w: size, h: size, rx: 0.5 * size, ry: 0.5 * size, css: 'fillButtonSpot' });
		content.push({ x: x + 0.3 * size, y: y + 0.8 * size, css: sizecss + ' fillColorSub', text: text });
	}
	resetButtons() {
		this.workButtonsGroup.content.length = 0;
		this.overButtonsAnchor.content.length = 0;

		this.addMainTextButton(0, 0, 32, 'import', 'fontSize16', this.workButtonsGroup.content, this.importTestMIDI);
		this.addMainTextButton(32, 32, 128, this.currentSong.title, 'fontSize128', this.workButtonsGroup.content, this.promptTitle);
		this.addMainTextButton(256, 224, 32, this.currentSong.description, 'fontSize16', this.workButtonsGroup.content, this.promptDescription);
		if (this.currentSong.macros.length > 0 && this.currentSong.macroPosition < this.currentSong.macros.length) {
			this.addMainTextButton(this.tileLevel.viewWidth / this.tileLevel.tapSize - 1.5, 0.5, 1
				, this.lang.label('redo')
				, 'fontSize05', this.overButtonsAnchor.content, this.clickRedo);
		} else {
			this.addBlockedTextButton(this.tileLevel.viewWidth / this.tileLevel.tapSize - 1.5, 0.5, 1
				, this.lang.label('redo')
				, 'fontSize05', this.overButtonsAnchor.content);
		}
		if (this.currentSong.macros.length > 0 && this.currentSong.macroPosition > 0) {
			this.addMainTextButton(this.tileLevel.viewWidth / this.tileLevel.tapSize - 3, 0.5, 1
				, this.lang.label('undo')
				, 'fontSize05', this.overButtonsAnchor.content, this.clickUndo);
		} else {
			this.addBlockedTextButton(this.tileLevel.viewWidth / this.tileLevel.tapSize - 3, 0.5, 1
				, this.lang.label('undo')
				, 'fontSize05', this.overButtonsAnchor.content);
		}
		this.addMainTextButton(this.tileLevel.viewWidth / this.tileLevel.tapSize - 1.5
			, this.tileLevel.viewHeight / this.tileLevel.tapSize - 1.5
			, 1
			, this.lang.label('menu')
			, 'fontSize05', this.overButtonsAnchor.content, this.openLayersMenu);
	}
	importTestMIDI() {
		console.log('importTestMIDI');
		var filesinput: HTMLElement | null = document.getElementById('filesinput');
		if (filesinput) filesinput.click();
	}
	createMoveUpVoice(t: number, v: number): () => void {
		var me = this;
		return function (): void {
			//me.closeLayersMenu();
			//me.undoRedo.addRedo({ key: undoRedoMoveVoice, point: me.uiTapPosition(), properties: { oldTrackPosition: t, newTrackPosition: 0, oldVoicePosition: v, newVoicePosition: 0 } });
			me.undoRedo.addRedo({
				key: undoRedoMoveVoice, point: me.uiTapPosition(), properties: {
					oldTrackPosition: me.currentSong.selectedTrack
					, newTrackPosition: t
					, oldVoicePosition: me.currentSong.selectedVoice
					, newVoicePosition: v
				}
			});
			me.openLayersMenu();
		}
	}
	createMoveUpTrack(t: number): () => void {
		var me = this;
		return function (): void {
			//me.closeLayersMenu();
			//me.undoRedo.addRedo({ key: undoRedoMoveTrack, point: me.uiTapPosition(), properties: { oldTrackPosition: t, newTrackPosition: 0 } });
			me.undoRedo.addRedo({
				key: undoRedoMoveTrack, point: me.uiTapPosition(), properties: {
					oldTrackPosition: me.currentSong.selectedTrack
					, newTrackPosition: t
					, oldVoicePosition: me.currentSong.selectedVoice
					, newVoicePosition: 0
				}
			});
			me.openLayersMenu();
		}
	}
	promptTitle() {
		var result = window.prompt('Title', this.currentSong.title);
		if ((result) && result != this.currentSong.title) {
			this.undoRedo.addRedo({ key: undoRedoChangeProjectTitle, point: this.uiTapPosition(), properties: { newTitle: result, oldTitle: this.currentSong.title } });
		}
	}
	promptDescription() {
		var result = window.prompt('Description', this.currentSong.title);
		if ((result) && result != this.currentSong.description) {
			this.undoRedo.addRedo({ key: undoRedoChangeProjectDescription, point: this.uiTapPosition(), properties: { newDescription: result, oldDescription: this.currentSong.description } });
		}
	}
	uiTapPosition(): XYZ {
		return { x: -this.tileLevel.translateX / this.tileLevel.tapSize, y: -this.tileLevel.translateY / this.tileLevel.tapSize, z: this.tileLevel.translateZ };
	}
	clickRedo() {
		var xyz: XYZ | null = this.undoRedo.doRedo();
		if (xyz) {
			this.tileLevel.startSlideTo(-xyz.x * this.tileLevel.tapSize, -xyz.y * this.tileLevel.tapSize, xyz.z, null);
		}
	}
	openLayersMenu() {
		console.log(this.currentSong);
		var items: ZoomMainMenuItem[] = [];
		for (var t = 0; t < this.currentSong.tracks.length; t++) {
			var track: ZvoogTrack = this.currentSong.tracks[t];
			if (t == this.currentSong.selectedTrack) {
				items.push({ label: track.title, power: 0, subpadding: false, action: () => console.log('skip track') });
				for (var v = 0; v < track.voices.length; v++) {
					var voice: ZvoogVoice = track.voices[v];
					if (v == this.currentSong.selectedVoice) {
						items.push({ label: voice.title, power: 2, subpadding: true, action: () => console.log('skip voice') });
					} else {
						items.push({ label: voice.title, power: 1, subpadding: true, action: this.createMoveUpVoice(t, v) });
					}
				}
			} else {
				items.push({ label: track.title, power: 0, subpadding: false, action: this.createMoveUpTrack(t) });
			}
		}
		var mainMenuDiv: HTMLElement | null = document.getElementById('mainMenuDiv');
		if (mainMenuDiv && mainMenuDiv.style.width == this.menuStyleWidth) {
			this.closeLayersMenu();
			setTimeout(() => { this.showLayersMenu(items); }, 200);
		} else {
			this.showLayersMenu(items);
		}

	}
	showLayersMenu(items: ZoomMainMenuItem[]) {
		console.log('showLayersMenu');
		var o: HTMLElement | null = document.getElementById('menuItemRows');
		if (o) {
			while (o.children.length) o.removeChild(o.children[0]);
			for (var i = 0; i < items.length; i++) {
				var row: HTMLDivElement = document.createElement('div');
				if (items[i].power == 1) {
					if (items[i].subpadding) {
						row.classList.add('subMenuSelected1');
					} else {
						row.classList.add('mainMenuSelected1');
					}
				} else {
					if (items[i].power == 2) {
						if (items[i].subpadding) {
							row.classList.add('subMenuSelected2');
						} else {
							row.classList.add('mainMenuSelected2');
						}
					} else {
						if (items[i].subpadding) {
							row.classList.add('subMenuButtonRow');
						} else {
							row.classList.add('mainMenuButtonRow');
						}
					}
				}
				row.innerText = items[i].label;
				var a: (() => void) | undefined = items[i].action;
				row.onclick = items[i].action;
				o.appendChild(row);
			}
			var row: HTMLDivElement = document.createElement('div');
			row.innerHTML = '&nbsp;';
			row.classList.add('mainMenuButtonRow');
			o.appendChild(row);
			row = document.createElement('div');
			row.innerHTML = '&nbsp;';
			row.classList.add('mainMenuButtonRow');
			o.appendChild(row);
			o.scrollTop = 0;
		}
		var menuTitleText: HTMLElement | null = document.getElementById('menuTitleText');
		if (menuTitleText) menuTitleText.style.width = menuTitleText.innerText = this.lang.label('layersMenuTitle');
		var mainMenuDiv: HTMLElement | null = document.getElementById('mainMenuDiv');
		if (mainMenuDiv) mainMenuDiv.style.width = this.menuStyleWidth;
	}
	closeLayersMenu() {
		console.log('closeLayersMenu');
		(document.getElementById('mainMenuDiv') as any).style.width = '0cm';
	}
	clickUndo() {
		var xyz: XYZ | null = this.undoRedo.doUndo();
		if (xyz) {
			this.tileLevel.startSlideTo(-xyz.x * this.tileLevel.tapSize, -xyz.y * this.tileLevel.tapSize, xyz.z, null);
		}
	}
	resetNotes() {
		this.firstAnchor.content.length = 0;
		this.secondAnchor.content.length = 0;
		this.otherAnchor.content.length = 0;
		for (var t = 0; t < this.currentSong.tracks.length; t++) {
			var track: ZvoogTrack = this.currentSong.tracks[t];
			for (var v = 0; v < track.voices.length; v++) {
				var voice: ZvoogVoice = track.voices[v];

				var nextMeasureX = 0;
				for (var i = 0; i < voice.chunks.length; i++) {
					var chunk: ZvoogPattern = voice.chunks[i];
					//console.log('track', t, 'voice', v, 'chunk', i);
					var chunkAnchor: TileAnchor = this.tileLevel.anchor(
						this.gridIndentLeft + nextMeasureX
						, this.gridIndentUp
						, this.patternDuration(chunk) * this.lengthOfSecond*4
						, 120 * this.noteLineWidth
						, this.minZoom
						, 25
					);
					/*chunkAnchor.content.push(this.tileLevel.rectangle(this.gridIndentLeft + nextMeasureX
						, this.gridIndentUp
						, this.patternDuration(chunk) * this.lengthOfSecond
						, 120 * this.noteLineWidth
						, 0, 0
						, 'debug'));*/
					if (t == this.currentSong.selectedTrack && v == this.currentSong.selectedVoice) {
						this.firstAnchor.content.push(chunkAnchor);
						this.addChordNotes(chunkAnchor, nextMeasureX, chunk, 'firstLine');
					} else {
						if (t == this.currentSong.selectedTrack && v != this.currentSong.selectedVoice) {
							this.secondAnchor.content.push(chunkAnchor);
							this.addChordNotes(chunkAnchor, nextMeasureX, chunk, 'secondLine');
						} else {
							this.otherAnchor.content.push(chunkAnchor);
							this.addChordNotes(chunkAnchor, nextMeasureX, chunk, 'otherLine');
						}
					}
					nextMeasureX = nextMeasureX + this.patternDuration(chunk) * this.lengthOfSecond;
					//if (i > -10) break;
				}
			}
		}
	}
	addChordNotes(chunkAnchor: TileAnchor, nextMeasureX: number, chunk: ZvoogPattern, css: string) {
		for (var ch = 0; ch < chunk.chords.length; ch++) {
			var chord: ZvoogChord = chunk.chords[ch];
			//console.log(chord);
			for (var n = 0; n < chord.values.length; n++) {
				var key: ZvoogKey = chord.values[n];
				this.addNoteLine(chunkAnchor, nextMeasureX, chunk, chord, key, css);
			}
		}
	}
	addNoteLine(anchor: TileAnchor, nextMeasureX: number, chunk: ZvoogPattern, chord: ZvoogChord, key: ZvoogKey, css: string) {
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
			anchor.content.push(this.tileLevel.line(
					noteX  + 0.5 * this.noteLineWidth - dx
					, noteY
					, noteX + iWidth - 0.5 * this.noteLineWidth
					, noteY + slide * this.noteLineWidth
					, css));
			//anchor.content.push(this.tileLevel.text(noteX + 0.5 * this.noteLineWidth, noteY, '.' + i, 'fontSize2 debug'));
			noteY = noteY + slide * this.noteLineWidth;
			noteX = noteX + iWidth;// - 0.5 * this.noteLineWidth;
		}
	}
	resetGrid() {
		//this.gridAnchor.content.length = 0;
		this.keyPatternAnchor.content.length = 0;
		this.meterPatternAnchor.content.length = 0;
		this.backgroundAnchor.content.length = 0;


		this.backgroundAnchor.content.push({
			x: 0
			, y: 0
			, w: this.gridIndentLeft + this.wholeDuration(this.currentSong) * this.lengthOfSecond + this.gridIndentRight
			, h: this.gridIndentUp + 120 * this.noteLineWidth + this.gridIndentDown
			, rx: 32
			, ry: 32
			, css: 'fillBack'
		});
		var nextMeasureX = 0;
		if (this.currentSong.tracks.length > this.currentSong.selectedTrack) {
			var track: ZvoogTrack = this.currentSong.tracks[this.currentSong.selectedTrack];
			if (track.voices.length > this.currentSong.selectedVoice) {
				var voice: ZvoogVoice = track.voices[this.currentSong.selectedVoice];
				//console.log(track.title, voice);
				//var tempo = 0;
				//var count = 0;
				//var division = 0;
				for (var i = 0; i < voice.chunks.length; i++) {
					var chunk: ZvoogPattern = voice.chunks[i];
					var measureAnchor: TileAnchor = {
						xx: this.gridIndentLeft + nextMeasureX
						, yy: this.gridIndentUp
						, ww: this.patternDuration(chunk) * this.lengthOfSecond
						, hh: 120 * this.noteLineWidth
						, showZoom: this.minZoom
						, hideZoom: 25
						, content: []
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
						var step: ZvoogGridStep = this.currentSong.gridPattern[idx];
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
								x: this.gridIndentLeft + nextMeasureX + sx
								, y: this.gridIndentUp, w: thick, h: 120 * this.noteLineWidth, css: 'meterLine'
							});
							//console.log('add',i,gduration,thick);
						}//else{
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
		this.keyPatternAnchor.ww = nextMeasureX;
		for (var k = 0; k < 120; k++) {
			if (this.currentSong.keyPattern[k]) {
				var css = 'keyFillWhite';
				if (this.currentSong.keyPattern[k] > 1) { css = 'keyFillBlack'; }
				if (this.currentSong.keyPattern[k] > 2) { css = 'keyFillWhite'; }
				this.keyPatternAnchor.content.push({
					x: this.gridIndentLeft, y: this.gridIndentUp + (120 - k - 1) * this.noteLineWidth
					, w: nextMeasureX, h: 0.9 * this.noteLineWidth, css: css
				});
				if (k > 0) {
					if (this.currentSong.keyPattern[k] > 2) {
						this.keyPatternAnchor.content.push({
							x: this.gridIndentLeft, y: this.gridIndentUp + (120 - k - 0.05) * this.noteLineWidth
							, w: nextMeasureX, h: 0.1 * this.noteLineWidth, css: 'meterLine'
						});
					}
				}
			}
		}
	}
	createLayers(): (TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay)[] {
		let layers: (TileModelLayer | TileLayerStickLeft | TileLayerStickTop | TileLayerStickBottom | TileLayerStickRight | TileLayerOverlay)[] = [];
		this.overButtonsAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
		this.keyPatternAnchor = { xx: 0, yy: this.gridIndentUp, ww: 1, hh: 120 * this.noteLineWidth, showZoom: this.minZoom, hideZoom: 25, content: [] };

		this.meterPatternAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
		//this.gridAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
		this.firstAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
		this.secondAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
		this.otherAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
		this.workButtonsGroup = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
		this.backgroundAnchor = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };

		this.popupMenuGroup = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
		this.popupSubMenuGroup = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
		this.popupSubSubMenuGroup = { xx: 0, yy: 0, ww: 1, hh: 1, showZoom: this.minZoom, hideZoom: this.maxZoom, content: [] };
		layers.push({ g: (document.getElementById('overButtonsGroup') as any) as SVGElement, anchors: [this.overButtonsAnchor], overlay: 1 });
		layers.push({ g: (document.getElementById('keyPatternGroup') as any) as SVGElement, anchors: [this.keyPatternAnchor] });
		layers.push({ g: (document.getElementById('backgroundGroup') as any) as SVGElement, anchors: [this.backgroundAnchor] });
		layers.push({ g: (document.getElementById('meterPatternGroup') as any) as SVGElement, anchors: [this.meterPatternAnchor] });
		//layers.push({ g: (document.getElementById('gridGroup') as any) as SVGElement, anchors: [this.gridAnchor] });
		layers.push({ g: (document.getElementById('otherVoicesGroup') as any) as SVGElement, anchors: [this.otherAnchor] });
		layers.push({ g: (document.getElementById('secondaryVoicesGroup') as any) as SVGElement, anchors: [this.secondAnchor] });
		layers.push({ g: (document.getElementById('mainVoiceGroup') as any) as SVGElement, anchors: [this.firstAnchor] });
		layers.push({ g: (document.getElementById('workButtonsGroup') as any) as SVGElement, anchors: [this.workButtonsGroup] });
		this.popupLayer = { g: (document.getElementById('popupGroup') as any) as SVGElement, anchors: [this.popupMenuGroup, this.popupSubMenuGroup, this.popupSubSubMenuGroup] };
		layers.push(this.popupLayer);
		return layers;
	}
	resetWholeProject() {
		this.resetFieldSize();
		this.resetButtons();
		this.resetGrid();
		this.resetNotes();
		this.tileLevel.resetModel();
	}
	patternDuration(pattern: ZvoogPattern): number {
		return duration2time(pattern.tempo, duration384(pattern.meter));
	}
	voiceDuration(voice: ZvoogVoice): number {
		var ms: number = 0;
		for (var i = 0; i < voice.chunks.length; i++) {
			ms = ms + this.patternDuration(voice.chunks[i]);
		}
		return ms;
	}
	trackDuration(track: ZvoogTrack): number {
		var ms: number = 0;
		for (var i = 0; i < track.voices.length; i++) {
			var t = this.voiceDuration(track.voices[i]);
			if (t > ms) {
				ms = t;
			}
		}
		return ms;
	}
	wholeDuration(schedule: ZvoogSchedule): number {
		var ms: number = 0;
		for (var i = 0; i < schedule.tracks.length; i++) {
			var t = this.trackDuration(schedule.tracks[i]);
			if (t > ms) {
				ms = t;
			}
		}
		return ms;
	}
	resetFieldSize() {
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
		this.keyPatternAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
		this.keyPatternAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
		this.meterPatternAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
		this.meterPatternAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
		this.workButtonsGroup.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
		this.workButtonsGroup.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;
		this.backgroundAnchor.ww = this.tileLevel.innerWidth / this.tileLevel.tapSize;
		this.backgroundAnchor.hh = this.tileLevel.innerHeight / this.tileLevel.tapSize;


	}
	resetRandom() {
		let testSong: TestSong = new TestSong();

		this.currentSong = testSong.createRandomSchedule();
		this.resetWholeProject()
	}
}
