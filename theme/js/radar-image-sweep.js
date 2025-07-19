//
// Radar Image Sweep expt
// By Paul Fernihough, 2012
// http://spoddycoder.com
//
function Radar_Image_Sweep(image_url, canvas_id) 
{
	// props
	var canvas;
	var ctx;
	var loopCnt;
	var radarImage;
	var origX;
	var origY;
	var radius;
	
	// init
	canvas = document.getElementById(canvas_id);
	ctx = canvas.getContext("2d");
	ctx.lineWidth = "1";
	origX = canvas.width * 0.5;
	origY = canvas.height * 0.5;
	radius = canvas.width * 0.5;
	loopCnt = 0;
	radarImage = new Image();
	radarImage.src = image_url;
	radarImage.onload = function() {
		loop();
	}
	
	// animation loop
	function loop() 
	{
		ctx.save();
		// clear canvas
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		// draw radar arc
		ctx.beginPath();
		ctx.moveTo(origX, origY);
		ctx.arc(origX, origY, radius, (loopCnt*0.1), (Math.PI*0.2)+(loopCnt*0.1), false);
		ctx.closePath();
		ctx.fill();
		// mask and draw image
		ctx.clip();
		ctx.drawImage(radarImage, 0, 0);
		// repeat
		ctx.restore();
		loopCnt ++;
		setTimeout(loop, 10);
	}
}