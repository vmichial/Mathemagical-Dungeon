/*
			Game Scene
*/


// Game stuff like cats, bullets, even the world, but this sample,
//		the world will be in a different scene.
function initGame() {
	for(var i=0; i<8; ++i) {
		var ent_cat=new Entity('ent_cat'+i);
		ent_cat.vel=1;

		var tex_cat=new Texture('nyanCat', { x: 64, y: 64 });
		ent_cat.addTex(tex_cat);
		s_game.addEnt(ent_cat);


		// Remember the position in the grid based world
		ent_cat.tilePos={
			x: Math.round(Math.random()*s_world.size.x), // Random initial position
			y: Math.round(Math.random()*s_world.size.y)
		};
		ent_cat.translate(s_world.getTilePos(ent_cat.tilePos)); // Convert to XY coord & translate there

		ent_cat.face(Math.random()*Math.PI*2);


		// Lets make the cats move randomly
		ent_cat.dest={ x: ent_cat.pos.x, y: ent_cat.pos.y }; // Remember a destination
		ent_cat.onStep=function() { // onStep() is 1 of the 2 customizable event
			this.turn(this.dest);
			var reached=this.move(this.dest);
			if(reached) {
				var dir=Math.round(Math.random()*4); // Random assign a direction
				var newX=this.tilePos.x+(dir==0?1:dir==1?-1:0);
				var newY=this.tilePos.y+(dir==2?1:dir==3?-1:0);

				this.tilePos={ // Make sure it doesnt go off the world
					x: (newX<0?0:(s_world.size.x<=newX?s_world.size.x-1:newX)),
					y: (newY<0?0:(s_world.size.y<=newY?s_world.size.y-1:newY))
				}; // This will be included in the library in the future

				this.dest=s_world.getTilePos(this.tilePos)
			}

			// The default step, which steps all animations.
			//		If you define onStep, this will not be called by default.
			//		You then have to manually call this in your own onStep()
			this.stepDefault();
		}
	}
}