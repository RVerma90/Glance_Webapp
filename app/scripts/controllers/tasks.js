'use strict';

glance.controller('TasksCtrl', 
	function($scope, 
			 $state, 
			 FURL,
			 Tasks,
			 $stateParams) {

	var milestone = $stateParams.mid;

	$scope.tasks = Tasks.show(milestone);

	$scope.selectTask = function($stateParam, task) {
		$state.go('glanceboard');

	};

	$scope.addTask = function(e, task) {
		Tasks.add(e, task);
	};

	$scope.updateTask = function(e, task) {
		Tasks.update(e, task);
	};


});