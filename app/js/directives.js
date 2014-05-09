'use strict';

/* Directives */

var simulationApp = angular.module('simulationApp.directives', [])

simulationApp.directive('appVersion', ['version', function (version) {
		return function (scope, elm, attrs) {
			elm.text(version);
		};
	}])
	// Todo: Fehlermeldung beheben
	// directives activate the accordion and the tab component from jquery-ui
	.directive('hboAccordion', function () {
		return {
			restrict: 'A',
			link: function () {
				$('.accordion').accordion()
			}
		};
	})

	.directive('hboTabs', function () {
		return {
			restrict: 'A',
			link: function () {
				$('.tab').tabs()
			}
		};
	});


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