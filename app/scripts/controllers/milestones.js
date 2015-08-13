'use strict';

glance.controller('MilestonesCtrl', function($scope, $state, $mdDialog) {

	$scope.milestones = [
		{title: 'Rilesstone 1'},
		{title: 'Hilestone 2'},
		{title: 'Piletone 3'}
	];

	$scope.selectMilestone = function($index) {
		$state.go('tasks');
	}	

	$scope.addMilestone = function(ev) {
		$mdDialog.show({
			targetEvent: ev,
			templateUrl: 'views/newmilestone.html',
			locals: {
				milestones: $scope.milestones
			},
			controller: 'MilestoneDialog',
			clickOutsideToClose: true
		});
	}

	$scope.editMilestone = function(editMilestone) {
		console.log(editMilestone);
	}

	$scope.removeMilestone = function($index) {
		console.log("Milestone Removed");
	}

});