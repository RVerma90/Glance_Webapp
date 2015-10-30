'use strict';

glance.controller('ProjectMessageCtrl', 
	function($scope, 
			 $state,
			 Nav, 
			 Auth,
			 Messages,
			 $stateParams,
			 Contacts) {

	var projectID = $stateParams.pid;

	var project = Messages.project(projectID);

	var messages = Messages.projectMessages(projectID);

	$scope.currentUser = Auth.user;

	$scope.project = project;

	$scope.messages = messages;

	$scope.sendMessage = function(message) {
		Messages.sendPMessage(projectID, message);
		$scope.message = '';

	};


});