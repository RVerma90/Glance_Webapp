'use strict';

glance.controller('TasksCtrl', 
	function($scope, 
			 $state, 
			 FURL,
			 Tasks,
			 $stateParams) {

	$scope.tasks = Tasks.show();

	$scope.selectTask = function($stateParam, task) {
		$state.go('glanceboard');

	};

	$scope.addTask = function(e) {
		Tasks.add(e);
	};

	$scope.updateTask = function(e, task) {
		Tasks.update(e, task);
	};


});