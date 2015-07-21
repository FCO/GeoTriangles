function Point2D(x, y) {
	this.x = x;
	this.y = y;
}

Point2D.prototype = {
	add:		function(point) {
		return new Point2D(this.x + point.x, this.y + point.y);
	},
	addX:		function(k) {
		return this.add(new Point2D(k, 0));
	},
	addY:		function(k) {
		return this.add(new Point2D(0, k));
	},
	subtract:	function(point) {
		return this.add(point.inverse());
	},
	subtractX:	function(k) {
		return this.addX(-k);
	},
	subtractY:	function(k) {
		return this.addY(-k);
	},
	inverse:	function() {
		return this.multiply(-1);
	},
	multiply:	function(k) {
		return new Point2D(this.x * k, this.y * k);
	},
	module:		function() {
		return Math.pow(Math.pow(this.x, 2) + Math.pow(this.y, 2), 1/2);
	}
};
