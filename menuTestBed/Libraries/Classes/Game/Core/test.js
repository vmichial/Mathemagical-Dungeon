
	var img1 = new Image();
	var img2 = new Image();
	var bgImg = new Image();
	var music = new Audio();

	img1.src = "basicButtonBlue.png";
	img2.src = "basicButtonGreen.png";
	bgImg.src = "BG1.jpg";
	music.src = "music.mp3";
	// 1024, 768
	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext('2d');
	
	var button1 = new Button(ctx, img1, 0, canvas.height/2, 200, 100);
	var button2 = new Button(ctx, img2, canvas.width/2, canvas.height/2, 200, 100);
	var buttons = new Array(button1, button2);
	var menu = new Menu(ctx, bgImg, music, buttons);
	menu.init();
	canvas.addEventListener("mousedown", menu.clickHandler, false);
	window.addEventListener("keydown", menu.keyDownHandler, false);
	var loop = setInterval(menu.draw, 1000/60);
	

