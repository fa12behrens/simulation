// declaring the worker manager object, here the workers are definied and queued
function worker_queue() {

// active is used for the intervall handler if the object is moved or not
	this.active = false;
	this.create_workers = function(worker_array) {

// parses the image grid to walkable grid
		create_astar_grid(grid,false);
		this.active = true;

// create a container object for the worker socket objects
		var worker_container = {};
		for (var current_worker = 0; current_worker < worker_array.length; current_worker++) {
	// create a worker
			worker_container[current_worker] = new Worker('workers/pathfinding.js');
	// add an event listener to the worker socket object, this will executed like a function when the worker posts back
			worker_container[current_worker].addEventListener('message', function(event) {

		// when worker is finished this code will be executed
		// ATTENTION this event listener is the next operation after the post message, the post return will trigger it so read it like it will be executed next

				if (event.data.state === 'finished') {

				// transfer the worker data to the corresponding object via ID
					object_container[event.data.id].path = event.data.result;

				// If there is an path set the object to active otherwise false
					if (object_container[event.data.id].path[0] != 0 || object_container[event.data.id].path[1] != 0) {
						object_container[event.data.id].active = true;
					} else {
						object_container[event.data.id].active = false;
					}

				//  worker_finished_counter is used to build a barrier for waiting that all threads are finished
					worker_finished_counter++;

				// when every thread is finished then call the intervall object to execute the next turn
					if (worker_finished_counter === worker_array.length) {
						worker_finished_counter = 0;

// CALLBACK to controller because the worker are asynchron to the controller order				

						GUIcontroller.synchronized_callback();

// ######################						
					};
				}
			// if this happens the communication between the main window and the worker threads is somehow disrupted
				else {
					alert("unexpected thread error occured, no idea how this can happen, please use Firefox or Chrome");
				};
			});

			worker_container[current_worker].active = true;


// activate the worker with posting this object, the event listener on the worker side will trigger on this
			worker_container[current_worker].postMessage({
				cmd: "start",
				id: worker_array[current_worker],
				start_x: object_container[worker_array[current_worker]].start_x,
				start_y: object_container[worker_array[current_worker]].start_y,
				end_x: object_container[worker_array[current_worker]].end_x,
				end_y: object_container[worker_array[current_worker]].end_y,
				array: astar_grid
			});
		}
	}
}
