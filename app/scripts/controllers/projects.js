'use strict';

glance.controller('ProjectsCtrl', 
	function($scope, 
			 $state, 
			 FURL,
			 Projects,
			 $stateParams) {

	$scope.projects = Projects.show();		

	//no need for auth.uid

	$scope.selectProject = function(project) {
		$state.transitionTo("milestones", {pid: project.projectID});
		console.log(project.projectID);
	};

	$scope.addProject = function(e) {
		Projects.add(e);
	};

	$scope.updateProject = function(e, project) {
		Projects.update(e, project);
	};


});