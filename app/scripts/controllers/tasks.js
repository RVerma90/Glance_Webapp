'use strict';

glance.controller('TasksCtrl', 
	function($scope, 
			 $state, 
			 FURL,
			 Nav,
			 Tasks,
			 $stateParams,
			 Milestones) {

	$scope.toggleNavbar = function() {
	  Nav.toggleNavbar();
	};

	var project = null;

	var milestone = $stateParams.mid;
	var m = Tasks.milestone(milestone);

	$scope.currentMilestone = m;

	m.$loaded(function(milestone) {
		project = milestone.projectID;

		$scope.projectUsers = Milestones.members(project);
	});

	$scope.members = Tasks.members(milestone);
	$scope.tasks = Tasks.show(milestone);

	$scope.selectMilestone = function(milestone) {
		$state.transitionTo("tasks", {mid: milestone.milestoneID});
		console.log(milestone.milestoneID);
	};

	$scope.selectTask = function(task) {
		console.log(task.taskID);
		$state.transitionTo("task", {tid: task.taskID});

	};

	$scope.addTask = function(e, task) {
		Tasks.add(e, task);
	};

	$scope.updateMilestone = function(e, cm) {
		Tasks.updateMilestone(e, cm);
	};		

	$scope.milestoneUsers = function() {
		$state.transitionTo("milestoneusers", {mid: milestone});
	};

	$scope.addMember = function(member) {
		Tasks.inviteMember(m, member);
	};


	$scope.updateTask = function(e, task) {
		Tasks.update(e, task);
	};


});