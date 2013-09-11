

function Thing()
{
	this.data = 0;
	
	this.func = new function(x)
	{
		print(x)
	}
}

var stuff = new Thing()
Thing.func(3)