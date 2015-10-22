'use strict';

glance.controller('ContactsCtrl', function($scope, Nav, FURL, Contacts, Auth, $mdToast) {

	$scope.toggleNavbar = function() {
	  Nav.toggleNavbar();
	};

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


		$mdToast.show($mdToast.simple().content('Request Sent'));

	};

});

