  'use strict';

glance.controller('SettingsCtrl', function($scope, User) {
  
	$scope.update = function(link) {
		User.updateImage(link);
		$scope.link = '';
	};

	$scope.authData = function() {
		var x =  User.data();

		console.log(x);
	};



});

