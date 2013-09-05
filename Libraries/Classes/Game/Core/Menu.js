/*
	The Menu class is made for displaying a menu
	the menu class will do nothing more than display
	a menu of clickable labels, each with an associated function
	the menu will take an arbitrarily large number of image files
	and iterate through them. at a set speed. it will randomly pan
	through the images. I can play a sound if you wish for bgm.
*/
var Button = function(Parent,img,Xdraw,Ydraw,Height,Width){
	var that = this;
	this.mommy = Parent;
	this.ctx = mommy.context;
	
	
	this.draw = function(){
		this.ctx.drawImage(img,Xdraw,Ydraw);
	}
}
var Menu = function(Parent,BGimages,Music,Buttons){
	this.context = Parent.context;
	this.FPS = 60;
	this.bgImages = BGimages;
	this.Buttons = new Array();
	
}