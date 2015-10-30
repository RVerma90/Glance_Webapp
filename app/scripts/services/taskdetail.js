'user strict';

glance.factory('Task', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $state, $stateParams) {

	var ref = new Firebase(FURL);
	var FBtasks = $firebaseArray(ref.child('tasks'));


	var usersRef = ref.child('users');
	var projectsRef = ref.child('projects');
	var milestonesRef = ref.child('milestones');
	var tasksRef = ref.child('tasks');
	
	var user = ref.getAuth().uid;
	var auth = $firebaseAuth(ref);

	var Task = {
	
		update: function(e, task) {
			return $mdDialog.show({
				clickOutsideToClose: true,
				controller: function($mdDialog) {
					var vm = this;
					vm.task = task;

					//get PID form task.projectID
					var pid = vm.task.projectID;
					//get MID from task.milestoneID
					var mid = vm.task.milestoneID;
					//get TID from stateParams
					var tid = $stateParams.tid;	

					vm.minDate = new Date();
					vm.maxDate = new Date(vm.task.milestoneDeadline);

					vm.task.deadline = new Date(vm.task.deadline);

					vm.update = function() {
						var date = new Date(vm.task.deadline);
						vm.task.deadline = date.getTime();

						//Updates at FB locations with updated task
						tasksRef.child(tid).update({
							title: vm.task.title,
							description: vm.task.description,
							priority: vm.task.priority,
							deadline: vm.task.deadline
						});

						milestonesRef.child(mid).child('tasks').child(tid).update({
							title: vm.task.title,
							description: vm.task.description,
							priority: vm.task.priority,
							deadline: vm.task.deadline
						});					

						projectsRef.child(pid).child("tasks").child(tid).update({
							title: vm.task.title,
							description: vm.task.description,
							priority: vm.task.priority,
							deadline: vm.task.deadline
						});

						Task.updateTaskUsers(vm.task, tid);

						$mdDialog.hide();
					};

					vm.complete = function() {
						//complete at user ref and task in milestone

						usersRef.child(user).child("tasks").child(tid).child("completed").set(true);
						tasksRef.child(tid).child("usersDone").child(user).set(true);

						var usersDone = $firebaseArray(tasksRef.child(tid).child("usersDone"));
						console.log(usersDone);

						usersDone.$loaded(function() {
							tasksRef.child(tid).child("completed").set(true);
							milestonesRef.child(mid).child("tasks").child(tid).child("completed").set(true);
							projectsRef.child(pid).child("tasks").child(tid).child("completed").set(true);
							angular.forEach(usersDone, function(value, key) {
								
								if (value.$value == false) {
									tasksRef.child(tid).child("completed").set(false);
									milestonesRef.child(mid).child("tasks").child(tid).child("completed").set(false);
									projectsRef.child(pid).child("tasks").child(tid).child("completed").set(false);
								}
							});
						});

						$mdDialog.hide();
					};		

					vm.remove = function() {

						ref.child("tasks").child(tid).child("usersDone").child(user).remove();
						ref.child("tasks").child(tid).child("members").child(user).remove();
						ref.child("users").child(user).child("tasks").child(tid).remove();

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
						$mdDialog.hide();

						$state.transitionTo("tasks", {mid: mid});

					};
				},
				controllerAs: 'TEmodal',
				templateUrl: 'views/updatetask.html',
				parent: angular.element(document.body),
				targetEvent: e
			});

		},


		updateTaskUsers: function(t, tid){

			var taskMembersRef =  $firebaseArray(tasksRef.child(tid).child('members'));

			console.log(t);

			task = {
				taskID: t.$id,
				title: t.title,
				description: t.description,
				milestoneID: t.milestoneID,
				projectID: t.projectID,
				image: t.image,
				completed: t.completed,
				priority: t.priority,
				deadline: t.deadline,
				milestoneDeadline: t.milestoneDeadline
			};

			console.log(task);

			taskMembers = [];

			taskMembersRef.$loaded(function() {
				angular.forEach(taskMembersRef, function(value, key) {
					
					ref.child("users").child(value.uid).child("tasks").child(tid).set(task);

					taskMembers.push(value.uid);

				});
				console.log(taskMembers);
			});

			return taskMembers;

		},		

		removeTask: function(tid, mid, pid) {

			return function () {

				tasksRef.child(tid).child("usersDone").child(user).remove();
				tasksRef.child(tid).child("members").child(user).remove();
				tasksRef.child(user).child("tasks").child(tid).remove();

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

			};



		},

		task: function(task) {
			
			return $firebaseObject(tasksRef.child(task));

		},

		inviteTaskMember: function(t, member) {
			var newMember = {};

			newMember.email = member.email;
			newMember.uid = member.uid;
			newMember.firstName = member.firstName;
			newMember.lastName = member.lastName;
			newMember.profileImage = member.profileImage;

			var task = {};


			task.taskID = t.$id;
			task.title = t.title;
			task.description = t.description;
			task.milestoneID = t.milestoneID;
			task.projectID = t.projectID;
			task.image = t.image;
			task.completed = t.completed;
			task.priority = t.priority;
			task.deadline = t.deadline;

			tasksRef.child(t.$id).child('members').child(member.uid).set(newMember);
			tasksRef.child(t.$id).child('usersDone').child(member.uid).set(false);
			//tasksRef.child(t.$id).child('admins').child(member.uid).set(false);

			ref.child("users").child(member.uid).child("tasks").child(t.$id).set(task);


		},

		taskMembers: function(task) {

			return $firebaseObject(tasksRef.child(task).child('members'));	

		}



	};

	return Task;

});






















