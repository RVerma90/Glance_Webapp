  'use strict';

glance.controller('ProfileCtrl', function($scope, Nav, User) {
 
	$scope.toggleNavbar = function() {
	  Nav.toggleNavbar();
	};
  
	$scope.update = function(link) {
		User.updateImage(link);
		$scope.link = '';
	};

});

