function intervall(starting_intervall) {

	this.current_intervall = starting_intervall;

	this.next_intervall = function() {

		this.current_intervall++;

		var number_walkables = object_container.number_waiter + object_container.number_customer;

		for (var current_walkable = 0; current_walkable < number_walkables; current_walkable++) {

			if (object_container[current_walkable].active == true) {

// #################
// the grid is overwritten here by the position of the moved object
				xy_position = object_container[current_walkable].path.shift();

				new_grid = socket_grid.get_array();

// too fast for testing, has to be handled by the outside logic then ok
				new_grid[object_container[current_walkable].start_x][object_container[current_walkable].start_y] = old_grid[object_container[current_walkable].start_x][object_container[current_walkable].start_y];

				object_container.set_start_xy(current_walkable,xy_position[0],xy_position[1]);
				

				if (object_container[current_walkable].type == "waiter") {
					type_num = 2;
				}
				else {
					type_num = 3;
				};
				new_grid[object_container[current_walkable].start_x][object_container[current_walkable].start_y] = type_num;
				socket_grid.set_array(new_grid);

// #################

				if (object_container[current_walkable].path == "") {
					object_container[current_walkable].active = false;
					object_container[current_walkable].path = [0,0];
				};
			};
		};
	}
}