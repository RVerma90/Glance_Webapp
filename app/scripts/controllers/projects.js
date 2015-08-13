'use strict';

glance.controller('ProjectsCtrl', function($scope, $state, $mdDialog) {

	$scope.projects = [
		{title: 'Roject 1', description: "The first"},
		{title: 'Sroject 2', description: "The second"},
		{title: 'Project 3', description: "The third"}
	];

	$scope.selectProject = function(project) {
		$state.go('milestones');
	}

	$scope.addProject = function(ev) {
		$mdDialog.show({
			targetEvent: ev,
			templateUrl: 'views/newproject.html',
			locals: {
				projects: $scope.projects
			},
			controller: 'ProjectDialog',
			clickOutsideToClose: true
		});
	}

	$scope.editProject = function(editProject) {
		console.log(editProject);
	}

	$scope.removeProject = function($index) {
		console.log("Project Removed");
	}

});

