'user strict';

glance.factory('Glance', function(FURL, Auth, $firebaseObject, $firebaseArray, $timeout) {

	var ref = new Firebase(FURL);

	var FBProjects = $firebaseArray(ref.child('projects'));

	var FBmilestones = $firebaseArray(ref.child('milestones'));

	var usersRef = ref.child('users');

	var projectRef = ref.child('projects');

	var user = ref.getAuth().uid;


	var Glance = {
		projects: function() {

			var projects = $firebaseArray(usersRef.child(user).child('projects'));
			var project = [];

			projects.$loaded().then(function() {
				angular.forEach(projects, function(value, key) {
					project.push(value.projectID);
				});
			});

			return project;
		},


		milestones: function() {

			var project = Glance.projects();

			var milestone = [];
			var length = project.length;

			//instead of timeout, change to promise resolve

	$timeout(function() {
			for (var i = 0; i < project.length; i++) {

				var milestones = $firebaseArray(projectRef.child(project[i]).child('milestones'));

				milestones.$loaded(function(data) {
					data.forEach(function(entry) {
						milestone.push(entry);

						
					});

					console.log(milestone);

					return milestone;
				}).then(function(data) {
					milestone = data;
				});
			};

	},1500);


			return milestone;
		},	

		tasks: function() {

			var project = Glance.projects();

			var task = [];
			var length = project.length;

	$timeout(function() {
			for (var i = 0; i < project.length; i++) {

				var tasks = $firebaseArray(projectRef.child(project[i]).child('tasks'));

				tasks.$loaded(function(data) {
					data.forEach(function(entry) {
						task.push(entry);
					});

					return task;
				}).then(function(data) {
					task = data;
				});
			};

	},1500);


			return task;
		}	


	};

	return Glance;


});
