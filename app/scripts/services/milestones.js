'user strict';

glance.factory('Milestones', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $stateParams, $timeout) {

	var ref = new Firebase(FURL);
	var FBmilestones = $firebaseArray(ref.child('milestones'));

	var projectsRef = ref.child('projects');
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

//					var n = vm.project.deadline;

//					var d = new Date(n).toString();

					//console.log(n);

					//console.log("toString:",d);

					//calendar having problems  getting 

					vm.remove = function() {

						var project = $firebaseObject(milestonesRef.child(mid));

						project.$loaded(function(data) {

							projectsRef.child(data.projectID).child("milestones").child(mid).remove();

							milestonesRef.child(mid).remove();
						});

						//go back to milestones

						$mdDialog.hide();
					};


					vm.update = function() {
						//Updates at FB locations with updated project
						ref.child('projects').child(pid).update({
							title: vm.project.title,
							description: vm.project.description,
							priority: vm.project.priority
						});

						//Calls function to update project for all users with access
						var users = Milestones.updateProjectUsers(vm.project, pid);
						$mdDialog.hide();
					};


					vm.complete = function() {

						ref.child("users").child(user).child("projects").child(pid).child("completed").set(true);
						projectsRef.child(pid).child("usersDone").child(user).set(true);			

						var usersDone = $firebaseArray(ref.child("projects").child(pid).child("usersDone"));
						console.log(usersDone);

						usersDone.$loaded(function() {
							ref.child("projects").child(pid).child("completed").set(true);
							angular.forEach(usersDone, function(value, key) {

								if (value.$value == false) {
									ref.child("projects").child(pid).child("completed").set(false);
								}
							});

						});

						$mdDialog.hide();
					};

				},
				controllerAs: 'PEmodal',
				templateUrl: 'views/updateproject.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		},

		updateProjectUsers: function(p, pid){

			var projectMembersRef =  $firebaseArray(projectsRef.child(pid).child('members'));

			console.log(p);

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

					projectMembers.push(value.uid);

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

					vm.add = function(milestone) {

						var pid = $stateParams.pid;

						milestone.creator = Auth.user.uid;

						milestone.startDate = Firebase.ServerValue.TIMESTAMP;
						milestone.completed = false;
						milestone.projectID = pid;

						var date = new Date();

						milestone.deadline = date.getTime() + 1209600000;

    					var x = Math.floor((Math.random() * 100) + 200);		
    					milestone.image = "https://unsplash.it/"+x;				

						if(milestone.description == null) {
							milestone.description = '';
						}			

						if(milestone.priority == null) {
							milestone.priority = 0;
						}			

						FBmilestones.$add(milestone)
						.then(function(newMilestone) {

							var m = {
								milestoneID: newMilestone.key(),
								title: milestone.title,
								description: milestone.description,
								image: milestone.image,
								completed: false,
								priority: milestone.priority,
								deadline: milestone.deadline
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
						//console.log('deleter');
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
