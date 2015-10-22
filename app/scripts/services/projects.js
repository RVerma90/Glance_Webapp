'use strict';

glance.factory('Projects', function(FURL, Auth, User, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $filter, $timeout) {

	var ref = new Firebase(FURL);
	var FBprojects = $firebaseArray(ref.child('projects'));

	var usersRef = ref.child('users');
	var user = ref.getAuth().uid;
	
	var auth = $firebaseAuth(ref);

	var Projects = {

		show: function() {

			return $firebaseObject(usersRef.child(user).child('projects'));

/*
			var project = [];
			//instead of timeout, change to promise resolve
			$timeout(function() {

					var projects = $firebaseArray(usersRef.child(user).child('projects'));

					projects.$loaded(function(data) {
						data.forEach(function(entry) {
				//			var now = (new Date).getTime();
				//			var daysToDeadline = (entry.deadline - now)/86400000; //day in milliseconds
				//			var order = entry.priority/daysToDeadline;

				//			entry.order = order;

							project.push(entry);
						});

						return project;
				//	}).then(function(data) {
				//		project = data;

				//		project.sort(function(a, b) {
				//			return parseFloat(b.order) - parseFloat(a.order);


				//		});

				//		console.log(project);

					});
			},800);


			return project;

*/


			
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
							project.priority = 0;
						};

						if(project.deadline == undefined) {
							project.deadline = null;
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

							ref.child("projects").child(p.projectID).child("members").child(Auth.user.uid).set(obj);
							ref.child("projects").child(p.projectID).child("usersDone").child(user).set(false);

							ref.child("projects").child(p.projectID).child("admins").child(Auth.user.uid).set(true);

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



					vm.complete = function() {
						//complete at user ref and task in milestone

						ref.child("users").child(user).child("tasks").child(tid).child("completed").set(true);
						tasksRef.child(tid).child("usersDone").child(user).set(true);

						var usersDone = $firebaseArray(ref.child("tasks").child(tid).child("usersDone"));
						console.log(usersDone);

						usersDone.$loaded(function() {
							ref.child("tasks").child(tid).child("completed").set(true);
							ref.child("milestones").child(mid).child("tasks").child(tid).child("completed").set(true);
							//milestonesRef.child(mid).child('tasksDone').child(tid).set(true);
							angular.forEach(usersDone, function(value, key) {
								
								if (value.$value == false) {
									ref.child("tasks").child(tid).child("completed").set(false);
									ref.child("milestones").child(mid).child("tasks").child(tid).child("completed").set(false);
									//milestonesRef.child(mid).child('tasksDone').child(tid).set(false);
								}
							});
						});

						$mdDialog.hide();
					};		


					vm.remove = function() {
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
		}


	};

	return Projects;

});
