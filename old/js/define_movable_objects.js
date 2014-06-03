/*	The IDs are created dynamically so there must be a default order to keep things simple.
The order is now that the waiters come first in enumeration and then the customers
The maximum number of customers will define how much customer objects will be created, with
the active attribute they can be turned off, when not all customers are in the processing.
The ID order will last for the whole logic and will be used to identify the workers*/
// declaring the container object for the object which are using workers
function object_container(max_length_ID) {

	this.number_objects = max_length_ID;


/* this method is called before the first turn because it can exist more
objects than will be known at the beginning. For example customer number 10
exist firstly at turn 100 and so the target will be known then, but the entry
has to exist in object_container to be overwritten*/
	this.create_content = function(id_array) {

		var current_id = 0;
		for (var single_object = 0; single_object < this.number_objects; single_object++) {

// this part creates a placeholder object for each possible entry
			object_container[single_object] = {id: single_object, path: [0,0], type: "type", active: false, waiting: 0, start_x: 0, start_y: 0, end_x: 0, end_y: 0};
		};

	 	var keys = Object.keys(id_array);
	 	keys.forEach(function(specific_object) {
			current_id = specific_object;		
	 	
// declares every single object and gets its attributes over the id, path value is only a placeholder
			object_container[specific_object].start_x = id_array[specific_object][0];
			object_container[specific_object].start_y = id_array[specific_object][1];
		});	
	}

	this.set_start_xy = function(id,x,y) {
		object_container[id].start_x = x;
		object_container[id].start_y = y;
	};

	this.set_end_xy = function(id,x,y) {
		object_container[id].end_x = x;
		object_container[id].end_y = y;
	};

}

