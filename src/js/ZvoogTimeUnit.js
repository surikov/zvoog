console.log('ZvoogTimeUnit v1.02');
function ZvoogTimeUnit(c, d) {
	this.count = 3;
	this.division = 4;
	if (c) {
		this.count = c;
	}	
	if (d) {
		this.division = d;
	}
	return this;
}
