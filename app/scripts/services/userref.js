'user strict';

glance.factory('User', function(FURL, $firebaseArray, $firebaseObject, $timeout, $q) {
	
	var ref = new Firebase(FURL);

	var projectsRef = ref.child('projects');

	var user = ref.getAuth().uid;

	var User = {

		updateImage: function(link) {
			return ref.child("users").child(user).child("profileImage").set(link);
		},

		data: function() {
			return $firebaseObject(ref.child("users").child(user));
		}

	};
	return User;
});