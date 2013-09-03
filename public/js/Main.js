
var canvas, ctx;
var mouse={ x: 0, y: 0 };

var cat;


window.onload=function() { // Makes sure the website is loaded before running code
	canvas=document.getElementById('canvas');
	ctx=canvas.getContext('2d');


	cat=new Ent('ent_nyancat');
	cat.addTexture('nyanCat');
	cat.addTexture('nyanCat', { x: 64, y: 64 });

	cat._pos={ x: 100, y: 100 };

	setInterval(function() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		cat.move({ x: 200, y: 200 });
		cat.face({ x: mouse.x, y: mouse.y });
		cat.step();
		cat.draw(ctx);
	}, 1000/g_fpsEngine);

	canvas.onmousemove=function(e) {
		mouse.x=e.offsetX;
		mouse.y=e.offsetY;
	}
};