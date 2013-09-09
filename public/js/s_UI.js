/*
			UI Scene
*/


// UI stuff like cursor or score
function initUI() {
	var ent_target=new Entity('ent_target');
	ent_target.vel=50; // Make the target lag behind, but still move fast
	ent_target.translate({ x: 400, y: 640 }); // Throw it off screen

	var tex_cursor=new Texture('cursorTarget', { x: 63, y: 63 });
	tex_cursor.setFPS(60);

	s_ui.addEnt(ent_target);
	ent_target.addTex(tex_cursor);


	// Make it target something
	s_ui.target=undefined;
	s_ui.onStep=function() { // onStep() is 1 of the 2 customizable event
		var who=s_game.hitPos(mouse); // Who are you targeting
		if(who!=-1) {
			this.target=s_game.getEnt(who);
		}
		if(s_ui.target!=undefined) {
			this.getEnt('ent_target').move(this.target.pos);
		}

		// The default step, which steps all animations.
		//		If you define onStep, this will not be called by default.
		//		You then have to manually call this in your own onStep()
		this.stepDefault();
	}
}