/*
	The Menu class is made for displaying a menu
	the menu class will do nothing more than display
	a menu of clickable labels, each with an associated function
	the menu will take an arbitrarily large number of image files
	and iterate through them. at a set speed. it will randomly pan
	through the images. I can play a sound if you wish for bgm.
*/
var Label = function(Text, fontSize, IMG, TextX,TextY,ImX,ImY){
	var that = this;
	this.img = IMG;
	this.text = Text;
	this.textX = TextX;
	this.textY = Texty;
	this.imX = ImX;
	this.imY = Imy;
	this.font = ""+fontSize+"px Arial";
	this.parent;
	
	this.setParent = function(PARENT){
		that.parent = PARENT;
	}
	
	this.draw = function(){
		if(that.text!='undefined'){
			Parent.context.font = font;
			Parent.context.fillText(Text,textX,textY);
		}
		if(that.img != 'undefined'){
			Parent.context.drawImage(img,imX,imY);
		}
		if(that.text=='undefined' && that.img=='undefined'){
			console.log("EHRMEGERD YOU PASSED NO IMAGE OR TEXT TO THE LABEL!");
		}
	}
}

var Button = function(img,Xdraw,Ydraw,Height,Width){
	var that = this;
	this.xdraw = Xdraw;
	this.ydraw = Ydraw;
	this.w = Width;
	this.h = Height;
	this.parent;
	this.ctx = parent.context;
	
	this.setParent = function(PARENT){
		that.parent = PARENT;
	}
	
	this.clicked = function(x,y){
		return (x>=xdraw && x<xdraw+this.w && y>ydraw && y<ydraw+this.h);
	}
	
	this.draw = function(){
		this.ctx.drawImage(img,Xdraw,Ydraw);
	}
}

//Draw all the buttons, clickable, init = create all buttons, 
var Menu = function(BGimages,Music,Buttons,Labels,NextString){
	var that = this;
	this.parent;
	this.nextString = (NextString=='undefined') ? "END" : NextString ;
	this.context = this.parent.context;
	this.FPS = 60;
	this.bgImages = BGimages;
	this.buttons = Buttons;
	this.labels = Labels;
	this.music = Music;
	this.setParent = function(PARENT){
		that.parent = PARENT;
	}
	
	this.init = function() {
		if(that.bgImages != 'undefined') {
			that.parent
		}
	}
}