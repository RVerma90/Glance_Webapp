'use strict';

glance.controller('TalkCtrl', function($scope, FURL, Auth, $firebaseArray) {

	var ref = new Firebase(FURL);
	var FBmessages = $firebaseArray(ref.child('messages'));
	$scope.messages = FBmessages;


  	//$scope.currentUser = Auth.user;

  	var user = Auth.user;


	$scope.addMessage = function(message) {
		FBmessages.$add(message);
	};


	$scope.test = function() {

		console.log(user);

	};






});
