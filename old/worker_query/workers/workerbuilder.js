// declaring the worker manager object, here the workers are definied and queued
function worker_queue() {

// active is used for the intervall handler if the object is moved or not
	this.active = false;
	this.create_workers = function(id_array) {

// parses the image grid to walkable grid
		create_astar_grid(grid,false);
		var active_worker_array = new Array();
		this.active = true;

// push active workers via ID into the array, so that every worker has the ID to the corresponding movable object
		for (var current_object = 0; current_object < id_array.length; current_object++) {
			active_worker_array.push(object_container[id_array[current_object]].id);
		};

// create a container object for the worker socket objects
		var worker_container = {}; 
		for (var current_worker = 0; current_worker < active_worker_array.length; current_worker++) {
	
	// create a worker
			worker_container[current_worker] = new Worker('workers/pathfinding.js');
	// add an event listener to the worker socket object, this will executed like a function when the worker posts back
			worker_container[current_worker].addEventListener('message', function(event) {

			// when worker is finished this code will be executed
				if (event.data.state === 'finished') {

				// transfer the worker data to the corresponding object via ID
					object_container[event.data.id].path = event.data.result;
					object_container[event.data.id].active = true;
				//  worker_finished_counter is used to build a barrier for waiting that all threads are finished
					worker_finished_counter++;

				// when every thread is finished then call the intervall object to execute the next turn
					if (worker_finished_counter === id_array.length) {
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
				id: active_worker_array[current_worker],
				start_x: object_container[active_worker_array[current_worker]].start_x,
				start_y: object_container[active_worker_array[current_worker]].start_y,
				end_x: object_container[active_worker_array[current_worker]].end_x,
				end_y: object_container[active_worker_array[current_worker]].end_y,
				array: astar_grid
			});
		}
	}
}
