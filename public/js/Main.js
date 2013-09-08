
var canvas, ctx;
var mouse={ x: 0, y: 0 };

var s_game, s_ui, s_menu;
var gamePaused=false;


$(document).ready(function() {
	canvas=$('#canvas')[0];
	ctx=canvas.getContext('2d');


	// Example of creating 3 scenes
	s_game=new Scene();
	s_menu=new Scene();
	s_ui=new Scene();


	// Functions where each part is defined
	initMenu();
	initGame();
	initUI();


	canvas.onmousemove=mouseMove; // Update mouse position
	canvas.onmouseup=mouseClick; // Do stuff on click release
	document.onkeyup=kbKey; // Do stuff on keyboard release


	// Now we need to configure how each scene is treated.
	//		In this case, game & UI scene only update when not paused.
	setInterval(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// Display a message
		ctx.font='24px Arial';
		ctx.fillStyle='#ffffff';
		if(gamePaused) ctx.fillText('{space} = Exit menu', 4, 24);
		else {
			ctx.fillText('{space} = Open menu', 4, 24);
			ctx.fillText('   Target your foes!', 4, 52);
		}


		// Only update the menu scene when paused
		if(!gamePaused) {
			s_game.step();
			s_ui.step();
		}
		s_menu.step();

		// Always draw em all though
		s_game.draw(ctx);
		s_ui.draw(ctx);
		s_menu.draw(ctx);
	}, 1000/g_fpsEngine);
})


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
			mouse.x=e.layerX-canvas.offsetLeft;
			mouse.y=e.layerY-canvas.offsetTop;
			break;
	}
}

function kbKey(e) { // Keyboard keys
	switch(e.keyCode) {
		case ' '.charCodeAt(0): // Space
			gamePaused=!gamePaused;
			s_menu.pause(gamePaused);
			break;
	}
}