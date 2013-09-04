
var canvas, ctx;
var mouse={ x: 0, y: 0 };

var r_board;
var cat;

var g_boardAngle=(Math.PI*0.152).toFixed(4);


$(document).ready(function() {
	canvas=$('#canvas')[0];
	ctx=canvas.getContext('2d');


	// Make a new game board

	r_board=$('#board'); // Point to the game board
	r_board.css('transform', 'rotate('+(g_boardAngle)+'rad)');
	var board='', x=6, y=8, z=1, i;

	for(j=0; j<x; ++j) {
		var r_row=$('<div>', {
			class: 'tileRow'
		}).appendTo(r_board);
		r_row.css('padding-left', (x-j)*32);

		for(var k=0; k<y; ++k) {
			var r_tile=$('<div>', {
				class: 'tile t_greyF'
			}).appendTo(r_row);
			r_tile.css('margin-right', -44);
			r_tile.css('margin-bottom', -60);
			r_tile.css('transform', 'rotate('+(-g_boardAngle)+'rad) translate3d( 0px, 0px, 0px)');
		}
	}
	//.on('click',function(){if($(this).



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
});