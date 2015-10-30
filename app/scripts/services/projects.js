'use strict';

glance.factory('Projects', function(FURL, Auth, User, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $filter, $timeout) {

	var ref = new Firebase(FURL);
	var FBprojects = $firebaseArray(ref.child('projects'));

	var usersRef = ref.child('users');
	var projectsRef = ref.child('projects');
	var user = ref.getAuth().uid;
	
	var auth = $firebaseAuth(ref);

	var Projects = {

		show: function() {

			return $firebaseObject(usersRef.child(user).child('projects'));

		},

		add: function(e, project) {

		return $mdDialog.show({

				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.project = project;

					vm.add = function(project) {
						project.creator = Auth.user.uid;

						project.startDate = Firebase.ServerValue.TIMESTAMP;
						project.completed = false;

						var date = new Date(project.deadline);
						project.deadline = date.getTime();

    					var x = Math.floor((Math.random() * 100) + 200);
    					project.image = "https://unsplash.it/"+x;						

						if(project.description == null) {
							project.description = '';
						};

						if(project.priority == null) {
							project.priority = 1;
						};

						if(isNaN(project.deadline)) {
							var now = new Date();
							project.deadline = now.getTime() + 1210000000; //2 weeks
						};

						FBprojects.$add(project)
						.then(function(newProject) {

							var p = {
								projectID: newProject.key(),
								title: project.title,
								description: project.description,
								image: project.image,
								completed: false,
								priority: project.priority,
								deadline: project.deadline
							};

							var obj = {
								uid: Auth.user.userData.uid,
								email: Auth.user.userData.email,
								firstName: Auth.user.userData.firstName,
								lastName: Auth.user.userData.lastName,
								profileImage: Auth.user.userData.profileImage
							};

							usersRef.child(Auth.user.uid).child('projects').child(p.projectID).set(p);

							projectsRef.child(p.projectID).child("members").child(Auth.user.uid).set(obj);
							projectsRef.child(p.projectID).child("usersDone").child(user).set(false);

							projectsRef.child(p.projectID).child("admins").child(Auth.user.uid).set(true);

							return newProject;

						});
						console.log(project);
						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('deleter');
						$mdDialog.hide();
					};

				},
				controllerAs: 'PAmodal',
				templateUrl: 'views/newproject.html',
				targetEvent: e
			})

		},

		completeToggle: function() {



		}




	};

	return Projects;

});
