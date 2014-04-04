function RNG()
{
	var minRange;
	var maxRange;
	var randomNumber;

	this.generate = function(minRange,maxRange)
	{
		this.maxRange=maxRange;
		this.minRange=minRange;
		this.randomNumber=Math.floor((Math.random()*this.maxRange)+this.minRange);
		return this.randomNumber;
	}
}
