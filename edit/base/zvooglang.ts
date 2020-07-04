class ZvoogLang {
	_labels: { key: string, label: string }[]=[];
	constructor() {
		this._labels.push({ key: 'undo', label: 'Undo' });
		this._labels.push({ key: 'redo', label: 'Redo' });
		this._labels.push({ key: 'menu', label: '...' });
		this._labels.push({ key: 'layersMenuTitle', label: 'Layers' });
	}
	label(key: string): string {
		var r = '?' + key;
		for (var i = 0; i < this._labels.length; i++) {
			if (key == this._labels[i].key) {
				return this._labels[i].label;
			}
		}
		return r;
	}
}

