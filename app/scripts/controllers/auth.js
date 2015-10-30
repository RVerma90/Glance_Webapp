'use strict';

glance.controller('AuthCtrl', function($scope, $state, $location, Auth) {

  if(Auth.signedIn()) {
    $state.transitionTo('glance');
  } 

	$scope.currentUser = Auth.user;

	$scope.register = function(user) {
		//Auth.logout();

		Auth.register(user)
		.then(function(test) {

			$state.go("projects");
		})
		.catch(function(error) {
			console.log("controller: Could not register");
		});

	};

	$scope.registerG = function(user) {
		Auth.registerGoogle()
		.then(function() {
			console.log('Logged in as: {{google.user}}');
			//change state to glance + uid			
		})
		.catch(function(error) {
			console.log("Google " + error);
		});
	};
	
	$scope.login = function(user) {
		//Auth.logout();

		Auth.login(user)
		.then(function() {
			$state.go("glance");
		})
		.catch(function(err) {
			console.log('Could not login');
		});

	};

	$scope.changePassword = function(user) {
		Auth.changePassword(user)
		.then(function() {
			console.log('Change password');
		}, function(err) {
			console.log('Could not change password');
		})
	};

});	