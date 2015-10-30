'use strict';
 
glance.controller('TaskMessageCtrl', 
	function($scope, 
			 $state,
			 Nav,
			 Auth, 
			 Messages,
			 $stateParams,
			 Contacts) {

	var taskID = $stateParams.tid;

	var task = Messages.task(taskID);

	var messages = Messages.taskMessages(taskID);

	$scope.currentUser = Auth.user;

	$scope.task = task;

	$scope.messages = messages;

	$scope.sendMessage = function(message) {
		Messages.sendTMessage(taskID, message);
		$scope.message = '';
	};

});