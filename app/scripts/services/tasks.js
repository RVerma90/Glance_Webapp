'user strict';

glance.factory('Tasks', function(FURL, Auth, Task, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $state, $stateParams) {

	var ref = new Firebase(FURL);
	var FBtasks = $firebaseArray(ref.child('tasks'));

	var usersRef = ref.child('users');
	var projectsRef = ref.child('projects');
	var milestonesRef = ref.child('milestones');
	var tasksRef = ref.child('tasks');
	
	var milestone = $stateParams.mid;
	
	var user = ref.getAuth().uid;
	var auth = $firebaseAuth(ref);

	var Tasks = {

		milestone: function(milestone) {
			return $firebaseObject(milestonesRef.child(milestone));
		},

		updateMilestone: function(e, currentMilestone) {
			return $mdDialog.show({
				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.milestone = {};
					vm.milestone = currentMilestone;

					var pid = vm.milestone.projectID;

					var mid = $stateParams.mid;

					vm.minDate = new Date();
					vm.maxDate = new Date(vm.milestone.projectDeadline);

					vm.milestone.deadline = new Date(vm.milestone.deadline);

					vm.update = function() {
						var date = new Date(vm.milestone.deadline);
						vm.milestone.deadline = date.getTime();

						//Updates at FB locations with updated project
						milestonesRef.child(mid).update({
							title: vm.milestone.title,
							description: vm.milestone.description,
							priority: vm.milestone.priority,
							deadline: vm.milestone.deadline
						});

						projectsRef.child(pid).child("milestones").child(mid).update({
							title: vm.milestone.title,
							description: vm.milestone.description,
							priority: vm.milestone.priority,
							deadline: vm.milestone.deadline
						});

						var users = Tasks.syncMilestoneDetails(vm.milestone, mid);

						$mdDialog.hide();
					};

					vm.complete = function() {

						usersRef.child(user).child("milestones").child(mid).child("completed").set(true);
						milestonesRef.child(mid).child("usersDone").child(user).set(true);

						var usersDone = $firebaseArray(milestonesRef.child(mid).child("usersDone"));
						console.log(usersDone);

						usersDone.$loaded(function() {
							projectsRef.child(pid).child("milestones").child(mid).child("completed").set(true);
							milestonesRef.child(mid).child("completed").set(true);
							angular.forEach(usersDone, function(value, key) {

								if (value.$value == false) {
									milestonesRef.child(mid).child("completed").set(false);
									projectsRef.child(pid).child("milestones").child(mid).child("completed").set(false);
								}
							});

						});


						$mdDialog.hide();
					};

					vm.remove = function() {

						var msTasks = $firebaseObject(milestonesRef.child(mid).child("tasks"));

						msTasks.$loaded(function() {
							angular.forEach(msTasks, function(value, key) {

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

						milestonesRef.child(mid).child("usersDone").child(user).remove();
						milestonesRef.child(mid).child("members").child(user).remove();
						ref.child("users").child(user).child("milestones").child(mid).remove();

						var checkUsers = $firebaseObject(ref.child("milestones").child(mid).child("members"));

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
								projectsRef.child(pid).child('milestones').child(mid).remove();
								milestonesRef.child(mid).remove();
							} 
						});

						$mdDialog.hide();

						$state.transitionTo("milestones", {pid: pid});
					};

					

				},
				controllerAs: 'MEmodal',
				templateUrl: 'views/updatemilestone.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		},


		syncMilestoneDetails: function(m, mid){

			//updates in all projects users and all relevant milestones
			var milestoneMembersRef =  $firebaseArray(milestonesRef.child(mid).child('members'));

			var milestoneTasks =  $firebaseArray(milestonesRef.child(mid).child('tasks'));

			milestone = {
				milestoneID: m.$id,
				title: m.title,
				description: m.description,
				projectID: m.projectID,
				image: m.image,
				completed: m.completed,
				priority: m.priority,
				deadline: m.deadline,
				projectDeadline: m.projectDeadline
			};

			console.log(milestone);

			milestoneMembers = [];

			milestoneMembersRef.$loaded(function() {
				angular.forEach(milestoneMembersRef, function(value, key) {
					ref.child("users").child(value.uid).child("milestones").child(mid).set(milestone);
					milestoneMembers.push(value.uid);
				});
			});


			tasks = [];

			milestoneTasks.$loaded(function() {
				angular.forEach(milestoneTasks, function(value, key) {
					var tid = value.taskID
					console.log(value.taskID);
					console.log(tid);
				
					milestonesRef.child(mid).child("tasks").child(tid).child("milestoneDeadline").set(milestone.deadline);
					tasksRef.child(tid).child("milestoneDeadline").set(milestone.deadline);
				
					angular.forEach(milestoneMembers, function(value, key) {
						console.log("yo",value);
						ref.child("users").child(value).child("tasks").child(tid).child("milestoneDeadline").set(milestone.deadline);
					});
					tasks.push(value.taskID);
				});
			});


			return milestoneMembers;

		},		


		admins: function() {

		return $firebaseObject(milestonesRef.child(milestone).child('admins'));	

		},

		members: function(milestone) {

			return $firebaseObject(milestonesRef.child(milestone).child('members'));	

		},


		inviteMember: function(m, member) {
			var newMember = {};

			newMember.email = member.email;
			newMember.uid = member.uid;
			newMember.firstName = member.firstName;
			newMember.lastName = member.lastName;
			newMember.profileImage = member.profileImage;

			var milestone = {};

			milestone.milestoneID = m.$id;
			milestone.title = m.title;
			milestone.description = m.description;
			milestone.projectID = m.projectID,
			milestone.image = m.image;
			milestone.completed = m.completed;
			milestone.priority = m.priority;
			milestone.deadline = m.deadline;
			milestone.projectDeadline = m.projectDeadline;
			

			milestonesRef.child(m.$id).child('members').child(member.uid).set(newMember);
			milestonesRef.child(m.$id).child('usersDone').child(member.uid).set(false);

			ref.child("users").child(member.uid).child("milestones").child(m.$id).set(milestone);

		},		


		show: function(milestone) {

//			console.log(milestone);

			return $firebaseObject(milestonesRef.child(milestone).child('tasks'));

		},

		add: function(e, task) {

		return $mdDialog.show({

				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.task = task;

					var mid = $stateParams.mid;
					var pid = '';

					var milestone = Tasks.milestone(mid);
					var milestoneDeadline = '';

					milestone.$loaded(function(m) {
						milestoneDeadline = m.deadline;
						vm.minDate = new Date();
						vm.maxDate = new Date(milestoneDeadline);
						pid = m.projectID;
					});

					vm.add = function(task) {
						task.creator = Auth.user.uid;
						task.startDate = Firebase.ServerValue.TIMESTAMP;
						task.completed = false;
						task.milestoneID = mid;
						task.projectID = pid;
						task.milestoneDeadline = milestoneDeadline;

						var date = new Date(task.deadline);
						task.deadline = date.getTime();

						var x = Math.floor((Math.random() * 100) + 200);
    					task.image = "https://unsplash.it/"+x;		

						if(task.description == null) {
							task.description = '';
						};	

						if(task.priority == null) {
							task.priority = 1;
						};

						if(isNaN(task.deadline)) {
							var now = new Date();
							task.deadline = now.getTime() + 172800000; //2 days
						};

						FBtasks.$add(task)
						.then(function(newTask) {

							var t = {
								taskID: newTask.key(),
								title: task.title,
								description: task.description,
								milestoneID: task.milestoneID,
								projectID: task.projectID,
								image: task.image,
								completed: false,
								priority: task.priority,
								deadline: task.deadline,
								milestoneDeadline: task.milestoneDeadline
							};


							var obj = {
								uid: Auth.user.userData.uid,
								email: Auth.user.userData.email,
								firstName: Auth.user.userData.firstName,
								lastName: Auth.user.userData.lastName,
								profileImage: Auth.user.userData.profileImage
							};



							ref.child("tasks").child(t.taskID).child("members").child(Auth.user.uid).set(obj);

							//ref.child("tasks").child(t.taskID).child("admins").child(Auth.user.uid).set(true);							

							ref.child("users").child(Auth.user.uid).child('tasks').child(t.taskID).set(t);

							tasksRef.child(t.taskID).child('usersDone').child(user).set(false);

							//milestonesRef.child(mid).child('tasksDone').child(t.taskID).set(false);

							milestonesRef.child(mid).child('tasks').child(t.taskID).set(t);

							var project = $firebaseObject(milestonesRef.child(mid).child("projectID"));

							var pid = null;

							project.$loaded(function(data) {

								var pid = data.$value;

								projectsRef.child(pid).child('tasks').child(t.taskID).set(t);
								
							});

							return newTask;

						});						
						console.log(task);
						$mdDialog.hide();
					};

					vm.closeDialog = function() {
						console.log('deleter');
						$mdDialog.hide();
					};

				},
				controllerAs: 'TAmodal',
				templateUrl: 'views/newtask.html',
				targetEvent: e
			});

		},

		update: function(e, task) {

			return $mdDialog.show({
				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.task = {};
					vm.task = task;

					console.log(task);

					var mid = $stateParams.mid;					

					vm.update = function() {
						//Updates at FB locations with updated task
						ref.child('tasks').child(task.taskID).update({
							title: vm.task.title,
							description: vm.task.description,
							priority: vm.task.priority,
							deadline: vm.task.deadline
						});

						milestonesRef.child(mid).child('tasks').child(task.taskID).update({
							title: vm.task.title,
							description: vm.task.description,
							priority: vm.task.priority
						});					

						var project = $firebaseObject(milestonesRef.child(mid).child("projectID"));

						var pid = null;

						project.$loaded(function(data) {

							var pid = data.$value;

							projectsRef.child(pid).child('tasks').child(task.taskID).update({
								title: vm.task.title,
								description: vm.task.description,
								priority: vm.task.priority,
								deadline: vm.task.deadline								
							});
								
						});						


						console.log("Updated to: " + task.title + task.description);

						$mdDialog.hide();
					};

					vm.closeDialog = function() {
					//	ref.child('tasks').child(task.$id).remove();

					// must remove user from users own task list
					// if user is admin, set next oldest assignee as admin is none exist
					// if no one then remove completely

						ref.child('tasks').child(task.taskID).remove();

						milestonesRef.child(mid).child('tasks').child(task.taskID).remove();

						var project = $firebaseObject(milestonesRef.child(mid).child("projectID"));
						var pid = null;

						project.$loaded(function(data) {

						var pid = data.$value;

						projectsRef.child(pid).child("tasks").child(task.taskID).remove();

						});							


						$mdDialog.hide();
					};
				},
				controllerAs: 'TEmodal',
				templateUrl: 'views/updatetask.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		}


	};

	return Tasks;

});
