'use strict';

glance.controller('TasksCtrl', function($scope) {

	$scope.addTask = function(task) {
		console.log(task);
	}

	$scope.editTask = function(editTask) {
		console.log(editTask);
	}

	$scope.removeTask = function($index) {
		console.log("Task Removed");
	}

	$scope.selectTask = function($index) {
		console.log("Project: Milestone: Tasks");
	}	

});