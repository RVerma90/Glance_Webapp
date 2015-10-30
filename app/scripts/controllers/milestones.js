'use strict';

glance.controller('MilestonesCtrl', 
	function($scope, 
			 $state,
			 Nav, 
			 Milestones,
			 $stateParams,
			 Contacts) {

	var project = $stateParams.pid;
	var p = Milestones.project(project);

	$scope.toggleNavbar = function() {
	  Nav.toggleNavbar();
	};

	$scope.currentProject = p;

	//$scope.admins = Milestones.admins();
	$scope.contacts = Contacts.show();
	$scope.members = Milestones.members(project);
	$scope.milestones = Milestones.show(project);

	$scope.selectMilestone = function(milestone) {
		$state.transitionTo("tasks", {mid: milestone.milestoneID});
	};

	$scope.addMilestone = function(e, milestone) {
		Milestones.add(e, milestone);
	};

	$scope.updateProject = function(e, cp) {
		Milestones.updateProject(e, cp);
	};

	$scope.projectUsers = function() {
		$state.transitionTo("projectusers", {pid: project});
	};

	$scope.message = function() {
		$state.transitionTo("projectmessage", {pid: project});
	};
 
	$scope.addMember = function(member) {
		Milestones.inviteMember(p, member);
	};

	$scope.updateMilestone = function(e, milestone) {
		Milestones.update(e, milestone);
	};

});