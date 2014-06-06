// this side of the event listener waits from the main thread for instructions and triggers the worker
self.onmessage = function(event) {

	if (event.data.cmd === 'start') {

// importing the library
		importScripts("astar.js");

// creating the needed input for the library, graph is a object with the coordinate data, start and end_node define the beginning and target of the pathfinding
		var graph = new Graph(event.data.array);
		start_node = graph.nodes[event.data.start_x][event.data.start_y];
		end_node = graph.nodes[event.data.end_x][event.data.end_y];
// execute the library main function and save the result
		result = astar.search(graph.nodes, self.start_node, self.end_node);

// regex to convert the complex graph object into a simple 2d coordinate array
		result_array = new Array();
// first exract the result string from the object
		var result_buffer = "";
		for (var single_node = 0; single_node < result.length; single_node++) {
			result_buffer = result_buffer + " " + result[single_node];
			if (single_node == 0) {
				result_buffer = result[single_node];
			};
		}
// select the data between [] and push it into the result array
		var regex=/\[(\d+) (\d+)\]/g;
		while((part= regex.exec(result_buffer))!= null){
		    result_array.push([part[1], part[2]]);
		}

		//result_array.unshift([event.data.start_x,event.data.start_y]);


// send the data object back to the main thread
		event.data.result = result_array;
		event.data.state = 'finished';
		this.postMessage(event.data);
// kill the worker
		close();
	};
}


