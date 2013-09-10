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

var Button = function(Parent,img,Xdraw,Ydraw,Height,Width){
	var that = this;
	this.xdraw = Xdraw;
	this.ydraw = Ydraw;
	this.w = Width;
	this.h = Height;
	this.parent = Parent;
	this.ctx = parent.context;
	
	this.clicked = function(x,y){
		return (x>=xdraw && x<xdraw+this.w && y>ydraw && y<ydraw+this.h);
	}
	
	this.draw = function(){
		that.ctx.drawImage(img,Xdraw,Ydraw);
	}
}
var Menu = function(Parent,BGimages,Music,Buttons,Labels,NextString){
	var that = this;
	this.parent = Parent;
	this.nextString = (NextString=='undefined') ? "END" : NextString ;
	this.context = Parent.context;
	this.FPS = 60;
	this.bgImages = BGimages;
	this.buttons = Buttons;
	this.labels = Labels;
	this.music = Music;
	
	this.init = function() {
		if (that.music != 'undefined') {
			that.music.play();
		}
		
	}
	
	this.draw = function() {
		if (that.bgImages != 'undefined') {
			that.context.drawImage(that.bgImages, 0, 0, 1024, 768);
		}
		if (that.buttons != 'undefined') {
			for(int i = 0; i < that.buttons.length; i++) {
				var button = that.buttons[i];
				button.draw();
			}
		}
		if (that.labels != 'undefined') {
			for (int i = 0; i < that.labels.length; i++) {
				var label = that.labels[i];
				label.draw();
			}
		}
	}
	
}