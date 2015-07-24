var canvas = document.querySelector("#myCanvas");

function getMousePos(canvas, evt) {
	var rect = canvas.getBoundingClientRect();
	return new Point2D(evt.clientX - rect.left, evt.clientY - rect.top);
}

function toDec(path) {
	return path.replace(/\d{2}/g, function(match){
		return parseInt(match, 2);
	});
}

var t = new GeoTriangle(canvas, new Point2D(500, 0), true, 750, 10);
t.draw();

canvas.addEventListener('mousemove', function(evt) {
	var mousePos = getMousePos(canvas, evt);
	if(t.contains(mousePos)) {
		var path = t.createPath(mousePos);
		document.querySelector("#path").value = path;
		document.querySelector("#pathDec").value = toDec(path);
		document.querySelector("#pathInt").value = parseInt(path, 2);
		document.querySelector("#pathHex").value = parseInt(path, 2).toString(16);
		t.clear();
		t.draw();
		t.colorizePath(path);

		var min = t.getFromPath(path);

		var centerV = min.nearstVertice(mousePos);
		var center = min[centerV];
		
		var tri = [path];
		var paths = ["AB", "BC", "CA"].filter(function(item) {
			console.log("centerV: %s, item: %s", centerV, item);
			return item.indexOf(centerV) >= 0;
		});

		console.log(paths);

		Array.prototype.push.apply(tri,
			paths.map(function(item) {
				return positionFrom(path, item);
			})
		);

		tri.forEach(function(item) {
			var it = t.getFromPath(item);
			if(it) {
				it.color		= "green";
				it.colorFill		= "rgba(0, 255, 0, 0.5)";
				it.draw(true);

				var center		= it.nearstVertice(mousePos);
				var oposite		= t.getFromPath(positionFrom(item, center));
				if(oposite) {
					oposite.color		= "green";
					oposite.colorFill	= "rgba(0, 255, 0, 0.5)";
					oposite.draw(true);
				}
			}

		});

		var context = canvas.getContext('2d');
		context.beginPath();
		context.arc(center.x, center.y, min.sideSize/10, 0, 2 * Math.PI, false);
		context.fillStyle = "rgba(0, 255, 0, 0.5)";
		context.fill();
		context.strokeStyle = 'green';
		context.stroke();
	}
}, false);
