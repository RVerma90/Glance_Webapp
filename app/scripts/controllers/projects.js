'use strict';

glance.controller('ProjectsCtrl', 
	function($scope, 
			 $state, 
			 Nav,
			 Projects,
			 $stateParams) {

	$scope.toggleNavbar = function() {
	  Nav.toggleNavbar();
	};

	$scope.projects = Projects.show();		

	//no need for auth.uid

	$scope.myClass = "ion-social-instagram-outline";

	$scope.selectProject = function(project) {
		$state.transitionTo("milestones", {pid: project.projectID});
	};

	$scope.addProject = function(e) {
		Projects.add(e);
		$scope.projects = Projects.show();		
	};

	$scope.updateProject = function(e, project) {
		Projects.update(e, project);
	};


});