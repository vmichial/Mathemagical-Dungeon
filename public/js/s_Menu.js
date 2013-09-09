/*
			Menu Scene
*/


//		Setting the Menu scene
function initMenu() {
	// Define a function that will make a pause menu [dis]appear
	s_menu.gamePaused=function(state) {
		// "this" refers to s_menu
		this.getEnt('pause-bg').getTex('menuPause').reverse=!state;
		this.getEnt('pause-button0').hide=!state;
		this.getEnt('pause-button1').hide=!state;
		this.getEnt('pause-button2').hide=!state;
		this.getEnt('pause-button3').hide=!state;
	}

	/*
		As you can see, there is refrence to an entity & texture
			in the function above.
		
		Textures alone dont do much. They need to be attached
			to an entity to have some way to know their own
			position & other properties.
	*/

	// Making a new entity that is the background
	var ent_pause=new Entity('pause-bg');
	ent_pause.hitbox=0; // Dont want the BG to be clickable

	// Making a new texture for the background entity
	var tex_pause=new Texture('menuPause', { x: 800, y: 600 });
	tex_pause.setFPS(60);
	tex_pause.loop=false; // Configuring this menu's animation
	tex_pause.reverse=true;
	tex_pause.mid={ x: 0, y: 0 };

	ent_pause.addTex(tex_pause); // Add the texture to the ent
	s_menu.addEnt(ent_pause); // Add the ent to the menu scene



	/*
		Now that the background is done, lets make some buttons
			with a hover effect.
	*/

	// Making 4 buttons for this menu
	for(var i=0; i<4; ++i) { // Looping to make 4 buttons entity
		var ent_button=new Entity('pause-button'+i);
		ent_button.translate({ x: 800/2+12, y: 600/8*(i+3) }); // Move it to the center-ish
		ent_button.hitbox={ x: 313, y: 49 }; // Clickable button needs a hitbox
		ent_button.hide=true; // Start it hidden

		// Make new textures & add them
		var tex_selectoff=new Texture('selectOff');
		var tex_selecton=new Texture('selectOn');
		ent_button.addTex(tex_selectoff);
		ent_button.addTex(tex_selecton);

		// Since we have pointers to the textures, we can still
		//		change them with the old variable
		tex_selecton.hide=true; // Hide the "on" texture
		tex_selectoff.scale={ x: .6, y: .75 }; // Lets resize them
		tex_selecton.scale={ x: .6, y: .75 };

		s_menu.addEnt(ent_button);
	}



	/*
		Each object has a method called step().  That will animate
			the object or think for just 1 frame.

		There is a function variable onStep(), which you can program
			to do whatever you want [for that 1 frame].
			
		Note: onStep() is the one & only event you can set.
	*/

	// Create a variable local only to s_menu
	s_menu.buttonChoose=-1; // Remember chosen button

	// Set the event's function
	s_menu.onStep=function() { // onStep() is 1 of the 2 customizable event
		var selected=s_menu.clickWhat(mouse);
		if(selected!=this.buttonChoose) { // Typical swap
			if(-1<this.buttonChoose) {
				var last=this.getEnt(this.buttonChoose);
				last.getTex('selectOff').hide=false;
				last.getTex('selectOn').hide=true;
			}
			if(-1<selected) {
				var now=this.getEnt(selected);
				now.getTex('selectOff').hide=true;
				now.getTex('selectOn').hide=false;
			}
			this.buttonChoose=selected;
		}

		// The default step, which steps all animations.
		//		If you define onStep, this will not be called by default.
		//		You then have to manually call this in your own onStep()
		this.stepDefault();
	}
}