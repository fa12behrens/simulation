'use strict';

/* Directives */

var simulationApp = angular.module('simulationApp.directives', [])

simulationApp.directive('appVersion', ['version', function (version) {
	return function (scope, elm, attrs) {
		elm.text(version);
	};
}]);
// Todo: Fehlermeldung beheben
// directives activate the accordion and the tab component from jquery-ui
simulationApp.directive('hboAccordion',[ function () {
	return {
		restrict: 'A',
		link: function () {
			$('.accordion').accordion();
		}
	};
}]);
simulationApp.directive('hboTabs',[ function () {
	return {
		restrict: 'A',
		link: function () {
			$('.tab').tabs();
		}
	};
}]);


simulationApp.directive('lvlDraggable', ['$rootScope', 'uuid', function($rootScope, uuid) {
	return {
		restrict: 'A',
		link: function(scope, el, attrs, controller) {
			console.log("linking draggable element");

			angular.element(el).attr("draggable", "true");
			var id = angular.element(el).attr("id");
			if (!id) {
				id = uuid.new()
				angular.element(el).attr("id", id);
			}

			el.bind("dragstart", function(e) {
				e.dataTransfer.setData('text', id);

				$rootScope.$emit("LVL-DRAG-START");
			});

			el.bind("dragend", function(e) {
				$rootScope.$emit("LVL-DRAG-END");
			});
		}
	}
}]);

simulationApp.directive('lvlDropTarget', ['$rootScope', 'uuid', function($rootScope, uuid) {
	return {
		restrict: 'A',
		scope: {
			onDrop: '&'
		},
		link: function(scope, el, attrs, controller) {
			var id = angular.element(el).attr("id");
			if (!id) {
				id = uuid.new()
				angular.element(el).attr("id", id);
			}

			el.bind("dragover", function(e) {
				if (e.preventDefault) {
					e.preventDefault(); // Necessary. Allows us to drop.
				}

				e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.
				return false;
			});

			el.bind("dragenter", function(e) {
				// this / e.target is the current hover target.
				angular.element(e.target).addClass('lvl-over');
			});

			el.bind("dragleave", function(e) {
				angular.element(e.target).removeClass('lvl-over');  // this / e.target is previous target element.
			});

			el.bind("drop", function(e) {
				if (e.preventDefault) {
					e.preventDefault(); // Necessary. Allows us to drop.
				}

				if (e.stopPropogation) {
					e.stopPropogation(); // Necessary. Allows us to drop.
				}
				var data = e.dataTransfer.getData("text");
				var dest = document.getElementById(id);
				var src = document.getElementById(data);

				scope.onDrop({dragEl: src, dropEl: dest});
			});

			$rootScope.$on("LVL-DRAG-START", function() {
				var el = document.getElementById(id);
				angular.element(el).addClass("lvl-target");
			});

			$rootScope.$on("LVL-DRAG-END", function() {
				var el = document.getElementById(id);
				angular.element(el).removeClass("lvl-target");
				angular.element(el).removeClass("lvl-over");
			});
		}
	}
}]);

// jquery command for refresh on div
/*
 $(document).ready(function () {
 $('#ajax').click(function () {
 var name = encodeURI($('#input').val());
 if (name == '') {
 //alert('Bitte einen Namen angeben!');
 } else {
 //alert(name);
 $('.refresh').load(window.location.pathname + ' .refresh');
 }
 });
 });
 */