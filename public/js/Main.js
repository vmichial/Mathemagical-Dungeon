
var canvas, ctx;
var mouse={ x: 0, y: 0 };

var s_board;
var cat;


$(document).ready(function() {
	canvas=$('#canvas')[0];
	ctx=canvas.getContext('2d');


	s_board=new Scene();




	tex=new Texture('nyanCat', { x: 64, y: 64 });
	cat=new Entity('ent_nyancat');
	cat.addTex(tex);

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
});