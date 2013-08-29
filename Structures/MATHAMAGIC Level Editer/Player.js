
function PlayerC (x, y)
{
	this.posX =	x;
	this.posY = y;
	
	this.SetPosition = function(x, y)
	{
		this.posX = x;
		this.posY = y;
	};
	
	this.Draw = function()
	{
		ctx.fillStyle = "#FF0000";
		ctx.beginPath();
		ctx.arc(this.posX + 25, this.posY + 25, 10, 0, 2*Math.PI);
		ctx.stroke();
		ctx.fill();
	};
	
	
	this.move = function(e)
	{
		console.log(this.posX, this.posY)
		var key = e.keyCode;
		//left
		if (key == 37)
			this.posX -= 50;
		//right
		if (key == 39)
			this.posX += 50;
		//up
		if (key == 38)
			this.posY -= 50;
		//down
		if (key == 40)
			this.posY += 50;
		console.log(this.posX, this.posY)
	};		
	
}

var player = new PlayerC(0, 0);
document.addEventListener("keydown", player.move, false);