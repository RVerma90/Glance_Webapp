'use strict';

glance.controller('TasksCtrl', function($scope, $state) {

	$scope.tasks = [
		{title: 'Yask 1'},
		{title: 'Last 2'},
		{title: 'Rask 3'}

	];

	$scope.selectTask = function($index) {
		$state.go('glanceboard');
	}	

	$scope.addTask = function(task) {
		console.log(task);
	}

	$scope.editTask = function(editTask) {
		console.log(editTask);
	}

	$scope.removeTask = function($index) {
		console.log("Task Removed");
	}

});