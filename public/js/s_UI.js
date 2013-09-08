/*
			UI Scene
*/


// UI stuff like cursor or score
function initUI() {
	var ent_target=new Entity('ent_target');
	ent_target.vel=50; // Make the target lag behind, but still move fast

	var tex_cursor=new Texture('cursorTarget', { x: 63, y: 63 });
	tex_cursor.setFPS(60);

	s_ui.addEnt(ent_target);
	ent_target.addTex(tex_cursor);

	s_ui.onStep=function() {
		// Now, lets make the cursor follow the mouse.
		// Later, make it lock on to an enemy.
		this.getEnt('ent_target').move(mouse);
	}
}