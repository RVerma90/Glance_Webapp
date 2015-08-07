'use strict';

glance.controller('ProjectsCtrl', function($scope) {

	$scope.addProject = function(project) {
		console.log(project);
	}

	$scope.editProject = function(editProject) {
		console.log(editProject);
	}

	$scope.removeProject = function($index) {
		console.log("Project Removed");
	}

	$scope.selectProject = function($index) {
		console.log("Projects");
	}

});