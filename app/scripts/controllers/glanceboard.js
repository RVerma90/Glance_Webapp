'use strict';

glance.controller('GlanceCtrl', function($scope, Auth, Glance, Projects, Milestones, Tasks) {

	$scope.milestones = Glance.milestones();

	$scope.tasks = Glance.tasks();


});

