function create_astar_grid(grid,only_field_option) {
	astar_grid = [];
	this.only_field_option = only_field_option;

	for (var current_x = 0; current_x < grid.length; current_x++) {

		astar_grid[current_x] = [];
		for (var current_y = 0; current_y < grid[current_x].length;current_y++) {

			if (only_field_option == true) {			
				if (grid[current_x][current_y] = 0) {
					astar_grid[current_x][current_y] = 1;
				}
				else {
					astar_grid[current_x][current_y] = 0;
				}
			}
			if (only_field_option == false) {
				if (grid[current_x][current_y] < 4) {
					astar_grid[current_x][current_y] = 1;
				}
				else {
					astar_grid[current_x][current_y] = 0;
				}
			};
		};
	};

	return astar_grid;
}
