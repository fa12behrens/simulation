
/* calls the astar library with an array where the map is described
by true and false for walkable and the starting node and end node.
The function will return an array with the single nodes which
represent the path. If there is no possible way the function
returns an empty array */

self.onmessage = function(event) {

  if (event.data.cmd === 'start') {

    importScripts("astar.js");                           
    var graph = new Graph(event.data.array);

    start_node = graph.nodes[event.data.start_x][event.data.start_y];
    end_node = graph.nodes[event.data.end_x][event.data.end_y];

    result = astar.search(graph.nodes, self.start_node, self.end_node);

// break the the output to string nearly like an array
// so JSON.stringify has not to be used, like it or not, but it was faster and better handable
    var result_buffer = "#";

    for (var single_node = 0; single_node < result.length; single_node++) {
      result_buffer = result_buffer + " " + result[single_node];
    };

    result_buffer = result_buffer.replace(/ /g,",");
    result_buffer = result_buffer.replace(/#,/g,"");

// return the data back to original scope
    event.data.result = result_buffer;
    event.data.state = 'finished';

    this.postMessage(event.data);

// kill the worker
    close();
  };
}