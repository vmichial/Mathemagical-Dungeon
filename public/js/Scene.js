/*
			Scene Class

	Organizes what you see into scenes. You can add more to
		an instance of the class & swap between them.
*/


var Scene=function(id) {
	/*
		Public vars
	*/
	this.id='';


	// 2 ways to access entities
	this._entArr=[];
	this._entMap={};


	this.Scene=function(id) {
		if(id==undefined) id='';
		this.id=id;

	}



	/*
		Private vars
	*/



	/*
			Public methods
	*/
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



	/*
			Private methods
	*/



	// Constructor
	this.Scene(id);
}