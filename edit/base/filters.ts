class ZvoogFxGain implements ZvoogEffect {
	base: GainNode;
	params: ZvoogParameter[];
	//props: ZvoogProperty[];
	gainParam: ZvoogParameter;
	vals:ZvoogValue[]=[];
	prepare(audioContext: AudioContext): void {
		this.base = audioContext.createGain();
		var me = this;
		this.gainParam = {
			label: () => { return "level"; }
			, cancelScheduledValues: (cancelTime: number) => { me.base.gain.cancelScheduledValues(cancelTime); }
			, linearRampToValueAtTime: (value: number, endTime: number) => { me.base.gain.linearRampToValueAtTime(value, endTime); }
			, setValueAtTime: (value: number, startTime: number) => { me.base.gain.setValueAtTime(value, startTime); }
		};
		this.params = [];
		this.params.push(this.gainParam);
		//this.props = [];
	}
	getInput(): AudioNode {
		return this.base;
	}
	getOutput(): AudioNode {
		return this.base;
	}
	getParams(): ZvoogParameter[] {
		return this.params;
	}
	getValues(): ZvoogValue[] {
		return this.vals;
	}
	busy(): number {
		return 0;
	}
	label(): string {
		return 'Volume';
	}
}
