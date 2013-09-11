
var GameObject = Class.create({
	initialize: function(id, position){
		this.id = id;
		this.position = position;
	},
	remove: function(){
		//remove self from worldObjects and activeObjects
	},
	log: function(){
		console.log(this.id + " " + this.position);
	}
});

var Floor = Class.create(GameObject, {
	initialize: function($super, position){
		$super(1, position);
	}
});

var Block = Class.create(GameObject, {
	initialize: function($super, position){
		$super(2, position);
	}
});