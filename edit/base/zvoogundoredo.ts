class UndoRedoChangeTitle implements UndoRedoAction {
	props: UndoRedoChangeProjectTitleProperties;

	constructor(o: UndoRedoChangeProjectTitleProperties) {
		this.props = o;
	}
	undo(app: ZvoogApp): void {
		app.currentSong.title = this.props.oldTitle;
	};
	redo(app: ZvoogApp): void {
		app.currentSong.title = this.props.newTitle;
	};
}
class UndoRedoChangeDescription implements UndoRedoAction {
	props: UndoRedoProjectDescriptionProperties;

	constructor(o: UndoRedoProjectDescriptionProperties) {
		this.props = o;
	}
	undo(app: ZvoogApp): void {
		app.currentSong.description = this.props.oldDescription;
	};
	redo(app: ZvoogApp): void {
		app.currentSong.description = this.props.newDescription;
	};
}
class UndoRedoMoveTrack implements UndoRedoAction {
	props: UndoRedoMoveVoiceProperties;

	constructor(o: UndoRedoMoveVoiceProperties) {
		this.props = o;
	}
	undo(app: ZvoogApp): void {
		//var tracks: ZvoogTrack[] = app.currentSong.tracks.splice(this.props.newTrackPosition, 1);
		//app.currentSong.tracks.splice(this.props.oldTrackPosition, 0, tracks[0]);
		app.currentSong.selectedTrack=this.props.oldTrackPosition;
		app.currentSong.selectedVoice=this.props.oldVoicePosition;
	};
	redo(app: ZvoogApp): void {
		//var tracks: ZvoogTrack[] = app.currentSong.tracks.splice(this.props.oldTrackPosition, 1);
		//app.currentSong.tracks.splice(this.props.newTrackPosition, 0, tracks[0]);
		app.currentSong.selectedTrack=this.props.newTrackPosition;
		app.currentSong.selectedVoice=this.props.newVoicePosition;
	};
}
class UndoRedoMoveVoice implements UndoRedoAction {
	props: UndoRedoMoveVoiceProperties;
	constructor(o: UndoRedoMoveVoiceProperties) {
		this.props = o;
	}
	undo(app: ZvoogApp): void {
		//var tracks: ZvoogTrack[] = app.currentSong.tracks.splice(this.props.newTrackPosition, 1);
		//app.currentSong.tracks.splice(this.props.oldTrackPosition, 0, tracks[0]);
		//var voices: ZvoogVoice[] = tracks[0].voices.splice(this.props.newVoicePosition, 1);
		//tracks[0].voices.splice(this.props.oldTrackPosition, 0, voices[0]);
		app.currentSong.selectedTrack=this.props.oldTrackPosition;
		app.currentSong.selectedVoice=this.props.oldVoicePosition;
	};
	redo(app: ZvoogApp): void {
		//var tracks: ZvoogTrack[] = app.currentSong.tracks.splice(this.props.oldTrackPosition, 1);
		//app.currentSong.tracks.splice(this.props.newTrackPosition, 0, tracks[0]);
		//var voices: ZvoogVoice[] = tracks[0].voices.splice(this.props.oldVoicePosition, 1);
		//tracks[0].voices.splice(this.props.newTrackPosition, 0, voices[0]);
		app.currentSong.selectedTrack=this.props.newTrackPosition;
		app.currentSong.selectedVoice=this.props.newVoicePosition;
	};
}
class UndoRedoBunch implements UndoRedoAction {
	props: UndoRedoBunchProperties;
	constructor(o: UndoRedoBunchProperties) {
		this.props = o;
	}
	undo(app: ZvoogApp): void {
		for (var i = 0; i < this.props.commands.length; i++) {
			var c = this.props.commands[this.props.commands.length - i - 1];
			var a: UndoRedoAction | null = app.undoRedo.createUndoRedoAction(c);
			if (a) a.undo(app);
		}
	};
	redo(app: ZvoogApp): void {
		for (var i = 0; i < this.props.commands.length; i++) {
			var c = this.props.commands[i];
			var a: UndoRedoAction | null = app.undoRedo.createUndoRedoAction(c);
			if (a) a.redo(app);
		}
	};
}
class ZvoogUndoRedo {
	app: ZvoogApp;
	constructor(app: ZvoogApp) {
		this.app = app;
	}
	addRedo(command: UndoRedoCommand) {
		this.app.currentSong.macros.length = this.app.currentSong.macroPosition;
		this.app.currentSong.macros.push(command);
		this.doRedo();
	}
	doRedo(): XYZ | null {
		if (this.app.currentSong.macros.length > 0 && this.app.currentSong.macroPosition < this.app.currentSong.macros.length) {
			var command: UndoRedoCommand = this.app.currentSong.macros[this.app.currentSong.macroPosition];
			var a: UndoRedoAction | null = this.app.undoRedo.createUndoRedoAction(command);
			if (a) {
				a.redo(this.app);
				this.app.currentSong.macroPosition++;
				this.app.resetWholeProject();
				return command.point;
			} else {
				console.log('wrong redo', this.app.currentSong.macros[this.app.currentSong.macroPosition]);
				return null;
			}
		} else {
			console.log('wrong redo position', this.app.currentSong.macroPosition, this.app.currentSong.macros.length);
			return null;
		}
	}
	doUndo(): XYZ | null {
		if (this.app.currentSong.macros.length > 0 && this.app.currentSong.macroPosition > 0 && this.app.currentSong.macroPosition <= this.app.currentSong.macros.length) {
			var command: UndoRedoCommand = this.app.currentSong.macros[this.app.currentSong.macroPosition - 1];
			var a: UndoRedoAction | null = this.app.undoRedo.createUndoRedoAction(command);
			if (a) {
				a.undo(this.app);
				this.app.currentSong.macroPosition--;
				this.app.resetWholeProject();
				return command.point;
			} else {
				console.log('wrong undo', this.app.currentSong.macros[this.app.currentSong.macroPosition]);
				return null;
			}
		} else {
			console.log('wrong undo position', this.app.currentSong.macroPosition, this.app.currentSong.macros.length);
			return null;
		}
	}
	createUndoRedoAction(command: UndoRedoCommand): UndoRedoAction | null {
		var r: UndoRedoAction | null = null;
		if (command) {
			switch (command.key) {
				case undoRedoChangeProjectTitle: {
					r = new UndoRedoChangeTitle(command.properties as UndoRedoChangeProjectTitleProperties);
					break;
				}
				case undoRedoChangeProjectDescription: {
					r = new UndoRedoChangeDescription(command.properties as UndoRedoProjectDescriptionProperties);
					break;
				}
				case undoRedoMoveVoice: {
					r = new UndoRedoMoveVoice(command.properties as UndoRedoMoveVoiceProperties);
					break;
				}
				case undoRedoMoveTrack: {
					r = new UndoRedoMoveTrack(command.properties as UndoRedoMoveVoiceProperties);
					break;
				}
				case undoRedoBunch: {
					r = new UndoRedoBunch(command.properties as UndoRedoBunchProperties);
					break;
				}
				default: {
					break;
				}
			}
		} else {
			console.log('empty undo action');
		}
		return r;
	}
}
