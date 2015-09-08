'use strict';

glance.controller('AuthController', function($scope, $state, Auth, FURL, $firebaseAuth, $firebaseArray) {

	var authData = Auth.user;

	$scope.register = function(user) {
		Auth.register(user)
		.then(function(){
			console.log("Registered user: ", user);
			console.log("Registered user: ", authData);
			$state.transitionTo("glanceboard", {uid: user.uid});
		})
		.catch(function(error) {
			console.log("controller: Could not register");
		});

	};

	$scope.registerG = function(user) {
		Auth.registerGoogle()
		.then(function() {
			console.log('Logged in as: {{google.user}}');
			//change state to glanceboard + uid			
		})
		.catch(function(error) {
			console.log("Google " + error);
		});
	};
	
	$scope.login = function(user) {
		Auth.logout();

		Auth.login(user)
		.then(function() {
			$state.transitionTo("glanceboard", {uid: "authData.uid"});
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