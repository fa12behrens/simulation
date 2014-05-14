// this function should somehow provide if the given id should get a new path
// if yes the object_container[id] needs new .end_y and .end_x as targets
function get_movement_info(id) {

	if (id < 10) {
		return true;
	}
	else {
		return null;
	};

}

var GUIcontroller = function() {
/* the controller has to be called by the workerbuilder because it waits for every single worker to finish
when every worker is finished the barrier is broken and every moved object has been set to .active = true
and has a .path = [[x,y],...] . This way it ensured that every worker is finished*/
/*Because of the asynchron event listener behavior this function only continues the controller but has to be called
multiple times (whenever routing is required), so conditions have to be considered when making speciifc calls*/

	this.already_checked = false;
 	this.controller_callback = function() {

// here the controller checks if any new pathfindings for an ID are required
 
		if (this.already_checked === false) {
	 		id_array = [];
			for (var current_object = 0; current_object < object_container.number_objects; current_object++) {
				if (object_container[current_object].active === false) {
					if (get_movement_info(current_object) != null) {
						id_array.push(current_object);
					};
				};
			};

	// if there are any pathfinding request call the workerbuilder
			if (id_array != "") {
				this.already_checked = true;
				worker_queue.create_workers(id_array);
				id_array = [];
			};			
		}
		else {
			//this.already_checked = false;
			this.handle_one_intervall();	
		};
	};

	this.handle_one_intervall = function() {

		
		intervall.next_intervall();
		handle_canvas_grid();

	};

	/* after the worker_queue is finished it calls this function to keep the order of operations.
	Otherwise processes will be executed even before all threads are finished*/
	this.synchronized_callback = function() {

/* here comes the main logic of the controller, it is important to build it with conditions
so that it can be called multiply times because while moving it is possible to calculate new paths*/
		for(var x = 0; x < number_of_intervalls; x++) {
			GUIcontroller.controller_callback();
		};

	}
}


/* the object container needs that many objects how many entries are possible in id_array.
Even when object 0,1,2 are never moved, when you want to move 3 you still need 4 objects,
but this event should never occur when sticking to the object order, so the IDs of the
non-movable objects should be always higher than the movables ones*/

// create the controller object for callbacks
var GUIcontroller = new GUIcontroller();

// create 10 movables, including 5 waiters and 5 customers

var num_waiter = 1;
var num_customer = 0;
var num_sum = num_waiter+num_customer;

var object_container = new object_container(num_sum,num_waiter,num_customer);
object_container.create_content();

// setting the time counter intervall
var intervall = new intervall(0);

// initialize the 2d coordinate grid
call_grid_logic();
old_grid = grid;
create_astar_grid(grid,false);


// initialize worker queue
var worker_queue = new worker_queue();
var worker_finished_counter = 0;

var number_of_intervalls = 19;
GUIcontroller.controller_callback();
