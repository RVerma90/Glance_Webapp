'user strict';

glance.factory('Milestones', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $stateParams, $state, $timeout) {

	var ref = new Firebase(FURL);
	var FBmilestones = $firebaseArray(ref.child('milestones'));

	var usersRef = ref.child('users');
	var projectsRef = ref.child('projects');
	var milestonesRef = ref.child('milestones');
	var tasksRef = ref.child('tasks');

	var project = $stateParams.pid; 
	var user = ref.getAuth().uid;
	var auth = $firebaseAuth(ref);

	var Milestones = {

		project: function(project) {
			return $firebaseObject(projectsRef.child(project));
		},

		updateProject: function(e, currentProject) {
			return $mdDialog.show({
				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.project = {};
					vm.project = currentProject;

					var pid = $stateParams.pid;

					vm.project.deadline = new Date(vm.project.deadline);

					vm.update = function() {
						var date = new Date(vm.project.deadline);
						vm.project.deadline = date.getTime();

						//Updates at FB locations with updated project
						ref.child('projects').child(pid).update({
							title: vm.project.title,
							description: vm.project.description,
							priority: vm.project.priority,
							deadline: vm.project.deadline
						});

						//Calls function to update project for all users with access
						var sync = Milestones.syncProjectDetails(vm.project, pid);
						$mdDialog.hide();
					};


					vm.complete = function() {

						usersRef.child(user).child("projects").child(pid).child("completed").set(true);
						projectsRef.child(pid).child("usersDone").child(user).set(true);			

						var usersDone = $firebaseArray(projectsRef.child(pid).child("usersDone"));
						console.log(usersDone);

						usersDone.$loaded(function() {
							projectsRef.child(pid).child("completed").set(true);
							angular.forEach(usersDone, function(value, key) {

								if (value.$value == false) {
									projectsRef.child(pid).child("completed").set(false);
								}
							});
						});
						$mdDialog.hide();
					};

					vm.remove = function() {

						var pMilestones = $firebaseObject(projectsRef.child(pid).child("milestones"));


						pMilestones.$loaded(function() {
							angular.forEach(pMilestones, function(value, key) {

								var mid = value.milestoneID;
								console.log(mid);

								//First Tasks
								var pmTasks = $firebaseObject(milestonesRef.child(mid).child("tasks"));
								pmTasks.$loaded(function() {
									angular.forEach(pmTasks, function(value, key) {

										var tid = value.taskID;
										console.log(tid);


										tasksRef.child(tid).child("usersDone").child(user).remove();
										tasksRef.child(tid).child("members").child(user).remove();
										usersRef.child(user).child("tasks").child(tid).remove();

										var checkUsers = $firebaseObject(ref.child("tasks").child(tid).child("members"));
										checkUsers.$loaded(function() {
											var users = [];
											angular.forEach(checkUsers, function(value, key) {
												console.log(value);
												console.log(key);

												users.push(value);
											});

											console.log(users);
											console.log(users.length);
											if(users.length == 0) {
												tasksRef.child(tid).remove();
												milestonesRef.child(mid).child('tasks').child(tid).remove();
												projectsRef.child(pid).child("tasks").child(tid).remove();
											} 
										});

									});

								});


								//Second Milestones
								milestonesRef.child(mid).child("usersDone").child(user).remove();
								milestonesRef.child(mid).child("members").child(user).remove();
								usersRef.child(user).child("milestones").child(mid).remove();

								var checkUsers = $firebaseObject(milestonesRef.child(mid).child("members"));
								checkUsers.$loaded(function() {
									var users = [];
									angular.forEach(checkUsers, function(value, key) {
										console.log(value);
										console.log(key);

										users.push(value);
									});

									console.log(users);
									console.log(users.length);
									if(users.length == 0) {
										milestonesRef.child(mid).remove();
										projectsRef.child(pid).child("milestones").child(mid).remove();
									} 								
								});

							});
						});

						//Third Project

						projectsRef.child(pid).child("usersDone").child(user).remove();
						projectsRef.child(pid).child("members").child(user).remove();
						ref.child("users").child(user).child("projects").child(pid).remove();

						var checkUsers = $firebaseObject(ref.child("projects").child(pid).child("members"));

						checkUsers.$loaded(function() {
							var users = [];
							angular.forEach(checkUsers, function(value, key) {
								console.log(value);
								console.log(key);

								users.push(value);
							});

							console.log(users);
							console.log(users.length);

							if(users.length == 0) {
								projectsRef.child(pid).remove();
							} 
						});

						$mdDialog.hide();
						$state.go("projects");
					};

				},
				controllerAs: 'PEmodal',
				templateUrl: 'views/updateproject.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		},

		syncProjectDetails: function(p, pid){

			//updates in all projects users and all relevant milestones
			var projectMembersRef =  $firebaseArray(projectsRef.child(pid).child("members"));

			var projectMilestones = $firebaseObject(projectsRef.child(pid).child("milestones"));

			project = {
				projectID: p.$id,
				title: p.title,
				description: p.description,
				image: p.image,
				completed: p.completed,
				priority: p.priority,
				deadline: p.deadline
			};

			

			console.log(project);

			projectMembers = [];

			projectMembersRef.$loaded(function() {
				angular.forEach(projectMembersRef, function(value, key) {
					ref.child("users").child(value.uid).child("projects").child(pid).set(project);
					ref.child("users").child(value.uid).child("projects").child(pid).set(project);
					projectMembers.push(value.uid);
				});

			});

			milestones = [];

			projectMilestones.$loaded(function() {
				angular.forEach(projectMilestones, function(value, key) {

					var mid = value.milestoneID
					console.log(value.milestoneID);
					projectsRef.child(pid).child("milestones").child(mid).child("projectDeadline").set(project.deadline);
					milestonesRef.child(mid).child("projectDeadline").set(project.deadline);

					angular.forEach(projectMembers, function(value, key) {
						console.log("yo",value);
						ref.child("users").child(value).child("milestones").child(mid).child("projectDeadline").set(project.deadline);
					});


					milestones.push(value.milestoneID);
				});
			});



			return projectMembers;

		},		

		admins: function() {

			return $firebaseObject(projectsRef.child(project).child('admins'));	

		},

		members: function(project) {

			return $firebaseObject(projectsRef.child(project).child('members'));	

		},

		inviteMember: function(p, member) {
			var newMember = {};

			newMember.email = member.email;
			newMember.uid = member.uid;
			newMember.firstName = member.firstName;
			newMember.lastName = member.lastName;
			newMember.profileImage = member.profileImage;

			var project = {};

			project.projectID = p.$id;
			project.title = p.title;
			project.description = p.description;
			project.image = p.image;
			project.completed = p.completed;
			//Do users need priority and deadline? so far yes?
			project.priority = p.priority;
			project.deadline = p.deadline;


			projectsRef.child(p.$id).child('members').child(member.uid).set(newMember);
			projectsRef.child(p.$id).child('usersDone').child(member.uid).set(false);
			projectsRef.child(p.$id).child('admins').child(member.uid).set(false);

			ref.child("users").child(member.uid).child("projects").child(p.$id).set(project);

		},

		show: function(project) {

			//console.log(project);
			return $firebaseObject(projectsRef.child(project).child('milestones'));

		},

		add: function(e, milestone) {

		return $mdDialog.show({

				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.milestone = milestone;

					var pid = $stateParams.pid;

					var project = Milestones.project(pid);
					var projectDeadline = '';

					project.$loaded(function(p) {
						projectDeadline = p.deadline;
						vm.minDate = new Date();
						vm.maxDate = new Date(projectDeadline);
					});

					vm.add = function(milestone) {
						milestone.creator = Auth.user.uid;
						milestone.startDate = Firebase.ServerValue.TIMESTAMP;
						milestone.completed = false;
						milestone.projectID = pid;
						milestone.projectDeadline = projectDeadline;

						var date = new Date(milestone.deadline);
						milestone.deadline = date.getTime();

    					var x = Math.floor((Math.random() * 100) + 200);		
    					milestone.image = "https://unsplash.it/"+x;				

						if(milestone.description == null) {
							milestone.description = '';
						};			

						if(milestone.priority == null) {
							milestone.priority = 1;
						};				

						if(isNaN(milestone.deadline)) {
							var now = new Date();
							milestone.deadline = now.getTime() + 432000000; //5days
						};

						FBmilestones.$add(milestone)
						.then(function(newMilestone) {

							var m = {
								milestoneID: newMilestone.key(),
								title: milestone.title,
								description: milestone.description,
								projectID: milestone.projectID,
								image: milestone.image,
								completed: false,
								priority: milestone.priority,
								deadline: milestone.deadline,
								projectDeadline: milestone.projectDeadline
							};
				
							var obj = {
								uid: Auth.user.userData.uid,
								email: Auth.user.userData.email,
								firstName: Auth.user.userData.firstName,
								lastName: Auth.user.userData.lastName,
								profileImage: Auth.user.userData.profileImage
							};


							projectsRef.child(pid).child('milestones').child(m.milestoneID).set(m);
//							projectsRef.child(pid).child('milestonesDone').child(m.milestoneID).set(false);

							ref.child("milestones").child(m.milestoneID).child("members").child(Auth.user.uid).set(obj);
							ref.child("milestones").child(m.milestoneID).child("usersDone").child(user).set(false);

							ref.child("milestones").child(m.milestoneID).child("admins").child(Auth.user.uid).set(true);							

							ref.child("users").child(Auth.user.uid).child('milestones').child(m.milestoneID).set(m);


							return newMilestone;

						});
						//console.log(milestone);
						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						$mdDialog.hide();
					};

				},
				controllerAs: 'MAmodal',
				templateUrl: 'views/newmilestone.html',
				targetEvent: e
			});

		},

		update: function(e, milestone) {

			return $mdDialog.show({
				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.milestone = {};
					vm.milestone = milestone;

					//console.log(milestone);

					var pid = $stateParams.pid;

					vm.update = function() {
						//Updates at FB locations with updated milestone
						ref.child('milestones').child(milestone.milestoneID).update({
							title: vm.milestone.title,
							description: vm.milestone.description,
							priority: vm.milestone.priority,
							deadline: vm.milestone.deadline
						});

						projectsRef.child(pid).child('milestones').child(milestone.milestoneID).update({
							title: vm.milestone.title,
							description: vm.milestone.description,
							priority: vm.milestone.priority,
							deadline: vm.milestone.deadline
						});

						//console.log("Updated to: " + milestone.title + milestone.description);

						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						//console.log('delete');
					//	ref.child('milestones').child(milestone.$id).remove();

					// must remove user from users own milestone list
					// if user is admin, set next oldest assignee as admin is none exist
					// if no one then remove completely


						ref.child('milestones').child(milestone.milestoneID).remove();

						projectsRef.child(pid).child('milestones').child(milestone.milestoneID).remove();

						$mdDialog.hide();
					};
				},
				controllerAs: 'MEmodal',
				templateUrl: 'views/updatemilestone.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		}

	};

	return Milestones;

});
