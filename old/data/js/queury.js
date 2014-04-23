// worker queury functions
// dynamacilly builds the movable objects
// spawn a own worker for every given object and returns the path

// return the worker output back to its old array form
// faster than JSON.stringify()
function handle_string_data(data) {
  result = [data];
  return result;
}             

function worker_object() {

  var path;
  this.set_path = function(path) {
    this.path = path;
  }

  this.get_path = function() {
    return path;
  }
}

/* this function checks the canvas grid for its picture number. It
is defined that all objects up to number 2 are walkable. Persons are
walkable to avoid loop calculations and strange paths because of
temporary blocked ways by persons. Collusions with persons are handled 
live during the intervalls */
function translate_grid_for_a_star(grid)
{
  var a_star_grid = new Array(grid.length);

  for (var arraylength = 0; arraylength < grid.length; arraylength++) {
    a_star_grid[arraylength] = new Array(grid[arraylength].length);
  };

  for (var width = 0; width < grid.length; width++) {
    for (var height = 0; height < grid[width].length; height++) {
  
      if (grid[width][height] < 3) {
        a_star_grid[width][height] = 1;
      }
      else {
        a_star_grid[width][height] = 0;
      }
    };
  };

  return a_star_grid;
}




/*
// example for a single static worker use

var worker = {};
worker[1] = new Worker('workers/pathfinding.js');
worker[1].addEventListener('message', function(event) {

  if (event.data.state === 'finished') {
  handle_string_data(event.data.result);
  document.getElementById('output').innerContent = document.getElementById('output').textContent+"\n"+result + "/id="+event.data.id;
  }
  else {
    alert("error");
  };
});

var grid = [[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[0,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1]];
var var_start_x = 0;
var var_start_y = 0;
var var_end_x = 9;
var var_end_y = 9;

worker[1].postMessage({
  cmd: "start",
  id: 1,
  start_x: var_start_x,
  start_y: var_start_y,
  end_x: var_end_x,
  end_y: var_end_y,
array: grid
});

*/



// declaring the container object for the object which are using workers

function object_container(number_objects) {

  this.number_objects = number_objects;
  this.create_content = function() {

// create the needed movable objects, the attributes are only for example static now
// you can call object 50 with object_container[50]
    for (var single_object = 0; single_object < number_objects; single_object++) {
      object_container[single_object] = {id: single_object, path: [0,0], active: false, start_x: 0, start_y: 0,  end_x: 9, end_y: 9};
    };
  }
}



// declaring the worker manager object, here the workers are definied and queued
function worker_queue() {
  
  this.active = true;
  this.worker_counter = 0;
  grid = [[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1],[1,1,1,1,1,1,1,1,1,1]];

  this.create_workers = function(id_array) {

    var active_worker_array = new Array();
    for (var current_object = 0; current_object < id_array.length; current_object++) {
      active_worker_array.push(object_container[id_array[current_object]].id);
    };

// create a container object for the worker communication objects for a easier handling over IDs
// worker gets the same ID as its referenced movable object
    var worker_container = {};
    for (var current_worker = 0; current_worker < active_worker_array.length; current_worker++) {

// create the worker socket 
      worker_container[current_worker] = new Worker('data/js/worker.js');
// add event listener to socket so the worker can receive messages
// the external worker script has his own side of an event listner
      worker_container[current_worker].addEventListener('message', function(event) {

// this will be called like a function when the worker postMessages the event.data
       if (event.data.state === 'finished') {
// if finished then example output
          handle_string_data(event.data.result);
          document.getElementById('output').innerHTML = document.getElementById('output').innerHTML+"<br>"+result+"/id="+event.data.id;
        }
        else {
          alert("error");
      };
    });

// activate the worker with the needed values

    worker_container[current_worker].active = true;
    worker_container[current_worker].postMessage({
      cmd: "start",
      id: object_container[current_worker].id,
      start_x: object_container[current_worker].start_x,
      start_y: object_container[current_worker].start_y,
      end_x: object_container[current_worker].end_x,
      end_y: object_container[current_worker].end_y,
      array: grid
      });
    }
  }
}



// example MAIN function, create 100 objects and submit 6 pathfinding jobs

var object_container = new object_container(100);
object_container.create_content();
var id_array = [1,2,3,4,5,6];
var worker_queue = new worker_queue();
worker_queue.create_workers(id_array);




