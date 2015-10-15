'use strict';

glance.factory('Auth', function(FURL, $firebaseAuth, $firebaseObject, $firebaseArray) {

	var ref = new Firebase(FURL);
	var profileRef = ref.child('users');
	
	var auth = $firebaseAuth(ref);

	var Auth = {

		user: {},

		createProfile: function(uid, user) {
			var profile = {
				firstName: user.firstName,
				lastName: user.lastName,
				email: user.email,
				uid: uid,
				dateReg: Firebase.ServerValue.TIMESTAMP
			}
			return console.log(profile);
			//return ref.child('users').child(uid).child('profile').set(profile);			
		},

		getProfile: function(uid) {
			
			auth.$onAuth(function(authData) {
				TheUser = authData.uid;
				console.log("test",TheUser);

			});
			
		},

		login: function(user) {
			return auth.$authWithPassword({
				email: user.email,
				password: user.password
			}, function(error, authData) {
				switch(error.code) {
					case "INVALID_EMAIL":
						console.log("Log in with a valid email.");
						break
					case "INVALID_PASSWORD":
						console.log("Password or email is incorrect");
						break
					default:
						console.log("Enter a valid email and password");
				}
			})
			.then(function(authData) {
				console.log("login: Logged in with uid: ", authData);
			})
			.catch(function(error) {
				alert("Error: " + error);
			});

		},

		register: function(user) {
			return auth.$createUser(
				{
					email: user.email,
					password: user.password
				}, function(error, authData){
					if(error) {
						switch (error.code) {
							case "EMAIL_TAKEN":
								console.log("This email is in use, please choose a new email.");
								break;
							case "INVALID_TAKEN":
								console.log("Please choose a valid email.");
								break;								
							default:
								console.log("Error creating user: ", error);
						}
					}
				})
				.then(function(authData){
					user.uid = authData.uid;
					return Auth.login(user);
				})
				.then(function(test) {

    				var x = Math.floor((Math.random() * 100) + 100);

    				user.profileImage = "https://unsplash.it/"+x;
					var uid = user.uid;
					delete user.password;
					user.dateReg = Firebase.ServerValue.TIMESTAMP;
					return ref.child('users').child(uid).set(user);					
				})
				.catch(function(error) {
					alert("Error: " + error);
				});
		},

		registerGoogle: function(user) {
			return auth.$authWithOAuthPopup("google")
				.then(function(authDta) {
					console.log(authData);
				});
		},

		logout: function() {
			auth.$unauth();
		},

		changePassword: function(user) {
			return auth.$changePassword({
				email: user.email,
				oldPassword: user.oldPassword,
				newPassword: user.newPassword
			})
		},

		signedIn: function() {
			return !!Auth.user.provider;
		},

		requireAuth: function() {
			return auth.$requireAuth();
		}

	};

	auth.$onAuth(function(authData) {
		if(authData) {
			angular.copy(authData, Auth.user);
			Auth.user.userData = $firebaseObject(profileRef.child(authData.uid));
		} else {
			if(Auth.user && Auth.user.profile) {
				Auth.user.profile.$destroy();
			}
			angular.copy({}, Auth.user);
		}
	});

	return Auth;

});






















