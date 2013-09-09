/*
			World Scene
*/


// World stuff like blocks, floor, doors, & stuff.
function initWorld() {
	s_world.size={ x: 16, y: 10, z: 1 }; // Default size of the world

	var scale={ x: .25, y: .25 };
	var ent_tileGrey;
	var tex_tileGrey;


	// Rather than having a separate ent for each tile, we can save
	//		performance by having just 1!  This is called instancing.
	newTileSet('tileGrey'); // Push 1 set of tiles to the world


	// Useful functions
	s_world.tileToPos=tileToPos;
	s_world.tileCheckRange=tileCheckRange;
	s_world.tileFixRange=tileFixRange;



	// Instead of doing the default draw [draws everything to its on spot]
	//		We need to instance a single entity to many locations, so write
	//		a custom draw like so.
	s_world.onDraw=function(ctx) {
		for(var z=0; z<this.size.z; ++z) {
			for(var y=0; y<this.size.y; ++y) {
				for(var x=0; x<this.size.x; ++x) {
					var adjPos=this.tileToPos({ x: x, y: y, z: z });
					if(x==0&&y==0) {
						this.getEnt('ent_tilegrey-lrf').draw(ctx, adjPos);
						ctx.fillStyle="#ff0000"; // Draw a dot at the origin for reference
						ctx.fillRect(adjPos.x-4, adjPos.y-4, 8, 8);
					} else if(y==0) {
						this.getEnt('ent_tilegrey-rf').draw(ctx, adjPos);
					} else if(x==0) {
						this.getEnt('ent_tilegrey-lf').draw(ctx, adjPos);
					} else {
						this.getEnt('ent_tilegrey-f').draw(ctx, adjPos);
					}
				}
			}
		}
	}
}



function newTileSet(tileName) {
	var tex_tileObjf=new Texture(tileName+'F');
	var tex_tileObjl=new Texture(tileName+'L');
	var tex_tileObjlf=new Texture(tileName+'LF');
	var tex_tileObjlr=new Texture(tileName+'LR');
	var tex_tileObjlrf=new Texture(tileName+'LRF');
	var tex_tileObjr=new Texture(tileName+'R');
	var tex_tileObjrf=new Texture(tileName+'RF');

	var scale={ x: .25, y: .25 };
	tex_tileObjf.scale=scale;
	tex_tileObjl.scale=scale;
	tex_tileObjlf.scale=scale;
	tex_tileObjlr.scale=scale;
	tex_tileObjlrf.scale=scale;
	tex_tileObjr.scale=scale;
	tex_tileObjrf.scale=scale;



	tileName=tileName.toLowerCase();
	var ent_tilef=new Entity('ent_'+tileName+'-f');
	var ent_tilel=new Entity('ent_'+tileName+'-l');
	var ent_tilelf=new Entity('ent_'+tileName+'-lf');
	var ent_tilelr=new Entity('ent_'+tileName+'-lr');
	var ent_tilelrf=new Entity('ent_'+tileName+'-lrf');
	var ent_tiler=new Entity('ent_'+tileName+'-r');
	var ent_tilerf=new Entity('ent_'+tileName+'-rf');

	ent_tilef.addTex(tex_tileObjf);
	ent_tilel.addTex(tex_tileObjl);
	ent_tilelf.addTex(tex_tileObjlf);
	ent_tilelr.addTex(tex_tileObjlr);
	ent_tilelrf.addTex(tex_tileObjlrf);
	ent_tiler.addTex(tex_tileObjr);
	ent_tilerf.addTex(tex_tileObjrf);

	s_world.addEnt(ent_tilef);
	s_world.addEnt(ent_tilel);
	s_world.addEnt(ent_tilelf);
	s_world.addEnt(ent_tilelr);
	s_world.addEnt(ent_tilelrf);
	s_world.addEnt(ent_tiler);
	s_world.addEnt(ent_tilerf);
}



/*
	Custom functions that will be useful inside the world scene
*/

// Converts the index to coords
function tileToPos(indexes) {
	/*
			All this shit is to offset the diagonal board correctly.

		Theoretically, the sizes of the offsets to correctly
			center everything should be:
			[canvas.width - (sizeX + sizeY)*img.width/2 ]/2
	*/

	// Define your tile estimates here
	var width=26;
	var height=26;
	var offRowW=26;
	var offRowH=13;
	var offGlobalW=26;
	var offGlobalH=12;
	var offLocalW=width;
	var offLocalH=height/2;

	var pos={ x: 0, y: 0 };

	// Calculate global offsets
	pos.x+=(canvas.width-(this.size.x+this.size.y)*offGlobalW)/2;
	pos.y+=(canvas.height-(this.size.x+this.size.y)*offGlobalH)/2;
	pos.x+=(this.size.y-1)*width;

	// Calculate row offsets
	pos.x+=offRowW*(indexes.x);
	pos.y+=offRowH*(indexes.y);

	// Calculate local offset
	pos.x-=offLocalW*(indexes.y-1);
	pos.y+=offLocalH*(indexes.x-1);

	return pos;
}

// Checks if index is in range; returns true if good
function tileCheckRange(indexes) {
	if(indexes.x<0||this.size.x<=indexes.x) return false;
	if(indexes.y<0||this.size.y<=indexes.y) return false;
	if(indexes.z<0||this.size.z<=indexes.z) return false;
	return true;
}

// Checks if index is in range & snaps to the range if bad
function tileFixRange(indexes) {
	var inrange=true;

	if(indexes.x<0) {
		indexes.x=0;
		inrange=false;
	}
	if(this.size.x<=indexes.x) {
		indexes.x=this.size.x-1;
		inrange=false;
	}
	if(indexes.y<0) {
		indexes.y=0;
		inrange=false;
	}
	if(this.size.y<=indexes.y) {
		indexes.y=this.size.y-1;
		inrange=false;
	}
	if(indexes.z<0) {
		indexes.z=0;
		inrange=false;
	}
	if(this.size.z<=indexes.z) {
		indexes.z=this.size.z-1;
		inrange=false;
	}
	return inrange;
}