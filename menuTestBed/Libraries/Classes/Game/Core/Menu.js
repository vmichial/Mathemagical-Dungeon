/*
	The Menu class is made for displaying a menu
	the menu class will do nothing more than display
	a menu of clickable labels, each with an associated function
	the menu will take an arbitrarily large number of image files
	and iterate through them. at a set speed. it will randomly pan
	through the images. I can play a sound if you wish for bgm.
*/
var Label = function(Parent, Text, fontSize, IMG, TextX,TextY,ImX,ImY){
	var that = this;
	this.img = IMG;
	this.text = Text;
	this.textX = TextX;
	this.textY = Texty;
	this.imX = ImX;
	this.imY = Imy;
	this.font = ""+fontSize+"px Arial";
	
	this.draw = function(){
		if(that.text){
			Parent.context.font = font;
			Parent.context.fillText(Text,textX,textY);
		}
		if(that.img){
			Parent.context.drawImage(img,imX,imY);
		}
		if(!that.text&& !that.img){
			console.log("EHRMEGERD YOU PASSED NO IMAGE OR TEXT TO THE LABEL!");
		}
	}
}
//Creates a clickable button object with its parents, image object, draw x and y, width and height
//Added new parameter to be the sceneName of the next scene when button is clicked
var Button = function(Parent,img,Xdraw,Ydraw,Width, Height, NextString){
	var that = this;
	this.xdraw = Xdraw;
	this.ydraw = Ydraw;
	this.w = Width;
	this.h = Height;
	this.parent = Parent;
	this.ctx = Parent.context;
	this.nextString = NextString;
	
	this.clicked = function(x,y){
		return (x>=that.xdraw && x<(that.xdraw+that.w) && y>that.ydraw && y<(that.ydraw+that.h));
	}
	
	this.draw = function(){
		that.ctx.drawImage(img,Xdraw,Ydraw, that.w, that.h);
	}
}
//Creates a menu object when its parent, background image, music object, array of buttons and lables and name of next scene
var Menu = function(Parent,BGimages,Music,Buttons,Labels,NextString){
	var that = this;
	this.parent = Parent;
	this.nextString = (!NextString) ? "END" : NextString ;
	this.context = Parent.context;
	this.FPS = 60;
	this.bgImages = BGimages;
	this.buttons = Buttons;
	this.labels = Labels;
	this.music = Music;
	
	this.init = function() {
		if (that.music) {
			that.music.play();
		}
		
	}
	
	this.draw = function() {
		if (that.bgImages) {
			that.context.drawImage(that.bgImages, 0, 0, 1024, 768);
		}
		if (that.buttons) {
			for(var i = 0; i < that.buttons.length; i++) {
				var button = that.buttons[i];
				button.draw();
			}
		}
		if (that.labels) {
			for (var i = 0; i < that.labels.length; i++) {
				var label = that.labels[i];
				label.draw();
			}
		}
	}
	
	this.clickHandler = function(evt) {
		var x = evt.offsetX;
		var y = evt.offsetY;
		for(var i = 0; i < that.buttons.length; i++) {
			var button = that.buttons[i];
			if(button.clicked(x, y)) {
				console.log("button " + i + " clicked");
			}
		}
	
	}
	
	this.keyDownHandler = function(evt) {
		if(evt.which == 27) {
			console.log("esc pressed");
		}
	}
}