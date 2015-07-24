function GeoTriangle(canvas, orig, orientationUp, sideSize, minSize, color, colorFill) {
	this.orig		= orig;
	this.orientationUp	= orientationUp;
	this.sideSize		= sideSize;
	this.minSize		= minSize;
	this.color		= color		|| GeoTriangle.defaultLineColor;
	this.defaultColor	= color		|| GeoTriangle.defaultLineColor;
	this.defaultColorFill	= colorFill	|| undefined;
	this.colorFill		= colorFill	|| undefined;
	this.canvas		= canvas;

	this.height = GeoTriangle.height(this.sideSize);

	this.A = this.orig;
	if(this.orientationUp) {
		this.B = this.orig.subtractX(this.sideSize/2).addY(this.height);
		this.C = this.orig.addX(this.sideSize/2).addY(this.height);
	} else {
		this.C = this.orig.subtractX(this.sideSize/2).subtractY(this.height);
		this.B = this.orig.addX(this.sideSize/2).subtractY(this.height);
	}

	if(this.sideSize / 2 > this.minSize) {
		this.hasChildren = true;
		this.createChildren();
	}
}

GeoTriangle.defaultLineColor = "#aaaaaa";

GeoTriangle.height = function(sideSize) {
	return (sideSize/2) * Math.pow(3, 1/2);
};

GeoTriangle.sign = function(p1, p2, p3) {
	return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}

GeoTriangle.prototype = {
	getFromPath:	function(path) {
		if(path && path.length >= 2) {
			var subPath = path.substr(0, 2);
			path = path.substr(2);
			if(this.hasChildren && subPath in this.children) {
				if(path.length == 0)
					return this.children[subPath];
				else
					return this.children[subPath].getFromPath(path);
			}
		}
	},
	colorizePath:	function(path) {
		if(path.length >= 2) {
			var subPath = path.substr(0, 2);
			path = path.substr(2);
			if(this.hasChildren && subPath in this.children) {
				this.children[subPath].color		= "rgba(255, 0, 0, 0.5)";
				this.children[subPath].colorFill	= "rgba(255, 0, 0, 0.1)";
				this.children[subPath].draw(true);
				this.children[subPath].colorizePath(path);
			}
		}
	},
	createPath:	function(point) {
		var path = "";
		if(this.hasChildren) {
			Object.keys(this.children).forEach(function(key) {
				if(this.children[key].contains(point))
					path = key;
			}.bind(this));
			path += this.children[path].createPath(point);
		}
		return path;
	},
	contains:	function(point) {
		var b1 = GeoTriangle.sign(point, this.A, this.B) < 0;
		var b2 = GeoTriangle.sign(point, this.B, this.C) < 0;
		var b3 = GeoTriangle.sign(point, this.C, this.A) < 0;

		return ((b1 == b2) && (b2 == b3));
	},
	nearstVertice:	function(point) {
		var vertices = {}
		vertices[parseInt("" + point.subtract(this.A).module() * 100000)] = "A";
		vertices[parseInt("" + point.subtract(this.B).module() * 100000)] = "B";
		vertices[parseInt("" + point.subtract(this.C).module() * 100000)] = "C";

		var min = Math.min.apply(Math, Object.keys(vertices));
		return vertices[min];
	},
	resetColor:	function() {
		this.color = this.defaultColor;
		this.colorFill = this.defaultColorFill;
		if(this.hasChildren)
			Object.keys(this.children).forEach(function(key) {
				this.children[key].resetColor();
			}.bind(this));
	},
	clear:		function() {
		var context = this.canvas.getContext('2d');
		context.clearRect(0, 0, canvas.width, canvas.height);
		this.resetColor();
	},
	draw:		function(notRecursive) {
		var context = this.canvas.getContext('2d');
		context.beginPath();
		context.moveTo(this.A.x, this.A.y);
		context.lineTo(this.B.x, this.B.y);
		context.lineTo(this.C.x, this.C.y);
		context.lineTo(this.A.x, this.A.y);
		context.strokeStyle = this.color;
		context.closePath();
		if(this.colorFill) {
			context.fillStyle = this.colorFill;
			context.fill();
		}
		context.stroke();
		if(!notRecursive && this.hasChildren) {
			Object.keys(this.children).forEach(function(key) {
				this.children[key].draw();
			}.bind(this));
		}
	},
	createChildren:	function() {
		this.children = {
			"00": new GeoTriangle(
				this.canvas,
				this.orig.addY(this.height * (this.orientationUp ? 1 : -1)),
				!this.orientationUp,
				this.sideSize / 2,
				this.minSize
			),
			"01": new GeoTriangle(
				this.canvas,
				this.orig,
				this.orientationUp,
				this.sideSize / 2,
				this.minSize/*,
				"#ff0000"*/
			),
			"10": new GeoTriangle(
				this.canvas,
				this.orig.addX((this.orientationUp ? -1 : 1) * this.sideSize/4).addY((this.orientationUp ? 1 : -1) * this.height/2),
				this.orientationUp,
				this.sideSize / 2,
				this.minSize/*,
				"#00ff00"*/
			),
			"11": new GeoTriangle(
				this.canvas,
				this.orig.addX((this.orientationUp ? 1 : -1) * this.sideSize/4).addY((this.orientationUp ? 1 : -1) * this.height/2),
				this.orientationUp,
				this.sideSize / 2,
				this.minSize/*,
				"#0000ff"*/
			),
		};
	}
};
