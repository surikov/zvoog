console.log('StoreTools v1.02');
function StoreTools() {
	this.saveObject2localStorage = function (name, o) {
		console.log('saveObject2localStorage', name, o);
		this.localStorage.setItem(name, JSON.stringify(o));
	}
	this.readObjectFromlocalStorage = function (name) {
		var o = null;
		try {
			o = JSON.parse(this.localStorage.getItem(name));
		} catch (ex) {
			console.log(ex);
			return {};
		}
		return o;
	}
	this.saveText2localStorage = function (name, text) {
		console.log('saveText2localStorage', name, text);
		this.localStorage.setItem(name, text);
	}
	this.readTextFromlocalStorage = function (name) {
		var o = '';
		try {
			o = this.localStorage.getItem(name);
		} catch (ex) {
			console.log(ex);
		}
		return o;
	}
	return this;
}