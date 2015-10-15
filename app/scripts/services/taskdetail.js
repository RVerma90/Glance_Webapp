'user strict';

glance.factory('Task', function(FURL, Auth, $mdDialog, $firebaseAuth, $firebaseObject, $firebaseArray, $stateParams) {

	var ref = new Firebase(FURL);
	var FBtasks = $firebaseArray(ref.child('tasks'));


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
					vm.task = {};
					vm.task = task;

					console.log(task);

					var mid = vm.task.milestoneID;

					var tid = $stateParams.tid;					


					vm.remove = function() {
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

					vm.update = function() {
						//Updates at FB locations with updated task
						ref.child('tasks').child(tid).update({
							title: vm.task.title,
							description: vm.task.description,
							priority: vm.task.priority,
							deadline: vm.task.deadline
						});

						milestonesRef.child(mid).child('tasks').child(tid).update({
							title: vm.task.title,
							description: vm.task.description,
							priority: vm.task.priority
						});					

						var project = $firebaseObject(milestonesRef.child(mid).child("projectID"));

						var pid = null;

						project.$loaded(function(data) {

							var pid = data.$value;

							projectsRef.child(pid).child('tasks').child(tid).update({
								title: vm.task.title,
								description: vm.task.description,
								priority: vm.task.priority,
								deadline: vm.task.deadline								
							});
								
						});

						var users = Task.updateTaskUsers(vm.task, tid);
						$mdDialog.hide();



						console.log("Updated to: " + task.title + task.description);

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
							//milestonesRef.child(mid).child('tasksDone').child(tid).set(true);
							angular.forEach(usersDone, function(value, key) {
								
								if (value.$value == false) {
									ref.child("tasks").child(tid).child("completed").set(false);
									//milestonesRef.child(mid).child('tasksDone').child(tid).set(false);
								}
							});
						});

						$mdDialog.hide();
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
				image: t.image,
				completed: t.completed,
				priority: t.priority,
				deadline: t.deadline
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






















