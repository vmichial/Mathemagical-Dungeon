/*
			Scene Class

	Organizes what you see into scenes. You can add more to
		an instance of the class & swap between them.
*/


var Scene=function(id, onStepFunc) {
	/*
		Public vars
	*/
	this.id='';

	this.pos={ x: 0, y: 0 };
	this.mid={ x: undefined, y: undefined };

	this.pause=false;
	this.hide=false;

	// 2 ways to access entities
	this._entArr=[];
	this._entMap={};


	// Custom actions to take for step() or draw()
	this.onStep=undefined;
	this.onDraw=undefined;



	/*
		Private vars
	*/



	/*
			Public methods
	*/
	this.Scene=function(id, onStepFunc) {
		if(id==undefined) id='';
		this.id=id;
		this.onStep=onStepFunc;
	}

	this.addEnt=function(entity) {
		if(typeof entity!='object') throw (this.id+': addEnt(entity) parameter "entity" must be a class Entity'); // DEBUG
		var id=entity.id;
		if(typeof id!='string') throw (this.id+': addEnt(entity) parameter "entity.id" must be a string; got a typeof('+id+')=='+typeof id); // DEBUG
		mapAdd(this._entArr, this._entMap, entity, function(obj) { return obj.id; });
	}
	this.getEnt=function(id) {
		if(typeof id!='number'&&typeof id!='string') throw (this.id+': getEnt(id) parameter "id" must be a number or string; got a typeof('+id+')=='+typeof id); // DEBUG
		return mapGet(this._entArr, this._entMap, id);
	}
	this.delEnt=function(id) {
		if(typeof id!='number'&&typeof id!='string') throw (this.id+': delEnt(id) parameter "id" must be a number or string; got a typeof('+id+')=='+typeof id); // DEBUG
		mapDel(this._entArr, this._entMap, id, function(obj) { return obj.id; });
	}


	this.step=function() {
		if(this.pause) return;
		if(this.onStep!=undefined) this.onStep();
		else this.stepDefault();
	}
	// Default step all entities
	this.stepDefault=function() {
		for(var i=0; i<this._entArr.length; ++i) this._entArr[i].step();
	}

	// Drawing
	this.draw=function(ctx) {
		if(this.hide) return;
		if(this.onDraw!=undefined) this.onDraw(ctx);
		else this.drawDefault(ctx);
	}
	// Default draw all entities
	this.drawDefault=function(ctx) {
		for(var i=0; i<this._entArr.length; ++i) this._entArr[i].draw(ctx, this.pos);
	}


	// Movement
	this.translate=function(pos) {
		if(typeof pos!='object') throw (this.id+': translate(pos) pos must take an XY struct'); // DEBUG
		if(typeof pos.x!='number') throw (this.id+': translate(pos) parameter "pos.x" must be a number; got a typeof('+pos.x+')=='+typeof pos.x); // DEBUG
		if(typeof pos.y!='number') throw (this.id+': translate(pos) parameter "pos.y" must be a number; got a typeof('+pos.y+')=='+typeof pos.y); // DEBUG
		this.pos=pos;
	}

	// Animates 1 step of a move towards a position
	// Copy of Entity.js :: move()   All changes should reflect that
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
	}

	// Animates 1 step of a turn towards a direction
	// Copy of Entity.js :: turn()   All changes should reflect that
	this.turn=function(destAng) {
		// DEBUG: Check angle
		if(typeof destAng=='number') { // DEBUG
		} else {
			if(typeof destAng!='object') throw (this.id+': turn(pos) pos must take an XY struct'); // DEBUG
			if(typeof destAng.x!='number') throw (this.id+': turn(pos) parameter "pos.x" must be a number; got a typeof('+destAng.x+')=='+typeof destAng.x); // DEBUG
			if(typeof destAng.y!='number') throw (this.id+': turn(pos) parameter "pos.y" must be a number; got a typeof('+destAng.y+')=='+typeof destAng.y); // DEBUG
		} // DEBUG
		// DEBUG
		if(this.pause) return this.angle;

		if(typeof destAng!='number') {
			destAng=angleOfPos(this.pos, destAng);
		}

		var direction=angleShortest(this.angle, destAng);
		var shifted=this.omega<Math.abs(direction)?this.omega*(direction<0?-1:1):direction;
		shifted*=g_r_s/g_fpsEngine;

		this.angle+=shifted;
		if(this.angle.toFixed(2)==destAng.toFixed(2)) {
			this.angle=destAng;
		} else {
			this.angle=angleNormalize(this.angle);
		}
		this.face(this.angle);

		return this.angle;
	}


	// Hitbox for clicking
	this.clickWhat=function(targetPos) {
		if(typeof targetPos!='object') throw (this.id+': hitWhat(targetPos) targetPos must take a number or an XY struct'); // DEBUG
		if(typeof targetPos.x!='number') throw (this.id+': hitWhat(targetPos) parameter "targetPos.x" must be a number; got a typeof('+targetPos.x+')=='+typeof targetPos.x); // DEBUG
		if(typeof targetPos.y!='number') throw (this.id+': hitWhat(targetPos) parameter "targetPos.y" must be a number; got a typeof('+targetPos.y+')=='+typeof targetPos.y); // DEBUG
		// DEBUG
		var list={ i: -1, d: 0 };
		var cur={ i: -1, d: 0 };

		for(var i=0; i<this._entArr.length; ++i) {
			var ent=this._entArr[i];
			var offPos={ x: this.pos.x+ent.pos.x, y: this.pos.y+ent.pos.y };
			var hit=false;

			if(ent.hide) continue;



			if(typeof ent.hitbox=='number') {
				hit=inHitRad(cur, ent.hitbox, offPos, targetPos)
			} else {
				hit=inHitBox(cur, ent.hitbox, offPos, targetPos)
			}
			if(hit) {
				if(cur.d<list.d||list.i==-1) {
					list.i=i;
					list.d=cur.d;
				}
			}
		}
		return list.i;
	}



	/*
			Private methods
	*/



	// Constructor
	this.Scene(id, onStepFunc);
	this.__whatami='class Scene';
}