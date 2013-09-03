/*
			Texture Class

	The Texture class stores & handles drawing & additionally have
		the ability to load sprite sheets for animation.

	Textures are unaware of the surroundings, so position, where 
		to draw, hit boxes, & even part of the frame rate MUST
		be handled outside.

	Static textures are defined as expected.  Make a new Texture
		giving it the ID of the image.  All of the animation props
		will be skipped.
			var wall=new function(id); // Definition
			var wall=new function('nyanCat'); // Ex

	Animated textures are defined like above, but with an additional
		parameter, tileSize.  By changing the tileSize of a Texture
		to a value smaller than the image size, the Texture becomes
		animated.
			var cat=new function(id, tileSize); // Definition
			var cat=new function('nyanCat', {x:64, y:64}); // Ex
*/

var g_fpsEngine=60; // FPS that the processing engine is set to [it affects the texture FPS]
var g_fpsTexture=16; // Global FPS that all textures default to

var Texture=function(id, tileSize) { // 2 overloads
	/*
			Public vars
	*/
	this.id='';
	this.img=null;

	this.size={ x: 0, y: 0 }; // Size of image
	this.scale={ x: 1, y: 1 }; // scale to this size [1=normal]
	this.mid={ x: undefined, y: undefined }; // Mid point of the texture to center on when drawn

	// Tile size [default: size of image]
	// Setting it will allow for animated textures
	this.tileSize={ x: 0, y: 0 };

	//	Some nice features to have for animation:
	this.pause=false;
	this.hide=false;
	this.loop=true;
	this.reverse=false;



	/*
			Private vars
	*/
	this._fps=g_fpsTexture;       // FPS of the animation
	this._fpsFlat=1000/this._fps; // Flattened means already divided with 1000

	this._frame=0;           // < Current frame of an animation
	this._frameCount=0;      // < Number of frames in an animation
	this._frameTime=0;       // < Current time on a frame

	this._alt=0;             // < Alternate views [different angles]
	this._altCount=0;        // < Count of alt views

	this._static=false;      // Static or animated texture
	this._lastSheetPos={ u: 0, v: 0 };

	this._stepped=0; // DEBUG: Help coders catch unecessary calls to step() before a draw()



	/*
			Public methods
	*/
	this.Texture=function(id, tileSize) { // Constructor; 1 overload
		if(id==undefined) {
			console.log('Texture() :: No ID given, not constructing'); // DEBUG
			return;
		}

		if(tileSize!=undefined) { // Texture(id, tileSize)
			if(typeof tileSize!='object') throw (this.id+': Texture(ctx, tileSize) tileSize must take an XY struct'); // DEBUG
			if(typeof tileSize.x!='number') throw (this.id+': Texture(ctx, tileSize) parameter "tileSize.x" must be a number; got a typeof('+tileSize.x+')=='+typeof tileSize.x); // DEBUG
			if(typeof tileSize.y!='number') throw (this.id+': Texture(ctx, tileSize) parameter "tileSize.y" must be a number; got a typeof('+tileSize.y+')=='+typeof tileSize.y); // DEBUG
			//DEBUG
			this.tileSize.x=tileSize.x;
			this.tileSize.y=tileSize.y;
		} // else, Texture(id)

		this.id=id;
		this.img=document.getElementById(id);

		if(this.img!=null) { // Good image
			this.refreshProps();
		} else { // Error during load
			var idTemp=this.id;
			this.id=null;
			throw ('ID "'+idTemp+'" not found, not initializing'); // DEBUG
		}
	}

	// Sets the size of the tiles & calculates how many frames there are
	this.refreshProps=function() {
		// Detect dimensions
		if(typeof this.img.width!='number') throw ('Image "'+id+'" width could not be detected'); // DEBUG
		if(typeof this.img.width!='number') throw ('Image "'+id+'" height could not be detected'); // DEBUG
		// DEBUG
		this.size.x=this.img.width;
		this.size.y=this.img.height;

		// Correct tile size
		if(this.tileSize.x<=0||this.size.x<this.tileSize.x) this.tileSize.x=this.size.x;
		if(this.tileSize.y<=0||this.size.y<this.tileSize.y) this.tileSize.y=this.size.y;

		// Check if tiled or static image
		if(this.tileSize.x!=this.size.x||this.tileSize.y!=this.size.y) {
			this._frame=0;
			this._frameTime=0;
			this._frameCount=Math.floor(this.size.x/this.tileSize.x);

			this._alt=0;
			this._altCount=Math.floor(this.size.y/this.tileSize.y);

			this.static=false;

			console.log('Texture('+this.id+') :: Loaded animated texture\n > Texture.pause=true'); // DEBUG
		} else {
			this._frame=0;
			this._frameTime=0;
			this._frameCount=1;

			this._alt=0;
			this._altCount=1;

			this.static=true;

			console.log('Texture('+this.id+') :: Loaded static texture'); // DEBUG
		}

		if(this.mid.x==undefined) this.mid.x=this.tileSize.x/2;
		if(this.mid.y==undefined) this.mid.y=this.tileSize.y/2;
	}

	// Set/Get FPS
	this.getFPS=function() { return this._fps; }
	this.setFPS=function(fps) {
		if(typeof fps!='number') throw (this.id+': setFPS(fps) parameter "fps" must be a number; got a typeof('+fps+')=='+typeof fps); // DEBUG
		var fpsMax=125;
		this._fps=fps;
		if(fpsMax<this._fps) this._fps=fpsMax;
		this._fpsFlat=1000/this._fps;
	}

	// True if the animation is not looped & the end is reached
	this.isEnd=function() {
		if(!this.loop) {
			if(this.reverse) {
				if(this._frame==0) return true;
			} else {
				if(this._frame+1==this._frameCount) return true;
			}
		}
		return false;
	}

	// Face the sprite in a direction
	this.face=function(angle) {
		if(typeof angle!='number') throw (this.id+': face(θ) parameter "θ" must be a number; got a typeof('+pos+')=='+typeof pos); // DEBUG
		// DEBUG
		this._alt=this._getAngleIndex(angle);
		this._lastSheetPos=this._getSheetPos();
		return angle;
	}

	// This steps in the animation & returns the number of steps taken
	this.step=function() {
		if(this.static||this.pause) return 0;

		var step=false; // Whether to step in the animation
		var updateCount=0;

		if(this.loop) { // In looped mode, always step
			step=true;
		} else { // In non-looped, only step if not the end of the animation
			if(!this.isEnd()) step=true;
		}

		if(step) {
			if(0<this._stepped) console.log(this.id+' stepped '+(this._stepped+1)+' times since last draw.'); // DEBUG
			var ratio=this._fps/g_fpsEngine;
			this._frameTime+=ratio;
			while(1<=this._frameTime) { // If lagging, step more
				if(this.reverse) { // In reverse, if (frame<0), restart animation
					if((--this._frame)<0) this._frame=this._frameCount-1;
				} else { // Normally, if (frameCount<frame), restart animation
					if(this._frameCount<=(++this._frame)) this._frame=0;
				}
				++updateCount;
				this._frameTime-=1;
			}
			this._stepped++; // DEBUG
		}

		this._lastSheetPos=this._getSheetPos();
		return updateCount;
	}

	// Draws to canvas
	this.draw=function(ctx, pos) {
		// DEBUG: Check canvas context
		if(ctx==undefined) throw (this.id+': draw(ctx, pos) context not passed'); // DEBUG
		if(this.id==null) throw (this.id+': sprite not initialized'); // DEBUG
		// DEBUG: Check position
		if(typeof pos!='object') throw (this.id+': draw(ctx, pos) pos must take an XY struct'); // DEBUG
		if(typeof pos.x!='number') throw (this.id+': draw(ctx, pos) parameter "pos.x" must be a number; got a typeof('+pos.x+')=='+typeof pos.x); // DEBUG
		if(typeof pos.y!='number') throw (this.id+': draw(ctx, pos) parameter "pos.y" must be a number; got a typeof('+pos.y+')=='+typeof pos.y); // DEBUG
		// DEBUG
		this._stepped=0; // DEBUG
		// DEBUG
		if(!this.hide) {
			var mx=((pos.x)-this.mid.x*this.scale.x); // Maybe round pos?
			var my=((pos.y)-this.mid.y*this.scale.y);
			if(this.static) {
				ctx.drawImage(
					this.img, // Image source
					mx, my,   // Position to place it
					this.size.x*this.scale.x, this.size.y*this.scale.y // Size to scale it to
				);
			} else {
				ctx.drawImage(
					this.img, // Image source
					this._lastSheetPos.u, this._lastSheetPos.v, // Offset in sprite sheet [which tile to draw]
					this.tileSize.x, this.tileSize.y, // Tile size
					mx, my,   // Position to place it
					this.tileSize.x*this.scale.x, this.tileSize.y*this.scale.y // Size to scale it to
				);
			}
		}
	}



	/*
			Private methods
	*/
	// Returns the position in the sprite sheet to load
	//		the sprite from.  It has 2 parts:
	//		 u = Frame of the animation [laid out horizontal]
	//		 v = Alternate angles [laid out vertical]
	this._getSheetPos=function() {
		return { u: this.tileSize.x*this._frame, v: this.tileSize.y*this._alt };
	}

	// Return an index from the angle
	// TODO: Eventually make a table of number of views to index
	this._getAngleIndex=function(angle) {
		if(typeof angle!='number') throw (this.id+': _getAngleIndex(θ) parameter "θ" must be a number; got a typeof('+angle+')=='+typeof angle); // DEBUG
		angle=Math.PI*5/2-angle;

		angle%=Math.PI*2;
		angle/=Math.PI*2;
		angle*=this._altCount;
		return Math.round(angle)%this._altCount;
	}


	// Constructor
	this.Texture(id, tileSize);
};