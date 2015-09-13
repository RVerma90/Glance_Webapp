'use strict';

glance.controller('MilestonesCtrl', 
	function($scope, 
			 $state, 
			 FURL, 
			 Milestones,
			 $stateParams) {

	$scope.milestones = Milestones.show();

	$scope.selectMilestone = function(milestone) {
		$state.transitionTo("tasks", {mid: milestone.$id});
		console.log(milestone.$id);
	};

	$scope.addMilestone = function(e) {
		Milestones.add(e);
	};

	$scope.updateMilestone = function(e, milestone) {
		Milestones.update(e, milestone);
	};	

});