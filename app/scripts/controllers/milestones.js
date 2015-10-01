'use strict';

glance.controller('MilestonesCtrl', 
	function($scope, 
			 $state, 
			 FURL, 
			 Milestones,
			 $stateParams) {

	var project = $stateParams.pid;

	$scope.milestones = Milestones.show(project);

	$scope.currentProject = Milestones.project(project);

	$scope.selectMilestone = function(milestone) {
		$state.transitionTo("tasks", {mid: milestone.milestoneID});
		console.log(milestone.milestoneID);
	};

	$scope.addMilestone = function(e, milestone) {
		Milestones.add(e, milestone);
	};

	$scope.updateProject = function(e, cp) {
		Milestones.updateProject(e, cp);
	};

	$scope.updateMilestone = function(e, milestone) {
		Milestones.update(e, milestone);
	};	

});