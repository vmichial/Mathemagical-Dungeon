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
	tex_tileGrey=initTileTex('tileGrey', scale);
	newEntTile('tilegrey-', tex_tileGrey); // Push 1 set of tiles to the world


	// Function that takes indicies & returns coords on the canvas
	s_world.getTilePos=getTilePos;

	// Instead of doing the default draw [draws everything to its on spot]
	//		We need to instance a single entity to many locations, so write
	//		a custom draw like so.
	s_world.onDraw=function(ctx) {
		for(var z=0; z<this.size.z; ++z) {
			for(var y=0; y<this.size.y; ++y) {
				for(var x=0; x<this.size.x; ++x) {
					var adjPos=this.getTilePos({ x: x, y: y, z: z });
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

function initTileTex(tileName, scale) {
	if(scale==undefined) scale={ x: 1, y: 1 };

	tex_tileObj={};
	tex_tileObj.f=new Texture(tileName+'F');
	tex_tileObj.l=new Texture(tileName+'L');
	tex_tileObj.lf=new Texture(tileName+'LF');
	tex_tileObj.lr=new Texture(tileName+'LR');
	tex_tileObj.lrf=new Texture(tileName+'LRF');
	tex_tileObj.r=new Texture(tileName+'R');
	tex_tileObj.rf=new Texture(tileName+'RF');

	tex_tileObj.f.scale=scale;
	tex_tileObj.l.scale=scale;
	tex_tileObj.lf.scale=scale;
	tex_tileObj.lr.scale=scale;
	tex_tileObj.lrf.scale=scale;
	tex_tileObj.r.scale=scale;
	tex_tileObj.rf.scale=scale;

	return tex_tileObj;
}

function newEntTile(tileName, tex_tileObj) {
	var ent_tile={};

	ent_tile.f=new Entity('ent_'+tileName+'f');
	ent_tile.l=new Entity('ent_'+tileName+'l');
	ent_tile.lf=new Entity('ent_'+tileName+'lf');
	ent_tile.lr=new Entity('ent_'+tileName+'lr');
	ent_tile.lrf=new Entity('ent_'+tileName+'lrf');
	ent_tile.r=new Entity('ent_'+tileName+'r');
	ent_tile.rf=new Entity('ent_'+tileName+'rf');

	ent_tile.f.addTex(tex_tileObj.f);
	ent_tile.l.addTex(tex_tileObj.l);
	ent_tile.lf.addTex(tex_tileObj.lf);
	ent_tile.lr.addTex(tex_tileObj.lr);
	ent_tile.lrf.addTex(tex_tileObj.lrf);
	ent_tile.r.addTex(tex_tileObj.r);
	ent_tile.rf.addTex(tex_tileObj.rf);

	s_world.addEnt(ent_tile.f);
	s_world.addEnt(ent_tile.l);
	s_world.addEnt(ent_tile.lf);
	s_world.addEnt(ent_tile.lr);
	s_world.addEnt(ent_tile.lrf);
	s_world.addEnt(ent_tile.r);
	s_world.addEnt(ent_tile.rf);
}

function getTilePos(indexes) {
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