'use strict';

glance.factory('Projects', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $filter) {

	var ref = new Firebase(FURL);
	var FBprojects = $firebaseArray(ref.child('projects'));

	var usersRef = ref.child('users');
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
						project.admin = Auth.user.uid;
						//project.users = [];
						project.startDate = Firebase.ServerValue.TIMESTAMP;
						project.completed = false;

						//project.contacts = Contacts.show();

						var date = new Date();

						project.deadline = date.getTime() + 604800000;

						console.log(project.deadline);

						if(project.description == null) {
							project.description = '';
						};

						if(project.priority == null) {
							project.priority = 0;
						};

						if(project.deadline == undefined) {
							project.deadline = null;
						};


//						var order = priority/5 + (deadline - startDate)

						FBprojects.$add(project)
						.then(function(newProject) {

							var obj = {
								projectID: newProject.key(),
								title: project.title,
								completed: false
							};

							usersRef.child(Auth.user.uid).child('projects').child(obj.projectID).set(obj);

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

		update: function(e, project) {

			return $mdDialog.show({
				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.project = {};
					vm.project = project;

					console.log(vm.project);
						
					vm.update = function() {



						//Updates at FB locations with updated project
						ref.child('projects').child(project.$id).update({
							title: project.title,
							description: project.description,
							priority: project.priority,
							deadline: project.deadline
						});

						console.log("Updated to: " + project.title + project.description);

						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('delete');
					//	ref.child('projects').child(project.$id).remove();

					// must remove user from users own project list
					// and project -> admin & user



						usersRef.child(user).child('projects').child(project.$id).remove();

						$mdDialog.hide();
					};
				},
				controllerAs: 'PEmodal',
				templateUrl: 'views/updateproject.html',
				parent: angular.element(document.body),
				targetEvent: e
			});
		},


	};

	return Projects;

});
