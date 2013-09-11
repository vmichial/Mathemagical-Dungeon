/*
Player info 
	hp					hp		0-100
	
	addition magic		mp		0-100
	subtraction magic			0-100
	multiplication magic		0-100
	division magic				0-100
	
	wasd navigation
	arrow key menu nav
	space bar active/ok button
	
	menu needs to have visible stats at all times,
	and magic type/skill trees sometimes
	
	CLASS NEEDS
	draw function that draws ui pieces
	
*/



var UIManager = function(){
	//Setup
	var that = this; //in case of "this" conflict
	var canvas = document.getElementById('canvas');
	canvas.width = 800; canvas.height = 600;
	var context = canvas.getContext('2d');
	
	//Draw background of canvas
	var background = new Image();
	background.src='bastion.jpg';
	background.onload = function(){
		//Everthing has to be done after the background loads
		drawBackground(context,background);
		drawStatMenu(context);
		if(mode == 'spellMenu') drawSpellMenu(context);
	}
	
	
	
	//Update, which does nothing right now because we have a global
	this.update = function(){
		//Fetch user data
		for(var i=0;i<dataTypes.length;i++)
			console.log(userData[dataTypes[i]]);
		}
	//Draw, which takes the global var and redraws the canvas with the new data
	this.draw = function(){
		drawBackground(context,background);
		drawStatMenu(context);
		if(mode == 'spellMenu') drawSpellMenu(context);
	}
}
function drawBackground(context,background){
	//Draw the background
	context.drawImage(background,0,0);
}
function drawStatMenu(context){
	//Draw background of menu
	context.fillStyle = 'rgba(0,0,0,0.6)';
	context.fillRect(0,560,800,40);
		
	//Draw the captions and data
	context.font = '16px Monaco, Monospace';
	context.fillStyle = '#fff';

	for(var i=0;i<dataTypes.length;i++){
		if(dataTypes[i] == 'hp'){ //Is HP
			context.fillText(dataTypes[i].toUpperCase(),10+(150*i),587); //Caption
			context.strokeStyle = '#fff';
			context.strokeRect(40,571,100,19);
			context.fillStyle = 'rgba(255,255,255,0.4)';
			//context.fillRect(40,571,userData[dataTypes[i]],19);
			context.fillRect(40,571,Player.hp,19);
		}
		else {
			context.fillStyle = '#fff';
			context.fillText(dataTypes[i].toUpperCase(),60+(150*i),587); //Caption
			//context.fillText(userData[dataTypes[i]].toString()+'/'+'100',90+(150*i),587); //Data
			context.fillText(Player.mp[dataMemberNames[i]].toString()+'/'+'100',90+(150*i),587); //Data

		}
	}
	
}
function drawSpellMenu(context){
	//Get size of menu
	var height = 20;
	var y = 0;
	for(var i=0;i<Object.keys(availableSpells).length;i++){ //Loop through spell types
		var typeHeight = 55 + availableSpells[spellTypes[i]].length * 20; //20 per entry
		if(typeHeight > height) {
			height = typeHeight;
			y = 550 - height;
		}
	}
	//Draw background of menu
	context.fillStyle = 'rgba(0,0,0,0.6)';
	context.fillRect(0,y,800,height);
	
	//Draw the captions and data
	context.font = '16px Monaco, Monospace';
	context.fillStyle = '#fff';
	
	var currentType = spellSelected[0];
	var currentTypeIndex = spellTypes.indexOf(currentType);
	var currentSpell = spellSelected[1];
	var currentSpellIndex = availableSpells[spellTypes[currentTypeIndex]].indexOf(currentSpell);
		

	for(var i=0;i<Object.keys(availableSpells).length;i++){ //Loop through spell types	
		context.fillText(spellTypes[i].toUpperCase(),10+(200*i),y+31); //Header (spell type)
		for(var j=0;j<availableSpells[spellTypes[i]].length;j++){ //Loop through spells	
			var yCursor = y+47+(20*j);
			var yText = y+58+(20*j);
			
			if(i == currentTypeIndex && j == currentSpellIndex){
				//Fill in cursor, if this is the right spell
				context.strokeStyle = '#fff';
				context.strokeRect(10+(200*i),yCursor,10,10);
				context.fillStyle = 'rgba(255,255,255,0.5)';
				context.fillRect(10+(200*i),yCursor,10,10);
			}
			else {
				//Draw cursor area
				context.strokeStyle = 'rgba(255,255,255,0.5)';
				context.strokeRect(10+(200*i),yCursor,10,10);
			}
			
			//Draw text
			context.fillStyle = '#fff';
			context.fillText(availableSpells[spellTypes[i]][j],30+(200*i),yText);
		}
	}

}
/*
TODO
*/