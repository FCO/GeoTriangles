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

var t = new GeoTriangle(canvas, new Point2D(500, 0), true, 750, 25);
//var t = new GeoTriangle(canvas, new Point2D(500, 700), false, 750, 10);
t.draw();

//var reverse = {
//	"0000": {
//		"A":	function(path) {
//			return path.replace(/0000$/, "0100");
//		},
//		"B":	function(path) {
//			if(path.substr(-6, 2) == "00") {
//				path = path.replace(/000000$/, "001000");
//			} else {
//				path = path.replace(/0000$/, "1000");
//			}
//			return path;
//		},
//		"C":	function(path) {
//			if(path.substr(-6, 2) == "00") {
//				path = path.replace(/000000$/, "001100");
//			} else {
//				path = path.replace(/0000$/, "1100");
//			}
//			return path;
//		}
//	},
//	"0100": {
//		"A":	function(path) {
//			return path.replace(/0100$/, "0000");
//		},
//		"B":	function(path) {
//			if(path.substr(-6, 2) == "00") {
//				path = path.replace(/000100$/, "101100");
//			} else if(path.substr(-6, 2) == "11") {
//				path = path.replace(/110100$/, "001000");
//			} else {
//				path = path.replace(/0100$/, "1100");
//			}
//			return path;
//		},
//		"C":	function(path) {
//			if(path.substr(-6, 2) == "00") {
//				path = path.replace(/000100$/, "111000");
//			} else if(path.substr(-6, 2) == "11") {
//				path = path.replace(/110100$/, "001000");
//			} else {
//				path = path.replace(/0100$/, "1100");
//			}
//			return path;
//		}
//	},
//};

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
		min.color = "green";
		min.colorFill = "rgba(0, 255, 0, 0.5)";
		min.draw(true);

		//if(path.substr(-4) in reverse && min.nearstVertice(mousePos) in reverse[path.substr(-4)]) {
		//	var opositePath = reverse[path.substr(-4)][min.nearstVertice(mousePos)](path);
		//	var oposite = t.getFromPath(opositePath);
		//	oposite.color = "green";
		//	oposite.colorFill = "rgba(0, 255, 0, 0.5)";
		//	oposite.draw(true);
		//}

		var oposite = t.getFromPath(positionFrom(path, min.nearstVertice(mousePos)));
		oposite.color = "green";
		oposite.colorFill = "rgba(0, 255, 0, 0.5)";
		oposite.draw(true);

		var center = min[min.nearstVertice(mousePos)];

		var context = canvas.getContext('2d');
		context.beginPath();
		context.arc(center.x, center.y, min.sideSize/10, 0, 2 * Math.PI, false);
		context.fillStyle = "rgba(0, 255, 0, 0.5)";
		context.fill();
		context.strokeStyle = 'green';
		context.stroke();
	}
}, false);
