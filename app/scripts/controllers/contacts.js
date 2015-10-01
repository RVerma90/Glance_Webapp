'use strict';

glance.controller('ContactsCtrl', function($scope, FURL, Contacts, Auth) {

	$scope.contacts = Contacts.show();

	$scope.cancel = function() {
		ref.child('milestones').child(milestone.milestoneID).remove();
	};

	$scope.requests = Contacts.reqShow();

	$scope.acceptRequest = function(request) {
		console.log(request);
		Contacts.accept(request);

	};

	$scope.search = function() {
		Contacts.searchEmail($scope.email);

		$scope.email = '';
	};

});

