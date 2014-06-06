//MAIN function for canvas
function draw_visualization() {

	construct_canvas_objects();
	socket_grid.set_array(grid);
	handle_canvas_grid();
}

function construct_canvas_objects() {

	var canvas = document.getElementById("canvas");
	if (canvas.getContext) {
		var engine = canvas.getContext("2d");
		visual = new visualization(engine);
		socket_grid = new socket_grid();
	}
}

function visualization(engine) {

	this.engine = engine;

//reference to the images and make an array of references to call them
	var pictures = new Array();

	pictures[0] = document.getElementById("field_image");
	pictures[1] = document.getElementById("door_image");
	pictures[2] = document.getElementById("waiter_image");
	pictures[3] = document.getElementById("customer_image");

	pictures[8] = document.getElementById("wall_image");
	pictures[4] = document.getElementById("cook_image");
	pictures[5] = document.getElementById("kitchen_image");
	pictures[6] = document.getElementById("table_image");
	pictures[7] = document.getElementById("storage_image");


//drawing the single objects
	this.draw_image = function (imageNumber, xPosition, yPosition) {
		this.engine.drawImage(pictures[imageNumber], xPosition, yPosition);
	}
}

//the constructor for the communication object
function socket_grid() {

	var canvas_grid = new Array();

	this.set_array = function (array) {
		canvas_grid = array;
	}

	this.get_array = function () {
		return canvas_grid;
	}

	this.get_grid_height = function () {
		return canvas_grid[0].length;
	}

	this.get_grid_width = function () {
		return canvas_grid.length;
	}

	this.return_grid = function () {
		return grid;
	}
}

function handle_canvas_grid() {

	var max_x = socket_grid.get_grid_width();
	var max_y = socket_grid.get_grid_height();
	var canvas_array = new Array();
	canvas_array = socket_grid.get_array();

	for (var current_width = 0; current_width < max_x; current_width++) {

		for (var current_height = 0; current_height < max_y; current_height++) {

			current_x = current_width * 25;
			current_y = current_height * 25;

			visual.draw_image(canvas_array[current_width][current_height], current_x, current_y);

		};
	};
}
