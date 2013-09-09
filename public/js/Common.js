// FPS that the processing engine is set to [it affects everything's FPS]
var g_fpsEngine=60;

// Global FPS that all textures default to
var g_fpsTextureDefault=16;

// Global definition of a meter [pixels/meter]
var g_px_m=32;
var g_r_s=Math.PI*2;



// Gives an array the ability to searched in constant time
//    Need a associative array to pair with it
function mapAdd(arr, map, obj, callbackGetID) {
	if(typeof callbackGetID!='function') throw ('mapAdd() missing callback function to get an object\'s ID'); // DEBUG
	var id=callbackGetID(obj);
	var key=map[id];
	if(key==undefined) {
		map[id]=arr.length; // Add the map key
		arr.push(obj); // Push a new object
	} else {
		arr[key]=obj;
	}
}
function mapGet(arr, map, id) {
	if(typeof id=='number') {
		return arr[id];
	} else {
		var key=map[id];
		var result=arr[key];
		if(result==undefined) console.log('mapGet() could not find "'+id+'"'); // DEBUG
		return result;
	}
}
function mapDel(arr, map, id, callbackGetID) {
	if(typeof callbackGetID!='function') throw ('mapAdd() missing callback function to get an object\'s ID'); // DEBUG
	var delKey;
	if(typeof id=='number') {
		delKey=id;
		id=arr[delKey].id;
		if(arr.length<=delKey) throw ('mapDel() out of bound exception');
	} else {
		delKey=map[id]; // Find where it is
		if(delKey==undefined) throw ('mapDel() could not find "'+id+'"');
	}
	delete map[id]; // Delete it completely
	delete arr[delKey];
	if(1<arr.length) { // If not empty, close gap
		var swapKey=arr.length-1-(arr.length-1==delKey?1:0); // might the gap be the last slot?

		//console.log('------------------------');
		//console.log(id); // useless ID thats deleted
		//console.log(delKey+' <-- '+swapKey); // keys to swap
		//console.log(arr);
		//console.log(map);
		//console.log('------------------------');

		id=callbackGetID(arr[swapKey]);
		arr[delKey]=arr[swapKey]; // Swap the end to the left
		map[id]=delKey;
	}
	arr.splice(arr.length-1, 1);
}


// Shift the angle from negative or large values
//		to the range 0-2π
function angleNormalize(angle) {
	angle%=Math.PI*2; // Trim value
	if(angle<0) {
		angle+=Math.PI*2;
		angle%=Math.PI*2;
	}
	return angle;
}
// Get the difference in 2 angles
//    Negative vales mean it is towards the left parameter
function angleShortest(origAng, destAng) {
	var diff=destAng-origAng; // Get the difference in angle
	if(destAng<origAng) {
		if(0<diff+Math.PI) { // -rot [diff is neg & normal]
			destAng=diff;
		} else { // +rot [diff is neg & near 2π]
			destAng=diff+Math.PI*2;
		}
	} else {
		if(0<diff-Math.PI) { // -rot [diff is pos & near 2π]
			destAng=diff-Math.PI*2;
		} else { // +rot [diff is pos & normal]
			destAng=diff;
		}
	}
	return destAng;
}
// Get the angle of a direction
function angleOfPos(origPos, destPos) {
	if(typeof origPos!='object') throw (this.id+': angleOfPos(origPos, destPos) angleOfPos must take an XY struct'); // DEBUG
	if(typeof origPos.x!='number') throw (this.id+': angleOfPos(origPos, destPos) parameter "angleOfPos.x" must be a number; got a typeof('+angleOfPos.x+')=='+typeof angleOfPos.x); // DEBUG
	if(typeof origPos.y!='number') throw (this.id+': angleOfPos(origPos, destPos) parameter "angleOfPos.y" must be a number; got a typeof('+angleOfPos.y+')=='+typeof angleOfPos.y); // DEBUG
	if(typeof destPos!='object') throw (this.id+': angleOfPos(origPos, destPos) destPos must take an XY struct'); // DEBUG
	if(typeof destPos.x!='number') throw (this.id+': angleOfPos(origPos, destPos) parameter "destPos.x" must be a number; got a typeof('+destPos.x+')=='+typeof destPos.x); // DEBUG
	if(typeof destPos.y!='number') throw (this.id+': angleOfPos(origPos, destPos) parameter "destPos.y" must be a number; got a typeof('+destPos.y+')=='+typeof destPos.y); // DEBUG
	// DEBUG
	var pos={ x: 0, y: 0 };
	pos.x=destPos.x-origPos.x;
	pos.y=destPos.y-origPos.y;

	var finalAngle=0;
	if(pos.x!=0||pos.y!=0) {
		if(pos.y==0) {
			finalAngle=Math.PI/2;
			if(pos.x<0) finalAngle+=Math.PI;
		} else {
			finalAngle=Math.atan(pos.x/pos.y);
			if(pos.y<0) finalAngle+=Math.PI;
		}
		finalAngle+=Math.PI*3/2; // Prevents negative values
		finalAngle%=Math.PI*2;
	}
	return finalAngle;
}

// Hitbox detection for points [like mouse click]
function inHitRad(dist, hitRad, origPos, hitPos) {
	if(hitRad==0) return false;
	var c1=origPos.x-hitPos.x;
	var c2=origPos.y-hitPos.y;
	dist.d=Math.sqrt(c1*c1+c2*c2);
	return dist.d<hitRad;
}
function inHitBox(dist, hitBox, origPos, hitPos) {
	var cx, cy, ang=angleOfPos(origPos, hitPos);

	cx=hitPos.x-origPos.x;
	cy=hitPos.y-origPos.y;
	dist.d=Math.sqrt(cx*cx+cy*cy);

	cx=(origPos.x-hitBox.x/2<hitPos.x)&&(hitPos.x<origPos.x+hitBox.x/2);
	cy=(origPos.y-hitBox.y/2<hitPos.y)&&(hitPos.y<origPos.y+hitBox.y/2);

	return cx&&cy;
}