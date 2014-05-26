/*	The IDs are created dynamically so there must be a default order to keep things simple.
The order is now that the waiters come first in enumeration and then the customers
The maximum number of customers will define how much customer objects will be created, with
the active attribute they can be turned off, when not all customers are in the processing.
The ID order will last for the whole logic and will be used to identify the workers*/
// declaring the container object for the object which are using workers
function object_container(number_objects,number_waiter,number_customer) {

	this.number_objects = number_objects;
	this.number_waiter = number_waiter;
	this.number_customer = number_customer;

	this.create_content = function() {

		for (var single_object = 0; single_object < number_objects; single_object++) {

// this part has to be generated dynamically depending on start position for every object
// just a example for the waiter
			var current_type = this.get_type(single_object);
			var current_start_x = 1;
			var current_start_y = 17;
			var current_end_x = 15;
			var current_end_y = 11;

// declares every single object and gets its attributes over the id, path value is only a placeholder
			object_container[single_object] = {id: single_object, path: [0,0], type: current_type, active: false, start_x: current_start_x, start_y: current_start_y, end_x: current_end_x, end_y: current_end_y};
		
		};
	}

	this.get_type = function(id) {

		if (id < number_waiter) {
			return "waiter";
		}
		else {
			return "customer";
		};
	}

// somehow the starting points have to be declared by the main window
// fill it with life

	this.set_start_xy = function(id,x,y) {
		object_container[id].start_x = x;
		object_container[id].start_y = y;
	}

	this.set_end_xy = function(id,x,y) {
		object_container[id].end_x = x;
		object_container[id].end_y = y;
	}

}

