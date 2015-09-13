'use strict';

glance.controller('ProjectsCtrl', 
	function($scope, 
			 $state, 
			 FURL,
			 Projects,
			 $stateParams) {

	$scope.projects = Projects.show();

	$scope.selectProject = function(project) {
		$state.transitionTo("milestones", {pid: project.$id});
		console.log(project.$id);
	};

	$scope.addProject = function(e) {
		Projects.add(e);
	};

	$scope.updateProject = function(e, project) {
		Projects.update(e, project);
	};


});