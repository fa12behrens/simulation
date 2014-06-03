function intervall(starting_intervall) {

	this.current_intervall = starting_intervall;

	this.next_intervall = function() {

		this.current_intervall++;

		var number_walkables = object_container.number_objects;
		//var number_walkables = object_container.number_waiter + object_container.number_customer;

		for (var current_walkable = 0; current_walkable < number_walkables; current_walkable++) {
// check if the next field will be blocked by a movable object, if so the object get +1 waiting
			if (object_container[current_walkable].active == true) {

				collusion=false;
/*
				var collusionpath = new Array();
				collusionpath = object_container[current_walkable].path;

				if (collusionpath != "") {
					next_step = collusionpath.shift();
					collusionpath.unshift(next_step);
					buffer_grid = socket_grid.get_array();

					if (buffer_grid[next_step[0]][next_step[1]] != 0) {
						collusion = true;
					}
				} else {
					collusion = true;
				}
*/
				if (object_container[current_walkable].path != "") {
			// we need the first element for test reason and unshifting is easier to clone the whole array, even this solution looks bad, we choose it for performance and confortable reasons
					next_step = object_container[current_walkable].path.shift();
					object_container[current_walkable].path.unshift(next_step);
					buffer_grid = socket_grid.get_array();
					
					if (buffer_grid[next_step[0]][next_step[1]] != 0) {
						collusion = true;
					}
				} else {
						collusion = true;
					
				}


				if (collusion == false) {
					xy_position = object_container[current_walkable].path.shift();

					new_grid = socket_grid.get_array();

// the grid is overwritten here by the position of the moved object
					
			// get the image ID of the old position to write it into the new grid
					type_num = old_grid[object_container[current_walkable].start_x][object_container[current_walkable].start_y];
	
			// overwrite the old position with a empty field, after that the new postiion will be saved to the object
					new_grid[object_container[current_walkable].start_x][object_container[current_walkable].start_y] = 0;
	
			// now overwrite the objects position from the path array
					object_container.set_start_xy(current_walkable,xy_position[0],xy_position[1]);
	
			// set back waiting counter to 0 because the object is moved
					object_container[current_walkable].waiting = 0;
	
			// write the picture id to the new grid
					new_grid[object_container[current_walkable].start_x][object_container[current_walkable].start_y] = type_num;
	
			// overwrite grid with new grid
					socket_grid.set_array(new_grid);
	
			// if the last field of the path was used, set the object to inactive
					if (object_container[current_walkable].path == "") {
						object_container[current_walkable].active = false;
						object_container[current_walkable].path = [0,0];
					};

				} else {
			// if the object colludes set the waiting counter +1 for further logic
					object_container[current_walkable].waiting += 1;

				};
			};
		};
	}
}