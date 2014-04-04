// room constructor
function room(id,size)
{
	this.id=id;
	this.size=size;
	var maxOccupancy=0;
	var occupancy;

	this.get_id = function()
	{
		return this.id;
	}

	this.get_size = function()
	{
		return this.size;
	}

	this.set_maxOccupancy = function(maxOccupancy)
	{
		this.maxOccupancy=maxOccupancy;
	}

	this.get_maxOccupancy = function(maxOccupancy)
	{
		return this.maxOccupancy;
	}

	this.set_occupancy = function(occupancy)
	{
		if (occupancy<this.maxOccupancy) {
			this.occupancy=occupancy;
		} else {
			this.occupancy=this.maxOccupancy;
		};
	}

	this.get_occupancy = function()
	{
		return this.occupancy;
	}

}


//resource constructor
function resource(id,amount,purchasePrice,durability)
{
	this.id=id;
	this.amount=amount;
	this.purchasePrice=purchasePrice;
	this.durability=durability;

	this.get_id = function()
	{
		return this.id;
	}

	this.get_amount = function()
	{
		return this.amount;
	}

	this.set_amount = function(amount)
	{
		this.amount=amount;
	}

	this.get_purchasePrice = function()
	{
		return this.purchasePrice;
	}

	this.get_durability = function()
	{
		return this.durability;
	}

}

//product constructor
function product(id,amount,price,timeToCold,ingredients_array,preparationTime,condition,creationTime)
{
	this.id=id;
	this.amount=amount;
	this.price=price;
	this.timeToCold=timeToCold;
	var ingredients_array=new Array();
	this.ingredients_array=ingredients_array;
	this.preparationTime=preparationTime;
	this.condition=condition;
	this.creationTime=creationTime;

	this.get_id = function(){
		return this.id;
	}

	this.get_amount = function()
	{
		return this.amount;
	}

	this.set_amount = function(amount)
	{
		this.amount=amount;
	}

	this.get_price = function()
	{
		return this.price;
	}

	this.get_timeToCold = function()
	{
		return this.timeToCold;
	}

	this.get_ingredients_array = function()
	{
		return this.ingredients_array;
	}

	this.get_preparationTime = function()
	{
		return this.preparationTime;
	}

	this.get_condition = function()
	{
		return this.condition;
	}

	this.set_condition = function(condition)
	{
		this.condition=condition;	
	}

	this.get_creationTime = function()
	{
		return this.creationTime;	
	}

	this.check_condition()
	{
		this.currentTime=time.get_currentTime();
		timeElapsed=this.currentTime-this.creationTime;
		if(this.timeElapsed>this.timeToCold){
			set_condition(false);
		}
	}
}

//human constructor
function human(id,type,movement,action)
{
	this.id=id;
	this.type=type;
	this.movement=movement;
	this.action=action;

	this.get_id = function()
	{
		return this.id;
	}
	
	this.get_type = function(){
		return this.type;
	}

	this.get_movement = function()
	{
		return this.movement;
	}

	this.get_action = function()
	{
		return this.action;
	}

	this.set_action = function(action)
	{
		this.action=action;
	}
}

//time constructor
function time()
{
	var currentTime;

	this.get_currentTime = function()
	{
		return this.currentTime;
	}

	this.increase_currentTime = function()
	{
		this.currentTime=this.currentTime+1;
	}
}

//equipment constructor
function equipment(id,size,type,inUse,consumption)
{
	this.id=id;
	this.size=size;
	this.type=type;
	this.inUse=inUse;
	this.consumption=consumption;

	var xyPlace_array = new Array();
	this.xyPlace_array[0]=0;
	this.xyPlace_array[1]=0;

	this.get_id = function()
	{
		return this.id;
	}

	this.get_size = function()
	{
		return this.size;
	}

	this.get_type = function()
	{
		return this.type;
	}

	this.get_xyPlace_array = function()
	{
		return this.xyPlace_array;
	}

	this.get_inUse = function()
	{
		return this.inUse;
	}

	this.get_consumption = function()
	{
		return this.consumption;
	}

	this.placeEquipment = function(xPosition,yPosition)
	{
		this.xyPlace_array[0]=xPosition;
		this.xyPlace_array[1]=yPosition;
	}

}

//cash constructor
function cash(powerCostsPerUnit)
{
	var earnings;
	var expenses;
	this.powerCostsPerUnit=powerCostsPerUnit;
	var cashSum;
	var powerCosts;

	this.set_earnings = function(earnings)
	{
		this.earnings=earnings;
	}	

	this.get_earnings = function()
	{
		return this.earnings;
	}	

	this.set_expenses = function(expenses)
	{
		this.expenses=expenses;
	}

	this.get_expenses = function()
	{
		return this.expenses;
	}	

	this.get_powerCostsPerUnit = function()
	{
		return this.powerCostsPerUnit;
	}	

	this.set_cashSum = function()
	{
		this.cashSum=this.earnings-this.expenses-this.powerCosts;
	}

	this.get_cashSum = function()
	{
		return this.cashSum;
	}	

	this.set_powerCosts = function(consumption)
	{
		this.powerCosts=this.powerCosts+(this.powerCostsPerUnit*consumption);
	}

	this.get_powerCosts = function()
	{
		return this.powerCosts;
	}	


}

//Random Generator constructor
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


//construct everything
function construct()
{
	//construct room object
	id="roo1";
	size=10;
	mainroom=new room(id,size);
	mainroom.set_maxOccupancy(100);
	mainroom.set_occupancy(50);

	//construct time object
	time=new time();

	//construct resource object
	meat=new resource("res1",5,10,5);
	milk=new resource("res2",10,2,1);
	rice=new resource("res3",25,1,25);

	//construct product object
	var ingredients_array=new Array();
	ingredients_array[0]="res1";
	ingredients_array[1]="res2";
	ingredients_array[2]="res3";
	id="pro1";
	amount=1;
	price=15;
	timeToCold=10;
	preparationTime=10;
	condition=true;
	creationTime=time.get_currentTime;

	Mahlzeit=new product(id,amount,price,timeToCold,ingredients_array,preparationTime,condition,creationTime);

	ingredients_array=new Array();
	ingredients_array[0]="res2";
	ingredients_array[1]="res3";
	id="pro2"
	amount=1;
	price=5;
	timeToCold=50;
	preparationTime=5;
	condition=true;
	creationTime=time.get_currentTime;

	Snack=new product(id,amount,price,timeToCold,ingredients_array,preparationTime,condition,creationTime);


	//construct human object
	id="emp1";
	type="cook";
	movement=false;
	action="cooking";
	cook1=new human(id,type,movement,action);

	id="cus1";
	type="customer";
	movement="true";
	action="incoming";
	customer1=new human(id,type,movement,action);
	
	id="emp2";
	type="warden";
	movement="true";
	action="waiting";
	warden1=new human(id,type,movement,action);

	//construct equipment object
	id="equ1";
	size=1;
	type="fridge";
	inUse=false;
	consumption=1;
	fridge=new equipment(id,size,type,inUse,consumption);

	//construct cash object
	powerCostsPerUnit=1;
	cash=new cash(powerCostsPerUnit);

	//construct RNG object
	RNG=new RNG();
	RNG.generate(1,10);

}
