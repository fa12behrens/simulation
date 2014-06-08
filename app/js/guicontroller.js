var GUIcontroller = function() {
/* the controller has to be called by the workerbuilder because it waits for every single worker to finish
when every worker is finished the barrier is broken and every moved object has been set to .active = true
and has a .path = [[x,y],...] . This way it ensured that every worker is finished*/
/*Because of the asynchron event listener behavior this function only continues the controller but has to be called
multiple times (whenever routing is required), so conditions have to be considered when making specific calls*/

 	this.make_turn = function(id_array) {

		if (id_array != "") {
	 		worker_array = [];
	 		var keys = Object.keys(id_array);
		 	keys.forEach(function(specific_object) {

				worker_array.push(specific_object);
				object_container[specific_object].end_x = id_array[specific_object][0];
				object_container[specific_object].end_y = id_array[specific_object][1];
			});
	 	}

	 	worker_queue.create_workers(worker_array);
 	};

	/* after the worker_queue is finished it calls this function to keep the order of operations.
	Otherwise processes will be executed even before all threads are finished*/
	this.synchronized_callback = function() {

/* here comes the main logic of the controller, it is important to build it with conditions
so that it can be called multiply times because while moving it is possible to calculate new paths*/
		for(var x = 0; x < number_of_intervalls; x++) {

			//	setTimeout(function(){GUIcontroller.make_turn(id_array)}, timeout*x);
			//GUIcontroller.controller_callback();
			//handle_canvas_grid();
			//intervall.next_intervall();
		
	setTimeout(function(){intervall.next_intervall()}, timeout*(x+1));
	setTimeout(function(){handle_canvas_grid()}, timeout*(x+1));

		}
	};
};


// Guicontroller inizieren -
// object_container mit max paths definieren -
// object_container.create_content mit position -
// new intervall counter mit 0 erstellen!? -
// grid und old_astar grid setzen -
// create astar grid mit grid und false aufrufen -
// new worker_queue bauen und worker finished counter gleich 1 setzen -
// timeout und zahl der intervalle festlegen -
// guicontroller mit make_turn aufrufen -


/*
// create the controller object for callbacks
var GUIcontroller_instance = new GUIcontroller();

var max_length_ID = 10;
id_array = [];
id_array[1] = [1,17];
id_array[5] = [9,1];


var object_container = new object_container(max_length_ID);
object_container.create_content(id_array);

// setting the time counter intervall
var intervall = new intervall(0);

var	grid = [
	[8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 2, 7, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 4, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 5, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 8, 8, 8, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 8, 8],
	[1, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 8, 8, 8, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 6, 0, 8, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 0, 0, 0, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8, 8, 8, 8, 0, 8],
	[8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 8],
	[8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8]
];

old_grid = grid;
var astar_grid= create_astar_grid(grid,false);

// initialize worker queue
var worker_queue = new worker_queue();
var worker_finished_counter = 1;

var timeout = 1000;
number_of_intervalls = 20;

id_array[1] = [14,12];
id_array[5] = [19,11];

GUIcontroller_instance.make_turn(id_array);

// collision prevention		wait when field is blocked
// return grid && return object_container
*/