'user strict';

glance.factory('Tasks', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $stateParams) {

	var ref = new Firebase(FURL);
	var FBtasks = $firebaseArray(ref.child('tasks'));


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

					var mid = $stateParams.mid;

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
						milestonesRef.child(mid).update({
							title: vm.milestone.title,
							description: vm.milestone.description,
							priority: vm.milestone.priority,
							deadline: vm.milestone.deadline
						});

						var project = $firebaseObject(milestonesRef.child(mid).child("projectID"));

						var pid = null;

						project.$loaded(function(data) {

							var pid = data.$value;

							projectsRef.child(pid).child("milestones").child(mid).update({
								title: vm.milestone.title,
								description: vm.milestone.description,
								priority: vm.milestone.priority,
								deadline: vm.milestone.deadline
							});

						});

						var users = Tasks.updateMilestoneUsers(vm.milestone, mid);
						$mdDialog.hide();


						$mdDialog.hide();
					};

					vm.complete = function() {

						ref.child("users").child(user).child("milestones").child(mid).child("completed").set(true);
						milestonesRef.child(mid).child("usersDone").child(user).set(true);

						//set true in project
						var project = $firebaseObject(milestonesRef.child(mid).child("projectID"));
						var pid = null;
						project.$loaded(function(data) {
							var pid = data.$value;	 
//							projectsRef.child(pid).child("milestonesCompleted").child(mid).set(true);
						});					


						var usersDone = $firebaseArray(ref.child("milestones").child(mid).child("usersDone"));
						console.log(usersDone);

						usersDone.$loaded(function() {
							ref.child("milestones").child(mid).child("completed").set(true);
							angular.forEach(usersDone, function(value, key) {

								if (value.$value == false) {
									ref.child("milestones").child(mid).child("completed").set(false);
								}
							});

						});


						$mdDialog.hide();
					};

				},
				controllerAs: 'MEmodal',
				templateUrl: 'views/updatemilestone.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		},


		updateMilestoneUsers: function(m, mid){

			var milestoneMembersRef =  $firebaseArray(milestonesRef.child(mid).child('members'));

			console.log(m);

			milestone = {
				milestoneID: m.$id,
				title: m.title,
				description: m.description,
				image: m.image,
				completed: m.completed,
				priority: m.priority,
				deadline: m.deadline
			};

			console.log(milestone);

			milestoneMembers = [];

			milestoneMembersRef.$loaded(function() {
				angular.forEach(milestoneMembersRef, function(value, key) {
					
					ref.child("users").child(value.uid).child("milestones").child(mid).set(milestone);

					milestoneMembers.push(value.uid);

				});
				console.log(milestoneMembers);
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
			milestone.image = m.image;
			milestone.completed = m.completed;
			milestone.priority = m.priority;
			milestone.deadline = m.deadline;
			

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

					vm.add = function(task) {

						var mid = $stateParams.mid;

						task.creator = Auth.user.uid;
						task.admin = Auth.user.uid;
						//milestone.users = [1,2,3];
						task.startDate = Firebase.ServerValue.TIMESTAMP;
						task.completed = false;
						task.milestoneID = mid;

						var date = new Date();

						task.deadline = date.getTime() + 604800000;	

						var x = Math.floor((Math.random() * 100) + 200);
    					task.image = "https://unsplash.it/"+x;		

						if(task.description == null) {
							task.description = '';
						}	

						if(task.priority == null) {
							task.priority = 0;
						}													

						FBtasks.$add(task)
						.then(function(newTask) {

							var t = {
								taskID: newTask.key(),
								title: task.title,
								description: task.description,
								image: task.image,
								completed: false,
								priority: task.priority,
								deadline: task.deadline
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






















