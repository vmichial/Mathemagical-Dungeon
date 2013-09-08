
var canvas, ctx;
var mouse={ x: 0, y: 0 };



$(document).ready(function() {
	canvas=$('#canvas')[0];
	ctx=canvas.getContext('2d');




	canvas.onmousemove=mouseMove; // Update mouse position
	canvas.onmouseup=mouseClick; // Do stuff on click release
	document.onkeyup=kbKey; // Do stuff on keyboard release


	// Now we need to configure how each scene is treated.
	//		In this case, game & UI scene only update when not paused.
	setInterval(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);


	}, 1000/g_fpsEngine);
});


var mouseBrowser=0; // Browser detection
function mouseMove(e) { // Update the mouse position
	switch(mouseBrowser) {
		case 0:
			mouseBrowser=(e.offsetX==undefined?2:1);
			break;
		case 1:
			mouse.x=e.offsetX;
			mouse.y=e.offsetY;
			break;
		case 2:
			mouse.x=e.layerX-canvas.offsetLeft;
			mouse.y=e.layerY-canvas.offsetTop;
			break;
	}
}
function mouseClick(e) { // Clicking
	switch(mouseBrowser) {
		case 0:
			mouseBrowser=(e.offsetX==undefined?2:1);
			break;
		case 1:
			mouse.x=e.offsetX;
			mouse.y=e.offsetY;
			break;
		case 2:
			mouse.x=e.layerX;
			mouse.y=e.layerY;
			break;
	}
}

function kbKey(e) { // Keyboard keys
	switch(e.keyCode) {
	}
}