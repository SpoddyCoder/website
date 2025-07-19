//
// Experiment - Recursive Tree
//
// P.Fernihough 2011, paul@spoddycoder.com
// - feel free to use this code
// - drop me a mail to let me know
//

// variables in the global namespace = bad
// but this is just an experiment

var canvas;
var canvasContext;
var count = 0;

function drawBranch(width, direction, x, y)
{
	// recursive end check, stop when branch width is smaller than 1px & draw a leaf
	if(width < 1) {
		count ++;
		if(Math.random() < 0.5) {
			lightness = parseInt(Math.random() * 40);
			red = 10 + lightness;
			green = 30 + lightness;
			colour = "rgb("+red+","+green+",0)";
			canvasContext.fillStyle = colour;
			canvasContext.lineWidth = 1;
			canvasContext.beginPath();
			canvasContext.moveTo(x,y);
			// apply rotation & scale to bezier curve points
			r = direction;
			s = (Math.random() * 10) + 5;
			x2 = x + (Math.cos(r) * s) - (Math.sin(r) * s);
			y2 = y + (Math.sin(r) * s) + (Math.cos(r) * s);
			cp1x = x - (Math.sin(r) * s);
			cp1y = y + (Math.cos(r) * s);
			cp2x = x - (Math.sin(r) * (s*0.5));
			cp2y = y + (Math.cos(r) * (s*0.5));
			cp3x = x + (Math.cos(r) * (s*0.5));
			cp3y = y + (Math.sin(r) * (s*0.5));
			cp4x = x + (Math.cos(r) * s);
			cp4y = y + (Math.sin(r) * s);
			canvasContext.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x2, y2);
			canvasContext.bezierCurveTo(cp3x, cp3y, cp4x, cp4y, x, y);
			canvasContext.fill();
		}
		return;
	}
	// init branch
	branchChance = 0;
	while(branchChance < 0.8) {
		canvasContext.strokeStyle = "rgb(28,07,07)";
		canvasContext.lineWidth = width;
		canvasContext.beginPath();
		canvasContext.moveTo(x,y);
		tx = x + (Math.sin(direction) * (5 + (width * 0.5)));
		ty = y + (Math.cos(direction) * (5 + (width * 0.5)));
		canvasContext.lineTo(tx, ty);
		canvasContext.stroke();
		x = tx;
		y = ty;
		direction += (0.5 - Math.random()) * 0.2;
		width -= width * 0.03;
		branchChance = Math.random();
	}
	if(Math.random() < 0.6) {
		// draw 2 branches
		createNewBranch(width, direction, x, y);
		createNewBranch(width, direction, x, y);
	} else {
		// draw 3 branches
		createNewBranch(width, direction, x, y);
		createNewBranch(width, direction, x, y);
		createNewBranch(width, direction, x, y);
	}
}
function createNewBranch(w, d, x, y)
{
	count ++;
	setTimeout(drawNewBranch, count*0.2);
	function drawNewBranch()
	{
		nbw = ((Math.random() * 0.3) + 0.6) * w;
		if(Math.random() < 0.5) {
			nbd = d + (Math.PI/8) + ((0.5 - Math.random()) * (Math.PI/8));
		} else {
			nbd = d - (Math.PI/8) + ((0.5 - Math.random()) * (Math.PI/8));
		}
		drawBranch(nbw, nbd, x, y);
	}
}

function startRecursiveTree()
{
	// get canvas
	canvas = document.getElementById("recursive-tree-canvas");
	canvasContext = canvas.getContext("2d");
	// draw background
	linearGradient = canvasContext.createLinearGradient(0,0,canvas.width,canvas.height);
	linearGradient.addColorStop(0,'blue');
	linearGradient.addColorStop(1,'white');
	canvasContext.fillStyle = linearGradient;
	canvasContext.fillRect(0,0,canvas.width,canvas.height);
	// start tree drawing
	canvasContext.lineCap = "round";
	drawBranch(50, Math.PI, canvas.width*0.5, canvas.height);
}

startRecursiveTree();