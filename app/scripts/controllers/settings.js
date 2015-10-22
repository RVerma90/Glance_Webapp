  'use strict';

glance.controller('SettingsCtrl', function($scope, Nav, User) {
 
	$scope.toggleNavbar = function() {
	  Nav.toggleNavbar();
	};
  
	$scope.update = function(link) {
		User.updateImage(link);
		$scope.link = '';
	};

	$scope.authData = function() {
		var x =  User.data();

		console.log(x);
	};



});

