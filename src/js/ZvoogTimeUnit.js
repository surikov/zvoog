console.log('ZvoogTimeUnit v1.02');
function ZvoogTimeUnit(c, d) {
	this.count = 3;
	if (c) {
		this.count = c;
	}
	this.division = 4;
	if (d) {
		this.division = d;
	}
	return this;
}
