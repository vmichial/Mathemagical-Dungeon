/*
			Scene Class

	Organizes what you see into scenes. You can add more to
		an instance of the class & swap between them.
*/

var SceneView=function() {

}

var Scene=function() {

	this._styleTransform=function(element, prop, value) {
		var attrib=
			'        transform:'+prop+'('+value+');'+
			'    -ms-transform:'+prop+'('+value+');'+
			'-webkit-transform:'+prop+'('+value+');';
		element.setAttribute('style', attrib);
	}
	this.styleRotate=function(element, pos, angle) {
		var value=String(pos);
		for(var i=0; i<pos.length; ++i) value+=','+pos[i];
		this._styleTransform(element, 'rotate', value+','+angle);
	}
	this.styleRotate3d=function(element, matrix) {
		var value=String(matrix);
		for(var i=0; i<matrix.length; ++i) value+=','+matrix[i];
		this._styleTransform(element, 'rotate3d', value);
	}
	this.styleMatrix=function(element, matrix) {
		var value=String(matrix);
		for(var i=0; i<matrix.length; ++i) value+=','+matrix[i];
		this._styleTransform(element, 'matrix3d', value);
	}
}