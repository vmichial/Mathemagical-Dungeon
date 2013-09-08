﻿/*
			Entity Class

	The Entity class handles handles objects that might be
		considered physical objects.

	There can be multiple textures on the entity.  This allows
		for layering textures.
*/

var Entity=function(id, onStepFunc) {
	/*
		Public vars
	*/
	this.id='';

	this.mid={ x: undefined, y: undefined };
	this.hitbox=32; // Defined as a radius or an XY struct

	this.pause=false;
	this.hide=false;

	this.pos={ x: 0, y: 0 };
	this.vel=4;

	this.angle=0;
	this.omega=Math.PI/2;


	// Custom actions to take just before each step()
	this.onStep=undefined;



	/*
			Private vars
	*/
	this._texArr=[];
	this._texMap={};

	this._lastAngle=-1; // Last angle reference for redraws

	this._px_m=g_px_m;           // px/m [pixels per meter]
	this._pxmFlat=1/this._px_m; //    the entity moves at

	this._frame=0;           // < Current frame of an animation
	this._frameCount=0;      // < Number of frames in an animation
	this._frameTime=0;       // < Current time on a frame

	this._stepped=0; // DEBUG: Help coders catch unecessary calls to step() before a draw()



	/*
			Public methods
	*/
	this.Entity=function(id, onStepFunc) {
		this.id=id;
		this.onStep=onStepFunc;
	}


	// Each call makes the entity move closer to a desired state, like
	//		walking to a destination, facing a direction, 
	this.step=function() {
		if(this.onStep!=undefined) this.onStep(); // Call user defined step 1st

		// Extra stuff here?

		if(this._lastAngle!=this.angle) this.face(this.angle);
		for(i=0; i<this._texArr.length; ++i) this._texArr[i].step();
	}

	// Draw all textures
	this.draw=function(ctx, offset) {
		if(this.hide) return;
		for(i=0; i<this._texArr.length; ++i) {
			if(offset==undefined) this._texArr[i].draw(ctx, this.pos);
			else this._texArr[i].draw(ctx, { x: this.pos.x+offset.x, y: this.pos.y+offset.y });
		}
	}


	// Movement
	this.translate=function(pos) {
		if(typeof pos!='object') throw (this.id+': translate(pos) pos must take an XY struct'); // DEBUG
		if(typeof pos.x!='number') throw (this.id+': translate(pos) parameter "pos.x" must be a number; got a typeof('+pos.x+')=='+typeof pos.x); // DEBUG
		if(typeof pos.y!='number') throw (this.id+': translate(pos) parameter "pos.y" must be a number; got a typeof('+pos.y+')=='+typeof pos.y); // DEBUG
		this.pos=pos;
	}

	// Animates 1 step of a move towards a position
	this.move=function(destPos) {
		if(typeof destPos!='object') throw (this.id+': face(destPos) destPos must take an XY struct'); // DEBUG
		if(typeof destPos.x!='number') throw (this.id+': face(destPos) parameter "destPos.x" must be a number; got a typeof('+destPos.x+')=='+typeof destPos.x); // DEBUG
		if(typeof destPos.y!='number') throw (this.id+': face(destPos) parameter "destPos.y" must be a number; got a typeof('+destPos.y+')=='+typeof destPos.y); // DEBUG
		if(this.pause) return this.pos;

		var ang=angleOfPos(this.pos, destPos);

		var p1=this.pos.x-destPos.x;
		var p2=this.pos.y-destPos.y;
		var to=Math.sqrt(p1*p1+p2*p2);

		to=this.vel<to?this.vel:to;
		to*=g_px_m/g_fpsEngine;

		this.pos.x+=to*Math.cos(ang);
		this.pos.y-=to*Math.sin(ang);

		return this.pos;
	}


	// Angles
	this.face=function(destAng) {
		// DEBUG: Check angle
		if(typeof destAng=='number') { // DEBUG
		} else { // DEBUG
			if(typeof destAng!='object') throw (this.id+': face(pos) pos must take a number or an XY struct'); // DEBUG
			if(typeof destAng.x!='number') throw (this.id+': face(pos) parameter "pos.x" must be a number; got a typeof('+destAng.x+')=='+typeof destAng.x); // DEBUG
			if(typeof destAng.y!='number') throw (this.id+': face(pos) parameter "pos.y" must be a number; got a typeof('+destAng.y+')=='+typeof destAng.y); // DEBUG
		} // DEBUG
		// DEBUG
		if(typeof destAng=='number') this.angle=destAng; // turn(θ)
		else this.angle=angleOfPos(this.pos, destAng);

		this._lastAngle=this.angle;

		for(i=0; i<this._texArr.length; ++i) this._texArr[i].face(this.angle);
		return this.angle;
	}

	// Animates 1 step of a turn towards a direction
	this.turn=function(destAng) {
		// DEBUG: Check angle
		if(typeof destAng=='number') { // DEBUG
		} else { // DEBUG
			if(typeof destAng!='object') throw (this.id+': turn(pos) pos must take a number or an XY struct'); // DEBUG
			if(typeof destAng.x!='number') throw (this.id+': turn(pos) parameter "pos.x" must be a number; got a typeof('+destAng.x+')=='+typeof destAng.x); // DEBUG
			if(typeof destAng.y!='number') throw (this.id+': turn(pos) parameter "pos.y" must be a number; got a typeof('+destAng.y+')=='+typeof destAng.y); // DEBUG
		} // DEBUG
		// DEBUG
		if(this.pause) return this.angle;

		if(typeof destAng!='number') {
			if(this.pos.x==destAng.x&&this.pos.y==destAng.y) return this.angle;
			destAng=angleOfPos(this.pos, destAng);
		}

		var direction=angleShortest(this.angle, destAng);
		var shifted=this.omega<Math.abs(direction)?this.omega*(direction<0?-1:1):direction;
		shifted*=g_r_s/g_fpsEngine;

		this.angle+=shifted;
		if(this.angle==destAng) {
			this.angle=destAng;
		} else {
			this.angle=angleNormalize(this.angle);
		}
		this.face(this.angle);

		return this.angle;
	}


	// Texture management
	this.addTex=function(texture) {
		if(typeof texture!='object') throw (this.id+': addTex(texture) parameter "texture" must be a class Texture'); // DEBUG
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



	/*
			Private methods
	*/



	// Constructor
	this.Entity(id, onStepFunc);
	this.__whatami='class Entity';
};