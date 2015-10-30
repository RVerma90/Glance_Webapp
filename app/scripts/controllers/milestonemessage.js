'use strict';

glance.controller('MilestoneMessageCtrl', 
	function($scope, 
			 $state,
			 Nav, 
			 Auth,
			 Messages,
			 $stateParams,
			 Contacts) {

	var milestoneID = $stateParams.mid;

	var milestone = Messages.milestone(milestoneID);

	var messages = Messages.milestoneMessages(milestoneID);

	$scope.currentUser = Auth.user;

	$scope.milestone = milestone;

	$scope.messages = messages;

	$scope.sendMessage = function(message) {
		Messages.sendMMessage(milestoneID, message);
		$scope.message = '';
	};


});