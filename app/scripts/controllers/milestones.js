'use strict';

glance.controller('MilestonesCtrl', function($scope) {

	$scope.addMilestone = function(milestone) {
		console.log(milestone);
	}

	$scope.editMilestone = function(editMilestone) {
		console.log(editMilestone);
	}

	$scope.removeMilestone = function($index) {
		console.log("Milestone Removed");
	}

	$scope.selectMilestone = function($index) {
		console.log("Project: Milestones");
	}	

});