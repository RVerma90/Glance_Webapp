'use strict';

glance.controller('ProjectsCtrl', function($scope, $state) {

	$scope.projects = [
		{title: 'Roject 1'},
		{title: 'Sroject 2'},
		{title: 'Project 3'}

	];

	$scope.selectProject = function(project) {
		$state.go('milestones');
	}

	$scope.addProject = function(project) {
		console.log(project);
	}

	$scope.editProject = function(editProject) {
		console.log(editProject);
	}

	$scope.removeProject = function($index) {
		console.log("Project Removed");
	}

});
