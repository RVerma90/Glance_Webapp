'use strict';

glance.controller('TalkCtrl', function($scope, Auth) {



	$scope.hello = Auth.user;

	$scope.uid = function() {
		console.log($scope.hello.uid);
		Auth.getProfile($scope.hello.uid);
	};




	$scope.testing = function() {
		$scope.test = Auth.user;
		console.log($scope.test.uid);
	};

});
