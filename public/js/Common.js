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
		//throw ('------------------------');

		id=callbackGetID(arr[swapKey]);
		arr[delKey]=arr[swapKey]; // Swap the end to the left
		map[id]=delKey;
	}
	arr.splice(arr.length-1, 1);
}