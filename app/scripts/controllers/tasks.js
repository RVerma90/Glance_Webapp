'use strict';

glance.controller('TasksCtrl', function($scope, $state, $mdDialog) {

	$scope.tasks = [
		{title: 'Yask 1'},
		{title: 'Last 2'},
		{title: 'Rask 3'}
	];

	$scope.selectTask = function($index) {
		$state.go('glanceboard');
	}	

	$scope.addTask = function(ev) {
		$mdDialog.show({
			targetEvent: ev,
			templateUrl: 'views/newtask.html',
			locals: {
				tasks: $scope.tasks
			},
			controller: 'TaskDialog',
			clickOutsideToClose: true
		});
	}

	$scope.editTask = function(editTask) {
		console.log(editTask);
	}

	$scope.removeTask = function($index) {
		console.log("Task Removed");
	}

});