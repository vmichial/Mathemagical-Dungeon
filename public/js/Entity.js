/*
			Entity Class

	The Entity class handles handles objects that might be
		considered physical objects.

	There can be multiple textures on the entity.  This allows
		for layering textures.
*/

var g_pxm=32; // Global definition of a meter

var Entity=function(id) {
	/*
		Public vars
	*/
	this.id='';

	this.mid={ x: undefined, y: undefined };
	this.hitbox=32; // Defined as a radius or an XY struct

	this.pause=false;
	this.hide=false;



	/*
			Private vars
	*/
	this._texArr=[];
	this._texMap={};

	this._pos={ x: 0, y: 0 };
	this._vel={ x: 0, y: 0 };
	this._velMax=5;
	this._accel={ x: 0, y: 0 };
	this._accel=3;
	this._accelDamp=1;

	this._angle=0;
	this._omega=0;
	this._omegaMax=Math.PI/8;
	this._alpha=0;
	this._alphaMax=Math.PI/16;
	this._alphaDamp=Math.PI/32;

	this._pxm=g_pxm;           // px/m [pixels per meter]
	this._pxmFlat=1/this._pxm; //    the entity moves at

	this._frame=0;           // < Current frame of an animation
	this._frameCount=0;      // < Number of frames in an animation
	this._frameTime=0;       // < Current time on a frame

	this._stepped=0; // DEBUG: Help coders catch unecessary calls to step() before a draw()



	/*
			Public methods
	*/
	this.Entity=function(id, textures) {
		this.id=id;
		if(textures!=undefined) {
			this.textures=textures;
		}
	}


	// Draw all textures
	this.draw=function(ctx) { for(i=0; i<this.textures.length; ++i) this.textures[i].draw(ctx, this._pos); }

	// Each call makes the entity move closer to a desired state, like
	//		walking to a destination, facing a direction, 
	this.step=function() {
		// angle smoothing

		// check to turn 1st or move at the same time

		// movement smoothing

		for(i=0; i<this.textures.length; ++i) this.textures[i].step();
	}


	// Texture management
	this.addTex=function(texture) {
		if(typeof texture!='object') throw (this.id+': addTex(texture) parameter "texture" must be a class Entity'); // DEBUG
		var id=texture.id;
		if(typeof id!='string') throw (this.id+': addTex(texture) parameter "texture.id" must be a string; got a typeof('+id+')=='+typeof id); // DEBUG
		mapAdd(this._texArr, this._texMap, texture, function(obj) { return obj.id; });
	}
	this.getTex=function(id) {
		if(typeof id!='number'&&typeof id!='string') throw (this.id+': getTex(id) parameter "id" must be a number or string; got a typeof('+id+')=='+typeof id); // DEBUG
		return mapGet(this._texArr, this._texMap, id);
	}
	this.delTex=function(id) {
		if(typeof id!='number'&&typeof id!='string') throw (this.id+': delTex(id) parameter "id" must be a number or string; got a typeof('+id+')=='+typeof id); // DEBUG
		mapDel(this._texArr, this._texMap, id, function(obj) { return obj.id; });
	}


	// Movement
	this.move=function(pos) {
		if(typeof pos!='object') throw (this.id+': face(pos) pos must take an XY struct'); // DEBUG
		if(typeof pos.x!='number') throw (this.id+': face(pos) parameter "pos.x" must be a number; got a typeof('+pos.x+')=='+typeof pos.x); // DEBUG
		if(typeof pos.y!='number') throw (this.id+': face(pos) parameter "pos.y" must be a number; got a typeof('+pos.y+')=='+typeof pos.y); // DEBUG
		// DEBUG
		// Offsets
		var cx, cy, moved, vel=1;
		cx=(pos.x-this._pos.x);
		cy=(pos.y-this._pos.y);
		moved=(cx!=0||cy!=0);


		// OLD MOVEMENT CONTROL
		if(moved) {
			if(this.idle) this.step(); // If animated only on movement

			// Gonna have to do some math to make diagonal movement smooth
			if(cx==0) {
				this._vel.x=0;
			} else {
				this._vel.x=(cx<0?-1:1)*vel*Math.cos(Math.atan(cy/cx));
				if(Math.abs(cx)<Math.abs(this._vel.x)) this._pos.x=pos.x;
				else this._pos.x+=this._vel.x;
			}
			if(cy==0) {
				this._vel.y=0;
			} else {
				this._vel.y=(cy<0?-1:1)*Math.sqrt(vel*vel-this._vel.x*this._vel.x);
				if(Math.abs(cy)<Math.abs(this._vel.y)) this._pos.y=pos.y;
				else this._pos.y+=this._vel.y;
			}
		}
		//

		return !moved; // Return true if destination reached
	}


	// Angles
	this.getAngle=function() {
		return this._angle;
	}
	this.setAngle=function(angle, omega, omegaMax, alpha, alphaMax, alphaDamp) { // 5 overloads
		if(angle==undefined) throw (this.id+': setAngle(θ, ω, ωMax, α, αMax, αDamp) parameter "θ" must be a number; got a typeof('+angle+')=='+typeof angle); // DEBUG
		if(typeof angle!='number') throw (this.id+': setAngle(θ, ω, ωMax, α, αMax, αDamp) parameter "θ" must be a number; got a typeof('+angle+')=='+typeof angle); // DEBUG
		this._angle=angle;
		if(omega!=undefined) {
			if(typeof omega!='number') throw (this.id+': setAngle(θ, ω, ωMax, α, αMax, αDamp) parameter "ω" must be a number; got a typeof('+omega+')=='+typeof omega); // DEBUG
			this._omega=omega;
			if(omegaMax!=undefined) {
				this._omegaMax=omegaMax;
				if(typeof omegaMax!='number') throw (this.id+': setAngle(θ, ω, ωMax, α, αMax, αDamp) parameter "ωMax" must be a number; got a typeof('+omegaMax+')=='+typeof omegaMax); // DEBUG
				if(alpha!=undefined) {
					if(typeof alpha!='number') throw (this.id+': setAngle(θ, ω, ωMax, α, αMax, αDamp) parameter "α" must be a number; got a typeof('+alpha+')=='+typeof alpha); // DEBUG
					if(alphaMax!=undefined) {
						this._alpha=alpha;
						if(typeof alphaMax!='number') throw (this.id+': setAngle(θ, ω, ωMax, α, αMax, αDamp) parameter "αMax" must be a number; got a typeof('+alphaMax+')=='+typeof alphaMax); // DEBUG
						this._alphaMax=alphaMax;
						if(alphaDamp!=undefined) {
							if(typeof alphaDamp!='number') throw (this.id+': setAngle(θ, ω, ωMax, α, αMax, αDamp) parameter "αDamp" must be a number; got a typeof('+alphaDamp+')=='+typeof alphaDamp); // DEBUG
							this._alphaDamp=alphaDamp;
						}
					}
				}
			}
		}
	}

	// Get the angle of a direction
	this.angleOf=function(pos) {
		if(typeof pos!='object') throw (this.id+': angleOf(pos) pos must take structs with angles'); // DEBUG
		if(typeof pos.x!='number') throw (this.id+': angleOf(pos) parameter "pos.x" must be a number; got a typeof('+pos.x+')=='+typeof pos.x); // DEBUG
		if(typeof pos.y!='number') throw (this.id+': angleOf(pos) parameter "pos.y" must be a number; got a typeof('+pos.y+')=='+typeof pos.y); // DEBUG
		// DEBUG
		var angle=0;
		pos.x-=this._pos.x;
		pos.y-=this._pos.y;

		if(pos.x!=0||pos.y!=0) {
			if(pos.y==0) {
				angle=Math.PI/2;
				if(pos.x<0) angle+=Math.PI;
			} else {
				angle=Math.atan(pos.x/pos.y);
				if(pos.y<0) angle+=Math.PI;
			}
			angle+=Math.PI*3/2; // Prevents negative values
			angle%=Math.PI*2;

		}
		return angle;
	}

	this.face=function(angle) {
		// DEBUG: Check angle
		if(typeof angle=='number') { // DEBUG
		} else { // DEBUG
			if(typeof angle!='object') throw (this.id+': face(pos) pos must take an XY struct'); // DEBUG
			if(typeof angle.x!='number') throw (this.id+': face(pos) parameter "pos.x" must be a number; got a typeof('+angle.x+')=='+typeof angle.x); // DEBUG
			if(typeof angle.y!='number') throw (this.id+': face(pos) parameter "pos.y" must be a number; got a typeof('+angle.y+')=='+typeof angle.y); // DEBUG
		} // DEBUG
		// DEBUG
		if(typeof angle=='number') { // turn(θ)
			this._angle=angle;
		} else {
			this._angle=this.angleOf(angle);
		}
		for(i=0; i<this.textures.length; ++i) this.textures[i].face(this._angle);
		return this._angle;
	}

	// Animate a turn towards a direction
	this.turn=function(angle) {
		// DEBUG: Check angle
		if(typeof angle=='number') { // DEBUG
		} else { // DEBUG
			if(typeof angle!='object') throw (this.id+': turn(pos) pos must take an XY struct'); // DEBUG
			if(typeof angle.x!='number') throw (this.id+': turn(pos) parameter "pos.x" must be a number; got a typeof('+angle.x+')=='+typeof angle.x); // DEBUG
			if(typeof angle.y!='number') throw (this.id+': turn(pos) parameter "pos.y" must be a number; got a typeof('+angle.y+')=='+typeof angle.y); // DEBUG
		} // DEBUG
		// DEBUG


		// OLD TURN CODE [not gonna work]
		if(typeof angle=='number') { // turn(angle)
			angle;
		} else {
			if(typeof pos=='number') { // turn(angle)
				destAng=x;
			} else { // turn(x, y)
				angle.x-=this._pos.x;
				angle.y-=this._pos.y;

				if(angle.x!=0||angle.y!=0) {
					if(angle.y==0) {
						destAng=Math.PI/2;
						if(angle.x<0) destAng+=Math.PI;
					} else {
						destAng=Math.atan(x/y);
						if(angle.y<0) destAng+=Math.PI;
					}
					destAng+=Math.PI*3/2; // Prevents negative values
					destAng%=Math.PI*2;
				}

				this.angleOf(angle);
			}
		}
		// DEBUG
		var destAng=0, finalDest=0;

		this._omega=this._omegaMax; // temp until new code
		if(typeof angle=='number') { // turn(θ)
			destAng=angle;
		}
		finalDest=destAng;

		var diff=destAng-this._angle; // Get the difference in angle
		if(Math.abs(diff.toFixed(8))!=0) {
			console.log(this._angle)
			if(diff<0) diff+=Math.PI*2;

			if(destAng<this._angle) destAng+=Math.PI*2; // Adjust to get a difference [related to unit circle]
			if(Math.PI<diff) diff-=Math.PI*2; // Adjust to make it from -π to π

			if(Math.abs(diff)<=this._omega) this._angle=destAng; // Snap to destination
			else this._angle+=diff<0?-this._omega:this._omega; // Turn towards the destination

			this._angle=(this._angle+Math.PI*2)%(Math.PI*2);
			for(var i=0; i<this.textures.length; ++i) this.textures[i].face(this._angle);
		}

		// Return false if not facing the target
		return (this._angle.toFixed(8)==finalDest.toFixed(8));
	}

	// Constructor
	this.Entity(id);
};