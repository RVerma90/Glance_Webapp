'use strict';

glance.controller('GlanceCtrl', function($scope, Auth, Glance, Projects, Milestones, Tasks, $timeout) {


	var p = Glance.projects();

	$scope.projects = p;

	$scope.projectComplete = function(project) {
		Glance.completeProject(project)
	};

	$scope.projectSkip = function(project) {
		Glance.skipProject(project); 
	};

	$scope.projectUndo = function(project) {
		Glance.undoProject(project);
	};


	var ms = Glance.milestones();

	$scope.milestones = ms;

	$scope.milestoneComplete = function(milestone) {
		Glance.completeMilestone(milestone);
	};

	$scope.milestoneSkip = function(milestone) {
		Glance.skipMilestone(milestone);
	};	

	$scope.milestoneUndo = function(milestone) {
		Glance.undoMilestone(milestone);
	};		


	var t = Glance.tasks();

	$scope.tasks = t;

	$scope.taskComplete = function(task) {
		Glance.completeTask(task);
	};

	$scope.taskSkip = function(task) {
		Glance.skipTask(task);
	};	

	$scope.taskUndo = function(task) {
		Glance.undoTask(task);
	};		


});

