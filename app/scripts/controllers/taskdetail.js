'use strict';

glance.controller('TaskDetailCtrl', 
	function($scope, 
			 $state, 
			 FURL,
			 Nav,
			 Task,
			 $stateParams,
			 Tasks) {

	$scope.toggleNavbar = function() {
	  Nav.toggleNavbar();
	};

	var milestone = null;
	var task = $stateParams.tid;
	var t = Task.task(task);

	$scope.currentTask = t;

	t.$loaded(function(task) {
		milestone = task.milestoneID;
		$scope.milestoneUsers = Tasks.members(milestone);
	});

	//$scope.milestoneUsers = Tasks.members(milestone);
	$scope.members = Task.taskMembers(task);

	$scope.addTaskMember = function(member) {
		Task.inviteTaskMember(t, member);
	}

	$scope.updateTask = function(e, task) {
		Task.update(e, task);
	};


});