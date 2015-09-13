'use strict';

glance.controller('TalkCtrl', function($scope, FURL, Auth, $firebaseArray) {

	var ref = new Firebase(FURL);
	var FBmessages = $firebaseArray(ref.child('messages'));
	$scope.messages = FBmessages;


	$scope.addMessage = function(message) {
		FBmessages.$add(message);
	};



});
