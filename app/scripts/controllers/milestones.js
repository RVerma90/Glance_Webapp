'use strict';

glance.controller('MilestonesCtrl', function($scope, $state) {

	$scope.milestones = [
		{title: 'Rilesstone 1'},
		{title: 'Hilestone 2'},
		{title: 'Piletone 3'}

	];

	$scope.selectMilestone = function($index) {
		$state.go('tasks');
	}	

	$scope.addMilestone = function(milestone) {
		console.log(milestone);
	}

	$scope.editMilestone = function(editMilestone) {
		console.log(editMilestone);
	}

	$scope.removeMilestone = function($index) {
		console.log("Milestone Removed");
	}

});