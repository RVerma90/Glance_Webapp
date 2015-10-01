'user strict';

glance.factory('User', function(FURL) {
	
	var ref = new Firebase(FURL);

	var projectsRef = ref.child('projects');


	var User = {

	};

	return User;

});






















