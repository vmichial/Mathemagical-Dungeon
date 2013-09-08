/*
			Game Scene
*/


// UI stuff like cursor or score
function initGame() {
	for(var i=0; i<8; ++i) {
		var ent_cat=new Entity('ent_cat'+i);
		ent_cat.vel=1;

		var tex_cat=new Texture('nyanCat', { x: 64, y: 64 });

		ent_cat.addTex(tex_cat);
		ent_cat.translate({ x: Math.random()*700+50, y: Math.random()*500+50 });
		ent_cat.face(Math.random()*Math.PI*2);

		s_game.addEnt(ent_cat);


		// Lets make the cats move randomly
		ent_cat.dest={ x: ent_cat.pos.x, y: ent_cat.pos.y }; // Remember a destination
		ent_cat.onStep=function() {
			var reached=this.move(this.dest);
			if(reached) {
				this.dest.x=this.pos.x+Math.random()*64-32; // Choose a random spot
				this.dest.y=this.pos.y+Math.random()*64-32;
			}
		}
	}
}